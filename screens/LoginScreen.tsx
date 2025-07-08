'use client';

import { useState } from 'react';
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

const LoginScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      const success = await login(email, password);
      if (!success) {
        Alert.alert('Erreur', 'Email ou mot de passe incorrect');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
            <View style={styles.logo}>
              <View style={styles.logoInner} />
            </View>
            <Text style={styles.title}>Bienvenue</Text>
            <Text style={styles.subtitle}>Accédez à votre collection exclusive</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>ADRESSE EMAIL</Text>
              <CustomInput
                placeholder="votre@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>MOT DE PASSE</Text>
              <CustomInput
                placeholder="••••••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <CustomButton
              title={loading ? 'Connexion...' : 'Se connecter'}
              onPress={handleLogin}
              disabled={loading}
              style={styles.loginButton}
            />

            <View style={styles.registerSection}>
              <Text style={styles.registerText}>Nouveau membre ?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}>Créer un compte</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.demoSection}>
              <Text style={styles.demoTitle}>COMPTES DE DÉMONSTRATION</Text>
              <View style={styles.demoItem}>
                <Text style={styles.demoLabel}>Utilisateur :</Text>
                <Text style={styles.demoValue}>test@example.com</Text>
              </View>
              <View style={styles.demoItem}>
                <Text style={styles.demoLabel}>Admin :</Text>
                <Text style={styles.demoValue}>admin@example.com</Text>
              </View>
              <Text style={styles.demoPassword}>Mot de passe : password123 / admin123</Text>
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 8,
    paddingBottom: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1f2937',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  logoInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#6b7280',
    fontWeight: '500',
  },
  form: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    letterSpacing: 1,
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 32,
  },
  registerSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  registerText: {
    color: '#6b7280',
    fontWeight: '500',
    marginRight: 4,
  },
  registerLink: {
    color: '#1f2937',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  demoSection: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 12,
  },
  demoTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    letterSpacing: 1,
  },
  demoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  demoLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  demoValue: {
    fontSize: 12,
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontFamily: 'monospace',
  },
  demoPassword: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default LoginScreen;
