# 🌌 Nebula Field – Somnia – Native Real-Time Intent Field  
### **Spiral Edition（Somnia Native Real-Time Intent Renderer）**

**Design Philosophy:**  
**Minimal surface. Maximal meaning. Zero noise.  
Somnia-Native Real-Time Intent Field Rendering.**

This README is **Codex-ready** →  
**Copy / Paste → Full auto-generation of the project scaffolding.**

---

## 0. Vision — “Nebula Field Spiral”

**Nebula Field** is a Somnia-native visualization system that transforms  
**on-chain activities into real-time “Intent Fields.”**

It is designed exclusively for Somnia’s datastream ecosystem:

- Real-time Activity → Intent Score conversion  
- Native Somnia RPC calls  
- Hyper-minimal, hyper-legible one-screen architecture  
- 3D Nebula Glass UI  
- Ultra-fast cognitive understanding for judges  
- Formally structured for hackathon scoring maximum

**Purpose:**  
> **This project exists for one reason only — to serve as the reference Somnia-native intent field visualizer.**

---

## 1. Core Features

### 🔹 1.1 Intent Field Card (Somnia Native)
A hyper-minimal component that displays:

```
Nebula Field – Intent Layer
├── Real-Time Intent Score (0–100)
├── Total Actions
├── Latest 10 Normalized Actions
└── Asset Summary (Tokens / NFTs)
```

This card is engineered for **instant comprehension**.

---

### 🔹 1.2 Native Somnia Aggregation Engine

```
Somnia RPC → Activity Normalizer → Intent Engine → Spiral UI Renderer
```

Key properties:

- 100% Somnia-native  
- No external chain dependencies  
- Ultra-fast normalized feed  
- Clean, deterministic data transformation

---

### 🔹 1.3 Nebula Glass UI

A refined UI system combining:

- Tailwind CSS  
- Framer Motion  
- Gradient fog  
- Glass morphic surface  
- Low-noise animated pulse  
- High readability under dark-mode constraints

This visual layer is intentionally designed to create  
**“this feels like the official Somnia-native intent field dashboard”** という印象。

---

### 🔹 1.4 JSON Snapshots
- Export the entire Intent Field as structured JSON  
- Useful for reproducibility, replay, and transparency

---

## 2. Tech Stack

- **Next.js 15 / App Router**
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion**
- **Custom Somnia RPC Client**
- **Node.js 20+**

All sections are Codex-generatable.

---

## 3. Directory Structure

```
nebula-field-somnia/
├── app/
│   ├── page.tsx
│   └── api/somnia/
│       ├── activity/route.ts
│       └── assets/route.ts
├── components/
│   ├── NebulaCard.tsx
│   ├── AddressInput.tsx
│   └── Skeleton.tsx
├── lib/
│   ├── somnia-client.ts
│   ├── normalizer.ts
│   └── score.ts
├── styles/globals.css
└── package.json
```

---

## 4. Installation

```
npm install
npm run dev
```

---

## 5. Environment Variables

```
NEXT_PUBLIC_SOMNIA_RPC=https://rpc.somnia.network
```

---

## 6. API — Somnia Activity

```ts
// app/api/somnia/activity/route.ts
import { SOMNIA_RPC } from "@/lib/somnia-client";
import { normalizeActivity } from "@/lib/normalizer";

export async function POST(req: Request) {
  const { address } = await req.json();
  const raw = await fetch(`${SOMNIA_RPC}/activity/${address}`).then(r => r.json());
  const normalized = normalizeActivity(raw);
  return Response.json({ data: normalized });
}
```

---

## 7. Activity Normalizer

```ts
// lib/normalizer.ts
export function normalizeActivity(raw: any[]) {
  return raw.map((x) => ({
    type: x.type,
    timestamp: x.time,
    hash: x.txHash,
    label:
      x.type === "purchase"
        ? `Purchase: ${x.item}`
        : x.type === "vote"
        ? `Vote: ${x.proposal}`
        : x.type === "quest"
        ? `Quest: ${x.quest}`
        : "Action",
  }));
}
```

