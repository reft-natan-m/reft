// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import {console} from "hardhat/console.sol";
import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";
import {ERC1155Holder} from "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import {IERC1155Receiver} from "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import {IERC1155MetadataURI} from "@openzeppelin/contracts/token/ERC1155/extensions/IERC1155MetadataURI.sol";

contract RealEstateFungibleToken is ERC1155, ReentrancyGuard, ERC1155Holder {
    using Math for uint256;

    /**
     * @notice A struct to hold property details.
     * @param metadataURI The metadata URI for the property.
     * @param totalTokens The total number of tokens that have been minted for the property.
     * @param pricePerTokenInWei The price per token in Wei.
     */
    struct Property {
        string metadataURI;
        uint256 totalTokens;
        uint256 pricePerTokenInWei;
    }

    /**
     * @notice A struct to hold details of a token sale.
     * @param seller The address of the seller.
     * @param propertyId The property ID of the token
     * @param amountOfTokens The amount of tokens for sale.
     */
    struct TokenSale {
        address seller;
        uint256 propertyId;
        uint256 amountOfTokens;
    }

    // propertyId => Property, stores all minted properties
    mapping(uint256 => Property) public properties;

    // saleId => TokenSale, stores all tokens for sale
    mapping(uint256 => TokenSale) public tokensForSale;

    event PropertyTokenized(
        uint256 indexed propertyId,
        address indexed owner,
        uint256 totalTokens
    );
    event TokensBought(
        uint256 indexed propertyId,
        address indexed from,
        address indexed to,
        uint256 amountOfTokens
    );
    event TokensListed(
        uint256 indexed saleId,
        uint256 indexed propertyId,
        address indexed seller,
        uint256 amountOfTokens
    );
    event TokensDelisted(uint256 indexed saleId, uint256 indexed propertyId);

    constructor() ERC1155("") {}

    /**
     * @dev Override the supportsInterface function to add support for the IERC1155MetadataURI interface.
     * @param interfaceId The interface ID.
     */
    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC1155, ERC1155Holder) returns (bool) {
        return
            interfaceId == type(IERC1155).interfaceId ||
            interfaceId == type(IERC1155MetadataURI).interfaceId ||
            interfaceId == type(IERC1155Receiver).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    /**
     * @dev Override the uri function to return the metadata URI for a given property.
     * @param propertyId The property ID.
     */
    function uri(
        uint256 propertyId
    ) public view override returns (string memory) {
        return properties[propertyId].metadataURI;
    }

    /**
     * @dev return the pricePerTokenInWei for a given property.
     * @param propertyId The property id.
     */
    function getPricePerTokenInWei(
        uint256 propertyId
    ) external view returns (uint256) {
        return properties[propertyId].pricePerTokenInWei;
    }

    /**
     * @dev return the total supply of tokens for a given property.
     * @param propertyId The property id.
     */
    function totalSupply(uint256 propertyId) external view returns (uint256) {
        return properties[propertyId].totalTokens;
    }

    /**
     * @dev return the sale details for a given sale ID.
     * @param saleId The sale ID.
     */
    function getSale(uint256 saleId) external view returns (TokenSale memory) {
        return tokensForSale[saleId];
    }

    /**
     * @dev Function to mint tokens for a new property.
     * @param to The address that will receive the tokens.
     * @param propertyId The property ID.
     * @param amountOfTokens The amount of tokens to mint.
     * @param metadataURI The metadata URI for the token.
     */
    function mint(
        address to,
        uint256 propertyId,
        uint256 amountOfTokens,
        uint256 pricePerTokenInWei,
        string memory metadataURI
    ) external {
        require(
            properties[propertyId].totalTokens == 0,
            "Property was previously tokenized."
        );
        properties[propertyId] = Property(
            metadataURI,
            amountOfTokens,
            pricePerTokenInWei
        );
        _mint(to, propertyId, amountOfTokens, "");
        emit PropertyTokenized(propertyId, to, amountOfTokens);
    }

    /** @dev Function to allow a user to list their tokens for sale, transferring them to the contract for escrow.
     *  @param saleId The sale ID.
     * @param propertyId The property ID.
     * @param amountOfTokens The amount of tokens to list for sale.
     */
    function listTokenForSale(
        uint256 saleId,
        uint256 propertyId,
        uint256 amountOfTokens
    ) external {
        require(
            properties[propertyId].totalTokens > 0,
            "Property has not been tokenized."
        );
        require(
            balanceOf(msg.sender, propertyId) >= amountOfTokens,
            "Insufficient property token balance."
        );
        require(
            tokensForSale[saleId].amountOfTokens == 0,
            "Sale ID already exists."
        );

        tokensForSale[saleId] = TokenSale(
            msg.sender,
            propertyId,
            amountOfTokens
        );

        safeTransferFrom(
            msg.sender,
            address(this),
            propertyId,
            amountOfTokens,
            ""
        );

        emit TokensListed(saleId, propertyId, msg.sender, amountOfTokens);
    }

    /**
     * @dev Function to delist tokens for sale. Returns tokens to the seller.
     * @param saleId The sale ID.
     */
    function delistTokenForSale(uint256 saleId) external {
        TokenSale memory sale = tokensForSale[saleId];
        require(sale.amountOfTokens > 0, "Sale ID does not exist.");
        require(sale.seller == msg.sender, "Not the original owner.");

        /**
         * Transfer tokens back to the seller
         * ! The this. is required to call the ERC1155 safeTransferFrom function
         * ! This is important because the caller of this function does not have access to transfer
         * ! tokens now owned by the contract back to themselves
         *
         * ! When you call the function through this. it is as if the contract is calling the function
         * ! and the contract has access to its own tokens so the transfer is successful
         */
        this.safeTransferFrom(
            address(this),
            msg.sender,
            sale.propertyId,
            sale.amountOfTokens,
            ""
        );

        // Delete the sale
        delete tokensForSale[saleId];

        emit TokensDelisted(saleId, sale.propertyId);
    }

    /**
     * @dev Function to buy tokens from a seller.
     * @param saleId The sale ID.
     */
    function buyTokens(uint256 saleId) external payable nonReentrant {
        TokenSale memory sale = tokensForSale[saleId];
        require(sale.amountOfTokens > 0, "Sale ID does not exist.");

        Property memory property = properties[sale.propertyId];
        (bool priceOverflow, uint256 price) = property
            .pricePerTokenInWei
            .tryMul(sale.amountOfTokens);
        require(priceOverflow, "Price overflow.");

        require(msg.value >= price, "Insufficient payment.");
        require(msg.value <= price, "Excess payment.");

        // Transfer Ether from buyer to seller
        payable(sale.seller).transfer(msg.value);

        /**
         * Transfer tokens to the buyer from the contract
         * ! The this. is required to call the ERC1155 safeTransferFrom function
         * ! please see the comment in the delistTokenForSale function for more information
         */
        this.safeTransferFrom(
            address(this),
            msg.sender,
            sale.propertyId,
            sale.amountOfTokens,
            ""
        );

        // Delete the sale
        delete tokensForSale[saleId];

        emit TokensBought(
            sale.propertyId,
            sale.seller,
            msg.sender,
            sale.amountOfTokens
        );
    }

    /**
     * @dev update the metadata URI for a given property.
     * @param propertyId The property id.
     * @param metadataURI The new metadata URI.
     */
    function setMetadataURI(
        uint256 propertyId,
        string memory metadataURI
    ) external {
        require(
            properties[propertyId].totalTokens > 0,
            "Property has not been tokenized."
        );
        properties[propertyId].metadataURI = metadataURI;
    }

    /**
     * @dev update the price per token for a given property.
     * @param propertyId The property id.
     * @param pricePerTokenInWei The new price per token.
     */
    function setPricePerTokenInWei(
        uint256 propertyId,
        uint256 pricePerTokenInWei
    ) external {
        require(
            properties[propertyId].totalTokens > 0,
            "Property has not been tokenized."
        );
        properties[propertyId].pricePerTokenInWei = pricePerTokenInWei;
    }
}