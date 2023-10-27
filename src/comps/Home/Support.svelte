<script lang="ts">
  import { onMount } from '@utils';

  let kofi;

  onMount(() => {
    // @ts-ignore
    kofiwidget2.init('Kaffeekasse', '#4c75b4', 'P5P48YJNR');
    // @ts-ignore
    kofi = kofiwidget2.getHTML();
  });
</script>

<div>
  <h2>Support & Partner</h2>
  <div class="row small-space">
    <div class="col s12 m6">
      <div class="center-align middle-align">
        {@html kofi}
        <div>
          <strong>Danke an unsere Kaffeespender:</strong>
          Brick_Addicted, Andre, Jens Jensen, Andy, Schorse, Brickmicha & 2x Anonym, Michael W.
        </div>
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  :global .btn-container {
    min-width: auto;
  }
</style>
