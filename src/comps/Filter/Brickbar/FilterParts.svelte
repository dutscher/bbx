<script lang="ts">
  import { storedActiveSelection, storedParts, storedProducts, storedFilteredProducts } from '@stores';
  import { onMount, getUrlParam, setUrlParams, ess, jsVoid } from '@utils';
  import { clickItem } from './click-item';

  export let activePartIds: any = [];
  export let parts: any;
  export let products: any;
  export let filteredProducts: any = [];

  let sortedItems: any = [];
  const urlParam = 'parts';

  storedParts.subscribe(store => (parts = store));
  storedProducts.subscribe(store => (products = store));
  storedFilteredProducts.subscribe(store => (filteredProducts = store));

  const getUrlParams = () => {
    const queryTags = getUrlParam(urlParam).split(',');
    parts.map(part => {
      queryTags.map(queryTag => {
        if (part.seoName === queryTag) {
          clickItem(urlParam, parts, part);
        }
      });
    });
  };

  const sortItems = filteredProducts => {
    let sortedData = [];
    // get count of products
    sortedData = parts
      .map((part, partId) => {
        part.count = (
          filteredProducts && filteredProducts.withFilter.length > 0 ? filteredProducts.withFilter : products
        ).filter(product => product.partTags && product.partTags.includes(partId)).length;
        return part;
      })
      // sort state
      .sort((a, b) => {
        if (a.label < b.label) {
          return -1;
        }
        if (a.label > b.label) {
          return 1;
        }
        return 0;
      });
    return sortedData;
  };

  $: sortedItems = sortItems(filteredProducts);

  onMount(() => {
    getUrlParams();
  });
</script>

<div class="flex">
  <h4>Parts</h4>
  <div class="flex flex--wrap flex--gap">
    {#each sortedItems as part (part.id)}
      <a
        class={ess(
          'chip border small no-margin round',
          activePartIds.includes(part.id) && 'active',
          part.count === 0 && 'disabled'
        )}
        data-id={part.id}
        on:click={() => clickItem(urlParam, parts, part, true)}
        title={part.de}
        href={jsVoid}
      >
        <img src="/images/parts/25/{part.seoName}.jpg" alt={part.de} />
        <span class="badge round">{part.count}</span>
        <span>{part.name}</span>
      </a>
    {/each}
  </div>
</div>

<style lang="scss">
  h4 {
    width: 64rem;
  }

  .chip {
    .badge {
      display: none;
    }

    &.disabled {
      opacity: 0.1;
      pointer-events: none;
    }

    &.active,
    &:active,
    &:hover {
      .badge {
        display: inline-flex;
      }
    }
  }
</style>
