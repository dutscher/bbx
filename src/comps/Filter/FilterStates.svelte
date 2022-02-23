<script lang="ts">
  import { onMount } from 'svelte';
  import { storedActiveSelection, storedStates, storedProducts, storedFilteredProducts } from '../../stores';
  import { getUrlParam, setUrlParams } from '../../utils';

  export let activeStateIds: any = [];
  export let activeColorIds: any = [];
  export let activePartIds: any = [];
  export let activePartTypeIds: any = [];
  export let activeSearchString: string = '';

  let filteredProducts: any = [];
  let states: any;
  let products: any;

  const urlParam = 'states';
  const getUrlParams = () => {
    // ?tags=piraten
    const queryTags = getUrlParam(urlParam).split(',');
    states.map(state => {
      queryTags.map(queryTag => {
        if (state.name === queryTag) {
          clickItem(state);
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
          states.filter(item => store[urlParam].includes(item.id)).map(item => item.name)
        );
        store.reason = 'state-clicked';
      } else {
        store.reason = 'url-parsed';
      }

      return store;
    });
  };

  storedStates.subscribe(store => (states = store));
  storedProducts.subscribe(store => (products = store));
  storedFilteredProducts.subscribe(store => (filteredProducts = store));

  onMount(() => {
    getUrlParams();
  });

  function sortItems(filteredProducts) {
    let sortedData = [];
    // get count of products
    sortedData = states
      .map(state => {
        state.count = (
          filteredProducts.withFilter && filteredProducts.withFilter.length > 0
            ? !!activeSearchString ||
              activeColorIds.length > 0 ||
              activePartIds.length > 0 ||
              activePartTypeIds.length > 0
              ? filteredProducts.withFilter
              : filteredProducts.raw
            : products
        ).filter(product => {
          if (product.state) {
            return product.state.id === state.id;
          } else {
            console.log(product);
            return false;
          }
        }).length;
        return state;
      })
      // sort state
      .sort((a, b) => {
        if (a.id < b.id) {
          return -1;
        }
        if (a.id > b.id) {
          return 1;
        }
        return 0;
      });
    return sortedData;
  }

  $: sortedItems = sortItems(filteredProducts);

  const getClasses = state =>
    [
      'chip small round no-margin white-text',
      activeStateIds.includes(state.id) && 'active',
      state.count === 0 && 'disabled',
      state.color,
    ]
      .filter(css => !!css)
      .join(' ');
</script>

<details class="card small-padding" nopen>
  <summary>Status</summary>
  <div class="flex flex--gap flex--wrap">
    {#each sortedItems as state (state.id)}
      <div class={getClasses(state)} data-count={state.count} on:click={() => clickItem(state, true)}>
        <p>{state.de}</p>
        <span class="chip_state">{state.count}</span>
      </div>
    {/each}
  </div>
</details>

<style lang="scss">
  @import '../../scss/variables';

  .chip {
    cursor: pointer;
    user-select: none;

    &:hover,
    &.active {
      outline: 2px solid $color-primary-darker;
    }

    &.disabled {
      opacity: 0.2;
      cursor: default;
    }
  }
</style>
