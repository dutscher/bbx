<script lang="ts">
  import FilterSummary from '../Filter/FilterSummary.svelte';
  import ProductSorter from '../Product/ProductSorter.svelte';
  import { storedActiveSelection } from '../../stores/active-selection';

  export let filteredProducts: any = [];
  let invisible: any;
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

  $: {
    invisible =
      activeSearchString === '' &&
      activeTagIds.length === 0 &&
      activeStateIds.length === 0 &&
      activeColorIds.length === 0 &&
      activePartIds.length === 0 &&
      activePartTypeIds.length === 0;
  }
</script>

{#if !invisible}
  <article>
    <div class="filter flex flex--wrap flex--gap">
      <FilterSummary
        {activeSearchString}
        {activeTagIds}
        {activeStateIds}
        {activeColorIds}
        {activePartIds}
        {activePartTypeIds}
      />
      <ProductSorter {filteredProducts} {activeTagIds} />
    </div>
  </article>
{/if}

<style lang="scss">
  .filter {
    justify-content: space-between;
  }
</style>
