<script lang="ts">
  import {
    storedActiveSelection,
    storedColors,
    storedParts,
    storedPartTypes,
    storedStates,
    storedTags,
    storedDesigner,
  } from '@stores';
  import { setUrlParams, stopClick } from '@utils';
  import FilterSummaryActive from './FilterSummaryActive.svelte';

  export let activeSearchString: string = '';
  export let activeTagIds: any = [];
  export let activeStateIds: any = [];
  export let activeDesignerIds: any = [];
  export let activeColorIds: any = [];
  export let activePartIds: any = [];
  export let activePartTypeIds: any = [];

  let parts: any;
  let partTypes: any;
  let colors: any;
  let designer: any;
  let states: any;
  let tags: any;
  let moreThanOne: any;
  let showAll: any;

  storedStates.subscribe(store => (states = store));
  storedDesigner.subscribe(store => (designer = store));
  storedParts.subscribe(store => (parts = store));
  storedPartTypes.subscribe(store => (partTypes = store));
  storedColors.subscribe(store => (colors = store));
  storedTags.subscribe(store => (tags = store));

  const removeItem = (type, e, id) => {
    stopClick(e);

    let restTags;

    storedActiveSelection.update(store => {
      if (type === 'all') {
        const types = ['search', 'tags', 'states', 'designer', 'colors', 'parts', 'partTypes', 'product'];
        types.map(type => {
          const value = type === 'search' ? '' : [];
          store[type] = value;
          setUrlParams(type, value);
        });
      } else {
        if (type === 'search') {
          store[type] = '';
        } else {
          store[type] = store[type].filter(itemId => itemId !== id);
        }

        restTags = tags.filter(tag => store[type].includes(tag.id));

        if (restTags.length === 0) {
          store.reason = 'remove-all-filters';
        }

        setUrlParams(
          type,
          restTags.map(tag => tag.seoName)
        );
      }

      return store;
    });
  };

  $: {
    moreThanOne = [activeTagIds, activeStateIds, activeColorIds, activePartIds, activePartTypeIds].filter(
      ids => ids.length > 0
    );
    showAll = (!!activeSearchString && moreThanOne.length >= 1) || moreThanOne.length >= 2;
  }
</script>

<div class="flex flex--gap flex--column">
  <b>Filter</b>
  <div class="flex flex--inline flex--gap flex--wrap flex--middle">
    {#if showAll}
      <FilterSummaryActive label="Alle" reset onClick={removeItem.bind(this, 'all')} />
    {/if}
    <FilterSummaryActive label="Suche nach" activeStr={activeSearchString} onClick={removeItem.bind(this, 'search')} />
    <FilterSummaryActive label="Tag" activeIds={activeTagIds} store={tags} onClick={removeItem.bind(this, 'tags')} />
    <FilterSummaryActive
      label="Status"
      activeIds={activeStateIds}
      store={states}
      onClick={removeItem.bind(this, 'states')}
    />
    <FilterSummaryActive
      label="Designer"
      activeIds={activeDesignerIds}
      store={designer}
      onClick={removeItem.bind(this, 'designer')}
    />
    <FilterSummaryActive
      label="Farben"
      activeIds={activeColorIds}
      store={colors}
      onClick={removeItem.bind(this, 'colors')}
    />
    <FilterSummaryActive
      label="Parts"
      activeIds={activePartIds}
      store={parts}
      onClick={removeItem.bind(this, 'parts')}
    />
    <FilterSummaryActive
      label="Parttypen"
      activeIds={activePartTypeIds}
      store={partTypes}
      onClick={removeItem.bind(this, 'partTypes')}
    />
  </div>
</div>
