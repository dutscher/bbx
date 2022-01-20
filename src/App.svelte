<script lang="ts">
    import { ApolloClient, InMemoryCache } from "@apollo/client";
    import { setClient } from "svelte-apollo";
    import Welcome from "./comps/Welcome.svelte";
    import Hearts from "./comps/Hearts.svelte";
    import Changes from "./comps/Changes.svelte";
    import Filter from "./comps/Filter/Filter.svelte";
    import Manhattan from "./comps/Manhattan.svelte";
    import Netherland from "./comps/Netherland.svelte";
    import Blaustein from "./comps/Blaustein.svelte";
    import Products from "./comps/Product/Products.svelte";
    import { loadMovieData, storedActiveSelection } from './stores';
    import { ID_MANHATTAN, ID_NETHERLAND, ID_MOVIE, ID_BURG_BLAUSTEIN, UNLOADED, AFF_LINK } from "./_interfaces";
    import Icon from "./comps/Icon.svelte";
    import Notifications from "./comps/Notifications.svelte";
    import Github from "./comps/Github.svelte";
    import Darkmode from "./comps/Darkmode.svelte";

    const client = new ApolloClient({
        uri: 'https://api.bbx.watch/api/graphql',
        cache: new InMemoryCache(),
    });

    setClient(client);

    let activeTagIds;
    let lastCursor;

    storedActiveSelection.subscribe(store => {
        activeTagIds = store.tags || [];
        lastCursor = store.lastCursor || [];

        // load movie data
        if (store.loadedData.movie === UNLOADED && activeTagIds.includes(ID_MOVIE)) {
            loadMovieData();
        }
    });
</script>

<main>
    <!--    <Notifications />-->
    <!--
        <div class="notice">
            🚨 Bei uns gibts es die <a href="/?tags=burg-blaustein">Burg Blaustein Anleitungen</a> 🚨
        </div>
    -->

    <Darkmode/>
    <Github/>
    <Welcome/>
    <Hearts/>
    <Changes/>
    <Filter/>
    {#if activeTagIds.includes(ID_MANHATTAN) && activeTagIds.length === 1}
        <Manhattan/>
    {/if}
    {#if activeTagIds.includes(ID_NETHERLAND) && activeTagIds.length === 1}
        <Netherland/>
    {/if}
    {#if activeTagIds.includes(ID_BURG_BLAUSTEIN) && activeTagIds.length === 1}
        <Blaustein/>
    {/if}
    <Products/>

    <div class="footer">
        <strong>Legende:</strong><br/>
        <Icon modifier="new"/>
        = Neues Produkt
        <Icon modifier="flame"/>
        = Beliebtes Produkt (mehr als 2 mal Verfügbar)
        <Icon modifier="heart" svg="true" class="active"/>
        = "Will Ich haben" Produkt<br/>
        <span class="state state--blue"></span> = Verfügbar
        <span class="state state--green"></span> = Bald erhältlich
        <span class="state state--red"></span> = Zurzeit Vergriffen
        <span class="state state--orange"></span> = In Ankündigung
        <br/><br/>
        <strong>Stand:</strong> {lastCursor[0] && lastCursor[0].split('|')[1]}
        {#if !!AFF_LINK}
        <span class="small">
            * Die ausgehenden Produktlinks sind Affiliate-Links. Wenn Ihr klickt und kauft, dann unterstütz Ihr dieses Projekt. Vielen Dank :)
        </span>
        {/if}
    </div>
</main>

<style lang="scss">
  @import './scss/variables';

  .notice {
    font-weight: bold;
    padding: $space-lg;
    border-radius: $space-lg;
    background: $color-white;
    color: $color-primary;

    a {
      color: $color-primary-darker;
    }
  }

  .small {
    font-size: ms(-2);
  }

  :global(body) {
    font-family: $font-family;
    font-size: $base-font-size;
    overflow-y: scroll;
  }

  // test darkmode https://stackoverflow.com/questions/57606960/how-can-i-emulate-prefers-color-scheme-media-query-in-chrome
  :global([data-theme='dark'] body) {
    background: $color-neutral-200;
    color: $color-white;
  }

  :global([data-theme-ready='true'] body) {
    transition: background 250ms ease-in-out;
  }

  :global(h1, h2, h3) {
    margin: $space-lg 0;
  }

  :global(h2 b, h3 b, h4 b, p b, p a) {
    color: $color-primary;
  }

  :global([data-theme='dark'] h2 b, [data-theme='dark'] h3 b, [data-theme='dark'] h4 b, [data-theme='dark'] p b, [data-theme='dark'] p a) {
    text-shadow: $color-black 1px 1px 2px;
  }

  :global([data-theme='dark'] .with-text-shadow) {
    text-shadow: $color-black 1px 1px 2px;
  }

  :global(.with-toggle) {
    cursor: pointer;
    user-select: none;
    background: $color-neutral-42;
    border-radius: $space-xl;
    padding-left: $space-xl;
  }

  :global([data-theme='dark'] .with-toggle) {
    background: $color-neutral-150;
  }

  :global(.with-toggle:hover) {
    background: $color-neutral-50;
  }

  :global([data-theme='dark'] .with-toggle:hover) {
    background: $color-neutral-100;
  }

  :global(.with-toggle + *) {
    padding-left: $space-xl * 2.5;
    padding-bottom: $space-xl * 2.5;
  }

  :global(.flex) {
    display: flex;
  }

  :global(.flex--wrap) {
    flex-wrap: wrap;
    flex: 1;
  }

  :global(.flex--inline) {
    display: inline-flex;
  }

  :global(.flex--vertical-center) {
    align-items: center;
  }

  :global(.flex--block) {
    width: 100%;
  }

  :global(.flex h4) {
    position: relative;
    margin: 0 $space-sm 0 0;
    padding: 0 $space-md 0 0;
    line-height: 1;
    width: 60px;
    align-self: center;
    text-align: right;
  }

  :global(.filter-headline) {
    font-size: ms(1);
  }

  :global(.flex.bl) {
    position: relative;
  }

  :global(.flex.bl::after) {
    position: absolute;
    content: '';
    left: -$space-sm;
    top: $space-sm;
    bottom: $space-sm;
    border-left: solid 1px $color-primary;
  }

  main {
    @media (min-width: 1024px) {
      width: 65vw;
    }

    padding-bottom: 300px;
    margin: 0 auto;

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
  }
</style>
