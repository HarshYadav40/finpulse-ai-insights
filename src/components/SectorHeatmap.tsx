
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface SectorData {
  name: string;
  change: number;
  value: string;
}

const SectorHeatmap: React.FC = () => {
  const sectorData: SectorData[] = [
    { name: 'Technology', change: 2.34, value: '15,234' },
    { name: 'Healthcare', change: -0.87, value: '12,456' },
    { name: 'Financial', change: 1.23, value: '18,765' },
    { name: 'Energy', change: -2.45, value: '8,923' },
    { name: 'Consumer', change: 0.65, value: '11,234' },
    { name: 'Industrial', change: 1.87, value: '9,876' },
    { name: 'Materials', change: -1.34, value: '7,654' },
    { name: 'Utilities', change: 0.23, value: '5,432' },
  ];

  const getSectorColor = (change: number) => {
    if (change > 1.5) return 'bg-green-500';
    if (change > 0) return 'bg-green-300';
    if (change > -1.5) return 'bg-red-300';
    return 'bg-red-500';
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          Market Sectors
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {sectorData.map((sector) => (
            <div
              key={sector.name}
              className={`p-3 rounded-lg text-white text-center transition-all hover:scale-105 ${getSectorColor(sector.change)}`}
            >
              <div className="flex items-center justify-center gap-1 mb-1">
                {sector.change > 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span className="text-xs font-medium">
                  {sector.change > 0 ? '+' : ''}{sector.change}%
                </span>
              </div>
              <h3 className="text-sm font-semibold">{sector.name}</h3>
              <p className="text-xs opacity-90">{sector.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SectorHeatmap;
