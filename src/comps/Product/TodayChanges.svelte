<script lang="ts">
  import Product from './Product.svelte';
  import Icon from '../Icon.svelte';
  import { storedProducts, storedStates } from '../../stores';
  import { getLatestStateOfToday, pad, stopClick } from '../../utils';
  import { ID_PARTS } from '../../_interfaces';

  let products: any;
  let states: any;
  let isVisible = true;
  let isToday = false;
  let showParts = false;
  let countParts = 0;
  let dayStr = '';
  // 2017-06-01
  let selectedDate: string = '';
  let selectedDateMin: string = '2021-04-30';
  let selectedDateMax: string = '';
  const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

  storedProducts.subscribe(store => (products = store));
  storedStates.subscribe(store => (states = store));

  const handleDate = (e, direction) => {
    stopClick(e);

    const date = new Date(selectedDate);
    let nextDate = new Date(selectedDate).getDate();
    if (direction === 'prev') {
      nextDate -= 1;
    }
    if (direction === 'next') {
      nextDate += 1;
    }
    date.setDate(nextDate);
    if (!isVisible) {
      isVisible = true;
    }
    selectedDate = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  };

  const hasTodayHistory = product => {
    const hasTodayChanges = Object.keys(product.history).some(timestamp => {
      const historyDay = new Date(parseInt(timestamp)).setHours(0, 0, 0, 0);
      const compareDay = new Date(selectedDate).setHours(0, 0, 0, 0);
      return historyDay === compareDay;
    });
    return hasTodayChanges;
  };

  const sortProducts = (products, showParts, selectedDate) => {
    countParts = 0;
    let sortedData = [];
    // do filtering api changes
    sortedData = products
      // show only changes from today
      .filter(product => hasTodayHistory(product))
      // filter part changes
      .filter(product => {
        const isPart = product.tags.includes(ID_PARTS);
        if (isPart) {
          countParts++;
        }
        return (!showParts && !isPart) || (showParts && isPart);
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
        if (getLatestStateOfToday(a, selectedDate) < getLatestStateOfToday(b, selectedDate)) {
          return -1;
        }
        if (getLatestStateOfToday(a, selectedDate) > getLatestStateOfToday(b, selectedDate)) {
          return 1;
        }
        return 0;
      });

    return sortedData;
  };

  $: {
    const useNow = !selectedDate;
    const now = useNow ? new Date() : new Date(selectedDate);
    const today = new Date().setHours(0, 0, 0, 0);
    const compareDay = now.setHours(0, 0, 0, 0);
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();

    // 2017-06-01
    isToday = today === compareDay;
    selectedDate = `${year}-${pad(month)}-${pad(day)}`;
    dayStr = days[now.getDay()];
    // set today as max value
    if (useNow) {
      selectedDateMax = selectedDate;
    }
  }

  $: sortedProducts = sortProducts(products, showParts, selectedDate);
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
Status vom
<span class="datepicker">
  <Icon svg="true" modifier="arrow left" on:click={event => handleDate(event, 'prev')} />
  <input
    type="date"
    min={selectedDateMin}
    max={selectedDateMax}
    bind:value={selectedDate}
    on:click={event => event.stopPropagation()}
  />
  <span class="day-str">{dayStr}</span>
  {#if !isToday}
    <Icon svg="true" modifier="arrow" on:click={event => handleDate(event, 'next')} />
  {/if}
  <b>({sortedProducts.length})</b>
</span>
<div class="changes">
  <label>
    <input type="checkbox" bind:checked={showParts} />
    Auf Parts ({countParts}) umschalten
  </label>
  <div class="flex flex--gap flex--wrap">
    {#if isVisible}
      {#each sortedProducts as product (product.id)}
        <Product {product} type="todaychanges" todayChangesDate={selectedDate} />
      {/each}
    {/if}
  </div>
</div>

<style lang="scss">
  @import '../../scss/variables';

  .datepicker {
    :global .icon {
      font-size: ms(1);
      vertical-align: middle;
    }

    @media (max-width: 600px) {
      display: block;
      padding-left: $space-xl * 2;
    }

    input {
      vertical-align: middle;
      font-family: inherit;
      position: relative;
      top: -2px;
      color: $color-black;
    }

    .day-str {
      display: inline-block;
      width: 40px;
      padding-left: 0;
    }
  }

  .changes {
    margin-bottom: $space-xl;

    label {
      user-select: none;
      cursor: pointer;
    }
  }
</style>
