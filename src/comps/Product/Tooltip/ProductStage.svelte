<script lang="ts">
  import { internetConnection, storedProductMedia } from '@stores';
  import { onMount, stopClick } from '@utils';
  import beerui from '@beerui';
  import ProductMediaNavigation from './ProductMediaNavigation.svelte';
  import ProductVideo from './ProductVideo.svelte';

  export let product: any;

  let isOnline: boolean = false;
  let productMedia: any;

  let openModal: boolean = false;

  internetConnection.subscribe(store => (isOnline = store.isOnline));
  storedProductMedia.subscribe(store => (productMedia = store));

  const onImageLoaded = () => {
    storedProductMedia.update(store => {
      store.imageLoaded = true;
      store.reason = 'image-loaded';
      return store;
    });
  };

  const onImageError = e => {
    console.log(e);
    storedProductMedia.update(store => {
      store.imageLoaded = true;
      store.reason = 'image-error';
      return store;
    });
  };

  const openInModal = e => {
    stopClick(e);
    openModal = !openModal;
  };

  const stopModalClick = e => {
    stopClick(e);
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
    {#if !openModal}
      {#if !productMedia.videoVisible}
        <img
          class="top-round"
          src={productMedia.imageSrc}
          on:click={openInModal}
          on:load={onImageLoaded}
          on:error={onImageError}
          alt={product.title}
          width="100%"
        />
      {:else}
        <ProductVideo src={product.video} class="top-round" />
      {/if}
    {/if}
  {/if}
</div>
<ProductMediaNavigation {product} />

<div class="overlay center-align middle-align{openModal ? ' active' : ''}" on:click={openInModal}>
  <div class="modal round{openModal ? ' active' : ''}" on:click={stopModalClick}>
    <i class="close" on:click={openInModal}>cancel</i>
    <h5>{product.title}</h5>
    {#if openModal}
      <div class="wrap">
        {#if !productMedia.imageLoaded}
          <div class="absolute front loader medium small-margin" />
        {/if}
        {#if !productMedia.videoVisible}
          <img
            src={productMedia.imageSrc + '?size=1000'}
            on:load={onImageLoaded}
            on:error={onImageError}
            alt={product.title}
          />
        {:else}
          <ProductVideo src={product.video} />
        {/if}
      </div>
      <ProductMediaNavigation noHearts={true} {product} class="bottom-round bigger-icons" />
    {/if}
  </div>
</div>

<style lang="scss">
  .stage {
    height: 150rem;
  }

  img,
  // ProductVideo
  :global iframe {
    display: block;
    object-fit: contain;
    background: var(--surface);
    height: 100% !important;
  }

  .overlay {
    z-index: 1337;
  }

  .modal {
    top: auto;
    overflow-x: visible;
    overflow-y: visible;
    height: 90vw;
    width: 90vw;

    h5 {
      width: 100%;
      white-space: normal;
    }

    .close {
      position: absolute;
      right: 4rem;
      top: 4rem;
      cursor: pointer;
      font-size: 40rem;
      width: auto;
      color: var(--on-surface-variant);

      &:hover {
        color: var(--primary);
      }
    }

    .wrap {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 90%;
      overflow: hidden;

      img,
      :global iframe {
        border-radius: 8rem;
      }
    }
  }

  :global .modal .navi {
    position: absolute;
    background-color: var(--surface);
    left: -8rem;
    bottom: -46rem;
    right: -8rem;
    padding: 16rem;
    box-shadow: var(--shadow2);
  }

  :global .modal .navi.bigger-icons i {
    font-size: 40rem;
  }
</style>
