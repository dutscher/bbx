<script lang="ts">
    import { ApolloClient, InMemoryCache } from "@apollo/client";
    import { setClient } from "svelte-apollo";
    import Welcome from "./comps/Welcome.svelte";
    import Hearts from "./comps/Hearts.svelte";
    import Changes from "./comps/Changes.svelte";
    import Filter from "./comps/Filter/Filter.svelte";
    import Manhattan from "./comps/Manhattan.svelte";
    import Products from "./comps/Product/Products.svelte";
    import { loadMovieData, storedActiveSelection } from './stores';
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
    <Github/>
    <Welcome/>
    <Hearts/>
    <Changes/>
    <Filter/>
    {#if activeTagIds.includes(ID_MANHATTAN) && activeTagIds.length === 1}
        <Manhattan/>
    {/if}
    <Products/>

    <strong>Legende:</strong><br />
    <Icon modifier="new"/> = Neues Produkt
    <Icon modifier="flame"/> = Beliebtes Produkt (mehr als 2 mal Verfügbar)
    <Icon modifier="heart" svg="true" class="active"/> = "Will Ich haben" Produkt<br />
    <br />
    <strong>Stand:</strong> {lastCursor[0] && lastCursor[0].split('|')[1]}
</main>

<style lang="scss">
  @import './scss/variables';

  :global(body) {
    font-family: $font-family;
    font-size: $base-font-size;
    overflow-y: scroll;
  }

  :global(h1, h2, h3) {
    margin: $space-lg 0;
  }

  :global(h1:hover, h2:hover, h3:hover) {
    background: $color-neutral-25;
  }

  :global(h2 b, h3 b, h4 b, p b) {
    color: $color-primary
  }

  :global(h1.with-toggle, h2.with-toggle) {
    cursor: pointer;
    user-select: none;
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
  }
</style>
