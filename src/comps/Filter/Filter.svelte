<script lang="ts">
  import FilterTags from './FilterTags.svelte';
  import FilterStates from './FilterStates.svelte';
  import FilterDesigner from './FilterDesigner.svelte';
  import FilterSearch from './FilterSearch.svelte';
  import { lsSiteSettingsKey } from '@interfaces';
  import { localStore, storedActiveSelection } from '@stores';
  import { stopClick } from '../../utils';

  let activeTagIds: any = [];
  let activePartIds: any = [];
  let activePartTypeIds: any = [];
  let activeColorIds: any = [];
  let activeStateIds: any = [];
  let activeDesignerIds: any = [];
  let showFilter = true;
  let activeSearchString: string = '';

  storedActiveSelection.subscribe(store => {
    activeTagIds = store.tags;
    activePartIds = store.parts;
    activePartTypeIds = store.partTypes;
    activeColorIds = store.colors;
    activeStateIds = store.states;
    activeDesignerIds = store.designer;
    activeSearchString = store.search;

    const reasons = [
      'init-tags-url',
      'init-search-via-url',
      'show-states',
      'show-tags',
      'tooltip-tag-clicked',
      'tag-clicked-close-filter',
      'remove-all-filters',
      'click-search',
    ];

    if (store.site === 'products' && reasons.includes(store.reason)) {
      if (['show-states', 'show-tags', 'click-search', 'remove-all-filters'].includes(store.reason)) {
        showFilter = true;
      }
      if (
        ['init-tags-url', 'init-search-via-url', 'tooltip-tag-clicked', 'tag-clicked-close-filter'].includes(
          store.reason
        )
      ) {
        showFilter = false;
      }

      localStore.set(lsSiteSettingsKey, store.site);
      if (store.reason !== 'click-search') {
        // remove reason
        storedActiveSelection.update(store => {
          store.reason = '';
          return store;
        });
      }
    }
  });

  const handleClick = e => {
    stopClick(e);
    showFilter = !showFilter;
  };
</script>

<details class="card" open={showFilter}>
  <summary class="large-text" on:click={handleClick}><b>Filter & Suche</b></summary>
  <FilterStates {activeStateIds} {activeColorIds} {activePartIds} {activePartTypeIds} {activeSearchString} />
  <FilterTags {activeTagIds} />
  <FilterDesigner {activeDesignerIds} />
  <FilterSearch {activeSearchString} />
</details>

<style lang="scss">
  :global .chip__state {
    right: -4rem;
    opacity: 0.6;
  }
</style>
