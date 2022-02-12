<script>
  import { onMount } from 'svelte';
  import { getUrlParam } from '../../utils';
  import { storedPermissions, promptThePermission } from '../../stores';

  let isVisible = false;
  let permissions;

  storedPermissions.subscribe(store => (permissions = store));

  const urlParam = 'notify';
  const getUrlParams = () => {
    const value = getUrlParam(urlParam);
    if (value === 'undefined') {
      isVisible = true;
    }
  };

  onMount(() => {
    getUrlParams();
  });
</script>

{#if isVisible}
  <button class={permissions.isDenied ? 'is-denied' : ''} on:click={() => promptThePermission()}>
    Notify on Updates{!permissions.isGranted ? '?' : '!'}
  </button>
{/if}

<style lang="scss">
  @import '../../scss/variables';

  button {
    position: fixed;
    left: 1rem;
    bottom: 1rem;
    padding: 1rem;
    cursor: pointer;
    background: white;
    color: black;
    z-index: 1337;
    border: none;

    &.is-denied {
      text-decoration: line-through;
    }
  }
</style>
