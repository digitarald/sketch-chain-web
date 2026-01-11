<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import GameSetup from '$lib/components/GameSetup.svelte';
  import SettingsModal from '$lib/components/SettingsModal.svelte';
  import { gameStore, type Difficulty } from '$lib/stores/game';
  import { pickWords } from '$lib/utils/words';
  import { playSound } from '$lib/stores/audio';
  
  let players = $state(6);
  let difficulty: Difficulty = $state('medium');
  let showSettings = $state(false);
  
  function handlePlayersChange(count: number) {
    players = count;
    gameStore.setPlayers(count);
  }
  
  function handleDifficultyChange(diff: Difficulty) {
    difficulty = diff;
    gameStore.setDifficulty(diff);
  }
  
  function startGame() {
    playSound('whoosh');
    
    // Pick words for each player (one chain per player)
    const words = pickWords(difficulty, players);
    
    // Initialize game state
    gameStore.startGame(words);
    
    // Navigate to play screen
    goto(`${base}/play`);
  }
</script>

<svelte:head>
  <title>Sketch Chain</title>
</svelte:head>

<div class="screen lobby">
  <header class="lobby-header">
    <h1 class="logo">
      <span class="logo-icon">🎨</span>
      <span class="logo-text">Sketch Chain</span>
    </h1>
    <p class="tagline">
      <span class="tagline-word" style="--i: 0; --color: var(--success)">Draw</span>
      <span class="tagline-dot">·</span>
      <span class="tagline-word" style="--i: 1; --color: var(--warning)">Guess</span>
      <span class="tagline-dot">·</span>
      <span class="tagline-word" style="--i: 2; --color: var(--danger)">Laugh</span>
      <span class="tagline-dot">·</span>
      <span class="tagline-word" style="--i: 3; --color: var(--accent-primary)">Repeat</span>
    </p>
  </header>
  
  <main class="lobby-content">
    <GameSetup 
      {players} 
      {difficulty}
      onPlayersChange={handlePlayersChange}
      onDifficultyChange={handleDifficultyChange}
    />
  </main>
  
  <footer class="lobby-footer">
    <button 
      class="btn btn-primary btn-lg btn-block"
      onclick={startGame}
    >
      Start Game
    </button>
    
    <button 
      class="btn btn-ghost"
      onclick={() => showSettings = true}
    >
      ⚙️ Settings
    </button>
  </footer>
</div>

<SettingsModal 
  show={showSettings} 
  onClose={() => showSettings = false} 
/>

<style>
  .lobby {
    min-height: 100dvh;
    padding: var(--space-6) var(--space-4);
    padding-top: calc(var(--safe-area-inset-top) + var(--space-6));
    padding-bottom: calc(var(--safe-area-inset-bottom) + var(--space-6));
    display: flex;
    flex-direction: column;
    max-width: var(--max-width);
    margin: 0 auto;
  }
  
  .lobby-header {
    text-align: center;
    padding: var(--space-4) 0;
  }
  
  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-3);
    font-family: var(--font-display);
    font-size: var(--text-3xl);
    font-weight: 700;
    color: var(--text-primary);
  }
  
  .logo-icon {
    font-size: 2.5rem;
    animation: float 3s ease-in-out infinite;
  }
  
  .logo-text {
    background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .tagline {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    font-size: var(--text-lg);
    font-weight: 500;
    margin-top: var(--space-3);
  }
  
  .tagline-word {
    color: var(--color);
    opacity: 0;
    animation: tagline-pop 0.5s var(--ease-out-back) forwards;
    animation-delay: calc(0.6s + var(--i) * 0.12s);
    text-shadow: 0 0 20px color-mix(in srgb, var(--color) 40%, transparent);
  }
  
  .tagline-dot {
    color: var(--text-secondary);
    opacity: 0;
    animation: tagline-fade 0.3s ease forwards;
    animation-delay: calc(0.8s + var(--i, 0) * 0.12s);
  }
  
  .tagline-dot:nth-of-type(2) { --i: 0.5; }
  .tagline-dot:nth-of-type(4) { --i: 1.5; }
  .tagline-dot:nth-of-type(6) { --i: 2.5; }
  
  @keyframes tagline-pop {
    0% {
      opacity: 0;
      transform: scale(0.5) translateY(10px);
    }
    100% {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
  
  @keyframes tagline-fade {
    to { opacity: 0.6; }
  }
  
  .lobby-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: var(--space-4) 0;
  }
  
  .lobby-footer {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    padding-top: var(--space-4);
  }
</style>
