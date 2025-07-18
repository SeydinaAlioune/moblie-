import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, SafeAreaView, Dimensions, Animated, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// --- History Panel Data & Types ---
interface HistoryItem {
  id: string;
  title: string;
  description: string;
  status: 'En cours' | 'Résolu';
  statusColor: string;
  date: string;
}

const historyData: HistoryItem[] = [
  {
    id: '1',
    title: 'Problème d\'imprimante',
    description: 'Mon imprimante n\'imprime plus depuis ...',
    status: 'En cours',
    statusColor: '#f0ad4e',
    date: 'Aujourd\'hui, 10:24',
  },
  {
    id: '2',
    title: 'Paiement refusé',
    description: 'Mon paiement a été refusé lors de ma d...',
    status: 'Résolu',
    statusColor: '#5cb85c',
    date: 'Hier, 14:05',
  },
];
// --- End History Panel Data ---

const ChatScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [messages, setMessages] = useState([
    { id: '1', text: 'Bonjour, comment puis-je vous aider concernant votre problème ?', user: 'bot' },
    { id: '2', text: 'Bonjour, j\'ai un problème avec mon imprimante qui ne veut plus imprimer. Elle affiche "Erreur papier" mais j\'ai vérifié et il n\'y a pas de bourrage.', user: 'me' },
  ]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList<any>>(null);
  const [isHistoryPanelOpen, setHistoryPanelOpen] = useState(false);
  
  const panelTranslateX = useRef(new Animated.Value(-Dimensions.get('window').width * 0.85)).current;

  const toggleHistoryPanel = () => {
     
    setHistoryPanelOpen(previousState => !previousState);
  };

  useEffect(() => {
    const panelWidth = Dimensions.get('window').width * 0.85;
    const targetValue = isHistoryPanelOpen ? 0 : -panelWidth;

    Animated.timing(panelTranslateX, {
        toValue: targetValue,
        duration: 300,
        useNativeDriver: true,
    }).start();
  }, [isHistoryPanelOpen]);

  const handleSend = () => {
    if (inputText.trim().length > 0) {
      const newMessage = { id: Date.now().toString(), text: inputText, user: 'me' };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setInputText('');
      // Simulate bot response
      setTimeout(() => {
        const botResponse = { id: Date.now().toString(), text: 'D\'accord, je regarde ça.', user: 'bot' };
        setMessages(prevMessages => [...prevMessages, botResponse]);
      }, 1000);
    }
  };

  const renderHistoryItem = ({ item }: { item: HistoryItem }) => (
    <View style={styles.historyRequestItem}>
      <View>
        <Text style={styles.historyItemTitle}>{item.title}</Text>
        <Text style={styles.historyItemDescription}>{item.description}</Text>
        <View style={styles.historyStatusContainer}>
            <View style={[styles.historyStatusBadge, { backgroundColor: item.statusColor }]}>
                <Text style={styles.historyStatusText}>{item.status}</Text>
            </View>
            <Text style={styles.historyItemDate}>{item.date}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <View style={styles.logoContainer}>
            <Image source={require('./assets/logo.jpg')} style={styles.logo} />
            <View>
              <Text style={styles.logoText}>CRÉDIT MUTUEL</Text>
              <Text style={styles.logoTextSub}>DU SÉNÉGAL</Text>
            </View>
          </View>
          <TouchableOpacity onPress={toggleHistoryPanel} style={styles.headerIcon}>
            <Icon name="clock" size={24} color="#555" />
          </TouchableOpacity>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={({ item }) => (
            <View 
              style={[styles.messageBubble, item.user === 'me' ? styles.myMessage : styles.botMessage]}
            >
              <Text style={item.user === 'me' ? styles.myMessageText : styles.botMessageText}>
                {item.text}
              </Text>
            </View>
          )}
          keyExtractor={item => item.id}
          style={styles.messagesContainer}
          contentContainerStyle={{ paddingBottom: 10 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Posez votre question ici !"
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity style={styles.iconButton}>
              <Icon name="mic" size={24} color="#555" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Icon name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {isHistoryPanelOpen && (
          <TouchableOpacity
              style={styles.overlay}
              activeOpacity={1}
              onPress={toggleHistoryPanel}
          />
      )}

      <Animated.View style={[styles.historyPanel, { transform: [{ translateX: panelTranslateX }], zIndex: isHistoryPanelOpen ? 1000 : -1  }]}>
          <SafeAreaView style={{ flex: 1 }}>
            <View style={[styles.historyHeader, { paddingTop: insets.top + 15 }]}>
                <Text style={styles.historyHeaderTitle}>Historique des requêtes</Text>
                <TouchableOpacity onPress={toggleHistoryPanel}>
                    <Icon name="x" size={24} color="#333" />
                </TouchableOpacity>
            </View>
            <FlatList
                data={historyData}
                renderItem={renderHistoryItem}
                keyExtractor={item => item.id}
                style={{ flex: 1 }} // Allow list to take available space
                contentContainerStyle={styles.historyListContainer}
            />
            <View style={styles.profileSection}>
              <View style={styles.profileInfo}>
                <Icon name="user" size={24} color="#333" />
                <View style={{ marginLeft: 15 }}>
                  <Text style={styles.profileName}>Maman</Text>
                  <Text style={styles.profileEmail}>m.maman@email.com</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('Connexion')}>
                <Icon name="log-out" size={20} color="#e60000" />
                <Text style={styles.logoutButtonText}>Déconnexion</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 999,
  },
  // --- History Panel Styles ---
  historyPanel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: Dimensions.get('window').width * 0.85,
    backgroundColor: '#f9f9f9',
    
    borderRightWidth: 1,
    borderRightColor: '#ddd',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerIcon: {
    padding: 5,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
    resizeMode: 'contain',
  },
  logoText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#003366',
  },
  logoTextSub: {
    fontSize: 12,
    color: '#555',
  },
  historyHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  historyListContainer: {
    padding: 20,
  },
  historyRequestItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  historyItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  historyItemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  historyStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  historyStatusBadge: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  historyStatusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  historyItemDate: {
    fontSize: 12,
    color: '#999',
  },
  // --- Original Chat Screen Styles ---
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 15,
    borderRadius: 20,
    marginVertical: 5,
  },
  myMessage: {
    backgroundColor: '#e60000',
    alignSelf: 'flex-end',
  },
  botMessage: {
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-start',
  },
  myMessageText: {
    color: '#fff',
  },
  botMessageText: {
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#f9f9f9',
    borderRadius: 20,
    paddingHorizontal: 15,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    marginRight: 10,
  },
  iconButton: {
    padding: 10,
  },
  sendButton: {
    backgroundColor: '#e60000',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // --- Profile Section Styles ---
  profileSection: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  profileEmail: {
    fontSize: 14,
    color: '#777',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
  },
  logoutButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#e60000',
    fontWeight: '500',
  },
});

export default ChatScreen;
