# World Geography Game - Replit Setup

## Overview
This is an interactive geography learning game built with React. Users can test their knowledge by finding countries based on their name, capital city, or flag. The game covers all continents and includes multilingual support.

## Project Information
- **Type:** Frontend React Application
- **Framework:** React 15.6.2 with Create React App
- **Build System:** react-scripts (Create React App)
- **Port:** 5000 (configured for Replit environment)
- **Languages Supported:** English, Russian, Tajik

## Recent Changes
- **2025-10-07:** Modernized UI with contemporary design
  - Implemented modern color scheme using CSS custom properties (purple-to-pink gradients)
  - Updated header with gradient background and enhanced typography
  - Redesigned language selector with card-based design and glassmorphism effects
  - Enhanced map section with card layouts, shadows, and hover transitions
  - Improved continent selection with modern card styling and responsive buttons
  - All components maintain full navigation functionality while featuring modern visuals
  - Architect-approved implementation with no regressions
- **2025-10-07:** Fixed map rendering issue
  - Migrated from amCharts 5 to amCharts 4 for compatibility with React 15.6.2 and webpack 2
  - Rewrote ZoomableWorldMap component to use amCharts 4 API
  - Rewrote RotatingGlobe component to use amCharts 4 API
  - Both interactive maps now render correctly on the start screen without console errors
- **2025-10-06:** Initial Replit setup completed
  - Installed all npm dependencies
  - Configured development server for Replit proxy (HOST=0.0.0.0, DANGEROUSLY_DISABLE_HOST_CHECK=true)
  - Set up React Dev Server workflow on port 5000
  - Updated .gitignore to include .env files
  - Verified app runs successfully with all features working

## Project Architecture
### Frontend Structure
- **public/**: Static assets including country flags (SVGs) and GeoJSON data for continents
- **src/**: React application source code
  - **components/**: UI components (maps, flags, game elements, modals)
  - **containers/**: Redux-connected container components
  - **actions/**: Redux action creators
  - **reducers/**: Redux reducers for state management
  - **locales/**: Translation files for UI and game data (countries, capitals)
  - **services/**: Business logic and data services

### Key Features
- Interactive maps using amCharts 4, Leaflet, and react-leaflet
- Redux state management with redux-thunk for async actions
- React Router for navigation
- Multi-language support via react-localize-redux
- Bootstrap styling
- Google Analytics integration (react-ga)

### Dependencies
- React & React DOM (v15.6.2)
- Redux ecosystem (redux, react-redux, redux-thunk, redux-logger)
- React Router (v4.2.2)
- Leaflet mapping library
- Bootstrap CSS framework
- React Localize Redux for internationalization

## Development
- **Start Server:** The workflow automatically runs `npm start` with proper environment variables
- **Build:** Run `npm run build` to create production build
- **Note:** This uses older React and dependencies with known vulnerabilities (661 found), but app is functional

## Deployment
The app is configured for deployment with:
- Static build output (npm run build)
- All assets served from the build directory
- No backend or database required
