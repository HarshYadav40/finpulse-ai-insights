
import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SearchWithSuggestionsProps, SearchItem } from '@/types/assets';
import { popularAssets } from '@/data/popularAssets';
import { fetchAssetData } from '@/utils/assetApi';
import SuggestionsDropdown from './SuggestionsDropdown';

const SearchWithSuggestions: React.FC<SearchWithSuggestionsProps> = ({
  onAssetSelect,
  searchQuery,
  onSearchChange
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<SearchItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery.length > 0) {
      const filtered = popularAssets.filter(
        asset =>
          asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          asset.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSuggestions(filtered.slice(0, 8));
      setShowSuggestions(true);
    } else {
      setFilteredSuggestions(popularAssets.slice(0, 8));
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSuggestionClick = async (item: SearchItem) => {
    onSearchChange(item.symbol);
    setShowSuggestions(false);
    setIsLoading(true);
    
    try {
      const asset = await fetchAssetData(item);
      onAssetSelect(asset);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={searchRef} className="relative flex-1 lg:flex-none lg:w-80">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 z-10" />
        <Input
          placeholder="Search stocks, crypto, forex, indices..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          className="pl-10 bg-background/50 backdrop-blur-sm"
          disabled={isLoading}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {showSuggestions && (filteredSuggestions.length > 0 || searchQuery.length > 0) && (
        <SuggestionsDropdown
          suggestions={filteredSuggestions}
          searchQuery={searchQuery}
          onSuggestionClick={handleSuggestionClick}
          searchRef={searchRef}
        />
      )}
    </div>
  );
};

export default SearchWithSuggestions;
