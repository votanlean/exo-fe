export const ecosystemData = [
  {
    title: 'tEXO',
    desc: () => (
      <>
        <p>
          <strong>
            tEXO is the platform governance token that allows token
            holders to vote on proposals and approve new asset listings on
            ExoniumDEX.
          </strong>
        </p>
        <p>
          After initial equitable distribution of tEXO via a seed staking
          pool, tEXO will be the yield token to incentivise liquidity
          providers on ExoniumDEX. tEXO will also need the key collateral
          for tDollar - ExoniumDEX’s stable coin.
        </p>
      </>
    ),
    color: 'blue-primary'
  },
  {
    title: 'FAANG',
    desc: () => (
      <>
        <p>
          <strong>
            To incentivise initial liquidity providers, users who staked tEXO LPs
            before the synthetic assets platform is launched will receive FAANG
            tokens as yield reward.
          </strong>
        </p>
        <p>
          After the launch of synthetic assets, users will be able to redeem tFB,
          tAAPL, tAMZN, tNFLX and tGOOGL. These synthetic tokens will be minted
          and bought with funds from tEXO vault.
        </p>
        <span>
          *Do note that FAANG will be the yield token for a limited period of time
          only. Thereafter, tEXO will be the yield token for liquidity providers.
        </span>
      </>
    ),
    color: 'light-blue'
  },
  {
    title: 'tASSET - Synthetics',
    desc: () => (
      <>
        <p>
          <strong>
            tASSET are blockchain tokens minted on ExoniumDEX that reflect prices
            of real-world assets on-chain.
          </strong>
        </p>
        <p>
          tASSET allows traders to have price exposure and trading opportunities
          to off-chain assets while enabling fractional ownership, open access and
          censorship resistance as any other cryptocurrency.
        </p>
        <span>
          *Do note that, unlike traditional shares which serve to represent a
          real, underlying asset such as Apple or Tesla stocks, tASSET is purely
          synthetic and only captures the price movement of the corresponding
          asset through an oracle.
        </span>
      </>
    ),
    color: 'danube'
  },
  {
    title: 'tDollar',
    desc: () => (
      <>
        <p>
          <strong>
            tDollar will be used as collateral for new synthetic assets minted on
            Exonium DEX.
          </strong>
        </p>
        <p>
          Valuation of tDollar will be backed by total market value of tEXO Vault.
          New tDollar will be minted based on new deposits into tEXO vault. Upon
          withdrawal of tEXO from tEXO vault, tDollar deposited will be burnt.
        </p>
      </>
    ),
    color: 'dodger-blue'
  },
]