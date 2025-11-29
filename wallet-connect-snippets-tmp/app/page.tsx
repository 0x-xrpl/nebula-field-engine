'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Code,
  Cpu,
  Database,
  GitBranch,
  Layers,
  Loader,
  Menu,
  ShieldAlert,
  ShieldCheck,
  Target,
  Wallet,
  X,
  Zap,
} from 'lucide-react';
import { AnimatePresence, motion, useAnimation, useInView } from 'framer-motion';
import ConnectWalletModal from './components/ConnectWalletModal';
import { useWallet, WalletProvider } from './components/WalletContext';

const THEME = {
  colors: {
    bg: '#000000',
    surface: '#0A0A0E',
    surfaceHighlight: '#1A1A25',
    primary: '#10b981',
    accent: '#f59e0b',
    text: '#EFEFEF',
  },
};

const MOCK_VALIDATORS = [
  {
    id: 'VAL-13',
    name: 'Obsidian Guard',
    trustScore: 98,
    comment: 'Intent normalized cleanly. Protocol adheres to strict causality.',
    type: 'Strict',
    color: 'bg-emerald-600',
  },
  {
    id: 'VAL-07',
    name: 'Chaos Weaver',
    trustScore: 41,
    comment: 'High liquidation volatility detected. Entropy exceeds safe threshold.',
    type: 'Risk',
    color: 'bg-red-600',
  },
  {
    id: 'VAL-22',
    name: 'Aether Stream',
    trustScore: 82,
    comment: 'Two alternate safe routes remain available. Latency optimal.',
    type: 'Flow',
    color: 'bg-cyan-600',
  },
  {
    id: 'VAL-99',
    name: 'Silent Witness',
    trustScore: 94,
    comment: 'State transition is atomic. Consistently stable.',
    type: 'Stability',
    color: 'bg-indigo-600',
  },
];

const TRACE_STEPS = [
  { label: 'INGESTION', desc: 'Secure payload tokenization.', status: 'complete' },
  { label: 'GENESIS FORK', desc: 'Isolated state cloning.', status: 'complete' },
  { label: 'PARALLEL SIMULATION', desc: 'Causality branch execution.', status: 'complete' },
  { label: 'VALIDATION', desc: 'Consensus & risk assessment.', status: 'processing' },
  { label: 'COMMITMENT', desc: 'Finalizing transaction hash.', status: 'pending' },
];

const MOCK_FEED_DATA = [
  { address: '0x7a89...8f2b', type: 'Swap Intent', score: 4.8, time: 5 },
  { address: '0x1c34...c4d0', type: 'Liquidity Rebalance', score: 4.9, time: 7 },
  { address: '0x9e01...a2f7', type: 'Governance Vote', score: 4.7, time: 12 },
  { address: '0x3f5b...d8e1', type: 'Risk Hedge Protocol', score: 4.9, time: 18 },
  { address: '0x5d2a...b6c9', type: 'Cross-Chain Bridge', score: 4.6, time: 24 },
  { address: '0x6e7c...f3a4', type: 'Lending Pool Deposit', score: 4.8, time: 30 },
];

const MOCK_DNA_ATTRIBUTES = [
  { label: 'NODE COMPLEXITY', value: 'High', color: 'text-amber-400' },
  { label: 'DECENTRALIZATION', value: '96.2%', color: 'text-emerald-400' },
  { label: 'CAUSALITY RISK', value: 'Low (0.01%)', color: 'text-emerald-400' },
  { label: 'BLOCK LATENCY', value: '2 blocks', color: 'text-cyan-400' },
];

const LARGE_CARD_HOVER_STYLE = {
  scale: 1.005,
  boxShadow: `0 0 40px ${THEME.colors.primary}80, 0 8px 30px #000000c0`,
  transition: { duration: 0.3 },
};

const SMALL_CARD_HOVER_STYLE = {
  scale: 1.02,
  boxShadow: `0 0 30px ${THEME.colors.primary}90, 0 6px 20px #000000c0`,
  transition: { duration: 0.3 },
};

const SUGGESTIONS = [
  'Simulate liquidation risk for this address over the next 30 blocks...',
  'Suggest optimal routing for this wallet cluster over the next epoch...',
  'Predict intent score change if this validator set reconfigures...',
  'Simulate gas impact for broadcasting this batch of intents...',
];

type ValidationTab = 'VALIDATOR' | 'TRACE';

const useParallaxScroll = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollY;
};

const shortenAddress = (addr?: string | null) => {
  if (!addr) return '';
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
};

