# Sketch Chain — Draw & Guess Party Game

> A beautifully crafted mobile web app that orchestrates paper-based draw-and-guess gameplay. The app handles theme delivery, round timing, guess collection, and dramatic reveals—while actual drawing happens offline on paper sketchbooks.

---

## Core Concept

**The Problem**: Draw-and-guess party games (like "Telephone" meets sketching) are hilarious, but managing timers, word cards, and tracking who's drawn what gets chaotic with larger groups.

**The Solution**: A single shared device (phone/tablet) passed around the circle coordinates the game flow, delivers words, enforces timing, collects guesses, and orchestrates a delightful reveal sequence—all while preserving the tactile joy of drawing on paper.

---

## Game Flow

```
┌─────────┐    ┌─────────────┐    ┌──────────┐    ┌──────────┐
│  LOBBY  │───▶│ WORD REVEAL │───▶│  DRAW    │───▶│   PASS   │
└─────────┘    └─────────────┘    └──────────┘    └──────────┘
                                        │               │
                                        │               ▼
┌─────────┐    ┌─────────────┐    ┌──────────┐    ┌──────────┐
│ SUMMARY │◀───│   REVEAL    │◀───│  GUESS   │◀───│   PASS   │
└─────────┘    └─────────────┘    └──────────┘    └──────────┘
                                        │               │
                                        └───────────────┘
                                         (repeat rounds)
```

### Phase Details

| Phase           | Duration | Description                                                              |
| --------------- | -------- | ------------------------------------------------------------------------ |
| **Lobby**       | —        | Set player count (4-12), select difficulty, optional custom words        |
| **Word Reveal** | 5s       | Dramatic card-flip animation reveals seed theme to current player        |
| **Draw**        | 60s      | Countdown timer while player sketches on paper. Visual urgency at 15s/5s |
| **Pass**        | —        | "Pass your sketchbook left" prompt. Tap to confirm ready                 |
| **Guess**       | 45s      | Next player views the drawing, types their guess into the app            |
| **Reveal**      | —        | Slideshow of each chain's transformation with page-flip animations       |
| **Summary**     | —        | "Best Chain" voting, stats, shareable image generation                   |

### Round Mathematics

- **Players**: 4-12 supported
- **Flow**: Single sequential chain where each player contributes once
- **Total steps**: `players + 1` (original word + N player actions)
- **Typical game time**: 10-20 minutes depending on player count

### Sequential Game Flow

The game uses a single chain that evolves as players take turns:

```
Original Word: "cat"
     ↓
Player 1 draws "cat"
     ↓
Player 2 sees drawing → guesses "dog"
     ↓
Player 3 sees "dog" → draws
     ↓
Player 4 sees drawing → guesses "wolf"
     ↓
... continues until all players participate
     ↓
Reveal: "cat" → [drawing] → "dog" → [drawing] → "wolf"
```

This ensures:
- Each player sees only the previous player's work
- No confusion about which chain or word to use
- Clear progression through the telephone-style game

---

## Screens & Components

### 1. Lobby Screen

```
┌────────────────────────────┐
│                            │
│      🎨 SKETCH CHAIN       │
│                            │
│   ┌────────────────────┐   │
│   │  HOW MANY PLAYERS? │   │
│   │                    │   │
│   │   4  5  6  7  8    │   │
│   │   9  10  11  12    │   │
│   └────────────────────┘   │
│                            │
│   DIFFICULTY               │
│   ○ Easy  ● Medium  ○ Hard │
│   ○ Chaotic                │
│                            │
│   ┌────────────────────┐   │
│   │    START GAME      │   │
│   └────────────────────┘   │
│                            │
│   ⚙️ Settings  📝 Custom   │
└────────────────────────────┘
```

**Features**:

- Large tap targets for player count selection
- Difficulty tier selector with descriptions
- Settings: sound toggle, timer adjustments
- Custom words: link to word list editor (post-MVP)

### 2. Word Reveal Screen

```
┌────────────────────────────┐
│                            │
│      PLAYER 1'S TURN       │
│                            │
│   ┌────────────────────┐   │
│   │                    │   │
│   │    ╔══════════╗    │   │
│   │    ║          ║    │   │
│   │    ║ PENGUIN  ║    │   │
│   │    ║          ║    │   │
│   │    ╚══════════╝    │   │
│   │                    │   │
│   └────────────────────┘   │
│                            │
│   Don't show anyone else!  │
│                            │
│   ┌────────────────────┐   │
│   │    GOT IT! DRAW    │   │
│   └────────────────────┘   │
└────────────────────────────┘
```

