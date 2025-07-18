import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
  Image, // Ré-importer le composant Image
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

// Définir les types pour la navigation
type RootStackParamList = {
  Login: undefined;
  Chat: undefined;
  Connexion: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({navigation}: Props) => {
  return (
    <ImageBackground
      source={require('./assets/background.jpg')}
      resizeMode="cover"
      style={styles.background}>
      <SafeAreaView style={styles.container}>
        <View style={styles.topHeader}>
          <Text style={styles.topHeaderText}>Crédit Mutuel</Text>
          <Text style={styles.topHeaderTextSmall}>DU SÉNÉGAL</Text>
        </View>

        <View style={styles.mainContent}>
          <Image
            source={require('./assets/logo.jpg')}
            style={styles.logo}
          />
          <Text style={styles.welcomeTitle}>Bienvenue sur notre chatbot</Text>
          <Text style={styles.subTitle}>Crédit Mutuel du Sénégal</Text>
          <Text style={styles.extraSubTitle}>
            Posez vos questions bancaires 24h/24
          </Text>
        </View>

        {/* Simulation de la vague rouge avec deux formes superposées */}
        <View style={styles.waveContainer}>
          <View style={styles.wavePrimary} />
          <View style={styles.waveSecondary} />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Connexion')}>
            <Text style={styles.buttonText}>Démarrer la discussion</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(10, 25, 40, 0.75)',
  },
  topHeader: {
    alignItems: 'center',
    paddingTop: 20,
  },
  topHeaderText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  topHeaderTextSmall: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 120, // Ajustement final de la position
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 15,
    marginBottom: 25,
  },
  welcomeTitle: {
    color: 'white',
    fontSize: 34,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subTitle: {
    color: 'white',
    fontSize: 15,
    fontWeight: '300',
    marginTop: 15,
  },
  extraSubTitle: {
    color: 'white',
    fontSize: 13,
    fontWeight: '300',
    marginTop: 8,
  },
  waveContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 220,
    overflow: 'hidden',
  },
  wavePrimary: {
    position: 'absolute',
    bottom: -120,
    left: -100,
    right: -100,
    height: 300,
    backgroundColor: '#c90000',
    transform: [{rotate: '-12deg'}],
  },
  waveSecondary: {
    position: 'absolute',
    bottom: -180,
    left: -50,
    right: -200,
    height: 300,
    backgroundColor: '#a10000', // Un rouge plus sombre pour la profondeur
    transform: [{rotate: '12deg'}],
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40, // Remonte un peu le bouton
    left: 40,
    right: 40,
  },
  button: {
    backgroundColor: 'rgba(230, 0, 0, 0.9)',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;





