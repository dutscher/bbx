<script lang="ts">
  import FilterTags from './FilterTags.svelte';
  import FilterColors from './Brickbar/FilterColors.svelte';
  import FilterParts from './Brickbar/FilterParts.svelte';
  import FilterPartTypes from './Brickbar/FilterPartTypes.svelte';
  import FilterStates from './FilterStates.svelte';
  import FilterSearch from './FilterSearch.svelte';
  import { ID_PARTS, lsSiteSettingsKey } from '@interfaces';
  import { localStore, storedActiveSelection } from '@stores';
  import { jsVoid, ess } from '@utils';

  let activeTagIds: any = [];
  let activePartIds: any = [];
  let activePartTypeIds: any = [];
  let activeColorIds: any = [];
  let activeStateIds: any = [];
  let activeTab: any;
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

    const reasons = ['init-tags-url', 'show-states', 'show-tags', 'tooltip-tag-clicked'];

    if (store.site === 'products' && reasons.includes(store.reason)) {
      if (store.reason === 'show-states') {
        newTab = 'states';
      }
      if (store.reason === 'show-tags') {
        newTab = 'tags';
      }
      if (store.reason === 'init-tags-url' || store.reason === 'tooltip-tag-clicked') {
        newTab = '';
      }
      localStore.set(lsSiteSettingsKey, store.site);
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

<article>
  <div class="tabs">
    {#each tabs as tab}
      <a
        data-ui="#{tab.name}"
        href={jsVoid}
        class={ess(tab.name === activeTab && 'active')}
        on:click={() => clickTab(tab.name)}
      >
        <span>
          {tab.title}
          {#if tab.name === 'states' && activeStateIds.length > 0}
            <span class="badge round">{activeStateIds.length}</span>
          {:else if tab.name === 'tags' && activeTagIds.length > 0}
            <span class="badge round">{activeTagIds.length}</span>
          {/if}
        </span>
      </a>
    {/each}
  </div>

  <div id="states" class={ess('page small-padding no-h-padding', activeTab === 'states' && 'active')}>
    <FilterStates
      {activeStateIds}
      {activeColorIds}
      {activePartIds}
      {activePartTypeIds}
      {activeSearchString}
      isVisible={activeTab === 'states'}
    />
  </div>
  <div id="tags" class={ess('page small-padding no-h-padding', activeTab === 'tags' && 'active')}>
    <FilterTags {activeTagIds} isVisible={activeTab === 'tags'} />
  </div>
</article>

{#if activeTagIds.includes(ID_PARTS) && activeTagIds.length === 1}
  <h2>Brickbar</h2>
  <FilterParts {activePartIds} />
  <FilterColors {activeColorIds} />
  <FilterPartTypes {activePartTypeIds} />
{/if}
