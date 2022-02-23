<script lang="ts">
  import { storedProducts, storedHearts, localStore, lsKeyHeart } from '../../stores';
  import Product from '../Product/Product.svelte';
  import { stopClick } from '../../utils';

  export let list = 'default';
  let heartSummary = { price: 0, parts: 0 };
  let title = '';
  let hearts = [];
  let products = [];

  storedProducts.subscribe(store => (products = store));
  storedHearts.subscribe(store => {
    title = store[list].t;
    hearts = store[list].i;
  });

  const clickDeleteList = e => {
    stopClick(e);

    const choice = confirm(`"${title}" wirklich löschen?`);
    if (choice) {
      storedHearts.update(store => {
        delete store[list];
        localStore.set(lsKeyHeart, JSON.stringify(store));
        return store;
      });
    }
  };

  $: heartItems = hearts
    ? hearts
        .map(pID => products.find(product => product.id === pID))
        .sort((a, b) => {
          if (a.title < b.title) {
            return -1;
          }
          if (a.title > b.title) {
            return 1;
          }
          return 0;
        })
        .sort((a, b) => {
          if (a.state.id < b.state.id) {
            return -1;
          }
          if (a.state.id > b.state.id) {
            return 1;
          }
          return 0;
        })
    : [];

  $: {
    // reset
    heartSummary = { price: 0, parts: 0 };
    // calc again
    heartItems.map(product => {
      if (!!product.price && !!product.parts) {
        heartSummary.price += product.price;
        heartSummary.parts += product.parts;
      }
    });
  }
</script>

<details class="card" open={list === 'default'}>
  <summary class="none small-margin">
    <div class="row no-wrap middle-align">
      <div class="col min">
        <i>favorite</i>
        <div class="tooltip">Will ich haben</div>
      </div>
      <div class="col">
        <span class="large-text">{title}</span>
        <div class="small-text">
          {#if heartItems.length > 1}
            {heartItems.length} Set´s =
            <b>Listenpreis:</b>
            {heartSummary.price.toFixed(2).replace('.', ',')} EUR /
            <b>Steine:</b>
            {heartSummary.parts}
          {/if}
        </div>
      </div>
      <div class="col min">
        <i on:click={clickDeleteList}>delete</i>
        <div class="tooltip">Lösche Liste</div>
      </div>
    </div>
  </summary>
  <div class="flex flex--gap flex--wrap">
    {#each heartItems as product (product.id)}
      <Product {product} type="hearts-{list}" />
    {/each}
  </div>
</details>

<style lang="scss">
  @import '../../scss/variables';
</style>
