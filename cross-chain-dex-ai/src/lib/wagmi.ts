import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, polygonAmoy } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'C-DEX AI',
  projectId: "0f818d2978a2ade572d677bac7c83476",
  chains: [sepolia, polygonAmoy],
  ssr: true,
});