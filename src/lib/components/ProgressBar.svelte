<script lang="ts">
	import { onMount } from "svelte";

  export let value, maxValue;
  let progress = 0;

  onMount(() => {
    setTimeout(() => {
      progress = value;
    }, 0);
  });
</script>

<div class="progress-bar" aria-valuemin="0" aria-valuemax="{maxValue}" aria-valuenow="{value}">
  <div class="progress-bar-inner" style="width: {progress / maxValue * 100}%"></div>
</div>

<style>
  .progress-bar {
    background-color: #f3f3f3;
    border-radius: 20px;
    overflow: hidden;
  }
  .progress-bar-inner {
    height: 20px;
    background-color: #4caf50;
    width: 0;
    transition: width 2s ease-in-out;
  }
</style>
