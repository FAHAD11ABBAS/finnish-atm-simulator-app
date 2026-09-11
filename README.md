# 🇫🇮 Finnish ATM & Smart Banking Simulator

[![GitHub Pages](https://img.shields.io/badge/Live_Demo-GitHub_Pages-002f6c?style=for-the-badge&logo=github&logoColor=white)](https://fahad11abbas.github.io/finnish-atm-simulator-app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-10b981?style=for-the-badge)](LICENSE)
[![Creator](https://img.shields.io/badge/Crafted_By-Abbas_Fahad_(FAHAD11ABBAS)-ff7a00?style=for-the-badge&logo=github)](https://github.com/FAHAD11ABBAS)

A world-class, production-ready, standalone Finnish banking simulation ecosystem. Features a dual-experience architecture uniting a physical **Finnish Otto. ATM Terminal** (with Web Audio procedural sound synthesis, realistic card slot, animated banknote dispenser, and printed thermal receipts) alongside a modern **Nordic Smart Online Banking Portal** (with Bank ID / Tupas authentication, real Finnish IBAN & 7-3-1 reference number validation, e-invoice handling, mortgage stress-test calculators, and live multi-currency FX converters).

---

## 🌟 Live Demo & Repository Links

* 🌐 **Live Web Application (GitHub Pages)**: [https://fahad11abbas.github.io/finnish-atm-simulator-app/](https://fahad11abbas.github.io/finnish-atm-simulator-app/)
* 📂 **GitHub Source Code Repository**: [https://github.com/FAHAD11ABBAS/finnish-atm-simulator-app](https://github.com/FAHAD11ABBAS/finnish-atm-simulator-app)

---

## 🚀 Key Features & Architectural Highlights

### 1. 🏧 Physical Finnish Otto. ATM Simulator
* **Authentic Terminal Layout**: Modelled after the iconic Finnish Otto. cash machines operated by Automatia.
* **Procedural Web Audio API Sound Synthesizer**: 100% self-contained audio engine generating realistic tactile keypad clicks (DTMF tones), mechanical card insert/eject sounds, banknote counting roller hums, shutter motor actuation, and thermal receipt stepper motor sounds — zero external MP3 dependencies.
* **Interactive Cash Dispenser**: Animated motor flap and banknote dispensation stack for Fast Cash (*Pikanosto*: €20, €40, €60, €90, €140, €240) and custom withdrawal amounts.
* **Banknote Deposit Facility (*Talletus*)**: Immediate note scanning and account crediting.
* **Thermal Printed Receipts**: Authentic thermal paper slip rendering with Finnish barcode generation, archive reference numbers, and one-click printing/export.

### 2. 💻 Nordic Smart Online Banking Portal
* **Finnish Bank ID (Pankkitunnukset / Tupas / Suomi.fi)**: Simulated multi-factor strong e-identification across Finnish banks (OP Osuuspankki, Nordea, S-Pankki, Danske Bank).
* **Real-time Balance Tracker & Account Hub**: Multi-account management (Checking, High-Yield Savings, Investment) with `localStorage` state persistence.
* **Finnish Banking Standards Validation**:
  * **Finnish IBAN Engine**: Full ISO 13616 / MOD-97 algorithm validation tailored for Finnish bank prefixes.
  * **7-3-1 Viitenumero Checksum Engine**: Authentic implementation of the Finnish national payment reference checksum algorithm (weights: 7, 3, 1 right-to-left) with automatic reference generator and RF (ISO 11649) support.
* **E-Invoice Hub (*E-laskut*)**: Interactive billing workflow with single and bulk one-click invoice approvals.
* **Interactive 3D Bank Card Management**: Real-time 3D tiltable card with EMV gold chip, contactless NFC toggles, instant card freeze, online transaction permissions, and CSV statement exporter.
* **Categorized Spending Analytics**: Live visual breakdown of housing, groceries, transport, and lifestyle expenses.

### 3. 📊 Smart Financial Calculators & FX Tools
* **Finnish Mortgage (*Asuntolaina*) Calculator**: Monthly annuity calculation, total interest cost analysis, and interactive Euribor interest rate stress-testing slider (+1% to +5% shock simulation).
* **Live Multi-Currency Converter**: Real-time conversion engine with 7-day historical rate trend sparklines across EUR, USD, SEK, NOK, GBP, CHF, and JPY.

### 4. 🌐 Multilingual Nordic Localization (i18n)
* Instant dynamic switching between **Finnish (Suomi 🇫🇮)**, **English (English 🇬🇧)**, and **Swedish (Svenska 🇸🇪)**.

---

## 🛠️ Technology Stack

* **Frontend Engine**: Semantic HTML5 & Modern Modular Vanilla JavaScript (ES6+ Classes & Modules)
* **Styling & Design System**: Modern CSS3, CSS Custom Properties (Design Tokens), Flexbox, CSS Grid, Glassmorphism, and responsive media queries
* **Audio Layer**: Web Audio API (procedural oscillator synthesis)
* **State Management**: Reactive Pub/Sub State Store with localStorage persistence
* **Typography**: Google Fonts (*Outfit*, *Plus Jakarta Sans*, *JetBrains Mono*)
* **Deployment & CI/CD**: Automated GitHub Pages deployment via GitHub Actions (`.github/workflows/deploy.yml`)

---

## 📁 Project Architecture & File Tree

```
finnish-atm-simulator-app/
├── index.html                   # Master entry point with semantic markup & SEO metadata
├── LICENSE                      # MIT Open-Source License
├── README.md                    # Comprehensive documentation
├── .gitignore                   # Version control ignore rules
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Actions automated Pages deployment
├── css/
│   ├── variables.css            # Design tokens (Maritime Deep Blue, Otto Orange, Emerald)
│   ├── base.css                 # Reset, typography, glass cards, buttons & shared primitives
│   ├── responsive.css           # Ultra-responsive layout for mobile, tablet, & desktop
│   └── components/
│       ├── atm-machine.css      # Hardware bezel, CRT screen, tactile keypad, dispenser & slots
│       ├── ebanking.css         # Smart banking layout, balances, transfers & transaction log
│       ├── bank-id-modal.css    # Finnish Bank ID / Tupas / Mobile ID authentication portal
│       ├── cards.css            # 3D interactive tilt cards with EMV chip & security toggles
│       ├── calculators.css      # Mortgage annuity calculator & FX conversion cards
│       ├── receipts.css         # Thermal paper slip, tear effect & barcode styling
│       └── toast-modal.css      # Notification toasts & feedback loops
└── js/
    ├── app.js                   # Application bootstrapper & mode orchestrator
    ├── audio/
    │   └── sound-effects.js     # Web Audio API procedural sound engine
    ├── i18n/
    │   └── translations.js      # Complete trilingual dictionary (FI, EN, SV)
    ├── services/
    │   ├── bank-validator.js    # Finnish IBAN & 7-3-1 Viitenumero checksum engines
    │   ├── currency-engine.js   # Exchange rate engine with live conversion & sparklines
    │   └── loan-calculator.js   # Annuity mortgage math & Euribor stress-testing
    ├── state/
    │   ├── accounts-data.js     # Authentic Finnish mock profiles & seed transactions
    │   └── store.js             # Reactive store with localStorage persistence & pub/sub events
    ├── components/
    │   ├── atm-terminal.js      # Physical ATM controller & screen state machine
    │   ├── ebanking-portal.js   # Online banking controller, transfers, e-invoices & CSV export
    │   ├── bank-id-auth.js      # Bank ID authentication modal controller
    │   ├── tools-controller.js  # Calculators & FX tools interactive UI bindings
    │   └── receipt-printer.js   # Thermal receipt generator & printable slip modal
    └── utils/
        ├── formatters.js        # Finnish EUR currency (`1 250,50 €`), dates & IBAN formatting
        └── dom.js               # Safe DOM helpers, modal toggles & toast alerts
```

---

## 💻 Local Development Setup

To run this application locally without any external dependencies or build steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/FAHAD11ABBAS/finnish-atm-simulator-app.git
   cd finnish-atm-simulator-app
   ```

2. **Serve with any local HTTP server** (e.g. Python or Node):
   ```bash
   # Using Python 3:
   python3 -m http.server 8000

   # Or using npx serve:
   npx serve .
   ```

3. **Open in your browser**:
   ```
   http://localhost:8000
   ```

---

## 👨‍💻 Creator & Credits

* **Author**: Abbas Fahad ([@FAHAD11ABBAS](https://github.com/FAHAD11ABBAS))
* **GitHub Profile**: [https://github.com/FAHAD11ABBAS](https://github.com/FAHAD11ABBAS)
* **Project Repository**: [https://github.com/FAHAD11ABBAS/finnish-atm-simulator-app](https://github.com/FAHAD11ABBAS/finnish-atm-simulator-app)
