document.addEventListener("DOMContentLoaded", () =>{
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) return console.error("Keine Produkt-ID in URL");

    const container = document.getElementById("product");

    fetch(`http://localhost:8000/api/produkt/gib/${id}`)
        .then(res => res.json())
        .then(p=> {
            const bildPath = 'http://localhost:8000/' + p.bilder[0].bildpfad;
            const div = document.createElement("div");
            div.className = "sett";
            div.innerHTML = `
                <img src= "${bildPath}" alt="${p.bezeichnung}">
                <h2>${p.bezeichnung}</h2>
                <p>Preis: ${p.preis} € </p>
                <p>${p.beschreibung}</p>
            `;
            container.appendChild(div);
        })
        .catch(err => console.error("Fehler beim Laden: ", err));
});