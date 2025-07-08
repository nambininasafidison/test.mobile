'use client';

import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../contexts/ProductsContext';

const ProfileScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { user, updateProfile, logout } = useAuth();
  const { products } = useProducts();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);

  const userProducts = products.filter((product) => product.createdBy === user?.id);
  const activeProducts = userProducts.filter((product) => product.isActive);
  const totalValue = userProducts.reduce((sum, product) => sum + product.price * product.stock, 0);

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      const success = await updateProfile(formData.name, formData.email);
      if (success) {
        Alert.alert('Succès', 'Vos informations ont été mises à jour avec succès');
      } else {
        Alert.alert('Erreur', 'Erreur lors de la mise à jour du profil');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Déconnexion', 'Êtes-vous sûr de vouloir vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Déconnexion',
        style: 'destructive',
        onPress: logout,
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Mon Profil</Text>
          <Text style={styles.headerSubtitle}>Gérez vos informations personnelles</Text>
        </View>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Profile Form */}
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.avatar}>
                <MaterialIcons name="person" size={32} color="#ffffff" />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileTitle}>Informations personnelles</Text>
                <Text style={styles.profileSubtitle}>Modifiez vos informations de profil</Text>
              </View>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>NOM COMPLET</Text>
                <CustomInput
                  placeholder="Votre nom complet"
                  value={formData.name}
                  onChangeText={(text) => setFormData((prev) => ({ ...prev, name: text }))}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>EMAIL</Text>
                <CustomInput
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChangeText={(text) => setFormData((prev) => ({ ...prev, email: text }))}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.actions}>
                <CustomButton
                  title={loading ? 'Sauvegarde...' : 'Sauvegarder'}
                  onPress={handleSubmit}
                  disabled={loading}
                  style={styles.saveButton}
                />
                <CustomButton
                  title="Déconnexion"
                  onPress={handleLogout}
                  variant="danger"
                  style={styles.logoutButton}
                />
              </View>
            </View>
          </View>

          {/* Statistics */}
          <View style={styles.statsCard}>
            <View style={styles.statsHeader}>
              <MaterialIcons name="trending-up" size={24} color="#1f2937" />
              <Text style={styles.statsTitle}>Statistiques</Text>
            </View>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Produits créés</Text>
                <View style={styles.statBadge}>
                  <Text style={styles.statValue}>{userProducts.length}</Text>
                </View>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Produits actifs</Text>
                <View style={[styles.statBadge, styles.activeBadge]}>
                  <Text style={[styles.statValue, styles.activeValue]}>
                    {activeProducts.length}
                  </Text>
                </View>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Valeur totale</Text>
                <Text style={styles.statPrice}>${totalValue.toFixed(2)}</Text>
              </View>
            </View>
          </View>

          {/* Recent Products */}
          <View style={styles.recentCard}>
            <View style={styles.recentHeader}>
              <MaterialIcons name="inventory" size={24} color="#1f2937" />
              <Text style={styles.recentTitle}>Produits récents</Text>
            </View>
            {userProducts.length > 0 ? (
              <View style={styles.recentList}>
                {userProducts.slice(0, 3).map((product) => (
                  <View key={product.id} style={styles.recentItem}>
                    <View style={styles.recentInfo}>
                      <Text style={styles.recentName}>{product.name}</Text>
                      <View style={styles.recentDetails}>
                        <Text style={styles.recentCategory}>{product.category}</Text>
                        <Text style={styles.recentSeparator}>•</Text>
                        <Text style={styles.recentPrice}>${product.price}</Text>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.recentBadge,
                        product.isActive ? styles.recentActiveBadge : styles.recentInactiveBadge,
                      ]}
                    >
                      <Text
                        style={[
                          styles.recentBadgeText,
                          product.isActive ? styles.recentActiveText : styles.recentInactiveText,
                        ]}
                      >
                        {product.isActive ? 'Actif' : 'Inactif'}
                      </Text>
                    </View>
                  </View>
                ))}
                {userProducts.length > 3 && (
                  <CustomButton
                    title="Voir tous mes produits"
                    onPress={() => navigation.navigate('Dashboard')}
                    variant="secondary"
                    style={styles.viewAllButton}
                  />
                )}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <View style={styles.emptyIcon}>
                  <MaterialIcons name="inventory" size={32} color="#9ca3af" />
                </View>
                <Text style={styles.emptyText}>Aucun produit créé</Text>
                <CustomButton
                  title="Créer un produit"
                  onPress={() => navigation.navigate('AddProduct')}
                  style={styles.createButton}
                />
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 8,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1f2937',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  profileSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    letterSpacing: 1,
  },
  actions: {
    gap: 12,
    marginTop: 8,
  },
  saveButton: {
    marginBottom: 0,
  },
  logoutButton: {
    marginBottom: 0,
  },
  statsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginLeft: 8,
  },
  statsGrid: {
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 16,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  statBadge: {
    backgroundColor: '#1f2937',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: '#10b981',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  activeValue: {
    color: '#ffffff',
  },
  statPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
  },
  recentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginLeft: 8,
  },
  recentList: {
    gap: 12,
  },
  recentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 16,
  },
  recentInfo: {
    flex: 1,
  },
  recentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  recentDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentCategory: {
    fontSize: 12,
    color: '#6b7280',
  },
  recentSeparator: {
    fontSize: 12,
    color: '#d1d5db',
    marginHorizontal: 8,
  },
  recentPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
  },
  recentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recentActiveBadge: {
    backgroundColor: '#d1fae5',
  },
  recentInactiveBadge: {
    backgroundColor: '#f3f4f6',
  },
  recentBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  recentActiveText: {
    color: '#065f46',
  },
  recentInactiveText: {
    color: '#374151',
  },
  viewAllButton: {
    marginTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 20,
  },
  createButton: {
    paddingHorizontal: 24,
  },
});

export default ProfileScreen;
