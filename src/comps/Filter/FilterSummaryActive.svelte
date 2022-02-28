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
      <span>"{activStr}"</span>
      <i class="small" on:click={e => onClick(e, 'search')}>delete</i>
    {:else if activeIds.length > 0}
      {#each activeIds as itemId}
        <span class="filter__item link">
          <span>{store.filter(item => item.id === itemId)[0].de}</span>
          <i class="small" on:click={e => onClick(e, itemId)}>delete</i>
        </span>
      {/each}
    {/if}
  </span>
{/if}

<style lang="scss">
  @import '../../scss/variables';

  .filter {
    margin-right: $space-lg;

    &__item:not(:last-child) {
      margin-right: $space-md;
    }

    i {
      cursor: pointer;
    }
  }
</style>
