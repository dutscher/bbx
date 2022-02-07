<script lang="ts">
    import { onMount } from 'svelte';
    import { storedActiveSelection } from '../../stores';
    import { getUrlParam, setUrlParams } from '../../utils';

    export let activeSearchString: any = '';

    const urlParam = 'search';

    const getUrlParams = () => {
        // ?tags=piraten
        const queryTags = getUrlParam(urlParam);
        activeSearchString = queryTags;
        onInput();
    };

    const onInput = (withUrlUpdate?) => {
        storedActiveSelection.update(value => {
            if (!(urlParam in value)) {
                value[urlParam] = activeSearchString;
            }
            value[urlParam] = activeSearchString;

            if (withUrlUpdate) {
                setUrlParams(urlParam, !!activeSearchString ? [activeSearchString] : []);
                value.reason = 'search-typed';
            } else {
                value.reason = 'url-parsed';
            }
            return value;
        });
    };

    let timer;
    const debounce = value => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            // set value
            activeSearchString = value;
            onInput(true);
        }, 500);
    };

    const checkInput = value => {
        // reset value
        if (value === '') {
            activeSearchString = '';
            onInput(true);
        }
    };

    onMount(() => {
        getUrlParams();
    });
</script>

<div class="flex flex--block">
    <h4>Suche</h4>
    <div class="flex flex--wrap bl">
        <input
            class="search"
            type="search"
            value="{activeSearchString}"
            placeholder="Produktname oder ID"
            on:input="{({ target: { value } }) => checkInput(value)}"
            on:keyup="{({ target: { value } }) => debounce(value)}"
            spellcheck="false"
        />
        <!--               bind:value={activeSearchString}-->
        <!--               on:input={() => onInput(true)}-->
    </div>
</div>

<style lang="scss">
    @import '../../scss/variables';

    .search {
        background: $color-primary-lighter;
        border: solid 1px $color-primary-darker;
        border-radius: $border-radius-lg;
        color: $color-primary-darker;
        padding: $space-md $space-lg;
        font-size: ms(2);
        width: 100%;

        &::placeholder {
            color: $color-white;
        }

        @media (min-width: 720px) {
            width: 33vw;
        }
    }

    :global([data-theme='dark'] .search) {
        background: $color-neutral-100;
    }
</style>
