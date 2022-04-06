<script lang="ts">
  import ClickOutside from 'svelte-click-outside';
  import { lsKeyHeart, localStore, storedHearts } from '@stores';
  import { stopClick } from '@utils';

  export let product: any;
  let isActive: boolean = false;
  let isHeart: boolean = false;
  let isHover: boolean = false;
  let mouseOver: boolean = false;
  let heartLists: any;
  let editListID: number = -1;
  let editValue: string = '';
  let newValue: string = '';
  let input: any;

  storedHearts.subscribe(store => {
    heartLists = store.lists;
  });

  const clickHeart = forceClose => {
    isActive = forceClose ? false : !isActive;

    if (!isActive) {
      editListID = -1;
      editValue = '';
    }

    if (isActive && heartLists.length === 1) {
      clickHandleList(heartLists[0].id);
    }
  };

  const clickHandleList = listID => {
    storedHearts.update(store => {
      store.lists = store.lists.map(list => {
        if (list.id === listID) {
          if (!list.i.includes(product.id)) {
            list.i.push(product.id);
          } else {
            list.i = list.i.filter(pid => pid !== product.id);
          }
        }
        return list;
      });

      localStore.set(lsKeyHeart, JSON.stringify(store.lists));
      store.reason = 'list-item-handler';
      return store;
    });
  };

  const clickEditList = (e, listId, title) => {
    stopClick(e);

    editListID = listId;
    editValue = title;

    setTimeout(() => {
      input.focus();
      input.select();
    }, 50);
  };

  const handleEditList = () => {
    storedHearts.update(store => {
      store.lists = store.lists.map(list => {
        if (list.id === editListID) {
          list.t = editValue;
        }
        return list;
      });
      editListID = -1;
      editValue = '';
      localStore.set(lsKeyHeart, JSON.stringify(store.lists));
      store.reason = 'edit-list';
      return store;
    });
  };

  const handleNewList = () => {
    storedHearts.update(store => {
      const nextId = store.lists.length;
      store.lists.push({ id: nextId, t: newValue, i: [product.id] });
      newValue = '';
      localStore.set(lsKeyHeart, JSON.stringify(store.lists));
      store.reason = 'new-list';
      return store;
    });
  };

  const onKeyDown = e => {
    if (e.key === 'Escape') {
      newValue = '';
      editListID = -1;
      editValue = '';
    }
  };

  const onKeyPress = (e, listId) => {
    if (e.key === 'Enter') {
      // from input edit is id given
      if (listId) handleEditList();
      // from new input is id not given
      else handleNewList();
    }
  };

  const onClickOutside = () => {
    clickHeart(true);
  };

  const onMouseOver = () => {
    mouseOver = true;
  };

  const onMouseOut = () => {
    mouseOver = false;
  };

  $: isHeart = heartLists.find(list => list.i.includes(product.id)) || false;
  $: isHover = mouseOver;
</script>

<div class="hearts{isActive ? ' active' : ''}">
  <ClickOutside on:clickoutside={onClickOutside}>
    <i
      on:click={() => /* keep this due param forceClose instead of event */ clickHeart()}
      on:focus={onMouseOver}
      on:mouseover={onMouseOver}
      on:mouseout={onMouseOut}
      on:blur={onMouseOut}
      class="trigger{isHeart || isHover ? ' red-text' : ''}"
    >
      {isHeart || isHover ? 'favorite' : 'favorite_border'}
    </i>
    <div class="hearts__flyout border small-padding absolute surface">
      {#each heartLists as list}
        <div class="hearts__list">
          <i on:click={() => clickHandleList(list.id)} class={list.i.includes(product.id) ? 'red-text' : ''}>
            {list.i.includes(product.id) ? 'favorite' : 'favorite_border'}
          </i>
          {#if editListID !== list.id}
            <i on:click={e => clickEditList(e, list.id, list.t)}>edit</i>
            <span>{list.t}</span>
          {:else}
            <div class="field small no-margin">
              <input
                type="text"
                bind:this={input}
                on:keydown={onKeyDown}
                on:keypress={e => onKeyPress(e, list.id)}
                bind:value={editValue}
              />
            </div>
          {/if}
        </div>
      {/each}
      <div class="hearts__list hearts__list--add">
        <i>add</i>
        <div class="field small no-margin">
          <input
            type="text"
            placeholder="Neue Liste"
            on:keypress={onKeyPress}
            on:keydown={onKeyDown}
            bind:value={newValue}
          />
        </div>
      </div>
    </div>
  </ClickOutside>
</div>

<style lang="scss">
  .trigger {
    top: -2rem;
  }

  .hearts {
    display: inline-block;
    line-height: 26rem;
    margin-right: 8rem;

    i {
      cursor: pointer;
    }

    &__flyout {
      z-index: 1;
      top: -9rem;
      left: -9rem;
      border-radius: 8rem;
      display: none;
      color: var(--on-surface-variant);

      .active & {
        display: block;
      }
    }

    &__list {
      display: flex;

      span {
        margin: 0 4rem;
        flex: 1;
      }

      .field.small {
        height: 25rem;
      }

      &--add i {
        margin: 0;
      }

      input {
        width: 100rem;
        border: solid 1rem var(--on-surface-variant);
        border-radius: 4rem;
        padding: 0 5rem;
        flex: 1;
      }
    }
  }
</style>
