beer css:
* logo?
* navi bottom?
* schöneres theme
  * material-dynamic-colors not going https://github.com/beercss/beercss/blob/main/docs/SETTINGS.md#dynamic-theme
  x lila icons zu blau wie github
  * komische rem's?
* page höhe nicht stacked?
* home
  * tags & produkte klickbar zu produkte page
  X support partner mittig
  * news loaded on visible
  * card toggle ganzflächig
* merkliste
  X title bold
  X description mittig
  * default soll nicht schließbar sein
  * edit?
  x delete icon
  * container overflow?
* produkte
  * tags
    x chip letter github blau
    * produkte headline plus details, filter & sortieren mobil kaputt
  * produkt tooltip
    * bild hochkant? abgeschnitten
    * merklisten herz 
    * text farbe (light)
    * linheight stimmt nicht
    * links haben keinen abstand
* status 
  * nix zufinden
* aktuelles
  X datepicker in card
  * tooltip overflow vom container
  X checkbox vertical align to text
  

next todos:
* wo ist neuschwanstein 101887 ?
  * war weg wegen mini trophy
  * get all history of neuschwanstein
  * xingbao product
* live api changes
  * tags use cats-n-tags script
  * ios pwa notifications
* pdf download proxy -> weiterleitung auf external storage?
  * email schreiben
* typescript types
  * same interfaces node + svelte
* split cache
  * bb resources
  * app reources
* sort in url
* filter for hot, new
* verical images to high ?product=102628
* scroll to of tooltip with more padding top  
* cypress tests
* neues design
* navigationbar
* warenkorb noise ausblenden
* history back not going
* noppen an tags
* share merkliste über mehrere geräte
* sapper server side
* cart call?
  * push to cart: GET: https://www.bluebrixx.com/views/addtocart.php?itemno=103897
* remove warning:
  (node:18656) [DEP0148] DeprecationWarning: Use of deprecated folder mapping "./" in the "exports" field module resolution of the package at C:\www\repos\dutscher\bbx\node_modules\tslib\package.json.
  Update this package.json to use a subpath pattern like "./*".
  (Use `node --trace-deprecation ...` to show where the warning was created)
  https://github.com/postcss/postcss/issues/1455

  
analyse:
* bbx special 667 (https://www.bluebrixx.com/de/bluebrixxspecials?limit=667) vs 1364 (https://bbx.watch/#tags=special)
  * 533 chrome
  * 667 + 533 = 1200
  * bluebrixx parts exclude 
    ?tags=special&product=607491
    ?tags=special&product=400156
  
misc:
* planer: https://klemmbauer.de/bibliothek.html
* page watcher: https://www.facebook.com/groups/435441033546028/posts/1147355199021271/
  * https://github.com/RoBrDev/BBAC