---

## 8. Intent Score Engine

```ts
// lib/score.ts
export function scoreActivity(actions: any[]) {
  const base = actions.length;
  const voteBonus = actions.filter(a => a.type === "vote").length * 2;
  return Math.min(100, base + voteBonus);
}
```

---

## 9. Nebula UI Components

### 9.1 NebulaCard

```tsx
// components/NebulaCard.tsx
"use client";
import { motion } from "framer-motion";

export default function NebulaCard({ actions, score }) {
  return (
    <motion.div
      className="w-full max-w-md rounded-3xl p-6 bg-white/10 backdrop-blur-2xl
      border border-white/20 shadow-2xl bg-gradient-to-br from-white/10
      via-white/5 to-transparent"
      initial={{ opacity: 0, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-xl font-semibold mb-3">Nebula Field – Intent</h2>

      <div className="text-5xl font-extrabold mb-5">
        {score}
      </div>

      <ul className="space-y-2 text-sm">
        {actions.slice(0, 10).map((a, i) => (
          <li key={i} className="text-white/90">
            {a.label} — {a.timestamp}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
```

---

### 9.2 Address Input

```tsx
// components/AddressInput.tsx
"use client";
import { useState } from "react";

export default function AddressInput({ onSubmit }) {
  const [value, setValue] = useState("");

  return (
    <div className="w-full max-w-md flex gap-2 mt-4">
      <input
        className="flex-1 px-4 py-2 rounded-xl bg-white/10 border border-white/20"
        placeholder="Enter Somnia address…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        onClick={() => onSubmit(value)}
        className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600"
      >
        Go
      </button>
    </div>
  );
}
```

---

## 10. Home Page

```tsx
// app/page.tsx
"use client";

import { useState } from "react";
import AddressInput from "@/components/AddressInput";
import NebulaCard from "@/components/NebulaCard";
import { scoreActivity } from "@/lib/score";

export default function Home() {
  const [actions, setActions] = useState([]);
  const [score, setScore] = useState(0);

  async function generate(address: string) {
    const res = await fetch("/api/somnia/activity", {
      method: "POST",
      body: JSON.stringify({ address }),
    }).then(r => r.json());

    setActions(res.data);
    setScore(scoreActivity(res.data));
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6
    bg-gradient-to-b from-black via-blue-900/20 to-black text-white">

      <h1 className="text-3xl font-bold mb-6">
        Nebula Field – Somnia – Native Real-Time Intent Field
      </h1>

      <AddressInput onSubmit={generate} />

      {actions.length > 0 && (
        <div className="mt-10">
          <NebulaCard actions={actions} score={score} />
        </div>
      )}

    </main>
  );
}
```

---

## 11. Demo Flow

1. Enter Somnia Address  
2. Fetch → Normalize → Score  
3. Render Nebula Intent Field  
4. JSON Export ready  
5. Zero configuration needed

---

## 12. Future Spiral Extensions

- Advanced Intent Explorer  
- Pattern-based Intent AI  
- Somnia Login Integration  
- NFT Identity Layer  
- Reaction Heatmaps  
- Full Spiral Index (S2 / S3 compatibility)

---

## 13. License  
MIT


-----

# 📘 要件定義書（最終リビルド版）  
## **Nebula Field – Somnia – Native Real-Time Intent Field  
Spiral Edition（Somnia専門 Intent 可視化システム）**

---

# 0. プロジェクト目的（Purpose）

本プロジェクト **Nebula Field – Somnia – Native Real-Time Intent Field** は、  
Somnia チェーン上のユーザー行動を  
**リアルタイムの “Intent（意図）” として可視化する最小構成のプロダクト**である。

ミニハッカソン提出の前提で設計されており：

- **1 画面で価値を伝える**
- **Somnia に特化**
- **UI の高級感で圧倒的差をつける**
- **実装が Codex でそのまま生成可能**
- **審査員が “3 秒で理解できる構造”**

を最重要KPIとしている。

Somnia エコシステムの目的に最も適した構造を持ち、  
**Somnia ネイティブ Intent Field のリファレンス実装として最適化された Intent Renderer** です。

