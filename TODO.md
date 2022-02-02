* firefox zoom bug https://bbx.watch/?tags=burg-blaustein
* tooltip left edge case, small device
* filter for hot, new
* warenkorb noise ausblenden
* history back not going
* changelog visualisieren
* sapper server side
* pdf download proxy
* unit tests getTags
* 13 vulnerabilities (7 moderate, 6 high)
* notifications
  * store empty maybe sw ask svelte and ping pong
  * settings and store in serviceworker
* live api changes:
  * tags use cats-n-tags script
  * notifications on live
* bbx special 613 (https://www.bluebrixx.com/de/bluebrixxspecials?limit=613) vs 1299 (https://bbx.watch/#tags=special)

* planer: https://klemmbauer.de/bibliothek.html
* cart call?
  * push to cart: GET: https://www.bluebrixx.com/views/addtocart.php?itemno=103897
* page watcher: https://www.facebook.com/groups/435441033546028/posts/1147355199021271/
  * https://github.com/RoBrDev/BBAC

// great refactoring:
// XTODO1: take all bluebrixx edges an pack into history.file
// XTODO2: update mergeChangesWithDB
// XTODO: keep old changes for products with no history
// XTODO: update app with new history timestamps
// XTODO: keep old history for new fetch
// TODO: add old announce history? entries
// XTODO3: repair live changes.ts
// XTODO4: repair parsePage with cheerio
// TODO: parse cats for existing products
