<script>
  import { onMount, getUrlParam } from '@utils';
  import { storedPermissions, promptThePermission } from '@stores';

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
  <button class="circle fixed extra" on:click={promptThePermission}>
    {#if !permissions.isGranted && !permissions.isDenied}<i>notifications</i>{/if}
    {#if permissions.isGranted}<i>notifications_active</i>{/if}
    {#if permissions.isDenied}<i>notifications_off</i>{/if}
    <div class="tooltip top">
      {#if !permissions.isGranted && !permissions.isDenied}Empfange Verfügbarkeits Browserbenachrichtigungen für
        Produkte aus deiner Merkliste{/if}
      {#if permissions.isGranted}Du empfängst Verfügbarkeits Browserbenachrichtigungen für Produkte aus deiner Merkliste{/if}
      {#if permissions.isDenied}Browserbenachrichtigungen deaktiviert{/if}
    </div>
  </button>
{/if}

<style lang="scss">
  button {
    z-index: 1337;
    left: 84rem;
    bottom: 16rem;

    .tooltip {
      white-space: normal;
      width: 50vw;
      max-width: 200rem;
    }
  }
</style>
