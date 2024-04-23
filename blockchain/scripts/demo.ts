import { ethers } from "hardhat";
import { getAccountBalance, logAccountBalances } from "./utils";

async function main() {
  const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const allSigners = await ethers.getSigners();

  //name all signers from 0 to 19 for easy reference
  const [
    s0deployer,
    s1demo,
    s2user2,
    s3user3,
    s4user4,
    s5user5,
    s6user6,
    s7user7,
    s8user8,
    s9user9,
    s10user10,
    s11user11,
    s12user12,
    s13user13,
    s14user14,
    s15user15,
    s16user16,
    s17user17,
    s18user18,
    s19user19,
  ] = allSigners;

  const reft = await ethers.getContractAt("RealEstateFungibleToken", tokenAddress);

  const tokensToMint = 100;
  const uri = "www.example.com";

  const properties = [
    {
      id: "6624e6e87604647d7f03651b",
      totalPropertyValueInEthereum: 554,
      mintTo: s2user2,
      minterListingTokenAmount: 0,
      buyers: [],
    },
    {
      id: "6624e9a37604647d7f036524",
      totalPropertyValueInEthereum: 396,
      mintTo: s2user2,
      minterListingTokenAmount: 50,
      buyers: [
        {
          signer: s3user3,
          amount: 25,
          listedForSale: 0,
        },
      ],
    },
    {
      id: "6624ea537604647d7f03652c",
      totalPropertyValueInEthereum: 566,
      mintTo: s2user2,
      minterListingTokenAmount: 75,
      buyers: [
        {
          signer: s3user3,
          amount: 50,
          listedForSale: 25,
        },
      ],
    },
    {
      id: "6624eace7604647d7f036533",
      totalPropertyValueInEthereum: 348,
      mintTo: s2user2,
      minterListingTokenAmount: 100,
      buyers: [
        {
          signer: s3user3,
          amount: 50,
          listedForSale: 25,
        },
      ],
    },
    {
      id: "6624eb367604647d7f036536",
      totalPropertyValueInEthereum: 326,
      mintTo: s3user3,
      minterListingTokenAmount: 0,
      buyers: [],
    },
    {
      id: "6624eb807604647d7f036539",
      totalPropertyValueInEthereum: 443,
      mintTo: s3user3,
      minterListingTokenAmount: 50,
      buyers: [
        {
          signer: s4user4,
          amount: 25,
          listedForSale: 0,
        },
      ],
    },
    {
      id: "6624ebc17604647d7f03653c",
      totalPropertyValueInEthereum: 1139,
      mintTo: s3user3,
      minterListingTokenAmount: 75,
      buyers: [
        {
          signer: s4user4,
          amount: 50,
          listedForSale: 25,
        },
      ],
    },
    {
      id: "6624ec0b7604647d7f03653f",
      totalPropertyValueInEthereum: 467,
      mintTo: s3user3,
      minterListingTokenAmount: 100,
      buyers: [
        {
          signer: s4user4,
          amount: 50,
          listedForSale: 25,
        },
      ],
    },
    {
      id: "6624ec957604647d7f036542",
      totalPropertyValueInEthereum: 198,
      mintTo: s4user4,
      minterListingTokenAmount: 0,
      buyers: [],
    },
    {
      id: "6624ecd07604647d7f036545",
      totalPropertyValueInEthereum: 278,
      mintTo: s4user4,
      minterListingTokenAmount: 50,
      buyers: [
        {
          signer: s5user5,
          amount: 25,
          listedForSale: 0,
        },
      ],
    },
    {
      id: "6624f6ed7604647d7f03654c",
      totalPropertyValueInEthereum: 427,
      mintTo: s4user4,
      minterListingTokenAmount: 75,
      buyers: [
        {
          signer: s5user5,
          amount: 50,
          listedForSale: 25,
        },
      ],
    },
    {
      id: "6624f7a27604647d7f036557",
      totalPropertyValueInEthereum: 243,
      mintTo: s4user4,
      minterListingTokenAmount: 100,
      buyers: [
        {
          signer: s5user5,
          amount: 50,
          listedForSale: 25,
        },
      ],
    },
    {
      id: "6624f7dc7604647d7f03655a",
      totalPropertyValueInEthereum: 443,
      mintTo: s5user5,
      minterListingTokenAmount: 0,
      buyers: [],
    },
    {
      id: "6624f8ac7604647d7f036563",
      totalPropertyValueInEthereum: 474,
      mintTo: s5user5,
      minterListingTokenAmount: 50,
      buyers: [
        {
          signer: s6user6,
          amount: 25,
          listedForSale: 0,
        },
      ],
    },
    {
      id: "6624f8df7604647d7f036566",
      totalPropertyValueInEthereum: 689,
      mintTo: s5user5,
      minterListingTokenAmount: 75,
      buyers: [
        {
          signer: s6user6,
          amount: 50,
          listedForSale: 25,
        },
      ],
    },
    {
      id: "6624f72b7604647d7f036551",
      totalPropertyValueInEthereum: 234,
      mintTo: s5user5,
      minterListingTokenAmount: 100,
      buyers: [
        {
          signer: s6user6,
          amount: 50,
          listedForSale: 25,
        },
      ],
    },
    {
      id: "6624f86a7604647d7f036560",
      totalPropertyValueInEthereum: 597,
      mintTo: s6user6,
      minterListingTokenAmount: 0,
      buyers: [],
    },
    {
      id: "6624f7627604647d7f036554",
      totalPropertyValueInEthereum: 473,
      mintTo: s6user6,
      minterListingTokenAmount: 50,
      buyers: [
        {
          signer: s7user7,
          amount: 25,
          listedForSale: 0,
        },
      ],
    },
    {
      id: "6624f8327604647d7f03655d",
      totalPropertyValueInEthereum: 661,
      mintTo: s6user6,
      minterListingTokenAmount: 75,
      buyers: [
        {
          signer: s7user7,
          amount: 50,
          listedForSale: 25,
        },
      ],
    },
    {
      id: "6624f9347604647d7f036569",
      totalPropertyValueInEthereum: 396,
      mintTo: s6user6,
      minterListingTokenAmount: 100,
      buyers: [
        {
          signer: s7user7,
          amount: 50,
          listedForSale: 25,
        },
      ],
    },
    {
      id: "66275d9b62c199997115cd74",
      totalPropertyValueInEthereum: 570,
      mintTo: s7user7,
      minterListingTokenAmount: 0,
      buyers: [],
    },
    {
      id: "66275e1e62c199997115cd79",
      totalPropertyValueInEthereum: 632,
      mintTo: s7user7,
      minterListingTokenAmount: 50,
      buyers: [
        {
          signer: s8user8,
          amount: 25,
          listedForSale: 0,
        },
      ],
    },
    {
      id: "66275e4d62c199997115cd7e",
      totalPropertyValueInEthereum: 66,
      mintTo: s7user7,
      minterListingTokenAmount: 75,
      buyers: [
        {
          signer: s8user8,
          amount: 50,
          listedForSale: 25,
        },
      ],
    },
    {
      id: "66275e7262c199997115cd80",
      totalPropertyValueInEthereum: 688,
      mintTo: s7user7,
      minterListingTokenAmount: 100,
      buyers: [
        {
          signer: s8user8,
          amount: 50,
          listedForSale: 25,
        },
      ],
    },
    {
      id: "66275ea462c199997115cd82",
      totalPropertyValueInEthereum: 1127,
      mintTo: s8user8,
      minterListingTokenAmount: 0,
      buyers: [],
    },
    {
      id: "66275ecb62c199997115cd84",
      totalPropertyValueInEthereum: 566,
      mintTo: s8user8,
      minterListingTokenAmount: 50,
      buyers: [
        {
          signer: s9user9,
          amount: 25,
          listedForSale: 0,
        },
      ],
    },
    {
      id: "66275ef762c199997115cd86",
      totalPropertyValueInEthereum: 484,
      mintTo: s8user8,
      minterListingTokenAmount: 75,
      buyers: [
        {
          signer: s9user9,
          amount: 50,
          listedForSale: 25,
        },
      ],
    },
    {
      id: "662760dc62c199997115cd97",
      totalPropertyValueInEthereum: 1740,
      mintTo: s8user8,
      minterListingTokenAmount: 100,
      buyers: [
        {
          signer: s9user9,
          amount: 50,
          listedForSale: 25,
        },
      ],
    },
    {
      id: "662760f862c199997115cd99",
      totalPropertyValueInEthereum: 335,
      mintTo: s9user9,
      minterListingTokenAmount: 0,
      buyers: [],
    },
    {
      id: "662761a962c199997115cd9f",
      totalPropertyValueInEthereum: 965,
      mintTo: s9user9,
      minterListingTokenAmount: 50,
      buyers: [
        {
          signer: s10user10,
          amount: 25,
          listedForSale: 0,
        },
      ],
    },
    {
      id: "662761ca62c199997115cda1",
      totalPropertyValueInEthereum: 475,
      mintTo: s9user9,
      minterListingTokenAmount: 75,
      buyers: [
        {
          signer: s10user10,
          amount: 50,
          listedForSale: 25,
        },
      ],
    },
    {
      id: "662762a662c199997115cda7",
      totalPropertyValueInEthereum: 376,
      mintTo: s9user9,
      minterListingTokenAmount: 100,
      buyers: [
        {
          signer: s10user10,
          amount: 50,
          listedForSale: 25,
        },
      ],
    },
    {
      id: "662762e462c199997115cda9",
      totalPropertyValueInEthereum: 348,
      mintTo: s10user10,
      minterListingTokenAmount: 0,
      buyers: [],
    },
    {
      id: "6627602f62c199997115cd93",
      totalPropertyValueInEthereum: 396,
      mintTo: s10user10,
      minterListingTokenAmount: 50,
      buyers: [
        {
          signer: s11user11,
          amount: 25,
          listedForSale: 0,
        },
      ],
    },
    {
      id: "6627625c62c199997115cda3",
      totalPropertyValueInEthereum: 332,
      mintTo: s10user10,
      minterListingTokenAmount: 75,
      buyers: [
        {
          signer: s11user11,
          amount: 50,
          listedForSale: 25,
        },
      ],
    },
    {
      id: "6627606562c199997115cd95",
      totalPropertyValueInEthereum: 633,
      mintTo: s10user10,
      minterListingTokenAmount: 100,
      buyers: [
        {
          signer: s11user11,
          amount: 50,
          listedForSale: 25,
        },
      ],
    },
    {
      id: "6627615562c199997115cd9b",
      totalPropertyValueInEthereum: 408,
      mintTo: s11user11,
      minterListingTokenAmount: 0,
      buyers: [],
    },
    {
      id: "6627617162c199997115cd9d",
      totalPropertyValueInEthereum: 316,
      mintTo: s11user11,
      minterListingTokenAmount: 25,
      buyers: [],
    },
    {
      id: "6627628162c199997115cda5",
      totalPropertyValueInEthereum: 74,
      mintTo: s11user11,
      minterListingTokenAmount: 50,
      buyers: [],
    },
    {
      id: "6627630962c199997115cdab",
      totalPropertyValueInEthereum: 285,
      mintTo: s11user11,
      minterListingTokenAmount: 75,
      buyers: [],
    },
  ];

  for (const property of properties) {
    const propertyValueInWei = ethers.parseEther(property.totalPropertyValueInEthereum.toString());
    const pricePerTokenInWei = propertyValueInWei / BigInt(tokensToMint);
    const feeInWei = propertyValueInWei / BigInt(10000);

    const propertyId = parseInt(parseInt(property.id, 16).toString().slice(-16));

    await reft
      .connect(property.mintTo)
      .mint(property.mintTo.address, propertyId, tokensToMint, pricePerTokenInWei, uri);

    if (property.minterListingTokenAmount > 0) {
      await reft
        .connect(property.mintTo)
        .listTokenForSale(propertyId, property.minterListingTokenAmount, {
          value: feeInWei,
        });
      property.buyers.forEach(async (buyer) => {
        await reft.connect(buyer.signer).buyTokens(propertyId, buyer.amount, {
          value: pricePerTokenInWei * BigInt(buyer.amount) + feeInWei,
        });
        if (buyer.listedForSale > 0) {
          await reft.connect(buyer.signer).listTokenForSale(propertyId, buyer.listedForSale, {
            value: feeInWei,
          });
        }
      });
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
