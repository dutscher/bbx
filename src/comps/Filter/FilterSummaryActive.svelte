<script lang="ts">
  export let label: string = '';
  export let activeStr: string = '';
  export let reset: string = '';
  export let activeIds: any = [];
  export let store: any = [];
  export let onClick: any = () => {};
</script>

{#if !!activeStr || activeIds.length > 0}
  {#if !!activeStr}
    <span class="chip round small link white-text no-margin" on:click={e => onClick(e, 'search')}>
      <i class="small">delete</i>
      <span>{label}: "{activeStr}"</span>
      <div class="tooltip bottom small-margin">entferne {label}: "{activeStr}"</div>
    </span>
  {:else if activeIds.length > 0}
    {#each activeIds as itemId}
      <span class="chip round small link white-text no-margin" on:click={e => onClick(e, itemId)}>
        <i class="small">delete</i>
        <span>{store.filter(item => item.id === itemId)[0].de}</span>
        <div class="tooltip bottom small-margin">
          entferne {label}: {store.filter(item => item.id === itemId)[0].de}
        </div>
      </span>
    {/each}
  {/if}
{/if}

{#if reset}
  <span class="chip round small link white-text no-margin" on:click={e => onClick(e, 'all')}>
    <i class="small">delete</i>
    <span>{label}</span>
    <div class="tooltip bottom small-margin">entferne {label}</div>
  </span>
{/if}

<style lang="scss">
  .link {
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
</style>
