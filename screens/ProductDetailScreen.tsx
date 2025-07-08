'use client';

import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  Dimensions,
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
import { useProducts } from '../contexts/ProductsContext';

const { width } = Dimensions.get('window');

const ProductDetailScreen = ({ navigation, route }: any) => {
  const insets = useSafeAreaInsets();
  const { productId } = route.params;
  const { getProduct } = useProducts();
  const [product, setProduct] = useState(getProduct(productId));

  useEffect(() => {
    const foundProduct = getProduct(productId);
    if (!foundProduct) {
      navigation.goBack();
      return;
    }
    setProduct(foundProduct);
  }, [productId, getProduct, navigation]);

  if (!product) {
    return null;
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      Électronique: '#3b82f6',
      Mode: '#ec4899',
      Livres: '#8b5cf6',
      Maison: '#f97316',
      Sport: '#10b981',
      Autre: '#6b7280',
    };
    return colors[category as keyof typeof colors] || '#6b7280';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <MaterialIcons name="favorite-border" size={24} color="#6b7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <MaterialIcons name="share" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Product Image */}
          <View style={styles.imageContainer}>
            <Image source={{ uri: product.image }} style={styles.image} />
            <View style={styles.statusBadge}>
              <View
                style={[
                  styles.statusIndicator,
                  product.isActive ? styles.activeIndicator : styles.inactiveIndicator,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    product.isActive ? styles.activeText : styles.inactiveText,
                  ]}
                >
                  {product.isActive ? 'Disponible' : 'Indisponible'}
                </Text>
              </View>
            </View>
          </View>

          {/* Product Information */}
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.name}</Text>

            <View style={styles.rating}>
              {[...Array(5)].map((_, i) => (
                <MaterialIcons key={i} name="star" size={20} color="#fbbf24" />
              ))}
              <Text style={styles.ratingText}>5.0</Text>
              <Text style={styles.reviewCount}>• 128 avis</Text>
            </View>

            <Text style={styles.price}>${product.price.toFixed(2)}</Text>

            <View style={styles.detailsCard}>
              <Text style={styles.sectionTitle}>DESCRIPTION</Text>
              <Text style={styles.description}>{product.description}</Text>

              <View style={styles.separator} />

              <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                  <View style={[styles.detailIcon, { backgroundColor: '#dbeafe' }]}>
                    <MaterialIcons name="inventory" size={24} color="#3b82f6" />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>STOCK DISPONIBLE</Text>
                    <Text style={styles.detailValue}>{product.stock} unités</Text>
                  </View>
                </View>

                <View style={styles.detailItem}>
                  <View style={[styles.detailIcon, { backgroundColor: '#fce7f3' }]}>
                    <MaterialIcons name="local-offer" size={24} color="#ec4899" />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>CATÉGORIE</Text>
                    <Text style={styles.detailValue}>{product.category}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.separator} />

              <View style={styles.detailItem}>
                <View style={[styles.detailIcon, { backgroundColor: '#d1fae5' }]}>
                  <MaterialIcons name="store" size={24} color="#10b981" />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>VENDEUR OFFICIEL</Text>
                  <Text style={styles.detailValue}>{product.vendeurs}</Text>
                </View>
              </View>
            </View>

            {/* Category Badge */}
            <View style={styles.categoryContainer}>
              <View
                style={[
                  styles.categoryBadge,
                  { backgroundColor: getCategoryColor(product.category) + '20' },
                ]}
              >
                <Text style={[styles.categoryText, { color: getCategoryColor(product.category) }]}>
                  {product.category}
                </Text>
              </View>
            </View>

            {/* Purchase Button */}
            <CustomButton
              title="Acheter maintenant"
              onPress={() => {}}
              style={styles.purchaseButton}
            />
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
    justifyContent: 'space-between',
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
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    height: width,
    backgroundColor: '#ffffff',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  statusBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  statusIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  activeIndicator: {
    backgroundColor: '#d1fae5',
    borderColor: '#a7f3d0',
  },
  inactiveIndicator: {
    backgroundColor: '#f3f4f6',
    borderColor: '#d1d5db',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeText: {
    color: '#065f46',
  },
  inactiveText: {
    color: '#374151',
  },
  productInfo: {
    backgroundColor: '#ffffff',
    padding: 10,
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  productName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
    lineHeight: 40,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
  },
  reviewCount: {
    fontSize: 16,
    color: '#6b7280',
    marginLeft: 4,
  },
  price: {
    fontSize: 48,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 32,
  },
  detailsCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 20,
    padding: 10,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
    letterSpacing: 1,
  },
  description: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 24,
  },
  separator: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 24,
  },
  detailsGrid: {
    gap: 24,
    marginBottom: 24,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 4,
    letterSpacing: 1,
  },
  detailValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  categoryContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  categoryBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  purchaseButton: {
    marginBottom: 24,
  },
});

export default ProductDetailScreen;
