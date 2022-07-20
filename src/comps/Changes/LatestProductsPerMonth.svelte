<script lang="ts">
  import { storedProducts, storedStates } from '@stores';
  import { getUrlParam, onMount, setUrlParams } from '@utils';
  import { ID_STATE_AVAILABLE, ID_STATE_ANNOUNCEMENT } from '@interfaces';
  import Product from '../Product/Product.svelte';
  import Checkbox from '../Filter/Checkbox.svelte';
  import ExtraFilter from '../Filter/ExtraFilter.svelte';

  export let state: number = ID_STATE_ANNOUNCEMENT;
  export let onCounterAvailable: any = () => {};

  let products: any;
  let sortedProducts: any;
  let sortedMonths: any;
  let states: any;
  let reverseSort: boolean = false;
  const urlParam = 'latest';

  let extraFilter = {
    parts: { show: false, count: 0 },
    hot: { show: false, count: 0 },
    new: { show: false, count: 0 },
  };

  export let isVisible = false;
  const monthNames = [
    'Januar',
    'Februar',
    'März',
    'April',
    'Mai',
    'Juni',
    'Juli',
    'August',
    'September',
    'Oktober',
    'November',
    'Dezember',
  ];
  const labels = ['Diesen Monat', 'Letzten Monat', 'vor X Monaten'];
  const thisYear = new Date().getFullYear();

  storedProducts.subscribe(store => (products = store));
  storedStates.subscribe(store => (states = store));

  const sortProducts = (products, filterParts, firstNew, filterHot) => {
    // reset counter
    Object.keys(extraFilter).map(filter => {
      extraFilter[filter].count = 0;
    });

    let sortedData = [];
    // do filtering api changes
    sortedData = products
      // filter states
      .filter(product => {
        return product.state.id === state;
      })
      // filter parts
      .filter(product => {
        if (product.isPart) {
          extraFilter.parts.count++;
        }
        return (!extraFilter.parts.show && !product.isPart) || (extraFilter.parts.show && product.isPart);
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
  };

  const sortMonths = (sortedProducts, reverseSort) => {
    const maxMonths = 12;
    const months = [];
    let actualMonth = new Date().getMonth() + 1;
    let actualYear = thisYear;
    let nextMonth = actualMonth;

    for (let i = 0; i < maxMonths; i++) {
      const nextLabel = i < labels.length - 1 ? labels[i] : (labels[labels.length - 1] + '').replace('X', i.toString());

      months.push({
        id: nextMonth,
        monthPad: monthNames[nextMonth - 1],
        year: actualYear,
        label: nextLabel,
        products: sortedProducts.filter(product => {
          const historyDay = new Date(product.stateDate);
          return historyDay.getMonth() + 1 === nextMonth && historyDay.getFullYear() === actualYear;
        }),
      });

      nextMonth--;

      if (nextMonth === 0) {
        nextMonth = maxMonths;
        actualYear--;
      }
    }

    months.push({
      id: -1,
      monthPad: 'Pipeline',
      year: actualYear,
      label: 'vor 12 Monate+',
      products: sortedProducts.filter(product => {
        const productTime = new Date(product.stateDate);
        const lastMonth = new Date(actualYear, nextMonth, 1, 0, 0, 0, 0);
        return productTime.getTime() < lastMonth.getTime();
      }),
    });

    if (state !== ID_STATE_AVAILABLE && !reverseSort) {
      return months.reverse();
    }

    return months;
  };

  const handleChange = () => {
    console.log('reverseSort', reverseSort);
    setUrlParams(urlParam, reverseSort);
  };

  const getUrlParams = () => {
    const bool = getUrlParam(urlParam);
    reverseSort = bool === 'true';
  };

  $: {
    sortedProducts = sortProducts(products, extraFilter.parts.show, extraFilter.new.show, extraFilter.hot.show);
    sortedMonths = sortMonths(sortedProducts, reverseSort);

    onCounterAvailable(state, sortedProducts.length);
  }

  onMount(() => {
    getUrlParams();
  });
</script>

{#if isVisible}
  <nav class="wrap small-margin no-h-margin">
    {#if state !== ID_STATE_AVAILABLE}
      <Checkbox label="Letzte Änderungen" bind:checked={reverseSort} onChange={handleChange} />
      <Checkbox label="Parts" badge={extraFilter.parts.count} bind:checked={extraFilter.parts.show} />
    {/if}
    {#if state !== ID_STATE_ANNOUNCEMENT}
      <ExtraFilter {extraFilter} noNav={true} noParts={true} onChange={store => (extraFilter = store)} />
    {/if}
  </nav>
  {#if state !== ID_STATE_AVAILABLE && !reverseSort}
    <p class="bold">Was kommt womöglich als nächstes:</p>
  {:else}
    <p class="small-text">Die Produkte sind nach neustem Veröffentlichungsdatum sortiert</p>
  {/if}
  <div>
    {#each sortedMonths as month (month.id)}
      {#if month.products.length > 0}
        <h6>
          {month.label} ({month.monthPad}{#if month.year !== thisYear}&nbsp;{month.year}{/if})
        </h6>
        <div class="flex flex--gap flex--wrap">
          {#each month.products as product (product.id)}
            <Product {product} type="latestproducts" />
          {/each}
        </div>
      {/if}
    {/each}
  </div>
{/if}
