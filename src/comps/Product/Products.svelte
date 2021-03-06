<script lang="ts">
  import { titleMatch, setUrlParams } from '@utils';
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
  } from '@stores';
  import Specials from '../Specials/Specials.svelte';
  import Product from './Product.svelte';
  import { handleProductSort } from './sorting';
  import ProductFilter from './ProductFilter.svelte';
  import ExtraFilter from '../Filter/ExtraFilter.svelte';

  let activeTagIds: any = [];
  let activePartIds: any = [];
  let activePartTypeIds: any = [];
  let activeColorIds: any = [];
  let activeStateIds: any = [];
  let activeSearchString: string = '';
  let filteredProducts: any = [];
  let sortedItems: any = [];
  let extraFilter = {
    parts: { show: false, count: 0 },
    hot: { show: false, count: 0 },
    new: { show: false, count: 0 },
  };

  let parts: any;
  let partTypes: any;
  let colors: any;
  let products: any;
  let states: any;
  let tags: any;
  let activeSorting: any;

  const urlParam = 'product';
  const chunks = 500;

  storedStates.subscribe(store => (states = store));
  storedProducts.subscribe(store => (products = store));
  storedParts.subscribe(store => (parts = store));
  storedPartTypes.subscribe(store => (partTypes = store));
  storedColors.subscribe(store => (colors = store));
  storedTags.subscribe(store => (tags = store));
  storedFilteredProducts.subscribe(store => (filteredProducts = store));
  storedProductsSorting.subscribe(store => (activeSorting = store));
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

  const sortItems = (
    activeTagIds,
    activeColorIds,
    activeStateIds,
    activePartId,
    activePartTypeIds,
    products,
    sorting,
    filterParts,
    filterNew,
    filterHot
  ) => {
    // reset counter
    Object.keys(extraFilter).map(filter => {
      extraFilter[filter].count = 0;
    });

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
        })
        // filter parts
        .filter(product => {
          if (product.isPart) {
            extraFilter.parts.count++;
          }
          return (!extraFilter.parts.show && !product.isPart) || (extraFilter.parts.show && product.isPart);
        })
        // filter flags
        .filter(product => {
          if (product.isHot) {
            extraFilter.hot.count++;
          }
          if (product.isNew || product.isNewSoon) {
            extraFilter.new.count++;
          }
          return (
            (!extraFilter.hot.show && !extraFilter.new.show) ||
            (extraFilter.hot.show && product.isHot) ||
            (extraFilter.new.show && (product.isNew || product.isNewSoon))
          );
        });

      withFilter = handleProductSort(withFilter, activeSorting);
    }

    storedFilteredProducts.update(() => ({
      raw,
      withFilter,
    }));

    return withFilter.slice(0, chunks);
  };

  $: sortedItems = sortItems(
    activeTagIds,
    activeColorIds,
    activeStateIds,
    activePartIds,
    activePartTypeIds,
    products,
    activeSorting,
    extraFilter.parts.show,
    extraFilter.hot.show,
    extraFilter.new.show
  );
</script>

<ProductFilter {filteredProducts} />

<Specials />

<ExtraFilter {extraFilter} onChange={store => (extraFilter = store)} />

<h3>{filteredProducts.withFilter.length} von {products.length} Produkte</h3>

<div class="flex flex--gap flex--wrap">
  {#each sortedItems as product (product.id)}
    <Product {product} type="products" />
  {/each}

  {#if filteredProducts.withFilter.length > chunks}
    <span class="warning red-text bold small-margin">
      Aus Performancegründen werden nur {chunks} von {filteredProducts.withFilter.length}
      Produkte angezeigt
    </span>
  {/if}
</div>

<style lang="scss">
  .filter {
    flex-direction: column;

    @media (min-width: 1024px) {
      flex-direction: row;
    }
  }
</style>
