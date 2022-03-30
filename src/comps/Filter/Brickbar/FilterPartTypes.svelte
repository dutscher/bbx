<script lang="ts">
  import { storedActiveSelection, storedPartTypes, storedProducts, storedFilteredProducts } from '../../../stores';
  import { onMount, getUrlParam, setUrlParams, titleMatch, ess, jsVoid } from '../../../utils';
  import { ID_PARTS } from '../../../_interfaces';

  export let activePartTypeIds: any = [];
  export let partTypes: any;
  export let products: any;
  export let filteredProducts: any = [];

  let sortedItems: any;

  const urlParam = 'partTypes';
  const getUrlParams = () => {
    const queryTags = getUrlParam(urlParam).split(',');
    partTypes.map(part => {
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
          partTypes.filter(part => store[urlParam].includes(part.id)).map(part => part.seoName)
        );
        store.reason = 'part-type-clicked';
      } else {
        store.reason = 'url-parsed';
      }
      return store;
    });
  };

  storedPartTypes.subscribe(store => (partTypes = store));
  storedProducts.subscribe(store => (products = store));
  storedFilteredProducts.subscribe(store => (filteredProducts = store));

  function sortItems(filteredProducts) {
    let sortedData = [];
    // get count of products
    sortedData = partTypes
      .map(part => {
        part.count = (
          filteredProducts && filteredProducts.withFilter.length > 0 ? filteredProducts.withFilter : products
        )
          .filter(product => product.tags.includes(ID_PARTS))
          .filter(product => titleMatch(part, product) > 0).length;
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

  onMount(() => {
    getUrlParams();
  });
</script>

<div class="flex">
  <h4>Typen</h4>
  <div class="flex flex--wrap flex--gap">
    {#each sortedItems as part (part.id)}
      <a
        class={ess(
          'chip border small no-margin round',
          activePartTypeIds.includes(part.id) && 'active',
          part.count === 0 && 'disabled'
        )}
        data-id={part.id}
        on:click={() => clickItem(part, true)}
        title={part.name}
        href={jsVoid}
      >
        <span class="badge round">{part.count}</span>
        <span>
          {part.de}
        </span>
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

    &.active,
    &:active,
    &:hover {
      .badge {
        display: inline-flex;
      }
    }
  }
</style>
