<script lang="ts">
  import FilterTags from './FilterTags.svelte';
  import FilterColors from './FilterColors.svelte';
  import FilterParts from './FilterParts.svelte';
  import FilterPartTypes from './FilterPartTypes.svelte';
  import FilterStates from './FilterStates.svelte';
  import FilterSearch from './FilterSearch.svelte';
  import { ID_PARTS, lsPageSettingsKey } from '../../_interfaces';
  import { localStore, storedActiveSelection } from '../../stores';
  import { jsVoid, ess } from '../../utils';

  let activeTagIds: any = [];
  let activePartIds: any = [];
  let activePartTypeIds: any = [];
  let activeColorIds: any = [];
  let activeStateIds: any = [];
  let activeSearchString: string = '';
  const tabs = [
    { name: 'states', title: 'Status' },
    { name: 'tags', title: 'Tags' },
  ];
  let newTab = 'states';

  storedActiveSelection.subscribe(store => {
    activeTagIds = store.tags;
    activePartIds = store.parts;
    activePartTypeIds = store.partTypes;
    activeColorIds = store.colors;
    activeStateIds = store.states;
    activeSearchString = store.search;

    if (store.page === 'products' && store.reason === 'show-tags') {
      newTab = 'tags';
      localStore.set(lsPageSettingsKey, store.page);
      // remove reason
      storedActiveSelection.update(store => {
        store.reason = '';
        return store;
      });
    }
  });

  const clickTab = tabId => {
    if (newTab === tabId) {
      tabId = undefined;
    }
    newTab = tabId;
  };

  $: activeTab = newTab;
</script>

<FilterSearch {activeSearchString} />

<div class="tabs">
  {#each tabs as tab}
    <a
      data-ui="#{tab.name}"
      href={jsVoid}
      class={ess(tab.name === activeTab && 'active')}
      on:click={() => clickTab(tab.name)}
    >
      {#if tab.name === 'states' && activeStateIds.length > 0}
        <span class="badge round">{activeStateIds.length}</span>
      {:else if activeTagIds.length > 0}
        <span class="badge round">{activeTagIds.length}</span>
      {/if}
      {tab.title}
    </a>
  {/each}
</div>

<div id="states" class={ess(['page padding', activeTab === 'states' && 'active'])}>
  <FilterStates
    {activeStateIds}
    {activeColorIds}
    {activePartIds}
    {activePartTypeIds}
    {activeSearchString}
    isVisible={activeTab === 'states'}
  />
</div>
<div id="tags" class={ess(['page padding', activeTab === 'tags' && 'active'])}>
  <FilterTags {activeTagIds} isVisible={activeTab === 'tags'} />
</div>

{#if activeTagIds.includes(ID_PARTS) && activeTagIds.length === 1}
  <FilterParts {activePartIds} />
  <FilterColors {activeColorIds} />
  <FilterPartTypes {activePartTypeIds} />
{/if}
