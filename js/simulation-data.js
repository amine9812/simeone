/**
 * =============================================================================
 * STAGEPILOT — MOTEUR D'ARBRE D'ACTIVITÉ & SIMULATEUR DORÉ (UML / CONCEPTION)
 * Base de données exhaustive pour le simulateur de flux et d'arbre d'exécution
 * =============================================================================
 */

window.SIMULATION_TREES = {
    "confirmer_stage": {
        id: "confirmer_stage",
        title: "1. Confirmer son stage officiel (Contrat accepté)",
        shortTitle: "Validation Juridique du Contrat",
        icon: "🔒",
        method: "POST",
        endpoint: "/candidatures/1/confirmer-stage/",
        badge: "Validation Juridique",
        color: "#0F766E",
        goldColor: "#f59e0b",
        desc: "L'étudiant valide définitivement son stage chez Thales. Exige une ré-authentification par mot de passe (OWASP), vérifie les droits et le jeton CSRF, pose un verrou SQL atomique (select_for_update), annule les anciens stages, active le nouveau et notifie l'école en temps réel.",
        metrics: {
            steps: 8,
            decisions: 2,
            parallelOps: 3,
            latency: "95 ms"
        },
        nodes: [
            {
                id: "cs_1",
                stepNum: 1,
                type: "start",
                icon: "🖱️",
                title: "Déclencheur Client Web & Saisie Mot de Passe",
                subtitle: "Boîte de dialogue modale de confirmation irréversible",
                layer: "Client Web (HTML/JS)",
                file: "templates/applications/mes_candidatures.html:L215",
                fromFile: "Navigateur Client Web",
                toFile: "templates/applications/mes_candidatures.html",
                latency: "1 ms",
                nature: "CHECK",
                natureLabel: "CONTRÔLE & FORMULAIRE",
                natureColor: "#f59e0b",
                whatHappened: "L'étudiante Lina Martin clique sur 'Valider comme mon stage officiel' sur sa candidature Thales. Une modale sécurisée s'ouvre pour exiger la saisie de son mot de passe étudiant, rendant cette décision contractuelle délibérée et traçable.",
                stateChange: "Préparation de la requête POST avec le mot de passe masqué et le jeton CSRF.",
                payload: "mot_de_passe=••••••••&csrfmiddlewaretoken=HMAC_SHA256_x91j3k09a",
                code: `<form method="post" action="{% url 'applications:confirmer_stage' cand.pk %}">
    {% csrf_token %}
    <label for="id_pwd">Confirmez votre mot de passe étudiant :</label>
    <input type="password" name="mot_de_passe" required>
    <button type="submit" class="bouton-accepter">Valider définitivement mon stage</button>
</form>`,
                sql: null,
                oralTip: "L'OWASP recommande d'exiger une ré-authentification par mot de passe avant toute opération critique ou contractuelle.",
                whyCritical: "Empêche qu'un tiers manipulant une session restée ouverte ne confirme un engagement légal à la place de l'élève."
            },
            {
                id: "cs_2",
                stepNum: 2,
                type: "decision",
                icon: "🛡️",
                title: "Passage des Middlewares Django & Filtre de Sécurité",
                subtitle: "Contrôle cryptographique du jeton CSRF et déchiffrement de session",
                layer: "Middlewares Django (CSRF & Auth)",
                file: "django/contrib/auth/middleware.py:L24",
                fromFile: "templates/applications/mes_candidatures.html",
                toFile: "django.contrib.auth.middleware",
                latency: "12 ms",
                nature: "VERIFICATION",
                natureLabel: "VÉRIFICATION SÉCURITÉ",
                natureColor: "#38bdf8",
                condition: "csrf_token_valid(request) && request.user.is_authenticated",
                branchIf: {
                    label: "✓ SI VALIDE (TRUE)",
                    desc: "Jeton CSRF valide & session résolue (request.user = Lina Martin)",
                    target: "cs_3"
                },
                branchElse: {
                    label: "✗ SI INVALIDE (ELSE)",
                    desc: "Jeton absent/falsifié ou cookie corrompu ➔ Rejet HTTP 403 Forbidden immédiat",
                    target: "cs_err_csrf"
                },
                elseNode: {
                    id: "cs_err_csrf",
                    title: "Rejet de Sécurité HTTP 403 Forbidden",
                    badge: "Blocage OWASP",
                    desc: "Django bloque net la requête avant d'atteindre la moindre ligne de code de la vue. Aucune modification de base n'est possible.",
                    code: `from django.core.exceptions import PermissionDenied
# En cas d'échec du jeton CSRF :
raise PermissionDenied("CSRF verification failed. Request aborted.")`
                },
                whatHappened: "Le middleware CsrfViewMiddleware vérifie le HMAC-SHA256 du jeton soumis contre le secret en cookie. AuthenticationMiddleware résout l'utilisateur connecté via la table django_session.",
                stateChange: "Session vérifiée avec succès : request.user = <Utilisateur: lina.martin@3il.fr> (ID: 14)",
                payload: "Cookie: sessionid=k7a92f4e8b (TTL: 14 jours) | Jeton CSRF : Valide [200 OK]",
                code: `def process_request(self, request):
    request.user = auth.get_user(request)
    if not request.user.is_authenticated:
        return redirect('accounts:connexion')`,
                sql: "SELECT * FROM django_session WHERE session_key = 'k7a92f4e8b';",
                oralTip: "Si le jeton CSRF est falsifié ou absent, Django coupe court à l'exécution avec un code HTTP 403 Forbidden avant même d'atteindre la vue.",
                whyCritical: "Défense en profondeur contre les attaques CSRF (Cross-Site Request Forgery) imposée par le standard OWASP Top 10."
            },
            {
                id: "cs_3",
                stepNum: 3,
                type: "action",
                icon: "🔀",
                title: "Aiguillage d'URL & Typage Strict de l'Identifiant",
                subtitle: "Conversion stricte de l'URL vers le contrôleur Python",
                layer: "Aiguilleur d'URL (urls.py)",
                file: "applications/urls.py:L18",
                fromFile: "django.middleware",
                toFile: "applications/urls.py",
                latency: "14 ms",
                nature: "VERIFICATION",
                natureLabel: "AIGUILLAGE D'URL",
                natureColor: "#818cf8",
                whatHappened: "Résolution de l'URL '/candidatures/1/confirmer-stage/'. Le convertisseur d'URL '<int:pk>' valide strictement que '1' est un entier positif et achemine la requête vers la vue Python 'confirmer_stage'.",
                stateChange: "Dispatch vers : applications.views.confirmer_stage(request, pk=1)",
                payload: "resolver_match = ResolverMatch(func=confirmer_stage, kwargs={'pk': 1})",
                code: `urlpatterns = [
    path('<int:pk>/confirmer-stage/', views.confirmer_stage, name='confirmer_stage'),
]`,
                sql: null,
                oralTip: "L'utilisation de '<int:pk>' garantit que la variable transmise à Python est strictement un entier, éliminant les injections d'URL.",
                whyCritical: "Garantit la robustesse du typage en amont de la logique métier."
            },
            {
                id: "cs_4",
                stepNum: 4,
                type: "decision",
                icon: "🔑",
                title: "Contrôle Cryptographique du Mot de Passe Étudiant",
                subtitle: "Hachage PBKDF2-SHA256 comparé en temps constant",
                layer: "Contrôleur de Vue (views.py)",
                file: "applications/views.py:L268",
                fromFile: "applications/urls.py",
                toFile: "applications/views.py",
                latency: "42 ms",
                nature: "CHECK",
                natureLabel: "CONTRÔLE IDENTITÉ",
                natureColor: "#f59e0b",
                condition: "request.user.check_password(mot_de_passe)",
                branchIf: {
                    label: "✓ SI VRAI (TRUE)",
                    desc: "Hachage PBKDF2 concorde ➔ Autorisation d'engager la transaction SQL",
                    target: "cs_5"
                },
                branchElse: {
                    label: "✗ SI FAUX (ELSE)",
                    desc: "Mot de passe incorrect ➔ Alerte flash messages.error() et redirection immédiate",
                    target: "cs_err_pwd"
                },
                elseNode: {
                    id: "cs_err_pwd",
                    title: "Échec de Ré-Authentification (Mot de passe erroné)",
                    badge: "Échec Vérification",
                    desc: "Django génère un message flash 'Mot de passe incorrect' et redirige l'étudiant vers /candidatures/ sans modifier la base de données.",
                    code: `messages.error(request, "Mot de passe incorrect.")
return redirect("applications:mes_candidatures")`
                },
                whatHappened: "La vue extrait le mot de passe soumis et exécute 'request.user.check_password(mot_de_passe)'. Django applique le sel stocké en base et compare les hachages PBKDF2-SHA256 en mémoire vive en temps constant (constant-time compare).",
                stateChange: "Contrôle cryptographique : MATCH [TRUE]. L'identité de Lina Martin est formellement certifiée.",
                payload: "mot_de_passe saisi ➔ comparé à user.password (pbkdf2_sha256$720000$...)",
                code: `@login_required
@require_POST
def confirmer_stage(request, pk):
    mot_de_passe = request.POST.get("mot_de_passe", "")
    if not request.user.check_password(mot_de_passe):
        messages.error(request, "Mot de passe incorrect.")
        return redirect("applications:mes_candidatures")`,
                sql: null,
                oralTip: "Le mot de passe n'est jamais déchiffré : Django hache la saisie avec le même sel et compare les hachages en temps constant pour contrer les Timing Attacks.",
                whyCritical: "Protection contre les attaques par canal auxiliaire (Side-Channel Timing Attacks)."
            },
            {
                id: "cs_5",
                stepNum: 5,
                type: "action",
                icon: "🔒",
                title: "Démarrage Bloc Transactionnel & Verrou SQL FOR UPDATE",
                subtitle: "Isolation ACID stricte pour prévenir toute Race Condition",
                layer: "ORM & Verrou SQL (select_for_update)",
                file: "applications/views.py:L280",
                fromFile: "applications/views.py",
                toFile: "applications/models.py & PostgreSQL",
                latency: "58 ms",
                nature: "TREATMENT",
                natureLabel: "VERROU TRANSACTIONNEL",
                natureColor: "#6366f1",
                whatHappened: "Démarrage d'un bloc 'transaction.atomic()'. Pose d'un verrou exclusif de ligne 'FOR UPDATE' sur la candidature ciblée et sur les anciennes candidatures de l'élève pour bloquer tout accès concurrent simultané.",
                stateChange: "Ligne verrouillée en base SQL : aucune autre requête ne peut modifier ce statut simultanément.",
                payload: "pk=1 | profil_id=14 | statut='ACCEPTEE' | [LOCK EXCLUSIF ACQUIS]",
                code: `with transaction.atomic():
    cand = get_object_or_404(
        Candidature.objects.select_for_update(),
        pk=pk,
        etudiant=profil,
        statut=Candidature.Statut.ACCEPTEE
    )`,
                sql: "BEGIN TRANSACTION;\nSELECT * FROM applications_candidature WHERE id = 1 AND etudiant_id = 14 AND statut = 'ACCEPTEE' FOR UPDATE;",
                oralTip: "'select_for_update()' garantit l'isolation ACID et élimine toute 'Race Condition' si l'étudiant clique deux fois très vite.",
                whyCritical: "Propriété d'Isolation (I de ACID) indispensable dans les systèmes contractuels multi-utilisateurs."
            },
            {
                id: "cs_6",
                stepNum: 6,
                type: "fork",
                icon: "⚡",
                title: "Traitements Parallèles & Concomitants en Base SQL",
                subtitle: "Exécution simultanée des mutations d'état et alertes dans la transaction",
                layer: "Modèle ORM & Base PostgreSQL",
                file: "applications/views.py:L295",
                fromFile: "applications/views.py",
                toFile: "applications/models.py & schools/models.py",
                latency: "75 ms",
                nature: "VALUE_CHANGE",
                natureLabel: "MUTATION SQL PERSISTANTE",
                natureColor: "#10b981",
                parallelTasks: [
                    {
                        id: "cs_p1",
                        badge: "SQL Branche A",
                        title: "Réinitialisation des anciens stages",
                        desc: "Annulation de tout stage confirmé antérieur pour garantir l'unicité du contrat officiel.",
                        sql: "UPDATE applications_candidature SET stage_confirme = FALSE WHERE etudiant_id = 14 AND id != 1 AND stage_confirme = TRUE;",
                        code: `for ancienne in Candidature.objects.select_for_update().filter(etudiant=profil, stage_confirme=True).exclude(pk=cand.pk):
    ancienne.stage_confirme = False
    ancienne.save(update_fields=["stage_confirme"])`
                    },
                    {
                        id: "cs_p2",
                        badge: "SQL Branche B",
                        title: "Activation du nouveau stage officiel",
                        desc: "Passage du champ booléen stage_confirme=True et horodatage de la confirmation.",
                        sql: "UPDATE applications_candidature SET stage_confirme = TRUE WHERE id = 1;",
                        code: `cand.stage_confirme = True
cand.save(update_fields=["stage_confirme"])`
                    },
                    {
                        id: "cs_p3",
                        badge: "École Branche C",
                        title: "Notification en temps réel à l'école 3iL",
                        desc: "Création immédiate de l'enregistrement NotificationEcole pour le tuteur pédagogique.",
                        sql: "INSERT INTO schools_notificationecole (etablissement_id, etudiant_id, type_action, est_lue, date_creation) VALUES (1, 14, 'CONFIRMATION', FALSE, NOW());",
                        code: `NotificationEcole.notifier_action_stage(cand, NotificationEcole.TypeAction.CONFIRMATION)`
                    }
                ],
                whatHappened: "À l'intérieur de la transaction atomique, 3 opérations sont coordonnées : 1) Annulation des anciens stages validés, 2) Activation du nouveau contrat, 3) Émission de la notification pour le responsable des stages 3iL.",
                stateChange: "cand.stage_confirme : False ➔ True | Alerte école créée | Compteur cloche école +1.",
                payload: "ID: 1 | Entreprise: Thales Limoges | Stage Confirmé: TRUE | École notifiée: 3iL",
                code: `# 1. Réinitialisation des anciens stages validés
for ancienne in Candidature.objects.select_for_update().filter(etudiant=profil, stage_confirme=True).exclude(pk=cand.pk):
    ancienne.stage_confirme = False
    ancienne.save(update_fields=["stage_confirme"])

# 2. Confirmation du stage officiel
cand.stage_confirme = True
cand.save(update_fields=["stage_confirme"])

# 3. Notification école 3iL
NotificationEcole.notifier_action_stage(cand, NotificationEcole.TypeAction.CONFIRMATION)`,
                sql: "UPDATE applications_candidature SET stage_confirme = FALSE WHERE etudiant_id = 14 AND id != 1 AND stage_confirme = TRUE;\nUPDATE applications_candidature SET stage_confirme = TRUE WHERE id = 1;\nINSERT INTO schools_notificationecole VALUES (1, 14, 'CONFIRMATION', FALSE, NOW());",
                oralTip: "L'argument update_fields=['stage_confirme'] ne réécrit que cette colonne spécifique en SQL au lieu de réécrire toute la ligne, ce qui est plus rapide et évite d'écraser d'autres champs.",
                whyCritical: "Optimisation de bande passante SQL et élimination des conflits d'écrasement."
            },
            {
                id: "cs_7",
                stepNum: 7,
                type: "join",
                icon: "💾",
                title: "Convergence & Validation Transactionnelle COMMIT",
                subtitle: "Persistance atomique définitive et libération des verrous",
                layer: "Moteur PostgreSQL ACID",
                file: "PostgreSQL Engine:5432",
                fromFile: "applications/views.py",
                toFile: "PostgreSQL Engine",
                latency: "88 ms",
                nature: "TREATMENT",
                natureLabel: "TRANSACTION COMMIT",
                natureColor: "#059669",
                whatHappened: "Le bloc 'with transaction.atomic():' arrive à son terme avec succès. PostgreSQL valide le COMMIT, inscrit les modifications dans le journal WAL (Write-Ahead Logging) et libère tous les verrous exclusifs de ligne.",
                stateChange: "COMMIT SQL irréversible : état garanti durable (D de ACID).",
                payload: "COMMIT TRANSACTION; Verrous relâchés [OK]",
                code: `# Sortie du contexte 'with transaction.atomic():'
# Django déclenche automatiquement le commit PostgreSQL si aucune exception n'est survenue.`,
                sql: "COMMIT;",
                oralTip: "Si une erreur réseau ou BDD survenait à n'importe quel moment avant le COMMIT, PostgreSQL exécuterait un ROLLBACK automatique sans altérer l'ancienne situation.",
                whyCritical: "Atomicité stricte : tout réussit ou tout est annulé sans corruption partielle."
            },
            {
                id: "cs_8",
                stepNum: 8,
                type: "end",
                icon: "📦",
                title: "Réponse HTTP & Redirection PRG (Post-Redirect-Get)",
                subtitle: "Toast de félicitations et affichage du badge officiel",
                layer: "Réponse HTTP (Pattern PRG)",
                file: "applications/views.py:L312",
                fromFile: "applications/views.py",
                toFile: "Navigateur Client Web",
                latency: "95 ms",
                nature: "RESPONSE",
                natureLabel: "RÉPONSE & REDIRECTION",
                natureColor: "#0ea5e9",
                whatHappened: "Le contrôleur stocke un message flash vert dans les cookies de session et renvoie une réponse HTTP 302 Found redirigeant vers la liste des candidatures. Le navigateur effectue une requête GET propre et affiche le toast.",
                stateChange: "Navigateur : Affiche le toast vert 'Félicitations !' et le badge '★ Stage confirmé'.",
                payload: "HTTP/1.1 302 Found | Location: /candidatures/ | Set-Cookie: messages=...",
                code: `messages.success(request, "Félicitations ! Votre stage chez Thales est officiellement confirmé.")
return redirect("applications:mes_candidatures")`,
                sql: null,
                oralTip: "Le pattern Post-Redirect-Get (PRG) empêche le renvoi accidentel du formulaire de confirmation si l'utilisateur appuie sur la touche F5.",
                whyCritical: "Bonne pratique universelle du web empêchant les doubles soumissions accidentelles."
            }
        ]
    },

    "postuler_stage": {
        id: "postuler_stage",
        title: "2. Postuler à une offre de stage (avec copie figée du CV)",
        shortTitle: "Dépôt de Candidature & Archivage Immuable",
        icon: "📨",
        method: "POST",
        endpoint: "/offres/1/postuler/",
        badge: "Candidature Étudiant",
        color: "#6366f1",
        goldColor: "#f59e0b",
        desc: "L'étudiant soumet sa candidature pour l'offre Thales. Vérifie le rôle étudiant, l'unicité en base SQL (anti-doublon), crée la ligne de candidature, téléverse une copie PDF figée et immuable dans Supabase Storage et redirige avec confirmation.",
        metrics: {
            steps: 7,
            decisions: 2,
            parallelOps: 3,
            latency: "115 ms"
        },
        nodes: [
            {
                id: "ps_1",
                stepNum: 1,
                type: "start",
                icon: "🖱️",
                title: "Sélection du CV & Soumission du Formulaire",
                subtitle: "Choix entre CV Principal ou CV Adapté par l'IA Groq",
                layer: "Client Web (HTML/JS)",
                file: "templates/offers/detail_offre.html:L115",
                fromFile: "Navigateur Client Web",
                toFile: "templates/offers/detail_offre.html",
                latency: "1 ms",
                nature: "CHECK",
                natureLabel: "CONTRÔLE & FORMULAIRE",
                natureColor: "#f59e0b",
                whatHappened: "L'étudiant choisit la version de son CV (Principal ou Adapté Groq), rédige un message de motivation et clique sur 'Transmettre ma candidature'.",
                stateChange: "Préparation des données multipart avec identifiant du CV et token CSRF.",
                payload: "cv_choisi=ADAPTE&lettre=Madame,%20Monsieur...",
                code: `fetch('/offres/1/postuler/', { method: 'POST', body: formData });`,
                sql: null,
                oralTip: "Le navigateur injecte automatiquement le cookie de session et le jeton CSRF pour certifier l'identité de l'étudiant.",
                whyCritical: "Initialisation propre de la charge utile de la candidature."
            },
            {
                id: "ps_2",
                stepNum: 2,
                type: "decision",
                icon: "🛡️",
                title: "Contrôle d'Accès RBAC & Authentification",
                subtitle: "Vérification stricte du rôle ÉTUDIANT et de la session",
                layer: "Middlewares Django & Sécurité",
                file: "django/contrib/auth/middleware.py:L24",
                fromFile: "templates/offers/detail_offre.html",
                toFile: "stagepilot/middleware.py",
                latency: "12 ms",
                nature: "VERIFICATION",
                natureLabel: "VÉRIFICATION SÉCURITÉ",
                natureColor: "#38bdf8",
                condition: "request.user.is_authenticated && request.user.role == 'ETUDIANT'",
                branchIf: {
                    label: "✓ SI AUTORISÉ (TRUE)",
                    desc: "Étudiant authentifié (Lina Martin) ➔ Poursuite vers l'aiguillage d'URL",
                    target: "ps_3"
                },
                branchElse: {
                    label: "✗ SI REJETÉ (ELSE)",
                    desc: "Utilisateur non connecté ou rôle non étudiant ➔ Redirection Connexion",
                    target: "ps_err_auth"
                },
                elseNode: {
                    id: "ps_err_auth",
                    title: "Accès Refusé (Connexion Requise)",
                    badge: "Contrôle RBAC",
                    desc: "L'utilisateur est redirigé vers /comptes/connexion/?next=/offres/1/postuler/ avec un code HTTP 302.",
                    code: `@require_POST\n@login_required\ndef postuler(request, pk): ...`
                },
                whatHappened: "Vérification de la session active et contrôle que le profil utilisateur est bien de type 'ETUDIANT'. Les comptes écoles ou visiteurs ne peuvent pas postuler.",
                stateChange: "Autorisation confirmée pour l'étudiante Lina Martin.",
                payload: "Session active | Utilisateur: lina.martin@3il.fr",
                code: `@require_POST
@login_required
def postuler(request, pk):
    profil = request.user.profil_etudiant`,
                sql: "SELECT * FROM django_session WHERE session_key = 'k7a92f4e8b';",
                oralTip: "Le décorateur @require_POST rejette toute tentative malveillante d'appel par simple lien GET.",
                whyCritical: "Défense en profondeur contre les soumissions non autorisées."
            },
            {
                id: "ps_3",
                stepNum: 3,
                type: "action",
                icon: "🔀",
                title: "Aiguillage d'URL & Typage de l'Offre",
                subtitle: "Capture du paramètre numérique <int:pk>",
                layer: "Aiguilleur d'URL (urls.py)",
                file: "offers/urls.py:L14",
                fromFile: "stagepilot/middleware.py",
                toFile: "offers/urls.py",
                latency: "15 ms",
                nature: "VERIFICATION",
                natureLabel: "AIGUILLAGE D'URL",
                natureColor: "#818cf8",
                whatHappened: "Capture du paramètre d'URL '<int:pk>' (pk=1) et routage vers applications.views.postuler.",
                stateChange: "Paramètre pk=1 validé comme entier.",
                payload: "URL Match : path('<int:pk>/postuler/', views.postuler, name='postuler')",
                code: `path('<int:pk>/postuler/', views.postuler, name='postuler')`,
                sql: null,
                oralTip: "Le typage d'URL empêche l'injection de caractères spéciaux dans la vue.",
                whyCritical: "Sécurisation syntaxique du point d'entrée."
            },
            {
                id: "ps_4",
                stepNum: 4,
                type: "decision",
                icon: "🔑",
                title: "Contrôle d'Unicité SQL (Anti-Doublon)",
                subtitle: "Vérification en base qu'aucune candidature n'existe déjà",
                layer: "Contrôleur de Vue (views.py)",
                file: "applications/views.py:L98",
                fromFile: "offers/urls.py",
                toFile: "applications/views.py",
                latency: "28 ms",
                nature: "CHECK",
                natureLabel: "CONTRÔLE D'UNICITÉ",
                natureColor: "#f59e0b",
                condition: "!Candidature.objects.filter(etudiant=profil, offre=offre).exists()",
                branchIf: {
                    label: "✓ SI INÉDIT (TRUE)",
                    desc: "Aucune candidature existante ➔ Procéder à l'enregistrement",
                    target: "ps_5"
                },
                branchElse: {
                    label: "✗ SI DOUBLON (ELSE)",
                    desc: "Candidature déjà existante ➔ Avertissement et redirection",
                    target: "ps_err_dup"
                },
                elseNode: {
                    id: "ps_err_dup",
                    title: "Doublon de Candidature Détecté",
                    badge: "Doublon Évité",
                    desc: "La vue informe l'étudiant qu'il a déjà postulé à cette offre et le redirige vers la fiche sans créer de doublon.",
                    code: `messages.warning(request, "Vous avez déjà postulé à cette offre.")
return redirect('offers:detail_offre', pk=pk)`
                },
                whatHappened: "Exécution d'une requête SQL rapide 'SELECT 1 ... LIMIT 1' pour vérifier qu'aucune ligne n'associe déjà cet étudiant et cette offre.",
                stateChange: "Contrôle anti-doublon : False (Aucune candidature existante, validation accordée).",
                payload: "etudiant=14 | offre=1 | exists() -> False",
                code: `offre = get_object_or_404(OffreStage, pk=pk)
if Candidature.objects.filter(etudiant=profil, offre=offre).exists():
    messages.warning(request, "Vous avez déjà postulé à cette offre.")
    return redirect('offers:detail_offre', pk=pk)`,
                sql: "SELECT 1 FROM applications_candidature WHERE etudiant_id = 14 AND offre_id = 1 LIMIT 1;",
                oralTip: "La contrainte unique_together=('etudiant', 'offre') sur le modèle assure un double verrou au niveau SQL.",
                whyCritical: "Garantit l'intégrité référentielle et empêche de fausser les statistiques de recrutement."
            },
            {
                id: "ps_5",
                stepNum: 5,
                type: "action",
                icon: "💾",
                title: "Création de la Ligne SQL de Candidature",
                subtitle: "Persistance en base avec statut initial 'ENVOYEE'",
                layer: "Modèle ORM & Base SQL",
                file: "applications/views.py:L142",
                fromFile: "applications/views.py",
                toFile: "applications/models.py",
                latency: "45 ms",
                nature: "VALUE_CHANGE",
                natureLabel: "MUTATION SQL PERSISTANTE",
                natureColor: "#10b981",
                whatHappened: "Insertion transactionnelle de la nouvelle candidature dans la table PostgreSQL applications_candidature.",
                stateChange: "Nouvelle candidature enregistrée en base SQL : id=88, statut='ENVOYEE'.",
                payload: "Candidature(id=88, etudiant_id=14, offre_id=1, statut='ENVOYEE')",
                code: `candidature = Candidature.objects.create(
    etudiant=profil, offre=offre, cv_choisi=cv_choisi,
    statut=Candidature.Statut.ENVOYEE
)`,
                sql: "INSERT INTO applications_candidature (etudiant_id, offre_id, cv_choisi, statut, date_candidature) VALUES (14, 1, 'ADAPTE', 'ENVOYEE', NOW());",
                oralTip: "L'ORM Django protège automatiquement contre toutes les injections SQL grâce aux requêtes paramétrées.",
                whyCritical: "Création garantie et traçabilité immédiate du dossier étudiant."
            },
            {
                id: "ps_6",
                stepNum: 6,
                type: "fork",
                icon: "⚡",
                title: "Archivage Cloud Immuable & Tâches Concomitantes",
                subtitle: "Duplication physique du PDF vers Supabase Storage et mise à jour de la référence",
                layer: "Service Cloud (Supabase Storage)",
                file: "applications/services.py:L54",
                fromFile: "applications/views.py",
                toFile: "applications/services.py & Supabase",
                latency: "110 ms",
                nature: "TREATMENT",
                natureLabel: "TRAITEMENT CLOUD & STOCKAGE",
                natureColor: "#6366f1",
                parallelTasks: [
                    {
                        id: "ps_p1",
                        badge: "Cloud Storage",
                        title: "Copie Immuable du PDF vers Supabase",
                        desc: "Téléversement du fichier figé dans le bucket cloud privé 'stagepilot-cv' sous le chemin candidatures/14/cv_offre_1_copie.pdf.",
                        sql: null,
                        code: `dupliquer_pdf_pour_candidature(candidature)`
                    },
                    {
                        id: "ps_p2",
                        badge: "SQL Update",
                        title: "Mise à jour du champ copie_cv",
                        desc: "Enregistrement de l'URI immuable dans l'enregistrement SQL.",
                        sql: "UPDATE applications_candidature SET copie_cv = 'candidatures/14/cv_offre_1_copie.pdf' WHERE id = 88;",
                        code: `candidature.copie_cv = chemin_storage\ncandidature.save(update_fields=['copie_cv'])`
                    },
                    {
                        id: "ps_p3",
                        badge: "Statistiques",
                        title: "Incrémentation des métriques d'offre",
                        desc: "Actualisation du compteur de candidatures reçues par l'offre Thales.",
                        sql: "UPDATE offers_offrestage SET nb_candidatures = nb_candidatures + 1 WHERE id = 1;",
                        code: `OffreStage.objects.filter(id=1).update(nb_candidatures=F('nb_candidatures') + 1)`
                    }
                ],
                whatHappened: "Le service extrait le PDF vectoriel de l'étudiant et en téléverse une copie figée dans le bucket cloud privé. Même si l'étudiant modifie son CV demain, le recruteur consultera toujours la version exacte soumise le jour du dépôt.",
                stateChange: "Fichier immuable créé : candidatures/14/cv_offre_1_copie.pdf rattaché au dossier.",
                payload: "Copie PDF créée : 24.8 Ko téléversés vers Supabase Storage privé.",
                code: `dupliquer_pdf_pour_candidature(candidature)`,
                sql: "UPDATE applications_candidature SET copie_cv = 'candidatures/14/cv_offre_1_copie.pdf' WHERE id = 88;",
                oralTip: "Figer la copie du CV garantit la traçabilité légale en cas de litige, même si l'étudiant modifie son profil plus tard.",
                whyCritical: "Principe juridique de non-répudiation et preuve d'intégrité temporelle du document."
            },
            {
                id: "ps_7",
                stepNum: 7,
                type: "end",
                icon: "📦",
                title: "Réponse HTTP & Redirection PRG vers Candidatures",
                subtitle: "Toast vert de succès et actualisation du tableau de bord",
                layer: "Réponse HTTP (Pattern PRG)",
                file: "applications/views.py:L158",
                fromFile: "applications/services.py",
                toFile: "Navigateur Client Web",
                latency: "115 ms",
                nature: "RESPONSE",
                natureLabel: "RÉPONSE & REDIRECTION",
                natureColor: "#0ea5e9",
                whatHappened: "Redirection vers la page 'Mes candidatures' avec toast flash vert confirmant la transmission.",
                stateChange: "Affichage de la nouvelle candidature dans le tableau de bord de l'étudiant.",
                payload: "HTTP/1.1 302 Found | Location: /candidatures/",
                code: `messages.success(request, "Votre candidature a été transmise avec succès !")
return redirect("applications:mes_candidatures")`,
                sql: null,
                oralTip: "Le pattern PRG évite toute double soumission si l'utilisateur actualise la page.",
                whyCritical: "Fluidité UX et garantie d'unicité de la requête côté client."
            }
        ]
    },

    "generer_cv": {
        id: "generer_cv",
        title: "3. Génération vectorielle du CV en PDF (ReportLab Canvas)",
        shortTitle: "Moteur PDF Vectoriel & Cloud Supabase",
        icon: "📄",
        method: "POST",
        endpoint: "/comptes/cv/generer/",
        badge: "Moteur PDF & Cloud",
        color: "#0284c7",
        goldColor: "#f59e0b",
        desc: "Compilation des coordonnées, formations 3iL et compétences dans un PDF vectoriel A4 à deux colonnes avec ReportLab en mémoire vive (io.BytesIO), sans binaire externe lourd, puis téléversement sécurisé sur Supabase Storage.",
        metrics: {
            steps: 6,
            decisions: 1,
            parallelOps: 3,
            latency: "122 ms"
        },
        nodes: [
            {
                id: "gcv_1",
                stepNum: 1,
                type: "start",
                icon: "🖱️",
                title: "Déclencheur Client Espace Mon CV",
                subtitle: "Clic étudiant sur 'Générer mon CV principal'",
                layer: "Client Web (HTML/JS)",
                file: "templates/accounts/mon_cv.html:L55",
                fromFile: "Navigateur Client Web",
                toFile: "templates/accounts/mon_cv.html",
                latency: "1 ms",
                nature: "CHECK",
                natureLabel: "DÉCLENCHEUR CLIENT",
                natureColor: "#f59e0b",
                whatHappened: "L'étudiant clique sur 'Générer mon CV principal' dans son espace CV.",
                stateChange: "Émission d'une requête POST authentifiée vers le point de génération.",
                payload: "POST /comptes/cv/generer/ HTTP/1.1",
                code: `fetch('/comptes/cv/generer/', { method: 'POST' });`,
                sql: null,
                oralTip: "Une barre de progression informe l'utilisateur pendant le calcul du document.",
                whyCritical: "Rétroaction utilisateur immédiate."
            },
            {
                id: "gcv_2",
                stepNum: 2,
                type: "decision",
                icon: "🔑",
                title: "Contrôle de Complétude du Profil Étudiant",
                subtitle: "Vérification des champs obligatoires pour un CV valorisant",
                layer: "Contrôleur de Vue (views.py)",
                file: "accounts/views.py:L520",
                fromFile: "templates/accounts/mon_cv.html",
                toFile: "accounts/views.py",
                latency: "18 ms",
                nature: "CHECK",
                natureLabel: "CONTRÔLE DE COMPLÉTUDE",
                natureColor: "#f59e0b",
                condition: "len(informations_manquantes_cv(profil)) == 0",
                branchIf: {
                    label: "✓ SI COMPLET (TRUE)",
                    desc: "Coordonnées, compétences et promotion renseignées ➔ Calcul vectoriel autorisé",
                    target: "gcv_3"
                },
                branchElse: {
                    label: "✗ SI INCOMPLET (ELSE)",
                    desc: "Informations obligatoires manquantes ➔ Avertissement et guidage de saisie",
                    target: "gcv_err_inc"
                },
                elseNode: {
                    id: "gcv_err_inc",
                    title: "Profil Incomplet pour la Génération",
                    badge: "Validation Métier",
                    desc: "L'application affiche la liste des champs manquants (ex: compétences, promotion) pour éviter la génération d'un document vierge.",
                    code: `messages.warning(request, "Complétez d'abord vos compétences et coordonnées.")
return redirect('accounts:mon_cv')`
                },
                whatHappened: "La fonction 'informations_manquantes_cv' inspecte le profil de Lina Martin et s'assure qu'au moins 3 compétences et une adresse e-mail sont enregistrées.",
                stateChange: "Validation : Aucune information manquante bloquante détectée.",
                payload: "profil = ProfilEtudiant (14) | manquantes = []",
                code: `profil = request.user.profil_etudiant
manquantes = informations_manquantes_cv(profil)
if manquantes:
    return redirect('accounts:mon_cv')`,
                sql: "SELECT * FROM accounts_profiletudiant WHERE utilisateur_id = 14;",
                oralTip: "Empêche la génération de CV vides ou incomplets pouvant pénaliser l'élève.",
                whyCritical: "Qualité de données et garantie d'un rendu professionnel devant les recruteurs."
            },
            {
                id: "gcv_3",
                stepNum: 3,
                type: "action",
                icon: "🗄️",
                title: "Lecture ORM Optimisée Anti-N+1 (prefetch_related)",
                subtitle: "Chargement ensembliste des relations ManyToMany en 1 seule requête",
                layer: "Modèle ORM Django",
                file: "accounts/models.py:L70",
                fromFile: "accounts/views.py",
                toFile: "accounts/models.py",
                latency: "32 ms",
                nature: "VERIFICATION",
                natureLabel: "LECTURE ORM OPTIMISÉE",
                natureColor: "#38bdf8",
                whatHappened: "Chargement des compétences et formations via prefetch_related pour éviter le piège N+1 queries.",
                stateChange: "Données complètes de l'étudiant chargées en 1 seule requête SQL jointe.",
                payload: "9 compétences, 2 formations, 1 expérience professionnelle prêtes.",
                code: `profil = ProfilEtudiant.objects.prefetch_related(
    'competences', 'formations', 'experiences'
).get(utilisateur=request.user)`,
                sql: "SELECT * FROM accounts_competence INNER JOIN accounts_profiletudiant_competences ...;",
                oralTip: "prefetch_related regroupe toutes les relations ManyToMany en une seule requête optimisée.",
                whyCritical: "Optimisation majeure de performances SQL exigée en soutenance d'ingénieur."
            },
            {
                id: "gcv_4",
                stepNum: 4,
                type: "action",
                icon: "⚙️",
                title: "Dessin Vectoriel bi-colonne Canvas en Mémoire Vive",
                subtitle: "Génération de texte vectoriel pur sélectionnable sur io.BytesIO()",
                layer: "Moteur ReportLab Canvas (Python)",
                file: "accounts/cv.py:L40",
                fromFile: "accounts/views.py",
                toFile: "accounts/cv.py",
                latency: "65 ms",
                nature: "TREATMENT",
                natureLabel: "TRAITEMENT VECTORIEL",
                natureColor: "#6366f1",
                whatHappened: "Dessin bi-colonne du PDF sur un canvas A4 en mémoire vive : bandeau latéral gauche 3iL, typographies vectorielles et coordonnées.",
                stateChange: "Tampon binaire BytesIO généré : 24.8 Ko de pur PDF vectoriel indexable.",
                payload: "pagesize=A4 (595.27 x 841.89 points) | Tampon mémoire io.BytesIO",
                code: `tampon = io.BytesIO()
canvas_cv = canvas.Canvas(tampon, pagesize=A4)
dessiner_bandeau_lateral(canvas_cv, profil)
dessiner_parcours_competences(canvas_cv, profil)
canvas_cv.save()`,
                sql: null,
                oralTip: "ReportLab produit du vrai texte vectoriel sélectionnable par les robots ATS des recruteurs, pas une simple image aplatie.",
                whyCritical: "Indexabilité ATS (Applicant Tracking Systems) essentielle pour l'insertion des étudiants."
            },
            {
                id: "gcv_5",
                stepNum: 5,
                type: "fork",
                icon: "⚡",
                title: "Upload Cloud Supabase & Rotation du Stockage",
                subtitle: "Chiffrement et persistance dans le bucket privé 'stagepilot-cv'",
                layer: "Supabase Storage & Base SQL",
                file: "accounts/views.py:L560",
                fromFile: "accounts/cv.py",
                toFile: "accounts/models.py & Supabase",
                latency: "115 ms",
                nature: "VALUE_CHANGE",
                natureLabel: "TÉLÉVERSEMENT & PERSISTANCE",
                natureColor: "#10b981",
                parallelTasks: [
                    {
                        id: "gcv_p1",
                        badge: "Supabase Storage",
                        title: "Téléversement du fichier PDF",
                        desc: "Stockage du binaire dans le bucket privé 'stagepilot-cv'.",
                        sql: null,
                        code: `cv.fichier.save(nom_fichier, ContentFile(tampon.getvalue()))`
                    },
                    {
                        id: "gcv_p2",
                        badge: "Rotation Quotas",
                        title: "Purge de l'ancienne version",
                        desc: "Suppression du précédent fichier PDF pour respecter les quotas de stockage.",
                        sql: null,
                        code: `ancien_fichier.delete(save=False)`
                    },
                    {
                        id: "gcv_p3",
                        badge: "SQL Timestamp",
                        title: "Horodatage de la génération",
                        desc: "Mise à jour de date_generation = NOW() sur le modèle CVPrincipal.",
                        sql: "UPDATE accounts_cvprincipal SET fichier = '14/cv_principal.pdf', date_generation = NOW() WHERE profil_id = 14;",
                        code: `cv.date_generation = timezone.now()\ncv.save()`
                    }
                ],
                whatHappened: "Le fichier PDF généré est téléversé vers Supabase Storage, l'ancien fichier est purgé pour économiser l'espace disque, et le timestamp SQL est mis à jour.",
                stateChange: "CVPrincipal(id=14) : fichier='14/cv_principal.pdf', date_generation=NOW()",
                payload: "Bucket privé 'stagepilot-cv' | Rotation de l'ancienne version",
                code: `cv.fichier.save(nom_fichier, ContentFile(tampon.getvalue()))
cv.save()`,
                sql: "UPDATE accounts_cvprincipal SET fichier = '14/cv_principal.pdf', date_generation = NOW() WHERE profil_id = 14;",
                oralTip: "L'ancienne version du fichier est automatiquement purgée pour respecter les quotas de stockage.",
                whyCritical: "Gestion éco-responsable des ressources cloud et intégrité des métadonnées."
            },
            {
                id: "gcv_6",
                stepNum: 6,
                type: "end",
                icon: "📦",
                title: "Réponse HTTP & Prévisualisation Iframe PDF",
                subtitle: "Affichage immédiat du document généré sans rechargement lourd",
                layer: "Rendu HTML & iframe PDF",
                file: "templates/accounts/mon_cv.html:L120",
                fromFile: "accounts/views.py",
                toFile: "templates/accounts/mon_cv.html",
                latency: "122 ms",
                nature: "RESPONSE",
                natureLabel: "RÉPONSE & PRÉVISUALISATION",
                natureColor: "#0ea5e9",
                whatHappened: "Redirection vers l'interface 'Mon CV' avec chargement immédiat du PDF dans l'aperçu intégré.",
                stateChange: "Iframe de visualisation rafraîchie avec le nouveau document.",
                payload: "HTTP 302 Found ➔ GET /comptes/cv/ (200 OK)",
                code: `messages.success(request, "Votre CV principal a été généré avec succès !")
return redirect('accounts:mon_cv')`,
                sql: null,
                oralTip: "L'étudiant peut directement télécharger le PDF ou le tester avec l'assistant IA Groq.",
                whyCritical: "Expérience utilisateur interactive sans rupture de navigation."
            }
        ]
    },

    "recommandations_ia": {
        id: "recommandations_ia",
        title: "4. Matching IA des offres de stage (Groq LLaMA 3.1 70B)",
        shortTitle: "Inférence LPUs Groq & Anti-Hallucination SQL",
        icon: "🧠",
        method: "GET",
        endpoint: "/offres/?recommandations=1",
        badge: "Inférence Groq",
        color: "#8b5cf6",
        goldColor: "#f59e0b",
        desc: "Comparaison sémantique par lots du profil candidat avec les 15 offres actives via les processeurs LPUs ultra-rapides de Groq (>300 tokens/s). Formatage en JSON strict et barrière de sécurité anti-hallucination par whitelist SQL.",
        metrics: {
            steps: 6,
            decisions: 1,
            parallelOps: 3,
            latency: "220 ms"
        },
        nodes: [
            {
                id: "ia_1",
                stepNum: 1,
                type: "start",
                icon: "🖱️",
                title: "Déclencheur Client 'Recommandations pour vous'",
                subtitle: "Filtrage sémantique à la demande via paramètre GET",
                layer: "Client Web (HTML/JS)",
                file: "templates/offers/liste_offres.html:L200",
                fromFile: "Navigateur Client Web",
                toFile: "templates/offers/liste_offres.html",
                latency: "1 ms",
                nature: "CHECK",
                natureLabel: "REQUÊTE CANDIDAT",
                natureColor: "#f59e0b",
                whatHappened: "L'étudiant clique sur 'Recommandations pour vous'. Le paramètre 'recommandations=1' est ajouté à l'URL.",
                stateChange: "Demande de tri sémantique par IA transmise au serveur.",
                payload: "GET /offres/?recommandations=1 HTTP/1.1",
                code: `window.location.href = '/offres/?recommandations=1';`,
                sql: null,
                oralTip: "Le paramètre GET permet de partager l'URL ou d'ajouter la vue aux favoris du navigateur.",
                whyCritical: "Respect de l'idempotence des requêtes de consultation selon le standard HTTP REST."
            },
            {
                id: "ia_2",
                stepNum: 2,
                type: "action",
                icon: "⚙️",
                title: "Sérialisation Compacte du Candidat & Sélection SQL",
                subtitle: "Extraction du cursus 3iL et des 15 offres actives",
                layer: "Module IA (recommandation.py)",
                file: "offers/recommandation.py:L45",
                fromFile: "templates/offers/liste_offres.html",
                toFile: "offers/recommandation.py",
                latency: "25 ms",
                nature: "TREATMENT",
                natureLabel: "SÉRIALISATION DU CANDIDAT",
                natureColor: "#6366f1",
                whatHappened: "Extraction des compétences, expériences et du cursus 3iL de l'étudiant pour construire un profil JSON compact.",
                stateChange: "Objet JSON candidat structuré prêt pour l'inférence.",
                payload: "{'etudiant': 'Lina Martin', 'cursus': 'Ingénieur 4e', 'competences': ['Python', 'Django', 'Docker']}",
                code: `profil_resume = extraire_donnees_candidat(profil)
offres_candidates = OffreStage.objects.filter(est_active=True)[:15]`,
                sql: "SELECT * FROM offers_offrestage WHERE est_active = TRUE LIMIT 15;",
                oralTip: "Limiter les tokens envoyés au prompt permet de réduire la latence et d'optimiser les coûts d'API.",
                whyCritical: "Optimisation de la consommation de jetons et respect des limites de contexte."
            },
            {
                id: "ia_3",
                stepNum: 3,
                type: "action",
                icon: "⚡",
                title: "Inférence LPUs Groq Cloud (LLaMA 3.1 70B)",
                subtitle: "Vitesse d'exécution >300 tokens/seconde avec JSON strict",
                layer: "Processeurs LPUs Groq",
                file: "offers/recommandation.py:L88",
                fromFile: "offers/recommandation.py",
                toFile: "API Groq LPUs Cloud",
                latency: "190 ms",
                nature: "TREATMENT",
                natureLabel: "INFÉRENCE GROQ",
                natureColor: "#8b5cf6",
                whatHappened: "Envoi du prompt au modèle LLaMA 3.1 70B via les puces LPUs de Groq avec temperature=0.1 et format JSON strict.",
                stateChange: "Réponse JSON reçue : identifiants d'offres sélectionnés avec scores de pertinence.",
                payload: "Modèle: llama-3.1-70b-versatile | Response: {'recommandations': [{'id': 1, 'score': 95}, {'id': 2, 'score': 88}]}",
                code: `reponse = client.chat.completions.create(
    model='llama-3.1-70b-versatile',
    messages=messages,
    response_format={'type': 'json_object'}
)`,
                sql: null,
                oralTip: "La vitesse des processeurs LPUs de Groq (plus de 300 tokens/s) permet une inférence imperceptible pour l'utilisateur.",
                whyCritical: "Permet une expérience utilisateur interactive sans temps de latence rédhibitoire."
            },
            {
                id: "ia_4",
                stepNum: 4,
                type: "decision",
                icon: "🛡️",
                title: "Barrière de Sécurité Anti-Hallucination SQL",
                subtitle: "Validation stricte : chaque identifiant retourné doit exister en base",
                layer: "Whitelist de Sécurité (Python)",
                file: "offers/recommandation.py:L115",
                fromFile: "API Groq LPUs Cloud",
                toFile: "offers/recommandation.py",
                latency: "205 ms",
                nature: "VERIFICATION",
                natureLabel: "CONTRÔLE ANTI-HALLUCINATION",
                natureColor: "#38bdf8",
                condition: "set(ids_recommandes).issubset(ids_valides_bdd)",
                branchIf: {
                    label: "✓ SI CERTIFIÉ (TRUE)",
                    desc: "Les identifiants 1 et 2 existent réellement en base ➔ Injection des badges",
                    target: "ia_5"
                },
                branchElse: {
                    label: "✗ SI HALLUCINATION (ELSE)",
                    desc: "IDs fictifs ou obsolètes retournés par l'IA ➔ Purgés immédiatement sans polluer la vue",
                    target: "ia_err_halluc"
                },
                elseNode: {
                    id: "ia_err_halluc",
                    title: "Filtrage des Identifiants Fictifs",
                    badge: "Anti-Hallucination",
                    desc: "Toute suggestion de stage n'ayant pas de correspondance stricte en base SQL est éliminée silencieusement.",
                    code: `ids_valides = set(OffreStage.objects.filter(id__in=ids_recommandes, est_active=True).values_list('id', flat=True))\noffres_retenues = [o for o in offres_candidates if o.id in ids_valides]`
                },
                whatHappened: "Le serveur exécute une requête SQL pour vérifier que tous les identifiants retournés par l'IA correspondent bien à des offres actives enregistrées dans la table PostgreSQL.",
                stateChange: "IDs validés : [1, 2]. Toute suggestion invalide ou fictive est rejetée.",
                payload: "IDs reçus: [1, 2, 999] ➔ IDs certifiés en base: [1, 2]",
                code: `ids_recommandes = [item['id'] for item in data.get('recommandations', [])]
ids_valides = set(OffreStage.objects.filter(id__in=ids_recommandes, est_active=True).values_list('id', flat=True))
offres_retenues = [o for o in offres_candidates if o.id in ids_valides]`,
                sql: "SELECT id FROM offers_offrestage WHERE id IN (1, 2) AND est_active = TRUE;",
                oralTip: "Le serveur n'accepte aucun texte arbitraire de l'IA, seulement des IDs validés par la base de données SQL.",
                whyCritical: "Règle de sécurité absolue : ne jamais faire confiance aux sorties d'un LLM sans validation déterministe."
            },
            {
                id: "ia_5",
                stepNum: 5,
                type: "fork",
                icon: "⚡",
                title: "Enrichissement & Ordonnancement du Contexte",
                subtitle: "Calcul des scores, injection des badges et tri contextuel",
                layer: "Contrôleur de Vue (views.py)",
                file: "offers/views.py:L170",
                fromFile: "offers/recommandation.py",
                toFile: "offers/views.py",
                latency: "215 ms",
                nature: "VALUE_CHANGE",
                natureLabel: "ANNOTATION & TRI DU CONTEXTE",
                natureColor: "#10b981",
                parallelTasks: [
                    {
                        id: "ia_p1",
                        badge: "Score IA",
                        title: "Attribution des scores de compatibilité",
                        desc: "Association des scores calculés par Groq (ex: 95% Thales, 88% Capgemini).",
                        sql: null,
                        code: `for offre in offres_retenues: offre.score_ia = scores_map.get(offre.id, 80)`
                    },
                    {
                        id: "ia_p2",
                        badge: "Badging",
                        title: "Génération des badges '★ Recommandé par l'IA'",
                        desc: "Marquage visuel des cartes pour attirer immédiatement l'attention du candidat.",
                        sql: null,
                        code: `offre.est_recommandee = True`
                    },
                    {
                        id: "ia_p3",
                        badge: "Tri Prioritaire",
                        title: "Remontée en tête de liste",
                        desc: "Ordonnancement du catalogue pour placer les offres pertinentes en position 1 et 2.",
                        sql: null,
                        code: `context['offres'] = offres_retenues + [o for o in autres_offres]`
                    }
                ],
                whatHappened: "Le contrôleur annote les objets OffreStage en mémoire vive avec leur score de pertinence et leur badge visuel, puis les ordonne en tête de liste.",
                stateChange: "Contexte de gabarit enrichi avec les 2 offres prioritaires annotées.",
                payload: "context['offres_ia'] = [Offre #1 (Thales), Offre #2 (Capgemini)]",
                code: `context['offres_recommandees'] = offres_retenues
return render(request, 'offers/liste_offres.html', context)`,
                sql: null,
                oralTip: "L'étudiant repère en 1 coup d'œil les stages qui valorisent le mieux son profil.",
                whyCritical: "Augmente significativement le taux d'acceptation des candidatures étudiantes."
            },
            {
                id: "ia_6",
                stepNum: 6,
                type: "end",
                icon: "📦",
                title: "Rendu HTML des Cartes avec Badges d'IA",
                subtitle: "Affichage des cartes enrichies dans le navigateur de l'élève",
                layer: "Moteur de Gabarits Django (MVT)",
                file: "templates/offers/liste_offres.html:L230",
                fromFile: "offers/views.py",
                toFile: "templates/offers/liste_offres.html",
                latency: "220 ms",
                nature: "RESPONSE",
                natureLabel: "RENDU VISUEL DES CARTES",
                natureColor: "#0ea5e9",
                whatHappened: "Rendu HTML complet des cartes d'offres ordonnées avec badge de pertinence.",
                stateChange: "Affichage des cartes enrichies avec argumentaire IA dans le navigateur.",
                payload: "HTTP/1.1 200 OK | Content-Type: text/html",
                code: `{% if offre in offres_recommandees %}
    <span class="badge-status-pill badge-cand-accepted">★ Recommandé par l'IA</span>
{% endif %}`,
                sql: null,
                oralTip: "La séparation stricte Modèle-Vue-Template permet de modifier la présentation sans toucher au moteur IA.",
                whyCritical: "Architecture découplée facilitant les évolutions d'interface."
            }
        ]
    },

    "sync_jsearch": {
        id: "sync_jsearch",
        title: "5. Synchronisation des offres externes JSearch (API & Verrou SQL)",
        shortTitle: "Ingestion API RapidAPI & Verrou SQL NOWAIT",
        icon: "🔄",
        method: "POST",
        endpoint: "/offres/sync-jsearch/",
        badge: "Ingestion API & Lock",
        color: "#f59e0b",
        goldColor: "#f59e0b",
        desc: "Ingestion programmée d'annonces de stage en France via l'API OpenWeb Ninja sur RapidAPI. Utilise un verrou exclusif PostgreSQL non bloquant (select_for_update nowait), un contrôle de fraîcheur de 24h, un dédoublonnage par URL et une insertion massive multi-lignes bulk_create.",
        metrics: {
            steps: 6,
            decisions: 2,
            parallelOps: 3,
            latency: "415 ms"
        },
        nodes: [
            {
                id: "sj_1",
                stepNum: 1,
                type: "start",
                icon: "⏱️",
                title: "Déclencheur Périodique ou Clic Administrateur",
                subtitle: "Vérification de l'intervalle de synchronisation minimal",
                layer: "Ordonnanceur ou Vue Déclencheuse",
                file: "offers/views.py:L65",
                fromFile: "Système / Cron",
                toFile: "offers/views.py",
                latency: "5 ms",
                nature: "CHECK",
                natureLabel: "DÉCLENCHEUR TEMPOREL",
                natureColor: "#f59e0b",
                whatHappened: "Contrôle de la date de dernière synchronisation. Si le dernier import date de plus de 24h, la collecte est autorisée.",
                stateChange: "Vérification temporelle : Dernière sync > 24h. Synchronisation requise.",
                payload: "derniere_sync: 2026-10-14 18:00:00 (Delta > 24h)",
                code: `if sync_necessaire():
    lancer_synchronisation()`,
                sql: "SELECT * FROM offers_etatsynchronisation LIMIT 1;",
                oralTip: "Évite de saturer le quota mensuel de l'API externe avec des appels redondants.",
                whyCritical: "Maîtrise des coûts d'API externe et limitation des consommations réseau."
            },
            {
                id: "sj_2",
                stepNum: 2,
                type: "decision",
                icon: "🔒",
                title: "Acquisition du Verrou SQL Exclusif NOWAIT",
                subtitle: "select_for_update(nowait=True) pour bloquer les doubles exécutions",
                layer: "ORM & Base SQL (select_for_update nowait)",
                file: "offers/jsearch.py:L35",
                fromFile: "offers/views.py",
                toFile: "offers/jsearch.py",
                latency: "15 ms",
                nature: "VERIFICATION",
                natureLabel: "VERROU EXCLUSIF NON BLOQUANT",
                natureColor: "#38bdf8",
                condition: "etat = select_for_update(nowait=True).get()",
                branchIf: {
                    label: "✓ VERROU ACQUIS (TRUE)",
                    desc: "Aucun autre worker ne synchronise actuellement ➔ Statut de processus maître accordé",
                    target: "sj_3"
                },
                branchElse: {
                    label: "✗ VERROU OCCUPÉ (ELSE)",
                    desc: "Un worker synchronise déjà ➔ Échec immédiat sans freeze des threads serveurs",
                    target: "sj_err_lock"
                },
                elseNode: {
                    id: "sj_err_lock",
                    title: "Synchronisation Déjà en Cours (NOWAIT)",
                    badge: "Verrou Actif",
                    desc: "PostgreSQL lève immédiatement OperationalError (Lock not available). Django intercepte l'exception et répond 200 { status: 'already_running' } sans faire attendre l'utilisateur.",
                    code: `try:
    etat = select_for_update(nowait=True).get()
except OperationalError:
    return JsonResponse({'status': 'already_running'})`
                },
                whatHappened: "Acquisition immédiate d'un verrou SQL exclusif 'NOWAIT'. Si un autre processus synchronise déjà, l'appel échoue immédiatement sans bloquer le serveur.",
                stateChange: "Verrou acquis sur EtatSynchronisation [LOCKED EXCLUSIF].",
                payload: "BEGIN TRANSACTION;\nSELECT * FROM offers_etatsynchronisation FOR UPDATE NOWAIT;",
                code: `with transaction.atomic():
    etat = EtatSynchronisation.objects.select_for_update(nowait=True).get()`,
                sql: "SELECT * FROM offers_etatsynchronisation FOR UPDATE NOWAIT;",
                oralTip: "L'instruction 'NOWAIT' prévient tout freeze des threads du serveur web en cas de traitement lourd concurrent.",
                whyCritical: "Résilience d'architecture : élimine les blocages de threads (Starvation)."
            },
            {
                id: "sj_3",
                stepNum: 3,
                type: "action",
                icon: "🌐",
                title: "Appel REST Sécurisé vers RapidAPI JSearch",
                subtitle: "Collecte de 25 offres brutes avec timeout strict de 10s",
                layer: "Réseau HTTP Externe (Python Requests)",
                file: "offers/jsearch.py:L70",
                fromFile: "offers/jsearch.py",
                toFile: "API JSearch (RapidAPI)",
                latency: "350 ms",
                nature: "TREATMENT",
                natureLabel: "APPEL REST VERS RAPIDAPI",
                natureColor: "#6366f1",
                whatHappened: "Envoi d'une requête GET sécurisée vers l'API OpenWeb Ninja avec mot-clé 'stage developpeur france' et timeout strict.",
                stateChange: "Réponse HTTP 200 reçue : 25 annonces brutes de stage en France.",
                payload: "GET https://jsearch.p.rapidapi.com/search?query=stage+developpeur+france | Headers: X-RapidAPI-Key",
                code: `response = requests.get(url, headers=headers, params=params, timeout=10)
data = response.json()`,
                sql: null,
                oralTip: "Le paramètre timeout=10 empêche le serveur de rester bloqué indéfiniment si l'API externe subit une panne.",
                whyCritical: "Pattern Circuit Breaker prévenant l'indisponibilité en cascade."
            },
            {
                id: "sj_4",
                stepNum: 4,
                type: "action",
                icon: "⚙️",
                title: "Filtrage Cursus & Déduplication par URL Source",
                subtitle: "Comparaison ensembliste contre les offres déjà en base",
                layer: "Algorithme de Déduplication (Python)",
                file: "offers/jsearch.py:L110",
                fromFile: "API JSearch",
                toFile: "offers/jsearch.py",
                latency: "375 ms",
                nature: "CHECK",
                natureLabel: "DÉDOUBLONNAGE & FILTRAGE",
                natureColor: "#f59e0b",
                whatHappened: "Filtrage des annonces correspondant au cursus ingénieur et comparaison des URL d'origine avec les offres déjà stockées en base SQL.",
                stateChange: "25 annonces brutes ➔ 7 doublons éliminés, 11 nouvelles offres qualifiées retenues.",
                payload: "11 offres inédites avec entreprise, ville, durée et compétences détectées.",
                code: `existantes = set(OffreStage.objects.filter(url_origine__in=urls).values_list('url_origine', flat=True))
nouvelles = [o for o in parsed if o.url_origine not in existantes]`,
                sql: "SELECT url_origine FROM offers_offrestage WHERE url_origine IN (...);",
                oralTip: "Les offres déjà enregistrées sont conservées intactes pour ne pas briser les candidatures étudiantes déjà liées.",
                whyCritical: "Intégrité des données sans briser les clés étrangères actives."
            },
            {
                id: "sj_5",
                stepNum: 5,
                type: "fork",
                icon: "⚡",
                title: "Ingestion SQL en Masse & Libération du Verrou",
                subtitle: "bulk_create en une seule requête SQL et libération du lock transactionnel",
                layer: "Base de Données SQL (bulk_create)",
                file: "offers/jsearch.py:L140",
                fromFile: "offers/jsearch.py",
                toFile: "offers/models.py & PostgreSQL",
                latency: "410 ms",
                nature: "VALUE_CHANGE",
                natureLabel: "INGESTION SQL EN MASSE",
                natureColor: "#10b981",
                parallelTasks: [
                    {
                        id: "sj_p1",
                        badge: "Bulk INSERT",
                        title: "Insertion groupée de 11 offres",
                        desc: "1 seule requête SQL multi-lignes au lieu de 11 inserts individuels.",
                        sql: "INSERT INTO offers_offrestage (titre, entreprise, ...) VALUES (...), (...);",
                        code: `OffreStage.objects.bulk_create(nouvelles, ignore_conflicts=True)`
                    },
                    {
                        id: "sj_p2",
                        badge: "Timestamp Sync",
                        title: "Actualisation date_derniere_sync",
                        desc: "Enregistrement de l'horodatage de succès pour la règle des 24h.",
                        sql: "UPDATE offers_etatsynchronisation SET date_derniere_sync = NOW();",
                        code: `etat.date_derniere_sync = timezone.now()\netat.save()`
                    },
                    {
                        id: "sj_p3",
                        badge: "Release Lock",
                        title: "COMMIT & Libération du verrou",
                        desc: "Libération du verrou NOWAIT sur la ligne EtatSynchronisation.",
                        sql: "COMMIT;",
                        code: `# Fin du contexte transaction.atomic()`
                    }
                ],
                whatHappened: "Insertion de toutes les nouvelles offres en 1 seule instruction SQL multi-lignes et mise à jour de la date de dernière synchronisation.",
                stateChange: "+11 nouvelles offres créées en base SQL en 1 seule requête | Lock transactionnel libéré.",
                payload: "INSERT INTO offers_offrestage VALUES (11 records)",
                code: `OffreStage.objects.bulk_create(nouvelles, ignore_conflicts=True)
etat.date_derniere_sync = timezone.now()
etat.save()`,
                sql: "INSERT INTO offers_offrestage (titre, entreprise, localisation, duree, date_creation) VALUES (...), (...); COMMIT;",
                oralTip: "'bulk_create' exécute un seul INSERT SQL massif au lieu de 11 requêtes individuelles, divisant le temps d'écriture par 10.",
                whyCritical: "Optimisation majeure de l'empreinte I/O disque sur le serveur de base de données."
            },
            {
                id: "sj_6",
                stepNum: 6,
                type: "end",
                icon: "📦",
                title: "Réponse JSON & Enrichissement Immédiat du Catalogue",
                subtitle: "Mise à disposition instantanée des stages pour les étudiants",
                layer: "Réponse JSON & Catalogue Enrichi",
                file: "offers/views.py:L90",
                fromFile: "offers/models.py",
                toFile: "Navigateur Client Web",
                latency: "415 ms",
                nature: "RESPONSE",
                natureLabel: "FIN & ACTUALISATION DU CATALOGUE",
                natureColor: "#0ea5e9",
                whatHappened: "Fin du processus, libération du verrou et mise à disposition immédiate des nouvelles offres pour les étudiants.",
                stateChange: "Catalogue StagePilot enrichi de 11 offres fraîches.",
                payload: "{'status': 'ok', 'nouvelles_offres': 11}",
                code: `return JsonResponse({'status': 'ok', 'creees': 11})`,
                sql: null,
                oralTip: "La mise à jour est complètement transparente pour les utilisateurs qui bénéficient d'un catalogue continuellement actualisé.",
                whyCritical: "Disponibilité de service sans temps d'arrêt."
            }
        ]
    },

    "marquer_tout_lu": {
        id: "marquer_tout_lu",
        title: "6. Traitement par lot école (Bulk Update SQL sans boucle N+1)",
        shortTitle: "Acquittement par Lot SQL sans boucle Python",
        icon: "⚡",
        method: "POST",
        endpoint: "/ecole/notifications/marquer-tout-lu/",
        badge: "Optimisation BDD École",
        color: "#059669",
        goldColor: "#f59e0b",
        desc: "Le responsable des stages 3iL acquitte toutes ses alertes. Exécute un contrôle d'accès RBAC établissement, puis lance un UPDATE SQL ensembliste direct sans aucune boucle Python, éliminant tout goulet d'étranglement.",
        metrics: {
            steps: 5,
            decisions: 1,
            parallelOps: 3,
            latency: "42 ms"
        },
        nodes: [
            {
                id: "mtl_1",
                stepNum: 1,
                type: "start",
                icon: "🖱️",
                title: "Clic Action Responsable 'Tout marquer comme lu'",
                subtitle: "Acquittement groupé des alertes pédagogiques en attente",
                layer: "Client Web (HTML/JS)",
                file: "templates/schools/notifications.html:L45",
                fromFile: "Navigateur Client Web",
                toFile: "templates/schools/notifications.html",
                latency: "1 ms",
                nature: "CHECK",
                natureLabel: "CLIC ACTION RESPONSABLE",
                natureColor: "#f59e0b",
                whatHappened: "Le responsable des stages clique sur '✓ Tout marquer comme lu (3)'.",
                stateChange: "Émission de la requête POST d'acquittement groupé avec jeton CSRF.",
                payload: "POST /ecole/notifications/marquer-tout-lu/ HTTP/1.1",
                code: `<form method="post" action="{% url 'schools:marquer_tout_lu' %}">
    {% csrf_token %}
    <button type="submit" class="btn-mark-all">✓ Tout marquer comme lu ({{ nb_non_lues }})</button>
</form>`,
                sql: null,
                oralTip: "Un bouton d'action en masse évite à l'administration d'ouvrir chaque alerte une à une.",
                whyCritical: "Efficacité administrative pour les équipes pédagogiques 3iL."
            },
            {
                id: "mtl_2",
                stepNum: 2,
                type: "decision",
                icon: "🛡️",
                title: "Vérification des Droits RBAC Établissement Partenaire",
                subtitle: "Contrôle strict : rôle ÉCOLE et compte validé par l'administrateur",
                layer: "Contrôle d'Accès RBAC",
                file: "accounts/access.py:L30",
                fromFile: "templates/schools/notifications.html",
                toFile: "stagepilot/access.py",
                latency: "15 ms",
                nature: "VERIFICATION",
                natureLabel: "VÉRIFICATION DROITS ÉCOLE",
                natureColor: "#38bdf8",
                condition: "request.user.role == 'ECOLE' && ecole.est_valide",
                branchIf: {
                    label: "✓ SI AUTORISÉ (TRUE)",
                    desc: "Responsable 3iL certifié ➔ Poursuite vers l'action de mise à jour",
                    target: "mtl_3"
                },
                branchElse: {
                    label: "✗ SI REFUSÉ (ELSE)",
                    desc: "Compte non école ou établissement non validé ➔ PermissionDenied HTTP 403",
                    target: "mtl_err_rbac"
                },
                elseNode: {
                    id: "mtl_err_rbac",
                    title: "Accès Refusé aux Fonctions Établissement",
                    badge: "Sécurité RBAC",
                    desc: "Lève une exception PermissionDenied avec réponse HTTP 403. Les étudiants ne peuvent en aucun cas déclencher cette action.",
                    code: `if not etablissement_autorise(request.user):
    raise PermissionDenied("Accès réservé aux établissements partenaires.")`
                },
                whatHappened: "Vérification stricte que l'utilisateur possède le rôle ÉCOLE et que son établissement 3iL est validé par l'administrateur.",
                stateChange: "Droit d'administration école certifié pour 3iL Ingénieurs (Limoges).",
                payload: "user.role == 'ECOLE' | compte_ecole.est_valide == True",
                code: `@login_required
@require_POST
def marquer_tout_lu(request):
    if not etablissement_autorise(request.user):
        raise PermissionDenied("Accès réservé aux établissements partenaires.")`,
                sql: "SELECT * FROM schools_etablissement WHERE utilisateur_id = 4 AND est_valide = TRUE;",
                oralTip: "Lève une exception PermissionDenied (HTTP 403) si un élève essaie d'appeler ce endpoint d'administration.",
                whyCritical: "Cloisonnement hermétique des privilèges multi-rôles."
            },
            {
                id: "mtl_3",
                stepNum: 3,
                type: "action",
                icon: "💾",
                title: "UPDATE SQL Ensembliste Direct (Zéro Boucle N+1)",
                subtitle: "Mise à jour en 1 instruction relationnelle sans boucle Python for",
                layer: "ORM Django & Base SQL",
                file: "schools/views.py:L258",
                fromFile: "schools/urls.py",
                toFile: "schools/models.py & PostgreSQL",
                latency: "35 ms",
                nature: "VALUE_CHANGE",
                natureLabel: "CHANGEMENT DE VALEUR SQL (BULK)",
                natureColor: "#10b981",
                whatHappened: "Exécution directe d'un UPDATE SQL ensembliste sur toutes les notifications non lues de l'établissement sans boucle Python.",
                stateChange: "Mutation BDD : 3 notifications passent de est_lue=False à est_lue=True en 1 commande SQL.",
                payload: "UPDATE schools_notificationecole SET est_lue = true WHERE etablissement_id = 1 AND est_lue = false;",
                code: `NotificationEcole.objects.filter(
    etablissement=ecole, 
    est_lue=False
).update(est_lue=True)`,
                sql: "UPDATE schools_notificationecole SET est_lue = true WHERE etablissement_id = 1 AND est_lue = false;",
                oralTip: "Utiliser .update(est_lue=True) évite le problème 'N+1 queries'. Une boucle for n in notifs: n.save() aurait exécuté 50 requêtes SQL individuelles.",
                whyCritical: "Optimisation de complexité temporelle : passage de O(N) à O(1) requêtes SQL."
            },
            {
                id: "mtl_4",
                stepNum: 4,
                type: "fork",
                icon: "⚡",
                title: "Actualisation Visuelle des Badges & Compteurs",
                subtitle: "Synchronisation de la cloche d'alertes et des statuts des cartes",
                layer: "Client & Serveur",
                file: "templates/schools/notifications.html:L60",
                fromFile: "schools/views.py",
                toFile: "templates/schools/notifications.html",
                latency: "40 ms",
                nature: "VALUE_CHANGE",
                natureLabel: "SYNCHRONISATION INTERFACE",
                natureColor: "#10b981",
                parallelTasks: [
                    {
                        id: "mtl_p1",
                        badge: "Cloche Navbar",
                        title: "Mise à zéro de la cloche",
                        desc: "Le badge rouge de notifications non lues passe instantanément de 3 à 0.",
                        sql: null,
                        code: `document.getElementById('nb_notif_badge').textContent = '0'`
                    },
                    {
                        id: "mtl_p2",
                        badge: "Statut Cartes",
                        title: "Conversion des badges 'Non lue' en 'Lue'",
                        desc: "Toutes les cartes d'alertes prennent le statut visuel acquitté.",
                        sql: null,
                        code: `item.classList.remove('non-lue'); item.classList.add('lue')`
                    },
                    {
                        id: "mtl_p3",
                        badge: "Audit & Cache",
                        title: "Horodatage d'acquittement & Invalidation Cache",
                        desc: "Enregistrement de la date de lecture dans le journal d'audit et purge du cache des alertes non lues.",
                        sql: "UPDATE schools_notificationecole SET date_lecture = NOW() WHERE etablissement_id = 1 AND est_lue = TRUE;",
                        code: `NotificationEcole.objects.filter(etablissement_id=1).update(date_lecture=timezone.now())`
                    }
                ],
                whatHappened: "Le contrôleur et le template synchronisent instantanément les compteurs : 1) La cloche de navbar repasse à 0, 2) Les badges de statut passent à 'Lue', et 3) L'horodatage d'acquittement SQL est persistant avec purge du cache de session.",
                stateChange: "Cloche : 3 ➔ 0 | Badges 'Lue' activés | date_lecture = NOW() inscrite en base PostgreSQL.",
                payload: "Compteur cloche = 0 | Cartes acquittées | Horodatage SQL persisté",
                code: `context['nb_non_lues'] = 0
NotificationEcole.objects.filter(etablissement_id=1).update(date_lecture=timezone.now())`,
                sql: "UPDATE schools_notificationecole SET date_lecture = NOW() WHERE etablissement_id = 1 AND est_lue = TRUE;",
                oralTip: "L'acquittement simultané en base et dans le DOM garantit qu'un rechargement de page ne réaffichera pas les alertes périmées.",
                whyCritical: "Expérience utilisateur temps réel sans friction et traçabilité réglementaire de la lecture des alertes."
            },
            {
                id: "mtl_5",
                stepNum: 5,
                type: "end",
                icon: "📦",
                title: "Réponse HTTP PRG & Message Flash Succès",
                subtitle: "Redirection propre sans risque de renvoi accidentel",
                layer: "Réponse HTTP",
                file: "schools/views.py:L268",
                fromFile: "schools/views.py",
                toFile: "templates/schools/notifications.html",
                latency: "42 ms",
                nature: "RESPONSE",
                natureLabel: "RÉPONSE & REDIRECTION",
                natureColor: "#0ea5e9",
                whatHappened: "Redirection vers le centre de notifications avec toast vert d'acquittement groupé.",
                stateChange: "Affichage de la page de notifications avec 0 alerte en attente.",
                payload: "HTTP 302 Found ➔ GET /ecole/notifications/ (200 OK)",
                code: `messages.success(request, "Toutes les alertes ont été marquées comme lues.")
return redirect("schools:notifications")`,
                sql: null,
                oralTip: "Le pattern Post-Redirect-Get assure la conformité HTTP après soumission POST.",
                whyCritical: "Prévention des doubles soumissions."
            }
        ]
    }
};

