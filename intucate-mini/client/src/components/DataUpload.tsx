'use client';
import { useState } from 'react';
import Papa from 'papaparse';
import { inputSchema } from '@/lib/schemas';

interface Props {
  onCompute: (data: any) => void;
}

export default function DataUpload({ onCompute }: Props) {
  const [dataInput, setDataInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const processData = async () => {
    setLoading(true);
    try {
      let rawData: any;
      if (file) {
        const ext = file.name.split('.').pop();
        if (ext === 'csv') {
          rawData = await new Promise((resolve) => {
            Papa.parse(file, { complete: (res) => resolve(res.data) });
          });
          // Convert CSV to JSON; assume first row headers
          rawData = rawData.slice(1).map((row: any) => ({
            topic: row[0], concept: row[1], // Map based on schema
            // ... map all fields
          }));
        } else if (ext === 'json') {
          rawData = JSON.parse(await file.text());
        }
      } else if (dataInput) {
        rawData = JSON.parse(dataInput);
      }

      const validated = inputSchema.safeParse(rawData);
      if (!validated.success) {
        alert('Invalid data');
        return;
      }

      // Call Express server
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const response = await fetch(`${apiUrl}/compute-sqi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated.data),
      });

      if (!response.ok) throw new Error('Server error');
      
      const sqiResult = await response.json();
      onCompute(sqiResult);
    } catch (error) {
      alert('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <h2>Upload Data (CSV/JSON) or Paste JSON</h2>
      <input type="file" onChange={handleFileChange} />
      <textarea
        value={dataInput}
        onChange={(e) => setDataInput(e.target.value)}
        placeholder="Paste JSON here"
        className="border p-2 w-full h-32"
      />
      <button 
        onClick={processData} 
        disabled={loading}
        className="bg-blue-500 text-white p-2 disabled:bg-gray-400"
      >
        {loading ? 'Computing...' : 'Compute SQI'}
      </button>
    </div>
  );
}