import { productABI, ownershipABI } from "./contractABIs.js";

export async function initContracts(web3Instance) {
  window.accounts = await web3Instance.eth.getAccounts();
  console.log("Accounts successfully loaded");

  window.product = new web3Instance.eth.Contract(productABI);
  window.product.options.address = "0x73E556Ab0658EDd64d05f15151f7E0392584E160";

  window.ownership = new web3Instance.eth.Contract(ownershipABI);
  window.ownership.options.address =
    "0x3C411ecEe9774E7d438BFA0947038408a60F7350";
}

export function fillSackDetails(sack) {
  window.product.methods.sacks(sack).call(
    {
      from: window.accounts[0],
    },
    function (err, res) {
      if (err) console.log(err);
      else {
        document.getElementById("sack-details-address").innerHTML =
          res["producer"];
        document.getElementById("sack-details-bean-type").innerHTML =
          res["beanType"];
        document.getElementById("sack-details-production-date").innerHTML =
          res["productionDate"];

        window.ownership.methods
          .sackToOwner(sack)
          .call({ from: window.accounts[0] }, function (err, res) {
            if (err) console.log(err);
            else {
              if (res === "0x0000000000000000000000000000000000000000") {
                window.ownership.methods
                  .addSackOwner(sack)
                  .send(
                    { from: window.accounts[0], gas: 3000000 },
                    function (err, _) {
                      if (err) console.log(err);
                      else
                        console.log(
                          "First owner auto-registered due to initial owner = address(0)"
                        );
                    }
                  );
              }
            }
          });
      }
    }
  );
}

export function fillProductDetails(prod) {
  window.product.methods
    .products(prod)
    .call({ from: window.accounts[0] }, function (err, res) {
      if (err) console.log(err);
      else {
        document.getElementById("product-details-address").innerHTML =
          res["producer"];
        document.getElementById("product-details-production-date").innerHTML =
          res["productionDate"];
        document.getElementById("product-details-type").innerHTML =
          res["productType"];

        window.product.methods
          .getSacks(prod)
          .call({ from: window.accounts[0] }, function (err, res) {
            if (err) console.log(err);
            else {
              var sacks = "";
              for (const sack of res) {
                sacks += sack + "\n";
              }
              document.getElementById(
                "product-details-sacks"
              ).innerHTML = sacks;

              window.ownership.methods
                .productToOwner(prod)
                .call({ from: window.accounts[0] }, function (err, res) {
                  if (err) console.log(err);
                  else {
                    if (res === "0x0000000000000000000000000000000000000000") {
                      window.ownership.methods
                        .addProductOwner(prod)
                        .send(
                          { from: window.accounts[1], gas: 3000000 },
                          function (err, res) {
                            if (err) console.log(err);
                            else console.log("First owner registered");
                          }
                        );
                    }
                  }
                });
            }
          });
      }
    });
}

export function clearSackDetails() {
  document.getElementById("sack-details-address").innerHTML = "";
  document.getElementById("sack-details-bean-type").innerHTML = "";
  document.getElementById("sack-details-production-date").innerHTML = "";
}

export function clearProductDetails() {
  document.getElementById("product-details-address").innerHTML = "";
  document.getElementById("product-details-production-date").innerHTML = "";
  document.getElementById("product-details-sacks").innerHTML = "";
}

export function clearSackOwners() {
  document.getElementById("sack-owners").innerHTML = "";
}

export function clearProductOwners() {
  document.getElementById("product-owners").innerHTML = "";
}

export function formatDate() {
  var date = new Date();
  return (
    ("0" + date.getHours().toString()).slice(-2) +
    ":" +
    ("0" + date.getMinutes().toString()).slice(-2) +
    ":" +
    ("0" + date.getSeconds().toString()).slice(-2) +
    " " +
    ("0" + date.getDate().toString()).slice(-2) +
    "/" +
    ("0" + (date.getMonth() + 1).toString()).slice(-2) +
    "/" +
    ("0" + date.getFullYear().toString()).slice(-2)
  );
}

export function toggleActive(elem) {
  if (elem.classList.contains("active")) {
    elem.classList.remove("active");
  } else {
    elem.classList.add("active");
  }
}

export function clearActiveExcept(elem) {
  var elemList = elem.parentElement.children;
  for (var i = 0; i < elemList.length; i++) {
    if (elemList[i] != elem) {
      elemList[i].classList.remove("active");
    }
  }
}

export function sackListManager() {
  toggleActive(this);
  clearActiveExcept(this);

  if (this.classList.contains("active")) {
    fillSackDetails(this.innerHTML);
  } else {
    clearSackDetails();
  }
}

export function productSackListManager() {
  toggleActive(this);
}

export function productListManager() {
  toggleActive(this);
  clearActiveExcept(this);

  if (this.classList.contains("active")) {
    fillProductDetails(this.innerHTML);
  } else {
    clearProductDetails();
  }
}

export function addItemToList(item, list, click) {
  var elem = document.createElement("a");
  elem.innerHTML = item;
  elem.classList.add("collection-item");
  elem.addEventListener("click", click);
  document.getElementById(list).appendChild(elem);
}

