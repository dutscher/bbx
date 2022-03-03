<script lang="ts">
  import { internetConnection } from '../../stores';

  export let product: any;
  export let onLoad = () => {};
  let isOnline: boolean = false;
  let imageSrc: string;

  internetConnection.subscribe(store => (isOnline = store.isOnline));

  $: imageSrc = 'images' in product ? product.images[0] : '';
</script>

{#if isOnline && !!imageSrc}
  <img class="responsive small top-round" src={imageSrc} on:load={onLoad} alt="Produkt Bild" width="100%" />
{/if}

<style lang="scss">
  img {
    display: block;
    object-fit: contain;
    background: #fff;
  }
</style>
