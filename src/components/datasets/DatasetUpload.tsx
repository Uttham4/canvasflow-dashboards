// src/components/datasets/DatasetUpload.tsx
import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { supabase } from '../../services/supabaseClient';
import * as duckdb from '@duckdb/duckdb-wasm';

interface DatasetUploadProps {
  onUploadSuccess?: (datasetName: string) => void;
}

const DatasetUpload = ({ onUploadSuccess }: DatasetUploadProps) => {
  const { session } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [ingestedData, setIngestedData] = useState<any[]>([]);
  const [success, setSuccess] = useState(false);

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

      // 3. Setup DuckDB WASM using the correct API
      const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();
      const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);
      
      const worker_url = URL.createObjectURL(
        new Blob([`importScripts("${bundle.mainWorker}");`], {type: 'text/javascript'})
      );
      
      const worker = new Worker(worker_url);
      const logger = new duckdb.ConsoleLogger();
      const db = new duckdb.AsyncDuckDB(logger, worker);
      
      await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
      const conn = await db.connect();

      // 4. Create a record in the 'datasets' table
      const { data: datasetRecord, error: dbError } = await supabase
        .from('datasets')
        .insert({
          user_id: session.user.id,
          name: file.name,
          description: '',
          file_url: filePath,
          file_size: file.size,
        })
        .select()
        .single();

      if (dbError) throw new Error(`Database record creation failed: ${dbError.message}`);
      console.log('Dataset record created:', datasetRecord);

      // 5. Load CSV into DuckDB from the signed URL with error handling
      try {
        await conn.query(`
          CREATE TABLE uploaded AS 
          SELECT * FROM read_csv_auto(
            '${fileUrl}',
            ignore_errors = true,
            sample_size = -1,
            header = true,
            auto_detect = true
          );
        `);
      } catch (csvError) {
        console.warn('Primary CSV load failed, trying with all varchar fallback:', csvError.message);
        // Fallback: load everything as strings to avoid type conversion issues
        await conn.query(`
          CREATE TABLE uploaded AS 
          SELECT * FROM read_csv_auto(
            '${fileUrl}',
            ignore_errors = true,
            all_varchar = true,
            header = true
          );
        `);
      }

      // Get basic info about the loaded data
      const countResult = await conn.query('SELECT COUNT(*) as total_rows FROM uploaded');
      const totalRows = countResult.toArray()[0].total_rows;
      
      const result = await conn.query('SELECT * FROM uploaded LIMIT 10');
      const previewData = result.toArray();
      
      console.log(`Successfully loaded ${totalRows} rows (some problematic rows may have been skipped)`);
      setIngestedData(previewData);
      setIngestedData(result.toArray());
      console.log('Preview Data:', result.toArray());

      // Clean up
      await conn.close();
      await db.terminate();
      worker.terminate();
      URL.revokeObjectURL(worker_url);

    } catch (err: any) {
      console.error('Processing error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      {success && (
        <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
          <p className="text-green-400 font-medium">✓ Dataset uploaded and processed successfully!</p>
        </div>
      )}
      
      <div className="space-y-2">
        <label className="block text-sm font-medium">Select CSV File</label>
        <input 
          type="file" 
          accept=".csv"
          onChange={handleFileUpload}
          className="w-full p-2 border border-border/50 rounded bg-background/50 text-sm"
        />
      </div>
      
      <button
        onClick={handleUploadAndIngest}
        disabled={!file || loading}
        className="w-full px-4 py-2 bg-accent hover:bg-accent/80 disabled:bg-muted disabled:text-muted-foreground text-accent-foreground rounded transition-colors"
      >
        {loading ? 'Processing...' : 'Upload & Process Dataset'}
      </button>

      {ingestedData.length > 0 && (
        <div className="mt-4 p-4 border border-border/50 rounded bg-background/30">
          <h3 className="font-bold mb-2">Data Preview (First 10 rows):</h3>
          <div className="overflow-x-auto">
            <pre className="text-xs bg-background/50 p-2 rounded border">
              {JSON.stringify(ingestedData, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatasetUpload;