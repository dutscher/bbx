<script lang="ts">
  import { storedHearts, storedHeartsShare, getHeartCloud, generateHeartCloud } from '@stores';

  let heartShare: any;
  let heartLists: any;

  storedHeartsShare.subscribe(store => (heartShare = store));
  storedHearts.subscribe(store => (heartLists = store));
</script>

<input bind:value={heartShare.uuid} />
{#if heartShare.uuid}
  Letzter Stand: {heartShare.time}
{/if}

{#if !heartShare.uuid}
  <i on:click={() => generateHeartCloud(heartLists)}>cloud_upload</i>
{/if}
{#if heartShare.uuid}
  <i on:click={() => getHeartCloud(heartLists)}>cloud_download</i>
{/if}
