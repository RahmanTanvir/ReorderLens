# DEMANDIQ / ReorderLens AI — Master Context and Conversation Handover

> **Handover assembled:** 26 October 2026 (Asia/Dhaka)  
> **Competition:** International AI Builders Congress 2026  
> **Competition track:** Idea to Unicorn / Team-Built Product Competition  
> **Official domain:** CommerceSphere AI  
> **Official challenge:** **DemandIQ**  
> **Chosen product name in submission drafts:** **ReorderLens AI**  
> **Team selected in the portal screenshot:** **The White Hole**  
> **Primary deployment decision:** **Vercel**; editor shown selected: **VS Code**  
> **Project phase:** Challenge selected and competition application being prepared; implementation not established  
> **Companion artifact:** [DEMANDIQ_SUBMISSION_DRAFTS.md](DEMANDIQ_SUBMISSION_DRAFTS.md) — the actual draft field responses and UI selections captured in this conversation.

## Navigation / Table of Contents

1. [Document Purpose and Handover Instructions](#1-document-purpose-and-handover-instructions)
2. [Executive Summary](#2-executive-summary)
3. [Confirmed Competition Information](#3-confirmed-competition-information)
4. [Official Competition Rules and Requirements](#4-official-competition-rules-and-requirements)
5. [Official Judging Criteria and Scoring Framework](#5-official-judging-criteria-and-scoring-framework)
6. [Selected Domain and DEMANDIQ Challenge](#6-selected-domain-and-demandiq-challenge)
7. [Five-Challenge Shortlisting and Selection History](#7-five-challenge-shortlisting-and-selection-history)
8. [DEMANDIQ Problem Statement and Product Concept](#8-demandiq-problem-statement-and-product-concept)
9. [Proposed Features and User Workflows](#9-proposed-features-and-user-workflows)
10. [Innovation and Competitive Differentiation](#10-innovation-and-competitive-differentiation)
11. [Submission Context and Existing Commitments](#11-submission-context-and-existing-commitments)
12. [Technical Ideas and Vibe-Coding Considerations](#12-technical-ideas-and-vibe-coding-considerations)
13. [Competition Strategy and Success Criteria](#13-competition-strategy-and-success-criteria)
14. [Team Capabilities and Working Preferences](#14-team-capabilities-and-working-preferences)
15. [Source and Evidence Register](#15-source-and-evidence-register)
16. [Confirmed Decisions](#16-confirmed-decisions)
17. [Proposed Ideas and Unapproved Decisions](#17-proposed-ideas-and-unapproved-decisions)
18. [Assumptions and Unverified Information](#18-assumptions-and-unverified-information)
19. [Missing Information and Open Questions](#19-missing-information-and-open-questions)
20. [Conflicts, Risks, and Items Requiring Verification](#20-conflicts-risks-and-items-requiring-verification)
21. [Instructions for the Next ChatGPT Conversation](#21-instructions-for-the-next-chatgpt-conversation)

---

## 1. Document Purpose and Handover Instructions

This is a **context transfer**, not an approved implementation plan, a working repository, a specification signed off by the owner, or a statement of completed development. It consolidates the accessible current conversation, the directly inspected uploaded file `AI_Builders_Congress_2026_Master_Instructions.md` (516 lines; version 2.0, prepared 25 October 2026), the challenge/judging/form screenshots visible in this conversation, and a limited **fresh source check on 26 October 2026**. It was prepared so a new ChatGPT conversation can start the planning phase without forgetting decisions, risks, drafts or sources.

**Authority and labeling:**

- **[OFFICIAL-INDEXED]** — information recovered from the search index of an official organizer policy, official university announcement, or an organizer-authored publication on 26 Oct 2026. Directly opening some pages showed a JavaScript “Still loading…” page, so indexed excerpts, not the live authenticated UI, supported the verification.
- **[OWNER-SCREENSHOT]** — text visibly supplied by the user from the competition site/portal. It is strong evidence for what the user's UI displayed, but the underlying dynamic URL and current applicability may still need official confirmation.
- **[OWNER-DECISION]** — the user expressly selected a challenge, tool, style or phase gate; authoritative for preferences and owner decisions, but not proof that implementation is complete.
- **[CONVERSATION-DRAFT]** — wording proposed by the assistant for a field; there is **no reliable confirmation that it was pasted, saved, or finally submitted** unless otherwise noted.
- **[ASSISTANT-ASSESSMENT]** — reasoning, rankings, architecture candidates, business assumptions and engineering advice; never confuse with official conditions.
- **[UNVERIFIED]** — missing current evidence, uncertain assumptions, or conflicts requiring follow-up.

**Use with the companion file:** This master file contains decisions, detailed challenge requirements, selection history, architecture constraints, provenance and evidence. The companion `DEMANDIQ_SUBMISSION_DRAFTS.md` preserves the more exact *field-by-field* drafts and choices; consult that companion before creating new submission or planning artifacts. Both files need to be uploaded to the new chat if exact application wording matters. Where a field was revised, the later or user-edited draft is distinguished from older suggestions.

**Critical ordering:** Do not create code, a PRD, specifications, Antigravity implementation prompts, or a detailed build plan merely because this file is uploaded. The user will provide a separate planning master prompt. First reconcile important missing evidence and produce a complete plan; obtain explicit owner approval **before** generating final implementation docs and Antigravity prompts. Do not reopen challenge selection unless a genuine compliance or feasibility blocker requires the owner's attention.

**Access limits:** The accessible context includes the conversation shown through the current request and the mounted master instruction document. A separately named companion `ChatGPT_Project_Instructions_Paste_Ready.md` is referenced inside the master instruction file but **was not available in this runtime**. No complete exported conversation transcript, final portal submission receipt, actual source repository, user account information, working app, uploaded Participants Guide, or independent implementation/test results were available. Numerous screenshots were directly visible, but not every detail behind the site's clickable modal items was available. No live authenticated portal was opened.

---

## 2. Executive Summary

**Selected competition challenge:** **DemandIQ**, under **CommerceSphere AI**. The organizer's challenge subtitle is *“Demand forecasting and inventory intelligence for SMEs.”* The challenge's specific ask is *“Revenue up, stockouts down,”* with suggested technical direction *“Time-series ML + dashboards + APIs.”* The screenshot also contains ambitious **example prompts** involving GNNs, RAG, satellite imagery, federated learning and reinforcement learning; these are examples, **not confirmed mandatory features**.

**Project brand:** The assistant recommended differentiating the project brand from the official challenge. The user subsequently revised the application's elevator pitch and public summary to use **ReorderLens AI**, not DemandIQ, as the product name. The working brand is therefore ReorderLens AI, while DemandIQ remains the organizer's challenge. The etymology offered in conversation: *Reorder* relates to purchasing/replenishment; *Lens* denotes clear insight into data. No trademark, domain, or uniqueness clearance has been verified. Some later owner requests refer informally to the “DEMANDIQ project”; this means the challenge/project effort and does not undo the ReorderLens AI brand in edited drafts.

**Product thesis:** Make data-driven inventory planning more accessible to small/medium retailers (initially Bangladesh). Convert retailer sales histories into **product-level demand estimates, stockout-risk indicators and explainable replenishment recommendations** using **time-series ML for prediction** and **deterministic calculations for the inventory decision**. The system uses current stock, supplier lead time and business constraints, exposes data uncertainty and leaves purchasing approval with the retailer. Use chronological backtesting against naive/statistical baselines and explicitly labeled scenario simulations to test potential improvements without pretending to show realized sales uplift.

**User's goal:** Maximize a realistic chance of a top ranking/being champion **and** create a real, viable product. Strong alignment with actual judging requirements; focus on a complete demonstrable vertical slice, responsible AI, commercially coherent value, understandable system, professional UX and a convincing presentation. No guarantees or fake metrics. Implementation primarily via **Google Antigravity and AI coding tools**, with the sole planned human developer critically reviewing and being able to explain all functionality. The developer's known specialty is senior Flutter/mobile work, but **Flutter is not a constraint**; prior drafts selected a **Next.js/React/TypeScript + Python/FastAPI** web approach and later a **Vercel deployment target**.

**Current state:** The user is filling out the competition application. Multiple answers have been drafted and screenshots show UI choices. **The conversation does not establish that the form is finally submitted, that code exists, that a trained model or deployment exists, that any evaluation was run, or that any pilot customer was interviewed.** A portal screenshot marks “Tooling & IDE” as “Required — completed,” but its individual fields appear empty except for VS Code; this is a UI validation indicator, not proof of implementation. Other sections showed required fields missing or a score of zero. The user explicitly says implementation happens *later*.

**Urgent external blockers:**

1. DIU publicly describes this track as for **3–5 human members**; owner had intended to be the only human developer. The team name **The White Hole** appears selected in the portal, but member count and eligibility were **not confirmed**. ChatGPT/AI tools do not count as team members.
2. Organizer writing and the submission phase UI indicate **31 October 2026** as the preliminary deadline. As of 26 Oct 2026, it is **five calendar days away**. Actual closing hour, timezone, account status and upload validation remain unverified.
3. The binding judging rubric is uncertain: organizer-authored Congress writing provides **five × 20 points**, but an owner-supplied “Judging Criteria” screenshot provides **six categories (20/20/20/20/10/10)**, identical to a separate **Infinity AI BuildFest** policy. The screenshot may show an applicable updated dashboard; verify event, stage and authority.
4. The user believes submission answers may be final and impossible to edit later. **Mutability is not independently established**; treat all selections as consequential, preserve factual usage disclosures, and obtain actual final submitted field content/export if possible.

---

## 3. Confirmed Competition Information

| Topic | Available information | Status/source |
|---|---|---|
| Name | International AI Builders Congress 2026 | [OFFICIAL-INDEXED], [C1,C2] |
| Official entry URL | https://cloudcampbd.com/ai-builders-congress | [OFFICIAL-INDEXED], direct page's JS contents not retrieved [C1] |
| Organizer/co-organizer | CloudCamp Bangladesh; Daffodil International University | [OFFICIAL-INDEXED] [C2] |
| Vision | Bangladesh as a source of internationally competitive AI builders and owned AI products, rather than only outsourcing/service work; real-world impact, jobs and entrepreneurship | Organizer-authored explanation [C3], DIU [C2] |
| Event date/site | **Saturday, 26 December 2026** at Daffodil International University, Ashulia/Birulia/Savar, Dhaka; DIU gives approx. 7:00 AM–7:30 PM | [OFFICIAL-INDEXED] [C2]. Partner event listings have differing hours; use current organizer schedule |
| Broader program | July–Dec 2026 six-month builder journey, product-building, mentoring and global showcase | [OFFICIAL-INDEXED] [C2,C3] |
| Tracks | Team-Built Product / **Idea to Unicorn**; individual one-hour live build / **Zero to Launch** or Single Prompt Challenge | DIU and organizer [C2,C3]. Do not silently change tracks |
| Selected track | Idea to Unicorn — Preliminary Submission | [OWNER-DECISION] and portal screenshot [U-FORM-01] |
| Team | **The White Hole** shown as selected team | [OWNER-SCREENSHOT] [U-FORM-01]; human members unknown |
| Team size rule | DIU's 7 Oct announcement: team competition, **3–5 members** | [OFFICIAL-INDEXED] [C2]; eligibility for an owner doing solo development unresolved |
| Domains/challenges | **11 domains × 5 = 55 challenge tracks**; possibility to define own problem in domain per organizer article | [OWNER-SCREENSHOT] [U-DOMAINS]; [C2,C3] |
| Registration fee | Registration publicly described as free | [C2,C3]; actual user's account/approval not confirmed |
| Mentor/network opportunity | DIU announces mentoring, NRB involvement, Opportunity Connect with recruiters/investors/advisors | [C2]; no allocation/mentor for our project confirmed |
| Prizes | DIU announces roughly **BDT 1 million aggregate**; older organizer prize policy v1.1 refers to BDT 50k winner, 30k runner-up, 10k selected prompt winners, subject to confirmation | [C2,C7]; **allocation conflict**, no dependable DEMANDIQ-specific prize figure |
| Examples from prior events | Infinity AI BuildFest 2026 (different competition): reported EdTech winner **CyLnk Learn**, Team The Tokenizers; HealthTech winner **ARBOR**, Team DuoGuard | [C10]. No verified prior winner of *this first Congress* |
| Named partners in DIU article | Anwar Group (Platinum), Robust (Silver), Synborn (Creative), AWS, Lovable, Career Canvas, Astronus Tech (technology partners) | [C2]. Do not infer free credits or exclusive access |

### 3.1 Domains visible in the owner's competition screenshots

FoodSphere AI, HealthSphere AI, FinSphere AI, LearnSphere AI, ClimateSphere AI, CivicSphere AI, AgriSphere AI, IndustrySphere AI, CommerceSphere AI, JusticeSphere AI, InfraSphere AI. Each displays **five** challenge cards. All 55 titles were reviewed in the earlier discussion (see §7). Older third-party listings showing ten domains and fifty challenges were superseded by the newer 11/55 organizer material and user screenshots.

### 3.2 Source-access note

On 26 Oct 2026, direct attempts to open the official main event page and multiple CloudCamp policy URLs returned an HTML *“Still loading… The app is taking longer than expected”* shell through the web retrieval tool. Indexed copies of policy pages were nevertheless available and identified by URL and v1.1. These are useful corroboration, but **cannot establish what a signed-in user currently sees in the live portal**. User-supplied screenshots are the best evidence of the account-facing form layout, not necessarily of organizer legal authority.

---

## 4. Official Competition Rules and Requirements

### 4.1 Preliminary submission package — organizer policy v1.1

[Submission Rules — International AI Builders Congress](https://cloudcampbd.com/events/ai-builders-congress/policies/submission) [C4], indexed content recovered 26 Oct:

- Preliminary requires a **one-page structured project summary** and a **three-minute concept or prototype demo video**.
- Video subjects: problem and target users; AI-driven solution; **demonstration/prototype/mock flow/system walkthrough**; AI approach (models, tools, retrieval/RAG, data/workflow as applicable); impact/KPIs and next steps.
- Every submission should cover a clear problem, AI-native approach, basic system flow, initial demo/prototype/workflow, **Bangla or other appropriate localization**, and potential impact/measurable outcomes.
- **Real system thinking** required; visual appeal or idea alone insufficient. Original work by registered team. No plagiarism, fabricated results, fake demos, unauthorized content, or misleading representation.
- Disclose AI tools, sources, external/mentor/NRB contributions. Late or incomplete submissions can be rejected. Preliminary screening shortlists teams for physical Congress. Organizers may ask for evidence or clarification.
- The policy does **not** specify in accessible text: PDF/file extensions, video platform format, uploaded file size, precise deadline hour/timezone, judging Q&A duration, mandatory live deployment at preliminary, or exactly how the new portal's many additional AI-depth fields affect qualification.

**Important form-versus-policy difference:** User screenshots show extensive wizard sections beyond the simple one-page/video policy (Story, Proof, AI-Native Build, Data Lifecycle, Prompt Library, Team; technical provenance; YouTube video; demo/live links; required Tooling & IDE). Those are **live portal requests at the time screens were captured**, but some may be scoring enrichment rather than separate universal requirements; screenshot provides no complete policy mapping. Do not treat a checkbox's points as official judging weights.

### 4.2 Deadline and phases

| Milestone | Date/status | Confidence |
|---|---|---|
| Builder journey begins | 1 July 2026 (organizer-publicly described) | High for announcement |
| Team preliminary closes | **31 October 2026**; both organizer article and user phase screenshot show this date | High that published; **cutoff hour, timezone, actual submission status not verified** [C3, U-FORM-01] |
| Preliminary shortlisting | After preliminary submission; timing not recovered | Unknown |
| Final physical Congress | **26 December 2026** | High [C2] |
| Final product code freeze, stage-specific pitch time, judge Q&A | Not recovered | Unknown |

One earlier assistant repeatedly used **25 October 2026** as the current date; the **handover date is 26 October 2026**. Future relative dates should be resolved to Asia/Dhaka.

### 4.3 Participation, originality, ownership and lawful conduct

[Terms and Conditions v1.1](https://cloudcampbd.com/events/ai-builders-congress/policies/terms) [C5] (indexed):

- Registration, team, institution, project and contact information must be accurate.
- Submissions must be original, lawful, ethical and documented.
- Participants **retain project intellectual property**.
- Organizers receive a **nonexclusive, royalty-free, worldwide license** for reviewing submissions, showing demos, publishing summaries, and event media; ownership is not transferred.
- Open-source publication is **optional** unless separately agreed.
- Event media/participant names may be publicly shown. Public-facing summary should therefore avoid confidential materials.
- Rules can change, and violations may lead to rejection or disqualification.

### 4.4 AI usage and provenance

[AI Usage & Provenance Policy v1.1](https://cloudcampbd.com/events/ai-builders-congress/policies/ai-usage) [C6] (indexed):

- LLMs, coding assistants, generative tools, agents, RAG and other AI-assisted development are **allowed and encouraged**.
- Teams should explain **how and where AI was used**, document prompts, models, workflows, automation, datasets and external contributions; AI outputs remain the team's responsibility to verify.
- Do not claim fake model benchmarks, real users, product deployment, simulated financial results or demonstrations as achieved if not verified.
- Use legally sourced data; avoid unauthorized proprietary, confidential or sensitive third-party material. Anonymize and handle necessary personal/financial/health information responsibly.
- Address privacy, fairness, bias, transparency, explainability and safety; follow heightened caution in regulated/high-stakes domains.
- NRB/mentor/adviser/third-party contributions must be disclosed.
- Misrepresentation can reduce marks or lead to disqualification.

The project must not fabricate human teammates. AI coding tools do **not** satisfy human team-size registration requirements.

### 4.5 Award rules, event day, demo/Q&A

[Prize Rules v1.1](https://cloudcampbd.com/events/ai-builders-congress/policies/prize) [C7] contain provisional categories and amounts, verification requirements, finality of judges' decisions, and organizer discretion. The cash prize list does not clearly reconcile with DIU's “~BDT 1 million” announcement. No definite per-domain award or number of finalists was recovered.

DIU indicates **in-person expert judging** at final event [C2]. An organizer explainer says projects are rubric-evaluated. The exact Congress-specific final Q&A length, pitch length and technical proof expectations remain **unverified**. A three-minute preliminary video is verified; no assumption that the final pitch is also precisely three minutes.

**Presentation outline discussed previously (recommended, not an organizer-mandated minute-by-minute format):** 0:00–0:30 user/problem; 0:30–1:00 solution/differentiation; 1:00–2:00 demonstrable flow; 2:00–2:30 AI/data approach; 2:30–3:00 impact, limitations and next steps. Label mocks/simulation clearly.

---

## 5. Official Judging Criteria and Scoring Framework

**Material conflict that must be retained, not silently resolved.**

### 5.1 Congress-specific organizer-authored 5 × 20 rubric

The 9 Sep 2026 CloudCamp article [C3] says 100 points across **five components, 20 each**:

| Criterion reported specifically for Congress | Points |
|---|---:|
| Innovation and AI-Native Design | 20 |
| Technical Excellence and Architecture | 20 |
| Business Value and Commercial Viability | 20 |
| Global Scalability and Real-World Impact | 20 |
| Responsible AI, Data Sovereignty and Presentation | 20 |
| **Total** | **100** |

The 17 Sep organizer article [C8] independently mentions five equally weighted twenty-point components. DIU's 7 Oct article [C2] names **five** dimensions in simpler language: innovation, technical proficiency, business potential, global scalability, responsible AI. **The exact final rubric on the user's logged-in event dashboard remains unconfirmed.** Do not treat a combined category as if internal subweights are known.

### 5.2 Owner-supplied six-category *Judging Criteria* screenshots

The user supplied three clearly readable screenshots showing a carousel headed *“JUDGING CRITERIA”*, six categories and score bands. The same 20/20/20/20/10/10 breakdown appears in the official **Infinity AI BuildFest 2026** judging policy [C9] (another event). Without the URL/context of the screenshots, its applicability to this Congress or its phase is **unresolved**. Preserve details, but label **[OWNER-SCREENSHOT; Congress applicability UNVERIFIED]**.

| Category | Pts | Description visible in screenshot (faithful summary) | Score bands shown |
|---|---:|---|---|
| **Innovation** | 20 | Originality, creativity, non-obvious AI use; meaningful differentiation; transformative, bold or systems-level approach, rather than incremental work | 0–5 common/incremental; 6–10 moderate novelty; 11–15 strong originality and creative AI integration; 16–20 breakthrough or globally competitive |
| **Technical Execution** | 20 | Architecture, model selection and AI integration depth (LLM/ML/RAG/multimodal as suitable), clear input→processing→output, reliability, explainability | 0–5 basic prototype; 6–10 functional/moderate; 11–15 well-structured AI-native; 16–20 production-grade maturity |
| **Business Model (+ Global Readiness)** | 20 | Value proposition, monetization/sustainability, adoption pathway, cross-border applicability, market evidence | 0–5 no model; 6–10 basic logic/limited validation; 11–15 viable defined users/path; 16–20 globally adaptable scalable model |
| **Real-World Impact (+ Ethical AI Compliance)** | 20 | Significance, measurable KPIs, social/economic relevance, responsible data, bias mitigation and transparency | 0–5 unclear impact; 6–10 local benefit; 11–15 strong national measurable relevance; 16–20 high social return with ethical safeguards |
| **Scalability (+ NRB Collaboration)** | 10 | Cloud readiness, modularity, infrastructure viability, NRB/global collaboration, international standards | 0–3 demo-only; 4–7 early scaling plan; 8–10 deployment pathway and strong collaboration readiness |
| **Presentation** | 10 | Clarity, structure, confidence, demo effectiveness, explanation of AI reasoning and professional delivery | 0–3 unclear; 4–7 clear/moderate; 8–10 compelling, data-driven investor-ready |
| **Total** | **100** | | |

**Responsible interpretation:** Core engineering, real value and business case are critical across both versions. RAG, GNNs, multi-agent or on-device LLMs are **not universally mandated** by either verified Congress policy or these screenshot criteria merely because they are examples. Explain and prove the intelligence truly necessary for the user task. Do not invent confidence or accuracy thresholds.

### 5.3 Distinguish portal “AI Depth Score” from the judging rubric

Screenshots show a separate portal scoring UI with **AI Depth Score 0/110**, and field-level points for prompts, models, RAG, MCP, token optimization, orchestration, fine-tuning, on-device LLMs, visualization, data lifecycle and tooling. Other navigation badges include **Story 0/30**, **Proof 0/25**, **AI-Native Build 0/110**, **Data Lifecycle 0/25**, **Prompt Library**, **Team** (numbers depended on snapshot). This is **not verified to be the final judges' weighted 100-point rubric**. It may be a completeness/technical-depth scoring mechanism. The user was advised repeatedly **not to claim tools as used merely to gain UI points**. Exact interaction with finalist selection and whether proposals count toward usage badges is unknown.

### 5.4 Previous selection scorecards were INTERNAL, not judge grades

- Original 55-challenge shortlist exercise used an **internal 100-point opportunity rubric**: problem/reachable users 15; innovation/AI necessity 20; solo-build feasibility 20; technical depth/testability 15; business 10; competition/demo 10; responsible data and operations 10.
- A later detailed-five reranking evaluated **competitive potential** using six screenshot categories (100), then used a **20% delivery-readiness** adjustment: `Decision Score = 0.8 × projected competition-category potential + 0.2 × delivery-readiness`.
- No percentage is a winning probability. The owner accepted the strategic recommendation and selected DemandIQ; selection is closed unless a real blocker emerges.

---

## 6. Selected Domain and DEMANDIQ Challenge

### 6.1 Organizer screenshot text (challenge modal)

**Domain:** CommerceSphere AI  
**Domain tagline visible earlier:** “AI-native commerce intelligence — growth, personalization, demand, and creator economy.”  
**Challenge:** **DemandIQ**  
**Subtitle:** “Demand forecasting and inventory intelligence for SMEs”  
**SPECIFIC ASK:** **“Revenue up, stockouts down”**  
**DETAILS:** **“Time-series ML + dashboards + APIs”**  
**Source:** User-supplied modal screenshots [U-DEMANDIQ].

This is the most important **challenge-specific** wording. The screenshot does **not** establish a mandatory minimum percentage of revenue lift, forecast accuracy or stockout reduction. It does not explicitly require a GNN, RAG, satellite data, federated learning or RL. Any additional expanded policy beyond the screenshot remains unavailable.

### 6.2 Organizer-supplied illustrative example prompts (not requirements)

The full visible DemandIQ modal lists these five *examples*:

1. Train a **graph neural network** to model supply-chain dependencies and estimate the stock effects of a localized strike.
2. Create a **RAG procurement analyst** for natural-language questions about SKU velocity and risk.
3. Use **vision-language models** with port/satellite imagery as replenishment leading indicators.
4. Apply **federated learning** among retailers without sharing sensitive customer data.
5. Use **reinforcement learning** for multi-echelon inventory optimization balancing carbon and target service levels (98% appears **only in this example**, not as a universal project target).

These are high-ambition exploratory directions. Earlier evaluation **rejected them as unjustified MVP dependencies** without suitable data, budget, partners or evaluation. They are **not approved project features**.

### 6.3 Challenge modal — listed sources and comparable products

The *Data Sources* suggestions shown in the modal (availability/license/fees not implied):

- **Kaggle Store Item Demand** — historical item-store sales baseline (licensing may be subject to competition rules).
- **UN Comtrade Database** — global trade flow statistics.
- **MarineTraffic API** — ship/vessel location and possible logistics-delay context; access/pricing unverified.
- **GDELT Project** — event/news information for detecting external shocks.
- **OpenWeatherMap History API** — historical/weather forecasts; quota/pricing unverified.

The modal names examples/comparables: **Antuit.ai**, **SourceDay**, **Blue Yonder**, **Pachama** (satellite/carbon adjacent), and **Stord**. These are organizer-provided references, **not established partners** and not proof of a market gap. Other researched comparables included **Netstock**, whose replenishment and demand-planning workflows overlap heavily with the proposed product.

### 6.4 Intended outcome versus measured result

The organizer's specific ask emphasizes **higher revenue and fewer stockouts**. Product claims should articulate that outcome as a goal, not an achieved result. Available benchmark **sales** data does not reveal all unmet demand during stockouts; many lost sales are unobserved. Revenue/stockout changes may initially be **simulated**, using documented baselines/assumptions. Actual financial outcome requires authorized retailer inventory and demand observations or a real pilot. No actual uplift, model accuracy, stockout reduction or deployment has yet been demonstrated.

---

## 7. Five-Challenge Shortlisting and Selection History

### 7.1 Broad list reviewed in earlier conversation

The user provided screenshots for all **11 × 5 = 55** cards. The earlier screening reviewed these titles (this records breadth; their expanded modals were **not** supplied for the other 50):

| Domain | All five visible challenge titles |
|---|---|
| FoodSphere AI | Future Foods; Smart Food Chain; **Food Waste Zero**; Nutrition Intelligence; Food Safety Sentinel |
| HealthSphere AI | CareAnywhere; PredictRx; PersonalMD; SmartHospital; ChronicCare AI |
| FinSphere AI | CreditForAll; FraudShield; WealthPilot; SME Capital Engine; Borderless Money |
| LearnSphere AI | AI Teacher; Career Navigator; **SkillBridge**; Workforce Ready; Global Talent Marketplace |
| ClimateSphere AI | CarbonIQ; Climate Shield; AquaGuard; Energy Brain; Circular Future |
| CivicSphere AI | Citizen First; GovCopilot; TrustID; Smart Nation; Transparent Government |
| AgriSphere AI | Precision Farm; Crop Guardian; FarmMarket; YieldMax; Climate Smart Farming |
| IndustrySphere AI | Factory Brain; Predictive Plant; **Quality Vision**; Supply Chain Nexus; Green Manufacturing |
| CommerceSphere AI | GrowthPilot; HyperPersonal; Customer Genome; **DemandIQ**; Creator Commerce |
| JusticeSphere AI | **ContractMind**; ComplianceOS; Legal Copilot; GovernanceIQ; Risk Sentinel |
| InfraSphere AI | SecureAI; WorkforceOS; Knowledge Grid; AgentOps; Human+AI |

Initial filtering considered data legality and access, feasibility with one developer/vibe coding, meaningful AI vs deterministic baseline, demonstrable performance, regulatory/hardware/third-party dependencies, commercialization and judge-friendly clarity. Caution around health/fintech/regulated domains, integration-heavy factories and marketplaces, and generic RAG/chatbot clones. **Not evidence that all 55 expanded modal specifications were verified.**

### 7.2 Five finalist challenges — full available expanded details and consequences

The user later supplied detailed modal screenshots for exactly these **five**, containing Specific Ask, Details, Example Prompts, Data Sources, Examples (some modal text cropped at the screen edges). Below is the strongest faithful consolidation, with explicit/illustrative separated.

#### A. DemandIQ — CommerceSphere AI (SELECTED)

- **Specific ask:** “Revenue up, stockouts down.”
- **Details:** “Time-series ML + dashboards + APIs.”
- Five example prompts and five suggested sources as documented in §6.
- Intended user: SMEs/retailers; outcome inventory planning and stockout prevention.
- Feasibility strength: core forecast → reorder decision measurable with standard ML/baselines and conventional APIs; no specialized hardware.
- Strategic weakness: forecasting/replenishment is established; credible differentiation and proof of actual operational benefit still needed.

#### B. SkillBridge — LearnSphere AI

- **Subtitle:** “Reskilling pathways bridging education to industry demand.”
- **Specific ask:** **“Demonstrated job-readiness uplift.”**
- **Details:** **“Competency modeling + content generation.”**
- **Illustrative prompts:** RAG career coaching with real-time labor market; vector “skill distance”; assembling tailored curricula from courses/video; multi-agent recruiter and career mentor mock interviews; five-year regional skill-demand shifts.
- **Suggested sources:** O*NET Online API; Adzuna Search API; GitHub Archive; Coursera Partner API; Lightcast Open Skills.
- **Named examples:** Guild Education, Eightfold AI, SkyHive, Degreed, Pymetrics.
- **Strongest discussed feasible approach:** evidence-aware skill assessment based on O*NET/ESCO taxonomy; baseline assessment → mapping/gap → personalized learning → **comparable post-assessment**. Structured evidence; not merely CV keyword matching. No claim improved hiring chances without trials.
- **Strength:** very accessible software stack, no hardware; human-comprehensible, polished interactive demo.
- **Core risk:** needs actual **uplift**, not just course suggestions; assessment equivalence, fairness, labor-market data and mature competitor features.

#### C. Quality Vision — IndustrySphere AI

- **Subtitle:** “Automated visual quality inspection.”
- **Specific ask:** **“Defect reduction and yield.”**
- **Details:** **“Vision models + edge deployment.”**
- **Illustrative prompts:** few-shot structural cracks; vision transformer for fast pharmaceutical packaging; GAN synthetic defect generation; federated cross-factory learning; explainable anomaly heatmap.
- **Suggested sources:** Kaggle NEU surface defects; MVTec AD; UCI SECOM; NASA Prognostics Data Repository; Azure Factory IoT data.
- **Named examples:** Cognex, Instrumental, Landing AI, Sight Machine, Nanotronics.
- **Strongest discussed feasible approach:** pretrained visual anomaly detector, highlighted defect regions, human verification and held-out evaluation; actual edge inference with compatible runtime rather than a disguised cloud classifier.
- **Strength:** compelling visual proof and standard anomaly metrics.
- **Risks:** real edge memory/latency/model compatibility; benchmark-to-factory distribution shift; anomaly heatmap is not proof of root cause or improved manufacturing yield. MVTec AD dataset cited in prior research as noncommercial license; **VisA** was discussed as a potentially more commercially suitable alternative but is not one of this modal's sources. Verify model/data licenses.

#### D. ContractMind — JusticeSphere AI

- **Subtitle:** “Contract intelligence and automation.”
- **SPECIFIC ASK (key mandatory-like text in supplied screenshot):** **“Deliver a functional AI-native prototype that can ingest a raw contract PDF, perform automated risk scoring based on custom playbooks, and output a structured JSON of obligations alongside a redlined version of the document.”**
- **DETAILS (faithful summary):** Goes beyond OCR; describes AI-native legal document lifecycle, complex redlining/risk discovery/obligation extraction, **multi-agent and RAG architectures**, LLM semantic reasoning, vision understanding of complex document formatting. Wording says teams *should leverage* multi-agent/RAG and expected solution uses LLMs/vision; exact binding status of these technologies requires clarification.
- **Illustrative prompts:** competing legal agents for indemnity review; RAG against standard MSA clauses; visually parse hierarchical tables for payment milestones; automatic redlining (example mentions chain-of-thought prompting); search thousands of contracts for liability caps.
- **Suggested sources:** SEC EDGAR; CUAD v1; MAUD; Open Legal Data; legal subset of Common Crawl.
- **Named examples:** Ironclad, Luminance, Spellbook, Kira Systems, Lawgeex.
- **Strongest discussed feasible approach:** limited playbook-based clause extraction, evidence-linked risk scoring, obligations JSON, proposed redlines reviewed by a person.
- **Strength:** CUAD's **510 contracts, >13,000 annotations, 41 clause types** can support clause-extraction evaluation.
- **Reasons downgraded:** the **entire four-output pipeline** must work; PDF redlining is structurally difficult; CUAD does **not** establish correct playbook risk scores, obligation JSON or legal edits; confidentiality, jurisdiction, specialist legal review, competitors.

#### E. Food Waste Zero — FoodSphere AI

- **Subtitle:** “Demand-aligned inventory to cut spoilage and waste.”
- **SPECIFIC ASK (important explicit outcome):** **“Provide a working prototype of an AI-driven inventory engine that reduces simulated food waste by at least 30% through demand-aligned ordering and automated dynamic discounting. The deliverable must include a technical architecture diagram showcasing the integration of predictive agents and real-time data ingestion.”**
- **DETAILS (faithful summary):** Calls for AI-native predictive demand, **vision-based shelf monitoring**, **autonomous agent dynamic pricing**, multimodal LLMs for waste patterns, and RAG-enhanced workflows joining market trends and logistical constraints. Which of these broader “should” expectations are strict gates is unresolved; **30% simulated reduction and architecture diagram** are explicitly in the Specific Ask.
- **Illustrative prompts:** forecast agent + pricing agent; vision ripeness-triggered restocking/markdown; restaurant review sentiment RAG for purchase quantities; SLM parsing inventory logs/supplier invoices; inventory redistribution routes.
- **Suggested sources:** USDA FoodKeeper; Open Food Facts; NOAA Weather API; Kaggle Grocery Sales; FAOSTAT.
- **Named examples:** Afresh, Wasteless, Choco, Winnow, Too Good To Go.
- **Strongest discussed feasible approach:** forecast plus expiry-aware inventory + pricing policy + event ingestion + documented simulator (possibly limited visual flow) rather than unsupported claim of field impact.
- **Reasons downgraded:** 30% simulated target, multiple independent AI components, real-time/state/pricing integration, absent joined perishable sales/expiry/waste ground truth, risk of cherry-picked simulations.

### 7.3 Scoring history (preserve, but do not treat as official)

**Round 1 — short-description shortlist, earlier provisional scores:**

| Rank | Challenge | Internal opportunity score (100) |
|---:|---|---:|
| 1 | DemandIQ | 83 |
| 2 | SkillBridge | 80 |
| 3 | Quality Vision | 78 |
| 4 | ContractMind | 77 |
| 5 | Food Waste Zero | 76 |

**Round 2 — after full five modal details, 80/20 decision score:**

| Final advisory rank | Challenge | Projected judging potential/100 (six-category draft) | Delivery readiness/100 | Weighted internal score |
|---:|---|---:|---:|---:|
| **1** | **DemandIQ** | 77 | 85 | **79** (78.6 rounded) |
| 2 | SkillBridge | 73 | 88 | 76 |
| 3 | Quality Vision | 78 | 60 | 74 (74.4) |
| 4 | Food Waste Zero | 71 | 48 | 66 (66.4) |
| 5 | ContractMind | 68 | 48 | 64 |

Projected dimension scores for the second round (columns I/T/B/R/S/P; max 20/20/20/20/10/10): DemandIQ **14/16/16/14/8/9 = 77**; SkillBridge **15/14/14/13/8/9 = 73**; Quality Vision **17/16/15/13/7/10 = 78**; Food Waste Zero **14/11/15/15/7/9 = 71**; ContractMind **14/12/15/12/7/8 = 68**. These are **assistant judgments**, not independent judge results or empirical probabilities. A statement that forecast accuracy or revenue has improved remains unsupported.

### 7.4 Why the owner selected DemandIQ

After the second comparison, the user explicitly wrote **“We've finalized our decision to proceed with DEMANDIQ as our chosen challenge.”** Reasons accepted in the conversation:

- A measurable central AI task and credible deterministic/non-AI baseline.
- CSV historical-sales datasets and standard ML tools, no hardware requirement.
- Understandable value (avoid stockouts/excess inventory; improve replenishment decisions) with potential retailer buyer.
- Straightforward visible end-to-end demonstration and explainable numeric recommendations.
- A feasible AI-assisted web software build for one developer; fewer non-negotiable specialized subsystems than Food Waste Zero/ContractMind/Quality Vision.
- Room for business-driven differentiation through incomplete-data handling, uncertainty, stockout-risk transparency and localized SME workflow.

**Strongest dissenting evidence (do not lose):** forecast/inventory software already exists; user data and historical sales cannot prove lost demand/revenue; real differentiation and adoption are **not yet validated**; rival Quality Vision had slightly higher *pure* projected technical judging potential (78 vs 77) but far lower delivery-readiness estimate. Selection should not be reopened casually. Critical compliance failure or unavailable feasibility data may trigger an owner-approved reassessment.

---
## 8. DEMANDIQ Problem Statement and Product Concept

### 8.1 User-edited, current draft elevator pitch (exact available text)

> **“ReorderLens AI helps small retailers predict what customers will buy, avoid running out of popular products, and make smarter restocking decisions using AI, with clear explanations behind every recommendation.”**

**Status:** [OWNER-EDITED CONVERSATION-DRAFT], not confirmed saved/submitted. The assistant initially wrote an elevator pitch calling the product DemandIQ; the user edited it to **ReorderLens AI**. Use the user-edited version as the current working wording, not the overwritten draft. See companion [Submission Drafts](DEMANDIQ_SUBMISSION_DRAFTS.md#s1-project-information-and-story).

### 8.2 Problem (owner-directed submission narrative)

- **Specific users:** Small and medium-sized retailers, initially in Bangladesh. Business owners/operators and staff who handle purchasing/replenishment and may lack data analysts or sophisticated inventory systems.
- **Decision moment:** What product should I reorder, how much, and when? How much stock is likely sufficient through a supplier's lead time?
- **Pain:** When popular products run out, potential purchases go unfulfilled; excess stock ties up cash; manually interpreting inconsistent spreadsheets/transaction exports is difficult; demand shifts and suppliers have variable delivery time.
- **Existing substitute:** Intuition, experience, basic spreadsheets or fragmentary inventory reports; commercial inventory tools can be complex/expensive for some smaller firms **(a hypothesis about target segment until validated)**.
- **Distinctive problem framing:** Not “retailers lack data,” but they lack a practical, understandable process **from imperfect sales data to an inventory decision**.
- **Causal/data limitation:** Observed sales may be censored by stockouts; cannot equate a historic zero sale with zero latent demand. No guaranteed increase to revenue or reduction in stockouts without implementation and field testing.

### 8.3 Product description

**ReorderLens AI** is the named product concept responding to the official **DemandIQ** challenge. It is framed as a practical AI-assisted inventory decision-support platform rather than a marketing analytics dashboard or autonomous commerce agent.

- Import sales history (initially **CSV**).
- Check format, valid dates/quantities, duplicates/cancellations and missing records.
- Produce per-product demand forecasts using time-series/statistical or ML methods selected after evaluation.
- Combine a forecast with retailer-entered **current stock**, **supplier lead time**, and relevant stock/business constraints.
- Present **potential stockout risk**, recommended reorder quantity/timing, and explanation of the numbers and assumptions.
- Compare model against appropriate baselines using chronological backtests.
- Use clearly labeled **scenario simulations** for potential business outcome comparisons; never pass simulations off as real merchant KPI improvements.
- Keep human approval over purchasing; do not automatically place supplier orders.
- Aim for approachable Bangla/localized communication and broad applicability; no fully implemented language feature or live users established.

### 8.4 User-edited public summary (exact current draft)

> For many small retailers, deciding what to stock and when to reorder is still a matter of guesswork. Ordering too much ties up money in unsold products, while ordering too little means missed sales and disappointed customers. Most small businesses cannot afford sophisticated inventory planning systems or dedicated data analysts.
>
> We want to change that with ReorderLens AI.
>
> ReorderLens AI is an AI-powered inventory planning platform designed to turn everyday sales records into practical purchasing decisions. Retailers will be able to upload their sales data, forecast demand for individual products, identify potential stock shortages, and receive restocking recommendations based on current inventory and supplier lead times.
>
> Our focus goes beyond predicting numbers. ReorderLens AI will explain why a recommendation was made, show uncertainty where predictions are less reliable, and let business owners make the final decision.
>
> We plan to evaluate our forecasting models against traditional methods and test inventory recommendations through transparent simulations.
>
> Starting with small retailers in Bangladesh, our goal is to make reliable, data-driven inventory planning affordable, understandable, and accessible to businesses that need it most.

**Status:** user-edited writing block, not confirmed actual submitted field. Note its modest “we plan” phrasing reflects the snapshot of drafting; subsequent owner instruction asks new **product-definition** fields to use natural confident present tense, while progress/evidence fields must remain factual.

### 8.5 Separate problem and solution text already drafted

There are separate conversation drafts for **Problem Statement** and **Solution Description**, with this content:

- **Problem:** cost of shortages/overstock; retailer guesswork, fragmented records, changing demand/lead times, difficulty converting records to sound purchasing actions; lack of affordable practical decision support, especially for Bangladesh SMEs.
- **Solution:** uploaded sales + current stock/lead times → forecasting → shortage flags → recommended reorder timing/quantity → rationale and uncertainty; owner approves; transparent simulation and baseline evaluation.

Their **verbatim available text** is preserved in the companion; status [CONVERSATION-DRAFT] only. No measurements or working functionality claimed.

### 8.6 Product name and brand status

| Item | Status | Note |
|---|---|---|
| Official challenge title | **DemandIQ** [OFFICIAL via user screenshot] | Not our exclusive product brand |
| Product / application name | **ReorderLens AI** [OWNER-EDITED] | Owner updated elevator pitch and public summary; assistant later used it consistently |
| Team label | **The White Hole** [SCREENSHOT] | Account selection visible; membership/eligibility unknown |
| Meaning | Replenishment choices viewed through a clearer data “lens” [ASSISTANT suggestion] | No formal owner-authored brand story beyond adoption |
| Trademark, domain, marketing identity | [UNVERIFIED] | Previous assistant claimed a preliminary name search; no verifiable source record, **do not assume availability** |
| Official submitted project name field | [UNVERIFIED] | Screen initially showed blank; no saved entry/readback supplied |

---

## 9. Proposed Features and User Workflows

**These are captured concepts from the submission discussions, not an approved detailed PRD.** Categorization below distinguishes relatively stable *product promises* from optional future scope. Do not generate final specification until the next conversation's planning approval gate.

### 9.1 Primary workflow discussed repeatedly

`Retailer → CSV import → validate / normalize → prepare product sales histories → forecast demand → combine stock and lead-time inputs → calculate replenish/stockout risks → explain decision with evidence → retailer reviews`.

Additional evaluation lane: `recorded sales history → chronological training/test split → simple forecast baseline versus candidate ML → genuine metrics → documented scenarios → clearly labeled simulated stockout/holding-cost comparisons`.

### 9.2 Functional scope and origin

| Capability | Status/strength of commitment | Reason and constraints |
|---|---|---|
| Simple responsive **web application**, dashboard | **CORE PRODUCT DIRECTION**; many form drafts; not coded | Makes output accessible to small retailers |
| User-provided historical sales **CSV upload** | **CORE PRODUCT DIRECTION** | No real-time POS integration required. Bulk Upload checkbox recommended, not proof chosen |
| Validation, cleaning, cancellation/returns awareness, data-quality flags | **CORE DESIGN DIRECTION** | No blind feeding invalid data into ML; be careful with cancelled invoices and missing periods |
| Product-level historical sales trends | **CORE DESIGN DIRECTION** | Illustrate data and preparation |
| Per-product forecast (time-series ML, fit model to data) | **CORE CHALLENGE CAPABILITY** | Final model not selected; compare with baseline |
| Input current inventory quantities and supplier lead times | **CORE DESIGN DIRECTION** | Retailer-supplied; not present in typical public sales-only datasets |
| Stockout risk / inventory coverage information | **CORE DESIGN DIRECTION** | Risk estimates not guaranteed probability without calibration |
| Explainable reorder timing/quantity suggestions | **CORE DESIGN DIRECTION** | Numeric logic deterministic; retailer remains responsible |
| In-app product alerts / important-items panel | **PROPOSED CORE UX** | Screenshots draft, not push/email integration |
| Uncertainty / insufficient history warnings, fallback | **CORE RESPONSIBLE AI PRINCIPLE** | Do not show fake confidence bands; implement and test method before claiming |
| Forecast baseline comparison, chronological backtesting, WAPE/MASE where applicable | **CORE EVALUATION COMMITMENT** | Not executed; choose metrics suitable for intermittent/low counts |
| Transparent inventory scenario simulation | **STRONG PROPOSED EVIDENCE FEATURE** | Can quantify hypothetical outcomes, **not real savings** |
| Bangla/localization consideration | **OFFICIAL SUBMISSION TOPIC** and proposed enhancement | Accessible text; full bilingual build not yet approved |
| Authorized retailer account separation, file validation, logging, deletion | **SAFETY/PRIVACY DESIGN COMMITMENTS** from drafts | Not yet implemented/tested |
| Public demo and `/docs` route | **PROPOSED DELIVERABLE; owner was recommended “YES”** | Checkbox state **not visible**, check actual commitment; `/docs` must be real and accurate |
| CSV export for forecasts/reorder decisions | **PROPOSED in outbound form draft** | Not proved required by organizer; worthwhile only if practical |
| On-demand refresh when data imported | **PROPOSED** | Avoid claim of continuous ingestion |
| Model training outside synchronous Vercel requests | **ENGINEERING RECOMMENDATION**, not executed | Vercel function limits |
| In-app explanation generated by deterministic template, optional LLM | **OPTIONAL IMPLEMENTATION CHOICE** | Do not claim deployed LLM/RAG |
| Supplier API, payments, automatic purchasing, scheduled PDFs, POS real-time | **NOT APPROVED / DEFERRED** | Integration/permissions/cost risks |
| GNN/RL/federated/satellite/RAG procurement agent | **EXAMPLES ONLY / OUT OF MVP** | Insufficient support that their complexity adds value |

### 9.3 Intended UX surfaces discussed

- Overview dashboard: inventory health and attention list.
- Data upload/validation: import progress, invalid-field feedback, corrections and status.
- Demand/forecast screen: historic actual versus future forecasts, product/date filtering, warnings about data quality/uncertainty, accessible chart/table labels.
- Replenishment decision view: current stock, lead time, estimated demand, assumptions, calculation, retailer review/approval.
- Evaluation/report screen: genuine baseline comparison; simulated business scenarios **explicitly labeled**.
- Public `/docs` concept: overview, AI/data methodology, architecture, dataset licensing, actual tested metrics, limitations, current demo and development status; proposal only.

No complete wireframes, mock screenshots of ReorderLens itself, acceptance criteria, actual navigation, localization copy, color system or approved screen inventory exist.

---

## 10. Innovation and Competitive Differentiation

**Discussed strategic thesis — not proven uniqueness:** Existing forecasting products already offer replenishment, alerts, seasonality and forecast adjustments. Novelty cannot come from “using AI for inventory” or producing charts. Strongest possible differentiation for the proposed product is:

1. **Sales-to-decision integration:** not just forecasts; show a defendable stocking action and business assumptions.
2. **Incomplete/dirty SME data:** transparent import/quality reporting, low-data fallback, and meaningful warnings. This responds to hypothesized retailer constraints; requires customer discovery.
3. **Explainable and human-controlled:** show actual inputs, stock/lead-time calculations, not mystery LLM numbers; merchant reviews suggested orders.
4. **Uncertainty-aware rather than overconfident:** confidence/limitations justified by evaluation; no fake precisely calibrated service-level promises.
5. **Low-complexity adoption:** CSV rather than demanding integrations; possible Bangla/localized interface. Affordability/pricing have not been validated.
6. **Evidence visible to judges:** forecast error relative to baseline; reproducible simulation with counterfactual inventory policy; show failed cases rather than cherry-picking.

**Known competition:** Challenge modal lists Antuit.ai, SourceDay, Blue Yonder, Pachama and Stord. Assistant also identified Netstock as relevant established replenishment software. There is no measured head-to-head benchmark, validated niche, real customer interviews, pricing survey, or proprietary dataset. Avoid claims of being first, unique globally or disruptive without investigation.

**Why ML rather than simpler methods?** Demand is uncertain and can exhibit trends, calendar effects and product-level differences, so suitable forecasting models might improve decisions; **whether they actually beat moving average/seasonal naive depends on validation**. For inventory arithmetic, deterministic formulas should remain preferred. The case for ML must be supported by test outcomes.

**Business hypotheses:** affordable SaaS or institution/merchant subscription, initially Bangladeshi small retailers, adaptable internationally. No payer interviews, acquisition costs, unit economics, pricing commitments, retention evidence, subscriptions or partnerships established.

---

## 11. Submission Context and Existing Commitments

### 11.1 What was actually visible in the portal screenshots

The form screens (uploaded directly in this conversation) showed:

- Event: International AI Builders Congress; Team: **The White Hole**; Phase: **Idea to Unicorn — Preliminary Submission (Due: Oct 31, 202...)**.
- Story fields: **Project Name**, **Elevator Pitch**, **Public Summary**, later **Problem Statement**, **Solution Description**.
- A portal warning listed missing required fields: **Problem Statement, Solution Description, Data & AI Provenance, Tooling & IDE, YouTube Video, Demo / Live Links**. That was a particular snapshot; not necessarily the live status now.
- Later a **Tooling & IDE** panel displays **“Required — completed”** even though its individual text placeholders appear empty and only the **VS Code** dropdown is visibly selected. Do not infer fields were saved or app deployed.
- AI depth prompts/checkboxes for: prompt design, token optimization, models, RAG, MCP servers, open source, agent orchestration, fine-tuning, quality evaluation, guardrails, visual builders, automation, local LLMs, agent frameworks, AI-DLC, live `/docs`, data lifecycle and provenance.
- **Five LLMs visibly selected in one screenshot:** ChatGPT, Gemini, DeepSeek, Llama, Qwen, UI displayed **+15/15**. This **does not prove they were all used**. ChatGPT usage is evidenced by this chat; individual project-specific Gemini/DeepSeek/Llama/Qwen usage requires owner confirmation.
- **Three frontend-builder checkboxes visibly selected in one screenshot:** **v0 (Vercel), Gemini Canvas, ChatGPT Canvas**. Do not confuse selected boxes with actual use. No AI-generated UI percent measured. **ChatGPT Canvas** was a name on the portal selection; no proof that the deprecated feature was used.
- A Prompt Library screenshot displayed **“1 prompts”** with an untitled/empty prompt form; the assistant subsequently drafted two **real earlier user-prompt excerpts** and output summaries. No proof either entry was saved.
- Developer editor dropdown eventually **VS Code** selected.
- User explicitly said **“we're going with to deploy it with vercel”**. Vercel is an **approved hosting target**, not a completed deployment.
- Two `/docs` UI states: screenshot showed “Yes — we will run the /docs module prompt and ship a live documentation page” unchecked; assistant recommended selecting YES. **No screenshot confirms the user checked it.** It should be treated as a recommended prospective commitment, not a verified checkbox value.

### 11.2 Owner's writing and truthfulness directives

**Approved preferences:** Application responses must sound like an authentic serious student-led project: clear, natural, professional, specific, human-sayable, not buzzwordy, not inflated marketing copy; no fake milestones. Core **product-definition questions** can use confident present tense (“ReorderLens AI uses…” describes its design) rather than repetitive “we plan to”; **past-tense evidence questions** (“tools used”, “how did you measure”, “models actually run”, “percentage AI built”) must say what has actually been done. Every new answer should be checked against prior ones and judged as a potential irrevocable commitment. Don't promise model types, integrations or exact performance that cannot be implemented. Fill genuinely required fields meaningfully, but do not falsify optional technology usage merely to increase portal depth points.

### 11.3 Status key for all form content

| State | Proof at hand |
|---|---|
| **Drafted in assistant writing blocks** | Yes, many (exact texts in companion). |
| **User-edited core elevator/public summary** | Yes, conversation exposes edited text (see §8 and companion). |
| **Visible portal selection** | Team The White Hole, phase, selected LLMs/builders and VS Code in individual snapshots. |
| **Persisted form text / final submitted record** | **No proof.** Screenshots often show blank placeholders. |
| **Actual repository, tests, trained model, Vercel deployment, `/docs` live page, demo/video link** | **No proof.** |
| **Current AI tool usage** | ChatGPT planning/competition research confirmed by conversation. Four other LLMs and builders individually unverified. |

### 11.4 Submission areas discussed and key commitments/proposals

For exact field-by-field wording, see [DEMANDIQ_SUBMISSION_DRAFTS.md](DEMANDIQ_SUBMISSION_DRAFTS.md). A condensed field register:

| Area | Entered/drafted content | Status and restrictions |
|---|---|---|
| Project title | **ReorderLens AI** rather than challenge label DemandIQ | Owner edited product branding; actual project-name input not verified |
| Elevator/Public Summary | Intuitive SME forecasting and explainable reorder advice; Bangladesh-first, no false KPI | User-edited text captured |
| Problem/Solution | Guesswork, stockouts, tied-up cash; CSV data to forecast to human-reviewed reorder decision | Draft only |
| Prompt Usage | ChatGPT-supported research, iteratively narrowed tasks, review of assumptions; future structured prompts | Confirmed planning use, not implementation prompt registry |
| Token Optimization | Time-series models/deterministic numbers instead of LLM calls; compact explanations and possible caching/batching/smaller models | Strategies largely future; no actual optimization benchmarks |
| LLM models | Five selected visually; narrative mostly cites ChatGPT and optional explanation models | Conflicting/unverified claims for the other four |
| Retrieval/RAG | Leave unchecked; core data structured, RAG not needed | No RAG built |
| MCP / servers, endpoints, transport | Leave unchecked/not applicable; REST API planned | No MCP use demonstrated |
| Open source | Python, Pandas, scikit-learn, LightGBM candidate, Pydantic/FastAPI, PostgreSQL, Next.js, Recharts | Proposed stack, not used in code yet |
| Agent frameworks | Controlled application pipeline rather than LangGraph/CrewAI agents | No multi-agent framework used |
| Fine-tuning | Not applicable; forecasting model fitting ≠ LLM LoRA fine-tune | None claimed |
| Evaluation | Chronological splits, baseline comparisons, WAPE/MASE where appropriate, controlled inventory simulations | Method defined; no results |
| Guardrails | Minimize PII, validate files/schemas, restrict business access, grounded explanations, human approval; no arbitrary LLM actions | Design commitments; not audited |
| Frontend AI builders | v0, Gemini Canvas, ChatGPT Canvas visibly checked in one screenshot; narrative explains their **potential roles**, no measured % | Usage confirmation needed |
| Workflow automation | Backend-controlled import→forecast→recommendation, no external n8n/Airflow | No automated production flow demonstrated |
| Local/on-device LLMs | None selected; optional Ollama/small Qwen discussed | No local runs or hardware benchmarks |
| AI-DLC | Lightweight specification-driven practice, `AGENTS.md` recommended, Spec-Kit optional | No repository files created |
| `/docs` | Assistant recommended public live docs page | Checkbox and commitment not verified; if checked, it is real deliverable |
| Data sources | Retailer-provided sales/inventory/lead time; UCI Online Retail II public benchmark; internal storage | Public dataset metadata verified; dataset not downloaded by us |
| Acquisition | CSV bulk import primary; no scraper, live streaming or POS dependency | Planned only |
| Parsing | CSV+JSON proposed; Pandas normalization, Pydantic schemas, cancellations/returns separate | Planned only; sample UCI workbook itself is XLSX |
| Storage | PostgreSQL relational, tenant-oriented schema, indexes/import lineage/retention | Planned only, provider not chosen |
| Visualization | Recharts, overview, forecasts, warnings, evaluation charts; refresh on import rather than continuous stream | Planned only |
| Insights | Classical ML, forecasting, statistical analysis, deterministic rule engine; no default deep learning/LLM RAG | Architecture recommendation; no completed models |
| Pipelines | Backend event-driven import, on-demand forecasts, no Kafka/Airflow needed | Planned only |
| Distribution/API | JSON REST FastAPI, user-auth and validations; CSV exports suggested; no webhooks/MCP | Planned only |
| Governance | Data-quality checks, lineage per import/model, privacy, access control, appropriate costs and warnings | Planned, not tested |
| Local tunnel | No ngrok/Cloudflare Tunnel use shown | Do not claim tools used |
| AI/Data provenance | UCI benchmark, authorized retailers, model selection by evaluation, human oversight | Drafted, not verification of actual use |
| Tooling/IDE | VS Code selected; Vercel approved; FastAPI/Next.js/Postgres proposed | UI selection + owner target; no deploy |
| Prompt Library | Real excerpts from competition research and five-challenge selection prompts, outputs are analytic reports | Conversation evidence, no saved library proof |

### 11.5 The submission may lock choices

The owner repeatedly emphasized: **“The submission must present DEMANDIQ as a well-defined project”**, and selections may be final. A proposed solution may be written in present tense to convey coherent design, but **must not claim training, coding, testing, deployment, accuracy or user impact that never occurred**. Verification of portal editability/“Save draft” behavior is an urgent unknown. In a conflict between scoring incentives and truthful AI usage, follow the published provenance policy.

---

## 12. Technical Ideas and Vibe-Coding Considerations

**Status: Capture of discussed implementation *options*, not an approved architecture or task breakdown.** Owner chooses Google **Antigravity** for future primary AI-assisted building; nothing in this conversation verifies that Antigravity has already produced working project code. Previously discussed IDE: VS Code selected in form (possible parallel workflow, needs reconciliation). Technologies should be re-evaluated in the future full plan, especially Vercel serverless limits.

### 12.1 Technical stack map

| Layer | Idea/status | Why proposed / caution |
|---|---|---|
| UX frontend | **Next.js + React + TypeScript** (proposed) | Browser-based accessible judge demo; not committed in repository yet |
| Charts | **Recharts** (preferred) | Responsive sales, forecast and risk charts; do not claim currently used |
| Backend API | **Python/FastAPI**, JSON/REST, **Pydantic** schemas (proposed) | Typed input validation, forecasting and app logic |
| Data prep | **Pandas** (possibly Polars), CSV normalization | Handle dates, SKU, returns, transaction quality |
| ML | **scikit-learn** for benchmarks; **LightGBM** candidate; seasonal-naive/moving average/statistical alternatives | No model selected until backtests; source-derived LightGBM is proposal not challenge mandate |
| Forecast statistics | Possible statsmodels/forecasting tools | Suggested only; metrics must match data distribution |
| Business decision engine | Deterministic math/rule engine separate from ML | Explainability, testability; incorporate stock, lead times, constraints |
| DB | **Managed PostgreSQL** preference; tenancy constraints, import batches, forecast/model references | No provider/account/DB created |
| Deployment | **Vercel approved by owner** for frontend and light serverless API; managed Postgres proposed | No deployment URL; heavy Python inference/bundle/training limitations |
| Training | Outside synchronous Vercel request handling (recommendation) | Reproducible offline/notebook or external job; no training environment chosen |
| AI explanation | Prefer deterministic explanation where enough; optional hosted or local small LLM | No necessity for LLM numerical computation or RAG |
| Auth/privacy | Business-level authorization, minimal PII, TLS and safe storage | No code, policy, or security tests exist |
| Docs | Public `/docs` route (assistant recommendation) | Owner's checkbox selection not proven; must not fabricate real metrics |

### 12.2 Vercel-specific verified caution

Vercel officially documents **FastAPI on Vercel Functions** and supported Python runtime [T2,T3]. The provider imposes function duration, memory, code bundle and **4.5 MB request-body** constraints (documentation may change). On 26 Oct 2026, verified Vercel docs show Python FastAPI as a function; do not assume heavy model training or large file upload in normal request handlers works. Imported UCI Online Retail II's original workbook is **43.5 MB XLSX** [D1] — larger than the typical direct function request-body limit. The next planning chat must address direct-to-object storage, streaming, smaller example files, import constraints, or another safe ingestion method **before promising large CSV uploads on Vercel**. The exact backend deployment composition, Python dependency/model bundle size, connection pooling, background jobs and spending are **unverified**; Vercel as platform is owner-approved, but “everything runs on Vercel with no compromises” has not been proven.

### 12.3 Data provenance and cleaning realities

- **UCI Online Retail II** [D1] is a verified potential research dataset: **1,067,371 transactions**, **2009–2011**, UK non-store retail, file named `online_retail_II.xlsx` (43.5 MB), **CC BY 4.0** with attribution. Contains InvoiceNo, StockCode, Description, Quantity, InvoiceDate, UnitPrice, CustomerID, Country; missing values, negative/return/cancellation issues. No full stock ledger, replenishment lead-time, inventory policy, actual shopper demand or verified stockout labels. User upload promise targets CSV even if source example is XLSX; convert with a documented legal pipeline.
- Retailer-contributed CSV sales, stock and supplier info require **permission and a privacy/retention model**. No authenticated users or merchant test partners have been reported.
- Challenge suggests Kaggle Store Item Demand, UN Comtrade, MarineTraffic, GDELT, OpenWeatherMap; **these have not been integrated**. Kaggle competition terms, paid quotas, satellite/model licenses need separate checks if later considered.
- Cleaning tasks discussed: required field presence, ISO dates/timezone, valid SKU, duplicate invoices, returns/cancellations, negative quantities, missing sales periods (do **not** silently map missing records to zero demand), outliers and insufficient histories.
- Enrichment: stock and lead-time info explicitly comes from retailer; sales record cannot magically infer those values.

### 12.4 AI evaluation and counterfactual honesty

- Forecast assessment proposed: time-ordered training/validation/test, baseline (moving average and seasonal naive, or equivalents), MAE/WAPE/MASE as appropriate (the discussion repeatedly suggested WAPE and MASE); avoid data leakage, special treatment for low/intermittent demand, compare by meaningful product cohorts, report calibration limits.
- Inventory scenario assessment: apply competing reorder policies to **same** demand sequence with documented initial stock, replenishment lead time, lost-sales/holding-cost assumptions and service-level rules. Label **simulated** savings. No dataset currently proves “revenue up / stockouts down” in real life.
- Explainability: show the source data and forecast/model or fallback selected; compute quantity deterministically; indicate low confidence and missing data; retailer has final decision.
- Monitoring/traceability conceptual fields: import batch ID, source/validation status, model-version ID, prediction timestamp, inputs used, calculation/explanation, response-time/error logging. None currently implemented.

### 12.5 Frontend product claims and delivery boundaries

- Recharts graphs, filters and in-app warnings discussed; no live UI code.
- Upload statuses, validation errors, partial rows, stale data warnings, forecast job progress, no-data case and authentication should be included in **future** planning because they relate to claims in prior drafts; no design states finalized.
- Frontend/IDE builder names selected in a screenshot might only be UI checkboxes; user later states **Google Antigravity** as primary build tool for future. Confirm actual permissions, code export, deployment compatibility, available integrations and usage history separately. Do not assume AI tools automatically generate production-ready code.

### 12.6 Deliberate non-goals from earlier strategy

No unnecessary microservices, always-on IoT streaming, live POS data sync, autonomous supplier orders, GNN global strike model, VLM satellite ports, federated multi-retailer training, multi-echelon RL, local LLM infrastructure, or multiple autonomous agents **unless** user later explicitly expands scope after feasibility evidence and approval. These were either challenge *example prompts* or exploratory options, not the chosen MVP.

---

## 13. Competition Strategy and Success Criteria

**Goal statement [OWNER]:** Target champion-level performance, but avoid guarantees, fabricated traction or unnecessary engineering risk. Optimize for evidence across actual judging categories and a real viable startup path.

**Evidence opportunities already discussed (not measured yet):**

| Dimension | What ReorderLens AI should eventually be able to substantiate | State now |
|---|---|---|
| Innovation | An underserved retailer workflow where forecasting + data-quality explanations + action review is better than alternatives | Hypothesis; competitor/user research incomplete |
| Technical | Real CSV→forecast→decision working slice, relevant baselines, resilient imports, clear model boundary and reproducible tests | Architecture discussed, not coded |
| Business | Identified buyer/user, adoption pathway for SMEs, believable cost and distribution economics, localization | Positioning hypothesis; no interviews/revenue/pricing |
| Impact/ethics | Forecast error and **simulated** inventory metrics; appropriate personal/business-data controls; transparent assumptions | No completed evaluation/pilot |
| Scale/collaboration | Modularity, Vercel fit/cost model, reproducible deployment; any actual collaboration disclosed | Vercel target approved, no deployment; NRB collaborator not known |
| Presentation | 3-minute honest preliminary demo/concept, later actual working judge-demo, clear architecture and Q&A | Draft narrative; video/demo URLs not provided |

**Champion potential caution:** In the prior comparison the assistant recommended DemandIQ as the best *risk-adjusted* option, not the most futuristic/highest pure potential. Achieved product quality is unknown, and competing teams/final judging details are unknown. A score of 79/100 was a comparative assistant tool, **not an official score or a 79% win chance**.

**User-facing promised evaluation and quality:** Data privacy, human control, chronological splits, baseline comparisons, data cleaning, accuracy reporting and scenario simulation need demonstrable implementations before the final judging if the submitted draft is used. If a threshold cannot be achieved, report limitation rather than conceal it.

**Prior recommended preliminary video structure (not official segment mandate):** problem/user (0–30s); solution/differentiation (30–60s); demo/mock flow (60–120s); AI architecture/data (120–150s); impact/next steps (150–180s). Separate real screens from mockups and simulations.

**Prior published comparison/winners:** Infinity AI BuildFest winner examples [C10] were discussed to illustrate concrete user workflows (CyLnk Learn, ARBOR). They **do not** establish a DemandIQ template or any statistically reliable prediction of this Congress's winners.

---

## 14. Team Capabilities and Working Preferences

| Topic | User-provided direction / status |
|---|---|
| Human developer | **One planned human developer**. User described themselves as experienced senior mobile/Flutter developer. Do not assume any other people or their duties. |
| Team form selection | **The White Hole** visible; membership unknown; do not invent 3–5 members. |
| Collaboration with AI | ChatGPT + other appropriately disclosed tools as assistance, **not human registered members**. User later identifies **Google Antigravity** as the principal future vibe-coding environment. |
| Stack flexibility | Any framework/language/tool allowed by owner in principle; choose based on speed, maintainability, reliability, cost and evidence. Next.js/React/FastAPI proposed, but **Vercel hosting explicitly chosen**. |
| Strategic objective | Championship ambition **balanced with genuine commercial product**; must be pragmatic. |
| Skepticism | Challenge own assumptions, flag bad feasibility and false novelty; do not simply agree. |
| Human explainability | Owner must personally understand product, AI decisions, datasets, code boundaries, failures, security, costs, business rationale and demo. |
| UX | Modern, accessible, responsive and understandable to real retailers; Bangladesh/Bangla where appropriate; loading/empty/error/low-confidence states, good demo. |
| Engineering | Functional end-to-end vertical slice first, modular code, controlled AI-assisted implementation, relevant test execution and honest reporting. |
| Integrity | No invented benchmarks/users/partners/metrics; real licensing and consent; disclosures match actual tool usage. |
| Writing style | Natural, confident, thoughtful **student-team** English in submissions, not corporate marketing. Product vision present tense permitted, actual implementation/test history always literal truth. |
| Handover phase gate | Next chat: first evaluate/produce full project plan under a separate master prompt; **explicit final user approval** before final implementation docs and Google Antigravity prompts; no code immediately. |
| Significant actions | Require approval before destructive changes, spending, public/sensitive releases; verify actual code and dependencies before edits. |

**Master file nuance:** The uploaded `AI_Builders_Congress_2026_Master_Instructions.md` was written *before* the topic was selected and says “Project/topic: NOT SELECTED” and forbids brainstorming before authorization. That portion is **historically superseded** by the later user approval of **DemandIQ**. Its operating standards (critical research, security, testing, approval, truthful provenance) remain relevant, while its initialization state is stale. Do not revert selection because of older file text.

---

## 15. Source and Evidence Register

**Verification run:** 26 Oct 2026. A link is included only when present in available conversation/source or actually retrieved. Direct CloudCamp policy pages sometimes display a JavaScript loading shell; **indexed policy excerpts were inspected**, not a live authenticated page. Codes below are used elsewhere in this file.

### 15.1 Organizer / institutional sources

| ID | Source (URL) | Evidence and scope | Access / reliability caveat |
|---|---|---|---|
| **C1** | [CloudCamp official Congress site](https://cloudcampbd.com/ai-builders-congress) | Event landing/portal location; user screenshots believed from its interface | **Direct dynamic page failed** in web reader; screenshots owner-supplied, authenticated portal not accessed |
| **C2** | [DIU official 7 Oct 2026 announcement](https://news.daffodilvarsity.edu.bd/news/where-global-ai-builders-create-the-technology-of-tomorrow-%E2%80%94under-this-theme-daffodil-international-university-is-set-to-host-the-%E2%80%98international-ai-builders-congress-2026%E2%80%99-for-the-first-time-in-country-20261007-172417) | Organizer/co-organizer, **3–5 team members**, 11/55, 26 Dec date/venue, mentoring, broad five areas, partners and approx aggregate prize | Verified as indexed DIU source; direct fetch at one point failed, but indexed full article available |
| **C3** | [CloudCamp, “The 16 Percent Problem”, 9 Sep 2026](https://www.linkedin.com/pulse/16-percent-problem-cloudcampbd-hyiec) | 11/55, option to define problem, **five 20-point components**, **31 Oct deadline**, product-first ethos, IP narrative | Organizer-authored LinkedIn content indexed. Current organizer dashboard may supersede |
| **C4** | [Submission Rules v1.1](https://cloudcampbd.com/events/ai-builders-congress/policies/submission) | **One-page summary; 3-minute video; required content; originality, locale, AI disclosure, screening** | Official indexed excerpt verified; direct page loading shell |
| **C5** | [Terms & Conditions v1.1](https://cloudcampbd.com/events/ai-builders-congress/policies/terms) | Truthful registration, IP retained, organizer's nonexclusive media/submission license, policy changes | Official indexed excerpt verified; direct page loading shell |
| **C6** | [AI Usage & Provenance v1.1](https://cloudcampbd.com/events/ai-builders-congress/policies/ai-usage) | AI allowed; disclose prompts/models/data, validate output, no fake demos/results, lawful privacy/ethics | Official indexed excerpt verified; direct page loading shell |
| **C7** | [Prize Rules v1.1](https://cloudcampbd.com/events/ai-builders-congress/policies/prize) | Conditional awards; listed 50k/30k/10k amounts; verification/disqualification | Official indexed excerpt; **conflicts or lacks scope clarity** versus DIU aggregate 1m |
| **C8** | [CloudCamp, “The Five Lines That Put You Ahead…”, 17 Sep 2026](https://www.linkedin.com/pulse/five-lines-put-you-ahead-most-teams-international-ai-builders-mwh2c) | Organizer's 5×20 language and pitch problem-story importance | Indexed summary accessible; not definitive current dashboard rubric |
| **C9** | [Infinity AI BuildFest judging v1.1 — DIFFERENT EVENT](https://cloudcampbd.com/events/the-infinity-ai-buildfest/policies/judging) | Six 20/20/20/20/10/10 framework matching user screenshot | **Do not silently assign to Congress**; comparison only |
| **C10** | [DIU report of Infinity AI BuildFest winners](https://www.linkedin.com/posts/daffodil-international-university_diupride-cis-infinityaibuildfest2026-activity-7471431077077639169-BkG9) | CyLnk Learn/The Tokenizers and ARBOR/DuoGuard **different competition** | Institutional source indexed; no Congress historical winners |
| **C11** | [CloudCamp public event listing](https://cloudcampbd.com/events-public) | Public event period and description | Public event source accessible as indexed text; not personalized |

### 15.2 User-provided on-screen evidence

| ID | Screenshot family | What directly appears | Limits |
|---|---|---|---|
| **U-JUDGE** | Three “Judging Criteria” carousel images earlier in this conversation | Six named categories and scoring bands | Event-specific page URL not shown; same weights on different event's official policy |
| **U-DOMAINS** | Eleven “Domains & Challenges” tab screenshots | 11 × 5 names; domain taglines; “pick a track or define your own” | Detailed modals for other fifty cards not given |
| **U-DEMANDIQ** | Two expanded DemandIQ images | Specific Ask, Details, five example prompts/sources/products | Organizer intent vs binding requirement ambiguous; no active link in image |
| **U-SKILL** | Two SkillBridge modal images | Specific ask, details, five example prompts, suggested data/examples | External API availability not confirmed |
| **U-QUALITY** | Two Quality Vision modal images | Specific ask, edge direction, examples, datasets, competitors | Some data bullets truncated in first image; no full external specs |
| **U-CONTRACT** | Two ContractMind modal images | Explicit four-part prototype specific ask, rich details/examples, datasets | Legal requirements and proposed “should” tooling uncertain |
| **U-FOOD** | Two Food Waste Zero modal images | Explicit >=30% **simulated** waste reduction and architecture diagram; detailed tech expectations | Exact mandatory status of all narrative components uncertain |
| **U-FORM-01** | Event/Team/Story portal screenshots | The White Hole, Idea to Unicorn preliminary, Oct 31 truncated due label, fields and missing flags | No verified submit receipt, saved text or team membership |
| **U-FORM-AI** | AI Detail Usage/Provenance screenshots | AI Depth score UI, selected LLMs and frontend builders, many choices | Selected boxes ≠ verified actual use |
| **U-FORM-TOOL** | Tooling & IDE screenshot | VS Code selected; “Required — completed” badge | Does not establish Vercel deployment or filled fields |
| **U-FORM-DATA** | Data Lifecycle screenshots | Data source/format/storage/insight/pipeline/governance checkboxes and text-field prompts | Mostly blank placeholders; proposed answers live only in chat drafts |
| **U-FORM-PROMPT** | Prompt Library screenshot | Entry title, prompt, output summary, proprietary toggle, add button | “1 prompts” appears but actual saved library text is not shown |

### 15.3 Relevant external technical/source references verified or discussed

| ID | Link | Confirmed/reported fact | Status |
|---|---|---|---|
| **D1** | [UCI Online Retail II dataset](https://archive.ics.uci.edu/dataset/502/online%2Bretail%2Bii) | 1,067,371 transactions, UK 2009–2011, original XLSX 43.5MB, CC BY 4.0, returns/cancellations in fields | **Verified from dataset listing**, data **not downloaded/examined for model fitness** |
| **D2** | [Kaggle Store Item Demand challenge data](https://www.kaggle.com/competitions/demand-forecasting-kernels-only/data) | Challenge-modal-suggested time-series dataset | URL publicly known; licensing and actual usage must be checked per Kaggle rules |
| **D3** | [Netstock replenishment help](https://help.netstock.com/en/articles/12135974-mastering-ordering-and-replenishment) | Existing competition with replenishment workflow and constraints | Referenced earlier in conversation; market gap **not** validated |
| **D4** | [O*NET occupational database](https://www.onetcenter.org/database.html) | Alternative SkillBridge data source, CC BY 4.0 subject to exceptions | Primary source indexed/verified |
| **D5** | [Atticus Project legal datasets](https://www.atticusprojectai.org/research/) | CUAD 510 contracts and >13k expert labels, 41 clause categories | Primary source verified; irrelevant to selected DemandIQ except selection history |
| **D6** | [Vercel FastAPI support](https://vercel.com/docs/frameworks/backend/fastapi) | FastAPI deployable as Vercel Function; functions limitations | Verified provider docs on 26 Oct |
| **D7** | [Vercel Functions limitations](https://vercel.com/docs/functions/limitations) | Memory/duration/bundle and 4.5MB request body limits vary by product and plan | Verified provider docs; **recheck at implementation** |
| **D8** | [Vercel Python runtime](https://vercel.com/docs/functions/runtimes/python) | Python runtime supports FastAPI but was marked beta in retrieved docs | Provider source verified; runtime status can evolve |
| **D9** | [VisA dataset public AWS registry](https://registry.opendata.aws/visa/) | Industrial defect dataset proposed alternative for Quality Vision | Discussed previous research, not central to DEMANDIQ |
| **D10** | [MVTec AD licensing](https://www.mvtec.com/research-teaching/datasets/mvtec-ad) | MVTec AD often noncommercial license; requires checking before commercial product | Prior conversation/source, not used |

### 15.4 Uploaded master instructions inspected

- `AI_Builders_Congress_2026_Master_Instructions.md`, v2.0, prepared 25 Oct 2026, **516 lines**; directly read in runtime. Provides phase gates, exact rules/source snapshot, solo model, engineering security/testing and honest-demo standards. **Its “topic not selected” state is obsolete after owner approval**. The separate companion named there was **not accessible**.
- No file material from a real ReorderLens source repository was available, and no files were edited in the original project by the earlier answers.

---

## 16. Confirmed Decisions

Confirmed means **the owner's preference or explicit selection is clear**, not that a technical implementation has been made.

| Decision | Owner evidence | Consequence |
|---|---|---|
| Compete in International AI Builders Congress, **Idea to Unicorn** | Repeated user directives and portal screenshot | Do not silently change competition/track |
| Select **DemandIQ** challenge, CommerceSphere AI | “We've finalized our decision…” after 55 and five-detailed comparison | **Selection is closed** pending genuine compliance issue |
| Use project brand **ReorderLens AI** in answers | Owner edited elevator/public summary and asked subsequent product replies | Keep challenge label distinct from product brand |
| Team label The White Hole | Selected in screenshot | **Human composition/eligibility not established** |
| Primary objective champion-level result + genuine viable product | Explicit repeated instruction | Do not optimize only for badge points or flashy demos |
| Primarily AI-assisted development, **Google Antigravity** for future build | Latest user handover request | Future planning must assess Antigravity workflow, no code yet |
| Primary deployment target **Vercel** | Explicit user: “we're going with to deploy it with vercel” | Feasibility restrictions must be addressed before committing to exact runtime topology |
| Editor **VS Code** selected in Tooling screenshot | Owner UI screenshot | Need reconcile with Antigravity as primary AI workflow, not necessarily exclusive |
| Application tone natural, human, defensible | Explicit user instruction | Write product design in present tense; actual evidence truthfully |
| Plans then approval then final docs/prompts | Explicit **current** user instruction | No build or final implementation docs until owner signoff |
| AI assistance and provenance disclosure must be honest | Explicit user instruction, official policy | Do not claim unchecked tool usage as implemented |

---

## 17. Proposed Ideas and Unapproved Decisions

These were suggested, drafted in form text, or discussed as plausible. **Do not promote them into compulsory scope without approval and alignment with actual final submission**.

| Proposal | Why considered | Unapproved point |
|---|---|---|
| Next.js/React/TypeScript, FastAPI/Python, PostgreSQL, Recharts, Pandas/Pydantic, scikit-learn and maybe LightGBM | Cohesive web forecasting stack | **Vercel hosting is chosen**, but exact dependency/runtime stack has not been signed off by owner via a build plan |
| Managed Postgres provider and authentication | Secure multi-tenant data | Provider, tenancy implementation, secrets and pricing not chosen |
| Separate model training from Vercel inference | Serverless limits | Background training/job/hosting method unknown |
| Forecast uncertainty bands and low-data fallbacks | Honest decisions | Confidence estimation method and acceptance test unknown |
| Simulated reorder policies and ROI comparison | Evidence for outcome | Dataset lacks complete stockout history; validity must be established |
| Public `/docs` page | Assistant recommended YES; useful to judges | Owner checkbox selection and full expanded `/docs` obligations unverified |
| CSV exports of recommendations | Practical retailer handoff | Proposed in text; not mandatory challenge requirement |
| Bangla UI/explanations and locale-specific CSV fields | Bangladesh-first value | Official policy asks localization consideration, full implementation scope not defined |
| Tool-based explanation via LLM; local Ollama/Qwen; caching or structured outputs | Optional natural language, cost/privacy | **No local model or integrated LLM feature demonstrated**; keep optional |
| `AGENTS.md` and possible GitHub Spec-Kit | Durable AI coding standards | No repo/memory files exist; Antigravity workflow may dictate alternatives |
| v0, Gemini Canvas, ChatGPT Canvas for UI | Selected in screenshot, assistant assigned possible roles | Actual use/percent AI-written not verified; don't overstate |
| Real merchant trial and pricing experiment | Commercial credibility | No participants, partnership, pilot or dates |

---

## 18. Assumptions and Unverified Information

1. **Participation is valid for current human staffing:** NOT demonstrated. Owner is sole planned human coder, DIU says 3–5 team participants. “Team: The White Hole” UI label alone does not establish valid membership.
2. **The form is irreversible:** User regards it as potentially final; no policy/UI proof regarding editing, autosave, submission versions, or deadline changes.
3. **The live six-category scoring screenshot applies to this Congress:** It might, but same weights exist in another event's judging policy. Congress-specific organizer article is five categories. Resolve exact event/stage.
4. **The preliminary portal requires every depth-tech field:** Its “recommended/optional” widgets and point badges differ from universal policy; actual gates and their impact on scoring unknown.
5. **Retailers in Bangladesh lack affordable forecasting tools:** Plausible user problem but customer interviews, pricing and local competitor research not completed.
6. **UCI UK gift retail history generalizes to Bangladeshi SME demand:** No validation. Missing real stockouts, lead times, seasonality and domain shift.
7. **LightGBM will outperform seasonal naive:** Unknown until experiments. No measured forecasting performance.
8. **Stockout/revenue improvement:** Target outcome, not actual empirical effect; simulation can only substantiate assumptions.
9. **Vercel can host full Python/ML inference with selected packages at useful cost:** Possible, but memory, 4.5MB upload, bundle size, cold starts and deployment topology untested.
10. **Web app has any live UI/screens/tests:** Not established. Prior writing describes a proposed architecture, not executed build.
11. **Five LLMs and three visual builders were used:** Selected in portal screenshot, individual usage not verified beyond ChatGPT planning.
12. **Local AI, RAG, MCP, agent orchestration, fine-tuning, optimized tokens are active:** No evidence; user was advised not to claim.
13. **Owner registered other teammates or NRB collaborators:** Not known; no names/contributions allowed to be invented.
14. **Specific model/dataset licenses across all future resources:** Only UCI metadata separately verified; permission for future paid APIs, Kaggle contests, model weights and resale unverified.
15. **Commercial scalability and pricing:** Hypotheses without unit economics, willingness-to-pay or customer acquisition proof.
16. **`/docs` prompt yields a whole working endpoint and is mandated:** Screenshot describes optional/recommended docs module; expanded instructions not supplied; unchecked in last visible screenshot.

---

## 19. Missing Information and Open Questions

Prioritized **only** by material effect on competition eligibility, locked submission and the next planning gate:

| Priority | Question / artifact needed | Why it matters |
|---|---|---|
| **P0** | **Organizer's explicit decision on registering one human in a 3–5 team track; actual registered team members of The White Hole** | Eligibility/disqualification blocker. Do not fabricate others |
| **P0** | **Exact official Oct 31, 2026 cutoff (Asia/Dhaka or other), account registration status and submit/save requirements** | Deadline is days away; screenshot cuts off time |
| **P0** | **Actual saved/submitted form text, checked tool boxes, completeness status and submit receipt** | Proposed vs actual commitments; previous screenshots have blank field placeholders |
| **P0** | **Current binding judging rubric and preliminary-vs-final application**, especially 5×20 vs 6×weights and AI Depth portal | Critical scoring/interpretation discrepancy |
| **P0/P1** | **Full current Challenge DemandIQ “Specific Ask,” “Details,” mandatory vs examples confirmed by organizer if changed** | Avoid implementation contradicting challenge |
| **P1** | **Full Participants Guide/current instructions, required one-page format, video/link sizes, visibility, upload portal** | Specific preliminary deliverables and proof requirements unknown |
| **P1** | **Does form's detailed AI tool score reward planned tools or only actually used? Which fields are truly mandatory?** | Prevent false provenance and accidental penalties |
| **P1** | **Has `/docs` YES been selected; what exact /docs prompt/instructions say?** | Could become binding deliverable |
| **P1** | **Who used ChatGPT/Gemini/DeepSeek/Llama/Qwen; which v0/Gemini Canvas/ChatGPT Canvas screens were genuinely created?** | Provenance integrity of checked boxes |
| **P1** | **Actual developer time, computer resources, budget, Antigravity subscription/features and access** | Practical feasibility, training/deployment constraints |
| **P1** | **Representative retailer CSV samples, consent, stock-on-hand/lead times, real pilot access** | Forecast usefulness and outcome evidence |
| **P1** | **Vercel plan/hosting geography/cost/maximum file size, Python+FastAPI compatibility, DB/storage provider** | May require external persistent jobs or direct uploads |
| **P2** | **Precise target retailers, current solutions, unique adoption advantage, pricing potential** | Differentiation and business marks |
| **P2** | **Responsible AI, retention/deletion, user-account scope and actual privacy legislation to meet** | Security/ethics commitments |
| **P2** | **Actual final-event pitch duration, Q&A, live-demo link rules, prize allocation/NRB collaboration criteria** | Presentation/readiness strategy |
| **P2** | **Trademark/domain availability for ReorderLens AI** | Long-term product identity; not essential to preliminary |

Do not ask the user to re-provide answers already supplied in the handover. Resolve via current screenshots/documents or short, high-impact clarification only.

---

## 20. Conflicts, Risks, and Items Requiring Verification

### 20.1 Conflict log

| ID | Conflict | Status / response |
|---|---|---|
| **K1 — Eligibility** | DIU says **3–5** human team members; one human developer planned; a selected team label does not prove registration compliance | **Critical unresolved.** Seek organizer ruling or valid real team details. AI ≠ human |
| **K2 — Rubric versions** | Congress article says **five 20-point** categories; screenshot shows **six 20/20/20/20/10/10**, also official for Infinity AI BuildFest | **Critical for grading;** do not treat either as binding without track-specific current confirmation |
| **K3 — Submission policy vs portal** | Organizer policy says one-page summary + 3-min video; actual portal adds many scores, YouTube video, Demo/Live links and “Required” labels | Determine which are true hard gates; comply with actual current form, avoid overstating done status |
| **K4 — Draft vs saved** | Assistant wrote many entries; portal screenshot frequently blank or status badge superficially complete | Get saved-form readback/export; **do not** claim text was submitted |
| **K5 — Product vs official challenge name** | Challenge called DemandIQ; product edited to ReorderLens AI; new user refers to “DEMANDIQ project” | No contradiction if consistently label **Challenge = DemandIQ; Product = ReorderLens AI** |
| **K6 — Historical master file** | v2.0 master manual says topic NOT SELECTED and brainstorm forbidden; user later explicitly selected DemandIQ | Later owner authorization supersedes stale topic status; keep all other safety/approval standards |
| **K7 — Product present tense vs actual status** | User wants polished present-tense product descriptions, yet app not built; form asks *used* for many tech fields | Describe design in present tense; historical activities strictly truthfully. Don't convert proposals into proof |
| **K8 — Selected model checkboxes vs prose** | Portal showed five LLMs selected; provenance draft confirms mainly ChatGPT, other tool use unknown | Verify actual use; correct checkbox/disclosure before immutable submission |
| **K9 — Vercel “all backend on Vercel” vs training** | Owner chose Vercel; assistant drafted Python FastAPI functions and separate training | Validate serverless ML feasibility; Vercel is the platform target, not verified all compute resources |
| **K10 — Dataset input mismatch** | CSV-only retailer import in drafts; UCI reference file is XLSX and >4.5 MB | Explain documented conversion; avoid promising large XLSX direct-to-function ingestion |
| **K11 — Six rubric screenshot claims “official”** | Earlier assistants sometimes treated screenshots as official Congress scoring, but independent evidence ties same rubric to another event | Preserve as supplied/possibly updated; use official latest organizer ruling to decide |
| **K12 — Earlier assistant “latest research”** | Prior assistant summaries sometimes asserted entire site analyzed despite JS failure | Only indexed articles, selected source pages and user screenshots reviewed; do not overclaim completeness |
| **K13 — Today/date** | Earlier assistant text repeatedly dated work 25 Oct; handover is 26 Oct | Use exact dates, especially imminent 31 Oct |

### 20.2 Main product/engineering risks already identified

- **Forecasting data quality:** returns, cancellations, sparse/irregular records and stockout-censored demand.
- **AI usefulness:** expensive model may not beat seasonal baseline; model leakage can create false metrics.
- **Business outcome evidence:** simulating reorder policies isn't measured real-world uplift; using unsupported profit assumptions can mislead.
- **Differentiation:** Netstock/Blue Yonder/etc. already offer forecasting/replenishment; a forecasting dashboard alone likely not champion-caliber.
- **Commercial access:** no pilot retailers, buyer validation, purchase intent or pricing evidence.
- **Model privacy:** don't pass full retailer CSV/customer PII to unnecessary hosted LLM; authorization and tenant separation needed.
- **Vercel serverless constraints:** upload sizes, Python wheel/model bundle, function lifespan, DB connections, async tasks and cost; must be validated.
- **Demo reliability:** no actual deployed links, tested screens or video; avoid fragile external integrations and misrepresented mocks.
- **Scope:** advanced example prompts (GNN, satellite, federated, RL) and score-driven agents/MCP/RAG add many failure points with weak incremental value.
- **Integrity/reputation:** selected AI tool checkboxes without real use; generic claims of accuracy, privacy compliance or tests as completed; fabricated team members.

### 20.3 Readiness at handover

**Ready:** selected challenge, coherent product thesis, user-facing problem, draft technical and data direction, deployment platform choice, past selection rationale and application drafts.  
**Not verified:** eligibility, exact portal submission status, final official rubric, actual prototype, any metrics/user validation/deployment, complete final submission package, and exact future implementation architecture.  
**Next phase:** user-led **full project planning** under a separate prompt, not code generation; urgent compliance matters should be surfaced before detailed planning work.

---

## 21. Instructions for the Next ChatGPT Conversation

**Read this file and the companion `DEMANDIQ_SUBMISSION_DRAFTS.md` completely.** If the old uploaded 516-line master instruction file is also available, consult its engineering/security/verification standards but treat its “not selected” topic status as superseded. Use up-to-date official organizer documents for binding rules. Preserve all actual owner-approved choices and differentiate these from proposed or unimplemented items.

**What to do immediately:** Confirm the short list of genuine P0 blockers, especially one-person/3–5-human team eligibility, current preliminary cutoff and whether portal records are finally submitted or editable. Do not assume the screenshot scoring UI is the final judging rubric. Distinguish cited policy/indexed evidence from owner screenshots and earlier assistant speculation. Avoid asking questions already answered here.

**Project stage:** DEMANDIQ was selected, and the product is named ReorderLens AI in user-edited drafts. The next user will supply a **separate master project-planning prompt**. Apply its planning and approval gates. Do not introduce a new domain or replace the challenge without the owner's authorization. **Do not produce final PRD/implementation markdown or Google Antigravity prompts before final explicit owner approval**. No assertion that tests, deployment or user validation exist unless independently demonstrated. The user's primary builder preference for future work is Google Antigravity; Vercel is approved deployment target, while exact runtime topology and stack details remain to be validated.

**End of source/decision context. Required verbatim handover directive from the owner follows:**

> This file contains the consolidated context for the DEMANDIQ competition project. Read it completely before beginning.
>
> The project is moving into the full planning and development stage. The selected challenge is DEMANDIQ.
>
> Begin by verifying the documented context and identifying only the missing information that materially affects the project.
>
> Then follow the user's separate master prompt for project planning, technical architecture, product scope, risk analysis, development roadmap, and approval gates.
>
> Do not immediately start coding or generate the final implementation documentation. First produce the complete project plan and wait for the user's explicit final approval.
>
> After approval, prepare the complete, internally consistent Markdown documentation and Antigravity prompts needed to implement the approved project in controlled, testable phases.
>
> Treat official competition documents as authoritative. Do not invent requirements, scoring weights, source material, technical capabilities, or completed work.

