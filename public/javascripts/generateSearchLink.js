function generateSearchLink() {
    const searchType = document.getElementById('searchType').value
    const query = document.getElementById('searchQuery').value
    location.href = `/search/${searchType}/${query}`
    return false
}