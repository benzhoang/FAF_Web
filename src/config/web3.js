import { http, createConfig } from 'wagmi';
import { mainnet, sepolia, polygonAmoy } from 'wagmi/chains';
import { injected, safe, walletConnect } from 'wagmi/connectors';

const projectId = 'faf_dashboard_v1'; // Standard Web3 Connect Project ID

export const web3Config = createConfig({
  chains: [polygonAmoy, sepolia, mainnet],
  connectors: [
    injected(),
  ],
  transports: {
    [polygonAmoy.id]: http(),
    [sepolia.id]: http(),
    [mainnet.id]: http(),
  },
});
