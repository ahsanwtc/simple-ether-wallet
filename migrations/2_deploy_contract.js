const SimpleEtherWallet = artifacts.require("SimpleEtherWallet");

module.exports = function (deployer) {
  deployer.deploy(SimpleEtherWallet);
};
