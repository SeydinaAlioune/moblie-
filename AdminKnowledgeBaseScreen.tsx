import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const initialFiles = [
  { id: '1', name: 'procedures_internes.pdf' },
  { id: '2', name: 'faq_produits.docx' },
  { id: '3', name: 'guides_tarifs.xlsx' },
];

const AdminKnowledgeBaseScreen = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [files, setFiles] = useState(initialFiles);

  const handleRemoveFile = (fileId: string) => {
    setFiles(files.filter(file => file.id !== fileId));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Base de Connaissances de l'IA</Text>

      {/* Section Q/R */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Entraînement par Questions/Réponses</Text>
        <TextInput
          style={styles.input}
          placeholder="Question"
          placeholderTextColor="#8892B0"
          value={question}
          onChangeText={setQuestion}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Réponse"
          placeholderTextColor="#8892B0"
          value={answer}
          onChangeText={setAnswer}
          multiline
        />
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.buttonText}>Ajouter</Text>
        </TouchableOpacity>
      </View>

      {/* Section Fichiers */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Entraînement par Fichiers</Text>
        <Text style={styles.description}>Téléversez des documents (PDF, DOCX, TXT) pour enrichir la base de connaissances.</Text>
        <TouchableOpacity style={styles.uploadButton}>
          <Icon name="upload" size={16} color="#fff" />
          <Text style={styles.buttonText}>Téléverser des fichiers</Text>
        </TouchableOpacity>
        <FlatList
          data={files}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.fileItem}>
              <Icon name="file-text" size={20} color="#8892B0" />
              <Text style={styles.fileName}>{item.name}</Text>
              <TouchableOpacity onPress={() => handleRemoveFile(item.id)}>
                <Icon name="trash-2" size={20} color="#e74c3c" />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      {/* Bouton de ré-entraînement */}
      <TouchableOpacity style={styles.retrainButton}>
        <Text style={styles.buttonText}>Ré-entraîner le modèle</Text>
      </TouchableOpacity>
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
  addButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'flex-end',
    paddingHorizontal: 25,
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
    marginBottom: 20,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A192F',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  fileName: {
    color: '#ccd6f6',
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
  },
  retrainButton: {
    backgroundColor: '#e60000',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
});

export default AdminKnowledgeBaseScreen;
