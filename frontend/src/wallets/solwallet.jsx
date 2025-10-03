import { useState } from "react"
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl"
import { Button } from "@/components/ui/button";

export function SolanaWallet({ mnemonic }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [publicKeys, setPublicKeys] = useState([]);

    return <div className="space-y-4">
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
            setCurrentIndex(prev => prev + 1);
            setPublicKeys(prev => [...prev, solKeypair.publicKey.toBase58()]);
        }}>
            Add SOL Wallet
        </Button>
        <div className="space-y-2">
            {publicKeys.map((p, i) => (
                <div key={i} className="p-3 bg-muted rounded-md border">
                    <div className="text-xs text-muted-foreground mb-1">Wallet {i + 1}</div>
                    <div className="font-mono text-sm break-all">{p}</div>
                </div>
            ))}
        </div>
    </div>
}