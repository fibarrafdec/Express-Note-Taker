const fs = require('fs');
const path = require('path');
const router = require('express').Router();

// Read the notes from db.json
router.get('/notes', (req, res) => {
  const notes = JSON.parse(fs.readFileSync(path.join(__dirname, '../db/db.json')));
  res.json(notes);
});

// Create a new note and save it to db.json
router.post('/notes', (req, res) => {
  const newNote = req.body;
  const notes = JSON.parse(fs.readFileSync(path.join(__dirname, '../db/db.json')));
  newNote.id = generateUniqueId(notes);
  notes.push(newNote);
  fs.writeFileSync(path.join(__dirname, '../db/db.json'), JSON.stringify(notes));
  res.json(newNote);
});

// Delete a note by ID
router.delete('/notes/:id', (req, res) => {
  const noteId = parseInt(req.params.id);
  let notes = JSON.parse(fs.readFileSync(path.join(__dirname, '../db/db.json')));
  
  // Find the index of the note with the given ID
  const noteIndex = notes.findIndex((note) => note.id === noteId);
  
  if (noteIndex >= 0) {
    // Remove the note from the notes array
    notes = notes.filter((note) => note.id !== noteId);
    
    // Save the updated notes to db.json
    fs.writeFileSync(path.join(__dirname, '../db/db.json'), JSON.stringify(notes));
    res.json({ message: 'Note deleted' });
  } else {
    res.status(404).json({ error: 'Note not found' });
  }
});

// Helper function to generate a unique ID
function generateUniqueId(notes) {
  let id = 1;
  while (notes.some((note) => note.id === id)) {
    id++;
  }
  return id;
}

module.exports = router;
