const express = require('express');
const path = require('path');
const app = express();
const PORT = 5500;


const FRONTPATH = path.join(__dirname, 'frontend');
// Statische Dateien ausliefern
app.use(express.static(FRONTPATH));

// SPA: Alle Anfragen auf index.html umleiten
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'index', 'index.html'));
});


app.listen(PORT, () => {
  console.log(`Frontend läuft auf http://localhost:${PORT}`);
});