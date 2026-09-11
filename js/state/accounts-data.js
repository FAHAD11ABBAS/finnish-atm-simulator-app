/**
 * Finnish Banking Mock Seed Data & Demo Profiles
 * Authentic Finnish banking structure (OP, Nordea, S-Pankki)
 * Author: Abbas Fahad (FAHAD11ABBAS)
 */

export const initialProfiles = [
  {
    id: "user-matti",
    name: "Matti Virtanen",
    bank: "OP Osuuspankki",
    bankTheme: "card-op-theme",
    pin: "1234",
    phone: "+358 40 123 4567",
    accounts: [
      {
        id: "acc-1",
        name: "Käyttötili (Checking)",
        type: "checking",
        iban: "FI2150009820012345",
        balance: 4850.75,
        currency: "EUR"
      },
      {
        id: "acc-2",
        name: "Kasvutuotto Säästötili (Savings)",
        type: "savings",
        iban: "FI6850009820078901",
        balance: 18420.00,
        currency: "EUR"
      }
    ],
    cards: [
      {
        id: "card-1",
        type: "OP Gold Debit / Credit",
        number: "4921 8400 1234 5678",
        expiry: "09/28",
        cvv: "842",
        pin: "1234",
        isBlocked: false,
        contactlessEnabled: true,
        onlinePurchasesEnabled: true,
        region: "nordics", // 'nordics' or 'global'
        dailyWithdrawLimit: 1000,
        dailyPosLimit: 3000
      }
    ],
    transactions: [
      {
        id: "tx-1",
        title: "K-Citymarket Kamppi",
        category: "groceries",
        type: "expense",
        amount: 84.60,
        date: "2026-09-09T14:32:00",
        reference: "1249842"
      },
      {
        id: "tx-2",
        title: "Palkkio / IT Consulting Oy",
        category: "income",
        type: "income",
        amount: 3650.00,
        date: "2026-09-01T08:00:00",
        reference: "9842104"
      },
      {
        id: "tx-3",
        title: "HSL Kausilippu Helsinki",
        category: "transport",
        type: "expense",
        amount: 70.60,
        date: "2026-09-03T11:15:00",
        reference: "551203"
      },
      {
        id: "tx-4",
        title: "Fortum Sähkölasku",
        category: "housing",
        type: "expense",
        amount: 62.40,
        date: "2026-09-05T16:45:00",
        reference: "4421980"
      },
      {
        id: "tx-5",
        title: "Alko Arkadia",
        category: "lifestyle",
        type: "expense",
        amount: 45.90,
        date: "2026-09-07T18:20:00",
        reference: "310948"
      }
    ],
    eInvoices: [
      {
        id: "einv-1",
        sender: "Elisa Oyj",
        iban: "FI4410001234567890",
        amount: 39.90,
        dueDate: "2026-09-25",
        reference: "12847291",
        status: "pending"
      },
      {
        id: "einv-2",
        sender: "If Vahinkovakuutus",
        iban: "FI7810009876543210",
        amount: 74.20,
        dueDate: "2026-09-28",
        reference: "55910243",
        status: "pending"
      }
    ]
  },
  {
    id: "user-aino",
    name: "Aino Korhonen",
    bank: "Nordea Bank Finland",
    bankTheme: "card-nordea-theme",
    pin: "4321",
    phone: "+358 50 987 6543",
    accounts: [
      {
        id: "acc-aino-1",
        name: "Nordea Premium Käyttötili",
        type: "checking",
        iban: "FI1415983000192837",
        balance: 9240.50,
        currency: "EUR"
      },
      {
        id: "acc-aino-2",
        name: "Sijoitus- ja Rahastotili",
        type: "savings",
        iban: "FI3915983000998877",
        balance: 34100.00,
        currency: "EUR"
      }
    ],
    cards: [
      {
        id: "card-aino-1",
        type: "Nordea Platinum Mastercard",
        number: "5248 9100 8765 4321",
        expiry: "11/29",
        cvv: "491",
        pin: "4321",
        isBlocked: false,
        contactlessEnabled: true,
        onlinePurchasesEnabled: true,
        region: "global",
        dailyWithdrawLimit: 2000,
        dailyPosLimit: 5000
      }
    ],
    transactions: [
      {
        id: "tx-a1",
        title: "Stockmann Herkku",
        category: "groceries",
        type: "expense",
        amount: 142.30,
        date: "2026-09-08T17:10:00",
        reference: "8821903"
      },
      {
        id: "tx-a2",
        title: "Design Forum Shop Helsinki",
        category: "lifestyle",
        type: "expense",
        amount: 89.00,
        date: "2026-09-06T13:40:00",
        reference: "419208"
      }
    ],
    eInvoices: [
      {
        id: "einv-a1",
        sender: "Helen Kaukolämpö",
        iban: "FI8210005544332211",
        amount: 112.50,
        dueDate: "2026-09-20",
        reference: "77291034",
        status: "pending"
      }
    ]
  },
  {
    id: "user-juha",
    name: "Juha Nieminen",
    bank: "S-Pankki",
    bankTheme: "card-spankki-theme",
    pin: "9988",
    phone: "+358 45 678 9012",
    accounts: [
      {
        id: "acc-juha-1",
        name: "S-Tili & Bonustili",
        type: "checking",
        iban: "FI3939124000567890",
        balance: 1420.80,
        currency: "EUR"
      }
    ],
    cards: [
      {
        id: "card-juha-1",
        type: "S-Etukortti Visa Debit",
        number: "4176 3300 9988 7766",
        expiry: "04/27",
        cvv: "112",
        pin: "9988",
        isBlocked: false,
        contactlessEnabled: true,
        onlinePurchasesEnabled: true,
        region: "nordics",
        dailyWithdrawLimit: 500,
        dailyPosLimit: 1500
      }
    ],
    transactions: [
      {
        id: "tx-j1",
        title: "Prisma Tripla Pasila",
        category: "groceries",
        type: "expense",
        amount: 67.85,
        date: "2026-09-08T19:05:00",
        reference: "119482"
      },
      {
        id: "tx-j2",
        title: "S-Bonus Palautus",
        category: "income",
        type: "income",
        amount: 28.40,
        date: "2026-09-05T09:00:00",
        reference: "884102"
      }
    ],
    eInvoices: []
  }
];
