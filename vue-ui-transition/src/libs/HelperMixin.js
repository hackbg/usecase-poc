export default {
  data() {
    return {};
  },
  methods: {
    formatDate() {
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
    },

    addItemToList(item, list, click) {
      var elem = document.createElement("a");
      elem.innerHTML = item;
      elem.classList.add("collection-item");
      elem.addEventListener("click", click);
      document.getElementById(list).appendChild(elem);
    },
    async getItemsFromEvent(addr, event, contract) {
      var res = await contract.getPastEvents(event, {
        filter: { newOwner: addr },
        fromBlock: 0,
        toBlock: "latest",
      });

      var owned = [];
      for (const single of res) {
        owned.push(single.returnValues.itemHash);
      }
      return owned;
    },
    async getOwnersFromEvents(item, event, contract) {
      // @dev https://web3js.readthedocs.io/en/v1.2.11/web3-eth-contract.html#getpastevents
      var res = await contract.getPastEvents(event, {
        filter: { itemHash: item },
        fromBlock: 0,
        toBlock: "latest",
      });

      var history = [];
      for (const single of res) {
        history.push(single.returnValues.newOwner);
      }
      return history;
    },
  },
};
