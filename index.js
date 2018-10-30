
const express = require ('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Web3 = require('web3');
const config = require('./config')
const web3 = new Web3(config.url);
const NETWORK = 3;

const WalletRouter = require('./modules/api/wallet/router');
const BlockChainDataRouter = require('./modules/api/blockchain/router');
const BigDataRouter = require('./modules/api/bigdata/router')

//ethereum tx
const EthereumTx = require('ethereumjs-tx');

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

const LoyaSolcJson = require('./contracts/build/contracts/LoyaToken.json');

const LoyaSolc = new web3.eth.Contract(LoyaSolcJson.abi, LoyaSolcJson.networks[NETWORK].address);
// determine the nonce
// var count = new web3.eth.getBlockTransactionCount("0xd463664728702166C5256b30E91E5Da1c9bB43f8");
let LoyaMethodAbi;
Promise.resolve().then(() => {
  return LoyaSolc.methods.balanceOf('0xDbf16F1D0A2d75FD45A791e3E032938628a79664').call().then((balance) => {
    var toWei = Math.pow(10, 18);
    var balance = balance.toString(10)
    console.log(balance/toWei);
})}).then(() => {
  return LoyaSolc.methods.balanceOf('0xd463664728702166C5256b30E91E5Da1c9bB43f8').call().then((balance) => {
    var toWei = Math.pow(10, 18);
    var balance = balance.toString(10)
    console.log(balance/toWei);
})}).then(() => {
  return LoyaSolc.methods.totalSupply().call().then((_) => {
    console.log(_);
  })
})
.then(() => {

  const rawTransaction = {
    from: '0xd463664728702166C5256b30E91E5Da1c9bB43f8',
    gasPrice: "0x09184e72a000",
    gasLimit: "0x2710",
    nonce: '0x00',
    to: LoyaSolcJson.networks[NETWORK].address,
    data: LoyaSolc.methods.transferFrom('0xd463664728702166C5256b30E91E5Da1c9bB43f8','0xDbf16F1D0A2d75FD45A791e3E032938628a79664', 1000).encodeABI(),
    chainId: 3
  }
  var privKey = new Buffer.from('876E2D2983A0D162060272E2E31BAD9EF81EDA64680D4EFAC8031624B95C849A', 'hex');
  const tx = new EthereumTx(rawTransaction);
  tx.sign(privKey);
  const seriallizedTx = tx.serialize();

  // send transaction
  web3.eth.sendSignedTransaction('0x' + seriallizedTx.toString('hex'), function(err, hash){
    if (!err) console.log(hash)
    console.log('error : ', err)
  })
}).then(() => {
  return LoyaSolc.methods.balanceOf('0xDbf16F1D0A2d75FD45A791e3E032938628a79664').call().then((balance) => {
    var toWei = Math.pow(10, 18);
    var balance = balance.toString(10)
    console.log(balance/toWei);
})})
.catch(console.log)