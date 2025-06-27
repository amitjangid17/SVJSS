# Quick Setup Guide

## Prerequisites
- Node.js 18+ installed
- Git (optional)

## Quick Start Commands

```bash
# 1. Create new project
npm create vite@latest jangid-samaj-website -- --template react-ts
cd jangid-samaj-website

# 2. Install dependencies (run all at once)
npm install @radix-ui/react-slot@1.1.2 class-variance-authority@0.7.1 clsx tailwind-merge @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-aspect-ratio @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-collapsible @radix-ui/react-context-menu @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-hover-card @radix-ui/react-label @radix-ui/react-menubar @radix-ui/react-navigation-menu @radix-ui/react-popover @radix-ui/react-progress @radix-ui/react-radio-group @radix-ui/react-scroll-area @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-slider @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-toggle @radix-ui/react-toggle-group @radix-ui/react-tooltip lucide-react react-hook-form@7.55.0 @hookform/resolvers zod sonner@2.0.3 date-fns react-day-picker input-otp recharts react-resizable-panels vaul cmdk tailwindcss@next @tailwindcss/vite@next autoprefixer

# 3. Setup project structure
mkdir -p src/components/ui src/components/pages src/components/figma src/contexts src/types src/styles

# 4. Copy files (you'll need to manually copy the provided files)
# - Copy all .tsx files to their respective directories
# - Copy globals.css to src/styles/
# - Update vite.config.ts as shown in README.md

# 5. Start development server
npm run dev
```

## File Copy Checklist

After running the commands above, copy these files:

### Required Configuration Files:
- [ ] Update `vite.config.ts` (see README.md)
- [ ] Update `tsconfig.json` (see README.md)
- [ ] Update `src/main.tsx` (see README.md)

### Application Files:
- [ ] `src/App.tsx`
- [ ] `src/styles/globals.css`
- [ ] `src/contexts/AppContext.tsx`
- [ ] `src/types/member.ts`
- [ ] `src/components/Navigation.tsx`

### UI Components (copy all to `src/components/ui/`):
- [ ] All .tsx files from components/ui/ folder
- [ ] Make sure utils.ts is included

### Page Components (copy all to `src/components/pages/`):
- [ ] AddMemberPage.tsx
- [ ] AdminDashboardPage.tsx
- [ ] AdminLoginPage.tsx
- [ ] EditMemberPage.tsx
- [ ] HomePage.tsx
- [ ] MemberDetailPage.tsx
- [ ] MembersPage.tsx
- [ ] RegisterPage.tsx
- [ ] UpdateRequestPage.tsx

### Figma Components:
- [ ] `src/components/figma/ImageWithFallback.tsx`

## Important Import Path Updates

After copying files, update import paths in components:

1. **UI Components**: Change `"./utils"` to `"@/components/ui/utils"`
2. **Page Components**: Update relative imports to use `@/` alias
3. **Context Imports**: Use `@/contexts/AppContext`
4. **Type Imports**: Use `@/types/member`

## Demo Login
- Email: admin@jangidsamaj.org
- Password: admin123

## Troubleshooting

### If you get import errors:
```bash
# Make sure all dependencies are installed
npm install

# Clear cache and restart
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### If Tailwind isn't working:
- Ensure you updated vite.config.ts correctly
- Make sure globals.css is imported in main.tsx
- Restart the dev server

### If TypeScript errors occur:
- Check that all import paths use the correct syntax
- Verify that tsconfig.json includes the paths configuration
- Make sure all required dependencies are installed