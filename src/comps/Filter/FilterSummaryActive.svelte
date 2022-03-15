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
        <i class="small primary-text" on:click={e => onClick(e, 'search')}>delete</i>
        <span>"{activStr}"</span>
        <div class="tooltip bottom small-margin">lösche "{activStr}"</div>
      </span>
    {:else if activeIds.length > 0}
      {#each activeIds as itemId}
        <span class="filter__item link" on:click={e => onClick(e, itemId)}>
          <i class="small primary-text">delete</i>
          <span>{store.filter(item => item.id === itemId)[0].de}</span>
          <div class="tooltip bottom small-margin">lösche Filter</div>
        </span>
      {/each}
    {/if}
  </span>
{/if}

<style lang="scss">
  @import '../../scss/variables';

  .filter {
    margin-left: $space-lg;

    &__item:not(:last-child) {
      margin-right: $space-md;
    }
  }
</style>
