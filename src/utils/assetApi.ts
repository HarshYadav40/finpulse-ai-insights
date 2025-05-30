
import { Asset, SearchItem } from '@/types/assets';

const FINNHUB_API_KEY = "d0ob5lhr01qu2361ioa0d0ob5lhr01qu2361ioag";

export const fetchAssetData = async (item: SearchItem): Promise<Asset> => {
  try {
    let finnhubSymbol = item.symbol;
    
    // Format symbol for different asset types
    if (item.category === 'crypto') {
      finnhubSymbol = `BINANCE:${item.symbol}USDT`;
    } else if (item.category === 'forex') {
      finnhubSymbol = `OANDA:${item.symbol.replace('/', '_')}`;
    }

    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${finnhubSymbol}&token=${FINNHUB_API_KEY}`,
      {
        headers: {
          'X-Finnhub-Secret': 'd0ob5lhr01qu2361iobg'
        }
      }
    );

    if (response.ok) {
      const data = await response.json();
      
      if (data.c) {
        const asset: Asset = {
          symbol: item.symbol,
          name: item.name,
          price: `$${data.c.toFixed(2)}`,
          change: data.dp || 0,
          category: item.category
        };
        
        console.log('Fetched asset data:', asset);
        return asset;
      }
    }
    
    throw new Error('Failed to fetch data');
  } catch (error) {
    console.error('Error fetching asset data:', error);
    
    // Fallback with mock data
    return {
      symbol: item.symbol,
      name: item.name,
      price: '$0.00',
      change: 0,
      category: item.category
    };
  }
};
