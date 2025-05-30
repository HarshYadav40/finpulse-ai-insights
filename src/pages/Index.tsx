
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import QuickAccess from '@/components/QuickAccess';
import AssetDetails from '@/components/AssetDetails';
import SectorHeatmap from '@/components/SectorHeatmap';

interface Asset {
  symbol: string;
  name: string;
  price: string;
  change: number;
  category: 'stock' | 'crypto' | 'forex' | 'index';
}

const Index = () => {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDark, setIsDark] = useState(true);
  const [geminiApiKey, setGeminiApiKey] = useState('');

  // Load theme and API key from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('finpulse-theme');
    const savedApiKey = localStorage.getItem('finpulse-gemini-key');
    
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    }
    
    if (savedApiKey) {
      setGeminiApiKey(savedApiKey);
    }
    
    // Apply theme to document
    document.documentElement.classList.toggle('dark', savedTheme === 'dark' || (!savedTheme && true));
  }, []);

  // Save theme changes to localStorage
  useEffect(() => {
    localStorage.setItem('finpulse-theme', isDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  // Save API key to localStorage
  useEffect(() => {
    if (geminiApiKey) {
      localStorage.setItem('finpulse-gemini-key', geminiApiKey);
    }
  }, [geminiApiKey]);

  const handleAssetSelect = (asset: Asset) => {
    setSelectedAsset(asset);
    console.log('Selected asset:', asset);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log('Search query:', query);
  };

  const handleThemeToggle = () => {
    setIsDark(!isDark);
  };

  const handleApiKeyChange = (key: string) => {
    setGeminiApiKey(key);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <Header 
          onSearch={handleSearch}
          searchQuery={searchQuery}
          isDark={isDark}
          onThemeToggle={handleThemeToggle}
          onAssetSelect={handleAssetSelect}
        />
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Asset Selection & Details */}
          <div className="xl:col-span-2 space-y-6">
            <QuickAccess onAssetSelect={handleAssetSelect} />
            <AssetDetails 
              selectedAsset={selectedAsset}
              perplexityApiKey={geminiApiKey}
              onApiKeyChange={handleApiKeyChange}
            />
          </div>
          
          {/* Right Column - Sector Heatmap */}
          <div className="xl:col-span-1">
            <SectorHeatmap />
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>FinPulse • AI-Powered Financial Market Analysis</p>
          <p className="mt-1">
            Real-time data powered by Finnhub • AI insights by Google Gemini
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
