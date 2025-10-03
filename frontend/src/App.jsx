import { useEffect, useState } from 'react'
import './App.css'
import { Button } from '@/components/ui/button'
import PhaseGrid from './components/PhaseGrid'
import { generateMnemonic } from "bip39";
import { EthWallet } from './wallets/ethwallet'
import { SolanaWallet } from './wallets/solwallet'

function App() {
  const [mnemonic, setMnemonic] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Force-enable dark theme by adding the class to <html>
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl font-extrabold mb-4">Web3 Wallet (Demo)</h1>

      <div className="mb-4">
        <div className="flex items-center space-x-2">
          <Button
            onClick={async function () {
              const mn = await generateMnemonic();
              setMnemonic(mn);
            }}
          >
            Create Seed Phrase
          </Button>

          <Button
            onClick={async function () {
              if (!mnemonic) return;
              try {
                await navigator.clipboard.writeText(mnemonic);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              } catch (e) {
                // clipboard may be unavailable in some contexts; fallback to selection
                const textarea = document.createElement('textarea');
                textarea.value = mnemonic;
                document.body.appendChild(textarea);
                textarea.select();
                try {
                  document.execCommand('copy');
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                } finally {
                  document.body.removeChild(textarea);
                }
              }
            }}
            disabled={!mnemonic}
          >
            {copied ? 'Copied' : 'Copy All'}
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <strong>Mnemonic:</strong>
        <div className="break-words max-w-2xl">{mnemonic || <em>not set</em>}</div>
      </div>
      <PhaseGrid mnemonic={mnemonic} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">Ethereum</h2>
          <EthWallet mnemonic={mnemonic} />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Solana</h2>
          <SolanaWallet mnemonic={mnemonic} />
        </div>
      </div>

      
    </div>
  )
}

export default App
