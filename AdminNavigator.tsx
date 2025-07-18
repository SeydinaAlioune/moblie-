import React, { useState } from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerContentComponentProps } from '@react-navigation/drawer';
import { CommonActions } from '@react-navigation/native';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

// Import screens
import AdminDashboardScreen from './AdminDashboardScreen';
import AdminUsersRolesScreen from './AdminUsersRolesScreen';
import AdminGlpiConfigScreen from './AdminGlpiConfigScreen';
import AdminKnowledgeBaseScreen from './AdminKnowledgeBaseScreen';
import AdminMiddlewareConfigScreen from './AdminMiddlewareConfigScreen';

// Type definitions
export type AdminDrawerParamList = {
  'Tableau de bord': undefined;
  'Utilisateurs & Rôles': undefined;
  'Connexion GLPI': undefined;
  'Base de connaissances': undefined;
  'Middleware': undefined;
};

const Drawer = createDrawerNavigator<AdminDrawerParamList>();

// Custom Header


// Custom Drawer Content


function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { state, navigation } = props;

  const handleLogout = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Connexion' }],
      })
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0A192F' }}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 40 }}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="log-out" size={22} color="#e60000" />
        <Text style={styles.logoutText}>Déconnexion</Text>
      </TouchableOpacity>
    </View>
  );
};

const AdminNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation, route }) => ({
        unmountOnBlur: true,
        drawerStyle: {
          width: 250, // Reduced width
          backgroundColor: '#0A192F',
        },
        drawerActiveBackgroundColor: '#e60000', // Red for active item
        drawerInactiveBackgroundColor: 'transparent', // Transparent for inactive items
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#fff',
        drawerLabelStyle: { marginLeft: 0, fontSize: 15 },

        headerStyle: {
          backgroundColor: '#0A192F',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
        headerTitle: () => <Text style={styles.headerTitleText}>{route.name}</Text>,
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ marginLeft: 15 }}>
            <Icon name="menu" size={24} color="#fff" />
          </TouchableOpacity>
        ),
      })}
    >
      <Drawer.Screen name="Tableau de bord" component={AdminDashboardScreen} options={{ drawerIcon: ({ color }) => <Icon name="grid" size={22} color={color} /> }} />
      <Drawer.Screen name="Utilisateurs & Rôles" component={AdminUsersRolesScreen} options={{ drawerIcon: ({ color }) => <Icon name="users" size={22} color={color} /> }} />
      <Drawer.Screen name="Connexion GLPI" component={AdminGlpiConfigScreen} options={{ drawerIcon: ({ color }) => <Icon name="share-2" size={22} color={color} /> }} />
      <Drawer.Screen name="Base de connaissances" component={AdminKnowledgeBaseScreen} options={{ drawerIcon: ({ color }) => <Icon name="database" size={22} color={color} /> }} />
      <Drawer.Screen name="Middleware" component={AdminMiddlewareConfigScreen} options={{ drawerIcon: ({ color }) => <Icon name="settings" size={22} color={color} /> }} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  headerTitleText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  drawerLabelActive: {
    color: '#fff',
  },
  logoutSection: {
    padding: 20,
    paddingBottom: 40,
    borderTopColor: '#eee',
    borderTopWidth: 1,
    backgroundColor: '#fff',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
  },
  logoutButtonCollapsed: {
     justifyContent: 'center',
  },
  logoutText: {
    marginLeft: 15,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e60000',
  },
});

export default AdminNavigator;
