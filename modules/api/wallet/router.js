const express = require('express');
const  Web3 = require('web3');
const NETWORK =3;
const defaultConfig = require('../../../config');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const keccak256 = require('js-sha3').keccak256;
const { EthWallet,CoinType, InfinitoApi } = require('node-infinito-wallet');
const web3 = new Web3(defaultConfig.url);

//loyajson
const LoyaSolcJson = require('../../../contracts/build/contracts/LoyaToken.json')
const LoyaSolc = new web3.eth.Contract(LoyaSolcJson.abi, LoyaSolcJson.networks[NETWORK].address);
// api config
let apiConfig = {
  apiKey: 'test',
  secret: '123456',
  baseUrl: 'https://staging-api-testnet.infinitowallet.io',
  logLevel: 'NONE'
}

// set infinito api
let api = new InfinitoApi(apiConfig)

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

Router.get('/balance', function(req,res){
  try {
    LoyaSolc.methods.balanceOf(req.body.address).call().then((balance) => {
      var toWei = Math.pow(10, 18);
      var balance = balance.toString(10);
      res.send({
        balance: balance
      })
    })
  } catch(error) {

  }
})

module.exports = Router;
