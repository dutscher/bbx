<script lang="ts">
  import { onMount } from '@utils';
  import { LOADED, UNLOADED } from '@interfaces';
  import { storedActiveSelection, storedTags, storedProducts, loadChanges, internetConnection } from '@stores';
  import TodayChanges from './TodayChanges.svelte';

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
  <div class="loader center" />
{:else}
  <TodayChanges />
{/if}
