<script lang="ts">
  import { storedTags, storedProducts, internetConnection, storedActiveSelection } from '../../stores';
  import { IDS_SPECIAL_TAGS } from '../../_interfaces';
  import { jsVoid } from '../../utils';

  let tags: number = 0;
  let products: number = 0;
  let isOnline = false;
  let lastCursor;

  internetConnection.subscribe(store => (isOnline = store.isOnline));
  storedTags.subscribe(store => (tags = store.length));
  storedProducts.subscribe(store => (products = store.length));
  storedActiveSelection.subscribe(store => (lastCursor = store.lastCursor));

  const open = (page, showTags = false) => {
    storedActiveSelection.update(store => {
      store.page = page;
      if (showTags) {
        store.reason = 'show-tags';
      }
      return store;
    });
  };
</script>

<div>
  <h1>Bluebrixx Watcher</h1>
  <div
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
        <b>Letzter Stand:</b>
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
        Wähle einen der <a class="link bold" href={jsVoid} on:click={() => open('products', true)}>{tags} Tags</a> aus,
        suche nach einem von
        <a class="link bold" href={jsVoid} on:click={() => open('products')}>{products} Bluebrixx Produkten</a> oder
        wähle einen Verfügbarkeit Status.<br />
      </p>
      <p>
        Außerdem gibt es noch einen Status-Verlauf pro Produkt in der Detailansicht.<br />
        Obendrauf sind noch die passenden Anleitungen verfügbar (Zum herunterladen müsst ihr aber bei Bluebrixx registriert
        und eingeloggt sein.)<br />
        Als Special gibts noch {IDS_SPECIAL_TAGS.length} Filter/Tags mit besonderen Funktionen. Tip: siehe Grüne Badge Zahl.<br
        />
      </p>
      <p>
        Viel Spaß damit und Feedback bitte via <a href="//www.facebook.com/bbxwatcher" class="link">Facebook</a> oder
        <a href="mailto:kontakt@bbx.watch" class="link">E-Mail</a>
      </p>
    </div>
  </div>
</div>

<style lang="scss">
  @import '../../scss/variables';

  .fb-like {
    display: inline-block;
    height: 30px;
    width: 170px;

    :global iframe {
      width: 170px !important;
    }
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
