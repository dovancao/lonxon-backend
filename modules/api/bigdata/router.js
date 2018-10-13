const express = require('express');
const CONFIG = require('../../../config');
let Router = express.Router();

var PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');

var personalityInsights = new PersonalityInsightsV3({
  username: CONFIG.personalInsight.username,
  password: CONFIG.personalInsight.password,
  version: '2016-10-19',
  url: 'https://gateway.watsonplatform.net/personality-insights/api/'
});

Router.post('/big-data/:address', function(req,res){
  personalityInsights.profile(
    {
      content: req.body.data,
      content_type: 'text/plain',
      consumption_preferences: true
    },
    function(err, response) {
      if (err) {
        console.log('error:', err);
      } else {
        res.send({
          dataArray: response.consumption_preferences,
          address: req.params.address
        })
      }
    }
  );
})


module.exports = Router;