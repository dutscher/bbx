<script lang="ts">
  import { onMount } from 'svelte';
  import ChipLetter from '../Atoms/ChipLetter.svelte';
  import { storedActiveSelection, storedTags } from '../../stores';
  import { getUrlParam, setUrlParams, ess } from '../../utils';
  import { IDS_SPECIAL_TAGS } from '../../_interfaces';

  export let activeTagIds: any = [];
  export let isVisible: boolean = false;

  let tags: any;
  const abc = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
  const urlParam = 'tags';

  storedTags.subscribe(store => (tags = store));

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
      sortedTags: sortedTags.filter(tag => tag.count > 0).filter(tag => tag.name.toUpperCase().startsWith(letter)),
    };
  });

  onMount(() => {
    getUrlParams();
  });
</script>

{#if isVisible}
  <div class="flex flex--gap flex--wrap">
    {#each sortedAbcTags as abc}
      {#each abc.sortedTags as tag, index}
        <span
          class={ess([
            'chip small round no-margin',
            activeTagIds.includes(tag.id) && 'active',
            IDS_SPECIAL_TAGS.includes(tag.id) ? 'grey7' : 'secondary',
            index === 0 && 'new-letter',
          ])}
          on:click={() => clickTag(tag, true)}
          data-id={tag.id}
        >
          {#if index === 0}
            <ChipLetter letter={abc.letter} />&nbsp;
          {/if}
          {tag.name}&nbsp;
          <span class="chip_state">{tag.count}</span>
        </span>
      {/each}
    {/each}
  </div>
{/if}

<style lang="scss">
  @import '../../scss/variables';

  .chip {
    cursor: pointer;
    user-select: none;

    &:hover,
    &.active {
      outline: 2px solid $color-primary-darker;
    }

    &.disabled {
      opacity: 0.1;
      cursor: default;
    }
  }
</style>
