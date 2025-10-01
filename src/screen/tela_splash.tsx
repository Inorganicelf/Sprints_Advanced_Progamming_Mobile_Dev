import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface TelaSplashProps {
  onStart?: () => void;
  navigation?: any; // Adiciona navigation como prop opcional
}

const TelaSplash: React.FC<TelaSplashProps> = ({ onStart, navigation }) => {
  const [showButton, setShowButton] = useState<boolean>(false);
  
  // Animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    startAnimation();
  }, []);

  const startAnimation = () => {
    // Primeira fase: fade in do fundo
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start(() => {
      // Segunda fase: animação do logo completo
      animateLogo();
    });
  };

  const animateLogo = () => {
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Terceira fase: pulso do logo
      pulseAnimation();
    });
  };

  const pulseAnimation = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Quarta fase: mostrar botão
      setTimeout(() => {
        showStartButton();
      }, 500);
    });
  };

  const showStartButton = () => {
    setShowButton(true);
    Animated.parallel([
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Função de navegação
  const navigateToNextScreen = () => {
    if (navigation) {
      navigation.navigate('FLATLIST'); // Navega para a tela da FlatList
    }
  };

  const handleStartPress = () => {
    // Animação de saída do botão
    Animated.parallel([
      Animated.timing(buttonOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Chama a função de navegação
      navigateToNextScreen();
      
      // Mantém o callback onStart para compatibilidade
      if (onStart) {
        onStart();
      }
    });
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* Fundo com gradiente simulado */}
        <View style={styles.backgroundGradient} />

        {/* Logo HORIZON */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.logoText}>HORIZON</Text>
          
          {/* Linha decorativa abaixo do logo */}
          <Animated.View
            style={[
              styles.decorativeLine,
              {
                opacity: logoOpacity,
                scaleX: logoOpacity,
              },
            ]}
          />
        </Animated.View>

        {/* Subtítulo */}
        <Animated.Text
          style={[
            styles.subtitle,
            {
              opacity: logoOpacity,
            },
          ]}
        >
          Digital Twin Platform
        </Animated.Text>

        {/* Botão Começar */}
        {showButton && (
          <Animated.View
            style={[
              styles.buttonContainer,
              {
                opacity: buttonOpacity,
                transform: [{ scale: buttonScale }],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.startButton}
              onPress={handleStartPress}
              activeOpacity={0.8}
            >
              <Text style={styles.startButtonText}>COMEÇAR</Text>
              <View style={styles.buttonGlow} />
            </TouchableOpacity>
          </Animated.View>
        )}
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000',
    opacity: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 48,
    fontWeight: '300',
    color: '#FFFFFF',
    letterSpacing: 8,
    textShadowColor: '#2196F3',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  decorativeLine: {
    width: 200,
    height: 2,
    backgroundColor: '#2196F3',
    marginTop: 20,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    letterSpacing: 2,
    marginBottom: 80,
    textTransform: 'uppercase',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 100,
  },
  startButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#2196F3',
    paddingHorizontal: 50,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 3,
  },
  buttonGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 32,
    backgroundColor: '#2196F3',
    opacity: 0.1,
  },
});

export default TelaSplash;