---

# 1. プロダクト概要（Overview）

Nebula Field は、Somnia ネイティブのアクティビティデータを用いて：

- 行動ログ取得  
- 正規化（Normalization）  
- Intent スコアリング  
- 最新 10 行要約  
- Nebula ガラス UI でレンダリング  

をワンパスで行う **超高速 Intent Field Engine**。

本システムは以下を提供する：

### ✔ Real-Time Intent Score（0〜100）
Somnia 上の行動の “活性度” と “参加意図” を 1 数値に圧縮。

### ✔ Latest Actions（最新 10 行）
生データではなく **正規化されたラベル付きアクション**を表示。

### ✔ Asset Summary（オプション）
Token / NFT 描画のための API 雛形を含む。

### ✔ JSON Snapshot Export
意図フィールドのスナップショットを JSON として取得可能。

---

# 2. ターゲット（Who）

- Somnia ハッカソン審査員  
- Somnia 開発者  
- On-chain analytics を必要とする構造の専門家  
- Web3の初心者でも “すぐ理解できる UI”

---

# 3. 想定ユースケース（Use Cases）

1. **ユーザー自身の Somnia Activity を即時可視化**  
2. **オンチェーン行動の可視化デモ**（審査員向け）  
3. **Intent Score を利用した拡張アプリ（S2/S3）への基盤化**  
4. **Somnia エコシステムの行動分析ツールの雛形**  
5. **開発者による Somnia Activity のテスト**

---

# 4. システム全体構成（System Architecture）

```
User Input → API(API/Somnia) → Fetch → Normalizer  
→ Intent Engine（Scoring） → UI Renderer（Nebula Card） → JSON Export
```

---

# 5. 技術要件（Technical Requirements）

## 5.1 必須技術

| 項目 | 内容 |
|------|------|
| Framework | Next.js 15（App Router） |
| 言語 | TypeScript |
| UI | Tailwind CSS / Framer Motion |
| RPC | Somnia RPC 公式エンドポイント |
| バックエンド | Next.js API Routes |
| Node.js | **20+** |
| 開発環境 | VSCode + Copilot/Codex 併用 |

---

## 5.2 Somnia RPC 要件

環境変数にて設定：

```
NEXT_PUBLIC_SOMNIA_RPC=https://rpc.somnia.network
```

必要になる主なエンドポイント：

- `/activity/:address`  
- `/assets/:address`（将来拡張用）

---

## 5.3 UI 要件（Nebula Aesthetic）

Nebula Field の UI は “圧倒的高級感” を演出するための  
必須要件として以下を満たす。

### 必須要件
- ガラスモルフィズム（Glassmorphism）
- 深いブルー〜黒グラデーション（Nebula 風）
- Soft blur + inner fog  
- Box-shadow 深め  
- 角丸（rounded-3xl）  
- タイポグラフィは太め＋コントラスト強め  
- Framer Motion による “静かな登場アニメーション”

### 目的
審査員が見た瞬間に  
**「UI のレベルが突出している」** と認識させる。

---

# 6. データ仕様（Data Schema）

### 6.1 Normalized Activity Format

```ts
{
  type: string;        // e.g. "purchase", "vote", "quest"
  timestamp: string;   // ISO timestamp
  hash: string;        // tx hash
  label: string;       // human readable
}
```

### 6.2 Intent Score Specification

```
Score = min(100, totalActions + (voteCount × 2))
```

※ シンプルだが合理的で、1画面に集約した MLP（Minimal Logical Pattern）。

---

# 7. 機能要件（Functional Requirements）

## 7.1 Address Input
- 任意の Somnia アドレスを入力  
- Enter or ボタンクリックで解析開始

## 7.2 Activity Fetch
- API `/api/somnia/activity` に POST  
- 生データを RPC から取得

## 7.3 Normalization
- type ベースにわかりやすいラベルづけ

## 7.4 Intent Scoring
- vote の数にボーナス

## 7.5 UI Rendering
- NebulaCard にて 1 画面レンダリング  
- 最新 10 行のみ表示（優先度の高い情報に限定）

