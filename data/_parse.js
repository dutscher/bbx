// https://www.bluebrixx.com/de/part-packs?bricklink_color=103
var colors = [];

Array.from($(".filter_bricklink_color option"))
    .map((option) => {
        colors.push(option)
    })

console.log(JSON.stringify(colors.sort(function(a, b) {
    return a.value.localeCompare(b.value, undefined, {
        numeric: true,
        sensitivity: 'base'
    });
}).map(color => [color.innerText]), null, 2));

// hex https://www.bricklink.com/catalogColors.asp?utm_content=subnav
var colors = [];
var colorsparsed = {};

Array.from($("table table table tr:not([bgcolor])"))
    .map((option) => {
        colors.push(option)
    })

colors.map(color => colorsparsed[color.querySelectorAll('font')[1].innerText.replace('&nbsp;', '').trim()] = color.querySelector('td[bgcolor]').getAttribute('bgcolor') + '|' + color.querySelector('td:first-child font').innerText.replace('&nbsp;', '').trim())
console.log(JSON.stringify(colorsparsed));

// https://www.bluebrixx.com/de/part-packs?&available_only=1
var all = $$('.category').map((e) => ({
    title: e.textContent.trim(),
    img:e.querySelector('img').getAttribute('src'),
    href: e.querySelector('a').getAttribute('href')}))

console.log(JSON.stringify(all))
