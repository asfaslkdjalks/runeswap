import React from 'react';
import { initWeb3Provider } from '../utils/ethers';

function WalletButton({ setProvider, setUserWalletAddress }) {
  const handleConnectWallet = async () => {
    const { provider, userAddress } = await initWeb3Provider();
    if (provider && userAddress) {
      setProvider(provider);
      setUserWalletAddress(userAddress); // Save the user's address
    }
  };

  return (
    <button className="connect-button" onClick={handleConnectWallet}>
      Connect Wallet
    </button>
  );
}

  
export default WalletButton