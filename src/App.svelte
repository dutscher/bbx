<script lang="ts">
  import { loadMovieData, loadHistoryData, storedActiveSelection } from './stores';
  import { ID_MANHATTAN, ID_NETHERLAND, ID_MOVIE, ID_BURG_BLAUSTEIN, UNLOADED, LOADED } from './_interfaces';
  import { ApolloClient, InMemoryCache } from '@apollo/client';
  import { setClient } from 'svelte-apollo';
  import Welcome from './comps/Welcome.svelte';
  import Hearts from './comps/Features/Hearts.svelte';
  import Changes from './comps/Product/Changes.svelte';
  import Filter from './comps/Filter/Filter.svelte';
  import Manhattan from './comps/Specials/Manhattan.svelte';
  import Netherland from './comps/Specials/Netherland.svelte';
  import Blaustein from './comps/Specials/Blaustein.svelte';
  import Products from './comps/Product/Products.svelte';
  import Notifications from './comps/Features/Notifications.svelte';
  import Github from './comps/Features/Github.svelte';
  import Darkmode from './comps/Features/Darkmode.svelte';
  import Footer from './comps/Footer.svelte';
  import "beercss";

  const client = new ApolloClient({
    uri: 'https://api.bbx.watch/api/graphql',
    cache: new InMemoryCache(),
  });

  setClient(client);

  let activeTagIds;
  let loadedData;

  loadHistoryData();

  storedActiveSelection.subscribe(store => {
    activeTagIds = store.tags;
    loadedData = store.loadedData;

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
  <Darkmode />
  <Github />
  <Welcome />
  {#if loadedData.history === LOADED}
    <Hearts />
    <Changes />
    <Filter />
    {#if activeTagIds.includes(ID_MANHATTAN) && activeTagIds.length === 1}
      <Manhattan />
    {/if}
    {#if activeTagIds.includes(ID_NETHERLAND) && activeTagIds.length === 1}
      <Netherland />
    {/if}
    {#if activeTagIds.includes(ID_BURG_BLAUSTEIN) && activeTagIds.length === 1}
      <Blaustein />
    {/if}
    <Products />
  {/if}

  <Footer />
</main>

<style lang="scss">
  @import './scss/variables';

  main {
    @media (min-width: 1024px) {
      width: 65vw;
    }

    padding: 0 $space-lg 300px $space-lg;
    margin: 0 auto;
  }

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
    margin: 0;
    // chrome blue touch highlight
    -webkit-tap-highlight-color: transparent;
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

  :global([data-theme='dark'] h2 b, [data-theme='dark'] h3 b, [data-theme='dark'] h4 b, [data-theme='dark']
      p
      b, [data-theme='dark'] p a) {
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

  :global(h4.tag-name) {
    transform: rotate(-90deg);
    width: 20px;

    @media (min-width: 400px) {
      transform: rotate(0);
      width: 60px;
    }
  }
</style>
