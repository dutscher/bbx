<script lang="ts">
    export let modifier: string = '';
    export let title: string = '';
    export let classes: string = '';
    export let svg: boolean = false;
    import Cross from "../../public/images/icon-cross.svg";
    import Arrow from "../../public/images/icon-arrow.svg";

    $: modifierClasses = (modifier.split(' ').map(modifier => `icon--${modifier}`).join(' '));
</script>

{#if svg}
    <span on:click class="icon icon--svg {modifierClasses}{!!classes ? ' ' + classes : ''}" {title}>
        {#if modifier.includes('cross')}
            <Cross width="1em" height="1em"/>
        {/if}
        {#if modifier.includes('arrow')}
            <Arrow width="1em" height="1em"/>
        {/if}
    </span>
{:else}
    <i on:click class="icon icon--bg {modifierClasses}{!!classes ? ' ' + classes : ''}" {title}></i>
{/if}

<style lang="scss">
  @import '../scss/variables';

  $selector: '.icon';
  #{$selector} {
    vertical-align: top;
    cursor: pointer;

    &--bg {
      &::after {
        display: inline-block;
        content: '';
        background-size: contain;
        background-repeat: no-repeat;
        padding: 8px;
        transition: transform ease-in-out 150ms;
      }
    }

    &--manual::after {
      background-image: url('../images/icon-manual.svg');
    }

    &--cart::after {
      background-image: url('../images/icon-cart.svg');
    }

    &--new::after {
      background-image: url('../images/icon-new.svg');
    }

    &--flame::after {
      background-image: url('../images/icon-flame.svg');
    }

    &--arrow {
      &::after {
        background-image: url('../images/icon-arrow.svg');
      }

      &#{$selector}--svg {
        color: $color-primary;

        &:hover {
          color: $color-primary-darker;
        }
      }
    }

    &--cross {
      &::after {
        background-image: url('../images/icon-cross.svg');
      }

      &#{$selector}--svg {
        color: $color-primary;

        &:hover {
          color: $color-primary-darker;
        }
      }
    }

    &--left {
      &::after,
      :global(&#{$selector}--svg svg) {
        transform: rotate(180deg);
      }
    }

    &--down::after {
      transform: rotate(90deg);
    }

    &--up::after {
      transform: rotate(-90deg);
    }
  }
</style>
