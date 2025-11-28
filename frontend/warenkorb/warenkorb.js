document.addEventListener("DOMContentLoaded", () =>{
    const container = document.getElementById("order-boxes");

    console.log({container})

    const cart = JSON.parse(localStorage.getItem('cart'))
    if (!cart || !cart.products) return null

    console.log(cart.products)

    cart.products.forEach(product => {
        //TODO
        // fetch(`http://localhost:8000/api/produkt/gib/${id}`)
        // .then(res => res.json())
        // .then(p => {})

        console.log({product})

        const extra = product.extra === "keine" ? "Keine" : "Schmetterlinge (essbar, + 2,50 €)"

        const div = document.createElement("div");
        div.className = "order-box";
        div.innerHTML = `
            <a href="../artikel/artikel.html?id=${product.id}">
                <img src="../../pictures/ErdbeereSchokoKuchen1.jpg" width="200">
            </a>
            <div class="cake">
                <p>Name: Erdbeer-Schokokuchen</p>
                <p>Kosten: 35,00€</p>
                <label for="amount">Menge: </label>
                <input type="number" class="amount" min="1" value="${product.piece}">
                <button class="delete-btn"> Aus Warenkorb entfernen</button>
                <p>${extra}</p>
                <p>Beschreibung:</p>
                <p id="description">
                    Leckerer Erdbeer-Schokokuchen mit <br> Erdbeer- und Blaubeerstücken
                </p>
            </div>
        `;
        container.appendChild(div);
    });


    // TODO: Add removing item using updated cart
    // localStorage.setItem('cart', updatedCart)
});