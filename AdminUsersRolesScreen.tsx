import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const usersData = [
  { id: '1', name: 'admin', email: 'admin@example.com', role: 'Admin', status: 'Active' },
  { id: '2', name: 'Yaya', email: 'yaya0290@gmail.com', role: 'Client', status: 'Active' },
  { id: '3', name: 'seydina', email: 'diaseydina62@gmail.com', role: 'Agent_support', status: 'Active' },
  { id: '4', name: 'papa', email: 'papa0290@gmail.com', role: 'Client', status: 'Active' },
  { id: '5', name: 'amadou', email: 'amadou12@gmail.com', role: 'Agent_support', status: 'Active' },
  { id: '6', name: 'aliou', email: 'aliou12@gmail.com', role: 'Client', status: 'Active' },
];

const getRoleStyle = (role: string) => {
  switch (role) {
    case 'Admin':
      return { backgroundColor: '#e60000', color: '#fff' };
    case 'Agent_support':
      return { backgroundColor: '#ffc107', color: '#000' };
    case 'Client':
    default:
      return { backgroundColor: '#007bff', color: '#fff' };
  }
};

const AdminUsersRolesScreen = () => {

  const renderHeader = () => (
    <View style={styles.tableHeader}>
      <View style={[styles.cell, styles.colName]}><Text style={styles.headerText}>NOM D'UTILISATEUR</Text></View>
      <View style={[styles.cell, styles.colEmail]}><Text style={styles.headerText}>ADRESSE EMAIL</Text></View>
      <View style={[styles.cell, styles.colRole]}><Text style={styles.headerText}>RÔLE</Text></View>
      <View style={[styles.cell, styles.colStatus]}><Text style={styles.headerText}>STATUT</Text></View>
      <View style={[styles.cell, styles.colActions]}><Text style={styles.headerText}>ACTIONS</Text></View>
    </View>
  );

  const renderItem = ({ item }: { item: typeof usersData[0] }) => {
    const roleStyle = getRoleStyle(item.role);
    return (
      <View style={styles.tableRow}>
        <View style={[styles.cell, styles.colName]}><Text style={styles.cellText} numberOfLines={1}>{item.name}</Text></View>
        <View style={[styles.cell, styles.colEmail]}><Text style={styles.cellText} numberOfLines={1}>{item.email}</Text></View>
        <View style={[styles.cell, styles.colRole]}>
          <View style={[styles.badge, { backgroundColor: roleStyle.backgroundColor }]}>
            <Text style={[styles.badgeText, { color: roleStyle.color }]}>{item.role.replace('_', ' ')}</Text>
          </View>
        </View>
        <View style={[styles.cell, styles.colStatus]}>
          <View style={[styles.badge, styles.statusActive]}>
            <Text style={[styles.badgeText, styles.statusActiveText]}>{item.status}</Text>
          </View>
        </View>
        <View style={[styles.cell, styles.colActions]}>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="edit-2" size={18} color="#3498db" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="trash-2" size={18} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Gestion des Rôles et Accès</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Ajouter un utilisateur</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tableContainer}>
        <FlatList
          ListHeaderComponent={renderHeader}
          data={usersData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          stickyHeaderIndices={[0]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A192F',
    padding: 15,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10, // Add gap between title and button
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1, // Allow title to take available space
    flexShrink: 1, // Allow title to shrink if needed
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  tableContainer: {
    flex: 1,
    backgroundColor: '#172A46',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#233554',
    borderBottomWidth: 1,
    borderBottomColor: '#0A192F',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#233554',
    paddingVertical: 8,
  },
  cell: {
    paddingVertical: 10,
    paddingHorizontal: 8, // Increase horizontal padding to create more space
    justifyContent: 'center',
  },
  cellText: {
    color: '#E6F1FF',
    fontSize: 13,
    textAlign: 'left',
  },
  headerText: {
    color: '#8892B0',
    fontWeight: 'bold',
    fontSize: 11,
    textAlign: 'left',
  },
  // Final flex layout to prevent text wrapping in badges
  colName: { flex: 3 },
  colEmail: { flex: 4 },
  colRole: { flex: 3, alignItems: 'center' }, // Increased flex for Role column
  colStatus: { flex: 2, alignItems: 'center' },
  colActions: { flex: 1.5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    // minWidth: 70, // <-- THIS WAS THE ROOT CAUSE OF THE LAYOUT ISSUE
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statusActive: {
    backgroundColor: 'rgba(46, 204, 113, 0.2)',
    borderWidth: 1,
    borderColor: '#2ecc71',
  },
  statusActiveText: {
    color: '#2ecc71',
  },
  actionButton: {
    marginHorizontal: 8,
  },
});

export default AdminUsersRolesScreen;
