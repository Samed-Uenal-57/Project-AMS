document.addEventListener("DOMContentLoaded", () => {
    const date = new Date();
    const container = document.getElementById("confirmation");

    const div = document.createElement("div");
    div.innerHTML = `
        <p>Kaufdatum: ${date.toLocaleDateString("de-DE")} , ${date.toLocaleTimeString("de-DE")} Uhr</p>
    `;
    container.appendChild(div);
});