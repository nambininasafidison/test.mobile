'use client';

import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
  Alert,
  Image,
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

const categories = ['Électronique', 'Mode', 'Livres', 'Maison', 'Sport', 'Autre'];

const AddProductScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { addProduct } = useProducts();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    vendeurs: '',
    image: '',
    isActive: true,
  });

  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission requise', "Permission d'accès à la galerie requise");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setFormData((prev) => ({
        ...prev,
        image: result.assets[0].uri,
      }));
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Erreur', 'Le nom est requis');
      return false;
    }
    if (!formData.description.trim()) {
      Alert.alert('Erreur', 'La description est requise');
      return false;
    }
    if (!formData.price || Number.parseFloat(formData.price) <= 0) {
      Alert.alert('Erreur', 'Le prix doit être supérieur à 0');
      return false;
    }
    if (!formData.stock || Number.parseInt(formData.stock) < 0) {
      Alert.alert('Erreur', 'Le stock doit être positif');
      return false;
    }
    if (!formData.category) {
      Alert.alert('Erreur', 'La catégorie est requise');
      return false;
    }
    if (!formData.vendeurs.trim()) {
      Alert.alert('Erreur', 'Le vendeur est requis');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      addProduct({
        name: formData.name,
        description: formData.description,
        price: Number.parseFloat(formData.price),
        stock: Number.parseInt(formData.stock),
        category: formData.category,
        vendeurs: formData.vendeurs,
        image:
          formData.image ||
          'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop',
        isActive: formData.isActive,
        createdBy: user?.id,
      });

      Alert.alert('Succès', 'Le produit a été créé avec succès', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Ajouter un produit</Text>
        </View>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            {/* Image Upload */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>IMAGE DU PRODUIT</Text>
              {formData.image ? (
                <View style={styles.imageContainer}>
                  <Image source={{ uri: formData.image }} style={styles.image} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => setFormData((prev) => ({ ...prev, image: '' }))}
                  >
                    <MaterialIcons name="close" size={16} color="#ffffff" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.imagePlaceholder} onPress={handleImagePicker}>
                  <MaterialIcons name="add-a-photo" size={48} color="#9ca3af" />
                  <Text style={styles.imagePlaceholderText}>
                    Ajoutez une photo de votre produit
                  </Text>
                  <Text style={styles.imagePlaceholderSubtext}>
                    Cliquez ici pour sélectionner une image
                  </Text>
                </TouchableOpacity>
              )}
              {formData.image && (
                <CustomButton
                  title="Changer l'image"
                  onPress={handleImagePicker}
                  variant="secondary"
                  style={styles.changeImageButton}
                />
              )}
            </View>

            {/* Product Name */}
            <View style={styles.section}>
              <Text style={styles.label}>NOM DU PRODUIT *</Text>
              <CustomInput
                placeholder="Ex: iPhone 15"
                value={formData.name}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, name: text }))}
              />
            </View>

            {/* Description */}
            <View style={styles.section}>
              <Text style={styles.label}>DESCRIPTION DÉTAILLÉE *</Text>
              <CustomInput
                placeholder="Décrivez votre produit en détail..."
                value={formData.description}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, description: text }))}
                multiline
                numberOfLines={4}
                style={styles.textArea}
              />
            </View>

            {/* Price and Stock */}
            <View style={styles.row}>
              <View style={[styles.section, styles.halfWidth]}>
                <Text style={styles.label}>PRIX ($) *</Text>
                <CustomInput
                  placeholder="0.00"
                  value={formData.price}
                  onChangeText={(text) => setFormData((prev) => ({ ...prev, price: text }))}
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.section, styles.halfWidth]}>
                <Text style={styles.label}>STOCK *</Text>
                <CustomInput
                  placeholder="0"
                  value={formData.stock}
                  onChangeText={(text) => setFormData((prev) => ({ ...prev, stock: text }))}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Category */}
            <View style={styles.section}>
              <Text style={styles.label}>CATÉGORIE *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.categoryContainer}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryButton,
                        formData.category === category && styles.categoryButtonActive,
                      ]}
                      onPress={() => setFormData((prev) => ({ ...prev, category }))}
                    >
                      <Text
                        style={[
                          styles.categoryButtonText,
                          formData.category === category && styles.categoryButtonTextActive,
                        ]}
                      >
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Vendor */}
            <View style={styles.section}>
              <Text style={styles.label}>VENDEUR / MARQUE *</Text>
              <CustomInput
                placeholder="Ex: TechStore"
                value={formData.vendeurs}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, vendeurs: text }))}
              />
            </View>

            {/* Active Status */}
            <View style={styles.section}>
              <View style={styles.switchContainer}>
                <View style={styles.switchContent}>
                  <Text style={styles.switchTitle}>Disponibilité du produit</Text>
                  <Text style={styles.switchDescription}>
                    {formData.isActive
                      ? "Votre produit sera visible et disponible à l'achat"
                      : "Votre produit sera masqué et indisponible à l'achat"}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.switch,
                    formData.isActive ? styles.switchActive : styles.switchInactive,
                  ]}
                  onPress={() => setFormData((prev) => ({ ...prev, isActive: !prev.isActive }))}
                >
                  <View
                    style={[
                      styles.switchThumb,
                      formData.isActive ? styles.switchThumbActive : styles.switchThumbInactive,
                    ]}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actions}>
              <CustomButton
                title="Annuler"
                onPress={() => navigation.goBack()}
                variant="secondary"
                style={styles.actionButton}
              />
              <CustomButton
                title={loading ? 'Création...' : 'Créer le produit'}
                onPress={handleSubmit}
                disabled={loading}
                style={styles.actionButton}
              />
            </View>
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
  },
  form: {
    backgroundColor: '#ffffff',
    margin: 8,
    marginBottom: 24,
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    letterSpacing: 1,
  },
  imageContainer: {
    position: 'relative',
    alignSelf: 'center',
    marginBottom: 16,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 16,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholder: {
    height: 200,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
  },
  imagePlaceholderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginTop: 12,
  },
  imagePlaceholderSubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  changeImageButton: {
    alignSelf: 'center',
    paddingHorizontal: 24,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  halfWidth: {
    flex: 1,
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  categoryButtonActive: {
    backgroundColor: '#1f2937',
    borderColor: '#1f2937',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  categoryButtonTextActive: {
    color: '#ffffff',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 10,
    borderRadius: 10,
  },
  switchContent: {
    flex: 1,
    marginRight: 16,
  },
  switchTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  switch: {
    width: 40,
    height: 24,
    borderRadius: 16,
    padding: 2,
    justifyContent: 'center',
  },
  switchActive: {
    backgroundColor: '#10b981',
  },
  switchInactive: {
    backgroundColor: '#d1d5db',
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 14,
    backgroundColor: '#ffffff',
  },
  switchThumbActive: {
    alignSelf: 'flex-end',
  },
  switchThumbInactive: {
    alignSelf: 'flex-start',
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
  },
});

export default AddProductScreen;
