document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form');
    form.addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData(this);


    const data = {
        vorname: formData.get('vorname'),
        name: formData.get('nachname'),
        mail: formData.get('email'),
        nachricht: formData.get('nachricht')
    };

    try{
        const response = await fetch('http://localhost:8000/api/kontaktformular', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if(response.ok){
            alert('Nachricht erfolgreich gesendet!');
            this.reset();
        } else{
            alert('Fehler beim Senden: ' + result.nachricht);
        }
    } catch(error){
        console.error('Netzwerkfehler: ', error);
        alert('Netzwerkfehler beim Senden der Nachricht');
    }
    });
});
