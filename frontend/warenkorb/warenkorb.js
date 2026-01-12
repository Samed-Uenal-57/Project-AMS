document.addEventListener("DOMContentLoaded", () =>{
    
    const container = document.getElementById("whole-boxes");

    const cart = JSON.parse(localStorage.getItem('cart'))
    //Ist cart befüllt?
    if (!cart || !cart.products) return null

    cart.products.forEach((product, index) => {
        //console.log({product})
        id = product.id
        let extra = 0;
        //Extras
        if(product.extra === "Schmetterlinge"){
            extra += 2.50;
        }else if(product.extra === "Schocko-Stueckchen"){
            extra += 1.50;
        } else{
            extra = 0;
        }
    
        fetch(`http://localhost:8000/api/produkt/gib/${id}`)
            .then(res => res.json())
            .then(p => {
                const bildPath = 'http://localhost:8000/' + p.bilder[0].bildpfad;
                const div = document.createElement("div");
                div.className = "order-box";
                div.innerHTML = `
                    <div id= "img">
                        <a href="../artikel/artikel.html?id=${product.id}">
                            <img src= "${bildPath}" alt="${p.bezeichnung}">
                        </a>
                    </div>
                    <div class="cake">
                        <div class="details">
                            <p>Name: ${p.bezeichnung}</p>
                            <p>Einzelpreis: ${p.preis} €</p>
                            <label for="amount">Menge: </label>
                            <input type="number" class="amount" min="1" value="${product.piece}">
                            <button class="delete-btn"> Aus Warenkorb entfernen</button>
                            <p>Zusatz: ${product.extra}</p>
                        </div>
                        <div class="sum">
                        
                        </div>
                    </div>
                    
                `;
                container.appendChild(div);
                
                const amountInput = div.querySelector(".amount");
                const priceElement = div.querySelector(".sum");
                //Aktualisierung der Preise
                function updatePrice(){
                    const basePrice = p.preis;
                    const amount = Number(amountInput.value);

                    const finalPrice = (basePrice + extra) * amount;
                    priceElement.textContent = finalPrice.toFixed(2) + " €";
                    fullPrice();
                }
                amountInput.addEventListener("input", updatePrice);
                updatePrice();
                
                const deleteBtn = div.querySelector(".delete-btn");
                deleteBtn.addEventListener('click', (event) => {
                    event.preventDefault();

                    const savedCart = JSON.parse(localStorage.getItem("cart")) || { products: [] };

                    savedCart.products.splice(index, 1);
                    //console.log("deleting")

                    localStorage.setItem("cart", JSON.stringify(savedCart));
                    div.remove();
                    fullPrice();
                });


            })
            .catch(err => console.error("Fehler beim Laden: ", err));
    
    });
    
    
    function fullPrice(){
        let totalsum = 0;

        document.querySelectorAll(".sum").forEach(sumProduct => {
            const value = parseFloat( sumProduct.textContent.replace("€", "").trim());
            if(!isNaN(value)){
                totalsum += value;
            }
        });
        document.querySelector("#totalPrice").textContent = totalsum.toFixed(2) + " €";
        const mwst = totalsum * 0.19;
        document.querySelector("#mwst").textContent = mwst.toFixed(2) + " €";
    }
    fullPrice();
});