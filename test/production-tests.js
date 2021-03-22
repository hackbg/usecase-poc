const CoffeeProduction = artifacts.require("CoffeeProduction");

contract("CoffeeProduction", async (accounts) => {
  let instance;
  beforeEach(async function () {
    instance = await CoffeeProduction.deployed();
  });

  it("Should harvest a Sack of Arabica and save it", async () => {
    const beanType = "Arabica";
    const productionDate = "24 Sep 2020";
    const serialNumber = "0003001";

    var _ = await instance.harvestSack(serialNumber, beanType, productionDate, {
      from: accounts[0],
    });
    let sackHash = web3.utils.soliditySha3(
      accounts[0],
      web3.utils.fromAscii(serialNumber),
      web3.utils.fromAscii(beanType),
      web3.utils.fromAscii(productionDate)
    );
    let res = await instance.sacks(sackHash);

    assert.equal(res[0], accounts[0]);
    assert.equal(res[1], beanType);
    assert.equal(res[2], serialNumber);
    assert.equal(res[3], productionDate);
  });

  it("Should manufacture a Product from 5 Sacks of coffee and save it", async () => {
    const beanTypes = ["Arabica", "Arabica", "Robusta", "Liberica", "Excelsa"];
    const harvestDate = "25 Sep 2020";
    const serialNumbers = [
      "0003001",
      "0003002",
      "0003201",
      "0003101",
      "0003301",
    ];
    let res;
    let sacksHash = [];
    for (var i = 0; i < serialNumbers.length; i++) {
      res = await instance.harvestSack(
        serialNumbers[i],
        beanTypes[i],
        harvestDate,
        {
          from: accounts[0],
        }
      );
      sacksHash.push(
        web3.utils.soliditySha3(
          accounts[0],
          web3.utils.fromAscii(serialNumbers[i]),
          web3.utils.fromAscii(beanTypes[i]),
          web3.utils.fromAscii(harvestDate)
        )
      );
    }
    // The product itself
    const productType = "2111 Blend";
    const productSerialNumber = "1003334";
    const productionDate = "13 Oct 2020";

    res = await instance.manufactureProduct(
      productSerialNumber,
      productType,
      productionDate,
      sacksHash,
      { from: accounts[0] }
    );

    const productHash = web3.utils.soliditySha3(
      accounts[0],
      web3.utils.fromAscii(productSerialNumber),
      web3.utils.fromAscii(productType),
      web3.utils.fromAscii(productionDate)
    );

    res = await instance.products(productHash);
    assert.equal(res["producer"], accounts[0]);
    assert.equal(res["productType"], productType);
    assert.equal(res["serialNumber"], productSerialNumber);
    assert.equal(res["productionDate"], productionDate);

    // Assert that the correct sacks have indeed been used
    res = await instance.getSacks(productHash);
    for (var i = 0; i < sacksHash.length; i++) {
      assert.equal(res[i], sacksHash[i]);
    }
  });
});
