
document.addEventListener("DOMContentLoaded", () =>{
    const container = document.getElementById("produkte-container");
    const container2 = document.getElementById("all");
    fetch("http://localhost:8000/api/produkt/alle")
    .then(res=> res.json())
    .then(produkte => {
        const top = produkte.slice(0,4);
        top.forEach(p=>{
            const div = document.createElement("div");
            const bildPfad = 'http://localhost:8000/' + p.bilder[0].bildpfad
                
            div.className = "einkauf";
            div.innerHTML = `
                <a href="../artikel/artikel.html?id=${p.id}">
                <img src= "${bildPfad}" alt="${p.bezeichnung}">
                <h4>${p.bezeichnung}</h4>
                <p class=price>${p.preis} € </p>
                <p>${p.beschreibung}</p>
            `;
            container.appendChild(div);
        });
        const rest = produkte.slice(4);
        rest.forEach(p=>{
            const div2 = document.createElement("div");
            const bildPfad = 'http://localhost:8000/' + p.bilder[0].bildpfad

            div2.className = "einkauf";
            div2.innerHTML = `
                <a href="../artikel/artikel.html?id=${p.id}">
                <img src= "${bildPfad}" alt="${p.bezeichnung}">
                <h2>${p.bezeichnung}</h2>
                <p class=price>${p.preis} € </p>
                <p>${p.beschreibung}</p>
            `;
            container2.appendChild(div2);
        })

    })
    .catch(err => console.error("Fehler beim Laden: ", err));
});