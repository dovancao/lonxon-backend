
const express = require ('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Web3 = require('web3');

const WalletRouter = require('./modules/api/wallet/router');
const BlockChainDataRouter = require('./modules/api/blockchain/router');
const BigDataRouter = require('./modules/api/bigdata/router')

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use('/api/wallet',WalletRouter);
app.use('/api/blockchain', BlockChainDataRouter);
app.use('/api/bigData', BigDataRouter);

const port = process.env.PORT || 2000;

app.listen(port, (err) => {
    if(err) console.log(err)
    else console.log("Server is listening");
})

// const LoyaSolcJson = require('../contracts/build/contracts/LoyaToken.json');

// const LoyaSolc = new web3.eth.Contract(LoyaSolcJson.abi, LoyaSolcJson.networks[NETWORK].address);
// let LoyaMethodAbi;

// Promise.resolve().then(() => {
//   return LoyaSolc.methods.balanceOf('0xDbf16F1D0A2d75FD45A791e3E032938628a79664').call().then((balance) => {
//     var toWei = Math.pow(10, 18);
//     var balance = balance.toString(10)
//     console.log(balance/toWei);
// })}).then(() => {
//   return LoyaSolc.methods.totalSupply().call().then((_) => {
//     console.log(_);
//   })
// })
// .catch(console.log)

// .then(() => {
//   return LoyaSolc.methods.transfer('0xDbf16F1D0A2d75FD45A791e3E032938628a79664', 1000).call()
// }).then(() => {
//   return LoyaSolc.methods.balanceOf('0xDbf16F1D0A2d75FD45A791e3E032938628a79664').call().then((balance) => {
//     var toWei = Math.pow(10, 18);
//     var balance = balance.toString(10)
//     console.log(balance/toWei);
// })})