import { ethers } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

export async function getAccountBalanceInWei(
  account: HardhatEthersSigner
): Promise<bigint> {
  const address = await account.getAddress();
  return await account.provider.getBalance(address);
}

export async function getAccountBalance(
  account: HardhatEthersSigner
): Promise<string> {
  return ethers.formatEther(await getAccountBalanceInWei(account));
}

export async function logAccountBalances(
  signers: HardhatEthersSigner[]
): Promise<void> {
  for (const [index, signer] of signers.entries()) {
    console.log(
      `Signer #${
        index + 1
      } Address: ${await signer.getAddress()} Balance: ${await getAccountBalance(
        signer
      )} ETH`
    );
  }
}
