# BingeScore v0.9

An interactive web application for analyzing and visualizing IMDb TV series ratings episode by episode.

## Overview

BingeScore helps TV show enthusiasts make informed viewing decisions by providing detailed episode-by-episode rating visualizations. Search for any TV series, browse its seasons, and see rating trends displayed in an intuitive bar chart format with average season scores.

## Features

- **Smart Search**: Real-time TV show search with debouncing across IMDb's database
- **Season Browser**: View all available seasons with episode counts
- **Rating Visualization**: Interactive bar charts displaying episode ratings using Recharts
- **Season Averages**: Calculate and display average ratings for each season
- **Episode Details**: View individual episode titles, ratings, and vote counts
- **Responsive Design**: Mobile-friendly two-column layout that adapts to screen size
- **Modern UI**: Clean interface built with Shadcn/ui components and Tailwind CSS

## Technology Stack

### Core
- **React 19.0.0** - Frontend framework
- **TypeScript 5.7.2** - Type-safe development
- **Vite 6.3.1** - Fast build tool and dev server

### Styling & UI
- **Tailwind CSS 4.1.4** - Utility-first CSS framework
- **Shadcn/ui** - Accessible component library
- **Lucide React** - Icon library
- **Motion 12.11.0** - Animation library

### Data & Visualization
- **Axios 1.9.0** - HTTP client for API communication
- **Recharts 2.15.3** - React charting library

### UI Components
- **Radix UI** - Accessible primitives (Dialog, Popover, Slot)
- **cmdk** - Command palette/combobox component
- **Class Variance Authority** - CSS class composition
- **Tailwind Merge** - Intelligent class merging

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd imdb-ratings-2025
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint code quality checks

## Project Structure

```
/src
  ├── components/          # React components
  │   ├── Header.tsx       # Navigation header
  │   ├── SearchBar.tsx    # TV show search combobox
  │   ├── SeasonsList.tsx  # Season list display
  │   ├── EpisodesList.tsx # Episode ratings chart
  │   └── ui/              # Reusable Shadcn/ui components
  ├── services/            # API integration
  │   └── api.ts           # API service functions
  ├── types/               # TypeScript definitions
  │   ├── show.ts          # Show type
  │   ├── season.ts        # Season type
  │   ├── episode.ts       # Episode type
  │   └── index.ts         # Type exports
  ├── lib/                 # Utilities
  │   └── utils.ts         # Helper functions
  ├── App.tsx              # Main application component
  ├── main.tsx             # Application entry point
  ├── axios.ts             # Axios configuration
  └── index.css            # Global styles
```

## API Integration

The application communicates with a backend API at `http://api.imdb-ratings.it.test/api` with the following endpoints:

- `GET /search?q={query}` - Search TV shows
- `GET /show/{showId}/seasons` - Fetch seasons for a show
- `GET /ratings/{showId}?season={seasonNumber}` - Fetch episode ratings

### Authentication

The application supports optional authentication via Bearer tokens stored in localStorage under `auth.user`. The Axios interceptor automatically:
- Adds the token to requests if available
- Handles 401 unauthorized responses

## Development

### Type Safety

The project uses strict TypeScript configuration with type definitions for:
- **Show** - TV show metadata (ID, title, years, genres)
- **Season** - Season number and episode count
- **Episode** - Episode details with ratings and votes

### Styling System

- OKLCH color space for better accessibility
- CSS custom properties for theming
- Dark mode support (`.dark` class)
- Responsive grid system (1 column mobile, 2 columns desktop)

### Code Quality

- ESLint with TypeScript and React plugins
- Strict type checking enabled
- React hooks linting rules
- Fast refresh for development

## Recent Updates

- ✅ Added average season rating display
- ✅ UI/UX refinements
- ✅ API refactoring
- ✅ Component structure improvements
- ✅ Episodes list optimization

## Browser Support

Modern browsers with ES6+ support:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

[Add your license here]

## Contributing

[Add contribution guidelines here]

## Contact

[Add contact information or links here]
