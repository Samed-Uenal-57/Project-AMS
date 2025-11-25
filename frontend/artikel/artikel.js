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
            div.className = "settings";
            div.innerHTML = `
                <div id="img">
                    <img src= "${bildPath}" alt="${p.bezeichnung}">
                </div>
                <div id="description">
                    <h2>${p.bezeichnung}</h2>
                    <p>Preis: ${p.preis} € </p>
                    <p>${p.beschreibung}</p>
                    <label for="extra">Zusatzoptionen:</label>
                    <br>
                    <input type="radio" id="extra1" name="extra" value="beeren">
                    <label for="check">Schmetterlinge (essbar)</label><br>
                    <input type="radio" id="extra2" name="extra" value="keine">
                    <label for="check">Keine</label><br>
                    <label for="piece">Stückzahl:</label>
                    <input type="number" id="piece" name="piece" value="1" min="1" step="1"> <br>
                    <button class="button">In den Warenkorb</button>
                </div>        
            `;
            container.appendChild(div);
        })
        .catch(err => console.error("Fehler beim Laden: ", err));
});