const helper = require('../helper.js');
const FirmaDao = require('./firmaDao.js');
const PersonDao = require('./personDao.js');

class TerminDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        const firmaDao = new FirmaDao(this._conn);
        const personDao = new PersonDao(this._conn);

        var sql = 'SELECT * FROM Termin WHERE id=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result)) 
            throw new Error('No Record found by id=' + id);

        var dt = helper.parseSQLDateTimeString(result.zeitpunkt);
        result.zeitpunkt = helper.formatToGermanDateTime(dt);
        result.millisekunden = { 'von': helper.formatToMilliseconds(dt), 'bis': helper.formatToMilliseconds(helper.modifyDateTime(dt, 0, 0, 0, 0, result.dauer, 0)), 'dauer': (result.dauer * 60 * 1000) };

        if (helper.isNull(result.dienstleisterId)) {
            result.dienstleister = null;
        } else {
            result.dienstleister = firmaDao.loadById(result.dienstleisterId);
        }
        delete result.dienstleisterId;

        if (helper.isNull(result.kundeId)) {
            result.kunde = null;
        } else {
            result.kunde = personDao.loadById(result.kundeId);
        }
        delete result.kundeId;

        return result;
    }

    loadAll() {
        const firmaDao = new FirmaDao(this._conn);
        const personDao = new PersonDao(this._conn);

        var sql = 'SELECT * FROM Termin';
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result)) 
            return [];

        for (var i = 0; i < result.length; i++) {
            var dt = helper.parseSQLDateTimeString(result[i].zeitpunkt);
            result[i].zeitpunkt = helper.formatToGermanDateTime(dt);
            result[i].millisekunden = { 'von': helper.formatToMilliseconds(dt), 'bis': helper.formatToMilliseconds(helper.modifyDateTime(dt, 0, 0, 0, 0, result[i].dauer, 0)), 'dauer': (result[i].dauer * 60 * 1000) };

            if (helper.isNull(result[i].dienstleisterId)) {
                result[i].dienstleister = null;
            } else {
                result[i].dienstleister = firmaDao.loadById(result[i].dienstleisterId);
            }
            delete result[i].dienstleisterId;

            if (helper.isNull(result[i].kundeId)) {
                result[i].kunde = null;
            } else {
                result[i].kunde = personDao.loadById(result[i].kundeId);
            }
            delete result[i].kundeId;

        }

        return result;
    }

    loadAllByDienstleister(id) {
        const firmaDao = new FirmaDao(this._conn);
        const personDao = new PersonDao(this._conn);
        var company = firmaDao.loadById(id);

        var sql = 'SELECT * FROM Termin WHERE dienstleisterId=?';
        var statement = this._conn.prepare(sql);
        var result = statement.all(id);

        if (helper.isArrayEmpty(result)) 
            return [];
        
        for (var i = 0; i < result.length; i++) {
            var dt = helper.parseSQLDateTimeString(result[i].zeitpunkt);
            result[i].zeitpunkt = helper.formatToGermanDateTime(dt);
            result[i].millisekunden = { 'von': helper.formatToMilliseconds(dt), 'bis': helper.formatToMilliseconds(helper.modifyDateTime(dt, 0, 0, 0, 0, result[i].dauer, 0)), 'dauer': (result[i].dauer * 60 * 1000) };

            if (helper.isNull(result[i].dienstleisterId)) {
                result[i].dienstleister = null;
            } else {
                result[i].dienstleister = firmaDao.loadById(result[i].dienstleisterId);
            }
            delete result[i].dienstleisterId;

            if (helper.isNull(result[i].kundeId)) {
                result[i].kunde = null;
            } else {
                result[i].kunde = personDao.loadById(result[i].kundeId);
            }
            delete result[i].kundeId;
        }

        return result;
    }

    

    loadAllByKunde(id) {
        const firmaDao = new FirmaDao(this._conn);
        const personDao = new PersonDao(this._conn);
        var company = firmaDao.loadById(id);

        var sql = 'SELECT * FROM Termin WHERE kundeId=?';
        var statement = this._conn.prepare(sql);
        var result = statement.all(id);

        if (helper.isArrayEmpty(result)) 
            return [];
        
        for (var i = 0; i < result.length; i++) {
            var dt = helper.parseSQLDateTimeString(result[i].zeitpunkt);
            result[i].zeitpunkt = helper.formatToGermanDateTime(dt);
            result[i].millisekunden = { 'von': helper.formatToMilliseconds(dt), 'bis': helper.formatToMilliseconds(helper.modifyDateTime(dt, 0, 0, 0, 0, result[i].dauer, 0)), 'dauer': (result[i].dauer * 60 * 1000) };

            if (helper.isNull(result[i].dienstleisterId)) {
                result[i].dienstleister = null;
            } else {
                result[i].dienstleister = firmaDao.loadById(result[i].dienstleisterId);
            }
            delete result[i].dienstleisterId;

            if (helper.isNull(result[i].kundeId)) {
                result[i].kunde = null;
            } else {
                result[i].kunde = personDao.loadById(result[i].kundeId);
            }
            delete result[i].kundeId;
        }

        return result;
    }

    loadRange(from, till, companyId = null) {
        const firmaDao = new FirmaDao(this._conn);
        const personDao = new PersonDao(this._conn);
        var companies = firmaDao.loadAll();

        if (helper.isNull(companyId)) {
            var sql = 'SELECT * FROM Termin WHERE zeitpunkt BETWEEN ? AND ?';
            var statement = this._conn.prepare(sql);
            var params = [helper.formatToSQLDateTime(from), helper.formatToSQLDateTime(till)];
        } else {
            var sql = 'SELECT * FROM Termin WHERE zeitpunkt BETWEEN ? AND ? AND dienstleisterId=?';
            var statement = this._conn.prepare(sql);
            var params = [helper.formatToSQLDateTime(from), helper.formatToSQLDateTime(till), companyId];
        }
        var result = statement.all(params);

        if (helper.isArrayEmpty(result)) 
            return [];
        
        for (var i = 0; i < result.length; i++) {
            var dt = helper.parseSQLDateTimeString(result[i].zeitpunkt);
            result[i].zeitpunkt = helper.formatToGermanDateTime(dt);
            result[i].millisekunden = { 'von': helper.formatToMilliseconds(dt), 'bis': helper.formatToMilliseconds(helper.modifyDateTime(dt, 0, 0, 0, 0, result[i].dauer, 0)), 'dauer': (result[i].dauer * 60 * 1000) };

            if (helper.isNull(result[i].dienstleisterId)) {
                result[i].dienstleister = null;
            } else {
                result[i].dienstleister = firmaDao.loadById(result[i].dienstleisterId);
            }
            delete result[i].dienstleisterId;

            if (helper.isNull(result[i].kundeId)) {
                result[i].kunde = null;
            } else {
                result[i].kunde = personDao.loadById(result[i].kundeId);
            }
            delete result[i].kundeId;
        }

        return result;
    }

    exists(id) {
        var sql = 'SELECT COUNT(id) AS cnt FROM Termin WHERE id=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt == 1) 
            return true;

        return false;
    }

    create(bezeichnung = '', beschreibung = '', zeitpunkt = null, dauer = 60, dienstleisterId = null, kundeId = null) {
        if (helper.isNull(zeitpunkt)) 
            zeitpunkt = helper.getNow();

        var sql = 'INSERT INTO Termin (bezeichnung,beschreibung,zeitpunkt,dauer,dienstleisterId,kundeId) VALUES (?,?,?,?,?,?)';
        var statement = this._conn.prepare(sql);
        var params = [bezeichnung, beschreibung, helper.formatToSQLDateTime(zeitpunkt), dauer, dienstleisterId, kundeId];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error('Could not insert new Record. Data: ' + params);

        return this.loadById(result.lastInsertRowid);
    }

    update(id, bezeichnung = '', beschreibung = '', zeitpunkt = null, dauer = 60, dienstleisterId = null, kundeId = null) {
        if (helper.isNull(zeitpunkt)) 
            zeitpunkt = helper.getNow();

        var sql = 'UPDATE Termin SET bezeichnung=?,beschreibung=?,zeitpunkt=?,dauer=?,dienstleisterId=?,kundeId=? WHERE id=?';
        var statement = this._conn.prepare(sql);
        var params = [bezeichnung, beschreibung, helper.formatToSQLDateTime(zeitpunkt), dauer, dienstleisterId, kundeId, id];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error('Could not update existing Record. Data: ' + params);

        return this.loadById(id);
    }

    delete(id) {
        try {
            var sql = 'DELETE FROM Termin WHERE id=?';
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
        console.log('TerminDao [_conn=' + this._conn + ']');
    }
}

module.exports = TerminDao;