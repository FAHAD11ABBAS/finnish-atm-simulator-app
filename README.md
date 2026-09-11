# Finnish ATM & Smart Banking Simulator (2030 Futuristic Edition)

[![Graduation Portfolio](https://img.shields.io/badge/Portfolio-WP25K%20Vocational%20Graduation-00F0FF?style=for-the-badge&logo=react)](https://github.com/FAHAD11ABBAS/finnish-atm-simulator-app)
[![React 19](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.1.0-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4.0-38BDF8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-10B981?style=for-the-badge&logo=github)](https://FAHAD11ABBAS.github.io/finnish-atm-simulator-app/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

> **Vocational Graduation Portfolio (WP25K)**  
> Developed by **FAHAD11ABBAS**  
> **Live Web Application Demo:** [https://FAHAD11ABBAS.github.io/finnish-atm-simulator-app/](https://FAHAD11ABBAS.github.io/finnish-atm-simulator-app/)  
> **Official Repository:** [https://github.com/FAHAD11ABBAS/finnish-atm-simulator-app](https://github.com/FAHAD11ABBAS/finnish-atm-simulator-app)

---

## 🌟 Project Overview

The **Finnish ATM & Smart Banking Simulator (2030 Futuristic Edition)** is a production-grade, full-stack conceptual web application built for the **WP25K Vocational Graduation Portfolio**. 

It reimagines the traditional Finnish banking ecosystem (Otto. ATMs, OP Osuuspankki, Nordea, Danske Bank, S-Pankki, OmaSp, Tupas BankID, MobilePay Suomi) for the year 2030 using a **cyberpunk glassmorphism design language**, procedural audio synthesis, and real-time neural authentication workflows.

---

## 🎨 Aesthetic & Design Standard (2030 Glassmorphism)

- **Color Palette**:
  - **Obsidian Core Background**: `#030712`
  - **Neon Cyan Glow**: `#00F0FF`
  - **Emerald Success Indicators**: `#10B981` / `#00FF9D`
  - **Amber Euribor Warning**: `#F59E0B`
- **UI/UX Innovations**:
  - Backdrop blur glassmorphic cards (`backdrop-blur-xl`, `glass-panel`).
  - WebGL / HTML5 Canvas particle matrix system with laser connecting nodes.
  - Interactive tactile scrambled PIN keypad (randomizes digits on each click for anti-shoulder-surfing security).
  - Procedural Web Audio API sound engine (synthesizing sci-fi UI beeps, cash note dispenser rhythms, biometric scan sweeps, and success chimes).

---

## 🚀 Core Functional Modules

### 1. 🛡️ Secure Tupas Neural Biometric Login
- **Neural Face & Iris Matrix Scan**: Simulated camera scanner with reticle lock animation, scanlines, and instant verification.
- **Suomi BankID & Scrambled PIN Pad**: Authentic bank selection (OP, Nordea, Danske, S-Pankki, OmaSp) with a randomized security key array.
- **Finnish Mobile ID (Mobiilivarmenne)**: Simulated push verification to Telia/Elisa 6G network using Finnish HETU identity verification (`110898-999X`).

### 2. 💼 Live Vault Dashboard & Ledger
- **Real-Time Net Worth Ticker**: Live balance counters for Primary Checking Account, Savings Vault (4.2% APY), and e-EUR Quantum Staking.
- **Interactive Wealth Forecast Chart**: SVG bezier area chart rendering live income, expenditure, and interest growth trends.
- **Searchable Transaction Ledger**: Comprehensive transaction history with filter tags (`Deposits`, `Withdrawals`, `Transfers`, `Yield`) and instant exportable Cyber Digital Receipts.
- **Predictive e-EUR Yield Calculator**: Slider tool projecting compound interest over 1, 5, and 10 years at 4.2% APY.

### 3. 🏧 Smart ATM Operations Terminal (Otto. 2030)
- **Cash Withdrawal**: Presets (€20, €40, €50, €100, €200, €500) & custom input with bill denomination breakdown logic (e.g. €100 = 2x €50 or 5x €20) and physical note slot dispensing sound effects.
- **Cash Deposit**: Interactive banknote feeder dropzone with automated UV security scanner validation.
- **Peer-to-Peer (P2P) Instant SEPA Transfer**: Finnish IBAN Mod 97 checksum validator with bank code resolution (e.g., FI50 -> OP, FI12 -> Nordea) and MobilePay phone transfer engine.

### 4. 🧮 AI Financial Calculators & Multi-Currency Engine
- **AI Loan Interest Estimator**: Range sliders for Principal (€1,000–€100,000), Duration (6–120 months), Euribor 3M margin, monthly repayment calculations, and AI Credit Risk Ratings (`A+ Optimal`, `B Moderate`, `C- High Debt`).
- **Multi-Currency Exchange Converter**: Live exchange rates for EUR against USD, GBP, JPY, SEK, NOK, CHF, BTC, and ETH with instant exchange capabilities to credit the e-EUR vault.

---

## 📁 Repository Architecture

```
finnish-atm-simulator-app/
├── .github/
│   └── workflows/
│       └── deploy.yml             # GitHub Actions continuous deployment pipeline
├── public/
│   └── favicon.svg                # 2030 Cyberpunk ATM SVG icon
├── src/
│   ├── components/
│   │   ├── ATM/
│   │   │   ├── ATMTerminal.jsx    # Otto. 2030 Smart ATM container
│   │   │   ├── CashDeposit.jsx    # Note scanner feeder & UV validation
│   │   │   ├── CashWithdraw.jsx   # Denomination calculator & cash dispenser
│   │   │   └── P2PTransfer.jsx    # Finnish IBAN Mod-97 validator & MobilePay
│   │   ├── Auth/
│   │   │   └── BiometricLogin.jsx # Tupas Neural face scan & scrambled PIN pad
│   │   ├── Calculators/
│   │   │   ├── CurrencyEngine.jsx # Multi-currency FX exchange matrix
│   │   │   └── LoanEstimator.jsx  # AI Euribor loan estimator & credit score
│   │   ├── Dashboard/
│   │   │   ├── LedgerTable.jsx    # Filterable ledger & receipt trigger
│   │   │   └── LiveVault.jsx      # Balance ticker, SVG chart & yield estimator
│   │   ├── GlassCard.jsx          # Reusable glassmorphism card container
│   │   ├── Navbar.jsx             # Bank selector, clock, audio mute & language
│   │   ├── NeonButton.jsx         # Interactive glowing cyberpunk buttons
│   │   ├── NeuralBackground.jsx   # HTML5 Canvas particle matrix system
│   │   ├── ReceiptModal.jsx       # Printable cyber digital receipt
│   │   └── Toast.jsx              # Sci-fi alert notification feed
│   ├── context/
│   ├── utils/
│   │   ├── audioEngine.js         # Procedural Web Audio API sound synthesizer
│   │   ├── formatters.js          # EUR currency, dates, rates & loan math
│   │   └── ibanValidator.js       # ISO 13616 Mod 97 Finnish IBAN validator
│   ├── App.jsx                    # Core application routing & module hub
│   ├── index.css                  # Tailwind CSS v4 & custom glassmorphism styles
│   └── main.jsx                   # React 19 root
├── index.html                     # HTML5 entry point with 2030 Google Fonts
├── package.json                   # Dependencies & scripts
├── README.md                      # Complete project documentation
└── vite.config.js                 # Vite build configuration (base path for gh-pages)
```

---

## 🛠️ Local Development & Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher (v22 recommended)
- **npm**: v9.0.0 or higher

### Step-by-Step Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/FAHAD11ABBAS/finnish-atm-simulator-app.git
   cd finnish-atm-simulator-app
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Launch Local Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173/`.

4. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 🌐 GitHub Pages Deployment

The application features continuous deployment configured via **GitHub Actions** (`.github/workflows/deploy.yml`).

Every push to the `main` branch automatically triggers the build workflow and publishes the dist artifacts to GitHub Pages.

**Live Application URL:**  
👉 [https://FAHAD11ABBAS.github.io/finnish-atm-simulator-app/](https://FAHAD11ABBAS.github.io/finnish-atm-simulator-app/)

---

## 📄 License

This project is licensed under the **MIT License**. Created as part of the Vocational Graduation Portfolio (WP25K) by **FAHAD11ABBAS**.
