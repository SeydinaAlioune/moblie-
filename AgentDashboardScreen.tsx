import React, { useState, useRef, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Animated, SafeAreaView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

const sidebarWidth = 320;

const AgentDashboardScreen = () => {
  const tickets = [
    { id: '1', title: 'Écran noir au démarrage [P: normale, C: matériel]', status: 'Nouveau', date: '09/07/2025' },
    { id: '2', title: 'Problème avec le téléphone [P: normale, C: matériel]', status: 'Nouveau', date: '09/07/2025' },
    { id: '3', title: 'Imprimante ne fonctionne pas [P: normale, C: matériel]', status: 'En cours', date: '08/07/2025' },
  ];

  const navigation = useNavigation();
  const [isSidebarOpen, setSidebarOpen] = useState(false); // Start with sidebar closed
  // Start with the sidebar translated off-screen to the right
  const animatedTranslateX = useRef(new Animated.Value(sidebarWidth)).current;

  const toggleSidebar = () => {
    // If open, close it (move to sidebarWidth). If closed, open it (move to 0).
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

  const messages = [{ id: '1', text: 'Bonjour, comment puis-je vous aider ?', sender: 'agent' }];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* The main content area now contains both chat and the overlaying sidebar */}
        <View style={styles.mainContent}>
          <FlatList
            data={messages}
            renderItem={({ item }) => (
              <View style={styles.messageBubble}>
                <Text style={styles.messageText}>{item.text}</Text>
              </View>
            )}
            keyExtractor={item => item.id}
            style={styles.messageList}
          />
        </View>

        {/* Input bar at the bottom */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Posez votre question ici !"
            placeholderTextColor="#888"
          />
          <TouchableOpacity style={styles.micButton}>
            <Icon name="mic" size={22} color="#555" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.sendButton}>
            <Icon name="send" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Sidebar as an overlay */}
        <Animated.View style={[styles.rightSidebar, { transform: [{ translateX: animatedTranslateX }] }]}>
          <Text style={styles.sidebarTitle}>Historique des requêtes</Text>
          <FlatList
            data={tickets}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.ticketItem}>
                <Text style={styles.ticketTitle}>{item.title}</Text>
                <View style={styles.ticketFooter}>
                  <Text style={[styles.ticketStatus, item.status === 'Nouveau' ? styles.statusNew : styles.statusInProgress]}>{item.status}</Text>
                  <Text style={styles.ticketDate}>{item.date}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#fff',
  },
  messageList: {
    flex: 1,
    padding: 10,
  },
  messageBubble: {
    backgroundColor: '#003366',
    padding: 15,
    borderRadius: 20,
    marginVertical: 5,
    maxWidth: '80%',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  textInput: {
    flex: 1,
    height: 48,
    backgroundColor: '#f0f2f5',
    borderRadius: 24,
    paddingHorizontal: 20,
    fontSize: 16,
    marginRight: 10,
  },
  micButton: {
    padding: 5,
  },
  sendButton: {
    marginLeft: 8,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e60000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // --- Right Sidebar Styles (now an overlay) ---
  rightSidebar: {
    width: sidebarWidth,
    height: '100%',
    position: 'absolute',
    top: 0,
    right: 0, // Pin to the right edge
    backgroundColor: '#fff',
    borderLeftWidth: 1,
    borderLeftColor: '#e0e0e0',
    padding: 15,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  sidebarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#003366',
  },
  ticketItem: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  ticketTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#343a40',
    marginBottom: 10,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketStatus: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  statusNew: {
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
    color: '#ff8f00',
  },
  statusInProgress: {
    backgroundColor: 'rgba(23, 162, 184, 0.2)',
    color: '#007bff',
  },
  ticketDate: {
    fontSize: 12,
    color: '#6c757d',
  },
});

export default AgentDashboardScreen;
