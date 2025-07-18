import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './App'; // Assurez-vous que ce type est exporté depuis App.tsx
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather'; // Reverted to fix visibility issue

const DashboardScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const userName = 'Marie Dupont'; // Nom d'utilisateur en dur pour l'exemple

  const frequentQuestions = [
    {
      icon: 'printer',
      title: 'Problème d\'impression',
      subtitle: 'Résoudre les problèmes d\'imprimante',
    },
    {
      icon: 'lock',
      title: 'Accès à mon compte',
      subtitle: 'Problèmes de connexion',
    },
    {
      icon: 'credit-card',
      title: 'Paiement non pris en compte',
      subtitle: 'Problèmes de transaction',
    },
    {
      icon: 'truck',
      title: 'Suivi de commande',
      subtitle: 'Localiser ma commande',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Image
            source={require('./assets/logo.jpg')}
            style={styles.logoImage}
          />
          <Text style={styles.logoText}>CRÉDIT MUTUEL DU SÉNÉGAL</Text>
        </View>

        <Text style={styles.welcomeText}>
          Bonjour, <Text style={styles.userName}>{userName}</Text> 👋 Comment puis-je
          vous aider aujourd'hui ?
        </Text>

        <TouchableOpacity 
          style={styles.searchBar}
          onPress={() => navigation.navigate('Chat')}
        >
          <Text style={styles.searchText}>Sur quoi travaillez-vous ?</Text>
          <Icon name="chevron-right" size={24} color="#e60000" />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Questions fréquentes</Text>

        <View style={styles.grid}>
          {frequentQuestions.map((item, index) => (
            <TouchableOpacity key={index} style={styles.card}>
              <View style={styles.iconContainer}>
                <Icon name={item.icon} size={20} color="#e60000" />
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.footerText}>
          © 2025 Service de Support - Centre d'aide
        </Text>

        {/* Background Glows */}
        <View style={[styles.glow, styles.glowTopLeft]} />
        <View style={[styles.glow, styles.glowBottomRight]} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 15, // Added padding to move content down
  },
  container: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  logoImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginRight: 10,
  },
  logoText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  welcomeText: {
    fontSize: 26, // Slightly larger
    fontWeight: '300',
    color: '#3c3c3c',
    marginBottom: 25,
    lineHeight: 36,
  },
  userName: {
    color: '#e60000',
    fontWeight: 'bold',
  },
  searchBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#e60000',
    borderRadius: 12,
    marginBottom: 45,
    backgroundColor: 'white',
  },
  searchText: {
    fontSize: 16,
    color: '#555',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 25,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 18,
    alignItems: 'flex-start',
    shadowColor: '#999',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2, // More subtle shadow
    shadowRadius: 2.5,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(230, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#777',
    lineHeight: 18,
  },
  footerText: {
    marginTop: 30,
    textAlign: 'center',
    color: '#aaa',
    fontSize: 12,
  },
  glow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    opacity: 0.15,
    zIndex: -1,
  },
  glowTopLeft: {
    top: -50,
    left: -50,
    backgroundColor: '#ffdddd',
  },
  glowBottomRight: {
    bottom: -50,
    right: -50,
    backgroundColor: '#ddeeff',
  },
});

export default DashboardScreen;
