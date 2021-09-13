import BigNumber from "bignumber.js"

export const tokenEarnedPerThousandDollars = ({
  numberOfDays,
  farmApr,
  tokenPrice,
  autocompound = false,
  roundingDecimals = 2,
  compoundFrequency = 1,
  performanceFee = 0,
}) => {
  // Everything here is worked out relative to a year, with the asset compounding at the compoundFrequency rate. 1 = once per day
  const timesCompounded = 365 * compoundFrequency
  // We use decimal values rather than % in the math for both APY and the number of days being calculates as a proportion of the year
  let aprAsDecimal = farmApr / 100

  if (performanceFee) {
    // Reduce the APR by the % performance fee
    const feeRelativeToApr = (farmApr / 100) * performanceFee
    const aprAfterFee = farmApr - feeRelativeToApr
    aprAsDecimal = aprAfterFee / 100
  }

  const daysAsDecimalOfYear = numberOfDays / 365
  // Calculate the starting TOKEN balance with a dollar balance of $1000.
  const principal = 1000 / tokenPrice

  let finalAmount = 0;

  if (autocompound) {
    // This is a translation of the typical mathematical compounding APY formula. Details here: https://www.calculatorsoup.com/calculators/financial/compound-interest-calculator.php
    finalAmount = principal * (1 + aprAsDecimal / timesCompounded) ** (timesCompounded * daysAsDecimalOfYear)
  } else {
    finalAmount = principal * (1 + aprAsDecimal * daysAsDecimalOfYear)
  }
  // To get the TOKEN amount earned, deduct the amount after compounding (finalAmount) from the starting TOKEN balance (principal)
  const interestEarned = finalAmount - principal

  return parseFloat(interestEarned.toFixed(roundingDecimals))
}

export const getRoi = ({ amountEarned, amountInvested }) => {
  const percentage = (amountEarned / amountInvested) * 100
  return percentage
}

export const convertAprToApyYO = (data: any) => {
  const {
    lpRewardsApr,
    tokenRewardsApr,
    tEXOApr,
  } = data || {
    lpRewardsApr: 0,
    tokenRewardsApr: 0,
    tEXOApr: 0,
  };
  const tokenPrice = 1;
  const performanceFee = 0.8;
  const numberOfDays = 365;
  const oneThousandDollarsWorthOfToken = 1000 / tokenPrice;

  const calculatedCompoundTokenEarned365D = tokenEarnedPerThousandDollars({
    farmApr: tokenRewardsApr || 0,
    tokenPrice,
    autocompound: true,
    performanceFee,
    numberOfDays
  });

  const tokenRewardApy = getRoi({
    amountEarned: calculatedCompoundTokenEarned365D,
    amountInvested: oneThousandDollarsWorthOfToken,
  });

  const apy = (tokenRewardApy || 0) + (lpRewardsApr || 0) + (tEXOApr || 0);


  return {
    apy: new BigNumber(apy),
    tokenRewardApy: new BigNumber(tokenRewardApy),
    lpRewardsApr: new BigNumber(lpRewardsApr),
    tEXOApr: new BigNumber(tEXOApr),
  }
}