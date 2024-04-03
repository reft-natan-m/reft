import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers } from "hardhat";

describe("RealEstateFungibleToken contract", function () {
  async function deployRealEstateFungibleTokenFixture() {
    const [owner, second, third, fourth, fifth] = await ethers.getSigners();
    const RealEstateFungibleToken = await ethers.getContractFactory(
      "RealEstateFungibleToken"
    );
    const realEstateFungibleToken = await RealEstateFungibleToken.deploy();

    await realEstateFungibleToken.waitForDeployment();

    return { realEstateFungibleToken, owner, second, third, fourth, fifth };
  }

  async function tokenizeFixture() {
    const { realEstateFungibleToken, owner, second, third, fourth, fifth } =
      await loadFixture(deployRealEstateFungibleTokenFixture);

    const propertyId = 1;
    const amount = 100;
    const pricePerTokenInWei = ethers.parseEther("1");
    const metadataURI = "www.example.com";

    await realEstateFungibleToken.mint(
      owner.address,
      propertyId,
      amount,
      pricePerTokenInWei,
      metadataURI
    );

    return {
      realEstateFungibleToken,
      owner,
      propertyId,
      amount,
      pricePerTokenInWei,
      metadataURI,
      second,
      third,
      fourth,
      fifth,
    };
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
      const pricePerTokenInWei = ethers.parseEther("1");
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
      const {
        realEstateFungibleToken,
        owner,
        propertyId,
        amount,
        pricePerTokenInWei,
        metadataURI,
      } = await loadFixture(tokenizeFixture);

      await expect(
        realEstateFungibleToken.mint(
          owner.address,
          propertyId,
          amount,
          pricePerTokenInWei,
          metadataURI
        )
      ).to.be.revertedWith("Property was previously tokenized.");
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
      const { realEstateFungibleToken, propertyId, metadataURI } =
        await loadFixture(tokenizeFixture);

      const newMetadataURI = metadataURI + "/new";
      const property = await realEstateFungibleToken.properties(propertyId);
      expect(property.metadataURI).to.equal(metadataURI);

      await realEstateFungibleToken.setMetadataURI(propertyId, newMetadataURI);
      const updatedProperty = await realEstateFungibleToken.properties(
        propertyId
      );
      expect(updatedProperty.metadataURI).to.equal(newMetadataURI);
    });
  });

  // Continue with tests for other functions and edge cases...
});
