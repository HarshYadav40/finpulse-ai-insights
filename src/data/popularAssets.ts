
import { SearchItem } from '@/types/assets';

export const popularAssets: SearchItem[] = [
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
