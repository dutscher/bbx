<script lang="ts">
  import { internetConnection, storedActiveSelection } from '@stores';

  let isOnline = false;
  let lastCursor;

  internetConnection.subscribe(store => (isOnline = store.isOnline));
  storedActiveSelection.subscribe(store => (lastCursor = store.lastCursor));
</script>

{#if !isOnline}
  <div class="chip circle fixed no-margin">
    <i>wifi_off</i>
    <div class="tooltip">
      Deine Internet Verbindung ist weg! Aber du kannst den Watcher weiterhin Offline nutzen.<br />
      <b>Letzter gecachter Stand:</b>
      {lastCursor.dateStr}
    </div>
  </div>
{/if}

<style lang="scss">
  .chip {
    top: 64rem;
    left: 0;
    z-index: 1;

    &::before {
      content: '';
      width: 0;
      height: 0;
      border-top: 100rem solid red;
      border-right: 100rem solid transparent;
      position: absolute;
      left: 0;
      z-index: -1;
    }

    .tooltip {
      top: 30rem;
      left: 30rem;
      width: 50vw;
      transform: translate(0%, 0%);
      white-space: normal;
      text-align: left;
    }
  }
</style>
