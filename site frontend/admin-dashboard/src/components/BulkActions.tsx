import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Trash2, 
  Edit, 
  Download, 
  MoreHorizontal,
  Check,
  X
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface BulkActionsProps {
  selectedItems: string[];
  totalItems: number;
  onSelectAll: (checked: boolean) => void;
  onDelete: () => void;
  onExport: () => void;
  onBulkEdit: () => void;
  onClearSelection: () => void;
  itemType: 'orders' | 'products' | 'customers';
}

export const BulkActions: React.FC<BulkActionsProps> = ({
  selectedItems,
  totalItems,
  onSelectAll,
  onDelete,
  onExport,
  onBulkEdit,
  onClearSelection,
  itemType,
}) => {
  const isAllSelected = selectedItems.length === totalItems;
  const isIndeterminate = selectedItems.length > 0 && selectedItems.length < totalItems;

  return (
    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg mb-4">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={isAllSelected}
            ref={(ref) => {
              if (ref) {
                ref.indeterminate = isIndeterminate;
              }
            }}
            onCheckedChange={onSelectAll}
          />
          <span className="text-sm text-muted-foreground">
            {selectedItems.length} of {totalItems} {itemType} selected
          </span>
        </div>
        
        {selectedItems.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {selectedItems.length > 0 && (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onBulkEdit}
            className="text-blue-600 hover:text-blue-700"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="text-green-600 hover:text-green-700"
          >
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="w-4 h-4 mr-1" />
                More
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onDelete} className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Selected
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onExport}>
                <Download className="w-4 h-4 mr-2" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onExport}>
                <Download className="w-4 h-4 mr-2" />
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}; 