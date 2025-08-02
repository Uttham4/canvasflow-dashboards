import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import DatasetUpload from '../datasets/DatasetUpload';

const DatasetManager = () => {
    const [datasets, setDatasets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isUploadMode, setIsUploadMode] = useState(false);

    const fetchDatasets = async () => {
        setLoading(true);
        const { data, error } = await supabase.functions.invoke('datasets-api', {
            method: 'GET'
        });
        if (error) {
            console.error('Failed to fetch datasets:', error);
        } else {
            setDatasets(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchDatasets();
    }, []);

    if (isUploadMode) {
        return (
            <div className="space-y-4">
                <button
                    onClick={() => setIsUploadMode(false)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors duration-200"
                >
                    &larr; Back to Datasets
                </button>
                <h3 className="text-xl font-bold text-white">Upload New Dataset</h3>
                <DatasetUpload onUploadSuccess={fetchDatasets} />
            </div>
        );
    }

    if (loading) return <p className="text-gray-400">Loading datasets...</p>;

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Your Datasets</h3>
            {datasets.length === 0 ? (
                <p className="text-gray-400">You haven't uploaded any datasets yet.</p>
            ) : (
                <ul className="space-y-2">
                    {datasets.map(d => (
                        <li key={d.id} className="bg-gray-700 p-3 rounded-lg text-sm text-gray-200">
                            {d.name}
                        </li>
                    ))}
                </ul>
            )}
            <button
                onClick={() => setIsUploadMode(true)}
                className="mt-4 w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200"
            >
                Upload New Data
            </button>
        </div>
    );
};

export default DatasetManager;