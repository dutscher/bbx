<script>
  export let condition = false;
</script>

{#if condition}
  <!-- Imagine this is svelte:elemment or svelte:component -->
  <!-- <svelte:element {tag} {...$$restProps}><slot /></svelte:element> -->
  <nav {...$$restProps}><slot /></nav>
{:else}
  <slot />
{/if}
