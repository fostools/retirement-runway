# retirement-runway

A simple calculator that aims to take the fewest inputs and show a retirement runway.

A short guided setup asks a few questions, one at a time, then opens the full calculator; every input stays editable. It covers a couple's ages, retirement ages, monthly spending, pre-65 healthcare cost and three balances (brokerage, traditional 401k/IRA, Roth). The page shows:

- **Bridge years** — whether brokerage and cash carry you to penalty-free access at 59½
- **Retirement runway** — how long all buckets last, and the age money runs out
- **Sustainable spending** — the monthly amount that lasts to your plan age
- **Roth conversions** — the yearly conversion needed to reach a Roth target, its tax by 2026 federal bracket, and the plan with vs. without conversions
- **Money-flow charts** — timeline, balances by bucket, money in by year, a Sankey of where the money goes, and a spending what-if
- **Exports** — a standalone HTML report and a year-by-year CSV, plus a scenario link that carries your inputs

## Privacy

**No data is saved or sent anywhere.** Everything runs in the browser. There is no server, account, analytics or cookie. Inputs are remembered in your browser's local storage; a scenario link puts your numbers in the URL fragment, which browsers do not send to the server.

## Run it

It's one static file. Open `index.html` in a browser, or serve the folder with any static host.

### Publish with GitHub Pages

Repo **Settings → Pages → Build and deployment → Source: Deploy from a branch → `main` / `/ (root)`**. The site appears at `https://fostools.github.io/retirement-runway/`.

## Spec

The full product spec — inputs, outputs, calculation logic, a worked example and v1 scope — is in [docs/SPEC.md](docs/SPEC.md).

## How it calculates

Half-year steps in today's dollars. Each step: take-home pay and income offset spending; the rest comes from cash, then brokerage, then Roth contributions before 59½ (traditional and Roth earnings with a 10% penalty if needed), then traditional and Roth after 59½. Withdrawals are grossed up with flat tax rates; Roth conversions use the 2026 married-filing-jointly brackets and standard deduction. Charts use [ECharts](https://echarts.apache.org/).

## Disclaimer

Retirement Runway is an educational calculator, not financial, investment, tax or legal advice. Results are estimates that depend on the numbers and assumptions you enter. Talk to a qualified professional before acting on them.

## License

Apache 2.0 — see [LICENSE](LICENSE).
