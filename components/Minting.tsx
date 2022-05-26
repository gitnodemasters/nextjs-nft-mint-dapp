import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { IconContext } from 'react-icons';
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa';

import ABI from '../config/abi.json';
import rpcConfig from '../config/rpcConfig';
import projectConfig from '../config/projectConfig';
import { useEthereumProvider } from '../hooks/useEthereumProvider';

export default function Minting() {
  const { account, active, chainId } = useWeb3React();
  const { ethereumProvider } = useEthereumProvider();

  const [message, setMessage] = useState('');
  const [connErrMsg, setConnErrMsg] = useState('');
  const [totalSupply, setTotalSupply] = useState('?');
  const [isPending, setIsPending] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [mintAmount, setMintAmount] = useState(1);
  const [mintCost, setMintCost] = useState(0.08);
  const [mintType, setMintType] = useState(0);

  async function mintNFTs() {
    console.log("mintType", mintType)
    console.log("mintCost", mintCost)
    if (account && ethereumProvider) {
      const totalMintCost = (mintCost * mintAmount).toString();
      const totalWei = ethers.utils.parseEther(totalMintCost).toBigInt();
      setMessage('');
      setIsPending(true);
      try {
        const web3Provider = new ethers.providers.Web3Provider(
          ethereumProvider
        );
        const signer = web3Provider.getSigner();
        const contract = new ethers.Contract(
          projectConfig.contractAddress,
          ABI,
          signer
        );
        const transaction = await contract.mint(mintType, {
          value: totalWei,
        });
        setIsPending(false);
        setIsMinting(true);
        await transaction.wait();
        setIsMinting(false);
        fetchTotalSupply();
        setMessage(
          `Yay! ${mintAmount} ${
            projectConfig.nftSymbol
          } successfully sent to ${account.substring(
            0,
            6
          )}...${account.substring(account.length - 4)}`
        );
      } catch (error) {
        setIsPending(false);
      }
    }
  }

  function decrementMintAmount() {
    if (mintAmount > 1) {
      setMintAmount(mintAmount - 1);
    }
  }

  function incrementMintAmount() {
    if (mintAmount < projectConfig.maxMintAmountPerTxn) {
      setMintAmount(mintAmount + 1);
    }
  }

  function onTypeChange(event: any) {
    setMintType(event.target.value)
    setMintCost(projectConfig.mintCost[Number(event.target.value)])
  }

  useEffect(() => {
    if (!active) {
      setConnErrMsg('Not connected to your wallet.');
    } else {
      if (chainId !== projectConfig.chainId) {
        setConnErrMsg(`Change the network to ${projectConfig.networkName}.`);
      } else {
        setConnErrMsg('');
      }
    }
  }, [active, chainId]);

  async function fetchTotalSupply() {
    const web3Provider = new ethers.providers.JsonRpcProvider(
      rpcConfig(process.env.NEXT_PUBLIC_INFURA_KEY)
    );
    const contract = new ethers.Contract(
      projectConfig.contractAddress,
      ABI,
      web3Provider
    );
    setTotalSupply((await contract.totalSupply()).toString());
  }

  useEffect(() => {
    fetchTotalSupply();
    // cleanup
    return () => setTotalSupply('?');
  }, []);

  return (
    <>
      <h2 className="text-4xl mb-4">Minting</h2>

      <div className="bg-gray-800 border border-t-red-300 border-r-blue-300 border-b-green-300 border-l-yellow-300 rounded p-8 space-y-4">
        <div className="text-3xl font-bold text-center">
          <span className="text-pink-500">{totalSupply}</span> /{' '}
          {projectConfig.maxSupply}
        </div>

        <div className="text-center">
          <p className="text-xl">
            {/* Mint price: {projectConfig.mintCost * mintAmount}{' '} */}
            Mint price: {mintCost * mintAmount}{' '}
            {projectConfig.chainName}
          </p>
          <p className="text-gray-400">(excluding gas fees)</p>
        </div>
        <div className="flex justify-center items-center space-x-4">
          <select className='bg-gray-900' name="type" onChange={onTypeChange} value={mintType} color={"black"}>
            <option value="0">ULTIMATE</option>
            <option value="1">PLATINUM</option>
            <option value="2">GOLD</option>
            <option value="3">SILVER</option>
          </select>
        </div>
        {/* <div className="flex justify-center items-center space-x-4">
          <IconContext.Provider value={{ size: '1.5em' }}>
            <button
              type="button"
              className={mintAmount <= 1 ? 'text-gray-500 cursor-default' : ''}
              onClick={decrementMintAmount}
              disabled={false}
            >
              <FaMinusCircle />
            </button>
            <span className="text-xl">{mintAmount}</span>
            <button
              type="button"
              className={
                mintAmount >= projectConfig.maxMintAmountPerTxn
                  ? 'text-gray-500 cursor-default'
                  : ''
              }
              onClick={incrementMintAmount}
              disabled={false}
            >
              <FaPlusCircle />
            </button>
          </IconContext.Provider>
        </div> */}

        <div className="flex justify-center">
          {active && !connErrMsg ? (
            <>
              {isPending || isMinting ? (
                <button
                  type="button"
                  className="flex justify-center items-center rounded px-4 py-2 bg-red-700 font-bold w-40 cursor-not-allowed"
                  disabled
                >
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {isPending && 'Pending'}
                  {isMinting && 'Minting'}
                  {!isPending && !isMinting && 'Processing'}
                </button>
              ) : (
                <button
                  type="button"
                  className={`rounded px-4 py-2 bg-blue-700 hover:bg-blue-600 font-bold w-40`}
                  onClick={mintNFTs}
                >
                  Mint
                </button>
              )}
            </>
          ) : (
            <button
              type="button"
              className={`rounded px-4 py-2 bg-gray-700 font-bold w-40 cursor-not-allowed`}
              disabled={true}
              onClick={mintNFTs}
            >
              Mint
            </button>
          )}
        </div>

        {message && <div className="text-green-500 text-center">{message}</div>}
        {connErrMsg && (
          <div className="text-red-500 text-center">{connErrMsg}</div>
        )}
      </div>

      <div className="text-gray-400 mt-2">
        Please make sure you are connected to the correct address and the
        correct network ({projectConfig.networkName}) before purchasing. The
        operation cannot be undone after purchase.
      </div>
    </>
  );
}
