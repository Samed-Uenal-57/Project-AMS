const helper = require('../helper.js');
const BestellungDao = require('../dao/bestellungDao.js');
const express = require('express');
var serviceRouter = express.Router();

console.log('- Service Bestellung');

serviceRouter.get('/bestellung/gib/:id', function(request, response) {
    console.log('Service Bestellung: Client requested one record, id=' + request.params.id);

    const bestellungDao = new BestellungDao(request.app.locals.dbConnection);
    try {
        var obj = bestellungDao.loadById(request.params.id);
        console.log('Service Bestellung: Record loaded');
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service Bestellung: Error loading record by id. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.get('/bestellung/alle', function(request, response) {
    console.log('Service Bestellung: Client requested all records');

    const bestellungDao = new BestellungDao(request.app.locals.dbConnection);
    try {
        var arr = bestellungDao.loadAll();
        console.log('Service Bestellung: Records loaded, count=' + arr.length);
        response.status(200).json(arr);
    } catch (ex) {
        console.error('Service Bestellung: Error loading all records. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.get('/bestellung/existiert/:id', function(request, response) {
    console.log('Service Bestellung: Client requested check, if record exists, id=' + request.params.id);

    const bestellungDao = new BestellungDao(request.app.locals.dbConnection);
    try {
        var exists = bestellungDao.exists(request.params.id);
        console.log('Service Bestellung: Check if record exists by id=' + request.params.id + ', exists=' + exists);
        response.status(200).json({'id': request.params.id, 'existiert': exists});
    } catch (ex) {
        console.error('Service Bestellung: Error checking if record exists. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.post('/bestellung', function(request, response) {
    console.log('Service Bestellung: Client requested creation of new record');

    const bestellungDao = new BestellungDao(request.app.locals.dbConnection);
    try {
        var obj = bestellungDao.create(request.body.adresseId, request.body.zahlungId,request.body.datum, request.body.gesamtpreis);
        console.log('Service Bestellung: Record inserted');
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service Bestellung: Error creating new record. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});



serviceRouter.delete('/bestellung/:id', function(request, response) {
    console.log('Service Bestellung: Client requested deletion of record, id=' + request.params.id);

    const bestellungDao = new BestellungDao(request.app.locals.dbConnection);
    try {
        var obj = bestellungDao.loadById(request.params.id);
        bestellungDao.delete(request.params.id);
        console.log('Service Bestellung: Deletion of record successfull, id=' + request.params.id);
        response.status(200).json({ 'gelöscht': true, 'eintrag': obj });
    } catch (ex) {
        console.error('Service Bestellung: Error deleting record. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

module.exports = serviceRouter;