<script lang="ts">
  import ProductHearts from './ProductHearts.svelte';
  import { AFF_LINK } from '../../_interfaces';
  import { internetConnection, storedGlobalData } from '../../stores';
  import { ess, stopClick, jsVoid } from '../../utils';

  export let product: any;
  export let onLoad = () => {};

  let isOnline: boolean = false;
  let data: any;

  let imageLoaded: boolean = false;
  let imageSrc: string = '';
  let imageIndex = 0;
  let images: any;
  let videoVisible: boolean = false;
  let video: any;

  internetConnection.subscribe(store => (isOnline = store.isOnline));
  storedGlobalData.subscribe(store => (data = store));

  const setIndex = index => {
    videoVisible = false;
    imageLoaded = false;
    imageIndex = index;
  };

  const goBack = e => {
    stopClick(e);
    if (imageIndex > 0) {
      imageLoaded = false;
      imageIndex--;
    }
  };

  const goFurther = e => {
    stopClick(e);
    if (imageIndex < images.length - 1) {
      imageLoaded = false;
      imageIndex++;
    }
  };

  const onImageLoaded = () => {
    imageLoaded = true;
    onLoad();
  };

  const showVideo = () => {
    imageLoaded = true;
    videoVisible = !videoVisible;
  };

  $: {
    if ('images' in product) {
      images = product.images;
      imageSrc = images[imageIndex];
    }
    if ('video' in product) {
      video = product.video;
    }
  }
</script>

<div class="stage">
  {#if isOnline && !!imageSrc}
    {#if !imageLoaded}
      <a href={jsVoid} class="absolute front loader medium small-margin" />
    {/if}

    {#if !videoVisible}
      <img class="top-round" src={imageSrc} on:load={() => onImageLoaded()} alt={product.title} width="100%" />
    {:else}
      <iframe
        class="top-round"
        width="100%"
        src={video}
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      />
    {/if}
  {/if}
</div>

{#if isOnline && !!imageSrc}
  <div class="navi flex flex--horizontal-center front small-margin small-text bold">
    <ProductHearts {product} />

    {#if images.length > 1}
      <span on:click={goBack}>
        <i class={ess((imageIndex === 0 || videoVisible) && 'disable')}>arrow_back_ios</i>
        {#if !videoVisible}
          <div class="tooltip bottom small-margin">Vorheriges Bild</div>
        {/if}
      </span>

      {#each images as image, i}
        <span on:click={() => setIndex(i)}>
          <i class={ess(i === imageIndex && !videoVisible && 'active')}>fiber_manual_record</i>
        </span>
      {/each}
    {/if}

    {#if video}
      <span on:click={showVideo}>
        <i class={ess(videoVisible && 'active')}>{videoVisible ? 'cancel' : 'play_circle'}</i>
        <div class="tooltip bottom small-margin">Youtube Video {videoVisible ? 'schließen' : 'öffnen'}</div>
      </span>
    {/if}

    {#if images.length > 1}
      <span on:click={goFurther}>
        <i class={ess((imageIndex === images.length - 1 || videoVisible) && 'disable')}>arrow_forward_ios</i>
        {#if !videoVisible}
          <div class="tooltip bottom small-margin">Nächstes Bild</div>
        {/if}
      </span>
    {/if}

    <a href={data.url + product.href + AFF_LINK} target="_blank">
      <i>shopping_cart</i>
      <div class="tooltip bottom small-margin">Zum Shop{!!AFF_LINK ? '*' : ''}</div>
    </a>
  </div>
{/if}

<style lang="scss">
  .stage {
    height: 150rem;
  }

  img,
  iframe {
    display: block;
    object-fit: contain;
    background: #fff;
    height: 100%;
  }

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
