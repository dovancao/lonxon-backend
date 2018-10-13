const express = require('express');
let Router = express.Router();
var hashString;

Router.post('/purchase', function(req,res){
  axios({
    method: 'post',
    url: 'http://localhost:8500/bzz:/',
    headers: {
      'Content-Type': 'text/plain'
    },
    data: {
      address: req.body.address,
      data: req.body.data
    }
  }).then((response) => {
    hashString = response;
    res.send({hashString: response})
  }).catch(error => console.log(error))
})

//get hashString
Router.get('/hashString', function(req,res){
  res.send(hashString);
})

//get data history by hashString
Router.get('/:hashString', function(req,res){
  axios({
    method: 'get',
    url: `http://localhost:8500/bzz:/${req.params.hashString}`
  }).then((response) => {
    res.send(response)
  }).catch(error => console.log(error))
})

module.exports = Router;
