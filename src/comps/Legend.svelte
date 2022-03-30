<script lang="ts">
  import { storedActiveSelection } from '../stores/states';
  import { AFF_LINK } from '../_interfaces';

  let lastCursor;

  storedActiveSelection.subscribe(store => (lastCursor = store.lastCursor));
</script>

<div class="legend">
  <h6>Legende:</h6>
  <div>
    <span>
      <i class="yellow-text">star</i>
      <div class="tooltip bottom small-margin">Neues Produkt</div>
    </span>
    <span>
      <i class="orange-text">local_fire_department</i>
      <div class="tooltip bottom small-margin">Beliebtes Produkt</div>
    </span>
    <span>
      <i class="red-text">favorite</i>
      <div class="tooltip bottom small-margin">Merkliste</div>
    </span>
    <span>
      <i class="blue-text">fiber_manual_record</i>
      <div class="tooltip bottom small-margin">Verfügbar</div>
    </span>
    <span>
      <i class="green-text">fiber_manual_record</i>
      <div class="tooltip bottom small-margin">Bald erhältlich</div>
    </span>
    <span>
      <i class="red-text">fiber_manual_record</i>
      <div class="tooltip bottom small-margin">Zurzeit Vergriffen</div>
    </span>
    <span>
      <i class="orange-text">fiber_manual_record</i>
      <div class="tooltip bottom small-margin">In Ankündigung</div>
    </span>
  </div>
  <p><b>Stand:</b> {lastCursor.dateStr}</p>

  {#if !!AFF_LINK}
    <div class="small">
      * Die ausgehenden Produktlinks sind Affiliate-Links. Wenn Ihr klickt und kauft, dann unterstützt Ihr dieses
      Projekt. Vielen Dank :)
    </div>
  {/if}
</div>

<style lang="scss">
  .legend {
    padding-top: 50rem;
    font-size: 12rem;

    span {
      cursor: pointer;
    }
  }
</style>
