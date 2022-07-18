<script lang="ts">
  import { storedActiveSelection } from '@stores';
  import { ID_MANHATTAN, ID_NETHERLAND, ID_FRANKFURT, ID_BURG_BLAUSTEIN, SPECIALS_TAGS } from '@interfaces';
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
  <Manhattan tag={SPECIALS_TAGS.find(tag => tag.id === ID_MANHATTAN)} />
{/if}
{#if activeTagIds.includes(ID_NETHERLAND) && activeTagIds.length === 1}
  <br />
  <Netherland tag={SPECIALS_TAGS.find(tag => tag.id === ID_NETHERLAND)} />
{/if}
{#if activeTagIds.includes(ID_FRANKFURT) && activeTagIds.length === 1}
  <br />
  <Frankfurt tag={SPECIALS_TAGS.find(tag => tag.id === ID_FRANKFURT)} />
{/if}
{#if activeTagIds.includes(ID_BURG_BLAUSTEIN) && activeTagIds.length === 1}
  <br />
  <Blaustein tag={SPECIALS_TAGS.find(tag => tag.id === ID_BURG_BLAUSTEIN)} />
{/if}
