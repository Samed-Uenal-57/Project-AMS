const helper = require('../helper.js');

const AdresseDao = require('./adresseDao.js');
const ZahlungsartDao = require('./zahlungsartDao.js');

class BestellungDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
       
        const adresseDao = new AdresseDao(this._conn);
        const zahlungsartDao = new ZahlungsartDao(this._conn);

        var sql = 'SELECT * FROM Bestellung WHERE id=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result)) 
            throw new Error('No Record found by id=' + id);


        if (helper.isNull(result.adresseId)) {
            result.besteller = null;
        } else {
            result.besteller = adresseDao.loadById(result.adresseId);
        }
        delete result.adresseId;

        result.zahlungsart = zahlungsartDao.loadById(result.zahlungId);
        delete result.zahlungId;

        
  
      
        /*
        result.total.netto = helper.round(result.total.netto);
        result.total.brutto = helper.round(result.total.brutto);
        result.total.mehrwertsteuer = helper.round(result.total.mehrwertsteuer);


        */
        return result;
    }

    loadAll() {
        
        const adresseDao = new AdresseDao(this._conn);
        const zahlungsartDao = new ZahlungsartDao(this._conn);

        var sql = 'SELECT * FROM Bestellung';
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result)) 
            return [];

        for (var i = 0; i < result.length; i++) {
            //result[i].datum = helper.formatToGermanDateTime(helper.parseSQLDateTimeString(result[i].datum));

            if (helper.isNull(result[i].adresseId)) {
                result[i].besteller = null;
            } else {
                result[i].besteller = adresseDao.loadById(result[i].adresseId);
            }
            delete result[i].adresseId;

            result[i].zahlungsart = zahlungsartDao.loadById(result[i].zahlungId);
            delete result[i].zahlungId;

            
            

            
        }

        return result;
    }

    exists(id) {
        var sql = 'SELECT COUNT(id) AS cnt FROM Bestellung WHERE id=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt == 1) 
            return true;

        return false;
    }

    create(adresseId='', zahlungId='', datum='', gesamtpreis='') {
   

        

        var sql = 'INSERT INTO Bestellung (adresseId, zahlungId, datum, gesamtpreis) VALUES (?,?,?,?)';
        var statement = this._conn.prepare(sql);
        var params = [adresseId, zahlungId, datum, gesamtpreis];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error('Could not insert new Record. Data: ' + params);



        return this.loadById(result.lastInsertRowid);
    }

    

    delete(id) {
        try {
            

            var sql = 'DELETE FROM Bestellung WHERE id=?';
            var statement = this._conn.prepare(sql);
            var result = statement.run(id);

            if (result.changes != 1) 
                throw new Error('Could not delete Record by id=' + id);

            return true;
        } catch (ex) {
            throw new Error('Could not delete Record by id=' + id + '. Reason: ' + ex.message);
        }
    }

    // extract the single tax parts and return as array of objects
    getTaxParts(pos) {
        var arr = [];
        var idx = -1;

        // walk all positions
        for (var x = 0; x < pos.length; x++) {
            // find item
            idx = -1;
            for (var i = 0; i < arr.length; i++) {
                if (pos[x].produkt.mehrwertsteuer.id == arr[i].mehrwertsteuer.id) {
                    idx = i;
                    break;
                }
            }

            // if not found add entry, otherwise sum up
            if (idx == -1) {
                arr.push({
                    mehrwertsteuer: pos[x].produkt.mehrwertsteuer,
                    anteil: pos[x].mehrwertsteuersumme
                });
            } else {
                arr[idx].anteil += helper.round(pos[x].mehrwertsteuersumme);
            }
        }
        
        return arr;
    }

    toString() {
        console.log('BestellungDao [_conn=' + this._conn + ']');
    }
}

module.exports = BestellungDao;