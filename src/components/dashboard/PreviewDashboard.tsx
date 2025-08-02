// src/components/dashboard/PreviewDashboard.tsx
import React from 'react';
import { Node, Edge } from '@xyflow/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon } from 'lucide-react';

interface PreviewDashboardProps {
  nodes: Node[];
  edges: Edge[];
  previewData: {[key: string]: any[]};
  onClose: () => void;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff00ff', '#00ffff', '#ff0000'];

const PreviewDashboard = ({ nodes, edges, previewData, onClose }: PreviewDashboardProps) => {
  // Get chart nodes that are connected to data nodes
  const getConnectedCharts = () => {
    const chartNodes = nodes.filter(node => node.type === 'chart');
    
    return chartNodes.map(chartNode => {
      // Find connected data node
      const connectedEdge = edges.find(edge => edge.target === chartNode.id);
      const dataNode = connectedEdge ? nodes.find(node => node.id === connectedEdge.source) : null;
      
      return {
        chartNode,
        dataNode,
        data: dataNode ? previewData[dataNode.id] || [] : []
      };
    }).filter(item => item.data.length > 0);
  };

  const renderChart = (chartType: string, data: any[], title: string) => {
    if (data.length === 0) return <div className="text-muted-foreground">No data available</div>;

    // Get first few columns for visualization
    const columns = Object.keys(data[0]).slice(0, 5);
    const numericColumns = columns.filter(col => {
      return data.some(row => !isNaN(parseFloat(row[col])) && isFinite(row[col]));
    });

    // Prepare data for charts
    let chartData = data.slice(0, 20).map((row, index) => {
      const item: any = { name: row[columns[0]] || `Item ${index + 1}` };
      numericColumns.forEach(col => {
        item[col] = parseFloat(row[col]) || 0;
      });
      return item;
    });

    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {numericColumns.slice(0, 3).map((col, index) => (
                <Bar key={col} dataKey={col} fill={COLORS[index]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {numericColumns.slice(0, 3).map((col, index) => (
                <Line key={col} type="monotone" dataKey={col} stroke={COLORS[index]} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'pie':
        const pieData = numericColumns.slice(0, 1).length > 0 
          ? chartData.slice(0, 8).map(item => ({
              name: item.name,
              value: item[numericColumns[0]]
            }))
          : [];
        
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return <div className="text-muted-foreground">Unsupported chart type</div>;
    }
  };

  const getChartIcon = (chartType: string) => {
    switch (chartType) {
      case 'bar': return <BarChart3 className="w-4 h-4" />;
      case 'line': return <LineChartIcon className="w-4 h-4" />;
      case 'pie': return <PieChartIcon className="w-4 h-4" />;
      default: return <BarChart3 className="w-4 h-4" />;
    }
  };

  const connectedCharts = getConnectedCharts();

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-auto">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-card border-b border-border/50 p-4 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard Preview</h1>
          <Button variant="ghost" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {connectedCharts.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-muted-foreground mb-4">
                No charts connected to data sources
              </div>
              <p className="text-sm text-muted-foreground">
                Connect chart nodes to data nodes to see visualizations in preview mode
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {connectedCharts.map(({ chartNode, dataNode, data }, index) => (
              <Card key={chartNode.id} className="p-6 glass-card">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {getChartIcon(chartNode.data.type)}
                    <h3 className="font-semibold">{chartNode.data.label}</h3>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Data: {dataNode?.data.label}
                  </div>
                </div>
                
                <div className="mb-2">
                  <div className="text-xs text-muted-foreground">
                    {data.length} rows • Showing first 20
                  </div>
                </div>

                {renderChart(chartNode.data.type, data, chartNode.data.label)}
              </Card>
            ))}
          </div>
        )}

        {/* Data Summary */}
        {Object.keys(previewData).length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Data Sources Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(previewData).map(([nodeId, data]) => {
                const dataNode = nodes.find(n => n.id === nodeId);
                return (
                  <Card key={nodeId} className="p-4 glass-card">
                    <h4 className="font-medium mb-2">{dataNode?.data.label}</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>Rows: {data.length}</div>
                      <div>Columns: {data.length > 0 ? Object.keys(data[0]).length : 0}</div>
                      {data.length > 0 && (
                        <div className="text-xs">
                          Fields: {Object.keys(data[0]).slice(0, 3).join(', ')}
                          {Object.keys(data[0]).length > 3 && '...'}
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewDashboard;