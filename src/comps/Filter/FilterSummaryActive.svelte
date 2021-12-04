<script lang="ts">
    import Icon from "../Icon.svelte";

    export let label: string = '';
    export let activStr: string = '';
    export let activeIds: any = [];
    export let store: any = [];
    export let onClick: any = () => {};
</script>

{#if !!activStr || activeIds.length > 0}
<span class="filter">
    <u>{label}:</u>&nbsp;
    {#if !!activStr}
        "{activStr}"
        <Icon modifier="cross" on:click={(e) => onClick(e, 'search')}></Icon>
    {:else if activeIds.length > 0}
        {#each activeIds as itemId}
            <span class="filter__item">
                {store.filter(item => item.id === itemId)[0].de}
                <Icon modifier="cross" svg="true" on:click={(e) => onClick(e, itemId)}></Icon>
            </span>
        {/each}
    {/if}
</span>
{/if}


<style lang="scss">
    @import '../../scss/variables';

    .filter {
        margin-right: $space-lg;
    }

    .filter__item:not(:last-child) {
        margin-right: $space-md;
    }
</style>
