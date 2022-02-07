<script lang="ts">
    import { onMount } from 'svelte';
    import { storedActiveSelection, storedTags } from '../../stores';
    import { getUrlParam, setUrlParams } from '../../utils';
    import { ID_MANHATTAN, ID_MOVIE, ID_NETHERLAND, ID_PARTS, IDS_SPECIAL_TAGS } from '../../_interfaces';

    export let activeTagIds: any = [];

    let tags: any;
    const abc = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
    const urlParam = 'tags';

    storedTags.subscribe(value => (tags = value));

    const getUrlParams = () => {
        // ?tags=piraten
        const queryTags = getUrlParam(urlParam).split(',');
        tags.map(tag => {
            queryTags.map(queryTag => {
                if (tag.seoName === queryTag) {
                    clickTag(tag);
                }
            });
        });
    };

    const clickTag = (tag, withUrlUpdate?) => {
        storedActiveSelection.update(store => {
            if (!(urlParam in store)) {
                store[urlParam] = [];
            }
            if (!store[urlParam].includes(tag.id)) {
                store[urlParam].push(tag.id);
            } else {
                store[urlParam] = store[urlParam].filter(tagId => tagId !== tag.id);
            }

            if (withUrlUpdate) {
                setUrlParams(
                    urlParam,
                    tags.filter(tag => store[urlParam].includes(tag.id)).map(tag => tag.seoName)
                );
                store.reason = 'tag-clicked';
            } else {
                store.reason = 'url-parsed';
            }

            return store;
        });
    };

    onMount(() => {
        getUrlParams();
    });

    const sortedTags = tags.sort((a, b) => {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    });

    const sortedAbcTags = abc.map(letter => {
        return {
            letter,
            sortedTags: sortedTags
                .filter(tag => tag.count > 0)
                .filter(tag => tag.name.toUpperCase().startsWith(letter)),
        };
    });

    const getClasses = (tag, isFirst, activeTagIds) =>
        [
            'tag',
            activeTagIds.includes(tag.id) && 'active',
            IDS_SPECIAL_TAGS.includes(tag.id) && 'highlight',
            isFirst && 'new-letter',
        ]
            .filter(css => !!css)
            .join(' ');
</script>

<div class="flex">
    <h4 class="tag-name">Tags</h4>
    <div class="flex flex--wrap bl">
        {#each sortedAbcTags as abc}
            {#each abc.sortedTags as tag, index}
                <span
                    class="{getClasses(tag, index === 0, activeTagIds)}"
                    on:click="{() => clickTag(tag, true)}"
                    data-id="{tag.id}"
                    data-count="{tag.count}"
                >
                    {#if index === 0}
                        <span class="tag__letter" data-letter="{abc.letter}"></span>
                    {/if}
                    {tag.name}
                </span>
            {/each}
        {/each}
    </div>
</div>

<style lang="scss">
    @import '../../scss/variables';

    $selector: '.tag';
    #{$selector} {
        padding: 0 0 0 $space-xl;
        margin: $space-xs;
        border: solid 1px $color-primary-darker;
        border-radius: $border-radius-xl;
        background: $color-white;
        color: $color-primary-dark;
        cursor: pointer;
        user-select: none;
        position: relative;
        font-size: ms(0);

        @media (min-width: 750px) {
            font-size: ms(-2);
        }

        &.active {
            background: $color-primary-darker;
            color: $color-white;
        }

        &:hover,
        &:active {
            background: $color-primary;
            color: $color-white;
        }

        &::after {
            content: attr(data-count);
            display: inline-block;
            padding: $space-xs $space-md;
            margin-left: 0;
            border-radius: $border-radius-xl;
            border: 1px solid $color-white;
            background: $color-primary-dark;
            color: $color-white;
            position: relative;
        }

        &__letter {
            position: absolute;
            left: -($space-xl * 2.5);
            color: $color-primary-dark;

            &::after {
                width: ($space-xl * 2.5);
                text-align: center;
                position: relative;
                display: inline-block;
                content: attr(data-letter);
                font-weight: bold;
                font-size: ms(2);
                border-radius: $border-radius-xl;
                line-height: 19px;
            }
        }

        &.new-letter {
            margin-left: $space-xl * 2.5;
        }

        &.highlight {
            &::after {
                background: $color-highlight-darker;
                color: $color-white;
            }
        }
    }

    :global([data-theme='dark'] #{$selector}__letter) {
        color: $color-primary;
        text-shadow: $color-black 1px 1px 2px;
    }
</style>
