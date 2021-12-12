<script lang="ts">
    import Product from "./Product.svelte";
    import FilterSummary from "../Filter/FilterSummary.svelte";
    import { titleMatch, jsVoid } from "../../utils";
    import {
        storedProducts,
        storedFilteredProducts,
        storedGlobalData,
        storedColors,
        storedParts,
        storedPartTypes,
        storedStates,
        storedTags,
        storedActiveSelection
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
    let sortDirection: string = 'desc';

    const chunks = 500;

    export let bbUrl: string;

    const sorter = [
        'Teile:parts',
        'Preise:price',
        'PreisProTeil:pricePerPart',
        'ABC:title',
    ];

    storedStates.subscribe(value => states = value);
    storedProducts.subscribe(value => products = value);
    storedParts.subscribe(value => parts = value);
    storedPartTypes.subscribe(value => partTypes = value);
    storedColors.subscribe(value => colors = value);
    storedTags.subscribe(value => tags = value);
    storedGlobalData.subscribe(value => {
        bbUrl = value.url;
    });
    storedFilteredProducts.subscribe(value => filteredProducts = value);
    storedActiveSelection.subscribe(value => {
        activeTagIds = value.tags || [];
        activePartIds = value.parts || [];
        activePartTypeIds = value.partTypes || [];
        activeColorIds = value.colors || [];
        activeStateIds = value.states || [];
        activeSearchString = value.search || '';
    });

    function sortItems(activeTagIds, activeColorIds, activeStateIds, activePartId, activePartTypeIds, products, sorting, sortDirection) {
        let raw = [];
        let withFilter = [];

        if (!!activeSearchString || activeTagIds.length > 0 || activePartIds.length > 0 || activePartTypeIds.length > 0 || activeColorIds.length > 0 || activeStateIds.length > 0) {
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
                    return activeTagIds.length === 0 || activeTagIds.length > 0 && countMatched > 0
                })

            withFilter = raw
                // filter search
                .filter(product => {
                    if (!!activeSearchString) {
                        let countMatched = 0;
                        countMatched += titleMatch({
                            matcher: [activeSearchString],
                            ignores: [],
                        }, product);
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

            withFilter = handleSort(withFilter);
        }

        storedFilteredProducts.update(() => ({
            raw,
            withFilter,
        }));

        return withFilter.slice(0, chunks);
    }

    function handleSort(withFilter) {
        // default sort
        if (sorting === '') {
            // sort unit 01-17
            withFilter.sort((a, b) => {
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

                if (isASC && prev > next
                    || isDESC && prev < next) {
                    return -1;
                }
                if (isASC && prev < next
                    || isDESC && prev > next) {
                    return 1;
                }
                return 0;
            })
        }

        return withFilter;
    }

    $: sortedItems = sortItems(activeTagIds, activeColorIds, activeStateIds, activePartIds, activePartTypeIds, products, sorting, sortDirection);

    const sort = (type) => {
        const isDifferentSort = type !== sorting;
        const doReset = sortDirection === 'asc';
        sorting = doReset && !isDifferentSort ? '' : type;
        sortDirection = doReset || isDifferentSort ? 'desc' : 'asc';
    }
</script>

<h2>
    Produkte <b>({filteredProducts.withFilter.length} / {products.length})</b>

    <FilterSummary {activeSearchString} {activeTagIds} {activeStateIds} {activeColorIds} {activePartIds}
                   {activePartTypeIds}/>

    <div class="flex flex--inline flex--vertical-center filter">
        <strong class="filter-headline">| Sortieren:</strong>
        {#each sorter as item}
            <a href={jsVoid} on:click={() => sort(item.split(':')[1])}>
                {item.split(':')[0]}
                {#if sorting === item.split(':')[1]}
                    {sortDirection === 'asc' ? '>' : '<'}
                {/if}
            </a>
        {/each}
    </div>
</h2>

<div class="flex flex--wrap">
    {#each sortedItems as product (product.id)}
        <Product {product} type="products"/>
    {/each}

    {#if filteredProducts.withFilter.length > chunks}
        <span class="warning">Aus Performancegründen werden nur {chunks} von {filteredProducts.withFilter.length}
            Produkte angezeigt</span>
    {/if}
</div>

<style lang="scss">
  @import '../../scss/variables';

  .filter {
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

  .warning {
    color: $color-unavailable;
    font-weight: bold;
    margin-top: $space-lg;
  }
</style>