**Animations**:

- Card starts face-down, flips on reveal with 3D CSS transform
- Dramatic pause before word appears
- Subtle glow/pulse on the word
- Optional: haptic feedback on reveal

### 3. Timer Screen (Draw/Guess)

```
┌────────────────────────────┐
│                            │
│      PLAYER 3 IS DRAWING   │
│                            │
│         ┌───────┐          │
│        ╱         ╲         │
│       │    47     │        │
│        ╲         ╱         │
│         └───────┘          │
│      ████████░░░░░░        │
│                            │
│   Draw what you see on     │
│   the previous page!       │
│                            │
│                            │
│   ┌────────────────────┐   │
│   │    I'M DONE EARLY  │   │
│   └────────────────────┘   │
└────────────────────────────┘
```

**Timer Behavior**:

- Circular progress ring shrinks as time decreases
- **60-16s**: Green (`#2ec4b6`), calm
- **15-6s**: Orange (`#ffbe0b`), pulse animation begins
- **5-0s**: Red (`#ff006e`), urgent shake animation, rapid pulse
- **0s**: Screen flash, haptic burst, transition sound

### 4. Pass Prompt Screen

```
┌────────────────────────────┐
│                            │
│     ← PASS YOUR BOOK ←     │
│                            │
│         ┌───────┐          │
│         │  📓→  │          │
│         └───────┘          │
│                            │
│   Hand your sketchbook to  │
│   the player on your LEFT  │
│                            │
│   ┌────────────────────┐   │
│   │    READY TO GUESS  │   │
│   └────────────────────┘   │
│                            │
│   Round 3 of 8             │
└────────────────────────────┘
```

**Animation**: Sketchbook icon slides left repeatedly, playful bounce

### 5. Guess Input Screen

```
┌────────────────────────────┐
│                            │
│   PLAYER 4 — GUESS TIME    │
│                            │
│            32              │
│      ████████░░░░░░        │
│                            │
│   Look at the drawing and  │
│   type what you think it is│
│                            │
│   ┌────────────────────┐   │
│   │ penguin dancing... │   │
│   └────────────────────┘   │
│                            │
│   ┌────────────────────┐   │
│   │    SUBMIT GUESS    │   │
│   └────────────────────┘   │
└────────────────────────────┘
```

**Features**:

- Auto-focus on text input when screen appears
- Large, mobile-friendly input field
- Submit on enter/button tap
- Guess stored in chain data for reveal

### 6. Reveal Slideshow

```
┌────────────────────────────┐
│                            │
│   📓 CHAIN #1 OF 6         │
│   Started by: Player 1     │
│                            │
│   ┌────────────────────┐   │
│   │                    │   │
│   │   "PENGUIN"        │   │
│   │                    │   │
│   │   Player 1's word  │   │
│   │                    │   │
│   └────────────────────┘   │
│                            │
│   ┌────────────────────┐   │
│   │    NEXT PAGE →     │   │
│   └────────────────────┘   │
│                            │
│   ● ○ ○ ○ ○ ○ ○ ○          │
└────────────────────────────┘
```

**Reveal Sequence**:

1. Show original word with attribution
2. Tap/swipe to flip to next "page"
3. Alternate between "Player X drew..." and "Player Y guessed: \_\_\_"
4. Drawing pages show placeholder: "Look at Player X's sketchbook!"
5. Final comparison: Original word vs. final guess
6. Confetti burst if they match (or are hilariously different)

**Animations**:

- Page-flip 3D transform between steps
- Suspenseful pause before each reveal
- Confetti/celebration particles on chain completion

### 7. Summary Screen

```
┌────────────────────────────┐
│                            │
│   🎉 GAME COMPLETE! 🎉     │
│                            │
│   ┌────────────────────┐   │
│   │ VOTE: BEST CHAIN   │   │
│   │                    │   │
│   │ ○ Chain 1: PENGUIN │   │
│   │ ○ Chain 2: PIZZA   │   │
│   │ ● Chain 3: VOLCANO │   │
│   └────────────────────┘   │
│                            │
│   📊 STATS                 │
│   Most transformed: Chain 3│
│   Perfect match: Chain 5   │
│                            │
│   ┌─────────┐ ┌─────────┐  │
│   │  SHARE  │ │PLAY AGAIN│ │
│   └─────────┘ └─────────┘  │
└────────────────────────────┘
```

**Features**:

