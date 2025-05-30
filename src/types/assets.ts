
export interface Asset {
  symbol: string;
  name: string;
  price: string;
  change: number;
  category: 'stock' | 'crypto' | 'forex' | 'index';
}

export interface SearchItem {
  symbol: string;
  name: string;
  category: 'stock' | 'crypto' | 'forex' | 'index';
}

export interface SearchWithSuggestionsProps {
  onAssetSelect: (asset: Asset) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}
