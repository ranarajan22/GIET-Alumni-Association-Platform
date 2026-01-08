# 🎨 Design System Reference Guide

## Color Palette

### Primary Colors
```
Background Gradient:
─────────────────────────────────────
from-slate-900  → #0f172a
via-slate-950   → #030712  
to-slate-900    → #0f172a

Card Base:
─────────────────────────────────────
from-slate-800  → #1e293b
to-slate-900    → #0f172a
```

### Accent Colors

#### Cyan (Primary CTA)
```css
Cyan-400: #22d3ee (Light)
Cyan-500: #06b6d4 (Standard)
Cyan-600: #0891b2 (Hover)
Usage: Buttons, highlights, primary accents
```

#### Blue (Secondary)
```css
Blue-400: #60a5fa (Light)
Blue-500: #3b82f6 (Standard)
Blue-600: #2563eb (Hover)
Usage: Secondary elements, cards
```

#### Green (Success)
```css
Green-400: #4ade80 (Light)
Green-500: #22c55e (Standard)
Green-600: #16a34a (Hover)
Usage: Success messages, confirmations
```

#### Purple (Tertiary)
```css
Purple-400: #d946ef (Light)
Purple-500: #a855f7 (Standard)
Purple-600: #9333ea (Hover)
Usage: Tertiary elements, highlights
```

#### Pink (Accent)
```css
Pink-400: #ec4899 (Light)
Pink-500: #d946ef (Standard)
Pink-600: #be185d (Hover)
Usage: Additional accents, attention
```

#### Yellow (Highlights)
```css
Yellow-400: #facc15 (Light)
Yellow-500: #eab308 (Standard)
Yellow-600: #ca8a04 (Hover)
Usage: Highlights, special attention
```

#### Red (Important/Emergency)
```css
Red-400: #f87171 (Light)
Red-500: #ef4444 (Standard)
Red-600: #dc2626 (Hover)
Usage: Emergency, warnings, important
```

### Text Colors
```css
White:         #ffffff (Headings)
Slate-300:     #cbd5e1 (Primary text)
Slate-400:     #94a3b8 (Secondary text)
Slate-500:     #64748b (Tertiary text)
```

---

## Typography

### Heading Hierarchy
```css
h1 {
  font-size: 3rem;        /* 48px (sm: 3.75rem / 60px) */
  font-weight: 900;       /* font-black */
  color: white;
  margin-bottom: 1rem;
}

h2 {
  font-size: 1.875rem;    /* 30px */
  font-weight: 700;       /* font-bold */
  color: white;
}

h3 {
  font-size: 1.5rem;      /* 24px */
  font-weight: 700;       /* font-bold */
}

h4 {
  font-size: 1.25rem;     /* 20px */
  font-weight: 600;       /* font-semibold */
}

p {
  font-size: 1rem;        /* 16px */
  color: slate-300;
  line-height: 1.5;
}
```

---

## Component Patterns

### Card Pattern
```jsx
<div className="bg-gradient-to-br from-slate-800 to-slate-900 
                border border-slate-700 rounded-2xl 
                shadow-2xl p-8
                hover:border-cyan-500/50 
                hover:shadow-lg hover:shadow-cyan-500/20
                transition-all duration-300">
  {/* Content */}
</div>
```

### Icon Container Pattern
```jsx
<div className="w-16 h-16 
                bg-cyan-500/20 
                rounded-lg 
                flex items-center justify-center 
                border border-cyan-500/50">
  <IconComponent className="text-4xl text-cyan-400" />
</div>
```

### Button Pattern
```jsx
<button className="bg-gradient-to-r from-cyan-500 to-blue-500 
                   hover:from-cyan-600 hover:to-blue-600
                   text-white font-bold py-3 px-6 
                   rounded-lg transition-all duration-300 
                   transform hover:scale-105 
                   shadow-lg flex items-center justify-center gap-2">
  {children}
</button>
```

### Form Input Pattern
```jsx
<input className="w-full px-4 py-3 
                  bg-slate-700/50 
                  border border-slate-600 
                  rounded-lg text-white 
                  placeholder-slate-500 
                  focus:outline-none 
                  focus:ring-2 focus:ring-cyan-500 
                  focus:border-transparent 
                  transition" />
```

---

## Spacing System

### Padding
```css
p-4   → 1rem (16px)
p-6   → 1.5rem (24px)
p-8   → 2rem (32px)
p-10  → 2.5rem (40px)
p-12  → 3rem (48px)
```

### Margins
```css
mb-4  → margin-bottom: 1rem (16px)
mb-6  → margin-bottom: 1.5rem (24px)
mb-8  → margin-bottom: 2rem (32px)
mb-12 → margin-bottom: 3rem (48px)
```

### Gap (Grid/Flex)
```css
gap-4  → 1rem (16px)
gap-6  → 1.5rem (24px)
gap-8  → 2rem (32px)
gap-12 → 3rem (48px)
```

---

## Border Radius

```css
rounded-lg  → border-radius: 0.5rem (8px)
rounded-xl  → border-radius: 0.75rem (12px)
rounded-2xl → border-radius: 1rem (16px)
rounded-full → border-radius: 9999px (circle)
```

---

