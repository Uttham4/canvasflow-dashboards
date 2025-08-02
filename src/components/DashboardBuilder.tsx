import { useCallback, useState } from "react";
import { motion } from "framer-motion";
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

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  BarChart3, 
  PieChart, 
  LineChart, 
  Database,
  Filter,
  Plus,
  Save,
  Share2,
  Play
} from "lucide-react";

// Custom Node Types
import ChartNode from "./nodes/ChartNode";
import DataNode from "./nodes/DataNode";
import FilterNode from "./nodes/FilterNode";

const nodeTypes = {
  chart: ChartNode,
  data: DataNode,
  filter: FilterNode,
};

const initialNodes: Node[] = [
  {
    id: 'data-1',
    type: 'data',
    position: { x: 100, y: 50 },
    data: { 
      label: 'Sales Dataset',
      rows: '1.2M',
      columns: ['Date', 'Product', 'Sales', 'Region']
    },
  },
  {
    id: 'chart-1',
    type: 'chart',
    position: { x: 400, y: 50 },
    data: { 
      label: 'Sales Trend',
      type: 'line',
      config: { x: 'Date', y: 'Sales' }
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: 'data-1',
    target: 'chart-1',
    animated: true,
    style: { stroke: 'hsl(187 100% 42%)', strokeWidth: 2 },
  },
];

const DashboardBuilder = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isPlaying, setIsPlaying] = useState(false);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addChartNode = (chartType: string) => {
    const newNode: Node = {
      id: `chart-${Date.now()}`,
      type: 'chart',
      position: { x: Math.random() * 400 + 200, y: Math.random() * 300 + 100 },
      data: { 
        label: `${chartType} Chart`,
        type: chartType,
        config: {}
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const addDataNode = () => {
    const newNode: Node = {
      id: `data-${Date.now()}`,
      type: 'data',
      position: { x: Math.random() * 400 + 50, y: Math.random() * 300 + 100 },
      data: { 
        label: 'New Dataset',
        rows: '0',
        columns: []
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <motion.div 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="w-80 bg-gradient-card border-r border-border/50 p-6 space-y-6 overflow-y-auto"
      >
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Dashboard Builder</h2>
          
          {/* Data Sources */}
          <Card className="p-4 glass-card">
            <h3 className="font-medium mb-3 flex items-center">
              <Database className="w-4 h-4 mr-2 text-accent" />
              Data Sources
            </h3>
            <Button 
              variant="dashboard" 
              size="sm" 
              className="w-full"
              onClick={addDataNode}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Dataset
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
              >
                <BarChart3 className="w-4 h-4" />
              </Button>
              <Button 
                variant="dashboard" 
                size="sm"
                onClick={() => addChartNode('line')}
              >
                <LineChart className="w-4 h-4" />
              </Button>
              <Button 
                variant="dashboard" 
                size="sm"
                onClick={() => addChartNode('pie')}
              >
                <PieChart className="w-4 h-4" />
              </Button>
              <Button 
                variant="dashboard" 
                size="sm"
                onClick={() => addChartNode('area')}
              >
                <Filter className="w-4 h-4" />
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
                onClick={() => setIsPlaying(!isPlaying)}
              >
                <Play className="w-4 h-4 mr-2" />
                {isPlaying ? 'Stop Preview' : 'Preview'}
              </Button>
              <Button variant="dashboard" size="sm" className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Dashboard
              </Button>
              <Button variant="dashboard" size="sm" className="w-full">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
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
    </div>
  );
};

export default DashboardBuilder;