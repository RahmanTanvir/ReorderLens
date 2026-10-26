# ReorderLens AI / DemandIQ — Competition Submission Drafts, Form Fields and Commitments

> **Companion to:** [DEMANDIQ_MASTER_CONTEXT.md](DEMANDIQ_MASTER_CONTEXT.md)  
> **Prepared:** 26 October 2026 (Asia/Dhaka)  
> **Status:** Consolidation of **conversation drafts and visible screenshot selections**, **NOT an export of a submitted application**.  
> **Identity:** Product **ReorderLens AI** | Official challenge **DemandIQ** | CommerceSphere AI | Team **The White Hole**.

## How to read this file

- **[USER-EDITED DRAFT]** is a direct user edit of an assistant writing block and takes precedence over its original assistant version.
- **[DRAFT]** is text the assistant proposed; there is **no confirmation that it was entered, saved, or submitted**.
- **[VISIBLE UI]** is a selected checkbox or form badge shown in an owner's screenshot at that moment, **not a record of actual tool execution**.
- **[PLANNED ARCHITECTURE]** describes the defined product in confident present tense; does **not** assert working code.
- **[HISTORICAL FACT]** should only be used for actually documented planning use; many “used” technical fields were more honestly planned than completed.
- Each quoted text block below reproduces the most current accessible draft where possible. The form has no visible word/character limits for these textareas. Preserve user edits and check actual portal readback prior to final submission.
- See the master file for source URLs, official policy/rubric conflicts, detailed challenge requirements, selected technology boundaries, deadlines and approval gates.

## Table of contents

