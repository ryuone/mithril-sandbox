var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var fs = require("fs");

var jsonParser = bodyParser.json()

app.use('/', express.static('./public'));

app.get('/api/contact', function(req, res){
    res.set('Content-Type', 'application/json');
    res.send(app.get('contactlist'));
});

app.post('/api/contact', jsonParser, function(req, res){
    var newcontact = req.body;
    var contactlist = app.get('contactlist');

    newcontact.id = contactlist.length + 1;

    contactlist.push(newcontact);
    app.set('contactlist', contactlist);

    res.set('Content-Type', 'application/json');
    res.send(contactlist);
});

app.set('contactlist', loadJson());

var server = app.listen(3000, function(){
    var host = server.address().address;
    var port = server.address().port;

    console.log("Express app listening at http://%s:%s", host, port);
});

function loadJson(){
    var file = __dirname + '/data/contact.json';
    return JSON.parse(fs.readFileSync(file, "utf8"));
}