- Vote for favorite chain (raises phone to cast vote)
- Auto-calculated stats: most transformed, perfect matches, funniest guess
- Share button generates summary image with all chains
- Play Again resets to lobby with same settings

---

## Visual Design System

### Color Palette — "Electric Party" (Dark Theme)

```css
:root {
	/* Backgrounds */
	--bg-primary: #1a1a2e; /* Deep navy */
	--bg-secondary: #16213e; /* Darker blue */
	--bg-elevated: #0f3460; /* Card/modal background */

	/* Accents */
	--accent-primary: #ff6b35; /* Vibrant orange — primary actions */
	--accent-secondary: #f7c59f; /* Warm peach — secondary elements */
	--accent-glow: #ff6b3540; /* Orange with transparency for glows */

	/* Semantic */
	--success: #2ec4b6; /* Teal — timer safe zone */
	--warning: #ffbe0b; /* Golden — timer warning */
	--danger: #ff006e; /* Hot pink — timer critical */

	/* Text */
	--text-primary: #edf2f4; /* Off-white */
	--text-secondary: #8d99ae; /* Muted blue-gray */
	--text-inverse: #1a1a2e; /* For light backgrounds */
}
```

### Typography

```css
/* Display — Headings, dramatic moments */
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&display=swap');

/* UI — Buttons, labels, numbers */
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap');

:root {
	--font-display: 'Fredoka', sans-serif;
	--font-ui: 'Space Grotesk', sans-serif;
}

/* Scale */
--text-xs: 0.75rem; /* 12px — labels */
--text-sm: 0.875rem; /* 14px — secondary text */
--text-base: 1rem; /* 16px — body */
--text-lg: 1.25rem; /* 20px — emphasis */
--text-xl: 1.5rem; /* 24px — subheadings */
--text-2xl: 2rem; /* 32px — headings */
--text-3xl: 3rem; /* 48px — hero numbers */
--text-4xl: 4rem; /* 64px — timer countdown */
```

### Spacing & Layout

```css
:root {
	--space-1: 0.25rem; /* 4px */
	--space-2: 0.5rem; /* 8px */
	--space-3: 0.75rem; /* 12px */
	--space-4: 1rem; /* 16px */
	--space-6: 1.5rem; /* 24px */
	--space-8: 2rem; /* 32px */
	--space-12: 3rem; /* 48px */
	--space-16: 4rem; /* 64px */

	--radius-sm: 0.5rem; /* 8px — small buttons */
	--radius-md: 1rem; /* 16px — cards */
	--radius-lg: 1.5rem; /* 24px — modals */
	--radius-full: 9999px; /* pills, circles */
}
```

### Motion & Animation

```css
/* Timing functions */
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
--ease-out-back: cubic-bezier(0.34, 1.56, 0.64, 1);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);

/* Durations */
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 500ms;
--duration-dramatic: 800ms;

/* Key animations */
@keyframes countdown-pulse {
	0% {
		transform: scale(0.5);
		opacity: 0;
	}
	50% {
		transform: scale(1.15);
		opacity: 1;
	}
	100% {
		transform: scale(1);
		opacity: 1;
	}
}

@keyframes urgent-shake {
	0%,
	100% {
		transform: translateX(0);
	}
	20% {
		transform: translateX(-3px) rotate(-1deg);
	}
	40% {
		transform: translateX(3px) rotate(1deg);
	}
	60% {
		transform: translateX(-2px) rotate(-0.5deg);
	}
	80% {
		transform: translateX(2px) rotate(0.5deg);
	}
}

@keyframes card-flip {
	0% {
		transform: perspective(1000px) rotateY(0deg);
	}
	100% {
		transform: perspective(1000px) rotateY(180deg);
	}
}

@keyframes page-turn {
	0% {
		transform: perspective(1200px) rotateY(0deg);
		transform-origin: left;
	}
	100% {
		transform: perspective(1200px) rotateY(-180deg);
		transform-origin: left;
	}
}

@keyframes float {
	0%,
	100% {
		transform: translateY(0);
	}
	50% {
		transform: translateY(-10px);
	}
}

@keyframes glow-pulse {
	0%,
	100% {
		box-shadow: 0 0 20px var(--accent-glow);
	}
	50% {
		box-shadow:
			0 0 40px var(--accent-glow),
			0 0 60px var(--accent-glow);
	}
}
```

---

## Technical Architecture

### Stack

