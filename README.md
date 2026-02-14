# USDCLP-Pilot 🇨🇱

A minimalistic personal USD/CLP forex trading assistant that runs locally on your machine. Track the USD/CLP exchange rate, view technical analysis indicators, and manage your forex positions with a clean, dark-themed dashboard.

## Overview

USDCLP-Pilot is designed for swing traders who use MetaTrader 5 for USD/CLP forex trading. It provides real-time exchange rates, technical analysis (RSI, SMA, MACD, support/resistance), automated trade signals, and a simple position tracker.

## Features

- 📊 **Live USD/CLP Rate** - Real-time exchange rate from free forex APIs with daily change tracking
- 💱 **Currency Converter** - Quick USD ↔ CLP conversion with lot size reference
- 📈 **Technical Analysis** - RSI, SMA 20/50, MACD, support/resistance, volatility indicators
- 🎯 **Trade Signals** - Automated BUY/SELL/HOLD signals based on technical indicators
- 📉 **Historical Chart** - 90-day price chart with moving average overlays
- 💼 **Position Tracker** - Manual trade tracking with real-time P&L calculations (stored in localStorage)
- 🌙 **Dark Theme** - Clean, minimalist financial app aesthetic
- 📱 **Responsive Design** - Optimized for desktop and tablet (especially iPad)

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Lightweight charting library
- **Free Forex APIs** - ExchangeRate-API and Frankfurter.app

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/iwaught/USDCLP-Pilot.git
cd USDCLP-Pilot
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
/app
  /page.tsx                  - Main forex dashboard
  /layout.tsx                - Root layout with dark theme
  /globals.css               - Global styles
  /api/forex/route.ts        - Forex data API endpoint
/components
  /RateCard.tsx              - Current rate hero display
  /Converter.tsx             - USD ↔ CLP converter
  /TechnicalPanel.tsx        - Technical indicators display
  /TradeSignal.tsx           - Buy/Sell/Hold signal card
  /PriceChart.tsx            - Historical chart with SMAs
  /PositionTracker.tsx       - Manual position tracking
/lib
  /types.ts                  - Forex TypeScript interfaces
  /technicalAnalysis.ts      - TA calculation functions (RSI, SMA, EMA, MACD)
  /formatters.ts             - Currency/number formatting helpers
```

## Technical Analysis

The app calculates the following technical indicators client-side using 90 days of historical data:

- **RSI (14-period)** - Identifies overbought (>70) and oversold (<30) conditions
- **SMA 20 & 50** - Simple moving averages for trend identification
- **EMA 12 & 26** - Exponential moving averages for MACD calculation
- **MACD** - Moving Average Convergence Divergence for momentum analysis
- **Support/Resistance** - Calculated from recent price extremes
- **Volatility** - Standard deviation of price changes
- **Trend Direction** - Bullish/Bearish/Neutral based on price action and moving averages

## Trade Signals

The app generates automated trade signals based on a weighted analysis of all technical indicators:

- 🟢 **BUY USD (Sell CLP)** - When indicators suggest USD will strengthen
- 🔴 **SELL USD (Buy CLP)** - When indicators suggest CLP will strengthen
- 🟡 **HOLD / WAIT** - When signals are mixed or unclear

**Disclaimer:** This is not financial advice. Technical analysis is provided for informational purposes only. Use at your own risk.

## Data & Privacy

- All data is fetched from free public APIs (no API key required)
- Position data is stored in browser localStorage only
- No backend database or user accounts
- No data is sent to external servers (except for fetching forex rates)

## Future Enhancements

- **AI-Powered Analysis** - Integration with Anthropic Claude API for enhanced trade insights
- **Alert System** - Price alerts and signal notifications
- **Historical Performance** - Track trading history and calculate win rate
- **Export Functionality** - Export positions and P&L to CSV
- **Multiple Timeframes** - Support for different chart timeframes

## Environment Variables

For future AI-powered analysis (Phase 3):

```
# .env.local
ANTHROPIC_API_KEY=your_key_here
```

Note: Technical analysis is currently calculated client-side. AI-powered insights will be added in a future update.

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

