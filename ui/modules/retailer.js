import { initContracts, showRetailerProducts } from "./helper.js";

window.onload = async function () {
  let web3 = new Web3(
    Web3.givenProvider ||
      new Web3.providers.HttpProvider("http://localhost:8545")
  );
  await initContracts(web3);

  document.getElementById("retailer-address").innerHTML = window.accounts[2];

  // await showRetailerSacks();
  await showRetailerProducts();
};