const AbstractNoiseField: React.FC<{ active: boolean }> = ({ active }) => {
  const scrollY = useParallaxScroll();
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      scale: active ? 1.05 : 1,
      opacity: active ? 0.3 : 0.1,
      rotate: active ? '360deg' : '0deg',
    });
  }, [active, controls]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-black" />

      <motion.div
        className="absolute inset-0"
        style={{
          y: scrollY * 0.1,
          transformStyle: 'preserve-3d',
          transform: 'perspective(1000px) rotateX(60deg) translateY(200px)',
          opacity: 0.2,
          background:
            'linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '40px 40px, 40px 40px',
        }}
      />

      <motion.div
        className="absolute inset-0"
        style={{
          y: scrollY * 0.15,
          filter: 'blur(100px)',
        }}
        animate={{
          rotate: 360,
          x: ['-5%', '5%'],
          scale: active ? 1.3 : 1.1,
        }}
        transition={{ repeat: Infinity, duration: active ? 30 : 60, ease: 'linear' }}
      >
        <motion.div
          className="absolute w-64 h-64 rounded-full -top-10 -left-10"
          style={{ background: THEME.colors.primary }}
          animate={{ x: ['0%', '100%'], y: ['0%', '100%'] }}
          transition={{ repeat: Infinity, duration: 25, ease: 'easeInOut', repeatType: 'reverse' }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full bottom-0 right-0"
          style={{ background: THEME.colors.accent }}
          animate={{ x: ['0%', '-100%'], y: ['0%', '-100%'] }}
          transition={{ repeat: Infinity, duration: 35, ease: 'easeInOut', repeatType: 'reverse' }}
        />
      </motion.div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(circle at 50% 50%, #10b981 0%, transparent 50%)', opacity: 0.2 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2, scale: 1.1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const controls = useAnimation();
  const { isConnected, address, openWalletModal, connectWithMetaMask } = useWallet();

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);
      controls.start({
        backgroundColor: scrolled ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0)',
        backdropFilter: scrolled ? 'blur(20px)' : 'blur(0px)',
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [controls]);

  const handleConnectClick = async () => {
    if (isConnected) return;
    openWalletModal();
    await connectWithMetaMask();
  };

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 transition-colors duration-500 flex items-center justify-center px-4 md:px-12 py-6 min-h-[88px] border-b border-transparent"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      style={{ borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid transparent' }}
    >
      <motion.a
        href="/"
        className="flex items-center gap-4 cursor-pointer group absolute left-4 md:left-12"
        whileHover={{ scale: 1.05, rotate: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Cpu className="w-7 h-7 text-white/90 group-hover:text-emerald-400 transition-colors" strokeWidth={1.5} />
        <h1 className="text-[clamp(1rem,3.5vw,1.5rem)] font-heading tracking-widest text-white/90 group-hover:text-white transition-colors">
          NEBULA FIELD
        </h1>
      </motion.a>

      <nav className="hidden min-[1250px]:flex items-center gap-10">
        {['Dashboard', 'Docs', 'Playground', 'Ecosystem'].map((item) => (
          <a
            key={item}
            href={`/${item.toLowerCase()}`}
            className="text-sm text-gray-400 hover:text-white transition-colors relative group font-body font-medium tracking-wider"
          >
            {item.toUpperCase()}
            <motion.div className="absolute inset-x-0 bottom-[-6px] h-0.5 bg-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-4 absolute right-4 md:right-12">
        <motion.button
          type="button"
          onClick={handleConnectClick}
          className={`relative overflow-hidden flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-full text-xs font-medium transition-all font-body uppercase tracking-wider group border ${
            isConnected
              ? 'bg-emerald-500/10 border-emerald-400/40 text-emerald-200 shadow-[0_0_25px_rgba(16,185,129,0.4)]'
              : 'bg-white/5 hover:bg-white/10 border-white/10 text-white hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isConnected ? (
            <>
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <span className="hidden sm:inline">{shortenAddress(address)}</span>
              <span className="sm:hidden">CONNECTED</span>
            </>
          ) : (
            <>
              <Wallet className="w-4 h-4 text-emerald-400 group-hover:text-white transition-colors" />
              <span className="hidden sm:inline group-hover:text-emerald-400 transition-colors">CONNECT WALLET</span>
              <span className="sm:hidden group-hover:text-emerald-400 transition-colors">CONNECT</span>
            </>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        </motion.button>

        <button
          className="min-[1250px]:hidden text-white/90 hover:text-emerald-400 transition-colors z-50"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-[88px] bg-black/95 backdrop-blur-xl z-40 flex flex-col p-8 border-t border-white/10"
          >
            <nav className="flex flex-col gap-8">
              {['Dashboard', 'Docs', 'Playground', 'Ecosystem'].map((item) => (
                <a
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="text-xl font-heading font-medium text-white/80 hover:text-emerald-400 transition-colors tracking-widest"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.toUpperCase()}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

type IntentInputPanelProps = {
  inputIntent: string;
  setInputIntent: (value: string) => void;
  walletAddress: string;
  setWalletAddress: (value: string) => void;
  handleEmit: () => void;
  isEmitting: boolean;
};

const IntentInputPanel: React.FC<IntentInputPanelProps> = ({
  inputIntent,
  setInputIntent,
  walletAddress,
  setWalletAddress,
  handleEmit,
  isEmitting,
}) => {
  const [, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  const [activeTab, setActiveTab] = useState<'Predict' | 'Suggest' | 'Decision Graph'>('Predict');
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);
  const suggestionControlRef = useRef<HTMLDivElement | null>(null);
  const { isConnected, address } = useWallet();

  useEffect(() => {
    if (isConnected && address) {
      setWalletAddress(address);
    }
  }, [isConnected, address, setWalletAddress]);

  const currentSuggestion = SUGGESTIONS[suggestionIndex];

  const advanceSuggestion = () => {
    if (!SUGGESTIONS.length) return;
    setSuggestionIndex((prev) => (prev + 1) % SUGGESTIONS.length);
  };

  const handleSuggestClick = () => {
    advanceSuggestion();
    setIsSuggestionOpen((prev) => !prev);
  };

  const handleSuggestionSelect = (suggestion: string, index: number) => {
    setInputIntent(suggestion);
    setSuggestionIndex(index);
    setIsSuggestionOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionControlRef.current && !suggestionControlRef.current.contains(event.target as Node)) {
        setIsSuggestionOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const tabs: Array<'Predict' | 'Suggest' | 'Decision Graph'> = ['Predict', 'Suggest', 'Decision Graph'];

  return (
    <motion.div
      ref={containerRef}
      className="relative bg-white/5 border border-white/10 rounded-xl shadow-xl shadow-black/50 transition-all duration-500 overflow-hidden nebula-card-shadow"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={LARGE_CARD_HOVER_STYLE}
    >
      <div className="flex border-b border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 px-6 text-sm font-data font-medium tracking-wider relative transition-colors duration-300 ${
              activeTab === tab ? 'text-white' : 'text-gray-600 hover:text-gray-400'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div layoutId="aiTabIndicator" className="absolute bottom-0 left-0 w-full h-[3px] bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
            )}
          </button>
        ))}
      </div>

      <div className="p-4 md:p-6 space-y-6 relative z-10">
        <textarea
          value={inputIntent}
          onChange={(e) => setInputIntent(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={currentSuggestion}
          className="w-full h-40 bg-transparent text-xl md:text-2xl text-white placeholder-gray-700 outline-none resize-none font-data leading-snug tracking-wider"
        />

        <div className="space-y-2">
          <label className="text-[10px] font-data tracking-widest text-white/60 uppercase">Wallet Address</label>
          <div className="relative">
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="0x1234...ABCD"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm font-mono text-emerald-400 placeholder-white/20 focus:border-emerald-500/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
            {isConnected && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-body uppercase tracking-widest text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Connected
              </span>
            )}
          </div>
          <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35 font-data">
            Auto-filled from the active wallet. You may overwrite this field.
          </p>
        </div>

        <div className="flex flex-col gap-4 pt-4 border-t border-white/10 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-4 text-gray-500">
            <button className="hover:text-emerald-400 transition-colors" title="Data Source">
              <Database size={20} />
            </button>
            <button className="hover:text-amber-400 transition-colors" title="Security Audit">
              <ShieldAlert size={20} />
            </button>
            <button className="hover:text-cyan-400 transition-colors" title="Branch History">
              <GitBranch size={20} />
            </button>
          </div>
          <div className="relative flex flex-col gap-3 w-full md:w-auto sm:flex-row sm:items-center" ref={suggestionControlRef}>
            <motion.button
              type="button"
              onClick={handleSuggestClick}
              className="relative overflow-hidden flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-xs font-data font-medium tracking-[0.3em] uppercase transition-all duration-500 h-12 border border-white/10 text-gray-300 hover:text-black hover:bg-white/90"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.97 }}
            >
              SUGGEST
              <motion.div className="absolute inset-0 bg-white/20 opacity-0 rounded-lg" whileHover={{ opacity: 0.4 }} transition={{ duration: 0.3 }} />
            </motion.button>
            <AnimatePresence>
              {isSuggestionOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute bottom-[calc(100%+0.75rem)] right-0 w-[min(360px,90vw)] bg-black/90 border border-white/10 rounded-xl shadow-2xl shadow-black/60 backdrop-blur-md p-4 space-y-3 z-20"
                >
                  <div className="flex items-center justify-between text-xs font-data uppercase tracking-[0.4em] text-gray-500">
                    <span>INTENT SUGGESTIONS</span>
                    <span className="text-emerald-400">Tap to auto-fill</span>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar-zenith">
                    {SUGGESTIONS.map((suggestion, index) => (
                      <motion.button
                        key={suggestion}
                        type="button"
                        onClick={() => handleSuggestionSelect(suggestion, index)}
                        className={`w-full text-left p-3 rounded-lg border transition-all duration-300 bg-white/5 hover:bg-emerald-500/10 hover:border-emerald-400 flex flex-col gap-1 ${
                          index === suggestionIndex ? 'border-emerald-400/60' : 'border-white/5'
                        }`}
                        whileHover={{ x: 2 }}
                      >
                        <span className="text-[0.6rem] font-data tracking-[0.5em] text-gray-500">INTENT 0{index + 1}</span>
                        <span className="text-sm font-body text-white/90 leading-relaxed">{suggestion}</span>
                        <span className="text-[0.55rem] font-data tracking-[0.6em] text-gray-600 uppercase">Auto fills + ready to emit</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <motion.button
              onClick={handleEmit}
              disabled={isEmitting || !inputIntent}
              className={`relative overflow-hidden flex items-center justify-center gap-2 px-8 py-3 rounded-lg text-sm font-data font-medium tracking-widest uppercase transition-all duration-500 h-12 ${
                isEmitting
                  ? 'bg-gray-800 text-gray-500 cursor-progress'
                  : 'bg-emerald-700/20 text-emerald-400 border border-emerald-500/50 shadow-lg shadow-emerald-700/50 hover:bg-emerald-600 hover:text-black hover:shadow-xl hover:shadow-emerald-500/80 hover:ring-2 hover:ring-emerald-400/80 group'
              }`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {isEmitting ? (
                <Loader size={20} className="animate-spin text-white" />
              ) : (
                <>
                  EMIT INTENT <Zap size={18} className="text-emerald-400 group-hover:text-black" />
                </>
              )}
              <motion.div className="absolute inset-0 bg-emerald-300 opacity-0 rounded-lg" whileHover={{ opacity: 0.3 }} transition={{ duration: 0.3 }} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

type ValidationAndTracePanelProps = {
  activeTab: ValidationTab;
  setActiveTab: (tab: ValidationTab) => void;
};

const ValidationAndTracePanel: React.FC<ValidationAndTracePanelProps> = ({ activeTab, setActiveTab }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });

  const renderValidatorConsensus = () => (
    <motion.div
      key="validators"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      <h3 className="text-xs font-data text-gray-400 uppercase tracking-widest mb-4">VALIDATOR CONSENSUS ({MOCK_VALIDATORS.length} ACTIVE)</h3>
      {MOCK_VALIDATORS.map((v, index) => (
        <motion.div
          key={v.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className="p-3 bg-white/5 border border-white/10 rounded-lg flex justify-between items-start hover:bg-white/10 transition-colors shadow-lg shadow-black/30"
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-data font-bold text-black ${
                v.trustScore > 90 ? 'bg-emerald-400' : v.trustScore < 60 ? 'bg-red-400' : 'bg-cyan-400'
              }`}
            >
              {v.id.split('-')[1]}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-data font-semibold text-white tracking-widest">{v.name}</span>
              <span className="text-xs font-body text-gray-500 tracking-tight">{v.comment}</span>
            </div>
          </div>
          <span className="text-xs font-body font-bold text-gray-400 mt-1">{v.trustScore}%</span>
        </motion.div>
      ))}
    </motion.div>
  );

  const renderTraceLog = () => (
    <motion.div
      key="trace"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <h3 className="text-xs font-data text-gray-400 uppercase tracking-widest mb-4">PROCESSING LOG</h3>
      {TRACE_STEPS.map((step, idx) => (
        <motion.div
          key={step.label}
          className="flex gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1, type: 'spring', stiffness: 100 }}
        >
          <div className="flex flex-col items-center">
            <div
              className={`w-3 h-3 rounded-full mt-1.5 relative ${
                step.status === 'complete'
                  ? 'bg-emerald-400 shadow-[0_0_10px_#4ade80]'
                  : step.status === 'processing'
                  ? 'bg-amber-400 animate-pulse-slow-zenith'
                  : 'bg-gray-700'
              }`}
            />
            {idx !== TRACE_STEPS.length - 1 && <div className="w-[2px] flex-1 bg-white/10 my-2 rounded-full" />}
          </div>
          <div>
            <h4 className="text-sm font-data font-semibold text-white mb-0.5 tracking-wider">{step.label}</h4>
            <p className="text-xs text-gray-500 font-body tracking-tight">{step.desc}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );

  return (
    <motion.div
      ref={containerRef}
      className="h-full flex flex-col bg-white/5 rounded-xl border border-white/10 overflow-hidden shadow-xl shadow-black/50 min-h-[450px] nebula-card-shadow"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      whileHover={LARGE_CARD_HOVER_STYLE}
    >
      <div className="flex border-b border-white/10">
        {['VALIDATOR', 'TRACE'].map((tabName) => (
          <button
            key={tabName}
            onClick={() => setActiveTab(tabName as ValidationTab)}
            className={`flex-1 py-4 text-sm font-data font-medium uppercase tracking-widest relative transition-colors duration-300 ${
              activeTab === tabName ? 'text-white' : 'text-gray-600 hover:text-gray-400'
            }`}
          >
            {tabName}
            {activeTab === tabName && (
              <motion.div
                layoutId="tabIndicatorNebula"
                className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-amber-400 shadow-[0_0_15px_rgba(16,185,129,0.8)]"
              />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar-zenith">
        <AnimatePresence mode="wait">{activeTab === 'VALIDATOR' ? renderValidatorConsensus() : renderTraceLog()}</AnimatePresence>
      </div>
    </motion.div>
  );
};

const DNAPanel: React.FC = () => {
  const isInViewRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(isInViewRef, { once: true, amount: 0.5 });
  const dnaPoints = '50,10 90,30 90,70 50,90 10,70 10,30';

  return (
    <motion.div
      ref={isInViewRef}
      className="relative p-8 bg-white/5 rounded-xl border border-white/10 flex flex-col items-center shadow-xl shadow-black/50 min-h-[450px] nebula-card-shadow"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
      whileHover={LARGE_CARD_HOVER_STYLE}
    >
      <h3 className="w-full text-xs font-data font-medium text-gray-400 uppercase tracking-widest mb-6 flex justify-between">
        <span>INTENT DNA SPECTRUM</span>
        <span className="text-amber-400 font-data font-medium">MUTATION +32%</span>
      </h3>

      <div className="relative w-40 h-40">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polygon points={dnaPoints} fill="none" stroke="#ffffff" strokeOpacity="0.1" />
          <line x1="50" y1="10" x2="50" y2="90" stroke="#ffffff" strokeOpacity="0.1" />
          <line x1="90" y1="30" x2="10" y2="70" stroke="#ffffff" strokeOpacity="0.1" />
          <line x1="90" y1="70" x2="10" y2="30" stroke="#ffffff" strokeOpacity="0.1" />

          {isInView && (
            <motion.polygon
              points="50,25 75,40 75,70 50,80 25,70 25,40"
              fill="url(#dnaGradientNebula)"
              stroke={THEME.colors.primary}
              strokeWidth="1"
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ opacity: 1, pathLength: 1 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            />
          )}

          <defs>
            <linearGradient id="dnaGradientNebula" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="text-xs font-body text-gray-500 mt-4 mb-8">Similarity 68% (Target: 75%)</div>

      <div className="w-full mt-auto">
        <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-8">
          <div className="h-full bg-emerald-500 w-[68%]" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-left">
          {MOCK_DNA_ATTRIBUTES.map((attr, index) => (
            <motion.div
              key={attr.label}
              className="flex flex-col border-l border-white/10 pl-3"
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
            >
              <span className="text-xs font-body text-gray-600 uppercase tracking-widest">{attr.label}</span>
              <span className={`text-sm font-data font-bold ${attr.color}`}>{attr.value}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const HolomapPanel: React.FC = () => {
  const isInViewRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(isInViewRef, { once: true, amount: 0.5 });
  const scrollY = useParallaxScroll();

  const particles = useMemo(
    () =>
      Array.from({ length: 35 }).map(() => ({
        id: Math.random(),
        x: Math.random() * 100,
        y: Math.random() * 100,
        z: Math.random() * 100,
        delay: Math.random() * 10,
      })),
    [],
  );

  return (
    <motion.div
      ref={isInViewRef}
      className="relative w-full min-h-[500px] bg-white/5 rounded-xl border border-white/10 overflow-hidden shadow-xl shadow-black/50 flex flex-col p-8 nebula-card-shadow"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
      whileHover={LARGE_CARD_HOVER_STYLE}
    >
      <h3 className="text-xs font-data font-medium text-gray-400 uppercase tracking-widest mb-4">HOLOMAP / 3D ROUTING</h3>

      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 transform perspective-1000 rotate-x-60"
          style={{
            transformStyle: 'preserve-3d',
            y: scrollY * -0.1,
          }}
          animate={{ rotateZ: 360 }}
          transition={{ duration: 100, ease: 'linear', repeat: Infinity }}
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{
              background:
                'linear-gradient(to right, #4b5563 1px, transparent 1px), linear-gradient(to bottom, #4b5563 1px, transparent 1px)',
              backgroundSize: '30px 30px, 30px 30px',
              transform: 'rotateX(-60deg) scale(2) translateY(50px)',
            }}
          />

          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={`c-${i}`}
              className="absolute border border-emerald-500/30 rounded-full"
              style={{
                width: `${20 + i * 20}vmin`,
                height: `${20 + i * 20}vmin`,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) rotateX(-60deg) scaleY(0.5)',
              }}
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: 'linear' }}
            />
          ))}

          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute w-1 h-1 rounded-full bg-amber-400 shadow-[0_0_5px_#f59e0b]"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                transform: `translateZ(${p.z}px)`,
              }}
              animate={{
                x: [0, 50 - p.x, 0],
                y: [0, 50 - p.y, 0],
                scale: [1, 1.5, 1],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: p.delay, repeatType: 'reverse' }}
            />
          ))}
        </motion.div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-amber-400 shadow-[0_0_20px_#f59e0b] z-10 animate-pulse-slow-zenith" />

        <div className="absolute bottom-4 right-4 text-xs font-body text-gray-500 space-y-1 text-right">
          <p className="text-amber-400 font-data">LATENCY: 12ms</p>
          <p className="text-emerald-400 font-data">NODES: 6/12</p>
          <p className="font-data">TRUST: 98%</p>
        </div>
      </div>
    </motion.div>
  );
};

type WaveformSignalProps = {
  isEmitting: boolean;
};

const WaveformSignal: React.FC<WaveformSignalProps> = ({ isEmitting }) => {
  const amplitude = isEmitting ? [0.1, 1.8, 0.1] : [0.1, 0.3, 0.1];

  return (
    <motion.div className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-xl shadow-black/50 space-y-4 nebula-card-shadow" whileHover={SMALL_CARD_HOVER_STYLE}>
      <h3 className="text-xs font-data font-medium text-gray-400 uppercase tracking-widest flex items-center gap-2">
        <Target size={14} className="text-emerald-400" />
        WAVEFORM SIGNAL
      </h3>
      <div className="text-xl font-data text-emerald-400 font-medium tracking-widest">
        {isEmitting ? 'SIGNAL EMITTING...' : 'AWAITING SIGNAL'}
      </div>

      <svg viewBox="0 0 100 20" className="w-full h-8">
        <motion.path
          fill="none"
          stroke="#10b981"
          strokeWidth="1.5"
          strokeLinecap="round"
          animate={{
            d: [
              'M 0 10 C 25 10, 25 10, 50 10 S 75 10, 100 10',
              `M 0 10 C 25 ${10 - (isEmitting ? 7 : 3)}, 25 ${10 + (isEmitting ? 7 : 3)}, 50 10 S 75 ${10 - (isEmitting ? 7 : 3)}, 100 10`,
            ],
            pathLength: [0.8, 1],
            opacity: amplitude,
          }}
          transition={{ duration: isEmitting ? 0.3 : 1, repeat: Infinity, ease: 'easeInOut', repeatType: 'reverse' }}
        />
      </svg>
    </motion.div>
  );
};

type CreatureStatePanelProps = {
  intentActive: boolean;
};

const CreatureStatePanel: React.FC<CreatureStatePanelProps> = ({ intentActive }) => {
  return (
    <motion.div className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-xl shadow-black/50 space-y-4 nebula-card-shadow" whileHover={SMALL_CARD_HOVER_STYLE}>
      <h3 className="text-xs font-data font-medium text-gray-400 uppercase tracking-widest flex items-center gap-2">
        <ShieldCheck size={14} className="text-amber-400" />
        CREATURE STATE
      </h3>

      <div className="relative w-full h-24 flex items-center justify-center">
        <motion.div
          className={`w-12 h-12 rounded-full relative z-10 ${intentActive ? 'bg-amber-500' : 'bg-emerald-400'} shadow-[0_0_25px_currentColor]`}
          animate={{
            scale: intentActive ? [1, 1.2, 1] : 1,
            x: intentActive ? [0, 5, 0] : 0,
          }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
        />
        <motion.div
          className={`absolute inset-0 rounded-full w-24 h-24 mx-auto my-auto ${intentActive ? 'bg-amber-500/10' : 'bg-emerald-400/10'}`}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0.2, 0.5],
          }}
          transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
        />
      </div>

      <div className="text-xl font-data font-medium tracking-widest text-center" style={{ color: intentActive ? THEME.colors.accent : THEME.colors.primary }}>
        {intentActive ? 'VERIFYING...' : 'STABLE'}
      </div>
      <p className="text-xs text-gray-600 font-body text-center tracking-tight">
        {intentActive ? 'Processing transaction fork simulation.' : 'All sub-systems nominal. Ready for next intent.'}
      </p>
    </motion.div>
  );
};

const SomniaNativeFeed: React.FC = () => {
  const feedRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(feedRef, { once: true, amount: 0.1 });

  return (
    <motion.div
      ref={feedRef}
      className="relative bg-white/5 rounded-xl border border-white/10 p-4 md:p-8 shadow-xl shadow-black/50 nebula-card-shadow nebula-bg-glow min-h-[450px] flex flex-col"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={LARGE_CARD_HOVER_STYLE}
    >
      <div className="flex items-center justify-between mb-4 md:mb-8 border-b border-white/5 pb-4">
        <h3 className="text-base md:text-lg font-data text-white flex items-center gap-3 tracking-widest uppercase font-medium">
          <Code size={20} className="text-amber-400" /> SOMNIA NATIVE FEED
        </h3>
        <a href="#export-json" className="text-xs text-gray-500 hover:text-white flex items-center gap-1 font-body font-medium group transition-colors">
          EXPORT JSON <ArrowRight size={14} className="text-emerald-400 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
      <div className="space-y-0 flex-1 overflow-y-auto custom-scrollbar-zenith">
        {MOCK_FEED_DATA.map((item, i) => (
          <motion.div
            key={item.address}
            className="flex items-center justify-between py-4 border-b border-white/5 last:border-0 group hover:bg-white/10 px-4 -mx-4 rounded-lg transition-colors cursor-pointer"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="flex items-center gap-4">
              <div className={`w-1 h-8 rounded-full ${i % 3 === 0 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <div className="flex flex-col tracking-tighter">
                <span className="text-sm text-gray-300 group-hover:text-white font-data font-semibold tracking-tighter">{item.address}</span>
                <span className="text-xs text-gray-600 font-body tracking-tight">
                  {item.type} • {item.time} mins ago
                </span>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <span className="text-sm font-body-mono-score font-bold text-emerald-400 tracking-normal">Score: {item.score.toFixed(1)}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const PlaceholderPanel: React.FC = () => {
  const isInViewRef = useRef<HTMLAnchorElement | null>(null);
  const isInView = useInView(isInViewRef, { once: true, amount: 0.5 });

  return (
    <motion.a
      ref={isInViewRef}
      href="#new-feature-placeholder"
      className="flex flex-col items-center justify-center p-8 bg-white/5 rounded-xl border border-white/10 shadow-xl shadow-black/50 nebula-card-shadow h-full min-h-[450px] transition-colors cursor-pointer group"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
      whileHover={LARGE_CARD_HOVER_STYLE}
    >
      <Layers size={48} className="text-gray-700 mb-6 group-hover:text-emerald-500 transition-colors" strokeWidth={1.5} />
      <h3 className="text-lg font-data text-gray-300 uppercase tracking-widest mb-2 font-medium group-hover:text-white transition-colors">INTENT ARTIFACT X</h3>
      <p className="text-sm font-body text-gray-600 text-center max-w-xs tracking-tight">
        New component slot reserved for future data visualizations or enhanced intent controls.
      </p>
      <div className="mt-8 text-xs font-data text-emerald-400 flex items-center gap-1 group-hover:underline">
        Explore Slot <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.a>
  );
};

function AppContent() {
  const [inputIntent, setInputIntent] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [isEmitting, setIsEmitting] = useState(false);
  const [intentActive, setIntentActive] = useState(false);
  const [panelTab, setPanelTab] = useState<ValidationTab>('VALIDATOR');
  const scrollY = useParallaxScroll();
  const {
    isModalOpen,
    closeWalletModal,
    connectWithMetaMask,
    connectWithSomniaWallet,
    connectWithWalletConnect,
    error,
    clearError,
  } = useWallet();

  const handleEmit = () => {
    if (!inputIntent || isEmitting) return;
    setIsEmitting(true);
    setIntentActive(true);

    setTimeout(() => {
      setIsEmitting(false);
      setTimeout(() => setIntentActive(false), 800);
    }, 4500);
  };

  const heroRef = useRef<HTMLElement | null>(null);
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 });

  const textSettleVariants = {
    initial: { opacity: 0, y: 50, filter: 'blur(10px)', scale: 1.1 },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1, transition: { duration: 1.5, ease: [0.42, 0, 0.58, 1] } },
  } as const;

  const governanceSettleVariants = {
    initial: { opacity: 0, scale: 0.8, rotate: -5 },
    animate: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 1.5, ease: [0.42, 0, 0.58, 1] } },
  } as const;

  return (
    <>
      <div className="min-h-screen bg-[#000000] text-white selection:bg-emerald-500/30 font-body overflow-x-hidden">
        <AbstractNoiseField active={intentActive} />

        <Header />

        <main className="relative z-10 pt-32 md:pt-48 px-4 md:px-12 pb-40 max-w-[1600px] mx-auto">
          <div className="mx-auto origin-top scale-[0.72] xl:scale-[0.75] 2xl:scale-[0.8]">
            <section ref={heroRef} className="mb-32 text-center relative pt-10 flex flex-col items-center" style={{ transform: `translateY(${scrollY * -0.2}px)` }}>
              <motion.div className="w-full max-w-6xl px-4 mx-auto flex flex-col items-center text-center" initial={{ opacity: 0, y: 50 }} animate={isHeroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}>
                <span className="inline-block py-2 px-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[clamp(0.65rem,1.2vw,0.875rem)] tracking-widest uppercase text-emerald-400 mb-8 font-data font-medium backdrop-blur-md mx-auto">
                  SOMNIA NATIVE INTENT ENGINE
                </span>
                <h2 className="text-[clamp(2rem,8vw,6.5rem)] leading-[0.9] font-heading tracking-tighter text-white/95 w-full mx-auto text-center">
                  <div className="flex flex-col items-center text-center w-full max-w-[min(90vw,1200px)] mx-auto">
                    <motion.span
                      className="block text-center whitespace-nowrap"
                      initial={textSettleVariants.initial}
                      animate={isHeroInView ? textSettleVariants.animate : {}}
                      transition={{ ...textSettleVariants.animate.transition, delay: 0.5 }}
                    >
                      FIELDPROTOCOL
                    </motion.span>

                    <motion.span
                      className="text-amber-400/90 italic block text-center whitespace-nowrap text-[clamp(2rem,8vw,6.5rem)]"
                      initial={governanceSettleVariants.initial}
                      animate={isHeroInView ? governanceSettleVariants.animate : {}}
                      transition={{ ...governanceSettleVariants.animate.transition, delay: 0.7 }}
                    >
                      SOMNIA NATIVE
                    </motion.span>

                    <motion.span
                      className="block text-center whitespace-nowrap"
                      initial={{ opacity: 0, y: -50, filter: 'blur(10px)' }}
                      animate={isHeroInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
                      transition={{ ...textSettleVariants.animate.transition, delay: 0.6 }}
                    >
                      INTENT ENGINE
                    </motion.span>
                  </div>
                </h2>
                <p className="text-gray-300 max-w-4xl mx-auto text-[clamp(1rem,1.8vw,1.5rem)] font-data font-medium tracking-wider leading-relaxed text-center mt-[clamp(2rem,3vw,4rem)]">
                  A native real-time intent layer for the Somnia ecosystem.
                </p>
              </motion.div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 space-y-12">
                <IntentInputPanel
                  inputIntent={inputIntent}
                  setInputIntent={setInputIntent}
                  walletAddress={walletAddress}
                  setWalletAddress={setWalletAddress}
                  handleEmit={handleEmit}
                  isEmitting={isEmitting}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <DNAPanel />
                  <ValidationAndTracePanel activeTab={panelTab} setActiveTab={setPanelTab} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <SomniaNativeFeed />
                  <PlaceholderPanel />
                </div>
              </div>

              <div className="lg:col-span-4 space-y-12">
                <motion.div className="grid grid-cols-1 gap-12" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}>
                  <WaveformSignal isEmitting={isEmitting} />
                  <CreatureStatePanel intentActive={intentActive} />
                </motion.div>

                <HolomapPanel />
              </div>
            </div>
          </div>
        </main>

        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');

        .font-heading { font-family: 'Syne', sans-serif; font-weight: 800; letter-spacing: -0.05em; }
        .font-data { font-family: 'Syne', sans-serif; font-weight: 600; letter-spacing: 0.08em; }
        .font-body { font-family: 'JetBrains Mono', monospace; font-weight: 400; letter-spacing: 0.03em; }
        .font-body-mono-score { font-family: 'JetBrains Mono', monospace; font-weight: 700; letter-spacing: 0em; }

        .custom-scrollbar-zenith::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar-zenith::-webkit-scrollbar-track { background: #0A0A0E; }
        .custom-scrollbar-zenith::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #10b981, #f59e0b);
          border-radius: 4px;
        }
        .custom-scrollbar-zenith::-webkit-scrollbar-thumb:hover { background: linear-gradient(to bottom, #34d399, #fbbf24); }

        .nebula-card-shadow {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4), 0 0 10px rgba(16, 185, 129, 0.02);
        }
        .nebula-bg-glow {
          background-image: radial-gradient(circle at top left, rgba(16, 185, 129, 0.02) 0%, rgba(0, 0, 0, 0) 50%);
        }

        @keyframes pulse-slow-zenith {
          0%, 100% { box-shadow: 0 0 10px currentColor; opacity: 1; }
          50% { box-shadow: 0 0 30px currentColor; opacity: 0.6; }
        }
        .animate-pulse-slow-zenith {
          animation: pulse-slow-zenith 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
      </div>

      <ConnectWalletModal
        isOpen={isModalOpen}
        onClose={closeWalletModal}
        onSelectMetaMask={connectWithMetaMask}
        onSelectSomniaWallet={connectWithSomniaWallet}
        onSelectWalletConnect={connectWithWalletConnect}
        error={error}
        clearError={clearError}
      />
    </>
  );
}

export default function App() {
  return (
    <WalletProvider>
      <AppContent />
    </WalletProvider>
  );
}
