<script lang="ts">
  import 'beercss';
  import { ApolloClient, InMemoryCache } from '@apollo/client';
  import { setClient } from 'svelte-apollo';
  import * as animateScroll from 'svelte-scrollto';
  import { jsVoid, sites, setUrlParams } from '@utils';
  import { loadMovieData, loadHistoryData, storedActiveSelection, localStore } from '@stores';
  import { ID_MOVIE, UNLOADED, LOADED, lsSiteSettingsKey } from '@interfaces';
  import Welcome from './comps/Home/Welcome.svelte';
  import Support from './comps/Home/Support.svelte';
  import News from './comps/Home/News.svelte';
  import Changelog from './comps/Home/Changelog.svelte';
  import Imprint from './comps/Home/Imprint.svelte';
  import Offline from './comps/Features/Offline.svelte';
  import Changes from './comps/Changes/Changes.svelte';
  import History from './comps/History/History.svelte';
  import Filter from './comps/Filter/Filter.svelte';
  import Products from './comps/Product/Products.svelte';
  import Notifications from './comps/Features/Notifications.svelte';
  import Github from './comps/Features/Github.svelte';
  import Search from './comps/Features/Search.svelte';
  import Share from './comps/Features/Share.svelte';
  import Darkmode from './comps/Features/Darkmode.svelte';
  import Legend from './comps/Legend.svelte';
  import Site from './comps/Site.svelte';
  import HeartlistWrap from './comps/Features/Heartlist/HeartlistWrap.svelte';

  // https://www.npmjs.com/package/svelte-scrollto
  animateScroll.setGlobalOptions({
    // header height
    offset: 100,
  });

  let activeSite: any;
  let activeTagIds: any;
  let loadedData: any;

  const defaultSite = localStore.getRaw(lsSiteSettingsKey) || 'home';
  let nextSite: any;

  storedActiveSelection.subscribe(store => {
    activeTagIds = store.tags;
    loadedData = store.loadedData;

    if (!!store.site) {
      nextSite = store.site;
      setUrlParams('site', store.site, true);
      localStore.set(lsSiteSettingsKey, store.site);
    }

    // load movie data
    if (store.loadedData.movie === UNLOADED && activeTagIds.includes(ID_MOVIE)) {
      loadMovieData();
    }
  });

  const client = new ApolloClient({
    uri: 'https://api.bbx.watch/api/graphql',
    cache: new InMemoryCache(),
  });
  setClient(client);

  loadHistoryData();

  const isActive = site => (site === activeSite ? 'active' : '');

  const clickTab = site => {
    storedActiveSelection.update(store => {
      store.site = site;
      store.reason = 'click-navigation';
      return store;
    });
  };

  $: activeSite = nextSite || defaultSite;
</script>

<main>
  <nav class="menu top" data-active={activeSite}>
    {#each sites as site}
      <a class={isActive(site.short, activeSite)} href={jsVoid} on:click={() => clickTab(site.short)}>
        {#if site.icon === 'home'}
          <img class="logo" src="./images/logo.png" alt="Logo" />
        {:else}
          <i>{site.icon}</i>
        {/if}
        {site.title}
      </a>
    {/each}
  </nav>

  <Offline />
  <Github />
  <Notifications />
  <Search />
  <Share />
  <Darkmode />

  {#if loadedData.history === LOADED}
    <Site name="home" {activeSite} {isActive}>
      <Welcome />
      <Support />
      <News />
      <Changelog />
      <Imprint />
    </Site>
    <Site name="hearts" {activeSite} {isActive}>
      <HeartlistWrap />
      <Legend />
    </Site>
    <Site name="products" {activeSite} {isActive}>
      <Filter />
      <Products />
      <Legend />
    </Site>
    <Site name="changes" {activeSite} {isActive}>
      <Changes />
      <Legend />
    </Site>
    <Site name="history" {activeSite} {isActive}>
      <History />
      <Legend />
    </Site>
  {/if}
</main>

<style lang="scss">
  // https://www.beercss.com/
  // https://github.com/beercss/beercss/blob/main/docs/INDEX.md
  // https://fonts.google.com/icons
  @import url('https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Outlined&display=swap');

  :global html,
  :global body,
  main {
    height: 100%;
  }

  .menu {
    user-select: none;
  }

  .logo {
    height: 24rem;
    padding: 4rem;
    margin: 0 12rem 4rem 12rem;
    display: inline-block;
    transition: var(--speed1) padding linear;
    border-radius: 32rem;

    :global .active &,
    &:hover {
      background-color: var(--primary);
      color: var(--on-primary);
      padding: 4rem 16rem;
    }
  }

  :global .page:not(.active) {
    display: none;
  }

  .small {
    font-size: 8rem;
  }

  :global body {
    font-size: 16px;
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
    gap: 4rem;
  }

  :global(.flex--middle) {
    align-items: center;
  }

  :global(.flex--center) {
    justify-content: center;
  }

  :global(.flex--top) {
    align-content: flex-start;
  }

  :global(.flex--right) {
    justify-content: flex-end;
  }

  :global(.flex--block) {
    width: 100%;
  }

  :global(.flex--column) {
    flex-direction: column;
  }
</style>
