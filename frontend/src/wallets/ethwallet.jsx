import { useState } from "react";
import { HDNodeWallet } from "ethers";
import { Button } from "@/components/ui/button";

export const EthWallet = ({ mnemonic }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    // store objects so we can keep address + privateKey + reveal state
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
    <div className="space-y-4" style={{ margin: '5px' }}>
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

                    setCurrentIndex((prev) => prev + 1);
                    setWallets((prev) => [...prev, { address, privateKey, revealed: false }]);
                }}
            >
                Add ETH Wallet
            </Button>

            <div className="space-y-2" style={{ margin: '5px' }}>
                {wallets.map((w, i) => (
                    <div key={`${w.address}-${i}`} className="p-3 bg-muted rounded-md border" style={{ marginTop:'15px',marginBottom:'15px'}}>
                        <div className="text-xs text-muted-foreground mb-1" style={{ margin: '5px' }}>Wallet {i + 1}</div>

                        <div className="mb-2" style={{ margin: '5px' }}>
                            <div className="text-[10px] text-muted-foreground">Address</div>
                            <div className="font-mono text-sm break-all">{w.address}</div>
                            <div className="mt-2 flex gap-2" style={{ margin: '5px' }}>
                                <Button size="sm" className="px-2" onClick={async () => { await copyText(w.address); }}>Copy Address</Button>
                            </div>
                        </div>

                        <div>
                            <div className="text-[10px] text-muted-foreground">Private Key</div>
                            <div className="font-mono text-sm break-all">
                                {w.revealed ? w.privateKey : '••••••••••••••••••••••'}
                            </div>
                            <div className="mt-2 flex gap-2" style={{ margin: '5px' }}>
                                <Button size="sm"  style={{ margin: '5px' }} className="px-2" onClick={async () => {
                                    // toggle reveal
                                    setWallets(prev => prev.map((item, idx) => idx === i ? { ...item, revealed: !item.revealed } : item));
                                }}>{w.revealed ? 'Hide' : 'Reveal'}</Button>

                                <Button style={{ margin: '5px' }} size="sm" className="px-2" onClick={async () => { await copyText(w.privateKey); }}>Copy Private</Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
