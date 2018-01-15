import { getTaxonomies } from './taxonomies'
import { getListings } from './listings'
var fs = require('fs')

export function getXml(req, res) {
    var xml = ''

    getAllTaxonomies(req).then(data => {
        xml += '<?xml version="1.0" encoding="UTF-8"?>'
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'

        for (var url of data) {
            xml += '<url><loc>' + url.loc + '</loc><lastmod>' + url.lastmod + '</lastmod><changefreq>' + url.changefreq + '</changefreq><priority>' + url.priority + '</priority></url>'
        }

        xml += '</urlset>'

        /*res.set('Content-Type', 'text/xml')
        res.send(xml)*/
        fs.writeFile('public/sitemap.xml', xml, (err) => {
            if (err) throw err

            res.send('<h3>¡Sitemap was successfully generated!</h3><p>' + data.length + ' entries created.</p>')
        })
    })
}

function getAllTaxonomies(req) {
    var cat_en = { query: { tax: 'category', lang: 'en' } }
    var cat_es = { query: { tax: 'category', lang: 'es' } }

    return Promise.all([getTaxonomies(cat_en), getTaxonomies(cat_es)]).then(data => {
        var langs = { '0': 'en', '1': 'es' }
        var response = {
            en: { taxonomies: {}, byParent: {} },
            es: { taxonomies: {}, byParent: {} }
        }

        for (var lang in langs) {
            for (var cat of data[lang]) {
                response[langs[lang]]['taxonomies'][cat.term_id] = cat

                if (cat.parent != 0) {
                    response[langs[lang]]['byParent'][cat.parent].push(cat.slug)
                }

                if (cat.parent == 0 && !response[langs[lang]]['byParent'][cat.term_id]) {
                    response[langs[lang]]['byParent'][cat.term_id] = []
                }
            }
        }

        return getAllCatsAndPosts(req, response)
    })
}

function getAllCatsAndPosts(req, data) {
    var urls = []
    var host = req.get('host')
    var yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    var month = yesterday.getMonth() + 1
    var day = yesterday.getDate()

    var posts = []

    for (var lang in data) {
        /* Index/Home */
        urls.push({
            loc: 'https://' + host + (lang === 'es' ? '/es' : ''),
            lastmod: yesterday.getFullYear() + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day),
            changefreq: 'daily',
            priority: '1.0'
        })

        var tax = data[lang]['taxonomies']
        for (var parent in data[lang]['byParent']) {
            /* Categories */
            if (tax[parent].slug != 'sin-categorizar' && tax[parent].slug != ('uncategorized-' + lang)) {
                var args = {
                    city: 'cartagena',
                    lang: lang,
                    cat: tax[parent].slug
                }

                if (tax[parent].slug === 'donde') {
                    args['showDonde'] = true;
                }

                if (tax[parent].slug === 'events' || tax[parent].slug === 'eventos') {
                    args['notToday'] = true
                }

                posts.push(getListings(args))

                if (tax[parent].slug != 'donde') {
                    urls.push({
                        loc: 'https://' + host + (lang === 'es' ? '/es/cartagena/' : '/cartagena/') + tax[parent].slug,
                        lastmod: yesterday.getFullYear() + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day),
                        changefreq: 'daily',
                        priority: '0.9'
                    })
                }
            }

            /* Sub categories*/
            var cat = data[lang]['byParent'][parent]
            if (cat.length > 0) {
                for (var subcat in cat) {
                    urls.push({
                        loc: 'https://' + host + (lang === 'es' ? '/es/cartagena/' : '/cartagena/') + tax[parent].slug + '?subcats=' + cat[subcat],
                        lastmod: yesterday.getFullYear() + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day),
                        changefreq: 'daily',
                        priority: '0.9'
                    })
                }
            }
        }
    }

    return Promise.all(posts).then(rows => {
        for (var row of rows) {
            for (var post of row) {
                var date = new Date(post.post_date)
                var month = yesterday.getMonth() + 1
                var day = yesterday.getDate()
                var category = post.category_slug
                var noSubcat = ['eventos', 'articulos', 'donde', 'articles', 'events']
                if (post.category_slug === 'donde') {
                    category = (post.language === 'es') ? 'articulos' : 'articles'
                }
                var subcategory = (post.language === 'es') ? ((noSubcat.indexOf(post.category_slug) !== -1) ? '' : '/' + post.subcategory_slug) : ((noSubcat.indexOf(post.category_slug)) ? '' : '/' + post.subcategory_slug)

                urls.push({
                    loc: 'https://' + host + (post.language === 'es' ? '/es/cartagena/' : '/cartagena/') + category + (subcategory ? subcategory : '') + '/' + post.slug + '-' + post.wp_id,
                    lastmod: date.getFullYear() + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day),
                    changefreq: 'monthly',
                    priority: '0.5'
                })
            }
        }
        return urls
    })
}

export default {
    getXml
}