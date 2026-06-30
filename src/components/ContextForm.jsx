import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { X, ChevronDown } from 'lucide-react';
import { CURRENCIES } from '../data/currencies';

export default function ContextForm({ context, onContextChange }) {
  const [integrationInput, setIntegrationInput] = useState('');
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCurrencyDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUpdate = (updates) => {
    onContextChange({ ...context, ...updates });
  };

  const handleIntegrationKeyDown = (e) => {
    if (e.key === 'Enter' && integrationInput.trim()) {
      e.preventDefault();
      if (!context.integrations.includes(integrationInput.trim())) {
        handleUpdate({ integrations: [...context.integrations, integrationInput.trim()] });
      }
      setIntegrationInput('');
    }
  };

  const removeIntegration = (itemToRemove) => {
    handleUpdate({ integrations: context.integrations.filter(i => i !== itemToRemove) });
  };

  const toggleCurrency = (currencyCode) => {
    const current = context.currencies || [];
    if (current.includes(currencyCode)) {
      handleUpdate({ currencies: current.filter(c => c !== currencyCode) });
    } else {
      handleUpdate({ currencies: [...current, currencyCode] });
    }
  };

  return (
    <div className="card p-4 flex flex-col gap-5 overflow-y-auto">
      <h2 className="text-lg font-semibold">Implementation Context</h2>

      {/* Legal Entities */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Legal Entity Count</label>
        <p className="text-xs text-gray-500 mb-1">Number of companies operating this process</p>
        <input 
          type="number" 
          min="1" max="50"
          className="input-field"
          value={context.legalEntityCount}
          onChange={(e) => handleUpdate({ legalEntityCount: parseInt(e.target.value) || 1 })}
        />
      </div>

      {/* Customisations */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium">Customisations</label>
            <p className="text-xs text-gray-500">Does this process include bespoke code?</p>
          </div>
          <button 
            className={`toggle ${context.hasCustomisations ? 'active' : ''}`}
            onClick={() => handleUpdate({ hasCustomisations: !context.hasCustomisations })}
            aria-label="Toggle Customisations"
          />
        </div>
        
        {context.hasCustomisations && (
          <div className="animate-slide-down mt-2">
            <textarea
              className="input-field min-h-[80px]"
              placeholder="Briefly describe the customisations (e.g., custom approval workflow, added validation fields)..."
              value={context.customisationDetails}
              onChange={(e) => handleUpdate({ customisationDetails: e.target.value })}
            />
          </div>
        )}
      </div>

      {/* Integrations */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Integration Touchpoints</label>
        <p className="text-xs text-gray-500 mb-1">Type and press Enter (e.g., OANDA, HRIS, EDI)</p>
        <div className="flex flex-wrap gap-2 mb-2">
          {context.integrations.map(integration => (
            <span key={integration} className="badge badge-blue flex items-center gap-1 pl-2 pr-1 py-1">
              {integration}
              <button onClick={() => removeIntegration(integration)} className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5">
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
        <input 
          type="text" 
          className="input-field"
          placeholder="Add integration..."
          value={integrationInput}
          onChange={(e) => setIntegrationInput(e.target.value)}
          onKeyDown={handleIntegrationKeyDown}
        />
      </div>

      {/* Currencies */}
      <div className="flex flex-col gap-1 relative" ref={dropdownRef}>
        <label className="text-sm font-medium">Currencies</label>
        <p className="text-xs text-gray-500 mb-1">Select currencies used in this process</p>
        
        <div 
          className="input-field cursor-pointer flex justify-between items-center"
          onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
        >
          <span className="text-sm truncate max-w-[200px]">
            {context.currencies.length > 0 ? context.currencies.join(', ') : 'Select currencies...'}
          </span>
          <ChevronDown size={16} className="text-gray-400" />
        </div>

        {isCurrencyDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto p-2">
            {CURRENCIES.map(currency => (
              <label key={currency.code} className="flex items-center gap-2 p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={context.currencies.includes(currency.code)}
                  onChange={() => toggleCurrency(currency.code)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm font-medium w-10">{currency.code}</span>
                <span className="text-xs text-gray-500">{currency.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Multi-country Rollout */}
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium">Multi-country Rollout</label>
          <p className="text-xs text-gray-500">Will this affect multiple localizations?</p>
        </div>
        <button 
          className={`toggle ${context.multiCountryRollout ? 'active' : ''}`}
          onClick={() => handleUpdate({ multiCountryRollout: !context.multiCountryRollout })}
          aria-label="Toggle Multi-country"
        />
      </div>

      {/* Additional Notes */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Additional Notes</label>
        <textarea
          className="input-field min-h-[100px]"
          placeholder="Any other specifics (e.g., approval hierarchies, specific testing data needs)..."
          value={context.additionalNotes}
          onChange={(e) => handleUpdate({ additionalNotes: e.target.value })}
        />
      </div>

    </div>
  );
}

ContextForm.propTypes = {
  context: PropTypes.shape({
    legalEntityCount: PropTypes.number,
    hasCustomisations: PropTypes.bool,
    customisationDetails: PropTypes.string,
    integrations: PropTypes.array,
    currencies: PropTypes.array,
    multiCountryRollout: PropTypes.bool,
    additionalNotes: PropTypes.string
  }).isRequired,
  onContextChange: PropTypes.func.isRequired,
};
