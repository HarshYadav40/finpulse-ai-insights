
import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { SearchItem } from '@/types/assets';

interface SuggestionsDropdownProps {
  suggestions: SearchItem[];
  searchQuery: string;
  onSuggestionClick: (item: SearchItem) => void;
  searchRef: React.RefObject<HTMLDivElement>;
}

const SuggestionsDropdown: React.FC<SuggestionsDropdownProps> = ({
  suggestions,
  searchQuery,
  onSuggestionClick,
  searchRef
}) => {
  const getCategoryColor = (category: SearchItem['category']) => {
    switch (category) {
      case 'stock': return 'bg-blue-500';
      case 'crypto': return 'bg-orange-500';
      case 'forex': return 'bg-green-500';
      case 'index': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryLabel = (category: SearchItem['category']) => {
    switch (category) {
      case 'stock': return 'Stock';
      case 'crypto': return 'Crypto';
      case 'forex': return 'Forex';
      case 'index': return 'Index';
      default: return 'Asset';
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] pointer-events-none">
      <Card 
        className="absolute bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl max-h-96 overflow-y-auto pointer-events-auto"
        style={{
          top: searchRef.current ? searchRef.current.getBoundingClientRect().bottom + window.scrollY + 4 : 0,
          left: searchRef.current ? searchRef.current.getBoundingClientRect().left + window.scrollX : 0,
          width: searchRef.current ? searchRef.current.getBoundingClientRect().width : 320,
        }}
      >
        <div className="p-2">
          {suggestions.length > 0 ? (
            suggestions.map((item) => (
              <div
                key={`${item.category}-${item.symbol}`}
                onClick={() => onSuggestionClick(item)}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Badge className={`${getCategoryColor(item.category)} text-white text-xs`}>
                    {getCategoryLabel(item.category)}
                  </Badge>
                  <div>
                    <div className="font-medium text-sm">{item.symbol}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-48">
                      {item.name}
                    </div>
                  </div>
                </div>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground text-sm">
              No assets found matching "{searchQuery}"
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default SuggestionsDropdown;
