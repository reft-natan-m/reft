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

    // propertyId to list of sales, stores all tokens for sale for a given property
    mapping(uint256 => TokenSale[]) public listings;

    event PropertyTokenized(
        uint256 indexed propertyId,
        address indexed owner,
        uint256 totalTokens
    );
    event TokensBought(
        uint256 indexed propertyId,
        address indexed from,
        address indexed to,
        uint256 amountBought
    );
    event TokensListed(
        uint256 indexed propertyId,
        address indexed seller,
        uint256 amountListed
    );
    event TokensDelisted(
        uint256 indexed propertyId,
        address indexed seller,
        uint256 amountDelisted
    );

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
     * @dev Return all sales for a given property ID.
     * @param propertyId The property id.
     * @return TokenSale[] An array of all token sales for the specified property.
     */
    function getAllSalesForProperty(
        uint256 propertyId
    ) external view returns (TokenSale[] memory) {
        return listings[propertyId];
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
     * @param propertyId The property ID.
     * @param amountOfTokens The amount of tokens to list for sale.
     */
    function listTokenForSale(
        uint256 propertyId,
        uint256 amountOfTokens
    ) public payable {
        require(
            properties[propertyId].totalTokens > 0,
            "Property has not been tokenized."
        );
        require(
            balanceOf(msg.sender, propertyId) >= amountOfTokens,
            "Insufficient property token balance."
        );
        require(
            msg.value == properties[propertyId].fee,
            "Incorrect fee amount."
        );

        listings[propertyId].push(
            TokenSale(msg.sender, propertyId, amountOfTokens)
        );
        safeTransferFrom(
            msg.sender,
            address(this),
            propertyId,
            amountOfTokens,
            ""
        );
        payable(owner()).transfer(msg.value);
        emit TokensListed(propertyId, msg.sender, amountOfTokens);
    }

    /**
     * @dev Function to mint and list tokens for sale in one transaction.
     * @param to The address that will receive the tokens.
     * @param propertyId The property ID.
     * @param totalTokens The amount of tokens to mint
     * @param pricePerTokenInWei The price per token in Wei.
     * @param metadataURI The metadata URI for the token.
     * @param amountOfTokens The amount of tokens to list for sale.
     */
    function mintAndListTokenForSale(
        address to,
        uint256 propertyId,
        uint256 totalTokens,
        uint256 pricePerTokenInWei,
        string memory metadataURI,
        uint256 amountOfTokens
    ) external payable {
        mint(to, propertyId, totalTokens, pricePerTokenInWei, metadataURI);
        listTokenForSale(propertyId, amountOfTokens);
    }

    /**
     * @dev Function to delist a specified number of tokens for a property. Tokens are delisted from the oldest listing made by the seller.
     * @param propertyId The property ID.
     * @param amountToDelist The number of tokens the seller wants to delist.
     */
    function delistTokenForSale(
        uint256 propertyId,
        uint256 amountToDelist
    ) external {
        require(amountToDelist > 0, "Cannot delist zero tokens.");
        uint256 remaining = amountToDelist;
        TokenSale[] storage sales = listings[propertyId];
        uint256 index = 0;

        while (remaining > 0 && index < sales.length) {
            TokenSale storage sale = sales[index];
            if (sale.seller == msg.sender && sale.amountOfTokens > 0) {
                uint256 delisting = Math.min(remaining, sale.amountOfTokens);
                remaining -= delisting;
                sale.amountOfTokens -= delisting;
                this.safeTransferFrom(
                    address(this),
                    msg.sender,
                    propertyId,
                    delisting,
                    ""
                );
                emit TokensDelisted(propertyId, msg.sender, delisting);
                if (sale.amountOfTokens == 0) {
                    sales[index] = sales[sales.length - 1]; // Remove the empty sale
                    sales.pop();
                }
            }
            if (sale.amountOfTokens > 0 || sale.seller != msg.sender) {
                ++index; // Only increment index if we didn't remove the current sale
            }
        }

        require(
            remaining == 0,
            "Not enough tokens listed to delist the requested amount."
        );
    }

    /**
     * @dev Function to buy tokens for a property.
     * @param propertyId The property ID.
     * @param amountToBuy The amount of tokens to buy.
     */
    function buyTokens(
        uint256 propertyId,
        uint256 amountToBuy
    ) external payable nonReentrant {
        require(amountToBuy > 0, "Cannot buy zero tokens.");
        uint256 remaining = amountToBuy;
        uint256 totalPrice = 0;
        uint256 index = 0;
        TokenSale[] storage sales = listings[propertyId];
        while (remaining > 0 && index < sales.length) {
            TokenSale storage sale = sales[index];
            if (sale.amountOfTokens > 0) {
                uint256 taking = Math.min(remaining, sale.amountOfTokens);
                uint256 tokenPrice = properties[propertyId].pricePerTokenInWei *
                    taking;
                totalPrice += tokenPrice + properties[propertyId].fee;
                remaining -= taking;
                sale.amountOfTokens -= taking;
                this.safeTransferFrom(
                    address(this),
                    msg.sender,
                    propertyId,
                    taking,
                    ""
                );
                payable(sale.seller).transfer(tokenPrice);
            }
            if (sale.amountOfTokens == 0) {
                sales[index] = sales[sales.length - 1]; // Remove the empty sale
                sales.pop();
            } else {
                ++index;
            }
        }

        require(remaining == 0, "Not enough tokens available for sale.");
        require(msg.value == totalPrice, "Incorrect payment amount.");
        payable(owner()).transfer(properties[propertyId].fee);
        emit TokensBought(propertyId, address(this), msg.sender, amountToBuy);
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
