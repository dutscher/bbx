<script lang="ts">
  import Icon from '../Icon.svelte';
  import { lsKeyHeart, localStore, storedHearts } from '../../stores';
  import ClickOutside from 'svelte-click-outside';
  import { stopClick } from '../../utils';

  export let product: any;
  let isHeart: any;
  let hearts: any;
  let heartLists: any;
  let isActive: boolean = false;
  let editList: string = '';
  let editValue: string = '';
  let newValue: string = '';
  let input: any;

  storedHearts.subscribe(store => {
    hearts = store;
    heartLists = Object.keys(hearts);
  });

  const clickHeart = forceClose => {
    isActive = forceClose ? false : !isActive;

    if (!isActive) {
      editList = '';
      editValue = '';
    }
  };

  const clickHandleList = listName => {
    storedHearts.update(store => {
      if (!(listName in store)) {
        store[listName] = { t: listName, i: [] };
      }

      if (!store[listName].i.includes(product.id)) {
        store[listName].i.push(product.id);
      } else {
        store[listName] = store[listName].i.filter(pid => pid !== product.id);
      }

      localStore.set(lsKeyHeart, JSON.stringify(store));

      return store;
    });
  };

  const clickEditList = (e, listName, title) => {
    stopClick(e);

    editList = listName;
    editValue = title;

    setTimeout(() => {
      input.focus();
      input.select();
    }, 50);
  };

  const handleEditList = () => {
    storedHearts.update(store => {
      if (!(editValue in store)) {
        store[editList].t = editValue;
      }
      editList = '';
      editValue = '';
      localStore.set(lsKeyHeart, JSON.stringify(store));
      return store;
    });
  };

  const handleNewList = () => {
    storedHearts.update(store => {
      if (!(newValue in store)) {
        store[newValue.toLowerCase()] = { t: newValue, i: [product.id] };
      }

      newValue = '';
      localStore.set(lsKeyHeart, JSON.stringify(store));
      return store;
    });
  };

  const onKeyPress = (e, listName) => {
    if (e.charCode === 13) {
      if (!!listName) handleEditList();
      else handleNewList();
    }
  };

  const onClickOutside = () => {
    clickHeart(true);
  };

  $: isHeart = heartLists.find(list => hearts[list].i.includes(product.id));
</script>

<div class="hearts{isActive ? ' active' : ''}">
  <ClickOutside on:clickoutside={onClickOutside}>
    <Icon
      modifier="heart"
      svg="true"
      class="trigger{isHeart ? ' active' : ''}"
      title="Merkliste"
      on:click={() => clickHeart()}
    />
    <div class="hearts__flyout">
      {#each heartLists as listName}
        <div class="hearts__list">
          <Icon
            modifier="heart"
            svg="true"
            class={hearts[listName].i.includes(product.id) ? 'active' : ''}
            title={hearts[listName].t}
            on:click={() => clickHandleList(listName)}
          />
          {#if editList !== listName}
            <Icon
              modifier="edit"
              svg="true"
              title="Bearbeiten"
              on:click={e => clickEditList(e, listName, hearts[listName].t)}
            />
            <span>{hearts[listName].t}</span>
          {:else}
            <input type="text" bind:this={input} on:keypress={e => onKeyPress(e, listName)} bind:value={editValue} />
          {/if}
        </div>
      {/each}
      <div class="hearts__list hearts__list--new">
        <span>+</span>
        <input type="text" placeholder="Neue Liste" on:keypress={onKeyPress} bind:value={newValue} />
      </div>
    </div>
  </ClickOutside>
</div>

<style lang="scss">
  @import '../../scss/variables';

  .hearts {
    position: relative;
    display: inline-block;

    &__flyout {
      color: $color-black;
      position: absolute;
      z-index: 1;
      top: 0;
      left: 0;
      background: $color-white;
      border-radius: $border-radius-lg;
      padding: $space-lg;
      display: none;

      .active & {
        display: block;
      }
    }

    &__list {
      display: flex;

      span {
        margin: 0 $space-lg;
      }

      input {
        width: 100px;
        border-radius: $border-radius;
        margin-bottom: 1px;
      }

      &--new {
        span {
          margin-left: 4px;
          margin-right: 12px;
        }
      }
    }
  }

  :global(.hearts.active .icon--heart svg) {
    margin-right: $space-lg;
  }

  :global(.hearts.active .icon--heart path) {
    stroke: $color-black;
  }
</style>
