<script lang="ts">
    import FilterSummaryActive from './FilterSummaryActive.svelte';
    import {
        storedActiveSelection,
        storedColors,
        storedParts,
        storedPartTypes,
        storedStates,
        storedTags,
    } from '../../stores';
    import { setUrlParams } from '../../utils';

    export let activeSearchString: string = '';
    export let activeTagIds: any = [];
    export let activeStateIds: any = [];
    export let activeColorIds: any = [];
    export let activePartIds: any = [];
    export let activePartTypeIds: any = [];

    let parts: any;
    let partTypes: any;
    let colors: any;
    let states: any;
    let tags: any;

    storedStates.subscribe((value) => (states = value));
    storedParts.subscribe((value) => (parts = value));
    storedPartTypes.subscribe((value) => (partTypes = value));
    storedColors.subscribe((value) => (colors = value));
    storedTags.subscribe((value) => (tags = value));

    $: invisible =
        !activeSearchString &&
        activeTagIds.length === 0 &&
        activeStateIds.length === 0 &&
        activeColorIds.length === 0 &&
        activePartIds.length === 0 &&
        activePartTypeIds.length === 0;

    const removeItem = (type, event, id) => {
        // dont close .with-toggle
        event.preventDefault();
        event.stopPropagation();

        storedActiveSelection.update((store) => {
            if (type === 'search' && type === 'search') {
                store[type] = '';
            } else {
                store[type] = store[type].filter((itemId) => itemId !== id);
            }

            const restTags = tags.filter((tag) => store[type].includes(tag.id));

            if (restTags.length === 0) {
                store.reason = 'remove-all-filters';
            }

            setUrlParams(
                type,
                restTags.map((tag) => tag.seoName)
            );

            return store;
        });
    };
</script>

{#if !invisible}
    <div class="flex flex--inline filter-summary  with-text-shadow">
        <div class="flex flex--wrap flex--vertical-center filter-summary__wrap">
            <strong class="filter-headline">| Filter:&nbsp;</strong>
            <FilterSummaryActive
                label="Suche nach"
                activStr={activeSearchString}
                onClick={removeItem.bind(this, 'search')}
            />
            <FilterSummaryActive
                label="Tags"
                activeIds={activeTagIds}
                store={tags}
                onClick={removeItem.bind(this, 'tags')}
            />
            <FilterSummaryActive
                label="Status"
                activeIds={activeStateIds}
                store={states}
                onClick={removeItem.bind(this, 'states')}
            />
            <FilterSummaryActive
                label="Farben"
                activeIds={activeColorIds}
                store={colors}
                onClick={removeItem.bind(this, 'colors')}
            />
            <FilterSummaryActive
                label="Parts"
                activeIds={activePartIds}
                store={parts}
                onClick={removeItem.bind(this, 'parts')}
            />
            <FilterSummaryActive
                label="Parttypen"
                activeIds={activePartTypeIds}
                store={partTypes}
                onClick={removeItem.bind(this, 'partTypes')}
            />
        </div>
    </div>
{/if}

<style lang="scss">
    @import '../../scss/variables';

    .filter-summary {
        position: relative;

        &__wrap {
            font-size: ms(-1);
            font-weight: bold;
            color: $color-primary;
        }
    }
</style>
