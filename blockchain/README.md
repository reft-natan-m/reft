# rEFT

This is a simple ERC1155 contract that allows for the creation of fungible tokens that represent real estate. The contract allows for minting, listing, delisting, and buying of tokens.

Try running some of the following tasks:

```shell
npx hardhat help # shows all available tasks
npx hardhat test # runs unit tests
REPORT_GAS=true npx hardhat test # reports average gas usage after test run
npx hardhat node # starts up a local blockchain node with 20 test signers
npx hardhat run scripts/deploy.ts --network localhost # deploys the contract to the local node
```

## Running a local node and testing

1. Run a local node with `npx hardhat node` in its own terminal.
2. Deploy the contract with `npx hardhat run scripts/deploy.ts --network localhost`
   1. this will deploy the RealEstateFungibleToken contract
   2. it will also show the token address and the account the contract was deployed with
3. You can check the balances of the signers by running `npx hardhat run scripts/getBalances.ts --network localhost`
4. You can run an example of minting, listing, and buying tokens by running `npx hardhat run scripts/example.ts --network localhost`
5. now you can interact with the contract using the console `npx hardhat console --network localhost`
