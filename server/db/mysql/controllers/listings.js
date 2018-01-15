import connect from '../connect'

const postTypes = {
    'accommodation': ['hotels-and-accommodation', 'hoteles-y-acomodacion', 'vacation-home-rentals', 'casas-vacacionales'],
    'boats': ['yachts-boats-rentals', 'alquiler-yates-botes'],
    'tours-activities': ['tours-activities', 'tours-actividades'],
    'events': ['events', 'eventos'],
    'food-drink': ['food-drink', 'comida-bebida', 'nightlife', 'vida-nocturna'],
    'shopping': ['shopping', 'comercio-compras'],
    'place': ['sights-attractions', 'lugares-de-interes'],
    'blog': ['travel-articles', 'blog-experiencias']
}

export function getListings(args, expedia = false) {
    if (args) {
        if (!args.lang) {
            args.lang = 'en'
        }

        var isArticles = args.cat === 'articles' || args.cat === 'articulos'

        var select = "SELECT DISTINCT jts.wp_id, jts.language, jts.category, jts.category_slug, jts.subcategory, jts.subcategory_slug, jts.duration," +
            " jts.period, jts.capacity, jts.hierarchy, jts.expedia_id, jts.hotel_class, jts.address, jts.location, jts.location_slug," +
            " jts.sublocation, jts.sublocation_slug,jts.lat, jts.lng, jts.price_usd, jts.price_cop, IFNULL(jts.rating,0) as rating, jts.thumbnail_url," +
            " jts.businesses_price, jts.food_type, wp.post_status AS status, wp.post_title AS title, wp.post_name AS slug," +
            " wp.post_content AS post_content, wp.post_type, wp.post_date, DATE_FORMAT(jts.start_date,'%Y-%m-%d %H:%i') AS start_date," +
            " DATE_FORMAT(jts.end_date,'%Y-%m-%d %H:%i') AS end_date"
        var join = ' FROM jts_posts jts INNER JOIN wp_posts AS wp ON wp.ID = jts.wp_id'
        var where = ' WHERE wp.post_status = "publish"'
        var orderby = ' ORDER BY'
        var limit = ''

        if (!args.showDonde) {
            where += ' AND category_slug != "donde"'
        }

        // Categories
        join += ' INNER JOIN wp_term_relationships wtr_cat1 ON wp.ID = wtr_cat1.object_id' +
            ' INNER JOIN wp_term_taxonomy wtt_cat1 ON wtt_cat1.term_taxonomy_id = wtr_cat1.term_taxonomy_id AND wtt_cat1.taxonomy = "category"' +
            ' INNER JOIN wp_terms wt_cat1 ON wt_cat1.term_id = wtt_cat1.term_id'

        //By Category
        if (isArticles) {
            where += ' AND wp.post_type = "post"'
            orderby += ' wp.post_date DESC'
        } else if (args.subcats || args.cat) {
            //var sql = (args.subcat || args.subcats) ? ' AND subcategory_slug IN (' : ' AND category_slug IN ('
            var cat = args.cat //args.subcat ? args.subcat : args.cat
            var cats = '"' + cat + '"' //args.subcats ? '"' + args.subcats.join('","') + '"' : '"' + cat + '"'
            where += ' AND wt_cat1.slug IN (' + cats + ')'


            var events = ['events', 'eventos']
            var isEvent = events.indexOf(args.cat) !== -1 ? true : false

            if (isEvent) {
                join += ' LEFT JOIN wp_postmeta cost ON cost.post_id = wp_id AND cost.meta_key = "jts_event_free"'
                select += ', cost.meta_value as is_free'
            }
            /*if (args.cat == 'donde') {
                where = ' WHERE wp.post_status = "draft"'
                where += sql + cats + ')'
            }*/
        }

        // See only public content
        join += ' LEFT JOIN wp_postmeta target ON target.post_id = wp_id AND target.meta_key = "jts_target"'
        select += ', target.meta_value as target'
        where += ' AND IFNULL(target.meta_value,"public") != "private"'

        if (args.cat_id) {
            join += ' INNER JOIN wp_terms wt_cat11 ON wt_cat11.term_id = ' + args.cat_id + ' AND wt_cat11.slug = jts.category_slug'
        }

        if (args.per_page) {
            limit = ' LIMIT 0,' + args.per_page
        }

        if (args.itemIds) {
            where += ' AND wp_id in (' + args.itemIds + ')'
        } else {
            where += ' AND language = "' + args.lang + '"'
        }

        if (args.s) {
            where += ' AND (jts.category LIKE "%%' + args.s + '%%" OR wp.post_title LIKE "%%' + args.s + '%%")'
        }

        if (args.city) {
            //where += ' AND location = "' + args.city + '"'
        }

        if (args.capacity && args.cat) {
            var cap = args.capacity
            cap = cap[cap.length - 1]
            where += ' AND capacity >= ' + cap
        }

        if (args.price && args.cat) {
            where += ' AND ('

            if (postTypes['tours-activities'].indexOf(args.cat) != -1) {
                for (var key in args.price) {
                    switch (args.price[key]) {
                        case '$':
                            where += 'price_usd > 0 && price_usd <= 50'
                            break
                        case '$$':
                            where += 'price_usd > 50 && price_usd <= 100'
                            break
                        case '$$$':
                            where += 'price_usd > 100 && price_usd <= 200'
                            break
                        case '$$$$':
                            where += 'price_usd > 200'
                            break
                    }

                    if (key < args.price.length - 1) where += ' OR '
                }

            } else if (postTypes['boats'].indexOf(args.cat) != -1) {
                for (var key in args.price) {
                    switch (args.price[key]) {
                        case '$':
                            where += 'price_usd > 0 && price_usd <= 500'
                            break
                        case '$$':
                            where += 'price_usd > 500 && price_usd <= 1000'
                            break
                        case '$$$':
                            where += 'price_usd > 1000 && price_usd <= 1500'
                            break
                        case '$$$$':
                            where += 'price_usd > 1500'
                            break
                    }

                    if (key < args.price.length - 1) where += ' OR '
                }

            } else if (postTypes['accommodation'].indexOf(args.cat) != -1) {
                for (var key in args.price) {
                    switch (args.price[key]) {
                        case '$':
                            where += 'price_usd > 0 && price_usd <= 150'
                            break
                        case '$$':
                            where += 'price_usd > 150 && price_usd <= 300'
                            break
                        case '$$$':
                            where += 'price_usd > 300 && price_usd <= 450'
                            break;
                        case '$$$$':
                            where += 'price_usd > 450'
                            break
                    }

                    if (key < args.price.length - 1) where += ' OR '
                }
            }

            where += ')'
        }

        //var today2 = Math.round(+new Date() / 1000)
        var today = new Date()
        var day = today.getDate()
        var month = (today.getMonth() + 1)
        day = (day < 10) ? ('0' + day) : day
        month = (month < 10) ? ('0' + month) : month
        today = today.getFullYear() + '-' + month + '-' + day

        if (args.date) {
            var end_date = new Date(args.date)
            var day2 = end_date.getDate()
            var month2 = (end_date.getMonth() + 1)
            day2 = (day2 < 10) ? ('0' + day2) : day2
            month2 = (month2 < 10) ? ('0' + month2) : month2
            end_date = end_date.getFullYear() + '-' + month2 + '-' + day2
            //var end_date = Math.round(+new Date(date.getFullYear(, (date.getMonth() - 1), date.getDate()) / 1000)

            where += " AND  ((start_date < '" + today + "' AND end_date > '" + today + "') OR (start_date >= '" + today + "' AND start_date <= '" + end_date + " 24:00'))"
        } else if (!args.itemIds && !args.notToday) {
            where += " AND IF(wp.post_type = 'event', IF(start_date >= '" + today + "' OR end_date >= '" + today + "',1,0), 1) = 1"
        }

        /* Order by */
        if (args.orderBy) {
            switch (args.orderBy) {
                case 'price_low':
                    orderby += ' price_usd ASC'
                    break;

                case 'price_high':
                    orderby += ' price_usd DESC'
                    break;

                default:
                    orderby += ' ' + args.orderBy + ' DESC'
                    break;
            }
        } else if (args.itemIds) {
            orderby += ' FIELD(wp.ID,' + args.itemIds + ')'
        } else if (!isArticles) {
            orderby += ' hierarchy DESC'
        }

        var sql = select + join + where + orderby + limit
        //console.log(sql)
        return connect.get().query(sql)
    } else {
        return null
    }
}