export function getActiveItem(parent) {
  var itemList = document.getElementsByClassName("collection-item");
  for (const item of itemList) {
    if (item.parentElement.id === parent && item.classList.contains("active")) {
      return item;
    }
  }
  return undefined;
}

export function getMultipleActiveItems() {
  var arr = [];
  var itemList = document.getElementsByClassName("collection-item");
  for (const item of itemList) {
    if (
      item.parentElement.id === "product-sack-list" &&
      item.classList.contains("active")
    ) {
      arr.push(item);
    }
  }
  return arr;
}

export async function getOwnersFromEvents(sackHash, event) {
  // @dev https://web3js.readthedocs.io/en/v1.2.11/web3-eth-contract.html#getpastevents
  var res = await window.ownership.getPastEvents(event, {
    filter: { itemHash: sackHash },
    fromBlock: 0,
    toBlock: "latest",
  });

  var history = [];
  for (const single of res) {
    history.push(single.returnValues.newOwner);
  }
  return history;
}

export async function getItemsFromEvent(addr, event) {
  var res = await window.ownership.getPastEvents(event, {
    filter: { newOwner: addr },
    fromBlock: 0,
    toBlock: "latest",
  });

  var owned = [];
  for (const single of res) {
    owned.push(single.returnValues.itemHash);
  }
  return owned;
}

export function fillOwnerDetails(owners, list) {
  var ownerDetails = "";
  for (const owner of owners) {
    ownerDetails = ownerDetails.concat(owner, "\n");
  }
  document.getElementById(list).innerHTML = ownerDetails;
}

export async function retailerSackListManager() {
  toggleActive(this);
  clearActiveExcept(this);

  if (this.classList.contains("active")) {
    var res = await getOwnersFromEvents(this.innerHTML, "SackOwnerChange");
    fillOwnerDetails(res, "sack-owners");
  } else {
    clearSackOwners();
  }
}

export async function retailerProductListManager() {
  toggleActive(this);
  clearActiveExcept(this);

  if (this.classList.contains("active")) {
    clearSackOwners();
    clearRetailerSacks();
    var res = await getOwnersFromEvents(this.innerHTML, "ProductOwnerChange");
    fillOwnerDetails(res, "product-owners");
    await showRetailerProductSacks(this.innerHTML);
  } else {
    clearProductOwners();
    clearSackOwners();
    clearRetailerSacks();
  }
}

/*
@dev Issue in fetching all sacks that had the caller account as owner at some point.
The harvester would have an ever increasing in size query for every window load as more
sacks are harvested.
TODO: find a better solution to load ONLY the currently owned sacks.
*/
export async function showHarvesterSacks() {
  var sacks = await getItemsFromEvent(window.accounts[0], "SackOwnerChange");
  for (const sack of sacks) {
    var owners = await getOwnersFromEvents(sack, "SackOwnerChange");
    if (owners[owners.length - 1] == window.accounts[0]) {
      addItemToList(sack, "sack-list", sackListManager);
    }
  }
}

/*
@dev Issue in fetching all sacks that had the caller account as owner at some point.
The manufacturer would have an increasing in size query for every window load as more
sacks are received.
TODO: find a better solution to load ONLY the currently owned sacks.
*/
export async function showManufacturerSacks() {
  var sacks = await getItemsFromEvent(window.accounts[1], "SackOwnerChange");
  for (const sack of sacks) {
    var owners = await getOwnersFromEvents(sack, "SackOwnerChange");
    var lastOwner = owners[owners.length - 1];
    var obj = await window.product.methods
      .sacks(sack)
      .call({ from: window.accounts[1] }, function (err, res) {
        if (err) {
          console.log(err);
        } else {
          return res;
        }
      });
    var usedStatus = obj["used"];
    if (lastOwner === window.accounts[1] && usedStatus == false) {
      addItemToList(sack, "product-sack-list", productSackListManager);
    }
  }
}

/*
@dev Issue in fetching all products that had the caller account as owner at some point.
The manufacturer would have an increasing in size query for every window load as more
products are manufactured.
TODO: find a better solution to load ONLY the currently owned products.
*/
export async function showManufacturerProducts() {
  var products = await getItemsFromEvent(
    window.accounts[1],
    "ProductOwnerChange"
  );
  for (const prod of products) {
    var owners = await getOwnersFromEvents(prod, "ProductOwnerChange");
    var lastOwner = owners[owners.length - 1];

    if (lastOwner === window.accounts[1]) {
      addItemToList(prod, "product-list", productListManager);
    }
  }
}

export async function showRetailerProductSacks(prod) {
  var sacks = await window.product.methods
    .getSacks(prod)
    .call({ from: window.accounts[0] });

  for (const sack of sacks) {
    addItemToList(sack, "sack-history", retailerSackListManager);
  }
}

export async function showRetailerProducts() {
  var products = await getItemsFromEvent(
    window.accounts[2],
    "ProductOwnerChange"
  );
  for (const prod of products) {
    addItemToList(prod, "product-history", retailerProductListManager);
  }
}

export function clearRetailerSacks() {
  var parent = document.getElementById("sack-history");
  while (parent.lastChild) {
    if (parent.lastChild.innerHTML == "Sack history") {
      break;
    } else {
      parent.lastChild.remove();
    }
  }
}
