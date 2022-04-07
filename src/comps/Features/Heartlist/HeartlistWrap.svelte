<script lang="ts">
  import { flip } from 'svelte/animate';
  import { dndzone } from 'svelte-dnd-action';
  import { localStore, lsKeyHeart, storedHearts, storedHeartsShare } from '@stores';
  import Heartlist from './Heartlist.svelte';
  import HeartlistShare from './HeartlistShare.svelte';

  const flipDurationMs = 300;
  let heartLists: any;
  let items: any;
  let changeOrder: boolean = false;

  storedHearts.subscribe(store => (heartLists = store.lists));

  const handleDndConsider = e => {
    items = e.detail.items;
  };

  const handleDndFinalize = e => {
    items = e.detail.items;
    localStore.set(lsKeyHeart, JSON.stringify(items));
    storedHearts.set({ reason: 'change-order', lists: items });
  };

  $: {
    items = heartLists;
  }
</script>

<div
  class="wrap"
  use:dndzone={{ items, flipDurationMs, dragDisabled: !changeOrder }}
  on:consider={handleDndConsider}
  on:finalize={handleDndFinalize}
>
  {#each items as list (list.id)}
    <details class="card" open={list.d} animate:flip={{ duration: flipDurationMs }}>
      <Heartlist {list} {changeOrder} />
    </details>
  {/each}
</div>

<nav class="wrap small-margin no-h-margin">
  <label class="checkbox">
    <input type="checkbox" bind:checked={changeOrder} />
    <span>Reihenfolge ändern aktivieren</span>
  </label>
</nav>

<HeartlistShare />

<style lang="scss">
  .wrap {
    margin-bottom: 8rem;
  }
</style>
