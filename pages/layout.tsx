import Head from 'next/head'
import Header from '~views/components/Header/Header'
import Footer from '~views/components/Footer'

const MainLayout = ({ children }) => (
  <div className="main-container">
    <Head>
      <link rel="icon" href="/favicon.png" />
    </Head>

    <Header />

    {children}

    <Footer />
  </div>
)

export default MainLayout
