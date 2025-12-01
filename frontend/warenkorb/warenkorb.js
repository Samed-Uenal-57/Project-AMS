document.addEventListener("DOMContentLoaded", () =>{
    const container = document.getElementById("order-boxes");

    //console.log({container})

    const cart = JSON.parse(localStorage.getItem('cart'))
    if (!cart || !cart.products) return null

    //console.log(cart.products)

    cart.products.forEach((product, index) => {
        //console.log({product})
        id = product.id
        const extra = product.extra === "keine" ? "Keine" : "Schmetterlinge (essbar, + 2,50 €)"
    
        fetch(`http://localhost:8000/api/produkt/gib/${id}`)
            .then(res => res.json())
            .then(p => {
                const bildPath = 'http://localhost:8000/' + p.bilder[0].bildpfad;
                const div = document.createElement("div");
                div.className = "order-box";
                div.innerHTML = `
                    <a href="../artikel/artikel.html?id=${product.id}">
                        <img src= "${bildPath}" alt="${p.bezeichnung}">
                    </a>
                    <div class="cake">
                        <p>Name: ${p.bezeichnung}</p>
                        <p>Kosten: ${p.preis} €</p>
                        <label for="amount">Menge: </label>
                        <input type="number" class="amount" min="1" value="${product.piece}">
                        <button class="delete-btn"> Aus Warenkorb entfernen</button>
                        <p>Zusatz: ${extra}</p>
                        <p>Beschreibung:</p>
                        <p id="description">
                            ${p.beschreibung}
                        </p>
                    </div>
                `;
                container.appendChild(div);

                const deleteBtn = div.querySelector(".delete-btn");
                deleteBtn.addEventListener('click', (event) => {
                    event.preventDefault();

                    const savedCart = JSON.parse(localStorage.getItem("cart")) || { products: [] };

                    savedCart.products.splice(index, 1);
                    //console.log("deleting")

                    localStorage.setItem("cart", JSON.stringify(savedCart));
                    div.remove();

                
                    
    
                });


            })
            .catch(err => console.error("Fehler beim Laden: ", err));
        

    





    
        
    });




});