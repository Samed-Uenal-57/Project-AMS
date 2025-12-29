//Sterne für die Bewertung
function Stars(value){
    let stars = '';
    let i = 1;
    for(i; i <= 5; i++){
        stars += i <= value ? '★' : '☆';
    }
    return stars;
}

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
                        <input type="radio" id="extra1" name="extra" value="keine" checked>
                        <label for="check">Keine</label><br>
                        <input type="radio" id="extra2" name="extra" value="schmetterlinge">
                        <label for="check">Schmetterlinge (essbar, + 2,50 €)</label><br>
                        <input type="radio" id="extra3" name="extra" value="Schoko-Stueckchen">
                        <label for="check">Schoko-Stückchen (+ 1,50 €)</label><br>
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
                
            container.appendChild(div);
            const basePrice = p.preis;
            const priceElement = div.querySelector(".price");
            const extraRadios = div.querySelectorAll("input[name='extra']");
            const pieceInput = div.querySelector('#piece');

            function updatePrice(){
                let extra = 0;

                const selected = div.querySelector("input[name='extra']:checked");
                if (selected && selected.value === "schmetterlinge"){
                    extra = 2.50;
                }
                else if(selected && selected.value === "Schoko-Stueckchen"){
                    extra = 1.50;
                }
                const quantity = Number(pieceInput.value);
                const finalPrice = (basePrice + extra) * quantity;
                priceElement.textContent = finalPrice.toFixed(2) + " €";
            }

            extraRadios.forEach(radio =>{
                radio.addEventListener("change", updatePrice);
            });
            pieceInput.addEventListener("input", updatePrice);
    })
    .catch(err => console.error("Fehler beim Laden: ", err));


    


    const container3 = document.getElementById("whole-img-review");
    fetch(`http://localhost:8000/api/produkt/gib/${id}`)
    .then(res => res.json())
    .then(p=> {
        const review = p.bilder.slice(1);
        if(review.length === 0){
            const div2 = document.createElement("div");
            div2.className = "no-reviews";
            div2.innerHTML = `
                <p>Leider gibt es noch keine Kundenbilder dazu.</p>
            `;
            container3.appendChild(div2);
        } else{
            review.forEach(bild =>{
                const bildPath = 'http://localhost:8000/' + bild.bildpfad;
                const div2 = document.createElement("div");
                div2.className = "customer-img-review";
                div2.innerHTML = `
                    <div>
                        <img class="size" src= "${bildPath}" alt="${p.bezeichnung}">
                    </div>        
                `;
                container3.appendChild(div2);
            })    
        }
    })
    .catch(err => console.error("Fehler beim Laden: ", err));
    //Sternangabe
    const input = document.querySelector("#points");
    const starPreview = document.querySelector(".stars");
    let rating = Number(input.value);
    starPreview.textContent = Stars(rating);
    input.addEventListener("input", (event) =>{
        rating = Number(event.target.value);
        starPreview.textContent = Stars(rating);
    })

    //Rezension an Datenbank senden
    const form = document.querySelector(".form");
    form.addEventListener("submit", async function(event) {
        event.preventDefault();
        const form_data = new FormData(this);
        
        const data = {
            product: {id: Number(id)},
            vorname: form_data.get('vorname'),
            name: form_data.get('nachname'),
            bewertung: rating,
            rezension: form_data.get('rezension')
        };

        try{
            const response = await fetch('http://localhost:8000/api/bewertung',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)           
            });
            const result = await response.json();
            if(response.ok){
                alert('Rezension abgeschickt!');
                this.reset();
            } else{
                alert('Fehler beim Senden: ' + result.nachricht);
            }
        } catch(error){
            console.error('Netzwerkfehler: ', error);
            alert('Netzwerkfehler beim Senden der Nachricht');
        }
        
    });


    //Bewertungen
    const container4 = document.getElementById("reviewcontainer");
    fetch(`http://localhost:8000/api/bewertung/produkt/${id}`)
    .then(res => res.json())
    .then(bewertung => {
        if(bewertung.length === 0){
            container4.innerHTML =`
                <p> Es gibt noch keine Bewertungen! </p>
            `;
            return;
        }
        bewertung.forEach(b => {
            console.log(b.vorname, b.name, b.bewertung, b.rezension);
            const div3 = document.createElement("div");
            div3.className = "customer-review";
            div3.innerHTML = `
                <p class="name">${b.vorname}  ${b.name}</p>
                <p class="stars">${Stars(b.bewertung)}</p>
                <p>Rezension:<br> ${b.rezension}</p>
            
            `;
            container4.appendChild(div3);
        });

    });
    //Bewertung in Datenbank speichern


    //Andere Produkte anzeigen
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
                <h4>${p.bezeichnung}</h4>
                <p>Preis: ${p.preis} € </p>
            `;
            container2.appendChild(div1)
        })
    })
    .catch(err => console.error("Fehler beim Laden: ", err));
});