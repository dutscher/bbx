<script lang="ts">
  import Product from './Product.svelte';
  import { storedProducts, storedStates } from '../../stores';
  import { getLatestStateOfToday, pad, stopClick } from '../../utils';
  import { ID_PARTS } from '../../_interfaces';

  let products: any;
  let states: any;
  let isVisible = true;
  let isToday = false;
  let showSets = true;
  let showParts = false;
  let countSets = 0;
  let countParts = 0;
  let dayStr = '';
  let sortedProducts: any;
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

  const sortProducts = (products, showParts, showSets, selectedDate) => {
    countSets = 0;
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
        } else {
          countSets++;
        }
        return (showSets && !isPart) || (showParts && isPart);
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

  $: sortedProducts = sortProducts(products, showParts, showSets, selectedDate);
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

<article>
  <h2 class="headline">
    <span>vom</span>
    <i class="prev-day" on:click={event => handleDate(event, 'prev')}>arrow_back_ios</i>
    <span class="day-str">{dayStr}</span>
    {#if !isToday}
      <i on:click={event => handleDate(event, 'next')}>arrow_forward_ios</i>
    {/if}
  </h2>
  <span class="datepicker">
    <input
      type="date"
      min={selectedDateMin}
      max={selectedDateMax}
      bind:value={selectedDate}
      on:click={event => event.stopPropagation()}
    />
  </span>
</article>

<div class="changes">
  <div class="field middle-align">
    <nav class="wrap">
      <label class="checkbox">
        <input type="checkbox" bind:checked={showSets} />
        <span>Sets<span class="badge round">{countSets}</span></span>
      </label>
      <label class="checkbox">
        <input type="checkbox" bind:checked={showParts} />
        <span>Parts<span class="badge round">{countParts}</span></span>
      </label>
    </nav>
  </div>

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

  .headline {
    user-select: none;

    span.day-str {
      width: 45rem;
      text-align: center;
    }

    i {
      margin: 0 0 0 8rem;

      &.prev-day {
        margin: 0 0 0 16rem;
      }

      &:hover {
        color: var(--primary);
        cursor: pointer;
      }
    }
  }

  .datepicker {
    @media (max-width: 600px) {
      display: block;
      padding-left: $space-xl * 2;
    }

    input {
      vertical-align: middle;
      font-family: inherit;
      position: relative;
      color: $color-black;
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
