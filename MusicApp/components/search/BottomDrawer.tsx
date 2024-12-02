import React, { FC, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Animated,
  PanResponder,
  Platform,
} from 'react-native';

interface BottomDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  header?: React.ReactNode;
  children: React.ReactNode;
  height?: number; // Altura personalizada (0-1, representa a porcentagem da altura da tela)
  enableDragToClose?: boolean; // Habilita/desabilita o gesto de arrastar para fechar
  showIndicator?: boolean; // Mostra/esconde o indicador de arraste
  backgroundColor?: string; // Cor de fundo personalizada
  overlayOpacity?: number; // Opacidade do overlay
}

const BottomDrawer: FC<BottomDrawerProps> = ({
  isOpen,
  onClose,
  header,
  children,
  height = 0.5,
  enableDragToClose = true,
  showIndicator = true,
  backgroundColor = '#1A1A1A',
  overlayOpacity = 0.75,
}) => {
  const windowHeight = Dimensions.get('window').height;
  const drawerHeight = windowHeight * Math.min(Math.max(height, 0.3), 0.95);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (_, gestureState) =>
        enableDragToClose && gestureState.dy > 0,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        enableDragToClose && gestureState.dy > 0,
      onPanResponderMove: (_, gestureState) => {
        const distance = Math.min(Math.max(0, gestureState.dy), drawerHeight);
        slideAnim.setValue(distance);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > drawerHeight * 0.3 || gestureState.vy > 0.5) {
          closeDrawer();
        } else {
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 0,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (isOpen) {
      openDrawer();
    } else {
      closeDrawer();
    }
  }, [isOpen]);

  const openDrawer = () => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeDrawer = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: drawerHeight,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  };

  return (
    <Modal
      transparent={true}
      visible={isOpen}
      onRequestClose={closeDrawer}
      statusBarTranslucent={true}
      animationType="none"
    >
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: overlayAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, overlayOpacity],
              }),
            },
          ]}
        >
          <TouchableWithoutFeedback onPress={closeDrawer}>
            <View style={styles.overlayTouchable} />
          </TouchableWithoutFeedback>
        </Animated.View>

        <Animated.View
          style={[
            styles.bottomSheet,
            {
              height: drawerHeight,
              backgroundColor,
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, drawerHeight],
                    outputRange: [0, drawerHeight],
                    extrapolate: 'clamp',
                  }),
                },
              ],
            },
          ]}
          {...panResponder.panHandlers}
        >
          {showIndicator && (
            <View style={styles.indicatorContainer}>
              <View style={styles.indicator} />
            </View>
          )}

          {header && <View style={styles.header}>{header}</View>}

          <View
            style={styles.content}
            // Bloqueia o PanResponder de capturar eventos dentro do conteúdo
            onStartShouldSetResponder={() => true}
          >
            {children}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    opacity: 0,
  },
  overlayTouchable: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 20,
  },
  indicatorContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  indicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'gray',
  },
  header: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 16,
  },
  content: {
    flex: 1,
  },
});

export default BottomDrawer;
