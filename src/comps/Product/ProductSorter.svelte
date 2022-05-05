<script lang="ts">
  import { getUrlParam, jsVoid, onMount, setUrlParams } from '@utils';
  import { storedProductsSorting } from '@stores';
  import { ID_PARTS } from '@interfaces';
  import { sorter, exportCSV } from './sorting';

  export let filteredProducts: any = [];
  export let activeTagIds: any = [];

  let sortType: string = '';
  let sortDirection: string = 'desc';
  let sortTitle: string = ''; // 1111 special sorting, can someday removed
  const urlParam = 'sorter';
  const sorterItems = sorter.map(item => {
    const [title, productType] = item.split(':');
    return {
      title,
      productType,
    };
  });

  const clickSort = sortBy => {
    const isDifferentSort = sortBy.productType !== sortType;
    const doReset = sortDirection === 'desc';
    // set svelte
    sortType = doReset && !isDifferentSort ? '' : sortBy.productType;
    sortDirection = doReset || isDifferentSort ? 'asc' : 'desc';
    sortTitle = doReset && !isDifferentSort ? '' : sortBy.title;

    setUrlParams(urlParam, !!sortType ? [sortType, sortDirection, sortTitle] : []);
    // set other
    storedProductsSorting.set({
      sortType,
      sortDirection,
      sortTitle,
    });
  };

  const getUrlParams = () => {
    // ?sorter=parts,asc,Teile
    const [sortType_, sortDirection_, sortTitle_] = getUrlParam(urlParam).split(',');

    sortType = sortType_;
    sortDirection = sortDirection_;
    sortTitle = sortTitle_;

    storedProductsSorting.set({
      sortType,
      sortDirection,
      sortTitle,
    });
  };

  onMount(() => {
    getUrlParams();
  });
</script>

{#if filteredProducts.withFilter.length > 0}
  <div class="flex flex--gap flex--top flex--inline flex--wrap flex--middle flex--right">
    <b>Sortieren:</b>
    {#each sorterItems as item}
      <div class="chip round small link white-text no-margin" on:click={() => clickSort(item)}>
        {#if sortType === item.productType && sortTitle === item.title}
          {sortDirection === 'asc' ? '>' : '<'}
          &nbsp;
        {/if}
        <span>{item.title}</span>
      </div>
    {/each}

    {#if false && activeTagIds.includes(ID_PARTS)}
      <b>&nbsp;| CSV export:</b>
      <a href={jsVoid} class="link" on:click={() => exportCSV()}>Do IT</a>
    {/if}
  </div>
{/if}

<style lang="scss">
  .link {
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
</style>
