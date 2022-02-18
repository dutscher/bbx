<script lang="ts">
  import { onMount } from 'svelte';
  import Product from './Product.svelte';
  import FilterSummary from '../Filter/FilterSummary.svelte';
  import { titleMatch, jsVoid, setUrlParams, getUrlParam, getAllUrlParams } from '../../utils';
  import { ID_PARTS } from '../../_interfaces';
  import {
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

  let activeTagIds: any = [];
  let activePartIds: any = [];
  let activePartTypeIds: any = [];
  let activeColorIds: any = [];
  let activeStateIds: any = [];
  let activeSearchString: string = '';
  let filteredProducts: any = [];

  let parts: any;
  let partTypes: any;
  let colors: any;
  let products: any;
  let states: any;
  let tags: any;
  let sorting: string = '';
  let sortTitle: string = '';
  let sortDirection: string = 'desc';
  const urlParam = 'product';
  const chunks = 500;

  export let bbUrl: string;

  const sorter = ['Teile:parts', 'Preise:price', 'PreisProTeil:pricePerPart', 'ABC:title', '1111:parts'];

  storedStates.subscribe(store => (states = store));
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
    if (Object.keys(allParams).length === 1 && !!queryProductId) {
      // close all toggles
      localStore.visibility('reset');
      // update search for product
      storedActiveSelection.update(store => {
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
    sorting,
    sortDirection
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
    if (sorting === '') {
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

    if (!!sorting) {
      if (sortTitle === '1111') {
        withFilter = withFilter.filter(product => product.parts <= 1111);
      }

      // sort by
      // asc > aufsteigend 123
      // desc < absteigend 321
      withFilter = withFilter.sort((a, b) => {
        let prev = a[sorting];
        let next = b[sorting];
        const isASC = sortDirection === 'asc';
        const isDESC = sortDirection === 'desc';

        if (sorting === 'title') {
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
    sorting,
    sortDirection
  );

  const clickSort = sortRaw => {
    const [potentialSortTitle, type] = sortRaw.split(':');
    const isDifferentSort = type !== sorting;
    const doReset = sortDirection === 'desc';
    sorting = doReset && !isDifferentSort ? '' : type;
    sortTitle = doReset && !isDifferentSort ? '' : potentialSortTitle;
    sortDirection = doReset || isDifferentSort ? 'asc' : 'desc';
  };

  const exportCSV = () => {
    const divider = ';';
    let exportString =
      ['ID', 'Hersteller', 'Artikelnummer', 'Artikelbezeichnung', 'Farbe', 'Menge', 'Preis'].join(divider) + '\n';
    /*
    ID: 607425
    Hersteller NR: BPP3943b-black
    Artikelnummer: 3943b
    Artikelbezeichng: ROCKET STEP 4X4X2 X 15
    Farbe: Black
    Menge (VPE?): 15
    Preis: 5,95 €
  */
    filteredProducts.raw
      //.reverse()
      //.slice(0, 50)
      .map(product => {
        const newLine = [
          product.id,
          '',
          product.partNr,
          product.title,
          product.partColor ? product.partColor.name : '',
          product.parts,
          product.price,
        ];
        exportString += newLine.join(divider) + '\n';
      });
    console.log(exportString);
  };

  // first to remove localstorage keys before onMount
  getUrlParams();
  // to update stores
  onMount(() => {
    getUrlParams();
  });
</script>

<h2 class="">
  Produkte <b>({filteredProducts.withFilter.length} / {products.length})</b>

  <FilterSummary
    {activeSearchString}
    {activeTagIds}
    {activeStateIds}
    {activeColorIds}
    {activePartIds}
    {activePartTypeIds}
  />

  <div class="flex flex--gap flex--inline flex--vertical-center flex--wrap filter with-text-shadow">
    <strong class="filter-headline">| Sortieren:</strong>
    {#each sorter as item}
      <a href={jsVoid} on:click={() => clickSort(item)}>
        {item.split(':')[0]}
        {#if sorting === item.split(':')[1]}
          {sortDirection === 'asc' ? '>' : '<'}
        {/if}
      </a>
    {/each}

    {#if activeTagIds.includes(ID_PARTS)}
      <strong class="filter-headline">&nbsp;| CSV export:</strong>
      <a href={jsVoid} on:click={() => exportCSV()}>Do IT</a>
    {/if}
  </div>
</h2>

<div class="flex flex--gap flex--wrap">
  {#each sortedItems as product (product.id)}
    <Product {product} type="products" />
  {/each}

  {#if filteredProducts.withFilter.length > chunks}
    <span class="warning"
      >Aus Performancegründen werden nur {chunks} von {filteredProducts.withFilter.length}
      Produkte angezeigt</span
    >
  {/if}
</div>

<style lang="scss">
  @import '../../scss/variables';

  $selector: '.filter';
  #{$selector} {
    font-size: ms(-1);
    color: $color-primary;
    cursor: default;

    a {
      margin-left: $space-sm;
      color: inherit;

      &:hover {
        color: $color-primary-darker;
      }
    }
  }

  :global([data-theme='dark'] #{$selector} a:hover) {
    color: $color-white !important;
  }

  :global .filter-headline {
    font-size: ms(1);
  }

  .warning {
    color: $color-unavailable;
    font-weight: bold;
    margin-top: $space-lg;
  }
</style>