## Shadows

```css
shadow-lg  → box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
shadow-xl  → box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1)
shadow-2xl → box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25)
```

---

## Animations

### AOS (Animate On Scroll) Effects
```jsx
{/* Fade up effect */}
<div data-aos="fade-up">Content</div>

{/* Fade right effect */}
<div data-aos="fade-right">Content</div>

{/* Fade left effect */}
<div data-aos="fade-left">Content</div>

{/* Zoom in effect */}
<div data-aos="zoom-in">Content</div>
```

### AOS Configuration
```javascript
AOS.init({
  duration: 800,      // Animation duration in ms
  once: true,         // Animate only once
  offset: 100         // Offset from bottom to trigger
})
```

### Hover Transitions
```css
transition-all duration-300
transform hover:scale-105
```

---

## Icon Sizing Guide

```css
/* Navigation icons */
text-lg   → 1.125rem (18px)
text-xl   → 1.25rem (20px)

/* Section header icons */
text-2xl  → 1.5rem (24px)
text-3xl  → 1.875rem (30px)

/* Large feature icons */
text-4xl  → 2.25rem (36px)
text-5xl  → 3rem (48px)

/* Icon containers */
w-12 h-12  → 3rem × 3rem (48px × 48px)
w-14 h-14  → 3.5rem × 3.5rem (56px × 56px)
w-16 h-16  → 4rem × 4rem (64px × 64px)
```

---

## Responsive Breakpoints

```css
Mobile:    default (max-width: 640px)
Tablet:    sm: 640px - md: 1024px
Desktop:   lg: 1024px and up

Grid Columns:
Mobile  → grid-cols-1
Tablet  → md:grid-cols-2
Desktop → lg:grid-cols-3
```

---

## Color-Coded Feature Maps

### About Page Sections
| Section | Icon Color | Border Color |
|---------|-----------|--------------|
| Vision | Blue-400 | Blue-700/50 |
| Mission | Cyan-400 | Cyan-700/50 |
| Awards | Yellow-400 | Yellow-700/50 |
| Departments | Purple-400 | Purple-700/50 |
| Special Cells | Green-400 | Green-700/50 |
| Partnerships | Red-400 | Red-700/50 |

### Features Cards
| Feature | Icon | Color |
|---------|------|-------|
| Network | FaUsers | Cyan |
| Events | FaCalendar | Blue |
| Jobs | FaBriefcase | Green |
| Messaging | FaComment | Purple |
| Mentorship | FaUserTie | Pink |
| Success Stories | FaTrophy | Yellow |

### Contact Page Sections
| Section | Icon Color | Border Color |
|---------|-----------|--------------|
| Address | Cyan-400 | Cyan-500/50 |
| Email | Blue-400 | Blue-500/50 |
| Phone | Green-400 | Green-500/50 |
| Website | Purple-400 | Purple-500/50 |
| Emergency | Red-400 | Red-700/50 |
| Social | Various | – |

---

## Implementation Examples

### Hero Section
```jsx
<div className="text-center">
  <h1 className="text-5xl sm:text-6xl font-black text-white mb-4">
    About <span className="text-cyan-400">Alumni Connect</span>
  </h1>
  <p className="text-xl text-slate-300 max-w-3xl mx-auto">
    Subtitle text here
  </p>
</div>
```

### Feature Card
```jsx
<div className="bg-gradient-to-br from-cyan-900/30 to-cyan-950/30 
                border border-cyan-700/50 rounded-2xl shadow-xl p-8
                hover:border-cyan-500/50 hover:shadow-lg 
                hover:shadow-cyan-500/20 transition-all duration-300"
     data-aos="fade-up" data-aos-delay="100">
  <div className="w-20 h-20 rounded-lg bg-slate-700/30 
                  flex items-center justify-center mb-6 
                  border border-slate-600/50">
    <FaUsers className="text-4xl text-cyan-400" />
  </div>
  <h3 className="text-2xl font-bold text-white mb-3">Title</h3>
  <p className="text-slate-400 leading-relaxed">Description</p>
</div>
```

### Contact Form Input
```jsx
<input
  type="email"
  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600
             rounded-lg text-white placeholder-slate-500 
             focus:outline-none focus:ring-2 focus:ring-cyan-500
             focus:border-transparent transition"
  placeholder="your@email.com"
/>
```

---

## Best Practices

### Colors
✓ Use opacity modifiers for depth (e.g., `bg-cyan-500/20`)
✓ Always pair text colors for accessibility
✓ Use accent colors sparingly for emphasis
✓ Maintain consistency within sections

### Typography
✓ Use font-black for main headings
✓ Use font-bold for secondary headings
✓ Limit font sizes to defined scale
✓ Maintain proper line-height (1.5-1.75)

### Spacing
✓ Use consistent spacing units (4, 6, 8, 12)
✓ Add more spacing on larger screens
✓ Use gap for grid/flex layouts
✓ Maintain breathing room around elements

### Animations
✓ Keep animations short (300-800ms)
✓ Use `once: true` to prevent re-triggering
✓ Add staggered delays for sequences
✓ Test animations on slower devices

---

**Design System v2.0 - Enterprise Dark Theme**
**Last Updated**: 2024
