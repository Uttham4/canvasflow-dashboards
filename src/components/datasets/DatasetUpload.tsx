// src/components/datasets/DatasetUpload.tsx

import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { supabase } from '../../services/supabaseClient';
import { AsyncDuckDB, selectBundle } from '@duckdb/duckdb-wasm';

const DatasetUpload = () => {
  const { session } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [ingestedData, setIngestedData] = useState<any[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadAndIngest = async () => {
    if (!file || !session) return;
    setLoading(true);

    const filePath = `${session.user?.id}/${file.name}`;
    let fileUrl = '';

    try {
      // 1. Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('datasets')
        .upload(filePath, file, {
          upsert: true,
        });

      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

      // 2. Get a signed URL for temporary access
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from('datasets')
        .createSignedUrl(filePath, 60 * 5); // 5 min expiry

      if (signedUrlError) throw new Error(`Failed to get signed URL: ${signedUrlError.message}`);

      fileUrl = signedUrlData.signedUrl;

      // 3. Setup DuckDB WASM
      const bundle = await selectBundle({
        mvp: {
          mainModule: '/duckdb/duckdb-mvp.wasm',
          mainWorker: '/duckdb/duckdb-browser-mvp.worker.js',
        },
      });

      const worker = new Worker(bundle.mainWorker);
      const db = new AsyncDuckDB(new duckdb.ConsoleLogger(), worker);
      await db.instantiate(bundle.mainModule);
      const conn = await db.connect();

      // 4. Create a record in the 'datasets' table
      const { data: datasetRecord, error: dbError } = await supabase
        .from('datasets')
        .insert({
          user_id: session.user.id,
          name: file.name,
          description: '', // You could add a form field for this
          file_url: filePath, // Storing the internal path, not the signed URL
          file_size: file.size,
          // You can add logic for schema inference here
        })
        .select()
        .single();

      if (dbError) throw new Error(`Database record creation failed: ${dbError.message}`);

      console.log('Dataset record created:', datasetRecord);

      // 5. Load CSV into DuckDB from the signed URL
      await conn.query(`
        CREATE TABLE uploaded AS 
        SELECT * FROM read_csv_auto('${fileUrl}');
      `);

      const result = await conn.query('SELECT * FROM uploaded LIMIT 10');
      setIngestedData(result.toArray());
      console.log('Preview Data:', result.toArray());

    } catch (err: any) {
      console.error('Processing error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <input type="file" onChange={handleFileUpload} />
      <button
        onClick={handleUploadAndIngest}
        disabled={!file || loading}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
      >
        {loading ? 'Processing...' : 'Upload & Ingest'}
      </button>

      {ingestedData.length > 0 && (
        <div className="mt-4 p-4 border rounded">
          <h3 className="font-bold">Data Preview:</h3>
          <pre className="text-sm overflow-x-auto">
            {JSON.stringify(ingestedData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default DatasetUpload;