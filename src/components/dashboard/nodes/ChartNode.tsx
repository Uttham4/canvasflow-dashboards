import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, LineChart, PieChart, TrendingUp } from 'lucide-react';

const getChartIcon = (type: string) => {
  switch (type) {
    case 'bar': return <BarChart3 className="w-4 h-4" />;
    case 'line': return <LineChart className="w-4 h-4" />;
    case 'pie': return <PieChart className="w-4 h-4" />;
    default: return <TrendingUp className="w-4 h-4" />;
  }
};

function ChartNode({ data }: { data: any }) {
  return (
    <Card className="w-64 glass-card border-accent/20 hover:border-accent/40 transition-all duration-300">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-accent" />
      
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-gradient-accent rounded-md text-accent-foreground">
              {getChartIcon(data.type)}
            </div>
            <span className="font-medium text-sm">{data.label}</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {data.type}
          </Badge>
        </div>
        
        <div className="space-y-2 text-xs text-muted-foreground">
          <div>X-Axis: {data.config?.x || 'Not set'}</div>
          <div>Y-Axis: {data.config?.y || 'Not set'}</div>
        </div>
        
        {/* Mini chart preview */}
        <div className="h-16 bg-gradient-to-r from-accent/10 to-primary/10 rounded-md flex items-center justify-center">
          <div className="text-xs text-muted-foreground">Chart Preview</div>
        </div>
      </div>
      
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-accent" />
    </Card>
  );
}

export default memo(ChartNode);