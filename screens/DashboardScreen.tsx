'use client';

import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../contexts/ProductsContext';

const { width } = Dimensions.get('window');
const CARD_GAP = 12;
const CARD_WIDTH = width - 8 * 2;
const PRODUCTS_PER_PAGE = 8;

const DashboardScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const { products, deleteProduct, searchProducts } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minStock, setMinStock] = useState('');
  const [maxStock, setMaxStock] = useState('');
  const [category, setCategory] = useState('');
  const [rate, setRate] = useState('');
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const categories = Array.from(new Set(products.map((p) => p.category)));

  useEffect(() => {
    let result = searchQuery ? searchProducts(searchQuery) : products;
    if (minPrice) result = result.filter((p) => p.price >= parseFloat(minPrice));
    if (maxPrice) result = result.filter((p) => p.price <= parseFloat(maxPrice));
    if (minStock) result = result.filter((p) => p.stock >= parseInt(minStock));
    if (maxStock) result = result.filter((p) => p.stock <= parseInt(maxStock));
    if (category) result = result.filter((p) => p.category === category);
    // if (rate) result = result.filter((p) => (p.rate ? p.rate.toString() === rate : true));
    setFilteredProducts(result);
  }, [
    searchQuery,
    products,
    searchProducts,
    minPrice,
    maxPrice,
    minStock,
    maxStock,
    category,
    rate,
  ]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE,
  );
  useEffect(() => {
    setCurrentPage(1); // reset page on filter/search change
  }, [filteredProducts]);

  const handleDeleteProduct = (id: string) => {
    Alert.alert('Supprimer le produit', 'Êtes-vous sûr de vouloir supprimer ce produit ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: () => deleteProduct(id),
      },
    ]);
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

  const renderProduct = ({ item }: any) => (
    <View style={{ width: CARD_WIDTH, marginBottom: CARD_GAP }}>
      <ProductCard
        product={item}
        onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
        onEdit={() => navigation.navigate('EditProduct', { productId: item.id })}
        onDelete={() => handleDeleteProduct(item.id)}
      />
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <MaterialIcons name="inventory" size={48} color="#9ca3af" />
      </View>
      <Text style={styles.emptyTitle}>Aucun produit trouvé</Text>
      <Text style={styles.emptyDescription}>
        {searchQuery
          ? 'Essayez de modifier vos critères de recherche'
          : 'Commencez par ajouter votre premier produit'}
      </Text>
      {!searchQuery && (
        <CustomButton
          title="Créer votre premier produit"
          onPress={() => navigation.navigate('AddProduct')}
          style={styles.emptyButton}
        />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerLeft}>
          <View style={styles.logo}>
            <View style={styles.logoInner} />
          </View>
          <View>
            <Text style={styles.headerTitle}>Collection</Text>
            <Text style={styles.headerSubtitle}>Gérez vos produits</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <MaterialIcons name="person" size={24} color="#6b7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleLogout}>
            <MaterialIcons name="logout" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search and Add/Filter Buttons */}
      <View style={styles.controls}>
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
          <CustomInput
            variant="search"
            placeholder="Dell Alienware 16"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
        </View>
        <TouchableOpacity style={styles.iconButton} onPress={() => setFiltersVisible(true)}>
          <MaterialIcons name="filter-list" size={28} color="#1f2937" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddProduct')}
        >
          <MaterialIcons name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Modal Filtres */}
      <Modal
        visible={filtersVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setFiltersVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.filtersModal}>
            <View style={styles.dragHandle} />
            <Text style={styles.filtersTitle}>Filtres</Text>
            {/* Inputs prix min/max côte à côte */}
            <View style={styles.inputRow}>
              <CustomInput
                placeholder="Prix min"
                value={minPrice}
                onChangeText={setMinPrice}
                keyboardType="numeric"
                style={[styles.filterInput, styles.inputHalf]}
              />
              <CustomInput
                placeholder="Prix max"
                value={maxPrice}
                onChangeText={setMaxPrice}
                keyboardType="numeric"
                style={[styles.filterInput, styles.inputHalf]}
              />
            </View>
            {/* Inputs stock min/max côte à côte */}
            <View style={styles.inputRow}>
              <CustomInput
                placeholder="Stock min"
                value={minStock}
                onChangeText={setMinStock}
                keyboardType="numeric"
                style={[styles.filterInput, styles.inputHalf]}
              />
              <CustomInput
                placeholder="Stock max"
                value={maxStock}
                onChangeText={setMaxStock}
                keyboardType="numeric"
                style={[styles.filterInput, styles.inputHalf]}
              />
            </View>
            <View style={styles.filterPickerWrapper}>
              <Picker
                selectedValue={category}
                onValueChange={setCategory}
                style={styles.filterPicker}
              >
                <Picker.Item label="Catégorie" value="" />
                {categories.map((cat) => (
                  <Picker.Item key={cat} label={cat} value={cat} />
                ))}
              </Picker>
            </View>
            <View style={styles.filtersActions}>
              <CustomButton
                title="Réinitialiser"
                variant="secondary"
                onPress={() => {
                  setMinPrice('');
                  setMaxPrice('');
                  setMinStock('');
                  setMaxStock('');
                  setCategory('');
                  setRate('');
                }}
                style={styles.filterActionBtn}
              />
              <CustomButton
                title="Fermer"
                onPress={() => setFiltersVisible(false)}
                style={styles.filterActionBtn}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Products List */}
      <FlatList
        data={paginatedProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={1}
        contentContainerStyle={styles.productsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
      {/* Pagination */}
      {totalPages > 1 && (
        <View style={styles.paginationContainer}>
          <TouchableOpacity
            style={[styles.pageButton, currentPage === 1 && styles.pageButtonDisabled]}
            onPress={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <MaterialIcons
              name="chevron-left"
              size={24}
              color={currentPage === 1 ? '#d1d5db' : '#1f2937'}
            />
          </TouchableOpacity>
          {Array.from({ length: totalPages }).map((_, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.pageNumber, currentPage === i + 1 && styles.pageNumberActive]}
              onPress={() => setCurrentPage(i + 1)}
            >
              <Text
                style={[
                  styles.pageNumberText,
                  currentPage === i + 1 && styles.pageNumberTextActive,
                ]}
              >
                {i + 1}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[styles.pageButton, currentPage === totalPages && styles.pageButtonDisabled]}
            onPress={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={currentPage === totalPages ? '#d1d5db' : '#1f2937'}
            />
          </TouchableOpacity>
        </View>
      )}
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1f2937',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  logoInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  headerRight: {
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
  controls: {
    flexDirection: 'row',
    padding: 8,
    gap: 8,
    alignItems: 'center',
  },
  searchContainer: {
    flex: 1,
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: 10,
    top: 14,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterButton: {
    flex: 1,
    marginRight: 8,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#1f2937',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(30,41,59,0.18)', // plus doux et sombre
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  filtersModal: {
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 28,
    paddingTop: 20,
    paddingBottom: 32,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 16,
    minHeight: 420,
  },
  filtersTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 18,
    color: '#1f2937',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  dragHandle: {
    alignSelf: 'center',
    width: 48,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#e5e7eb',
    marginBottom: 18,
  },
  filterInput: {
    minWidth: 80,
    marginBottom: 18,
    borderRadius: 12,
    fontSize: 16,
    backgroundColor: '#f3f4f6',
    borderColor: '#e5e7eb',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },
  inputHalf: {
    flex: 1,
    minWidth: 0,
  },
  filterPickerWrapper: {
    minWidth: 100,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
    marginBottom: 18,
  },
  filterPicker: {
    height: 48,
    width: '100%',
    color: '#1f2937',
  },
  filtersActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginTop: 24,
  },
  filterActionBtn: {
    flex: 1,
    borderRadius: 12,
    minHeight: 48,
  },
  productsList: {
    paddingHorizontal: 8,
    paddingBottom: 16,
    paddingTop: 0,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: CARD_GAP,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 32,
    lineHeight: 24,
  },
  emptyButton: {
    paddingHorizontal: 32,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    marginVertical: 12,
  },
  pageButton: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  pageButtonDisabled: {
    opacity: 0.5,
  },
  pageNumber: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  pageNumberActive: {
    backgroundColor: '#1f2937',
    borderColor: '#1f2937',
  },
  pageNumberText: {
    color: '#1f2937',
    fontWeight: '600',
    fontSize: 16,
  },
  pageNumberTextActive: {
    color: '#fff',
  },
});

export default DashboardScreen;
