




document.addEventListener("DOMContentLoaded", () =>{
    const container = document.getElementById("produkte-container");
    fetch("http://localhost:8000/api/produkt/alle")
    .then(res=> res.json())
    .then(produkte => {
        
        produkte.forEach(p=>{
            const div = document.createElement("div");
            const bildPfad = 'http://localhost:8000/' + p.bilder[0].bildpfad
                
            div.className = "einkauf";
            div.innerHTML = `
                <img src= "${bildPfad}" alt="${p.bezeichnung}">
                <h2>${p.bezeichnung}</h2>
                <p>Preis: ${p.preis} € </p>
                <p>${p.beschreibung}</p>
            `;
            container.appendChild(div);
        });
    })
    .catch(err => console.error("Fehler beim Laden: ", err));
});