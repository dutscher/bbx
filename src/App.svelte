<script lang="ts">
  import 'beercss';
  import { ApolloClient, InMemoryCache } from '@apollo/client';
  import { setClient } from 'svelte-apollo';
  import { jsVoid } from './utils';
  import { loadMovieData, loadHistoryData, storedActiveSelection, storedHearts, localStore } from './stores';
  import { ID_MANHATTAN, ID_NETHERLAND, ID_MOVIE, ID_BURG_BLAUSTEIN, UNLOADED, LOADED } from './_interfaces';
  import Welcome from './comps/Home/Welcome.svelte';
  import Support from './comps/Home/Support.svelte';
  import News from './comps/Home/News.svelte';
  import Changelog from './comps/Home/Changelog.svelte';
  import Imprint from './comps/Home/Imprint.svelte';
  import Hearts from './comps/Features/Hearts.svelte';
  import Changes from './comps/Product/Changes.svelte';
  import History from './comps/Product/History.svelte';
  import Filter from './comps/Filter/Filter.svelte';
  import Manhattan from './comps/Specials/Manhattan.svelte';
  import Netherland from './comps/Specials/Netherland.svelte';
  import Blaustein from './comps/Specials/Blaustein.svelte';
  import Products from './comps/Product/Products.svelte';
  import Notifications from './comps/Features/Notifications.svelte';
  import Github from './comps/Features/Github.svelte';
  import Darkmode from './comps/Features/Darkmode.svelte';
  import Legend from './comps/Legend.svelte';
  import Page from './comps/Page.svelte';

  let activeTagIds;
  let loadedData;
  let hearts;
  const pages = [
    { short: 'welcome', icon: 'home', title: 'Home' },
    { short: 'hearts', icon: 'favorite', title: 'Merkliste' },
    { short: 'products', icon: 'category', title: 'Produkte' },
    { short: 'changes', icon: 'star_rate', title: 'Status' },
    { short: 'history', icon: 'schedule', title: 'Aktuelles' },
  ];
  const lsKey = 'pageSettings';
  const defaultPage = localStore.getRaw(lsKey) || 'welcome';
  let nextPage;

  storedActiveSelection.subscribe(store => {
    activeTagIds = store.tags;
    loadedData = store.loadedData;

    if (!!store.page) {
      nextPage = store.page;
    }

    // load movie data
    if (store.loadedData.movie === UNLOADED && activeTagIds.includes(ID_MOVIE)) {
      loadMovieData();
    }
  });
  storedHearts.subscribe(store => (hearts = store));

  const client = new ApolloClient({
    uri: 'https://api.bbx.watch/api/graphql',
    cache: new InMemoryCache(),
  });
  setClient(client);

  loadHistoryData();

  const isActive = page => (page === activePage ? 'active' : '');

  const clickTab = page => {
    nextPage = page;
    localStore.set(lsKey, page);
  };

  $: activePage = nextPage || defaultPage;
</script>

<main>
  <nav class="menu top" data-avite={activePage}>
    {#each pages as page}
      <a class={isActive(page.short, activePage)} href={jsVoid} on:click={() => clickTab(page.short)}>
        {#if page.icon === 'home'}
          <img src="./images/logo.png" alt="Logo" />
        {:else}
          <i>{page.icon}</i>
        {/if}
        {page.title}
      </a>
    {/each}
  </nav>
  <Github />

  <Notifications />
  <!--
        <div class="notice">
            🚨 Bei uns gibts es die <a href="/?tags=burg-blaustein">Burg Blaustein Anleitungen</a> 🚨
        </div>
  -->
  <Darkmode />

  {#if loadedData.history === LOADED}
    <Page name="welcome" {activePage} {isActive}>
      <Welcome />
      <Support />
      <News />
      <Changelog />
      <Imprint />
    </Page>
    <Page name="hearts" {activePage} {isActive}>
      {#each Object.keys(hearts) as list}
        <Hearts {list} />
      {/each}
    </Page>
    <Page name="products" {activePage} {isActive}>
      <Filter />
      {#if activeTagIds.includes(ID_MANHATTAN) && activeTagIds.length === 1}
        <br />
        <Manhattan />
      {/if}
      {#if activeTagIds.includes(ID_NETHERLAND) && activeTagIds.length === 1}
        <br />
        <Netherland />
      {/if}
      {#if activeTagIds.includes(ID_BURG_BLAUSTEIN) && activeTagIds.length === 1}
        <br />
        <Blaustein />
      {/if}
      <Products />
      <Legend />
    </Page>
    <Page name="changes" {activePage} {isActive}>
      <Changes />
    </Page>
    <Page name="history" {activePage} {isActive}>
      <History />
    </Page>
  {/if}
</main>

<style lang="scss">
  @import './scss/variables';
  // https://fonts.google.com/icons
  @import url('https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Outlined&display=swap');

  :global html,
  :global body,
  main {
    height: 100%;
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

  :global .page:not(.active) {
    display: none;
  }

  .small {
    font-size: ms(-2);
  }

  :global body {
    font-family: $font-family;
    font-size: $base-font-size;
    overflow-y: scroll;
    margin: 0;
    // chrome blue touch highlight
    -webkit-tap-highlight-color: transparent;

    // Override beer.css root variables
    --primary: rgb(76, 117, 180);

    &.is-dark {
      --primary: rgb(189, 215, 255);
    }
  }

  // Override beer.css
  :global .container {
    overflow-x: inherit !important;
  }

  :global(h1) {
    font-size: 50rem !important;
  }
  :global(h2) {
    font-size: 30rem !important;
  }
  :global(h3) {
    font-size: 20rem !important;
  }
  :global(h4) {
    font-size: 15rem !important;
  }
  :global(h1, h2, h3) {
    margin: $space-lg 0;
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

  :global(.flex--gap) {
    gap: $space-lg;
  }

  :global(.flex--vertical-center) {
    align-items: center;
  }

  :global(.flex--block) {
    width: 100%;
  }
</style>
