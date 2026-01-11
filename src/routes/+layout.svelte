<script lang="ts">
  import '$lib/styles/global.css';
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { audioStore } from '$lib/stores/audio';
  
  let { children } = $props();
  
  // Initialize audio context on first user interaction
  onMount(() => {
    const handleInteraction = () => {
      audioStore.init();
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('click', handleInteraction);
    };
    
    document.addEventListener('touchstart', handleInteraction, { once: true });
    document.addEventListener('click', handleInteraction, { once: true });
  });
</script>

<svelte:head>
  <link rel="icon" href="{base}/icons/favicon.svg" />
</svelte:head>

{@render children()}
