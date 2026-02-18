'use client';
import { useState } from 'react';

interface Props {
  data: any; // Use output type
}

export default function SqiResults({ data }: Props) {
  const jsonString = JSON.stringify(data, null, 2);

  const copyJson = () => {
    navigator.clipboard.writeText(jsonString);
    alert('Copied');
  };

  const downloadJson = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'summary_customizer_input.json';
    a.click();
  };

  return (
    <div className="space-y-4">
      <h2>SQI Results</h2>
      <p>Overall SQI: {data.overall_sqi.toFixed(1)}</p>
      <h3>Topic SQIs</h3>
      <ul>{data.topic_scores.map((t: any) => <li key={t.topic}>{t.topic}: {t.sqi.toFixed(1)}</li>)}</ul>
      <h3>Concept SQIs</h3>
      <ul>{data.concept_scores.map((c: any) => <li key={`${c.topic}-${c.concept}`}>{c.topic} - {c.concept}: {c.sqi.toFixed(1)}</li>)}</ul>
      <h3>Ranked Concepts</h3>
      <ul>
        {data.ranked_concepts_for_summary.map((r: any) => (
          <li key={`${r.topic}-${r.concept}`}>
            {r.topic} - {r.concept}: Weight {r.weight.toFixed(2)} (Why: {r.reason})
          </li>
        ))}
      </ul>
      <pre className="bg-gray-100 p-2 overflow-auto">{jsonString}</pre>
      <button onClick={copyJson} className="bg-yellow-500 text-white p-2">Copy JSON</button>
      <button onClick={downloadJson} className="bg-green-500 text-white p-2">Download JSON</button>
    </div>
  );
}