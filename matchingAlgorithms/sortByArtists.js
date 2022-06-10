function sortTracksByArtists(userTracks, potentialMatchTracks){
    const seen = {};
    let matches = 0;
    for(let i of userTracks){
        seen[i.artist + song_name] = 1;
    }
    for(let i of potentialMatchTracks){
        let key = i.artist + song_name;
        if(key in seen){
            ++matches;
        }
    }
    return matches;
}