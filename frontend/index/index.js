function getRandomInt(min,max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

document.addEventListener("DOMContentLoaded", () =>{

    const container = document.getElementById("section-review");
    let num = getRandomInt(1,20);
    console.log(num);
    fetch(`http://localhost:8000/api/bewertung/gib/${num}`)
    .then(res => res.json())
    .then(p => {
        const div = document.createElement("div");
        div.className = "review";
        div.innerHTML = `
            <p>${p.rezension}</p>
            <p>${p.vorname} ${p.name}</p>
        
        
        `;
        container.appendChild(div);
    })
    .catch(err => console.error("Fehler beim Laden: ", err));

})