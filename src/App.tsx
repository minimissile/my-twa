import {
  Account,
  ConnectAdditionalRequest,
  TonConnectButton,
  TonProofItemReplySuccess,
  useTonConnectUI,
} from '@tonconnect/ui-react'
import { useCounterContract } from './hooks/useCounterContract'
import { useTonConnect } from './hooks/useTonConnect'
import { useEffect, useState } from 'react'
import '@twa-dev/sdk'
import './App.css'
import axios from 'axios'

function App() {
  const [tonConnectUI] = useTonConnectUI()
  const { connected } = useTonConnect()
  const { value, address, sendIncrement } = useCounterContract()
  const { modal } = tonConnectUI
  const [payload, setPayload] = useState<string>('')
  const [logining, setLogining] = useState<boolean>(false)

  useEffect(() => {
    tonConnectUI.onStatusChange(async (wallet) => {
      try {
        if (wallet) {
          const tonProof = wallet.connectItems?.tonProof
          const account: Account = wallet.account
          console.log('tonProof', tonProof)
          if (tonProof) {
            if ('proof' in tonProof) {
              await fetchLogin(tonProof, account)
              return
            }
            console.error(tonProof.error)
          }
        }
      } catch (e) {
        console.log('onStatusChange error', e)
      }
    })
  }, [tonConnectUI])

  /**
   * 点击登录
   */
  const handleLogin = async () => {
    try {
      // 先判断有没有建立连接
      if (tonConnectUI.connected) {
        await tonConnectUI.disconnect()
      }
      tonConnectUI.modal.open()
      await generatePayload()
    } catch (e) {
      console.log('登录', e)
    }
  }

  /**
   * 生成Payload
   */
  const generatePayload = async () => {
    try {
      tonConnectUI.setConnectRequestParameters({ state: 'loading' })
      const payloadStr = await fetchPayload()
      if (payloadStr) {
        const value: ConnectAdditionalRequest = { tonProof: payloadStr }
        console.log('生成tonProof', value)
        tonConnectUI.setConnectRequestParameters({ state: 'ready', value })
      }
    } catch (e) {
      tonConnectUI.setConnectRequestParameters(null)
      console.error(e)
    }
  }

  /**
   * 请求登录
   */
  const fetchLogin = async (tonProof: TonProofItemReplySuccess, account: Account) => {
    const { proof } = tonProof
    const url = 'https://test.gametop.me/gametop/wallet/ton/login'
    try {
      setLogining(true)
      const { data } = await axios.post(url, {
        chain: 'TON-TESTNET',
        tonProof: {
          address: account.address,
          network: account.chain,
          proof: {
            timestamp: proof.timestamp,
            domain: {
              lengthBytes: 21,
              value: 'ton-connect.github.io',
            },
            signature: proof.signature,
            payload: proof.payload,
            state_init: account.walletStateInit,
          },
        },
      })
      setLogining(false)

      if (data.code === 200) {
        console.log('登录成功')
      } else {
        console.log('登录失败')
      }
      console.log(data)
    } catch (e) {
      setLogining(false)
      console.log('login error', e)
    }
  }

  const fetchPayload = async () => {
    const url = 'https://test.gametop.me/gametop/wallet/ton/payload'
    const { data } = await axios.get(url)
    if (data.code === 200) {
      return data.data
    }
  }

  return (
    <div className="App">
      <div className="Container">
        <TonConnectButton />

        <button className={'Button'} onClick={handleLogin}>
          {logining ? '登录中' : '登录'}
        </button>

        <div className="Card">
          <b>Counter Address</b>
          <div className="Hint">{address?.slice(0, 30) + '...'}</div>
        </div>

        <a
          className={`Button ${connected ? 'Active' : 'Disabled'}`}
          onClick={() => {
            sendIncrement()
          }}
        >
          Increment
        </a>
        <p>v 1.1.1</p>
      </div>
    </div>
  )
}

export default App
