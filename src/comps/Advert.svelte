<script>
    import Icon from "./Icon.svelte";

    export let title = '';
    let isVisible = true

    const onClick = () => {
        isVisible = !isVisible;
    }
</script>

<h2 class="with-toggle" on:click={onClick}>
    <Icon modifier="arrow {!isVisible ? 'down' : 'up'}" svg/>
    {title}
</h2>
<div class="block{isVisible ? ' show' : ''} flex flex--vertical-center flex--wrap">
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
