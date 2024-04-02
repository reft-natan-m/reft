// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {console} from "hardhat/console.sol";
import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";
import {ERC1155Holder} from "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import {IERC1155Receiver} from "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import {IERC1155MetadataURI} from "@openzeppelin/contracts/token/ERC1155/extensions/IERC1155MetadataURI.sol";

contract RealEstateFungibleToken is ERC1155, ReentrancyGuard, ERC1155Holder {
    using Math for uint256;

    // Struct to hold property details
    struct Property {
        string metadataURI;
        uint256 totalTokens;
        uint256 pricePerToken;
    }

    // Struct to hold sale information
    struct TokenSale {
        address seller;
        uint256 propertyId;
        uint256 amount;
    }

    // Property ID to Property details
    mapping(uint256 => Property) public properties;

    // Mapping to track tokens for sale
    mapping(uint256 => TokenSale) public tokensForSale;

    // Events
    event PropertyTokenized(
        uint256 indexed propertyId,
        address indexed owner,
        uint256 totalTokens
    );
    event TokensBought(
        uint256 indexed propertyId,
        address indexed from,
        address indexed to,
        uint256 amount
    );

    constructor() ERC1155("") {}

    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC1155, ERC1155Holder) returns (bool) {
        return
            interfaceId == type(IERC1155).interfaceId ||
            interfaceId == type(IERC1155MetadataURI).interfaceId ||
            interfaceId == type(IERC1155Receiver).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    /**
     * @dev Function to mint tokens for a new property.
     * @param to The address that will receive the tokens.
     * @param propertyId The property ID.
     * @param amount The amount of tokens to mint.
     * @param metadataURI The metadata URI for the token.
     */
    function mint(
        address to,
        uint256 propertyId,
        uint256 amount,
        uint256 pricePerToken,
        string memory metadataURI
    ) public {
        require(
            properties[propertyId].totalTokens == 0,
            "Property already tokenized"
        );
        properties[propertyId] = Property(metadataURI, amount, pricePerToken);
        _mint(to, propertyId, amount, "");
        emit PropertyTokenized(propertyId, to, amount);
    }

    // Function to allow a user to list their tokens for sale
    function listTokenForSale(
        uint256 saleId,
        uint256 propertyId,
        uint256 amount
    ) public {
        require(
            balanceOf(msg.sender, propertyId) >= amount,
            "Insufficient token balance"
        );
        require(tokensForSale[saleId].amount == 0, "Sale ID already used");
        require(
            properties[propertyId].totalTokens > 0,
            "Property not tokenized"
        );

        tokensForSale[saleId] = TokenSale(msg.sender, propertyId, amount);

        // Transfer tokens to contract for escrow
        safeTransferFrom(msg.sender, address(this), propertyId, amount, "");
    }

    // function delistTokenForSale(uint256 saleId) public {
    //     TokenSale memory sale = tokensForSale[saleId];
    //     require(sale.amount > 0, "Sale does not exist");
    //     require(sale.seller == msg.sender, "Not the seller");

    //     // Transfer tokens back to seller
    //     safeTransferFrom(
    //         address(this),
    //         msg.sender,
    //         sale.propertyId,
    //         sale.amount,
    //         ""
    //     );

    //     // Clear the sale
    //     delete tokensForSale[saleId];
    // }

    // Function to buy tokens
    function buyTokens(uint256 saleId) public payable nonReentrant {
        TokenSale memory sale = tokensForSale[saleId];

        require(sale.amount > 0, "Sale does not exist");
        uint256 propertyId = sale.propertyId;
        Property memory property = properties[propertyId];
        (bool priceOverflow, uint256 price) = property.pricePerToken.tryMul(
            sale.amount
        );
        console.log("Property ID: %s", propertyId);
        console.log("Property Price: %s", property.pricePerToken);
        console.log("priceOverflow", priceOverflow);
        console.log("Price: %s", price);
        console.log("msg.value: %s", msg.value);
        require(priceOverflow, "Price overflow.");
        require(msg.value >= price, "Insufficient payment");

        // Transfer Ether from buyer to seller
        payable(sale.seller).transfer(msg.value);

        // Transfer tokens from contract to buyer
        safeTransferFrom(
            address(this),
            msg.sender,
            propertyId,
            sale.amount,
            ""
        );

        // Clear the sale
        delete tokensForSale[saleId];
    }

    /**
     * @dev Override the uri function to return the metadata URI for a given property.
     * @param id The property ID.
     */
    function uri(uint256 id) public view override returns (string memory) {
        return properties[id].metadataURI;
    }

    /**
     * @dev Override the totalSupply function to return the total supply of tokens for a given property.
     * @param id The property ID.
     */
    function totalSupply(uint256 id) public view returns (uint256) {
        return properties[id].totalTokens;
    }

    /**
     * @dev update the metadata URI for a given property.
     * @param id The property ID.
     * @param metadataURI The new metadata URI.
     */
    function setMetadataURI(uint256 id, string memory metadataURI) public {
        require(properties[id].totalTokens > 0, "Property not tokenized");
        properties[id].metadataURI = metadataURI;
    }

    /**
     * @dev update the price per token for a given property.
     * @param id The property ID.
     * @param pricePerToken The new price per token.
     */
    function setPricePerToken(uint256 id, uint256 pricePerToken) public {
        require(properties[id].totalTokens > 0, "Property not tokenized");
        properties[id].pricePerToken = pricePerToken;
    }
}
