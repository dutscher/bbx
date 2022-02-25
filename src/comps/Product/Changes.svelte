<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import LatestProducts from './ChangesLatestProducts.svelte';
  import Legend from '../Legend.svelte';
  import { LOADED, UNLOADED } from '../../_interfaces';
  import { storedActiveSelection, storedTags, storedProducts, loadChanges, internetConnection } from '../../stores';
  import { jsVoid, ess } from '../../utils';

  let loadedChanges;
  let tags: number = 0;
  let products: number = 0;
  let isOnline = false;
  let activeTab: string = 'available';
  const tabsStore = writable([
    { id: 0, name: 'available', title: 'Verfügbar', count: 0 },
    { id: 1, name: 'coming_soon', title: 'Bald erhältlich', count: 0 },
    { id: 3, name: 'announcement', title: 'Ankündigungen', count: 0 },
  ]);
  let tabs = [];

  tabsStore.subscribe(store => (tabs = store));
  internetConnection.subscribe(store => {
    isOnline = store.isOnline;

    if (isOnline && loadedChanges === UNLOADED) {
      loadChanges();
    }
  });
  storedTags.subscribe(store => (tags = store.length));
  storedProducts.subscribe(store => (products = store.length));
  storedActiveSelection.subscribe(store => {
    loadedChanges = store.loadedData.changes;
  });

  const clickTab = tabId => {
    if (activeTab === tabId) {
      tabId = undefined;
    }
    activeTab = tabId;
  };

  const updateCounter = (tabId, counter) => {
    tabsStore.update(store => {
      const foundTab = store.find(tab => tab.id === tabId);
      foundTab.count = counter;
      return store;
    });
  };

  onMount(() => {
    if (isOnline && loadedChanges === UNLOADED) {
      loadChanges();
    }
  });
</script>

{#if isOnline && loadedChanges !== LOADED}
  <div class="loader" />
{:else}
  <p class="small-text">Die Produkte sind nach neustem Veröffentlichungsdatum sortiert</p>
  <div class="tabs">
    {#each tabs as tab}
      <a
        data-ui="#{tab.name}"
        href={jsVoid}
        class={ess(tab.name === activeTab && 'active')}
        on:click={() => clickTab(tab.name)}
      >
        <span class="badge round">{tab.count}</span>
        {tab.title}
      </a>
    {/each}
  </div>
  {#each tabs as tab}
    <div id="available" class={ess(['page padding', activeTab === tab.name && 'active'])}>
      <LatestProducts state={tab.id} isVisible={activeTab === tab.name} onCounterAvailable={updateCounter} />
    </div>
  {/each}
{/if}
<Legend />

<style lang="scss">
  @import '../../scss/variables';
</style>
