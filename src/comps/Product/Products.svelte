<script lang="ts">
  import { onMount } from 'svelte';
  import Product from './Product.svelte';
  import FilterSummary from '../Filter/FilterSummary.svelte';
  import ProductSorter from '../Product/ProductSorter.svelte';
  import { titleMatch, setUrlParams, getUrlParam, getAllUrlParams } from '../../utils';
  import {
    storedProductsSorting,
    storedProducts,
    storedFilteredProducts,
    storedGlobalData,
    storedColors,
    storedParts,
    storedPartTypes,
    storedStates,
    storedTags,
    storedActiveSelection,
    storedActiveProduct,
    localStore,
  } from '../../stores';

  export let bbUrl: string;

  let activeTagIds: any = [];
  let activePartIds: any = [];
  let activePartTypeIds: any = [];
  let activeColorIds: any = [];
  let activeStateIds: any = [];
  let activeSearchString: string = '';
  let filteredProducts: any = [];
  let sortedItems: any = [];

  let parts: any;
  let partTypes: any;
  let colors: any;
  let products: any;
  let states: any;
  let tags: any;
  let sorting: any;
  const urlParam = 'product';
  const chunks = 500;

  storedStates.subscribe(store => (states = store));
  storedProductsSorting.subscribe(store => (sorting = store));
  storedProducts.subscribe(store => (products = store));
  storedParts.subscribe(store => (parts = store));
  storedPartTypes.subscribe(store => (partTypes = store));
  storedColors.subscribe(store => (colors = store));
  storedTags.subscribe(store => (tags = store));
  storedGlobalData.subscribe(store => (bbUrl = store.url));
  storedFilteredProducts.subscribe(store => (filteredProducts = store));
  storedActiveSelection.subscribe(store => {
    activeTagIds = store.tags;
    activePartIds = store.parts;
    activePartTypeIds = store.partTypes;
    activeColorIds = store.colors;
    activeStateIds = store.states;
    activeSearchString = store.search;

    if (store.reason === 'remove-all-filters') {
      setUrlParams(urlParam, '');
    }
  });
  storedActiveProduct.subscribe(store => {
    // update url
    if ((store.reason === 'open-tooltip' || store.reason === 'click-on-zoom') && store.product.id !== 0) {
      setUrlParams(urlParam, store.product.id);
    } else if (store.reason === 'click-outside' || store.reason === 'close-tooltip') {
      setUrlParams(urlParam, '');
    }
  });

  const getUrlParams = () => {
    const allParams = getAllUrlParams();
    const queryProductId = getUrlParam(urlParam);
    if (
      !Object.keys(allParams).includes('search') &&
      Object.keys(allParams).some(param => ['page', 'product'].includes(param)) &&
      !!queryProductId
    ) {
      // close all toggles
      localStore.visibility('reset');
      // update search for product
      // open page
      storedActiveSelection.update(store => {
        store.page = 'products';
        store.search = queryProductId;
        return store;
      });
      // open tooltip
      storedActiveProduct.update(store => {
        store.product = {
          id: parseInt(queryProductId),
          type: 'products',
        };
        store.reason = 'url-init';
        return store;
      });
    }
  };

  const sortItems = (
    activeTagIds,
    activeColorIds,
    activeStateIds,
    activePartId,
    activePartTypeIds,
    products,
    sorting
  ) => {
    let raw = [];
    let withFilter = [];

    if (
      !!activeSearchString ||
      activeTagIds.length > 0 ||
      activePartIds.length > 0 ||
      activePartTypeIds.length > 0 ||
      activeColorIds.length > 0 ||
      activeStateIds.length > 0
    ) {
      raw = products
        // filter products without cats
        .filter(product => product.cats[0] !== -1)
        // filter only by tags
        .filter(product => {
          let countMatched = 0;
          activeTagIds.map(tagId => {
            if (product.tags.includes(tagId)) {
              countMatched++;
            }
          });
          return activeTagIds.length === 0 || (activeTagIds.length > 0 && countMatched > 0);
        });

      withFilter = raw
        // filter search
        .filter(product => {
          if (!!activeSearchString) {
            let countMatched = 0;
            countMatched += titleMatch(
              {
                matcher: [activeSearchString],
                ignores: [],
              },
              product
            );
            return countMatched > 0;
          } else return true;
        })
        // filter parts
        .filter(product => {
          let countMatched = 0;
          if (product.partTags) {
            activePartIds.map(partId => {
              const part = parts.find(part => part.id === partId);
              countMatched += product.partTags.includes(part.id);
            });
          }
          return activePartIds.length === 0 || countMatched > 0;
        })
        // filter parttypes
        .filter(product => {
          let countMatched = 0;
          activePartTypeIds.map(partId => {
            const part = partTypes.find(part => part.id === partId);
            countMatched += titleMatch(part, product);
          });
          return activePartTypeIds.length === 0 || countMatched > 0;
        })
        // filter colors
        .filter(product => {
          let countMatched = 0;
          activeColorIds.map(colorId => {
            const color = colors.find(color => color.id === colorId);
            countMatched += titleMatch(color, product);
          });
          return activeColorIds.length === 0 || countMatched > 0;
        })
        // filter states
        .filter(product => {
          let countMatched = 0;
          activeStateIds.map(stateId => {
            if (product.state.id === stateId) {
              countMatched++;
            }
          });
          return activeStateIds.length === 0 || countMatched > 0;
        });

      withFilter = handleProductSort(withFilter);
    }

    storedFilteredProducts.update(() => ({
      raw,
      withFilter,
    }));

    return withFilter.slice(0, chunks);
  };

  const handleProductSort = withFilter => {
    // default sort
    if (sorting.sorting === '') {
      // sort unit 01-17
      withFilter
        .sort((a, b) => {
          if (a.title < b.title) {
            return -1;
          }
          if (a.title > b.title) {
            return 1;
          }
          return 0;
        })
        // sort state
        .sort((a, b) => {
          if (a.state.id < b.state.id) {
            return -1;
          }
          if (a.state.id > b.state.id) {
            return 1;
          }
          return 0;
        });
    }

    if (!!sorting.sorting) {
      if (sorting.sortTitle === '1111') {
        withFilter = withFilter.filter(product => product.parts <= 1111);
      }

      // sort by
      // asc > aufsteigend 123
      // desc < absteigend 321
      withFilter = withFilter.sort((a, b) => {
        let prev = a[sorting.sorting];
        let next = b[sorting.sorting];
        const isASC = sorting.sortDirection === 'asc';
        const isDESC = sorting.sortDirection === 'desc';

        if (sorting.sorting === 'title') {
          prev = prev.toLowerCase();
          next = next.toLowerCase();
        }

        if ((isASC && prev > next) || (isDESC && prev < next)) {
          return -1;
        }
        if ((isASC && prev < next) || (isDESC && prev > next)) {
          return 1;
        }
        return 0;
      });
    }

    return withFilter;
  };

  $: sortedItems = sortItems(
    activeTagIds,
    activeColorIds,
    activeStateIds,
    activePartIds,
    activePartTypeIds,
    products,
    sorting
  );

  // first to remove localstorage keys before onMount
  getUrlParams();
  // to update stores
  onMount(() => {
    getUrlParams();
  });
</script>

<h2>{filteredProducts.withFilter.length} / {products.length}</h2>

<FilterSummary
  {activeSearchString}
  {activeTagIds}
  {activeStateIds}
  {activeColorIds}
  {activePartIds}
  {activePartTypeIds}
/>

<ProductSorter {filteredProducts} {activeTagIds} />

<div class="flex flex--gap flex--wrap">
  {#each sortedItems as product (product.id)}
    <Product {product} type="products" />
  {/each}

  {#if filteredProducts.withFilter.length > chunks}
    <span class="warning red-text bold"
      >Aus Performancegründen werden nur {chunks} von {filteredProducts.withFilter.length}
      Produkte angezeigt</span
    >
  {/if}
</div>

<style lang="scss">
  @import '../../scss/variables';

  .warning {
    margin-top: $space-lg;
  }
</style>
