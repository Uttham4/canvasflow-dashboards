// src/pages/Datasets.tsx
import React from 'react';
import Header from '../components/common/Header';
import DatasetUpload from '../components/datasets/DatasetUpload';

const Datasets = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <div className="container mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold mb-8">Manage Datasets</h1>
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700">
          <h2 className="text-2xl font-bold mb-4">Upload New Dataset</h2>
          <DatasetUpload />
        </div>
      </div>
    </div>
  );
};

export default Datasets;