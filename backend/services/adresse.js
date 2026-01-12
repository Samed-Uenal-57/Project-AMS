const helper = require('../helper.js');
const AdresseDao = require('../dao/adresseDao.js');
const express = require('express');
var serviceRouter = express.Router();

console.log('- Service Adresse');

serviceRouter.get('/adresse/gib/:id', function(request, response) {
    console.log('Service Adresse: Client requested one record, id=' + request.params.id);

    const adresseDao = new AdresseDao(request.app.locals.dbConnection);
    try {
        var obj = adresseDao.loadById(request.params.id);
        console.log('Service Adresse: Record loaded');
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service Adresse: Error loading record by id. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.get('/adresse/alle', function(request, response) {
    console.log('Service Adresse: Client requested all records');

    const adresseDao = new AdresseDao(request.app.locals.dbConnection);
    try {
        var arr = adresseDao.loadAll();
        console.log('Service Adresse: Records loaded, count=' + arr.length);
        response.status(200).json(arr);
    } catch (ex) {
        console.error('Service Adresse: Error loading all records. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.get('/adresse/existiert/:id', function(request, response) {
    console.log('Service Adresse: Client requested check, if record exists, id=' + request.params.id);

    const adresseDao = new AdresseDao(request.app.locals.dbConnection);
    try {
        var exists = adresseDao.exists(request.params.id);
        console.log('Service Adresse: Check if record exists by id=' + request.params.id + ', exists=' + exists);
        response.status(200).json({'id': request.params.id, 'existiert': exists});
    } catch (ex) {
        console.error('Service Adresse: Error checking if record exists. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.post('/adresse', function(request, response) {
    console.log('Service Adresse: Client requested creation of new record');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.vorname)) 
        errorMsgs.push('strasse fehlt');
    if (helper.isUndefined(request.body.nachname)) 
        errorMsgs.push('hausnummer fehlt');
    if (helper.isUndefined(request.body.strasse)) 
        
    if (helper.isUndefined(request.body.plz)) 
        errorMsgs.push('plz fehlt');
    if (helper.isUndefined(request.body.stadt)) 
        errorMsgs.push('ort fehlt');
    if (helper.isUndefined(request.body.land)) {
        errorMsgs.push('land fehlt');
    }
    if (errorMsgs.length > 0) {
        console.log('Service Adresse: Creation not possible, data missing');
        response.status(400).json({ 'fehler': true, 'nachricht': 'Funktion nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs) });
        return;
    }

    const adresseDao = new AdresseDao(request.app.locals.dbConnection);
    try {
        var obj = adresseDao.create(request.body.vorname, request.body.nachname, request.body.adresse, request.body.plz, request.body.stadt, request.body.land);
        console.log('Service Adresse: Record inserted');
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service Adresse: Error creating new record. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }    
});


module.exports = serviceRouter;