<script lang="ts">
    import { onMount } from 'svelte';
    import Icon from "./Icon.svelte";
    import Imprint from "./Imprint.svelte";
    // app
    import {
        storedTags,
        storedProducts,
        localStore
    } from '../stores';
    import { lsKeyWelcome } from "../_interfaces";

    let tags: number = 0;
    let products: number = 0;
    let isVisible = true;

    storedTags.subscribe(store => tags = store.length);
    storedProducts.subscribe(store => products = store.length);

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
<div class="welcome{isVisible ? ' show' : ''}">
    <div class="welcome__content">
        <p>
            Dies ist ein von der Community gebauter Kompakter Bluebrixx only Produkte Katalog.<br/>
            Aufgrund des vielen klickens und langer Ladezeiten im BB eigenen Online-Shop haben wir das hier entwickelt.
            <b>Wir sind nicht Bluebrixx</b>.
        <p>
            Wähle einen der <b>{tags} Tags</b> (Jedes hat einen Deeplink in der URL) aus, suche nach einem von
            <b>{products} Bluebrixx Produkten</b> oder
            wähle einen Verfügbarkeit Status, außerdem gibt es noch einen Status-Verlauf in der Detailansicht.<br/>
            Zu jedem Produkt gibts noch die passende Anleitung (Zum herrunterladen müsst ihr aber bei BB eingeloggt
            sein)<br/>
            Aber Obacht: es gibt noch 3 Überraschungen ;)<br/>
            Viel Spaß
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

  .welcome {
    display: none;

    &.show {
      display: block;
    }
  }
</style>
