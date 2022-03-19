<script lang="ts">
  export let label: string = '';
  export let activeStr: string = '';
  export let reset: string = '';
  export let activeIds: any = [];
  export let store: any = [];
  export let onClick: any = () => {};
</script>

{#if !!activeStr || activeIds.length > 0}
  <b>{label}:</b>
  {#if !!activeStr}
    <span class="filter__item link" on:click={e => onClick(e, 'search')}>
      <i class="small link">delete</i>
      <span>"{activeStr}"</span>
      <div class="tooltip bottom small-margin">lösche "{activeStr}"</div>
    </span>
  {:else if activeIds.length > 0}
    {#each activeIds as itemId}
      <span class="filter__item link" on:click={e => onClick(e, itemId)}>
        <i class="small link">delete</i>
        <span>{store.filter(item => item.id === itemId)[0].de}</span>
        <div class="tooltip bottom small-margin">lösche Filter</div>
      </span>
    {/each}
  {/if}
{/if}

{#if reset}
  <span on:click={e => onClick(e, 'all')} class="filter__item link">
    <i class="small link">delete</i>
    <span>{label}</span>
    <div class="tooltip bottom small-margin">Lösche alle Filter</div>
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
