<script>
  import { onMount } from 'svelte';
  import Icon from './Icon.svelte';
  import { localStore } from '../stores/local-storage';
  import Heading from './Heading.svelte';

  export let title = '';
  export let open = false;
  export let alwaysopen = false;
  export let noPad = false;
  export let headlineTag = 2;
  let className = '';
  export { className as class };
  export let onVisibility = () => {};

  let isVisible = true;

  const onClick = () => {
    if (!alwaysopen) {
      isVisible = !isVisible;
      localStore.visibility(title, isVisible);
      onVisibility(isVisible); // V4IY
    }
  };

  onMount(() => {
    const lsValue = localStore.visibility(title);
    if (!lsValue || open || alwaysopen) {
      isVisible = lsValue || open || alwaysopen;
    }
  });
</script>

<div class="with-toggle">
  <Heading level={headlineTag} class={className} on:click={onClick}>
    <div class="with-toggle__handle{alwaysopen ? ' alwaysopen' : ''}">
      {#if !alwaysopen}
        <Icon modifier="arrow {!isVisible ? 'down' : 'up'}" svg />
      {/if}
      <slot name="icon" />
      {title}
      <slot name="description" />
      <slot name="right" />
    </div>
  </Heading>
  <div class="block{isVisible ? ' show' : ''}{noPad ? ' no-toggle-space' : ''}">
    <slot />
  </div>
</div>

<style lang="scss">
  @import '../scss/variables';

  $selector: '.with-toggle';

  #{$selector} {
    &__handle {
      cursor: pointer;
      user-select: none;
      background: $color-neutral-42;
      border-radius: $space-xl;
      padding-left: $space-xl;

      &:hover {
        background: $color-neutral-50;
      }

      &.alwaysopen {
        cursor: default;
      }
    }

    :global([slot]) {
      display: inline-block;
    }

    :global([slot='right']) {
      float: right;
      padding-right: $space-lg;
    }
  }

  :global([data-theme='dark'] #{$selector}__handle) {
    background: $color-neutral-150;

    &:hover {
      background: $color-neutral-100;
    }
  }

  .block {
    display: none;
    padding-left: $space-xl * 2.5;

    &.show {
      display: block;
    }

    &.no-toggle-space {
      padding-left: 0;
    }
  }
</style>
