<script lang="ts">
    import { onMount } from 'svelte';
    import TodayChanges from "./TodayChanges.svelte";
    import LatestProducts from "./LatestProducts.svelte";
    import Icon from "./Icon.svelte";
    // app
    import { LOADED, UNLOADED, lsKeyChanges } from '../_interfaces';
    import {
        storedActiveSelection,
        storedTags,
        storedProducts,
        loadChanges,
        localStore
    } from '../stores';

    let loadedChanges;
    let tags: number = 0;
    let products: number = 0;
    let isVisible = true;

    storedTags.subscribe(value => tags = value.length);
    storedProducts.subscribe(value => products = value.length);
    storedActiveSelection.subscribe(value => {
        loadedChanges = value.loadedData.changes;
    });

    const onClick = () => {
        isVisible = !isVisible;
        localStore.set(lsKeyChanges, isVisible);
    }

    onMount(() => {
        if (loadedChanges === UNLOADED) {
            loadChanges();
        }

        const lsValue = localStore.get(lsKeyChanges);
        if (!lsValue) {
            isVisible = lsValue;
        }
    })
</script>

<h2 class="with-toggle" on:click={onClick}>
    <Icon modifier="arrow" class="icon--{!isVisible ? 'down' : 'up'}"/>
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
