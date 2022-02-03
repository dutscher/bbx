<script lang="ts">
    import Product from './Product.svelte';
    import Icon from '../Icon.svelte';
    import { storedProducts, storedStates } from '../../stores';
    import { ID_PARTS, ID_STATE_AVAILABLE, ID_STATE_ANNOUNCEMENT, ID_STATE_COMING_SOON } from "../../_interfaces";

    export let state: number = ID_STATE_ANNOUNCEMENT;
    export let title: string = '';

    let products: any;
    let states: any;
    let isVisible = false;
    let reverseSort = false;
    let showParts = false;
    let showFirstRelease = false;
    let countParts = 0;
    const monthNames = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
    const labels = ['Diesen Monat', 'Letzten Monat', 'vor X Monaten'];
    const thisYear = new Date().getFullYear();

    storedProducts.subscribe(store => products = store);
    storedStates.subscribe(store => states = store);

    function sortProducts(products, showParts, showFirstRelease) {
        countParts = 0;
        let sortedData = [];
        // do filtering api changes
        sortedData = products
            // show only products with same state
            .filter(product => {
                if (showFirstRelease) {
                    // TODO: ab in den store
                    const historyStates = Object.values(product.history);
                    const lastState = historyStates[historyStates.length - 1];
                    const lastBeforeState = historyStates[historyStates.length - 2];

                    if (state === ID_STATE_COMING_SOON) {
                        return (lastState === ID_STATE_COMING_SOON && lastBeforeState === ID_STATE_ANNOUNCEMENT);
                    } else if (state === ID_STATE_AVAILABLE) {
                        const lastBeforeBeforeState = historyStates[historyStates.length - 3];
                        return (lastState === ID_STATE_AVAILABLE && lastBeforeState === ID_STATE_COMING_SOON && lastBeforeBeforeState === ID_STATE_ANNOUNCEMENT ||
                            lastState === ID_STATE_AVAILABLE && lastBeforeState === ID_STATE_ANNOUNCEMENT);
                    }
                } else {
                    return product.state.id === state;
                }
            })
            // filter part changes
            .filter((product) => {
                const isPart = product.tags.includes(ID_PARTS);
                if (isPart) {
                    countParts++;
                }
                return !showParts && !isPart || showParts && isPart;
            })
            // sort by highest date
            .sort((a, b) => {
                if (a.stateDate < b.stateDate) {
                    return 1;
                }
                if (a.stateDate > b.stateDate) {
                    return -1;
                }
                return 0;
            });

        return sortedData;
    }

    function sortMonths(sortedProducts, reverseSort) {
        const maxMonths = 12;
        const months = [];
        let actualMonth = new Date().getMonth() + 1;
        let actualYear = thisYear;
        let nextMonth = actualMonth;

        for (let i = 0; i < maxMonths; i++) {
            const nextLabel = (i < labels.length - 1)
                ? labels[i]
                : (labels[labels.length - 1] + '').replace('X', i.toString());

            months.push({
                id: nextMonth,
                monthPad: monthNames[nextMonth - 1],
                year: actualYear,
                label: nextLabel,
                products: sortedProducts.filter((product) => {
                    const historyDay = new Date(product.stateDate);
                    return (historyDay.getMonth() + 1) === nextMonth && historyDay.getFullYear() === actualYear;
                })
            });

            nextMonth--;

            if (nextMonth === 0) {
                nextMonth = maxMonths;
                actualYear--;
            }
        }

        if (state !== ID_STATE_AVAILABLE && !reverseSort) {
            return months.reverse();
        }

        return months;
    }

    $: sortedProducts = sortProducts(products, showParts, showFirstRelease);

    $: sortedMonths = sortMonths(sortedProducts, reverseSort);
</script>

<h2 class="with-toggle" on:click={() => isVisible = !isVisible}>
    <Icon modifier="arrow {!isVisible ? 'down' : 'up'}" svg/>
    {title}
    <b>({sortedProducts.length})</b>
</h2>
<div class="changes{isVisible ? ' show' : ''}">
    {#if state !== ID_STATE_ANNOUNCEMENT}
        <label class="with-text-shadow">
            <input type="checkbox" bind:checked={showFirstRelease}/>
            Erstveröffentlichung
        </label>
    {/if}
    {#if state !== ID_STATE_AVAILABLE}
        <label class="with-text-shadow">
            <input type="checkbox" bind:checked={reverseSort}/>
            Neuste zuerst
        </label>
    {/if}
    <label class="with-text-shadow">
        <input type="checkbox" bind:checked={showParts}/>
        Auf Parts ({countParts}) umschalten
    </label>
    {#if state !== ID_STATE_AVAILABLE && !reverseSort}
        <p><b>Was kommt womöglich als nächstes:</b></p>
    {/if}
    <div>
        {#if isVisible}
            {#each sortedMonths as month (month.id)}
                {#if month.products.length > 0}
                    <h3>{month.label} ({month.monthPad}
                        {#if month.year !== thisYear}&nbsp;{month.year}{/if})</h3>
                    <div class="flex flex--wrap">
                        {#each month.products as product (product.id)}
                            <Product {product} type="latestproducts"/>
                        {/each}
                    </div>
                {/if}
            {/each}
        {/if}
    </div>
</div>

<style lang="scss">
  @import '../../scss/variables';

  .changes {
    display: none;

    &.show {
      display: block;
    }

    .new-month {
      display: block;
      flex-wrap: wrap;
    }

    margin-bottom: $space-xl;

    label {
      user-select: none;
      cursor: pointer;
      color: $color-primary-light;
    }
  }
</style>