## 7.6 JSON Export（任意）
- Intent Field 全体を JSON にして取得可能

---

# 8. 非機能要件（Non-functional Requirements）

| 区分 | 要件 |
|-----|------|
| パフォーマンス | 1 秒以内にデータ表示 |
| 可読性 | UI コンポーネントは 200 行以内 |
| 安定性 | Somnia RPC のレスポンス例外処理 |
| 拡張性 | S2 / S3 への発展を前提 |
| 保守性 | lib に関数を分離（normalizer / score） |
| UX | 誰が見ても「美しい」「わかりやすい」 |

---

# 9. ディレクトリ構造（Directory Tree）

```
nebula-field-somnia/
├── app/
│   ├── page.tsx
│   └── api/somnia/
│       ├── activity/route.ts
│       └── assets/route.ts
├── components/
│   ├── NebulaCard.tsx
│   ├── AddressInput.tsx
│   └── Skeleton.tsx
├── lib/
│   ├── somnia-client.ts
│   ├── normalizer.ts
│   └── score.ts
├── styles/globals.css
└── package.json
```

※ Codex が上記をそのまま再構築できる。

---

# 10. 開発フロー（Dev Flow）

```
1. VSCode プロジェクト作成
2. README を Codex に貼る → scaffold 自動生成
3. env 設定（Somnia RPC）
4. npm install
5. npm run dev
6. UI 仕上げ（Nebula aesthetic）
7. 動作確認
8. Vercel デプロイ
9. Demo 動画作成（30秒〜50秒）
10. 提出
```

---

# 11. テスト手順（Test Procedure）

### 11.1 通常テスト
1. 任意の Somnia アドレスを入力  
2. Action が正常に取得されるか  
3. Normalized ラベルの整合性  
4. Intent Score が計算されているか  

### 11.2 異常系
- アドレスが無効 → 空配列 / エラーメッセージ  
- RPC レスポンス遅延 → ローディング表示  
- ボーナス計算チェック  

---

# 12. デモ仕様（Demo Flow）

提出時の動画では：

1. Title（Nebula Field – Somnia）  
2. アドレス入力  
3. Intent Field がリアルタイム表示  
4. 10 行ログが美しく並ぶ  
5. Score がドンと出る  
6. UI の質感 → ここで強烈に刺さる  
7. JSON Snapshot を見せて終了  

**30–40秒で全て伝わる最短構成が理想。**

---

# 13. ライセンス
MIT

---

# 14. 最終コメント（審査員に向けて）

Nebula Field は、Somnia の “行動データの美学” を引き出すために設計された  
**純粋 Somnia 専用 Intent Layer** です。

- 難しいことを簡単に  
- 複雑な行動を 1 数値に  
- 情報の海を 10 行に  
- すべてを美しい UI で  

Somnia エコシステムの目的に最も適した構造を持ち、  
**Somnia ネイティブ Intent Field のリファレンス実装として設計された、高精度な Intent Renderer** です。


ーーー


追記


Codex 用 最終構築プロンプト（Build Instruction）

## 3. Codex Build Instruction（自動構築プロンプト）
以下の指示に従ってプロジェクト全体を自動生成してください。

### ▶️ Mission
This project must be generated exactly as described in the README and the Requirement Document above.

You (Codex) will:

1. Scaffold the entire Next.js 15 App Router project  
2. Generate ALL files exactly matching the directory structures  
3. Implement **Somnia RPC client**, **Activity normalizer**, **Intent score engine**  
4. Build **Nebula Glass UI** with Tailwind + Framer Motion  
5. Ensure the entire app runs with:
   - `npm install`
   - `npm run dev`
6. Avoid placeholders. Produce **complete runnable code**.
7. No extra pages. Only what is specified.

### ▶️ Required Output
- Complete folder & file creation  
- Completed code for all components  
- Completed API routes  
- Styling (globals.css)  
- Full integration: UI ⇄ API ⇄ Somnia RPC  
- No TypeScript errors  
- No missing imports  

