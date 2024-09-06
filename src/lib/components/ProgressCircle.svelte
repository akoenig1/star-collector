<script lang="ts">
  export let value, maxValue;

  let progressInverse = 100 - (value / maxValue * 100);
</script>

<div class="relative size-40">
  <svg class="size-full -rotate-90" viewBox="0 0 36 36">
    <circle cx="18" cy="18" r="16" fill="none" class="stroke-current text-gray-200 dark:text-neutral-700" stroke-width="2"></circle>
    <circle cx="18" cy="18" r="16" fill="none" class="stroke-current text-blue-600 dark:text-blue-500 animate-fill" style="--progress: {progressInverse}" stroke-width="2" stroke-dasharray="100" stroke-dashoffset={value} stroke-linecap="round"></circle>
  </svg>

  <div class="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2">
    <span class="text-center text-2xl font-bold text-blue-600 dark:text-blue-500">{value}</span>
  </div>
</div>

<style>
  @keyframes fill {
    from {
      stroke-dashoffset: 100;
    }
    to {
      stroke-dashoffset: var(--progress)
    }
  }

  .animate-fill {
    animation: fill 2s ease-out forwards;
  }
</style>
