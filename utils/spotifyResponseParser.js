module.exports.filterArtistFields = (item) => {
    return {
        name: item.name,
        id: item.id,
        genres: item.genres,
        popularity: item.popularity,
        followers: item.followers.total,
        image: item.images[0] ? item.images[0].url : null
    };
}

module.exports.filterAlbumFields = (item) => {
    return {
        name: item.name,
        id: item.id,
        release_date: new Date(item.release_date).getFullYear(),
        total_tracks: item.total_tracks,
        tracks: item.tracks.items.map(track => ({id: track.id, name: track.name })),
        type: item.album_type,
        image: item.images[0].url,
        artists: item.artists.map(artist => ({ name: artist.name, id: artist.id }))
    };
}

module.exports.filterTrackFields = (item) => {
    const duration = new Date(item.duration_ms)
    const release_date = new Date(item.album.release_date)
    return {
        name: item.name,
        id: item.id,
        duration: `${duration.getMinutes()}:${duration.getSeconds()}`,
        explicit: item.explicit,
        artists: item.artists.map(artist => ({ name: artist.name, id: artist.id })),
        album: { name: item.album.name, id: item.album.id, release_date: release_date.getFullYear() },
        image: item.album.images[0].url
    };
}

module.exports.reducedFilterAlbumFields = (item) => {
    return {
        name: item.name,
        id: item.id,
        release_date: new Date(item.release_date),
        total_tracks: item.total_tracks,
        type: item.album_type,
        image: item.images[0].url,
        artists: item.artists.map(artist => ({ name: artist.name, id: artist.id }))
    };
}