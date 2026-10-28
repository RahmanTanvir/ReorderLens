# ReorderLens AI

**Smarter restocking decisions, starting with the sales data a shop already has.**

**International AI Builders Congress 2026** · **DemandIQ Challenge** · **CommerceSphere AI**  
**Team:** The White Hole (4 members) · **Track:** Idea to Unicorn — Team-Built Product

> **Project status — concept and demonstration website**  
> ReorderLens AI is currently an idea supported by a website demo that explains the intended experience. **The full product has not yet been developed or validated.** Our team has been balancing midterm examinations and will begin full development after the exams. The demo uses **synthetic sales data**; its examples are not evidence of real retailer results, proven forecast accuracy, or a production-ready service.

## The problem

A customer comes to a small shop looking for a popular product, but it is out of stock. The shop misses a sale. Meanwhile, other products may sit unsold, tying up money that the owner needs for the business.

For many small retailers, deciding **what to reorder, how much to buy, and when to buy it** is difficult. Sales history may exist in spreadsheets or basic records, but turning that information into useful inventory decisions takes time and expertise.

## Our idea

**ReorderLens AI** aims to make demand forecasting and inventory planning more accessible to small retailers, starting with businesses in Bangladesh.

Instead of asking an owner to interpret complex reports, the proposed system would connect sales patterns to a practical question:

> **Based on expected demand, current stock, and delivery time, how much should I reorder?**

The goal is to help retailers reduce avoidable stock shortages and unnecessary overstocking, while keeping the final purchasing decision in their hands. These benefits are **intended outcomes**, not results we have measured.

## How ReorderLens AI is intended to work

1. **Import sales history.** A retailer provides product-level sales records in a simple CSV format.
2. **Prepare the data.** The system checks dates, product identifiers, quantities, and missing information.
3. **Estimate future demand.** Forecasting methods analyze historical patterns to estimate demand for the next 14 days.
4. **Consider the current inventory.** The retailer enters available stock, supplier lead time, and an optional safety-stock buffer.
5. **Review a reorder suggestion.** The system translates forecast demand into an estimated replenishment quantity with a clear explanation. The retailer decides whether to act.

**Proposed flow:** Sales history → Data checks → Demand estimate → Inventory calculation → Human-reviewed reorder decision

## What the concept demo shows

The website is a **visual and interactive explanation of our proposed product**, not the completed inventory platform. Its screens illustrate the following journey:

| Demo section | What it illustrates |
| --- | --- |
| **Overview** | A simple place to review products, sales history, and demand estimates. |
| **Import Sales** | How a retailer could upload a CSV and review a sample dataset. |
| **Demand Forecast** | How past sales and a 14-day estimate could be shown together, with a comparison of forecasting approaches. |
| **Recommendations** | How current stock and supplier lead time could lead to an understandable suggested reorder quantity. |
| **Docs & Provenance** | The proposed workflow, forecasting approach, assumptions, and limitations. |

The supplied demonstration data contains **five example products with 120 days of synthetic sales history each**. Any charts, forecast values, or reorder quantities shown are **illustrative scenarios** and should not be interpreted as independently validated predictions.

## What we want to do differently

- **Make forecasts actionable.** A predicted sales number is useful only when it helps answer a real inventory question.
- **Keep the reasoning visible.** Owners should be able to see how stock, expected demand, and supplier lead time affect a recommendation.
- **Use an appropriate forecasting method.** We intend to compare machine-learning forecasts with simpler baselines instead of assuming the more complex model is always better.
- **Keep people in control.** The product is intended to support purchasing decisions, not automatically place supplier orders.
- **Make the experience approachable.** CSV-based input and plain-language explanations can reduce the need for specialist software knowledge.

These are **product goals**, not completed or tested capabilities.

## Intended users

Our initial focus is **small and medium-sized retailers**, particularly shops that manage many products but have limited access to dedicated forecasting or inventory-planning tools. The concept may also be relevant to independent store managers and small retail teams.

## Data, AI, and responsible use

The planned forecasting approach will explore time-series features and compare candidates such as **Ridge regression** with a **weekly seasonal-naive baseline**. Replenishment quantities would be calculated from forecast demand and inventory inputs using transparent rules.

We intend to use permitted data, validate CSV inputs, explain uncertainty, and protect any retailer information we later collect. Historical sales can understate actual demand when a product was out of stock, so sales forecasts must not be treated as guarantees. We will not claim reduced stockouts, increased revenue, or forecasting accuracy until these outcomes have been evaluated with appropriate evidence.

**Current evidence boundary:** The website and synthetic examples explain the concept. They do **not** establish customer adoption, real-world model performance, or commercial impact.

## Development roadmap

**After our midterm exams**, we intend to work through these stages:

1. **Build the core product:** Reliable CSV import, validation, forecasting, and explainable reorder calculations.
2. **Test the approach:** Compare forecasting methods against simple baselines using time-ordered evaluation and check the inventory calculations with test cases.
3. **Improve the product experience:** Refine the dashboard, error handling, accessibility, and documentation based on testing.
4. **Validate with retailers:** Seek feedback from real shop owners, understand their workflows, and test whether recommendations are useful in practice.
5. **Prepare for wider use:** Assess secure data storage, account access, deployment, and operating costs before any real-world rollout.

These are proposed next steps; no production launch date or validated performance target is being claimed.

## Competition submission

ReorderLens AI is our concept for the **DemandIQ** challenge, which focuses on **demand forecasting and inventory intelligence for small and medium-sized enterprises**.

Our submission video walks through the demonstration website, explains the inventory problem, and shows the decisions we want the eventual product to support. We are presenting the project at its **concept stage**, with the aim of developing and validating the full solution after our examinations.

---

**ReorderLens AI — From sales history to smarter restocking.**  
**Team The White Hole** · International AI Builders Congress 2026
