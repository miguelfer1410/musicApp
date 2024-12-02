import axios from 'axios';
const SPOTIFY_API_URL = 'https://api.spotify.com/v1'; // Defina o URL da API

export const getMusicRecommendations = async (genre: string, token: string) => {
  if (!genre || !token) {
    throw new Error('Gênero ou token ausente');
  }

  try {
    // Convert the genre to lowercase to match the API format
    const formattedGenre = genre.toLowerCase();  // Convert entire genre string to lowercase

    // Configura os parâmetros para a requisição
    const params = new URLSearchParams({
      limit: '100',
      seed_genres: formattedGenre,
    });

    const response = await axios.get(`${SPOTIFY_API_URL}/recommendations?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Verifica se a resposta contém dados válidos
    if (response.data && response.data.tracks) {
      // Filtra as músicas que possuem preview_url
      const filteredTracks = response.data.tracks.filter((track: any) => track.preview_url);
      return filteredTracks; // Retorna as faixas recomendadas filtradas
    } else {
      throw new Error('Resposta da API sem faixas recomendadas');
    }
  } catch (error) {
    console.error('Erro ao buscar recomendações de música:', error);
    // Lança erro detalhado para o chamador tratar
    throw new Error('Erro ao buscar recomendações de música');
  }
};



// Função para buscar músicas usando uma string de consulta (como nome de música ou artista)
export const getMusicSearchResult = async (query: string, token: string) => {
  if (!query || !token) {
    throw new Error('Consulta ou token ausente');
  }

  try {
    const response = await axios.get(`${SPOTIFY_API_URL}/search`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: query, // A query de pesquisa
        type: 'track', // Tipo de busca - 'track' para músicas
        limit: 50, // Limite de resultados
      },
    });

    if (response.data && response.data.tracks) {
      // Filtra as músicas que possuem preview_url
      const filteredTracks = response.data.tracks.items.filter((track: any) => track.preview_url);
      return filteredTracks; // Retorna os itens encontrados filtrados
    } else {
      throw new Error('Resposta da API sem resultados de busca');
    }
  } catch (error) {
    console.error('Erro ao buscar resultados de música:', error);
    // Lança erro detalhado para o chamador tratar
    throw new Error('Erro ao buscar resultados de música');
  }
};

export const getArtistBio = async(spotifyArtistName:any) => {
  const lastFmEndpoint = `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(spotifyArtistName)}&api_key=d68c16389f99b9d880af60dfe0333972&format=json`;

  const response = await fetch(lastFmEndpoint);
  const data = await response.json();

  return data.artist?.bio?.content || 'Biografia não encontrada.';
}

export const getArtistImage = async (artistName: string, token: string): Promise<string> => {
  try {
    const response = await axios.get(`${SPOTIFY_API_URL}/search`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: artistName,
        type: 'artist',
        limit: 1,
      },
    });

    const artist = response.data.artists.items[0];
    return artist?.images[0]?.url || ''; // Retorna o URL da imagem ou vazio se não existir
  } catch (error) {
    console.error('Erro ao buscar imagem do artista:', error);
    return '';
  }
};


export const getArtistMonthlyListeners = async (artistId: string, token: string): Promise<number | null> => {
  try {
    const response = await axios.get(`${SPOTIFY_API_URL}/artists/${artistId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const artistData = response.data;
    return artistData?.followers?.total || null; // Retorna o número de seguidores (pode ser usado como métrica para ouvintes mensais)
  } catch (error) {
    console.error('Erro ao buscar ouvintes mensais:', error);
    return null;
  }
};

export const getArtistId = async (artistName: string, token: string): Promise<string | null> => {
  try {
    const response = await axios.get(`${SPOTIFY_API_URL}/search`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: artistName,
        type: 'artist',
        limit: 1,
      },
    });

    const artist = response.data.artists.items[0];
    return artist?.id || null;
  } catch (error) {
    console.error('Erro ao buscar ID do artista:', error);
    return null;
  }
};


export const getArtistPopularity = async (artistId: string, token: string): Promise<number | null> => {
  try {
    const response = await axios.get(`${SPOTIFY_API_URL}/artists/${artistId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return response.data.popularity; // Retorna a popularidade do artista
  } catch (error) {
    console.error('Erro ao buscar popularidade do artista:', error);
    return null;
  }
};
