<script lang="ts">
    import Product from './Product/Product.svelte';
    import Icon from './Icon.svelte';
    import { storedProducts, storedStates } from '../stores';
    import { ID_PARTS } from "../_interfaces";

    export let state: number = 3;
    export let title: string = '';

    let products: any;
    let states: any;
    let isVisible = false;
    let showParts = false;
    let showFirstRelease = false;
    let countParts = 0;
    const monthNames = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
    const labels = ['Diesen Monat', 'Letzten Monat', 'vor X Monaten'];

    storedProducts.subscribe(value => products = value);
    storedStates.subscribe(value => states = value);

    function sortProducts(products, showParts, showFirstRelease) {
        countParts = 0;
        let sortedData = [];
        // do filtering api changes
        sortedData = products
            // show only products with same state
            .filter(product => {
                if (showFirstRelease) {
                    const historyStates = Object.values(product.history);
                    const lastState = historyStates[historyStates.length - 1];
                    const lastBeforeState = historyStates[historyStates.length - 2];
                    // 1 = Bald erhältlich
                    // 3 = Ankündigung
                    return (lastState === 1 && lastBeforeState === 3);
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

    function sortMonths(sortedProducts) {
        const maxMonths = 12;
        const months = [];
        let thisMonth = new Date().getMonth() + 1;
        for (let i = 0; i < maxMonths; i++) {
            let nextMonth = thisMonth - i;
            if (nextMonth === 0) {
                thisMonth = 12;
                nextMonth = thisMonth;
            }
            const nextLabel = (i < labels.length - 1)
                ? labels[i]
                : (labels[labels.length - 1] + '').replace('X', i);
            months.push({
                id: nextMonth,
                monthPad: monthNames[nextMonth - 1],
                label: nextLabel,
                products: sortedProducts.filter((product) => {
                    return product.stateDate.includes(`2021-${(nextMonth + '').padStart(2, '00')}-`)
                })
            });
        }

        if (state !== 0) {
            return months.reverse();
        }

        return months;
    }

    $: sortedProducts = sortProducts(products, showParts, showFirstRelease);

    $: sortedMonths = sortMonths(sortedProducts);
</script>

<h2 class="with-toggle" on:click={() => isVisible = !isVisible}>
    <Icon modifier="arrow" classes={`icon--${!isVisible ? 'down' : 'up'}`}/>
    {title}
    <b>({sortedProducts.length})</b>
</h2>
<div class="changes{isVisible ? ' show' : ''}">
    {#if state === 1}
        <label>
            <input type="checkbox" bind:checked={showFirstRelease}/>
            <strong>Erstveröffentlichung</strong>
        </label>
    {/if}
    {#if state !== 0}
        <label>
            <input type="checkbox" bind:checked={showParts}/>
            Auf Parts ({countParts}) umschalten
        </label>
    {/if}
    <br/>
    <div>
        {#if isVisible}
            {#each sortedMonths as month (month.id)}
                {#if month.products.length > 0}
                    <h3>{month.label} ({month.monthPad})</h3>
                    <div class="flex flex--wrap">
                        {#each month.products as product (product.id)}
                            <Product {product} type="latestProducts"/>
                        {/each}
                    </div>
                {/if}
            {/each}
        {/if}
    </div>
</div>

<style lang="scss">
  @import '../scss/variables';

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
    }
  }
</style>
