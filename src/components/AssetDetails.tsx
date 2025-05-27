import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, TrendingDown, Brain, RefreshCw, AlertTriangle, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PriceChart from './PriceChart';

interface Asset {
  symbol: string;
  name: string;
  price: string;
  change: number;
  category: 'stock' | 'crypto' | 'forex' | 'index';
}

interface AssetDetailsProps {
  selectedAsset: Asset | null;
  perplexityApiKey: string;
  onApiKeyChange: (key: string) => void;
}

interface RealTimePrice {
  current: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
}

const AssetDetails: React.FC<AssetDetailsProps> = ({ 
  selectedAsset, 
  perplexityApiKey: geminiApiKey, 
  onApiKeyChange 
}) => {
  const [aiInsight, setAiInsight] = useState<string>('');
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  const [beginnerMode, setBeginnerMode] = useState(false);
  const [realTimePrice, setRealTimePrice] = useState<RealTimePrice | null>(null);
  const [isLoadingPrice, setIsLoadingPrice] = useState(false);
  const { toast } = useToast();

  const GEMINI_API_KEY = "AIzaSyAYmEj1tHJMiRm7lMsQbJ83Tf3IfkkY0Fg";
  const FINNHUB_API_KEY = "d0ob5lhr01qu2361ioa0d0ob5lhr01qu2361ioag";

  const fetchRealTimePrice = async (symbol: string) => {
    if (!symbol) return;
    
    setIsLoadingPrice(true);
    try {
      // Adjust symbol format for different asset types
      let finnhubSymbol = symbol;
      if (selectedAsset?.category === 'crypto') {
        finnhubSymbol = `BINANCE:${symbol}USDT`;
      } else if (selectedAsset?.category === 'forex') {
        finnhubSymbol = `OANDA:${symbol.replace('/', '_')}`;
      }

      const response = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${finnhubSymbol}&token=${FINNHUB_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`Finnhub API Error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.c && data.pc) {
        const change = data.c - data.pc;
        const changePercent = (change / data.pc) * 100;
        
        setRealTimePrice({
          current: data.c,
          change: change,
          changePercent: changePercent,
          high: data.h,
          low: data.l,
          open: data.o,
          previousClose: data.pc
        });
        
        console.log('Real-time price data:', data);
      }
    } catch (error) {
      console.error('Error fetching real-time price:', error);
      toast({
        title: "Price Fetch Error",
        description: "Unable to fetch real-time price data",
        variant: "destructive"
      });
    } finally {
      setIsLoadingPrice(false);
    }
  };

  const generateAIInsight = async () => {
    if (!selectedAsset || !GEMINI_API_KEY) {
      toast({
        title: "API Key Required",
        description: "Gemini API key is required for AI insights.",
        variant: "destructive"
      });
      return;
    }

    setIsLoadingInsight(true);
    try {
      const systemPrompt = beginnerMode 
        ? "You are a financial advisor explaining complex market concepts in simple terms for beginners. Use analogies and avoid jargon."
        : "You are an expert financial analyst providing detailed market insights and analysis.";

      const currentPrice = realTimePrice ? realTimePrice.current : selectedAsset.price;
      const currentChange = realTimePrice ? realTimePrice.changePercent : selectedAsset.change;

      const userPrompt = `${systemPrompt}

Analyze ${selectedAsset.name} (${selectedAsset.symbol}) in the ${selectedAsset.category} market. 
Current price: ${currentPrice}, Recent change: ${currentChange}%. 

Please provide insights on:
1. Recent price movements and potential causes
2. Relevant global events affecting this asset
3. Technical and fundamental analysis
4. Risk factors and opportunities
5. Market sentiment

Keep the response concise but comprehensive (max 800 words).`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: userPrompt
                  }
                ]
              }
            ]
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API Error: ${response.status}`);
      }

      const data = await response.json();
      const insight = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No insight generated';
      setAiInsight(insight);
      
      toast({
        title: "AI Insight Generated",
        description: "Fresh market analysis is ready!",
      });
    } catch (error) {
      console.error('Error generating AI insight:', error);
      toast({
        title: "Error",
        description: "Failed to generate AI insight. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingInsight(false);
    }
  };

  // Fetch real-time price when asset changes and set up 5-second polling
  useEffect(() => {
    if (selectedAsset) {
      // Initial fetch
      fetchRealTimePrice(selectedAsset.symbol);
      
      // Set up polling every 5 seconds
      const interval = setInterval(() => {
        fetchRealTimePrice(selectedAsset.symbol);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [selectedAsset]);

  if (!selectedAsset) {
    return (
      <Card className="glass-card">
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <Globe className="w-16 h-16 text-muted-foreground mx-auto" />
            <h3 className="text-xl font-semibold">Welcome to FinPulse</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Select an asset from the trending list above or search for any stock, 
              cryptocurrency, forex pair, or index to get started with AI-powered analysis.
            </p>
            
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-500" />
                Powered by Google Gemini AI
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Real-time market insights powered by Google's advanced AI and Finnhub data.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayPrice = realTimePrice ? realTimePrice.current.toFixed(2) : selectedAsset.price;
  const displayChange = realTimePrice ? realTimePrice.change.toFixed(2) : '0.00';
  const displayChangePercent = realTimePrice ? realTimePrice.changePercent.toFixed(2) : selectedAsset.change;

  return (
    <div className="space-y-6">
      {/* Prominent Real-Time Price Display */}
      <Card className="glass-card border-2">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {selectedAsset.symbol.substring(0, 2).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{selectedAsset.name}</h2>
                <p className="text-muted-foreground font-mono">{selectedAsset.symbol}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="capitalize">
                {selectedAsset.category}
              </Badge>
              {realTimePrice && (
                <Badge variant="secondary" className="text-xs animate-pulse">
                  LIVE
                </Badge>
              )}
              {isLoadingPrice && <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />}
            </div>
          </div>
          
          <div className="flex items-end gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Current Price</p>
              <p className="text-5xl font-bold font-mono tracking-tight">${displayPrice}</p>
            </div>
            
            <div className="flex items-center gap-3 pb-2">
              <div className="flex items-center gap-2">
                {Number(displayChangePercent) >= 0 ? (
                  <TrendingUp className="w-6 h-6 text-green-500" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-red-500" />
                )}
                <div className="text-right">
                  <p className={`text-2xl font-bold ${
                    Number(displayChangePercent) >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {Number(displayChangePercent) >= 0 ? '+' : ''}{displayChangePercent}%
                  </p>
                  <p className={`text-lg font-mono ${
                    Number(displayChange) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {Number(displayChange) >= 0 ? '+' : ''}${displayChange}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {realTimePrice && (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm border-t pt-4">
              <div>
                <p className="text-muted-foreground">Open</p>
                <p className="font-mono font-semibold">${realTimePrice.open.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">High</p>
                <p className="font-mono font-semibold text-green-600">${realTimePrice.high.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Low</p>
                <p className="font-mono font-semibold text-red-600">${realTimePrice.low.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Prev Close</p>
                <p className="font-mono font-semibold">${realTimePrice.previousClose.toFixed(2)}</p>
              </div>
            </div>
          )}
          
          <div className="mt-4 text-xs text-muted-foreground flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Real-time data • Updates every 5 seconds • Powered by Finnhub
          </div>
        </CardContent>
      </Card>

      {/* ApexCharts Price Chart */}
      <PriceChart selectedAsset={selectedAsset} isDark={true} />

      {/* AI Insights */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-500" />
              Gemini AI Market Insights
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBeginnerMode(!beginnerMode)}
                className={beginnerMode ? 'bg-green-100 text-green-800 border-green-300' : ''}
              >
                {beginnerMode ? '👶 Beginner Mode' : '🎓 Expert Mode'}
              </Button>
              <Button 
                onClick={generateAIInsight}
                disabled={isLoadingInsight}
                size="sm"
              >
                {isLoadingInsight ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Brain className="w-4 h-4" />
                )}
                Generate Insight
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {aiInsight ? (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {aiInsight}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Click "Generate Insight" to get Gemini AI-powered market analysis</p>
              <p className="text-sm text-muted-foreground mt-1">
                {beginnerMode ? 'Beginner-friendly explanations enabled' : 'Expert analysis mode'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Market Events */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-500" />
            Relevant Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-sm">Federal Reserve Policy Meeting</p>
                <p className="text-xs text-muted-foreground">Interest rate decisions affecting market sentiment</p>
                <Badge variant="outline" className="mt-1 text-xs">2 hours ago</Badge>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-sm">Earnings Season Update</p>
                <p className="text-xs text-muted-foreground">Q4 results impacting sector performance</p>
                <Badge variant="outline" className="mt-1 text-xs">6 hours ago</Badge>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-sm">Geopolitical Developments</p>
                <p className="text-xs text-muted-foreground">Trade agreements affecting currency pairs</p>
                <Badge variant="outline" className="mt-1 text-xs">1 day ago</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssetDetails;
