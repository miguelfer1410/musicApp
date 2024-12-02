import { SET_RECOMMENDATIONS, SET_SELECTED_GENRE } from './Actions';
import AsyncStorage from '@react-native-async-storage/async-storage';



export interface State{
  selectedGenre: string|null;
  recommendations: any[];
  results: any[];
  selectedMusicIcon: any[];
  playlists: any[];
  token: string|null;
  selectedSong: string|null;
  artistBio:string|null;
  artistImage:string|null;
  selectedPlaylist:string|null;
  isPlaying: boolean;
  sortOption: 'name' | 'artist' | 'dateAdded' | null;
  hasPreview: boolean;
}

export const initialState: State = {
  selectedGenre: "Hip-Hop",
  recommendations: [],
  results: [],
  selectedMusicIcon: [],
  playlists:[],
  token: '',
  selectedSong: '',
  artistBio: '',
  artistImage:'',
  selectedPlaylist:'',
  isPlaying: false,
  sortOption: null,
  hasPreview: true,
};

export const Reducer = (state = initialState, action: any): State => {
  switch (action.type) {
    case SET_SELECTED_GENRE:
      return{
        ...state,
        selectedGenre: action.payload,
      }
    case SET_RECOMMENDATIONS:
      return{
        ...state,
        recommendations: action.payload
      }
    case "SET_SEARCH_RESULTS":
      return{
        ...state,
        results: action.payload
      }
    case "SET_SELECTED_MUSIC_ICON":
      return{
      ...state,
      selectedMusicIcon: action.payload
    }
    case "ADD_PLAYLIST":
      return{
        ...state,
        playlists: action.payload
      }
    case 'UPDATE_PLAYLISTS':
      return {
        ...state,
        playlists: action.payload,
      };
    case 'SET_ACCESS_TOKEN':
      return {
        ...state,
        token: action.payload,
      };
    
    case 'SET_SELECTED_SONG':
      return {
        ...state,
        selectedSong: action.payload,
      }
    case 'SET_ARTIST_BIO':
      return {
        ...state,
        artistBio: action.payload
      }
    case 'SET_ARTIST_IMAGE':
      return{
        ...state,
        artistImage: action.payload
      }
    case 'SET_SELECTED_PLAYLIST':
      return {
        ...state,
        selectedPlaylist: action.payload
      }
    case 'SET_PLAY_STATE':
      return {
        ...state,
        isPlaying: action.payload, // Define explicitamente o estado de reprodução
      };
    case 'SET_SORT_OPTION':
      return {
        ...state,
        sortOption: action.payload,
      };
    case 'SET_HAS_PREVIEW':
      return {
        ...state,
        hasPreview: action.payload,
      };
    default:
      return state;
  }
};