| Layer            | Technology                           | Rationale                                             |
| ---------------- | ------------------------------------ | ----------------------------------------------------- |
| **Framework**    | SvelteKit                            | Minimal bundle, built-in transitions, reactive stores |
| **Styling**      | CSS Variables + Svelte scoped styles | No runtime CSS-in-JS overhead                         |
| **Animations**   | Svelte transitions + CSS keyframes   | Zero-dependency, performant                           |
| **Celebrations** | canvas-confetti                      | Lightweight, proven library                           |
| **State**        | Svelte stores + FSM pattern          | Predictable game phase transitions                    |
| **PWA**          | Vite PWA plugin                      | Service worker, manifest generation                   |
| **Haptics**      | Vibration API                        | Native feel on supported devices                      |

### Project Structure

```
sketch-chain/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── Timer.svelte
│   │   │   ├── WordCard.svelte
│   │   │   ├── PlayerSelector.svelte
│   │   │   ├── PassPrompt.svelte
│   │   │   ├── GuessInput.svelte
│   │   │   ├── RevealSlide.svelte
│   │   │   └── ConfettiCanvas.svelte
│   │   ├── stores/
│   │   │   ├── game.ts           # Main game state machine
│   │   │   ├── timer.ts          # Reactive timer with urgency levels
│   │   │   ├── settings.ts       # User preferences
│   │   │   └── audio.ts          # Sound effect triggers
│   │   ├── data/
│   │   │   ├── words-easy.json
│   │   │   ├── words-medium.json
│   │   │   ├── words-hard.json
│   │   │   └── words-chaotic.json
│   │   ├── utils/
│   │   │   ├── haptics.ts
│   │   │   ├── share.ts
│   │   │   └── wordPicker.ts
│   │   └── styles/
│   │       ├── variables.css
│   │       ├── typography.css
│   │       └── animations.css
│   ├── routes/
│   │   ├── +layout.svelte
│   │   ├── +page.svelte          # Lobby
│   │   ├── play/
│   │   │   └── +page.svelte      # Main game loop
│   │   └── reveal/
│   │       └── +page.svelte      # Reveal & summary
│   └── app.html
├── static/
│   ├── sounds/
│   │   ├── tick.mp3
│   │   ├── reveal.mp3
│   │   ├── success.mp3
│   │   └── times-up.mp3
│   ├── manifest.json
│   └── icons/
├── svelte.config.js
├── vite.config.ts
└── package.json
```

### State Machine

```typescript
type GamePhase =
	| 'lobby'
	| 'countdown'
	| 'word-reveal'
	| 'drawing'
	| 'pass-after-draw'
	| 'guessing'
	| 'pass-after-guess'
	| 'reveal'
	| 'summary';

interface GameState {
	phase: GamePhase;
	players: number;
	difficulty: 'easy' | 'medium' | 'hard' | 'chaotic';
	currentPlayer: number;
	originalWord: string;      // The starting word
	steps: ChainStep[];        // Single evolving sequence
	currentWord: string;       // What current player sees
	settings: {
		drawTime: number;
		guessTime: number;
		soundEnabled: boolean;
	};
}

interface ChainStep {
	type: 'word' | 'drawing' | 'guess';
	playerIndex: number;
	content: string; // For guesses; drawings are on paper
	timestamp: number;
}

// Valid transitions
const transitions: Record<GamePhase, GamePhase[]> = {
	lobby: ['countdown'],
	countdown: ['word-reveal'],
	'word-reveal': ['drawing'],
	drawing: ['pass-after-draw'],
	'pass-after-draw': ['guessing'],
	guessing: ['pass-after-guess', 'reveal'],
	'pass-after-guess': ['word-reveal', 'reveal'],
	reveal: ['summary'],
	summary: ['lobby']
};
```

---

## Audio Design

### Sound Effects (with mute toggle)

| Trigger                   | Sound                          | Character               |
| ------------------------- | ------------------------------ | ----------------------- |
| **Game Start**            | Upbeat whoosh + ding           | Energetic, anticipation |
| **Word Reveal**           | Card flip + magical shimmer    | Mysterious, exciting    |
| **Timer Tick (last 10s)** | Soft tick                      | Building tension        |
| **Timer Warning (5s)**    | Urgent pulse                   | Quickening heartbeat    |
| **Time's Up**             | Buzzer + whoosh                | Definitive, not harsh   |
| **Guess Submit**          | Satisfying pop                 | Confirmation            |
| **Pass Prompt**           | Slide whoosh                   | Movement, transition    |
| **Reveal Page Flip**      | Paper rustle + flip            | Tactile, anticipation   |
| **Chain Match**           | Celebration fanfare + confetti | Victory, joy            |
| **Chain Mismatch**        | Comedic trombone (brief)       | Playful failure         |

