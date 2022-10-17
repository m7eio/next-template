import { IntlMessages, NextIntlProvider } from 'next-intl';
import React, { FC, ReactElement, useEffect, useCallback, useMemo } from 'react';
import NextNProgress from 'nextjs-progressbar';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import {
  GetSiweMessageOptions,
  RainbowKitSiweNextAuthProvider,
} from '@m7eio/rainbowkit-siwe-next-auth';
import { useRouter } from 'next/router';
import { WagmiConfig } from 'wagmi';
import { AvatarComponent, RainbowKitProvider } from '@m7eio/rainbowkit';
import POBSDK from '@m7eio/pob-js-sdk';
import CommonWorkflow from '@m7eio/pob-general-workflow';

import { NotificationContainer } from '../components/notification';
import { chains, wagmiClient } from '../components/web3-wallet';
import useWallet from '../hooks/useWallet';
import Avatar from '../components/avatar';
import Event from '../utils/event';
import { formatPortrait } from '../utils/format';

import '../styles/globals.css';

POBSDK.registerWorkflow({
  name: 'common-workflow',
  init: (signer, options) => {
    return new CommonWorkflow(signer, options);
  },
});

const Wallet: FC<{
  Layout: PageLayout;
  Component: NextPageWithLayout;
  pageProps: any;
}> = ({ Layout, Component, pageProps }) => {
  const router = useRouter();
  const { address, session, connect, user } = useWallet();

  const onViewProfile = useCallback(
    (onClose) => {
      router.push(`/profile/${address}`);
      onClose();
    },
    [router, address],
  );

  const onEditProfile = useCallback(
    (onClose) => {
      router.push(`/profile/edit/general`);
      onClose();
    },
    [router],
  );

  const CustomAvatar: AvatarComponent = ({
    address,
    ensImage,
    size,
  }: {
    address: string;
    ensImage?: string | null;
    size: number;
  }) => {
    return ensImage || session?.data?.user?.image ? (
      <div
        className="object-cover rounded-full"
        style={{
          backgroundImage: `url(${
            ensImage || formatPortrait(session?.data?.user?.image as string)
          })`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          height: size,
          width: size,
        }}
      />
    ) : (
      <Avatar address={address} size={size} />
    );
  };

  const externalContext = useMemo(() => {
    return {
      onViewProfile,
      onEditProfile,
    };
  }, [onViewProfile, onEditProfile, address]);

  const connectHandler = React.useCallback(() => {
    if (connect) {
      connect();
    }
  }, [connect]);

  useEffect(() => {
    Event.on('web3-wallet-connect', connectHandler);

    return () => {
      Event.off('web3-wallet-connect', connectHandler);
    };
  }, [connectHandler]);

  return (
    // @ts-ignore
    <RainbowKitProvider chains={chains} externalContext={externalContext} avatar={CustomAvatar}>
      <NextNProgress color="#c2da58" />
      <Head>
        <script
          id="segment"
          dangerouslySetInnerHTML={{
            __html: `!function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var key=analytics.methods[e];analytics[key]=analytics.factory(key)}analytics.load=function(key,e){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.src="https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n);analytics._loadOptions=e};analytics._writeKey="GIfQkxfdlXQ7xFjMgoKQzrQJUt01Eo87";;analytics.SNIPPET_VERSION="4.15.3";
  analytics.load("${process.env.SEGMENT_API_KEY}");
  }}();`,
          }}
        />
      </Head>
      <Layout>
        <div>
          {/* <Tip /> */}
          <NotificationContainer />
          <Component {...pageProps} />
        </div>
      </Layout>
    </RainbowKitProvider>
  );
};

export type PageLayout = ({ children }: { children: ReactElement }) => ReactElement;

type NextPageWithLayout = NextPage & {
  layout: PageLayout;
};

type AppPropsWithLayout = AppProps<{
  session: Session | null;
  messages: IntlMessages;
  now: Date;
}> & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const Layout = Component.layout ?? (({ children }) => <>{children}</>);

  const getSiweMessageOptions: GetSiweMessageOptions = () => ({
    statement: 'Sign in to Proof of BUILD',
  });

  return (
    <NextIntlProvider
      // To achieve consistent date, time and number formatting
      // across the app, you can define a set of global formats.
      formats={{
        dateTime: {
          short: {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          },
        },
      }}
      messages={pageProps.messages}
      // Providing an explicit value for `now` ensures consistent formatting of
      // relative values regardless of the server or client environment.
      now={new Date(pageProps.now)}
      // Also an explicit time zone is helpful to ensure dates render the
      // same way on the client as on the server, which might be located
      // in a different time zone.
      timeZone="Asia/ShangHai"
    >
      <WagmiConfig client={wagmiClient}>
        <SessionProvider session={pageProps.session} refetchInterval={0}>
          <RainbowKitSiweNextAuthProvider getSiweMessageOptions={getSiweMessageOptions}>
            <Wallet Layout={Layout} Component={Component} pageProps={pageProps}></Wallet>
          </RainbowKitSiweNextAuthProvider>
        </SessionProvider>
      </WagmiConfig>
    </NextIntlProvider>
  );
}

export default MyApp;
