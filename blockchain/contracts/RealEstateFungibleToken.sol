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
     * @notice A struct to hold details of a token listing.
     * @param seller The address of the seller.
     * @param propertyId The property ID of the token
     * @param tokensListed The amount of tokens listed for purhcase.
     */
    struct TokenListing {
        address seller;
        uint256 propertyId;
        uint256 tokensListed;
    }

    /**
     * @notice A struct to hold details of a token delisting
     * @param seller The address of the seller.
     * @param propertyId The property ID of the token.
     * @param tokensDelisted The amount of tokens to delist.
     */
    struct TokenDelisting {
        address seller;
        uint256 propertyId;
        uint256 tokensDelisted;
    }

    /**
     * @notice A struct to hold details of a token purchase
     * @param buyer The address of the buyer.
     * @param sellerTokensSold A mapping of seller addresses to the amount of tokens sold from that seller.
     * @param propertyId The property ID of the token.
     * @param tokensBoughtTotal The total amount of tokens bought.
     */
    struct TokenPurchase {
        address buyer;
        address seller;
        uint256 propertyId;
        uint256 tokensBought;
    }

    // propertyId => Property, stores all minted properties
    mapping(uint256 => Property) public properties;

    // propertyId to an array of listings, stores all tokens for sale for a given property
    mapping(uint256 => TokenListing[]) public listings;

    event TokensMinted(
        uint256 propertyId,
        Property property,
        address indexed owner
    );
    event TokensBought(TokenPurchase purchase);
    event TokensListed(TokenListing listing);
    event TokensDelisted(TokenDelisting delisting);

    constructor() ERC1155("") Ownable(msg.sender) {}

    /**
     * @dev Override the supportsInterface function to add support for the IERC1155MetadataURI interface.
     * @param interfaceId The interface ID.
     * @return bool True if the contract supports the interface, false otherwise.
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
     * @return string The metadata URI for the property.
     */
    function uri(
        uint256 propertyId
    ) public view override returns (string memory) {
        return properties[propertyId].metadataURI;
    }

    /**
     * @dev return the pricePerTokenInWei for a given property.
     * @param propertyId The property id.
     * @return uint256 The price per token in Wei.
     */
    function getPricePerTokenInWei(
        uint256 propertyId
    ) external view returns (uint256) {
        return properties[propertyId].pricePerTokenInWei;
    }

    /**
     * @dev return the fee for a given property.
     * @param propertyId The property id.
     * @return uint256 The fee for the property.
     */
    function getFee(uint256 propertyId) external view returns (uint256) {
        return properties[propertyId].fee;
    }

    /**
     * @dev return the total supply of tokens for a given property.
     * @param propertyId The property id.
     * @return uint256 The total supply of tokens for the property.
     */
    function totalSupply(uint256 propertyId) external view returns (uint256) {
        return properties[propertyId].totalTokens;
    }

    /**
     * @dev get all property details
     * @param propertyId The property id.
     * @return Property The property details.
     */
    function getProperty(
        uint256 propertyId
    ) external view returns (Property memory) {
        return properties[propertyId];
    }

    /**
     * @dev Return all sales for a given property ID.
     * @param propertyId The property id.
     * @return TokenListing[] An array of all token sales for the specified property.
     */
    function getAllListingsForProperty(
        uint256 propertyId
    ) external view returns (TokenListing[] memory) {
        return listings[propertyId];
    }

    /**
     * @dev Function to mint tokens for a new property.
     * @param to The address that will receive the tokens.
     * @param propertyId The property ID.
     * @param totalTokens The amount of tokens to mint.
     * @param pricePerTokenInWei The price per token in Wei.
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

        Property memory property = Property(
            metadataURI,
            totalTokens,
            pricePerTokenInWei,
            fee
        );
        properties[propertyId] = property;

        _mint(to, propertyId, totalTokens, "");
        emit TokensMinted(propertyId, property, to);
    }

    /** @dev Function to allow a user to list their tokens for sale, transferring them to the contract for escrow.
     * A fee is charged on the total price of the property.
     * @param propertyId The property ID.
     * @param amountToList The amount of tokens to list for sale.
     */
    function listTokenForSale(
        uint256 propertyId,
        uint256 amountToList
    ) public payable {
        require(
            properties[propertyId].totalTokens > 0,
            "Property has not been tokenized."
        );
        require(
            balanceOf(msg.sender, propertyId) >= amountToList,
            "Insufficient property token balance."
        );
        require(
            msg.value == properties[propertyId].fee,
            "Incorrect fee amount."
        );

        TokenListing memory listing = TokenListing(
            msg.sender,
            propertyId,
            amountToList
        );

        listings[propertyId].push(listing);

        safeTransferFrom(
            msg.sender,
            address(this),
            propertyId,
            amountToList,
            ""
        );
        payable(owner()).transfer(msg.value);
        emit TokensListed(listing);
    }

    /**
     * @dev Function to mint and list tokens for sale in one transaction.
     * @param to The address that will receive the tokens.
     * @param propertyId The property ID.
     * @param totalTokens The amount of tokens to mint
     * @param pricePerTokenInWei The price per token in Wei.
     * @param metadataURI The metadata URI for the token.
     * @param amountToList The amount of tokens to list for sale.
     */
    function mintAndListTokenForSale(
        address to,
        uint256 propertyId,
        uint256 totalTokens,
        uint256 pricePerTokenInWei,
        string memory metadataURI,
        uint256 amountToList
    ) external payable {
        mint(to, propertyId, totalTokens, pricePerTokenInWei, metadataURI);
        listTokenForSale(propertyId, amountToList);
    }

    /**
     * @dev Function to delist a specified number of tokens for a property.
     * Tokens are delisted from the oldest listing made by the seller.
     * @param propertyId The property ID.
     * @param amountToDelist The number of tokens the seller wants to delist.
     */
    function delistTokenForSale(
        uint256 propertyId,
        uint256 amountToDelist
    ) external {
        require(amountToDelist > 0, "Cannot delist zero tokens.");
        require(
            properties[propertyId].totalTokens > 0,
            "Property has not been tokenized."
        );
        uint256 remaining = amountToDelist;
        TokenListing[] storage tokenListings = listings[propertyId];
        uint256 index = 0;

        while (remaining > 0 && index < tokenListings.length) {
            // get the current property listing
            TokenListing storage tokenListing = tokenListings[index];

            // only delist tokens from listings the seller made
            if (
                tokenListing.seller == msg.sender &&
                tokenListing.tokensListed > 0
            ) {
                // update the amount of tokens listed
                uint256 amountToDelistFromCurrentListing = Math.min(
                    remaining,
                    tokenListing.tokensListed
                );
                remaining -= amountToDelistFromCurrentListing;
                tokenListing.tokensListed -= amountToDelistFromCurrentListing;

                //transfer the tokens back to the seller
                this.safeTransferFrom(
                    address(this),
                    msg.sender,
                    propertyId,
                    amountToDelistFromCurrentListing,
                    ""
                );

                // if the listing is empty, remove it
                if (tokenListing.tokensListed == 0) {
                    // Shift all elements to the left to maintain order and remove the current sale
                    for (uint256 i = index; i < tokenListings.length - 1; i++) {
                        tokenListings[i] = tokenListings[i + 1];
                    }

                    // Remove the last element after shifting
                    tokenListings.pop();
                } else {
                    // the listing is not empty, check while loop conditions again for the same index
                    continue;
                }
            } else {
                // Move to the next sale if the current sale is not the seller's
                index++;
            }
        }

        require(
            remaining == 0,
            "Not enough tokens listed to delist the requested amount."
        );
        TokenDelisting memory delisting = TokenDelisting(
            msg.sender,
            propertyId,
            amountToDelist
        );
        emit TokensDelisted(delisting);
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
        require(
            properties[propertyId].totalTokens > 0,
            "Property has not been tokenized."
        );
        uint256 remaining = amountToBuy;
        uint256 totalPrice = 0;
        uint256 index = 0;
        TokenListing[] storage tokenListings = listings[propertyId];

        // The remaining check is the main check, the index check is a failsafe
        while (remaining > 0 && index < tokenListings.length) {
            TokenListing storage tokenListing = tokenListings[index];
            if (tokenListing.tokensListed > 0) {
                uint256 taking = Math.min(remaining, tokenListing.tokensListed);
                uint256 tokenPrice = properties[propertyId].pricePerTokenInWei *
                    taking;
                totalPrice += tokenPrice;
                remaining -= taking;
                tokenListing.tokensListed -= taking;
                this.safeTransferFrom(
                    address(this),
                    msg.sender,
                    propertyId,
                    taking,
                    ""
                );
                payable(tokenListing.seller).transfer(tokenPrice);

                TokenPurchase memory purchase = TokenPurchase(
                    msg.sender,
                    tokenListing.seller,
                    propertyId,
                    taking
                );

                emit TokensBought(purchase);

                // if the listing is empty, remove it
                if (tokenListing.tokensListed == 0) {
                    // Shift all elements to the left to maintain order and remove the current sale
                    for (uint256 i = index; i < tokenListings.length - 1; i++) {
                        tokenListings[i] = tokenListings[i + 1];
                    }

                    // Remove the last element after shifting
                    tokenListings.pop();
                    continue;
                } else {
                    // the listing is not empty, check while loop conditions again for the same index
                    continue;
                }
            } else {
                // This is pretty much impossible to hit, but just in case
                // Shift all elements to the left to maintain order and remove the current sale
                for (uint256 i = index; i < tokenListings.length - 1; i++) {
                    tokenListings[i] = tokenListings[i + 1];
                }

                // Remove the last element after shifting
                tokenListings.pop();
                continue;
            }
        }

        totalPrice += properties[propertyId].fee;

        require(remaining == 0, "Not enough tokens available for sale.");
        require(msg.value == totalPrice, "Incorrect payment amount.");
        payable(owner()).transfer(properties[propertyId].fee);
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
        Property storage property = properties[propertyId];
        require(property.totalTokens > 0, "Property has not been tokenized.");
        property.metadataURI = metadataURI;
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
        Property storage property = properties[propertyId];
        require(property.totalTokens > 0, "Property has not been tokenized.");
        property.pricePerTokenInWei = pricePerTokenInWei;

        // Calculate the total price of the property
        (bool totalOverflow, uint256 totalPrice) = pricePerTokenInWei.tryMul(
            property.totalTokens
        );
        require(totalOverflow, "Property Value Overflow.");

        // Calculate the fee
        (bool zeroFlag, uint256 fee) = totalPrice.tryDiv(10000);
        require(zeroFlag, "Cannot divide by zero.");

        property.fee = fee;
    }
}
