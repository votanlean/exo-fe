import BigNumber from 'bignumber.js';

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
