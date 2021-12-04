<script lang="ts">
    import { storedStates } from '../../stores';
    import { jsVoid } from '../../utils';

    export let product: any;

    let fullVisible = false;
    let fullHistory: any;
    let splittedHistory: any;
    let states: any;
    const historyChunks = 3;

    fullHistory = Object.entries(product.history).reverse();
    splittedHistory = {
        first: fullHistory,
    }

    if (fullHistory.length > historyChunks) {
        splittedHistory.first = fullHistory.slice(0, historyChunks);
        splittedHistory.last = fullHistory.slice(historyChunks, fullHistory.length);
    }

    storedStates.subscribe(value => states = value);

    const calcDaysAgo = (product) => {
        // 2021-10-07T08:51:00+02:00
        const lastDate = new Date(product.stateDate);
        const today = new Date();
        const diffTime = Math.abs(lastDate - today);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays - 1;
    }

    $: daysAgo = calcDaysAgo(product);
</script>

<div class="history">
    {#each splittedHistory.first as [date, stateId], i}
        {date} - {states.filter(state => stateId === state.id)[0].de}
        {#if i === 0}({daysAgo} Tag{#if daysAgo !== 1}e {/if} her){/if}
        <br/>
    {/each}
    {#if splittedHistory.last}
        {#if !fullVisible}
            <a on:click={(e) => {
                e.stopPropagation();
                fullVisible = true
            }} href={jsVoid}>... Alles anzeigen</a>
        {:else}
            {#each splittedHistory.last as [date, stateId]}
                {date} - {states.filter(state => stateId === state.id)[0].de}<br/>
            {/each}
        {/if}
    {/if}
</div>

<style lang="scss">
  @import '../../scss/variables';

  .history {
    user-select: none;
    a {
      color: $color-primary-lighter;

      &:hover {
        color: $color-white;
      }
    }
  }
</style>
