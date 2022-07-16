<script lang="ts">
  import { storedActiveSelection } from '@stores';
  import { ID_MANHATTAN, ID_NETHERLAND, ID_FRANKFURT, ID_BURG_BLAUSTEIN } from '@interfaces';
  import Manhattan from '../Specials/Manhattan.svelte';
  import Netherland from '../Specials/Netherland.svelte';
  import Frankfurt from '../Specials/Frankfurt.svelte';
  import Blaustein from '../Specials/Blaustein.svelte';

  let activeTagIds: any = [];
  storedActiveSelection.subscribe(store => {
    activeTagIds = store.tags;
  });
</script>

{#if activeTagIds.includes(ID_MANHATTAN) && activeTagIds.length === 1}
  <br />
  <Manhattan />
{/if}
{#if activeTagIds.includes(ID_NETHERLAND) && activeTagIds.length === 1}
  <br />
  <Netherland />
{/if}
{#if activeTagIds.includes(ID_FRANKFURT) && activeTagIds.length === 1}
  <br />
  <Frankfurt />
{/if}
{#if activeTagIds.includes(ID_BURG_BLAUSTEIN) && activeTagIds.length === 1}
  <br />
  <Blaustein />
{/if}
