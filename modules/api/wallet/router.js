const express = require('express');
const  Web3 = require('web3');
const NETWORK =3;
const defaultConfig = require('../../../config');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const keccak256 = require('js-sha3').keccak256;
const { EthWallet,CoinType, InfinitoApi } = require('node-infinito-wallet');
const web3 = new Web3(defaultConfig.url);
const SmartContractAddress = '0x0e6bd10385c4b9c04687623e35569b7d5423b327';
const opts = {
     apiKey: '28922118-c15d-4694-8836-b9ab18741e37',
     secret: 'dPdqS8KrjwAheOdh7FhnGyPTIxebDrLZ0rBbEypJuFiGroTvNAzFUwCTaqiRjSjb',
     baseUrl: 'https://staging-api-testnet.infinitowallet.io',
     logLevel: 'NONE',
 };
 const api = new InfinitoApi(opts);
 const coinAPI = api.ETH;

//loyajson
const LoyaSolcJson = require('../../../contracts/build/contracts/LoyaToken.json')
const LoyaSolc = new web3.eth.Contract(LoyaSolcJson.abi, LoyaSolcJson.networks[NETWORK].address);
// api config
let apiConfig = {
  apiKey: '28922118-c15d-4694-8836-b9ab18741e37',
  secret: 'dPdqS8KrjwAheOdh7FhnGyPTIxebDrLZ0rBbEypJuFiGroTvNAzFUwCTaqiRjSjb',
  baseUrl: 'https://staging-api-testnet.infinitowallet.io',
  logLevel: 'NONE'
}


let Router = express.Router();

Router.post('/new-wallet', function(req,res){
  let walletConfig = {
    coinType: CoinType.ETH.symbol,  // change for case ETH
    isTestNet: true,
    passphrase: req.body.password
  }  
  
  let wallet = new EthWallet(walletConfig)
  let account = wallet.Account;
  res.send({
    address: account.address,
    privateKey: account.privateKey,
    publicKey: account.publicKey
  })
});

Router.post('/open-wallet', function(req, res){
    try {
        const generatorPoint = ec.g;
        const pubKeyCoordinates = generatorPoint.mul(req.body.privateKey);

        const x = pubKeyCoordinates.getX().toString('hex');
        const y = pubKeyCoordinates.getY().toString('hex');

        const publicKey = x + y;
        const hashOfPublicKey = keccak256(new Buffer(publicKey, 'hex'));
        const ethAddressBuffer = new Buffer(hashOfPublicKey,'hex');

        const ethAddressWithPrefix  = `0x${ethAddressBuffer.slice(-20).toString('hex')}`;

        // send cookie for client 
        res.status(200).send({
          publicKey: publicKey,
          address: ethAddressWithPrefix 
        })
    } catch (error) {
        console.log(error);
        res
          .status(error.status || 500)
          .send(error.message || 'Private key is wrong!')
    }
})

Router.get('/balance/:address', function(req,res){
  try {

    // LoyaSolc.methods.balanceOf(req.params.address).call().then((balance) => {
    //   var toWei = Math.pow(10, 18);
    //   var balance = balance.toString(10);
    //   res.send({
    //     balance: balance/toWei
    //   })
    // })
    const result = coinAPI.getBalance(req.params.address);
    return res.send(result.data.balance)
  } catch(error) {

  }
})

Router.get('/transaction/:address', function(req,res){
  try {
    const result = coinAPI.getTxAddress(req.params.address);
    res.send({data: result.data})
  } catch (error) {
    res.send(error)
  }
})

//call transfer from smart contract
Router.get('/transfer/:to/:amount', function(req,res){
  let walletConfig = {
    coinType: CoinType.ETH.symbol, 
    isTestNet: true,
  }

  let apiConfig = {
    apiKey: '28922118-c15d-4694-8836-b9ab18741e37',
    secret: 'dPdqS8KrjwAheOdh7FhnGyPTIxebDrLZ0rBbEypJuFiGroTvNAzFUwCTaqiRjSjb',
    baseUrl: 'https://staging-api-testnet.infinitowallet.io',
    logLevel: 'NONE'
  }

  let api = new InfinitoApi(apiConfig);
  let wallet = new EthWallet(walletConfig);
  wallet.setApi(api);

  try {
    let result = wallet.transfer(SmartContractAddress, req.params.to , req.params.amount);
    res.status(200).send(result)
  } catch (error) {
    console.log(error)
  }
})

module.exports = Router;
