import React from "react";
import { Button } from "flowbite-react";
import { useEthersSigner } from "../../app/api/transactions";
import { Contract, parseEther, hexlify } from "ethers";
import RealEstateFungibleTokenData from "../../../blockchain/artifacts/contracts/RealEstateFungibleToken.sol/RealEstateFungibleToken.json";
import { useAccount, useBalance } from "wagmi";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { UserSession } from "@/app/api/auth/[...nextauth]/route";

// Extract the ABI from the loaded JSON data
const abi = RealEstateFungibleTokenData.abi;

const Mint = ({
  contractAddress,
  propertyId,
  pricePerTokenInEthereum,
  tokensToMint,
  uri,
}: {
  contractAddress: string;
  propertyId: string;
  pricePerTokenInEthereum: number;
  tokensToMint: number;
  uri: string;
}) => {
  const { address } = useAccount();
  const signer = useEthersSigner();
  const balance = useBalance({ address: address });

  const { data: session } = useSession();
  const userSession = session?.user as UserSession;
  const router = useRouter();

  // MINT FUNCTION
  const mintToken = async () => {
    const ethBalance = balance.data?.value;
    if (!address || !ethBalance || !signer) {
      alert("Please connect your wallet first.");
      return;
    }
    if (tokensToMint < 1) {
      alert("Tokens to be minted cannot be zero or negative.");
      return;
    }

    // Create Contract
    const reft = new Contract(contractAddress, abi, signer);

    const decimalPropertyId = parseInt(
      parseInt(propertyId, 16).toString().slice(-16)
    );

    try {
      const pricePerTokenInWei = parseEther(pricePerTokenInEthereum.toString());
      const result = await reft.balanceOf(signer.address, decimalPropertyId);
      console.log("Current balance:", result.toString());

      const mintResult = await reft.mint(
        signer.address,
        decimalPropertyId,
        tokensToMint,
        pricePerTokenInWei,
        uri
      );

      console.log("Mint transaction hash:", mintResult.hash);
      console.log(
        `Minting ${tokensToMint} tokens for property ${propertyId} to ${address}`
      );
      console.log(`Signer Balance ${ethBalance} ETH`);
      console.log(
        `Signer Property #${propertyId} Tokens: ${await reft.balanceOf(
          signer.address,
          decimalPropertyId
        )}`
      );

      alert("Tokens minted successfully!");
      router.push(`/user/${userSession.id}/properties`);
    } catch (error) {
      console.error("Error minting tokens:", error);
      alert("Error minting tokens. Aborting Process.");
      router.push("/");
    }
  };

  return <Button onClick={mintToken}> Mint Tokens</Button>;
};

export default Mint;
