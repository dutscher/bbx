<script lang="ts">
  import { onMount } from '../../utils';

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
  <div class="row small-space middle-align">
    <div class="col s12 m6">
      <div class="center-align">
        {@html kofi}
      </div>
    </div>
    <div class="col s12 m6">
      <div class="center-align middle-align">
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
</div>
