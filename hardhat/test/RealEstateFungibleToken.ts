const { ethers } = require("hardhat");
const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("RealEstateFungibleToken contract", function () {
  async function deployRealEstateFungibleTokenFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const RealEstateFungibleToken = await ethers.getContractFactory(
      "RealEstateFungibleToken"
    );
    const realEstateFungibleToken = await RealEstateFungibleToken.deploy();

    await realEstateFungibleToken.deployed();

    return { realEstateFungibleToken, owner, addr1, addr2 };
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
      const amount = 1000;
      const pricePerToken = ethers.utils.parseEther("0.01");
      const metadataURI = "ipfs://example";

      await expect(
        realEstateFungibleToken.mint(
          owner.address,
          propertyId,
          amount,
          pricePerToken,
          metadataURI
        )
      )
        .to.emit(realEstateFungibleToken, "PropertyTokenized")
        .withArgs(propertyId, owner.address, amount);

      const property = await realEstateFungibleToken.properties(propertyId);
      expect(property.metadataURI).to.equal(metadataURI);
      expect(property.totalTokens).to.equal(amount);
      expect(property.pricePerToken).to.equal(pricePerToken);
    });

    it("Should prevent tokenizing a property that's already been tokenized", async function () {
      const { realEstateFungibleToken, owner } = await loadFixture(
        deployRealEstateFungibleTokenFixture
      );
      const propertyId = 1; // Assuming already used in previous test
      const amount = 1000;
      const pricePerToken = ethers.utils.parseEther("0.01");
      const metadataURI = "ipfs://example";

      await expect(
        realEstateFungibleToken.mint(
          owner.address,
          propertyId,
          amount,
          pricePerToken,
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

      await realEstateFungibleToken.setMetadataURI(propertyId, newMetadataURI);
      const property = await realEstateFungibleToken.properties(propertyId);
      expect(property.metadataURI).to.equal(newMetadataURI);
    });
  });

  // Continue with tests for other functions and edge cases...
});
