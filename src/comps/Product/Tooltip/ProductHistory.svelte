<script lang="ts">
  import { storedStates } from '@stores';
  import { jsVoid, pad, getStateAgo } from '@utils';

  export let product: any;

  let fullVisible = false;
  let fullHistory: any;
  let splittedHistory: any;
  let states: any;
  const historyChunks = 3;

  storedStates.subscribe(store => (states = store));

  const getFormattedDate = timestamp => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  };

  const getStateLabel = stateId => {
    return states.filter(state => stateId === state.id)[0].de;
  };

  fullHistory = Object.entries(product.history).reverse();
  splittedHistory = {
    first: fullHistory.map(([timestamp, stateId], i) => {
      timestamp = parseInt(timestamp);
      const compareDate = fullHistory[i - 1] ? parseInt(fullHistory[i - 1][0]) : 0;
      return {
        formattedDate: getFormattedDate(timestamp),
        stateId,
        label: getStateLabel(stateId),
        ago: getStateAgo(product, stateId, timestamp, compareDate, i),
      };
    }),
  };

  if (fullHistory.length > historyChunks) {
    splittedHistory.last = splittedHistory.first.slice(historyChunks, fullHistory.length);
    splittedHistory.first = splittedHistory.first.slice(0, historyChunks);
  }
</script>

<div class="history">
  {#each splittedHistory.first as entry}
    <div>
      <span class="date">
        {entry.formattedDate}
      </span>
      - <span>{entry.label}</span>
      {#if entry.ago}&nbsp;
        <b>
          {entry.ago}
        </b>
      {/if}
    </div>
  {/each}
  {#if splittedHistory.last}
    {#if !fullVisible}
      <a
        on:click={e => {
          e.stopPropagation();
          fullVisible = true;
        }}
        href={jsVoid}
        class="link"
      >
        ... Alles anzeigen
      </a>
    {:else}
      {#each splittedHistory.last as entry}
        {entry.formattedDate} - {entry.label}{#if entry.ago}&nbsp;<b>{entry.ago}</b>{/if}<br />
      {/each}
    {/if}
  {/if}
</div>

<style lang="scss">
  .history {
    user-select: none;

    .date {
      display: block;

      @media (min-width: 400px) {
        display: inline-block;
      }
    }
  }
</style>
