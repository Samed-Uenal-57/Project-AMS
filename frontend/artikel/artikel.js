document.addEventListener("DOMContentLoaded", () =>{
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) return console.error("Keine Produkt-ID in URL");

    const container = document.getElementById("product");

    fetch(`http://localhost:8000/api/produkt/gib/${id}`)
        .then(res => res.json())
        .then(p => {
            const bildPath = 'http://localhost:8000/' + p.bilder[0].bildpfad;
            const div = document.createElement("div");
            div.className = "settings";
            div.innerHTML = `
                <form id="artikelForm">
                    <div id="img">
                        <img src= "${bildPath}" alt="${p.bezeichnung}">
                    </div>
                    <div id="description">
                        <h2>${p.bezeichnung}</h2>
                        <p class=price>${p.preis} € </p>
                        <p>${p.beschreibung}</p>
                        <label for="extra">Zusatzoptionen:</label>
                        <br>
                        <input type="radio" id="extra2" name="extra" value="keine" checked>
                        <label for="check">Keine</label><br>
                        <input type="radio" id="extra1" name="extra" value="beeren">
                        <label for="check">Schmetterlinge (essbar, + 2,50 €)</label><br>
                        <label for="piece">Stückzahl:</label>
                        <input type="number" id="piece" name="piece" value="1" min="1" step="1"> <br>
                        <button class="button" type="submit">In den Warenkorb</button>
                    </div>
                </form>
            `;
            container.appendChild(div);

            const artikelForm = document.getElementById("artikelForm");
            artikelForm.addEventListener("submit", (event) => {
                event.preventDefault();

                const id = p.id
                const piece = event.target["piece"].value
                const extra = event.target["extra"].value
                //localStorage.setItem('cart', JSON.stringify({products: [{id, piece, extra}]})); //debug

                if (!localStorage.getItem('cart')) {
                    localStorage.setItem('cart', JSON.stringify({products : [{id, piece, extra}]}));
                    console.log("nothing here before, now - ", products);
                } else {
                    const cart = JSON.parse(localStorage.getItem('cart'))
                    const products = cart.products
                    console.log(products, " - what we had");
                    //localStorage.setItem('cart', JSON.stringify({products : [{id, piece, extra}]}));

                    if (products.some(p => p.id === id && p.extra === extra)) {
                        //const existingProduct = products.find(p => p.id === id && p.extra === extra);
                        //existingProduct.piece = parseInt(existingProduct.piece) + parseInt(piece);

                        products.find(p => p.id === id && p.extra === extra).piece = parseInt(products.find(p => p.id === id && p.extra === extra).piece) + parseInt(piece)

                    } else {
                        products.push({id, piece, extra});

                    }
                    
                    localStorage.setItem('cart', JSON.stringify({products}));
                    
                }

            });
        })
        .catch(err => console.error("Fehler beim Laden: ", err));

    
    const container2 = document.getElementById("gallery");
    
    fetch("http://localhost:8000/api/produkt/alle")
    .then(res=> res.json())
    .then(produkte => {
        const top = produkte.slice(0,4);
        top.forEach(p=>{
            const div1 = document.createElement("div");
            const bildPfad = 'http://localhost:8000/' + p.bilder[0].bildpfad
                
            div1.className = "einkauf";
            div1.innerHTML = `
                <a href="../artikel/artikel.html?id=${p.id}">
                <img src= "${bildPfad}" alt="${p.bezeichnung}">
                <h3>${p.bezeichnung}</h3>
                <p>Preis: ${p.preis} € </p>
            `;
            container2.appendChild(div1)
        })
    })
    .catch(err => console.error("Fehler beim Laden: ", err));
});