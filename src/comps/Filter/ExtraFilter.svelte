<script lang="ts">
  import ExtraFilterNav from './ExtraFilterNav.svelte';
  import Checkbox from './Checkbox.svelte';

  export let extraFilter = {};
  export let onChange = () => {};
  export let noParts = false;
  export let noNav = false;
</script>

<ExtraFilterNav condition={!noNav} class="wrap small-margin no-h-margin">
  {#if 'sets' in extraFilter && extraFilter.sets.count > 0}
    <Checkbox
      label="Sets"
      badge={extraFilter.sets.count}
      bind:checked={extraFilter.sets.show}
      onChange={() => onChange(extraFilter)}
    />
  {/if}
  {#if 'parts' in extraFilter && !noParts && extraFilter.parts.count > 0}
    <Checkbox
      label="Parts"
      badge={extraFilter.parts.count}
      bind:checked={extraFilter.parts.show}
      onChange={() => onChange(extraFilter)}
    />
  {/if}
  {#if 'hot' in extraFilter && extraFilter.hot.count > 0}
    <Checkbox
      icon="local_fire_department"
      iconColor="orange-text"
      badge={extraFilter.hot.count}
      tooltip="Beliebte Produkte"
      bind:checked={extraFilter.hot.show}
      onChange={() => onChange(extraFilter)}
    />
  {/if}
  {#if 'new' in extraFilter && extraFilter.new.count > 0}
    <Checkbox
      icon="star"
      iconColor="yellow-text"
      badge={extraFilter.new.count}
      tooltip="Neue Produkte"
      bind:checked={extraFilter.new.show}
      onChange={() => onChange(extraFilter)}
    />
  {/if}
</ExtraFilterNav>
