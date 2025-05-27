
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface QuickAccessItem {
  symbol: string;
  name: string;
  price: string;
  change: number;
  category: 'stock' | 'crypto' | 'forex' | 'index';
}

interface QuickAccessProps {
  onAssetSelect: (asset: QuickAccessItem) => void;
}

const QuickAccess: React.FC<QuickAccessProps> = ({ onAssetSelect }) => {
  const trendingAssets: QuickAccessItem[] = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: '$175.43', change: 2.34, category: 'stock' },
    { symbol: 'BTC', name: 'Bitcoin', price: '$43,256', change: -1.23, category: 'crypto' },
    { symbol: 'NIFTY50', name: 'NIFTY 50', price: '21,456.75', change: 0.89, category: 'index' },
    { symbol: 'EUR/USD', name: 'Euro Dollar', price: '1.0842', change: 0.45, category: 'forex' },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: '$248.87', change: 3.21, category: 'stock' },
    { symbol: 'ETH', name: 'Ethereum', price: '$2,634.12', change: -0.87, category: 'crypto' },
    { symbol: 'SPY', name: 'S&P 500 ETF', price: '$459.32', change: 1.12, category: 'index' },
    { symbol: 'GBP/USD', name: 'British Pound', price: '1.2743', change: -0.34, category: 'forex' }
  ];

  const getCategoryColor = (category: QuickAccessItem['category']) => {
    switch (category) {
      case 'stock': return 'bg-blue-500';
      case 'crypto': return 'bg-orange-500';
      case 'forex': return 'bg-green-500';
      case 'index': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryLabel = (category: QuickAccessItem['category']) => {
    switch (category) {
      case 'stock': return 'Stock';
      case 'crypto': return 'Crypto';
      case 'forex': return 'Forex';
      case 'index': return 'Index';
      default: return 'Asset';
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Trending Assets
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trendingAssets.map((asset) => (
            <div
              key={asset.symbol}
              onClick={() => onAssetSelect(asset)}
              className="p-4 rounded-lg border border-border hover:border-primary/50 cursor-pointer transition-all duration-200 hover:shadow-lg bg-card/50 backdrop-blur-sm hover:scale-105"
            >
              <div className="flex items-center justify-between mb-2">
                <Badge className={`${getCategoryColor(asset.category)} text-white text-xs`}>
                  {getCategoryLabel(asset.category)}
                </Badge>
                {asset.change > 0 ? (
                  <TrendingUp className="w-4 h-4 text-bull-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-bear-500" />
                )}
              </div>
              
              <div className="space-y-1">
                <h3 className="font-semibold text-sm">{asset.symbol}</h3>
                <p className="text-xs text-muted-foreground truncate">{asset.name}</p>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm">{asset.price}</span>
                  <span className={`text-xs font-medium ${
                    asset.change > 0 ? 'text-bull-600' : 'text-bear-600'
                  }`}>
                    {asset.change > 0 ? '+' : ''}{asset.change}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickAccess;