// Fusion automatique avec APP_DATA si déjà chargé
if (typeof window.APP_DATA !== "undefined") {
    window.APP_DATA.simulationTrees = window.SIMULATION_TREES;
}


// =============================================================================
// ENRICHISSEMENT SÉMANTIQUE & ANALOGIES DU MONDE RÉEL (POUR TOUS LES NŒUDS)
// =============================================================================
window.SIMULATION_ENRICHMENT = {
    "cs_1": {
        "humanAnalogy": {
            "title": "Signature d'acte chez le notaire",
            "analogy": "C'est exactement comme signer l'achat d'un appartement chez le notaire : avant d'apposer votre signature définitive sur l'acte officiel, le notaire vous demande obligatoirement votre pièce d'identité et votre code secret pour prouver que personne n'usurpe votre identité.",
            "realImpact": "Empêche qu'un camarade de promo ou un individu malveillant sur un ordinateur resté allumé ne valide un contrat de stage à votre place."
        },
        "why": "Un engagement contractuel de stage officiel est irréversible et engage la responsabilité juridique de l'étudiant, de l'entreprise Thales et de l'école 3iL. Un simple clic de souris peut être involontaire ; exiger une ré-authentification par mot de passe transforme ce geste en un consentement délibéré et opposable en droit (recommandation stricte OWASP).",
        "how": "L'interface web ouvre une boîte modale sécurisée interceptant l'action. Le formulaire capture le mot de passe masqué, génère le jeton cryptographique anti-falsification CSRF HMAC et soumet une requête POST chiffrée en HTTPS TLS 1.3 vers le contrôleur Django.",
        "when": "Point zéro de la transaction : instant précis où l'étudiante clique sur 'Valider définitivement mon stage' dans son tableau de bord.",
        "techUsed": [
            "HTML5 Dialog Modal",
            "Jeton CSRF HMAC-SHA256",
            "Requête POST Chiffrée",
            "HTTPS TLS 1.3"
        ]
    },
    "cs_2": {
        "humanAnalogy": {
            "title": "Contrôle des passeports à la douane de l'aéroport",
            "analogy": "C'est comme les agents de sécurité à l'entrée d'un aéroport : ils vérifient la validité de votre passeport biométrique et scannent votre billet avant même de vous laisser approcher du terminal des avions.",
            "realImpact": "Bloque net toute tentative d'attaque où un site web tiers essaierait d'envoyer des ordres secrets dans votre dos."
        },
        "why": "Sans ce filtre préalable, une attaque de type CSRF (Cross-Site Request Forgery) permettrait à un site malveillant que vous visitez d'envoyer une requête fantôme à StagePilot pour valider un stage à votre insu en réutilisant vos cookies actifs.",
        "how": "Le middleware 'CsrfViewMiddleware' compare le jeton soumis avec le cookie chiffré en mémoire. Ensuite, 'AuthenticationMiddleware' interroge la table 'django_session' pour attacher l'objet utilisateur certifié (Lina Martin, ID 14) à l'objet 'request'.",
        "when": "Phase pré-vue : tout premier point d'entrée sur le serveur Django, exécuté avant même d'atteindre la première ligne de code de la vue métier.",
        "techUsed": [
            "Django Middleware Pipeline",
            "Double Submit Cookie Pattern",
            "Session Store Django",
            "Contrôle OWASP Top 10"
        ]
    },
    "cs_3": {
        "humanAnalogy": {
            "title": "Aiguillage de train vers la bonne voie de triage",
            "analogy": "C'est comme l'aiguilleur d'une gare qui vérifie qu'un wagon est bien étiqueté avec un numéro de voie valide avant de commuter les rails pour l'envoyer au bon quai de déchargement.",
            "realImpact": "Si un pirate essaie d'injecter du texte malveillant ou des scripts dans l'adresse du site, le serveur l'arrête net sans toucher à la base de données."
        },
        "why": "Garantit le typage strict des paramètres d'URL et neutralise les attaques par traversée de répertoires (Path Traversal) ou injection SQL par l'URL en amont de la logique métier.",
        "how": "Le routeur d'URL de Django utilise le convertisseur typé '<int:pk>' avec expression régulière compilée. Il extrait '1', vérifie que ce sont des chiffres, le caste en entier Python natif et le transmet en argument nommé 'pk' à la vue 'confirmer_stage'.",
        "when": "Phase de résolution d'URL (URL Resolution) juste après la traversée des middlewares globaux.",
        "techUsed": [
            "Django URLConf",
            "Type Converters (<int:pk>)",
            "Regex URL Dispatcher",
            "Casting d'Arguments Python"
        ]
    },
    "cs_4": {
        "humanAnalogy": {
            "title": "Comparaison d'empreinte digitale dans un coffre-fort",
            "analogy": "C'est comme un coffre-fort électronique qui ne conserve jamais votre vrai code en clair, mais applique une formule mathématique ultra-complexe pour vérifier si l'empreinte calculée correspond au millimètre près à celle enregistrée à la création.",
            "realImpact": "Même si des pirates dérobaient l'intégralité de la base de données de l'école, ils ne pourraient jamais lire votre mot de passe en clair."
        },
        "why": "Conformité cryptographique aux règles ANSSI. La méthode 'check_password' compare les hachages en temps constant ('constant_time_compare'), empêchant les attaquants de deviner le mot de passe en mesurant les nanosecondes d'exécution (Timing Attacks).",
        "how": "Django extrait le sel aléatoire stocké avec l'utilisateur et calcule le hachage PBKDF2 avec 720 000 itérations de HMAC-SHA256 sur la saisie, puis effectue une comparaison sécurisée en mémoire vive.",
        "when": "Première instruction de la vue 'confirmer_stage()' après réception du payload POST.",
        "techUsed": [
            "PBKDF2-SHA256 (720 000 itérations)",
            "Sel Cryptographique Aléatoire",
            "Comparaison en Temps Constant",
            "Norme ANSSI / OWASP"
        ]
    },
    "cs_5": {
        "humanAnalogy": {
            "title": "Cadenas exclusif sur le dernier siège d'avion",
            "analogy": "C'est comme réserver le dernier siège d'un vol sur une borne : le système pose un cadenas temporaire sur ce siège pendant 15 secondes pour qu'aucun autre voyageur dans le monde ne puisse l'acheter à la même milliseconde.",
            "realImpact": "Même si l'étudiant clique frénétiquement deux fois très vite sur le bouton, le système ne créera jamais deux contrats contradictoires."
        },
        "why": "Résout le problème critique de concurrence concurrente (Race Condition). Sans ce verrou, deux requêtes arrivant à la même milliseconde pourraient lire simultanément l'état 'non confirmé' et créer des incohérences contractuelles graves.",
        "how": "Le gestionnaire de contexte 'with transaction.atomic()' ouvre une transaction PostgreSQL ACID. La méthode ORM '.select_for_update()' génère la clause SQL 'FOR UPDATE' qui bloque la ligne dans la table 'applications_candidature' jusqu'au COMMIT.",
        "when": "Immédiatement après authentification réussie, avant d'effectuer la moindre écriture en base de données.",
        "techUsed": [
            "PostgreSQL Row-Level Locking (FOR UPDATE)",
            "Django transaction.atomic()",
            "Isolation ACID Stricte (MVCC)",
            "Prévention Race Conditions"
        ]
    },
    "cs_6": {
        "humanAnalogy": {
            "title": "Orchestre symphonique jouant 3 partitions simultanément",
            "analogy": "C'est comme un notaire qui, d'un seul geste coordonné, résilie votre ancien bail, active votre nouveau titre de propriété et envoie l'acte tamponné au cadastre municipal sans aucun décalage.",
            "realImpact": "Garantit que l'école est prévenue dans la seconde et que vos anciens vœux de stage sont proprement nettoyés."
        },
        "why": "L'unicité du stage officiel est obligatoire selon le règlement 3iL pour des impératifs d'assurance civile et d'encadrement pédagogique.",
        "how": "À l'intérieur de la transaction protégée, 3 opérations SQL sont exécutées en cascade cohérente : UPDATE d'invalidation des anciens stages confirmés, UPDATE d'activation du nouveau contrat, et INSERT de la notification pour le tuteur 3iL.",
        "when": "Cœur de la transaction SQL (Phase de mutation concurrente en base).",
        "techUsed": [
            "PostgreSQL Multi-Tables Mutations",
            "Transactions Concurrentes ACID",
            "Journalisation d'Événements Métier",
            "Intégrité Référentielle"
        ]
    },
    "cs_p1": {
        "humanAnalogy": {
            "title": "Résiliation automatique des anciens baux de location",
            "analogy": "Comme résilier automatiquement vos anciennes promesses de location dès l'instant où vous signez le bail définitif officiel.",
            "realImpact": "Garantit qu'un étudiant ne se retrouve jamais avec deux entreprises qui croient toutes deux l'avoir recruté."
        },
        "why": "Assure l'unicité de l'engagement officiel et évite les litiges avec d'autres entreprises ayant déposé des offres.",
        "how": "Exécution d'un UPDATE conditionnel sur la table des candidatures ciblant l'étudiant 14 pour basculer 'stage_confirme' de TRUE à FALSE sur les autres dossiers.",
        "when": "Première branche de l'embranchement Fork.",
        "techUsed": [
            "PostgreSQL UPDATE Conditionnel",
            "Verrouillage Ligne Exclusif",
            "Cohérence Multi-Dossiers"
        ]
    },
    "cs_p2": {
        "humanAnalogy": {
            "title": "Apposition du cachet officiel 'VALIDÉ & DÉFINITIF'",
            "analogy": "Comme apposer le cachet de cire rouge officiel sur le contrat original conservé au coffre-fort de l'entreprise.",
            "realImpact": "Le stage chez Thales Limoges est désormais scellé et juridiquement valide."
        },
        "why": "Matérialise l'accord bilatéral étudiant-entreprise opposable devant la commission des stages 3iL.",
        "how": "Modification du champ booléen 'stage_confirme = True' avec méthode 'save(update_fields=[\"stage_confirme\"])' pour optimiser la requête SQL.",
        "when": "Deuxième branche de l'embranchement Fork.",
        "techUsed": [
            "Django ORM update_fields",
            "PostgreSQL Boolean Mutation",
            "Persistance Atomique"
        ]
    },
    "cs_p3": {
        "humanAnalogy": {
            "title": "Télégramme prioritaire expédié au secrétariat de l'école",
            "analogy": "Comme envoyer un coursier express à la scolarité de 3iL pour leur remettre la fiche de stage afin qu'ils impriment la convention tripartite.",
            "realImpact": "Permet aux équipes administratives de 3iL d'éditer la convention de stage sans attendre que l'étudiant vienne les voir."
        },
        "why": "L'école doit être informée en temps réel pour déclencher l'attribution du tuteur enseignant et la validation d'assurance.",
        "how": "INSERT SQL dans la table 'schools_notificationecole' avec type 'CONFIRMATION', statut non-lu et horodatage 'NOW()'.",
        "when": "Troisième branche de l'embranchement Fork.",
        "techUsed": [
            "PostgreSQL INSERT Transactionnel",
            "Horodatage NOW()",
            "Table d'Audit Pédagogique"
        ]
    },
    "cs_7": {
        "humanAnalogy": {
            "title": "Fermeture et scellement du grand livre notarié",
            "analogy": "C'est comme le greffier qui ferme le registre officiel, pose le sceau de l'État sur la serrure et range le registre dans l'armoire blindée : plus rien ne peut être altéré.",
            "realImpact": "Toutes les modifications sont définitivement sauvegardées sur le disque dur ; aucune panne électrique ne peut corrompre le résultat."
        },
        "why": "Propriété de Durabilité (D de ACID) et fin d'atomicité : tous les changements deviennent visibles pour tous les autres utilisateurs simultanément.",
        "how": "Django émet l'ordre SQL 'COMMIT;' vers PostgreSQL. Le moteur de base de données écrit les pages mémoires dans le journal de transaction WAL (Write-Ahead Logging) et libère tous les verrous de ligne.",
        "when": "Sortie du bloc 'with transaction.atomic()', immédiatement après la fin des mutations parallèles.",
        "techUsed": [
            "SQL Instruction COMMIT",
            "PostgreSQL WAL (Write-Ahead Logging)",
            "Libération Verrous Concurrence",
            "Garantie ACID"
        ]
    },
    "cs_8": {
        "humanAnalogy": {
            "title": "Récépissé remis en main propre et sortie du guichet",
            "analogy": "C'est comme recevoir votre reçu papier tamponné au guichet de la préfecture, avant d'être guidé vers la porte de sortie avec le sourire.",
            "realImpact": "Si vous appuyez sur F5 pour actualiser votre navigateur, celui-ci ne ré-exécutera jamais la commande et n'enverra aucun message d'erreur."
        },
        "why": "Le pattern Post-Redirect-Get (PRG) est une bonne pratique web fondamentale qui protège l'application contre les doubles soumissions accidentelles de formulaires.",
        "how": "La vue renvoie une réponse HTTP 302 Found avec l'en-tête 'Location: /candidatures/' et stocke un message flash 'Stage confirmé avec succès' dans les cookies de session utilisateur.",
        "when": "Dernière étape du cycle de traitement serveur, renvoyée au navigateur client.",
        "techUsed": [
            "HTTP 302 Found (Redirection)",
            "Pattern Post-Redirect-Get (PRG)",
            "Django Messages Framework",
            "Nettoyage Session Temporaire"
        ]
    },
    "ps_1": {
        "humanAnalogy": {
            "title": "Choix de l'enveloppe et du CV avant de poster",
            "analogy": "Comme choisir dans votre classeur si vous envoyez votre CV standard ou votre CV personnalisé spécialisé pour cette offre avant de glisser la feuille dans l'enveloppe.",
            "realImpact": "Permet au candidat de choisir la version de son CV la plus percutante pour convaincre le recruteur de Thales."
        },
        "why": "Offre à l'étudiant la liberté stratégique d'adapter son profil tout en garantissant une traçabilité claire du document sélectionné.",
        "how": "Le formulaire HTML5 propose un sélecteur 'cv_choisi' (Principal vs Adapté). Au clic, le navigateur prépare la soumission POST avec jeton CSRF.",
        "when": "Point zéro de la candidature, action initiale de l'étudiant dans l'interface de détail d'offre.",
        "techUsed": [
            "HTML5 Select Form",
            "Jeton CSRF",
            "Saisie Utilisateur",
            "Interface Responsive"
        ]
    },
    "ps_2": {
        "humanAnalogy": {
            "title": "Inspection du cachet de sécurité sur l'enveloppe",
            "analogy": "Comme le facteur qui s'assure que le cachet postal de sécurité n'a pas été déchiré ou imité avant d'acheminer le courrier.",
            "realImpact": "Empêche les sites pirates d'injecter des candidatures frauduleuses dans votre dos."
        },
        "why": "Validation préventive de la légitimité de la requête et de l'authenticité de la session étudiante active.",
        "how": "Contrôle cryptographique du jeton HMAC par 'CsrfViewMiddleware' et vérification des permissions par 'AuthenticationMiddleware'.",
        "when": "Phase pré-contrôleur lors de l'arrivée du paquet HTTP sur le serveur.",
        "techUsed": [
            "CsrfViewMiddleware",
            "AuthenticationMiddleware",
            "Cookie HMAC",
            "Sécurité Périmétrique"
        ]
    },
    "ps_3": {
        "humanAnalogy": {
            "title": "Transmission du courrier au bureau du recrutement",
            "analogy": "Comme le service du courrier interne qui dépose la lettre directement sur le bureau du responsable des candidatures de l'entreprise ciblée.",
            "realImpact": "Assure que la candidature arrive exactement dans la bonne fonction du serveur avec l'identifiant de l'offre Thales."
        },
        "why": "Associe dynamiquement l'URL '/offres/1/postuler/' à la vue Python métier correspondante avec cast de la clé primaire en entier.",
        "how": "Le résolveur d'URL Django décode le slug et transmet 'pk=1' en argument typé à 'applications.views.postuler_offre'.",
        "when": "Routage interne après passage des filtres de sécurité.",
        "techUsed": [
            "Django URL Dispatcher",
            "Résolution Regex",
            "Injection de Dépendances"
        ]
    },
    "ps_4": {
        "humanAnalogy": {
            "title": "Contrôle de la liste d'émargement anti-doublon",
            "analogy": "Comme l'hôtesse d'accueil d'un salon de recrutement qui vérifie sur sa tablette que vous n'avez pas déjà déposé votre CV sur ce stand 1 heure plus tôt.",
            "realImpact": "Évite d'envoyer 5 fois la même candidature par inadvertance, ce qui agacerait le recruteur et fausserait les statistiques."
        },
        "why": "Protège l'intégrité de la base et respecte la contrainte d'unicité métier ('unique_together' sur étudiant + offre).",
        "how": "Exécution d'une requête SQL optimisée 'SELECT 1 ... LIMIT 1' via l'ORM Django 'Candidature.objects.filter(...).exists()'. Si elle existe, redirection avec message d'avertissement.",
        "when": "Au début de la vue Python, avant toute tentative d'écriture en base.",
        "techUsed": [
            "Django QuerySet exists()",
            "Requête SQL SELECT 1 LIMIT 1",
            "Contrainte Unique SQL"
        ]
    },
    "ps_5": {
        "humanAnalogy": {
            "title": "Création officielle du dossier candidat dans l'armoire",
            "analogy": "Comme ouvrir une nouvelle chemise cartonnée avec votre nom, y coller le numéro de dossier #88 et la ranger dans le tiroir 'Candidatures reçues'.",
            "realImpact": "Votre candidature est officiellement enregistrée et visible par le service des ressources humaines de Thales."
        },
        "why": "Crée l'enregistrement SQL persistant pivot associant l'étudiant, l'offre et l'horodatage officiel de soumission.",
        "how": "L'instruction ORM 'Candidature.objects.create()' compile et exécute une commande SQL 'INSERT INTO applications_candidature' avec statut 'ENVOYEE'.",
        "when": "Cœur transactionnel de la vue, suite au passage réussi du contrôle anti-doublon.",
        "techUsed": [
            "Django ORM create()",
            "PostgreSQL INSERT",
            "Horodatage NOW()",
            "Statut Enum"
        ]
    },
    "ps_6": {
        "humanAnalogy": {
            "title": "Photocopie certifiée conforme rangée au coffre-fort cloud",
            "analogy": "Comme faire une photocopie certifiée conforme de votre CV papier et la sceller dans un coffre-fort d'archives cloud : même si vous modifiez votre profil demain, le recruteur aura toujours la version exacte du jour du dépôt.",
            "realImpact": "Garantit la preuve juridique de ce que vous avez réellement envoyé le jour de votre candidature."
        },
        "why": "Principe fondamental de non-répudiation et intégrité documentaire temporelle. Si l'étudiant met à jour son CV la semaine prochaine, la candidature passée doit conserver son historique immuable.",
        "how": "Le service extrait le PDF, génère un nom de fichier horodaté unique, téléverse le binaire dans le bucket cloud privé Supabase Storage (S3 API), met à jour l'URI dans la ligne SQL et incrémente le compteur de l'offre.",
        "when": "Tâche concomitante post-création de la candidature.",
        "techUsed": [
            "Supabase Cloud Storage (S3 API)",
            "Bucket Privé Sécurisé",
            "Stockage Immuable de Documents",
            "Incrémentation Atomique F()"
        ]
    },
    "ps_p1": {
        "humanAnalogy": {
            "title": "Dépôt de la copie certifiée dans le coffre Supabase",
            "analogy": "Comme déposer la photocopie scellée dans le casier cloud haute sécurité de l'école.",
            "realImpact": "Le fichier PDF est sauvegardé dans un espace cloud sécurisé inaccessible au grand public."
        },
        "why": "Garantit que le fichier binaire est dupliqué et conservé indépendamment des futures modifications du profil.",
        "how": "Appel de la fonction 'dupliquer_pdf_pour_candidature()' qui téléverse les octets vers le bucket 'stagepilot-cv/candidatures/14/'.",
        "when": "Branche Cloud Storage du fork.",
        "techUsed": [
            "Supabase Storage REST API",
            "Binaire Vectoriel PDF",
            "Bucket Privé"
        ]
    },
    "ps_p2": {
        "humanAnalogy": {
            "title": "Enregistrement de l'adresse du coffre sur la chemise cartonnée",
            "analogy": "Comme écrire au feutre l'emplacement exact du casier cloud sur le dossier de candidature.",
            "realImpact": "Permet au bouton 'Consulter le CV' du recruteur de pointer directement sur le bon document."
        },
        "why": "Relie la ligne de candidature SQL à l'emplacement physique du document dans le cloud.",
        "how": "UPDATE SQL ciblé sur 'copie_cv' avec chemin 'candidatures/14/cv_offre_1_copie.pdf'.",
        "when": "Branche SQL Update du fork.",
        "techUsed": [
            "PostgreSQL UPDATE",
            "URI Immuable",
            "Champ FileField Django"
        ]
    },
    "ps_p3": {
        "humanAnalogy": {
            "title": "Tour de molette du compteur de candidatures de l'offre",
            "analogy": "Comme tourner d'un cran le compteur mécanique à l'entrée du stand pour indiquer qu'un nouveau candidat a postulé.",
            "realImpact": "L'entreprise voit instantanément le nombre de candidatures passer de 12 à 13."
        },
        "why": "Fournit aux recruteurs et à l'école des métriques instantanées sans recalculer un coûteux 'COUNT(*)' à chaque visite.",
        "how": "Exécution d'une expression atomique ORM 'F(\"nb_candidatures\") + 1' qui effectue l'addition directement dans le moteur SQL PostgreSQL.",
        "when": "Branche Statistiques du fork.",
        "techUsed": [
            "Django F() Expression",
            "Incrément Atomique SQL",
            "Performance Indexée"
        ]
    },
    "ps_7": {
        "humanAnalogy": {
            "title": "Récépissé vert de confirmation et retour à vos candidatures",
            "analogy": "Comme recevoir un sms de confirmation : 'Votre candidature pour Thales a bien été remise au recruteur', tout en étant redirigé sur votre espace de suivi.",
            "realImpact": "Vous voyez immédiatement votre nouvelle candidature apparaître en tête de liste avec le badge 'ENVOYÉE'."
        },
        "why": "Applique le pattern PRG pour éviter qu'un rechargement de page ne renvoie la candidature une deuxième fois.",
        "how": "Réponse HTTP 302 Found avec redirection vers 'applications:mes_candidatures' et toast flash vert.",
        "when": "Conclusion de la requête et affichage dans le navigateur.",
        "techUsed": [
            "HTTP 302 Redirect",
            "Pattern PRG",
            "Toast Notifications",
            "Rendu Dynamique DOM"
        ]
    },
    "gcv_1": {
        "humanAnalogy": {
            "title": "Demande d'impression à la borne automatique",
            "analogy": "Comme appuyer sur le bouton vert 'Imprimer mon dossier officiel' sur une borne automatique à l'accueil de l'école.",
            "realImpact": "Déclenche le processus de fabrication sur-mesure de votre CV officiel haute définition."
        },
        "why": "Permet à l'étudiant de générer à tout moment un document PDF conforme aux standards graphiques de l'école 3iL.",
        "how": "Le navigateur envoie une requête HTTP POST ou GET avec jeton de session vers l'endpoint de génération.",
        "when": "Déclencheur initial de la génération documentaire.",
        "techUsed": [
            "Événement Click Client",
            "Requête HTTP Asynchrone",
            "Session Active"
        ]
    },
    "gcv_2": {
        "humanAnalogy": {
            "title": "Vérification de votre badge d'accès étudiant",
            "analogy": "Comme badger à la borne pour prouver que vous êtes bien Lina Martin et que vous demandez votre propre CV, pas celui d'un autre élève.",
            "realImpact": "Garantit la stricte confidentialité de vos données personnelles et de vos notes."
        },
        "why": "Protection de la vie privée (RGPD) et cloisonnement étanche des dossiers étudiants.",
        "how": "Contrôle que 'request.user' est authentifié et possède le rôle 'ETUDIANT', avec résolution de son profil lié.",
        "when": "Contrôle d'accès au niveau de la vue Django avant extraction des données.",
        "techUsed": [
            "Décorateur @login_required",
            "Contrôle RBAC Étudiant",
            "RGPD Compliance"
        ]
    },
    "gcv_3": {
        "humanAnalogy": {
            "title": "Rassemblement de tous vos classeurs et attestations",
            "analogy": "Comme l'archiviste qui sort de l'armoire votre dossier complet : coordonnées, projets réalisés, compétences techniques et historique de formation.",
            "realImpact": "Réunit toutes les informations à jour en une fraction de seconde pour fabriquer le document sans rien oublier."
        },
        "why": "Élimine le problème des requêtes SQL multiples 'N+1' en effectuant des jointures optimisées en amont de la génération du PDF.",
        "how": "Requête ORM avec 'select_related' et 'prefetch_related' sur ProfilEtudiant, Competence et Formation.",
        "when": "Phase de collecte de données en base de données.",
        "techUsed": [
            "Django select_related",
            "Jointures SQL JOIN",
            "Optimisation QuerySet N+1"
        ]
    },
    "gcv_4": {
        "humanAnalogy": {
            "title": "Travail du maquettiste imprimeur haute précision",
            "analogy": "Comme un imprimeur professionnel qui calcule les marges, choisit les typographies, dessine les séparateurs dorés et assemble vos photos au millimètre près sur une page A4.",
            "realImpact": "Produit un document PDF vectoriel de qualité imprimerie, parfaitement lisible sur smartphone comme sur papier."
        },
        "why": "Les navigateurs et moteurs HTML sont imprécis à l'impression ; ReportLab génère des primitives vectorielles PostScript mathématiquement parfaites.",
        "how": "Le moteur Python ReportLab instancie un 'SimpleDocTemplate', calcule le flux de styles 'Paragraph', 'Spacer' et 'Table', et compile le binaire dans un tampon mémoire 'io.BytesIO'.",
        "when": "Phase de rendu graphique en mémoire vive serveur.",
        "techUsed": [
            "Bibliothèque Python ReportLab",
            "Rendu Vectoriel PDF",
            "Tampon Mémoire io.BytesIO",
            "Mise en Page Typographique"
        ]
    },
    "gcv_5": {
        "humanAnalogy": {
            "title": "Rangement du document dans le casier cloud et recyclage de l'ancien",
            "analogy": "Comme déposer le nouveau livret dans votre casier en ligne tout en détruisant proprement l'ancien brouillon pour ne pas saturer l'espace de stockage.",
            "realImpact": "Votre CV le plus récent est toujours disponible en ligne, sans consommer d'espace disque inutilement."
        },
        "why": "Gestion rationnelle des quotas de stockage cloud et synchronisation de l'horodatage de génération.",
        "how": "Exécution simultanée du téléversement vers Supabase Storage, suppression de l'ancien fichier binaire et mise à jour de 'date_generation = NOW()'.",
        "when": "Phase de persistance cloud et mise à jour des métadonnées.",
        "techUsed": [
            "Supabase Storage API",
            "Rotation de Fichiers & Quotas",
            "Horodatage PostgreSQL",
            "Gestionnaire de Fichiers Django"
        ]
    },
    "gcv_p1": {
        "humanAnalogy": {
            "title": "Envoi du binaire vers le coffre-fort cloud Supabase",
            "analogy": "Comme transmettre la version finale dans votre espace cloud sécurisé de l'école.",
            "realImpact": "Le fichier PDF est protégé et accessible depuis n'importe quel ordinateur."
        },
        "why": "Assure la haute disponibilité et la pérennité du fichier hors du serveur d'application.",
        "how": "Sauvegarde du flux binaire dans le bucket privé 'stagepilot-cv' via 'ContentFile(tampon.getvalue())'.",
        "when": "Branche Supabase Storage du fork.",
        "techUsed": [
            "ContentFile Django",
            "Supabase S3 API",
            "Stockage Cloud Privé"
        ]
    },
    "gcv_p2": {
        "humanAnalogy": {
            "title": "Destruction sécurisée de l'ancien fichier obsolète",
            "analogy": "Comme passer l'ancienne version périmée à la déchiqueteuse pour respecter les quotas de l'école.",
            "realImpact": "Évite que des centaines d'anciens CV inutilisés ne s'accumulent sur le compte de l'école."
        },
        "why": "Respect strict des quotas de stockage de l'infrastructure cloud et hygiène des données.",
        "how": "Appel de 'ancien_fichier.delete(save=False)' pour supprimer physiquement l'objet cloud sans déclencher de second save SQL.",
        "when": "Branche Rotation Quotas du fork.",
        "techUsed": [
            "Suppression S3 API",
            "Gestion des Quotas Cloud",
            "Nettoyage Orphelins"
        ]
    },
    "gcv_p3": {
        "humanAnalogy": {
            "title": "Tampon de l'heure et de la date sur le document",
            "analogy": "Comme tamponner l'heure exacte '16/10/2026 à 03:50' sur la première page du dossier.",
            "realImpact": "Prouve au recruteur que le CV a été généré très récemment et contient vos compétences actuelles."
        },
        "why": "Traçabilité temporelle permettant d'afficher à l'étudiant depuis combien de temps son CV n'a pas été mis à jour.",
        "how": "UPDATE SQL sur la table 'cv_principal' avec 'date_generation = NOW()'.",
        "when": "Branche Timestamp du fork.",
        "techUsed": [
            "PostgreSQL UPDATE",
            "Fonction SQL NOW()",
            "Champ DateTimeField"
        ]
    },
    "gcv_6": {
        "humanAnalogy": {
            "title": "Sortie immédiate du document par la fente de la borne",
            "analogy": "Comme la borne automatique qui vous tend votre livret imprimé en direct sans recharger l'écran.",
            "realImpact": "Le fichier PDF s'ouvre ou se télécharge instantanément sur votre ordinateur en quelques millisecondes."
        },
        "why": "Streaming direct depuis la mémoire vive sans écriture intermédiaire sur le disque local du serveur web pour une latence minimale.",
        "how": "Instanciation d'une 'FileResponse' Django avec le flux binaire, type MIME 'application/pdf' et en-tête 'Content-Disposition: attachment; filename=CV_Lina_Martin.pdf'.",
        "when": "Réponse HTTP finale au client.",
        "techUsed": [
            "Django FileResponse",
            "MIME application/pdf",
            "Content-Disposition Header",
            "Streaming Mémoire Direct"
        ]
    },
    "ia_1": {
        "humanAnalogy": {
            "title": "Arrivée dans le salon aux 100 stands d'entreprises",
            "analogy": "Comme franchir les portes d'un grand salon de l'emploi où 100 entreprises différentes proposent des stages dans tous les secteurs.",
            "realImpact": "Le candidat souhaite trouver immédiatement les offres qui correspondent exactement à ses compétences sans devoir lire 100 annonces."
        },
        "why": "Déclenche l'expérience d'orientation intelligente personnalisée pour l'élève ingénieur.",
        "how": "L'étudiant accède à l'URL '/offres/' ; le contrôleur Django intercepte la requête pour préparer le catalogue enrichi par l'IA.",
        "when": "Chargement initial de la page du catalogue des offres.",
        "techUsed": [
            "Django View",
            "Contrôleur Catalogue",
            "Interface Candidat"
        ]
    },
    "ia_2": {
        "humanAnalogy": {
            "title": "Résumé de vos super-pouvoirs sur une fiche mémo",
            "analogy": "Comme rédiger une carte de visite synthétique résumant vos 5 compétences maîtresses : 'Python, Cybersécurité, Docker, Réseaux, 3iL Ingénieurs'.",
            "realImpact": "Extrait l'essence de votre profil pour la transmettre au cerveau de l'IA."
        },
        "why": "Permet de construire un prompt sémantique compact et hautement représentatif pour le grand modèle de langage (LLM).",
        "how": "Lecture des compétences de l'étudiant en base de données et sérialisation sous forme de chaîne de caractères textuelle structurée.",
        "when": "Phase de préparation du contexte d'entrée de l'IA.",
        "techUsed": [
            "Django ORM Query",
            "Sérialisation de Compétences",
            "Construction de Prompt LLM"
        ]
    },
    "ia_3": {
        "humanAnalogy": {
            "title": "Élimination des stands hors-sujet ou fermés",
            "analogy": "Comme retirer d'office du plan du salon les stands qui ne recherchent pas d'élèves ingénieurs ou dont les postes sont déjà pourvus.",
            "realImpact": "Réduit drastiquement le nombre d'offres à analyser pour économiser du temps et de la puissance de calcul."
        },
        "why": "Optimisation de performance et réduction de la facture de tokens API : l'IA ne traite que les offres ouvertes pertinentes.",
        "how": "Requête SQL filtrant 'statut = ACTIVE AND date_expiration >= TODAY' avec index partiel PostgreSQL.",
        "when": "Phase de pré-filtrage SQL avant l'appel d'intelligence artificielle.",
        "techUsed": [
            "PostgreSQL WHERE Clause",
            "Index Partiel SQL",
            "Optimisation de Tokens LLM"
        ]
    },
    "ia_4": {
        "humanAnalogy": {
            "title": "Consultation d'un expert d'orientation surdoué en 200 ms",
            "analogy": "Comme consulter un recruteur expert doté d'une mémoire photographique qui lit les offres en 200 millisecondes et calcule le taux d'affinité pour chacune.",
            "realImpact": "L'IA identifie que l'offre Thales correspond à 95% à vos projets de cybersécurité et l'offre Capgemini à 88%."
        },
        "why": "La recherche par mots-clés classique rate les synonymes ; l'IA sémantique LLaMA 3.3 comprend le sens profond des compétences et des missions.",
        "how": "Appel API REST ultra-rapide vers le fournisseur cloud Groq exécutant le modèle LLaMA 3.3 70B avec sortie JSON structurée des scores de matching.",
        "when": "Phase de calcul cognitif asynchrone côté serveur.",
        "techUsed": [
            "API Groq Cloud (LPUs)",
            "Modèle LLaMA 3.3 70B",
            "Analyse Sémantique de Texte",
            "Sortie JSON Structurée"
        ]
    },
    "ia_5": {
        "humanAnalogy": {
            "title": "Tri des dossiers et pose de gommettes dorées sur les meilleures offres",
            "analogy": "Comme le conseiller qui pose une gommette dorée '★ Recommandé pour vous' sur les deux meilleures fiches et les place tout en haut de votre pile.",
            "realImpact": "Dès que vous regardez l'écran, vos yeux tombent directement sur les 2 offres faites sur-mesure pour vous."
        },
        "why": "Économise un temps précieux de recherche et maximise le taux de conversion et d'embauche des étudiants 3iL.",
        "how": "Opérations simultanées en mémoire vive : attribution des scores aux objets OffreStage, bascule du booléen visuel 'est_recommandee', et tri descendant de la liste.",
        "when": "Phase de post-traitement des résultats de l'IA.",
        "techUsed": [
            "Traitement Mémoire Python",
            "Tri par Score Décroissant",
            "Annotation d'Objets ORM"
        ]
    },
    "ia_p1": {
        "humanAnalogy": {
            "title": "Inscription du pourcentage de compatibilité sur chaque fiche",
            "analogy": "Comme écrire '95% de match' au feutre vert sur l'offre Thales et '88%' sur Capgemini.",
            "realImpact": "L'étudiant comprend exactement pourquoi cette offre lui est suggérée."
        },
        "why": "Transparence algorithmique permettant à l'étudiant d'évaluer la pertinence de la recommandation.",
        "how": "Itération en mémoire sur les objets Django et association de la propriété 'score_ia = scores_map[offre.id]'.",
        "when": "Branche Attribution Score du fork.",
        "techUsed": [
            "Propriété Dynamique Python",
            "Dictionnaire de Correspondance O(1)"
        ]
    },
    "ia_p2": {
        "humanAnalogy": {
            "title": "Collage du badge doré '★ Recommandé par l'IA'",
            "analogy": "Comme coller un macaron doré brillant sur le stand pour attirer immédiatement le regard du visiteur.",
            "realImpact": "Met en valeur visuellement les opportunités les plus prometteuses dans l'interface."
        },
        "why": "Signal visuel fort guidant l'attention de l'utilisateur vers les choix à plus haute valeur ajoutée.",
        "how": "Affectation du champ booléen 'offre.est_recommandee = True' pour activer la classe CSS dorée dans le gabarit.",
        "when": "Branche Badging du fork.",
        "techUsed": [
            "Indicateur Booléen",
            "Classes CSS Conditionnelles"
        ]
    },
    "ia_p3": {
        "humanAnalogy": {
            "title": "Remontée des meilleures offres sur le dessus de la pile",
            "analogy": "Comme glisser les deux brochures prioritaires tout en haut de la pile de documents sur la table.",
            "realImpact": "Vous n'avez pas besoin de faire défiler 10 pages pour trouver votre bonheur."
        },
        "why": "L'ordonnancement ergonomique garantit que les offres à fort potentiel sont vues en premier.",
        "how": "Concaténation de la sous-liste des offres recommandées triées avec le reste des offres ordinaires du catalogue.",
        "when": "Branche Tri Prioritaire du fork.",
        "techUsed": [
            "Algorithme de Tri Python (Timsort)",
            "Concaténation de Listes O(N)"
        ]
    },
    "ia_6": {
        "humanAnalogy": {
            "title": "Ouverture du catalogue avec mise en lumière dynamique",
            "analogy": "Comme allumer les projecteurs sur la vitrine d'exposition : les offres idéales brillent au premier plan avec leurs badges dorés.",
            "realImpact": "Une expérience de consultation fluide, moderne et personnalisée qui donne envie de postuler."
        },
        "why": "Affiche une page web complète rendue côté serveur (SSR) pour une vitesse d'affichage instantanée et un bon référencement.",
        "how": "Le moteur de template Django compile le gabarit HTML 'offers/catalogue.html' avec les objets enrichis et renvoie le flux HTML5 au client.",
        "when": "Fin de la vue catalogue, envoi du code HTML au navigateur.",
        "techUsed": [
            "Django Template Engine (SSR)",
            "Rendu HTML5 / CSS3",
            "Streaming HTTP 200 OK"
        ]
    },
    "sj_1": {
        "humanAnalogy": {
            "title": "Sonnerie de réveil du veilleur de nuit à 4h00 du matin",
            "analogy": "Comme l'horloge automatique qui sonne à 4h00 du matin dans l'entrepôt pour réveiller le robot livreur qui doit faire sa tournée quotidienne.",
            "realImpact": "La plateforme récupère les nouvelles offres de stage toutes les nuits automatiquement, sans qu'aucun humain n'ait besoin de cliquer."
        },
        "why": "Maintient le catalogue de stages à jour de manière autonome et transparente pour les étudiants et les entreprises.",
        "how": "Le démon système Linux 'Cron' ou le planificateur 'Celery Beat' déclenche la commande de gestion 'python manage.py synchroniser_offres'.",
        "when": "Exécution programmée la nuit à heure fixe (04:00 AM) lorsque le trafic web est au plus bas.",
        "techUsed": [
            "Planificateur Cron Linux",
            "Django Management Command",
            "Worker Celery Asynchrone"
        ]
    },
    "sj_2": {
        "humanAnalogy": {
            "title": "Panneau 'OCCUPÉ' sur la porte du bureau",
            "analogy": "Comme un employé qui accroche un panneau 'NE PAS DÉRANGER - TRAVAUX EN COURS' sur sa porte : si un collègue arrive, il voit le verrou et s'en va immédiatement sans attendre.",
            "realImpact": "Si le script a été lancé deux fois par erreur, la seconde tâche s'arrête instantanément au lieu de créer des offres en double."
        },
        "why": "Évite les doublons et les collisions de processus en garantissant qu'une seule synchronisation peut tourner à la fois.",
        "how": "Requête PostgreSQL 'SELECT ... FOR UPDATE NOWAIT' sur la table 'EtatSynchronisation'. Si un verrou existe déjà, la base lève l'exception 'OperationalError' et le script s'arrête poliment.",
        "when": "Toute première instruction du script d'ingestion.",
        "techUsed": [
            "PostgreSQL Clause NOWAIT",
            "Gestion d'Exception OperationalError",
            "Verrouillage de Processus Monoinstance"
        ]
    },
    "sj_3": {
        "humanAnalogy": {
            "title": "Vérification sur le cahier d'entretien de la date du dernier passage",
            "analogy": "Comme le technicien qui consulte le carnet de bord : s'il voit que l'inspection a déjà été effectuée il y a 3 heures, il n'a pas besoin de tout refaire.",
            "realImpact": "Évite de solliciter inutilement les serveurs des partenaires si la synchronisation a déjà été faite récemment."
        },
        "why": "Respecte les quotas d'appels API des flux de recrutement partenaires et économise les ressources serveur.",
        "how": "Comparaison de 'timezone.now() - etat.date_derniere_sync' avec un delta de 24 heures. Si le délai est insuffisant, interruption contrôlée du script.",
        "when": "Contrôle métier préalable avant le téléchargement des flux de données externes.",
        "techUsed": [
            "Django timezone.now()",
            "Calcul de Timedelta Python",
            "Règle Métier 24 Heures"
        ]
    },
    "sj_4": {
        "humanAnalogy": {
            "title": "Déballage du carton de documents et vérification de la qualité",
            "analogy": "Comme réceptionner un colis de 11 nouveaux classeurs de stages, vérifier que chaque feuille a un titre, une entreprise et un salaire avant de les accepter.",
            "realImpact": "Filtre les offres incomplètes ou corrompues pour qu'aucune annonce cassée n'apparaisse aux étudiants."
        },
        "why": "Garantit la qualité et la conformité des données externes avant toute écriture définitive dans la base PostgreSQL.",
        "how": "Requête réseau HTTP avec timeout de 10s, parsing du flux JSON et validation des champs obligatoires via un schéma strict.",
        "when": "Phase de collecte et validation des données brutes en mémoire.",
        "techUsed": [
            "Bibliothèque Python Requests",
            "Parseur JSON Streaming",
            "Validation de Schéma Métier"
        ]
    },
    "sj_5": {
        "humanAnalogy": {
            "title": "Dépôt groupé des 11 classeurs d'un seul geste dans l'armoire",
            "analogy": "Comme un archiviste qui dépose une boîte de 11 classeurs d'un coup dans le rayonnage, plutôt que de faire 11 allers-retours épuisants un par un.",
            "realImpact": "La base de données enregistre 11 nouvelles offres en 40 millisecondes au lieu de mettre plusieurs secondes."
        },
        "why": "Évite le fléau des écritures individuelles séquentielles (N requêtes INSERT) en divisant par 10 le temps d'exécution grâce au 'bulk_create'.",
        "how": "Exécution simultanée de l'instruction multi-lignes 'INSERT INTO offers_offrestage VALUES (...), (...);', mise à jour de la date de sync et validation 'COMMIT;'.",
        "when": "Cœur transactionnel d'ingestion SQL en masse.",
        "techUsed": [
            "Django ORM bulk_create()",
            "PostgreSQL Multi-Rows INSERT",
            "Instruction COMMIT SQL"
        ]
    },
    "sj_p1": {
        "humanAnalogy": {
            "title": "Insertion en masse des 11 offres en 1 seule commande SQL",
            "analogy": "Comme insérer les 11 fiches d'un seul bloc dans le tiroir d'archives officiel.",
            "realImpact": "Toutes les offres apparaissent en même temps, sans ralentir la plateforme."
        },
        "why": "Optimisation maximale du temps réseau et de l'effort d'indexation de PostgreSQL.",
        "how": "Appel de 'OffreStage.objects.bulk_create(nouvelles, ignore_conflicts=True)' générant un seul paquet réseau SQL.",
        "when": "Branche Bulk INSERT du fork.",
        "techUsed": [
            "bulk_create Django",
            "PostgreSQL INSERT Multi-Rows",
            "ignore_conflicts=True"
        ]
    },
    "sj_p2": {
        "humanAnalogy": {
            "title": "Mise à jour de l'horloge murale de la dernière tournée",
            "analogy": "Comme tamponner 'Dernier passage : 16/10/2026 04:00' sur la fiche de contrôle mural.",
            "realImpact": "Permet aux administrateurs de voir que la plateforme est parfaitement à jour."
        },
        "why": "Mémorise l'horodatage exact du succès pour la règle des 24h et les tableaux de bord de supervision.",
        "how": "UPDATE SQL sur la table 'offers_etatsynchronisation' avec 'date_derniere_sync = NOW()'.",
        "when": "Branche Timestamp Sync du fork.",
        "techUsed": [
            "PostgreSQL UPDATE",
            "Champ DateTimeField",
            "Audit Système"
        ]
    },
    "sj_p3": {
        "humanAnalogy": {
            "title": "Retrait du panneau 'Occupé' et réouverture de la porte",
            "analogy": "Comme retirer le cadenas sur la porte du bureau pour que les collègues puissent à nouveau y entrer.",
            "realImpact": "Libère la base de données pour que les étudiants puissent consulter les nouvelles offres immédiatement."
        },
        "why": "Validation définitive des écritures et libération des verrous exclusifs pour les requêtes des utilisateurs.",
        "how": "Émission de la commande 'COMMIT;' scellant la transaction atomique.",
        "when": "Branche Release Lock du fork.",
        "techUsed": [
            "SQL COMMIT",
            "Libération Verrou NOWAIT",
            "Restauration Accès Concurrents"
        ]
    },
    "sj_6": {
        "humanAnalogy": {
            "title": "Inscription sur le cahier de garde et rapport de mission",
            "analogy": "Comme le veilleur qui note sur le grand cahier : 'Synchronisation nocturne terminée avec succès : 11 offres ajoutées'.",
            "realImpact": "L'équipe technique dispose d'une preuve écrite que la nuit s'est déroulée sans incident."
        },
        "why": "Assure l'observabilité système et permet de détecter d'éventuels dysfonctionnements d'ingestion de flux.",
        "how": "Écriture dans les fichiers journaux via le module standard 'logging' de Python et émission d'un log formaté.",
        "when": "Phase post-synchronisation de clôture du script.",
        "techUsed": [
            "Module Python logging",
            "Journal d'Audit Système",
            "Niveau de Log INFO"
        ]
    },
    "mtl_1": {
        "humanAnalogy": {
            "title": "Clic de la directrice sur 'Tout marquer comme lu'",
            "analogy": "Comme la directrice des stages qui prend la corbeille de 3 courriers du matin et décide de les acquitter d'un seul geste plutôt que de les ouvrir un par un.",
            "realImpact": "Fait gagner un temps précieux à l'administration de l'école 3iL."
        },
        "why": "Interface pensée pour l'efficacité opérationnelle des responsables pédagogiques gérant des centaines d'étudiants.",
        "how": "Soumission d'une requête POST sécurisée avec jeton CSRF vers l'endpoint '/ecole/notifications/marquer-tout-lu/'.",
        "when": "Point zéro de l'action d'acquittement groupé dans l'espace école.",
        "techUsed": [
            "Formulaire POST sécurisé",
            "Jeton CSRF",
            "Bouton Action Groupée"
        ]
    },
    "mtl_2": {
        "humanAnalogy": {
            "title": "Contrôle du badge d'accès réservé au corps professoral",
            "analogy": "Comme le lecteur de carte magnétique qui vérifie que vous avez bien le grade de 'Responsable de stages' avant de vous laisser entrer dans le bureau des directeurs.",
            "realImpact": "Empêche absolument un étudiant curieux d'accéder aux fonctions d'administration de l'école."
        },
        "why": "Sécurité RBAC (Role-Based Access Control) stricte : la gestion des alertes est réservée aux partenaires académiques validés.",
        "how": "Contrôle que 'request.user.role == \"ECOLE\"' et que l'établissement est certifié actif par l'administrateur, sinon exception 'PermissionDenied' (HTTP 403).",
        "when": "Filtre d'autorisation au début de la vue Python.",
        "techUsed": [
            "Contrôle RBAC",
            "Exception PermissionDenied",
            "Réponse HTTP 403 Forbidden"
        ]
    },
    "mtl_3": {
        "humanAnalogy": {
            "title": "Tampon encreur géant qui valide toute la pile en 1 coup sec",
            "analogy": "Comme un tampon encreur automatique géant qui marque 'ACQUITTÉ' d'un seul coup sec sur toute la pile de 50 feuilles, au lieu de devoir signer chaque feuille à la main une par une.",
            "realImpact": "Toutes les alertes passent à l'état 'lu' en 4 millisecondes, même s'il y en avait 500."
        },
        "why": "Élimine le cauchemar de performance classique de la boucle 'for notif in notifications: notif.save()' qui génère des centaines de requêtes SQL (problème N+1).",
        "how": "Exécution d'une seule instruction SQL ensembliste 'UPDATE schools_notificationecole SET est_lue = TRUE WHERE etablissement_id = 1 AND est_lue = FALSE;'.",
        "when": "Cœur de la mise à jour en base de données.",
        "techUsed": [
            "PostgreSQL UPDATE Ensembliste",
            "Django QuerySet update()",
            "Éradication Boucle N+1",
            "Performance O(1)"
        ]
    },
    "mtl_4": {
        "humanAnalogy": {
            "title": "Extinction du voyant rouge et actualisation des badges",
            "analogy": "Comme le voyant d'alarme rouge au-dessus de la porte qui s'éteint instantanément tandis que toutes les fiches prennent un cachet vert.",
            "realImpact": "La cloche de la barre de navigation passe immédiatement de 3 à 0 sans aucun rechargement lourd de la page."
        },
        "why": "Maintient une cohérence visuelle parfaite et immédiate entre l'interface utilisateur et l'état de la base de données.",
        "how": "Traitement parallèle synchronisant la cloche dans le DOM, la conversion des classes CSS des cartes et l'inscription de l'horodatage d'audit en base.",
        "when": "Phase de synchronisation concomitante interface et serveur.",
        "techUsed": [
            "Manipulation Réactive du DOM",
            "Mutation CSS Dynamique",
            "Cohérence État Client-Serveur"
        ]
    },
    "mtl_p1": {
        "humanAnalogy": {
            "title": "Extinction immédiate du badge rouge de la cloche",
            "analogy": "Comme le compteur de notifications de votre téléphone qui passe de 3 à zéro dès que vous ouvrez l'application.",
            "realImpact": "Vous savez en un coup d'œil qu'il ne reste aucune urgence en attente."
        },
        "why": "Expérience utilisateur réactive et intuitive pour les équipes administratives.",
        "how": "Mise à jour de la propriété textuelle de l'élément '#nb_notif_badge' à '0'.",
        "when": "Branche Cloche Navbar du fork.",
        "techUsed": [
            "JavaScript textContent",
            "DOM Manipulation",
            "Composant Navbar"
        ]
    },
    "mtl_p2": {
        "humanAnalogy": {
            "title": "Remplacement des étiquettes orange 'À lire' par 'Validé'",
            "analogy": "Comme remplacer les post-it orange vif par des pastilles grises discrètes pour indiquer que le travail est fait.",
            "realImpact": "Les cartes de notifications s'atténuent visuellement pour ne plus distraire le responsable."
        },
        "why": "Clarté visuelle et hiérarchie de l'information pour l'utilisateur.",
        "how": "Itération DOM 'classList.remove(\"non-lue\"); classList.add(\"lue\")'.",
        "when": "Branche Statut Cartes du fork.",
        "techUsed": [
            "API classList DOM",
            "Transitions CSS Douces"
        ]
    },
    "mtl_p3": {
        "humanAnalogy": {
            "title": "Horodatage dans le registre de sécurité et purge du cache",
            "analogy": "Comme inscrire l'heure précise dans le registre de sécurité de l'école et vider la corbeille temporaire.",
            "realImpact": "Garantit qu'un rechargement de page ou une reconnexion ne réaffichera pas d'anciennes alertes fantômes."
        },
        "why": "Traçabilité légale de l'acquittement des alertes de sécurité et invalidation du cache de session pour éviter toute désynchronisation.",
        "how": "UPDATE SQL 'date_lecture = NOW()' sur les alertes de l'établissement et purge du cache mémoire des alertes non lues.",
        "when": "Branche Audit & Cache du fork.",
        "techUsed": [
            "PostgreSQL UPDATE Horodaté",
            "Invalidation Cache Session",
            "Audit Réglementaire"
        ]
    },
    "mtl_5": {
        "humanAnalogy": {
            "title": "Message de confirmation vert et tableau de bord propre",
            "analogy": "Comme un message rassurant sur l'écran : 'Toutes les alertes sont acquittées. Aucun nouveau dossier en attente.'",
            "realImpact": "L'administration peut poursuivre sa journée de travail en toute sérénité."
        },
        "why": "Confirmation explicite de l'opération via le pattern PRG pour éviter tout renvoi de requête accidentel.",
        "how": "Redirection HTTP 302 vers 'schools:notifications' avec message flash vert de succès.",
        "when": "Fin du traitement et réponse finale au client.",
        "techUsed": [
            "HTTP 302 Redirect",
            "Django Messages Framework",
            "Pattern PRG"
        ]
    }
};

