
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, TrendingDown, Brain, RefreshCw, AlertTriangle, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

const AssetDetails: React.FC<AssetDetailsProps> = ({ 
  selectedAsset, 
  perplexityApiKey, 
  onApiKeyChange 
}) => {
  const [aiInsight, setAiInsight] = useState<string>('');
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  const [beginnerMode, setBeginnerMode] = useState(false);
  const { toast } = useToast();

  const generateAIInsight = async () => {
    if (!selectedAsset || !perplexityApiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Perplexity API key to get AI insights.",
        variant: "destructive"
      });
      return;
    }

    setIsLoadingInsight(true);
    try {
      const systemPrompt = beginnerMode 
        ? "You are a financial advisor explaining complex market concepts in simple terms for beginners. Use analogies and avoid jargon."
        : "You are an expert financial analyst providing detailed market insights and analysis.";

      const userPrompt = `Analyze ${selectedAsset.name} (${selectedAsset.symbol}) in the ${selectedAsset.category} market. 
      Current price: ${selectedAsset.price}, Recent change: ${selectedAsset.change}%. 
      Please provide insights on:
      1. Recent price movements and potential causes
      2. Relevant global events affecting this asset
      3. Technical and fundamental analysis
      4. Risk factors and opportunities
      5. Market sentiment
      Keep the response concise but comprehensive.`;

      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${perplexityApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: userPrompt
            }
          ],
          temperature: 0.2,
          top_p: 0.9,
          max_tokens: 1000,
          return_images: false,
          return_related_questions: false,
          search_recency_filter: 'week',
          frequency_penalty: 1,
          presence_penalty: 0
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      setAiInsight(data.choices[0].message.content);
      
      toast({
        title: "AI Insight Generated",
        description: "Fresh market analysis is ready!",
      });
    } catch (error) {
      console.error('Error generating AI insight:', error);
      toast({
        title: "Error",
        description: "Failed to generate AI insight. Please check your API key.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingInsight(false);
    }
  };

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
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Perplexity API Key Required
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Enter your Perplexity API key to enable AI-powered market insights:
              </p>
              <Input
                type="password"
                placeholder="Enter your Perplexity API key"
                value={perplexityApiKey}
                onChange={(e) => onApiKeyChange(e.target.value)}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Get your API key from{" "}
                <a 
                  href="https://perplexity.ai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  perplexity.ai
                </a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Asset Overview */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {selectedAsset.symbol.substring(0, 2).toUpperCase()}
                </span>
              </div>
              <div>
                <CardTitle className="text-xl">{selectedAsset.name}</CardTitle>
                <p className="text-muted-foreground">{selectedAsset.symbol}</p>
              </div>
            </div>
            <Badge variant="outline" className="capitalize">
              {selectedAsset.category}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Current Price</p>
              <p className="text-3xl font-bold font-mono">{selectedAsset.price}</p>
            </div>
            <div className="flex items-center gap-2">
              {selectedAsset.change > 0 ? (
                <TrendingUp className="w-5 h-5 text-bull-500" />
              ) : (
                <TrendingDown className="w-5 h-5 text-bear-500" />
              )}
              <span className={`text-lg font-semibold ${
                selectedAsset.change > 0 ? 'text-bull-600' : 'text-bear-600'
              }`}>
                {selectedAsset.change > 0 ? '+' : ''}{selectedAsset.change}%
              </span>
              <span className="text-sm text-muted-foreground">24h</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TradingView Chart Placeholder */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Price Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-muted/30 rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/25">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">TradingView Chart Integration</p>
              <p className="text-sm text-muted-foreground">Real-time price chart for {selectedAsset.symbol}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-500" />
              AI Market Insights
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
                disabled={isLoadingInsight || !perplexityApiKey}
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
          {!perplexityApiKey ? (
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h4 className="font-medium text-amber-800 dark:text-amber-200">API Key Required</h4>
              </div>
              <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
                Please enter your Perplexity API key to enable AI-powered insights:
              </p>
              <Input
                type="password"
                placeholder="Enter your Perplexity API key"
                value={perplexityApiKey}
                onChange={(e) => onApiKeyChange(e.target.value)}
                className="font-mono text-sm bg-white dark:bg-gray-800"
              />
            </div>
          ) : aiInsight ? (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {aiInsight}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Click "Generate Insight" to get AI-powered market analysis</p>
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
