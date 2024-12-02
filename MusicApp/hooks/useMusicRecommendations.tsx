import { useEffect, useState, useContext } from 'react';
import { getMusicRecommendations } from '@/api/api';
import { MusicRecommendation } from '@/types/types';
import { Context } from '@/context/Context';

const useMusicRecommendations = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const { state, dispatch } = useContext(Context);

  useEffect(() => {
    // Função para buscar recomendações
    const fetchRecommendations = async () => {
      setLoading(true);

      // Verifica se o token está disponível
      if (!state.token) {
        console.warn("Token não disponível, adiando busca de recomendações");
        return;
      }

      // Se o gênero for 'Todos', envia null, caso contrário, envia o gênero selecionado
      const genreToRequest = state.selectedGenre === 'Todos' ? null : state.selectedGenre;

      try {
        const data: MusicRecommendation[] = await getMusicRecommendations(genreToRequest, state.token);

        // Atualiza as recomendações no estado global
        dispatch({
          type: 'SET_RECOMMENDATIONS',
          payload: data,
        });
      } catch (error) {
        console.error("Erro ao buscar recomendações:", error);
      } finally {
        setLoading(false);
      }
    };

    // Garante que a função será chamada mesmo no primeiro render
    fetchRecommendations();
  }, [state.selectedGenre, state.token, dispatch]); // Adiciona 'state.token' como dependência

  return { loading };
};

export default useMusicRecommendations;
