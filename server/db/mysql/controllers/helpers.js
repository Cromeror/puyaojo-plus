import connect from '../connect'
import { unserialize } from 'php-unserialize'
export function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n)
}

export function convertACFs(rows) {
    var meta = {}
    if (rows && rows.length > 0) {
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i]
            if (row.meta_value && row.meta_key && row.meta_value != 'a:0:{}') {
                meta[row.meta_key] = row.meta_value.indexOf('a:') == 0 ? unserialize(row.meta_value) : row.meta_value
            }
        }
    }

    return meta
}

export function mysql_real_escape_string(str) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\" + char; // prepends a backslash to backslash, percent,
            // and double/single quotes
        }
    });
}

export function insertData(data, table) {
    var values = ''
    var fields = ''

    if (data) {
        for (var key in data) {
            fields += key + ","
            values += isNumeric(data[key]) ? data[key] + ',' : '"' + data[key] + '",'
        }

        if (fields.length > 0 && values.length) {
            fields = fields.slice(0, fields.length - 1)
            values = values.slice(0, values.length - 1)

            return connect.get().query('INSERT INTO ' + table + ' (' + fields + ') VALUES (' + values + ')')
        } else {
            return null
        }
    } else {
        return null
    }
}

export function updateValue(id, campo, valor, table) {
    if (id && campo && valor && table) {
        return connect.get().query('UPDATE ' + table + ' tpg SET ' + campo + ' = ? WHERE tpg.id = ?', [valor, id])
    } else {
        return null
    }
}

export function updateData(id, data, table, where = false) {
    var values = ''

    if (data && table) {
        for (var key in data) {
            values += key + ' = ' + (isNumeric(data[key]) ? data[key] + ',' : '"' + data[key] + '",')
        }

        var val = values.slice(0, values.length - 1)

        if (where) {
            var sql = 'UPDATE ' + table + ' tpa SET ' + val + where
        } else {
            var sql = 'UPDATE ' + table + ' tpa SET ' + val + ' WHERE tpa.id = ' + id
        }
        //console.log(sql)
        return connect.get().query(sql)
    } else {
        return null
    }
}