- [S1. Project Information and Story](#s1-project-information-and-story)
- [S2. Prompt and Model Usage](#s2-prompt-and-model-usage)
- [S3. AI Depth, Orchestration, Fine-tuning and Evaluation](#s3-ai-depth-orchestration-fine-tuning-and-evaluation)
- [S4. Guardrails, UI Builders, Automation and On-Device LLMs](#s4-guardrails-ui-builders-automation-and-on-device-llms)
- [S5. Data Lifecycle: Sources to Storage](#s5-data-lifecycle-sources-to-storage)
- [S6. Visualization, Insights, Pipelines and Outbound APIs](#s6-visualization-insights-pipelines-and-outbound-apis)
- [S7. Data Quality, Privacy and Observability](#s7-data-quality-privacy-and-observability)
- [S8. Build Provenance and Tooling / IDE](#s8-build-provenance-and-tooling--ide)
- [S9. Prompt Library: Two Real Planning-Prompt Excerpts](#s9-prompt-library-two-real-planning-prompt-excerpts)
- [S10. Submission Snapshot, Conflicts and Cross-Field Constraints](#s10-submission-snapshot-conflicts-and-cross-field-constraints)

---

## S1. Project Information and Story

**[VISIBLE UI]** Event: *International AI Builders Congress*; Team: *The White Hole*; Phase: *Idea to Unicorn — Preliminary Submission (Due: Oct 31, 202...)*. Screenshots show empty Project Name, Elevator Pitch and Public Summary placeholders, so no proof that text was saved.

### S1.1 Project Name

**ReorderLens AI** — [USER-EDITED working product brand]. **DemandIQ** is the competition challenge, **not** the preferred project name. The user approved DemandIQ selection and changed elevator/public summary wording to ReorderLens AI. Project Name textbox final saved status unavailable.

### S1.2 Elevator Pitch [USER-EDITED DRAFT, exact]

> ReorderLens AI helps small retailers predict what customers will buy, avoid running out of popular products, and make smarter restocking decisions using AI, with clear explanations behind every recommendation.

### S1.3 Public Summary [USER-EDITED DRAFT, exact]

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

### S1.4 Problem Statement [DRAFT, exact]

> For a small retailer, running out of a popular product means losing potential sales, while keeping too much stock means money sitting on shelves instead of supporting the business.
>
> Many small retailers still make purchasing decisions based on experience, guesswork, or basic sales records. Even when they have transaction data, turning it into reliable demand predictions is difficult. Customer demand changes, suppliers take time to deliver, and business owners often lack the tools to anticipate shortages before they happen.
>
> Existing inventory planning solutions can be too expensive or complicated for smaller businesses with limited resources.
>
> The problem is not simply a lack of sales data. It is the lack of an affordable, practical way to turn that data into better inventory decisions. We want to address this gap, starting with small and medium-sized retailers in Bangladesh.

**Caution:** Statement about cost/complexity of alternatives is plausible but not based on completed customer interviews or a pricing benchmark.

### S1.5 Solution Description [DRAFT, exact]

> ReorderLens AI is our proposed solution to help small retailers make better inventory decisions using the sales data they already have.
>
> Retailers will be able to upload their sales records and provide basic information such as current stock levels and supplier delivery times. The system will analyze historical sales patterns and use time-series machine learning to forecast demand for individual products.
>
> Based on these predictions, ReorderLens AI will identify potential stock shortages and recommend when and how much to reorder. Instead of presenting unexplained numbers, it will show the reasoning, relevant sales trends, and uncertainty behind each recommendation. Business owners will remain in control of their purchasing decisions.
>
> We also plan to compare our forecasting models against simpler prediction methods and use transparent simulations to evaluate how different inventory decisions could affect stockouts and excess stock.
>
> Our aim is to build something practical, not unnecessarily complicated: a tool that helps smaller businesses understand their inventory, make more confident decisions, and reduce avoidable losses without needing advanced technical knowledge.

**Later owner instruction about tone:** In product/architecture fields, write confidently in present tense; when a field asks actual completion or testing, be factual. This draft was **not** subsequently rewritten by the user, so it remains a historical proposed answer. Do not silently claim it has been replaced in the portal.

---

## S2. Prompt and Model Usage

### S2.1 Prompt Usage [DRAFT]

> We have been using ChatGPT as a planning and development assistant for ReorderLens AI. Instead of relying on broad prompts, we break our work into specific tasks, such as analyzing competition requirements, comparing technical approaches, identifying risks, and refining our product scope.
>
> Our approach is iterative. We provide relevant context, review the responses critically, challenge assumptions, and refine our instructions until the results are practical and technically defensible. We have also used AI to review our project descriptions for clarity, consistency, and unsupported claims.
>
> As development progresses, we plan to use structured prompts with clear roles, input constraints, and expected output formats for relevant AI-assisted features. We will document important prompt changes and test their outputs against representative cases.
>
> Our priority is not writing complicated prompts, but making sure AI produces useful, consistent results that we can understand and verify.

### S2.2 Token Optimization [DRAFT]

> We want ReorderLens AI to remain affordable for small retailers, so controlling AI costs is part of our technical plan.
>
> Our core demand forecasting will use time-series machine learning rather than sending large sales datasets to a language model. Inventory calculations will also run through regular application logic. This keeps the most important decisions predictable and avoids unnecessary token usage.
>
> If we use an LLM to explain recommendations, we plan to send only the relevant forecast results, inventory figures, and supporting context instead of entire transaction histories. We will explore structured outputs, shorter responses, caching repeated explanations, and smaller models where they provide sufficient quality.
>
> We also plan to measure token usage, response time, and cost during development. If a recommendation can be explained accurately using a simple template, we will avoid making an additional AI request.
>
> We have not yet deployed or benchmarked these optimizations. Our goal is to keep the system efficient without sacrificing accuracy or clarity.

**Checkbox recommendation then:** No actual token optimization methods have been confirmed; do not select caching, LLMLingua, batching, quantization, model routing etc. based on plans alone.

### S2.3 LLMs / Models Used — visible selection and draft explanation

**[VISIBLE UI]** User screenshot had selected **ChatGPT, Gemini, DeepSeek, Llama, Qwen**, receiving **+15/15** on the portal; Claude, Kimi, Grok and other displayed models unchecked. This **does not** verify usage. ChatGPT research/planning use is clearly confirmed by this chat. The assistant gave a **conditional** draft:

> We used ChatGPT, Gemini, DeepSeek, Llama, and Qwen during our early planning and research to explore different technical approaches, compare suggestions, and better understand how AI could support ReorderLens AI.
>
> Our main focus has been identifying practical ways to forecast demand, turn predictions into useful inventory decisions, and explain those decisions clearly to small retailers.
>
> We use AI as a development assistant, not as a replacement for technical judgment. We review its suggestions, question assumptions, and prioritize approaches we can realistically implement and test.
>
> Our core forecasting system will use time-series machine learning rather than relying on LLM-generated predictions. We are considering language models for explaining recommendations in simple terms.
>
> These models have supported our planning, but we have not yet deployed or benchmarked them as part of a working product.

**Mandatory warning:** This draft is factually appropriate **only if all five named systems were actually used**. No evidence in current conversation confirms Gemini, DeepSeek, Llama or Qwen usage, whether local or hosted. Do not submit an incorrect claim for five model uses.

### S2.4 Retrieval & RAG (checkboxes)

No selection shown. Assistant recommended **leave all RAG/vector/graph/RAG chunking boxes blank** because the selected product primarily needs structured time-series sales, not enterprise document retrieval. This is a recommendation, not a claim the user acted on it.

---

## S3. AI Depth, Orchestration, Fine-tuning and Evaluation

### S3.1 MCP, open source and agent framework usage

- MCP checkbox wording in form explicitly: *“We built and/or used MCP servers / clients in this build”*; user screenshot showed **unchecked**.
- Assistant recommended **unchecked**, no documented MCP client/server, tool names, endpoints, transports or permissions in the actual project.
- Open Source Tools & Libraries [later draft]:

> ReorderLens AI is designed around established open-source technologies that make the system practical to develop, test, and maintain.
>
> Our proposed architecture uses Python and Pandas for processing sales records, scikit-learn for forecasting baselines and model evaluation, FastAPI for backend services, and PostgreSQL for storing inventory and transaction data. LightGBM is also a candidate for demand forecasting if it demonstrates meaningful improvements over simpler methods.
>
> We favor these tools because they allow us to focus on forecasting accuracy and useful inventory decisions rather than unnecessary technical complexity. This is our defined technology direction; integration and testing are not yet complete.

- Agent Frameworks & Orchestration [later draft]:

> ReorderLens AI follows a structured workflow with clear responsibilities for data validation, demand forecasting, inventory analysis, and recommendation generation.
>
> Sales records pass through validation and preprocessing before reaching the forecasting engine. The resulting predictions feed into an inventory decision engine that considers current stock, supplier lead times, and business constraints. The system then presents an explainable recommendation for the retailer to review.
>
> We deliberately keep this workflow predictable and testable rather than introducing autonomous agents where they are not needed. No multi-agent framework has been integrated at this stage.

- Fine-tuning/Adaptation: **skip if not applicable**; ordinary model training ≠ LLM LoRA/QLoRA/instruction tune. None completed. No agent framework checkbox usage confirmed.

### S3.2 Evaluation & Quality Measurement [latest draft; exact]

> ReorderLens AI's evaluation approach focuses on two questions: How accurately can we predict product demand, and how useful are those predictions for inventory decisions?
>
> Forecast quality is assessed through chronological backtesting, where models learn from earlier sales records and predict later periods. We compare machine learning forecasts against simpler methods, including moving averages and seasonal baselines, using appropriate error metrics such as WAPE and MASE.
>
> For inventory decisions, our evaluation framework uses controlled simulations to compare replenishment strategies under the same demand conditions. Key measures include simulated stockouts, excess inventory, and estimated inventory costs.
>
> We also account for incomplete sales histories, unexpected demand changes, and unreliable predictions. Recommendations must reflect the actual forecasting results and inventory calculations.
>
> These methods define our evaluation framework. Testing is not yet complete, and we do not claim improvements or accuracy figures without measured results.

Earlier drafts conveyed same methodology, but this is the latest available assistant revision. **No model, benchmark, simulation or quality result actually executed in the conversation.**

---

## S4. Guardrails, UI Builders, Automation and On-Device LLMs

### S4.1 Guardrails, Safety & Privacy [DRAFT]

> ReorderLens AI is designed to handle business data responsibly and ensure that inventory recommendations are reliable, transparent, and safe to use.
>
> The system minimizes unnecessary data collection and focuses on sales, inventory, and product information rather than personal customer details. Uploaded files are subject to data validation, sensitive information is excluded where possible, and access to business records is restricted to authorized users.
>
> Forecasts and inventory recommendations follow defined validation rules. The system checks for missing data, unrealistic values, and unreliable predictions. When there is insufficient information, it clearly communicates the limitation instead of presenting uncertain results as facts.
>
> AI-generated explanations are grounded in actual forecast results and inventory calculations. Uploaded content is treated as untrusted input, and language models are not given permission to execute purchases or modify inventory records independently.
>
> Retailers remain in control of their decisions. These safeguards form part of our defined architecture, with implementation and security validation to be completed during development.

### S4.2 Frontend AI / Visual App Builders — screenshot state and description [DRAFT]

**[VISIBLE UI]** v0 (Vercel), Gemini Canvas, ChatGPT Canvas checked; Lovable, Cursor Agent and others unchecked. The assistant conditionally described these roles **without evidence of use**:

> ReorderLens AI is designed around a clean, responsive dashboard that makes inventory decisions easy for small retailers to understand.
>
> Our AI-assisted UI development approach focuses on three tools: v0 for generating reusable interface components, Gemini Canvas for exploring layouts and interactions, and ChatGPT Canvas for refining interface concepts and reviewing implementation approaches.
>
> The main screens cover sales data upload, demand forecasts, stockout warnings, and explainable restocking recommendations. AI-generated designs and code are reviewed for usability, accessibility, accuracy, and integration with the forecasting backend.
>
> The frontend is not yet implemented, so we cannot report a verified percentage of AI-built UI. Our approach is to use AI to accelerate development while keeping the final code understandable, maintainable, and properly tested.

**Integrity note:** This is a proposed *division of responsibility*, not proof tools were used. The screenshot field explicitly asks “How did you use these tools? What % of UI was AI-built?” Neither actual tool traces nor percentage supplied. New conversation says **Google Antigravity** is future main coding tool; reconcile without inventing AI UI percentages.

### S4.3 Workflow Automation [DRAFT]

> ReorderLens AI uses a clearly defined workflow to turn sales records into practical inventory recommendations.
>
> The workflow begins when a retailer uploads sales data. The system validates and processes the records, prepares them for demand forecasting, and passes the predictions to the inventory decision engine. This engine considers available stock, supplier lead times, and forecast demand to identify potential shortages and calculate recommended reorder quantities.
>
> Each step has a specific responsibility, making the process easier to monitor, test, and debug. Recommendations are presented for human review rather than triggering purchases automatically.
>
> Our architecture uses a controlled backend workflow instead of unnecessary autonomous agents. The workflow is currently defined at the design stage; no external automation platform or production automation has been integrated yet.

Assistant suggested no n8n, Airflow, Zapier, Temporal, LangGraph checkboxes until actual use; event-driven backend does not imply these platforms.

### S4.4 Local / On-device LLMs [DRAFT]

> ReorderLens AI is designed to keep its core forecasting and inventory calculations independent of large language models. Demand prediction uses time-series machine learning, while replenishment recommendations follow defined business rules.
>
> Local LLM inference is an optional deployment approach for explaining recommendations without sending sensitive business information to an external language model.
>
> Ollama with a lightweight open-weight model is a practical option for evaluation, depending on available hardware, inference quality, and response time. However, local deployment is not a requirement for the core product.
>
> No local LLM runtime or model has been tested for ReorderLens AI yet, so we do not claim specific hardware configurations, quantization settings, or performance results.

No local runtime or model was checked in the visible screenshot. Assistant proposed Ollama + small Qwen *if* later useful, did not claim run. Do not conflate hosted Llama/Qwen with on-device models.

### S4.5 Agentic Frameworks & AI Development Lifecycle

**[VISIBLE UI]** None of LangGraph, CrewAI, OpenAI Agents SDK, PydanticAI, AutoGen etc. checked in screenshot; no repo context framework (Spec-Kit, AGENTS.md, Kiro, BMAD) selected. Assistant recommended **AGENTS.md** as a lightweight future project coding standard and Spec-Kit only if helpful. No AGENTS.md or repo files created yet.

### S4.6 Live `/docs` module — checkbox recommendation, not confirmed selection

Owner screenshot: “Build a Live /docs Module (Recommended)” with unchecked checkbox. Assistant recommended selecting **YES**, conditional on genuine commitment to publish overview, workflow, architecture, dataset licenses, actual evaluation, responsible AI, documentation, demo and development status at `/docs`. The owner did **not** show a later checked screenshot. Expanded “Show instructions & copy prompt” was not opened. The new conversation must determine whether this promise became binding.

### S4.7 “Anything Else About Your AI Usage?” [DRAFT]

> One important principle behind ReorderLens AI is that AI should help business owners make better decisions, not replace their judgment.
>
> Our approach separates demand prediction from inventory decision-making. Time-series machine learning estimates future product demand, while a rule-based inventory engine uses those forecasts alongside current stock levels, supplier lead times, and business constraints to recommend reorder quantities. This makes the calculations easier to verify and explain.
>
> We also recognize that predictions are not always reliable, especially when sales history is limited or customer demand changes unexpectedly. ReorderLens AI accounts for these limitations instead of presenting every forecast with equal confidence. Retailers can review the reasoning behind recommendations and remain responsible for purchasing decisions.
>
> AI assistants have also supported our research, technical planning, and evaluation of different approaches. We review their suggestions critically and focus on methods we can understand, implement, and test.
>
> Our aim is not to use as many AI models or frameworks as possible. It is to build a practical system where each AI component has a clear purpose and its contribution can be measured.

---
## S5. Data Lifecycle: Sources to Storage

### S5.1 Data Sources — recommended boxes + specific sources [DRAFT]

**Checkbox recommendation from assistant:** Internal (own DB/app data), Open Datasets, User Uploads / Bulk Import. Do not select unimplemented external APIs, scraping, IoT, partner data or “synthetic data” as factual usage. A simulation may use documented generated scenarios, but that is not by itself an existing data source.

> ReorderLens AI is designed around three main data sources:
>
> 1. **Retailer-provided data:** Historical sales records uploaded through CSV files, including product identifiers, transaction dates, and quantities sold. Retailers also provide current stock levels, supplier lead times, and relevant inventory settings.
>
> 2. **Public retail datasets:** The UCI Online Retail II dataset serves as a reference dataset for developing and evaluating demand forecasting models. It contains historical retail transactions and is available under the CC BY 4.0 license.
>
> 3. **Internal application data:** The system maintains validated sales histories, product information, forecasting results, inventory settings, and replenishment recommendations.
>
> We prioritize data that directly supports demand forecasting and inventory decisions. Personal customer information is not required for the core forecasting workflow.
>
> Public datasets support development and benchmarking, while authorized retailer records provide the business-specific context needed for practical recommendations. No external data partnerships or live business integrations are claimed at this stage.

**Important technical/source nuance:** UCI Online Retail II is **verified available**, but neither downloaded nor integrated in this conversation; “serves as a reference dataset” should not be mistaken for a completed benchmark. It is originally an XLSX file, 43.5 MB. Retailer upload design initially accepts CSV, and conversion is a separate step.

### S5.2 Acquisition methods and cleaning [DRAFT]

Checkbox recommendation: **Bulk Upload (CSV/XLSX/PDF intake)** only, with **CSV specifically being the initially supported subset**. This UI category does **not** mean the app promises XLSX or PDF support. Others (scrapers, MCP, OCR, RSS, speech, webhooks) not selected in drafts.

> ReorderLens AI uses a straightforward data import process designed for small retailers who may not have advanced inventory systems.
>
> Retailers upload historical sales records in CSV format. The system validates the file structure, checks required fields, identifies missing or inconsistent values, and prepares the records for forecasting.
>
> Data validation also handles issues such as duplicate transactions, cancelled orders, and invalid quantities. Retailers provide stock levels and supplier lead times separately so recommendations reflect their actual business conditions.
>
> This approach keeps data collection simple and avoids relying on expensive integrations or third-party services. Additional import formats and integrations can be supported without changing the core forecasting architecture.

Scrapers/Crawlers: “Not applicable — the core data pipeline uses authorized retailer uploads and licensed public datasets rather than web scraping.” MCP servers: “Not applicable — data access is handled through the application's backend and database interfaces. No MCP data-access integration is claimed.” These were suggested if corresponding optional field required a value.

### S5.3 Raw parsing formats, parsers and conversion [DRAFT]

Assistant recommended **CSV + JSON** for raw/data exchange, not XLSX/PDF/Parquet/AVRO etc. as implemented support.

> **Parsers Used**
>
> ReorderLens AI's data pipeline is designed around Python and Pandas for reading and processing CSV sales records. Pydantic provides structured validation for incoming API data and normalized records.
>
> The system focuses on reliable parsing of transaction dates, product identifiers, quantities, and prices. Since our primary inputs are structured records, we avoid unnecessary LLM-based document parsing.
>
> **Formatters / Converters**
>
> ReorderLens AI converts uploaded CSV records into a consistent internal data structure for storage and forecasting. Pandas handles data transformations, while the backend exchanges validated information through JSON APIs.
>
> Dates, numeric values, and product identifiers follow consistent formats so sales records from different retailers can be processed through the same forecasting pipeline.

### S5.4 Data cleaning and schema validation [DRAFT]

> **Data Cleaning & Enrichment**
>
> ReorderLens AI prepares sales records through a consistent cleaning process that identifies duplicate transactions, missing values, invalid dates, inconsistent product identifiers, and unusual quantities.
>
> Returns and cancelled orders are handled separately rather than being treated as ordinary sales. Product-level transactions are organized into daily sales histories, with missing periods and unusual demand patterns identified before forecasting.
>
> The system also combines sales histories with retailer-provided stock levels and supplier lead times to support practical replenishment recommendations. Data quality issues are made visible instead of being silently ignored.
>
> **Schema Validation**
>
> Pydantic defines the expected structure and data types of incoming records. Validation checks required fields, date formats, product identifiers, quantities, and other relevant constraints.
>
> Invalid records are rejected or flagged with understandable error messages so retailers can correct their files.
>
> Database constraints provide an additional layer of protection against inconsistent records. The goal is to ensure that forecasting models receive reliable, well-structured data rather than accepting every uploaded value without verification.

### S5.5 Storage target and schema [DRAFT]

Assistant recommended only **Relational (Postgres/MySQL)** checkbox, **PostgreSQL** preferred. No vector, document DB, warehouse, lakehouse, graph DB, separate cache committed.

> ReorderLens AI uses a relational data model designed around retailers, products, sales transactions, inventory records, forecasting results, and replenishment recommendations.
>
> PostgreSQL is our preferred database because it supports structured relationships, reliable transactions, and efficient queries without requiring complex infrastructure.
>
> Each retailer's records are associated with its own account or business identifier, allowing the application to enforce appropriate data access boundaries.
>
> Indexes on frequently queried fields, such as product identifiers and transaction dates, support efficient historical analysis and forecasting.
>
> The data pipeline keeps track of import batches and validation results so problems can be traced back to their source. Retailers retain control over their business information, with access restrictions and appropriate data deletion procedures forming part of the system design.
>
> Our priority is a database structure that remains simple enough to maintain while supporting reliable forecasting and future growth.

---

## S6. Visualization, Insights, Pipelines and Outbound APIs

### S6.1 Visualization (open source preferred) [DRAFT]

Assistant's preferred checkbox: **Recharts**, not D3, ECharts, Plotly, Superset, Metabase, Grafana, Kibana, Dash/Streamlit or Chart.js as a second stack. No evidence Recharts integrated.

> ReorderLens AI uses clear, interactive visualizations to help retailers understand their sales patterns, future demand, and inventory risks.
>
> The dashboard is designed around line charts that compare historical sales with predicted demand, bar charts that highlight products requiring attention, and simple indicators showing stock levels and recommended reorder quantities.
>
> Retailers can filter information by product and date range, explore individual data points, and understand the reasoning behind inventory recommendations. Forecast uncertainty is displayed where the model provides reliable estimates, helping users distinguish predictions from actual sales.
>
> Visualizations update when new sales data is processed, rather than depending on continuous live data feeds. The interface prioritizes responsive layouts, readable labels, accessible colors, and supporting data tables so important information is not communicated through charts alone.
>
> Recharts is our preferred open-source library for implementing these visualizations.

**Qualification:** Prediction uncertainty must be supported by a valid estimator/calibration; no fake confidence bands.

### S6.2 Dashboards & Reports [DRAFT]

> ReorderLens AI brings sales trends, demand forecasts, and inventory recommendations together in one dashboard designed for small retailers.
>
> The main dashboard highlights products at risk of running out, items with changing demand patterns, and suggested replenishment actions. A product-level view provides historical sales, forecast demand, current stock information, and the factors behind each recommendation.
>
> A separate evaluation view compares forecasting methods using historical test data, making model performance and limitations visible rather than treating AI predictions as unquestionable.
>
> Retailers can review recommendations before making purchasing decisions. The interface also distinguishes actual sales figures from forecasts and simulated outcomes.
>
> Our focus is a practical dashboard that supports everyday decisions without requiring users to understand machine learning or work with complex analytical tools.

### S6.3 Insight method selections

Assistant proposed four architecture categories if plans are permitted: **Classical ML**, **Forecasting**, **Rule Engine / Heuristics (non-AI)**, **Statistical Analysis**. Not deep learning, LLM/RAG, separate ML anomaly detector, or clustering by default. Their actual implementation is **not** evidenced.

### S6.4 AI / ML Details [DRAFT]

> ReorderLens AI uses time-series machine learning to estimate future demand for individual products based on historical sales patterns.
>
> The forecasting approach considers factors such as recent sales, previous demand trends, seasonality, and calendar-related patterns where sufficient data is available. Classical machine learning models, including LightGBM as a candidate, are compared with simpler statistical methods to determine which approach provides reliable predictions.
>
> Publicly available retail datasets support model development and benchmarking, while authorized retailer sales records provide the context for business-specific forecasts.
>
> Model evaluation uses chronological backtesting to prevent future information from influencing earlier predictions. Forecasting accuracy is assessed using appropriate metrics such as WAPE and MASE, with particular attention to products that have limited or irregular sales histories.
>
> The system connects these forecasts to inventory decisions without relying on language models for numerical calculations. Its evaluation framework measures forecasting quality separately from the simulated business impact of replenishment recommendations.

### S6.5 Non-AI Analytics [DRAFT, supplied in conversation as prose]

> ReorderLens AI combines machine learning predictions with transparent business calculations to turn forecasts into practical recommendations.
>
> SQL queries and statistical analysis organize historical sales, calculate product-level demand trends, and summarize inventory performance. The system uses deterministic rules to calculate replenishment requirements based on predicted demand, available stock, supplier lead times, and configurable safety-stock settings.
>
> Retailers can understand which inputs influence a recommendation and how changing stock levels or delivery times affects the result.
>
> Key indicators include historical sales, forecast error, inventory coverage, potential stockout risk, and recommended reorder quantities. Controlled simulations also support comparisons between replenishment strategies, with simulated outcomes clearly separated from actual business performance.
>
> This approach keeps important purchasing calculations consistent, auditable, and understandable while allowing machine learning to handle demand prediction.

### S6.6 How are insights delivered? [DRAFT]

> ReorderLens AI delivers insights through a simple, interactive web dashboard designed for small retailers.
>
> The dashboard brings together historical sales, predicted demand, potential stockout risks, and recommended reorder quantities. Retailers can explore individual products, compare actual sales with forecasts, and understand the factors behind each recommendation.
>
> Products that may require attention are highlighted through clear, in-app alerts. Each recommendation includes relevant figures, such as predicted demand, available stock, and supplier lead time, so business owners can make informed decisions rather than blindly following AI predictions.
>
> Insights are refreshed when new sales data is processed. Our focus is to make complex forecasting results understandable and useful without overwhelming retailers with technical information.

### S6.7 Pipelines & Orchestration [DRAFT]

> **Orchestration**
>
> ReorderLens AI follows a modular data-processing pipeline coordinated by its Python backend. Each stage handles a specific task: validating uploaded records, cleaning and preparing sales data, generating demand forecasts, calculating inventory requirements, and preparing recommendations for the dashboard.
>
> The pipeline separates machine learning from deterministic inventory calculations, making failures easier to identify and individual components easier to test. The architecture does not depend on a dedicated orchestration platform such as Airflow or n8n.
>
> **Scheduling / Triggers**
>
> Data processing is triggered when a retailer uploads new sales records and confirms the import. The system validates the data, updates the relevant sales history, and initiates forecast generation when the required information is available.
>
> Forecasts can also be refreshed on demand. This approach keeps processing predictable and avoids unnecessary background activity.
>
> **Streaming / Real-time**
>
> Continuous data streaming is not required for ReorderLens AI's initial workflow. Retailers provide sales records through batch imports, and the dashboard reflects newly processed information.
>
> The system is designed to support future integrations without making real-time POS connections, message brokers, or streaming infrastructure dependencies of the core product.

### S6.8 Outbound — APIs, Webhooks/Exports, Embeddings/Serving and Open Source Stack [DRAFT]

> **Outbound APIs**
>
> ReorderLens AI uses a REST-based API architecture connecting its web interface with backend services. The API provides access to validated sales records, product information, demand forecasts, inventory risk indicators, and replenishment recommendations.
>
> FastAPI is our preferred backend framework. The API design includes structured JSON responses, input validation, clear error handling, and authenticated access to retailer-specific business data.
>
> The initial API serves the ReorderLens AI application rather than acting as a public third-party integration platform.
>
> **Webhooks & Exports**
>
> ReorderLens AI supports a straightforward data-export approach, allowing retailers to download forecast results and recommended reorder quantities in CSV format.
>
> External webhooks and automated supplier integrations are not required for the core workflow. Purchasing decisions remain under the retailer's control rather than triggering automatic orders.
>
> **Embeddings / Model Serving**
>
> Demand forecasting is handled by a dedicated Python machine learning component connected to the application backend. The forecasting component receives validated historical sales data and returns structured predictions for inventory analysis.
>
> The inventory decision engine uses these predictions alongside stock information and supplier lead times to calculate recommendations.
>
> Vector embeddings and dedicated LLM inference infrastructure are not required for the core forecasting process. The architecture keeps model selection flexible so forecasting methods can be compared and improved without redesigning the application.
>
> **Open Source Stack**
>
> ReorderLens AI's defined technology stack uses Python for backend and forecasting development, Pandas for data preparation, scikit-learn for baseline models and evaluation, FastAPI for API services, and PostgreSQL for structured business data.
>
> LightGBM is a candidate for demand forecasting, subject to performance evaluation. The web interface is designed around Next.js and React, with Recharts for visualizing sales trends, forecasts, and inventory recommendations.
>
> These technologies form our intended implementation stack. They have not yet been integrated into a verified working build, and the final forecasting model is determined through testing rather than assumed in advance.

---

## S7. Data Quality, Privacy and Observability

### S7.1 Data Quality [DRAFT]

> ReorderLens AI's data quality process focuses on making sure unreliable sales records do not produce misleading forecasts.
>
> The data pipeline checks uploaded files for missing required fields, duplicate transactions, invalid dates, inconsistent product identifiers, and incorrect quantities. Returns and cancelled orders are identified separately, while missing sales periods are examined before being treated as zero demand.
>
> Records that fail validation are flagged with understandable error messages so retailers can correct their data. Each import includes data quality checks before the records enter the forecasting pipeline.
>
> Since ReorderLens AI uses retailer-provided batch uploads, data freshness is measured against the latest successful import rather than an assumed real-time feed. The dashboard makes outdated or insufficient sales history visible.

### S7.2 Privacy & Compliance [DRAFT]

> ReorderLens AI follows a data-minimization approach. Its core forecasting process requires product sales, inventory levels, and supplier lead times, not customers' personal identities.
>
> Retailers provide their business data through authorized uploads. The architecture includes authenticated access, business-level data isolation, encrypted connections, and controlled storage of sensitive information.
>
> Uploaded data is treated as untrusted input and validated before processing. Retailers have control over their records, including appropriate deletion and retention procedures.
>
> External AI services do not need access to complete transaction histories. Any optional AI-generated explanations use only the relevant forecasting results and inventory figures.

### S7.3 Lineage & Observability [DRAFT]

> ReorderLens AI is designed to make its forecasting process traceable and understandable.
>
> Each data import is associated with a unique batch identifier, source information, processing status, and validation results. Forecast records can be linked to the sales data, model version, and inventory inputs used to generate them.
>
> The backend design includes structured logging for data-processing errors, failed forecasting jobs, and API failures. Processing status and data-quality warnings are visible to users when appropriate.
>
> Model evaluation tracks forecasting performance over historical test periods, allowing us to identify unreliable predictions and compare models against simpler baselines.
>
> Our goal is to make it possible to explain where a recommendation came from, how it was calculated, and what limitations may affect its reliability.

### S7.4 Cost & Performance [DRAFT]

> ReorderLens AI is designed to remain affordable for small retailers without requiring expensive AI infrastructure.
>
> Sales records are processed through batch imports, and forecasting runs when new data is available or a refresh is requested. Reusable model results and efficient database queries help avoid unnecessary processing.
>
> The core forecasting engine uses time-series machine learning, while inventory calculations rely on deterministic logic. This avoids repeated LLM calls for tasks that do not require language models.
>
> The architecture also supports processing multiple product forecasts efficiently and separating longer forecasting jobs from normal dashboard requests.
>
> Performance evaluation covers processing time, forecast-generation latency, API response time, and infrastructure costs. Optimization decisions are based on measured results rather than assumptions.

### S7.5 Anything Else About Your Data Stack? [DRAFT]

> One important design decision in ReorderLens AI is separating demand forecasting from inventory calculations.
>
> Machine learning analyzes historical sales patterns and estimates future demand. A separate decision engine combines those predictions with stock levels, supplier lead times, and business constraints to calculate practical replenishment recommendations.
>
> This separation makes the system easier to test, explain, and maintain. It also allows us to improve forecasting models without rebuilding the inventory management workflow.
>
> We recognize that historical sales do not always reflect actual customer demand, especially when products have been out of stock. The system therefore treats forecasts as estimates, makes data limitations visible, and uses clearly documented assumptions when simulating inventory outcomes.
>
> Our architecture prioritizes reliable batch processing, transparent calculations, and human-reviewed recommendations over unnecessary automation. The goal is to give smaller retailers useful intelligence without making the system difficult to understand or operate.

### S7.6 Publish local environment to internet — tool selections

Assistant recommended no ngrok, Cloudflare Tunnel, Tailscale, localtunnel, etc. claims until actually used. Cloudflare Tunnel was mentioned only as an optional controlled demo tool. No tool was selected in visible screenshot. Vercel hosting is distinct from a tunnel.

---
## S8. Build Provenance and Tooling / IDE

### S8.1 Data & AI Provenance — Data Sources [DRAFT]

> ReorderLens AI is designed around two primary data sources: historical sales records provided by retailers and publicly available retail datasets used for model development and evaluation.
>
> Our selected reference dataset is UCI Online Retail II, which contains historical transactions from a UK-based retailer and is available under the CC BY 4.0 license. It provides a useful foundation for studying sales patterns and evaluating demand forecasting methods.
>
> For business-specific predictions, retailers provide authorized sales records through CSV uploads, along with current stock levels and supplier lead times. The system stores validated transactions, product information, forecasts, and inventory recommendations in a structured database.
>
> We collect only information relevant to inventory planning. Customer identities are not required for forecasting, and unnecessary personal information is excluded from the processing pipeline.
>
> The public dataset supports forecasting research, while inventory simulations use clearly documented assumptions. We do not claim access to live retailer data or external business partnerships at this stage.

### S8.2 Data & AI Provenance — AI Models [DRAFT]

> AI has supported our project research, technical planning, and solution design. ChatGPT has helped us examine different approaches, identify implementation risks, and refine the ReorderLens AI concept. We review AI-generated suggestions critically rather than accepting them without verification.
>
> The product's core intelligence is based on time-series demand forecasting. Our technical approach compares simpler statistical forecasting methods with suitable machine learning models, including LightGBM as a candidate. Model selection is based on measured forecasting performance rather than complexity alone.
>
> We keep demand prediction separate from inventory calculations. Forecasting models estimate future demand, while deterministic business rules calculate replenishment recommendations using stock levels, supplier lead times, and other relevant constraints.
>
> Language models may support clear explanations of these results, but they are not responsible for generating inventory quantities or making autonomous purchasing decisions.
>
> The forecasting models have not yet been trained, benchmarked, or deployed as part of ReorderLens AI.

**Conflicting form selection:** Earlier screenshot had 5 LLMs selected; prose only confirms ChatGPT. Verify real usage rather than copying five unsupported model claims.

### S8.3 Data & AI Provenance — Responsible AI [DRAFT]

> We believe retailers should be able to understand and question AI recommendations, especially when those recommendations affect how they spend their money.
>
> ReorderLens AI follows three principles: protect business data, make predictions transparent, and keep people in control.
>
> The system collects only the information needed for forecasting and inventory planning. Retailer data is handled through authenticated access, business-level data isolation, input validation, and appropriate storage safeguards. Personal customer information is not required for the core workflow.
>
> Forecasts are treated as estimates, not guaranteed outcomes. The system identifies missing or insufficient data, communicates prediction limitations, and provides understandable explanations for replenishment recommendations. Inventory calculations follow defined business rules rather than relying on unrestricted language-model responses.
>
> Our evaluation approach compares forecasting models against simple baselines using chronological testing. We also distinguish simulated inventory improvements from verified business results and avoid making unsupported accuracy or revenue claims.
>
> Retailers remain responsible for approving purchasing decisions. ReorderLens AI provides decision support rather than automatically placing orders.
>
> These safeguards are part of our defined system design and require implementation and validation before deployment.

### S8.4 Tooling & IDE: selected editor, hosting, framework fields

**[VISIBLE UI]** Editor: **VS Code**, and “Required — completed” badge on Tooling & IDE. Its deployment/framework/memory fields were visually empty placeholders in the last screenshot, so actual saved data is unknown.

**[OWNER-DECISION]** User explicitly chose **Vercel** as deployment target. Assistant revised deployment answer twice. The latest short entry is:

> Deployment target: Vercel for the Next.js web application and lightweight serverless APIs, with managed PostgreSQL for data storage. Python/FastAPI handles forecasting and inventory logic. Model training runs separately from live requests to avoid serverless resource limitations.

An earlier, longer draft additionally mentioned HTTPS, Git deployment, authentication, public `/docs` and “not yet deployed,” but **should not supersede** the concise updated draft unless the user prefers detail. Claims of public `/docs` depend on actual check/implementation.

**Latest short Frameworks & Libraries [DRAFT]:**

> Next.js, React, TypeScript, and Recharts for the frontend; Python, FastAPI, and Pydantic for backend services and API validation; Pandas for data processing; scikit-learn for forecasting baselines and model evaluation; PostgreSQL for structured data storage. LightGBM is a candidate forecasting model, subject to performance testing.

**Latest short Context / Memory Files [DRAFT]:**

> Our project requirements, technical direction, and architecture decisions are currently documented in the competition submission materials. During development, a repository-level AGENTS.md file provides consistent instructions for AI coding assistants, covering project scope, architecture, coding standards, data security, and testing requirements. Supporting documentation defines the database schema, API contracts, and forecasting evaluation approach. No repository-specific AI memory files have been created yet.

**MCP fields:**

- MCP Servers: “None implemented or used for ReorderLens AI.”
- Tools Exposed: “None through MCP.”
- Permissions: “Not applicable; no MCP tools are configured.”

All of these are assistant-suggested form values, not proof that a user pasted them.

---

## S9. Prompt Library: Two Real Planning-Prompt Excerpts

**Portal screenshot:** Library shows “1 prompts,” with blank/Untitled Prompt, category Other, Prompt Text, Output Summary and proprietary toggle. The assistant drafted **two** entries based on real earlier user instructions in this conversation. Neither proves the library was populated or code generated. For exact prompt provenance, the next chat should use actual original full user messages; following are faithful **edited excerpts** clearly labeled.

### S9.1 Entry 1 — Challenge Evaluation & Project Selection

**Title:** AI-Assisted Challenge Evaluation & Project Selection  
**Category suggestion:** Research / Planning / Strategy or Other  
**Mark proprietary:** OFF (suggested)

**Prompt text [extracted excerpt; not full original]:**

> Now that I have provided the complete details of the five shortlisted challenges, I want you to conduct a deep, critical, and evidence-based comparative analysis of all five challenges and rerank them from strongest to weakest.
>
> Our ultimate goal is to select the single best challenge that gives us the strongest realistic chance of becoming champions while remaining feasible to build through vibe coding.
>
> Do not simply repeat your previous rankings. Reevaluate all five challenges from scratch using their complete requirements, official judging criteria, technical constraints, and our team's capabilities.

**Output summary [DRAFT]:**

> The prompt produced a comparative evaluation of five challenges: DemandIQ, SkillBridge, Quality Vision, Food Waste Zero, and ContractMind.
>
> The analysis examined judging-criteria alignment, technical feasibility, available datasets, implementation complexity, differentiation, business potential, and risks associated with AI-assisted development.
>
> DemandIQ emerged as the recommended option because it offered the strongest balance of measurable AI functionality, practical business value, and realistic implementation scope.
>
> This analysis informed our decision to select DemandIQ under CommerceSphere AI and establish ReorderLens AI as our project concept. The output supported research and decision-making; it did not produce or validate a working implementation.

### S9.2 Entry 2 — Competition Research & Judging Criteria Analysis

**Title:** Competition Research & Judging Criteria Analysis  
**Category suggestion:** Research / Planning / Other  
**Mark proprietary:** OFF (suggested)

**Prompt text [edited excerpt; not full original]:**

> Before we choose our domain and challenge for the competition, I want you to conduct a deep, comprehensive analysis of the entire official competition website (https://cloudcampbd.com/ai-builders-congress).
>
> Our goal is not merely to participate—we want to maximize our chances of winning and aim for the top position. Therefore, choosing the right domain and challenge is a critical strategic decision, and we must approach it carefully rather than rushing into a choice.
>
> First, thoroughly explore and analyze every relevant part of the website, including:
>
> - Competition overview, objectives, rules, and eligibility.
> - Available domains and challenges.
> - Judging criteria, scoring weights, and evaluation priorities.
> - Submission requirements, deadlines, and restrictions.
> - Previous competitions, winning projects, and relevant lessons.
> - Resources, mentorship, and opportunities for competitive differentiation.
>
> Verify important details against official sources and distinguish confirmed information from assumptions or strategic recommendations.
>
> Do not select a domain or challenge yet. First, complete the research and present a structured strategic report to guide our decision.

**Output summary [DRAFT]:**

> The prompt produced a structured research report covering the International AI Builders Congress 2026, its competition format, eligibility requirements, judging criteria, submission guidelines, and strategic expectations.
>
> The analysis identified important considerations, including the reported team-size requirement, preliminary submission deadline, AI usage policies, and differences between published judging frameworks. It also established a practical evaluation approach focused on innovation, technical feasibility, business value, real-world impact, and responsible AI.
>
> This research provided the foundation for evaluating the competition's 55 challenges and eventually selecting DemandIQ as the challenge for ReorderLens AI.
>
> The output supported competition research and strategic planning, not software implementation.

---

## S10. Submission Snapshot, Conflicts and Cross-Field Constraints

### S10.1 Known on-screen field completion state

- Initial Story navigation displayed `0/30` and a red badge of **5**; Proof `0/25`, red badge **2**; AI-Native Build `0/110`; Data Lifecycle `0/25`; Prompt Library red **2** at one snapshot. These are **UI scores**, not official 100-point weighted judging scores.
- At a later form snapshot, a warning listed missing **Problem Statement, Solution Description, Data & AI Provenance, Tooling & IDE, YouTube Video, Demo/Live Links**; later Tooling marked completed, but its fields were visually blank. **No screenshot proves final all-fields-valid state**.
- Selected checkboxes shown: **ChatGPT, Gemini, DeepSeek, Llama, Qwen** in models; **v0, Gemini Canvas, ChatGPT Canvas** in frontend builders; **VS Code** as editor. Other selected fields are recommendations in assistant text, **not proof that user selected**.
- The `Data & AI Provenance` section shows **“Required — missing”** before assistant drafted three entries. No later screenshot showing completed state.
- **YouTube video, Demo/Live URLs, one-page summary file, actually clicked submit/receipt and deadline hour:** no artifacts supplied to this conversation.

### S10.2 Cross-field constraints to preserve

| Repeated promise / technical boundary | Appears in fields | Consequence for future build or correction |
|---|---|---|
| Product named **ReorderLens AI**, challenge **DemandIQ** | Elevator, public summary, problem/solution, AI depth, provenance, tooling | Consistently separate labels |
| Bangladesh **small/medium retail** initial focus | Story/problem, summary, market/impact | Validate users; do not invent interview data |
| CSV upload + clean data before forecasting | Solution, Data Sources, Parsing, Pipelines | Working CSV vertical slice and error states must be feasible |
| Forecast product-level demand; inspect stock/lead time; explain reorder recommendation | Story, AI ML, reports, toolchain | Central product promise, not optional decoration |
| Statistical baselines + ML forecast, **LightGBM as candidate** | AI ML, evaluation, provenance, tools | No reason to commit model blindly; train only after tests |
| Separate deterministic inventory arithmetic from model | Many fields | Explainability, lower cost, preserve human control |
| Chronological test, WAPE/MASE where appropriate, simulator for hypothetical outcomes | Evaluation, dashboards, Responsible AI | No unmeasured accuracy/stockout reduction claims |
| Batch imports rather than continuous POS streaming | Data Sources, Pipeline, Visualization | Avoid real-time integrations in MVP |
| Minimal PII, retailer authorization, auditability and deletion | Guardrails, Quality & Governance, provenance | Security tests must match claims before real-data exposure |
| No MCP, RAG, multi-agent/fine-tuning/local LLM required | AI Depth, Local LLM, agent frameworks, toolchain | Do not add solely for points |
| Vercel as primary deployment target | User direct instruction, Tooling draft | Validate Vercel Python/ML/CSV upload limits |
| Public `/docs` route recommended | AI Depth and deployment draft | If YES checked, must deliver public docs; not confirmed selected |
| Google Antigravity future primary build tool | Current handover user instruction, not previous form draft | The next architecture and coding method can be chosen during planning but must not falsify past tooling provenance |

### S10.3 Suggested status language discipline

- **Product definition:** “ReorderLens AI analyzes…” may characterize the designed product, **only when the field asks about concept/features**.
- **Actual usage:** “We used…”/“We benchmarked…”/“We deployed…” requires genuine proof. No actual model, deployment or tests were shown here.
- **Unknown but mandatory fields:** explain intended methodology and pending verification, do not claim concrete false outputs or fabrications.
- **Optional tools:** truthful “Not applicable/Not implemented” is preferable to a checkbox falsely indicating actual use.
- **Provenance:** Training/benchmarking using UCI Online Retail II is only a *candidate/source*, verified as available; data has not been demonstrated processed or tested.
- **Final user approval:** Do not treat the existence of these drafts as approval of a complete build specification. The new chat must first plan, then wait for owner's explicit approval before generating final build docs and Antigravity prompts.

---

**End of submission-draft companion.** Return to [DEMANDIQ_MASTER_CONTEXT.md](DEMANDIQ_MASTER_CONTEXT.md) for authoritative priorities and unresolved issues.
