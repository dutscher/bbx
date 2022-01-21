<script>
    import Icon from "./Icon.svelte";

    let isVisible = false

    const onClick = () => {
        isVisible = !isVisible;
    }
</script>

<h2 class="with-toggle" on:click={onClick}>
    <Icon modifier="arrow {!isVisible ? 'down' : 'up'}" svg/>
    Partner
</h2>
<div class="block{isVisible ? ' show' : ''}">
    <slot />
</div>

<style lang="scss">
  @import '../scss/variables';

  .block {
    display: none;

    &.show {
      display: block;
    }
  }
</style>
