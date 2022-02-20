<script lang="ts">
  import { onMount } from 'svelte';
  import Changelog from '../../public/CHANGELOG.md';
  import Toggle from './Toggle.svelte';
  import Imprint from './Imprint.svelte';
  // app
  import { storedTags, storedProducts, internetConnection, storedActiveSelection } from '../stores';
  import { IDS_SPECIAL_TAGS } from '../_interfaces';

  let changelogUL;
  let tags: number = 0;
  let products: number = 0;
  let isVisible = false;
  let isOnline = false;
  let lastCursor;
  let kofi;

  internetConnection.subscribe(store => (isOnline = store.isOnline));
  storedTags.subscribe(store => (tags = store.length));
  storedProducts.subscribe(store => (products = store.length));
  storedActiveSelection.subscribe(store => (lastCursor = store.lastCursor));

  onMount(() => {
    kofiwidget2.init('Kaffeekasse', '#4c75b4', 'P5P48YJNR');
    kofi = kofiwidget2.getHTML();
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

    <Imprint />

    <Toggle title="Support & Partner" open>
      <div class="flex flex--wrap flex--vertical-center flex--gap">
        {@html kofi}

        <!--
            Paypal Kaffeekasse
            <form action="https://www.paypal.com/donate" method="post" target="_top">
                <input type="hidden" name="hosted_button_id" value="SKL792JENYRM2" />
                <input type="image" src="https://www.paypalobjects.com/de_DE/DE/i/btn/btn_donate_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Spenden mit dem PayPal-Button" />
                <img alt="" border="0" src="https://www.paypal.com/de_DE/i/scr/pixel.gif" width="1" height="1" />
            </form>
            -->

        <a href="//www.noppensteinnews.de/" target="_blank" title="Partner: Noppensteinnews">
          <img src="/images/partner/noppensteinnews.png" alt="Noppensteinnews" width="150" />
        </a>
      </div>
    </Toggle>

    <Toggle title="News (2)" onVisibility={newVisibility => (isVisible = newVisibility)}>
      {#if isVisible}
        <div class="news">
          <a
            href="//www.noppensteinnews.de/2022/01/30/klemmbaustein-podcast-bluebrixx-watcher/"
            target="_blank"
            class="with-text-shadow"
          >
            Noppensteinnews: Klemmbaustein Podcast Bluebrixx Watcher
          </a>
          <iframe
            class="iframe--podcast"
            frameborder="0"
            title="Noppensteinnews: Klemmbaustein Podcast Bluebrixx Watcher"
            src="https://www.podcaster.de/webplayer/?id=show~eu4w2y~klemmbaustein-podcast-noppensteinnews~pod-17eb3227cb56870a92bfc2763&v=1645344640"
          />

          <a href="//www.youtube.com/watch?v=jgKitU73Zhk" target="_blank" class="with-text-shadow">
            Youtube: Count of Bricks - Der BlueBrixx Watcher - Eine Webseite für Verfügbarkeiten - Was kann der
            "Watcher"?
          </a>
          <div class="iframe--youtube">
            <iframe
              frameborder="0"
              title="Youtube: Count of Bricks - Der BlueBrixx Watcher - Eine Webseite für Verfügbarkeiten - Was kann der
              Watcher?"
              src="https://www.youtube.com/embed/jgKitU73Zhk"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            />
          </div>
        </div>
      {/if}
    </Toggle>

    <Toggle title="Changelog">
      <div class="changelog">
        <Changelog />
        <a href="https://github.com/dutscher/bbx/blob/master/CHANGELOG.md" class="with-text-shadow" target="_blank">
          Die komplette Übersicht gibts hier >
        </a>
      </div>
    </Toggle>
  </div>
</Toggle>

<style lang="scss">
  @import '../scss/variables';

  .fb-like {
    display: inline-block;
    height: 30px;
    width: 170px;

    :global iframe {
      width: 170px;
    }
  }

  .news {
    a {
      color: $color-primary;
    }
  }

  .iframe--youtube {
    padding: $space-xl * 3;

    iframe {
      width: 100%;

      @media (min-width: 470px) {
        height: 380px;
      }
    }
  }

  .iframe--podcast {
    width: 100%;
    height: 450px;

    @media (min-width: 470px) {
      height: 380px;
    }

    @media (min-width: 720px) {
      height: 240px;
    }

    @media (min-width: 1024px) {
      height: 360px;
    }

    @media (min-width: 1060px) {
      height: 240px;
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

  .changelog {
    :global a,
    :global p {
      color: $color-primary;
    }
  }
</style>
