# Stock-Pilot

A minimalistic personal stock portfolio tracker that runs locally on your machine. Upload your portfolio as a CSV file and visualize your holdings with a clean, dark-themed dashboard.

## Features

- 📊 **CSV Upload** - Drag & drop or browse to upload tab-separated portfolio data from Seeking Alpha
- 💼 **Portfolio Dashboard** - View all your positions with real-time calculations
- 📈 **Summary Cards** - Quick overview of total value, top gainers, and top losers
- 🔄 **Sortable Table** - Click column headers to sort by any metric
- 🌙 **Dark Theme** - Clean, minimalist financial app aesthetic
- 📱 **Responsive Design** - Optimized for desktop and tablet

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React** - UI components

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/iwaught/Stock-Pilot.git
cd Stock-Pilot
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

## CSV Format

The app expects a **tab-separated** (TSV) file with the following structure:

```
SymbolPriceChangeChange %Shares
AMZN198.79-0.81-0.41%2.47
KKR101.730.610.60%6.43
PYPL40.291.213.10%11.60
```

### Column Details:
- **Symbol** - Stock ticker symbol
- **Price** - Current price per share
- **Change** - Dollar change from previous close
- **Change %** - Percentage change (with % sign)
- **Shares** - Number of shares held

The app automatically:
- Parses tab-separated values
- Strips the `%` sign from the Change % column
- Calculates Market Value (Price × Shares)
- Sorts by Market Value descending by default

## Project Structure

```
/app
  /page.tsx          - Main page with upload + dashboard
  /layout.tsx        - Root layout with dark theme
  /globals.css       - Global styles
/components
  /CSVUpload.tsx     - Upload component with drag & drop
  /Dashboard.tsx     - Main dashboard container
  /PositionsTable.tsx - Sortable positions table
  /SummaryCards.tsx   - Summary stat cards
/lib
  /csvParser.ts      - CSV/TSV parsing logic
  /types.ts          - TypeScript interfaces
```

## Usage

1. **Upload CSV**: Click the upload area or drag & drop your CSV file
2. **View Dashboard**: See your portfolio summary and all positions
3. **Sort Data**: Click any column header to sort
4. **Upload New**: Click "Upload New CSV" to load different data

## Data Privacy

- All data stays in your browser - no backend, no database
- No external API calls
- Portfolio data is not stored anywhere
- Refresh the page or upload new data to clear

## Future Enhancements (Phase 2)

- AI-powered stock insights using Anthropic API
- Historical performance tracking
- Real-time price updates
- Export functionality
- Portfolio analytics

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
