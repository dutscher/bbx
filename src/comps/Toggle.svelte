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
  let isVisible = true;

  const onClick = () => {
    if (!alwaysopen) {
      isVisible = !isVisible;
      localStore.visibility(title, isVisible);
    }
  };

  onMount(() => {
    const lsValue = localStore.visibility(title);
    if (!lsValue || open || alwaysopen) {
      isVisible = lsValue || open || alwaysopen;
    }
  });
</script>

<Heading level={headlineTag} class={className} on:click={onClick}>
  <div class="with-toggle{alwaysopen ? ' alwaysopen' : ''}">
    {#if !alwaysopen}
      <Icon modifier="arrow {!isVisible ? 'down' : 'up'}" svg />
    {/if}
    <slot name="icon" />
    {title}
    <slot name="description" />
    <slot name="right" />
  </div>
</Heading>
<div class="block{isVisible ? ' show' : ''} flex flex--vertical-center flex--wrap{noPad ? ' no-toggle-space' : ''}">
  <slot />
</div>

<style lang="scss">
  @import '../scss/variables';

  .with-toggle {
    cursor: pointer;
    user-select: none;
    background: $color-neutral-42;
    border-radius: $space-xl;
    padding-left: $space-xl;

    :global(& + *) {
      padding-left: $space-xl * 2.5;
      padding-bottom: $space-xl * 2.5;
    }

    &:hover {
      background: $color-neutral-50;
    }

    :global([data-theme='dark'] &) {
      background: $color-neutral-150;
    }

    :global([data-theme='dark'] &:hover) {
      background: $color-neutral-100;
    }

    :global([slot]) {
      display: inline-block;
    }

    :global([slot='right']) {
      float: right;
      padding-right: $space-lg;
    }

    &.alwaysopen {
      cursor: default;
    }
  }

  .block {
    display: none;

    &.show {
      display: flex;
    }

    &.no-toggle-space {
      padding-left: 0;
    }
  }
</style>
