<script lang="ts">
  import { onMount } from 'svelte';
  import Toggle from './Toggle.svelte';
  // app
  import { storedTags, storedProducts, localStore, internetConnection, storedActiveSelection } from '../stores';
  import { IDS_SPECIAL_TAGS, lsKeyWelcome } from '../_interfaces';

  let tags: number = 0;
  let products: number = 0;
  let isVisible = true;
  let isOnline = false;
  let lastCursor;

  internetConnection.subscribe(store => (isOnline = store.isOnline));
  storedTags.subscribe(store => (tags = store.length));
  storedProducts.subscribe(store => (products = store.length));
  storedActiveSelection.subscribe(store => (lastCursor = store.lastCursor));

  const onClick = () => {
    isVisible = !isVisible;
    localStore.visibility(lsKeyWelcome, isVisible);
  };

  onMount(() => {
    const lsValue = localStore.visibility(lsKeyWelcome);
    if (!lsValue) {
      isVisible = lsValue;
    }
  });
</script>

<Toggle title="Bluebrixx Watcher" class="with-text-shadow" headlineTag={1}>
  <div
    slot="description"
    class="fb-like"
    data-href="https://www.facebook.com/bbxwatcher"
    data-width="170px"
    data-layout="button_count"
    data-action="like"
    data-size="small"
    data-share="true"
  />
  <div>
    {#if !isOnline}
      <span class="warning">
        Deine Internet Verbindung ist weg aber du kannst den Watcher weiterhin nutzen.<br />
        <strong>Letzter Stand:</strong>
        {lastCursor[0] && lastCursor[0].split('|')[1]}
      </span>
    {/if}
    <div class="welcome">
      <p>
        Dies ist ein Kompakter Bluebrixx only Produkte Katalog.<br />
        Aufgrund des vielen klickens und langen Ladezeiten im BB eigenen Online-Shop, haben wir das hier entwickelt.
        <b>Wir sind nicht Bluebrixx</b>.
      </p>
      <p />
      <p>
        Wähle einen der <b>{tags} Tags</b> aus, suche nach einem von
        <b>{products} Bluebrixx Produkten</b> oder wähle einen Verfügbarkeit Status.<br />
      </p>
      <p>
        Außerdem gibt es noch einen Status-Verlauf pro Produkt in der Detailansicht.<br />
        Obendrauf sind noch die passenden Anleitungen verfügbar (Zum herunterladen müsst ihr aber bei Bluebrixx registriert
        und eingeloggt sein.)<br />
        Als Special gibts noch {IDS_SPECIAL_TAGS.length} Filter/Tags mit besonderen Funktionen. Tip: siehe Grüne Badge Zahl.<br
        />
      </p>
      <p>
        Viel Spaß damit und Feedback bitte via <a href="//www.facebook.com/bbxwatcher">Facebook</a> oder
        <a href="mailto:kontakt@bbx.watch">E-Mail</a>
      </p>
    </div>
  </div>
</Toggle>

<style lang="scss">
  @import '../scss/variables';
  .fb-like {
    display: inline-block;
    height: 30px;
    width: 170px;
  }

  .warning {
    font-size: ms(-1);
    display: block;
    color: $color-white;
    background: $color-warning;
    border-radius: $space-md;
    padding: $space-md $space-lg;
  }
</style>
