# Jangid Samaj Community Website

A comprehensive community management platform built with React, TypeScript, and Tailwind CSS v4.

## Features

- **Member Directory**: Browse and search community members
- **Admin Dashboard**: Complete member management system
- **Membership Requests**: Handle new member applications
- **Profile Updates**: Member profile update request system
- **Member Types**: Regular, Life, Honorary, Student, Senior memberships
- **Update Logging**: Complete audit trail for transparency
- **Responsive Design**: Works on desktop and mobile devices

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (version 18.0 or higher)
- **npm** or **yarn** package manager
- **Git** (optional, for cloning)

You can download Node.js from [nodejs.org](https://nodejs.org/)

## Local Development Setup

### Step 1: Create a New React Project

First, create a new Vite React project with TypeScript:

```bash
npm create vite@latest jangid-samaj-website -- --template react-ts
cd jangid-samaj-website
```

### Step 2: Install Required Dependencies

Install all the necessary dependencies for the project:

```bash
# Core dependencies
npm install

# UI and Styling
npm install @radix-ui/react-slot@1.1.2
npm install class-variance-authority@0.7.1
npm install clsx
npm install tailwind-merge

# Radix UI Components (for shadcn/ui)
npm install @radix-ui/react-accordion
npm install @radix-ui/react-alert-dialog
npm install @radix-ui/react-aspect-ratio
npm install @radix-ui/react-avatar
npm install @radix-ui/react-checkbox
npm install @radix-ui/react-collapsible
npm install @radix-ui/react-context-menu
npm install @radix-ui/react-dialog
npm install @radix-ui/react-dropdown-menu
npm install @radix-ui/react-hover-card
npm install @radix-ui/react-label
npm install @radix-ui/react-menubar
npm install @radix-ui/react-navigation-menu
npm install @radix-ui/react-popover
npm install @radix-ui/react-progress
npm install @radix-ui/react-radio-group
npm install @radix-ui/react-scroll-area
npm install @radix-ui/react-select
npm install @radix-ui/react-separator
npm install @radix-ui/react-slider
npm install @radix-ui/react-switch
npm install @radix-ui/react-tabs
npm install @radix-ui/react-toast
npm install @radix-ui/react-toggle
npm install @radix-ui/react-toggle-group
npm install @radix-ui/react-tooltip

# Icons
npm install lucide-react

# Form handling
npm install react-hook-form@7.55.0
npm install @hookform/resolvers
npm install zod

# Tailwind CSS v4 (latest)
npm install tailwindcss@next @tailwindcss/vite@next
npm install autoprefixer

# Additional utilities
npm install sonner@2.0.3
npm install date-fns
npm install react-day-picker
npm install input-otp
npm install recharts
npm install react-resizable-panels
npm install vaul
npm install cmdk
```

### Step 3: Configure Vite and Tailwind CSS

Create or update `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

Create `tsconfig.json` if it doesn't exist or update it:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Step 4: Project Structure Setup

Create the following directory structure in your `src` folder:

```
src/
├── components/
│   ├── ui/
│   ├── pages/
│   ├── figma/
│   └── Navigation.tsx
├── contexts/
│   └── AppContext.tsx
├── types/
│   └── member.ts
├── styles/
│   └── globals.css
├── App.tsx
└── main.tsx
```

### Step 5: Copy Project Files

1. **Replace `src/App.tsx`** with the provided App.tsx content
2. **Create `src/styles/globals.css`** with the provided CSS content
3. **Copy all component files** to their respective directories:
   - All files from `components/` folder
   - `contexts/AppContext.tsx`
   - `types/member.ts`

### Step 6: Update main.tsx

Update your `src/main.tsx` file:

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### Step 7: Fix Import Paths

Since we're using Vite instead of the online environment, you'll need to update some import paths:

1. **In UI components**, change relative imports to use the `@/` alias:
   ```typescript
   // Change from:
   import { cn } from "./utils"
   
   // To:
   import { cn } from "@/components/ui/utils"
   ```

2. **In page components**, update imports:
   ```typescript
   // Change from:
   import { useApp } from '../../contexts/AppContext'
   
   // To:
   import { useApp } from '@/contexts/AppContext'
   ```

### Step 8: Start Development Server

Run the development server:

```bash
npm run dev
```

Your application should now be running at `http://localhost:5173`

## Demo Credentials

For testing the admin functionality, use these demo credentials:

- **Email**: admin@jangidsamaj.org
- **Password**: admin123

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint

## Project Features

### Member Management
- View all community members
- Add new members directly (admin only)
- Edit member profiles (admin only)
- Deactivate/activate members
- Delete members (with confirmation)

### Membership Requests
- Public registration form
- Admin approval system with member type selection
- Request tracking and management

### Profile Updates
- Members can request profile updates
- Admin approval workflow
- Complete audit trail

### Admin Dashboard
- Overview statistics
- Membership request management
- Update request management
- Individual member update logs
- Member management tools

## Technology Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS v4** for styling
- **Radix UI** components for accessibility
- **Lucide React** for icons
- **React Hook Form** for form handling
- **Zustand** for state management (via Context)

## Troubleshooting

### Common Issues

1. **Import errors**: Make sure all dependencies are installed and import paths are correct
2. **Tailwind not working**: Ensure Tailwind CSS v4 is properly configured in vite.config.ts
3. **Component not found**: Check that all UI components are in the correct directories
4. **TypeScript errors**: Verify that all type definitions are properly imported

### Getting Help

If you encounter issues:

1. Check the browser console for error messages
2. Verify all dependencies are installed correctly
3. Ensure file paths match the expected structure
4. Check that imports are using the correct syntax

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.