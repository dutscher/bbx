<script lang="ts">
  export let checked = false;
  export let disabled = false;
  export let onChange = () => {};
  export let label = '';
  export let icon = '';
  export let iconColor = 'yellow-text';
  export let tooltip = '';
  export let badge = '';
</script>

<label class="checkbox">
  <input type="checkbox" {disabled} bind:checked on:change={e => onChange(e)} />
  <span>
    {label}
    {#if !!icon} <i class={iconColor}>{icon}</i>{/if}
    {#if !!tooltip}<div class="tooltip bottom small-margin">{tooltip}</div>{/if}
    {#if !!badge}<span class="badge round">{badge}</span>{/if}
  </span>
</label>
