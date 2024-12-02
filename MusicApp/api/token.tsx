import axios from 'axios';

export const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/api/token';
export const SPOTIFY_AUTHORIZE_URL = 'https://accounts.spotify.com/authorize';
export const CLIENT_ID = '2a222dc5c8af4df391fb1259567711d7';
export const CLIENT_SECRET = 'f71b6c6f47404c1bbde0e802e58fb225';
export const SCOPES = [
  'streaming',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
];

export const getSpotifyAccessToken = async (
  code: string,
  redirectUri: string
) => {
  try {
    const response = await axios.post(
      SPOTIFY_AUTH_URL,
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    console.log(response.data.access_token);
    return response.data.access_token;
  } catch (error:any) {
    console.error('Erro ao obter o token de acesso:', error.response?.data || error.message);
    return null;
  }
};
