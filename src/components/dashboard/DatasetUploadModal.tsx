// src/components/dashboard/DatasetUploadModal.tsx
import React from 'react';
import DatasetUpload from '../datasets/DatasetUpload';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DatasetUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDatasetUploaded: (datasetName: string) => void;
}

const DatasetUploadModal = ({ isOpen, onClose, onDatasetUploaded }: DatasetUploadModalProps) => {
  if (!isOpen) return null;

  const handleUploadSuccess = (datasetName: string) => {
    onDatasetUploaded(datasetName);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-card border border-border/50 p-8 rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Upload New Dataset</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="hover:bg-destructive/20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="mb-4 p-4 bg-background/50 rounded border border-border/30">
          <p className="text-sm text-muted-foreground">
            Upload a CSV file to use as a data source for your dashboard. 
            The dataset will be processed and made available for creating charts and visualizations.
          </p>
        </div>
        
        <DatasetUpload onUploadSuccess={handleUploadSuccess} />
      </div>
    </div>
  );
};

export default DatasetUploadModal;