import React from "react";
import abi from "../Utils/abi.json";
import { ethers } from "ethers";

const useCheckWallet = () => {
  const { ethereum } = window;
  const contractAddress = "0xE7828B6d6CA9F326175A20D5f9E42fA87402f5E2";
  const [account, setCurrentAccount] = React.useState(null);
  const [contract, setContract] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const getContractHandler = () => {
    if (!ethereum) return;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const wavePortalContract = new ethers.Contract(
      contractAddress,
      abi.abi,
      signer
    );
    setContract(wavePortalContract);
  };

  const checkIfWalletIsConnected = async () => {
    try {
      setLoading(true);
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length === 0) return;
      const account = accounts[0];
      setCurrentAccount(account);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  React.useState(() => {
    if (!ethereum) return;
    getContractHandler();
  }, []);

  React.useState(() => {
    if (!ethereum) return;
    checkIfWalletIsConnected();
  }, [ethereum]);

  React.useState(() => {
    if (!ethereum) return;
    ethereum.on("accountsChanged", (data) => {
      if (data.length === 0) {
        setCurrentAccount(null);
      } else {
        setCurrentAccount(data[0]);
      }
    });
  });

  return { account, connect: connectWallet, contract, loading };
};

export default useCheckWallet;
