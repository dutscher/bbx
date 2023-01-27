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
  import { lsKey } from '../../../stores/api/hearts-share';

  let uuid: string;
  let hrTime: string;
  let heartLists: any;

  storedHeartsShare.subscribe(store => {
    uuid = store.uuid;
    if (store.time > 0) {
      const date = new Date(store.time);
      hrTime = `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${pad(date.getHours())}:${pad(
        date.getMinutes()
      )}`;
    }
  });
  storedHearts.subscribe(store => (heartLists = store.lists));

  const checkInput = newUuid => {
    const time = new Date().getTime();
    localStore.set(lsKey, JSON.stringify({ uuid: newUuid, time }));
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
    <b>
      Es ist leider imme rnoch nicht möglich die Merklisten über mehrere Geräte zuteilen. Bitte behalte deine Merklisten
      auf diesem Gerät. Aktuell arbeiten wir an einer Lösung. (Stand 27.01.2023)
    </b>
  </summary>
  <summary style="display: none">
    <b>Teile deine Merklisten über mehrere Geräte</b>
    {#if uuid && hrTime}
      <br />CloudID: <b>{uuid}</b> | Letzter Stand: <b>{hrTime}</b>
    {/if}
  </summary>
  <div class="row no-wrap middle-align small-padding">
    <div style="display: none">
      {#if !uuid}
        <div class="col min">
          <button class="chip circle no-margin" on:click={() => generateHeartCloud(heartLists)}>
            <i>cloud_upload</i>
            <div class="tooltip bottom small-margin">Generiere CloudID</div>
          </button>
        </div>
      {/if}
      {#if uuid}
        <!--      <div class="col min link">-->
        <!--        <i on:click={() => getHeartCloud(heartLists)}>cloud_sync</i>-->
        <!--        <div class="tooltip bottom small-margin">Merklisten aus der Cloud</div>-->
        <!--      </div>-->
        <div class="col min">
          <button class="chip circle no-margin" on:click={() => getHeartCloud()}>
            <i>cloud_download</i>
            <div class="tooltip bottom small-margin">Herunterladen aus der Cloud</div>
          </button>
        </div>
        <div class="col min">
          <button class="chip circle no-margin" on:click={() => updateHeartCloud(heartLists)}>
            <i>cloud_upload</i>
            <div class="tooltip bottom small-margin">Hochladen in die Cloud</div>
          </button>
        </div>
      {/if}
      <div class="col">
        <div class="field label prefix border no-margin">
          <i>
            {#if uuid}cloud{:else}cloud_off{/if}
          </i>
          <input
            id="uuid"
            class="search"
            type="search"
            bind:value={uuid}
            on:input={({ target: { value } }) => checkInput(value)}
            spellcheck="false"
          />
          <label for="uuid">CloudID</label>
          <span class="helper">
            {#if !uuid}Drücke auf <b>"Generiere CloudID"</b> oder gib hier eine vorhandene 4-stellige <b>CloudID</b> ein{/if}
          </span>
        </div>
      </div>
    </div>
  </div>
</details>
