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
    "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    );
    await reft.mint("{Signer to mint tokens for}", {propertyId}, {amount of tokens to mint}, {price per token}, "{metadata uri / url for the property}");
    await reft.mint("0x70997970C51812dc3A010C7d01b50e0d17dc79C8", 1, 100, 2, "{metadata uri / url for the property}");
    await reft.buyTokens(1);
    0x5FbDB2315678afecb367f032d93F642f64180aa3
    ```

5. run the following code to get the balance of the first signer

    ```javascript
    await reft.balanceOf(
    "{signer address}"
    );
    await reft.balanceOf("0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
    0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
    await reft.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
    ```
