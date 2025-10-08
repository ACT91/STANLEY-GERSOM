# Malawi Police Traffic Management System

A modern web application built with React, TypeScript, Tailwind CSS 3, and shadcn/ui for managing traffic-related operations.

## Features

- **Modern Tech Stack**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS 3 with shadcn/ui components
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Built-in dark mode support

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
   ```bash
   cd "Malawi Police Traffic Management"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/
│   └── ui/          # shadcn/ui components
├── lib/
│   └── utils.ts     # Utility functions
├── App.tsx          # Main application component
├── main.tsx         # Application entry point
└── index.css        # Global styles with Tailwind directives
```

## Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS 3** - Utility-first CSS framework
- **shadcn/ui** - Re-usable component library
- **Lucide React** - Icon library

## Adding Components

To add new shadcn/ui components:

```bash
npx shadcn@latest add [component-name]
```

## License

This project is licensed under the MIT License.