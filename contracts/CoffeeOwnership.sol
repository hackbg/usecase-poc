// SPDX-License-Identifier: MIT

pragma solidity ^0.7.0;

abstract contract CoffeeProductionABI {
    struct Sack {
        address producer;
        string beanType;
        string serialNumber;
        string productionDate;
    }

    struct Product {
        address producer;
        string productType;
        string serialNumber;
        string productionDate;
        bytes32[5] usedSacks;
    }

    uint256 public startDate;
    mapping(bytes32 => Sack) public sacks;
    mapping(bytes32 => Product) public products;

    function getSacks(bytes32 productHash)
        public
        view
        virtual
        returns (bytes32[5] memory);
}

contract CoffeeOwnership {
    mapping(bytes32 => address) public sackToOwner;
    mapping(bytes32 => address) public productToOwner;

    event SackOwnerChange(bytes32 indexed itemHash, address indexed newOwner);
    event ProductOwnerChange(
        bytes32 indexed itemHash,
        address indexed newOwner
    );

    CoffeeProductionABI productionAbi;

    constructor(address coffeeProductionAddress) {
        productionAbi = CoffeeProductionABI(coffeeProductionAddress);
    }

    function addSackOwner(bytes32 sackHash) public {
        (address producer, , , ) = productionAbi.sacks(sackHash);
        require(
            sackToOwner[sackHash] == address(0),
            "Sack already has an owner"
        );
        require(
            producer == msg.sender,
            "Sack initial owner can only be the producer"
        );
        sackToOwner[sackHash] = msg.sender;
        emit SackOwnerChange(sackHash, msg.sender);
    }

    function addProductOwner(bytes32 productHash) public {
        (address producer, , , ) = productionAbi.products(productHash);
        require(
            productToOwner[productHash] == address(0),
            "Sack already has an owner"
        );
        require(
            producer == msg.sender,
            "Sack initial owner can only be the producer"
        );
        productToOwner[productHash] = msg.sender;
        emit ProductOwnerChange(productHash, msg.sender);
    }

    function changeSackOwner(bytes32 sackHash, address newOwner) public {
        require(
            sackToOwner[sackHash] == msg.sender,
            "Sack isn't owned by message sender"
        );
        sackToOwner[sackHash] = newOwner;
        emit SackOwnerChange(sackHash, newOwner);
    }

    function changeProductOwner(bytes32 productHash, address newOwner) public {
        require(
            productToOwner[productHash] == msg.sender,
            "Product isn't owned by message sender"
        );
        productToOwner[productHash] = newOwner;
        emit ProductOwnerChange(productHash, newOwner);
        // Since the coffee within the sacks used for making the product itself
        // must also be included, their ownership is also changed, to keep the ownership chain logically sound.
        bytes32[5] memory sacks = productionAbi.getSacks(productHash);
        for (uint256 i = 0; i < 5; i++) {
            sackToOwner[sacks[i]] = newOwner;
            emit SackOwnerChange(sacks[i], newOwner);
        }
    }
}
