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
   2. it will also log the 20 signers and their current balances
   3. it will also show the token address and the account the contract was deployed with
3. now you can interact with the contract using the console `npx hardhat console --network localhost`
4. in the console run the following code to interact with the contract

    ```javascript
    const realEstateFungibleTokenContract = await ethers.getContractFactory(
    "RealEstateFungibleToken"
    );
    const reft = await realEstateFungibleTokenContract.attach(
    "{Token Address}"
    );
    await reft.mint("{Signer to mint tokens for}", {propertyId}, {amount of tokens to mint}, {price per token}, "{metadata uri / url for the property}");
    ```

5. run the following code to get the balance of the first signer

    ```javascript
    await reft.balanceOf(
    "{signer address}"
    );
    ```
