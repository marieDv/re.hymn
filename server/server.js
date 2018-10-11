const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3300;
const MONGOURL = 'mongodb://localhost:27017/concertfinder';
mongoose.connect(MONGOURL, { useNewUrlParser: true }); //connect to the database

const db = mongoose.connection;
db.on('error', (error) => console.log("MongoDb error", error));

const searchRequestSchema = new mongoose.Schema({ //create a blueprint for a mongoose schema
    name: String,
});

const searchRequest = mongoose.model('searchRequest', searchRequestSchema); //create the schema

app.use(bodyParser.json());
app.get('/', (request, response) => {
    response.writeHead(200, {"Access-Control-Allow-Origin": "*"}); //allow js to accept the reply

    return response.json({
        'status': 'Success',
        'message': 'hiiiiiii'
    })
})

app.post('/concertfinder/', (req, res) => {
    const newRequest = new searchRequest(req.body);
    newRequest.save(function(error){
        if (error) throw error;
        return res.send(`Saved ${req.body.name} to address book`);
    })
});

// FIND A PERSON VIA ID
// app.put('/concertfinder/:personId/', (request, response) => {
//     console.log("userId", request.params.personId);
//     Person.findById(request.params.personId,
//         function(error, person){
//             console.log('found the person', person);
//             person.age = request.body.age;
//             person.place = request.body.place;
//             person.save();
//             return response.send('this will update in a bit');
//         })
// });


app.get('/concertfinder/', (request, response) => {
    // response.writeHead(200, {"Access-Control-Allow-Origin": "*"}); //allow js to accept the reply
    console.log("query parameters", request.query);
    searchRequest.find(request.query, function(error, requests){ //filters the mongodb for the parameter given
        if(error) throw error;
        return response.json(requests);
    })
})
app.listen(PORT, () => {
    console.log(`Server listening at ${PORT}`);
})
