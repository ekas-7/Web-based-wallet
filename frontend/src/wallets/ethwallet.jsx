import { useState } from "react";
import { Wallet } from "ethers";

export const EthWallet = ({mnemonic}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [addresses, setAddresses] = useState([]);

    return (
        <div>
            <button onClick={function() {
                if (!mnemonic) return alert('Set mnemonic first');
                const derivationPath = `m/44'/60'/${currentIndex}'/0/0`;
                // Use ethers Wallet helper to derive from mnemonic + path
                const wallet = Wallet.fromPhrase(mnemonic, derivationPath);
                setCurrentIndex(prev => prev + 1);
                setAddresses(prev => [...prev, wallet.address]);
            }}>
                Add ETH wallet
            </button>

            {addresses.map((p, i) => <div key={i}>
                Eth - {p}
            </div>)}
        </div>
    )
}