"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type SupportedWallet = 'metamask' | 'somnia' | 'walletconnect';

interface WalletContextValue {
  isConnected: boolean;
  address: string | null;
  selectedWallet: SupportedWallet | null;
  isModalOpen: boolean;
  openWalletModal: () => void;
  closeWalletModal: () => void;
  connectWithMetaMask: () => Promise<void>;
  connectWithSomniaWallet: () => Promise<void>;
  connectWithWalletConnect: () => Promise<void>;
  disconnect: () => void;
  error: string | null;
  clearError: () => void;
}

const NO_WALLET_ERROR = 'No compatible wallet found. Please install MetaMask or another supported wallet.';

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

const isMobileDevice = () =>
  typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

const getMetaMaskProvider = (): any | null => {
  if (typeof window === 'undefined') return null;
  const { ethereum } = window as typeof window & { ethereum?: any };
  if (!ethereum) return null;

  if (ethereum.isMetaMask) {
    return ethereum;
  }

  if (Array.isArray(ethereum.providers)) {
    return ethereum.providers.find((provider: any) => provider.isMetaMask) ?? null;
  }

  return null;
};

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<SupportedWallet | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  useEffect(() => {
    const provider = getMetaMaskProvider();
    if (!provider) return;

    provider
      .request?.({ method: 'eth_accounts' })
      .then((accounts: string[]) => {
        if (accounts?.length) {
          setAddress(accounts[0]);
          setSelectedWallet('metamask');
        }
      })
      .catch(() => {
        // Ignore initial errors; user may not have granted access yet.
      });
  }, []);

  useEffect(() => {
    const provider = getMetaMaskProvider();
    if (!provider?.on) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts?.length) {
        setAddress(accounts[0]);
      } else {
        setAddress(null);
        setSelectedWallet(null);
      }
    };

    provider.on('accountsChanged', handleAccountsChanged);

    return () => {
      provider.removeListener?.('accountsChanged', handleAccountsChanged);
    };
  }, []);

  const openWalletModal = useCallback(() => {
    clearError();
    setIsModalOpen(true);
  }, [clearError]);

  const closeWalletModal = useCallback(() => {
    setIsModalOpen(false);
    clearError();
  }, [clearError]);

  const connectWithMetaMask = useCallback(async () => {
    clearError();
    setSelectedWallet('metamask');

    const provider = getMetaMaskProvider();

    if (provider?.request) {
      try {
        const accounts: string[] = await provider.request({ method: 'eth_requestAccounts' });
        if (accounts?.length) {
          setAddress(accounts[0]);
          setIsModalOpen(false);
          return;
        }
      } catch (err: any) {
        if (err?.code === 4001) {
          setError('Connection rejected by user.');
        } else {
          setError('Failed to connect wallet. Please try again.');
        }
        return;
      }
    }

    if (isMobileDevice() && typeof window !== 'undefined') {
      const origin = window.location.host;
      const deepLink = `https://metamask.app.link/dapp/${origin}`;
      window.location.href = deepLink;
      return;
    }

    setError(NO_WALLET_ERROR);
  }, [clearError]);

  const connectWithSomniaWallet = useCallback(async () => {
    clearError();
    setSelectedWallet('somnia');

    if (isMobileDevice() && typeof window !== 'undefined') {
      const redirect = encodeURIComponent(window.location.href);
      window.location.href = `somnia://wallet-connect?redirect=${redirect}`;
      return;
    }

    setError('Somnia Wallet integration is coming soon.');
  }, [clearError]);

  const connectWithWalletConnect = useCallback(async () => {
    clearError();
    setSelectedWallet('walletconnect');

    if (typeof window !== 'undefined') {
      window.open('https://walletconnect.com/', '_blank', 'noopener');
    }

    setError('WalletConnect integration is coming soon.');
  }, [clearError]);

  const disconnect = useCallback(() => {
    setAddress(null);
    setSelectedWallet(null);
  }, []);

  const value = useMemo<WalletContextValue>(
    () => ({
      isConnected: Boolean(address),
      address,
      selectedWallet,
      isModalOpen,
      openWalletModal,
      closeWalletModal,
      connectWithMetaMask,
      connectWithSomniaWallet,
      connectWithWalletConnect,
      disconnect,
      error,
      clearError,
    }),
    [
      address,
      selectedWallet,
      isModalOpen,
      openWalletModal,
      closeWalletModal,
      connectWithMetaMask,
      connectWithSomniaWallet,
      connectWithWalletConnect,
      disconnect,
      error,
      clearError,
    ],
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
