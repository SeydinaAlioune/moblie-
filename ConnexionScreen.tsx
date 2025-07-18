import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView, 
  TouchableOpacity,
  ImageBackground,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather'; 
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from './App'; 

type ConnexionScreenNavigationProp = NavigationProp<RootStackParamList, 'Connexion'>;

const ConnexionScreen = () => {
  const navigation = useNavigation<ConnexionScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

          const handleLogin = () => {
    // 1. Valider que les champs ne sont pas vides
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    // 2. Vérifier les identifiants de l'agent
    if (email.toLowerCase() === 'agent.support@cms.sn' && password === 'password') {
      // Si c'est l'agent, naviguer vers son interface et arrêter la fonction
      navigation.navigate('AgentFlow');
      return;
    }

    // 3. Si ce n'est pas l'agent, continuer le flux normal pour le client
    Alert.alert(
      'Connexion Client',
      `Email: ${email}\nMot de passe: ${password}`,
    );

    // Naviguer vers le tableau de bord client
    navigation.navigate('Dashboard');
  };
  return (
    <ImageBackground
      source={require('./assets/connexion.jpg')}
      resizeMode="cover"
      style={styles.background}>
      <SafeAreaView style={styles.container}>
        <View style={styles.formContainer}>
          <View style={styles.header}>
            <Image source={require('./assets/logo.jpg')} style={styles.logo} />
            <Text style={styles.headerText}>CRÉDIT MUTUEL DU SÉNÉGAL</Text>
          </View>
          <Text style={styles.title}>Connexion</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Identifiant / Email</Text>
            <View style={styles.inputWrapper}>
              <Icon name="user" size={20} color="#888" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#aaa"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mot de passe</Text>
            <View style={styles.inputWrapper}>
              <Icon name="lock" size={20} color="#888" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                placeholderTextColor="#aaa"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
          </View>

          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.checkboxContainer}>
              <View style={styles.checkbox} />
              <Text style={styles.checkboxLabel}>Se souvenir de moi</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.forgotPassword}>Mot de passe oublié ?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Se connecter</Text>
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Vous n'avez pas de compte? </Text>
            <TouchableOpacity>
              <Text style={styles.signupLink}>Créer un compte</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: 'rgba(45, 52, 54, 0.95)',
    borderRadius: 25, // Plus arrondi
    paddingHorizontal: 25,
    paddingVertical: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20, // Plus d'espace
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  headerText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  title: {
    color: 'white',
    fontSize: 26, // Plus grand
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30, // Plus d'espace
  },
  inputGroup: {
    marginBottom: 20, // Plus d'espace
  },
  label: {
    color: '#ddd',
    fontSize: 13, // Un peu plus grand
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15, // Plus arrondi
    paddingHorizontal: 15,
    height: 55,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#333',
    fontSize: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25, // Plus d'espace
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 14,
    height: 14,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
    marginRight: 8,
  },
  checkboxLabel: {
    color: 'white',
    fontSize: 13,
  },
  forgotPassword: {
    color: 'white',
    fontSize: 13,
  },
  loginButton: {
    backgroundColor: '#e60000',
    paddingVertical: 16,
    borderRadius: 15, // Plus arrondi
    alignItems: 'center',
    marginBottom: 25, // Plus d'espace
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signupText: {
    color: 'white',
    fontSize: 14,
  },
  signupLink: {
    color: '#ff4757', // Rouge plus subtil
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default ConnexionScreen;
