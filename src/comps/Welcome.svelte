<script lang="ts">
    import { onMount } from 'svelte';
    import Icon from "./Icon.svelte";
    import Imprint from "./Imprint.svelte";
    // app
    import {
        storedActiveSelection,
        storedTags,
        storedProducts,
        localStore
    } from '../stores';

    let activeTagIds;
    let activePartIds;
    let activeColorIds;
    let activeStateIds;
    let activeSearchString;
    let loadedChanges;
    let tags: number = 0;
    let products: number = 0;
    let isTouched = false;

    storedTags.subscribe(value => tags = value.length);
    storedProducts.subscribe(value => products = value.length);
    storedActiveSelection.subscribe(value => {
        activeTagIds = value.tags || [];
        activePartIds = value.parts || [];
        activeColorIds = value.colors || [];
        activeStateIds = value.states || [];
        activeSearchString = value.search || '';
        loadedChanges = value.loadedData.changes;
    });

    $: isFiltered = !isTouched && (!!activeSearchString
        || activeTagIds.length > 0
        || activeStateIds.length > 0
        || activeColorIds.length > 0
        || activePartIds.length > 0);

    $: isVisible = !isFiltered;

    const onClick = () => {
        isTouched = true;
        isVisible = !isVisible;
        localStore.set('welcomeVisible', isVisible);
    }

    onMount(() => {
        const lsValue = localStore.get('welcomeVisible');
        if (!lsValue) {
            isTouched = true;
            isVisible = lsValue;
        }
    })
</script>

<h1 class="with-toggle" on:click={onClick}>
    <Icon modifier="arrow" class="icon--{!isVisible ? 'down' : 'up'}"/>
    BBX Watcher
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
        <div class="fb-like" data-href="https://www.facebook.com/bbxwatcher" data-width="" data-layout="button_count"
             data-action="like" data-size="small" data-share="true"></div>
    </div>
    <div class="welcome__other">
        <Imprint/>
    </div>
</div>

<style lang="scss">
  @import '../scss/variables';

  h1 {
    color: $color-primary;
  }

  .welcome {
    display: none;

    &.show {
      display: block;
    }

    .fb-like {
      height: 30px;
    }
  }
</style>
