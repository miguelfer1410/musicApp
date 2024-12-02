import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { Context } from '@/context/Context';

export default function MusicProgressBar({ currentTime, onTimeChange, onReset }: any) {
  const { state } = useContext(Context);
  const [progress, setProgress] = useState(currentTime || 0);
  const defaultDuration = 28;

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  useEffect(() => {
    setProgress(currentTime || 0); // Sincroniza o progresso com currentTime ao montar
  }, [currentTime]);

  useEffect(() => {
    if (!state.isPlaying) return;
  
    const interval = setInterval(() => {
      setProgress((prev: number) => {
        const next = prev + 1;
  
        if (next >= defaultDuration) {
          clearInterval(interval); // Interrompe o temporizador
          if (onReset) onReset(); // Chama o callback de reset
          return defaultDuration; // Garante que não ultrapasse o limite
        }
  
        return next;
      });
    }, 1000);
  
    return () => clearInterval(interval);
  }, [state.isPlaying]);
  

  // Reseta a barra de progresso quando o botão de play for pressionado após o término
  useEffect(() => {
    if (progress >= defaultDuration && state.isPlaying) {
      setProgress(0); // Reinicia o progresso
      if (onTimeChange) onTimeChange(0); // Reinicia o áudio para o início
    }
  }, [progress, state.isPlaying]);

  return (
    <View style={styles.progressContainer}>
      <Text style={styles.timeText}>{formatTime(progress)}</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={defaultDuration}
        value={progress}
        minimumTrackTintColor="#1DB954"
        maximumTrackTintColor="#404040"
        thumbTintColor="#1DB954"
        onValueChange={(value) => {
          setProgress(value); // Atualiza o progresso manualmente
          onTimeChange(value); // Callback para sincronizar com o áudio
        }}
      />
      <Text style={styles.timeText}>{formatTime(defaultDuration)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 20,
    alignSelf: 'center',
  },
  slider: {
    flex: 1,
    marginHorizontal: 10,
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
  },
});
