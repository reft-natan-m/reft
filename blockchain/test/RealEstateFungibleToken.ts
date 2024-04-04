import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers } from "hardhat";

describe("RealEstateFungibleToken contract", function () {
  async function deployRealEstateFungibleTokenFixture() {
    const [owner, second, third, fourth, fifth] = await ethers.getSigners();
    const RealEstateFungibleToken = await ethers.getContractFactory("RealEstateFungibleToken");
    const realEstateFungibleToken = await RealEstateFungibleToken.deploy();

    await realEstateFungibleToken.waitForDeployment();

    return { realEstateFungibleToken, owner, second, third, fourth, fifth };
  }

  describe("Deployment", function () {
    it("Should deploy correctly and set the owner", async function () {
      const { realEstateFungibleToken } = await loadFixture(deployRealEstateFungibleTokenFixture);
      expect(await realEstateFungibleToken.supportsInterface("0xd9b67a26")).to.equal(true); // IERC1155
    });
  });

  async function tokenizeFixture() {
    const { realEstateFungibleToken, owner, second, third, fourth, fifth } = await loadFixture(
      deployRealEstateFungibleTokenFixture
    );

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
    it("Should allow listing tokens for sale", async function () {
      const { realEstateFungibleToken, owner, propertyId } = await loadFixture(tokenizeFixture);

      const saleId = 1;
      const amountOfTokensToSell = 1;

      await expect(
        realEstateFungibleToken.listTokenForSale(saleId, propertyId, amountOfTokensToSell)
      )
        .to.emit(realEstateFungibleToken, "TokensListed")
        .withArgs(saleId, propertyId, owner.address, amountOfTokensToSell);

      const sale = await realEstateFungibleToken.getSale(saleId);
      expect(sale.propertyId).to.equal(propertyId);
      expect(sale.amountOfTokens).to.equal(amountOfTokensToSell);
      expect(sale.seller).to.equal(owner.address);

      expect(await realEstateFungibleToken.balanceOf(owner.address, propertyId)).to.equal(
        99 // 100 - 1
      );
      expect(
        await realEstateFungibleToken.balanceOf(
          await realEstateFungibleToken.getAddress(),
          propertyId
        )
      ).to.equal(1);
    });

    it("Should prevent listing tokens for sale that don't exist", async function () {
      const { realEstateFungibleToken, owner } = await loadFixture(
        deployRealEstateFungibleTokenFixture
      );

      const saleId = 1;
      const propertyId = 1;
      const amountOfTokensToSell = 1;

      await expect(
        realEstateFungibleToken.listTokenForSale(saleId, propertyId, amountOfTokensToSell)
      ).to.be.revertedWith("Property has not been tokenized.");
    });

    it("Should prevent listing more tokens than the owner has", async function () {
      const { realEstateFungibleToken, owner, propertyId } = await loadFixture(tokenizeFixture);

      const saleId = 1;
      const amountOfTokensToSell = 101;

      await expect(
        realEstateFungibleToken.listTokenForSale(saleId, propertyId, amountOfTokensToSell)
      ).to.be.revertedWith("Insufficient property token balance.");
    });

    it("Should prevent listing tokens when signer does not own any for that property", async function () {
      const { realEstateFungibleToken, second, propertyId } = await loadFixture(tokenizeFixture);

      const saleId = 1;
      const amountOfTokensToSell = 1;

      await expect(
        realEstateFungibleToken
          .connect(second)
          .listTokenForSale(saleId, propertyId, amountOfTokensToSell)
      ).to.be.revertedWith("Insufficient property token balance.");
    });

    it("Should prevent listing tokens for a sale id that are already listed", async function () {
      const { realEstateFungibleToken, owner, propertyId } = await loadFixture(tokenizeFixture);

      const saleId = 1;
      const amountOfTokensToSell = 1;

      await realEstateFungibleToken.listTokenForSale(saleId, propertyId, amountOfTokensToSell);

      await expect(
        realEstateFungibleToken.listTokenForSale(saleId, propertyId, amountOfTokensToSell)
      ).to.be.revertedWith("Sale ID already exists.");
    });
  });

  async function listTokensFixture() {
    const {
      owner,
      second,
      third,
      fourth,
      fifth,
      realEstateFungibleToken,
      propertyId,
      amount,
      metadataURI,
      pricePerTokenInWei,
    } = await loadFixture(tokenizeFixture);

    const saleId = 1;
    const amountOfTokensToSell = 1;

    await realEstateFungibleToken.listTokenForSale(saleId, propertyId, amountOfTokensToSell);

    return {
      signers: { owner, second, third, fourth, fifth },
      realEstateFungibleToken,
      property: { propertyId, amount, metadataURI, pricePerTokenInWei },
      sale: { saleId, seller: owner.address, propertyId, amountOfTokensToSell },
    };
  }

  describe("Delisting Tokens for Sale", function () {
    it("Should allow delisting tokens for sale", async function () {
      const { realEstateFungibleToken, signers, sale, property } = await loadFixture(
        listTokensFixture
      );
      const { owner } = signers;
      const { saleId, propertyId } = sale;

      expect(await realEstateFungibleToken.balanceOf(owner.address, propertyId)).to.equal(99);
      expect(
        await realEstateFungibleToken.balanceOf(
          await realEstateFungibleToken.getAddress(),
          propertyId
        )
      ).to.equal(1);

      await expect(realEstateFungibleToken.delistTokenForSale(saleId))
        .to.emit(realEstateFungibleToken, "TokensDelisted")
        .withArgs(saleId, propertyId);

      const delistedSale = await realEstateFungibleToken.getSale(saleId);
      expect(delistedSale.seller).to.equal(ethers.ZeroAddress);
      expect(delistedSale.propertyId).to.equal(0);
      expect(delistedSale.amountOfTokens).to.equal(0);
      expect(await realEstateFungibleToken.balanceOf(owner.address, propertyId)).to.equal(100);
      expect(
        await realEstateFungibleToken.balanceOf(
          await realEstateFungibleToken.getAddress(),
          propertyId
        )
      ).to.equal(0);
    });

    it("Should prevent delisting tokens for sale IDs that don't exist", async function () {
      const { realEstateFungibleToken } = await loadFixture(deployRealEstateFungibleTokenFixture);

      const saleId = 1;

      await expect(realEstateFungibleToken.delistTokenForSale(saleId)).to.be.revertedWith(
        "Sale ID does not exist."
      );
    });

    it("Should prevent delisting tokens for sale IDs that are already delisted", async function () {
      const { realEstateFungibleToken, signers, sale } = await loadFixture(listTokensFixture);
      const { saleId } = sale;

      await realEstateFungibleToken.delistTokenForSale(saleId);

      await expect(realEstateFungibleToken.delistTokenForSale(saleId)).to.be.revertedWith(
        "Sale ID does not exist."
      );
    });

    it("Should prevent delisting tokens for sale IDs that are not owned by the signer", async function () {
      const { realEstateFungibleToken, signers, sale } = await loadFixture(listTokensFixture);
      const { second } = signers;
      const { saleId } = sale;

      await expect(
        realEstateFungibleToken.connect(second).delistTokenForSale(saleId)
      ).to.be.revertedWith("Not the original owner.");
    });
  });

  describe("Buying Tokens", function () {
    it("Should allow buying tokens", async function () {
      const { realEstateFungibleToken, signers, sale, property } = await loadFixture(
        listTokensFixture
      );
      const { owner, second } = signers;
      const { saleId, propertyId, amountOfTokensToSell } = sale;
      const { pricePerTokenInWei } = property;

      const salePrice = pricePerTokenInWei * BigInt(amountOfTokensToSell);

      expect(await realEstateFungibleToken.balanceOf(owner.address, propertyId)).to.equal(99);
      expect(
        await realEstateFungibleToken.balanceOf(
          await realEstateFungibleToken.getAddress(),
          propertyId
        )
      ).to.equal(1);
      expect(await realEstateFungibleToken.balanceOf(second.address, propertyId)).to.equal(0);

      const ownerWeiBalance = await owner.provider.getBalance(owner.address);

      await expect(
        realEstateFungibleToken.connect(second).buyTokens(saleId, {
          value: salePrice,
        })
      )
        .to.emit(realEstateFungibleToken, "TokensBought")
        .withArgs(propertyId, owner.address, second.address, amountOfTokensToSell);

      expect(await realEstateFungibleToken.balanceOf(owner.address, propertyId)).to.equal(99);
      expect(
        await realEstateFungibleToken.balanceOf(
          await realEstateFungibleToken.getAddress(),
          propertyId
        )
      ).to.equal(0);
      expect(await realEstateFungibleToken.balanceOf(second.address, propertyId)).to.equal(1);

      expect(await owner.provider.getBalance(owner.address)).to.equal(ownerWeiBalance + salePrice);

      const saleDetails = await realEstateFungibleToken.getSale(saleId);
      expect(saleDetails.seller).to.equal(ethers.ZeroAddress);
      expect(saleDetails.propertyId).to.equal(0);
      expect(saleDetails.amountOfTokens).to.equal(0);
    });

    it("Should prevent buying tokens for sale IDs that don't exist", async function () {
      const { realEstateFungibleToken, second } = await loadFixture(
        deployRealEstateFungibleTokenFixture
      );

      const saleId = 1;

      await expect(
        realEstateFungibleToken.connect(second).buyTokens(saleId, {
          value: ethers.parseEther("1"),
        })
      ).to.be.revertedWith("Sale ID does not exist.");
    });

    it("Should prevent buying tokens for sale IDs that are already delisted", async function () {
      const { realEstateFungibleToken, signers, sale } = await loadFixture(listTokensFixture);
      const { saleId } = sale;

      await realEstateFungibleToken.delistTokenForSale(saleId);

      await expect(
        realEstateFungibleToken.connect(signers.second).buyTokens(saleId, {
          value: ethers.parseEther("1"),
        })
      ).to.be.revertedWith("Sale ID does not exist.");
    });

    it("Should prevent buying tokens with insufficient amount of funds provided", async function () {
      const { realEstateFungibleToken, signers, sale, property } = await loadFixture(
        listTokensFixture
      );
      const { saleId, amountOfTokensToSell } = sale;
      const { pricePerTokenInWei } = property;

      const expectedPayment = pricePerTokenInWei * BigInt(amountOfTokensToSell);
      const insufficientPayment = expectedPayment - 1n;

      await expect(
        realEstateFungibleToken.connect(signers.second).buyTokens(saleId, {
          value: insufficientPayment,
        })
      ).to.be.revertedWith("Insufficient payment.");
    });

    it("Should prevent buying tokens with more funds than required", async function () {
      const { realEstateFungibleToken, signers, sale, property } = await loadFixture(
        listTokensFixture
      );
      const { saleId, amountOfTokensToSell } = sale;
      const { pricePerTokenInWei } = property;

      const expectedPayment = pricePerTokenInWei * BigInt(amountOfTokensToSell);
      const excessPayment = expectedPayment + 1n;

      await expect(
        realEstateFungibleToken.connect(signers.second).buyTokens(saleId, {
          value: excessPayment,
        })
      ).to.be.revertedWith("Excess payment.");
    });

    it("Should prevent buying tokens when a price overflow occurs", async function () {
      const { realEstateFungibleToken, owner, second, propertyId } = await loadFixture(
        tokenizeFixture
      );

      const pricePerTokenInWei = ethers.parseEther(
        "9999999999999999999999999999999999999999999999999999999999"
      );

      await realEstateFungibleToken.setPricePerTokenInWei(propertyId, pricePerTokenInWei);

      const saleId = 1;
      const amountOfTokensToSell = 100;

      await realEstateFungibleToken.listTokenForSale(saleId, propertyId, amountOfTokensToSell);

      const payment = ethers.parseEther("1");

      await expect(
        realEstateFungibleToken.connect(second).buyTokens(saleId, {
          value: payment,
        })
      ).to.be.revertedWith("Price overflow.");
    });
  });

  describe("Updating Property Details", function () {
    it("Should allow updating the price per token of a tokenized property", async function () {
      const { realEstateFungibleToken, propertyId, pricePerTokenInWei } = await loadFixture(
        tokenizeFixture
      );

      const newPricePerTokenInWei = pricePerTokenInWei * 2n;
      const property = await realEstateFungibleToken.properties(propertyId);
      expect(property.pricePerTokenInWei).to.equal(pricePerTokenInWei);

      await realEstateFungibleToken.setPricePerTokenInWei(propertyId, newPricePerTokenInWei);
      const updatedProperty = await realEstateFungibleToken.properties(propertyId);
      expect(updatedProperty.pricePerTokenInWei).to.equal(newPricePerTokenInWei);
    });

    it("Should prevent updating the price per token of a property that doesn't exist", async function () {
      const { realEstateFungibleToken } = await loadFixture(deployRealEstateFungibleTokenFixture);

      const propertyId = 1;
      const pricePerTokenInWei = ethers.parseEther("1");

      await expect(
        realEstateFungibleToken.setPricePerTokenInWei(propertyId, pricePerTokenInWei)
      ).to.be.revertedWith("Property has not been tokenized.");
    });

    it("Should allow updating the metadata URI of a tokenized property", async function () {
      const { realEstateFungibleToken, propertyId, metadataURI } = await loadFixture(
        tokenizeFixture
      );

      const newMetadataURI = metadataURI + "/new";
      const property = await realEstateFungibleToken.properties(propertyId);
      expect(property.metadataURI).to.equal(metadataURI);

      await realEstateFungibleToken.setMetadataURI(propertyId, newMetadataURI);
      const updatedProperty = await realEstateFungibleToken.properties(propertyId);
      expect(updatedProperty.metadataURI).to.equal(newMetadataURI);
    });

    it("Should prevent updating the metadata URI of a property that doesn't exist", async function () {
      const { realEstateFungibleToken } = await loadFixture(deployRealEstateFungibleTokenFixture);

      const propertyId = 1;
      const metadataURI = "www.example.com";

      await expect(
        realEstateFungibleToken.setMetadataURI(propertyId, metadataURI)
      ).to.be.revertedWith("Property has not been tokenized.");
    });
  });

  describe("Getting Property Details", function () {
    it("Should return the correct property details", async function () {
      const { realEstateFungibleToken, propertyId, metadataURI, pricePerTokenInWei } =
        await loadFixture(tokenizeFixture);

      const property = await realEstateFungibleToken.properties(propertyId);
      expect(property.metadataURI).to.equal(metadataURI);
      expect(property.totalTokens).to.equal(100);
      expect(property.pricePerTokenInWei).to.equal(pricePerTokenInWei);
    });

    it("Should return the correct token balance for an account", async function () {
      const { realEstateFungibleToken, owner, propertyId, amount } = await loadFixture(
        tokenizeFixture
      );

      const balance = await realEstateFungibleToken.balanceOf(owner.address, propertyId);
      expect(balance).to.equal(amount);
    });

    it("Should return the correct token balance for an account that has no tokens", async function () {
      const { realEstateFungibleToken, owner, second, propertyId } = await loadFixture(
        tokenizeFixture
      );

      const balance = await realEstateFungibleToken.balanceOf(second.address, propertyId);
      expect(balance).to.equal(0);
    });

    it("Should return the correct uri for a token", async function () {
      const { realEstateFungibleToken, propertyId, metadataURI } = await loadFixture(
        tokenizeFixture
      );

      const uri = await realEstateFungibleToken.uri(propertyId);
      expect(uri).to.equal(metadataURI);
    });

    it("Should return the correct price per token for a token", async function () {
      const { realEstateFungibleToken, propertyId, pricePerTokenInWei } = await loadFixture(
        tokenizeFixture
      );

      const pricePerToken = await realEstateFungibleToken.getPricePerTokenInWei(propertyId);
      expect(pricePerToken).to.equal(pricePerTokenInWei);
    });

    it("Should return the correct total supply for a token", async function () {
      const { realEstateFungibleToken, propertyId, amount } = await loadFixture(tokenizeFixture);

      const totalSupply = await realEstateFungibleToken.totalSupply(propertyId);
      expect(totalSupply).to.equal(amount);
    });
  });
});
