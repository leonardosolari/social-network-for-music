function addToPlaylist() {
        
    const modal = document.getElementById('playlistModal')
    const playlistId = document.getElementById("playlistSelector").value
    const songId = document.getElementById("songId").textContent;

    if (playlistId == "") {
        alert("Devi selezionare una playlist")
        return
    }


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

    fetch(`/playlist/${playlistId}/add`, requestOptions)
    .then(response => {
        response.text()
        if (response.redirected) {
            window.location.href = response.url;
            document.getElementById('success-flash').display() = 'Canzone aggiunta con successo'
        }
    })
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}