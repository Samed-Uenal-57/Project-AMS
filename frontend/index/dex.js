function getRandomInt(min,max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

document.addEventListener("DOMContentLoaded", () =>{

    const container = document.getElementById("section-review");
    let num = getRandomInt(1,16);
    //console.log(num);
    fetch(`http://localhost:8000/api/bewertung/gib/${num}`)
    .then(res => res.json())
    .then(p => {
        const div = document.createElement("div");
        div.className = "review";
        
        fetch(`http://localhost:8000/api/produkt/gib/${num}`)
        .then(res => res.json())
        .then(product => {
            const bildPfad = 'http://localhost:8000/' + product.bilder[0].bildpfad;
            //console.log(bildPfad);
            div.innerHTML = `
            <p class="text">${p.rezension}</p>
            <img id="schokobewertung" src="${bildPfad}" alt="Bild von Kuchen">
            
            <p class="text">${p.vorname} ${p.name}</p>
        
        
        `;
        container.appendChild(div);
        })
        .catch(err1 => console.log("Fehler beim Laden: ", err1));

        
    })
    .catch(err => console.error("Fehler beim Laden: ", err));

})