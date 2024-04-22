import React from "react";
import { Button } from "flowbite-react";
import { useEthersSigner } from "../api/transactions";
import { Contract, parseEther } from "ethers";
import RealEstateFungibleTokenData from "../../../blockchain/artifacts/contracts/RealEstateFungibleToken.sol/RealEstateFungibleToken.json";
import { useAccount, useBalance } from "wagmi";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { UserSession } from "@/app/api/auth/[...nextauth]/route";

// Extract the ABI from the loaded JSON data
const abi = RealEstateFungibleTokenData.abi;

const MintAndList = ({
  contractAddress,
  propertyId,
  pricePerTokenInEthereum,
  tokensToMint,
  uri,
  tokens,
}: {
  contractAddress: string;
  propertyId: string;
  pricePerTokenInEthereum: number;
  tokensToMint: number;
  uri: string;
  tokens: number;
}) => {
  const { address } = useAccount();
  const signer = useEthersSigner();
  const balance = useBalance({ address: address });

  const { data: session } = useSession();
  const userSession = session?.user as UserSession;
  const router = useRouter();

  // MINT & LIST FUNCTION
  const mintAndList = async () => {
    const ethBalance = balance.data?.value;
    if (!address || !ethBalance || !signer) {
      alert("Please connect your wallet first.");
      return;
    }
    if (tokens < 1 || tokensToMint < 1) {
      alert("Tokens to be minted and listed cannot be zero or negatve.");
      return;
    }

    // Create Contract
    const reft = new Contract(contractAddress, abi, signer);

    const decimalPropertyId = parseInt(
      parseInt(propertyId, 16).toString().slice(-16)
    );

    // Check Signer Funds
    const pricePerTokenInWei = parseEther(pricePerTokenInEthereum.toString());
    const feeWei = (pricePerTokenInWei * BigInt(tokensToMint)) / BigInt(10000);
    if (feeWei > ethBalance) {
      alert("Insufficient Funds, please add funds to your wallet");
      return;
    }

    try {
      const result = await reft.balanceOf(signer.address, decimalPropertyId);
      console.log("Current balance:", result.toString());

      const mintResult = await reft.mintAndListTokenForSale(
        signer.address,
        decimalPropertyId,
        tokensToMint,
        pricePerTokenInWei,
        uri,
        tokens,
        { value: feeWei } // Pass fee as value (in wei) to the transaction
      );

      console.log("Mint transaction hash:", mintResult.hash);
      console.log(
        `Minting ${tokensToMint} tokens for property ${propertyId} to ${address}`
      );
      console.log(
        "List tokens result:",
        await reft.getAllListingsForProperty(decimalPropertyId)
      );
      alert("Tokens minted and listed successfully!");
      router.push(`/user/${userSession.id}/properties`);
    } catch (error) {
      console.error("Error minting and listing tokens:", error);
      alert("Error minting and listing tokens. Please try again.");
      router.push("/");
    }
  };

  return <Button onClick={mintAndList}> Mint Tokens </Button>;
};

export default MintAndList;
