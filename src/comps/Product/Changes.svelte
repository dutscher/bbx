<script lang="ts">
  import { onMount } from 'svelte';
  import TodayChanges from './TodayChanges.svelte';
  import LatestProducts from './LatestProducts.svelte';
  // app
  import { LOADED, UNLOADED } from '../../_interfaces';
  import { storedActiveSelection, storedTags, storedProducts, loadChanges, internetConnection } from '../../stores';

  let loadedChanges;
  let tags: number = 0;
  let products: number = 0;
  let isOnline = false;

  internetConnection.subscribe(store => {
    isOnline = store.isOnline;

    if (isOnline && loadedChanges === UNLOADED) {
      loadChanges();
    }
  });
  storedTags.subscribe(store => (tags = store.length));
  storedProducts.subscribe(store => (products = store.length));
  storedActiveSelection.subscribe(store => (loadedChanges = store.loadedData.changes));

  onMount(() => {
    if (isOnline && loadedChanges === UNLOADED) {
      loadChanges();
    }
  });
</script>

<div title="Änderungen">
  {#if isOnline && loadedChanges !== LOADED}
    <div class="loader" />
  {:else}
    <div class="changes">
      <TodayChanges />
      <LatestProducts state={0} title="Verfügbar" />
      <LatestProducts state={1} title="Bald erhältlich" />
      <LatestProducts state={3} title="Ankündigungen" />
    </div>
  {/if}
</div>

<style lang="scss">
  @import '../../scss/variables';

  .loader {
    height: 50px;
    width: 50px;
    background-image: url('../images/spinner.svg');
    background-size: contain;
    animation: spin 4s linear infinite;
  }

  .changes {
    width: 100%;
  }

  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }
</style>
