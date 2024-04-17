// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import {console} from "hardhat/console.sol";
import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";
import {ERC1155Holder} from "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import {IERC1155Receiver} from "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import {IERC1155MetadataURI} from "@openzeppelin/contracts/token/ERC1155/extensions/IERC1155MetadataURI.sol";

contract RealEstateFungibleToken is
    ERC1155,
    ReentrancyGuard,
    ERC1155Holder,
    Ownable
{
    using Math for uint256;

    /**
     * @notice A struct to hold property details.
     * @param metadataURI The metadata URI for the property.
     * @param totalTokens The total number of tokens that have been minted for the property.
     * @param pricePerTokenInWei The price per token in Wei.
     * @param fee The fee charged on the total price of the property. Used when listing or buying tokens.
     */
    struct Property {
        string metadataURI;
        uint256 totalTokens;
        uint256 pricePerTokenInWei;
        uint256 fee;
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

    constructor() ERC1155("") Ownable(msg.sender) {}

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
     * @dev return the fee for a given property.
     * @param propertyId The property id.
     */
    function getFee(uint256 propertyId) external view returns (uint256) {
        return properties[propertyId].fee;
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
     * @param totalTokens The amount of tokens to mint.
     * @param metadataURI The metadata URI for the token.
     */
    function mint(
        address to,
        uint256 propertyId,
        uint256 totalTokens,
        uint256 pricePerTokenInWei,
        string memory metadataURI
    ) public {
        require(
            properties[propertyId].totalTokens == 0,
            "Property was previously tokenized."
        );
        // Calculate the total price of the property
        (bool totalOverflow, uint256 totalPrice) = pricePerTokenInWei.tryMul(
            totalTokens
        );
        require(totalOverflow, "Property Value Overflow.");

        // Calculate the fee, should be .01% of the total price
        (bool zeroFlag, uint256 fee) = totalPrice.tryDiv(10000);
        require(zeroFlag, "Cannot divide by zero.");

        properties[propertyId] = Property(
            metadataURI,
            totalTokens,
            pricePerTokenInWei,
            fee
        );
        _mint(to, propertyId, totalTokens, "");
        emit PropertyTokenized(propertyId, to, totalTokens);
    }

    /** @dev Function to allow a user to list their tokens for sale, transferring them to the contract for escrow.
     * A fee is charged on the total price of the property.
     * @param saleId The sale ID.
     * @param propertyId The property ID.
     * @param amountOfTokens The amount of tokens to list for sale.
     */
    function listTokenForSale(
        uint256 saleId,
        uint256 propertyId,
        uint256 amountOfTokens
    ) public payable {
        Property memory property = properties[propertyId];
        require(property.totalTokens > 0, "Property has not been tokenized.");
        require(
            balanceOf(msg.sender, propertyId) >= amountOfTokens,
            "Insufficient property token balance."
        );
        require(
            tokensForSale[saleId].amountOfTokens == 0,
            "Sale ID already exists."
        );

        require(msg.value >= property.fee, "Insufficient fee payment.");
        require(msg.value <= property.fee, "Excess fee payment.");

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

        payable(owner()).transfer(msg.value);

        emit TokensListed(saleId, propertyId, msg.sender, amountOfTokens);
    }

    /**
     * @dev Function to mint and list tokens for sale in one transaction.
     * @param to The address that will receive the tokens.
     * @param propertyId The property ID.
     * @param totalTokens The amount of tokens to mint
     * @param pricePerTokenInWei The price per token in Wei.
     * @param metadataURI The metadata URI for the token.
     * @param saleId The sale ID.
     * @param amountOfTokens The amount of tokens to list for sale.
     */
    function mintAndListTokenForSale(
        address to,
        uint256 propertyId,
        uint256 totalTokens,
        uint256 pricePerTokenInWei,
        string memory metadataURI,
        uint256 saleId,
        uint256 amountOfTokens
    ) external payable {
        mint(to, propertyId, totalTokens, pricePerTokenInWei, metadataURI);
        listTokenForSale(saleId, propertyId, amountOfTokens);
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
        (bool tokenPriceOverflow, uint256 tokenPrice) = property
            .pricePerTokenInWei
            .tryMul(sale.amountOfTokens);
        //? this should never happen, we check for this kind of overflow in the mint function
        //? we also check in the setPricePerTokenInWei function
        require(tokenPriceOverflow, "Price overflow.");

        (bool totalOverflow, uint256 totalPrice) = tokenPrice.tryAdd(
            property.fee
        );
        //? it is very unlikely that this will happen, but it is possible, so we check for it
        require(totalOverflow, "Total price overflow.");

        require(msg.value >= totalPrice, "Insufficient payment.");
        require(msg.value <= totalPrice, "Excess payment.");

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

        // Transfer Ether from buyer to seller
        payable(sale.seller).transfer(tokenPrice);

        // Transfer fee to owner
        payable(owner()).transfer(property.fee);

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

        // Calculate the total price of the property
        (bool totalOverflow, uint256 totalPrice) = pricePerTokenInWei.tryMul(
            properties[propertyId].totalTokens
        );
        require(totalOverflow, "Property Value Overflow.");

        // Calculate the fee
        (bool zeroFlag, uint256 fee) = totalPrice.tryDiv(10000);
        require(zeroFlag, "Cannot divide by zero.");

        properties[propertyId].fee = fee;
    }
}
