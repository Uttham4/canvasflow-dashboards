import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, Rows, Columns } from 'lucide-react';

function DataNode({ data }: { data: any }) {
  return (
    <Card className="w-64 glass-card border-primary/20 hover:border-primary/40 transition-all duration-300">
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-gradient-primary rounded-md text-primary-foreground">
              <Database className="w-4 h-4" />
            </div>
            <span className="font-medium text-sm">{data.label}</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            Dataset
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center text-muted-foreground">
              <Rows className="w-3 h-3 mr-1" />
              Rows
            </span>
            <span className="font-mono text-accent">{data.rows}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center text-muted-foreground">
              <Columns className="w-3 h-3 mr-1" />
              Columns
            </span>
            <span className="font-mono text-accent">{data.columns?.length || 0}</span>
          </div>
        </div>
        
        {/* Columns preview */}
        <div className="space-y-1">
          {data.columns?.slice(0, 3).map((col: string, idx: number) => (
            <div key={idx} className="text-xs px-2 py-1 bg-muted/50 rounded text-muted-foreground">
              {col}
            </div>
          ))}
          {data.columns?.length > 3 && (
            <div className="text-xs text-muted-foreground text-center">
              +{data.columns.length - 3} more
            </div>
          )}
        </div>
      </div>
      
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-primary" />
    </Card>
  );
}

export default memo(DataNode);