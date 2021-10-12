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

  // console.log(web3Api.contract.web3.eth.getBalance())

  const [balance, setBalance] = useState(null)
  const [account, setAccount] = useState(null)

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider()

      const contract = await loadContract('Faucet', provider)

      if (provider) {
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
    } else {
      alert('Connect to a wallet')
    }
  }, [account, web3Api])

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

          <button className="button is-link mr-2" onClick={addFunds}>
            Donate 1 eth
          </button>
          <button className="button is-primary  mr-2">Withdraw</button>
        </div>
      </div>
    </>
  )
}

export default App
