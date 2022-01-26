<script lang="ts">
    import { onMount } from 'svelte';
    import FilterTags from "./FilterTags.svelte";
    import FilterColors from "./FilterColors.svelte";
    import FilterParts from "./FilterParts.svelte";
    import FilterPartTypes from "./FilterPartTypes.svelte";
    import FilterStates from "./FilterStates.svelte";
    import FilterSearch from "./FilterSearch.svelte";
    import Icon from "../Icon.svelte";
    import { ID_PARTS, lsKeyFilter, } from '../../_interfaces';
    import { localStore, storedActiveSelection } from '../../stores';

    let activeTagIds: any = [];
    let activePartIds: any = [];
    let activePartTypeIds: any = [];
    let activeColorIds: any = [];
    let activeStateIds: any = [];
    let activeSearchString: string = '';
    let isVisible = true;

    storedActiveSelection.subscribe(store => {
        activeTagIds = store.tags;
        activePartIds = store.parts;
        activePartTypeIds = store.partTypes;
        activeColorIds = store.colors;
        activeStateIds = store.states;
        activeSearchString = store.search;
    });

    const onClick = () => {
        isVisible = !isVisible;
        localStore.set(lsKeyFilter, isVisible);
    }

    onMount(() => {
        const lsValue = localStore.get(lsKeyFilter);
        if (!lsValue) {
            isVisible = lsValue;
        }
    })
</script>

<h2 class="with-toggle" on:click={onClick}>
    <Icon modifier="arrow {!isVisible ? 'down' : 'up'}" svg/>
    Filter
</h2>
<div class="flex flex--wrap{isVisible ? ' show' : ''} no-toggle-space">
    <FilterTags {activeTagIds}/>
    <FilterStates {activeStateIds} {activeColorIds} {activePartIds} {activePartTypeIds} {activeSearchString}/>
    {#if activeTagIds.includes(ID_PARTS) && activeTagIds.length === 1}
        <FilterParts {activePartIds}/>
        <FilterColors {activeColorIds}/>
        <FilterPartTypes {activePartTypeIds}/>
    {/if}
    <FilterSearch {activeSearchString}/>
</div>

<style lang="scss">
  @import '../../scss/variables';

  .flex {
    display: none;

    &.show {
      display: flex;
    }
  }

  .no-toggle-space {
    padding-left: 0;
  }

</style>