### Implementation

```typescript
// stores/audio.ts
import { writable, get } from 'svelte/store';

export const soundEnabled = writable(true);

const sounds = {
	tick: new Audio('/sounds/tick.mp3'),
	reveal: new Audio('/sounds/reveal.mp3'),
	success: new Audio('/sounds/success.mp3'),
	timesUp: new Audio('/sounds/times-up.mp3')
	// ... etc
};

export function playSound(name: keyof typeof sounds) {
	if (get(soundEnabled)) {
		sounds[name].currentTime = 0;
		sounds[name].play().catch(() => {}); // Ignore autoplay blocks
	}
}
```

---

## Word Database

### Structure

```json
{
	"easy": [
		{ "word": "banana", "category": "food" },
		{ "word": "elephant", "category": "animals" },
		{ "word": "house", "category": "objects" },
		{ "word": "rainbow", "category": "nature" }
	],
	"medium": [
		{ "word": "astronaut", "category": "people" },
		{ "word": "thunderstorm", "category": "weather" },
		{ "word": "birthday party", "category": "events" },
		{ "word": "surfing", "category": "actions" }
	],
	"hard": [
		{ "word": "déjà vu", "category": "concepts" },
		{ "word": "awkward silence", "category": "feelings" },
		{ "word": "Monday morning", "category": "moments" },
		{ "word": "plot twist", "category": "storytelling" }
	],
	"chaotic": [
		{ "word": "disco dinosaur", "category": "absurd" },
		{ "word": "existential pizza", "category": "absurd" },
		{ "word": "WiFi password", "category": "modern" },
		{ "word": "time-traveling chef", "category": "absurd" }
	]
}
```

### Word Count Targets

| Difficulty | Target Words | Categories                                      |
| ---------- | ------------ | ----------------------------------------------- |
| Easy       | 200+         | Animals, Food, Objects, Nature, People          |
| Medium     | 200+         | Actions, Events, Places, Compound concepts      |
| Hard       | 150+         | Emotions, Abstract, Idioms, Moments             |
| Chaotic    | 100+         | Absurd combos, Pop culture, Internet references |

---

## PWA Configuration

### manifest.json

```json
{
	"name": "Sketch Chain",
	"short_name": "Sketch",
	"description": "Draw, guess, laugh, repeat — the ultimate party game companion",
	"start_url": "/",
	"display": "standalone",
	"orientation": "portrait",
	"theme_color": "#1a1a2e",
	"background_color": "#1a1a2e",
	"icons": [
		{ "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
		{ "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
		{
			"src": "/icons/icon-maskable.png",
			"sizes": "512x512",
			"type": "image/png",
			"purpose": "maskable"
		}
	]
}
```

### Mobile Optimizations

```html
<meta
	name="viewport"
	content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
/>
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="theme-color" content="#1a1a2e" />
```

---

## Post-MVP Enhancements

### Phase 2

- [ ] Custom word list creator
- [ ] Category-specific games ("Movies Only", "Food Edition")
- [ ] Timer adjustment settings (quick/normal/relaxed)
- [ ] Accessibility: VoiceOver support, reduced motion mode

---

## Success Metrics

| Metric                   | Target       | Measurement                        |
| ------------------------ | ------------ | ---------------------------------- |
| **Time to first game**   | < 30 seconds | From app open to first word reveal |
| **Game completion rate** | > 90%        | Games that reach summary screen    |
| **PWA install rate**     | > 30%        | Users who add to home screen       |
| **Return sessions**      | > 2 per user | Average play sessions per install  |
| **Share rate**           | > 20%        | Games that generate share image    |

---

## Development Phases

### Week 1: Foundation

- [ ] SvelteKit project setup with PWA
- [ ] Design system (colors, typography, CSS variables)
- [ ] Basic routing structure
- [ ] Game state machine implementation

### Week 2: Core Gameplay

- [ ] Lobby screen with player/difficulty selection
- [ ] Word reveal with flip animation
- [ ] Timer component with urgency states
- [ ] Pass prompt screen
- [ ] Guess input with storage

### Week 3: Reveal & Polish

- [ ] Reveal slideshow with page-flip animations
- [ ] Summary screen with voting
- [ ] Confetti celebrations
- [ ] Sound effects integration
- [ ] Haptic feedback

### Week 4: Launch Prep

- [ ] Word database population (500+ words)
- [ ] PWA testing on iOS/Android
- [ ] Performance optimization
- [ ] Bug fixes and edge cases
- [ ] Launch! 🚀
