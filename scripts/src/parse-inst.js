import fs from 'fs-extra';
import moment from 'moment';
import glob from 'glob';
import { JSDOM } from 'jsdom';
// versus
import cheerio from 'cheerio';
import { handleCache, getTextOfElement, printTime } from './utils.js';

const parsedInst = {};
// get latest file
const instPath = glob.sync('./data/inst/*.html')
    .map(name => ({name, ctime: fs.statSync(name).ctime}))
    .sort((a, b) => b.ctime - a.ctime)[0].name;

const parseInstJSDOM = async () => {
    const bbInstPath = 'https://www.bluebrixx.com/data/files/manuals';
    let content = fs.readFileSync(instPath, 'utf-8').replace(/(<style[\w\W]+style>)/g, '');
    const dom = new JSDOM(content);
    const items = Array.from(dom.window.document.querySelectorAll('table.inst tbody tr'));
    // fix bugs in /inst page
    // first is the correct id and the second the wrong in pdf name
    const corrector = {
        '102872': 102880,
    }

    items.map(item => {
        // <a ... data-itemno="401171">
        const id = item.querySelector('.cell-breakWord.show_on_wide a[data-itemno]');
        const manualLinks = Array.from(item.querySelectorAll(`td[style='text-align: left;'][class='cell-breakWord'] a`));
        //
        if (id) {
            const itemID = id.getAttribute('data-itemno');
            const isBB = getTextOfElement(id).includes('BLUEBRIXX');
            const manualsPdfs = [];
            manualLinks.map(link => {
                // https://www.bluebrixx.com/data/files/manuals/101/101903_Kommunikationsmodul.pdf
                // https://www.bluebrixx.com/data/files/manuals/102/BlueBrixx_Thankyou_Instructions.pdf
                // https://www.bluebrixx.com/data/files/manuals/100/100735%20-%20Manhattan%20Unit%208%20City%20Hall.pdf
                // https://www.bluebrixx.com/data/files/manuals/103/100735%20Manhattan%20Unit%208%20City%20Hall%20(20MB).pdf
                // https://www.bluebrixx.com/data/files/manuals/103/103046%20manhattan%20unit%2018%20border.pdf
                const href = link.getAttribute('href');
                let idParsed = parseInt(itemID);
                // correct the wrong pdf parsed id
                if (idParsed in corrector && corrector[idParsed] !== itemID) {
                    idParsed = itemID;
                }
                // concat all together
                const sortTitle = (a, b) => {
                    const titleA = a.replace(/Unit (\d{1}) /, 'Unit 0$1 ').replace(/\/\d{3}\/\d{6}/, '')
                    const titleB = b.replace(/Unit (\d{1}) /, 'Unit 0$1 ').replace(/\/\d{3}\/\d{6}/, '')
                    if (titleA < titleB) {
                        return -1;
                    }
                    if (titleA > titleB) {
                        return 1;
                    }
                    return 0;
                }

                const pdfHref = href.replace(bbInstPath, '');
                if (!(idParsed in parsedInst)) {
                    parsedInst[idParsed] = pdfHref;
                } else if (Array.isArray(parsedInst[idParsed]) && !parsedInst[idParsed].includes(pdfHref)) {
                    parsedInst[idParsed] = [...parsedInst[idParsed], pdfHref].sort(sortTitle);
                } else if (parsedInst[idParsed] !== pdfHref) {
                    parsedInst[idParsed] = [parsedInst[idParsed], pdfHref].sort(sortTitle);
                }
            });
            if (isBB && manualsPdfs.length > 0) {
                parsedInst[itemID] = manualsPdfs;
            }
        } else {
            //console.log(item);
            //console.log('item no id', item.textContent.trim().replace(/\t/g, ''))
        }
    });

    console.log('parsedInst', Object.keys(parsedInst).length)

    // write inst files
    await handleCache(
        './public/data/',
        `inst.json`,
        () => JSON.stringify(parsedInst, null, 2),
        true);
}

const parseInstCherrio = async () => {
    const bbInstPath = 'https://www.bluebrixx.com/data/files/manuals';
    let content = fs.readFileSync(instPath, 'utf-8');
    const $ = cheerio.load(content);
    const items = $('table.inst tbody tr');
    // fix bugs in /inst page
    // first is the correct id and the second the wrong in pdf name
    const corrector = {
        '102872': 102880,
    }

    items.map((index, item) => {
        // <a ... data-itemno="401171">
        const id = $(item).find('.cell-breakWord.show_on_wide a[data-itemno]');
        const manualLinks = $(item).find(`td[style='text-align: left;'][class='cell-breakWord'] a`);

        if (id.length > 0) {
            const itemID = $(id).attr('data-itemno');
            const isBB = getTextOfElement(id).includes('BLUEBRIXX');
            const manualsPdfs = [];
            manualLinks.map((index, link) => {
                // https://www.bluebrixx.com/data/files/manuals/101/101903_Kommunikationsmodul.pdf
                // https://www.bluebrixx.com/data/files/manuals/102/BlueBrixx_Thankyou_Instructions.pdf
                // https://www.bluebrixx.com/data/files/manuals/100/100735%20-%20Manhattan%20Unit%208%20City%20Hall.pdf
                // https://www.bluebrixx.com/data/files/manuals/103/100735%20Manhattan%20Unit%208%20City%20Hall%20(20MB).pdf
                // https://www.bluebrixx.com/data/files/manuals/103/103046%20manhattan%20unit%2018%20border.pdf
                const href = $(link).attr('href');
                let idParsed = parseInt(itemID);
                // correct the wrong pdf parsed id
                if (idParsed in corrector && corrector[idParsed] !== itemID) {
                    idParsed = itemID;
                }
                // concat all together
                const sortTitle = (a, b) => {
                    const titleA = a.replace(/Unit (\d{1}) /, 'Unit 0$1 ').replace(/\/\d{3}\/\d{6}/, '')
                    const titleB = b.replace(/Unit (\d{1}) /, 'Unit 0$1 ').replace(/\/\d{3}\/\d{6}/, '')
                    if (titleA < titleB) {
                        return -1;
                    }
                    if (titleA > titleB) {
                        return 1;
                    }
                    return 0;
                }

                const pdfHref = href.replace(bbInstPath, '');
                if (!(idParsed in parsedInst)) {
                    parsedInst[idParsed] = pdfHref;
                } else if (Array.isArray(parsedInst[idParsed]) && !parsedInst[idParsed].includes(pdfHref)) {
                    parsedInst[idParsed] = [...parsedInst[idParsed], pdfHref].sort(sortTitle);
                } else if (parsedInst[idParsed] !== pdfHref) {
                    parsedInst[idParsed] = [parsedInst[idParsed], pdfHref].sort(sortTitle);
                }
            });
            if (isBB && manualsPdfs.length > 0) {
                parsedInst[itemID] = manualsPdfs;
            }
        } else {
            //console.log(item);
            //console.log('item no id', item.textContent.trim().replace(/\t/g, ''))
        }
    });

    console.log('parsedInst', Object.keys(parsedInst).length)

    // write inst files
    await handleCache(
        './public/data/',
        `inst.json`,
        () => JSON.stringify(parsedInst, null, 2),
        true);
}

(async () => {
    const startDate = moment(new Date());

    await parseInstCherrio(); // 774ms
    //await parseInstJSDOM(); // 2196ms

    printTime('parseInst', startDate);
})()
