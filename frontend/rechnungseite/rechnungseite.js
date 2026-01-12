function formatPrice(value){
    return value.toLocaleString("de-DE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }) + " €";
}


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
          <p>${product.piece} x ${formatPrice(price)}</p>
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

    document.getElementById("subtotal").textContent = formatPrice(subtotal);
    document.getElementById("shipping").textContent = formatPrice(shipping);
    document.getElementById("total").textContent = formatPrice(total);
    document.getElementById("mwst").textContent = formatPrice(mwst);
  }

  

  const form = document.querySelector(".form");
  form.addEventListener("submit", async function(event){
    
    event.preventDefault();

    const formData = new FormData(form);

    const adress = {
      vorname: formData.get("vorname"),
      nachname: formData.get("nachname"),
      strasse: formData.get("adresse"),
      plz : formData.get("plz"),
      stadt: formData.get("stadt"),
      land : formData.get("land")
    }

    //POST-ADRESS
    
    const response = await fetch('http://localhost:8000/api/adresse', {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(adress)
    });
    const result = await response.json();
    const AdresseId = parseInt(result.id,10);
    console.log('Adresse wurde gespeichert');
    //POST-BESTELLUNG

   
    const ZahlungId = parseInt(formData.get("zahlung"), 10);
    console.log(ZahlungId);
    const Datum = new Date().toLocaleDateString("DE-de");
    console.log(Datum);
    const bestellung = {
      adresseId: AdresseId,
      zahlungId: ZahlungId,
      datum: Datum,
      gesamtpreis: subtotal
    };
    const responseBestellung = await fetch('http://localhost:8000/api/bestellung', {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bestellung)
    });
    const resultBestellung = await responseBestellung.json();
    if(!responseBestellung.ok){
      console.error('Fehler bei Bestellung: ', resultBestellung.nachricht);
      return;
    }
    const bestellId = resultBestellung.id;
    localStorage.removeItem("cart");
    window.location.href = `/bestellung/bestellung.html?bestellungId=${bestellId}`;
    
  });
});