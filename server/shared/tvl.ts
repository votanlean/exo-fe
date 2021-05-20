export const useFarms = (): Farm[] => {
  const farms = useSelector((state: State) => state.farms.data)
  return farms
}

// export const useTotalValue = (): BigNumber => {
//   const farms = useFarms();
//   const bnbPrice = usePriceBnbBusd();
//   const cakePrice = usePriceCakeBusd();
//   let value = new BigNumber(0);
//   for (let i = 0; i < farms.length; i++) {
//     const farm = farms[i]
//     if (farm.lpTotalInQuoteToken) {
//       let val;
//       if (farm.quoteTokenSymbol === QuoteToken.BNB) {
//         val = (bnbPrice.times(farm.lpTotalInQuoteToken));
//       }else if (farm.quoteTokenSymbol === QuoteToken.CAKE) {
//         val = (cakePrice.times(farm.lpTotalInQuoteToken));
//       }else{
//         val = (farm.lpTotalInQuoteToken);
//       }
//       value = value.plus(val);
//     }
//   }
//   return value;
// }