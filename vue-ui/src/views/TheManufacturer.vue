<template>
  <body>
    <div class="container">
      <address-title
        title="Product Manufacturer"
        :address="manufacturerAddress"
      ></address-title>
      <div class="row">
        <div class="collection with-header">
          <p class="collection-header">Sacks in stock</p>
          <p v-if="sacksLoading">Loading...</p>
          <p v-else-if="!sacksLoading && sacks.length === 0">
            No sacks in stock
          </p>
          <manufacturer-sacks
            v-else
            v-for="sack in sacks"
            :key="sack"
            :hash="sack"
            @toggle="toggleSackSelection(sack)"
            :class="{ active: this.selectedSacks.includes(sack) }"
          ></manufacturer-sacks>
        </div>
      </div>
      <product-type @manufactureProduct="manufactureProduct"></product-type>
      <div class="row">
        <div class="collection with-header">
          <p class="collection-header">Products in stock</p>
          <p v-if="productsLoading">Loading...</p>
          <p v-else-if="!productsLoading && products.length === 0">
            No products in stock
          </p>
          <generic-item-hash
            v-else
            v-for="product in products"
            :key="product"
            :hash="product"
            @toggle="toggleProduct(product)"
            :class="{ active: product === this.selectedProduct.id }"
          ></generic-item-hash>
        </div>
        <div class="product-list-details">
          <product-details
            :manufacturer="selectedProduct.manufacturer"
            :productType="selectedProduct.type"
            :productSacks="selectedProduct.sacks"
            :manufactureDate="selectedProduct.manufactureDate"
          ></product-details>
          <input
            type="text"
            placeholder="New owner address"
            v-model="newOwner"
          />
          <button
            class="waves-effect waves-light btn brown darken-4"
            :disabled="selectedProduct.id === ''"
            @click="changeProductOwner"
          >
            Change owner
          </button>
        </div>
      </div>
    </div>
  </body>
</template>

<script>
import ManufacturerSacks from "@/components/manufacturer/ManufacturerSacks.vue";
import ProductType from "@/components/manufacturer/ProductType.vue";
import ProductDetails from "@/components/manufacturer/ProductDetails.vue";
import GenericItemHash from "@/components/GenericItemHash.vue";

