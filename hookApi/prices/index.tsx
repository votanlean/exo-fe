import BigNumber from 'bignumber.js';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { useAppPrices } from 'state/prices/selectors';
import tokens from 'config/constants/tokens';

export const BIG_TEN = new BigNumber(10);

export const fetchPrices = async () => {
  const response = await fetch('https://api.pancakeswap.info/api/v2/tokens');
  const data = (await response.json()) as any;

  // Return normalized token names
  return {
    updated_at: data.updated_at,
    data: Object.keys(data.data).reduce((accum, token) => {
      return {
        ...accum,
        [token.toLowerCase()]: parseFloat(data.data[token].price),
      }
    }, {}),
  }
}

const cache = new InMemoryCache();
const apolloClient = new ApolloClient({
	uri: process.env.QUICKSWAP_INFO_API,
	cache
});

export interface Bundle {
	ethPrice: string;
}
export interface Token {
	id: string;
	symbol: string;
	name: string;
	decimals: number;
	derivedETH: string;
}

const QUERY_POLYGON_TOKENS_PRICES = gql`
	query QUERY_POLYGON_TOKENS_PRICES($ids: [ID!]) {
		bundle(id: 1) {
			ethPrice
		}
		tokens(where: {
			id_in: $ids
		}) {
			id
			symbol
			name
			decimals
			derivedETH
		}
	}
`;

export const fetchPolygonPrices = async () => {
	const response = await apolloClient.query<{
		bundle: Bundle,
		tokens: Token[]
	}, {
		ids: string[]
	}>({
		query: QUERY_POLYGON_TOKENS_PRICES,
		variables: {
			ids: Object.values(tokens).reduce((ids, token: any) => {
				if (token.address && token.address[137]) {
					ids.push(token.address[137].toLowerCase())
				}

				return ids
			}, [] as string[])
		}
	})

	return {
		updated_at: Date.now(),
		data: response.data.tokens.reduce((tokens, token) => {
			return {
				...tokens,
				[token.id]: parseFloat(token.derivedETH) * parseFloat(response.data.bundle.ethPrice)
			}
		}, {})
	}
}

export const useTokenPrice = (tokenAddress) => {
  const allTokenPrices = useAppPrices();
  const tokenPrice = allTokenPrices[tokenAddress];

  return tokenPrice || 0;
}
