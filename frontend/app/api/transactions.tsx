import { BrowserProvider, JsonRpcSigner, Contract, parseEther } from 'ethers'
import type { Account, Chain, Client, Transport } from 'viem'
import { type Config, useConnectorClient } from 'wagmi'
import { useMemo } from 'react'

// Hook to get Wallet client
export function clientToSigner(client: Client<Transport, Chain, Account>) {
  const { account, chain, transport } = client
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  const provider = new BrowserProvider(transport, network) // Connect to Ethereum network using provider
  const signer = new JsonRpcSigner(provider, account.address)
  return signer
}

// Hook to convert a viem Wallet Client to an ethers.js Signer.
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: client } = useConnectorClient<Config>({ chainId })
  return useMemo(() => (client ? clientToSigner(client) : undefined), [client])
}
