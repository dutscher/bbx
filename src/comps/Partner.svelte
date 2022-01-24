<script>
    import Icon from "./Icon.svelte";

    let isVisible = true

    const onClick = () => {
        isVisible = !isVisible;
    }
</script>

<h2 class="with-toggle" on:click={onClick}>
    <Icon modifier="arrow {!isVisible ? 'down' : 'up'}" svg/>
    Partner & Spende
</h2>
<div class="block{isVisible ? ' show' : ''} flex flex--vertical-center">
    <slot />
</div>

<style lang="scss">
  @import '../scss/variables';

  .block {
    display: none;
    gap: $space-lg;

    &.show {
      display: flex;
    }
  }
</style>
