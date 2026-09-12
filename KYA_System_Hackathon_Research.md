# Know Your Agent (KYA) — Hackathon Deep Research Brief
### AI for Finance · Lovable × n8n × MiniMax

---

## TL;DR

Everyone is building the payment rails for AI agents. **Nobody has solved the identity layer.**

Visa, Mastercard, PayPal, Coinbase, and a wave of well-funded startups are racing to let AI agents move money autonomously. The infrastructure works. But there is one foundational primitive still missing: **a verified, portable, cryptographic identity for AI agents** — a "Know Your Agent" standard. Non-human identities now outnumber human employees in finance by an estimated **96-to-1**, yet not one of them has a verified financial identity. That is the gap your hackathon project fills.

---

## 1. The Market Reality — AI Agents Are Already Moving Money

This is not speculative. The following events happened in 2025–2026:

| Date | Event |
|------|-------|
| May 2025 | Coinbase launches x402 — open HTTP payment protocol for AI agents |
| May 2025 | Visa launches Intelligent Commerce; works with Anthropic, OpenAI, Perplexity, Microsoft |
| Aug 2025 | Natural raises $10M seed in 72 hours to build B2B agentic payments |
| Sep 2025 | Google launches AP2 (Agent Payments Protocol), backed by 60+ orgs |
| **Sep 29, 2025** | **Mastercard completes the world's first live agentic payment transaction** |
| Oct 2025 | PayPal launches Agentic Commerce Services; integrates with ChatGPT + Perplexity |
| Oct 2025 | Mastercard enables all US cardholders for Agent Pay |
| Nov 2025 | PayPal + Perplexity launch Instant Buy — agents check out across 6,000+ merchants |
| Dec 2025 | Coinbase launches Agentic Wallets (TEE-secured, programmable limits) |
| Dec 2025 | x402 V2 ships; 100M+ payments processed in first 6 months |
| Feb 2026 | Coinbase Agentic Wallets go live with full enterprise guardrails |
| Mar 2026 | x402 processes 119M+ transactions on Base, 35M on Solana; ~$600M annualised volume |

> **Key signal:** AI agent traffic surged **805% year-over-year on Black Friday 2025** (Adobe Analytics). AI agents influenced **$67 billion in global Cyber Week sales** — 20% of all orders (Salesforce).

---

## 2. Market Size

| Metric | Figure | Source |
|--------|--------|--------|
| Agentic commerce market by 2030 | $3–5 trillion | McKinsey |
| B2B spend through AI-agent marketplaces by 2028 | $15 trillion | Gartner |
| AI agent payments (9 months, 2025) | 140 million payments / $43M total | Circle |
| AI agents with purchasing power (2025) | 400,000+ | Fortune Business Insights |
| Global AI agents market (2025) | $8.03 billion | Fortune Business Insights |
| CAGR to 2034 | 46.61% | Fortune Business Insights |
| AI consumer adoption | 47% of US shoppers use AI for at least one purchase step | Visa Research |
| Consumer trust gap | Only **16%** of US consumers currently trust AI to make payments | PYMNTS |

---

## 3. Who Is Already Building — Competitive Landscape

### 3.1 The Giants

#### Visa — Intelligent Commerce + Trusted Agent Protocol
- **Market cap:** ~$610B (NYSE: V)
- **What they built:** Visa Intelligent Commerce — a global initiative for AI-agent-driven transactions. Launched the Trusted Agent Protocol alongside 10+ partners to help merchants distinguish legitimate AI agents from rogue bots.
- **Partners:** Anthropic, OpenAI, Microsoft, Perplexity, Stripe, Shopify, Adyen, Fiserv, Checkout.com, Coinbase, Worldpay, Elavon, Nuvei, Akamai (100+ total)
- **Status:** Hundreds of controlled, real-world agent-initiated transactions completed. Visa predicts **millions of consumers** will use AI agents to complete purchases by holiday 2026.
- **Key quote (Visa CEO Ryan McInerney):** *"These technologies have the potential to radically transform commerce, to radically transform how we all shop, how we all buy, and how commerce works at its most fundamental layers."*

#### Mastercard — Agent Pay + Agentic Cloud
- **Market cap:** ~$500B (NYSE: MA)
- **What they built:** Agent Pay — an agentic payments platform using digital tokenization. Agentic Cloud for rapid deployment.
- **First live transaction:** September 29, 2025. An actual AI agent purchased a product using a tokenized credential. Not a pilot. Not a simulation.
- **Rollout:** All US Mastercard cardholders enabled by mid-November 2025. Global rollout followed. Active in US, Australia, India, Hong Kong.
- **Partners:** PayPal, Microsoft, IBM, Google, Braintree, Checkout.com
- **Key quote (Pablo Fourez, Mastercard CDO):** *"How can merchants distinguish between legitimate AI agents and malicious bots? How do they know the consumer authorized the agent? How can they know if the agent carried out instructions correctly?"* — This is exactly the KYA problem statement.

