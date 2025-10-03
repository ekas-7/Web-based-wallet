import { useState } from 'react'
import './App.css'
import { Button } from '@/components/ui/button'
import { generateMnemonic } from "bip39";
import { EthWallet } from './wallets/ethwallet'
import { SolanaWallet } from './wallets/solwallet'

function App() {
  const [mnemonic, setMnemonic] = useState("");

  return (
    <div style={{ padding: 20 }}>
      <h1>Web3 Wallet (Demo)</h1>

      <div style={{ marginBottom: 12 }}>
        <Button onClick={async function() {
          const mn = await generateMnemonic();
          setMnemonic(mn)
        }}>
          Create Seed Phrase
        </Button>
      </div>

      <div style={{ marginBottom: 12 }}>
        <strong>Mnemonic:</strong>
        <div style={{ wordBreak: 'break-word', maxWidth: 600 }}>{mnemonic || <em>not set</em>}</div>
      </div>

      <div style={{ display: 'flex', gap: 24 }}>
        <div style={{ flex: 1 }}>
          <h2>Ethereum</h2>
          <EthWallet mnemonic={mnemonic} />
        </div>
        <div style={{ flex: 1 }}>
          <h2>Solana</h2>
          <SolanaWallet mnemonic={mnemonic} />
        </div>
      </div>
    </div>
  )
}

export default App
