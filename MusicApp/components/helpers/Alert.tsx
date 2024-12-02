import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface AlertProps {
  visible: boolean;
  alertMessage: string;
  duration?: number; // Duration in milliseconds
}

const Alert: React.FC<AlertProps> = ({ visible, alertMessage, duration = 3000 }) => {
  const [isVisible, setIsVisible] = React.useState(visible);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setIsVisible(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setIsVisible(false));
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, fadeAnim]);

  if (!isVisible) return null;

  return (
    <Animated.View style={[styles.alertContainer, { opacity: fadeAnim }]}>
      <Text style={styles.alertMessage}>{alertMessage}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  alertContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  alertMessage: {
    color: 'black',
    fontSize: 13,
    alignSelf:'flex-start'
  },
});

export default Alert;