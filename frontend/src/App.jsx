import { useEffect, useState } from 'react'
import './App.css'
import { Button } from '@/components/ui/button'
import PhaseGrid from './components/PhaseGrid'
import { generateMnemonic, validateMnemonic } from "bip39";
import { EthWallet } from './wallets/ethwallet'
import { SolanaWallet } from './wallets/solwallet'

function App() {
  const [mnemonic, setMnemonic] = useState("");
  const [copied, setCopied] = useState(false);
  const [recoveryText, setRecoveryText] = useState('');

  // load mnemonic from localStorage if present
  useEffect(() => {
    const stored = localStorage.getItem('wbw.mnemonic');
    if (stored) setMnemonic(stored);
  }, []);

  useEffect(() => {
    // Force-enable dark theme by adding the class to <html>
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div style={{ marginBottom: '20px' }} className="p-6 min-h-screen max-w-6xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-8 text-center">Web3 Wallet (Demo)</h1>

      <div className="mb-8 flex flex-col sm:flex-row justify-center items-center gap-6 max-w-md mx-auto">
        <div style={{ marginBottom: '20px' }} className="w-full mb-6 sm:mb-0">
          <Button
            onClick={async function () {
              const mn = await generateMnemonic();
              setMnemonic(mn);
              localStorage.setItem('wbw.mnemonic', mn);
            }}
            className="w-full"
          >
            Create Seed Phrase
          </Button>
        </div>

        <div style={{ marginBottom: '20px' }} className="w-full mb-6 sm:mb-0">
          <div className="flex flex-col">
            <Button
              onClick={async function () {
                if (!mnemonic) return;
                // Try navigator.clipboard first
                try {
                  await navigator.clipboard.writeText(mnemonic);
                } catch (err) {
                  // Fallback for older browsers
                  try {
                    const textarea = document.createElement('textarea');
                    textarea.value = mnemonic;
                    textarea.setAttribute('readonly', '');
                    textarea.style.position = 'absolute';
                    textarea.style.left = '-9999px';
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                  } catch (e) {
                    console.error('Copy failed', e);
                    return;
                  }
                }

                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              disabled={!mnemonic}
              className="w-full"
              aria-pressed={copied}
            >
              {copied ? '✓ Copied' : 'Copy All'}
            </Button>

            <div style={{ marginTop: '8px' }}>
              <Button
                onClick={() => {
                  setMnemonic('');
                  localStorage.removeItem('wbw.mnemonic');
                }}
                className="w-full"
              >
                Clear Stored Seed (This device)
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 p-6 bg-card rounded-lg border border-border">
        <h2 className="text-lg font-semibold mb-3">Seed Phrase</h2>
        <div className="bg-muted rounded-md p-4 font-mono text-sm break-words leading-relaxed">
          {mnemonic || <em className="text-muted-foreground">Generate a seed phrase to get started</em>}
        </div>
      </div>

      <div className="mb-8 p-6 bg-card rounded-lg border border-border">
        <h2 className="text-lg font-semibold mb-3">Recover Seed Phrase</h2>
        <div className="flex flex-col gap-2">
          <textarea
            value={recoveryText}
            onChange={(e) => setRecoveryText(e.target.value)}
            placeholder="Paste your 12/24-word seed phrase here"
            className="w-full p-2 rounded-md bg-muted text-sm font-mono"
            rows={3}
          />
          <div className="flex gap-2">
            <Button onClick={() => {
              if (!recoveryText) return alert('Paste a seed phrase first');
              try {
                // Normalize common user input problems: trim, lowercase, Unicode NFKD
                const candidate = recoveryText.trim().toLowerCase().normalize('NFKD');
                const valid = validateMnemonic(candidate);
                if (!valid) return alert('Invalid seed phrase (check words and order)');
                setMnemonic(candidate);
                localStorage.setItem('wbw.mnemonic', candidate);
                alert('Seed restored on this device');
              } catch (e) {
                console.error(e);
                alert('Failed to validate seed phrase');
              }
            }} className="px-4">Restore Seed</Button>
            <Button onClick={() => setRecoveryText('')} className="px-4">Clear</Button>
          </div>
        </div>
      </div>
      <PhaseGrid mnemonic={mnemonic} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4 text-center">Ethereum Wallets</h2>
          <div className="p-6 bg-card rounded-lg border border-border">
            <EthWallet mnemonic={mnemonic} />
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4 text-center">Solana Wallets</h2>
          <div className="p-6 bg-card rounded-lg border border-border">
            <SolanaWallet mnemonic={mnemonic} />
          </div>
        </div>
      </div>

      
    </div>
  )
}

export default App