export default {
  props: [
    "web3",
    "productContract",
    "ownershipContract",
    "manufacturerAddress",
  ],
  components: {
    ManufacturerSacks,
    ProductType,
    ProductDetails,
    GenericItemHash,
  },
  data() {
    return {
      sacksLoading: false,
      sacks: [],
      selectedSacks: [],
      productsLoading: false,
      products: [],
      selectedProduct: {
        id: "",
        manufacturer: "",
        type: "",
        sacks: [],
        manufactureDate: "",
      },
      newOwner: "",
    };
  },
  methods: {
    async loadManufacturerSacks() {
      this.sacksLoading = true;
      var sacks = await this.getItemsFromEvent(
        this.manufacturerAddress,
        "SackOwnerChange",
        this.ownershipContract
      );
      for (const sack of sacks) {
        var owners = await this.getOwnersFromEvents(
          sack,
          "SackOwnerChange",
          this.ownershipContract
        );
        var lastOwner = owners[owners.length - 1];
        var obj = await this.productContract.methods
          .sacks(sack)
          .call({ from: this.manufacturerAddress }, (err, res) => {
            if (err) {
              console.log(err);
            } else {
              return res;
            }
          });
        var usedStatus = obj["used"];
        if (lastOwner === this.manufacturerAddress && usedStatus == false) {
          this.sacks.unshift(sack);
        }
      }
      this.sacksLoading = false;
    },
    async loadManufacturerProducts() {
      this.productsLoading = true;
      var products = await this.getItemsFromEvent(
        this.manufacturerAddress,
        "ProductOwnerChange",
        this.ownershipContract
      );

      for (const prod of products) {
        var owners = await this.getOwnersFromEvents(
          prod,
          "ProductOwnerChange",
          this.ownershipContract
        );
        var lastOwner = owners[owners.length - 1];
        if (lastOwner === this.manufacturerAddress) {
          this.products.unshift(prod);
        }
      }

      this.productsLoading = false;
    },
    async manufactureProduct(productType) {
      if (this.selectedSacks.length !== 5) {
        alert("Use exactly 5 sacks to manufacture a product!");
        return false;
      }

      var productionDate = this.formatDate();

      this.productContract.methods
        .manufactureProduct(productType, productionDate, this.selectedSacks)
        .send({ from: this.manufacturerAddress, gas: 1000000 }, (err, res) => {
          if (err) {
            console.log(err);
          } else {
            console.log(res);
            var productHash = this.web3.utils.soliditySha3(
              this.manufacturerAddress,
              this.web3.utils.fromAscii(productType),
              this.web3.utils.fromAscii(productionDate)
            );
            this.products.unshift(productHash);

            for (const sack of this.selectedSacks) {
              const ind = this.sacks.indexOf(sack);
              if (ind > -1) {
                this.sacks.splice(ind, 1);
              }
            }
          }
        });
    },
    toggleSackSelection(sack) {
      if (this.selectedSacks.includes(sack)) {
        const ind = this.selectedSacks.indexOf(sack);
        if (ind > -1) {
          this.selectedSacks.splice(ind, 1);
        }
      } else {
        this.selectedSacks.push(sack);
      }
    },
    toggleProduct(prod) {
      if (this.selectedProduct.id === prod) {
        this.selectedProduct.id = "";
        this.selectedProduct.manufacturer = "";
        this.selectedProduct.type = "";
        this.selectedProduct.manufactureDate = "";
        this.selectedProduct.sacks = [];
      } else {
        this.selectedProduct.id = prod;
        this.selectedProduct.sacks = [];
        this.productContract.methods
          .products(prod)
          .call({ from: window.accounts[0] }, (err, res) => {
            if (err) console.log(err);
            else {
              this.selectedProduct.manufacturer = res["producer"];
              this.selectedProduct.manufactureDate = res["productionDate"];
              this.selectedProduct.type = res["productType"];

              this.productContract.methods
                .getSacks(prod)
                .call({ from: this.manufacturerAddress }, (err, res) => {
                  if (err) console.log(err);
                  else {
                    for (const sack of res) {
                      this.selectedProduct.sacks.unshift(sack);
                    }

                    this.ownershipContract.methods
                      .productToOwner(prod)
                      .call({ from: this.manufacturerAddress }, (err, res) => {
                        if (err) console.log(err);
                        else {
                          if (
                            res === "0x0000000000000000000000000000000000000000"
                          ) {
                            this.ownershipContract.methods
                              .addProductOwner(prod)
                              .send(
                                {
                                  from: this.manufacturerAddress,
                                  gas: 3000000,
                                },
                                (err, res) => {
                                  if (err) console.log(err);
                                  else
                                    console.log(
                                      "First owner registered " + res
                                    );
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
    },
    changeProductOwner() {
      if (this.selectedProduct.indexOf !== "") {
        if (this.newOwner !== "") {
          this.ownershipContract.methods
            .changeProductOwner(this.selectedProduct.id, this.newOwner)
            .send(
              { from: this.manufacturerAddress, gas: 1000000 },
              (err, res) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log(res);
                  this.selectedProduct.id = "";
                  this.selectedProduct.manufacturer = "";
                  this.selectedProduct.type = "";
                  this.selectedProduct.manufactureDate = "";
                  this.selectedProduct.sacks = [];

                  const ind = this.products.indexOf(this.selectedProduct.id);
                  if (ind > -1) {
                    this.products.splice(ind, 1);
                  }
                }
              }
            );
        } else {
          alert("Please enter the retailer address of the new owner!");
          return;
        }
      }
    },
  },
  created() {
    this.loadManufacturerSacks();
    this.loadManufacturerProducts();
  },
};
</script>
