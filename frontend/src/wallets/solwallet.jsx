import { useState } from "react"
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl"
import { Button } from "@/components/ui/button";

export function SolanaWallet({ mnemonic }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    // store objects with publicKey, secretKey (hex or base58), revealed flag
    const [wallets, setWallets] = useState([]);

    // small helper to copy text with navigator.clipboard fallback
    async function copyText(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            try {
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.setAttribute('readonly', '');
                textarea.style.position = 'absolute';
                textarea.style.left = '-9999px';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                return true;
            } catch (e) {
                console.error('Copy failed', e);
                return false;
            }
        }
    }

    return (
        <div className="space-y-4" style={{ margin: '20px' }}>
            <Button className="w-full" onClick={async function() {
                if (!mnemonic) return alert('Set mnemonic first');
                const seedBuffer = await mnemonicToSeed(mnemonic);
                // ed25519-hd-key expects hex seed
                const seedHex = seedBuffer.toString('hex');
                const path = `m/44'/501'/${currentIndex}'/0'`;
                const { key } = derivePath(path, seedHex);
                // key is a Buffer/Uint8Array of 32 bytes seed for ed25519
                const keySeed = new Uint8Array(key);
                const keypair = nacl.sign.keyPair.fromSeed(keySeed);
                const solKeypair = Keypair.fromSecretKey(keypair.secretKey);

                const publicKey = solKeypair.publicKey.toBase58();
                // secretKey is 64 bytes (seed + pubkey) from nacl; store it as hex for compactness
                const secretKeyHex = Buffer.from(keypair.secretKey).toString('hex');

                setCurrentIndex(prev => prev + 1);
                setWallets(prev => [...prev, { publicKey, secretKeyHex, revealed: false }]);
            }}>
                Add SOL Wallet
            </Button>

            <div className="space-y-2" style={{ margin: '20px' }}>
                {wallets.map((w, i) => (
                    <div key={`${w.publicKey}-${i}`} className="p-3 bg-muted rounded-md border" style={{ margin: '15px' }}>
                        <div className="text-xs text-muted-foreground mb-1" style={{ margin: '8px' }}>Wallet {i + 1}</div>

                        <div className="mb-2" style={{ margin: '8px' }}>
                            <div className="text-[10px] text-muted-foreground">Public Key</div>
                            <div className="font-mono text-sm break-all">{w.publicKey}</div>
                            <div className="mt-2 flex gap-2" style={{ margin: '5px' }}>
                                <Button size="sm" className="px-2" onClick={async () => { await copyText(w.publicKey); }}>Copy Public</Button>
                            </div>
                        </div>

                        <div>
                            <div className="text-[10px] text-muted-foreground">Secret Key</div>
                            <div className="font-mono text-sm break-all">
                                {w.revealed ? w.secretKeyHex : '••••••••••••••••••••••'}
                            </div>
                            <div className="mt-2 flex gap-2" style={{ margin: '5px' }}>
                                <Button size="sm"  style={{ margin: '5px' }} className="px-2" onClick={async () => {
                                    setWallets(prev => prev.map((item, idx) => idx === i ? { ...item, revealed: !item.revealed } : item));
                                }}>{w.revealed ? 'Hide' : 'Reveal'}</Button>

                                <Button style={{ margin: '5px' }} size="sm" className="px-2" onClick={async () => { await copyText(w.secretKeyHex); }}>Copy Secret</Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}