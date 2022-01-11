<script lang="ts">
    import { onMount } from 'svelte';
    import Icon from "./Icon.svelte";
    import Imprint from "./Imprint.svelte";
    // app
    import {
        storedTags,
        storedProducts,
        localStore, internetConnection, storedActiveSelection
    } from '../stores';
    import { lsKeyWelcome } from "../_interfaces";

    let tags: number = 0;
    let products: number = 0;
    let isVisible = true;
    let isOnline = false;
    let lastCursor;

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
    })
</script>

<h1 class="with-toggle with-text-shadow" on:click={onClick}>
    <Icon modifier="arrow {!isVisible ? 'down' : 'up'}" svg/>
    BBX Watcher

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
            wähle einen Verfügbarkeit Status.
        </p>
        <p>
            Außerdem gibt es noch einen Status-Verlauf pro Produkt in der Detailansicht.<br/>
            Obendrauf noch die passenden Anleitungen verfügbar (Zum herunterladen müsst ihr aber bei BB eingeloggt sein)<br/>
        </p>
        <p>
            Aber Obacht: es gibt noch 4 Eastereggs, Könnt Ihr sie finden?<br/><br/>
            Viel Spaß damit und Feedback bitte via Facebook oder E-Mail
        </p>
    </div>
    <div class="welcome__other">
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
