<script lang="ts">
  export let value, maxValue;
</script>

<div class="progress-bar" aria-valuemin="0" aria-valuemax="{maxValue}" aria-valuenow="{value}">
  <div class="progress-bar-inner" style="width: {value / maxValue * 100}%"></div>
</div>

<style>
  @keyframes fill {
    0% {
      width: 0;
    }
    100% {
      width: 100%;
    }
  }

  .animate-fill {
    animation: fill 2s ease-out forwards;
  }

  .progress-bar {
    background-color: #f3f3f3;
    border-radius: 20px;
    overflow: hidden;
  }
  .progress-bar-inner {
    height: 20px;
    background-color: #4caf50;
    width: 0;
    animation: fill 2s ease-in-out forwards;
  }
</style>
