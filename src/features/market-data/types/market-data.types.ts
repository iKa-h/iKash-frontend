export interface UsdcPriceResponse {
  asset: string;
  quote: string;
  price: number;
  timestamp: number;
}

export interface UsdcPriceState {
  price: number | null;
  isLoading: boolean;
  error: string | null;
  isStale: boolean;
  lastUpdated: number | null;
}
