import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';

const AdminGlpiConfigScreen = () => {
  const [apiUrl, setApiUrl] = useState('http://localhost:8080/apirest.php/');
  const [appToken, setAppToken] = useState('');
  const [userToken, setUserToken] = useState('');

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
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Sauvegarder</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
