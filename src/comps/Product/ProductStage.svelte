<script lang="ts">
  import { AFF_LINK } from '../../_interfaces';
  import { internetConnection, storedGlobalData } from '../../stores';
  import { ess } from '../../utils';

  export let product: any;
  export let onLoad = () => {};

  let isOnline: boolean = false;
  let data: any;

  let imageSrc: string = '';
  let imageIndex = 0;
  let images: any;
  let videoVisible: boolean = false;
  let video: any;

  internetConnection.subscribe(store => (isOnline = store.isOnline));
  storedGlobalData.subscribe(store => (data = store));

  const setIndex = index => {
    videoVisible = false;
    imageIndex = index;
  };

  const goBack = () => {
    if (imageIndex >= 0) {
      imageIndex--;
    }
  };

  const goFurther = () => {
    if (imageIndex < images.length) {
      imageIndex++;
    }
  };

  const showVideo = () => {
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

{#if isOnline && !!imageSrc}
  <div class={ess('navi absolute bottom front center small-margin small-text bold', videoVisible && 'video-active')}>
    <span on:click={() => goBack()}>
      <i class={ess((imageIndex === 0 || videoVisible) && 'disable')}>arrow_back_ios</i>
      {#if !videoVisible}
        <div class="tooltip top">Vorheriges Bild</div>
      {/if}
    </span>

    {#each images as image, i}
      <span on:click={() => setIndex(i)}>
        <i class={ess(i === imageIndex && !videoVisible && 'active')}>fiber_manual_record</i>
      </span>
    {/each}

    {#if video}
      <span on:click={() => showVideo()}>
        <i class={ess(videoVisible && 'active')}>{videoVisible ? 'cancel' : 'play_circle'}</i>
        <div class="tooltip top">Youtube Video {videoVisible ? 'schließen' : 'öffnen'}</div>
      </span>
    {/if}

    <a href={data.url + product.href + AFF_LINK} target="_blank">
      <i>shopping_cart</i>
      <div class="tooltip top">Zum Shop{!!AFF_LINK ? '*' : ''}</div>
    </a>

    <span on:click={() => goFurther()}>
      <i class={ess((imageIndex === images.length - 1 || videoVisible) && 'disable')}>arrow_forward_ios</i>
      {#if !videoVisible}
        <div class="tooltip top">Nächstes Bild</div>
      {/if}
    </span>
  </div>

  {#if !videoVisible}
    <img class="top-round" src={imageSrc} on:load={() => onLoad('img')} alt={product.title} width="100%" />
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

<style lang="scss">
  img,
  iframe {
    display: block;
    object-fit: contain;
    background: #fff;
    height: 100%;
  }

  i {
    cursor: pointer;
    color: var(--surface);
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

  .navi:not(.video-active) {
    &:before {
      content: '';
      background: transparent;
      background: linear-gradient(0, rgb(99, 98, 98) 0%, rgba(255, 255, 255, 0) 80%);
      position: absolute;
      z-index: -1;
      left: -300rem;
      right: -100rem;
      top: -30rem;
      bottom: -40rem;
      //transform: rotate(345deg);
    }
  }
</style>
