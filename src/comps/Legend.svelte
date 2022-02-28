<script lang="ts">
  import { storedActiveSelection } from '../stores/states';
  import { AFF_LINK } from '../_interfaces';

  let lastCursor;

  storedActiveSelection.subscribe(store => (lastCursor = store.lastCursor));
</script>

<div class="legend">
  <h6>Legende:</h6>
  <div>
    <i class="yellow-text">star</i> = Neues Produkt
    <i class="orange-text">local_fire_department</i> = Beliebtes Produkt
    <i class="red-text">favorite</i> = Merkliste
    <i class="blue-text">fiber_manual_record</i> = Verfügbar
    <i class="green-text">fiber_manual_record</i> = Bald erhältlich
    <i class="red-text">fiber_manual_record</i> = Zurzeit Vergriffen
    <i class="orange-text">fiber_manual_record</i> = In Ankündigung
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
  @import '../scss/variables';

  .legend {
    padding-top: 50px;
    font-size: ms(-1);
  }
</style>
