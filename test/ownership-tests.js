const CoffeeOwnership = artifacts.require("CoffeeOwnership");
const CoffeeProduction = artifacts.require("CoffeeProduction");

contract("CoffeeOwnership", async (accounts) => {
  let ownership;
  let production;
  beforeEach(async () => {
    ownership = await CoffeeOwnership.deployed();
    production = await CoffeeProduction.deployed();
  });

  it("Should set owner to producer when sack is harvested", async () => {
    const beanType = "Arabica";
    const productionDate = "24 Sep 2020";
    const serialNumber = "0003001";
    var _ = await production.harvestSack(
      serialNumber,
      beanType,
      productionDate,
      {
        from: accounts[0],
      }
    );

    let sackHash = web3.utils.soliditySha3(
      accounts[0],
      web3.utils.fromAscii(serialNumber),
      web3.utils.fromAscii(beanType),
      web3.utils.fromAscii(productionDate)
    );

    let res = await ownership.addSackOwner(sackHash);
    res = await ownership.sackToOwner(sackHash);
    assert.equal(res, accounts[0]);
  });

  it("Should change owner when current owner trades", async () => {
    const beanType = "Arabica";
    const productionDate = "24 Sep 2020";
    const serialNumber = "0003002";

    var _ = await production.harvestSack(
      serialNumber,
      beanType,
      productionDate,
      {
        from: accounts[0],
      }
    );

    let sackHash = web3.utils.soliditySha3(
      accounts[0],
      web3.utils.fromAscii(serialNumber),
      web3.utils.fromAscii(beanType),
      web3.utils.fromAscii(productionDate)
    );

    let res = await ownership.addSackOwner(sackHash);
    res = await ownership.changeSackOwner(sackHash, accounts[1], {
      from: accounts[0],
    });
    res = await ownership.sackToOwner(sackHash);
    assert.equal(res, accounts[1]);
  });
});
