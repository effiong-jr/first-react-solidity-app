import { useEffect, useState, useCallback } from 'react'
import detectEthereumProvider from '@metamask/detect-provider'
import { loadContract } from './utils/load-contract'
import Web3 from 'web3'
import './App.css'

function App() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null,
  })

  const [balance, setBalance] = useState(null)
  const [account, setAccount] = useState(null)

  const onAccountChange = (provider) => {
    provider.on('accountsChanged', (accounts) => setAccount(accounts[0]))
  }

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider()

      if (provider) {
        const contract = await loadContract('Faucet', provider)

        onAccountChange(provider)

        setWeb3Api({
          web3: new Web3(provider),
          provider,
          contract,
        })
      } else {
        console.error('Please install Meta Mask!')
      }
    }

    loadProvider()
  }, [])

  useEffect(() => {
    const { contract, web3 } = web3Api

    const loadBalance = async () => {
      const balance = await web3.eth.getBalance(contract.address)
      const toEther = await web3.utils.fromWei(balance, 'ether')
      setBalance(toEther)
    }

    web3Api.contract && loadBalance()
  }, [web3Api])

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

  const addFunds = useCallback(async () => {
    const { contract, web3 } = web3Api

    if (account) {
      await contract.addFunds({
        from: account,
        value: web3.utils.toWei('1', 'ether'),
      })

      window.location.reload()
    } else {
      alert('Connect to a wallet')
    }
  }, [account, web3Api])

  const withdrawFunds = async () => {
    const { web3, contract } = web3Api
    const withdrawAmount = web3.utils.toWei('0.1', 'ether')

    if (account) {
      await contract.withdraw(withdrawAmount, {
        from: account,
      })

      window.location.reload()
    } else {
      alert('Please Connect to a wallet.')
    }
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
              ) : !web3Api.provider ? (
                <span className="notification is-warning is-rounded">
                  No ethereum wallet found. Please{' '}
                  <a
                    href="https://metamask.io/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Install Meta Mask!
                  </a>
                </span>
              ) : (
                <button
                  className="button is-small"
                  onClick={handleProviderConnection}
                >
                  Connect wallet
                </button>
              )}
            </span>
          </span>
          <div className="balance-view mb-4 my-4 is-size-2">
            Balance: <strong>{balance}</strong> ETH
          </div>

          <button
            className="button is-link mr-2"
            disabled={!account && true}
            onClick={addFunds}
          >
            Donate 1 eth
          </button>
          <button
            className="button is-primary  mr-2"
            disabled={!account && true}
            onClick={withdrawFunds}
          >
            Withdraw
          </button>
        </div>
      </div>
    </>
  )
}

export default App
