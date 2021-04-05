<template>
  <body>
    <div class="container">
      <address-title
        title="Coffee Harvester"
        :address="harvesterAddress"
      ></address-title>
      <sack-type @harvestSack="harvestSack"></sack-type>
      <div class="collection with-header">
        <p class="collection-header">Sacks in stock</p>
        <p v-if="sacksLoading">Loading...</p>
        <p v-else-if="!sacksLoading && sacks.length === 0">No sacks in stock</p>
        <generic-item-hash
          v-else
          v-for="sack in sacks"
          :key="sack"
          :hash="sack"
          @toggle="toggleSack(sack)"
          :class="{ active: sack === this.selectedSack.id }"
        ></generic-item-hash>
      </div>
      <div class="row">
        <sack-details
          :address="selectedSack.producer"
          :beanType="selectedSack.beanType"
          :productionDate="selectedSack.productionDate"
        ></sack-details>
        <input type="text" placeholder="New owner address" v-model="newOwner" />
        <button
          class="btn brown darken-4"
          :disabled="selectedSack.id === ''"
          @click="changeSackOwner"
        >
          Change owner
        </button>
      </div>
    </div>
  </body>
</template>

<script>
import SackDetails from "@/components/harvester/SackDetails.vue";
import SackType from "@/components/harvester/SackType.vue";
import GenericItemHash from "@/components/GenericItemHash.vue";
export default {
  components: {
    SackDetails,
    SackType,
    GenericItemHash,
  },
  data() {
    return {
      beanType: "",
      sacksLoading: false,
      sacks: [],
      selectedSack: {
        id: "",
        producer: "",
        beanType: "",
        productionDate: "",
      },
      newOwner: "",
    };
  },
  props: ["web3", "productContract", "ownershipContract", "harvesterAddress"],
  computed: {
    addressLoading() {
      return this.harvesterAddress;
    },
  },
  methods: {
    async loadHarvesterSacks(address) {
      this.sacksLoading = true;
      var sacks = await this.getItemsFromEvent(
        address,
        "SackOwnerChange",
        this.ownershipContract
      );
      for (const sack of sacks) {
        var owners = await this.getOwnersFromEvents(
          sack,
          "SackOwnerChange",
          this.ownershipContract
        );
        if (owners[owners.length - 1] == address) {
          this.sacks.unshift(sack);
        }
      }
      this.sacksLoading = false;
    },
    async harvestSack(beanType) {
      this.beanType = beanType;

      var productionDate = this.formatDate();

      var sackHash = this.web3.utils.soliditySha3(
        this.harvesterAddress,
        this.web3.utils.fromAscii(this.beanType),
        this.web3.utils.fromAscii(productionDate)
      );
      this.productContract.methods
        .harvestSack(this.beanType, productionDate)
        .send({ from: this.harvesterAddress, gas: 1000000 }, (err, res) => {
          if (err) console.log(err);
          else console.log(res);
        });
      this.sacks.unshift(sackHash);
    },
    toggleSack(sack) {
      if (this.selectedSack.id === sack) {
        this.selectedSack.id = "";
        this.selectedSack.producer = "";
        this.selectedSack.beanType = "";
        this.selectedSack.productionDate = "";
      } else {
        this.selectedSack.id = sack;
        this.productContract.methods.sacks(sack).call(
          {
            from: this.harvesterAddress,
          },
          (err, res) => {
            if (err) console.log(err);
            else {
              this.selectedSack.producer = res["producer"];
              this.selectedSack.beanType = res["beanType"];
              this.selectedSack.productionDate = res["productionDate"];

              this.ownershipContract.methods
                .sackToOwner(sack)
                .call({ from: this.harvesterAddress }, (err, res) => {
                  if (err) console.log(err);
                  else {
                    if (res === "0x0000000000000000000000000000000000000000") {
                      this.ownershipContract.methods
                        .addSackOwner(sack)
                        .send(
                          { from: this.harvesterAddress, gas: 3000000 },
                          (err, _) => {
                            if (err) console.log(err);
                            else
                              console.log(
                                "First owner auto-registered due to initial owner = address(0)"
                              );
                            console.log(_);
                          }
                        );
                    }
                  }
                });
            }
          }
        );
      }
    },
    changeSackOwner() {
      var sack = this.selectedSack.id;
      if (sack !== "") {
        var newOwner = this.newOwner;
        if (newOwner !== "") {
          this.ownershipContract.methods
            .changeSackOwner(sack, this.newOwner)
            .send({ from: this.harvesterAddress, gas: 1000000 }, (err, res) => {
              if (err) {
                console.log(err);
              } else {
                console.log(res);

                this.selectedSack.id = "";
                this.selectedSack.producer = "";
                this.selectedSack.beanType = "";
                this.selectedSack.productionDate = "";

                const ind = this.sacks.indexOf(sack);
                if (ind > -1) {
                  this.sacks.splice(ind, 1);
                }
              }
            });
        }
      }
    },
  },
  created() {
    this.loadHarvesterSacks(this.harvesterAddress);
  },
};
</script>
