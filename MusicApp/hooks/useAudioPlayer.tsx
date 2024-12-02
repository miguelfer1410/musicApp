import React, { useContext, useState } from 'react';
import { Audio } from 'expo-av';
import { Context } from '@/context/Context';
import { AVPlaybackStatus, AVPlaybackStatusSuccess } from 'expo-av';

const useAudioPlayer = () => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const { state, dispatch } = useContext(Context);
  const [hasFinished, setHasFinished] = useState(false);

  const playPreview = async (previewUrl: string) => {
    try {
      // Se o som terminou, reinicia
      if (hasFinished) {
        setHasFinished(false); // Reseta o estado
        if (sound) {
          await sound.unloadAsync(); // Descarrega o som anterior
        }
      }

      // Verifica se já existe um som carregado
      if (sound) {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          if (status.isPlaying) {
            await sound.pauseAsync(); // Pausa se já estiver tocando
            dispatch({ type: 'SET_PLAY_STATE', payload: false });
            return;
          } else {
            await sound.playFromPositionAsync(0); // Recomeça do início
            dispatch({ type: 'SET_PLAY_STATE', payload: true });
            return;
          }
        }
        await sound.unloadAsync(); // Descarrega o som se algo der errado
      }

      // Cria um novo som
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: previewUrl },
        { shouldPlay: true }
      );

      setSound(newSound);
      dispatch({ type: 'SET_PLAY_STATE', payload: true });

      // Atualiza o estado de reprodução
      newSound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
        if (status.isLoaded) {
          const playbackStatus = status as AVPlaybackStatusSuccess;
          if (playbackStatus.didJustFinish) {
            setHasFinished(true); // Marca como terminado
            dispatch({ type: 'SET_PLAY_STATE', payload: false });
          }
        }
      });
    } catch (error) {
      console.error('Erro ao tocar o áudio:', error);
    }
  };

  const stopPreview = async () => {
    if (sound) {
      const status = await sound.getStatusAsync();
      if (status.isLoaded && status.isPlaying) {
        await sound.pauseAsync();
        dispatch({ type: 'SET_PLAY_STATE', payload: false });
      }
    }
  };

  return {
    playPreview,
    stopPreview,
  };
};

export default useAudioPlayer;
