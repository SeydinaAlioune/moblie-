import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';



const AdminGlpiConfigScreen = () => {
  const [apiUrl, setApiUrl] = useState('');
  const [appToken, setAppToken] = useState('');
  const [userToken, setUserToken] = useState(''); // Ce champ n'est pas géré par l'API de configuration actuelle
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get(`${API_BASE_URL}/config/glpi`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // L'API ne retourne que l'URL pour des raisons de sécurité
        setApiUrl(response.data.GLPI_API_URL || '');
      } catch (error) {
        console.error('Erreur de chargement config:', error);
        Alert.alert('Erreur', 'Impossible de charger la configuration GLPI.');
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const handleSave = async () => {
    if (!apiUrl && !appToken) {
        Alert.alert('Info', 'Veuillez au moins renseigner l\'URL de l\'API ou un token d\'application.');
        return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      // Le backend attend un objet avec ces clés spécifiques
      const payload = {
        GLPI_API_URL: apiUrl,
        GLPI_APP_TOKEN: appToken,
      };

      await axios.post(`${API_BASE_URL}/config/glpi`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Alert.alert('Succès', 'Configuration GLPI mise à jour.');
      // Vider le champ de token après la sauvegarde pour la sécurité
      setAppToken('');

    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Une erreur est survenue lors de la sauvegarde.';
      Alert.alert('Erreur de sauvegarde', errorMessage);
    } finally {
      setLoading(false);
    }
  };

    if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#64ffda" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Configuration de la Connexion GLPI</Text>
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>URL de l'API GLPI</Text>
          <TextInput
            style={styles.input}
            value={apiUrl}
            onChangeText={setApiUrl}
            placeholderTextColor="#8892B0"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Token d'application</Text>
          <TextInput
            style={styles.input}
            value={appToken}
            onChangeText={setAppToken}
            placeholder="Laisser vide pour ne pas changer"
            placeholderTextColor="#8892B0"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Token Utilisateur</Text>
          <TextInput
            style={styles.input}
            value={userToken}
            onChangeText={setUserToken}
            placeholder="Laisser vide pour ne pas changer"
            placeholderTextColor="#8892B0"
          />
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
          <Text style={styles.saveButtonText}>Sauvegarder</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A192F',
  },
  container: {
    flex: 1,
    backgroundColor: '#0A192F',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  formContainer: {
    backgroundColor: '#172A46',
    borderRadius: 8,
    padding: 25,
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 14,
    color: '#ccd6f6',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#0A192F',
    borderWidth: 1,
    borderColor: '#2c3e50',
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 10,
    paddingHorizontal: 25,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AdminGlpiConfigScreen;
