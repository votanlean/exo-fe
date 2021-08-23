import React from 'react';
import { Paper } from '@material-ui/core';
import Head from 'next/head';
import ComingSoon from '../../components/ComingSoon';

function Governance() {
  return (
    <Paper className="paper-root">
      <Head>
        <title>Governance | tExo</title>
      </Head>
      <ComingSoon />
    </Paper>
  );
}

export default Governance;
