'use client';

import { useState } from 'react';

type Intent = {
  type: string;
  time: string;
  txHash: string;
  label: string;
};

export default function IntentDemoPage() {
  const [address, setAddress] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [intents, setIntents] = useState<Intent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleEmit() {
    setError(null);

    if (!address.trim()) {
      setError('ウォレットアドレスを入力してください。');
      return;
    }

    try {
      setLoading(true);

      const res = await fetch('/api/intent-demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: address.trim() }),
      });

      if (!res.ok) {
        throw new Error('API Error');
      }

      const data = await res.json();

      setScore(typeof data.score === 'number' ? data.score : null);
      setIntents(Array.isArray(data.intents) ? data.intents : []);
    } catch (e) {
      setError('Intent の取得に失敗しました。時間をおいて再度お試しください。');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black text-slate-50 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-4xl space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-wide">
            Nebula Field – Somnia Native Intent Demo
          </h1>
          <p className="text-sm md:text-base text-slate-300">
            ウォレットアドレスを入力して「Emit Intent」を押すと、ダミーの Intent 履歴と Intent Score を表示します。
            今は Somnia RPC ではなくデモデータですが、後から差し替え可能な構成です。
          </p>
        </header>

        <section className="space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              className="flex-1 rounded-xl bg-slate-900/60 border border-slate-700/70 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400/80"
              placeholder="0x から始まる Somnia アドレスを入力（デモなので何を入れてもOK）"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <button
              onClick={handleEmit}
              disabled={loading}
              className="px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-sm font-semibold tracking-wide transition-colors"
            >
              {loading ? 'Emitting…' : 'Emit Intent'}
            </button>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
        </section>

        <section className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 rounded-3xl bg-slate-900/70 border border-slate-800/80 p-5 shadow-xl shadow-amber-500/10">
            <h2 className="text-sm font-semibold text-slate-300 mb-2">Intent Score</h2>
            <p className="text-5xl font-extrabold tracking-tight">{score !== null ? score : '--'}</p>
            <p className="mt-2 text-xs text-slate-400">
              ダミー計算：Intent 件数＋Vote ボーナスから 0〜100 のスコアを生成します。
            </p>
          </div>

          <div className="md:col-span-2 rounded-3xl bg-slate-900/70 border border-slate-800/80 p-5 shadow-xl shadow-emerald-500/10 min-h-[220px]">
            <h2 className="text-sm font-semibold text-slate-300 mb-3">Latest Intents (max 5)</h2>
            {intents.length === 0 ? (
              <p className="text-sm text-slate-400">
                まだ Intent はありません。上のアドレス欄に入力して「Emit Intent」を押してください。
              </p>
            ) : (
              <ul className="space-y-2 text-sm">
                {intents.slice(0, 5).map((it, i) => (
                  <li
                    key={it.txHash ?? i}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 rounded-xl bg-slate-900/80 border border-slate-800/80 px-3 py-2"
                  >
                    <div>
                      <p className="font-medium text-slate-100">{it.label}</p>
                      <p className="text-xs text-slate-400">
                        {it.type?.toUpperCase?.() ?? 'INTENT'} • {new Date(it.time).toLocaleString()}
                      </p>
                    </div>
                    <p className="text-[10px] text-slate-500 truncate max-w-xs">{it.txHash}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