// Auto-fusion avec tous les arbres de simulation
(function autoEnrichTrees() {
    const trees = window.SIMULATION_TREES || {};
    const data = window.SIMULATION_ENRICHMENT || {};

    Object.keys(trees).forEach(treeKey => {
        const tree = trees[treeKey];
        if (!tree || !tree.nodes) return;

        tree.nodes.forEach(node => {
            const enrich = data[node.id];
            if (enrich) {
                if (enrich.humanAnalogy) node.humanAnalogy = enrich.humanAnalogy;
                if (enrich.why) node.why = enrich.why;
                if (enrich.how) node.how = enrich.how;
                if (enrich.when) node.when = enrich.when;
                if (enrich.techUsed) node.techUsed = enrich.techUsed;
            }

            // Enrichir les tâches parallèles du Fork
            if (node.parallelTasks && Array.isArray(node.parallelTasks)) {
                node.parallelTasks.forEach(task => {
                    const taskEnrich = data[task.id];
                    if (taskEnrich) {
                        if (taskEnrich.humanAnalogy) task.humanAnalogy = taskEnrich.humanAnalogy;
                        if (taskEnrich.why) task.why = taskEnrich.why;
                        if (taskEnrich.how) task.how = taskEnrich.how;
                        if (taskEnrich.when) task.when = taskEnrich.when;
                        if (taskEnrich.techUsed) task.techUsed = taskEnrich.techUsed;
                    }
                });
            }
        });
    });
})();

