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
        .to.emit(realEstateFungibleToken, "TokensMinted")
        .withArgs(propertyId, [metadataURI, amount, pricePerTokenInWei, feeInWei], owner.address);

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

      const amountOfTokensToSell = 1;

      await expect(
        realEstateFungibleToken.listTokenForSale(propertyId, amountOfTokensToSell, {
          value: feeInWei,
        })
      )
        .to.emit(realEstateFungibleToken, "TokensListed")
        .withArgs([owner.address, propertyId, amountOfTokensToSell]);

      const listing = (await realEstateFungibleToken.getAllListingsForProperty(propertyId))[0];
      expect(listing.propertyId).to.equal(propertyId);
      expect(listing.tokensListed).to.equal(amountOfTokensToSell);
      expect(listing.seller).to.equal(owner.address);

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

    it("Should allow listing multiple tokens for sale", async function () {
      const {
        realEstateFungibleToken,
        signers: { owner },
        property: { propertyId, feeInWei },
      } = await loadFixture(tokenizeFixture);

      const amountOfTokensToSell = 3;

      await expect(
        realEstateFungibleToken.listTokenForSale(propertyId, amountOfTokensToSell, {
          value: feeInWei,
        })
      )
        .to.emit(realEstateFungibleToken, "TokensListed")
        .withArgs([owner.address, propertyId, amountOfTokensToSell]);
    });

    it("Should create multiple separate listings for multiple listing requests in order for the same user", async function () {
      const {
        realEstateFungibleToken,
        signers: { owner, second, third },
        property: { propertyId, feeInWei },
      } = await loadFixture(tokenizeFixture);

      const amountOfTokensToSell = 1;

      await realEstateFungibleToken.listTokenForSale(propertyId, amountOfTokensToSell, {
        value: feeInWei,
      });

      await realEstateFungibleToken.listTokenForSale(propertyId, amountOfTokensToSell, {
        value: feeInWei,
      });

      await realEstateFungibleToken.listTokenForSale(propertyId, amountOfTokensToSell, {
        value: feeInWei,
      });

      const listings = await realEstateFungibleToken.getAllListingsForProperty(propertyId);
      expect(listings.length).to.equal(3);
      expect(listings[0].seller).to.equal(owner.address);
      expect(listings[1].seller).to.equal(owner.address);
      expect(listings[2].seller).to.equal(owner.address);
    });

    it("Should prevent listing tokens for listing that don't exist", async function () {
      const { realEstateFungibleToken, owner } = await loadFixture(
        deployRealEstateFungibleTokenFixture
      );

      const propertyId = 1;
      const amountOfTokensToSell = 1;

      await expect(
        realEstateFungibleToken.listTokenForSale(propertyId, amountOfTokensToSell)
      ).to.be.revertedWith("Property has not been tokenized.");
    });

    it("Should send the fee to the contract owner", async function () {
      const {
        realEstateFungibleToken,
        signers: { owner, second },
        property: { propertyId, feeInWei },
      } = await loadFixture(tokenizeFixture);

      const amountOfTokensToSell = 1;

      await realEstateFungibleToken.transferOwnership(second.address);

      const secondWeiBalance = await second.provider.getBalance(second.address);

      await realEstateFungibleToken.listTokenForSale(propertyId, amountOfTokensToSell, {
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

      const amountOfTokensToSell = 101;

      await expect(
        realEstateFungibleToken.listTokenForSale(propertyId, amountOfTokensToSell, {
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

      const amountOfTokensToSell = 1;

      await expect(
        realEstateFungibleToken.connect(second).listTokenForSale(propertyId, amountOfTokensToSell, {
          value: feeInWei,
        })
      ).to.be.revertedWith("Insufficient property token balance.");
    });

    it("Should prevent listing tokens with insufficient amount of funds provided for fee", async function () {
      const {
        realEstateFungibleToken,
        signers: { owner },
        property: { propertyId, feeInWei },
      } = await loadFixture(tokenizeFixture);

      const amountOfTokensToSell = 1;

      await expect(
        realEstateFungibleToken.listTokenForSale(propertyId, amountOfTokensToSell, {
          value: feeInWei - 1n,
        })
      ).to.be.revertedWith("Incorrect fee amount.");
    });

    it("Should prevent listing tokens with more funds than required for fee", async function () {
      const {
        realEstateFungibleToken,
        signers: { owner },
        property: { propertyId, feeInWei },
      } = await loadFixture(tokenizeFixture);

      const amountOfTokensToSell = 1;

      await expect(
        realEstateFungibleToken.listTokenForSale(propertyId, amountOfTokensToSell, {
          value: feeInWei + 1n,
        })
      ).to.be.revertedWith("Incorrect fee amount.");
    });
  });

  describe("Minting and Listing Tokens for Sale at the Same Time", function () {
    it("Should allow minting and listing tokens for listing at the same time", async function () {
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
          amountOfTokensToSell,
          {
            value: feeInWei,
          }
        )
      )
        .to.emit(realEstateFungibleToken, "TokensMinted")
        .withArgs(
          propertyId,
          [metadataURI, totalTokens, pricePerTokenInWei, feeInWei],
          owner.address
        )
        .to.emit(realEstateFungibleToken, "TokensListed")
        .withArgs([owner.address, propertyId, amountOfTokensToSell]);

      const property = await realEstateFungibleToken.properties(propertyId);
      expect(property.metadataURI).to.equal(metadataURI);
      expect(property.totalTokens).to.equal(totalTokens);
      expect(property.pricePerTokenInWei).to.equal(pricePerTokenInWei);
      expect(property.fee).to.equal(feeInWei);

      const listing = (await realEstateFungibleToken.getAllListingsForProperty(propertyId))[0];
      expect(listing.propertyId).to.equal(propertyId);
      expect(listing.tokensListed).to.equal(amountOfTokensToSell);
      expect(listing.seller).to.equal(owner.address);

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

    const amountOfTokensToSell = 1;

    const listing1Tokens = 1;
    const listing2Tokens = 2;
    const listing3Tokens = 3;

    await realEstateFungibleToken.listTokenForSale(propertyId, listing1Tokens, {
      value: feeInWei,
    });

    await realEstateFungibleToken.listTokenForSale(propertyId, listing2Tokens, {
      value: feeInWei,
    });

    await realEstateFungibleToken.listTokenForSale(propertyId, listing3Tokens, {
      value: feeInWei,
    });

    return {
      signers: { owner, second, third, fourth, fifth },
      realEstateFungibleToken,
      property: { propertyId, amount, metadataURI, pricePerTokenInWei, feeInWei },
      listings: [
        { seller: owner.address, propertyId, tokensListed: listing1Tokens },
        { seller: owner.address, propertyId, tokensListed: listing2Tokens },
        { seller: owner.address, propertyId, tokensListed: listing3Tokens },
      ],
    };
  }

  describe("Delisting Tokens for Sale", function () {
    it("Should allow delisting tokens for listing", async function () {
      const {
        realEstateFungibleToken,
        signers: { owner },
        listings: [listing1],
        property: { propertyId },
      } = await loadFixture(listTokensFixture);

      expect(await realEstateFungibleToken.balanceOf(owner.address, propertyId)).to.equal(94);
      expect(
        await realEstateFungibleToken.balanceOf(
          await realEstateFungibleToken.getAddress(),
          propertyId
        )
      ).to.equal(6);

      const amountToDelist = 1;

      await expect(realEstateFungibleToken.delistTokenForSale(propertyId, amountToDelist))
        .to.emit(realEstateFungibleToken, "TokensDelisted")
        .withArgs([owner.address, propertyId, amountToDelist]);

      expect(await realEstateFungibleToken.balanceOf(owner.address, propertyId)).to.equal(95);
      expect(
        await realEstateFungibleToken.balanceOf(
          await realEstateFungibleToken.getAddress(),
          propertyId
        )
      ).to.equal(5);
    });

    it("Should allow delisting multiple tokens for listing", async function () {
      const {
        realEstateFungibleToken,
        signers: { owner },
        listings: [listing1],
        property: { propertyId },
      } = await loadFixture(listTokensFixture);

      expect(await realEstateFungibleToken.balanceOf(owner.address, propertyId)).to.equal(94);
      expect(
        await realEstateFungibleToken.balanceOf(
          await realEstateFungibleToken.getAddress(),
          propertyId
        )
      ).to.equal(6);

      const amountToDelist = 3;

      await expect(realEstateFungibleToken.delistTokenForSale(propertyId, amountToDelist))
        .to.emit(realEstateFungibleToken, "TokensDelisted")
        .withArgs([owner.address, propertyId, amountToDelist]);

      expect(await realEstateFungibleToken.balanceOf(owner.address, propertyId)).to.equal(97);
      expect(
        await realEstateFungibleToken.balanceOf(
          await realEstateFungibleToken.getAddress(),
          propertyId
        )
      ).to.equal(3);
    });

    it("Should allow delisting tokens when there are multiple users with listings", async function () {
      const {
        realEstateFungibleToken,
        signers: { owner, second },
        listings: [listing1, listing2, listing3],
        property: { propertyId, pricePerTokenInWei, feeInWei },
      } = await loadFixture(listTokensFixture);

      //have the second user buy tokens from the owner
      const amountToBuy = listing1.tokensListed + listing2.tokensListed + listing3.tokensListed;

      await realEstateFungibleToken.connect(second).buyTokens(propertyId, amountToBuy, {
        value: pricePerTokenInWei * BigInt(amountToBuy) + feeInWei,
      });

      // create new listings from both the owner and the second user
      const amountOfTokensToList = 1;

      await realEstateFungibleToken.listTokenForSale(propertyId, amountOfTokensToList, {
        value: feeInWei,
      });

      await realEstateFungibleToken
        .connect(second)
        .listTokenForSale(propertyId, amountOfTokensToList, {
          value: feeInWei,
        });

      await realEstateFungibleToken.listTokenForSale(propertyId, amountOfTokensToList, {
        value: feeInWei,
      });

      //check that the listings are in the correct order

      const listings = await realEstateFungibleToken.getAllListingsForProperty(propertyId);
      expect(listings.length).to.equal(3);
      expect(listings[0].seller).to.equal(owner.address);
      expect(listings[1].seller).to.equal(second.address);
      expect(listings[2].seller).to.equal(owner.address);

      // delist tokens from the owner
      const amountToDelist = amountOfTokensToList * 2;
      await realEstateFungibleToken.delistTokenForSale(propertyId, amountToDelist);

      const updatedListings = await realEstateFungibleToken.getAllListingsForProperty(propertyId);
      expect(updatedListings.length).to.equal(1);

      expect(updatedListings[0].tokensListed).to.equal(1n);
      expect(updatedListings[0].seller).to.equal(second.address);
      expect(updatedListings[0].propertyId).to.equal(propertyId);
    });

    it("Should allow delisting half of the tokens from a listing", async function () {
      const {
        realEstateFungibleToken,
        signers: { owner },
        listings: [listing1, listing2, listing3],
        property: { propertyId },
      } = await loadFixture(listTokensFixture);

      const amountToDelist = 1;

      await realEstateFungibleToken.delistTokenForSale(propertyId, amountToDelist);

      await realEstateFungibleToken.delistTokenForSale(propertyId, amountToDelist);

      const listings = await realEstateFungibleToken.getAllListingsForProperty(propertyId);
      expect(listings.length).to.equal(2);
      expect(listings[0].tokensListed).to.equal(1n);
      expect(listings[1].tokensListed).to.equal(3n);
    });

    it("Should allow delisting without changing the property listing order", async function () {
      const {
        realEstateFungibleToken,
        signers: { owner },
        listings: [listing1, listing2, listing3],
        property: { propertyId },
      } = await loadFixture(listTokensFixture);

      const amountToDelist = 1;

      await realEstateFungibleToken.delistTokenForSale(propertyId, amountToDelist);

      const listings = await realEstateFungibleToken.getAllListingsForProperty(propertyId);
      console.log(listings);
      expect(listings.length).to.equal(2);
      expect(listings[0].tokensListed).to.equal(2n);
      expect(listings[1].tokensListed).to.equal(3n);
    });

    it("Should prevent delisting tokens for property ids that don't exist", async function () {
      const { realEstateFungibleToken } = await loadFixture(deployRealEstateFungibleTokenFixture);

      const propertyId = 1;

      await expect(realEstateFungibleToken.delistTokenForSale(propertyId, 1)).to.be.revertedWith(
        "Property has not been tokenized."
      );
    });

    it("Should prevent delisting zero tokens", async function () {
      const {
        realEstateFungibleToken,
        property: { propertyId },
      } = await loadFixture(tokenizeFixture);

      await expect(realEstateFungibleToken.delistTokenForSale(propertyId, 0)).to.be.revertedWith(
        "Cannot delist zero tokens."
      );
    });

    it("Should revert when trying to delist more tokens than user has listed", async function () {
      const {
        realEstateFungibleToken,
        signers: { owner },
        listings: [listing1, listing2, listing3],
        property: { propertyId },
      } = await loadFixture(listTokensFixture);

      const amountToDelist =
        listing1.tokensListed + listing2.tokensListed + listing3.tokensListed + 1;

      await expect(
        realEstateFungibleToken.delistTokenForSale(propertyId, amountToDelist)
      ).to.be.revertedWith("Not enough tokens listed to delist the requested amount.");
    });

    it("Should prevent delisting tokens for sale when signer does not own any for that property", async function () {
      const {
        realEstateFungibleToken,
        signers: { second },
        property: { propertyId },
      } = await loadFixture(tokenizeFixture);

      const amountToDelist = 1;

      await expect(
        realEstateFungibleToken.connect(second).delistTokenForSale(propertyId, amountToDelist)
      ).to.be.revertedWith("Not enough tokens listed to delist the requested amount.");
    });
  });

  describe("Buying Tokens", function () {
    it("Should allow buying tokens", async function () {
      const {
        realEstateFungibleToken,
        signers: { owner, second },
        listings: [listing1, listing2, listing3],
        property: { pricePerTokenInWei, feeInWei, propertyId },
      } = await loadFixture(listTokensFixture);

      const amountOfTokensToBuy = 1;

      expect(await realEstateFungibleToken.balanceOf(owner.address, propertyId)).to.equal(94);
      expect(
        await realEstateFungibleToken.balanceOf(
          await realEstateFungibleToken.getAddress(),
          propertyId
        )
      ).to.equal(6);
      expect(await realEstateFungibleToken.balanceOf(second.address, propertyId)).to.equal(0);

      const ownerWeiBalance = await owner.provider.getBalance(owner.address);

      const salePrice = pricePerTokenInWei * BigInt(amountOfTokensToBuy) + feeInWei;
      await expect(
        realEstateFungibleToken.connect(second).buyTokens(propertyId, amountOfTokensToBuy, {
          value: salePrice,
        })
      )
        .to.emit(realEstateFungibleToken, "TokensBought")
        .withArgs([second.address, owner.address, propertyId, amountOfTokensToBuy]);

      expect(await realEstateFungibleToken.balanceOf(owner.address, propertyId)).to.equal(94);
      expect(
        await realEstateFungibleToken.balanceOf(
          await realEstateFungibleToken.getAddress(),
          propertyId
        )
      ).to.equal(5);
      expect(await realEstateFungibleToken.balanceOf(second.address, propertyId)).to.equal(
        amountOfTokensToBuy
      );

      expect(await owner.provider.getBalance(owner.address)).to.equal(ownerWeiBalance + salePrice);

      const listings = await realEstateFungibleToken.getAllListingsForProperty(propertyId);
      expect(listings.length).to.equal(2);
    });

    it("Should allow buying multiple tokens", async function () {
      const {
        realEstateFungibleToken,
        signers: { owner, second },
        listings: [listing1, listing2, listing3],
        property: { pricePerTokenInWei, feeInWei, propertyId },
      } = await loadFixture(listTokensFixture);

      const amountOfTokensToBuy = 3;

      expect(await realEstateFungibleToken.balanceOf(owner.address, propertyId)).to.equal(94);
      expect(
        await realEstateFungibleToken.balanceOf(
          await realEstateFungibleToken.getAddress(),
          propertyId
        )
      ).to.equal(6);
      expect(await realEstateFungibleToken.balanceOf(second.address, propertyId)).to.equal(0);

      const ownerWeiBalance = await owner.provider.getBalance(owner.address);

      const salePrice = pricePerTokenInWei * BigInt(amountOfTokensToBuy) + feeInWei;
      await expect(
        realEstateFungibleToken.connect(second).buyTokens(propertyId, amountOfTokensToBuy, {
          value: salePrice,
        })
      )
        .to.emit(realEstateFungibleToken, "TokensBought")
        .withArgs([second.address, owner.address, propertyId, 1])
        .to.emit(realEstateFungibleToken, "TokensBought")
        .withArgs([second.address, owner.address, propertyId, 2]);

      expect(await realEstateFungibleToken.balanceOf(owner.address, propertyId)).to.equal(94);
      expect(
        await realEstateFungibleToken.balanceOf(
          await realEstateFungibleToken.getAddress(),
          propertyId
        )
      ).to.equal(3);
      expect(await realEstateFungibleToken.balanceOf(second.address, propertyId)).to.equal(
        amountOfTokensToBuy
      );

      expect(await owner.provider.getBalance(owner.address)).to.equal(ownerWeiBalance + salePrice);

      const listings = await realEstateFungibleToken.getAllListingsForProperty(propertyId);
      expect(listings.length).to.equal(1);
      expect(listings[0].tokensListed).to.equal(3n);
    });

    it("Should not change the order of listings when buying tokens", async function () {
      const {
        realEstateFungibleToken,
        signers: { owner, second },
        listings: [listing1, listing2, listing3],
        property: { pricePerTokenInWei, feeInWei, propertyId },
      } = await loadFixture(listTokensFixture);

      const amountOfTokensToBuy = 1;

      const ownerWeiBalance = await owner.provider.getBalance(owner.address);

      const salePrice = pricePerTokenInWei * BigInt(amountOfTokensToBuy) + feeInWei;
      await realEstateFungibleToken.connect(second).buyTokens(propertyId, amountOfTokensToBuy, {
        value: salePrice,
      });

      const listings = await realEstateFungibleToken.getAllListingsForProperty(propertyId);
      expect(listings.length).to.equal(2);
      expect(listings[0].tokensListed).to.equal(2n);
      expect(listings[1].tokensListed).to.equal(3n);
    });

    it("Should prevent buying tokens for property ids that don't exist", async function () {
      const { realEstateFungibleToken } = await loadFixture(deployRealEstateFungibleTokenFixture);

      const propertyId = 1;

      await expect(realEstateFungibleToken.buyTokens(propertyId, 1)).to.be.revertedWith(
        "Property has not been tokenized."
      );
    });

    it("Should prevent buying zero tokens", async function () {
      const {
        realEstateFungibleToken,
        property: { propertyId },
      } = await loadFixture(tokenizeFixture);

      await expect(realEstateFungibleToken.buyTokens(propertyId, 0)).to.be.revertedWith(
        "Cannot buy zero tokens."
      );
    });

    it("Should prevent buying tokens for a property that has no listings", async function () {
      const {
        realEstateFungibleToken,
        signers: { owner },
        property: { propertyId },
      } = await loadFixture(tokenizeFixture);

      await expect(realEstateFungibleToken.buyTokens(propertyId, 1)).to.be.revertedWith(
        "Not enough tokens available for sale."
      );
    });

    it("Should all buying half of the tokens from a listing", async function () {
      const {
        realEstateFungibleToken,
        signers: { owner, second },
        listings: [listing1, listing2, listing3],
        property: { pricePerTokenInWei, feeInWei, propertyId },
      } = await loadFixture(listTokensFixture);

      const amountOfTokensToBuy = 1;

      const ownerWeiBalance = await owner.provider.getBalance(owner.address);

      const salePrice = pricePerTokenInWei * BigInt(amountOfTokensToBuy) + feeInWei;
      await realEstateFungibleToken.connect(second).buyTokens(propertyId, amountOfTokensToBuy, {
        value: salePrice,
      });

      const secondWeiBalance = await second.provider.getBalance(second.address);

      await realEstateFungibleToken.connect(second).buyTokens(propertyId, amountOfTokensToBuy, {
        value: salePrice,
      });

      const listings = await realEstateFungibleToken.getAllListingsForProperty(propertyId);
      expect(listings.length).to.equal(2);
      expect(listings[0].tokensListed).to.equal(1n);
      expect(listings[1].tokensListed).to.equal(3n);
    });

    it("Should prevent buying more tokens than are listed", async function () {
      const {
        realEstateFungibleToken,
        signers: { owner, second },
        listings: [listing1, listing2, listing3],
        property: { pricePerTokenInWei, feeInWei, propertyId },
      } = await loadFixture(listTokensFixture);

      const amountOfTokensToBuy =
        listing1.tokensListed + listing2.tokensListed + listing3.tokensListed + 1;

      await expect(
        realEstateFungibleToken.connect(second).buyTokens(propertyId, amountOfTokensToBuy, {
          value: pricePerTokenInWei * BigInt(amountOfTokensToBuy) + feeInWei,
        })
      ).to.be.revertedWith("Not enough tokens available for sale.");
    });

    it("Should prevent buying tokens with insufficient funds", async function () {
      const {
        realEstateFungibleToken,
        signers: { owner, second },
        listings: [listing1, listing2, listing3],
        property: { pricePerTokenInWei, feeInWei, propertyId },
      } = await loadFixture(listTokensFixture);

      const amountOfTokensToBuy = 1;

      await expect(
        realEstateFungibleToken.connect(second).buyTokens(propertyId, amountOfTokensToBuy, {
          value: pricePerTokenInWei * BigInt(amountOfTokensToBuy) + feeInWei - 1n,
        })
      ).to.be.revertedWith("Incorrect payment amount.");
    });

    it("Should prevent buying tokens with more funds than required", async function () {
      const {
        realEstateFungibleToken,
        signers: { owner, second },
        listings: [listing1, listing2, listing3],
        property: { pricePerTokenInWei, feeInWei, propertyId },
      } = await loadFixture(listTokensFixture);

      const amountOfTokensToBuy = 1;

      await expect(
        realEstateFungibleToken.connect(second).buyTokens(propertyId, amountOfTokensToBuy, {
          value: pricePerTokenInWei * BigInt(amountOfTokensToBuy) + feeInWei + 1n,
        })
      ).to.be.revertedWith("Incorrect payment amount.");
    });

    it("Should transfer the fee to the contract owner", async function () {
      const {
        realEstateFungibleToken,
        signers: { owner, second, third },
        listings: [listing1, listing2, listing3],
        property: { pricePerTokenInWei, feeInWei, propertyId },
      } = await loadFixture(listTokensFixture);

      const amountOfTokensToBuy = 1;

      await realEstateFungibleToken.transferOwnership(third.address);

      const thirdWeiBalance = await third.provider.getBalance(third.address);

      await realEstateFungibleToken.connect(second).buyTokens(propertyId, amountOfTokensToBuy, {
        value: pricePerTokenInWei * BigInt(amountOfTokensToBuy) + feeInWei,
      });

      expect(await third.provider.getBalance(third.address)).to.equal(thirdWeiBalance + feeInWei);
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

    it("Should return the correct token balance for an account", async function () {
      const {
        realEstateFungibleToken,
        signers: { owner },
        property: { propertyId, amount },
      } = await loadFixture(tokenizeFixture);

      const balance = await realEstateFungibleToken.balanceOf(owner.address, propertyId);
      expect(balance).to.equal(amount);
    });

    it("Should return the correct fee for a token", async function () {
      const {
        realEstateFungibleToken,
        property: { propertyId, feeInWei },
      } = await loadFixture(tokenizeFixture);

      const fee = await realEstateFungibleToken.getFee(propertyId);
      expect(fee).to.equal(feeInWei);
    });

    it("Should return the correct total supply for a token", async function () {
      const {
        realEstateFungibleToken,
        property: { propertyId, amount },
      } = await loadFixture(tokenizeFixture);

      const totalSupply = await realEstateFungibleToken.totalSupply(propertyId);
      expect(totalSupply).to.equal(amount);
    });

    it("Should return the correct property details", async function () {
      const {
        realEstateFungibleToken,
        property: { propertyId, metadataURI, pricePerTokenInWei, feeInWei },
      } = await loadFixture(tokenizeFixture);

      const property = await realEstateFungibleToken.getProperty(propertyId);
      expect(property.metadataURI).to.equal(metadataURI);
      expect(property.totalTokens).to.equal(100);
      expect(property.pricePerTokenInWei).to.equal(pricePerTokenInWei);
      expect(property.fee).to.equal(feeInWei);
    });

    it("Should get all listings for a property", async function () {
      const {
        realEstateFungibleToken,
        signers: { owner },
        property: { propertyId, feeInWei },
      } = await loadFixture(tokenizeFixture);

      await realEstateFungibleToken.listTokenForSale(propertyId, 1, {
        value: feeInWei,
      });

      await realEstateFungibleToken.listTokenForSale(propertyId, 2, {
        value: feeInWei,
      });

      await realEstateFungibleToken.listTokenForSale(propertyId, 3, {
        value: feeInWei,
      });

      const listings = await realEstateFungibleToken.getAllListingsForProperty(propertyId);

      expect(listings.length).to.equal(3);
      expect(listings[0].seller).to.equal(owner.address);
      expect(listings[0].propertyId).to.equal(propertyId);
      expect(listings[0].tokensListed).to.equal(1);

      expect(listings[1].seller).to.equal(owner.address);
      expect(listings[1].propertyId).to.equal(propertyId);
      expect(listings[1].tokensListed).to.equal(2);

      expect(listings[2].seller).to.equal(owner.address);
      expect(listings[2].propertyId).to.equal(propertyId);
      expect(listings[2].tokensListed).to.equal(3);
    });
  });
});
