<script lang="ts">
  import { internetConnection, storedGlobalData, storedProductMedia } from '@stores';
  import { ess, stopClick } from '@utils';
  import { AFF_LINK } from '@interfaces';
  import ProductHearts from './ProductHearts.svelte';

  export let product: any;

  let isOnline: boolean = false;
  let productMedia: any;
  let globalData: any;

  internetConnection.subscribe(store => (isOnline = store.isOnline));
  storedProductMedia.subscribe(store => (productMedia = store));
  storedGlobalData.subscribe(store => (globalData = store));

  const setIndex = (index, e?) => {
    stopClick(e);
    storedProductMedia.update(store => {
      store.videoVisible = false;
      store.imageLoaded = false;
      store.imageIndex = index;
      store.imageSrc = product.images[store.imageIndex];
      store.reason = 'set-index-' + store.imageIndex;
      return store;
    });
  };

  const goBack = e => {
    stopClick(e);
    if (productMedia.imageIndex > 0) {
      setIndex(productMedia.imageIndex - 1);
    }
  };

  const goFurther = e => {
    stopClick(e);
    if (productMedia.imageIndex < product.images.length - 1) {
      setIndex(productMedia.imageIndex + 1);
    }
  };

  const showVideo = e => {
    stopClick(e);
    storedProductMedia.update(store => {
      store.imageLoaded = true;
      store.videoVisible = !store.videoVisible;
      store.reason = 'show-video';
      return store;
    });
  };

  $: {
    if (productMedia.id !== product.id && product.images) {
      storedProductMedia.update(store => {
        store.id = product.id;
        store.videoVisible = false;
        store.imageLoaded = false;
        store.imageIndex = 0;
        store.imageSrc = product.images[store.imageIndex];
        store.reason = 'new-media-' + store.imageIndex;
        return store;
      });
    }
  }
</script>

<div class="navi flex flex--center front small-margin small-text bold">
  <ProductHearts {product} />

  {#if isOnline && product.images}
    {#if product.images.length > 1}
      <span on:click={goBack}>
        <i class={ess((productMedia.imageIndex === 0 || productMedia.videoVisible) && 'disable')}>arrow_back_ios</i>
        {#if !productMedia.videoVisible}
          <div class="tooltip bottom small-margin">Vorheriges Bild</div>
        {/if}
      </span>

      {#each product.images as image, i}
        <span on:click={e => setIndex(i, e)}>
          <i class={ess(i === productMedia.imageIndex && !productMedia.videoVisible && 'active')}>
            fiber_manual_record
          </i>
        </span>
      {/each}
    {/if}

    {#if product.video}
      <span on:click={showVideo}>
        <i class={ess(productMedia.videoVisible && 'active')}>{productMedia.videoVisible ? 'cancel' : 'play_circle'}</i>
        <div class="tooltip bottom small-margin">
          Youtube Video {productMedia.videoVisible ? 'schließen' : 'öffnen'}
        </div>
      </span>
    {/if}

    {#if product.images.length > 1}
      <span on:click={goFurther}>
        <i
          class={ess((productMedia.imageIndex === product.images.length - 1 || productMedia.videoVisible) && 'disable')}
        >
          arrow_forward_ios
        </i>
        {#if !productMedia.videoVisible}
          <div class="tooltip bottom small-margin">Nächstes Bild</div>
        {/if}
      </span>
    {/if}
  {/if}

  <a href={globalData.url + product.href + AFF_LINK} target="_blank">
    <i>shopping_cart</i>
    <div class="tooltip bottom small-margin">Zum Shop{!!AFF_LINK ? '*' : ''}</div>
  </a>
</div>

<style lang="scss">
  i {
    color: var(--on-surface-variant);
    cursor: pointer;
    width: auto;

    &.active,
    &:hover,
    &:active {
      color: var(--primary);
    }

    &.disable {
      opacity: 0.2;
      pointer-events: none;
      cursor: default;
    }
  }
</style>
