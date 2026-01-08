const helper = require('../helper.js');


class AdresseDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        
        var sql = 'SELECT * FROM Adresse WHERE id=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);


        return result;
    }

    loadAll() {
        var sql = 'SELECT * FROM Adresse';
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        /*if (helper.isArrayEmpty(result)) 
            return [];

        for (var i = 0; i < result.length; i++) {
            result[i].land = landDao.loadById(result[i].landId);
            delete result[i].landId;            
        }
        */
        return result;
    }

    exists(id) {
        var sql = 'SELECT COUNT(id) AS cnt FROM Adresse WHERE id=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt == 1) 
            return true;

        return false;
    }

    create(vorname = '', name = '',strasse = '', plz = '', stadt = '', land = '') {
        var sql = 'INSERT INTO Adresse (vorname,name,strasse,plz,stadt,land) VALUES (?,?,?,?,?,?)';
        var statement = this._conn.prepare(sql);
        var params = [vorname, name, strasse, plz, stadt, land];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error('Could not insert new Record. Data: ' + params);

        return this.loadById(result.lastInsertRowid);
    }

    update(id, vorname= '', name = '', strasse = '', plz = '', stadt = '', land = '') {
        var sql = 'UPDATE Adresse SET strasse=?,hausnummer=?,adresszusatz=?,plz=?,ort=?,landId=? WHERE id=?';
        var statement = this._conn.prepare(sql);
        var params = [vorname, name, strasse, plz, stadt, land, id];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error('Could not update existing Record. Data: ' + params);

        return this.loadById(id);
    }

    delete(id) {
        try {
            var sql = 'DELETE FROM Adresse WHERE id=?';
            var statement = this._conn.prepare(sql);
            var result = statement.run(id);

            if (result.changes != 1) 
                throw new Error('Could not delete Record by id=' + id);

            return true;
        } catch (ex) {
            throw new Error('Could not delete Record by id=' + id + '. Reason: ' + ex.message);
        }
    }

    toString() {
        console.log('AdresseDao [_conn=' + this._conn + ']');
    }
}

module.exports = AdresseDao;