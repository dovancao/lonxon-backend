var LoyaToken = artifacts.require("./LoyaToken.sol");

module.exports = function(deployer) {
  deployer.deploy(LoyaToken);
};
