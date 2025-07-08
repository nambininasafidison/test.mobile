import { MaterialIcons } from '@expo/vector-icons';
import type React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Product } from '../contexts/ProductsContext';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onPress, onEdit, onDelete }) => {
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
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.image }} style={styles.image} />
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <MaterialIcons name="close" size={16} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>
            {product.name}
          </Text>
          <TouchableOpacity style={styles.editButton} onPress={onEdit}>
            <MaterialIcons name="edit" size={16} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {product.description}
        </Text>

        <View style={styles.rating}>
          {[...Array(5)].map((_, i) => (
            <MaterialIcons key={i} name="star" size={14} color="#fbbf24" />
          ))}
          <Text style={styles.ratingText}>5.0</Text>
          <Text style={styles.stock}>Stock: {product.stock}</Text>
        </View>

        <View style={styles.footer}>
          <View>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            <Text style={styles.vendor}>{product.vendeurs}</Text>
          </View>
          <View style={styles.badges}>
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
            <View
              style={[
                styles.statusBadge,
                product.isActive ? styles.activeBadge : styles.inactiveBadge,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  product.isActive ? styles.activeText : styles.inactiveText,
                ]}
              >
                {product.isActive ? 'Actif' : 'Inactif'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignSelf: 'center',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1.8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  deleteButton: {
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
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    lineHeight: 20,
  },
  editButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f59e0b',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  description: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 16,
    marginBottom: 12,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 4,
  },
  stock: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  vendor: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  activeBadge: {
    backgroundColor: '#d1fae5',
    borderColor: '#a7f3d0',
  },
  inactiveBadge: {
    backgroundColor: '#f3f4f6',
    borderColor: '#d1d5db',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  activeText: {
    color: '#065f46',
  },
  inactiveText: {
    color: '#374151',
  },
});

export default ProductCard;
