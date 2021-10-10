import { useEffect, useState } from 'react'
import detectEthereumProvider from '@metamask/detect-provider'
import Web3 from 'web3'
import './App.css'

function App() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
  })

  const [account, setAccount] = useState(null)

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider()

      if (provider) {
        setWeb3Api({
          web3: new Web3(provider),
          provider,
        })
      } else {
        console.error('Please install Meta Mask!')
      }
    }

    loadProvider()
  }, [])

  useEffect(() => {
    const account = async () => {
      const accounts = await web3Api.web3.eth.getAccounts()

      setAccount(accounts[0])
    }

    web3Api.web3 && account()
  }, [web3Api.web3])

  const handleProviderConnection = async () => {
    web3Api.provider.request({ method: 'eth_requestAccounts' })
  }

  return (
    <>
      <div className="faucet-wrapper">
        <div className="faucet">
          <span>
            <strong>Account: </strong>
            <span>
              {account ? (
                account
              ) : (
                <button
                  className="button is-small "
                  onClick={handleProviderConnection}
                >
                  Connect wallet
                </button>
              )}
            </span>
          </span>
          <div className="balance-view mb-4 my-4 is-size-2">
            Balance: <strong>10</strong> ETH
          </div>

          <button className="button is-link   mr-2">Donate</button>
          <button className="button is-primary  mr-2">Withdraw</button>
        </div>
      </div>
    </>
  )
}

export default App
