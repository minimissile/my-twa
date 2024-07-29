import './App.css'
import { ConnectedWallet, TonConnectButton, useTonConnectUI } from '@tonconnect/ui-react'
import { useTonConnect } from './hooks/useTonConnect'
import { useCounterContract } from './hooks/useCounterContract'
import '@twa-dev/sdk'
import { useEffect } from 'react'

function App() {
  const [tonConnectUI] = useTonConnectUI()
  const { connected } = useTonConnect()
  const { value, address, sendIncrement } = useCounterContract()
  const { modal } = tonConnectUI

  useEffect(() => {
    tonConnectUI.onStatusChange((wallet: any) => {
      console.log('walletsssss', wallet)

      const tonProof = wallet.connectItems?.tonProof
      console.log('tonProof', tonProof)

      if (tonProof) {
        if ('proof' in tonProof) {
          // this.checkProof(tonProof.proof, wallet.account)
          return
        }

        console.error(tonProof.error)
      }
    })
  }, [tonConnectUI])

  const onSign = () => {
    const msg = '123456'
    console.log(tonConnectUI)
  }

  return (
    <div className="App">
      <div className="Container">
        <p>1</p>
        <TonConnectButton />

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

        <div className={'Button'} onClick={onSign}>
          签名
        </div>

        <p>v 1.1.1</p>
      </div>
    </div>
  )
}

export default App
