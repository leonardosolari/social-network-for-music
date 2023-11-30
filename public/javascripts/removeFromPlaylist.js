const buttons = document.querySelectorAll('button[id^=but]')

for (let btn of buttons) {

   btn.addEventListener('click', event => {
        const buttonId = event.target.id
        const songId = buttonId.substring(3)
        const playlistId = document.getElementById("playlistId").textContent;        
        
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");   

        const raw = JSON.stringify({
            "songId": songId
        });

        const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch(`/playlist/${playlistId}/remove`, requestOptions)
        .then(response => {
            response.text()
            if (response.redirected) {
                window.location.href = response.url;
                document.getElementById('success-flash').display() = 'Canzone aggiunta con successo'
            }
        })
        .then(result => console.log(result))
        .catch(error => console.log('error', error));

    });
    

}
