import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, SafeAreaView, Dimensions, Animated, Image, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from './config';

// --- Types ---
interface Message {
  id: string;
  text: string;
  user: 'me' | 'bot';
  date: string; // Ajout pour le tri chronologique
}

interface HistoryItem {
  id: string;
  title: string;
  description: string;
  status: 'En cours' | 'Résolu' | 'Nouveau' | 'En attente' | 'Clos';
  statusColor: string;
  date: string;
}

interface UserData {
  name: string;
  email: string;
}

// --- Component ---
const ChatScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList<any>>(null);
  const inputRef = useRef<TextInput>(null);
  const [isHistoryPanelOpen, setHistoryPanelOpen] = useState(false);
  const panelTranslateX = useRef(new Animated.Value(-Dimensions.get('window').width * 0.85)).current;
  const [userData, setUserData] = useState<UserData>({ name: 'Client', email: 'client@email.com' });
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [activeTicket, setActiveTicket] = useState<{ id: number; title: string } | null>(null);

  useEffect(() => {
    const fetchUserDataAndInit = async () => {
      const userDataString = await AsyncStorage.getItem('user');
      if (userDataString) {
        const user = JSON.parse(userDataString);
        setUserData(user);
        setMessages([
          { id: '1', text: `Bonjour ${user.name}, comment puis-je vous aider ?`, user: 'bot', date: new Date().toISOString() },
        ]);
      } else {
        setMessages([
          { id: '1', text: 'Bonjour, comment puis-je vous aider ?', user: 'bot', date: new Date().toISOString() },
        ]);
      }
    };
    fetchUserDataAndInit();
  }, []);

  const fetchHistory = async () => {
    if (historyLoading) return;
    setHistoryLoading(true);
    setHistoryError(null);

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Token non trouvé');

      const response = await axios.get(`${API_BASE_URL}/glpi/tickets`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const getStatusInfo = (statusId: number): { text: 'En cours' | 'Résolu' | 'Nouveau' | 'En attente' | 'Clos'; color: string } => {
        switch (statusId) {
          case 1: return { text: 'Nouveau', color: '#5bc0de' };
          case 2: return { text: 'En cours', color: '#f0ad4e' };
          case 3: return { text: 'En cours', color: '#f0ad4e' }; // Planifié
          case 4: return { text: 'En attente', color: '#d9534f' };
          case 5: return { text: 'Résolu', color: '#5cb85c' };
          case 6: return { text: 'Clos', color: '#777' };
          default: return { text: 'En cours', color: '#f0ad4e' };
        }
      };

      const formattedHistory: HistoryItem[] = response.data.map((ticket: any) => {
        const statusInfo = getStatusInfo(ticket.status);
        return {
          id: ticket.id.toString(),
          title: ticket.name,
          description: ticket.content.split('\n\n')[1] || ticket.content, // Essaye d'enlever l'email header
          status: statusInfo.text,
          statusColor: statusInfo.color,
          date: new Date(ticket.date_mod).toLocaleDateString('fr-FR'),
        };
      });

      setHistory(formattedHistory);
    } catch (error) {
      console.error('Fetch History Error:', error);
      setHistoryError("Impossible de charger l'historique.");
    } finally {
      setHistoryLoading(false);
    }
  };

  const toggleHistoryPanel = () => {
    const panelWidth = Dimensions.get('window').width * 0.85;
    const targetValue = isHistoryPanelOpen ? -panelWidth : 0;

    if (!isHistoryPanelOpen) {
      fetchHistory(); // Fetch history when opening the panel
    }

    Animated.timing(panelTranslateX, {
      toValue: targetValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setHistoryPanelOpen(!isHistoryPanelOpen);
  };

  const handleSend = async () => {
    if (inputText.trim().length === 0 || loading) return;

    const newMessage: Message = { id: Date.now().toString(), text: inputText, user: 'me', date: new Date().toISOString() };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInputText('');
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Token non trouvé, veuillez vous reconnecter.');
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const payload: any = { question: inputText };
      if (activeTicket) {
        payload.ticket_id = activeTicket.id;
      }

      const response = await axios.post(`${API_BASE_URL}/ai/chatbot/ask`, payload, config);

      // Si un suivi a été ajouté, on rafraîchit la conversation pour voir le nouveau message.
      if (response.data.type === 'followup_added' && activeTicket) {
        // On recherche l'objet HistoryItem correspondant au ticket actif pour le passer à handleSelectTicket
        const currentTicketHistoryItem = history.find(h => parseInt(h.id, 10) === activeTicket.id);
        if (currentTicketHistoryItem) {
          handleSelectTicket(currentTicketHistoryItem, false); // false pour ne pas fermer le panel qui est déjà fermé
        } else {
          // Fallback: si on ne trouve pas, on efface juste pour éviter un état incohérent
          setActiveTicket(null);
          setMessages([
            { id: 'fallback', text: 'Le suivi a été ajouté. Sélectionnez à nouveau le ticket pour voir la conversation.', user: 'bot', date: new Date().toISOString() },
          ]);
        }
      } else {
        // Comportement normal pour le chatbot (création de ticket)
        const botResponse: Message = {
          id: Date.now().toString() + 'b',
          text: response.data.message,
          user: 'bot',
          date: new Date().toISOString(),
        };
        setMessages(prevMessages => [...prevMessages, botResponse]);
      }


    } catch (error) {
      console.error('Chatbot Error:', error);
      const errorResponse: Message = {
        id: Date.now().toString() + 'e',
        text: 'Désolé, une erreur est survenue. Veuillez réessayer.',
        user: 'bot',
        date: new Date().toISOString(),
      };
      setMessages(prevMessages => [...prevMessages, errorResponse]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTicket = async (ticket: HistoryItem, closePanel: boolean = true) => {
    if (closePanel) {
      toggleHistoryPanel(); // Ferme le panneau seulement si nécessaire
    }
    setLoading(true);
    setMessages([]); // Vide la conversation actuelle
    setActiveTicket({ id: parseInt(ticket.id, 10), title: ticket.title });

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Token non trouvé');

      const headers = { Authorization: `Bearer ${token}` };

      // Étape 1: Récupérer les détails du ticket (pour le message initial)
      const ticketDetailsResponse = await axios.get(`${API_BASE_URL}/glpi/tickets/${ticket.id}`, { headers });
      const ticketDetails = ticketDetailsResponse.data;

      // Étape 2: Récupérer les suivis (la conversation)
      const followupsResponse = await axios.get(`${API_BASE_URL}/glpi/tickets/${ticket.id}/followups`, { headers });
      const followups = followupsResponse.data;

      // Étape 3: Construire la conversation complète
      let conversation: Message[] = [];

      // Ajout du message initial du ticket
      if (ticketDetails.content) {
        const initialContent = ticketDetails.content.split('\n\n').slice(1).join('\n\n') || ticketDetails.content;
        conversation.push({
          id: `ticket-${ticketDetails.id}`,
          text: initialContent,
          user: 'me', // Le message initial est toujours celui du client
          date: ticketDetails.date_creation,
        });
      }

      // Ajout des suivis de la conversation
      if (Array.isArray(followups)) {
        const followupMessages: Message[] = followups.map((f: any) => {
          let user: 'me' | 'bot' = 'bot'; // Par défaut, l'auteur est un agent ('bot')
          let text = f.content;

          // On utilise les préfixes pour déterminer le véritable auteur.
          // Si aucun préfixe n'est trouvé, on assume que c'est un message de l'agent.
          if (text.startsWith('CLIENT_MSG::')) {
            user = 'me'; // Message du client
            text = text.substring('CLIENT_MSG::'.length).trim();
          } else if (text.startsWith('AGENT_MSG::')) {
            user = 'bot'; // Message de l'agent
            text = text.substring('AGENT_MSG::'.length).trim();
          }
          // Si aucun préfixe, 'user' reste 'bot' et 'text' reste le contenu brut.

          return {
            id: `followup-${f.id}`,
            text: text,
            user: user,
            date: f.date_creation,
          };
        });
        conversation.push(...followupMessages);
      }
      
      // Étape 4: Trier la conversation par date pour un affichage chronologique
      conversation.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      // Étape 5: Mettre à jour l'interface avec la conversation complète
      setMessages(conversation);

    } catch (error) {
      console.error('Erreur lors du chargement de la conversation du ticket:', error);
      setMessages([
        { id: 'error', text: 'Impossible de charger cette conversation.', user: 'bot', date: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderHistoryItem = ({ item }: { item: HistoryItem }) => (
    <TouchableOpacity onPress={() => handleSelectTicket(item)} style={styles.historyRequestItem}>
      <View>
        <Text style={styles.historyItemTitle}>{item.title}</Text>
        <Text style={styles.historyItemDescription} numberOfLines={2}>{item.description}</Text>
        <View style={styles.historyStatusContainer}>
          <View style={[styles.historyStatusBadge, { backgroundColor: item.statusColor }]}>
            <Text style={styles.historyStatusText}>{item.status}</Text>
          </View>
          <Text style={styles.historyItemDate}>{item.date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderHistoryContent = () => {
    if (historyLoading) {
      return <ActivityIndicator size="large" color="#e60000" style={{ marginTop: 50 }} />;
    }
    if (historyError) {
      return <Text style={styles.historyErrorText}>{historyError}</Text>;
    }
    if (history.length === 0) {
      return <Text style={styles.historyErrorText}>Aucun ticket trouvé.</Text>;
    }
    return (
      <FlatList
        data={history}
        renderItem={renderHistoryItem}
        keyExtractor={item => item.id}
        style={{ marginTop: 20 }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 40 : 0}
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
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {loading && (
          <View style={styles.typingIndicatorContainer}>
            <Text style={styles.typingIndicatorText}>Assistant est en train d'écrire...</Text>
            <ActivityIndicator size="small" color="#888" />
          </View>
        )}

        {activeTicket && (
          <View style={styles.activeTicketBanner}>
            <View style={{ flex: 1 }}>
              <Text style={styles.activeTicketLabel}>Réponse au ticket :</Text>
              <Text style={styles.activeTicketTitle} numberOfLines={1}>#{activeTicket.id} - {activeTicket.title}</Text>
            </View>
            <TouchableOpacity onPress={() => setActiveTicket(null)} style={styles.closeBannerButton}>
              <Icon name="x" size={18} color="#e60000" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder={activeTicket ? "Ajouter un suivi au ticket..." : "Posez votre question ici !"}
            placeholderTextColor="#888"
            editable={!loading} // On peut toujours écrire, même si un ticket est actif
          />
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="mic" size={24} color="#555" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={loading || inputText.trim().length === 0}>
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

      <Animated.View style={[styles.historyPanel, { transform: [{ translateX: panelTranslateX }] }]}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={[styles.historyHeader, { paddingTop: insets.top + 15 }]}>
            <Text style={styles.historyHeaderTitle}>Historique des requêtes</Text>
            <TouchableOpacity onPress={toggleHistoryPanel}>
              <Icon name="x" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <View style={styles.historyContent}>
            {renderHistoryContent()}
          </View>
          <View style={styles.profileSection}>
            <View style={styles.profileInfo}>
              <Icon name="user" size={24} color="#333" />
              <View style={{ marginLeft: 15 }}>
                <Text style={styles.profileName}>{userData.name}</Text>
                <Text style={styles.profileEmail}>{userData.email}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Connexion' }] }))}>
              <Icon name="log-out" size={20} color="#e60000" />
              <Text style={styles.logoutButtonText}>Déconnexion</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Animated.View>
    </SafeAreaView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 20,
  },
  logoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  logoTextSub: {
    fontSize: 12,
    color: '#e60000',
  },
  headerIcon: {
    padding: 5,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
    marginVertical: 5,
  },
  myMessage: {
    backgroundColor: '#e60000',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  botMessage: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  myMessageText: {
    color: '#fff',
    fontSize: 15,
  },
  botMessageText: {
    color: '#333',
    fontSize: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 45,
    backgroundColor: '#f0f0f0',
    borderRadius: 22,
    paddingHorizontal: 20,
    fontSize: 16,
    marginRight: 10,
  },
  iconButton: {
    padding: 5,
    marginHorizontal: 5,
  },
  sendButton: {
    backgroundColor: '#e60000',
    borderRadius: 25,
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typingIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  typingIndicatorText: {
    fontSize: 14,
    color: '#888',
    marginRight: 8,
    fontStyle: 'italic',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  historyPanel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: '85%',
    backgroundColor: '#f9f9f9',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.2,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  historyHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  historyContent: {
    flex: 1,
    paddingHorizontal: 10,
  },
  historyRequestItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  historyItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  historyItemDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  historyStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  historyStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    marginRight: 10,
  },
  historyStatusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  historyItemDate: {
    fontSize: 12,
    color: '#888',
  },
  historyErrorText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
  profileSection: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileEmail: {
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
  activeTicketBanner: {
    backgroundColor: '#fff0f0',
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f0c0c0',
  },
  activeTicketLabel: {
    fontSize: 12,
    color: '#555',
    fontWeight: 'bold',
  },
  activeTicketTitle: {
    fontSize: 14,
    color: '#333',
  },
  closeBannerButton: {
    padding: 5,
  },
});

export default ChatScreen;
