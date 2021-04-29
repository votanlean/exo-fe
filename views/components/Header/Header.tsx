import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Nav from '../Nav/Nav'
import styles from './header.module.scss'

const Header = () => {
  const [active, setActive] = useState(false)

  const onScroll = (e) => {
    if (e.target.documentElement.scrollTop > 400) {
      setActive(true)
    } else {
      setActive(false)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', onScroll)

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`${styles.header} ${active ? styles.smallHeader : ''}`}>
      <div className="container">
        <div className="d-flex items-center">
          <Link href="/">
            <a className={styles.logo}>
              <img src="/static/images/logo.svg" alt="logo" />
            </a>
          </Link>
          <Nav />
        </div>
      </div>
    </header>
  )
}

export default Header
