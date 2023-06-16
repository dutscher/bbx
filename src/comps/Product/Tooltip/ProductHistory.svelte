<script lang="ts">
  import { storedStates } from '@stores';
  import { jsVoid, pad, getStateAgo, stopClick } from '@utils';
  import ProductHistoryEntry from './ProductHistoryEntry.svelte';

  export let product: any;

  let nextVisible = false;
  let fullVisible = false;
  let fullHistory: any;
  let splittedHistory: any;
  let states: any;
  const historyChunks = 3;
  const moreChunks = 20;

  storedStates.subscribe(store => (states = store));

  const getFormattedDate = timestamp => {
    const date = new Date(timestamp);
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${day}.${month} ${hours}:${minutes}`;
  };

  const getStateLabel = stateId => {
    return states.filter(state => stateId === state.id)[0].de;
  };

  fullHistory = Object.entries(product.history).reverse();
  let latestYear = 0;
  splittedHistory = {
    first: fullHistory.map(([timestamp, stateId], i) => {
      timestamp = parseInt(timestamp);
      const compareDate = fullHistory[i - 1] ? parseInt(fullHistory[i - 1][0]) : 0;
      const entryYear = new Date(timestamp).getFullYear();
      let newYear = false;
      if (entryYear !== latestYear) {
        if (latestYear !== 0 || fullHistory.length === 1) {
          newYear = true;
        }
        latestYear = entryYear;
      }
      const returnData = {
        formattedDate: getFormattedDate(timestamp),
        stateId,
        label: getStateLabel(stateId),
        ago: getStateAgo(product, stateId, timestamp, compareDate, i),
        ...(newYear && { newYear: entryYear }),
      };
      return returnData;
    }),
  };

  if (fullHistory.length > historyChunks) {
    splittedHistory.last = splittedHistory.first.slice(moreChunks, fullHistory.length);
    splittedHistory.next = splittedHistory.first.slice(historyChunks, moreChunks);
    splittedHistory.first = splittedHistory.first.slice(0, historyChunks);
  }
</script>

<div class="history">
  {#each splittedHistory.first as entry}
    <ProductHistoryEntry {entry} />
  {/each}
  {#if splittedHistory.next && splittedHistory.next.length > 0}
    {#if !nextVisible}
      <a
        on:click={e => {
          stopClick(e);
          nextVisible = true;
        }}
        href={jsVoid}
        class="link"
      >
        ... Mehr anzeigen
      </a>
    {:else}
      {#each splittedHistory.next as entry}
        <ProductHistoryEntry {entry} />
      {/each}
    {/if}
  {/if}
  {#if splittedHistory.last && splittedHistory.last.length > 0 && nextVisible}
    {#if !fullVisible}
      <a
        on:click={e => {
          stopClick(e);
          fullVisible = true;
        }}
        href={jsVoid}
        class="link"
      >
        ... Alles anzeigen
      </a>
    {:else}
      {#each splittedHistory.last as entry}
        <ProductHistoryEntry {entry} />
      {/each}
    {/if}
  {/if}
</div>

<style lang="scss">
  .history {
    user-select: none;
  }
</style>
