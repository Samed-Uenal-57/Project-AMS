const helper = require('../helper.js');

class KontaktFormularDao{
    constructor(dbConnection){
        this._conn = dbConnection;
    }
    getConnection(){
        return this._conn;
    }
    loadById(id){
        var sql = 'SELECT * FROM Kontaktformular WHERE id=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);
        if (helper.isUndefined(result)) 
            throw new Error('No Record found by id=' + id);
        return result;
    }

    loadAll(){
       var sql = 'SELECT * FROM Kontaktformular';
        var statement = this._conn.prepare(sql);
        var result = statement.all();
        return result; 
    }
    create(vorname = '', name = '', mail = '', nachricht = ''){
        var sql = 'INSERT INTO Kontaktformular (vorname, name, mail, nachricht) VALUES (?,?,?,?)';
        var statement = this._conn.prepare(sql);
        var params = [vorname, name, mail, nachricht];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error('Could not insert new Record. Data: ' + params);

        return this.loadById(result.lastInsertRowid);
    }
    toString(){
        console.log('KontaktformularDao [_conn= ' +this._conn + ']');
    }
}

module.exports = KontaktFormularDao;