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

<button class="circle right-round top-round extra" on:click={onClick}>
  <i>search</i>
</button>

<style lang="scss">
  button {
    position: fixed;
    z-index: 1337;
    left: 12rem;
    bottom: 16rem;
  }
</style>
