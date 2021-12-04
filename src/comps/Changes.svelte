<script lang="ts">
    import { onMount } from 'svelte';

    import TodayChanges from "./TodayChanges.svelte";
    import LatestProducts from "./LatestProducts.svelte";
    import Icon from "./Icon.svelte";
    // app
    import { LOADED, UNLOADED } from '../_interfaces';
    import {
        storedActiveSelection,
        storedTags,
        storedProducts,
        loadChanges,
        localStore
    } from '../stores';

    let activeTagIds;
    let activePartIds;
    let activeColorIds;
    let activeStateIds;
    let activeSearchString;
    let loadedChanges;
    let tags: number = 0;
    let products: number = 0;
    let isTouched = false;

    storedTags.subscribe(value => tags = value.length);
    storedProducts.subscribe(value => products = value.length);
    storedActiveSelection.subscribe(value => {
        activeTagIds = value.tags || [];
        activePartIds = value.parts || [];
        activeColorIds = value.colors || [];
        activeStateIds = value.states || [];
        activeSearchString = value.search || '';
        loadedChanges = value.loadedData.changes;
    });

    $: isFiltered = !isTouched && (!!activeSearchString
        || activeTagIds.length > 0
        || activeStateIds.length > 0
        || activeColorIds.length > 0
        || activePartIds.length > 0);

    $: isVisible = !isFiltered;

    const onClick = () => {
        isTouched = true;
        isVisible = !isVisible;
        localStore.set('changesVisible', isVisible);
    }

    onMount(() => {
        if (loadedChanges === UNLOADED) {
            loadChanges();
        }

        const lsValue = localStore.get('changesVisible');
        if (!lsValue) {
            isTouched = true;
            isVisible = lsValue;
        }
    })
</script>

<h2 class="with-toggle" on:click={onClick}>
    <Icon modifier="arrow" classes={`icon--${!isVisible ? 'down' : 'up'}`}/>
    Änderungen
</h2>
<div class="changes{isVisible ? ' show' : ''}">
    {#if loadedChanges !== LOADED}
        <div class="loader"></div>
    {:else}
        <TodayChanges/>
        <LatestProducts state={0} title="Verfügbar"/>
        <LatestProducts state={1} title="Bald erhältlich"/>
        <LatestProducts state={3} title="Ankündigungen"/>
    {/if}
</div>

<style lang="scss">
  @import '../scss/variables';

  .changes {
    display: none;
    padding-bottom: $space-xl;

    &.show {
      display: block;
    }

    .fb-like {
      height: 30px;
    }
  }

  .loader {
    height: 50px;
    width: 50px;
    background-image: url('../images/spinner.svg');
    background-size: contain;
    animation: spin 4s linear infinite;
  }

  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }
</style>
