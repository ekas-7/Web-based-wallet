import { useState } from "react";
import { HDNodeWallet } from "ethers";
import { Button } from "@/components/ui/button";

export const EthWallet = ({ mnemonic }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [addresses, setAddresses] = useState([]);

    return (
        <div className="space-y-4">
            <Button
                className="w-full"
                onClick={function () {
                    if (!mnemonic) return alert("Set mnemonic first");
                    
                    // Build the BIP44 path for Ethereum
                    const path = `m/44'/60'/0'/0/${currentIndex}`;

                    // ethers v6: fromPhrase takes (mnemonic, path?) where path should be a string.
                    // Passing an object like { path } causes the library to ignore the path and
                    // return the master node, producing the same address repeatedly.
                    const wallet = HDNodeWallet.fromPhrase(mnemonic, path);

                    const address = wallet.address;
                    console.log("Derived ETH path:", path, "address:", address);

                    setCurrentIndex((prev) => prev + 1);
                    setAddresses((prev) => [...prev, address]);
                }}
            >
                Add ETH Wallet
            </Button>

            <div className="space-y-2">
                {addresses.map((p, i) => (
                    <div key={`${p}-${i}`} className="p-3 bg-muted rounded-md border">
                        <div className="text-xs text-muted-foreground mb-1">Wallet {i + 1}</div>
                        <div className="font-mono text-sm break-all">{p}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};
