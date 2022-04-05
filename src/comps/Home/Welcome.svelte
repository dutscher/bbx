<script lang="ts">
  import { storedTags, storedProducts, storedActiveSelection } from '@stores';
  import { IDS_SPECIAL_TAGS } from '@interfaces';
  import { jsVoid } from '@utils';

  let tags: number = 0;
  let products: number = 0;

  storedTags.subscribe(store => (tags = store.length));
  storedProducts.subscribe(store => (products = store.length));

  const open = (site, type) => {
    storedActiveSelection.update(store => {
      store.site = site;
      if (!!type) {
        store.reason = `show-${type}`;
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
    <div class="welcome">
      <p>
        Willkommen im neuen Bluebrixx Watcher<br />
        Hier findest du ausschließlich Bluebrixx eigene Produkte.<br />
        Dies ist ein Hobby Projekt, welches einwenig ausgeartet ist :)<br />
        <b>Wir sind nicht Bluebrixx</b>.
      </p>
      <p>
        Wähle einen der <a class="link bold" href={jsVoid} on:click={() => open('products', 'tags')}>{tags} Tags</a>,
        durchstöber die
        <a class="link bold" href={jsVoid} on:click={() => open('products')}>{products} Produkte</a> oder nutze einfach
        einen <a class="link bold" href={jsVoid} on:click={() => open('products', 'states')}>Status</a>.<br />
      </p>
      <p>
        Außerdem gibt es noch einen Status-Verlauf pro Produkt in der Detailansicht.<br />
        Obendrauf sind noch die passenden Anleitungen verfügbar (Zum herunterladen müsst ihr aber bei Bluebrixx registriert
        und eingeloggt sein.)<br />
        Als Special gibts noch {IDS_SPECIAL_TAGS.length} Filter/Tags mit besonderen Funktionen.<br />
      </p>
      <p>
        Viel Spaß damit<br />
        Bei Fragen, Anregungen, Probleme oder Wünsche gerne via
        <a href="//www.facebook.com/bbxwatcher" class="link">Facebook</a>
        oder
        <a href="mailto:kontakt@bbx.watch" class="link">E-Mail</a>
      </p>
    </div>
  </div>
</div>

<style lang="scss">
  .fb-like {
    display: inline-block;
    height: 30rem;
    width: 170rem;

    :global iframe {
      width: 170rem !important;
    }
  }
</style>
