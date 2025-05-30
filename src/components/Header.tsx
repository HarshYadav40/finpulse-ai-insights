
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Settings, Moon, Sun } from 'lucide-react';
import SearchWithSuggestions from './SearchWithSuggestions';

interface Asset {
  symbol: string;
  name: string;
  price: string;
  change: number;
  category: 'stock' | 'crypto' | 'forex' | 'index';
}

interface HeaderProps {
  onSearch: (query: string) => void;
  searchQuery: string;
  isDark: boolean;
  onThemeToggle: () => void;
  onAssetSelect: (asset: Asset) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onSearch, 
  searchQuery, 
  isDark, 
  onThemeToggle,
  onAssetSelect 
}) => {
  return (
    <Card className="p-6 mb-6 glass-card">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold financial-gradient-text">FinPulse</h1>
          </div>
          <Badge variant="secondary" className="animate-pulse-slow">
            AI-Powered
          </Badge>
        </div>

        <div className="flex items-center gap-4">
          <SearchWithSuggestions
            onAssetSelect={onAssetSelect}
            searchQuery={searchQuery}
            onSearchChange={onSearch}
          />
          
          <Button variant="outline" size="icon" onClick={onThemeToggle}>
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          
          <Button variant="outline" size="icon">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default Header;
