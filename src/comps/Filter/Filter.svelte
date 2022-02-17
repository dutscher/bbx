<script lang="ts">
  import FilterTags from './FilterTags.svelte';
  import FilterColors from './FilterColors.svelte';
  import FilterParts from './FilterParts.svelte';
  import FilterPartTypes from './FilterPartTypes.svelte';
  import FilterStates from './FilterStates.svelte';
  import FilterSearch from './FilterSearch.svelte';
  import { ID_PARTS } from '../../_interfaces';
  import { storedActiveSelection } from '../../stores';

  let activeTagIds: any = [];
  let activePartIds: any = [];
  let activePartTypeIds: any = [];
  let activeColorIds: any = [];
  let activeStateIds: any = [];
  let activeSearchString: string = '';

  storedActiveSelection.subscribe(store => {
    activeTagIds = store.tags;
    activePartIds = store.parts;
    activePartTypeIds = store.partTypes;
    activeColorIds = store.colors;
    activeStateIds = store.states;
    activeSearchString = store.search;
  });
</script>

<FilterSearch {activeSearchString} />
<FilterStates {activeStateIds} {activeColorIds} {activePartIds} {activePartTypeIds} {activeSearchString} />
<FilterTags {activeTagIds} />

{#if activeTagIds.includes(ID_PARTS) && activeTagIds.length === 1}
  <FilterParts {activePartIds} />
  <FilterColors {activeColorIds} />
  <FilterPartTypes {activePartTypeIds} />
{/if}
