import React, { useCallback, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useAuth } from '../auth/AuthContext';
import { supabase } from '../../services/supabaseClient';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  BarChart3,
  PieChart,
  LineChart,
  Database,
  Plus,
  Save,
  Share2,
  Play,
  FileText,
  RefreshCw
} from 'lucide-react';

import DatasetUploadModal from './DatasetUploadModal';
import PreviewDashboard from './PreviewDashboard';
import ChartNode from './nodes/ChartNode';
import DataNode from './nodes/DataNode';
import FilterNode from './nodes/FilterNode';

const nodeTypes = {
  chart: ChartNode,
  data: DataNode,
  filter: FilterNode,
};

interface Dataset {
  id: string;
  name: string;
  description: string;
  file_size: number;
  created_at: string;
  file_url: string;
}

const DashboardBuilder = ({ dashboard, onSave }: { dashboard: any, onSave: (nodes: Node[], edges: Edge[]) => void }) => {
  const { session } = useAuth();
  const [nodes, setNodes, onNodesChange] = useNodesState(dashboard?.config?.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(dashboard?.config?.edges || []);
  const [isPlaying, setIsPlaying] = useState(false);
  const [previewData, setPreviewData] = useState<{[key: string]: any[]}>({});
  const [isDatasetModalOpen, setIsDatasetModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loadingDatasets, setLoadingDatasets] = useState(true);

  useEffect(() => {
    setNodes(dashboard?.config?.nodes || []);
    setEdges(dashboard?.config?.edges || []);
  }, [dashboard]);

  useEffect(() => {
    fetchDatasets();
  }, [session]);

  const fetchDatasets = async () => {
    if (!session) return;
    
    setLoadingDatasets(true);
    try {
      const { data, error } = await supabase.functions.invoke('datasets-api', {
        method: 'GET'
      });
      
      if (error) {
        console.error('Failed to fetch datasets:', error);
      } else {
        setDatasets(data || []);
      }
    } catch (err) {
      console.error('Error fetching datasets:', err);
    } finally {
      setLoadingDatasets(false);
    }
  };

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const togglePreview = async () => {
    if (!isPlaying) {
      await loadPreviewData();
    }
    setIsPlaying(!isPlaying);
  };

  const parseCSV = (csvText: string) => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length === 0) return [];
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"(.*)"$/, '$1'));
    const rows = lines.slice(1).map(line => {
      const values = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim().replace(/^"(.*)"$/, '$1'));
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim().replace(/^"(.*)"$/, '$1'));
      
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      return row;
    });
    
    return rows;
  };

  const loadPreviewData = async () => {
    const dataNodes = nodes.filter(node => node.type === 'data' && node.data.dataset);
    const dataPromises = dataNodes.map(async (node) => {
      try {
        const dataset = node.data.dataset;
        const { data: signedUrlData, error } = await supabase.storage
          .from('datasets')
          .createSignedUrl(dataset.file_url, 60 * 5);
        
        if (error) throw error;
        
        const response = await fetch(signedUrlData.signedUrl);
        const csvText = await response.text();
        const rows = parseCSV(csvText);
        
        return { nodeId: node.id, data: rows.slice(0, 100) };
      } catch (error) {
        console.error(`Failed to load data for node ${node.id}:`, error);
        return { nodeId: node.id, data: [] };
      }
    });
    
    const results = await Promise.all(dataPromises);
    const newPreviewData: {[key: string]: any[]} = {};
    results.forEach(result => {
      newPreviewData[result.nodeId] = result.data;
    });
    setPreviewData(newPreviewData);
  };

  const addChartNode = (chartType: string) => {
    const newNode: Node = {
      id: `chart-${Date.now()}`,
      type: 'chart',
      position: { x: Math.random() * 400 + 200, y: Math.random() * 300 + 100 },
      data: {
        label: `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart`,
        type: chartType,
        config: {},
        dataset: null
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const addDataNode = (dataset: Dataset) => {
    const newNode: Node = {
      id: `data-${Date.now()}`,
      type: 'data',
      position: { x: Math.random() * 400 + 50, y: Math.random() * 300 + 100 },
      data: {
        label: dataset.name,
        dataset: dataset,
        rows: '0',
        columns: []
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const handleDatasetUploaded = (datasetName: string) => {
    setIsDatasetModalOpen(false);
    fetchDatasets();
  };
  
  const handleSave = () => {
    setIsSaving(true);
    onSave(nodes, edges);
    setIsSaving(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isPlaying) {
    return (
      <div className="h-screen flex">
        <PreviewDashboard
          nodes={nodes}
          edges={edges}
          previewData={previewData}
          onClose={() => setIsPlaying(false)}
        />
      </div>
    );
  }

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <motion.div className="w-80 p-4 bg-background/50 border-r border-border/30 overflow-y-auto">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Dashboard Builder</h2>
          
          {/* Data Sources */}
          <Card className="p-4 glass-card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium flex items-center">
                <Database className="w-4 h-4 mr-2 text-accent" />
                Data Sources ({datasets.length})
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchDatasets}
                disabled={loadingDatasets}
              >
                <RefreshCw className={`w-4 h-4 ${loadingDatasets ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            
            {loadingDatasets ? (
              <div className="text-sm text-muted-foreground">Loading datasets...</div>
            ) : datasets.length === 0 ? (
              <div className="text-sm text-muted-foreground mb-3">
                No datasets available. Upload one to get started.
              </div>
            ) : (
              <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                {datasets.map((dataset) => (
                  <div
                    key={dataset.id}
                    className="p-2 bg-background/50 rounded border border-border/30 hover:border-accent/50 transition-colors cursor-pointer"
                    onClick={() => addDataNode(dataset)}
                    title={`Click to add ${dataset.name} as a data source`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center min-w-0 flex-1">
                        <FileText className="w-3 h-3 mr-2 text-accent flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium truncate">
                            {dataset.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatFileSize(dataset.file_size)} • {formatDate(dataset.created_at)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <Button
              variant="dashboard"
              size="sm"
              className="w-full"
              onClick={() => setIsDatasetModalOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Upload Dataset
            </Button>
          </Card>

          {/* Chart Types */}
          <Card className="p-4 glass-card">
            <h3 className="font-medium mb-3 flex items-center">
              <BarChart3 className="w-4 h-4 mr-2 text-accent" />
              Visualizations
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="dashboard"
                size="sm"
                onClick={() => addChartNode('bar')}
                title="Add Bar Chart"
              >
                <BarChart3 className="w-4 h-4" />
              </Button>
              <Button
                variant="dashboard"
                size="sm"
                onClick={() => addChartNode('line')}
                title="Add Line Chart"
              >
                <LineChart className="w-4 h-4" />
              </Button>
              <Button
                variant="dashboard"
                size="sm"
                onClick={() => addChartNode('pie')}
                title="Add Pie Chart"
              >
                <PieChart className="w-4 h-4" />
              </Button>
            </div>
          </Card>

          {/* Actions */}
          <Card className="p-4 glass-card">
            <h3 className="font-medium mb-3">Actions</h3>
            <div className="space-y-2">
              <Button
                variant={isPlaying ? "accent" : "dashboard"}
                size="sm"
                className="w-full"
                onClick={togglePreview}
              >
                <Play className="w-4 h-4 mr-2" />
                {isPlaying ? 'Stop Preview' : 'Preview'}
              </Button>
              <Button
                variant="dashboard"
                size="sm"
                className="w-full"
                onClick={handleSave}
                disabled={isSaving}
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Dashboard'}
              </Button>
              <Button variant="dashboard" size="sm" className="w-full">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </Card>

          {/* Current Canvas Info */}
          <Card className="p-4 glass-card">
            <h3 className="font-medium mb-2">Canvas Info</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <div>Nodes: {nodes.length}</div>
              <div>Connections: {edges.length}</div>
              <div>Data Sources: {nodes.filter(n => n.type === 'data').length}</div>
              <div>Charts: {nodes.filter(n => n.type === 'chart').length}</div>
            </div>
          </Card>
        </div>
      </motion.div>

      {/* Canvas */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          className="bg-gradient-hero"
          fitView
        >
          <Background gap={20} size={1} color="hsl(240 6% 20%)" />
          <Controls className="bg-gradient-card border border-border/50" />
          <MiniMap
            className="bg-gradient-card border border-border/50 rounded-lg"
            nodeColor="hsl(187 100% 42%)"
            maskColor="rgba(0, 0, 0, 0.3)"
          />
        </ReactFlow>
      </div>

      <DatasetUploadModal
        isOpen={isDatasetModalOpen}
        onClose={() => setIsDatasetModalOpen(false)}
        onDatasetUploaded={handleDatasetUploaded}
      />
    </div>
  );
};

export default DashboardBuilder;