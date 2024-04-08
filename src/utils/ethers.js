import { ethers } from 'ethers';

const BASE_CHAIN_ID_HEX = '0x2105'; // Chain ID for the target network in hexadecimal
const BASE_CHAIN_ID_DECIMAL = 8453; // Chain ID in decimal for easier understanding
const ALCHEMY_URL = 'https://base-mainnet.g.alchemy.com/v2/B8vICp_I22rPPDNSfpidtIPEnp0of9qL'

const networkParams = {
    chainId: BASE_CHAIN_ID_HEX, // A 0x-prefixed hexadecimal string
    chainName: 'Base',
    nativeCurrency: {
        name: 'Wrapped Ethereum',
        symbol: 'WETH', // Typically 2-4 characters long
        decimals: 18,
    },
    rpcUrls: [ALCHEMY_URL],
    blockExplorerUrls: ['https://basescan.org/'],
};

export const initWeb3Provider = async () => {
    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const { chainId } = await provider.getNetwork();
            const signer = provider.getSigner();
            const userAddress = await signer.getAddress();
            console.log(chainId)
            if (chainId !== BASE_CHAIN_ID_DECIMAL) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: BASE_CHAIN_ID_HEX }],
                    });
                } catch (switchError) {
                    // This error code indicates that the chain has not been added to MetaMask.
                    if (switchError.code === 4902) {
                        try {
                            // Attempt to add the chain to the user's wallet
                            await window.ethereum.request({
                                method: 'wallet_addEthereumChain',
                                params: [networkParams],
                            });
                        } catch (addError) {
                            // Handle errors, for example, user rejected the request
                            console.error("Could not add the network:", addError);
                        }
                    } else {
                        // Handle other errors
                        console.error("Could not switch to the network:", switchError);
                    }
                }
            }
            console.log('Wallet and network are correctly connected');
            return {provider, userAddress}
        } catch (error) {
            console.error('Error connecting to wallet:', error);
        }
    } else {
        console.log('Ethereum wallet extension not detected. Please install MetaMask!');
    }
};
