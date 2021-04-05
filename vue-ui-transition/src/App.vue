<template>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Coffee Supply Chain</title>
  </head>
  <the-navigation></the-navigation>
  <main>
    <template v-if="isVisible">
      <router-view
        :web3="web3"
        :productContract="productContract"
        :ownershipContract="ownershipContract"
        :harvesterAddress="harvesterAddress"
        :manufacturerAddress="manufacturerAddress"
        :retailerAddress="retailerAddress"
      ></router-view>
    </template>
  </main>
</template>

<script>
import TheNavigation from "@/components/nav/TheNavigation.vue";
import { productABI, ownershipABI } from "@/libs/ContractABIs.js";
import Web3 from "web3";

export default {
  components: { TheNavigation },
  data() {
    return {
      web3: Web3,
      productContract: null,
      ownershipContract: null,
      harvesterAddress: "",
      manufacturerAddress: "",
      retailerAddress: "",
    };
  },
  computed: {
    isVisible() {
      if (this.ownershipContract !== null && this.productContract !== null) {
        return true;
      }
      return false;
    },
  },
  methods: {
    async initContracts(web3Instance) {
      window.accounts = await web3Instance.eth.getAccounts();
      console.log("Accounts successfully loaded");
      this.harvesterAddress = window.accounts[0];
      this.manufacturerAddress = window.accounts[1];
      this.retailerAddress = window.accounts[2];

      this.productContract = new web3Instance.eth.Contract(productABI);
      this.productContract.options.address =
        "0x3D7f34784607C73e13E8efcB4d98284f9aaD184a";

      this.ownershipContract = new web3Instance.eth.Contract(ownershipABI);
      this.ownershipContract.options.address =
        "0xFf5Caf4ae86d0662bFc1BC5d7ac6f7708320E764";
    },
  },
  mounted() {
    this.web3 = new Web3(
      Web3.givenProvider ||
        new Web3.providers.HttpProvider("http://localhost:8545")
    );
    window.accounts = this.web3.eth.getAccounts();
    this.initContracts(this.web3);
  },
};
</script>

<style>
#app {
  font-family: Roboto, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
