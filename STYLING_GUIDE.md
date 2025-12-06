# EduNet Website Styling Guide

## Design System Overview

This document ensures all sections maintain consistent styling without affecting each other.

---

## 1. Authentication Pages (Black Theme)
**Pages**: `/login`, `/register`, `/forgot-password`, `/reset-password`

### Design Characteristics:
- **Background**: Solid black (`bg-black`)
- **Logo**: Billabong font, white color
- **Cards**: Gray-900 background with gray-700 borders
- **Inputs**: Black background, gray-700 borders, white text
- **Buttons**: Blue (#4e8fef) with hover effects
- **Text**: White for headings, gray-400 for secondary

### Key Classes:
```css
Background: bg-black
Card: bg-gray-900 border border-gray-700
Input: bg-black border border-gray-700 text-white placeholder-gray-400
Button: bg-blue-500 hover:bg-blue-600 (#4e8fef)
```

---

## 2. Main Application Pages (Purple/Indigo Theme)
**Pages**: `/feed`, `/profile`, `/search`, `/notifications`, `/coding-profile`

### Design Characteristics:
- **Background**: Light gradient (`bg-gradient-to-br from-purple-50 via-white to-blue-50`)
- **Header**: White with backdrop blur (`bg-white/80 backdrop-blur-xl`)
- **Cards**: White with gray-200 borders, hover shadow effects
- **Buttons**: Purple/indigo gradients
- **Text**: Gray-900 for main, gray-600 for secondary

### Key Classes:
```css
Background: bg-gradient-to-br from-purple-50 via-white to-blue-50
Header: bg-white/80 backdrop-blur-xl border-b border-gray-200
Card: bg-white rounded-2xl border border-gray-200
Button: bg-gradient-to-r from-purple-600 to-indigo-600
Avatar: ring-2 ring-purple-500
```

---

## 3. Landing Page (Modern Gradient)
**Page**: `/` (Home)

### Design Characteristics:
- **Background**: Purple/indigo gradient with animated orbs
- **Hero**: Large text with gradient effects
- **Features**: Cards with gradient icons
- **CTA**: Purple/indigo gradient buttons

### Key Classes:
```css
Background: bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900
Hero Text: bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text
Feature Cards: bg-white/10 backdrop-blur-lg border border-white/20
```

---

## 4. Component Isolation Rules

### To Prevent Cross-Section Styling Issues:

1. **Use Scoped Containers**
   - Each page wraps content in a unique container
   - Authentication pages: `<div className="min-h-screen bg-black">`
   - App pages: `<div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">`

2. **Avoid Global Style Overrides**
   - Don't use bare HTML tags in globals.css
   - Use specific class names for styling

3. **Component-Specific Styling**
   - Each client component manages its own styles
   - No shared style dependencies between auth and app pages

4. **Color Consistency**
   - Auth pages: Black, gray, blue (#4e8fef)
   - App pages: Purple-600, indigo-600, gray-900
   - Landing: Purple-900, indigo-900, white/10

---

## 5. Page-by-Page Breakdown

### Authentication Section
| Page | Background | Primary Color | Card Style |
|------|-----------|---------------|------------|
| Login | Black | Blue (#4e8fef) | Gray-900 |
| Register | Black | Blue (#4e8fef) | Gray-900 |
| Forgot Password | Black | Blue (#4e8fef) | Gray-900 |
| Reset Password | Black | Blue (#4e8fef) | Gray-900 |

### Application Section
| Page | Background | Primary Color | Card Style |
|------|-----------|---------------|------------|
| Feed | Purple-50 gradient | Purple-600 | White |
| Profile | Purple-50 gradient | Purple-600 | White |
| Search | Purple-50 gradient | Purple-600 | White |
| Notifications | Purple-50 gradient | Purple-600 | White |
| Coding Profile | Purple-50 gradient | Purple-600 | White |

### Public Section
| Page | Background | Primary Color | Card Style |
|------|-----------|---------------|------------|
| Home (Landing) | Purple-900 gradient | Purple-400 | White/10 |

---

## 6. Common Components

### Header (App Pages)
```tsx
<header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">
  {/* Navigation */}
</header>
```

### Button Variants
```tsx
// Primary (App)
className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl"

// Primary (Auth)
className="bg-blue-500 hover:bg-blue-600 text-white rounded" style={{ backgroundColor: '#4e8fef' }}

// Ghost
className="hover:bg-purple-50 text-gray-900 hover:text-purple-600 rounded-xl"
```

### Input Fields
```tsx
// App Pages
className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500"

// Auth Pages
className="w-full px-4 py-3 bg-black border border-gray-700 rounded text-white placeholder-gray-400 focus:border-gray-500"
```

---

## 7. Testing Checklist

- [ ] Login page: Black background, blue buttons
- [ ] Register page: Black background, blue buttons
- [ ] Forgot password: Black background, blue buttons
- [ ] Reset password: Black background, blue buttons
- [ ] Home landing: Purple gradient, animated orbs
- [ ] Feed: Light purple gradient, white cards
- [ ] Profile: Light purple gradient, white cards
- [ ] Search: Light purple gradient, white cards
- [ ] Notifications: Light purple gradient, white cards
- [ ] Coding Profile: Light purple gradient, white cards

---

## 8. Maintenance Guidelines

1. **When adding new auth pages**: Use black theme template
2. **When adding new app pages**: Use purple/indigo theme template
3. **Never mix themes**: Keep auth and app styling separate
4. **Test in isolation**: Check each page independently
5. **Use consistent spacing**: Tailwind spacing scale (4, 6, 8, 12, etc.)

---

## Summary

✅ **Authentication pages**: Black background, isolated styling
✅ **Application pages**: Purple/indigo gradient, consistent design
✅ **Landing page**: Unique gradient with animations
✅ **No cross-contamination**: Each section maintains its own styles
✅ **Fully functional**: All features work independently

Last Updated: 2025
