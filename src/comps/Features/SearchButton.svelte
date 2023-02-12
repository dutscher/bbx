<script lang="ts">
  import { storedActiveSelection } from '@stores';
  import states from '@states';

  const onClick = () => {
    storedActiveSelection.setNextPage('products', states.SEARCH_CLICKED);
  };
</script>

<button class="circle fixed right-round top-round extra" on:click={onClick}>
  <i>search</i>
  <span class="tooltip top">Produkt Suche</span>
</button>

<style lang="scss">
  button {
    z-index: 1337;
    left: 12rem;
    bottom: 16rem;
  }
</style>
