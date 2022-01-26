<script lang="ts">
    import Product from './Product/Product.svelte';
    import Icon from './Icon.svelte';
    import { storedProducts, storedStates } from '../stores';
    import { getLatestStateOfToday } from "../utils";
    import { ID_PARTS } from "../_interfaces";

    let products: any;
    let states: any;
    let isVisible = true;
    let showParts = false;
    let countParts = 0;

    let dayStr = '';
    // 02.11.2021
    let hrCompareDate: string = '';
    // 2017-06-01
    let selectedDate: string = '';
    let selectedDateMin: string = '2021-04-30';
    let selectedDateMax: string = '';
    const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

    storedProducts.subscribe(value => products = value);
    storedStates.subscribe(value => states = value);

    const handleDate = (event, direction) => {
        event.stopPropagation();
        const date = new Date(selectedDate);
        let nextDate = new Date(selectedDate).getDate();
        if (direction === 'prev') {
            nextDate -= 1;
        }
        if (direction === 'next') {
            nextDate += 1
        }
        date.setDate(nextDate);
        if (!isVisible) {
            isVisible = true;
        }
        selectedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    }

    $: {
        const useNow = !(!!selectedDate);
        const now = !useNow ? new Date(selectedDate) : new Date();
        let year = now.getFullYear();
        let month = ((now.getMonth() + 1) + '');
        let day = ((now.getDate()) + '');

        // 02.11.2021
        hrCompareDate = `${day.padStart(2, '00')}.${month.padStart(2, '00')}.${year}`;
        // 2017-06-01
        selectedDate = `${year}-${month.padStart(2, '00')}-${day.padStart(2, '00')}`;
        dayStr = days[now.getDay()];
        // set today as max value
        if (useNow) {
            selectedDateMax = selectedDate;
        }
    }

    const hasTodayHistory = (product) => {
        const hasTodayChanges = Object.keys(product.history).some(key => key.startsWith(hrCompareDate));
        return hasTodayChanges;
    }

    function sortProducts(products, showParts, hrCompareDate) {
        countParts = 0;
        let sortedData = [];
        // do filtering api changes
        sortedData = products
            // show only changes from today
            .filter(product => hasTodayHistory(product))
            // filter part changes
            .filter((product) => {
                const isPart = product.tags.includes(ID_PARTS);
                if (isPart) {
                    countParts++;
                }
                return !showParts && !isPart || showParts && isPart;
            })
            // sort by name
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
                if (getLatestStateOfToday(a, hrCompareDate) < getLatestStateOfToday(b, hrCompareDate)) {
                    return -1;
                }
                if (getLatestStateOfToday(a, hrCompareDate) > getLatestStateOfToday(b, hrCompareDate)) {
                    return 1;
                }
                return 0;
            });

        return sortedData;
    }

    $: sortedProducts = sortProducts(products, showParts, hrCompareDate);
</script>

<!--
{#if $changes.loading}
    Loading...
{:else if $changes.error}
    Error: {$changes.error.message}
{:else}
    {#each $changes.data.productChanges.edges as node}
        {node.node.product.id} {node.node.product.lastchange}
    {/each}
{/if}
-->
<h2 class="with-toggle" on:click={() => isVisible = !isVisible}>
    <Icon modifier="arrow {!isVisible ? 'down' : 'up'}" svg/>
    Status vom
    <span>
        <Icon svg="true" modifier="arrow left" on:click={(event) => handleDate(event, 'prev')}></Icon>
        <input type="date" min={selectedDateMin} max={selectedDateMax}
               bind:value={selectedDate} on:click={(event) => event.stopPropagation()}/>
        <span class="day-str">{dayStr}</span>
        <Icon svg="true" modifier="arrow" on:click={(event) => handleDate(event, 'next')}></Icon>
        <b>({sortedProducts.length})</b>
    </span>
</h2>
<div class="changes{isVisible ? ' show' : ''}">
    <label>
        <input type="checkbox" bind:checked={showParts}/>
        Auf Parts ({countParts}) umschalten
    </label>
    <div class="flex flex--wrap">
        {#if isVisible}
            {#each sortedProducts as product (product.id)}
                <Product {product} type="todaychanges" todayChangesDate={hrCompareDate}/>
            {/each}
        {/if}
    </div>
</div>

<style lang="scss">
  @import '../scss/variables';

  .with-toggle {
    span {
      :global(.icon) {
        font-size: ms(1);
        vertical-align: middle;
      }

      @media (max-width: 600px) {
        display: block;
        padding-left: $space-xl * 2;
      }
    }

    input {
      vertical-align: middle;
      font-family: inherit;
      position: relative;
      top: -2px;
    }

    .day-str {
      display: inline-block;
      width: 40px;
      padding-left: 0;
    }
  }

  .changes {
    display: none;
    margin-bottom: $space-xl;

    &.show {
      display: block;
    }

    label {
      user-select: none;
      cursor: pointer;
    }
  }
</style>
