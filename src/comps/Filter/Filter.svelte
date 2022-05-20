<script lang="ts">
  import FilterTags from './FilterTags.svelte';
  import FilterColors from './Brickbar/FilterColors.svelte';
  import FilterParts from './Brickbar/FilterParts.svelte';
  import FilterPartTypes from './Brickbar/FilterPartTypes.svelte';
  import FilterStates from './FilterStates.svelte';
  import FilterSearch from './FilterSearch.svelte';
  import { ID_PARTS, lsSiteSettingsKey } from '@interfaces';
  import { localStore, storedActiveSelection } from '@stores';
  import { stopClick } from '../../utils';

  let activeTagIds: any = [];
  let activePartIds: any = [];
  let activePartTypeIds: any = [];
  let activeColorIds: any = [];
  let activeStateIds: any = [];
  let showFilter = true;
  let activeSearchString: string = '';

  storedActiveSelection.subscribe(store => {
    activeTagIds = store.tags;
    activePartIds = store.parts;
    activePartTypeIds = store.partTypes;
    activeColorIds = store.colors;
    activeStateIds = store.states;
    activeSearchString = store.search;

    const reasons = [
      'init-tags-url',
      'show-states',
      'show-tags',
      'tooltip-tag-clicked',
      'tag-clicked-close-filter',
      'click-search',
    ];

    if (store.site === 'products' && reasons.includes(store.reason)) {
      if (['show-states', 'show-tags', 'click-search'].includes(store.reason)) {
        showFilter = true;
      }
      if (
        store.reason === 'init-tags-url' ||
        store.reason === 'tooltip-tag-clicked' ||
        store.reason === 'tag-clicked-close-filter'
      ) {
        showFilter = false;
      }

      localStore.set(lsSiteSettingsKey, store.site);
      // remove reason
      storedActiveSelection.update(store => {
        store.reason = '';
        return store;
      });
    }
  });

  const handleClick = e => {
    stopClick(e);
    showFilter = !showFilter;
  };
</script>

<details class="card" open={showFilter}>
  <summary class="large-text" on:click={handleClick}><b>Suche & Filter</b></summary>
  <FilterSearch {activeSearchString} />
  <FilterStates {activeStateIds} {activeColorIds} {activePartIds} {activePartTypeIds} {activeSearchString} />
  <FilterTags {activeTagIds} />

  {#if activeTagIds.includes(ID_PARTS) && activeTagIds.length === 1}
    <h2>Brickbar</h2>
    <FilterParts {activePartIds} />
    <FilterColors {activeColorIds} />
    <FilterPartTypes {activePartTypeIds} />
  {/if}
</details>
