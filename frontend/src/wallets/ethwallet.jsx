import { useEffect, useState } from "react";
import { HDNodeWallet, ethers } from "ethers";
import { Button } from "@/components/ui/button";

export const EthWallet = ({ mnemonic }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    // store objects so we can keep address + privateKey + reveal state
    const [wallets, setWallets] = useState([]);
    const [balances, setBalances] = useState({});

    // create a provider from Alchemy HTTP URL configured via Vite env
    const ALCHEMY_URL = import.meta.env.VITE_ALCHEMY_HTTP_URL;
    const provider = ALCHEMY_URL ? new ethers.JsonRpcProvider(ALCHEMY_URL) : null;

    // restore previously-derived wallet count from localStorage and rebuild wallets
    useEffect(() => {
        const storedMnemonic = localStorage.getItem('wbw.mnemonic');
        const storedCount = parseInt(localStorage.getItem('wbw.eth.count') || '0', 10) || 0;
        if (mnemonic && storedMnemonic === mnemonic && storedCount > 0) {
            // rebuild wallets from mnemonic
            const rebuilt = [];
            for (let idx = 0; idx < storedCount; idx++) {
                const path = `m/44'/60'/0'/0/${idx}`;
                const wallet = HDNodeWallet.fromPhrase(mnemonic, path);
                rebuilt.push({ address: wallet.address, privateKey: wallet.privateKey, revealed: false });
            }
            setWallets(rebuilt);
            setCurrentIndex(storedCount);
        } else if (!mnemonic) {
            // mnemonic removed; clear derived wallets
            setWallets([]);
            setCurrentIndex(0);
            localStorage.removeItem('wbw.eth.count');
        }
    }, [mnemonic]);

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
            <Button
                className="w-full"
                onClick={function () {
                    if (!mnemonic) return alert("Set mnemonic first");

                    // Build the BIP44 path for Ethereum
                    const path = `m/44'/60'/0'/0/${currentIndex}`;

                    // ethers v6: fromPhrase takes (mnemonic, path?) where path should be a string.
                    const wallet = HDNodeWallet.fromPhrase(mnemonic, path);

                    const address = wallet.address;
                    const privateKey = wallet.privateKey;
                    console.log("Derived ETH path:", path, "address:", address);

                    const nextIndex = currentIndex + 1;
                    setCurrentIndex(nextIndex);
                    setWallets((prev) => [...prev, { address, privateKey, revealed: false }]);
                    try {
                        localStorage.setItem('wbw.eth.count', String(nextIndex));
                        // also ensure the mnemonic is stored for matching on reload
                        if (mnemonic) localStorage.setItem('wbw.mnemonic', mnemonic);
                    } catch (e) {
                        console.warn('Failed to persist wallet count', e);
                    }
                }}
            >
                Add ETH Wallet
            </Button>

            <div className="space-y-2" style={{ margin: '20px' }}>
                {wallets.map((w, i) => (
                    <div key={`${w.address}-${i}`} className="p-3 bg-muted rounded-md border" style={{ margin: '15px' }}>
                        <div className="text-xs text-muted-foreground mb-1" style={{ margin: '8px' }}>Wallet {i + 1}</div>

                        <div className="mb-2" style={{ margin: '8px' }}>
                            <div className="text-[10px] text-muted-foreground">Address</div>
                            <div className="font-mono text-sm break-all">{w.address}</div>
                            <div className="mt-2 flex gap-2" style={{ margin: '8px' }}>
                                    <Button size="sm" style={{ margin: '5px' }} className="px-2" onClick={async () => { await copyText(w.address); }}>Copy Address</Button>
                                    <Button style={{ margin: '5px' }} size="sm" className="px-2" onClick={async () => {
                                        if (!provider) return alert('Alchemy URL not configured in VITE_ALCHEMY_HTTP_URL');
                                        try {
                                            const bal = await provider.getBalance(w.address);
                                            const eth = ethers.formatEther(bal);
                                            setBalances(prev => ({ ...prev, [w.address]: eth }));
                                        } catch (e) {
                                            console.error(e);
                                            alert('Failed to fetch balance: ' + (e.message || e));
                                        }
                                    }}>Get Balance</Button>
                                    <div className="text-sm font-mono">{balances[w.address] ? `${balances[w.address]} ETH` : ''}</div>
                            </div>
                        </div>

                        <div>
                            <div className="text-[10px] text-muted-foreground">Private Key</div>
                            <div className="font-mono text-sm break-all">
                                {w.revealed ? w.privateKey : '••••••••••••••••••••••'}
                            </div>
                            <div className="mt-2 flex gap-2" style={{ margin: '8px' }}>
                                <Button size="sm"  style={{ margin: '5px' }} className="px-2" onClick={async () => {
                                    // toggle reveal
                                    setWallets(prev => prev.map((item, idx) => idx === i ? { ...item, revealed: !item.revealed } : item));
                                }}>{w.revealed ? 'Hide' : 'Reveal'}</Button>

                                <Button style={{ margin: '5px' }} size="sm" className="px-2" onClick={async () => { await copyText(w.privateKey); }}>Copy Private</Button>

                                <Button style={{ margin: '5px' }} size="sm" className="px-2" onClick={async () => {
                                    if (!provider) return alert('Alchemy URL not configured in VITE_ALCHEMY_HTTP_URL');
                                    // connect wallet signer from private key
                                    try {
                                        const signer = new ethers.Wallet(w.privateKey, provider);
                                        const to = prompt('Enter recipient address (for quick test)');
                                        if (!to) return;
                                        const amount = prompt('Amount in ETH to send (e.g. 0.001)');
                                        if (!amount) return;
                                        const tx = await signer.sendTransaction({ to, value: ethers.parseEther(amount) });
                                        alert('Transaction sent: ' + tx.hash);
                                        await tx.wait();
                                        alert('Transaction confirmed: ' + tx.hash);
                                    } catch (e) {
                                        console.error(e);
                                        alert('Failed to send tx: ' + (e.message || e));
                                    }
                                }}>Send Tx</Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
