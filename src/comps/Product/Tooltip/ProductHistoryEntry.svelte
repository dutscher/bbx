<script lang="ts">
  export let entry: any;
</script>

<div>
  {#if entry.newYear}
    <div>
      <b>--- {entry.newYear} ---</b>
    </div>
  {/if}
  <span class="date">
    {entry.formattedDate}
  </span>
  -
  <span>
    {#if entry.stateId === 0}
      <b>{entry.label}</b>
    {:else}
      {entry.label}
    {/if}
  </span>
  {#if entry.ago}<b>{entry.ago}</b>{/if}
</div>

<style lang="scss">
  .date {
    display: block;

    @media (min-width: 400px) {
      display: inline-block;
    }
  }
</style>
