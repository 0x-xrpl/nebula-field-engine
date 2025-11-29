import { NextResponse } from 'next/server';

type RawIntent = {
  type: 'purchase' | 'vote' | 'quest' | 'transfer';
  time: string;
  txHash: string;
  label: string;
};

function buildDummyIntents(address: string): RawIntent[] {
  const short = address ? address.slice(0, 6) : '0xDEMO';

  return [
    {
      type: 'purchase',
      time: '2025-11-28T12:00:00Z',
      txHash: '0xaaa111',
      label: `Purchased Somnia Genesis for ${short}`,
    },
    {
      type: 'vote',
      time: '2025-11-28T12:05:00Z',
      txHash: '0xbbb222',
      label: `Voted on Upgrade Proposal #7 as ${short}`,
    },
    {
      type: 'quest',
      time: '2025-11-28T12:10:00Z',
      txHash: '0xccc333',
      label: 'Completed Intent Quest “Nebula Surge”',
    },
    {
      type: 'transfer',
      time: '2025-11-28T12:20:00Z',
      txHash: '0xddd444',
      label: `${short} bridged assets to Somnia Void`,
    },
  ];
}

function scoreFromIntents(intents: RawIntent[]): number {
  const base = intents.length * 10;
  const voteBonus = intents.filter((i) => i.type === 'vote').length * 15;
  return Math.min(100, base + voteBonus);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const address = typeof body.address === 'string' ? body.address : '';

  const intents = buildDummyIntents(address);
  const score = scoreFromIntents(intents);

  return NextResponse.json({
    address,
    score,
    intents,
  });
}
