import { buildKnowledgeContext } from './processKnowledge';
import { parse as partialParse } from 'partial-json';

export async function generateTestCases(processInfo, context, documentText, apiKey, onProgress) {
  if (!apiKey) {
    throw new Error('API key is required.');
  }

  const systemInstruction = `You are a D365FO (Dynamics 365 Finance & Operations) test case expert with 20+ years of ERP implementation experience.
Generate comprehensive, professional test cases for D365 Finance & Operations processes.
Include: happy path, negative cases, boundary values, multi-currency variants, intercompany scenarios where applicable.
Each test case must have realistic test data, precise D365FO navigation paths (e.g., "Accounts Payable > Invoices > Vendor invoice"), and specific expected results referencing GL accounts, voucher numbers, and status changes.
Generate 5-8 test cases per request.
Ensure test IDs follow the pattern: MODULE_PROCESS_NNN (e.g., AP_VI_001).
Priority levels: "P1 - Critical path", "P2 - High", "P3 - Edge case".
Estimated effort should be realistic (e.g., "10 minutes", "15 minutes", "20 minutes").
OUTPUT STRICT JSON matching this structure:
{
  "testCases": [
    {
      "testID": "string",
      "processName": "string",
      "processModule": "string",
      "preconditions": ["string"],
      "testData": { "key": "value" },
      "executionSteps": [
        { "stepNumber": 1, "action": "string", "expectedResult": "string" }
      ],
      "edgeCases": [
        { "scenario": "string", "action": "string", "expectedResult": "string" }
      ],
      "priority": "string",
      "estimatedEffort": "string",
      "notes": "string"
    }
  ]
}`;

  const processKnowledge = buildKnowledgeContext(processInfo.id, processInfo);

  let userMessage = `Process Name: ${processInfo.name}
Module: ${processInfo.module}
`;

  if (documentText) {
    userMessage += `
Please analyze the following Functional Design Document (FDD) text and generate the test cases based on its requirements:

--- FDD TEXT START ---
${documentText}
--- FDD TEXT END ---
`;
  } else if (context) {
    userMessage += `
Context:
- Legal Entities: ${context.legalEntityCount}
- Customisations: ${context.hasCustomisations ? 'Yes' : 'No'}
${context.hasCustomisations && context.customisationDetails ? `- Customisation Details: ${context.customisationDetails}` : ''}
- Integrations: ${context.integrations && context.integrations.length > 0 ? context.integrations.join(', ') : 'None'}
- Currencies: ${context.currencies && context.currencies.length > 0 ? context.currencies.join(', ') : 'None'}
- Multi-country Rollout: ${context.multiCountryRollout ? 'Yes' : 'No'}
${context.additionalNotes ? `- Additional Notes: ${context.additionalNotes}` : ''}
`;
  }

  userMessage += `\n${processKnowledge}`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: userMessage }
        ],
        response_format: { type: "json_object" },
        stream: true
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Groq API Error (${response.status}): ${errorData.error?.message || response.statusText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let accumulatedText = "";
    let sseBuffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      sseBuffer += decoder.decode(value, { stream: true });
      const lines = sseBuffer.split('\n');
      
      // Keep the last partial line in the buffer
      sseBuffer = lines.pop() || "";

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('data: ') && trimmedLine !== 'data: [DONE]') {
          try {
            const data = JSON.parse(trimmedLine.slice(6));
            if (data.choices?.[0]?.delta?.content) {
              accumulatedText += data.choices[0].delta.content;
              
              if (onProgress) {
                const progressSnippet = accumulatedText.slice(-200).replace(/\n/g, ' ');
                onProgress(`Receiving: ...${progressSnippet}`);
              }
            }
          } catch (e) {
            // Ignore parse errors on incomplete lines, though sseBuffer should fix this
            console.warn("Parse error on line:", trimmedLine, e);
          }
        }
      }
    }
    
    if (!accumulatedText.trim()) {
      throw new Error("No test cases were generated. The response was empty.");
    }

    const resultObj = partialParse(accumulatedText);
    return resultObj?.testCases || [];

  } catch (error) {
    console.error("Streaming generation failed", error);
    throw error;
  }
}
