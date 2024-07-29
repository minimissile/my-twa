import ReactDOM from 'react-dom/client'
import { TonConnectUIProvider } from '@tonconnect/ui-react'
import App from './App.tsx'
// import './index.css'

const manifestUrl = `${window.location.origin}/tonconnect-manifest.json`
// const manifestUrl = 'https://raw.githubusercontent.com/ton-community/tutorials/main/03-client/test/public/tonconnect-manifest.json';
// const manifestUrl = 'https://minimissile.github.io/my-twa/tonconnect-manifest.json'
// const manifestUrl = `https://ton-connect.github.io/demo-dapp-with-backend/tonconnect-manifest.json`

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <TonConnectUIProvider manifestUrl={manifestUrl}>
    <App />
  </TonConnectUIProvider>,
)
