<script lang="ts">
  const onClick = async () => {
    const title = document.title;
    const url = document.location.href;
    const text = 'Schau mal hier im BBX Watcher';
    try {
      await navigator.share({
        title,
        url,
        text,
      });
    } catch (err) {
      console.error(`Couldn't share ${err}`);
    }
  };
</script>

<button class="circle left-round top-round extra" on:click={onClick}>
  <i>share</i>
</button>

<style lang="scss">
  button {
    position: fixed;
    z-index: 1337;
    right: 12rem;
    bottom: 16rem;
  }
</style>
