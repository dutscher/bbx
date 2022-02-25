<script lang="ts">
  import Product from './Product.svelte';
  import { storedProducts, storedStates } from '../../stores';
  import { ID_STATE_AVAILABLE, ID_STATE_ANNOUNCEMENT, ID_STATE_COMING_SOON } from '../../_interfaces';
  import Icon from '../Icon.svelte';

  export let state: number = ID_STATE_ANNOUNCEMENT;
  export let title: string = '';
  export let onCounterAvailable: any = () => {};

  let products: any;
  let sortedProducts: any;
  let sortedMonths: any;
  let states: any;
  let reverseSort = false;
  let showParts = false;
  let showFirstRelease = false;
  export let isVisible = false;
  let countParts = 0;
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

  const sortProducts = (products, showParts, showFirstRelease) => {
    countParts = 0;
    let sortedData = [];
    // do filtering api changes
    sortedData = products
      // show only products with same state
      .filter(product => {
        if (showFirstRelease) {
          if (state === ID_STATE_COMING_SOON) {
            return product.isNewSoon;
          } else if (state === ID_STATE_AVAILABLE) {
            return product.isNew && product.state.id === state;
          }
        } else {
          return product.state.id === state;
        }
      })
      // filter part changes
      .filter(product => {
        if (product.isPart) {
          countParts++;
        }
        return (!showParts && !product.isPart) || (showParts && product.isPart);
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

    if (state !== ID_STATE_AVAILABLE && !reverseSort) {
      return months.reverse();
    }

    return months;
  };

  $: {
    sortedProducts = sortProducts(products, showParts, showFirstRelease);
    sortedMonths = sortMonths(sortedProducts, reverseSort);

    onCounterAvailable(state, sortedProducts.length);
  }
</script>

{#if isVisible}
  <div class="changes">
    <div class="field middle-align">
      <nav class="wrap">
        {#if state !== ID_STATE_ANNOUNCEMENT}
          <label class="checkbox">
            <input type="checkbox" bind:checked={showFirstRelease} />
            <span>
              <Icon modifier="new" />
              Erstveröffentlichung
            </span>
          </label>
        {/if}
        {#if state !== ID_STATE_AVAILABLE}
          <label class="checkbox">
            <input type="checkbox" bind:checked={reverseSort} />
            <span>Neuste zuerst</span>
          </label>
          <label class="checkbox">
            <input type="checkbox" bind:checked={showParts} />
            <span>Parts<span class="badge round">{countParts}</span></span>
          </label>
        {/if}
      </nav>
    </div>
    {#if state !== ID_STATE_AVAILABLE && !reverseSort}
      <p class="bold">Was kommt womöglich als nächstes:</p>
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
  </div>
{/if}

<style lang="scss">
  @import '../../scss/variables';

  .changes {
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
