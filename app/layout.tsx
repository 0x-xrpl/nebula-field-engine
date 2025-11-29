import type { Metadata } from 'next';
import '../styles/globals.css';
import { WalletProvider } from './components/WalletContext';
import ConnectWalletModal from './components/ConnectWalletModal';

export const metadata: Metadata = {
  title: 'Nebula Field',
  description: 'Somnia Native Intent Engine experience',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>
          <ConnectWalletModal />
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
