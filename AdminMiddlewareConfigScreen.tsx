import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const AdminMiddlewareConfigScreen = () => {
  const [logLevel, setLogLevel] = useState('INFO');
  const [isWafEnabled, setIsWafEnabled] = useState(false);
  const [isRateLimitEnabled, setIsRateLimitEnabled] = useState(true);
  const [isMaintenanceEnabled, setIsMaintenanceEnabled] = useState(false);

  // NOTE: A real implementation would use a proper Picker/Modal component.
  // For this UI mockup, we'll just display the current value.

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Configuration du Middleware</Text>

      {/* Section Journalisation */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Paramètres de Journalisation</Text>
        <View style={styles.settingRow}>
          <Text style={styles.label}>Niveau de log</Text>
          <TouchableOpacity style={styles.pickerButton}>
            <Text style={styles.pickerText}>{logLevel}</Text>
            <Icon name="chevron-down" size={20} color="#8892B0" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Section Sécurité */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Paramètres de Sécurité</Text>
        <View style={styles.settingRow}>
          <Text style={styles.label}>Activer le pare-feu applicatif (WAF)</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#28a745' }}
            thumbColor={isWafEnabled ? '#f4f3f4' : '#f4f3f4'}
            onValueChange={() => setIsWafEnabled(previousState => !previousState)}
            value={isWafEnabled}
          />
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.label}>Activer la limitation de débit</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#28a745' }}
            thumbColor={isRateLimitEnabled ? '#f4f3f4' : '#f4f3f4'}
            onValueChange={() => setIsRateLimitEnabled(previousState => !previousState)}
            value={isRateLimitEnabled}
          />
        </View>
      </View>

      {/* Section Maintenance */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Maintenance</Text>
        <View style={styles.settingRow}>
          <Text style={styles.label}>Activer le mode maintenance</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#e60000' }}
            thumbColor={isMaintenanceEnabled ? '#f4f3f4' : '#f4f3f4'}
            onValueChange={() => setIsMaintenanceEnabled(previousState => !previousState)}
            value={isMaintenanceEnabled}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Sauvegarder</Text>
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
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2c3e50',
    paddingBottom: 10,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  label: {
    fontSize: 16,
    color: '#ccd6f6',
    flex: 1,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A192F',
    borderWidth: 1,
    borderColor: '#2c3e50',
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  pickerText: {
    color: '#fff',
    marginRight: 10,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AdminMiddlewareConfigScreen;
