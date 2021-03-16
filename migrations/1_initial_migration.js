const Migrations = artifacts.require("Migrations");
const CoffeeProduction = artifacts.require("CoffeeProduction");
const CoffeeOwnership = artifacts.require("CoffeeOwnership");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(CoffeeProduction).then(() => {
    return deployer.deploy(CoffeeOwnership, CoffeeProduction.address);
  });
};
