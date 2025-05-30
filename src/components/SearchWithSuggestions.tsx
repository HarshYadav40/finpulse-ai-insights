
import React, { useState, useEffect, useRef } from 'react';
import { Search, TrendingUp, TrendingDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface Asset {
  symbol: string;
  name: string;
  price: string;
  change: number;
  category: 'stock' | 'crypto' | 'forex' | 'index';
}

interface SearchItem {
  symbol: string;
  name: string;
  category: 'stock' | 'crypto' | 'forex' | 'index';
}

interface SearchWithSuggestionsProps {
  onAssetSelect: (asset: Asset) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const SearchWithSuggestions: React.FC<SearchWithSuggestionsProps> = ({
  onAssetSelect,
  searchQuery,
  onSearchChange
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<SearchItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const FINNHUB_API_KEY = "d0ob5lhr01qu2361ioa0d0ob5lhr01qu2361ioag";

  const popularAssets: SearchItem[] = [
    // Stocks
    { symbol: 'AAPL', name: 'Apple Inc.', category: 'stock' },
    { symbol: 'TSLA', name: 'Tesla Inc.', category: 'stock' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', category: 'stock' },
    { symbol: 'MSFT', name: 'Microsoft Corporation', category: 'stock' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', category: 'stock' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', category: 'stock' },
    { symbol: 'META', name: 'Meta Platforms Inc.', category: 'stock' },
    { symbol: 'NFLX', name: 'Netflix Inc.', category: 'stock' },
    
    // Indices
    { symbol: 'SPY', name: 'S&P 500 ETF', category: 'index' },
    { symbol: 'QQQ', name: 'NASDAQ 100 ETF', category: 'index' },
    { symbol: 'DIA', name: 'Dow Jones ETF', category: 'index' },
    { symbol: 'NIFTY50', name: 'NIFTY 50', category: 'index' },
    
    // Crypto
    { symbol: 'BTC', name: 'Bitcoin', category: 'crypto' },
    { symbol: 'ETH', name: 'Ethereum', category: 'crypto' },
    { symbol: 'DOGE', name: 'Dogecoin', category: 'crypto' },
    { symbol: 'ADA', name: 'Cardano', category: 'crypto' },
    { symbol: 'SOL', name: 'Solana', category: 'crypto' },
    { symbol: 'MATIC', name: 'Polygon', category: 'crypto' },
    
    // Forex
    { symbol: 'USD/INR', name: 'US Dollar to Indian Rupee', category: 'forex' },
    { symbol: 'EUR/USD', name: 'Euro to US Dollar', category: 'forex' },
    { symbol: 'GBP/USD', name: 'British Pound to US Dollar', category: 'forex' },
    { symbol: 'USD/JPY', name: 'US Dollar to Japanese Yen', category: 'forex' },
    { symbol: 'AUD/USD', name: 'Australian Dollar to US Dollar', category: 'forex' },
    { symbol: 'USD/CAD', name: 'US Dollar to Canadian Dollar', category: 'forex' }
  ];

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

  const fetchAssetData = async (item: SearchItem) => {
    setIsLoading(true);
    try {
      let finnhubSymbol = item.symbol;
      
      // Format symbol for different asset types
      if (item.category === 'crypto') {
        finnhubSymbol = `BINANCE:${item.symbol}USDT`;
      } else if (item.category === 'forex') {
        finnhubSymbol = `OANDA:${item.symbol.replace('/', '_')}`;
      }

      const response = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${finnhubSymbol}&token=${FINNHUB_API_KEY}`,
        {
          headers: {
            'X-Finnhub-Secret': 'd0ob5lhr01qu2361iobg'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        
        if (data.c) {
          const asset: Asset = {
            symbol: item.symbol,
            name: item.name,
            price: `$${data.c.toFixed(2)}`,
            change: data.dp || 0,
            category: item.category
          };
          
          onAssetSelect(asset);
          console.log('Fetched asset data:', asset);
        }
      }
    } catch (error) {
      console.error('Error fetching asset data:', error);
      
      // Fallback with mock data
      const mockAsset: Asset = {
        symbol: item.symbol,
        name: item.name,
        price: '$0.00',
        change: 0,
        category: item.category
      };
      onAssetSelect(mockAsset);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (item: SearchItem) => {
    onSearchChange(item.symbol);
    setShowSuggestions(false);
    fetchAssetData(item);
  };

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
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 bg-background/95 backdrop-blur-sm border shadow-lg max-h-96 overflow-y-auto">
          <div className="p-2">
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((item) => (
                <div
                  key={`${item.category}-${item.symbol}`}
                  onClick={() => handleSuggestionClick(item)}
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
      )}
    </div>
  );
};

export default SearchWithSuggestions;
