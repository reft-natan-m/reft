import { ethers } from 'ethers';
import RealEstateFungibleToken from '../../../blockchain/contracts'; // Import the ABI of the smart contract

//  NADEEM HOW DO I DO THIS? How Will we access the contract ID? So we create one each time the handler is called?
import ContractModel from '<path_to_contract_model>'; // Import the contract model for dynamic contract address fetching

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Destructure the request body to extract necessary parameters
      const { contractName, function: functionName, fromAddress, privateKey, ...params } = req.body;

      // Fetch contract address dynamically from a database or storage
      const contractData = await ContractModel.findOne({ name: contractName });
      const contractAddress = contractData.address;

      // Backend ethers.js setup for interacting with the blockchain
      const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
      const wallet = new ethers.Wallet(privateKey, provider);
      const contract = new ethers.Contract(contractAddress, RealEstateFungibleToken.abi, wallet);

      let tx; // Declare a variable to hold the transaction object

      // Switch statement to handle different contract functions based on the functionName parameter
      switch (functionName) {
        case 'mint':
          // Call the mint function on the contract with specified parameters
          tx = await contract.mint(fromAddress, ...Object.values(params));
          console.log('Mint Transaction Hash:', tx.hash); // Log mint transaction hash
          console.log('Mint Gas Used:', tx.gasUsed.toString()); // Log mint gas used
          break;
        case 'list':
          tx = await contract.listTokenForSale(fromAddress, ...Object.values(params));
          console.log('List Transaction Hash:', tx.hash); // Log list transaction hash
          console.log('List Gas Used:', tx.gasUsed.toString()); // Log list gas used
          break;
        case 'buy':
          tx = await contract.buyTokens(fromAddress, ...Object.values(params));
          console.log('Buy Transaction Hash:', tx.hash); // Log buy transaction hash
          console.log('Buy Gas Used:', tx.gasUsed.toString()); // Log buy gas used
          break;
        case 'delist':
          tx = await contract.delistTokenForSale(fromAddress, ...Object.values(params));
          console.log('Delist Transaction Hash:', tx.hash); // Log delist transaction hash
          console.log('Delist Gas Used:', tx.gasUsed.toString()); // Log delist gas used
          break;
        default:
          throw new Error('Invalid function name.'); // Throw an error for unknown function names
      }

      await tx.wait(); // Wait for the transaction to be confirmed (mined) on the blockchain
      res.status(200).json({ success: true }); // Send success response to the client
    } catch (error) {
      console.error(error); // Log any errors that occur during transaction execution
      res.status(500).json({ error: 'Internal Server Error' }); // Send internal server error response
    }
  } else {
    res.setHeader('Allow', ['POST']); // Set allowed HTTP methods for the route
    res.status(405).end(`Method ${req.method} Not Allowed`); // Send method not allowed response for other methods
  }
}
