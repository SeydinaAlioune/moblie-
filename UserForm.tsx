import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

// Définit la structure des données du formulaire
export interface UserFormData {
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'superadmin' | 'agent_support' | 'agent_interne' | 'client';
  status: 'active' | 'pending' | 'rejected' | 'blocked';
}

// Définit les props pour le composant
interface UserFormProps {
  onSubmit: (data: UserFormData) => void;
  onCancel: () => void;
  initialData?: UserFormData;
  isEditing?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ onSubmit, onCancel, initialData, isEditing = false }) => {
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    password: '',
    role: 'client',
    status: 'pending',
  });

  // Pré-remplit le formulaire avec les données initiales
  useEffect(() => {
    if (isEditing && initialData) {
      setFormData({
        name: initialData.name,
        email: initialData.email,
        password: '', // Toujours vider le mot de passe pour la sécurité
        role: initialData.role,
        status: initialData.status,
      });
    } else {
      // Réinitialiser pour le mode création
      setFormData({ name: '', email: '', password: '', role: 'client', status: 'pending' });
    }
  }, [initialData, isEditing]);

  const handleChange = (field: keyof UserFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const dataToSend = { ...formData };
    // Ne pas envoyer le mot de passe s'il est vide lors de la modification
    if (isEditing && !dataToSend.password) {
      delete dataToSend.password;
    }
    onSubmit(dataToSend);
  };

  return (
    <View style={styles.modalView}>
      <Text style={styles.modalTitle}>{isEditing ? 'Modifier' : 'Créer'} un utilisateur</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom complet"
        placeholderTextColor="#8892b0"
        value={formData.name}
        onChangeText={(text) => handleChange('name', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Adresse Email"
        placeholderTextColor="#8892b0"
        value={formData.email}
        onChangeText={(text) => handleChange('email', text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder={isEditing ? 'Nouveau mot de passe (laisser vide)' : 'Mot de passe'}
        placeholderTextColor="#8892b0"
        value={formData.password}
        onChangeText={(text) => handleChange('password', text)}
        secureTextEntry
      />

      <Text style={styles.label}>Rôle</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.role}
          onValueChange={(itemValue) => handleChange('role', itemValue)}
          style={styles.picker}
          dropdownIconColor="#64ffda"
        >
          <Picker.Item label="Client" value="client" />
          <Picker.Item label="Admin" value="admin" />
          <Picker.Item label="Super Admin" value="superadmin" />
          <Picker.Item label="Agent Support" value="agent_support" />
          <Picker.Item label="Agent Interne" value="agent_interne" />
        </Picker>
      </View>

      {isEditing && (
        <>
          <Text style={styles.label}>Statut</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.status}
              style={styles.picker}
              onValueChange={(itemValue) => handleChange('status', itemValue)}
              dropdownIconColor="#64ffda"
            >
              <Picker.Item label="Actif" value="active" />
              <Picker.Item label="En attente" value="pending" />
              <Picker.Item label="Rejeté" value="rejected" />
              <Picker.Item label="Bloqué" value="blocked" />
            </Picker>
          </View>
        </>
      )}

      <View style={styles.buttonContainer}>
        <Button title="Annuler" onPress={onCancel} color="#ff5c5c" />
        <Button title={isEditing ? 'Mettre à jour' : 'Créer'} onPress={handleSubmit} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalView: {
    margin: 20,
    backgroundColor: '#112240',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ccd6f6',
  },
  input: {
    width: '100%',
    backgroundColor: '#0A192F',
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    color: '#ccd6f6',
    borderWidth: 1,
    borderColor: '#8892b0',
  },
  label: {
    color: '#8892b0',
    alignSelf: 'flex-start',
    marginLeft: 5,
    marginBottom: 5,
  },
  pickerContainer: {
    width: '100%',
    backgroundColor: '#0A192F',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#8892b0',
    marginBottom: 15,
  },
  picker: {
    width: '100%',
    color: '#ccd6f6',
    height: 50, // Hauteur fixe pour la cohérence
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
});

export default UserForm;
