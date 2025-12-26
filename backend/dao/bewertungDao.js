const helper = require('../helper.js');

class BewertungDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        var sql = 'SELECT * FROM Bewertung WHERE id=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result)) 
            throw new Error('No Record found by id=' + id);

        result.product = { id: result.productid };
        delete result.productid;
        return result;
    }

    loadAll() {
        var sql = 'SELECT * FROM Bewertung';
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result)) 
            return [];

        for (var i = 0; i < result.length; i++) {
            result[i].product = { id: result[i].productid };
            delete result[i].productid;
        }

        return result;
    }

    loadAllByParent(id) {
        var sql = 'SELECT * FROM Bewertung WHERE productid=?';
        var statement = this._conn.prepare(sql);
        var result = statement.all(id);

        if (helper.isArrayEmpty(result)) 
            return [];

        for (var i = 0; i < result.length; i++) {
            result[i].product = { id: result[i].productid };
            delete result[i].productid;
        }

        return result;
    }

    exists(id) {
        var sql = 'SELECT COUNT(id) AS cnt FROM Bewertung WHERE id=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt == 1) 
            return true;

        return false;
    }

    create(productid = 1, vorname = '', name = '', bewertung = null, rezension = '') {
        var sql = 'INSERT INTO Bewertung (productid,vorname,name,bewertung,rezension) VALUES (?,?,?,?,?)';
        var statement = this._conn.prepare(sql);
        var params = [productid, vorname, name, bewertung, rezension];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error('Could not insert new Record. Data: ' + params);

        return this.loadById(result.lastInsertRowid);
    }

    update(id, gerichtId = 1, punkte = 1, zeitpunkt = null, bemerkung = null, ersteller = null) {
        var sql = 'UPDATE Bewertung SET gerichtId=?,punkte=?,zeitpunkt=?,bemerkung=?,ersteller=? WHERE id=?';
        var statement = this._conn.prepare(sql);
        var params = [gerichtId, punkte, helper.formatToSQLDateTime(zeitpunkt), bemerkung, ersteller, id];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error('Could not update existing Record. Data: ' + params);

        return this.loadById(id);
    }

    delete(id) {
        try {
            var sql = 'DELETE FROM Bewertung WHERE id=?';
            var statement = this._conn.prepare(sql);
            var result = statement.run(id);

            if (result.changes != 1) 
                throw new Error('Could not delete Record by id=' + id);

            return true;
        } catch (ex) {
            throw new Error('Could not delete Record by id=' + id + '. Reason: ' + ex.message);
        }
    }

    deleteByParent(id) {
        try {
            var sql = 'DELETE FROM Bewertung WHERE gerichtId=?';
            var statement = this._conn.prepare(sql);
            var result = statement.run(id);

            return true;
        } catch (ex) {
            throw new Error('Could not delete Records by parent id=' + id + '. Reason: ' + ex.message);
        }
    }

    toString() {
        console.log('BewertungDao [_conn=' + this._conn + ']');
    }
}

module.exports = BewertungDao;