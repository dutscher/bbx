<script lang="ts">
  import { storedHearts, storedHeartsShare, getHeartCloud, updateHeartCloud, generateHeartCloud } from '@stores';

  let heartShare: any;
  let heartLists: any;

  storedHeartsShare.subscribe(store => (heartShare = store));
  storedHearts.subscribe(store => {
    heartLists = store;
    // update changes from tooltip or page
    if (heartShare.uuid) {
      updateHeartCloud(heartLists);
    }
  });
</script>

<input bind:value={heartShare.key} />

{#if !heartShare.uuid}
  <i on:click={() => generateHeartCloud(heartLists)}>cloud_upload</i>
{/if}
{#if heartShare.uuid}
  <i on:click={() => getHeartCloud(heartLists)}>cloud_download</i>
{/if}
