<script lang="ts">
  import { onMount, pad } from '@utils';
  import {
    storedHearts,
    storedHeartsShare,
    getHeartCloud,
    updateHeartCloud,
    generateHeartCloud,
    localStore,
  } from '@stores';
  import beerui from '@beerui';
  import { lsKey, apiVersion } from '../../../stores/api/hearts-share';

  let uuid: string;
  let hrTime: string;
  let heartLists: any;

  storedHeartsShare.subscribe(store => {
    uuid = store.uuid;
    if (store.time > 0) {
      getHeartCloud(true, store.time);
      const date = new Date(store.time);
      hrTime = `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${pad(date.getHours())}:${pad(
        date.getMinutes()
      )}`;
    }
  });
  storedHearts.subscribe(store => (heartLists = store.lists));

  const checkInput = newUuid => {
    const time = new Date().getTime();
    localStore.set(lsKey, JSON.stringify({ uuid: newUuid, time, apiVersion }));
    storedHeartsShare.update(store => {
      store.uuid = newUuid;
      return store;
    });
  };

  onMount(() => {
    setTimeout(() => {
      beerui();
    }, 50);
  });
</script>

<details class="card">
  <summary>
    <b>Teile deine Merklisten über mehrere Geräte</b>
    {#if uuid && hrTime}
      <br />CloudID: <b>{uuid}</b> | Letzter Stand: <b>{hrTime}</b>
    {/if}
  </summary>
  <div class="row no-wrap middle-align small-padding">
    {#if !uuid}
      <div class="col min">
        <button class="chip round no-margin" on:click={() => generateHeartCloud(heartLists)}>
          <i>generating_tokens</i>
          <span class="nowrap">Generiere CloudID</span>
        </button>
      </div>
    {/if}
    {#if uuid}
      <!--      <div class="col min link">-->
      <!--        <i on:click={() => getHeartCloud(heartLists)}>cloud_sync</i>-->
      <!--        <div class="tooltip bottom small-margin">Merklisten aus der Cloud</div>-->
      <!--      </div>-->
      <div class="col min">
        <button class="chip round no-margin" on:click={() => getHeartCloud()}>
          <i>cloud_download</i>
          <span>Download</span>
          <span class="tooltip bottom small-margin">Herunterladen aus der Cloud</span>
        </button>
      </div>
      <div class="col min">
        <button class="chip round no-margin" on:click={() => updateHeartCloud(heartLists)}>
          <i>cloud_upload</i>
          <span>Upload</span>
          <span class="tooltip bottom small-margin">Hochladen in die Cloud</span>
        </button>
      </div>
    {/if}
    <div class="col">
      <div class="field label border no-margin">
        <input
          id="uuid"
          class="search"
          type="search"
          maxlength="5"
          bind:value={uuid}
          on:input={({ target: { value } }) => checkInput(value)}
          spellcheck="false"
        />
        <label for="uuid">CloudID</label>
        <span class="helper">
          {#if !uuid}Drücke <b>"Generiere CloudID"</b> oder gebe hier eine bereits vorhandene <b>CloudID</b> ein{/if}
        </span>
      </div>
    </div>
  </div>
</details>
