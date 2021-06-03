## Deployment

Ensure these constants are correct when modify smart contracts:

config/constants/contracts.ts (orchestrator, timeLock)

config/constants/farms.ts (LP pools)

config/constants/seedingPools.ts (seeding pools)

config/tokens.ts (tEXO)

## Troubleshooting

Make sure you are in the right chain (mainnet 56, testnet 97)

Make sure tEXO ownership is transfer to orchestrator, otherwise you cannot stake the 2nd time.