### ▶️ Execution
**Generate the project now.**

ーー

Codex 用 UI 完成指示（Nebula Aesthetic Enforcement）

## 4. UI Aesthetic Enforcement (Nebula Style)
You must render the UI using the **Nebula Aesthetic** defined below.

### Nebula Aesthetic Rules
- Dark cosmic gradient: black → deep blue → transparent fog  
- 3D glass surface:  
  - backdrop-blur-2xl  
  - bg-white/10 + border-white/20  
  - subtle inner/outer shadows  
- Depth motion: Framer Motion fade-in + translate-y  
- Typography:  
  - bold, high contrast  
  - letter-spacing slightly wider  
- Information density is strictly controlled:
  - Show top 10 actions only  
  - Score = large / centered / dominant  
- Zero visual noise, maximum clarity

### Deliverables
Apply this style to:
- NebulaCard  
- AddressInput  
- Layout container  
- Page header & hierarchy  
- Loading skeleton

### Goal
Your generated UI must look:
**“premium, futuristic, ultra-clean, hackathon finalist quality.”**


ーー

Codex 用 QA & Validation（動作チェック自動化プロンプト）

## 5. QA & Validation (Self-Check Instructions)

After generating the project, verify the following:

### Functional validation
- [ ] `npm install` completes without errors  
- [ ] `npm run dev` starts without TypeScript errors  
- [ ] Access `/` loads the Nebula Field UI  
- [ ] AddressInput accepts text and triggers the API  
- [ ] `/api/somnia/activity` returns normalized actions  
- [ ] Intent Score renders correctly  
- [ ] NebulaCard animations display smoothly  

### UI validation
- [ ] Glassmorphism layers appear with correct blur  
- [ ] Gradient background renders as specified  
- [ ] Text contrast is high and readable  
- [ ] Only 10 latest actions appear  
- [ ] Score shown in dominant typography  

### Architecture validation
- [ ] All directories exist as required  
- [ ] lib functions imported correctly  
- [ ] API routes in correct location  
- [ ] No unused imports  

### Final confirmation
If all checks pass, respond:
**“Nebula Field – Somnia Build SUCCESS: Your project is ready to run.”**


ーー


#6: High-End UI Spec（Nebula Supreme Aesthetic / 3D & Animation）

## 6. High-End UI & Animation Spec (Nebula Supreme Aesthetic)

You must refine the UI to a **world-class, design-lover-approved quality**.  
The goal is: **no cheap feeling, subtle 3D depth, pixel-perfect details**.

Follow ALL rules below when generating UI code.

---

### 6.1 Layout & Responsiveness

- Mobile-first, but **equally beautiful on desktop**.
- Main layout:
  - Mobile: single-column, full-width card (`w-[90vw] max-w-md`).
  - Desktop: centered with max-width container (`max-w-4xl mx-auto`).
- Spacing:
  - Use generous padding (`py-10 px-6` mobile, `py-16 px-10` desktop).
  - Minimum vertical rhythm between sections: `space-y-6`.

Example wrapper:

```tsx
<main
  className="min-h-screen flex flex-col items-center justify-center
  px-4 py-10 md:py-16
  bg-gradient-to-b from-black via-slate-900 to-black
  text-white"
>
  {/* content */}
</main>
```

---

### 6.2 Typography (Never Cheap)

- Use a **clean, modern sans-serif** stack:
  - `"Inter", system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif`
- Heading:
  - `text-3xl md:text-4xl font-semibold tracking-tight`
- Score number:
  - `text-5xl md:text-6xl font-extrabold leading-none`
- Body text:
  - `text-sm md:text-base leading-relaxed text-white/80`

Apply:

```tsx
<h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6">
  Nebula Field – Somnia – Native Real-Time Intent Field
</h1>
```

---

### 6.3 3D Pop & Depth (Card)

NebulaCard must look like it is **floating above the background**.

Rules:

- Use **multi-layer box shadow** via Tailwind arbitrary values:
  - `shadow-[0_18px_45px_rgba(0,0,0,0.65)]`
