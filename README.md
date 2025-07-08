# 🚀 Présentation & Choix Techniques

Bienvenue dans mon application mobile de gestion de collection de produits ! J’ai conçu ce projet pour offrir une expérience moderne, élégante et sécurisée, en mettant l’accent sur la simplicité d’utilisation et la maintenabilité du code.

---

## 🎨 Design & Expérience Utilisateur

- **Palette de couleurs** : J’utilise des tons sobres et modernes (`#1f2937`, `#f9fafb`, `#374151`) pour une interface élégante et professionnelle.
- **Polices personnalisées** : Grâce à `expo-font`, j’intègre des polices uniques pour renforcer l’identité visuelle.
- **Icônes** : J’enrichis l’interface avec des icônes variées via `@expo/vector-icons`.
- **Effets & animations** : J’emploie `react-native-reanimated` pour des transitions fluides et naturelles.
- **Respect des marges de sécurité** : Avec `react-native-safe-area-context`, l’UI s’adapte parfaitement à tous les appareils.

---

## 🛠️ Technologies principales

1. **React Context** :
   J’utilise des contextes pour centraliser l’état global (authentification, produits). Cela me permet de partager facilement les données et actions entre tous les écrans, sans avoir à passer les props manuellement.

2. **Async Storage / Secure Store** :
   Pour la persistance locale et sécurisée des données sensibles (token, utilisateur), j’utilise `@react-native-async-storage/async-storage` et `expo-secure-store`. Ainsi, les informations restent accessibles et protégées même après la fermeture de l’application.

3. **Navigation** :
   J’organise la navigation multi-écrans avec une bibliothèque adaptée, pour une expérience fluide (connexion, inscription, dashboard, profil, etc.).

4. **Composants personnalisés** :
   Je crée des composants réutilisables (`CustomButton`, `CustomInput`, `ProductCard`…) pour garantir une interface cohérente, élégante et facile à maintenir.

5. **TypeScript** :
   Le typage statique me permet d’anticiper les erreurs et d’améliorer la robustesse du code.

6. **Gestion des thèmes & styles** :
   Les couleurs et styles sont centralisés pour garantir une identité visuelle forte et une adaptation facile aux thèmes clair/sombre.

7. **Gestion des assets** :
   Images et polices sont organisées dans `assets/` pour une gestion optimale des ressources graphiques.

8. **@expo/vector-icons** :
   J’intègre des icônes modernes et variées pour enrichir l’interface et l’ergonomie.

9. **@react-native-picker/picker** :
   Menus déroulants natifs pour une sélection intuitive (ex : catégories de produits).

10. **expo-image-picker** :
    Permet à l’utilisateur de choisir ou prendre des photos pour illustrer les produits, rendant l’application interactive et personnalisable.

11. **expo-font** :
    Chargement de polices personnalisées pour une identité visuelle unique.

12. **expo-splash-screen** :
    Affichage d’un écran de chargement personnalisé au démarrage pour une première impression soignée.

13. **expo-status-bar** :
    Personnalisation de la barre de statut pour l’adapter au thème de l’application.

14. **react-native-safe-area-context** :
    Gestion des marges de sécurité (notch, bords arrondis) pour une interface toujours bien affichée.

15. **react-native-reanimated** :
    Animations fluides et performantes pour une expérience utilisateur moderne.

---

## 🏗️ Architecture & Organisation du code

- **contexts/** :
  J’y centralise toute la logique d’état global. Par exemple, `AuthContext` gère l’authentification (connexion, inscription, persistance de l’utilisateur), tandis que `ProductsContext` gère la liste, l’ajout, la modification et la suppression des produits.

- **screens/** :
  Chaque écran correspond à une vue principale de l’application (connexion, inscription, dashboard, détail produit, profil, etc.). J’y structure l’UI et la logique spécifique à chaque page.

- **components/** :
  J’y regroupe tous les éléments réutilisables de l’interface (boutons, champs de saisie, cartes produits, etc.), pour garantir la cohérence visuelle et accélérer le développement.

- **assets/** :
  Toutes les images et polices personnalisées sont stockées ici pour une gestion centralisée des ressources graphiques.

- **constants/** :
  J’y place les fichiers de configuration (couleurs, thèmes, etc.) pour faciliter la maintenance et l’évolution du design.

- **navigation/** :
  Toute la configuration de la navigation entre les écrans s’y trouve, pour une organisation claire et évolutive.

---

## 💡 Pourquoi ces choix ?

- **Lisibilité & maintenabilité** : Context et composants réutilisables rendent le code propre et évolutif.
- **Sécurité & persistance** : Stockage local sécurisé pour les données sensibles.
- **Expérience utilisateur** : Navigation, thèmes et composants personnalisés pour une ergonomie optimale.
- **Robustesse** : TypeScript détecte les erreurs tôt et améliore la qualité du code.
- **Design moderne** : Icônes, polices et animations pour une application agréable à utiliser.
- **Compatibilité** : Modules natifs pour une expérience cohérente sur tous les appareils.

---

## 🗂️ Structure du projet

```text
components/   → Composants réutilisables de l’interface
contexts/     → Contextes pour l’état global (auth, produits)
screens/      → Différents écrans de l’application
assets/       → Images et polices
constants/    → Fichiers de configuration (couleurs, etc.)
navigation/   → Configuration de la navigation
```

---

<div align="center">
  <strong>🏆 Ce choix d’architecture et de technologies me permet de construire une application mobile moderne, sécurisée, performante et facile à maintenir.</strong>
</div>
