<script lang="ts">
  import FilterSummaryActive from './FilterSummaryActive.svelte';
  import {
    storedActiveSelection,
    storedColors,
    storedParts,
    storedPartTypes,
    storedStates,
    storedTags,
  } from '../../stores';
  import { setUrlParams, stopClick, jsVoid } from '../../utils';

  export let activeSearchString: string = '';
  export let activeTagIds: any = [];
  export let activeStateIds: any = [];
  export let activeColorIds: any = [];
  export let activePartIds: any = [];
  export let activePartTypeIds: any = [];
  let invisible: any;
  let parts: any;
  let partTypes: any;
  let colors: any;
  let states: any;
  let tags: any;

  storedStates.subscribe(store => (states = store));
  storedParts.subscribe(store => (parts = store));
  storedPartTypes.subscribe(store => (partTypes = store));
  storedColors.subscribe(store => (colors = store));
  storedTags.subscribe(store => (tags = store));

  $: invisible =
    !activeSearchString &&
    activeTagIds.length === 0 &&
    activeStateIds.length === 0 &&
    activeColorIds.length === 0 &&
    activePartIds.length === 0 &&
    activePartTypeIds.length === 0;

  const removeItem = (type, e, id) => {
    stopClick(e);

    let restTags;

    storedActiveSelection.update(store => {
      if (type === 'all') {
        const types = ['search', 'tags', 'states', 'colors', 'parts', 'partTypes', 'product'];
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
</script>

{#if !invisible}
  <div class="flex flex--inline filter-summary  with-text-shadow">
    <div class="flex flex--wrap flex--vertical-center filter-summary__wrap">
      <b>Filter:</b>&nbsp;
      <a href={jsVoid} on:click={e => removeItem('all', e)} class="link">
        <i class="small link">delete</i>
        <span>Zurücksetzen</span>
        <div class="tooltip bottom small-margin">Lösche alle Filter</div>
      </a>
      <FilterSummaryActive label="Suche nach" activStr={activeSearchString} onClick={removeItem.bind(this, 'search')} />
      <FilterSummaryActive label="Tags" activeIds={activeTagIds} store={tags} onClick={removeItem.bind(this, 'tags')} />
      <FilterSummaryActive
        label="Status"
        activeIds={activeStateIds}
        store={states}
        onClick={removeItem.bind(this, 'states')}
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
{/if}

<style lang="scss">
  @import '../../scss/variables';

  :global .filter-summary__wrap .link {
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
</style>
