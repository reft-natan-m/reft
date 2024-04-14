import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers, network } from "hardhat";

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
      const { realEstateFungibleToken, owner } = await loadFixture(
        deployRealEstateFungibleTokenFixture
      );
      expect(await realEstateFungibleToken.supportsInterface("0xd9b67a26")).to.equal(true); // IERC1155

      const contractOwner = await realEstateFungibleToken.owner();
      expect(contractOwner).to.equal(owner.address);
    });
  });

  async function tokenizeFixture() {
    const { realEstateFungibleToken, owner, second, third, fourth, fifth } = await loadFixture(
      deployRealEstateFungibleTokenFixture
    );

    const propertyId = 1;
    const amount = 100;
    const pricePerTokenInEthereum = 1;
    const feePercentage = 0.0001;
    const totalPropertyCost = pricePerTokenInEthereum * amount;
    const fee = totalPropertyCost * feePercentage;
    const feeInWei = ethers.parseEther(fee.toString());
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
      signers: { owner, second, third, fourth, fifth },
      property: { propertyId, amount, metadataURI, pricePerTokenInWei, feeInWei },
    };
  }

  describe("Minting and Tokenizing Properties", function () {
    it("Should allow a property to be tokenized and minted", async function () {
      const { realEstateFungibleToken, owner } = await loadFixture(
        deployRealEstateFungibleTokenFixture
      );
      const propertyId = 1;
      const amount = 100;
      const pricePerTokenInEthereum = 1;
      const feePercentage = 0.0001;
      const totalPropertyCost = pricePerTokenInEthereum * amount;
      const fee = totalPropertyCost * feePercentage;
      const feeInWei = ethers.parseEther(fee.toString());
      const pricePerTokenInWei = ethers.parseEther(pricePerTokenInEthereum.toString());
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
      expect(property.fee).to.equal(feeInWei);
    });

    it("Should prevent tokenizing a property that's already been tokenized", async function () {
      const {
        realEstateFungibleToken,
        signers: { owner },
        property: { propertyId, amount, pricePerTokenInWei, metadataURI },
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

    it("Should prevent tokenizing a property with a total price that will overflow", async function () {
      const { realEstateFungibleToken, owner } = await loadFixture(
        deployRealEstateFungibleTokenFixture
      );

      const propertyId = 1;
      const amount = 100;
      const pricePerTokenInEthereum = 9999999999999999999999999999999999999999999999999999999999n;
      const pricePerTokenInWei = ethers.parseEther(pricePerTokenInEthereum.toString());
      const metadataURI = "www.example.com";

      await expect(
        realEstateFungibleToken.mint(
          owner.address,
          propertyId,
          amount,
          pricePerTokenInWei,
          metadataURI
        )
      ).to.be.revertedWith("Property Value Overflow.");
    });
  });

  describe("Listing Tokens for Sale", function () {
    it("Should allow listing tokens for sale", async function () {
      const {
        realEstateFungibleToken,
        signers: { owner },
        property: { propertyId, feeInWei },
      } = await loadFixture(tokenizeFixture);

      const saleId = 1;
      const amountOfTokensToSell = 1;

      await expect(
        realEstateFungibleToken.listTokenForSale(saleId, propertyId, amountOfTokensToSell, {
          value: feeInWei,
        })
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

    it("Should send the fee to the contract owner", async function () {
      const {
        realEstateFungibleToken,
        signers: { owner, second },
        property: { propertyId, feeInWei },
      } = await loadFixture(tokenizeFixture);

      const saleId = 1;
      const amountOfTokensToSell = 1;

      await realEstateFungibleToken.transferOwnership(second.address);

      const secondWeiBalance = await second.provider.getBalance(second.address);

      await realEstateFungibleToken.listTokenForSale(saleId, propertyId, amountOfTokensToSell, {
        value: feeInWei,
      });

      expect(await second.provider.getBalance(second.address)).to.equal(
        secondWeiBalance + feeInWei
      );
    });

    it("Should prevent listing more tokens than the owner has", async function () {
      const {
        realEstateFungibleToken,
        signers: { owner },
        property: { propertyId, feeInWei },
      } = await loadFixture(tokenizeFixture);

      const saleId = 1;
      const amountOfTokensToSell = 101;

      await expect(
        realEstateFungibleToken.listTokenForSale(saleId, propertyId, amountOfTokensToSell, {
          value: feeInWei,
        })
      ).to.be.revertedWith("Insufficient property token balance.");
    });

    it("Should prevent listing tokens when signer does not own any for that property", async function () {
      const {
        realEstateFungibleToken,
        signers: { second },
        property: { propertyId, feeInWei },
      } = await loadFixture(tokenizeFixture);

      const saleId = 1;
      const amountOfTokensToSell = 1;

      await expect(
        realEstateFungibleToken
          .connect(second)
          .listTokenForSale(saleId, propertyId, amountOfTokensToSell, {
            value: feeInWei,
          })
      ).to.be.revertedWith("Insufficient property token balance.");
    });

    it("Should prevent listing tokens for a sale id that are already listed", async function () {
      const {
        realEstateFungibleToken,
        signers: { owner },
        property: { propertyId, feeInWei },
      } = await loadFixture(tokenizeFixture);

      const saleId = 1;
      const amountOfTokensToSell = 1;

      await realEstateFungibleToken.listTokenForSale(saleId, propertyId, amountOfTokensToSell, {
        value: feeInWei,
      });

      await expect(
        realEstateFungibleToken.listTokenForSale(saleId, propertyId, amountOfTokensToSell)
      ).to.be.revertedWith("Sale ID already exists.");
    });

    it("Should prevent listing tokens with insufficient amount of funds provided for fee", async function () {
      const {
        realEstateFungibleToken,
        signers: { owner },
        property: { propertyId, feeInWei },
      } = await loadFixture(tokenizeFixture);

      const saleId = 1;
      const amountOfTokensToSell = 1;

      await expect(
        realEstateFungibleToken.listTokenForSale(saleId, propertyId, amountOfTokensToSell, {
          value: feeInWei - 1n,
        })
      ).to.be.revertedWith("Insufficient fee payment.");
    });

    it("Should prevent listing tokens with more funds than required for fee", async function () {
      const {
        realEstateFungibleToken,
        signers: { owner },
        property: { propertyId, feeInWei },
      } = await loadFixture(tokenizeFixture);

      const saleId = 1;
      const amountOfTokensToSell = 1;

      await expect(
        realEstateFungibleToken.listTokenForSale(saleId, propertyId, amountOfTokensToSell, {
          value: feeInWei + 1n,
        })
      ).to.be.revertedWith("Excess fee payment.");
    });
  });

  describe("Minting and Listing Tokens for Sale at the Same Time", function () {
    it("Should allow minting and listing tokens for sale at the same time", async function () {
      const { realEstateFungibleToken, owner } = await loadFixture(
        deployRealEstateFungibleTokenFixture
      );

      const propertyId = 1;
      const saleId = 1;
      const totalTokens = 100;
      const amountOfTokensToSell = 1;
      const pricePerTokenInEthereum = 1;
      const feePercentage = 0.0001;
      const totalPropertyCost = pricePerTokenInEthereum * totalTokens;
      const fee = totalPropertyCost * feePercentage;
      const feeInWei = ethers.parseEther(fee.toString());
      const pricePerTokenInWei = ethers.parseEther(pricePerTokenInEthereum.toString());
      const metadataURI = "www.example.com";

      await expect(
        realEstateFungibleToken.mintAndListTokenForSale(
          owner.address,
          propertyId,
          totalTokens,
          pricePerTokenInWei,
          metadataURI,
          saleId,
          amountOfTokensToSell,
          {
            value: feeInWei,
          }
        )
      )
        .to.emit(realEstateFungibleToken, "PropertyTokenized")
        .withArgs(propertyId, owner.address, totalTokens)
        .to.emit(realEstateFungibleToken, "TokensListed")
        .withArgs(saleId, propertyId, owner.address, amountOfTokensToSell);

      const property = await realEstateFungibleToken.properties(propertyId);
      expect(property.metadataURI).to.equal(metadataURI);
      expect(property.totalTokens).to.equal(totalTokens);
      expect(property.pricePerTokenInWei).to.equal(pricePerTokenInWei);
      expect(property.fee).to.equal(feeInWei);

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
  });

  async function listTokensFixture() {
    const {
      realEstateFungibleToken,
      signers: { owner, second, third, fourth, fifth },
      property: { propertyId, amount, metadataURI, pricePerTokenInWei, feeInWei },
    } = await loadFixture(tokenizeFixture);

    const saleId = 1;
    const amountOfTokensToSell = 1;

    await realEstateFungibleToken.listTokenForSale(saleId, propertyId, amountOfTokensToSell, {
      value: feeInWei,
    });

    return {
      signers: { owner, second, third, fourth, fifth },
      realEstateFungibleToken,
      property: { propertyId, amount, metadataURI, pricePerTokenInWei, feeInWei },
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
      const {
        realEstateFungibleToken,
        signers: { owner, second },
        sale: { saleId, propertyId, amountOfTokensToSell },
        property: { pricePerTokenInWei, feeInWei },
      } = await loadFixture(listTokensFixture);

      const salePrice = pricePerTokenInWei * BigInt(amountOfTokensToSell) + feeInWei;

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
      const { pricePerTokenInWei, feeInWei } = property;

      const expectedPayment = pricePerTokenInWei * BigInt(amountOfTokensToSell);
      const excessPayment = expectedPayment + feeInWei + 1n;

      await expect(
        realEstateFungibleToken.connect(signers.second).buyTokens(saleId, {
          value: excessPayment,
        })
      ).to.be.revertedWith("Excess payment.");
    });

    it("Should prevent buying tokens when a total price overflow occurs", async function () {
      // This is a very hard test to write. Can't figure out a way to get this to happen however there is a check in the contract to prevent this.
    });
  });

  describe("Updating Property Details", function () {
    it("Should allow updating the price per token of a tokenized property", async function () {
      const {
        realEstateFungibleToken,
        property: { propertyId, pricePerTokenInWei },
      } = await loadFixture(tokenizeFixture);

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
      const {
        realEstateFungibleToken,
        property: { propertyId, metadataURI },
      } = await loadFixture(tokenizeFixture);

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
      const {
        realEstateFungibleToken,
        property: { propertyId, metadataURI, pricePerTokenInWei, feeInWei },
      } = await loadFixture(tokenizeFixture);

      const property = await realEstateFungibleToken.properties(propertyId);
      expect(property.metadataURI).to.equal(metadataURI);
      expect(property.totalTokens).to.equal(100);
      expect(property.pricePerTokenInWei).to.equal(pricePerTokenInWei);
      expect(property.fee).to.equal(feeInWei);
    });

    it("Should return the correct token balance for an account", async function () {
      const {
        realEstateFungibleToken,
        signers: { owner },
        property: { propertyId, amount },
      } = await loadFixture(tokenizeFixture);

      const balance = await realEstateFungibleToken.balanceOf(owner.address, propertyId);
      expect(balance).to.equal(amount);
    });

    it("Should return the correct token balance for an account that has no tokens", async function () {
      const {
        realEstateFungibleToken,
        signers: { owner, second },
        property: { propertyId },
      } = await loadFixture(tokenizeFixture);

      const balance = await realEstateFungibleToken.balanceOf(second.address, propertyId);
      expect(balance).to.equal(0);
    });

    it("Should return the correct uri for a token", async function () {
      const {
        realEstateFungibleToken,
        property: { propertyId, metadataURI },
      } = await loadFixture(tokenizeFixture);

      const uri = await realEstateFungibleToken.uri(propertyId);
      expect(uri).to.equal(metadataURI);
    });

    it("Should return the correct price per token for a token", async function () {
      const {
        realEstateFungibleToken,
        property: { propertyId, pricePerTokenInWei },
      } = await loadFixture(tokenizeFixture);

      const pricePerToken = await realEstateFungibleToken.getPricePerTokenInWei(propertyId);
      expect(pricePerToken).to.equal(pricePerTokenInWei);
    });

    it("Should return the correct total supply for a token", async function () {
      const {
        realEstateFungibleToken,
        property: { propertyId, amount },
      } = await loadFixture(tokenizeFixture);

      const totalSupply = await realEstateFungibleToken.totalSupply(propertyId);
      expect(totalSupply).to.equal(amount);
    });

    it("Should return the correct sale details for a token", async function () {
      const {
        realEstateFungibleToken,
        signers: { owner },
        property: { propertyId, amount, feeInWei },
      } = await loadFixture(tokenizeFixture);

      const saleId = 1;
      const amountOfTokensToSell = 1;

      await realEstateFungibleToken.listTokenForSale(saleId, propertyId, amountOfTokensToSell, {
        value: feeInWei,
      });

      const sale = await realEstateFungibleToken.getSale(saleId);
      expect(sale.propertyId).to.equal(propertyId);
      expect(sale.amountOfTokens).to.equal(amountOfTokensToSell);
      expect(sale.seller).to.equal(owner.address);
    });

    it("Should return the correct fee for a token", async function () {
      const {
        realEstateFungibleToken,
        property: { propertyId, feeInWei },
      } = await loadFixture(tokenizeFixture);

      const fee = await realEstateFungibleToken.getFee(propertyId);
      expect(fee).to.equal(feeInWei);
    });
  });
});
