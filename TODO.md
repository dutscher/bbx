* filter for hot, new
* multiple heart list
* warenkorb noise ausblenden
* history back not going
* noppen an tags
* changelog visualisieren
* sapper server side
* pdf download proxy
* unit tests getTags
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

npm WARN deprecated har-validator@5.1.5: this library is no longer supported
npm WARN deprecated rollup-plugin-replace@2.2.0: This module has moved and is now available at @rollup/plugin-replace. Please update your dependencies. This version is no longer maintained.
npm WARN deprecated uuid@3.4.0: Please upgrade  to version 7 or higher.  Older versions may use Math.random() in certain circumstances, which is known to be problematic.  See https://v8.dev/blog/math-random for details.
npm WARN deprecated request@2.88.2: request has been deprecated, see https://github.com/request/request/issues/3142
npm WARN deprecated tar@2.2.2: This version of tar is no longer supported, and will not receive security updates. Please upgrade asap.

run `npm fund` for details
* 13 vulnerabilities (7 moderate, 6 high)
* -> 18 vulnerabilities (8 moderate, 10 high)
  npm audit
  npm audit fix
  npm audit fix --force
