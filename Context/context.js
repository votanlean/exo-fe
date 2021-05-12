import React, { useState } from 'react'

export const AccountContext = React.createContext();

const AccountContextProvider = ({children}) => {
  const [account, setAccount] = useState(null)

  const accountContextData = {
    account,
    updateAccount: (foo) => {
      setAccount(foo)
    }
  }

  return (
    <AccountContext.Provider value={accountContextData}>{children}</AccountContext.Provider>
  )
}

export default AccountContextProvider
