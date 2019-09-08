const Medicine = artifacts.require("Medicine");

module.exports = function(deployer) {
  deployer.deploy(Medicine);
};
