import React, { useState, useRef, useLayoutEffect, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Animated, SafeAreaView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from './config';

const sidebarWidth = 320;

// --- Type Definitions ---
interface Ticket {
  id: number;
  title: string;
  status: number;
  date: string;
  requester_email: string; // Ajout de l'email
}

interface Message {
  id: string;
  text: string;
  sender: 'agent' | 'client';
  date: string;
}

const AgentDashboardScreen = () => {
  const navigation = useNavigation();

  // State
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [ticketsError, setTicketsError] = useState<string | null>(null);

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);
  
  const [inputText, setInputText] = useState('');

  // Sidebar animation
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const animatedTranslateX = useRef(new Animated.Value(sidebarWidth)).current;

  // --- Data Fetching ---

  const fetchTickets = useCallback(async () => {
    setTicketsLoading(true);
    setTicketsError(null);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Token non trouvé');

      const response = await axios.get(`${API_BASE_URL}/glpi/tickets`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const formattedTickets = response.data.map((t: any) => ({
        id: t.id,
        title: t.name,
        status: t.status,
        date: new Date(t.date_mod).toLocaleDateString('fr-FR'),
        requester_email: t.requester_email || 'Email non disponible',
      }));
      setTickets(formattedTickets);
    } catch (error) {
      console.error("Erreur fetchTickets:", error);
      setTicketsError("Impossible de charger les tickets.");
    } finally {
      setTicketsLoading(false);
    }
  }, []);

  const handleSelectTicket = useCallback(async (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setMessagesLoading(true);
    setMessagesError(null);
    setMessages([]);
    if (isSidebarOpen) {
      toggleSidebar();
    }

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Token non trouvé');

      const headers = { Authorization: `Bearer ${token}` };

      // Deux appels API en parallèle
      const [ticketResponse, followupsResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/glpi/tickets/${ticket.id}`, { headers }),
        axios.get(`${API_BASE_URL}/glpi/tickets/${ticket.id}/followups`, { headers })
      ]);

      const ticketDetails = ticketResponse.data;
      const followups = followupsResponse.data;

      const conversation: Message[] = [];

      // 1. Message initial du ticket
      const emailHeader = `Email du demandeur: ${ticketDetails.requester_email}\n\n`;
      const initialContent = (ticketDetails.content || '').replace(emailHeader, '');
      if (initialContent) {
        conversation.push({
          id: `ticket-${ticketDetails.id}`,
          text: initialContent,
          sender: 'client',
          date: ticketDetails.date_creation,
        });
      }

      // 2. Suivis de la conversation
      if (followups && followups.length > 0) {
        const followupMessages: Message[] = followups.map((f: any) => {
          let sender: 'agent' | 'client' = 'client';
          let text = f.content;
          if (f.content.startsWith('AGENT_MSG::')) {
            sender = 'agent';
            text = f.content.replace('AGENT_MSG::', '').trim();
          } else if (f.content.startsWith('CLIENT_MSG::')) {
            sender = 'client';
            text = f.content.replace('CLIENT_MSG::', '').trim();
          }
          return {
            id: `followup-${f.id}`,
            text,
            sender,
            date: f.date_creation,
          };
        });
        conversation.push(...followupMessages);
      }

      // 3. Trier tous les messages par date
      conversation.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setMessages(conversation);

    } catch (error) {
      console.error("Erreur handleSelectTicket:", error);
      setMessagesError("Impossible de charger la conversation.");
    } finally {
      setMessagesLoading(false);
    }
  }, [isSidebarOpen]);

  useEffect(() => {
    fetchTickets();
  }, []);

  // --- UI Handlers ---

  const handleSend = async () => {
    if (!inputText.trim() || !selectedTicket) return;

    const tempMessageId = Date.now().toString();
    const currentInput = inputText;
    
    // Ajout optimiste du message à l'interface
    setMessages(prev => [...prev, { id: tempMessageId, text: currentInput, sender: 'agent', date: new Date().toISOString() }]);
    setInputText('');

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error("Token non trouvé");

      // Appel de la nouvelle route pour ajouter un suivi
      await axios.post(`${API_BASE_URL}/glpi/tickets/${selectedTicket.id}/followups`,
        { content: currentInput, is_private: false }, // Indiquer que le message est public
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Rafraîchir la conversation pour voir la confirmation
      await handleSelectTicket(selectedTicket);

    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Erreur détaillée du serveur:", error.response.data);
      } else {
        console.error("Erreur lors de l'envoi du suivi:", error);
      }
      setMessagesError("Échec de l'envoi de la réponse.");
      // En cas d'échec, retirer le message optimiste
      setMessages(prev => prev.filter(m => m.id !== tempMessageId));
    }
  };

  const toggleSidebar = () => {
    const toValue = isSidebarOpen ? sidebarWidth : 0;
    Animated.timing(animatedTranslateX, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setSidebarOpen(!isSidebarOpen);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={toggleSidebar} style={{ marginRight: 15 }}>
          <Icon name={isSidebarOpen ? 'chevron-right' : 'chevron-left'} size={24} color="#003366" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, isSidebarOpen]);

  // --- Render Functions ---

  const renderTicketItem = ({ item }: { item: Ticket }) => {
    const getStatusInfo = (statusId: number) => {
        switch (statusId) {
            case 1: return { text: 'Nouveau', style: styles.statusNew };
            case 2: return { text: 'En cours', style: styles.statusInProgress };
            case 5: return { text: 'Résolu', style: styles.statusSolved };
            case 6: return { text: 'Clos', style: styles.statusClosed };
            default: return { text: 'En attente', style: styles.statusPending };
        }
    };
    const status = getStatusInfo(item.status);
    return (
      <TouchableOpacity style={styles.ticketItem} onPress={() => handleSelectTicket(item)}>
        <Text style={styles.ticketTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.ticketEmail}>{item.requester_email}</Text>
        <View style={styles.ticketFooter}>
          <Text style={[styles.ticketStatus, status.style]}>{status.text}</Text>
          <Text style={styles.ticketDate}>{item.date}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderMessageItem = ({ item }: { item: Message }) => (
    <View style={[styles.messageContainer, item.sender === 'agent' ? styles.agentMessage : styles.clientMessage]}>
      <Text style={[styles.messageText, item.sender === 'agent' ? styles.agentMessageText : styles.clientMessageText]}>{item.text}</Text>
    </View>
  );

  const renderChatContent = () => {
    if (messagesLoading) {
      return <ActivityIndicator style={{ flex: 1 }} size="large" color="#003366" />;
    }
    if (messagesError) {
      return <View style={styles.placeholderContainer}><Text style={styles.placeholderText}>{messagesError}</Text></View>;
    }
    if (!selectedTicket) {
      return <View style={styles.placeholderContainer}><Text style={styles.placeholderText}>Sélectionnez un ticket pour commencer</Text></View>;
    }
    return (
      <>
        <View style={styles.chatHeader}>
          <Text style={styles.chatHeaderTitle} numberOfLines={1}>{selectedTicket.title}</Text>
          <Text style={styles.chatHeaderEmail}>{selectedTicket.requester_email}</Text>
        </View>
        <FlatList
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={item => item.id}
          style={styles.messageList}
          contentContainerStyle={{ paddingBottom: 10 }}
        />
      </>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.mainContent}>
          {renderChatContent()}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder={selectedTicket ? "Répondre au ticket..." : "Sélectionnez un ticket"}
            value={inputText}
            onChangeText={setInputText}
            editable={!!selectedTicket && !messagesLoading}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={!selectedTicket || !inputText.trim()}>
            <Icon name="send" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <Animated.View style={[styles.rightSidebar, { transform: [{ translateX: animatedTranslateX }] }]}>
          <Text style={styles.sidebarTitle}>Historique des requêtes</Text>
          {ticketsLoading ? (
            <ActivityIndicator size="large" color="#003366" />
          ) : ticketsError ? (
            <Text>{ticketsError}</Text>
          ) : (
            <FlatList
              data={tickets}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderTicketItem}
            />
          )}
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, flexDirection: 'column' },
  mainContent: { flex: 1, backgroundColor: '#f9f9f9' },
  messageList: { flex: 1, paddingHorizontal: 10 },
  messageContainer: {
    padding: 10,
    borderRadius: 20,
    marginVertical: 5,
    maxWidth: '80%',
  },
  agentMessage: {
    backgroundColor: '#E5E5EA', // Couleur gris clair pour l'agent
    alignSelf: 'flex-start', // Aligné à gauche
  },
  clientMessage: {
    backgroundColor: '#007AFF', // Couleur bleu pour le client
    alignSelf: 'flex-end',   // Aligné à droite
  },
  messageText: {
    fontSize: 16,
  },
  agentMessageText: {
    color: '#000000', // Texte noir pour l'agent
  },
  clientMessageText: {
    color: '#FFFFFF', // Texte blanc pour le client
  },
  inputContainer: { flexDirection: 'row', padding: 10, borderTopWidth: 1, borderTopColor: '#e0e0e0', alignItems: 'center', backgroundColor: '#fff' },
  textInput: { flex: 1, height: 48, backgroundColor: '#f0f2f5', borderRadius: 24, paddingHorizontal: 20, fontSize: 16, marginRight: 10 },
  sendButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#e60000', justifyContent: 'center', alignItems: 'center' },
  rightSidebar: { width: sidebarWidth, height: '100%', position: 'absolute', top: 0, right: 0, backgroundColor: '#fff', borderLeftWidth: 1, borderLeftColor: '#e0e0e0', padding: 15, elevation: 10 },
  sidebarTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#003366' },
  ticketItem: { backgroundColor: '#f8f9fa', padding: 15, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#e9ecef' },
  ticketEmail: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 4,
  },
  ticketTitle: { fontSize: 14, fontWeight: '500', color: '#343a40', marginBottom: 10 },
  ticketFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ticketStatus: { fontSize: 12, fontWeight: 'bold', paddingVertical: 3, paddingHorizontal: 8, borderRadius: 12, overflow: 'hidden' },
  statusNew: { backgroundColor: '#cfe2ff', color: '#0a58ca' },
  statusInProgress: { backgroundColor: '#fff3cd', color: '#664d03' },
  statusSolved: { backgroundColor: '#d1e7dd', color: '#0f5132' },
  statusClosed: { backgroundColor: '#e2e3e5', color: '#41464b' },
  statusPending: { backgroundColor: '#f8d7da', color: '#842029' },
  ticketDate: { fontSize: 12, color: '#6c757d' },
  placeholderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  placeholderText: { fontSize: 16, color: '#aaa' },
  chatHeader: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  chatHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003366',
  },
  chatHeaderEmail: {
    fontSize: 14,
    color: '#666',
  },
});

export default AgentDashboardScreen;