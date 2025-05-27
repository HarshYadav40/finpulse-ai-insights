
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface SectorData {
  name: string;
  change: number;
  volatility: 'low' | 'medium' | 'high';
  sentiment: 'bullish' | 'bearish' | 'neutral';
}

const SectorHeatmap: React.FC = () => {
  const sectors: SectorData[] = [
    { name: 'Technology', change: 2.34, volatility: 'medium', sentiment: 'bullish' },
    { name: 'Healthcare', change: 1.12, volatility: 'low', sentiment: 'bullish' },
    { name: 'Finance', change: -0.87, volatility: 'high', sentiment: 'bearish' },
    { name: 'Energy', change: 3.45, volatility: 'high', sentiment: 'bullish' },
    { name: 'Consumer', change: 0.23, volatility: 'medium', sentiment: 'neutral' },
    { name: 'Utilities', change: -0.12, volatility: 'low', sentiment: 'neutral' },
    { name: 'Materials', change: 1.89, volatility: 'medium', sentiment: 'bullish' },
    { name: 'Real Estate', change: -1.23, volatility: 'low', sentiment: 'bearish' },
  ];

  const getChangeColor = (change: number) => {
    if (change > 2) return 'bg-bull-500';
    if (change > 0) return 'bg-bull-300';
    if (change > -1) return 'bg-bear-300';
    return 'bg-bear-500';
  };

  const getChangeIntensity = (change: number) => {
    const intensity = Math.min(Math.abs(change) / 3, 1);
    return intensity;
  };

  const getVolatilityColor = (volatility: SectorData['volatility']) => {
    switch (volatility) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-amber-600 bg-amber-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSentimentIcon = (sentiment: SectorData['sentiment']) => {
    switch (sentiment) {
      case 'bullish': return <TrendingUp className="w-3 h-3 text-bull-500" />;
      case 'bearish': return <TrendingDown className="w-3 h-3 text-bear-500" />;
      case 'neutral': return <Activity className="w-3 h-3 text-gray-500" />;
      default: return null;
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          Sector Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {sectors.map((sector) => (
            <div
              key={sector.name}
              className={`p-4 rounded-lg border transition-all duration-200 hover:scale-105 cursor-pointer ${getChangeColor(sector.change)}`}
              style={{
                opacity: 0.7 + (getChangeIntensity(sector.change) * 0.3)
              }}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white text-sm">{sector.name}</h3>
                  {getSentimentIcon(sector.sentiment)}
                </div>
                
                <div className="text-white">
                  <span className="text-lg font-bold">
                    {sector.change > 0 ? '+' : ''}{sector.change}%
                  </span>
                </div>
                
                <Badge 
                  className={`${getVolatilityColor(sector.volatility)} text-xs border-0`}
                >
                  {sector.volatility} vol
                </Badge>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>Last updated: 2 minutes ago</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-bull-500 rounded"></div>
              <span>Positive</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-bear-500 rounded"></div>
              <span>Negative</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SectorHeatmap;
