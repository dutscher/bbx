<script lang="ts">
  import Icon from './Icon.svelte';
  import { storedActiveSelection } from '../stores/states';
  import { AFF_LINK } from '../_interfaces';

  let lastCursor;

  storedActiveSelection.subscribe(store => (lastCursor = store.lastCursor));
</script>

<div class="footer">
  <strong>Legende:</strong><br />
  <Icon modifier="new" />
  = Neues Produkt
  <Icon modifier="flame" />
  = Beliebtes Produkt (mehr als 2 mal Verfügbar)
  <Icon modifier="heart" svg="true" class="active" />
  = Merkliste<br />
  <span class="state state--blue" /> = Verfügbar
  <span class="state state--green" /> = Bald erhältlich
  <span class="state state--red" /> = Zurzeit Vergriffen
  <span class="state state--orange" /> = In Ankündigung
  <br /><br />
  <strong>Stand:</strong>
  {lastCursor.dateStr}
  {#if !!AFF_LINK}
    <div class="small">
      * Die ausgehenden Produktlinks sind Affiliate-Links. Wenn Ihr klickt und kauft, dann unterstütz Ihr dieses
      Projekt. Vielen Dank :)
    </div>
  {/if}
</div>

<style lang="scss">
  @import '../scss/variables';

  .footer {
    padding-top: 50px;
    font-size: ms(-1);
  }

  .state {
    padding: $space-lg;
    border-radius: 100%;
    background: $color-primary;
    font-size: 0;
    vertical-align: middle;
    margin-right: $space-xs;

    &--green {
      background: $color-comingsoon;
    }

    &--red {
      background: $color-unavailable;
    }

    &--orange {
      background: $color-annoucement;
    }
  }
</style>
