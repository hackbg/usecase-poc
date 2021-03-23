import {
  productListManager,
  addItemToList,
  formatDate,
  initContracts,
  productSackListManager,
  getMultipleActiveItems,
  getActiveItem,
  clearProductDetails,
  showManufacturerSacks,
  showManufacturerProducts,
} from "./helper.js";

window.onload = async function () {
  let web3 = new Web3(
    Web3.givenProvider ||
      new Web3.providers.HttpProvider("http://localhost:8545")
  );

  await initContracts(web3);

  document.getElementById("product-manufacturer-address").innerHTML =
    window.accounts[1];

  await showManufacturerSacks();
  await showManufacturerProducts();

  document
    .getElementById("manufacture-product")
    .addEventListener("click", function () {
      var sacks = getMultipleActiveItems();
      if (sacks.length != 5) {
        alert("Use exactly 5 sacks to manufacture a product!");
        return false;
      }

      var productType = document.getElementById("manufacture-product-type")
        .value;

      var sacksArray = [];
      for (const sack of sacks) {
        sacksArray.push(sack.innerHTML);
      }
      var productionDate = formatDate();

      console.log("Manufacture product:");
      console.log("Product type: " + productType);
      console.log("Production date: " + productionDate);
      console.log("Used sacks: " + sacksArray);

      window.product.methods
        .manufactureProduct(productType, productionDate, sacksArray)
        .send({ from: window.accounts[1], gas: 1000000 }, function (err, res) {
          if (err) {
            console.log(err);
          } else {
            console.log("Product manufactured");
            var productHash = web3.utils.soliditySha3(
              window.accounts[1],
              web3.utils.fromAscii(productType),
              web3.utils.fromAscii(productionDate)
            );
            addItemToList(productHash, "product-list", productListManager);

            for (const sack of sacks) {
              sack.removeEventListener("click", productSackListManager);
              sack.parentElement.removeChild(sack);
            }
          }
        });
    });

  document
    .getElementById("product-change-ownership-btn")
    .addEventListener("click", function () {
      console.log("Product owner change request");

      var productHash = getActiveItem("product-list");
      if (productHash !== undefined) {
        var newOwner = document.getElementById("product-change-ownership-input")
          .value;
        if (newOwner !== "") {
          window.ownership.methods
            .changeProductOwner(productHash.innerHTML, newOwner)
            .send(
              { from: window.accounts[1], gas: 1000000 },
              function (err, res) {
                if (err) {
                  console.log(err);
                } else {
                  console.log("Product owner changed");
                  productHash.parentElement.removeChild(productHash);
                  clearProductDetails();
                }
              }
            );
        }
      }
    });
};
