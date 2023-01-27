<script lang="ts">
  import { storedActiveSelection, storedTags } from '@stores';
  import { onMount, getUrlParam, setUrlParams, ess } from '@utils';
  import { IDS_SPECIAL_TAGS, urlKeyTags } from '@interfaces';
  import ChipLetter from './ChipLetter.svelte';

  export let activeTagIds: any = [];
  export let isVisible: boolean = true;

  let tags: any;
  const abc = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'];

  storedTags.subscribe(store => (tags = store));

  const getUrlParams = () => {
    // ?tags=piraten
    const queryTags = getUrlParam(urlKeyTags).split(',');
    tags.map(tag => {
      queryTags.map(queryTag => {
        if (tag.seoName === queryTag) {
          clickTag(tag);
        }
      });
    });
  };

  const clickTag = (tag, withUrlUpdate?, isSpecialTag = false) => {
    storedActiveSelection.update(store => {
      let isNewSelected = false;
      if (!(urlKeyTags in store)) {
        store[urlKeyTags] = [];
      }
      if (!store[urlKeyTags].includes(tag.id)) {
        isNewSelected = true;
        store[urlKeyTags].push(tag.id);
      } else {
        store[urlKeyTags] = store[urlKeyTags].filter(tagId => tagId !== tag.id);
      }

      if (withUrlUpdate) {
        setUrlParams(
          urlKeyTags,
          tags.filter(tag => store[urlKeyTags].includes(tag.id)).map(tag => tag.seoName)
        );
        store.reason = `tag-clicked${isSpecialTag && isNewSelected ? '-close-filter' : ''}`;
      } else {
        store.reason = 'url-parsed--tags';
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
          class={ess(
            'chip small round no-margin',
            activeTagIds.includes(tag.id) ? 'red' : IDS_SPECIAL_TAGS.includes(tag.id) ? 'tertiary' : 'secondary'
          )}
          on:click={() => clickTag(tag, true, IDS_SPECIAL_TAGS.includes(tag.id))}
          data-id={tag.id}
        >
          {#if index === 0}
            <ChipLetter letter={abc.letter} />&nbsp;
          {/if}
          {tag.name}&nbsp;
          <span class="chip__state">{tag.count}</span>
        </span>
      {/each}
    {/each}
  </div>
{/if}

<style lang="scss">
  .chip {
    cursor: pointer;
    user-select: none;

    &:hover {
      background: var(--secondary);
    }

    &.disabled {
      opacity: 0.1;
      cursor: default;
    }
  }
</style>
