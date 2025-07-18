import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { pick } from '@react-native-documents/picker';
import axios from 'axios';
import { API_BASE_URL } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';



interface Document {
  id: number;
  title: string;
}

const AdminKnowledgeBaseScreen = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isReindexing, setIsReindexing] = useState(false);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_BASE_URL}/kb/documents`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDocuments(response.data);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger les documents.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleUpload = async () => {
    try {
            const [res] = await pick({
        type: ['application/pdf', 'application/json'],
      });

      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', {
        uri: res.uri,
        type: res.type,
        name: res.name,
      });

      const token = await AsyncStorage.getItem('userToken');
      await axios.post(`${API_BASE_URL}/kb/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert('Succès', 'Fichier téléversé avec succès.');
      fetchDocuments(); // Rafraîchir la liste
    } catch (err) {
      // The new library throws an error on cancellation, which is caught here.
      // We log it but don't show an alert to the user, preserving the original behavior.
      console.log('Picker was cancelled or failed', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (docId: number) => {
    Alert.alert(
      'Confirmer la suppression',
      'Êtes-vous sûr de vouloir supprimer ce document ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('userToken');
              await axios.delete(`${API_BASE_URL}/kb/documents/${docId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              Alert.alert('Succès', 'Document supprimé.');
              setDocuments(prev => prev.filter(doc => doc.id !== docId));
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de supprimer le document.');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleReindex = async () => {
    setIsReindexing(true);
    try {
        const token = await AsyncStorage.getItem('userToken');
        await axios.post(`${API_BASE_URL}/kb/reindex`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
        Alert.alert('Succès', 'Le ré-indexage a été lancé avec succès.');
    } catch (error) {
        Alert.alert('Erreur', 'Le ré-indexage a échoué.');
    } finally {
        setIsReindexing(false);
    }
  };

  const renderHeader = () => (
    <View>
      <Text style={styles.title}>Base de Connaissances de l'IA</Text>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Entraînement par Questions/Réponses</Text>
        <Text style={styles.disabledText}>Cette fonctionnalité est en cours de développement.</Text>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          placeholder="Question"
          placeholderTextColor="#8892B0"
          editable={false}
        />
        <TextInput
          style={[styles.input, styles.textArea, styles.disabledInput]}
          placeholder="Réponse"
          placeholderTextColor="#8892B0"
          multiline
          editable={false}
        />
        <TouchableOpacity style={[styles.addButton, styles.disabledButton]} disabled>
          <Text style={styles.buttonText}>Ajouter</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Entraînement par Fichiers</Text>
        <Text style={styles.description}>Téléversez des documents (PDF, JSON) pour enrichir la base de connaissances.</Text>
        <TouchableOpacity style={styles.uploadButton} onPress={handleUpload} disabled={isUploading}>
          {isUploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Icon name="upload" size={16} color="#fff" />
              <Text style={styles.buttonText}> Téléverser un fichier</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.retrainButton} onPress={handleReindex} disabled={isReindexing}>
            {isReindexing ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Ré-entraîner le modèle</Text>}
        </TouchableOpacity>
      </View>
      {loading && <ActivityIndicator size="large" color="#64FFDA" style={{ marginVertical: 20 }} />}
    </View>
  );



  return (
    <FlatList
      style={styles.container}
      data={documents}
      keyExtractor={(item) => item.id.toString()}
      ListHeaderComponent={renderHeader}

      renderItem={({ item }) => (
        <View style={styles.fileItem}>
          <Icon name="file-text" size={20} color="#8892B0" />
          <Text style={styles.fileName}>{item.title}</Text>
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <Icon name="trash-2" size={20} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      )}
      ListEmptyComponent={() => (
        !loading && <Text style={styles.emptyText}>Aucun document dans la base de connaissances.</Text>
      )}
    />
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#0A192F',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 20,
  },
  sectionContainer: {
    backgroundColor: '#172A46',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ccd6f6',
    marginBottom: 15,
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
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  disabledInput: {
    backgroundColor: '#2c3e50',
    color: '#8892B0',
  },
  disabledText: {
    color: '#8892B0',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'flex-end',
    paddingHorizontal: 25,
  },
  disabledButton: {
    backgroundColor: '#5a5a5a',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  description: {
    fontSize: 14,
    color: '#8892B0',
    marginBottom: 15,
    lineHeight: 20,
  },
  uploadButton: {
    flexDirection: 'row',
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10, // Réduit pour l'harmonie
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#172A46',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    marginHorizontal: 5, // Ajout pour ne pas coller aux bords
  },
  fileName: {
    color: '#ccd6f6',
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
  },
  retrainButton: {
    backgroundColor: '#e60000',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15, // Adjusted for new position
  },
  emptyText: {
    textAlign: 'center',
    color: '#8892B0',
    marginTop: 30,
    fontSize: 16,
  },
});

export default AdminKnowledgeBaseScreen;
