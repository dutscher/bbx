<script lang="ts">
    import { storedStates } from '../../stores';
    import { getDateTime, jsVoid } from '../../utils';
    import { ID_STATE_AVAILABLE } from "../../_interfaces";

    export let product: any;

    let fullVisible = false;
    let fullHistory: any;
    let splittedHistory: any;
    let states: any;
    const historyChunks = 3;

    storedStates.subscribe(value => states = value);

    const getStateLabel = (stateId) => {
        return states.filter(state => stateId === state.id)[0].de;
    }

    const getStateAgo = (stateId, date, prevDate, index) => {
        if (index === 0) {
            return calcTimeAgo(product);
        }
        if (stateId === ID_STATE_AVAILABLE && prevDate) {
            return `für ${getTimeDiff(getDateTime(prevDate[0]), getDateTime(date))}`;
        }
        return '';
    }

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
                    return 'seit ' + diff + ' ' + times[t - 1][2] + (diff !== 1 && times[t - 1][3] ? times[t - 1][3] : '');
                }
            }
        }
    }

    const getTimeDiff = (dateNow, dateDiff) => {
        const now = new Date(dateNow).getTime();
        const ms = (now - new Date(dateDiff).getTime())
        const days = Math.round(ms / 86400000); // days
        const hrs = Math.round((ms % 86400000) / 3600000); // hours
        const mins = Math.round(((ms % 86400000) % 3600000) / 60000); // minutes
        let strReturn = '';

        let daysStr = days > 0 ? days + ` Tag${days !== 1 ? 'e' : ''}` : '';
        if (days > 6) {
            const weeks = Math.round(days / 7);
            strReturn = weeks + ` Woche${weeks !== 1 ? 'n' : ''}`;
        } else {
            strReturn = `${daysStr}${hrs > 0 ? ' ' + hrs + 'h' : ''}${mins > 0 ? mins + 'm' : ''}`;
        }

        return strReturn;
    }

    fullHistory = Object.entries(product.history).reverse();
    splittedHistory = {
        first: fullHistory.map((entry, i) => {
            return {
                date: entry[0],
                stateId: entry[1],
                label: getStateLabel(entry[1]),
                ago: getStateAgo(entry[1], entry[0], fullHistory[i - 1], i)
            }
        }),
    }

    if (fullHistory.length > historyChunks) {
        splittedHistory.last = splittedHistory.first.slice(historyChunks, fullHistory.length);
        splittedHistory.first = splittedHistory.first.slice(0, historyChunks);
    }
</script>

<div class="history">
    {#each splittedHistory.first as entry}
        {entry.date} - {entry.label}{#if entry.ago} - <strong>{entry.ago}</strong>{/if}<br/>
    {/each}
    {#if splittedHistory.last}
        {#if !fullVisible}
            <a on:click={(e) => {
                e.stopPropagation();
                fullVisible = true
            }} href={jsVoid}>... Alles anzeigen</a>
        {:else}
            {#each splittedHistory.last as entry}
                {entry.date} - {entry.label}{#if entry.ago} - <strong>{entry.ago}</strong>{/if}<br/>
            {/each}
        {/if}
    {/if}
</div>

<style lang="scss">
  @import '../../scss/variables';

  .history {
    user-select: none;

    :global(strong) {
      color: $color-white;
    }

    a {
      color: $color-primary-lighter;

      &:hover {
        color: $color-white;
      }
    }
  }
</style>
