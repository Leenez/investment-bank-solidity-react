import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import InvestmentBank from './abis/InvestmentBank.json';
import YoshiToken from './abis/YoshiToken.json';
import PikachuToken from './abis/PikachuToken.json';
import InterestToken from './abis/InterestToken.json';
import GetTokens from './components/GetTokens.js'
import DepositTokens from './components/DepositTokens';
import DepositList from './components/DepositList';
import WithdrawTokens from './components/WithdrawTokens';
import AddTokens from './components/AddTokens';
import InterestTokenAddress from './components/InterestTokenAddress';


function App() {

  const [account, setAccount] = useState();
  const [deposits, setDeposits] = useState([]);
  const [investmentBank, setInvestmentBank] = useState();
  const [yoshiToken, setYoshiToken] = useState();
  const [pikachuToken, setPikachuToken] = useState();
  const [interestToken, setInterestToken] = useState();

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  const loadBlockchainData = async () => {
    const web3 = await window.web3;
    const networkId = await web3.eth.net.getId();
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
    const bankNetworkData = await InvestmentBank.networks[networkId];
    const yoshiTokenNetworkData = await YoshiToken.networks[networkId];
    const pikachuTokenNetworkData = await PikachuToken.networks[networkId];
    const interestTokenNetworkData = await InterestToken.networks[networkId];

    if(bankNetworkData && interestTokenNetworkData && yoshiTokenNetworkData && pikachuTokenNetworkData) {
      const _investmentBank = await new web3.eth.Contract(InvestmentBank.abi, bankNetworkData.address);
      const _yoshiToken = await new web3.eth.Contract(YoshiToken.abi, yoshiTokenNetworkData.address);
      const _pikachuToken = await new web3.eth.Contract(PikachuToken.abi, pikachuTokenNetworkData.address);
      const _interestToken = await new web3.eth.Contract(InterestToken.abi, interestTokenNetworkData.address);
      const _deposits = await _investmentBank.methods.getDeposits().call({from: account});
      setDeposits(_deposits);
      setInvestmentBank(_investmentBank);
      setYoshiToken(_yoshiToken);
      setPikachuToken(_pikachuToken);
      setInterestToken(_interestToken);
    } else {
      window.alert('Bank or token contract not detected');
    }
  }

  useEffect(() => {
    loadWeb3();
    loadBlockchainData();
  }, [deposits]);

  // SET ALLOWANCE TO DO DEPOSITS
  const setAllowance = async (ticker, amount) => {
    let txHash = null;
    const networkId = await window.web3.eth.net.getId();
    const bankAddress = InvestmentBank.networks[networkId].address;
    if(ticker == 'YOSHI') {
      txHash = await yoshiToken.methods.approve(bankAddress, amount).send({from: account})
      .on('transactionHash', function(hash) {return hash;});
    }
    if(ticker =='PIKACHU') {
      txHash = await pikachuToken.methods.approve(bankAddress, amount).send({from: account})
      .on('transactionHash', function(hash) {return hash;});
    }
    console.log(txHash);
  }

  const deposit = async (ticker, amount) => {
    await setAllowance(ticker, amount);
    const _ticker = Web3.utils.asciiToHex(ticker);
    let txHash = await investmentBank.methods.deposit(_ticker, amount).send({from: account})
    .on('transactionHash', function(hash) {return hash;});
    console.log(txHash);
  }

  const withdraw = async (ticker, amount) => {
    const _ticker = Web3.utils.asciiToHex(ticker);
    let txHash = await investmentBank.methods.withdraw(_ticker, amount).send({from: account})
    .on('transactionHash', function(hash) {return hash;});
    console.log(txHash);
  }

  const addToken = async (ticker, address, interest) => {
    const _ticker = Web3.utils.asciiToHex(ticker);
    const txHash = await investmentBank.methods.addToken(_ticker, address, interest).send({from: account})
    .on('transactionHash', function(hash) {return hash;});
    console.log(txHash);
  }

  const setInterestTokenAddress = async (address) => {
    const txHash = await investmentBank.methods.setInterestTokenAddress(address).send({from: account})
    .on('transactionHash', function(hash) {return hash;});
    console.log(txHash);
  }

  const getTokens = async (ticker, amount) => {
    let txHash = null;
    if(ticker == 'YOSHI') {
      txHash = await yoshiToken.methods.getTokens(amount).send({from: account})
      .on('transactionHash', function(hash) {return hash;});
    }
    if(ticker == 'PIKACHU') {
      txHash = await pikachuToken.methods.getTokens(amount).send({from: account})
      .on('transactionHash', function(hash) {return hash;});
    };
    if(ticker == 'INTEREST') {
      const networkId = await window.web3.eth.net.getId();
      const bankAddress = InvestmentBank.networks[networkId].address;
      txHash = await interestToken.methods.getTokens(bankAddress, amount).send({from: account})
      .on('transactionHash', function(hash) {return hash;});
    };
    console.log(txHash);
  }

  return(
    <React.Fragment>
      <GetTokens getTokens = {getTokens} account={account}/>
      <DepositTokens deposit = {deposit}/>
      <DepositList deposits = {deposits}/>
      <WithdrawTokens withdraw = {withdraw}/>
      <AddTokens addToken = {addToken}/>
      <InterestTokenAddress setInterestTokenAddress = {setInterestTokenAddress}/>
    </React.Fragment>
  );
}

export default App;
