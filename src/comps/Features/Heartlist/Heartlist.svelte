<script lang="ts">
  import { stopClick } from '@utils';
  import { storedProducts, storedHearts, localStore, lsKeyHeart } from '@stores';
  import Product from '../../Product/Product.svelte';

  export let list = { id: 0, d: false, t: '', i: [] };
  export let changeOrder: boolean = false;
  let heartItems: any;
  let heartSummary: any = { price: 0, parts: 0 };
  let heartListCount: number = 0;
  let products: any = [];
  let isEdit: boolean = false;
  let editTitle: string = '';
  let inputElement: any;

  storedProducts.subscribe(store => (products = store));
  storedHearts.subscribe(store => (heartListCount = store.lists.length));

  const clickDeleteList = e => {
    stopClick(e);

    const choice = confirm(`"${list.t}" wirklich löschen?`);
    if (choice) {
      storedHearts.update(store => {
        store.lists = store.lists.filter(list_ => list_.id !== list.id);
        localStore.set(lsKeyHeart, JSON.stringify(store.lists));
        store.reason = 'delete-list';
        return store;
      });
    }
  };

  const clickEdit = e => {
    stopClick(e);

    if (isEdit) {
      isEdit = false;
      editTitle = '';
    } else {
      isEdit = true;
      editTitle = list.t;

      setTimeout(() => {
        inputElement.focus();
        inputElement.select();
      }, 50);
    }
  };

  const onKeyDown = e => {
    if (e.key === 'Escape') {
      isEdit = false;
    }
  };

  const onKeyPress = e => {
    if (e.key === 'Enter') {
      storedHearts.update(store => {
        list.t = editTitle;

        store.lists = store.lists.map(list_ => {
          if (list_.id === list.id) {
            list_.t = editTitle;
          }
          return list_;
        });

        localStore.set(lsKeyHeart, JSON.stringify(store.lists));

        isEdit = false;
        store.reason = 'edit-title';
        return store;
      });
    }
  };

  $: heartItems = list.i
    ? list.i
        .map(pID => products.find(product => product.id === pID))
        .filter(product => product !== undefined)
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
      if (!!product.price) {
        heartSummary.price += product.price;
      }
      if (!!product.parts) {
        heartSummary.parts += product.parts;
      }
    });
  }
</script>

<summary class="none small-margin {list.d ? 'no-interaction' : ''}">
  <div class="row no-wrap middle-align">
    <div class="col min">
      <i class="red-text">favorite</i>
    </div>
    <div class="col">
      {#if !isEdit}
        <span class="large-text">
          {list.t}
          {#if list.d}<b>(Default)</b>{/if}
        </span>
      {:else}
        <div class="field border small">
          <input
            type="text"
            bind:this={inputElement}
            on:keydown={onKeyDown}
            on:keypress={onKeyPress}
            bind:value={editTitle}
          />
        </div>
      {/if}
      <div class="small-text">
        {#if list.i.length > 1}
          <b>{list.i.length}</b> Set´s =
          <b>Listenpreis:</b>
          {heartSummary.price.toFixed(2).replace('.', ',')} EUR /
          <b>Steine:</b>
          {heartSummary.parts}
        {/if}
      </div>
    </div>
    <div class="user-interaction col min" on:click={clickEdit}>
      <i>
        {#if !isEdit}edit{:else}cancel{/if}
      </i>
      <div class="tooltip">Editiere Liste</div>
    </div>
    {#if !list.d}
      <div class="user-interaction col min" on:click={clickDeleteList}>
        <i>delete</i>
        <div class="tooltip">Lösche Liste</div>
      </div>
    {/if}
    {#if heartListCount > 1 && changeOrder}
      <div class="user-interaction col min drag">
        <i>drag_indicator</i>
        <div class="tooltip">Reihenfolge ändern</div>
      </div>
    {/if}
  </div>
</summary>
<div class="flex flex--gap flex--wrap">
  {#each heartItems as product (product.id)}
    <Product {product} type="hearts-{list.id}" />
  {/each}
</div>

<style lang="scss">
  summary {
    user-select: none;

    &.no-interaction {
      pointer-events: none;
      cursor: default;
    }

    .user-interaction {
      pointer-events: all;
      cursor: pointer;

      &.drag {
        cursor: grab;
      }
    }
  }
</style>
