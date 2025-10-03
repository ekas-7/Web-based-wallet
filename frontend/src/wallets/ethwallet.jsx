import { useState } from "react";
import { HDNodeWallet } from "ethers";

export const EthWallet = ({ mnemonic }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [addresses, setAddresses] = useState([]);

    return (
        <div>
            <button
                onClick={function () {
                    if (!mnemonic) return alert("Set mnemonic first");
                    
                    const path = `m/44'/60'/0'/0/${currentIndex}`;
                    const wallet = HDNodeWallet.fromPhrase(mnemonic, { path });

                    const address = wallet.address;
                    console.log("Derived ETH path:", path, "address:", address);

                    setCurrentIndex((prev) => prev + 1);
                    setAddresses((prev) => [...prev, address]);
                }}
            >
                Add ETH wallet
            </button>

            {addresses.map((p, i) => (
                <div key={i}>Eth - {p}</div>
            ))}
        </div>
    );
};
