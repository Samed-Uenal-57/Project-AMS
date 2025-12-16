const express = require('express');
const path = require('path');
const app = express();
const PORT = 5500;
const cors = require('cors');
// Statische Dateien ausliefern
app.use(express.static(path.join(__dirname)));
app.use(cors());
// SPA: Alle Anfragen auf index.html umleiten
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'index/index.html'));
});


app.listen(PORT, () => {
  console.log('Frontend läuft auf http://localhost:', PORT);
  console.log('Usage: http://localhost:',  PORT);
  console.log('-------------------------------------------');
});