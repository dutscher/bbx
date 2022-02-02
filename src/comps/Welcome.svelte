<script lang="ts">
    import { onMount } from 'svelte';
    import Icon from "./Icon.svelte";
    import Advert from "./Advert.svelte";
    import Imprint from "./Imprint.svelte";
    // app
    import {
        storedTags,
        storedProducts,
        localStore, internetConnection, storedActiveSelection
    } from '../stores';
    import { IDS_SPECIAL_TAGS, lsKeyWelcome } from "../_interfaces";

    let tags: number = 0;
    let products: number = 0;
    let isVisible = true;
    let isOnline = false;
    let lastCursor;
    let kofi;

    internetConnection.subscribe(store => isOnline = store.isOnline);
    storedTags.subscribe(store => tags = store.length);
    storedProducts.subscribe(store => products = store.length);
    storedActiveSelection.subscribe(store => lastCursor = store.lastCursor);

    const onClick = () => {
        isVisible = !isVisible;
        localStore.set(lsKeyWelcome, isVisible);
    }

    onMount(() => {
        const lsValue = localStore.get(lsKeyWelcome);
        if (!lsValue) {
            isVisible = lsValue;
        }

        kofiwidget2.init('Kaffeekasse', '#4c75b4', 'P5P48YJNR');
        kofi = kofiwidget2.getHTML();
    })
</script>

<h1 class="with-toggle with-text-shadow" on:click={onClick}>
    <Icon modifier="arrow {!isVisible ? 'down' : 'up'}" svg/>
    Bluebrixx Watcher

    <div class="fb-like" data-href="https://www.facebook.com/bbxwatcher" data-width="170px" data-layout="button_count"
         data-action="like" data-size="small" data-share="true"></div>
</h1>
{#if !isOnline}
    <span class="warning">
        Deine Internet Verbindung ist weg aber du kannst den Watcher weiterhin nutzen.<br/>
        <strong>Letzter Stand:</strong> {lastCursor[0] && lastCursor[0].split('|')[1]}
    </span>
{/if}
<div class="welcome{isVisible ? ' show' : ''}">
    <div class="welcome__content">
        <p>
            Dies ist ein Kompakter Bluebrixx only Produkte Katalog.<br/>
            Aufgrund des vielen klickens und langen Ladezeiten im BB eigenen Online-Shop, haben wir das hier entwickelt.
            <b>Wir sind nicht Bluebrixx</b>.
        <p>
        <p>
            Wähle einen der <b>{tags} Tags</b> aus, suche nach einem von
            <b>{products} Bluebrixx Produkten</b> oder
            wähle einen Verfügbarkeit Status.<br/>
        <p>
            Außerdem gibt es noch einen Status-Verlauf pro Produkt in der Detailansicht.<br/>
            Obendrauf sind noch die passenden Anleitungen verfügbar (Zum herunterladen müsst ihr aber bei Bluebrixx registriert und eingeloggt sein.)<br/>
            Als Special gibts noch {IDS_SPECIAL_TAGS.length} Filter/Tags mit besonderen Funktionen. Tip: siehe Grüne Badge Zahl.<br/>
        </p>
        <p>
            Viel Spaß damit und Feedback bitte via <a href="//www.facebook.com/bbxwatcher">Facebook</a> oder <a href="mailto:kontakt@bbx.watch">E-Mail</a>
        </p>
    </div>
    <div class="welcome__other">
        <Advert title="Support">
            {@html kofi}

            <a href="//www.noppensteinnews.de/" target="_blank" title="Partner: Noppensteinnews"><img src="/images/partner/noppensteinnews.png" alt="Noppensteinnews" width="150" /></a>

            <p>
                <a href="//www.youtube.com/watch?v=jgKitU73Zhk" target="_blank">Youtube: Count of Bricks - Der BlueBrixx Watcher - Eine Webseite für Verfügbarkeiten - Was kann der "Watcher"?</a><br /><br />
                <a href="//www.noppensteinnews.de/2022/01/30/klemmbaustein-podcast-bluebrixx-watcher/" target="_blank">Noppensteinnews: Klemmbaustein Podcast Bluebrixx Watcher</a><br />
            </p>
            <!--
            Paypal Kaffeekasse
            <form action="https://www.paypal.com/donate" method="post" target="_top">
                <input type="hidden" name="hosted_button_id" value="SKL792JENYRM2" />
                <input type="image" src="https://www.paypalobjects.com/de_DE/DE/i/btn/btn_donate_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Spenden mit dem PayPal-Button" />
                <img alt="" border="0" src="https://www.paypal.com/de_DE/i/scr/pixel.gif" width="1" height="1" />
            </form>
            -->
        </Advert>
        <Imprint/>
    </div>
</div>

<style lang="scss">
  @import '../scss/variables';

  h1 {
    color: $color-primary;

    .fb-like {
      display: inline-block;
      height: 30px;
      width: 170px;
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

  .welcome {
    display: none;

    &.show {
      display: block;
    }
  }
</style>
