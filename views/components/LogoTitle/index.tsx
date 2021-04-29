import react from 'react'
import styles from './logoTitle.module.scss'

const LogoTitle = ({ firstText, secondText, color }) => {
  return (
    <div className={`${styles.logoText} relative`}>
      <img src="/static/images/icon-white.svg" alt="logo title" />
      <h2 style={{ color }}>
        <span>{firstText}</span>
        <span>{secondText}</span>
      </h2>
    </div>
  )
}

export default LogoTitle
