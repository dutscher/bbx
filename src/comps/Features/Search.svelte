<script lang="ts">
  import { storedActiveSelection } from '../../stores/states';

  const onClick = () => {
    storedActiveSelection.update(store => {
      store.site = 'products';
      store.reason = 'click-search';
      return store;
    });
  };
</script>

<button class="circle fixed right-round top-round extra" on:click={onClick}>
  <i>search</i>
  <div class="tooltip top">Produkt Suche</div>
</button>

<style lang="scss">
  button {
    z-index: 1337;
    left: 12rem;
    bottom: 16rem;
  }
</style>
