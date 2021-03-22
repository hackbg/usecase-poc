const productABI = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  {
    inputs: [{ internalType: "bytes32", name: "productHash", type: "bytes32" }],
    name: "getSacks",
    outputs: [{ internalType: "bytes32[5]", name: "", type: "bytes32[5]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "beanType", type: "string" },
      { internalType: "string", name: "productionDate", type: "string" },
    ],
    name: "harvestSack",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    name: "itemCreated",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "productType", type: "string" },
      { internalType: "string", name: "productionDate", type: "string" },
      { internalType: "bytes32[5]", name: "sackArray", type: "bytes32[5]" },
    ],
    name: "manufactureProduct",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    name: "products",
    outputs: [
      { internalType: "address", name: "producer", type: "address" },
      { internalType: "string", name: "productType", type: "string" },
      { internalType: "string", name: "productionDate", type: "string" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    name: "sacks",
    outputs: [
      { internalType: "address", name: "producer", type: "address" },
      { internalType: "string", name: "beanType", type: "string" },
      { internalType: "string", name: "productionDate", type: "string" },
      { internalType: "bool", name: "used", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "startDate",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

const ownershipABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "coffeeProductionAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "itemHash",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "ProductOwnerChange",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "itemHash",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "SackOwnerChange",
    type: "event",
  },
  {
    inputs: [{ internalType: "bytes32", name: "productHash", type: "bytes32" }],
    name: "addProductOwner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "sackHash", type: "bytes32" }],
    name: "addSackOwner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "productHash", type: "bytes32" },
      { internalType: "address", name: "newOwner", type: "address" },
    ],
    name: "changeProductOwner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "sackHash", type: "bytes32" },
      { internalType: "address", name: "newOwner", type: "address" },
    ],
    name: "changeSackOwner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    name: "productToOwner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    name: "sackToOwner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
];

export { productABI, ownershipABI };
