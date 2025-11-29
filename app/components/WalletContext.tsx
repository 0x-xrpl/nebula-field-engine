"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
  disconnect: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const NO_WALLET_ERROR = 'No compatible wallet found. Please install MetaMask or another supported wallet.';
const AUTO_CONNECT_KEY = 'NF_AUTO_CONNECT';
const WALLETCONNECT_CACHE_KEYS = [
  'walletconnect',
  'wc@2:client',
  'wc@2:session',
  'walletconnect#',
  'wagmi.wallet',
  'wagmi.store',
];

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
  const walletConnectClientRef = useRef<any>(null);

  const clearError = useCallback(() => setError(null), []);

  const clearWalletConnectCache = useCallback(() => {
    if (typeof window === 'undefined') return;
    WALLETCONNECT_CACHE_KEYS.forEach((key) => {
      try {
        window.localStorage.removeItem(key);
      } catch {
        // ignore storage errors
      }
      try {
        window.sessionStorage?.removeItem(key);
      } catch {
        // ignore storage errors
      }
    });
  }, []);

  const resetWalletState = useCallback(() => {
    setAddress(null);
    setSelectedWallet(null);
    clearError();
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(AUTO_CONNECT_KEY);
    }
  }, [clearError]);

  useEffect(() => {
    const provider = getMetaMaskProvider();
    if (!provider?.on) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (selectedWallet !== 'metamask') return;
      if (accounts?.length) {
        setAddress(accounts[0]);
      } else {
        resetWalletState();
      }
    };

    const handleChainChanged = () => {
      if (selectedWallet === 'metamask') {
        resetWalletState();
      }
    };

    const handleDisconnect = () => {
      if (selectedWallet === 'metamask') {
        resetWalletState();
      }
    };

    provider.on('accountsChanged', handleAccountsChanged);
    provider.on('chainChanged', handleChainChanged);
    provider.on('disconnect', handleDisconnect);

    return () => {
      provider.removeListener?.('accountsChanged', handleAccountsChanged);
      provider.removeListener?.('chainChanged', handleChainChanged);
      provider.removeListener?.('disconnect', handleDisconnect);
    };
  }, [resetWalletState, selectedWallet]);

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

    const provider = getMetaMaskProvider();

    if (provider?.request) {
      try {
        const accounts: string[] = await provider.request({ method: 'eth_requestAccounts' });
        if (accounts?.length) {
          setAddress(accounts[0]);
          setSelectedWallet('metamask');
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(AUTO_CONNECT_KEY, 'true');
          }
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

    if (isMobileDevice() && typeof window !== 'undefined') {
      const redirect = encodeURIComponent(window.location.href);
      window.location.href = `somnia://wallet-connect?redirect=${redirect}`;
      return;
    }

    setError('Somnia Wallet integration is coming soon.');
  }, [clearError]);

  const connectWithWalletConnect = useCallback(async () => {
    clearError();
    clearWalletConnectCache();

    if (typeof window !== 'undefined') {
      window.open('https://walletconnect.com/', '_blank', 'noopener');
    }

    setError('WalletConnect integration is coming soon.');
  }, [clearError, clearWalletConnectCache]);

  const disconnect = useCallback(async () => {
    try {
      if (selectedWallet === 'metamask') {
        const provider = getMetaMaskProvider();
        if (provider?.isMetaMask && provider?.request) {
          try {
            await provider.request({
              method: 'wallet_revokePermissions',
              params: [{ eth_accounts: {} }],
            });
          } catch (err) {
            console.warn('wallet_revokePermissions failed', err);
          }
        }
      }

      if (selectedWallet === 'walletconnect') {
        try {
          await walletConnectClientRef.current?.disconnect?.();
        } catch (err) {
          console.warn('Failed to disconnect WalletConnect session', err);
        }
        clearWalletConnectCache();
      }

      if (selectedWallet === 'somnia') {
        clearWalletConnectCache();
      }
    } finally {
      resetWalletState();
    }
  }, [selectedWallet, clearWalletConnectCache, resetWalletState]);

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
