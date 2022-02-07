<script lang="ts">
    import { onMount } from 'svelte';
    import { storedActiveSelection, storedColors, storedProducts, storedFilteredProducts } from '../../stores';
    import { getUrlParam, setUrlParams, titleMatch } from '../../utils';

    export let colors: any;
    export let products: any;
    export let filteredProducts: any = [];
    export let activeColorIds: any = [];

    const urlParam = 'colors';
    const getUrlParams = () => {
        // ?tags=piraten
        const queryTags = getUrlParam(urlParam).split(',');
        //console.log('getUrlParams.queryTags', queryTags)
        colors.map((color) => {
            queryTags.map((queryTag) => {
                if (color.seoName === queryTag) {
                    clickItem(color);
                }
            });
        });
    };

    const clickItem = (item, withUrlUpdate?) => {
        if (item.count === 0) return;

        storedActiveSelection.update((value) => {
            if (!(urlParam in value)) {
                value[urlParam] = [];
            }
            if (!value[urlParam].includes(item.id)) {
                value[urlParam].push(item.id);
            } else {
                value[urlParam] = value[urlParam].filter((itemId) => itemId !== item.id);
            }

            if (withUrlUpdate) {
                setUrlParams(
                    urlParam,
                    colors.filter((color) => value[urlParam].includes(color.id)).map((color) => color.seoName)
                );
                value.reason = 'part-clicked';
            } else {
                value.reason = 'url-parsed';
            }

            return value;
        });
    };

    function sortItems() {
        let sortedData = [];
        // get count of products
        sortedData = colors
            .map((color) => {
                const filtered = (
                    filteredProducts && filteredProducts.withFilter.length > 0 ? filteredProducts.withFilter : products
                )
                    // is a part
                    .filter((product) => product.tags.includes(48))
                    .filter((product) => titleMatch(color, product) > 0);

                color.countFiltered = filtered.length;

                color.count = products
                    // is a part
                    .filter((product) => product.tags.includes(48))
                    .filter((product) => titleMatch(color, product) > 0).length;

                if (color.countFiltered === 1) {
                    //console.log(filtered, color)
                }

                return color;
            })
            .filter((color) => color.count > 0)
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

    storedColors.subscribe((value) => (colors = value));
    storedProducts.subscribe((value) => (products = value));
    storedFilteredProducts.subscribe((value) => (filteredProducts = value));

    onMount(() => {
        getUrlParams();
    });

    $: sortedItems = sortItems(filteredProducts);

    const classNames = (color) => ({
        class: [
            'color',
            activeColorIds.includes(color.id) && 'active',
            color.id === 18 && 'chrome',
            color.id === 36 && 'pearl-gray',
            color.id === 51 && 'pearl-gold',
            color.countFiltered === 0 && 'disabled',
            color.name.toLowerCase().includes('trans') && 'trans',
        ]
            .filter((css) => css !== false)
            .join(' '),
    });
</script>

<div class="flex">
    <h4>Farben</h4>
    <div class="flex flex--wrap bl">
        {#each sortedItems as color (color.id)}
            <div
                {...classNames(color)}
                data-id="{color.id}"
                on:click="{() => clickItem(color, true)}"
                title="{color.name}{color.de ? ' / ' + color.de : ''} ({color.countFiltered})"
                style="background-color:#{color.hex}"
            ></div>
        {/each}
    </div>
</div>

<style lang="scss">
    @import '../../scss/variables';

    .color {
        padding: $space-xl;
        margin: $space-xs;
        border: solid 1px $color-primary-darker;
        border-radius: 100%;
        cursor: pointer;
        position: relative;
        background-size: contain;

        &.active {
            border-color: $color-white;

            &::after {
                position: absolute;
                display: block;
                content: '';
                padding: $space-xl + 0.25;
                background: $color-primary-darker;
                transform: translate(-50%, -50%);
                z-index: -1;
                border-radius: inherit;
            }
        }

        &.chrome {
            background-image: url('../images/chrome.jpg');
        }

        &.pearl-gray {
            background-image: url('../images/pearl-gray.jpg');
        }

        &.pearl-gold {
            background-image: url('../images/pearl-gold.jpg');
        }

        &.trans {
            opacity: 0.5;

            &.active {
                opacity: 1;
            }
        }

        &.disabled {
            opacity: 0.1;
            cursor: pointer;
        }
    }
</style>
