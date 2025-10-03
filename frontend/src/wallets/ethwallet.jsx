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
                Add ETH wallet
            </button>

            {addresses.map((p, i) => (
                // use a stable key using the address + index
                <div key={`${p}-${i}`}>Eth - {p}</div>
            ))}
        </div>
    );
};
