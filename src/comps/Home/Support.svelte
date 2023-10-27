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
          <strong>Danke an unsere Supporter:</strong> Brick_Addicted, Andre, Jens Jensen, Andy, Schorse, Brickmicha & 2x
          Anonym
        </div>
      </div>
    </div>
  </div>
</div>
