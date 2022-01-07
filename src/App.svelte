<script lang="ts">
    import { ApolloClient, InMemoryCache } from "@apollo/client";
    import { setClient } from "svelte-apollo";
    import Welcome from "./comps/Welcome.svelte";
    import Hearts from "./comps/Hearts.svelte";
    import Changes from "./comps/Changes.svelte";
    import Filter from "./comps/Filter/Filter.svelte";
    import Manhattan from "./comps/Manhattan.svelte";
    import Products from "./comps/Product/Products.svelte";
    import { loadMovieData, storedActiveSelection, internetConnection } from './stores';
    import { ID_MANHATTAN, ID_MOVIE, UNLOADED } from "./_interfaces";
    import Icon from "./comps/Icon.svelte";
    import Notifications from "./comps/Notifications.svelte";
    import Github from "./comps/Github.svelte";

    const client = new ApolloClient({
        uri: 'https://api.bbx.watch/api/graphql',
        cache: new InMemoryCache(),
    });

    setClient(client);

    let activeTagIds;
    let lastCursor;
    let isOnline = false;

    internetConnection.subscribe(store => isOnline = store.isOnline);

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
    {#if !isOnline}
        <div class="warning">Deine Internet Verbindung ist weg aber du kannst den Watcher weiterhin nutzen</div>
    {/if}
    <Github/>
    <Welcome/>
    <Hearts/>
    <Changes/>
    <Filter/>
    {#if activeTagIds.includes(ID_MANHATTAN) && activeTagIds.length === 1}
        <Manhattan/>
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
        <br/>
        <strong>Stand:</strong> {lastCursor[0] && lastCursor[0].split('|')[1]}
    </div>
</main>

<style lang="scss">
  @import './scss/variables';

  :global(body) {
    font-family: $font-family;
    font-size: $base-font-size;
    overflow-y: scroll;

    @media (prefers-color-scheme: dark) {
      background: $color-neutral-200;
      color: $color-white;
    }
  }

  :global(h1, h2, h3) {
    margin: $space-lg 0;
  }

  :global(h2 b, h3 b, h4 b, p b, p a) {
    color: $color-primary;

    @media (prefers-color-scheme: dark) {
      text-shadow: $color-black 1px 1px 2px;
    }
  }

  :global(.with-text-shadow) {
    @media (prefers-color-scheme: dark) {
      text-shadow: $color-black 1px 1px 2px;
    }
  }

  :global(.with-toggle) {
    cursor: pointer;
    user-select: none;
    background: $color-neutral-42;
    border-radius: $space-xl;
    padding-left: $space-xl;

    @media (prefers-color-scheme: dark) {
      background: $color-neutral-150;
    }
  }

  :global(.with-toggle:hover) {
    background: $color-neutral-50;

    @media (prefers-color-scheme: dark) {
      background: $color-neutral-100;
    }
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

    padding-bottom: 150px;
    margin: 0 auto;

    .warning {

    }

    .footer {
      padding-top: 50px;
      font-size: ms(-1);
    }
  }
</style>
