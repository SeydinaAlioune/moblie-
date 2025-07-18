import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

type StatCardProps = {
  icon: string;
  title: string;
  value: string | number;
  color: string;
};

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, color }) => (
  <View style={styles.card}>
    <Icon name={icon} size={28} color={color} />
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={[styles.cardValue, { color }]}>{value}</Text>
  </View>
);

const AgentAnalyticsScreen = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.headerTitle}>Analyse IA</Text>

      {/* Summary Cards */}
      <View style={styles.cardsContainer}>
        <StatCard icon="inbox" title="Tickets reçus" value="128" color="#003366" />
        <StatCard icon="repeat" title="Problèmes récurrents" value="12" color="#e60000" />
        <StatCard icon="file-text" title="Rapports automatiques" value="28" color="#ff8f00" />
      </View>

      {/* Main Chart Placeholder */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Volume des tickets (7 derniers jours)</Text>
        <View style={styles.chartPlaceholder}>
            <Icon name="bar-chart-2" size={60} color="#e0e0e0" />
            <Text style={styles.chartPlaceholderText}>Graphique à venir</Text>
        </View>
      </View>

      {/* Intelligent Summary Section */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryHeader}>
            <Icon name="cpu" size={22} color="#005A9C" />
            <Text style={styles.summaryTitle}>Résumé Intelligent de Ticket</Text>
        </View>
        <View style={styles.summaryContent}>
            <TextInput
                style={styles.summaryInput}
                placeholder="Entrez l'ID du ticket"
                placeholderTextColor="#999"
            />
            <TouchableOpacity style={styles.summaryButton}>
                <Text style={styles.summaryButtonText}>Générer le Résumé</Text>
            </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  contentContainer: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 20,
    textAlign: 'center',
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  card: {
    width: '48%', // Two cards per row with a little space
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 10,
    fontWeight: '500',
  },
  cardValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 5,
  },
  chartContainer: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 15,
  },
  chartPlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  chartPlaceholderText: {
      marginTop: 10,
      color: '#adb5bd',
  },
  // --- Summary Section Styles ---
  summaryContainer: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#343a40',
    marginLeft: 10,
  },
  summaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryInput: {
    flex: 1,
    height: 45,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    backgroundColor: '#f8f9fa',
  },
  summaryButton: {
    backgroundColor: '#005A9C',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  summaryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default AgentAnalyticsScreen;
