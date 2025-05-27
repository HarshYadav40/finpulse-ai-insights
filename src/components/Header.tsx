
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Search, Settings, Moon, Sun } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  onSearch: (query: string) => void;
  searchQuery: string;
  isDark: boolean;
  onThemeToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch, searchQuery, isDark, onThemeToggle }) => {
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
          <div className="relative flex-1 lg:flex-none lg:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search stocks, crypto, forex, indices..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-10 bg-background/50 backdrop-blur-sm"
            />
          </div>
          
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
