<script lang="ts">
  import { jsVoid, setUrlParams, sites } from '@utils';
  import { localStore, storedActiveSelection } from '@stores';
  import { lsSiteSettingsKey, ID_PARTS } from '@interfaces';

  let activeSite: any;
  const defaultSite = localStore.getRaw(lsSiteSettingsKey) || 'home';
  let nextSite: any;

  storedActiveSelection.subscribe(store => {
    if (!!store.site) {
      nextSite = store.site;
      setUrlParams('site', store.site, true);
      localStore.set(lsSiteSettingsKey, store.site);
    }
  });

  const isActive = site => (site === activeSite ? 'active' : '');

  const clickTab = site => {
    storedActiveSelection.update(store => {
      const prevSite = store.site;
      store.site = site;
      store.reason = 'click-navigation';
      // set brickbar tag
      if (site === 'brickbar') {
        store.tags = [ID_PARTS];
      }
      // clean brickbar tag if navigate through pages
      if (!!prevSite && site === 'products') {
        store.tags = [];
      }
      return store;
    });
  };

  $: activeSite = nextSite || defaultSite;
</script>

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

<style lang="scss">
  .logo {
    height: 24rem;
    padding: 4rem;
    margin: 0 12rem 4rem 12rem;
    display: inline-block;
    transition: var(--speed1) padding linear;

    .active &,
    &:hover {
      background-color: var(--primary);
      color: var(--on-primary);
      padding: 4rem 16rem;
      border-radius: 32rem;
    }
  }
</style>
