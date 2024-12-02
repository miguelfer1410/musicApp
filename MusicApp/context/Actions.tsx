export const SET_SELECTED_GENRE = "SET_SELECTED_GENRE"
export const SET_RECOMMENDATIONS = "SET_RECOMMENDATIONS"
export const SET_SEARCH_RESULTS = "SET_SEARCH_RESULTS"
export const SET_SELECTED_MUSIC_ICON = "SET_SELECTED_MUSIC_ICON"
export const ADD_PLAYLIST = "ADD_PLAYLIST"
export const UPDATE_PLAYLIST = "UPDATE_PLAYLIST"
export const SET_ACCESS_TOKEN = "SET_ACCESS_TOKEN"
export const SET_SELECTED_SONG = "SET_SELECTED_SONG"
export const SET_ARTIST_BIO = "SET_ARTIST_BIO"
export const SET_SELECTED_PLAYLIST = "SELECTED_PLAYLIST"

export const setSelectedGenre = (genre:any) => ({
    type:'SET_SELECTED_GENRE',
    payload:genre
})

export const setRecommendations = (recommendations: any) => ({
    type: 'SET_RECOMMENDATIONS',
    payload: recommendations,
});

export const setSearchResults = (results: any) => ({
    type: 'SET_SEARCH_RESULTS',
    payload: results,
});

export const setSelectedMusicIcon = (music: any) => ({
    type: 'SET_SELECTED_MUSIC_ICON',
    payload: music,
});

export const addPlaylist = (playlist: any) => ({
    type: 'ADD_PLAYLIST',
    payload: playlist,
});

export const updatePlaylist = (playlist: any) => ({
    type: 'UPDATE_PLAYLIST',
    payload: playlist,
});

export const selectedPlaylsit = (playlist: any) => ({
    type: 'SELECTED_PLAYLIST',
    payload: playlist,
})

export const setAccessToken = (token: string) => ({
    type: 'SET_ACCESS_TOKEN',
    payload: token
})

export const setSelectedSong = (song: any) => ({
    type: 'SET_SELECTED_SONG',
    payload: song
})

export const setArtistBio = (bio:string) => ({ 
    type: 'SET_ARTIST_BIO', 
    payload: bio 
});

export const setArtistImage = (url:string) => ({
    type: 'SET_ARTIST_IMAGE',
    payload: url
})

export const togglePlay = () => ({
    type: 'TOGGLE_PLAY',
})