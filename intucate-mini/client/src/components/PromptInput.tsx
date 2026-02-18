'use client';
import { useState } from 'react';

export default function PromptInput() {
  const [prompt, setPrompt] = useState(localStorage.getItem('diagnosticPrompt') || '');

  const savePrompt = () => {
    localStorage.setItem('diagnosticPrompt', prompt);
    alert('Prompt saved');
  };

  return (
    <div className="space-y-2">
      <h2>Paste Diagnostic Agent Prompt</h2>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="border p-2 w-full h-32"
      />
      <button onClick={savePrompt} className="bg-green-500 text-white p-2">Save Prompt</button>
    </div>
  );
}