"use client"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"
import * as SecureStore from "expo-secure-store"

export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  category: string
  vendeurs: string
  image: string
  isActive: boolean
  createdBy?: string
}

interface ProductsContextType {
  products: Product[]
  addProduct: (product: Omit<Product, "id">) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
  getProduct: (id: string) => Product | undefined
  searchProducts: (query: string) => Product[]
  filterProducts: (category: string) => Product[]
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

const initialProducts: Product[] = [
  {
    id: "1",
    name: "iPhone 15",
    description: "Dernier modèle Apple avec puce A17 Pro",
    price: 999.99,
    stock: 25,
    category: "Électronique",
    vendeurs: "TechStore",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop",
    isActive: true,
    createdBy: "1",
  },
  {
    id: "2",
    name: "MacBook Pro M3",
    description: "Ordinateur portable professionnel",
    price: 2499.99,
    stock: 15,
    category: "Électronique",
    vendeurs: "AppleStore",
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop",
    isActive: true,
    createdBy: "1",
  },
  {
    id: "3",
    name: "Nike Air Max",
    description: "Chaussures de sport confortables",
    price: 129.99,
    stock: 50,
    category: "Mode",
    vendeurs: "SportShop",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    isActive: true,
    createdBy: "2",
  },
  {
    id: "4",
    name: "Samsung Galaxy S24",
    description: "Smartphone Android haut de gamme",
    price: 899.99,
    stock: 30,
    category: "Électronique",
    vendeurs: "TechWorld",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
    isActive: true,
    createdBy: "1",
  },
  {
    id: "5",
    name: "Livre de cuisine",
    description: "Recettes traditionnelles françaises",
    price: 24.99,
    stock: 100,
    category: "Livres",
    vendeurs: "Librairie Moderne",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop",
    isActive: true,
    createdBy: "2",
  },
]

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const savedProducts = await SecureStore.getItemAsync("products")
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts))
      } else {
        setProducts(initialProducts)
        await SecureStore.setItemAsync("products", JSON.stringify(initialProducts))
      }
    } catch (error) {
      console.error("Error loading products:", error)
      setProducts(initialProducts)
    }
  }

  const saveProducts = async (newProducts: Product[]) => {
    setProducts(newProducts)
    await SecureStore.setItemAsync("products", JSON.stringify(newProducts))
  }

  const addProduct = (product: Omit<Product, "id">) => {
    const newProduct = {
      ...product,
      id: Date.now().toString(),
    }
    const newProducts = [...products, newProduct]
    saveProducts(newProducts)
  }

  const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
    const newProducts = products.map((product) => (product.id === id ? { ...product, ...updatedProduct } : product))
    saveProducts(newProducts)
  }

  const deleteProduct = (id: string) => {
    const newProducts = products.filter((product) => product.id !== id)
    saveProducts(newProducts)
  }

  const getProduct = (id: string) => {
    return products.find((product) => product.id === id)
  }

  const searchProducts = (query: string) => {
    if (!query) return products
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        product.vendeurs.toLowerCase().includes(query.toLowerCase()),
    )
  }

  const filterProducts = (category: string) => {
    if (!category || category === "all") return products
    return products.filter((product) => product.category === category)
  }

  return (
    <ProductsContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProduct,
        searchProducts,
        filterProducts,
      }}
    >
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductsContext)
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductsProvider")
  }
  return context
}
