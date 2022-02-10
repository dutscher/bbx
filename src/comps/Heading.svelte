<script>
  export let level = 2;
  let className = '';
  export { className as class };
</script>

{#if level === 1}
  <h1 class={className} on:click>
    <slot />
  </h1>
{:else if level === 2}
  <h2 class={className} on:click>
    <slot />
  </h2>
{:else if level === 3}
  <h3 class={className} on:click>
    <slot />
  </h3>
{/if}

<style lang="scss">
  @import '../scss/variables';

  h1 {
    color: $color-primary;
  }
</style>
