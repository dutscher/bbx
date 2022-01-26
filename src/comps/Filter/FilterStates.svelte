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
    }

    const clickItem = (item, withUrlUpdate?) => {
        if (item.count === 0) return;

        storedActiveSelection.update(value => {
            if (!(urlParam in value)) {
                value[urlParam] = [];
            }
            if (!value[urlParam].includes(item.id)) {
                value[urlParam].push(item.id);
            } else {
                value[urlParam] = value[urlParam].filter(itemId => itemId !== item.id);
            }

            if (withUrlUpdate) {
                setUrlParams(
                    urlParam,
                    states
                        .filter(item => value[urlParam].includes(item.id))
                        .map(item => item.name)
                )
                value.reason = 'state-clicked';
            } else {
                value.reason = 'url-parsed';
            }

            return value;
        });
    }

    storedStates.subscribe(value => states = value);
    storedProducts.subscribe(value => products = value);
    storedFilteredProducts.subscribe(value => filteredProducts = value);

    onMount(() => {
        getUrlParams();
    });

    function sortItems(filteredProducts) {
        let sortedData = [];
        // get count of products
        sortedData = states
            .map((state) => {
                state.count = (
                    (filteredProducts.withFilter && filteredProducts.withFilter.length > 0)
                        ? (
                            (!!activeSearchString
                                || activeColorIds.length > 0
                                || activePartIds.length > 0
                                || activePartTypeIds.length > 0)
                                ? filteredProducts.withFilter
                                : filteredProducts.raw
                        ) : products)
                    .filter(product => {
                        if (product.state) {
                            return product.state.id === state.id;
                        } else {
                            console.log(product)
                            return false;
                        }
                    }).length
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

    const getClasses = (state) => [
        'filter',
        activeStateIds.includes(state.id) && 'active',
        state.count === 0 && 'disabled',
        state.color
    ].filter(css => !!css).join(' ')
</script>

<div class="flex">
    <h4>Status</h4>
    <div class="flex flex--wrap bl">
        {#each sortedItems as state (state.id)}
            <div class={getClasses(state)}
                 data-count="{state.count}"
                 on:click={() => clickItem(state, true)}>
                {state.de}
            </div>
        {/each}
    </div>
</div>

<style lang="scss">
  @import '../../scss/variables';

  .filter {
    padding: 0 0 0 $space-xl;
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

    &:hover {
      background: $color-primary-darker;
    }

    &:hover, &.active {
      background: $color-primary-darker;
      color: $color-white;
    }

    &.disabled {
      opacity: 0.1;
      cursor: default;
    }

    &::after {
      content: attr(data-count);
      display: inline-block;
      padding: $space-xs $space-md;
      margin-left: 0;
      border-radius: $border-radius-xl;
      border: 1px solid $color-white;
      background: $color-primary;
      color: $color-white;
      position: relative;
    }

    &.green::after {
      background: $color-comingsoon;
    }

    &.red::after {
      background: $color-unavailable;
    }

    &.orange::after {
      background: $color-annoucement;
    }
  }
</style>

