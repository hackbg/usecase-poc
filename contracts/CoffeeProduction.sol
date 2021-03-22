// SPDX-License-Identifier: MIT

pragma solidity ^0.7.0;

contract CoffeeProduction {
    struct Sack {
        address producer;
        string beanType;
        string productionDate;
        bool used;
    }

    struct Product {
        address producer;
        string productType;
        string productionDate;
        bytes32[5] usedSacks;
    }

    uint256 public startDate;
    mapping(bytes32 => Sack) public sacks;
    mapping(bytes32 => Product) public products;
    mapping(bytes32 => bool) public itemCreated;

    constructor() {
        startDate = block.timestamp;
    }

    modifier itemNotCreated(bytes32 _itemHash) {
        require(itemCreated[_itemHash] == false);
        _;
    }

    function harvestSack(
        string calldata beanType,
        string calldata productionDate
    ) public returns (bytes32) {
        bytes32 sackHash =
            _hashInformation(msg.sender, beanType, productionDate);

        // Prevents the harvesting of two sacks with the same hash
        require(
            sacks[sackHash].producer == address(0),
            "Sack has already been harvested"
        );

        Sack memory harvested =
            Sack(msg.sender, beanType, productionDate, false);
        sacks[sackHash] = harvested;
        return sackHash;
    }

    function manufactureProduct(
        string calldata productType,
        string calldata productionDate,
        bytes32[5] calldata sackArray
    ) public returns (bytes32) {
        for (uint8 i = 0; i < 5; i++) {
            require(
                sacks[sackArray[i]].producer != address(0) &&
                    sacks[sackArray[i]].used == false,
                "Product must contain only verified harvested sacks"
            );
        }

        bytes32 productHash =
            _hashInformation(msg.sender, productType, productionDate);

        // Prevents the manufacturing of two products with the same hash
        require(
            products[productHash].producer == address(0),
            "Product has already been manufactured"
        );

        Product memory newProduct =
            Product(msg.sender, productType, productionDate, sackArray);

        for (uint8 i = 0; i < 5; i++) {
            sacks[sackArray[i]].used = true;
        }
        products[productHash] = newProduct;
        return productHash;
    }

    function getSacks(bytes32 productHash)
        public
        view
        returns (bytes32[5] memory)
    {
        require(
            products[productHash].producer != address(0),
            "Can't return the used sacks for an invalid product"
        );
        return products[productHash].usedSacks;
    }

    function _hashInformation(
        address _addr,
        string calldata _str1,
        string calldata _date
    ) private pure returns (bytes32) {
        // Parameters to bytes type
        bytes20 bAddr = bytes20(_addr);
        bytes memory bStr1 = bytes(_str1);
        bytes memory bDate = bytes(_date);

        uint256 totalLen = bAddr.length + bStr1.length + bDate.length;

        string memory strFull = new string(totalLen);
        bytes memory bFull = bytes(strFull);

        uint256 j = 0;

        for (uint256 i = 0; i < bAddr.length; i++) {
            bFull[j] = bAddr[i];
            j++;
        }
        for (uint256 i = 0; i < bStr1.length; i++) {
            bFull[j] = bStr1[i];
            j++;
        }
        for (uint256 i = 0; i < bDate.length; i++) {
            bFull[j] = bDate[i];
            j++;
        }

        return keccak256(bFull);
    }
}
