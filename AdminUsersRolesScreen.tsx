import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserForm, { UserFormData } from './UserForm';
import { API_BASE_URL } from './config';

// Define the structure of a User object for TypeScript
interface User {
  id: number | string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'pending' | 'rejected' | 'blocked';
}

// IMPORTANT: Replace with your actual backend URL


const getRoleStyle = (role: string) => {
  switch (role?.toLowerCase()) {
    case 'admin':
    case 'superadmin':
      return { backgroundColor: '#e60000', color: '#fff' };
    case 'agent_support':
      return { backgroundColor: '#ffc107', color: '#000' };
    case 'agent_interne':
    case 'client':
    default:
      return { backgroundColor: '#007bff', color: '#fff' };
  }
};

const AdminUsersRolesScreen = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Authentication token not found.');

      const response = await axios.get(`${API_BASE_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data || []);
    } catch (e: any) {
      const errorMessage = e.response?.data?.detail || e.message || 'An unknown error occurred';
      setError(errorMessage);
      Alert.alert('Error', `Failed to fetch users: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (data: UserFormData) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!data.name || !data.email || !data.password) {
        Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
        return;
      }

      const response = await axios.post(`${API_BASE_URL}/admin/users`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(prevUsers => [response.data, ...prevUsers]);
      closeModal();
      Alert.alert('Succès', 'Utilisateur créé avec succès !');
    } catch (e: any) {
      const errorMessage = e.response?.data?.detail || 'Une erreur est survenue lors de la création.';
      Alert.alert('Erreur de création', errorMessage);
    }
  };

  const handleDeleteUser = (userId: number | string) => {
    Alert.alert(
      'Confirmer la suppression',
      'Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              await axios.delete(`${API_BASE_URL}/admin/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });

              setUsers(users.filter(u => u.id !== userId));
              Alert.alert('Succès', 'Utilisateur supprimé avec succès.');
            } catch (e: any) {
              const errorMessage = e.response?.data?.detail || 'Une erreur est survenue lors de la suppression.';
              Alert.alert('Erreur de suppression', errorMessage);
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  const handleUpdateUser = async (data: UserFormData) => {
    if (!editingUser) return;

    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.put(`${API_BASE_URL}/admin/users/${editingUser.id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(users.map(u => u.id === editingUser.id ? response.data : u));
      closeModal();
      Alert.alert('Succès', 'Utilisateur mis à jour avec succès !');
    } catch (e: any) {
      const errorMessage = e.response?.data?.detail || 'Une erreur est survenue lors de la mise à jour.';
      Alert.alert('Erreur de mise à jour', errorMessage);
    }
  };

  const openModalToEdit = (user: User) => {
    setEditingUser(user);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingUser(null);
  };

  const handleOpenModalToAdd = () => {
    setEditingUser(null);
    setModalVisible(true);
  };

  const renderHeader = () => (
    <View style={styles.tableHeader}>
      <View style={[styles.cell, styles.colName]}><Text style={styles.headerText}>NOM D'UTILISATEUR</Text></View>
      <View style={[styles.cell, styles.colEmail]}><Text style={styles.headerText}>ADRESSE EMAIL</Text></View>
      <View style={[styles.cell, styles.colRole]}><Text style={styles.headerText}>RÔLE</Text></View>
      <View style={[styles.cell, styles.colStatus]}><Text style={styles.headerText}>STATUT</Text></View>
      <View style={[styles.cell, styles.colActions]}><Text style={styles.headerText}>ACTIONS</Text></View>
    </View>
  );

  const renderItem = ({ item }: { item: User }) => {
    const roleStyle = getRoleStyle(item.role);
    return (
      <View style={styles.tableRow}>
        <View style={[styles.cell, styles.colName]}><Text style={styles.cellText}>{item.name}</Text></View>
        <View style={[styles.cell, styles.colEmail]}><Text style={styles.cellText}>{item.email}</Text></View>
        <View style={[styles.cell, styles.colRole]}>
          <View style={[styles.badge, { backgroundColor: roleStyle.backgroundColor }]}>
            <Text style={[styles.badgeText, { color: roleStyle.color }]}>{item.role}</Text>
          </View>
        </View>
        <View style={[styles.cell, styles.colStatus]}>
          <View style={[styles.badge, item.status === 'active' ? styles.statusActive : styles.statusInactive]}>
            <Text style={[styles.badgeText, item.status === 'active' ? styles.statusActiveText : styles.statusInactiveText]}>
              {item.status}
            </Text>
          </View>
        </View>
        <View style={[styles.cell, styles.colActions]}>
          <TouchableOpacity style={styles.actionButton} onPress={() => openModalToEdit(item)}>
            <Icon name="edit-2" size={18} color="#007bff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => handleDeleteUser(item.id)}>
            <Icon name="trash-2" size={18} color="#e60000" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading Users...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Icon name="alert-circle" size={40} color="#e60000" />
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.centeredView}>
          <UserForm
            isEditing={!!editingUser}
            initialData={editingUser ? { name: editingUser.name, email: editingUser.email, role: editingUser.role as UserFormData['role'], password: '', status: editingUser.status } : undefined}
            onSubmit={editingUser ? handleUpdateUser : handleAddUser}
            onCancel={closeModal}
          />
        </View>
      </Modal>

      <View style={styles.headerContainer}>
        <Text style={styles.title}>Gestion des Rôles et Accès</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleOpenModalToAdd}>
          <Icon name="plus" size={16} color="#fff" />
          <Text style={styles.addButtonText}>Ajouter un utilisateur</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={users}
        ListHeaderComponent={renderHeader}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        stickyHeaderIndices={[0]}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  container: {
    flex: 1,
    backgroundColor: '#0A192F',
    padding: 20,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#fff',
    fontSize: 16,
  },
  errorText: {
    marginTop: 10,
    color: '#e60000',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    flexShrink: 1,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#e60000',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginLeft: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 14,
  },
  list: {
    flex: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#1E3A5F',
    paddingBottom: 10,
    backgroundColor: '#0A192F',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1E3A5F',
    paddingVertical: 15,
  },
  cell: {
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  headerText: {
    color: '#8892b0',
    fontWeight: 'bold',
    fontSize: 11,
    textAlign: 'left',
  },
  colName: { flex: 3 },
  colEmail: { flex: 4 },
  colRole: { flex: 3, alignItems: 'center' },
  colStatus: { flex: 2, alignItems: 'center' },
  colActions: { flex: 1.5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusActive: {
    backgroundColor: 'rgba(46, 204, 113, 0.2)',
    borderWidth: 1,
    borderColor: '#2ecc71',
  },
  statusActiveText: {
    color: '#2ecc71',
  },
  statusInactive: {
    backgroundColor: 'rgba(230, 0, 0, 0.2)',
    borderWidth: 1,
    borderColor: '#e60000',
  },
  statusInactiveText: {
    color: '#e60000',
  },
  cellText: {
    color: '#fff',
    fontSize: 14,
  },
  actionButton: {
    marginHorizontal: 8,
  },
});

export default AdminUsersRolesScreen;
