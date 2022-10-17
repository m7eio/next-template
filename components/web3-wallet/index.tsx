import '@m7eio/rainbowkit/styles.css';
import { connectorsForWallets, getDefaultWallets, } from '@m7eio/rainbowkit';
import { chain, configureChains, createClient, } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import {
  argentWallet,
  imTokenWallet,
  ledgerWallet,
  omniWallet,
  trustWallet,
} from '@m7eio/rainbowkit/wallets';
import { ParticleNetwork } from '@particle-network/auth';

if (typeof window !== 'undefined') {
  new ParticleNetwork({
    appId: '4abf957e-798c-498a-beaa-3a6f98e44d11',
    clientKey: 'cqy7y4EmoyswKa3GMdVAUzkU2RgN1aeBFpcBbIPJ',
    projectId: 'e7c467ee-426e-42fd-ae54-c574b5515068',
  });
}

export const { chains, provider } = configureChains(
  [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum],
  [alchemyProvider({ apiKey: process.env.ALCHEMY_ID }), publicProvider()],
);

const { wallets } = getDefaultWallets({
  appName: 'RainbowKit demo',
  authTypes: ['google', 'email', 'discord'],
  chains,
});

// const { connectors } = getDefaultWallets({
//   appName: 'My RainbowKit App',
//   chains,
//   authTypes: ['google', 'facebook', 'apple', 'email', 'phone'],
// });

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: 'Other',
    wallets: [
      argentWallet({ chains }),
      trustWallet({ chains }),
      omniWallet({ chains }),
      imTokenWallet({ chains }),
      ledgerWallet({ chains }),
    ],
  },
]);

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});
