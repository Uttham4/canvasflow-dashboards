import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Filter, Settings } from 'lucide-react';

function FilterNode({ data }: { data: any }) {
  return (
    <Card className="w-64 glass-card border-warning/20 hover:border-warning/40 transition-all duration-300">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-warning" />
      
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-warning text-warning-foreground rounded-md">
              <Filter className="w-4 h-4" />
            </div>
            <span className="font-medium text-sm">{data.label || 'Filter'}</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            Filter
          </Badge>
        </div>
        
        <div className="space-y-2 text-xs text-muted-foreground">
          <div>Field: {data.field || 'Not set'}</div>
          <div>Condition: {data.condition || 'Not set'}</div>
          <div>Value: {data.value || 'Not set'}</div>
        </div>
        
        {/* Filter settings */}
        <div className="flex items-center justify-center h-12 bg-warning/10 rounded-md">
          <Settings className="w-4 h-4 text-warning mr-2" />
          <span className="text-xs text-muted-foreground">Configure Filter</span>
        </div>
      </div>
      
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-warning" />
    </Card>
  );
}

export default memo(FilterNode);