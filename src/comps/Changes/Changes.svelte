<script lang="ts">
  import { writable } from 'svelte/store';
  import LatestProducts from './LatestProductsPerMonth.svelte';
  import { LOADED, UNLOADED } from '../../_interfaces';
  import { storedActiveSelection, storedTags, storedProducts, loadChanges, internetConnection } from '../../stores';
  import { onMount, jsVoid, ess } from '../../utils';

  let loadedChanges;
  let tags: number = 0;
  let products: number = 0;
  let isOnline = false;
  let activeTab: string = 'available';
  const tabsStore = writable([
    { id: 0, name: 'available', color: 'blue', title: 'Verfügbar', count: 0 },
    { id: 1, name: 'coming_soon', color: 'green', title: 'Bald erhältlich', count: 0 },
    { id: 3, name: 'announcement', color: 'orange', title: 'Ankündigungen', count: 0 },
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
  <div class="loader center" />
{:else}
  <article class="tabs">
    {#each tabs as tab}
      <a
        data-ui="#{tab.name}"
        href={jsVoid}
        class={ess(tab.name === activeTab && 'active')}
        on:click={() => clickTab(tab.name)}
      >
        <span>
          <span class="s">
            <i class="{tab.color}-text">fiber_manual_record</i>
            <div class="tooltip bottom small-margin">{tab.title}</div>
          </span>
          <span class="m l">{tab.title}</span>
          <span class="badge round">{tab.count}</span>
        </span>
      </a>
    {/each}
  </article>
  {#each tabs as tab}
    <div id="available" class={ess(activeTab === tab.name && 'active')}>
      <LatestProducts state={tab.id} isVisible={activeTab === tab.name} onCounterAvailable={updateCounter} />
    </div>
  {/each}
{/if}
