# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```

## Running a local node and testing

1. Run a local node with `npx hardhat node`
2. Deploy the contract with `npx hardhat run scripts/deploy.ts --network localhost`
   1. this will deploy the RealEstateFungibleToken contract
   2. it will also show the token address and the account the contract was deployed with
3. You can check the balances of the signers by running `npx hardhat run scripts/getBalances.ts --network localhost`
4. You can run an example of minting, listing, and buying tokens by running `npx hardhat run scripts/example.ts --network localhost`
5. now you can interact with the contract using the console `npx hardhat console --network localhost`
