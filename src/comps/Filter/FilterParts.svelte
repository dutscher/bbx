<script lang="ts">
  import { onMount } from 'svelte';
  import { storedActiveSelection, storedParts, storedProducts, storedFilteredProducts } from '../../stores';
  import { getUrlParam, setUrlParams } from '../../utils';

  export let activePartIds: any = [];
  export let parts: any;
  export let products: any;
  export let filteredProducts: any = [];

  const urlParam = 'parts';
  const getUrlParams = () => {
    const queryTags = getUrlParam(urlParam).split(',');
    parts.map(part => {
      queryTags.map(queryTag => {
        if (part.seoName === queryTag) {
          clickItem(part);
        }
      });
    });
  };

  const clickItem = (item, withUrlUpdate?) => {
    if (item.count === 0) return;

    storedActiveSelection.update(store => {
      if (!(urlParam in store)) {
        store[urlParam] = [];
      }
      if (!store[urlParam].includes(item.id)) {
        store[urlParam].push(item.id);
      } else {
        store[urlParam] = store[urlParam].filter(itemId => itemId !== item.id);
      }

      if (withUrlUpdate) {
        setUrlParams(
          urlParam,
          parts.filter(part => store[urlParam].includes(part.id)).map(part => part.seoName)
        );
        store.reason = 'part-clicked';
      } else {
        store.reason = 'url-parsed';
      }
      return value;
    });
  };

  storedParts.subscribe(store => (parts = store));
  storedProducts.subscribe(store => (products = store));
  storedFilteredProducts.subscribe(store => (filteredProducts = store));

  onMount(() => {
    getUrlParams();
  });

  function sortItems() {
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
  }

  $: sortedItems = sortItems(filteredProducts);
</script>

<div class="flex parts">
  <h4>Parts</h4>
  <div class="flex flex--wrap bl">
    {#each sortedItems as part (part.id)}
      <div
        class="part{activePartIds.includes(part.id) ? ' active' : ''}{part.count === 0 ? ' disabled' : ''}"
        data-id={part.id}
        on:click={() => clickItem(part, true)}
        title="{part.de} ({part.count})"
      >
        <img src="/images/parts/25/{part.seoName}.jpg" alt={part.de} />
        {part.name}
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  @import '../../scss/variables';

  .parts {
    margin-top: $space-md;
  }

  .part {
    padding: 0 $space-xl;
    margin: $space-xs;
    border: solid 1px $color-primary-darker;
    border-radius: $border-radius-xl;
    background: $color-white;
    color: $color-primary-dark;
    cursor: pointer;
    user-select: none;
    position: relative;
    font-size: ms(0);

    @media (min-width: 750px) {
      font-size: ms(-2);
    }

    img {
      vertical-align: middle;
      border-radius: $space-lg;
    }

    &:focus,
    &:active,
    &.active {
      background: $color-primary-darker;
      color: $color-white;
    }

    &:hover {
      background: $color-primary-dark;
      color: $color-white;
    }

    &.disabled {
      opacity: 0.1;
      cursor: default;
    }
  }
</style>
