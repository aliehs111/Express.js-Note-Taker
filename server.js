const express = require('express');//Importing express
const path = require('path');//Importing path module so that app can work with paths to files
const { v4: uuidv4 } = require('uuid');//Importing module to create unique ids for each user entry
const fs = require('fs');//Importing module to read and write files
const port = process.env.PORT || 3001;//Setting up port for heroku deployment or for local host  

const app = express();
app.use(express.static('public'));//so that app can use files in the public folder
app.use(express.json());//so that app can use json files with express 

//this is the route to the notes page and code for backend responding to frontend request and sending to notes page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

//this is the route to the notes page and code for backend responding to frontend and sending the db.json file
app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/db/db.json'));
});

//this is the route to the notes page taking parameters and returning them as a string and adding them to the the array of objects in db.json
app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = uuidv4();//this creates a unique id for each note using uuidv4 package
    const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));//this puts the note in db.json parsed as an object to fit the data structure
    notes.push(newNote);//because the notes variable is an array, we can use the push method to add the new note to the array
    fs.writeFileSync('./db/db.json', JSON.stringify(notes));//this writes the new note to the db.json file and converts the array of objects to a string
    res.json(newNote);//this sends the new note back to the frontend
});


// this is the route and code to delete a note and delete that object from the array of objects in db.json
app.delete('/api/notes/:id', (req, res) => {
    const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    const newNotes = notes.filter(note => note.id !== req.params.id);
    fs.writeFileSync('./db/db.json', JSON.stringify(newNotes));
    res.json(newNotes);
});

//this is the route to the home page and to display all the notes currently in the db.json
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

//this is the route and code to console log to confirm that the server is up and running
app.listen(port, () => {
    console.log('Server is running on port 3001');
});