#### PayPal — Agentic Commerce Services
- **Market cap:** ~$74B (NASDAQ: PYPL)
- **What they built:** "Agent Ready" — unlocks millions of existing PayPal merchants to accept AI-driven payments instantly. "Store Sync" makes catalogs discoverable by AI agents.
- **Integrations:** ChatGPT (Agentic Commerce Protocol with Stripe), Perplexity (Instant Buy, Nov 2025), Mastercard Agent Pay
- **Scale:** 430 million active accounts across ~200 markets. 6,000+ merchants via Instant Buy.
- **Approach:** Multi-platform — not betting on one AI winner. Integration-first strategy.

---

### 3.2 The Infrastructure Protocols

#### Coinbase x402 — Open HTTP Payment Standard
- **What it is:** Revives the long-dormant HTTP 402 "Payment Required" status code. Any API or web service can add a payment gate in a few lines of code. Clients (human or agent) pay automatically and get access.
- **Backed by:** Coinbase + Cloudflare (co-founded x402 Foundation, Sep 2025)
- **Traction:** 100M+ payments in first 6 months; ~$600M annualised volume; 83,000 sellers accept x402; V2 launched Dec 2025
- **Chain support:** Base, Ethereum, Arbitrum, Polygon, Solana
- **Integrations:** World (Sam Altman's AgentKit, Mar 2026), Vercel, Cloudflare Workers, Solana, Anthropic Claude via Payments MCP
- **Cost:** Free tier (1,000 tx/month), then $0.001/transaction
- **Average payment size:** ~$0.20 — micropayments that traditional rails (min $0.30 per tx) cannot handle economically
- **Key stat:** 98.6% of agent payments settled in USDC

#### Google Agent Payments Protocol (AP2)
- **What it is:** Extension of the Agent2Agent (A2A) protocol. Open framework providing a common language for secure, compliant transactions between agents and merchants. Addresses authorization, authenticity, and accountability.
- **Backers (60+ orgs):** Mastercard, PayPal, American Express, Coinbase, Salesforce, Shopify, Cloudflare, Etsy, Klarna, PwC, ServiceNow, Ant International, BVNK, BHN, Accenture
- **Status:** Open spec on GitHub; actively adopted

#### Coinbase Agentic Wallets
- **Launched:** February 2026
- **What it is:** Non-custodial wallets purpose-built for AI agents, secured in Trusted Execution Environments (TEEs). Programmable spending limits per session and per transaction. Gasless trading on Base.
- **Features:** Session caps, transaction limits, 24/7 autonomous operation, CDP Portal for monitoring
- **Integration:** Native x402 protocol support; enterprise dashboard for visibility

---

### 3.3 The Startups

#### Skyfire — Identity + Payments for AI Agents
- **Funding:** $9.5M total (a16z, Coinbase Ventures, Circle, Ripple, Neuberger Berman, Brevan Howard Digital, Gemini)
- **Founded by:** Ex-Ripple, ex-Google executives (Amir Sarhangi sold Jibe to Google; Craig DeWitt, former Ripple exec)
- **What they built:** Agentic payment network + KYAPay protocol. Agents get unique digital wallets with verifiable identity. Spend controls, reputation tracking, activity logs. Partnership with Visa Intelligent Commerce (Dec 2025 demo).
- **Closest competitor to KYA idea** — but focused on wallets + spend limits, not cryptographic identity credentials.
- **Key quote:** *"AI agents can't do anything if they can't make payments; it's just a glorified search. Either we figure out a way where agents are actually able to do things, or they don't do anything, and therefore, they're not agents."* — Craig DeWitt, CPO Skyfire

#### Natural — B2B Agentic Payments Infrastructure
- **Funding:** $9.8M seed (raised in 72 hours, Aug 2025; backed by Forerunner and top fintech VCs)
- **Focus:** Purely B2B/embedded payments — logistics, property management, procurement, healthcare, construction. Explicitly not consumer checkout.
- **Team:** 5 employees. Deliberately lean. GA target: 2026.
- **Key quote:** *"The method by which payments are executed is shifting from human execution to agentic execution. There's never been a time when so much payment volume will change medium."* — Kahlil Lalji, CEO Natural

#### Catena Labs — Regulated AI-Native Financial Institution
- **Funding:** $18M (May 2025)
- **Founded by:** Sean Neville, co-founder of Circle (creator of USDC)
- **Thesis:** The most ambitious play in the space. Not building on top of banking — building a regulated bank *for* AI agents. The thesis: agents need their own financial identity, not wallets bolted onto human accounts.
- **Why it matters for KYA:** The fact that Circle's co-founder raised $18M specifically to solve agent financial identity validates the thesis that KYA is a foundational, investable problem.

#### Nevermined — Agent-to-Agent Micropayment Metering
- **Focus:** Sub-cent micropayment infrastructure that traditional rails cannot handle ($0.30 minimum on credit cards vs. $0.31 average agent payment)
- **Technical:** Per-token, per-API-call, per-GPU-cycle pricing. Tamper-proof metering. Ledger-grade billing. 5x faster book closing.
- **Protocol support:** AP2, x402, A2A, MCP — full compatibility across emerging standards

#### InFlow — AI Agent Payments Platform
- **Launched:** December 4, 2025
- **Positioning:** "PayPal for the web era" — focused exclusively on native AI agent payments rather than retrofitting existing systems
- **Context:** Built in response to AI platform traffic surging 4,700% year-over-year to US e-commerce sites (Adobe, July 2025)

#### Lava
- **Funding:** $5.8M
- **What:** Single wallet solution with usage credits, allowing AI agents to execute autonomous transactions seamlessly

---

## 4. The Gap — Why KYA Is Still Wide Open

### The Stack Today

```
✅ DONE    Payment rails     x402, AP2, Agent Pay, Agentic Wallets
✅ DONE    Spend limits       Coinbase Wallets, Skyfire (per-session caps)
🔨 BUILDING  Agent auth      Who confirms the agent is real and authorised?
❌ MISSING   KYA credentials  Cryptographic binding: agent → principal → scope → liability
❌ MISSING   Reputation score Did this agent behave well across prior transactions?
❌ MISSING   Compliance audit Regulators will demand it — nobody has built it yet
```

### The Core Problem in Numbers

- Non-human identities outnumber human employees in finance by **96-to-1**
- Yet **none of them** have a verified financial identity
- Only **16% of US consumers** trust AI to make payments on their behalf — the trust gap is primarily an **identity problem**, not a technology problem
- **$14 billion** in global non-compliance costs; AML fines alone exceed $6 billion/year — agents operating without identity make this dramatically worse

### What Skyfire Has (and Hasn't) Built

Skyfire is the closest existing product to KYA. They have:
- ✅ Digital wallets per agent with unique identifiers
- ✅ Spend limits and budget controls
- ✅ Activity logs per agent
- ✅ Verification that an agent is a "good actor" to sellers

What Skyfire does **not** have:
- ❌ Cryptographic credentials binding agent → principal → delegated scope
- ❌ Cross-platform portable reputation score
- ❌ Compliance-grade audit trail readable by regulators (FINRA, SEC, FCA format)
- ❌ "Know Your Agent" onboarding flow analogous to KYC
- ❌ Liability chain — who is legally responsible when an agent misbehaves?

### What Catena Labs Has (and Hasn't) Built

Catena is building a regulated bank for agents — the most ambitious version of this vision. But:
- They are building at the institutional/bank layer — not a protocol or middleware
- A hackathon cannot rebuild a regulated bank in 48 hours
- The KYA credential layer sits *above* Catena and *below* Visa/Mastercard — it is the middleware that connects agent identity to both regulated finance and the payment rails

---

## 5. The Hackathon Idea — KYA System

### Core Concept

A **Know Your Agent (KYA) identity and credentialing system** that:

1. **Issues** cryptographically signed identity credentials to AI agents
2. **Binds** each agent to a principal (the human or org that owns/deployed it)
3. **Defines** the scope of what the agent is authorised to do (spend limits, asset types, counterparties, geographies)
4. **Tracks** agent reputation across transactions — a cross-platform behavioural score
5. **Generates** compliance-grade audit logs in regulator-readable formats
6. **Provides** a dashboard (via Lovable) for principals to manage, monitor, and revoke agent permissions

### How It Fits the Stack: Lovable × n8n × MiniMax

| Layer | Tool | Role |
|-------|------|------|
| Frontend / UX | **Lovable** | KYA dashboard — agent registry, credential status, spend activity, reputation scores, one-click revocation |
| Workflow orchestration | **n8n** | Automates credential issuance, compliance log generation, alert routing, integration with x402/AP2/Skyfire APIs |
| Intelligence / NLP | **MiniMax** | Natural language audit trail summarisation; voice-interface for agent monitoring; anomaly detection narration |

### Demo Flow (48-hour build target)

**Scene 1 — Onboarding an agent (KYA enrollment)**
- A company deploys a new procurement AI agent
- They open the Lovable dashboard and register the agent: name, principal, permitted spend categories, max transaction size, permitted counterparties
- n8n workflow issues a cryptographic credential (JWT + on-chain attestation)
- Agent receives its KYA credential — now it has a verifiable identity

**Scene 2 — Agent makes a payment**
- The procurement agent needs to pay a supplier via x402
- It presents its KYA credential alongside the payment
- The receiving merchant can verify: who is this agent, who authorised it, what is it allowed to buy
- The transaction settles; n8n logs the full audit trail

**Scene 3 — Compliance audit trail**
- Compliance officer opens the dashboard
- MiniMax has summarised the week's agent activity in plain English
- Any anomalies (out-of-scope purchases, unusual amounts, new counterparties) are flagged
- One-click export in SAR/regulatory format

**Scene 4 — Reputation score**
- Dashboard shows each agent's reputation score — built from transaction history, anomaly rate, counterparty feedback
- A new merchant receiving a payment from an agent can check its score before accepting
- Agents with high scores get lower friction; new/unverified agents face human-in-the-loop review

### What Makes This Differentiated

| Feature | Skyfire | Coinbase Wallets | Catena Labs | Your KYA System |
|---------|---------|-----------------|-------------|-----------------|
| Agent wallet | ✅ | ✅ | ✅ | ✅ (via integration) |
| Spend limits | ✅ | ✅ | ✅ | ✅ |
| Cryptographic identity credential | ❌ | ❌ | Building | **✅ Core feature** |
| Principal → agent binding | ❌ | ❌ | ❌ | **✅ Core feature** |
| Cross-platform reputation score | ❌ | ❌ | ❌ | **✅ Core feature** |
| Compliance audit trail (regulator format) | ❌ | ❌ | ❌ | **✅ Core feature** |
| Voice-narrated anomaly alerts (MiniMax) | ❌ | ❌ | ❌ | **✅ Core feature** |
| n8n-orchestrated credential workflows | ❌ | ❌ | ❌ | **✅ Core feature** |

---

## 6. The Regulatory Tailwind

This idea has a regulatory tailwind that will make judges and investors sit up:

- **GENIUS Act (US, July 2025):** Gave stablecoins a clear regulatory framework. Made programmable agent payments legal and legitimate. But it said nothing about *agent identity*.
- **EU AI Act:** Classifies many financial AI tools as "high-risk." Requires transparency, documentation, and internal accountability. Agents making financial decisions fall squarely in this category.
- **FSOC (US Treasury, Dec 2024):** Explicitly identified increasing reliance on AI as a mounting risk that demands enhanced oversight. Regulators are watching agent-initiated transactions with no identity or audit trail.
- **OCC / Federal Reserve / FDIC:** Model risk management guidance is being extended to agentic AI systems. Financial institutions need to explain, document, and audit every model-driven decision.
- **BCG Report (2025):** *"AI-related incidents rose 21% from 2024 to 2025. Banks must rethink AI governance from the ground up — traditional model risk management frameworks are unlikely to be sufficient as AI agents take on broader responsibilities."*

**The KYA system is not just a payments product. It is a compliance product.** That makes it sellable to the compliance teams of every major bank, not just their innovation labs.

---

## 7. The Business Model

Once past the hackathon, here is how this monetises:

| Revenue stream | How |
|---------------|-----|
| **SaaS subscription** | Enterprises pay per agent registered + per credential issued |
| **Compliance reporting** | Premium tier for regulator-ready audit export |
| **Reputation API** | Merchants pay to query an agent's KYA score before accepting a transaction |
| **Integration fees** | n8n marketplace node; x402 / AP2 plugin; Skyfire plug-in |
| **Per-transaction micro-fee** | Tiny fee on every credentialed agent transaction (similar to Stripe's model) |

---

## 8. Key Quotes to Use in Your Pitch

> *"Non-human identities now vastly outnumber human employees in finance — by an estimated ratio of 96-to-1 — yet these software agents remain effectively unbanked ghosts."*
> — Cryptonomist, Dec 2025

> *"Mastercard: How can merchants distinguish between legitimate AI agents and malicious bots? How do they know the consumer authorized the agent?"*
> — Pablo Fourez, Mastercard CDO

> *"AI can't truly change the world until it can transact freely. Agents need more than intelligence; they need the autonomy to complete economic tasks."*
> — Craig DeWitt, CPO Skyfire

> *"The missing primitive is 'Know Your Agent.' Just as humans need credit scores and verified identities to access financial services, agents will require cryptographically signed credentials that bind them to a principal, define their constraints, and clarify liability."*
> — Cryptonomist / Stablecoin Payments Analysis, Dec 2025

> *"In 2025, there is pretty much no compliance without AI, because compliance became exponentially harder."*
> — Alexander Statnikov, CEO Crosswise Risk Management (PYMNTS)

> *"Agentic AI changes the game for AI risk. Autonomous agents are powerful, but they can drift from intended business outcomes."*
> — Anne Kleppe, BCG Managing Director

---

## 9. Sources

1. PYMNTS — *2025: The Year AI Agents Entered Payments* (Dec 2025)
2. Visa Press Release — *Visa and Partners Complete Secure AI Transactions* (Dec 18, 2025)
3. Mastercard — *Mastercard and PayPal Join Forces for Agentic Commerce* (Oct 27, 2025)
4. PayPal Newsroom — *PayPal Launches Agentic Commerce Services* (Oct 28, 2025)
5. Google Cloud Blog — *Announcing Agent Payments Protocol (AP2)* (Sep 2025)
6. The Block — *Coinbase x402 V2 ships; 100M payments in 6 months* (Dec 11, 2025)
7. Coinbase Blog — *Introducing Agentic Wallets* (Feb 2026)
8. Coinbase Docs — *x402 Protocol Documentation* (Mar 2026)
9. Sherlock — *x402 Explained: $600M annualised volume* (Mar 2026)
10. TechCrunch — *Skyfire lets AI agents spend your money* (Aug 21, 2024)
11. PYMNTS — *Catena Labs Raises $18M to Build AI-Native Financial Institution* (May 20, 2025)
12. PYMNTS — *Natural raises $9.8M for agentic payments* (Nov 2025)
13. Nevermined — *35 AI Micropayment Infrastructure Statistics* (Mar 2026)
14. CV VC Insights — *AI Agents as the Catalyst for Onchain Finance* (Oct 2025)
15. Cryptonomist — *Stablecoin Payments Reshape Finance, AI, and the Open Web* (Dec 2025)
16. BCG — *What Happens When AI Stops Asking Permission?* (2025)
17. RGP — *AI in Financial Services 2025* (Jul 2025)
18. American Banker — *Visa, Mastercard Expand Agentic AI Deployments* (Apr 2026)
19. paz.ai — *Visa, Mastercard, and PayPal's Q4 2025 Moves Into Agentic Commerce* (Dec 2025)
20. Circle — *AI Agents Completed 140 Million Payments in 9 Months* (2025)

---

## 10. Has Anyone Actually Built a KYA System? — The Full Landscape

**Short answer: yes, the term is real, several products exist, but the finance-native compliance layer is still completely open.**

### 10.1 How KYA Emerged — A Timeline

The term "Know Your Agent" crystallised in early 2025 through simultaneous academic research from MIT and enterprise initiatives from identity verification leaders. By January 2026, at least a dozen major players were competing to define KYA infrastructure. Here is how it happened:

| Date | Event |
|------|-------|
| Early 2025 | MIT academic papers + Sumsub/Trulioo enterprise labs independently coin "Know Your Agent" |
| Jul 2025 | Trulioo + PayOS publish the first KYA white paper, introducing the "Digital Agent Passport" concept |
| **Aug 2025** | **Trulioo officially launches KYA — the first live product on the market** |
| Aug 2025 | Worldpay partners with Trulioo to bring KYA to 1 million merchants across 170 countries |
| Aug 2025 | ERC-8004 co-authored by engineers from MetaMask, Ethereum Foundation, Google, Coinbase |
| Sep–Dec 2025 | Trulioo joins Google AP2; knowyouragent.xyz launches; AgentFacts publishes 10-category standard; RNWY launches soulbound tokens |
| **Jan 29, 2026** | **ERC-8004 deploys to Ethereum mainnet (30,000+ agents registered in week one)** |
| **Jan 29, 2026** | **Sumsub launches "AI Agent Verification" — agent-to-human binding — on the same day** |
| Apr 2026 | Fragmented, fast-moving. No dominant standard. Finance-native compliance layer still unbuilt. |

---

### 10.2 The Players — What Each One Actually Built

#### Trulioo — First Mover, Digital Agent Passport
- **Founded:** 2011 · **Raised:** $475M
- **Launched KYA:** August 2025 — the first live KYA product in the market
- **Core product:** The "Digital Agent Passport" (DAP) — a tamper-proof credential with five checkpoints:
  1. Verify the agent developer (confirmed legitimate business entity)
  2. Lock the agent code (only approved, untampered code can operate)
  3. Capture user permission (proof of ongoing consent)
  4. Issue a Digital Agent Passport (signals verified, trusted, in good standing)
  5. Ongoing lookup (continuously checks agent status in real time)
- **Partnerships:** Worldpay ($2.5T payments/yr, 1M merchants, 170 countries); Google AP2 (Dec 2025)
- **Philosophy:** KYA as a living system — not a one-time check but continuous scrutiny
- **Key quote (CEO Vicky Bindra):** *"The future of commerce belongs to agents that can think, act, and transact independently — but only if they can be trusted. By joining AP2, we're helping define the identity backbone for autonomous payments."*
- **Key quote (CPO Zac Cohen):** *"KYC establishes that a person exists and has been verified. KYA establishes that a digital agent is authorized to act."*

#### Sumsub — Human-Binding Approach
- **Founded:** Global verification and fraud prevention leader · Gartner Leader
- **Launched:** January 29, 2026 — "AI Agent Verification" within its KYA framework
- **Unique angle:** Instead of credentialing the agent itself, Sumsub binds *every agent action* to a verified living human in real time. Three steps: detect automation → assess risk → verify human presence if needed.
- **Philosophy:** *"Today, automation itself isn't the problem — anonymity is. When AI agents can autonomously move money, create accounts, or transact at scale without a real person behind them, fraud can almost become impossible to mitigate."* — Artem Popov, Head of Fraud Prevention
- **Key data:** Cited 180% year-over-year increase in multi-step, coordinated AI fraud attacks globally in 2025
- **Differentiator:** The only product that requires real-time human liveness checks at high-risk moments — preventing deepfakes or synthetic actors from impersonating real users

#### ERC-8004 — The Blockchain Standard
- **Co-authored by:** Engineers from MetaMask, Ethereum Foundation, Google, Coinbase
- **Proposed:** August 2025 · **Deployed to Ethereum mainnet:** January 29, 2026
- **What it is:** The first open blockchain identity standard for AI agents. Defines three lightweight singleton registries. Each agent receives a unique `agentId` and an `agentURI` pointing to JSON metadata with service endpoints, trust configuration, and protocol support (Google A2A, Anthropic MCP, ENS, W3C DIDs).
- **Traction:** 30,000+ agents registered in the first week after mainnet launch
- **Key criticism:** Uses standard ERC-721 (transferable NFTs), meaning agent identities can be bought and sold on secondary markets — which enables reputation laundering

#### RNWY — Soulbound Agent Identity + Reputation Intelligence
- **Product:** Mints non-transferable (soulbound) identity tokens on Base — permanent links between an agent's wallet and its accumulated reputation that cannot be transferred or purchased
- **Scale:** 100,000+ registered AI agents served
- **Features:** Wallet tenure analysis, ownership history verification, trust scoring, fraud pattern detection (low-history addresses, suspicious ownership transfers, reputation laundering attempts)
- **Pairs with:** ERC-8004 — provides the intelligence layer that ERC-8004's registry lacks
- **Key distinction:** Specifically designed to solve the reputation laundering problem that transferable NFT-based identity creates

#### AgentFacts — Universal Metadata Standard
- **What it is:** The first comprehensive KYA implementation as a universal 10-category metadata schema
- **Features:** Cryptographic signatures from multiple trusted authorities, multi-authority verification, connection to enterprise governance systems, automated compliance monitoring, permission management, audit trail generation
- **Open source:** Available on GitHub
- **Position:** *"KYA is to AI agents what KYC is to financial services"*

#### KnowYourAgent.xyz — Agent Trust Certificates for Merchants
- **Problem it solves:** Legitimate AI buyers are being falsely flagged and blocked by fraud tools. Merchants lose revenue on every false positive.
- **Product:** Issues Agent Trust Certificates — "the SSL of agent commerce." Merchants check the certificate before a transaction so verified AI shoppers aren't blocked.
- **Positioning:** Merchant-side commerce focus, not financial compliance

---

### 10.3 The Full Feature Comparison

| Feature | Trulioo | Sumsub | ERC-8004 | RNWY | Skyfire | **Your KYA System** |
|---------|---------|--------|----------|------|---------|---------------------|
| Agent identity credential | ✅ DAP | ~ via human | ✅ on-chain | ✅ soulbound | ~ wallet ID | **✅ Core** |
| Human/principal binding | ✅ | ✅✅ core | ❌ | ❌ | ~ | **✅ Core** |
| Cross-platform reputation score | ~ building | ❌ | ❌ | ✅ | ❌ | **✅ Core** |
| Spend/permission scoping | ✅ | ❌ | ❌ | ❌ | ✅ | **✅ Core** |
| Compliance audit trail | ~ | ~ | ❌ | ❌ | ❌ | **✅ Core** |
| Regulator-readable export (SAR/AML) | ❌ | ❌ | ❌ | ❌ | ❌ | **✅ Core** |
| Finance-specific (bank/AML scoping) | ~ | ~ | ❌ | ❌ | ❌ | **✅ Core** |
| Open standard / protocol | ❌ | ❌ | ✅ | ~ | ❌ | ~ |
| n8n workflow integration | ❌ | ❌ | ❌ | ❌ | ❌ | **✅ Core** |
| MiniMax voice narration | ❌ | ❌ | ❌ | ❌ | ❌ | **✅ Core** |

---

### 10.4 The Philosophical Divide — Four Schools of KYA

No single architecture dominates. The landscape has split into four distinct philosophies:

**1. Human-binding (Sumsub):** Every agent action must be traceable to a live, verified human in real time. Most conservative, highest trust, most friction.

**2. Credential passport (Trulioo):** Issue a tamper-proof digital passport to the agent upfront, then check it continuously. Balance of automation and accountability.

**3. Blockchain registry (ERC-8004):** Universal, open, on-chain identity registry. Maximum interoperability. Weakness: transferable identities enable reputation laundering.

**4. Soulbound reputation (RNWY):** Non-transferable identity tokens that permanently bind reputation to an agent wallet. Prevents gaming. Limited to blockchain-native contexts.

---

### 10.5 The Regulatory Pressure Driving Adoption

- **180% YoY increase** in multi-step, coordinated AI fraud attacks globally in 2025 (Sumsub Identity Fraud Report)
- **Nearly 90% of enterprises** report bot management is now a major challenge (PYMNTS/Trulioo survey of 350 global risk leaders)
- **$100 billion annually** lost to fraud, false declines, and lost customers from outdated digital identity controls
- **Bots account for ~50% of internet traffic** — bad bots nearly one third (Imperva)
- **Average breakout time fell to 29 minutes in 2025**, with fastest observed at 27 seconds (CrowdStrike)
- **Gartner:** 40% of enterprise apps will include task-specific AI agents by 2026, up from <5% in 2025
- **Gartner warning:** Over 40% of agentic AI projects will be canceled by end of 2027 without value and risk controls

---

### 10.6 What This Means for the Hackathon Build

The market is validated, the term is coined, and real products exist. This is *good news*, not bad news — it means judges will understand the problem immediately without education. The differentiation opportunity is clear:

**Every existing KYA product targets commerce (retail checkout, B2C shopping agents).** None of them are built for financial compliance — AML-aware permission scoping, SAR-format audit exports, bank-grade credentialing workflows, n8n orchestration, or MiniMax voice-narrated anomaly alerts.

The incumbents prove the market. Your hackathon build proves the finance-native layer they haven't shipped.

> *"KYA is becoming a prerequisite for secure, trustworthy autonomy. As organizations continue to deploy AI agents at scale, KYA is not optional — it is the compliance foundation that everything else depends on."* — Sumsub

> *"There's still a missing layer of actually identifying the users behind agents, making sure they're verified and have the proper credentials to act. That trust layer is what's needed to ensure the future of commerce is secure."* — Sumant Gandhi, Trulioo Head of Product for Agentic Identity

---

## 11. Product Name — Sigil

### Why Sigil

The name works on three simultaneous levels that matter for a finance-AI product:

- **Historical:** A sigil is a wax seal pressed into a document to authenticate it — literally a mark of verified authority. Exactly what this product issues to AI agents.
- **Cryptographic:** Maps directly to what the product does — a unique cryptographic signature bound to an agent's identity, scope, and principal.
- **Visual:** Creates a strong geometric vocabulary — diamond forms, concentric ring marks, scope layers — all of which render cleanly at any size from app icon to pitch slide.

The word is one syllable. It is uncommon enough to be trademarkable. It has no existing fintech or identity company using it. And once explained, it is impossible to forget.

---

### Tagline System — 5 Options for Different Contexts

| Tagline | Best used for |
|---------|--------------|
| **Every agent, verified.** | Primary — pitch decks, homepage hero, press materials. Short, declarative, impossible to misread. |
| **The cryptographic mark of agent authority.** | Technical audiences — developer docs, conference talks, product pages. Signals the mechanism, not just the outcome. |
| **Know your agent. Before it moves your money.** | Finance/compliance audiences — sales decks, bank pitches, LinkedIn. The KYC parallel is explicit. Creates tension, then resolves it. |
| **Identity for the agentic economy.** | VC pitches and investor materials. Positions as infrastructure play, not feature. Broad enough to grow into. |
| **Trust, bound to code.** | Brand storytelling, about pages, swag. Poetic compression of the core idea — human trust, machine execution, cryptographic binding. |

The recommended primary tagline for the hackathon pitch is:

> *"Know your agent. Before it moves your money."*

It does three things in six words: invokes the KYC analogy the audience already knows, creates genuine tension, and resolves it by implying Sigil is the answer. Judges will write it down.

---

### Logo Concepts — Three Directions

**Option 1 — Geometric diamond mark (light)**
A classic sigil shape: a nested diamond with a central point, evoking a wax seal or cryptographic stamp. The outer diamond is an unfilled stroke in Sigil Core purple; the inner diamond fills with Sigil Light; the centre point is a solid circle. Clean, scalable, works at 16px favicon or 200px hero.

**Option 2 — Concentric ring seal (dark background)**
A target-ring mark: three concentric circles — outer stroke, dashed inner ring, solid centre dot — with four cardinal tick marks. Evokes verification, the concentric layers of trust in the KYA model, and the concept of scope rings (what an agent is authorised to touch). Strong on dark backgrounds; ideal for pitch decks and app icons.

**Option 3 — Document seal mark (compliance-forward)**
A rounded-rect credential document icon with horizontal rule lines and a top-edge stamp notch. Most literal of the three — directly reads as "a certified document." Best for formal financial contexts, printed materials, and enterprise sales collateral where metaphor clarity matters more than elegance.

The recommended mark for the hackathon is Option 2 (concentric ring seal) on the dark hero slide — it is the most distinctive and most likely to be memorable in a 5-minute demo.

---

### Brand Colour Palette

| Name | Hex | Usage |
|------|-----|-------|
| Sigil deep | `#26215C` | Dark backgrounds, pitch slides, hero surfaces |
| Sigil core | `#534AB7` | Primary brand colour — logos, primary buttons, key UI elements |
| Sigil mid | `#AFA9EC` | Secondary text on dark, decorative elements |
| Sigil light | `#EEEDFE` | Background fills, badges, credential status chips |
| Verified green | `#1D9E75` | Active credentials, verified status, in-scope indicators |
| Revoked red | `#E24B4A` | Revoked credentials, out-of-scope alerts, suspended agents |

The colour story is intentionally deep purple. Purple sits between the cold authority of blue (traditional finance) and the forward-thinking warmth of violet (crypto infrastructure). It signals "we are serious, but we are not a bank." The green/red accent pair then does all the semantic work in the UI — verified vs revoked, trusted vs flagged.

---

### Brand Tokens — In-Product Language

**Agent ID format:**
```
SGL-4f9a-procurement-01
```

**API prefix:**
```
sigil.io/v1/agents
```

**Audit events:**
```
sigil.credential.issued
sigil.credential.revoked
sigil.scope.exceeded
sigil.reputation.updated
```

**Status chips:**
- `Sigil verified` — purple badge, active credential
- `Active · in scope` — green badge, operating within bounds
- `Sigil revoked` — red badge, credential suspended

---

### Product Family — Naming Architecture

The verb "carries" makes the product family work. You say "your agent carries a Sigil" the same way you'd say "your employee carries a badge" — it makes the abstract concept of cryptographic agent identity feel tangible and physical.

| Product name | What it is |
|-------------|-----------|
| **Sigil** | The platform — the full KYA credentialing, monitoring, and compliance system |
| **Sigil Passport** | The agent credential — the tamper-proof identity document issued to each agent |
| **Sigil Score** | The reputation rating — a cross-transaction behavioural score, 0–100 |
| **Sigil Vault** | The audit log — immutable, tamper-evident record of every agent action |
| **Sigil Trace** | The compliance export — one-click SAR/AML-format report for regulators |

---

### User-Facing Language Examples

These are the phrases that would appear in the product UI, API docs, and sales materials:

- *"Your agent carries a Sigil"*
- *"Sigil-verified agents only"*
- *"Check the agent's Sigil before transacting"*
- *"Sigil Score · 94/100 · high trust"*
- *"Sigil revoked — agent suspended"*
- *"This agent has no Sigil. Proceed with human review."*
- *"Sigil issued to procurement-agent-01 by Acme Corp treasury team"*

---

### Hackathon Pitch Slide — Dark Hero

The opening slide should have exactly this:

```
[Concentric ring mark — Sigil Core purple on black]

sigil

————

KNOW YOUR AGENT · KYA FOR FINANCE

The compliance-grade identity layer for AI agents moving money
Built on Lovable · n8n · MiniMax
```

Nothing else on the slide. One idea. One word. Five supporting words. The restraint itself signals confidence — judges notice when a team doesn't need ten bullet points to explain what they built.

---

### Positioning Statement (one paragraph for pitch decks)

> Sigil is the Know Your Agent (KYA) platform for financial services — the compliance-grade identity layer that every AI agent moving money needs but doesn't have. Just as KYC verifies humans before they access financial services, Sigil verifies AI agents before they transact: issuing cryptographic credentials, binding each agent to its principal and scope of authority, scoring reputation across transactions, and generating regulator-ready audit trails. While Trulioo and Sumsub have built KYA for retail commerce, Sigil is built for the one context where identity failure has the highest cost — finance.

---

## 12. Updated Sources

21. Trulioo — *Know Your Agent: An Identity Framework for Agentic Commerce* (Jul 2025)
22. Trulioo + Worldpay — *Worldpay and Trulioo Collaborate to Embed Trust in the Agentic Commerce Era* (Aug 14, 2025)
23. Biometric Update — *Trulioo partners with Worldpay to offer Know Your Agent to merchants* (Aug 2025)
24. Finovate — *Trulioo Joins Google's Agent Payments Protocol (AP2)* (Dec 5, 2025)
25. Trulioo Newsroom — *Trulioo Joins Google AP2 to Enable Trusted Agent Payments* (Dec 4, 2025)
26. Trulioo Blog — *Know Your Agent (KYA) Meets the Market* (Nov 2025)
27. PRNewswire — *Sumsub's AI Agent Verification Introduces Agent-to-Human Binding* (Jan 29, 2026)
28. Help Net Security — *Sumsub's AI Agent Verification binds automation to verified human identity* (Jan 29, 2026)
29. Sumsub Blog — *From AI Agents to Know Your Agent: Why KYA Is Critical* (Jan 28, 2026)
30. PYMNTS — *Sumsub Adds AI Agent Verification to Know Your Agent Framework* (Jan 29, 2026)
31. PYMNTS — *Agentic Commerce Pushes 'Know Your Human' Into Verification Processes* (Feb 27, 2026)
32. PYMNTS + Trulioo — *Know Your Agent Models Are a Must for Enterprises* (Mar 2026)
33. PYMNTS — *Trulioo Says the Next Evolution of KYC Is KYA* (Oct 29, 2025)
34. RNWY — *Know Your Agent (KYA): How to Get Started* (Feb 6, 2026)
35. RNWY Blog — *The OpenClaw Ecosystem Is Growing Fast — Who's Verifying These Agents?* (Feb 2026)
36. AgentFacts — *Know Your Agent (KYA) | The Identity Verification Standard for AI Agents* (Nov 2025)
37. KnowYourAgent.xyz — *Pre-Credentialing for Autonomous AI Agents* (2026)
38. KnowYourAgent.network (RNWY) — *KYA explained: trust scoring, wallet tenure, ERC-8004* (2026)
39. Stablecoin Insider — *Know Your Agent (KYA) in 2026: The Practical Standard* (Feb 27, 2026)
40. Vouched.id — *AI Agent Identity Verification Solution: A 2025 Guide* (Dec 2025)

---

*Research compiled April 2026. All figures current as of date of compilation.*
