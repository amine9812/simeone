# StagePilot 3iL — Guide Interactif de Soutenance & Maquette Code

Bienvenue dans l'application interactive conçue pour votre **soutenance de projet Web 3iL** devant votre professeur.

Cette application est **100% autonome** (HTML5, Vanilla CSS et JavaScript pur). Elle s'exécute directement dans n'importe quel navigateur sans nécessiter d'installation ni de compilation `npm`.

---

## 🚀 Comment lancer l'application

1. **Option 1 (Directe)** : Double-cliquez simplement sur [index.html](file:///C:/Users/zinem/OneDrive/Desktop/nigger/index.html) pour l'ouvrir dans Chrome, Edge ou Firefox.
2. **Option 2 (Serveur local)** : Ouvrez un terminal dans ce dossier et exécutez :
   ```powershell
   python -m http.server 8080
   ```
   Puis rendez-vous sur `http://localhost:8080`.

---

## 🎯 Fonctionnalités Clés Conçues pour l'Oral

### 1. 💻 Mode Maquette & Inspecteur de Code en Direct
- **Simulation fidèle à 100%** de l'ensemble de l'application StagePilot :
  - *Espace Étudiant* : Tableau de bord avec indicateurs KPIs et graphique Donut SVG, catalogue des offres avec filtres, fiche détaillée avec parcours de candidature en 4 étapes, gestionnaire de candidatures avec favoris et confirmation par mot de passe, module de CV avec IA Groq et profil 3iL.
  - *Espace Établissement (3iL Limoges)* : Tableau de bord de direction avec taux d'insertion, liste des étudiants avec filtrage par statut et tri, centre de notifications en temps réel.
  - *Espace Authentification* : Connexion avec sélecteur d'espace, inscription étudiant et inscription école avec validation administrative.
- **HUD Flottant au Survol** : En passant la souris sur **n'importe quel bouton, onglet, badge ou champ**, une infobulle HUD affiche immédiatement :
  - Nom & Rôle fonctionnel
  - Fichier template HTML exact + numéros de lignes
  - Route URL Django (`app_name:url_name`)
  - Fonction vue Python + fichier + numéros de lignes
- **Tiroir d'Inspection au Clic** : Un clic sur l'élément ouvre un panneau latéral qui détaille :
  - Le cycle pas-à-pas du traitement (ce qui se passe sous le capot)
  - L'extrait exact de code Python verbatim
  - **La question piège possible du professeur à l'oral avec sa réponse type toute prête !**
- **Sélecteur de Persona** : Basculez en un clic entre la vue *Lina Martin (Étudiante 3iL)*, *École 3iL Limoges* ou *Visiteur anonyme*.

### 2. 🏛️ Architecture & Justification des Choix Techniques
- Fiches de justification complètes pour :
  - **Django 5 & Python 3.12** (pattern MVT, sécurité intégrée)
  - **SQLite en Dev & PostgreSQL Supabase en Prod**
  - **IA Groq (LLaMA 3)** (modèle rapide, contrainte JSON stricte anti-hallucination)
  - **JSearch / OpenWeb Ninja API** (recherche de stages IT en France avec budget de requêtes maîtrisé)
  - **ReportLab** (génération vectorielle native de CV bi-colonne en PDF)
  - **Vanilla CSS & Bootstrap** (zéro compilation, performance et thème clair/sombre)

### 3. 🌳 Arborescence des Fichiers & Métaphores de la Vie Réelle
- Arbre interactif complet de tous les fichiers du projet.
- Chaque fichier est résumé en **une phrase claire**.
- Chaque fichier possède une **analogie intuitive du monde réel** (ex. `manage.py` = *La Manivelle du Moteur*, `config/urls.py` = *L'Aiguilleur du Ciel*, `accounts/models.py` = *Le Registre d'État Civil*, `accounts/cv_adaptation.py` = *Le Coach de Recrutement IA*, `offers/importation.py` = *Le Douanier & Magasinier*, etc.).

### 4. ⚙️ Les 5 Grands Traitements Métier
Décorticage algorithmique étape par étape des flux majeurs :
1. *Authentification & Sécurité RBAC*
2. *Moteur de Recommandations & Adaptation IA (Groq)*
3. *Synchronisation JSearch & Gestion de Quotas (verrous transactionnels)*
4. *Génération PDF ReportLab & Stockage Privé Supabase*
5. *Cycle de Candidature & Notifications École (sécurisation par mot de passe)*

### 5. 🛡️ Sécurité OWASP & Résilience
Explications pédagogiques sur les défenses mises en place :
- Protection CSRF
- Prévention des injections SQL via l'ORM
- Hachage PBKDF2 avec sel individuel
- Isolation Multi-Tenant école
- Transactions atomiques et verrous `select_for_update`

### 6. 🎓 Questions Pièges du Professeur (Simulateur d'Interrogation)
Une série de questions pointues fréquemment posées en soutenance (architecture, bases de données, concurrence, IA, performances) avec les réponses idéales à formuler devant le jury.

### 7. 🔍 Recherche Globale Instantanée (`Ctrl + K`)
Pressez `Ctrl + K` depuis n'importe quel écran pour rechercher instantanément une vue, un bouton, une fonction ou un fichier et sauter directement dessus !
