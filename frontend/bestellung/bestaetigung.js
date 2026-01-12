document.addEventListener("DOMContentLoaded", async () => {
    const URL = new URLSearchParams(window.location.search);
    const bestellId = URL.get('bestellungId');
    if(!bestellId) return;

    try{
        const response = await fetch(`http://localhost:8000/api/bestellung/gib/${bestellId}`);
        if (!response.ok) throw new Error('Bestellung konnte nicht geladen werden!');
        const bestellung = await response.json();

        document.getElementById("order-id").textContent = bestellung.id;
        document.getElementById("date").textContent = bestellung.datum;

        document.getElementById("lieferadresse").innerHTML = `
            ${bestellung.besteller.vorname} ${bestellung.besteller.nachname} <br>
            ${bestellung.besteller.strasse} <br>
            ${bestellung.besteller.plz} ${bestellung.besteller.stadt} <br>
            ${bestellung.besteller.land}    
        `;
        document.getElementById("zahlungsart").textContent = bestellung.zahlungsart.bezeichnung;

        const subtotal = Number(bestellung.gesamtpreis);
        const shipping = 4.50;
        const total = subtotal + shipping;

        document.getElementById("subtotal").textContent = subtotal.toFixed(2) + " €";
        document.getElementById("shipping").textContent = shipping.toFixed(2) + " €";
        document.getElementById("total").textContent = total.toFixed(2) + " €";
    }
    catch(err){
        console.error(err);
    }
});