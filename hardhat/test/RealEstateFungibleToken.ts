const { ethers } = require("hardhat");
const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("RealEstateFungibleToken contract", function () {
  async function deployRealEstateFungibleTokenFixture() {
    const [owner, second, third, fourth, fifth] = await ethers.getSigners();
    const RealEstateFungibleToken = await ethers.getContractFactory(
      "RealEstateFungibleToken"
    );
    const realEstateFungibleToken = await RealEstateFungibleToken.deploy();

    await realEstateFungibleToken.deployed();

    return { realEstateFungibleToken, owner, second, third, fourth, fifth };
  }

  describe("Deployment", function () {
    it("Should deploy correctly and set the owner", async function () {
      const { realEstateFungibleToken, owner } = await loadFixture(
        deployRealEstateFungibleTokenFixture
      );
      expect(
        await realEstateFungibleToken.supportsInterface("0xd9b67a26")
      ).to.equal(true); // IERC1155
    });
  });

  describe("Minting and Tokenizing Properties", function () {
    it("Should allow a property to be tokenized and minted", async function () {
      const { realEstateFungibleToken, owner } = await loadFixture(
        deployRealEstateFungibleTokenFixture
      );
      const propertyId = 1;
      const amount = 100;
      const pricePerTokenInWei = ethers.utils.parseEther("1");
      const metadataURI = "www.example.com";

      await expect(
        realEstateFungibleToken.mint(
          owner.address,
          propertyId,
          amount,
          pricePerTokenInWei,
          metadataURI
        )
      )
        .to.emit(realEstateFungibleToken, "PropertyTokenized")
        .withArgs(propertyId, owner.address, amount);

      const property = await realEstateFungibleToken.properties(propertyId);
      expect(property.metadataURI).to.equal(metadataURI);
      expect(property.totalTokens).to.equal(amount);
      expect(property.pricePerTokenInWei).to.equal(pricePerTokenInWei);
    });

    it("Should prevent tokenizing a property that's already been tokenized", async function () {
      const { realEstateFungibleToken, owner } = await loadFixture(
        deployRealEstateFungibleTokenFixture
      );
      const propertyId = 1;
      const amount = 100;
      const pricePerTokenInWei = ethers.utils.parseEther("0.01");
      const metadataURI = "www.example.com";

      await expect(
        realEstateFungibleToken.mint(
          owner.address,
          propertyId,
          amount,
          pricePerTokenInWei,
          metadataURI
        )
      )
        .to.emit(realEstateFungibleToken, "PropertyTokenized")
        .withArgs(propertyId, owner.address, amount);

      await expect(
        realEstateFungibleToken.mint(
          owner.address,
          propertyId,
          amount,
          pricePerTokenInWei,
          metadataURI
        )
      ).to.be.revertedWith("Property already tokenized");
    });
  });

  describe("Listing Tokens for Sale", function () {
    // Add tests for listing tokens for sale
  });

  describe("Buying Tokens", function () {
    // Add tests for buying tokens
  });

  describe("Updating Property Details", function () {
    it("Should allow updating the metadata URI of a tokenized property", async function () {
      const { realEstateFungibleToken, owner } = await loadFixture(
        deployRealEstateFungibleTokenFixture
      );

      const propertyId = 1; // Assuming this property was tokenized in an earlier test
      const newMetadataURI = "ipfs://newexample";
      const property = await realEstateFungibleToken.properties(propertyId);
      property.metadataURI = "www.old.com";

      await realEstateFungibleToken.setMetadataURI(propertyId, newMetadataURI);
      expect(property.metadataURI).to.equal(newMetadataURI);
    });
  });

  // Continue with tests for other functions and edge cases...
});
