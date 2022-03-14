<script lang="ts">
  export let label: string = '';
  export let activStr: string = '';
  export let activeIds: any = [];
  export let store: any = [];
  export let onClick: any = () => {};
</script>

{#if !!activStr || activeIds.length > 0}
  <span class="filter">
    <u>{label}:</u>&nbsp;
    {#if !!activStr}
      <span class="filter__item link" on:click={e => onClick(e, 'search')}>
        <span>"{activStr}"</span>
        <i class="small" on:click={e => onClick(e, 'search')}>delete</i>
        <div class="tooltip">Lösche Suche</div>
      </span>
    {:else if activeIds.length > 0}
      {#each activeIds as itemId}
        <span class="filter__item link" on:click={e => onClick(e, itemId)}>
          <span>{store.filter(item => item.id === itemId)[0].de}</span>
          <i class="small">delete</i>
          <div class="tooltip">Lösche Filter</div>
        </span>
      {/each}
    {/if}
  </span>
{/if}

<style lang="scss">
  @import '../../scss/variables';

  .filter {
    margin-left: $space-lg;

    &__item {
      cursor: pointer;
    }

    &__item:not(:last-child) {
      margin-right: $space-md;
    }
  }
</style>
