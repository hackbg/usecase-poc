import {
  initContracts,
  addItemToList,
  clearSackDetails,
  formatDate,
  getActiveItem,
  showHarvesterSacks,
  sackListManager,
} from "./helper.js";

window.onload = async function () {
  let web3 = new Web3(
    Web3.givenProvider ||
      new Web3.providers.HttpProvider("http://localhost:8545")
  );

  await initContracts(web3);

  document.getElementById("sack-harvester-address").innerHTML =
    window.accounts[0];

  await showHarvesterSacks();

  document
    .getElementById("harvest-sack")
    .addEventListener("click", function () {
      var beanType = document.getElementById("harvest-bean-type").value;

      console.log("Harvest coffee sack");

      var productionDate = formatDate();

      console.log(
        "Bean type: " +
          beanType +
          " Date: " +
          productionDate +
          " Account: " +
          window.accounts[0]
      );

      var sackHash = web3.utils.soliditySha3(
        window.accounts[0],
        web3.utils.fromAscii(beanType),
        web3.utils.fromAscii(productionDate)
      );

      window.product.methods
        .harvestSack(beanType, productionDate)
        .send({ from: window.accounts[0], gas: 1000000 }, function (err, res) {
          console.log("Sack harvested, tx: " + res);
        });

      addItemToList(sackHash, "sack-list", sackListManager);
    });

  document
    .getElementById("sack-change-ownership-btn")
    .addEventListener("click", function () {
      console.log("Change ownership request");

      var sackHash = getActiveItem("sack-list");
      if (sackHash != undefined) {
        var newOwner = document.getElementById("sack-change-ownership-input")
          .value;
        if (newOwner != "") {
          window.ownership.methods
            .changeSackOwner(sackHash.textContent, newOwner)
            .send(
              { from: window.accounts[0], gas: 1000000 },
              function (err, res) {
                if (err) {
                  console.log(err);
                } else {
                  console.log("Successfully changed owner");
                  sackHash.parentElement.removeChild(sackHash);
                  clearSackDetails();
                }
              }
            );
        }
      }
    });
};
