# Retirement Runway Calculator — Spec

Last updated Oct 12, 2026 · Kiran

## Goal and design principles

The tool answers one question from about ten numbers: how many years do my savings last, split into bridge years (before penalty-free access to retirement accounts) and retirement years.

- **Summary numbers only.** No account linking, no transaction import. One balance per bucket, one monthly spending number.
- **Age-based.** Every result is shown as an age ("money lasts to 84") as well as a number of years.
- **Bucket-aware.** Brokerage, traditional 401k/IRA and Roth are taxed and accessed differently, so they are tracked separately.
- **Simple by default, honest about it.** Sensible defaults for growth, inflation and tax, each shown on screen and editable.
- **Instant.** Results update as you type; no sign-up needed.

**Implementation:** [`index.html`](../index.html) in this repo, a single static page.

## Inputs

A couple needs about ten fields for a first answer; everything else has a default. The examples below are what the page opens with. Penalty-free access at 59½ follows Spouse 1, assumed to own most of the traditional balance.

| Field | Example | Required | Default |
| --- | --- | --- | --- |
| Spouse 1 age | 52 | Yes | — |
| Spouse 2 age | 50 | Yes | — |
| Spouse 1 retires at | 52 (now) | Yes | Current age |
| Spouse 2 retires at | 55 | Yes | Current age |
| Take-home pay until retiring, Spouse 1 (monthly) | $0 | No | $0 |
| Take-home pay until retiring, Spouse 2 (monthly) | $8,000 | No | $0 |
| Monthly expenses, excluding pre-65 healthcare (today's dollars, after tax) | $20,000 | Yes | — |
| Pre-65 healthcare, per person per month | $1,500 | Yes | $1,500; starts when both have retired, stops for each spouse at 65 |
| Brokerage (taxable) balance | $2,000,000 | Yes | — |
| Traditional 401k / IRA, both spouses combined | $2,500,000 | Yes | — |
| Roth IRA / Roth 401k, both spouses combined | $400,000 | Yes | — |
| Cash / savings | $0 | No | $0 |
| Social Security, Spouse 1: monthly amount and start age | — | No | None, start 67 |
| Social Security, Spouse 2: monthly amount and start age | — | No | None, start 67 |
| Roth conversions on | Yes | No | On |
| Target Roth balance | $1,000,000 | No | $1,000,000 |
| Start conversions at Spouse 1 age | 52 | No | Spouse 1 retirement age |
| Reach target by Spouse 1 age | 59½ | No | 59½ |
| Taxable wages while a spouse still works (yearly) | $130,000 | No | $0 |
| State tax on conversions | 0% | No | 0% |
| Expected return, after inflation | 4% | No | 4% real; 0% option for "no growth" |
| Inflation | 2.5% | No | 2.5% (only for showing future dollars) |
| Effective tax rate on traditional withdrawals | 20% | No | 20% |
| Tax rate on brokerage gains | 15% | No | 15% federal long-term rate |
| Brokerage cost basis (% of balance) | 50% | No | 50% |
| Roth contributions (penalty-free portion) | $0 | No | 0, so Roth stays untouched until 59½ |
| Pension: monthly amount and start age | — | No | None |
| Plan-to age (younger spouse) | 95 | No | 95 |
| Rule of 55 (Spouse 1 leaves employer at 55+) | No | No | No |

## Guided setup

A first-time visitor answers eight short questions, one screen each, then lands on the full calculator with every input filled in and still editable.

| Step | Asks | Notes |
| --- | --- | --- |
| Welcome | — | What it asks, about two minutes, nothing leaves the browser; Skip shows the example |
| Ages | Your age, spouse's age | 30 to 85 |
| Retirement | Age each of you stops working | "Already retired? Enter your current age"; can't be before current age |
| Take-home pay | Monthly pay for whoever still works | Shown only if someone is still working, only for that person |
| Spending | Monthly spending, pre-65 health insurance per person | Spending required; healthcare defaults to $1,500 |
| Savings | Brokerage, 401k/traditional, Roth, cash | At least one balance; blanks count as $0 |
| Social Security | Each benefit and start age | Optional; start age 62 to 70, default 67 |
| Roth conversions | Yes / Not now; target, start age, target age, wages while working | Wages shown only if someone still works; target age must follow start age |
| Review | Every answer with an Edit link | "See my runway" fills the calculator |

**Behavior**

- Shown on first visit only. Skipped for returning visitors with saved inputs and for scenario links; adding `#setup` to the page address forces it.
- From the savings step on, an "early read" shows roughly when money runs out (without conversions), updating as you type.
- Each step validates before moving on and says what to fix; Enter continues, Escape closes.
- Answers it doesn't ask about (return, inflation, tax rates, cost basis, pension, plan-to age) use the calculator's defaults.
- After setup, a **Run setup again** button reopens it prefilled with the current inputs, starting at the ages step.

## Outputs

The headline is three numbers: bridge runway, retirement runway, and the age the money runs out (or "lasts past 95").

- **Bridge runway:** years the brokerage, cash and Roth contributions cover from the first spouse's retirement until Spouse 1 reaches 59½, and whether that is enough ("7.5 of 7.5 years, covered", "needs penalty withdrawals" or "short").
- **Retirement runway:** years from 59½ until all buckets are empty.
- **Depletion age:** shown for both spouses ("lasts until 84½ and 82½"), or the amount left at the plan-to age.
- **Sustainable spending:** the monthly amount that would last exactly to the plan-to age.
- **Roth conversion plan:** the yearly conversion needed to hit the Roth target, total converted, tax on conversions and its effective rate, top federal bracket reached, and Roth balance at the target age.
- **With vs without conversions:** money lasts to, sustainable spending, lifetime taxes, amount left after tax, brokerage cushion at 59½, bridge status.
- **Year-by-year table:** both ages, spending, healthcare, Roth conversion and its tax, pay, Social Security, which bucket paid, tax paid, each bucket's ending balance; copyable or downloadable as CSV.
- **Report export:** a Download report button saves one standalone HTML file with every input, the headline results and notes, the runway timeline, the Roth conversion plan (bracket chart, comparison, implications), all charts as images and the year-by-year table. It opens in any browser and prints to PDF.
- **Scenario link:** Copy scenario link puts every changed input in the URL fragment so a scenario can be bookmarked or shared.
- **Charts:** see Web page and charts.
- **Flags:** plain-English notes, such as a thin bridge cushion, total pre-65 healthcare cost, how much pay covers before the last spouse retires, and conversion tax implications (ACA, IRMAA, 5-year rule, wages missing).

## Web page and charts

One page: inputs on the left, four headline numbers and the money-flow charts on the right, all recalculated as you type. A runway timeline shows a working row for each spouse, and a Roth conversion section sits under it.

| Chart | What it shows | Form |
| --- | --- | --- |
| Runway timeline | When each spouse works, the bridge, retirement, pre-65 healthcare per spouse, and when money runs out | Horizontal bars on Spouse 1's age axis |
| Roth conversion by bracket | How much of each year's conversion falls in the 0% (standard deduction), 10%, 12%, 22% and higher brackets, plus that year's tax | Stacked bars by bracket, with a tax line |
| With vs without conversions | Runway, spending, lifetime tax and after-tax leftovers side by side | Comparison table, better value highlighted |
| Balances by bucket | How brokerage, traditional and Roth balances rise and fall, including conversions | Stacked area by age, markers at 59½, 65 and Social Security start |
| Money in by year | Which source pays each year (pay, buckets, Social Security), any shortfall, against total cost | Stacked bars by source, with a line for total cost (living, healthcare, tax) |
| Where the money goes | Lifetime totals from each source into living costs, healthcare, taxes and what is left, including traditional-to-Roth conversions | Sankey diagram |
| What-if sensitivity | How the run-out age moves with monthly spending | Line chart, marker at today's plan, line at the sustainable amount |

**Build notes**

- Single static page; all calculations run in the browser, so no financial data leaves the device. No accounts, analytics or cookies.
- Inputs are remembered in the visitor's browser (local storage) and can be shared through a scenario link; the fragment after `#` is never sent to the server.
- Charts use ECharts, which handles stacked areas and Sankey diagrams.
- Download report (HTML) and Download CSV save directly; Copy as CSV stays on the table.
- On phones, inputs collapse into a panel above the results.
- A disclaimer at the bottom states the page is educational, not financial, tax or legal advice.

## Calculation logic

A simple loop in half-year steps, in today's dollars: each step, net pay and income against spending, take the rest from the right bucket with its tax, convert to Roth if planned, then grow what's left.

**Phases by age**

- **Working:** each spouse earns take-home pay until their own retirement age. Spending starts now; pay offsets it, and any surplus is reinvested in brokerage.
- **Bridge:** from the first spouse's retirement until Spouse 1 reaches 59½. Only cash, brokerage and Roth contributions are penalty-free. If Rule of 55 applies and Spouse 1 retires at 55 or later, the 401k opens at retirement.
- **Healthcare bridge:** pre-65 healthcare starts once both have retired (the working spouse's employer plan is assumed to cover both until then) and stops for each spouse at 65.
- **Retirement:** 59½ until the younger spouse reaches the plan-to age. All buckets available.
- **Markers:** Social Security start ages; required minimum distributions are not modeled in v1. Both spouses are assumed alive through the plan.

**Withdrawal order (default)**

1. Before 59½: cash, then brokerage, then Roth contributions. If still short, traditional with the 10% penalty, then Roth earnings with the penalty, flagged as "needs penalty withdrawals".
2. After 59½: cash, brokerage, then traditional, then Roth.

**Each step**

1. Cost = monthly expenses, plus pre-65 healthcare for each spouse under 65 once both have retired, plus tax on any Roth conversion this step.
2. Income = take-home pay for each spouse still working, plus after-tax Social Security (85% taxable at the flat rate) and pension. Income above cost is reinvested in brokerage.
3. Gross up the remaining need for tax by bucket:
   - Brokerage: withdrawal = need ÷ (1 − gain share × gains tax rate), where gain share = 1 − cost basis %.
   - Traditional: withdrawal = need ÷ (1 − effective tax rate), plus 10% before 59½.
   - Roth and cash: no tax.
4. Withdraw from buckets in order until the need is met; anything left is a shortfall.
5. Grow each remaining balance by the real return. Cash does not grow.
6. Record each source's amount, tax and shortfall for the charts and table.

**Runway = number of fully funded years in each phase.** Because returns and spending are both in today's dollars, inflation only matters when showing future-dollar figures.

**Sustainable spending** is found by searching for the monthly amount where the last bucket empties exactly at the plan-to age.

**Roth conversions**

- The same amount is converted from traditional to Roth every year from the start age until the target age.
- That yearly amount is solved by bisection: the smallest amount for which the simulated Roth balance (growth, conversions and any bridge withdrawals of contributions) reaches the target at the target age. If growth alone reaches it, the amount is zero; if converting the whole traditional balance can't, the page says so.
- Tax on each conversion is the extra federal tax it adds on top of other ordinary income that year (wages while a spouse still works, 85% of Social Security, pension), plus a flat state rate.
- Federal tax uses the 2026 married-filing-jointly brackets with the $32,200 standard deduction, held constant in today's dollars: 10% to $24,800 of taxable income, 12% to $100,800, 22% to $211,400, 24% to $403,550, 32% to $512,450, 35% to $768,700, then 37%.
- The conversion tax is added to that year's cost, so it is paid from cash and brokerage, not from the converted amount.
- The comparison reruns the whole plan with conversions off. "Left after tax" counts traditional at (1 − effective tax rate).

## Worked example

Spouse 2 working three more years moves the run-out age from 76½ to 84½, and converting about $52,700 a year reaches the $1M Roth target at 59½ for about 15.6% in tax while cutting lifetime taxes by roughly $140K.

Assumptions: Spouse 1 is 52 and retires now; Spouse 2 is 50 and retires at 55 with $8,000 a month take-home and $130,000 taxable wages. Spending $20,000 a month plus $1,500 per person for pre-65 healthcare. $2M brokerage at 50% basis, $2.5M traditional, $400K Roth. 4% real return, 20% tax on traditional withdrawals, 15% on gains, no state tax, no Social Security entered, plan to Spouse 2's age 95. Ages are Spouse 1 / Spouse 2.

| Scenario | Bridge to 59½ | Money lasts to | Spending that lasts to 95 | Conversion per year | Tax on conversions | Lifetime taxes | Roth at 59½ |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Both retire now, no conversions | 7.5 of 7.5 years | 76½ / 74½ | $15,000 / month | — | — | $1.02M | $537K |
| Spouse 2 works to 55, no conversions | 7.5 of 7.5 years | 84½ / 82½ | $17,400 / month | — | — | $1.21M | $537K |
| Spouse 2 works to 55, convert from 52 | 7.5 of 7.5 years | 84½ / 82½ | $17,400 / month | $52,700 | $62K (15.6%) | $1.07M | $1.0M |
| Spouse 2 works to 55, convert from 57 | 7.5 of 7.5 years | 85 / 83 | $17,500 / month | $174,700 | $52K (11.9%) | $1.06M | $1.0M |

**What the example shows**

- A second paycheck matters most: three more years of Spouse 2's pay adds eight years of runway and $2,400 a month of sustainable spending.
- Conversions pay off at these amounts: converting at 12–16% beats the 20% assumed for later traditional withdrawals, cutting lifetime taxes by about $140K without shortening the runway.
- Waiting to convert until both have stopped working (Spouse 1 age 57) means larger yearly amounts but a lower rate, 11.9% versus 15.6%, because no wages sit underneath the conversion.
- Lifetime taxes look lowest when both retire now only because the money runs out eight years sooner.
- These are illustrative estimates from a simple model, not advice; ACA subsidies, IRMAA and sequence-of-returns risk are flagged, not modeled.

## Out of scope for v1, and decisions

V1 stays deliberately simple; these are the likely v2 additions once the core feels right.

**Out of scope for v1**

- Account linking and transaction import
- Monte Carlo and sequence-of-returns risk (v2: run historical return sequences)
- Full tax brackets for all income; v1 uses brackets only for Roth conversions and flat rates for other withdrawals
- ACA subsidy and IRMAA amounts (flagged in the conversion notes, not calculated)
- Optimizing conversions to fill a chosen bracket (v1 solves for a target Roth balance); the 5-year rule on converted amounts
- Required minimum distributions
- State tax beyond a single flat rate on conversions
- Spending that changes by age (e.g. higher early, lower later)

**Decisions**

- [x] Spending stays one number, excluding pre-65 healthcare
- [x] Pre-65 healthcare is its own line, per person, stopping at each spouse's 65
- [x] Plan for a couple: two ages, two Social Security inputs
- [x] Each spouse has their own retirement age, with take-home pay until then
- [x] Start with a web page, with charts that show the money flows
- [x] Add yearly Roth conversions after retirement to reach a $1M Roth target, with the yearly amount solved and the tax implications shown
- [x] Export inputs and outputs as a report; add a disclaimer
- [x] Publish as a static site on GitHub Pages
- [x] Add a guided setup for first-time visitors, landing on the same editable calculator
