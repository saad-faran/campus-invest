# Image Requirements for Campus Invest Website

This document outlines all the images needed for the website and where to place them.

## Directory Structure

```
src/assets/images/
├── hero/
│   └── hero-image.jpg (or .png, .webp)
├── startups/
│   ├── ecocharge.jpg
│   ├── skillbridge.jpg
│   └── agrisense.jpg
└── universities/
    ├── nust.png
    ├── lums.png
    ├── uet.png
    ├── fast.png
    ├── iba.png
    └── giki.png
```

## Image Specifications

### 1. Hero Image
- **Location**: `src/assets/images/hero/hero-image.jpg`
- **Recommended Size**: 1200x900px (4:3 aspect ratio)
- **Format**: JPG, PNG, or WebP
- **Content Suggestion**: 
  - Students collaborating on startup/innovation projects
  - University campus with students working together
  - Modern, vibrant, professional image representing innovation and education
- **File Size**: Keep under 500KB for optimal loading

### 2. Startup Images (3 images)
- **Location**: `src/assets/images/startups/`
- **Recommended Size**: 600x400px (3:2 aspect ratio)
- **Format**: JPG, PNG, or WebP
- **Files Needed**:
  - `ecocharge.jpg` - Clean energy/solar theme
  - `skillbridge.jpg` - Education/technology theme
  - `agrisense.jpg` - Agriculture/technology theme
- **Content Suggestions**:
  - Product mockups or prototypes
  - Team photos
  - Concept illustrations
  - Related technology imagery
- **File Size**: Keep under 200KB each

### 3. University Logos (6 logos)
- **Location**: `src/assets/images/universities/`
- **Recommended Size**: 200x200px minimum (square, will be displayed at 80x80px)
- **Format**: PNG with transparent background (preferred) or SVG
- **Files Needed**:
  - `nust.png` - NUST logo
  - `lums.png` - LUMS logo
  - `uet.png` - UET Lahore logo
  - `fast.png` - FAST-NUCES logo
  - `iba.png` - IBA Karachi logo
  - `giki.png` - GIKI logo
- **Requirements**:
  - High quality, clear logos
  - Transparent background preferred
  - Should be recognizable at small sizes
  - Official university logos (ensure you have permission to use)

## How to Add Images

### Step 1: Place Images in Correct Directories
Place your images in the directories listed above with the exact filenames specified.

### Step 2: Update Component Imports

#### For Hero Image:
1. Open `src/components/Hero.tsx`
2. Uncomment the import line:
   ```typescript
   import heroImage from "@/assets/images/hero/hero-image.jpg";
   ```
3. Uncomment the `<img>` tag and remove the placeholder div

#### For Startup Images:
1. Open `src/components/FeaturedStartups.tsx`
2. Uncomment the import lines:
   ```typescript
   import ecochargeImage from "@/assets/images/startups/ecocharge.jpg";
   import skillbridgeImage from "@/assets/images/startups/skillbridge.jpg";
   import agrisenseImage from "@/assets/images/startups/agrisense.jpg";
   ```
3. Update the startups array to use the images:
   ```typescript
   {
     name: "EcoCharge",
     // ... other properties
     image: ecochargeImage,
   }
   ```

#### For University Logos:
1. Open `src/components/PartnerUniversities.tsx`
2. Uncomment the import lines:
   ```typescript
   import nustLogo from "@/assets/images/universities/nust.png";
   import lumsLogo from "@/assets/images/universities/lums.png";
   // ... etc
   ```
3. Update the universities array to use the logos:
   ```typescript
   {
     name: "NUST",
     website: "https://nust.edu.pk",
     logo: nustLogo,
   }
   ```

## Image Optimization Tips

1. **Compress Images**: Use tools like:
   - [TinyPNG](https://tinypng.com/) for PNG/JPG
   - [Squoosh](https://squoosh.app/) for all formats
   - [ImageOptim](https://imageoptim.com/) for Mac

2. **Use Modern Formats**: WebP format provides better compression while maintaining quality

3. **Responsive Images**: The current implementation uses `object-cover` which handles responsive sizing automatically

4. **Lazy Loading**: Consider adding lazy loading for images below the fold (startup images)

## Where to Get Images

### Stock Photos (Free):
- [Unsplash](https://unsplash.com/) - Free high-quality photos
- [Pexels](https://www.pexels.com/) - Free stock photos
- [Pixabay](https://pixabay.com/) - Free images and vectors

### University Logos:
- Visit each university's official website
- Look for "Media Kit" or "Brand Assets" section
- Download official logos (ensure you have permission to use them)

### Startup Images:
- Use product mockups or team photos
- Create custom illustrations
- Use relevant stock photos

## Notes

- All image paths use Vite's asset handling, so imports are required
- Images will be automatically optimized during the build process
- Make sure to maintain aspect ratios for best visual results
- Test images on different screen sizes to ensure they look good

