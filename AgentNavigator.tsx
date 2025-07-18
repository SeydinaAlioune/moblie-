import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerContentComponentProps } from '@react-navigation/drawer';
import { CommonActions } from '@react-navigation/native';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AgentDashboardScreen from './AgentDashboardScreen';
import AgentAnalyticsScreen from './AgentAnalyticsScreen';
import Icon from 'react-native-vector-icons/Feather';

export type AgentDrawerParamList = {
  Conversations: undefined;
  'Analyse IA': undefined;
};

const Drawer = createDrawerNavigator<AgentDrawerParamList>();

const CustomHeaderTitle = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.headerTitleContainer}>
    <Image source={require('./assets/logo.jpg')} style={styles.logo} />
    <Text style={styles.headerTitleText}>{children}</Text>
  </View>
);

type DrawerLabelProps = {
    label: string;
    iconName: string;
    color: string;
};

const DrawerLabel = ({ label, iconName, color }: DrawerLabelProps) => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Icon name={iconName} size={20} color={color} style={{ marginRight: 20 }} />
        <Text style={{ color, fontSize: 16, fontWeight: '500' }}>{label}</Text>
    </View>
);

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props}>
                <DrawerItemList {...props} />
            </DrawerContentScrollView>
            <View style={styles.bottomDrawerSection}>
                <View style={styles.profileSection}>
                    <Icon name="user" size={20} color="#333" />
                    <View style={{ marginLeft: 15, flexDirection: 'column' }}>
                        <Text style={styles.profileName}>Agent CMS</Text>
                        <Text style={styles.profileEmail}>agent.support@cms.sn</Text>
                    </View>
                </View>
                <TouchableOpacity 
                    onPress={() => {
                        const parentNav = props.navigation.getParent();
                        if (parentNav) {
                            parentNav.dispatch(
                                CommonActions.reset({
                                    index: 0,
                                    routes: [{ name: 'Connexion' }],
                                })
                            );
                        }
                    }}
                    style={styles.logoutButton}
                >
                    <Icon name="log-out" size={20} color="#e60000" />
                    <Text style={styles.logoutText}>Déconnexion</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const AgentNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
          elevation: 2,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 2 },
        },
        headerTintColor: '#003366',
        headerTitle: (props) => <CustomHeaderTitle {...props} />,
        drawerActiveBackgroundColor: '#005A9C',
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#333',
        drawerStyle: {
            paddingTop: 15,
        }
      }}
    >
      <Drawer.Screen 
        name="Conversations" 
        component={AgentDashboardScreen} 
        options={{
            drawerLabel: ({ color }) => <DrawerLabel label="Conversations" iconName="message-square" color={color} />
        }}
      />
      <Drawer.Screen 
        name="Analyse IA" 
        component={AgentAnalyticsScreen} 
        options={{
            drawerLabel: ({ color }) => <DrawerLabel label="Analyse IA" iconName="bar-chart-2" color={color} />
        }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  headerTitleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#003366',
  },
  // Styles for Custom Drawer Content
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
    paddingTop: 15,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  profileEmail: {
    fontSize: 14,
    color: '#888',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  logoutText: {
    marginLeft: 15,
    fontSize: 16,
    fontWeight: '500',
    color: '#e60000',
  },
});

export default AgentNavigator;
