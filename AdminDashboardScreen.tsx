import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { AdminDrawerParamList } from './AdminNavigator';

type DashboardNavigationProp = DrawerNavigationProp<AdminDrawerParamList, 'Tableau de bord'>;

const AdminDashboardScreen = () => {
  const navigation = useNavigation<DashboardNavigationProp>();

  const cards = [
    {
      title: 'Gestion des Rôles et des Accès',
      icon: 'users',
      description: 'L\'administrateur doit pouvoir créer de nouveaux utilisateurs, modifier leurs informations, et surtout leur assigner un rôle.',
      screen: 'Utilisateurs & Rôles',
    },
    {
      title: 'Configuration de la Connexion GLPI',
      icon: 'share-2',
      description: 'L\'administrateur a besoin d\'un formulaire simple pour entrer les informations de connexion à votre système GLPI.',
      screen: 'Connexion GLPI',
    },
    {
      title: 'Base de Connaissances de l\'IA',
      icon: 'database',
      description: 'C\'est le cerveau du chatbot. L\'administrateur doit avoir une interface pour entraîner l\'IA, par exemple en téléversant des Q/R.',
      screen: 'Base de connaissances',
    },
    {
      title: 'Configuration du Middleware',
      icon: 'tool',
      description: 'Un panneau de configuration plus général pour les paramètres techniques du système qui ne rentrent pas dans les autres catégories.',
      screen: 'Middleware',
    },
  ];

  return (
    <View style={styles.container}>
        <Image source={require('./assets/logo.jpg')} style={styles.logo} />
      <Text style={styles.mainTitle}>BIENVENUE SUR LE TABLEAU DE BORD ADMIN</Text>
      <View style={styles.grid}>
        {cards.map((card, index) => (
          <TouchableOpacity key={index} style={styles.card} onPress={() => navigation.navigate(card.screen as any)}>
            <Icon name={card.icon} size={24} color="#e60000" style={styles.icon} />
            <Text style={styles.cardTitle}>{card.title}</Text>
            <Text style={styles.cardDescription}>{card.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    logo: {
      width: 100,
      height: 100,
      alignSelf: 'center',
      marginTop: 5,
      marginBottom: 15,
      borderRadius: 50,
    },
  container: {
    flex: 1,
    backgroundColor: '#0A192F',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    textAlign: 'left',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#172A46',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    minHeight: 220, // Give cards a consistent height
  },
  icon: {
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 13,
    color: '#8892B0', // Lighter text color for description
    lineHeight: 18,
  },
});

export default AdminDashboardScreen;
