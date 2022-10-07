<script lang="ts">
  import { internetConnection, storedGlobalData, storedProductMedia } from '@stores';
  import { ess, stopClick } from '@utils';
  import { AFF_LINK } from '@interfaces';
  import ProductHearts from './ProductHearts.svelte';

  export let product: any;
  export let noHearts: boolean = false;

  let className = '';
  export { className as class };

  let isOnline: boolean = false;
  let mediaState: any;
  let globalData: any;
  let onStart: boolean = false;
  let onEndShowVideo: boolean = false;
  let onEnd: boolean = false;

  internetConnection.subscribe(store => (isOnline = store.isOnline));
  storedProductMedia.subscribe(store => (mediaState = store));
  storedGlobalData.subscribe(store => (globalData = store));

  const setIndex = (index, e?) => {
    if (e) {
      stopClick(e);
    }

    if (index === mediaState.imageIndex) {
      return false;
    }

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
    // show last image if video is active
    if (mediaState.videoVisible) {
      setIndex(product.images.length - 1);
    } else if (mediaState.imageIndex > 0) {
      setIndex(mediaState.imageIndex - 1);
    }
  };

  const goFurther = e => {
    stopClick(e);
    if (mediaState.imageIndex + 1 < product.images.length) {
      setIndex(mediaState.imageIndex + 1);
      // after last image show video
    } else if (!mediaState.videoVisible && product.video) {
      showVideo(e);
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
    if (mediaState.id !== product.id && product.images) {
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

    if (product.images) {
      onStart = mediaState.imageIndex === 0;
      onEnd = mediaState.imageIndex === product.images.length - 1;
      onEndShowVideo = false;

      if (onEnd && product.video && !mediaState.videoVisible) {
        onEndShowVideo = true;
        onEnd = false;
      }
    }
  }
</script>

<div class={ess('navi flex flex--center front small-margin small-text bold', className)}>
  {#if !noHearts}
    <ProductHearts {product} />
  {/if}

  {#if isOnline && product.images}
    {#if product.images.length > 1}
      {#if product.images.length > 2}
        <span on:click={goBack}>
          <i class={ess(onStart && 'disable')}>arrow_back_ios</i>
          {#if !onStart && !mediaState.videoVisible}
            <div class="tooltip bottom small-margin">Vorheriges Bild</div>
          {/if}
          {#if mediaState.videoVisible}
            <div class="tooltip bottom small-margin">Schließe Video</div>
          {/if}
        </span>
      {/if}

      {#each product.images as image, i}
        <span on:click={e => setIndex(i, e)}>
          <i class={ess(i === mediaState.imageIndex && !mediaState.videoVisible && 'active')}> fiber_manual_record </i>
        </span>
      {/each}
    {/if}

    {#if product.video}
      <span on:click={showVideo} class="video">
        <i class={ess(mediaState.videoVisible && 'active')}>{mediaState.videoVisible ? 'cancel' : 'play_circle'}</i>
        <div class="tooltip bottom small-margin">
          Video {mediaState.videoVisible ? 'schließen' : 'öffnen'}
        </div>
      </span>
    {/if}

    {#if product.images.length > 2}
      <span on:click={goFurther}>
        <i class={ess(onEnd && 'disable')}>arrow_forward_ios</i>
        {#if !onEnd && !onEndShowVideo}
          <div class="tooltip bottom small-margin">Nächstes Bild</div>
        {/if}
        {#if onEndShowVideo}
          <div class="tooltip bottom small-margin">Öffne Video</div>
        {/if}
      </span>
    {/if}
  {/if}

  <a href={globalData.url + product.href + AFF_LINK} target="_blank" class="shop">
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

  .video + .shop {
    margin-left: 8rem;
  }
</style>
