import Head from 'next/head';
import Footer from '../Footer';
import Header from '../Header';

const MainLayout = ({ children }) => (
  <div className="main-container">
    <Head>
      <link rel="icon" href="/favicon.png" />
    </Head>

    <Header />

    {children}

    <Footer />
  </div>
);

export default MainLayout;
