<script lang="ts">
  import { storedProducts, storedStates } from '@stores';
  import { onMount, getLatestStateOfToday, pad, stopClick, getUrlParam, setUrlParams } from '@utils';
  import beerui from '@beerui';
  import Product from '../Product/Product.svelte';
  import ExtraFilter from '../Filter/ExtraFilter.svelte';

  let products: any;
  let states: any;
  let isVisible = true;
  let isToday: any;
  let extraFilter = {
    sets: { show: true, count: 0 },
    parts: { show: false, count: 0 },
    hot: { show: false, count: 0 },
    new: { show: false, count: 0 },
  };

  let dayStr = '';
  let sortedProducts: any;
  // 2017-06-01
  let selectedDate: string = '';
  let selectedDateMin: string = '2021-04-30';
  let selectedDateMax: string = '';
  const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  const urlParam = 'date';

  storedProducts.subscribe(store => (products = store));
  storedStates.subscribe(store => (states = store));

  const getUrlParams = () => {
    // ?date=2017-06-01
    const dateStr = getUrlParam(urlParam);
    selectedDate = dateStr;
  };

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

  const sortProducts = (products, selectedDate, filterSets, filterParts, filterHot, filterNew) => {
    // reset counter
    Object.keys(extraFilter).map(filter => {
      extraFilter[filter].count = 0;
    });

    let sortedData = [];
    // do filtering api changes
    sortedData = products
      // show only changes from today
      .filter(product => hasTodayHistory(product))
      // filter parts
      .filter(product => {
        if (product.isPart) {
          extraFilter.parts.count++;
        } else {
          extraFilter.sets.count++;
        }
        return (extraFilter.sets.show && !product.isPart) || (extraFilter.parts.show && product.isPart);
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
    } else {
      setUrlParams(urlParam, !isToday ? selectedDate : '');
    }
  }

  $: sortedProducts = sortProducts(
    products,
    selectedDate,
    extraFilter.sets.show,
    extraFilter.parts.show,
    extraFilter.hot.show,
    extraFilter.new.show
  );

  onMount(() => {
    beerui();
    getUrlParams();
  });
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

<article class="filter">
  <h2 class="headline">
    <span>Status vom</span>
    <i class="prev-day" on:click={event => handleDate(event, 'prev')}>arrow_back_ios</i>
    <span class="day-str">{dayStr}</span>
    {#if !isToday}
      <i on:click={event => handleDate(event, 'next')}>arrow_forward_ios</i>
    {/if}
  </h2>
  <div class="field suffix border">
    <input
      type="date"
      min={selectedDateMin}
      max={selectedDateMax}
      bind:value={selectedDate}
      on:click={event => event.stopPropagation()}
    />
    <i>today</i>
  </div>
</article>

<ExtraFilter {extraFilter} onChange={store => (extraFilter = store)} />

<div class="flex flex--gap flex--wrap">
  {#if isVisible}
    {#each sortedProducts as product (product.id)}
      <Product {product} type="todaychanges" todayChangesDate={selectedDate} />
    {/each}
  {/if}
</div>

<style lang="scss">
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

  .filter .field {
    width: 250rem;
  }
</style>
