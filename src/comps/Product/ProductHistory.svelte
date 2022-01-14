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

    const calcTimeAgo = (product) => {
        const times = [
            ['second', 1, 'Sek.'],
            ['minute', 60, 'Min.'],
            ['hour', 3600, 'Std.'],
            ['day', 86400, 'Tag', 'e'],
            ['week', 604800, 'Woche', 'n'],
            ['month', 2592000, 'Mon.'],
            ['year', 31536000, 'Jahr', 'e']
        ];

        const today = new Date();
        const lastDate = new Date(product.stateDate);
        let diff = Math.round((today - lastDate) / 1000)
        for (let t = 0; t < times.length; t++) {
            if (diff < times[t][1]) {
                if (t == 0) {
                    return 'jetzt';
                } else {
                    diff = Math.round(diff / times[t - 1][1])
                    return diff + ' ' + times[t - 1][2] + (diff !== 1 && times[t - 1][3] ? times[t - 1][3] : '') + ' her';
                }
            }
        }
    }

    $: timeAgo = calcTimeAgo(product);
</script>

<div class="history">
    {#each splittedHistory.first as [date, stateId], i}
        {date} - {states.filter(state => stateId === state.id)[0].de}
        {#if i === 0}({timeAgo}){/if}
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
