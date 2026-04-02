# Audio Setup Guide for BiteBase

Your recipe app now has audio features built in! Here's what's been set up:

## Audio Files Needed

Create these directories and files in your `/public` folder:

```
public/
├── audio/
│   ├── recipe-intro.mp3 (10-30 seconds)
│   └── background-ambient.mp3 (2-3 minutes, looping)
```

## Audio Features

### 1. **Featured Recipe Card Audio** ⏵️
- Location: Homepage featured recipe card
- Click the play button to hear the recipe description/intro
- Includes UI click sound effect
- File: `recipe-intro.mp3`

### 2. **Background Ambient Music** 🎵
- Plays softly throughout the entire site
- Volume set to 10% for subtle ambiance
- Only starts after user first interacts with page (browser permission requirement)
- File: `background-ambient.mp3`

### 3. **UI Sound Effects**
- Click sounds when interacting with the play button
- Generated using Web Audio API (no file needed)
- Provides tactile feedback

## How to Create Audio Files

### Option 1: Use Free Online Tools
- **Text-to-Speech**: Google Text-to-Speech, Natural Reader
  - Create recipe introduction: "Perfect for dinner, this Salisbury Steak with Asparagus takes just 30 minutes..."
  
- **Background Music**: Royalty-free sites
  - Pixabay Music: https://pixabay.com/music/
  - Freepik: https://www.freepik.com/
  - Search: "cooking ambient music" or "kitchen background music"

### Option 2: Use Your Own Recordings
1. Record yourself describing a featured recipe (10-30 seconds)
2. Record or download ambient kitchen music (2-3 minutes)
3. Convert to MP3 format

### Option 3: Use Online Converters
- Convert MP3, WAV, or other formats online
- https://cloudconvert.com or https://zamzar.com

## File Placement

1. Create folder: `public/audio/`
2. Add your MP3 files:
   - `recipe-intro.mp3`
   - `background-ambient.mp3`

## Testing

After adding audio files:
1. Run `npm run dev`
2. Visit homepage
3. Try clicking the play button on featured recipe
4. Interact with page (click/scroll) to hear background music start

## Browser Compatibility

- Chrome, Firefox, Safari, Edge all support Web Audio API
- Background audio starts only after user interaction (browser autoplay policy)
- Audio effects are lightweight and don't impact performance

## Tips

- Keep MP3 files optimized (compressed) for faster loading
- Test on mobile devices - autoplay is restricted
- Can disable background music by removing the `<BackgroundAudio />` component from layout
