const helper = require('../helper.js');
const BenutzerDao = require('../dao/benutzerDao.js');
const express = require('express');
var serviceRouter = express.Router();

// stuff for jsonwebtoken library
// details: https://www.npmjs.com/package/jsonwebtoken
const jwt = require('jsonwebtoken');
const token_algorithm = 'HS512';
const token_secret = 'SUPERgeheimesPASSWORT';
const token_maxAge = '1h';

console.log('- Service Token');

serviceRouter.get('/token/authenticate', function(request, response) {
    console.log('Service Token: Client requests authentication of credentials');

    var un = request.headers['credentials-username'].trim();
    var pw = request.headers['credentials-password'].trim();

    // check if credentials in header
    var errorMsgs=[];
    if (helper.isUndefined(un)) 
        errorMsgs.push('benutzername fehlt');
    if (helper.isUndefined(pw)) 
        errorMsgs.push('passwort fehlt');
    
    if (errorMsgs.length > 0) {
        console.log('Service Token: Authentication not possible, data missing');
        response.status(400).json({ 'fehler': true, 'nachricht': 'Funktion nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs) });
        return;
    }

    console.log('Service Token: Authenticating credentials', un, pw);

    const benutzerDao = new BenutzerDao(request.app.locals.dbConnection);
    try {
        // check against db if credentials correct
        var payload = benutzerDao.hasaccess(un, pw);
        console.log('Service Token: Authentication succesfull, loaded userId=' + payload.id);

        // now create token with 1h, payload is the user-object
        var token = jwt.sign({ data: payload }, token_secret, { algorithm: token_algorithm, expiresIn: token_maxAge });
        console.log('Service Token: Token created', token);

        response.status(200).json({ 'token': token });
    } catch (ex) {
        console.error('Service Token: Error checking if user has access. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.get('/token/validate', function(request, response) {
    console.log('Service Token: Client requests validation of token');

    // get authorization data from header
    var authorization = request.headers['authorization'];
    if (helper.isUndefined(authorization)) {
        console.log('Service Token: Validation not possible, Authorization missing');
        response.status(400).json({ 'fehler': true, 'nachricht': 'Validation failed, authorization missing' });
        return;
    }

    // now check if Bearer Keyword at beginning
    if (!helper.strStartsWith(authorization, 'Bearer ')) {
        console.log('Service Token: Validation not possible, Format mismatch');
        response.status(400).json({ 'fehler': true, 'nachricht': 'Validation failed, Format mismatch' });
        return;
    }

    // ok remove the starting text and validate the token itself
    var token = authorization.substring(7);
    console.log('Service Token: Validating token', token);

    // if anything is not correct with token, exception is created
    // if ok, we have the decoded payload, the user object which we can further check or just send back to caller
    try {

        var decoded = jwt.verify(token, token_secret, { algorithm: token_algorithm, maxAge: token_maxAge });

        console.log('Service Token: Token correctly decoded, so its valid, iat/exp', decoded.iat, decoded.exp);

        // now we can check if correct structure is in decoded data
        // has to start with attribute data and has to contain data.id and data.person

        if (helper.isUndefined(decoded.data) || helper.isUndefined(decoded.data.id) || helper.isUndefined(decoded.data.person)) {
            console.log('Service Token: Validation failed, Format of payload is incorrect');
            response.status(400).json({ 'fehler': true, 'nachricht': 'Validation failed, Format of Payload is incorrect' });
            return;
        }

        // here we could do all other kind of checks, like verifying against the database but thats enough. Lets just modify the data a bit and send it back as successfull response
        delete decoded.data.passwort;
        console.log('Service Token: Token fully validated id, username', decoded.data.id, decoded.data.benutzername);

        response.status(200).json(decoded.data);
    } catch (ex) {
        console.error('Service Token: Error Validating Token. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }

    response.status(200);
});

module.exports = serviceRouter;