import {ajax_, snapshotAllTickers} from "./Ajax";
import {ICryptoSnapshotTickers} from "@polygon.io/client-js";

export const getRateRemote_: () => Promise<
  CoinbaseResponse<Rate[]>
> = async () => {
  return ajax_("cryptocurrency/listings/latest");
};

export const getRateRemote: () => Promise<ICryptoSnapshotTickers> =
  async () => {
    return snapshotAllTickers();
  };

export type Rate = {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  num_market_pairs: number;
  date_added: string;
  tags: string[];
  max_supply: number;
  circulating_supply: number;
  total_supply: number;
  platform: {
    id: number;
    name: string;
    symbol: string;
    slug: string;
    token_address: string;
  } | null;
  cmc_rank: number;
  last_updated: string;
  quote: {
    [key: string]: {
      price: number;
      volume_24h: number;
      volume_change_24h: number;
      percent_change_1h: number;
      percent_change_24h: number;
      percent_change_7d: number;
      percent_change_30d: number;
      percent_change_60d: number;
      percent_change_90d: number;
      market_cap: number;
      market_cap_dominance: number;
      fully_diluted_market_cap: number;
      last_updated: string;
    };
  };
};

export type CoinbaseResponse<T> = {
  data: T;
};

export const getPrice: (
  data: ICryptoSnapshotTickers,
  symbol: string
) => number = (data: ICryptoSnapshotTickers, symbol: string) => {
  return (
    data.tickers?.find((t) => t.ticker === `X:${symbol}USD`)?.lastTrade?.p || 0
  );
};
