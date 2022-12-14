import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Box } from '@material-ui/core';

import LogoTitle from '../components/LogoTitle';
import { ecosystemData } from '../constant/HomeData';
import { isAddress } from '../utils/web3';
import rot13 from '../utils/encode';
import { useQueryParam, StringParam } from 'use-query-params';
import Cookies from 'universal-cookie';

import BannerCoinTelegraph from 'components/BannerCoinTelegraph';

const Home = () => {
  const cookies = new Cookies();
  const [ref] = useQueryParam('ref', StringParam);

  if (ref) {
    if (isAddress(rot13(ref))) {
      cookies.set('ref', ref);
    }
  }
  return (
    <Box style={{ background: '#ffffff' }}>
      <Head>
        <title>Home | tExo</title>
      </Head>

      <section
        className="hero"
        style={{
          background: `url('/static/images/banner.jpg') center / cover no-repeat`,
        }}
      >
        <div className="container h-full">
          <div className="d-flex column justify-center item-start h-full">
            <h1>
              <span>Unifying</span>
              <span>the Entire </span>
              <span>Financial Ecosystem</span>
            </h1>
            <p>
              ExoniumDEX is a <i>decentralised exchange (DEX)</i> primarily
              designed to be a unifying exchange of all cryptocurrencies and
              synthetic assets.
            </p>
            <Link href="/tEXO-Whitepaper.pdf">
              <a className="button btn-cta">READ THE WHITEPAPER</a>
            </Link>
          </div>
        </div>
      </section>

      <section className="banner">
        <BannerCoinTelegraph />
      </section>

      <section className="the-use">
        <div className="container">
          <div className="d-flex items-center the-use-grid">
            <LogoTitle firstText="The " secondText="use" color="#103C5B" />
            <div className="content">
              <p>
                ExoniumDEX will be used to support trading for all kinds of
                cryptocurrency projects and traditional assets, providing
                significant liquidity to the decentralised finance (DEFI)
                universe by being all-inclusive.
              </p>
              <p>
                As a one-stop DEX, ExoniumDEX will be positioned as a{' '}
                <strong>pivotal platform in the cryptocurrency space</strong>,
                allowing inter-exchange of all coins regardless of blockchain
                technology in a safe, transparent and permissionless
                environment.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="ecosystem-token">
        <div className="container">
          <LogoTitle
            firstText="The Ecosystem "
            secondText="Tokens"
            color="#A2DDF9"
          />
          {ecosystemData.map((item, index) => (
            <div className={`ecosystem-item color-${item.color}`} key={index}>
              <div className="d-flex justify-between items-center ecosystem-grid">
                <div className="title">
                  <p>{index + 1}.</p>
                  <h2>{item.title}</h2>
                  {item.logo ? item.logo : ''}
                </div>
                <div className="content">{item.desc()}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="ecosystem-partecipants">
        <div className="container logo-text">
          <LogoTitle
            firstText="The Ecosystem "
            secondText="Participants"
            color="#0F0F0F"
          />
        </div>
        <div className="container mr-auto partecipants-item">
          <div className="d-flex">
            <div className="first-col item first-item">
              <div className="title">
                <p>1.</p>
                <h2>Trader</h2>
              </div>
              <div className="content">
                <p>
                  A trader engages in buying and selling tASSET or TEXO and
                  benefits from price exposure. Trading can be executed via
                  Automated Market Maker on our platform
                </p>
              </div>
            </div>
            <div className="second-col item">
              <div className="title">
                <p>2.</p>
                <h2>tASSET Minter</h2>
              </div>
              <div className="content">
                <p>
                  A minter acts as a user that enters into a collateralized debt
                  position (CDP) in order to obtain newly minted tokens of an
                  tASSET. CDPs can accept collateral in either tDollar or
                  tASSET, and must maintain a collateral ratio above the
                  tASSET's minimum. Collateral can be withdrawn as long as the
                  CDP's collateral ratio remains above the minimum. Minters can
                  adjust the CDP's collateral ratio by burning tASSET or
                  depositing more collateral.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="container ml-auto partecipants-item">
          <div className="d-flex item">
            <div className="third-col">
              <div className="title">
                <p>3.</p>
                <h2>Liquidity Provider</h2>
              </div>
              <div className="content">
                <p>
                  A liquidity provider adds equal amounts of an tASSET and
                  tDollar to the corresponding liquidity pool on ExoniumDEX,
                  which increases liquidity for that market. By providing
                  liquidity to the pool, the liquidity provider will receive
                  newly minted LP tokens from smart contracts. This LP token
                  represents the liquidity provider's share in the pool and
                  receives rewards from the pool's trading fees. When reclaiming
                  the share of tASSET and tDollar from the pool, the LP will be
                  burnt.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="container mr-auto partecipants-item">
          <div className="d-flex">
            <div className="first-col"></div>
            <div className="second-col fourth-col item">
              <div className="title">
                <p>4.</p>
                <h2>Staker</h2>
              </div>
              <div className="content">
                <p>
                  A staker acts as a user that stakes LP Tokens or just tEXO in
                  order to earn ExoniumDEX governance and yield token, tEXO.
                  Stakers are incentivized for being part of ExoniumDEX
                  ecosystem and encourage perpetual support to the development
                  of the platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="audit-parties">
        <div className="container logo-text">
          <LogoTitle firstText="Audit " secondText="Parties" color="#0F0F0F" />
        </div>
        <div className="container d-flex items-center parties-logo">
          <div className="techrate-logo">
            <a href="https://github.com/TechRate/Smart-Contract-Audits/blob/main/ExoniumDEX%20Standart%20Smart%20Contract%20Security%20Audit.pdf">
              <img src="/static/images/techrate-logo.png" alt="techrate" />
            </a>
          </div>
          <div className="blockchain-fg-logo">
            <a href="https://github.com/BCFG-Audit/Smart_Contract_Security_Audits/blob/main/ExoniumDEX_BCFG_AUDIT_Final.pdf">
              <img
                src="/static/images/blockchain-focus-group.png"
                alt="blockchain-focus-group"
              />
            </a>
          </div>
        </div>
      </section>
      <section className="road-map">
        <div className='road-map container'>
          <div className="items-center">
            <img className='road-map-img' src="/static/images/road-map.png" alt="techrate" />
          </div>
        </div>
      </section>
    </Box>
  );
};

export default Home;
