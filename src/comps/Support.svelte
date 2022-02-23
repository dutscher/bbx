<script lang="ts">
  import { onMount } from 'svelte';

  let kofi;

  onMount(() => {
    kofiwidget2.init('Kaffeekasse', '#4c75b4', 'P5P48YJNR');
    kofi = kofiwidget2.getHTML();
  });
</script>

<div>
  <h2>Support & Partner</h2>
  <div class="row no-wrap middle-align">
    <div class="col">
      {@html kofi}
    </div>
    <div class="col">
      <!--
            Paypal Kaffeekasse
            <form action="https://www.paypal.com/donate" method="post" target="_top">
                <input type="hidden" name="hosted_button_id" value="SKL792JENYRM2" />
                <input type="image" src="https://www.paypalobjects.com/de_DE/DE/i/btn/btn_donate_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Spenden mit dem PayPal-Button" />
                <img alt="" border="0" src="https://www.paypal.com/de_DE/i/scr/pixel.gif" width="1" height="1" />
            </form>
            -->

      <a href="//www.noppensteinnews.de/" target="_blank" title="Partner: Noppensteinnews">
        <img src="/images/partner/noppensteinnews.png" alt="Noppensteinnews" width="150" />
      </a>
    </div>
  </div>
</div>

<style lang="scss">
  @import '../scss/variables';
</style>
