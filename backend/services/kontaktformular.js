const helper = require('../helper.js');
const fileHelper = require('../fileHelper.js');
const path = require('path');
const express = require('express');
const KontaktFormularDao = require('../dao/kontaktformularDao.js');
var serviceRouter = express.Router();


console.log('- Service Kontaktformular');

serviceRouter.get('/kontaktformular/gib/:id', function(request, response){
    console.log('Service Kontaktformular: Client requested one record, id= ' + request.params.id);

    const kontaktformularDao = new KontaktFormularDao(request.app.locals.dbConnection);
    try {
        var obj = kontaktformularDao.loadById(request.params.id);
        console.log('Service Kontaktformular: Record loaded');
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service Kontaktformular: Error loading record by id. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.get('/kontaktformular/alle', function(request, response) {
    console.log('Service Galerie: Client requested all records');

    const kontaktformularDao = new KontaktFormularDao(request.app.locals.dbConnection);
    try {
        var arr = kontaktformularDao.loadAll();
        console.log('Service Galerie: Records loaded, count=' + arr.length);
        response.status(200).json(arr);
    } catch (ex) {
        console.error('Service Galerie: Error loading all records. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});
serviceRouter.post('/kontaktformular',function(request,response){
    console.log('Service Kontaktformular: Client requested creation of new Record');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.vorname)) 
        errorMsgs.push('vorname fehlt');
    if (helper.isUndefined(request.body.name)) 
        errorMsgs.push('nachname fehlt');
    if (helper.isUndefined(request.body.mail)) 
        errorMsgs.push('E-Mail fehlt');
    if (helper.isUndefined(request.body.nachricht)) 
        errorMsgs.push('nachricht fehlt');
    if (errorMsgs.length > 0) {
        console.log('Service Kontaktformular: Creation not possible, data missing');
        response.status(400).json({ 'fehler': true, 'nachricht': 'Funktion nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs) });
        return;
    }
    const kontaktformularDao = new KontaktFormularDao(request.app.locals.dbConnection);
    try{
        var obj = kontaktformularDao.create(request.body.vorname, request.body.name, request.body.mail, request.body.nachricht);
        console.log('Service Kontaktformular: Record inserted');
        response.status(200).json(obj);
    } catch(ex){
        console.error('Service Kontaktformular: Error creating new record. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});
module.exports = serviceRouter;