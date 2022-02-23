<script lang="ts">
  import { onMount } from 'svelte';
  import LatestProducts from './LatestProducts.svelte';
  // app
  import { LOADED, UNLOADED } from '../../_interfaces';
  import { storedActiveSelection, storedTags, storedProducts, loadChanges, internetConnection } from '../../stores';
  import Legend from '../Legend.svelte';

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

{#if isOnline && loadedChanges !== LOADED}
  <div class="loader" />
{:else}
  <LatestProducts state={0} title="Verfügbar" />
  <LatestProducts state={1} title="Bald erhältlich" />
  <LatestProducts state={3} title="Ankündigungen" />
{/if}
<Legend />

<style lang="scss">
  @import '../../scss/variables';
</style>