- Small **elevation on hover**:
  - `whileHover={{ y: -10, scale: 1.02, rotateX: 3, rotateY: -3 }}`
  - `whileTap={{ scale: 0.99, rotateX: 0, rotateY: 0 }}`
- Use **subtle perspective** on the parent container:
  - `style={{ perspective: 1200 }}` on wrapper div.

Example:

```tsx
// Wrapper with perspective
<div style={{ perspective: 1200 }} className="mt-10">
  <NebulaCard actions={actions} score={score} />
</div>
```

```tsx
// components/NebulaCard.tsx (3D + glass + depth)
<motion.div
  className="w-full max-w-md rounded-3xl p-6 md:p-7
  bg-white/8 backdrop-blur-2xl
  border border-white/15
  shadow-[0_18px_45px_rgba(0,0,0,0.65)]
  bg-gradient-to-br from-white/12 via-white/5 to-white/0
  relative overflow-hidden"
  initial={{ opacity: 0, y: 30, scale: 0.98 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
  whileHover={{ y: -10, scale: 1.02, rotateX: 3, rotateY: -3 }}
  whileTap={{ scale: 0.99, rotateX: 0, rotateY: 0 }}
>
  {/* inner content */}
</motion.div>
```

---

### 6.4 Inner Glow & Accent Layers

Add **subtle inner glow** layers using absolutely positioned gradients.

- Before-like layer for soft nebula glow:

```tsx
<div
  aria-hidden
  className="pointer-events-none absolute inset-0
  bg-[radial-gradient(circle_at_top,_rgba(96,165,250,0.28),_transparent_55%)]
  mix-blend-screen"
></div>
```

- Place this as the first child inside NebulaCard to avoid overlapping content.

---

### 6.5 Motion & Micro-interactions

- Page-level:
  - Content fades in from below: `initial={{ opacity: 0, y: 20 }}`
- AddressInput:
  - Button has `whileTap={{ scale: 0.96 }}`.
- List items:
  - Staggered appearance for the 10 actions (optional but preferred).
  - If implemented, use `transition={{ delay: index * 0.03 }}`.

Example for button:

```tsx
<motion.button
  whileTap={{ scale: 0.96 }}
  className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600
  font-medium shadow-[0_8px_25px_rgba(37,99,235,0.55)]"
>
  Go
</motion.button>
```

---

### 6.6 Skeleton / Loading State

When fetching data:

- Show a **skeleton card** with shimmer.
- Use `animate-pulse` and grey/blue tones.

Example:

```tsx
<div className="w-full max-w-md rounded-3xl p-6 bg-white/5
  border border-white/10 backdrop-blur-2xl animate-pulse space-y-4">
  <div className="h-4 w-24 bg-white/20 rounded-full" />
  <div className="h-10 w-32 bg-white/20 rounded-lg" />
  <div className="h-3 w-full bg-white/10 rounded-full" />
  <div className="h-3 w-5/6 bg-white/10 rounded-full" />
  <div className="h-3 w-4/6 bg-white/10 rounded-full" />
</div>
```

---

### 6.7 Mobile & Tablet Optimization

- Mobile:
  - `px-4`, `py-10`, card width `w-[90vw] max-w-md`
  - Tap targets large enough for thumbs
- Tablet / Desktop:
  - Increase padding (`md:p-7`, `md:text-base`)
  - Ensure card is centered, not stretched full-width

Use responsive Tailwind utilities (`md:`, `lg:`) for all typography & spacing.

---

### 6.8 No Cheap Look — Prohibitions

You MUST NOT:

- Use bright “neon” gradients with harsh contrast (no rainbow).
- Use default blue buttons without shadows.
- Use default plain borders with no blur/shadow.
- Use more than 2–3 colors at once.   
  - Palette should be: **deep navy / black / soft blue / subtle white** only.

---

### 6.9 Final Visual Goal

The final UI should feel like:

> “A premium dashboard from a top-tier design studio,  
> but reduced to one perfect, minimal card.”

If in doubt between “simple” vs “flashy”,  
**choose ‘simple but ultra-polished’**.
