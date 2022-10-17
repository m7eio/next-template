import { useEffect } from 'react';
import { useAccount, useDisconnect, useProvider, useNetwork, useSigner } from 'wagmi';
import { useConnectModal } from '@m7eio/rainbowkit';
import { useSession } from 'next-auth/react';
import useUser from './useUser';

export default function useWallet(options?: { useUser?: boolean }) {
  const { data: session, status } = useSession();
  const { address, isConnecting, isDisconnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { disconnect } = useDisconnect();
  const provider = useProvider();
  const { chain } = useNetwork();
  const { data: signer, isError, isLoading } = useSigner();
  const user = useUser(options?.useUser === false ? undefined : address);

  useEffect(() => {
    if (status === 'authenticated' && address && session && session?.address) {
      if (session?.address !== address) {
        // signOut();
        disconnect();
      }
    }
  }, [status, session, address]);

  return {
    user,
    session: {
      data: session,
      status,
    },
    provider,
    signer,
    walletAddress: address,
    address,
    chain,
    chainId: chain?.id,
    connect: openConnectModal,
    disconnect,
  };
}
