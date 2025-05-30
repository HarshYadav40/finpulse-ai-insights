
import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Asset {
  symbol: string;
  name: string;
  price: string;
  change: number;
  category: 'stock' | 'crypto' | 'forex' | 'index';
}

interface PriceChartProps {
  selectedAsset: Asset | null;
  isDark?: boolean;
}

interface CandlestickData {
  x: number;
  y: [number, number, number, number]; // [open, high, low, close]
}

const PriceChart: React.FC<PriceChartProps> = ({ selectedAsset, isDark = true }) => {
  const [chartData, setChartData] = useState<CandlestickData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [timeframe, setTimeframe] = useState('1D');
  const { toast } = useToast();

  const FINNHUB_API_KEY = "d0ob5lhr01qu2361ioa0d0ob5lhr01qu2361ioag";

  const fetchChartData = async (symbol: string, resolution: string) => {
    if (!symbol) return;

    setIsLoading(true);
    try {
      // Adjust symbol format for different asset types
      let finnhubSymbol = symbol;
      if (selectedAsset?.category === 'crypto') {
        finnhubSymbol = `BINANCE:${symbol}USDT`;
      } else if (selectedAsset?.category === 'forex') {
        finnhubSymbol = `OANDA:${symbol.replace('/', '_')}`;
      }

      // Calculate time range based on timeframe
      const to = Math.floor(Date.now() / 1000);
      let from = to;
      let res = resolution;

      switch (timeframe) {
        case '1D':
          from = to - 24 * 60 * 60;
          res = '5';
          break;
        case '1W':
          from = to - 7 * 24 * 60 * 60;
          res = '60';
          break;
        case '1M':
          from = to - 30 * 24 * 60 * 60;
          res = 'D';
          break;
        case '1Y':
          from = to - 365 * 24 * 60 * 60;
          res = 'W';
          break;
        default:
          from = to - 24 * 60 * 60;
          res = '5';
      }

      const response = await fetch(
        `https://finnhub.io/api/v1/stock/candle?symbol=${finnhubSymbol}&resolution=${res}&from=${from}&to=${to}&token=${FINNHUB_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`Finnhub API Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.s === 'ok' && data.c && data.c.length > 0) {
        const candlestickData: CandlestickData[] = data.t.map((timestamp: number, index: number) => ({
          x: timestamp * 1000,
          y: [data.o[index], data.h[index], data.l[index], data.c[index]]
        }));

        setChartData(candlestickData);
      } else {
        // Generate mock data if no real data available
        generateMockData();
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
      generateMockData();
      toast({
        title: "Chart Data",
        description: "Using sample data - real-time data may be limited for this asset",
        variant: "default"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockData = () => {
    const mockData: CandlestickData[] = [];
    const basePrice = parseFloat(selectedAsset?.price || '100');
    const now = Date.now();

    for (let i = 0; i < 50; i++) {
      const timestamp = now - (49 - i) * 60 * 60 * 1000;
      const open = basePrice + (Math.random() - 0.5) * basePrice * 0.1;
      const close = open + (Math.random() - 0.5) * open * 0.05;
      const high = Math.max(open, close) + Math.random() * Math.max(open, close) * 0.02;
      const low = Math.min(open, close) - Math.random() * Math.min(open, close) * 0.02;

      mockData.push({
        x: timestamp,
        y: [open, high, low, close]
      });
    }

    setChartData(mockData);
  };

  useEffect(() => {
    if (selectedAsset) {
      fetchChartData(selectedAsset.symbol, '5');
    }
  }, [selectedAsset, timeframe]);

  const chartOptions = {
    chart: {
      type: 'candlestick' as const,
      height: 350,
      background: 'transparent',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      },
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        }
      },
      zoom: {
        enabled: true,
        type: 'x' as const,
        autoScaleYaxis: true
      }
    },
    theme: {
      mode: (isDark ? 'dark' : 'light') as 'dark' | 'light'
    },
    title: {
      text: selectedAsset ? `${selectedAsset.name} (${selectedAsset.symbol})` : 'Price Chart',
      align: 'left' as const,
      style: {
        color: isDark ? '#ffffff' : '#000000',
        fontSize: '16px',
        fontWeight: '600'
      }
    },
    xaxis: {
      type: 'datetime' as const,
      labels: {
        style: {
          colors: isDark ? '#ffffff' : '#000000'
        },
        datetimeFormatter: {
          year: 'yyyy',
          month: 'MMM \'yy',
          day: 'dd MMM',
          hour: 'HH:mm'
        }
      },
      tooltip: {
        enabled: false
      }
    },
    yaxis: {
      tooltip: {
        enabled: true
      },
      labels: {
        style: {
          colors: isDark ? '#ffffff' : '#000000'
        },
        formatter: (value: number) => `$${value.toFixed(2)}`
      },
      opposite: true
    },
    grid: {
      borderColor: isDark ? '#374151' : '#e5e7eb',
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: '#22c55e',
          downward: '#ef4444'
        },
        wick: {
          useFillColor: true
        }
      }
    },
    tooltip: {
      theme: (isDark ? 'dark' : 'light') as 'dark' | 'light',
      shared: false,
      custom: function({ seriesIndex, dataPointIndex, w }) {
        const data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
        const [open, high, low, close] = data.y;
        const date = new Date(data.x);
        
        return `
          <div class="p-3 ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} border border-gray-300 rounded shadow-lg">
            <div class="font-semibold mb-2">${date.toLocaleDateString()} ${date.toLocaleTimeString()}</div>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div>Open: <span class="font-mono">$${open.toFixed(2)}</span></div>
              <div>High: <span class="font-mono text-green-500">$${high.toFixed(2)}</span></div>
              <div>Low: <span class="font-mono text-red-500">$${low.toFixed(2)}</span></div>
              <div>Close: <span class="font-mono">$${close.toFixed(2)}</span></div>
            </div>
          </div>
        `;
      }
    },
    stroke: {
      width: 1
    },
    responsive: [{
      breakpoint: 768,
      options: {
        chart: {
          height: 300
        },
        yaxis: {
          labels: {
            formatter: (value: number) => `$${value.toFixed(0)}`
          }
        }
      }
    }]
  };

  const series = [{
    name: 'Price',
    data: chartData
  }];

  if (!selectedAsset) {
    return (
      <Card className="glass-card">
        <CardContent className="p-8 text-center">
          <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Advanced Trading Chart</h3>
          <p className="text-muted-foreground">
            Select an asset to view its interactive candlestick chart with advanced trading features
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Trading Chart
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex bg-muted rounded-lg p-1">
              {['1D', '1W', '1M', '1Y'].map((tf) => (
                <Button
                  key={tf}
                  variant={timeframe === tf ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setTimeframe(tf)}
                  className="text-xs px-3 py-1"
                >
                  {tf}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => selectedAsset && fetchChartData(selectedAsset.symbol, '5')}
              disabled={isLoading}
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          {chartData.length > 0 ? (
            <Chart
              options={chartOptions}
              series={series}
              type="candlestick"
              height="100%"
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                {isLoading ? (
                  <>
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
                    <p className="text-muted-foreground">Loading chart data...</p>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No chart data available</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceChart;
