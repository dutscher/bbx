<script lang="ts">
  import {onMount} from 'svelte';

  let kofi;

  onMount(() => {
    kofiwidget2.init('Kaffeekasse', '#4c75b4', 'P5P48YJNR');
    kofi = kofiwidget2.getHTML();
  });
</script>

<div>
  <h2>Support</h2>
  {@html kofi}
</div>

<style lang="scss">
  @import '../scss/variables';
</style>
