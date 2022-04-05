<script lang="ts">
  import { pad } from '@utils';
  import { storedHearts, storedHeartsShare, getHeartCloud, generateHeartCloud } from '@stores';

  let uuid: string;
  let hrTime: string;
  let heartLists: any;

  storedHeartsShare.subscribe(store => {
    uuid = store.uuid;
    if (store.time > 0) {
      const date = new Date(store.time);
      hrTime = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    }
  });
  storedHearts.subscribe(store => (heartLists = store));

  const checkInput = newUuid => {
    storedHeartsShare.update(store => {
      store.uuid = newUuid;
      return store;
    });
  };
</script>

<input bind:value={uuid} on:input={({ target: { value } }) => checkInput(value)} />
{#if uuid && hrTime}
  Letzter Stand: {hrTime}
{/if}

{#if !uuid}
  <i on:click={() => generateHeartCloud(heartLists)}>cloud_upload</i>
{/if}
{#if uuid}
  <i on:click={() => getHeartCloud(heartLists)}>cloud_download</i>
{/if}
