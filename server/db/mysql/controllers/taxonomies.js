import connect from '../connect'

export function getTaxonomies(params) {
    if (params && params.query && params.query.tax) {
        var args = params.query

        if (!args.lang) {
            args.lang = 'en'
        }

        var lang = (args && args.lang && args.lang == 'es') ? 13 : 10
        var select = "SELECT wt.term_id, wt.name, wt.slug, wtt.description, wtt.parent, wtt.count"
        var join = " FROM wp_terms wt" +
            " INNER JOIN wp_term_taxonomy wtt ON wtt.term_id = wt.term_id"
        var where = " WHERE wtt.taxonomy = ?"

        //image
        select += " ,(SELECT wpp.meta_value FROM wp_options wo" +
            " INNER JOIN wp_posts wp ON wp.ID = wo.option_value" +
            " INNER JOIN wp_postmeta wpp ON wpp.post_id = wp.ID" +
            " WHERE wo.option_name = CONCAT(wtt.taxonomy,'_', wtt.term_taxonomy_id, '_jts_image') AND wpp.meta_key = '_wp_attachment_metadata') AS image"

        //Spanish Description
        select += " ,(SELECT wpp.meta_value FROM wp_options wo" +
            " INNER JOIN wp_posts wp ON wp.ID = wo.option_value" +
            " INNER JOIN wp_postmeta wpp ON wpp.post_id = wp.ID" +
            " WHERE wo.option_name = CONCAT(wtt.taxonomy,'_', wtt.term_taxonomy_id, '_jts_description_spa') AND wpp.meta_key = '_wp_attachment_metadata') AS description_es"

        if (args.tax == 'category') {
            join += " INNER JOIN wp_term_relationships wtr ON wtr.object_id = wtt.term_taxonomy_id"
            where += " AND wtr.term_taxonomy_id = ?"

            //Translation
            join += " INNER JOIN wp_term_relationships AS pll_tr ON pll_tr.object_id = wt.term_id" +
                " INNER JOIN wp_term_taxonomy pll_wtt ON pll_wtt.term_taxonomy_id = pll_tr.term_taxonomy_id AND pll_wtt.taxonomy = 'term_translations'"

            select += ", pll_wtt.description as translations"

            //Post Type
            select += " ,(SELECT wo.option_value FROM wp_options wo" +
                " WHERE wo.option_name = CONCAT(wtt.taxonomy,'_', wtt.term_taxonomy_id, '_jts_tax_post_type')) AS post_type"
        }

        var order = " ORDER BY parent"
        var sql = select + join + where + order

        return connect.get().query(sql, [args.tax, lang])
    } else {
        return null
    }
}