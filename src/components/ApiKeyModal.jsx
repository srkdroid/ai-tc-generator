import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Eye, EyeOff, Trash2, Shield, ChevronDown, ChevronRight, X, Key } from 'lucide-react';

export function getApiKey() {
  const encoded = localStorage.getItem('groq_api_key') || sessionStorage.getItem('groq_api_key');
  if (!encoded) return null;
  try {
    return atob(encoded);
  } catch (e) {
    return null;
  }
}

export default function ApiKeyModal({ isOpen, onClose }) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [storageMode, setStorageMode] = useState('session');
  const [isSecurityExpanded, setIsSecurityExpanded] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  const isSecureContext = window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  useEffect(() => {
    if (isOpen) {
      const storedKey = getApiKey();
      if (storedKey) {
        setApiKey(storedKey);
        setHasKey(true);
        if (localStorage.getItem('groq_api_key')) {
          setStorageMode('local');
        } else {
          setStorageMode('session');
        }
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!apiKey.trim()) return;
    const encoded = btoa(apiKey.trim());
    
    if (storageMode === 'local') {
      localStorage.setItem('groq_api_key', encoded);
      sessionStorage.removeItem('groq_api_key');
    } else {
      sessionStorage.setItem('groq_api_key', encoded);
      localStorage.removeItem('groq_api_key');
    }
    setHasKey(true);
    onClose();
  };

  const handleDelete = () => {
    localStorage.removeItem('groq_api_key');
    sessionStorage.removeItem('groq_api_key');
    setApiKey('');
    setHasKey(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content relative flex flex-col p-6 gap-5">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold flex items-center gap-2">
          <Key className="text-blue-500" size={24} />
          Groq API Key
        </h2>

        {!isSecureContext && (
          <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 p-3 rounded-md text-sm border border-amber-200 dark:border-amber-800">
            <strong>Warning:</strong> You are not using a secure (HTTPS) connection. Entering API keys on non-secure connections is not recommended.
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">API Key</label>
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onCopy={(e) => e.preventDefault()}
              className="input-field pr-10"
              placeholder="AIzaSy..."
            />
            <button 
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              onClick={() => setShowKey(!showKey)}
            >
              {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <p className="text-xs text-gray-500">
            Get your API key from <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Groq Console</a>.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Storage Mode</label>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input 
                type="radio" 
                name="storageMode" 
                value="session"
                checked={storageMode === 'session'}
                onChange={() => setStorageMode('session')}
                className="text-blue-500 focus:ring-blue-500"
              />
              Session only (cleared on tab close)
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input 
                type="radio" 
                name="storageMode" 
                value="local"
                checked={storageMode === 'local'}
                onChange={() => setStorageMode('local')}
                className="text-blue-500 focus:ring-blue-500"
              />
              Remember (localStorage)
            </label>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button 
            onClick={handleSave} 
            disabled={!apiKey.trim()}
            className="btn-primary flex-1"
          >
            Save Key
          </button>
          {hasKey && (
            <button 
              onClick={handleDelete}
              className="btn-outline text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 dark:border-red-900/50"
              title="Delete stored key"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>

        <div className="border-t border-gray-200 dark:border-slate-700 mt-2 pt-4">
          <button 
            className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 w-full text-left"
            onClick={() => setIsSecurityExpanded(!isSecurityExpanded)}
          >
            <Shield size={16} className="text-emerald-500" />
            How is my API key protected?
            <div className="ml-auto">
              {isSecurityExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>
          </button>
          
          <div className={`collapsible-content ${isSecurityExpanded ? 'open' : ''} mt-3`}>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 pl-6 list-none relative">
              <li className="before:content-['✓'] before:absolute before:-left-1 before:text-emerald-500 relative pl-4">
                Key transmitted via encrypted HTTP header, never in URLs
              </li>
              <li className="before:content-['✓'] before:absolute before:-left-1 before:text-emerald-500 relative pl-4">
                Stored with obfuscation in browser storage — never on any server
              </li>
              <li className="before:content-['✓'] before:absolute before:-left-1 before:text-emerald-500 relative pl-4">
                Session-scoped option available (auto-cleared on tab close)
              </li>
              <li className="before:content-['✓'] before:absolute before:-left-1 before:text-emerald-500 relative pl-4">
                Content Security Policy restricts all outbound connections to Groq API only
              </li>
              <li className="before:content-['✓'] before:absolute before:-left-1 before:text-emerald-500 relative pl-4">
                No key logging to console, error tracking, or analytics
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

ApiKeyModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
