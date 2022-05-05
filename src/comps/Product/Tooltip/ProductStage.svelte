<script lang="ts">
  import { internetConnection, storedProductMedia } from '@stores';
  import { onMount } from '@utils';
  import beerui from '@beerui';
  import ProductMediaNavigation from './ProductMediaNavigation.svelte';

  export let product: any;

  let isOnline: boolean = false;
  let productMedia: any;

  let openModal: boolean = false;
  let modalLoaded: boolean = false;

  internetConnection.subscribe(store => (isOnline = store.isOnline));
  storedProductMedia.subscribe(store => (productMedia = store));

  const onImageLoaded = () => {
    storedProductMedia.update(store => {
      store.imageLoaded = true;
      store.reason = 'image-loaded';
      return store;
    });
  };

  const openInModal = () => {
    openModal = !openModal;
    modalLoaded = false;
  };

  onMount(() => {
    setTimeout(() => {
      beerui();
    }, 50);
  });
</script>

<div class="stage center-align middle-align">
  {#if isOnline && !!productMedia.imageSrc}
    {#if !productMedia.imageLoaded}
      <div class="absolute front loader medium small-margin" />
    {/if}

    {#if !productMedia.videoVisible}
      <img
        class="top-round"
        src={productMedia.imageSrc}
        on:click={() => {
          /* openInModal() */
        }}
        on:load={() => onImageLoaded()}
        alt={product.title}
        width="100%"
      />
    {:else}
      <iframe
        class="top-round"
        width="100%"
        src={product.video}
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      />
    {/if}
  {/if}
</div>
<ProductMediaNavigation {product} />

<div class="overlay center-align middle-align{openModal ? ' active' : ''}" on:click={() => openInModal()}>
  TODO: hearts and video
  <div class="modal round{openModal ? ' active' : ''}">
    <div class="wrap">
      <h5>{product.title}</h5>
      {#if !modalLoaded}
        <div class="loader medium small-margin" />
      {/if}
      {#if openModal}
        <img
          class="round"
          src={productMedia.imageSrc + '?size=1000'}
          on:load={() => (modalLoaded = true)}
          alt={product.title}
        />
      {/if}
    </div>
    <ProductMediaNavigation {product} />
  </div>
</div>

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

  .overlay {
    z-index: 1337;
  }

  .modal {
    top: auto;
    overflow-x: visible;
    overflow-y: visible;

    img {
      width: 100% !important;
      height: auto !important;
    }

    .warp {
      overflow-x: hidden;
      overflow-y: auto;
    }
  }
</style>
