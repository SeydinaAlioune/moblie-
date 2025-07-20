import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Switch, Modal, StyleSheet, Alert, ActivityIndicator, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from './config';

// Définition du type pour la configuration, aligné avec le backend
interface MiddlewareConfig {
  log_level: 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  waf_enabled: boolean;
  rate_limiting_enabled: boolean; // Corrigé pour correspondre au backend
  maintenance_mode: boolean;
}

const AdminMiddlewareConfigScreen = () => {
  const [config, setConfig] = useState<MiddlewareConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);

  // Fonction pour créer une instance axios avec le token d'authentification
  const getAuthorizedAxios = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert("Erreur d'authentification", "Votre session a expiré. Veuillez vous reconnecter.");
      // Ici, vous pourriez implémenter une navigation vers l'écran de connexion
      return null;
    }
    return axios.create({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  // Fonction pour charger la configuration depuis le backend
  const fetchConfig = useCallback(async () => {
    try {
      setLoading(true);
      const authorizedAxios = await getAuthorizedAxios();
      if (!authorizedAxios) return;

      const response = await authorizedAxios.get(`${API_BASE_URL}/config/middleware`);
      setConfig(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération de la configuration:", error);
      Alert.alert("Erreur", "Impossible de charger la configuration du middleware.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger la configuration au montage du composant
  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  // Fonction pour sauvegarder la configuration
  const handleSave = async () => {
    if (!config) return;
    try {
      setSaving(true);
      const authorizedAxios = await getAuthorizedAxios();
      if (!authorizedAxios) return;

      await authorizedAxios.post(`${API_BASE_URL}/config/middleware`, config);
      Alert.alert("Succès", "La configuration a été mise à jour.");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la configuration:", error);
      Alert.alert("Erreur", "Impossible de sauvegarder la configuration.");
    } finally {
      setSaving(false);
    }
  };

  // Gérer les changements de valeur
  const handleValueChange = (key: keyof MiddlewareConfig, value: any) => {
    if (config) {
      setConfig({ ...config, [key]: value });
    }
  };

  if (loading && !config) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.centeredText}>Chargement de la configuration...</Text>
      </View>
    );
  }

  if (!config) {
    return (
      <View style={styles.centered}>
        <Text style={styles.centeredText}>Aucune configuration n'a pu être chargée.</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchConfig}>
          <Text style={styles.saveButtonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Configuration du Middleware</Text>

      {/* Log Level */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Journalisation</Text>
        <View style={styles.settingItem}>
          <Text style={styles.label}>Niveau de log</Text>
          <TouchableOpacity style={styles.pickerContainer} onPress={() => setPickerVisible(true)}>
            <Text style={styles.pickerText}>{config.log_level}</Text>
            <Icon name="chevron-down" size={20} color="#F0F4F8" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Sécurité */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Sécurité</Text>
        <View style={styles.settingItem}>
          <Text style={styles.label}>Activer le pare-feu (WAF)</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={config.waf_enabled ? "#4A90E2" : "#f4f3f4"}
            value={config.waf_enabled}
            onValueChange={(value) => handleValueChange('waf_enabled', value)}
          />
        </View>
        <View style={styles.separator} />
        <View style={styles.settingItem}>
          <Text style={styles.label}>Activer la limitation de débit</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={config.rate_limiting_enabled ? "#4A90E2" : "#f4f3f4"}
            value={config.rate_limiting_enabled}
            onValueChange={(value) => handleValueChange('rate_limiting_enabled', value)}
          />
        </View>
      </View>

      {/* Maintenance */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Maintenance</Text>
        <View style={styles.settingItem}>
          <Text style={styles.label}>Activer le mode maintenance</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={config.maintenance_mode ? "#4A90E2" : "#f4f3f4"}
            value={config.maintenance_mode}
            onValueChange={(value) => handleValueChange('maintenance_mode', value)}
          />
        </View>
      </View>

      <TouchableOpacity style={[styles.saveButton, saving && styles.saveButtonDisabled]} onPress={handleSave} disabled={saving}>
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Sauvegarder</Text>
        )}
      </TouchableOpacity>

      {/* Modal for Log Level Picker */}
      <Modal
        transparent={true}
        visible={pickerVisible}
        animationType="fade"
        onRequestClose={() => setPickerVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setPickerVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choisir un niveau de log</Text>
            <FlatList
              data={['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL']}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.modalItem}
                  onPress={() => {
                    handleValueChange('log_level', item as MiddlewareConfig['log_level']);
                    setPickerVisible(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c1d35',
    paddingHorizontal: 15,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#0c1d35',
  },
  centeredText: {
    color: '#F0F4F8',
    marginTop: 10,
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F0F4F8',
    textAlign: 'center',
    marginVertical: 20,
  },
  card: {
    backgroundColor: '#102a43',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F0F4F8',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#244160',
    paddingBottom: 10,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  label: {
    fontSize: 16,
    color: '#BCCCDC',
    flex: 1, 
    marginRight: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#244160',
    marginVertical: 5,
  },
  saveButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  saveButtonDisabled: {
    backgroundColor: '#5a7eab',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  retryButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0c1d35',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#244160',
    minWidth: 120,
  },
  pickerText: {
    color: '#F0F4F8',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#102a43',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxHeight: '60%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F0F4F8',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#244160',
  },
  modalItemText: {
    color: '#BCCCDC',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default AdminMiddlewareConfigScreen;
