document.addEventListener("DOMContentLoaded", () =>{
  const cart = JSON.parse(localStorage.getItem("cart"));
  if(!cart || !cart.products.length) return;
  
  const container = document.getElementById("warenkorb");

  let subtotal = 0;

  cart.products.forEach(product =>{
    fetch(`http://localhost:8000/api/produkt/gib/${product.id}`)
    .then(res => res.json())
    .then(p =>{
      
      let extra = 0;

      if(product.extra === "schmetterlinge"){
        extra += 2.5;
      }
      else{
        extra += 1.5;
      }
      const price = (p.preis + Number(extra)) * Number(product.piece);
      subtotal += price;

      const div = document.createElement("div");
      const bildPath = "http://localhost:8000/" + p.bilder[0].bildpfad 
      div.className = "element";
      div.innerHTML = `
        <img class="size" src=${bildPath} alt="Bild vom bestellten Kuchen">
        <div class="inner-element">
          <h4>${p.bezeichnung}</h4>
          <p>${product.piece}x ${price.toFixed(2)} €</p>
        </div>
      `;
      container.appendChild(div);

      updateSummary(subtotal);
    });
  });
  function updateSummary(subtotal){
    const shipping = 4.5;
    const total = subtotal + shipping;
    const mwst = total * 0.19;

    document.getElementById("subtotal").textContent = subtotal.toFixed(2) + " €";
    document.getElementById("shipping").textContent = shipping.toFixed(2) + " €";
    document.getElementById("total").textContent = total.toFixed(2) + " €";
    document.getElementById("mwst").textContent = mwst.toFixed(2) + " €";
  }

  const cart2 = JSON.parse(localStorage.getItem("cart"));

  const extraPrice = {
    "keine" : 0,
    "Schmetterlinge" : 2.5,
    "Schoko-Stueckchen" : 1.5
  };
  const bestellpositionen = cart2.products.map(item => ({
    produkt: {id: item.id},
    menge: parseInt(item.piece, 10),
    extra: item.extra,
    extraPrice: extraPrice[item.extra] || 0
  }));
  const form = document.querySelector(".form");
  form.addEventListener("submit", async function(event){
    event.preventDefault();
    const formData = new FormData(form);
    const adress = {
      vorname: formData.get("vorname"),
      nachname: formData.get("nachname"),
      adresse: formData.get("adresse"),
      plz : formData.get("plz"),
      stadt: formData.get("stadt"),
      land : formData.get("land")
    }
    const zahlungId = formData.get("zahlung");

    const bestellung = {
      adresse: adress,
      zahlungId: zahlungId,
      positionen: bestellpositionen
    };
    console.log(bestellung);

    try{
      const response = await fetch('http://localhost:8000/api/adresse', {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(adress)
      });
      const result = await response.json();
      if(response.ok){
        console.log('Nachricht erfolgreich gesendet!');
        this.reset();
      }else{
        console.error('Fehler beim Senden: ', result.nachricht);
      }
    } catch(error){
      console.error('Netzwerkfehler: ', error);
    }
  });



});