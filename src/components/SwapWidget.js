import React, { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';
import { AlphaRouter, SwapType } from '@uniswap/smart-order-router';
import { CurrencyAmount, Token, TradeType, Percent, Ether } from '@uniswap/sdk-core';
import WalletButton from './WalletButton';
import whatGif from './what.gif'


// Constants
const CHAIN_ID = 8453;
const TOKEN_B_ADDRESS = '0x7b72bf38b06969a0989cb4ff8888484f4fc59883';
const tokenB = new Token(CHAIN_ID, TOKEN_B_ADDRESS, 18, 'SPORTS', 'Sports Car');

function SwapWidget() {
    const [provider, setProvider] = useState(null);
    const [swapAmount, setSwapAmount] = useState('');
    const [isSwapping, setIsSwapping] = useState(false);
    const [quote, setQuote] = useState(null);
    const [outputAmount, setOutputAmount] = useState('');
    const [userWalletAddress, setUserWalletAddress] = useState('');


    const fetchQuote = useCallback(async (amount) => {
        if (!amount || !provider) {
            setOutputAmount('');
            setQuote(null);
            return;
        }
        const router = new AlphaRouter({ chainId: CHAIN_ID, provider });
        try {
            const amountInWei = ethers.utils.parseUnits(amount, 'ether');
            const amountIn = CurrencyAmount.fromRawAmount(Ether.onChain(CHAIN_ID), amountInWei);
            const swapOptions = {
                type: SwapType.UNIVERSAL_ROUTER,
                recipient: userWalletAddress,
                slippageTolerance: new Percent(50, 10000),
                deadlineOrPreviousBlockhash: Math.floor(Date.now() / 1000) + 60 * 20,
                chainId: CHAIN_ID,
            };
            const quote = await router.route(amountIn, tokenB, TradeType.EXACT_INPUT, swapOptions);
            setQuote(quote);
            if (quote.trade) {
                const outputEstimate = quote.trade.outputAmount.toSignificant(6);
                setOutputAmount(outputEstimate);
            }
        } catch (error) {
            console.error('Failed to fetch quote:', error);
        }
    }, [provider]);

    const handleSwap = useCallback(async () => {
        if (!quote || !provider) return;
        const signer = provider.getSigner();
        setIsSwapping(true);
        try {
            const swapTx = await signer.sendTransaction({
                to: quote.methodParameters.to,
                data: quote.methodParameters.calldata,
                value: quote.methodParameters.value,
                gasLimit: ethers.BigNumber.from('210000'),
            });
            const receipt = await swapTx.wait();
            console.log('Swap successful:', receipt);
        } catch (error) {
            console.error('Swap failed:', error);
        } finally {
            setIsSwapping(false);
        }
    }, [provider, quote]);

    useEffect(() => {
        fetchQuote(swapAmount);
    }, [swapAmount, fetchQuote]);

    // Handle input change
    const handleAmountChange = (e) => {
        const valueWithoutAsterisk = e.target.value.replace(/\*/g, '');
    
        // Update the state with the cleaned value
        setSwapAmount(valueWithoutAsterisk);
    };

    const handleKeyDown = (event) => {
        // Add a slight delay to ensure the state is updated after the key press
        setTimeout(() => {
          event.target.value = event.target.value.replace(/\*$/, '') + '*'; // Replace the asterisk at the end if it exists and add a new one
        }, 0);
      };

    const truncateAddress = (address) => {
        return `${address.substring(0, 4)}...${address.substring(address.length - 2)}`;
    };

    const [showGif, setShowGif] = useState(false);
    const handleDeclineClick = () => {
        setShowGif(true);
    
        setTimeout(() => setShowGif(false), 1000); // hides after 5 seconds
    }

    return (
<div className="osrs-trade">
  <div className="osrs-trade-window">
    <h2 className="rs-bold">Trading With: {userWalletAddress}</h2>
    <div className="osrs-trade-offers">
      <div className="osrs-offer">
        <h3>Your Offer</h3>
        <div className="offer-input">
            <input
                id="inputAmount"
                type="text"
                value={swapAmount + '*'} 
                onChange={handleAmountChange}
                onKeyDown={handleKeyDown}
                placeholder="0.0"
            />
            <label htmlFor="inputAmount"> ETH</label>
            </div>
      </div>
      <div className="osrs-offer">
        <h3>Opponent's Offer</h3>
        <div className="offer-output">
          <input
            id="outputAmount"
            type="text"
            value={outputAmount}
            placeholder="0"
            readOnly
          />
        <label htmlFor="outputAmount"> RSGP</label>
        </div>
      </div>
    </div>
    <div className="osrs-trade-actions">
          <button className="accept-button" onClick={handleSwap} disabled={!provider || isSwapping || !swapAmount}>
            {isSwapping ? 'Swapping...' : 'Accept'}
          </button>
          <button className="decline-button" onClick={handleDeclineClick}>
            Decline
        </button>

        {showGif && (
        <div className="gif-overlay" onClick={() => setShowGif(false)}>
            <img src={whatGif} alt="Declined" />
        </div>
        )}
    </div>
  </div>
  {
  userWalletAddress ? (
    <div className="wallet-button">
      {truncateAddress(userWalletAddress)}
    </div>
  ) : (
    <WalletButton setProvider={setProvider} setUserWalletAddress={setUserWalletAddress} />
  )
}

</div>

    );
}

export default SwapWidget;
