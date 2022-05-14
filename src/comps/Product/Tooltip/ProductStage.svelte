<script lang="ts">
  import { internetConnection, storedProductMedia } from '@stores';
  import { onMount } from '@utils';
  import beerui from '@beerui';
  import ProductMediaNavigation from './ProductMediaNavigation.svelte';
  import ProductVideo from './ProductVideo.svelte';

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
        on:click={() => openInModal()}
        on:load={() => onImageLoaded()}
        alt={product.title}
        width="100%"
      />
    {:else}
      <ProductVideo src={product.video} class="top-round" />
    {/if}
  {/if}
</div>
<ProductMediaNavigation {product} />

<div class="overlay center-align middle-align{openModal ? ' active' : ''}" on:click={() => openInModal()}>
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
    <ProductMediaNavigation onlyImages={true} {product} class="round" />
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
    background: var(--surface);
    height: 100%;
  }

  .overlay {
    z-index: 1337;
  }

  .modal {
    top: auto;
    overflow-x: visible;
    overflow-y: visible;
    padding-bottom: 40rem;

    img {
      width: 100% !important;
      height: auto !important;
    }
  }

  :global .modal .navi {
    position: absolute;
    background-color: var(--surface);
    left: 33%;
    bottom: 0;
    right: 33%;
    padding: 6rem;
    box-shadow: var(--shadow2);
  }
</style>
