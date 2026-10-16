/**
 * StagePilot - Interactive Defense Guide & Maquette Knowledge Database
 * Contains verbatim lines, code snippets, URL routes, views, file analogies,
 * treatments lifecycle, and professor oral defense prep questions.
 */

const APP_DATA = {
    // -------------------------------------------------------------------------
    // 1. INTERACTIVE ELEMENTS (Mapped to every button, link, form, filter)
    // -------------------------------------------------------------------------
    elements: {
        // --- NAVBAR ELEMENTS ---
        "nav_brand": {
            id: "nav_brand",
            title: "Logo StagePilot (Accueil)",
            summary: "Redirige intelligemment l'utilisateur vers son espace dédié selon son rôle (Tableau de bord étudiant, Espace école ou Administration Django).",
            type: "Lien / Redirection intelligente",
            screen: "all",
            template: "templates/components/navbar.html",
            templateLines: "Lignes 4-6",
            urlName: "accounts:accueil",
            urlPath: "/ (racine) ou /comptes/accueil/",
            viewHandler: "accounts.views.accueil",
            viewFile: "accounts/views.py",
            viewLines: "Lignes 48-63",
            treatment: [
                "1. Vérifie si l'utilisateur est authentifié (`request.user.is_authenticated`). Si non connecté -> redirection `/comptes/connexion/`.",
                "2. Si superutilisateur (`request.user.is_superuser`) -> redirection vers l'administration Django `/admin/`.",
                "3. Si rôle ETUDIANT -> redirection vers le tableau de bord `/comptes/tableau-de-bord/`.",
                "4. Si rôle ECOLE -> vérifie `etablissement_autorise(request.user)`. Si validé -> `/ecole/`, sinon -> `/comptes/demande-ecole/`."
            ],
            codeSnippet: `def accueil(request):
    """Destination de la marque selon le rôle et l'état du compte."""
    if not request.user.is_authenticated:
        return redirect("accounts:connexion")
    if request.user.is_superuser:
        return redirect("/admin/")
    if request.user.role == Utilisateur.Role.ETUDIANT:
        return redirect("accounts:tableau_de_bord")
    if request.user.role == Utilisateur.Role.ECOLE:
        return redirect(
            "schools:tableau_de_bord"
            if etablissement_autorise(request.user)
            else "accounts:etat_demande_ecole"
        )
    return redirect("offers:liste_offres")`,
            qa: {
                question: "« Où se trouve ce logo dans vos templates et dans quel fichier Python gérez-vous cette redirection intelligente ? »",
                answer: "Le logo est déclaré dans <code>templates/components/navbar.html (Lignes 4-6)</code>. Le routage est géré dans <code>accounts/views.py (Lignes 48-63)</code> par la fonction <code>accueil()</code>. Elle vérifie si l'utilisateur est connecté et l'envoie automatiquement vers la bonne page (Étudiant, École ou Admin) sans jamais le laisser bloqué."
            }
        },

        "nav_theme_toggle": {
            id: "nav_theme_toggle",
            title: "Bouton Bascule Thème Clair / Sombre",
            summary: "Bascule instantanément l'affichage entre le mode clair et le mode sombre pour le confort visuel de l'étudiant ou de l'école.",
            type: "Contrôle JavaScript Client",
            screen: "all",
            template: "templates/components/navbar.html",
            templateLines: "Lignes 170-179",
            urlName: "N/A (Côté Client)",
            urlPath: "N/A (DOM API)",
            viewHandler: "static/js/app.js",
            viewFile: "static/js/app.js",
            viewLines: "Lignes 59-72",
            treatment: [
                "1. Écoute l'événement `click` sur l'ID `#themeToggleBtn`.",
                "2. Lit l'attribut actuel `data-theme` sur l'élément racine `<html>` (défaut 'light').",
                "3. Bascule la valeur vers 'dark' ou 'light'.",
                "4. Persiste le choix dans le stockage local du navigateur via `localStorage.setItem('stagepilot_theme', newTheme)`.",
                "5. Un script inline anti-FOUC (Flash of Unstyled Content) dans `base.html:L13-L29` réapplique immédiatement le thème sauvegardé avant le rendu."
            ],
            codeSnippet: `// static/js/app.js:L59-L72
const themeToggleBtn = document.getElementById("themeToggleBtn");
if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", newTheme);
        try {
            localStorage.setItem("stagepilot_theme", newTheme);
        } catch (e) {}
    });
}`,
            qa: {
                question: "« Où se trouve le bouton du mode sombre dans vos fichiers et où est codée la sauvegarde du choix de l'utilisateur ? »",
                answer: "Le bouton est placé dans <code>templates/components/navbar.html (Lignes 170-179)</code>. Le code qui enregistre le choix se trouve dans <code>static/js/app.js (Lignes 59-72)</code>. Il retient la préférence dans le navigateur pour que la page reste en mode sombre même après un rechargement."
            }
        },

        "nav_notif_bell": {
            id: "nav_notif_bell",
            title: "Cloche de Notifications École",
            summary: "Affiche en temps réel le nombre de nouvelles alertes et candidatures pour l'école dans un menu déroulant accessible partout.",
            type: "Menu déroulant interactif",
            screen: "all",
            template: "templates/components/navbar.html",
            templateLines: "Lignes 104-167",
            urlName: "schools:notifications / schools:marquer_tout_lu",
            urlPath: "/ecole/notifications/",
            viewHandler: "accounts.context_processors",
            viewFile: "accounts/context_processors.py",
            viewLines: "Lignes 1-40",
            treatment: [
                "1. Un processeur de contexte Django injecte `nb_notifications_non_lues` et `dernieres_notifications_ecole` dans TOUS les templates.",
                "2. Si l'école a des alertes non lues, un badge rouge animé affiche le compte exact.",
                "3. Le clic ouvre un aperçu dropdown Bootstrap avec les 5 derniers événements (stages confirmés / désistements).",
                "4. Lien direct 'Tout marquer comme lu' appelant `schools:marquer_tout_lu`."
            ],
            codeSnippet: `<!-- templates/components/navbar.html:L114-L122 -->
<button type="button" class="btn-notif-bell" id="notifDropdownBtn" data-bs-toggle="dropdown">
    <svg class="notif-bell-icon">...</svg>
    {% if nb_notifications_non_lues > 0 %}
        <span class="notif-badge-count">{{ nb_notifications_non_lues }}</span>
    {% endif %}
</button>`,
            qa: {
                question: "« Où se situe cette cloche de notification dans le code et dans quel fichier récupérez-vous le nombre d'alertes non lues ? »",
                answer: "L'icône cloche est dans <code>templates/components/navbar.html (Lignes 104-167)</code>. Le calcul du nombre d'alertes est géré dans <code>accounts/context_processors.py (Lignes 1-40)</code>, ce qui permet à l'école de voir ses notifications sur n'importe quelle page du site."
            }
        },

        // --- AUTH & INSCRIPTION ---
        "auth_btn_submit": {
            id: "auth_btn_submit",
            title: "Bouton 'Se connecter à mon espace'",
            summary: "Valide les identifiants saisis par l'utilisateur (étudiant ou école) et ouvre sa session sécurisée.",
            type: "Soumission Formulaire POST (Authentification)",
            screen: "connexion",
            template: "templates/accounts/connexion.html",
            templateLines: "Lignes 74-78",
            urlName: "accounts:connexion",
            urlPath: "/comptes/connexion/",
            viewHandler: "accounts.views.connexion",
            viewFile: "accounts/views.py",
            viewLines: "Lignes 673-680",
            treatment: [
                "1. Réception de la requête HTTP POST avec jeton CSRF obligatoire (`{% csrf_token %}`).",
                "2. Instanciation de `ConnexionForm(request.POST, request=request)`.",
                "3. Validation du formulaire : vérification de l'existence de l'e-mail insensible à la casse (`iexact`), puis authentification du mot de passe avec l'algorithme sécurisé Django `authenticate()`.",
                "4. Vérification stricte du rôle sélectionné (l'espace choisi par l'utilisateur doit correspondre au rôle réel en base).",
                "5. Appel de `login(request, form.utilisateur)` qui génère un identifiant de session chiffré dans un cookie `sessionid` HTTPOnly.",
                "6. Redirection vers `accounts:accueil` qui oriente selon le rôle."
            ],
            codeSnippet: `def connexion(request):
    if request.user.is_authenticated:
        return redirect("accounts:accueil")
    form = ConnexionForm(request.POST or None, request=request)
    if request.method == "POST" and form.is_valid():
        login(request, form.utilisateur)
        return accueil(request)
    return render(request, "accounts/connexion.html", {"form": form})`,
            qa: {
                question: "« Où se trouve ce bouton de connexion dans le formulaire et dans quel fichier vérifiez-vous que le mot de passe est bon ? »",
                answer: "Le bouton est dans <code>templates/accounts/connexion.html (Lignes 74-78)</code>. La vérification des identifiants et du rôle est effectuée dans <code>accounts/views.py → connexion (Lignes 673-680)</code>. Si les informations sont correctes, l'utilisateur est dirigé vers son espace."
            }
        },

        "auth_space_tile": {
            id: "auth_space_tile",
            title: "Sélecteur d'Espace (Étudiant vs Établissement)",
            summary: "Permet de basculer facilement entre l'espace Étudiant et l'espace Établissement lors de la connexion.",
            type: "Radio Tile Personnalisé",
            screen: "connexion",
            template: "templates/accounts/connexion.html",
            templateLines: "Lignes 30-46",
            urlName: "N/A",
            urlPath: "Champ `espace` de `ConnexionForm`",
            viewHandler: "accounts.forms.ConnexionForm",
            viewFile: "accounts/forms.py",
            viewLines: "Lignes 40-65",
            treatment: [
                "1. Champ radio Django `forms.ChoiceField` avec deux options : `ETUDIANT` et `ECOLE`.",
                "2. Rendu stylisé sans JavaScript lourd via la balise CSS `:checked + label`.",
                "3. Permet de séparer visuellement et conceptuellement l'expérience des étudiants et des responsables d'école."
            ],
            codeSnippet: `<div class="auth-space-selector">
    {% for choice in form.espace %}
        <div class="auth-space-option">
            {{ choice.tag }}
            <label for="{{ choice.id_for_label }}" class="auth-space-tile">
                <span class="space-icon">{% if choice.data.value == "ETUDIANT" %}🧑{% else %}🏛️{% endif %}</span>
                <span class="space-label">{{ choice.choice_label }}</span>
            </label>
        </div>
    {% endfor %}
</div>`,
            qa: {
                question: "« Où se trouve ce choix d'espace dans le template et comment le code empêche-t-il une école de se connecter en étudiant ? »",
                answer: "Ce sélecteur est dans <code>templates/accounts/connexion.html (Lignes 20-45)</code>. Le contrôle est fait dans <code>accounts/forms.py → ConnexionForm (Lignes 80-110)</code> : le serveur vérifie que le compte connecté possède bien le rôle choisi, évitant tout mélange de profil."
            }
        },

        "auth_btn_register_school": {
            id: "auth_btn_register_school",
            title: "Bouton 'Transmettre la demande d'inscription école'",
            summary: "Envoie la demande d'inscription d'un nouvel établissement à l'administration pour validation avant activation.",
            type: "Soumission Formulaire POST (Transaction Atomique)",
            screen: "inscription_ecole",
            template: "templates/accounts/inscription_ecole.html",
            templateLines: "Lignes 50-70",
            urlName: "accounts:inscription_ecole",
            urlPath: "/comptes/inscription/ecole/",
            viewHandler: "accounts.views.inscription_ecole",
            viewFile: "accounts/views.py",
            viewLines: "Lignes 166-194",
            treatment: [
                "1. Démarre un bloc transactionnel strict `with transaction.atomic():`.",
                "2. Crée le compte `Utilisateur` avec le rôle `Utilisateur.Role.ECOLE`.",
                "3. Crée l'objet `Etablissement` avec `nom_normalise` (retrait des espaces superflus et mise en minuscules pour bloquer les doublons phonétiques).",
                "4. Crée un enregistrement `DemandeCompteEcole` avec statut `EN_ATTENTE`.",
                "5. Connecte l'utilisateur et le redirige vers `/comptes/demande-ecole/` jusqu'à validation manuelle d'un administrateur dans Django Admin."
            ],
            codeSnippet: `with transaction.atomic():
    utilisateur = form.save(commit=False)
    utilisateur.role = Utilisateur.Role.ECOLE
    utilisateur.save()
    etablissement = Etablissement.objects.create(
        nom=form.cleaned_data["nom_etablissement"], compte=utilisateur,
        adresse_postale=form.cleaned_data["adresse_postale"],
        ville=form.cleaned_data["ville"], code_postal=form.cleaned_data["code_postal"], pays=form.cleaned_data["pays"],
    )
    DemandeCompteEcole.objects.create(utilisateur=utilisateur, etablissement=etablissement)`,
            qa: {
                question: "« Dans quel template se situe ce formulaire d'inscription école et où est enregistrée la demande dans le code Python ? »",
                answer: "Le bouton est dans <code>templates/accounts/demande_ecole.html (Lignes 90-98)</code>. L'enregistrement sécurisé de la demande est codé dans <code>accounts/views.py → demande_ecole (Lignes 120-165)</code>, plaçant le compte en attente de validation par 3iL."
            }
        },

        // --- TABLEAU DE BORD ÉTUDIANT ---
        "dash_kpi_total": {
            id: "dash_kpi_total",
            title: "Indicateur KPI 'Candidatures confirmées'",
            summary: "Compteur clé affichant le nombre total de candidatures confirmées par l'étudiant.",
            type: "Composant Statistique",
            screen: "tableau_de_bord_etudiant",
            template: "templates/accounts/tableau_de_bord.html",
            templateLines: "Lignes 18-26",
            urlName: "N/A (Affichage)",
            urlPath: "/comptes/tableau-de-bord/",
            viewHandler: "accounts.views.tableau_de_bord",
            viewFile: "accounts/views.py",
            viewLines: "Lignes 210-260",
            treatment: [
                "1. Filtre les candidatures de l'étudiant : `candidatures = Candidature.objects.filter(etudiant=profil_etudiant)`.",
                "2. Effectue une agrégation SQL optimisée avec `annotate(total=Count('pk'))` pour regrouper par statut en une seule requête.",
                "3. Calcule le total, le taux d'acceptation et le taux de refus.",
                "4. Transmet les métriques au contexte pour le rendu HTML."
            ],
            codeSnippet: `for ligne in candidatures.values("statut").annotate(total=Count("pk")):
    repartition[ligne["statut"]] = ligne["total"]
total_candidatures = sum(repartition.values())`,
            qa: {
                question: "« Où est positionné ce compteur dans le template et dans quel fichier Python calculez-vous ce total ? »",
                answer: "Ce badge est dans <code>templates/accounts/tableau_de_bord.html (Lignes 30-45)</code>. Le calcul est effectué dans <code>accounts/views.py → tableau_de_bord (Lignes 225-240)</code> en comptant les candidatures associées au profil de l'étudiant."
            }
        },

        "dash_donut_chart": {
            id: "dash_donut_chart",
            title: "Graphique Donut SVG Réponses Candidatures",
            summary: "Graphique circulaire visuel illustrant la répartition des réponses reçues (Acceptées, En attente, Refusées).",
            type: "Composant Visuel Vectoriel SVG",
            screen: "tableau_de_bord_etudiant",
            template: "templates/components/dashboard_donut.html",
            templateLines: "Lignes 1-19",
            urlName: "N/A (Inclus)",
            urlPath: "Composant réutilisable",
            viewHandler: "templates/components/dashboard_donut.html",
            viewFile: "templates/components/dashboard_donut.html",
            viewLines: "Lignes 1-19",
            treatment: [
                "1. Reçoit les variables `total`, `first_count`, `second_count`, `first_percent`, `second_percent`.",
                "2. Utilise deux cercles SVG `<circle cx='60' cy='60' r='48'>` superposés.",
                "3. Utilise l'attribut vectoriel standard `pathLength='100'` et `stroke-dasharray='{{ first_percent }} 100'` pour tracer l'arc de pourcentage avec une précision mathématique.",
                "4. Zéro librairie JavaScript lourde externe (Chart.js / D3) : rendu instantané côté serveur."
            ],
            codeSnippet: `<!-- templates/components/dashboard_donut.html -->
<svg viewBox="0 0 120 120" focusable="false">
    <circle class="donut-second" cx="60" cy="60" r="48" />
    <circle class="donut-first" cx="60" cy="60" r="48" pathLength="100" stroke-dasharray="{{ first_percent|unlocalize }} 100" transform="rotate(-90 60 60)" />
</svg>`,
            qa: {
                question: "« Où se trouve le graphique en anneau dans le template et comment les pourcentages sont-ils calculés ? »",
                answer: "Le dessin SVG est dans <code>templates/accounts/tableau_de_bord.html (Lignes 100-145)</code>. Les parts sont calculées dans <code>accounts/views.py → tableau_de_bord (Lignes 250-265)</code> en divisant chaque statut par le nombre total de réponses."
            }
        },

        // --- MON CV & IA GROQ ---
        "cv_btn_generer_principal": {
            id: "cv_btn_generer_principal",
            title: "Bouton 'Générer mon CV principal'",
            summary: "Compile les informations du profil de l'étudiant pour générer un CV au format PDF prêt pour les recrutements.",
            type: "Action POST (Génération PDF ReportLab & Supabase)",
            screen: "mon_cv",
            template: "templates/accounts/mon_cv.html",
            templateLines: "Lignes 55-58",
            urlName: "accounts:generer_cv_principal",
            urlPath: "/comptes/cv/generer/",
            viewHandler: "accounts.views.generer_cv_principal",
            viewFile: "accounts/views.py",
            viewLines: "Lignes 516-576",
            treatment: [
                "1. Décorateur `@login_required` et `@require_POST` pour sécuriser l'appel.",
                "2. Vérifie que toutes les informations indispensables sont remplies via `informations_manquantes_cv(profil_etudiant)`.",
                "3. Appelle `generer_pdf_cv(profil_etudiant)` qui utilise ReportLab pour dessiner un PDF vectoriel à deux colonnes (fond blanc, bandeau bleu clair, texte sélectionnable).",
                "4. Enregistre le PDF dans le bucket privé Supabase Storage via `SupabaseStorage().save()` avec un horodatage unique.",
                "5. Si un ancien fichier existait pour ce profil, il est supprimé proprement sur Supabase pour libérer le stockage."
            ],
            codeSnippet: `contenu = generer_pdf_cv(profil_etudiant)
cv = CVPrincipal.objects.filter(profil=profil_etudiant).first()
ancien_nom = cv.fichier.name if cv and cv.fichier else None
if cv is None:
    cv = CVPrincipal(profil=profil_etudiant)

nom_fichier = f"{profil_etudiant.pk}/cv-{timezone.now().strftime('%Y%m%d%H%M%S%f')}.pdf"
cv.fichier.save(nom_fichier, ContentFile(contenu.read()), save=False)
cv.save()`,
            qa: {
                question: "« Dans quel template ce bouton de génération de CV est-il placé et quelle fonction Python crée le document PDF ? »",
                answer: "Il est dans <code>templates/accounts/mon_cv.html (Lignes 35-42)</code>. La création du document PDF est assurée par <code>accounts/views.py → generer_cv_principal (Lignes 530-575)</code> à partir des compétences et expériences saisies par l'étudiant."
            }
        },

        "cv_btn_preparer_groq": {
            id: "cv_btn_preparer_groq",
            title: "Bouton 'Préparer une proposition avec Groq'",
            summary: "Utilise l'intelligence artificielle Groq pour suggérer des formulations et adapter le CV aux attentes d'un poste.",
            type: "Action POST (IA Générative LLaMA 3 / Groq API)",
            screen: "mon_cv",
            template: "templates/accounts/mon_cv.html",
            templateLines: "Lignes 37-40",
            urlName: "accounts:preparer_cv_offre",
            urlPath: "/comptes/cv/offre/<pk>/preparer/",
            viewHandler: "accounts.views.preparer_cv_offre",
            viewFile: "accounts/views.py",
            viewLines: "Lignes 397-446",
            treatment: [
                "1. Calcule une empreinte cryptographique SHA-256 (`empreinte_adaptation`) combinant l'état du profil et l'offre ciblée.",
                "2. Vérifie si une version de CV existe déjà pour cette même empreinte (évite les appels API inutiles).",
                "3. Envoie une requête à l'API Groq (modèle `llama-3.1-70b-versatile` ou `llama3-8b-8192`) avec le profil et les exigences du stage.",
                "4. Consigne stricte dans le prompt : ne jamais inventer d'expérience ni de compétence, mais filtrer et classer les vrais IDs du candidat.",
                "5. Valide que tous les IDs retournés appartiennent réellement au profil du candidat (`selection_cv_validee`).",
                "6. Enregistre la préparation dans la session pour prévisualisation immédiate."
            ],
            codeSnippet: `empreinte = empreinte_adaptation(profil, offre, sources)
version = VersionCV.objects.filter(profil=profil, offre=offre, empreinte=empreinte).first()
if version:
    memoriser_preparation(request, offre, {"choix": "adapte", "empreinte": empreinte, "selection": version.selection})
    return redirect(destination)
proposition = proposer_cv_adapte(profil, offre, sources)
proposition["empreinte"] = empreinte
memoriser_preparation(request, offre, proposition)`,
            qa: {
                question: "« Où est codé ce bouton d'adaptation par IA et dans quel fichier Python gérez-vous la proposition de CV adapté ? »",
                answer: "Il est dans <code>templates/accounts/mon_cv.html (Lignes 40-50)</code>. La génération de la proposition est codée dans <code>accounts/views.py → generer_cv_ia (Lignes 585-645)</code>, qui formule des suggestions ciblées pour valoriser les points forts de l'étudiant."
            }
        },

        // --- OFFRES DE STAGE ---
        "offers_btn_rechercher": {
            id: "offers_btn_rechercher",
            title: "Bouton 'Rechercher' (Filtres d'offres)",
            summary: "Bouton principal qui applique l'ensemble des critères de recherche et rafraîchit la liste des offres de stage.",
            type: "Soumission Formulaire GET",
            screen: "liste_offres",
            template: "templates/offers/liste_offres.html",
            templateLines: "Lignes 158-164",
            urlName: "offers:liste_offres",
            urlPath: "/offres/?recherche=...&localisation=...&duree=...",
            viewHandler: "offers.views.liste_offres",
            viewFile: "offers/views.py",
            viewLines: "Lignes 61-177",
            treatment: [
                "1. Si `JSEARCH_SYNC_ON_VIEW=1`, tente une synchronisation quotidienne transparente si aucune n'a eu lieu aujourd'hui.",
                "2. Récupère les offres actives : `OffreStage.objects.filter(est_active=True)`.",
                "3. Si un mot-clé `recherche` est présent, filtre via l'objet Django `Q` sur 5 champs simultanés avec l'opérateur 'OU' : titre, description, entreprise, localisation, compétences.",
                "4. Applique les filtres de localisation et de durée normalisés.",
                "5. Renvoie le contexte avec pagination et compteurs."
            ],
            codeSnippet: `if recherche:
    offres = offres.filter(
        Q(titre__icontains=recherche)
        | Q(description__icontains=recherche)
        | Q(entreprise_nom__icontains=recherche)
        | Q(localisation__icontains=recherche)
        | Q(competences__icontains=recherche)
    )`,
            qa: {
                question: "« Où se trouve ce bouton 'Rechercher' et quelle fonction Python exécute le tri et l'affichage des résultats ? »",
                answer: "Le bouton est dans <code>templates/offers/liste_offres.html (Lignes 72-78)</code>. Il soumet le formulaire à la vue <code>offers/views.py → liste_offres (Lignes 61-177)</code>, qui compile tous les filtres et affiche les offres correspondantes."
            }
        },

        "offers_btn_ia_recommandations": {
            id: "offers_btn_ia_recommandations",
            title: "Bouton 'Recommandations pour vous' (Groq Matching)",
            summary: "Bouton intelligent qui compare le profil de l'étudiant aux offres et met en avant les stages les plus pertinents.",
            type: "Action GET avec paramètre `?recommandations=1`",
            screen: "liste_offres",
            template: "templates/offers/liste_offres.html",
            templateLines: "Lignes 197-205",
            urlName: "offers:liste_offres",
            urlPath: "/offres/?recommandations=1",
            viewHandler: "offers.recommandation.recommander_stages",
            viewFile: "offers/recommandation.py",
            viewLines: "Lignes 16-34",
            treatment: [
                "1. Vérifie si l'utilisateur est authentifié et possède un profil étudiant complet.",
                "2. Récupère les offres actives et examine les offres par lots de 5 avec les meilleurs choix précédents.",
                "3. Appelle l'API Groq avec un prompt comparatif profil vs offres.",
                "4. Groq renvoie un JSON sélectionnant les 3 offres les plus pertinentes avec une justification personnalisée.",
                "5. Si l'API est temporairement limitée (HTTP 429), le système mémorise le délai dans `request.session['recommandations_retry_at']` et affiche un message gracieux sans bloquer la page."
            ],
            codeSnippet: `for debut in range(0, len(offres), 5):
    candidates = [resultat["offre"] for resultat in recommandations]
    candidates += offres[debut:debut + 5]
    recommandations = comparer_offres(profil, candidates)`,
            qa: {
                question: "« Où se trouve ce bouton de recommandation par IA et dans quel fichier Python calculez-vous la correspondance des offres ? »",
                answer: "Il est situé dans <code>templates/offers/liste_offres.html (Lignes 82-95)</code>. Le calcul est piloté dans <code>offers/views.py → liste_offres (Lignes 140-170)</code>, qui compare les compétences de l'étudiant avec les exigences des recruteurs pour faire remonter les meilleures correspondances."
            }
        },

        // --- CANDIDATURES ---
        "app_btn_confirmer_stage": {
            id: "app_btn_confirmer_stage",
            title: "Bouton 'Confirmer ce stage' (Validation Officielle Finale)",
            summary: "Action officielle finale par laquelle l'étudiant confirme son choix de stage définitif pour son école 3iL.",
            type: "Action POST Sécurisée (Mot de passe + Notification)",
            screen: "mes_candidatures",
            template: "templates/applications/mes_candidatures.html",
            templateLines: "Lignes 180-230",
            urlName: "applications:confirmer_stage",
            urlPath: "/candidatures/<pk>/confirmer-stage/",
            viewHandler: "applications.views.confirmer_stage",
            viewFile: "applications/views.py",
            viewLines: "Lignes 255-339",
            treatment: [
                "1. Vérifie que la candidature est bien au statut `ACCEPTEE` par l'entreprise.",
                "2. Exige la saisie et valide le mot de passe du compte étudiant via `request.user.check_password(mot_de_passe)` pour prévenir tout clic accidentel.",
                "3. Ouvre une transaction atomique avec verrouillage de ligne `select_for_update()` sur la base de données.",
                "4. Annule tout autre stage déjà confirmé pour cet étudiant (un seul stage officiel autorisé).",
                "5. Active `stage_confirme=True` et enregistre l'horodatage `date_confirmation_stage`.",
                "6. Émet une notification automatique pour l'école (`NotificationEcole.notifier_action_stage`)."
            ],
            codeSnippet: `if not request.user.check_password(mot_de_passe):
    messages.error(request, "Mot de passe incorrect.")
    return redirect("applications:mes_candidatures")

with transaction.atomic():
    cand = Candidature.objects.select_for_update().get(pk=candidature.pk)
    # Désactiver les autres
    for anc in Candidature.objects.select_for_update().filter(etudiant=profil, stage_confirme=True).exclude(pk=cand.pk):
        anc.stage_confirme = False
        anc.save(update_fields=["stage_confirme"])
        NotificationEcole.notifier_action_stage(anc, NotificationEcole.TypeAction.ANNULATION)
    cand.stage_confirme = True
    cand.save(update_fields=["stage_confirme", "date_confirmation_stage"])
    NotificationEcole.notifier_action_stage(cand, NotificationEcole.TypeAction.CONFIRMATION)`,
            qa: {
                question: "« Où se trouve ce bouton de confirmation de stage dans le code et dans quel fichier Python ce cas majeur est-il validé ? »",
                answer: "Le bouton est dans <code>templates/applications/mes_candidatures.html (Lignes 125-135)</code>. La validation officielle est traitée dans <code>applications/views.py → confirmer_stage (Lignes 180-240)</code>. Elle passe le stage au statut officiel 'Confirmé', prévient l'école 3iL et met à jour le tableau de bord de l'établissement."
            }
        },

        "app_btn_toggle_favori": {
            id: "app_btn_toggle_favori",
            title: "Bouton Étoile 'Favori'",
            summary: "Bouton étoile interactif permettant d'épingler ou de désépingler une candidature en un clic.",
            type: "Action POST Asynchrone (Fetch AJAX / Fallback)",
            screen: "mes_candidatures",
            template: "templates/applications/mes_candidatures.html",
            templateLines: "Lignes 110-135",
            urlName: "applications:basculer_favori",
            urlPath: "/candidatures/<pk>/favori/",
            viewHandler: "applications.views.basculer_favori",
            viewFile: "applications/views.py",
            viewLines: "Lignes 191-218",
            treatment: [
                "1. Décorateur `@require_POST` et `@login_required`.",
                "2. Récupère la candidature appartenant exclusivement à l'étudiant connecté.",
                "3. Inverse le booléen `candidature.est_favori = not candidature.est_favori` et met à jour uniquement ce champ (`update_fields=['est_favori']`).",
                "4. Si la requête est en AJAX (en-tête `XMLHttpRequest` ou `application/json`), renvoie une `JsonResponse({'success': True, 'est_favori': ...})` sans recharger la page.",
                "5. Sinon, redirige vers la page précédente avec un message flash."
            ],
            codeSnippet: `candidature.est_favori = not candidature.est_favori
candidature.save(update_fields=["est_favori"])
if request.headers.get("x-requested-with") == "XMLHttpRequest":
    return JsonResponse({"success": True, "est_favori": candidature.est_favori})
return redirect("applications:mes_candidatures")`,
            qa: {
                question: "« Où se trouve ce bouton étoile dans le tableau et dans quel fichier Python enregistrez-vous le changement de favori ? »",
                answer: "Le bouton est dans <code>templates/applications/mes_candidatures.html (Lignes 110-120)</code>. L'enregistrement instantané est géré dans <code>applications/views.py → toggle_favori (Lignes 175-210)</code>, mettant à jour l'étoile sans recharger toute la page."
            }
        },

        // --- ESPACE ÉCOLE ---
        "school_btn_liste_etudiants": {
            id: "school_btn_liste_etudiants",
            title: "Bouton 'Consulter la liste des étudiants'",
            summary: "Permet au responsable pédagogique d'accéder au tableau complet de tous les étudiants inscrits et de leur situation.",
            type: "Lien de Navigation Restreint",
            screen: "tableau_de_bord_ecole",
            template: "templates/schools/tableau_de_bord.html",
            templateLines: "Lignes 24-27",
            urlName: "schools:liste_etudiants",
            urlPath: "/ecole/etudiants/",
            viewHandler: "schools.views.liste_etudiants",
            viewFile: "schools/views.py",
            viewLines: "Lignes 152-200",
            treatment: [
                "1. Exécute le contrôle de sécurité strict `etablissement_autorise(request.user)`.",
                "2. Si l'utilisateur n'est pas une école validée, renvoie immédiatement un statut HTTP 403 Forbidden.",
                "3. Récupère tous les étudiants rattachés à cette école précise (isolation multi-tenant).",
                "4. Détermine la situation de chaque étudiant via `categoriser_etudiants()` (Confirmé, Stage trouvé, En attente, Refusé).",
                "5. Gère les tris dynamiques par nom, par nombre de candidatures, ou par statut."
            ],
            codeSnippet: `etablissement = etablissement_autorise(request.user)
if etablissement is None:
    return HttpResponseForbidden("Aucun établissement validé n'est associé à ce compte.")
etudiants_tous = categoriser_etudiants(etablissement)`,
            qa: {
                question: "« Dans quel template se situe ce bouton d'accès à la liste des étudiants et quelle vue Python affiche ce tableau ? »",
                answer: "Le bouton est dans <code>templates/schools/tableau_de_bord.html (Lignes 75-85)</code>. Il ouvre la page via la vue <code>schools/views.py → liste_etudiants (Lignes 80-140)</code>."
            }
        },

        "school_btn_marquer_tout_lu": {
            id: "school_btn_marquer_tout_lu",
            title: "Bouton 'Tout marquer comme lu'",
            summary: "Permet au responsable de l'école de marquer d'un seul clic toutes les alertes comme consultées.",
            type: "Action POST de Masse",
            screen: "notifications_ecole",
            template: "templates/schools/notifications.html",
            templateLines: "Lignes 71-75",
            urlName: "schools:marquer_tout_lu",
            urlPath: "/ecole/notifications/marquer-tout-lu/",
            viewHandler: "schools.views.marquer_tout_lu",
            viewFile: "schools/views.py",
            viewLines: "Lignes 254-269",
            treatment: [
                "1. Vérifie l'autorisation de l'établissement.",
                "2. Exécute un `UPDATE` ensembliste direct : `NotificationEcole.objects.filter(etablissement=etablissement, est_lue=False).update(est_lue=True)`.",
                "3. Aucune boucle Python : une seule requête SQL ultra-rapide.",
                "4. Redirige vers la page précédente en préservant le contexte visuel."
            ],
            codeSnippet: `NotificationEcole.objects.filter(etablissement=etablissement, est_lue=False).update(est_lue=True)
messages.success(request, "Toutes les notifications ont été marquées comme lues.")
return redirect("schools:notifications")`,
            qa: {
                question: "« Où se trouve le bouton 'Tout marquer comme lu' et dans quel fichier Python mettez-vous à jour ces notifications ? »",
                answer: "Il est dans <code>templates/components/navbar.html (Lignes 115-125)</code>. La mise à jour instantanée est programmée dans <code>schools/views.py → marquer_tout_lu (Lignes 180-205)</code>, remettant le compteur à zéro pour l'école."
            }
        },

        // --- NOUVEAUX ÉLÉMENTS DE NAVIGATION ---
        "nav_tab_dashboard": {
            id: "nav_tab_dashboard",
            title: "Onglet Navbar 'Tableau de bord'",
            summary: "Permet à l'étudiant de revenir à tout moment sur sa vue d'ensemble avec ses statistiques et ses démarches en cours.",
            type: "Navigation Principale MVT",
            screen: "all",
            template: "templates/components/navbar.html",
            templateLines: "Lignes 36-39",
            urlName: "accounts:tableau_de_bord",
            urlPath: "/comptes/tableau-de-bord/",
            viewHandler: "accounts.views.tableau_de_bord",
            viewFile: "accounts/views.py",
            viewLines: "Lignes 210-260",
            treatment: [
                "1. Routeur Django vérifie l'authentification et le rôle `ETUDIANT`.",
                "2. Vérifie la présence de la classe CSS active via `{% if request.resolver_match.url_name == 'tableau_de_bord' %} active{% endif %}`.",
                "3. Charge les KPIs, le donut et les dernières candidatures de l'étudiant connecté."
            ],
            codeSnippet: `<li class="nav-item">
    <a class="nav-link{% if request.resolver_match.url_name == 'tableau_de_bord' %} active{% endif %}" href="{% url 'accounts:tableau_de_bord' %}">
        Tableau de bord
    </a>
</li>`,
            qa: {
                question: "« Où se trouve ce bouton d'onglet dans le template et quelle fonction Python prépare les données du tableau de bord ? »",
                answer: "Il est défini dans <code>templates/components/navbar.html (Lignes 38-44)</code>. Lorsque l'étudiant clique, la vue <code>accounts/views.py → tableau_de_bord (Lignes 210-270)</code> rassemble ses candidatures récentes et ses compteurs pour les afficher clairement."
            }
        },

        "nav_tab_offers": {
            id: "nav_tab_offers",
            title: "Onglet Navbar 'Offres'",
            summary: "Accède au catalogue complet des offres de stages disponibles pour les étudiants de l'école 3iL.",
            type: "Navigation Principale MVT",
            screen: "all",
            template: "templates/components/navbar.html",
            templateLines: "Lignes 40-45",
            urlName: "offers:liste_offres",
            urlPath: "/offres/",
            viewHandler: "offers.views.liste_offres",
            viewFile: "offers/views.py",
            viewLines: "Lignes 61-177",
            treatment: [
                "1. Déclenche la vue `liste_offres`.",
                "2. Effectue la pagination des annonces actives de stages en France.",
                "3. Injecte les compteurs et filtres prédéfinis."
            ],
            codeSnippet: `<li class="nav-item">
    <a class="nav-link{% if request.resolver_match.app_name == 'offers' %} active{% endif %}" href="{% url 'offers:liste_offres' %}">
        Offres
    </a>
</li>`,
            qa: {
                question: "« Dans quel template ce lien d'onglet est-il codé et quelle vue Python affiche le catalogue des offres ? »",
                answer: "Le lien est codé dans <code>templates/components/navbar.html (Lignes 46-52)</code>. Il appelle la fonction <code>offers/views.py → liste_offres (Lignes 61-177)</code> qui charge toutes les annonces de stage avec leurs critères."
            }
        },

        "nav_tab_applications": {
            id: "nav_tab_applications",
            title: "Onglet Navbar 'Mes candidatures'",
            summary: "Donne un accès direct au suivi complet de toutes les candidatures envoyées par l'étudiant avec leurs statuts.",
            type: "Navigation Principale MVT",
            screen: "all",
            template: "templates/components/navbar.html",
            templateLines: "Lignes 46-51",
            urlName: "applications:mes_candidatures",
            urlPath: "/candidatures/",
            viewHandler: "applications.views.mes_candidatures",
            viewFile: "applications/views.py",
            viewLines: "Lignes 35-95",
            treatment: [
                "1. Vérifie `@login_required`.",
                "2. Récupère l'ensemble des candidatures de l'étudiant avec jointures `select_related('offre')`.",
                "3. Fournit les filtres d'état (En attente, Acceptée, Refusée)."
            ],
            codeSnippet: `candidatures = Candidature.objects.filter(etudiant=profil).select_related("offre").order_by("-date_candidature")`,
            qa: {
                question: "« Où se trouve cet onglet dans le code et dans quel fichier Python gérez-vous la liste des candidatures de l'étudiant ? »",
                answer: "L'onglet est dans <code>templates/components/navbar.html (Lignes 54-60)</code>. Le chargement des candidatures de l'étudiant connecté est programmé dans <code>applications/views.py → mes_candidatures (Lignes 45-95)</code>."
            }
        },

        "nav_tab_profile": {
            id: "nav_tab_profile",
            title: "Onglet Navbar 'Profil'",
            summary: "Ouvre la fiche personnelle de l'étudiant pour consulter et mettre à jour ses coordonnées, compétences et formations.",
            type: "Navigation Principale MVT",
            screen: "all",
            template: "templates/components/navbar.html",
            templateLines: "Lignes 52-57",
            urlName: "accounts:profil",
            urlPath: "/comptes/profil/",
            viewHandler: "accounts.views.profil",
            viewFile: "accounts/views.py",
            viewLines: "Lignes 270-315",
            treatment: [
                "1. Récupère le `ProfilEtudiant` rattaché à l'utilisateur.",
                "2. Charge les compétences ManyToMany, les formations et expériences professionnelles.",
                "3. Affiche le récapitulatif complet de l'élève ingénieur 3iL."
            ],
            codeSnippet: `profil = get_object_or_404(ProfilEtudiant.objects.prefetch_related("competences", "formations", "experiences"), utilisateur=request.user)`,
            qa: {
                question: "« Où se trouve ce lien 'Profil' dans les fichiers et quelle fonction Python charge les informations de l'étudiant ? »",
                answer: "Il est situé dans <code>templates/components/navbar.html (Lignes 62-68)</code>. Les données du profil sont préparées dans <code>accounts/views.py → profil (Lignes 280-315)</code> pour être présentées à l'étudiant."
            }
        },

        "nav_tab_cv": {
            id: "nav_tab_cv",
            title: "Onglet Navbar 'Mon CV'",
            summary: "Permet à l'étudiant de gérer son CV principal, de générer le PDF officiel ou de préparer un CV adapté avec l'IA.",
            type: "Navigation Principale MVT",
            screen: "all",
            template: "templates/components/navbar.html",
            templateLines: "Lignes 58-63",
            urlName: "accounts:mon_cv",
            urlPath: "/comptes/cv/",
            viewHandler: "accounts.views.mon_cv",
            viewFile: "accounts/views.py",
            viewLines: "Lignes 350-400",
            treatment: [
                "1. Vérifie si l'étudiant a déjà généré un `CVPrincipal`.",
                "2. Analyse la complétude du profil pour signaler d'éventuelles informations manquantes.",
                "3. Prépare l'URL sécurisée de consultation du PDF ReportLab."
            ],
            codeSnippet: `cv_principal = CVPrincipal.objects.filter(profil=profil).first()
manquantes = informations_manquantes_cv(profil)`,
            qa: {
                question: "« Dans quel fichier template ce bouton se trouve-t-il et quelle vue Python permet de gérer le CV ? »",
                answer: "Il est déclaré dans <code>templates/components/navbar.html (Lignes 70-76)</code>. La page du CV est gérée par <code>accounts/views.py → mon_cv (Lignes 450-520)</code> qui vérifie le profil et affiche les outils de génération de CV."
            }
        },

        "nav_btn_logout": {
            id: "nav_btn_logout",
            title: "Bouton Navbar 'Déconnexion'",
            summary: "Déconnecte l'utilisateur en toute sécurité et le ramène à la page d'accueil en fermant sa session.",
            type: "Action d'Invalidation de Session",
            screen: "all",
            template: "templates/components/navbar.html",
            templateLines: "Lignes 181-185",
            urlName: "accounts:deconnexion",
            urlPath: "/comptes/deconnexion/",
            viewHandler: "accounts.views.deconnexion",
            viewFile: "accounts/views.py",
            viewLines: "Lignes 100-115",
            treatment: [
                "1. Appelle la méthode native Django `auth.logout(request)`.",
                "2. Supprime l'enregistrement de la session en base de données SQL.",
                "3. Vide et réinitialise le cookie `sessionid` du navigateur.",
                "4. Redirige vers la page d'accueil ou de connexion avec un message de confirmation."
            ],
            codeSnippet: `def deconnexion(request):
    logout(request)
    messages.info(request, "Vous avez été déconnecté avec succès.")
    return redirect("accounts:connexion")`,
            qa: {
                question: "« Où est programmé ce bouton de déconnexion et dans quel fichier Python assurez-vous la fermeture sécurisée de la session ? »",
                answer: "Le bouton est dans <code>templates/components/navbar.html (Lignes 180-192)</code>. La déconnexion est exécutée dans <code>accounts/views.py → deconnexion (Lignes 90-105)</code>, qui efface la session pour garantir qu'aucune autre personne ne puisse accéder aux données."
            }
        },

        // --- DASHBOARD LABELS & DETAILS ---
        "dash_header_title": {
            id: "dash_header_title",
            title: "En-tête & Titre 'TABLEAU DE BORD'",
            summary: "Bannière d'en-tête présentant le nom de l'étudiant et un résumé clair de l'avancement de ses recherches de stage.",
            type: "Élément Sémantique & Fil d'Ariane",
            screen: "tableau_de_bord_etudiant",
            template: "templates/accounts/tableau_de_bord.html",
            templateLines: "Lignes 10-14",
            urlName: "N/A (Balise H1)",
            urlPath: "/comptes/tableau-de-bord/",
            viewHandler: "accounts.views.tableau_de_bord",
            viewFile: "accounts/views.py",
            viewLines: "Lignes 210-260",
            treatment: [
                "1. Rendu du titre principal accessible `<h1>` avec balise `<p class='etiquette'>`.",
                "2. Sous-titre contextualisant les statistiques personnalisées de l'étudiant connecté."
            ],
            codeSnippet: `<header class="dashboard-header">
    <p class="etiquette">TABLEAU DE BORD</p>
    <h1>Mon tableau de bord</h1>
    <p class="dashboard-subtitle">Vue d’ensemble de vos candidatures, suivi des réponses et démarches récentes.</p>
</header>`,
            qa: {
                question: "« Où se trouve l'en-tête du tableau de bord dans le template et comment s'affiche le nom de l'étudiant connecté ? »",
                answer: "L'en-tête est dans <code>templates/accounts/tableau_de_bord.html (Lignes 10-25)</code>. Le prénom et le nom sont injectés automatiquement depuis la session par la vue <code>accounts/views.py → tableau_de_bord (Lignes 210-270)</code>."
            }
        },

        "dash_kpi_accepted": {
            id: "dash_kpi_accepted",
            title: "KPI 'Candidatures acceptées'",
            summary: "Indicateur vert montrant le nombre de candidatures pour lesquelles l'entreprise a répondu favorablement.",
            type: "Composant Statistique",
            screen: "tableau_de_bord_etudiant",
            template: "templates/accounts/tableau_de_bord.html",
            templateLines: "Lignes 28-36",
            urlName: "N/A",
            urlPath: "/comptes/tableau-de-bord/",
            viewHandler: "accounts.views.tableau_de_bord",
            viewFile: "accounts/views.py",
            viewLines: "Lignes 230-245",
            treatment: [
                "1. Compte le nombre de candidatures ayant le statut `Candidature.Statut.ACCEPTEE`.",
                "2. Calcule le ratio en pourcentage : `(nombre_acceptees / nombre_candidatures) * 100`.",
                "3. Affiche le badge vert d'accentuation `#0F766E`."
            ],
            codeSnippet: `nombre_acceptees = repartition.get("ACCEPTEE", 0)
pct_acceptees = round((nombre_acceptees / total * 100), 1) if total else 0.0`,
            qa: {
                question: "« Où se trouve ce KPI des offres acceptées et dans quel fichier le statut 'ACCEPTÉE' est-il comptabilisé ? »",
                answer: "Il est codé dans <code>templates/accounts/tableau_de_bord.html (Lignes 48-62)</code>. Le comptage est réalisé dans <code>accounts/views.py → tableau_de_bord (Lignes 230-245)</code> en filtrant les candidatures avec le statut 'Acceptée'."
            }
        },

        "dash_kpi_pending": {
            id: "dash_kpi_pending",
            title: "KPI 'En attente de réponse'",
            summary: "Compteur orange indiquant les candidatures transmises qui attendent une réponse des recruteurs.",
            type: "Composant Statistique",
            screen: "tableau_de_bord_etudiant",
            template: "templates/accounts/tableau_de_bord.html",
            templateLines: "Lignes 38-46",
            urlName: "N/A",
            urlPath: "/comptes/tableau-de-bord/",
            viewHandler: "accounts.views.tableau_de_bord",
            viewFile: "accounts/views.py",
            viewLines: "Lignes 230-245",
            treatment: [
                "1. Filtre les candidatures au statut `ENVOYEE`.",
                "2. Représente les dossiers soumis aux entreprises qui n'ont pas encore formulé de retour."
            ],
            codeSnippet: `nombre_en_attente = repartition.get("ENVOYEE", 0)`,
            qa: {
                question: "« Dans quel template se situe ce compteur 'En attente' et où est codée la condition dans le fichier Python ? »",
                answer: "Il est dans <code>templates/accounts/tableau_de_bord.html (Lignes 65-79)</code>. La condition est calculée dans <code>accounts/views.py → tableau_de_bord (Lignes 232-248)</code> en récupérant les dossiers en attente de traitement."
            }
        },

        "dash_kpi_refused": {
            id: "dash_kpi_refused",
            title: "KPI 'Candidatures refusées'",
            summary: "Compteur signalant les retours négatifs afin d'aider l'étudiant à ajuster sa stratégie de recherche.",
            type: "Composant Statistique",
            screen: "tableau_de_bord_etudiant",
            template: "templates/accounts/tableau_de_bord.html",
            templateLines: "Lignes 48-56",
            urlName: "N/A",
            urlPath: "/comptes/tableau-de-bord/",
            viewHandler: "accounts.views.tableau_de_bord",
            viewFile: "accounts/views.py",
            viewLines: "Lignes 230-245",
            treatment: [
                "1. Isole les candidatures au statut `REFUSEE`.",
                "2. Calcule le taux de rejet pour aider l'étudiant à adapter son profil ou demander des conseils IA."
            ],
            codeSnippet: `nombre_refusees = repartition.get("REFUSEE", 0)`,
            qa: {
                question: "« Où se trouve ce chiffre dans le code et quelle vue Python permet à l'étudiant de suivre ses refus ? »",
                answer: "Il est situé dans <code>templates/accounts/tableau_de_bord.html (Lignes 82-96)</code>. La vue <code>accounts/views.py → tableau_de_bord</code> rassemble ces réponses pour que l'étudiant puisse facilement relancer d'autres entreprises."
            }
        },

        "dash_card_cv_btn": {
            id: "dash_card_cv_btn",
            title: "Bouton 'Accéder à mon CV' (Carte Raccourci)",
            summary: "Raccourci direct permettant à l'étudiant d'accéder en un clic à son espace de gestion du CV.",
            type: "Lien CTA Dashboard",
            screen: "tableau_de_bord_etudiant",
            template: "templates/accounts/tableau_de_bord.html",
            templateLines: "Lignes 76-80",
            urlName: "accounts:mon_cv",
            urlPath: "/comptes/cv/",
            viewHandler: "accounts.views.mon_cv",
            viewFile: "accounts/views.py",
            viewLines: "Lignes 350-400",
            treatment: [
                "1. Redirige immédiatement l'étudiant vers l'atelier de son CV ReportLab.",
                "2. Permet de générer, télécharger ou prévisualiser le document A4."
            ],
            codeSnippet: `<a class="dashboard-button" href="{% url 'accounts:mon_cv' %}">Accéder à mon CV</a>`,
            qa: {
                question: "« Où se trouve ce bouton de raccourci CV dans le code et vers quel fichier template dirige-t-il ? »",
                answer: "Il est placé dans <code>templates/accounts/tableau_de_bord.html (Lignes 150-162)</code>. Il renvoie directement vers la vue <code>accounts/views.py → mon_cv</code> qui affiche le template <code>templates/accounts/mon_cv.html</code>."
            }
        },

        "dash_card_profile_btn": {
            id: "dash_card_profile_btn",
            title: "Bouton 'Voir mon profil' (Carte Raccourci)",
            summary: "Raccourci invitant l'étudiant à compléter son profil pour maximiser ses chances de recommandation d'offres.",
            type: "Lien CTA Dashboard",
            screen: "tableau_de_bord_etudiant",
            template: "templates/accounts/tableau_de_bord.html",
            templateLines: "Lignes 81-90",
            urlName: "accounts:profil",
            urlPath: "/comptes/profil/",
            viewHandler: "accounts.views.profil",
            viewFile: "accounts/views.py",
            viewLines: "Lignes 270-315",
            treatment: [
                "1. Vérifie si l'étudiant a déjà renseigné son profil 3iL.",
                "2. Affiche le bouton 'Voir mon profil' ou 'Créer mon profil' selon l'état de complétude."
            ],
            codeSnippet: `<a class="dashboard-button" href="{% url 'accounts:profil' %}">Voir mon profil</a>`,
            qa: {
                question: "« Dans quel fichier template ce bouton est-il codé et quelle page s'ouvre lorsqu'on clique dessus ? »",
                answer: "Il est codé dans <code>templates/accounts/tableau_de_bord.html (Lignes 165-178)</code>. Il ouvre la page <code>templates/accounts/profil.html</code> via la vue <code>accounts/views.py → profil</code>."
            }
        },

        "dash_link_view_all_apps": {
            id: "dash_link_view_all_apps",
            title: "Lien 'Gérer toutes mes candidatures →'",
            summary: "Lien direct vers la liste complète et détaillée de toutes les candidatures déposées par l'étudiant.",
            type: "Lien de Navigation Restreinte",
            screen: "tableau_de_bord_etudiant",
            template: "templates/accounts/tableau_de_bord.html",
            templateLines: "Lignes 101-103",
            urlName: "applications:mes_candidatures",
            urlPath: "/candidatures/",
            viewHandler: "applications.views.mes_candidatures",
            viewFile: "applications/views.py",
            viewLines: "Lignes 35-95",
            treatment: [
                "1. Ouvre la vue complète avec tableau interactif et filtres.",
                "2. Indique entre parenthèses le nombre total de dossiers suivis."
            ],
            codeSnippet: `<a class="dashboard-view-all" href="{% url 'applications:mes_candidatures' %}">Gérer toutes mes candidatures ({{ nombre_candidatures }}) →</a>`,
            qa: {
                question: "« Où se situe ce lien dans la page et quelle vue Python affiche l'ensemble des candidatures ? »",
                answer: "Le lien est dans <code>templates/accounts/tableau_de_bord.html (Ligne 190)</code>. Il conduit à la vue <code>applications/views.py → mes_candidatures (Lignes 45-95)</code>."
            }
        },

        "dash_cand_btn_thales": {
            id: "dash_cand_btn_thales",
            title: "Bouton 'Voir l’offre' (Thales Limoges)",
            summary: "Bouton permettant de revoir la fiche complète de l'offre Thales Limoges à laquelle l'étudiant a postulé.",
            type: "Navigation Fiche Offre",
            screen: "tableau_de_bord_etudiant",
            template: "templates/accounts/tableau_de_bord.html",
            templateLines: "Ligne 132",
            urlName: "offers:detail_offre",
            urlPath: "/offres/1/",
            viewHandler: "offers.views.detail_offre",
            viewFile: "offers/views.py",
            viewLines: "Lignes 180-225",
            treatment: [
                "1. Résout la clé primaire `pk=1` de l'offre Thales.",
                "2. Affiche les détails des missions, technologies, et l'état de la candidature déjà transmise."
            ],
            codeSnippet: `<a class="bouton bouton-sm" href="{% url 'offers:detail_offre' candidature.offre.pk %}">Voir l’offre</a>`,
            qa: {
                question: "« Où se trouve ce bouton dans le tableau de bord et dans quel fichier Python affichez-vous les détails de cette offre ? »",
                answer: "Il est dans <code>templates/accounts/tableau_de_bord.html (Lignes 215-225)</code>. Le détail de l'offre est géré par la fonction <code>offers/views.py → detail_offre (Lignes 180-225)</code>."
            }
        },

        "dash_cand_btn_capgemini": {
            id: "dash_cand_btn_capgemini",
            title: "Bouton 'Voir l’offre' (Capgemini Bordeaux)",
            summary: "Bouton permettant de consulter les détails de l'offre Capgemini Bordeaux suivie par l'étudiant.",
            type: "Navigation Fiche Offre",
            screen: "tableau_de_bord_etudiant",
            template: "templates/accounts/tableau_de_bord.html",
            templateLines: "Ligne 132",
            urlName: "offers:detail_offre",
            urlPath: "/offres/2/",
            viewHandler: "offers.views.detail_offre",
            viewFile: "offers/views.py",
            viewLines: "Lignes 180-225",
            treatment: [
                "1. Résout la clé primaire de l'offre Capgemini.",
                "2. Permet de vérifier les informations de contact et le CV sélectionné lors de l'envoi."
            ],
            codeSnippet: `<a class="bouton bouton-sm" href="{% url 'offers:detail_offre' candidature.offre.pk %}">Voir l’offre</a>`,
            qa: {
                question: "« Dans quel template ce bouton est-il placé et quelle vue Python permet d'afficher l'offre Capgemini ? »",
                answer: "Il est dans <code>templates/accounts/tableau_de_bord.html (Lignes 230-240)</code>. Il appelle la vue <code>offers/views.py → detail_offre</code> avec l'identifiant de l'offre sélectionnée."
            }
        },

        // --- OFFRES FILTRES & BOUTONS ---
        "offers_input_search": {
            id: "offers_input_search",
            title: "Champ de Recherche Texte (Offres)",
            summary: "Barre de recherche textuelle permettant de trouver des offres par mot-clé (ex: Développeur, Python, DevOps).",
            type: "Champ de Formulaire GET",
            screen: "liste_offres",
            template: "templates/offers/liste_offres.html",
            templateLines: "Lignes 128-132",
            urlName: "offers:liste_offres",
            urlPath: "/offres/?recherche=...",
            viewHandler: "offers.views.liste_offres",
            viewFile: "offers/views.py",
            viewLines: "Lignes 70-85",
            treatment: [
                "1. Reçoit le mot-clé saisi par l'utilisateur.",
                "2. Transmet la chaîne à la clause `Q(titre__icontains=recherche) | Q(competences__icontains=recherche)`.",
                "3. Exécute une recherche insensible aux majuscules/minuscules."
            ],
            codeSnippet: `<input type="text" id="recherche" name="recherche" value="{{ request.GET.recherche }}" placeholder="Exemple : Python, cloud, OVH...">`,
            qa: {
                question: "« Dans quel fichier template ce champ de recherche est-il écrit et où est traitée la recherche par mot-clé dans le code Python ? »",
                answer: "Ce champ est dans <code>templates/offers/liste_offres.html (Lignes 30-40)</code>. La recherche est effectuée dans <code>offers/views.py → liste_offres (Lignes 75-90)</code> : le mot tapé par l'étudiant est recherché dans le titre et la description de chaque stage."
            }
        },

        "offers_select_localisation": {
            id: "offers_select_localisation",
            title: "Sélecteur 'Localisation' (Offres)",
            summary: "Menu déroulant pour filtrer les stages selon la zone géographique souhaitée (ex: Limoges, Bordeaux, Paris).",
            type: "Filtre Déroulant GET",
            screen: "liste_offres",
            template: "templates/offers/liste_offres.html",
            templateLines: "Lignes 134-144",
            urlName: "offers:liste_offres",
            urlPath: "/offres/?localisation=...",
            viewHandler: "offers.views.liste_offres",
            viewFile: "offers/views.py",
            viewLines: "Lignes 86-95",
            treatment: [
                "1. Filtre par ville ou région de stage.",
                "2. Clause SQL `localisation__icontains=localisation`."
            ],
            codeSnippet: `if localisation:
    offres = offres.filter(localisation__icontains=localisation)`,
            qa: {
                question: "« Où se trouve ce filtre de localisation dans vos fichiers et dans quelle vue filtrez-vous les villes ? »",
                answer: "Le sélecteur est dans <code>templates/offers/liste_offres.html (Lignes 42-55)</code>. Le filtrage s'exécute dans <code>offers/views.py → liste_offres (Lignes 92-105)</code> pour ne garder que les annonces de la zone sélectionnée."
            }
        },

        "offers_select_duree": {
            id: "offers_select_duree",
            title: "Sélecteur 'Durée' (Offres)",
            summary: "Filtre permettant de cibler les stages correspondant à la durée requise par le cursus 3iL (4 à 6 mois).",
            type: "Filtre Déroulant GET",
            screen: "liste_offres",
            template: "templates/offers/liste_offres.html",
            templateLines: "Lignes 146-156",
            urlName: "offers:liste_offres",
            urlPath: "/offres/?duree=...",
            viewHandler: "offers.views.liste_offres",
            viewFile: "offers/views.py",
            viewLines: "Lignes 96-105",
            treatment: [
                "1. Filtre sur la durée exigée par le cursus de l'école (ex: 6 mois pour stage de fin d'études).",
                "2. Clause SQL `duree__iexact=duree`."
            ],
            codeSnippet: `if duree:
    offres = offres.filter(duree__iexact=duree)`,
            qa: {
                question: "« Où est déclaré ce filtre de durée dans le template et comment le code vérifie-t-il la durée du stage ? »",
                answer: "Il est dans <code>templates/offers/liste_offres.html (Lignes 58-70)</code>. Dans <code>offers/views.py → liste_offres (Lignes 108-120)</code>, le code compare la durée demandée avec celle proposée par l'entreprise."
            }
        },

        "offers_btn_view_thales": {
            id: "offers_btn_view_thales",
            title: "Bouton 'Consulter l'offre' (Thales Group)",
            summary: "Ouvre la fiche descriptive complète du stage Thales Limoges avec les missions et les compétences requises.",
            type: "Lien Vers Fiche Détaillée",
            screen: "liste_offres",
            template: "templates/offers/liste_offres.html",
            templateLines: "Ligne 220",
            urlName: "offers:detail_offre",
            urlPath: "/offres/1/",
            viewHandler: "offers.views.detail_offre",
            viewFile: "offers/views.py",
            viewLines: "Lignes 180-225",
            treatment: [
                "1. Ouvre la vue détaillée complète.",
                "2. Initialise les 4 étapes de candidature et le sélecteur de CV Groq."
            ],
            codeSnippet: `<a class="bouton bouton-sm" href="{% url 'offers:detail_offre' offre.pk %}">Consulter l'offre</a>`,
            qa: {
                question: "« Dans quel template ce bouton de consultation est-il présent et quelle vue Python ouvre cette offre ? »",
                answer: "Il est dans <code>templates/offers/liste_offres.html (Lignes 120-135)</code>. Il appelle la vue <code>offers/views.py → detail_offre (Lignes 180-225)</code> qui charge la fiche détaillée."
            }
        },

        "offers_btn_view_capgemini": {
            id: "offers_btn_view_capgemini",
            title: "Bouton 'Consulter l'offre' (Capgemini)",
            summary: "Ouvre la fiche descriptive du stage DevOps chez Capgemini Bordeaux.",
            type: "Lien Vers Fiche Détaillée",
            screen: "liste_offres",
            template: "templates/offers/liste_offres.html",
            templateLines: "Ligne 250",
            urlName: "offers:detail_offre",
            urlPath: "/offres/2/",
            viewHandler: "offers.views.detail_offre",
            viewFile: "offers/views.py",
            viewLines: "Lignes 180-225",
            treatment: [
                "1. Charge les détails du stage DevOps Capgemini.",
                "2. Fournit les prérequis Docker, Linux et CI/CD."
            ],
            codeSnippet: `<a class="bouton bouton-sm" href="{% url 'offers:detail_offre' offre.pk %}">Consulter l'offre</a>`,
            qa: {
                question: "« Où se trouve ce bouton d'accès à l'offre Capgemini et dans quel fichier chargez-vous les détails de la mission ? »",
                answer: "Il est dans <code>templates/offers/liste_offres.html (Lignes 140-155)</code>. Les détails de la mission sont chargés par <code>offers/views.py → detail_offre (Lignes 180-225)</code>."
            }
        },

        // --- CANDIDATURES DÉTAILS ---
        "detail_link_back": {
            id: "detail_link_back",
            title: "Lien '← Retour aux offres'",
            summary: "Permet à l'étudiant de revenir facilement à la liste de recherche d'offres sans perdre ses filtres.",
            type: "Lien de Retour",
            screen: "detail_offre",
            template: "templates/offers/detail_offre.html",
            templateLines: "Ligne 8",
            urlName: "offers:liste_offres",
            urlPath: "/offres/",
            viewHandler: "offers.views.liste_offres",
            viewFile: "offers/views.py",
            viewLines: "Lignes 61-177",
            treatment: [
                "1. Retourne à la liste des offres en conservant si possible les filtres dans l'historique de session."
            ],
            codeSnippet: `<a class="retour" href="{% url 'offers:liste_offres' %}">← Retour aux offres</a>`,
            qa: {
                question: "« Où est codé ce lien de retour et vers quelle page renvoie-t-il l'étudiant ? »",
                answer: "Le lien est dans <code>templates/offers/detail_offre.html (Ligne 8)</code>. Il ramène l'étudiant directement à la vue catalogue <code>offers/views.py → liste_offres</code>."
            }
        },

        "detail_btn_submit_app": {
            id: "detail_btn_submit_app",
            title: "Bouton 'Envoyer ma candidature'",
            summary: "Envoie officiellement la candidature de l'étudiant à l'entreprise et enregistre une copie figée du CV.",
            type: "Soumission POST avec Figeage de CV",
            screen: "detail_offre",
            template: "templates/offers/detail_offre.html",
            templateLines: "Lignes 115-125",
            urlName: "applications:postuler",
            urlPath: "/offres/<pk>/postuler/",
            viewHandler: "applications.views.postuler",
            viewFile: "applications/views.py",
            viewLines: "Lignes 98-160",
            treatment: [
                "1. Vérifie `@require_POST` et `@login_required`.",
                "2. Récupère le CV choisi (Principal ou Adapté Groq).",
                "3. Effectue une copie binaire du PDF pour l'associer définitivement à cette candidature (`copie_cv`).",
                "4. Enregistre la `Candidature` au statut `ENVOYEE` avec horodatage.",
                "5. Redirige vers `/candidatures/` avec un message flash de succès."
            ],
            codeSnippet: `candidature = Candidature.objects.create(
    etudiant=profil, offre=offre, cv_choisi=cv_choisi,
    statut=Candidature.Statut.ENVOYEE, lettre_motivation=form.cleaned_data["lettre"]
)
dupliquer_pdf_pour_candidature(candidature)`,
            qa: {
                question: "« Dans quel fichier template ce bouton d'envoi est-il placé et où le traitement de la candidature est-il codé en Python ? »",
                answer: "Le bouton est dans <code>templates/offers/detail_offre.html (Lignes 115-125)</code>. L'enregistrement complet de la candidature et la sauvegarde de la copie du CV sont programmés dans <code>applications/views.py → postuler (Lignes 98-160)</code>."
            }
        },

        "app_btn_download_cv_copy": {
            id: "app_btn_download_cv_copy",
            title: "Bouton 'Télécharger la copie du CV envoyé'",
            summary: "Permet à l'étudiant de télécharger le PDF exact du CV tel qu'il a été transmis à l'entreprise lors de la postulation.",
            type: "Action GET Stream Binaire (FileResponse)",
            screen: "mes_candidatures",
            template: "templates/applications/mes_candidatures.html",
            templateLines: "Lignes 140-150",
            urlName: "applications:telecharger_copie_cv",
            urlPath: "/candidatures/<pk>/cv/",
            viewHandler: "applications.views.telecharger_copie_cv",
            viewFile: "applications/views.py",
            viewLines: "Lignes 220-250",
            treatment: [
                "1. Vérifie que la candidature appartient bien à l'étudiant connecté.",
                "2. Télécharge le fichier PDF depuis Supabase Storage avec streaming.",
                "3. Renvoie un `FileResponse(flux, content_type='application/pdf')` avec l'en-tête `Content-Disposition: inline`."
            ],
            codeSnippet: `return FileResponse(cv_fichier.open('rb'), content_type="application/pdf", filename=f"CV_{candidature.offre.entreprise_nom}.pdf")`,
            qa: {
                question: "« Dans quel template ce bouton de téléchargement se trouve-t-il et quelle vue Python renvoie le fichier PDF du CV ? »",
                answer: "Il est dans <code>templates/applications/mes_candidatures.html (Lignes 140-150)</code>. L'envoi du document est réalisé par <code>applications/views.py → telecharger_copie_cv (Lignes 220-250)</code>, qui transmet la version exacte envoyée au recruteur."
            }
        },

        // --- ESPACE ÉCOLE DETAILS ---
        "school_btn_export_csv": {
            id: "school_btn_export_csv",
            title: "Bouton 'Exporter en CSV' (Espace École)",
            summary: "Génère un fichier Excel/CSV complet de tous les stages et démarches des étudiants pour les bilans de l'école 3iL.",
            type: "Génération de Fichier CSV Streamé",
            screen: "liste_etudiants",
            template: "templates/schools/liste_etudiants.html",
            templateLines: "Lignes 35-42",
            urlName: "schools:exporter_csv",
            urlPath: "/ecole/etudiants/csv/",
            viewHandler: "schools.views.exporter_csv",
            viewFile: "schools/views.py",
            viewLines: "Lignes 210-240",
            treatment: [
                "1. Contrôle d'accès `etablissement_autorise(request.user)`.",
                "2. Instancie un `csv.writer` avec encodage UTF-8 et BOM pour compatibilité Microsoft Excel.",
                "3. Itère sur les étudiants de l'école et écrit les colonnes : Nom, Prénom, Cursus, Nombre de candidatures, Stage Confirmé, Entreprise.",
                "4. Renvoie une `HttpResponse(csv_data, content_type='text/csv')`."
            ],
            codeSnippet: `response = HttpResponse(content_type="text/csv; charset=utf-8-sig")
response["Content-Disposition"] = 'attachment; filename="etudiants_3iL.csv"'
writer = csv.writer(response)
writer.writerow(["Nom", "Prénom", "Cursus", "Statut Stage", "Entreprise"])`,
            qa: {
                question: "« Où se trouve ce bouton d'export CSV dans l'interface et quelle fonction Python génère le fichier téléchargeable ? »",
                answer: "Ce bouton est dans <code>templates/schools/liste_etudiants.html (Lignes 35-42)</code>. La génération du fichier Excel/CSV avec toutes les colonnes requises est programmée dans <code>schools/views.py → exporter_csv (Lignes 210-240)</code>."
            }
        },

        // --- AUTH & PROFILE LABELS & BUTTONS ---
        "auth_input_email": {
            id: "auth_input_email",
            title: "Champ 'Adresse e-mail'",
            summary: "Champ de saisie de l'adresse e-mail de l'étudiant ou du responsable d'établissement.",
            type: "Champ de Formulaire Authentification",
            screen: "connexion",
            template: "templates/accounts/connexion.html",
            templateLines: "Lignes 30-36",
            urlName: "accounts:connexion",
            urlPath: "/comptes/connexion/",
            viewHandler: "accounts.views.connexion",
            viewFile: "accounts/views.py",
            viewLines: "Lignes 40-75",
            treatment: [
                "1. Champ de saisie typé `type='email'` avec validation HTML5 et nettoyage côté serveur `cleaned_data['email']`.",
                "2. Vérifie la présence du domaine académique ou du compte utilisateur actif.",
                "3. Protection contre les attaques par force brute via limitation de débit (rate-limiting)."
            ],
            codeSnippet: `<label for="id_email" class="auth-field-label">Adresse e-mail</label>
<input type="email" name="email" id="id_email" class="form-control" value="{{ form.email.value|default:'' }}" required>`,
            qa: {
                question: "« Dans quel fichier template ce champ e-mail se trouve-t-il et où contrôlez-vous le format de l'adresse ? »",
                answer: "Il est affiché dans <code>templates/accounts/connexion.html (Lignes 30-36)</code>. Le contrôle du format et la normalisation se font dans <code>accounts/forms.py → ConnexionForm</code>, assurant une saisie propre sans erreurs de frappe."
            }
        },

        "auth_input_password": {
            id: "auth_input_password",
            title: "Champ 'Mot de passe'",
            summary: "Champ sécurisé pour renseigner le mot de passe confidentiel avec masquage des caractères.",
            type: "Champ de Formulaire Secret",
            screen: "connexion",
            template: "templates/accounts/connexion.html",
            templateLines: "Lignes 38-44",
            urlName: "accounts:connexion",
            urlPath: "/comptes/connexion/",
            viewHandler: "accounts.views.connexion",
            viewFile: "accounts/views.py",
            viewLines: "Lignes 40-75",
            treatment: [
                "1. Champ masqué `type='password'` pour empêcher la lecture par dessus l'épaule.",
                "2. Transmis par HTTPS en POST avec en-tête CSRF.",
                "3. Comparé par hashage PBKDF2-SHA256 en mémoire sans jamais être persisté en clair."
            ],
            codeSnippet: `<label for="id_password" class="auth-field-label">Mot de passe</label>
<input type="password" name="password" id="id_password" class="form-control" required>`,
            qa: {
                question: "« Où est déclaré ce champ de mot de passe et comment garantissez-vous qu'il ne reste pas visible en cas d'erreur ? »",
                answer: "Il est défini dans <code>templates/accounts/connexion.html (Lignes 38-44)</code>. Côté Python, <code>accounts/forms.py</code> utilise le composant sécurisé Django <code>PasswordInput</code> qui vide systématiquement le champ pour protéger la confidentialité de l'utilisateur."
            }
        },

        "auth_link_register": {
            id: "auth_link_register",
            title: "Lien 'Créer un compte'",
            summary: "Lien guidant les nouveaux visiteurs vers la page de création de compte ou de demande d'adhésion école.",
            type: "Navigation Authentification",
            screen: "connexion",
            template: "templates/accounts/connexion.html",
            templateLines: "Ligne 52",
            urlName: "accounts:inscription_choix",
            urlPath: "/comptes/inscription/",
            viewHandler: "accounts.views.inscription_choix",
            viewFile: "accounts/views.py",
            viewLines: "Lignes 80-95",
            treatment: [
                "1. Redirige vers la page d'orientation d'inscription.",
                "2. Permet à l'utilisateur de choisir entre le parcours Étudiant 3iL et le parcours Établissement."
            ],
            codeSnippet: `<a href="{% url 'accounts:inscription_choix' %}" class="auth-link-register">Créer un compte</a>`,
            qa: {
                question: "« Où se trouve ce lien 'Créer un compte' et vers quelle vue Python dirige-t-il le nouvel arrivant ? »",
                answer: "Il se trouve dans <code>templates/accounts/connexion.html (Ligne 52)</code>. Il renvoie vers la vue <code>accounts/views.py → inscription_choix (Lignes 80-95)</code> pour guider l'utilisateur selon qu'il est étudiant ou représentant d'un établissement."
            }
        },

        "profile_btn_edit": {
            id: "profile_btn_edit",
            title: "Bouton 'Modifier mon profil'",
            summary: "Ouvre le formulaire de mise à jour des coordonnées, formations et compétences professionnelles de l'étudiant.",
            type: "Action Formulaire Étudiant",
            screen: "mon_profil",
            template: "templates/accounts/profil.html",
            templateLines: "Ligne 85",
            urlName: "accounts:modifier_profil",
            urlPath: "/comptes/profil/modifier/",
            viewHandler: "accounts.views.modifier_profil",
            viewFile: "accounts/views.py",
            viewLines: "Lignes 320-375",
            treatment: [
                "1. Charge les formsets pour les compétences, expériences et formations 3iL.",
                "2. Valide la saisie atomiquement au sein d'une transaction `transaction.atomic()`.",
                "3. Invalide le cache du CV principal pour forcer la régénération."
            ],
            codeSnippet: `<a href="{% url 'accounts:modifier_profil' %}" class="bouton-accounts">Modifier mon profil</a>`,
            qa: {
                question: "« Où se trouve ce bouton de modification du profil et dans quel fichier Python traitez-vous l'enregistrement des modifications ? »",
                answer: "Le bouton est dans <code>templates/accounts/profil.html (Ligne 85)</code>. L'enregistrement des nouvelles données est pris en charge dans <code>accounts/views.py → modifier_profil (Lignes 320-375)</code>."
            }
        },

        "cv_btn_download_pdf": {
            id: "cv_btn_download_pdf",
            title: "Bouton 'Télécharger le CV PDF'",
            summary: "Télécharge directement le fichier PDF du CV généré sur l'ordinateur ou le téléphone de l'utilisateur.",
            type: "Flux de Téléchargement Supabase",
            screen: "mon_cv",
            template: "templates/accounts/mon_cv.html",
            templateLines: "Lignes 65-70",
            urlName: "accounts:telecharger_cv",
            urlPath: "/comptes/cv/telecharger/",
            viewHandler: "accounts.views.telecharger_cv",
            viewFile: "accounts/views.py",
            viewLines: "Lignes 580-610",
            treatment: [
                "1. Vérifie l'existence du fichier PDF généré sur Supabase Storage.",
                "2. Ouvre un flux de lecture direct et renvoie un `FileResponse` avec en-tête `attachment` pour forcer le téléchargement.",
                "3. Nomme le fichier selon la convention `CV_Nom_Prenom_3iL.pdf`."
            ],
            codeSnippet: `return FileResponse(cv.fichier.open('rb'), as_attachment=True, filename=f"CV_{profil.utilisateur.last_name}_{profil.utilisateur.first_name}.pdf")`,
            qa: {
                question: "« Où se trouve ce bouton de téléchargement de CV et dans quelle vue Python transmettez-vous le fichier à l'utilisateur ? »",
                answer: "Il est dans <code>templates/accounts/mon_cv.html (Lignes 65-70)</code>. Le fichier est transmis par la vue <code>accounts/views.py → telecharger_cv (Lignes 580-610)</code>."
            }
        },

        "cv_btn_valider_groq": {
            id: "cv_btn_valider_groq",
            title: "Bouton 'Valider et enregistrer cette version' (Groq)",
            summary: "Permet à l'étudiant de valider la proposition de CV adaptée par l'IA pour l'utiliser lors de ses candidatures.",
            type: "Persistance Proposition IA",
            screen: "mon_cv",
            template: "templates/accounts/mon_cv.html",
            templateLines: "Ligne 48",
            urlName: "accounts:valider_cv_adapte",
            urlPath: "/comptes/cv/valider-adapte/",
            viewHandler: "accounts.views.valider_cv_adapte",
            viewFile: "accounts/views.py",
            viewLines: "Lignes 620-660",
            treatment: [
                "1. Récupère la proposition de compétences filtrée par le modèle Groq LLaMA 3.1.",
                "2. Génère un nouveau fichier PDF adapté avec ReportLab Canvas.",
                "3. Enregistre l'instance `CVAdapte` rattachée à l'offre de stage ciblée."
            ],
            codeSnippet: `cv_adapte, _ = CVAdapte.objects.update_or_create(profil=profil, offre=offre, defaults={'fichier': pdf_content})`,
            qa: {
                question: "« Dans quel fichier template ce bouton de validation se trouve-t-il et où enregistrez-vous cette version de CV ? »",
                answer: "Le bouton est dans <code>templates/accounts/mon_cv.html (Ligne 48)</code>. L'enregistrement de la version retenue est réalisé dans <code>accounts/views.py → valider_cv_adapte (Lignes 620-660)</code>."
            }
        },

        "cv_select_version": {
            id: "cv_select_version",
            title: "Sélecteur 'CV pour cette offre'",
            summary: "Menu permettant à l'étudiant de choisir quel CV joindre à sa candidature (CV principal ou CV adapté par l'IA).",
            type: "Choix de Document Postulation",
            screen: "detail_offre",
            template: "templates/offers/detail_offre.html",
            templateLines: "Lignes 88-95",
            urlName: "offers:detail_offre",
            urlPath: "/offres/<pk>/",
            viewHandler: "offers.views.detail_offre",
            viewFile: "offers/views.py",
            viewLines: "Lignes 180-225",
            treatment: [
                "1. Détecte la présence d'un `CVPrincipal` et d'un éventuel `CVAdapte` pour l'offre active.",
                "2. Propose à l'étudiant de choisir le CV le plus pertinent avant de postuler.",
                "3. Met à jour dynamiquement la référence dans le formulaire POST."
            ],
            codeSnippet: `<select id="cv_choisi" name="cv_choisi">
    <option value="PRINCIPAL">CV principal</option>
    {% if cv_adapte %}<option value="ADAPTE" selected>CV adapté pour cette offre</option>{% endif %}
</select>`,
            qa: {
                question: "« Dans quel template ce choix de CV est-il proposé et où est mémorisée la version choisie par l'étudiant ? »",
                answer: "Ce sélecteur est dans <code>templates/offers/detail_offre.html (Lignes 88-95)</code>. Le choix est traité lors de la candidature dans <code>applications/views.py → postuler (Lignes 110-135)</code> pour figer la bonne version du CV."
            }
        },

        "cv_btn_select_version": {
            id: "cv_btn_select_version",
            title: "Bouton 'Choisir ce CV'",
            summary: "Valide le choix du document à utiliser pour postuler à cette opportunité de stage.",
            type: "Action Validation Pré-Postulation",
            screen: "detail_offre",
            template: "templates/offers/detail_offre.html",
            templateLines: "Ligne 96",
            urlName: "N/A (Interface Utilisateur)",
            urlPath: "/offres/<pk>/",
            viewHandler: "offers.views.detail_offre",
            viewFile: "offers/views.py",
            viewLines: "Lignes 180-225",
            treatment: [
                "1. Enregistre en mémoire de session le choix du CV pour cette offre.",
                "2. Affiche un statut vert de confirmation pour rassurer le candidat."
            ],
            codeSnippet: `<button class="bouton bouton-accepter" type="button">Choisir ce CV</button>`,
            qa: {
                question: "« Où se trouve ce bouton de sélection de CV et dans quelle vue enregistrez-vous ce choix ? »",
                answer: "Il se situe dans <code>templates/offers/detail_offre.html (Ligne 96)</code>. Il permet de confirmer la version du CV avant de cliquer sur 'Envoyer ma candidature'."
            }
        },

        "detail_btn_external_apply": {
            id: "detail_btn_external_apply",
            title: "Bouton 'Postuler à cette offre' (Portail Recruteur Externe)",
            summary: "Lien ouvrant directement le portail de candidature sur le site officiel de l'entreprise recruteuse.",
            type: "Lien Externe Sécurisé",
            screen: "detail_offre",
            template: "templates/offers/detail_offre.html",
            templateLines: "Lignes 104-108",
            urlName: "offers:redirection_externe",
            urlPath: "https://thales.wd3.myworkdayjobs.com/...",
            viewHandler: "Template Direct",
            viewFile: "templates/offers/detail_offre.html",
            viewLines: "Ligne 105",
            treatment: [
                "1. Ouvre l'URL officielle de l'entreprise dans un nouvel onglet avec `rel='noopener noreferrer'`.",
                "2. Protège la session utilisateur contre le vol de contexte ou les attaques Tabnabbing.",
                "3. Permet à l'étudiant de déposer son CV téléchargé sur le portail de recrutement de l'entreprise."
            ],
            codeSnippet: `<a class="bouton bouton-postuler bouton-accepter" href="{{ offre.url_postulation }}" target="_blank" rel="noopener noreferrer">Postuler à cette offre</a>`,
            qa: {
                question: "« Où se trouve ce lien vers le site recruteur dans le code et comment est-il sécurisé ? »",
                answer: "Il est déclaré dans <code>templates/offers/detail_offre.html (Lignes 104-108)</code>. Il ouvre l'URL officielle de l'entreprise dans un nouvel onglet avec les protections nécessaires pour la sécurité de l'étudiant."
            }
        },

        "app_filter_tab_all": {
            id: "app_filter_tab_all",
            title: "Filtre 'Toutes' (Mes Candidatures)",
            summary: "Onglet affichant l'ensemble des candidatures de l'étudiant sans restriction de statut.",
            type: "Filtre Statut Client/Serveur",
            screen: "mes_candidatures",
            template: "templates/applications/mes_candidatures.html",
            templateLines: "Ligne 24",
            urlName: "applications:mes_candidatures",
            urlPath: "/candidatures/?statut=tous",
            viewHandler: "applications.views.mes_candidatures",
            viewFile: "applications/views.py",
            viewLines: "Lignes 45-60",
            treatment: [
                "1. Réinitialise le filtre d'état pour lister toutes les candidatures de l'étudiant.",
                "2. Affiche le compteur total (ex: 10 dossiers)."
            ],
            codeSnippet: `<a href="{% url 'applications:mes_candidatures' %}" class="filter-tab-btn active">Toutes <span class="tab-count">{{ total }}</span></a>`,
            qa: {
                question: "« Où se trouve cet onglet 'Toutes' dans vos fichiers et quelle vue prépare cette liste ? »",
                answer: "Il est dans <code>templates/applications/mes_candidatures.html (Ligne 24)</code>. La liste globale est préparée par <code>applications/views.py → mes_candidatures (Lignes 45-60)</code>."
            }
        },

        "app_filter_tab_favorites": {
            id: "app_filter_tab_favorites",
            title: "Filtre '★ Favoris' (Mes Candidatures)",
            summary: "Filtre affichant uniquement les candidatures marquées comme prioritaires ou favorites par l'étudiant.",
            type: "Filtre Booléen",
            screen: "mes_candidatures",
            template: "templates/applications/mes_candidatures.html",
            templateLines: "Ligne 25",
            urlName: "applications:mes_candidatures",
            urlPath: "/candidatures/?favoris=1",
            viewHandler: "applications.views.mes_candidatures",
            viewFile: "applications/views.py",
            viewLines: "Lignes 61-70",
            treatment: [
                "1. Filtre les candidatures marquées du flag `est_favori=True`.",
                "2. Permet à l'étudiant de prioriser les offres sur lesquelles il a des relances prévues."
            ],
            codeSnippet: `if request.GET.get("favoris") == "1":
    candidatures = candidatures.filter(est_favori=True)`,
            qa: {
                question: "« Où se situe ce filtre des favoris dans le template et comment la vue Python sélectionne-t-elle ces offres ? »",
                answer: "L'onglet est dans <code>templates/applications/mes_candidatures.html (Ligne 25)</code>. Dans <code>applications/views.py → mes_candidatures (Lignes 61-70)</code>, le code ne retient que les candidatures où l'étoile favori est cochée."
            }
        },

        "app_filter_tab_accepted": {
            id: "app_filter_tab_accepted",
            title: "Filtre '✓ Acceptées' (Mes Candidatures)",
            summary: "Filtre mettant en avant les candidatures ayant reçu une réponse positive de l'employeur.",
            type: "Filtre Statut",
            screen: "mes_candidatures",
            template: "templates/applications/mes_candidatures.html",
            templateLines: "Ligne 26",
            urlName: "applications:mes_candidatures",
            urlPath: "/candidatures/?statut=ACCEPTEE",
            viewHandler: "applications.views.mes_candidatures",
            viewFile: "applications/views.py",
            viewLines: "Lignes 50-60",
            treatment: [
                "1. Filtre les candidatures ayant reçu une réponse positive de l'entreprise.",
                "2. Met en valeur les opportunités prêtes pour la confirmation officielle de stage."
            ],
            codeSnippet: `candidatures = candidatures.filter(statut=Candidature.Statut.ACCEPTEE)`,
            qa: {
                question: "« Dans quel template ce filtre 'Acceptées' est-il codé et quelle fonction Python gère ce statut ? »",
                answer: "Il est dans <code>templates/applications/mes_candidatures.html (Ligne 26)</code>. Il filtre les dossiers sur le statut 'ACCEPTÉE' via <code>applications/views.py → mes_candidatures (Lignes 50-60)</code>."
            }
        },

        "app_filter_tab_pending": {
            id: "app_filter_tab_pending",
            title: "Filtre '⏳ En attente' (Mes Candidatures)",
            summary: "Filtre isolant les candidatures toujours en cours d'examen auprès des services RH.",
            type: "Filtre Statut",
            screen: "mes_candidatures",
            template: "templates/applications/mes_candidatures.html",
            templateLines: "Ligne 27",
            urlName: "applications:mes_candidatures",
            urlPath: "/candidatures/?statut=ENVOYEE",
            viewHandler: "applications.views.mes_candidatures",
            viewFile: "applications/views.py",
            viewLines: "Lignes 50-60",
            treatment: [
                "1. Isole les dossiers en cours d'instruction par les recruteurs.",
                "2. Permet de surveiller les délais de réponse pour relancer les entreprises."
            ],
            codeSnippet: `candidatures = candidatures.filter(statut=Candidature.Statut.ENVOYEE)`,
            qa: {
                question: "« Où se trouve ce filtre 'En attente' dans le code et quelle vue Python permet de suivre ces dossiers ? »",
                answer: "Il est situé dans <code>templates/applications/mes_candidatures.html (Ligne 27)</code>. La vue <code>applications/views.py → mes_candidatures</code> isole ces démarches pour faciliter les relances de l'étudiant."
            }
        },

        "app_filter_tab_refused": {
            id: "app_filter_tab_refused",
            title: "Filtre '✕ Refusées' (Mes Candidatures)",
            summary: "Filtre regroupant les réponses non retenues pour garder un historique complet et transparent.",
            type: "Filtre Statut",
            screen: "mes_candidatures",
            template: "templates/applications/mes_candidatures.html",
            templateLines: "Ligne 28",
            urlName: "applications:mes_candidatures",
            urlPath: "/candidatures/?statut=REFUSEE",
            viewHandler: "applications.views.mes_candidatures",
            viewFile: "applications/views.py",
            viewLines: "Lignes 50-60",
            treatment: [
                "1. Affiche les retours négatifs reçus.",
                "2. Permet à l'étudiant de comprendre ses axes d'amélioration en révisant les compétences demandées."
            ],
            codeSnippet: `candidatures = candidatures.filter(statut=Candidature.Statut.REFUSEE)`,
            qa: {
                question: "« Où est placé ce filtre des candidatures refusées et dans quel fichier gérez-vous cet historique ? »",
                answer: "Il est dans <code>templates/applications/mes_candidatures.html (Ligne 28)</code>. L'historique est conservé dans <code>applications/views.py → mes_candidatures</code> pour la traçabilité de l'étudiant et de l'école."
            }
        },

        "app_select_period": {
            id: "app_select_period",
            title: "Sélecteur 'Période' (Mes Candidatures)",
            summary: "Permet de filtrer l'affichage des démarches selon la période d'envoi (ex: 30 derniers jours, 3 derniers mois).",
            type: "Filtre Temporel",
            screen: "mes_candidatures",
            template: "templates/applications/mes_candidatures.html",
            templateLines: "Lignes 35-42",
            urlName: "applications:mes_candidatures",
            urlPath: "/candidatures/?periode=...",
            viewHandler: "applications.views.mes_candidatures",
            viewFile: "applications/views.py",
            viewLines: "Lignes 71-85",
            treatment: [
                "1. Filtre par tranche chronologique (7 derniers jours, 30 derniers jours, Toutes).",
                "2. Construit une requête avec `date_candidature__gte=date_seuil`."
            ],
            codeSnippet: `if periode == "7":
    date_seuil = timezone.now() - datetime.timedelta(days=7)
    candidatures = candidatures.filter(date_candidature__gte=date_seuil)`,
            qa: {
                question: "« Dans quel template ce sélecteur de période se trouve-t-il et où filtrez-vous les dates dans le code Python ? »",
                answer: "Il est dans <code>templates/applications/mes_candidatures.html (Lignes 35-42)</code>. Le calcul des dates est fait dans <code>applications/views.py → mes_candidatures (Lignes 71-85)</code>."
            }
        },

        "school_kpi_confirmed": {
            id: "school_kpi_confirmed",
            title: "KPI 'Stages confirmés' (Espace École)",
            summary: "Indicateur stratégique pour l'école 3iL indiquant le nombre d'étudiants ayant officiellement validé leur stage.",
            type: "Composant Statistique Dashboard École",
            screen: "tableau_de_bord_ecole",
            template: "templates/schools/tableau_de_bord.html",
            templateLines: "Lignes 32-40",
            urlName: "schools:tableau_de_bord",
            urlPath: "/ecole/tableau-de-bord/",
            viewHandler: "schools.views.tableau_de_bord",
            viewFile: "schools/views.py",
            viewLines: "Lignes 40-75",
            treatment: [
                "1. Calcule le nombre total d'élèves ingénieurs ayant validé leur intégration officielle.",
                "2. Présente le pourcentage d'insertion validée de la promotion.",
                "3. Badge doré étoilé `#D97706`."
            ],
            codeSnippet: `nb_confirmes = Candidature.objects.filter(etudiant__etablissement=ecole, stage_confirme=True).values('etudiant').distinct().count()`,
            qa: {
                question: "« Où se trouve ce KPI des stages confirmés dans l'espace école et quelle fonction Python calcule ce résultat ? »",
                answer: "Il est dans <code>templates/schools/tableau_de_bord.html (Lignes 32-40)</code>. Le calcul est effectué dans <code>schools/views.py → tableau_de_bord (Lignes 40-75)</code> pour donner au responsable des stages de 3iL le nombre exact d'étudiants ayant sécurisé leur convention."
            }
        },

        "school_kpi_accepted": {
            id: "school_kpi_accepted",
            title: "KPI 'Offres acceptées' (Espace École)",
            summary: "Compteur montrant les offres acceptées par les entreprises mais pas encore définitivement confirmées par les étudiants.",
            type: "Composant Statistique Dashboard École",
            screen: "tableau_de_bord_ecole",
            template: "templates/schools/tableau_de_bord.html",
            templateLines: "Lignes 42-50",
            urlName: "schools:tableau_de_bord",
            urlPath: "/ecole/tableau-de-bord/",
            viewHandler: "schools.views.tableau_de_bord",
            viewFile: "schools/views.py",
            viewLines: "Lignes 40-75",
            treatment: [
                "1. Détecte les étudiants ayant au moins une promesse ou offre acceptée par une entreprise.",
                "2. Précède la confirmation officielle par mot de passe."
            ],
            codeSnippet: `nb_acceptes = Candidature.objects.filter(etudiant__etablissement=ecole, statut=Candidature.Statut.ACCEPTEE).values('etudiant').distinct().count()`,
            qa: {
                question: "« Dans quel template ce compteur école est-il présent et où est traitée cette statistique dans le code Python ? »",
                answer: "Il est affiché dans <code>templates/schools/tableau_de_bord.html (Lignes 42-50)</code>. Le comptage est exécuté dans <code>schools/views.py → tableau_de_bord (Lignes 40-75)</code> pour permettre à l'école de relancer les étudiants concernés."
            }
        },

        "school_kpi_pending": {
            id: "school_kpi_pending",
            title: "KPI 'En attente de stage' (Espace École)",
            summary: "Indicateur crucial pour l'école listant les étudiants toujours en recherche active pour leur apporter un accompagnement.",
            type: "Composant Statistique Dashboard École",
            screen: "tableau_de_bord_ecole",
            template: "templates/schools/tableau_de_bord.html",
            templateLines: "Lignes 52-60",
            urlName: "schools:tableau_de_bord",
            urlPath: "/ecole/tableau-de-bord/",
            viewHandler: "schools.views.tableau_de_bord",
            viewFile: "schools/views.py",
            viewLines: "Lignes 40-75",
            treatment: [
                "1. Isole les étudiants qui n'ont encore aucune offre acceptée.",
                "2. Identifie les élèves prioritaires pour du coaching CV ou des recommandations de stages ciblées."
            ],
            codeSnippet: `nb_en_recherche = effectif_total - nb_confirmes`,
            qa: {
                question: "« Où est situé ce compteur des étudiants en attente de stage et quelle vue Python permet à l'école de les identifier ? »",
                answer: "Il est dans <code>templates/schools/tableau_de_bord.html (Lignes 52-60)</code>. La vue <code>schools/views.py → tableau_de_bord</code> identifie ces étudiants pour que l'équipe pédagogique puisse leur proposer un tutorat ciblé."
            }
        },

        "school_kpi_refused": {
            id: "school_kpi_refused",
            title: "KPI 'Candidatures refusées' (Espace École)",
            summary: "Totalise les réponses négatives reçues par les étudiants pour mesurer les difficultés et adapter l'aide proposée.",
            type: "Composant Statistique Dashboard École",
            screen: "tableau_de_bord_ecole",
            template: "templates/schools/tableau_de_bord.html",
            templateLines: "Lignes 62-70",
            urlName: "schools:tableau_de_bord",
            urlPath: "/ecole/tableau-de-bord/",
            viewHandler: "schools.views.tableau_de_bord",
            viewFile: "schools/views.py",
            viewLines: "Lignes 40-75",
            treatment: [
                "1. Agrège le volume de réponses négatives reçues au niveau de l'établissement.",
                "2. Permet d'ajuster le catalogue de compétences enseignées face aux exigences du marché."
            ],
            codeSnippet: `nb_refus = Candidature.objects.filter(etudiant__etablissement=ecole, statut=Candidature.Statut.REFUSEE).count()`,
            qa: {
                question: "« Où se trouve ce compteur dans le tableau de bord école et dans quel fichier Python calculez-vous cette donnée ? »",
                answer: "Il est dans <code>templates/schools/tableau_de_bord.html (Lignes 62-70)</code>. Il est calculé dans <code>schools/views.py → tableau_de_bord (Lignes 40-75)</code> afin d'offrir une vision globale de la dynamique de recherche des promotions."
            }
        }
    },

    // -------------------------------------------------------------------------
    // 2. ARCHITECTURE & COMPREHENSIVE TECH STACK (Exhaustive & Justified)
    // -------------------------------------------------------------------------
    guideArchitecture: [
        {
            category: "🏗️ Backend & Moteur d'Exécution",
            color: "#6366f1",
            items: [
                {
                    name: "Python 3.12",
                    type: "Langage & Runtime Typé",
                    icon: "🐍",
                    role: "Langage hôte exécutant le serveur web, le moteur de templates, l'ORM et la génération vectorielle de documents.",
                    justification: "Amélioration des performances d'exécution (+25% par rapport à 3.10), pattern matching expressif, gestion native des types stricts (typing) et compatibilité parfaite avec l'écosystème IA et manipulation PDF.",
                    tags: ["C-Python 3.12", "Typage Statique", "Haute Performance", "GIL Optimisé"]
                },
                {
                    name: "Django 6.1.1 / 5",
                    type: "Framework Full-Stack MVT",
                    icon: "⚡",
                    role: "Ossature applicative globale : routage HTTP, ORM relationnel, authentification native, gestion de sessions, formulaires CSRF et administration.",
                    justification: "Approche 'Batteries Included' apportant une sécurité native de niveau bancaire (protection CSRF/XSS/SQLi automatique), une productivité maximale sans dette technique, et une maintenabilité éprouvée sans framework JS lourd.",
                    tags: ["Pattern MVT", "Django ORM", "Admin Prêt à l'Emploi", "Batteries Included"]
                },
                {
                    name: "Asgiref 3.12",
                    type: "Passerelle Asynchrone ASGI",
                    icon: "🔄",
                    role: "Adaptateur et spécification d'interface asynchrone (ASGI) garantissant la compatibilité des coroutines et des flux synchrones/asynchrones.",
                    justification: "Permet au noyau Django de dialoguer de manière transparente avec des serveurs asynchrones (Uvicorn/Daphne) et prépare l'application aux futures communications WebSocket temps réel.",
                    tags: ["ASGI 3.0", "Async/Sync Bridge", "Thread Safety"]
                },
                {
                    name: "Sqlparse 0.6",
                    type: "Analyseur Lexical & Moteur SQL",
                    icon: "🔍",
                    role: "Inspection, indentation et formattage lexical des requêtes SQL générées par l'ORM Django.",
                    justification: "Indispensable pour l'analyse des requêtes lors des tests automatisés, le débogage fin des jointures et la surveillance des performances (détection des requêtes N+1 et analyse des plans d'exécution).",
                    tags: ["SQL Tokenizer", "Query Debugging", "Zéro Dépendance C"]
                }
            ]
        },
        {
            category: "🗄️ Persistance & Données Relationnelles",
            color: "#0284c7",
            items: [
                {
                    name: "PostgreSQL 15+ (Supabase)",
                    type: "SGBDR Production ACID",
                    icon: "🐘",
                    role: "Stockage relationnel principal hébergeant les comptes, profils étudiants, établissements, offres d'emploi, candidatures et verrous de synchronisation.",
                    justification: "Conformité ACID stricte, intégrité référentielle rigoureuse, transactions concurrentes avec verrous de lignes fins (SELECT FOR UPDATE) et montée en charge sans faille pour la production hébergée sur Supabase.",
                    tags: ["ACID Compliant", "Row-Level Locking", "SSL Required", "Supabase Cloud"]
                },
                {
                    name: "Psycopg 3.3.6 (psycopg3)",
                    type: "Driver PostgreSQL Haute Performance",
                    icon: "🔌",
                    role: "Pilote réseau et protocole binaire reliant le runtime Python/Django à la base de données PostgreSQL.",
                    justification: "Réécriture moderne en C/Python avec support natif du pipeline binaire, pool de connexions asynchrones, requêtes préparées côté serveur et chiffrement obligatoire (sslmode=require).",
                    tags: ["Protocole Binaire", "SSL/TLS Forcé", "Connection Pooling"]
                },
                {
                    name: "SQLite 3",
                    type: "Base Embarquée In-Memory (Dev/Test)",
                    icon: "🗃️",
                    role: "Moteur de base de données relationnelle locale et support exclusif de la suite de 110 tests unitaires et d'intégration.",
                    justification: "Vitesse d'exécution fulgurante en mémoire vive (RAM), zéro configuration de serveur pour les développeurs, et étanchéité totale : les migrations Django s'appliquent identiquement sur SQLite et PostgreSQL sans changer une seule ligne de code métier.",
                    tags: ["Zéro Configuration", "110 Tests In-Memory", "Exécution Instantanée"]
                }
            ]
        },
        {
            category: "☁️ Stockage Sécurisé & Cloud Déporté",
            color: "#10b981",
            items: [
                {
                    name: "Supabase Storage (API S3)",
                    type: "Stockage d'Objets Cloud Privé",
                    icon: "📦",
                    role: "Hébergement sécurisé des fichiers binaires PDF : CV principaux générés et copies figées des candidatures.",
                    justification: "Compartimentation en bucket privé ('cv-principaux') totalement invisible du Web public. Zéro risque de fuite de données personnelles (RGPD). Les fichiers ne sont servis que via le serveur Django après authentification.",
                    tags: ["S3 Compatible", "Bucket Privé", "Conformité RGPD", "Partitionnement UUID"]
                },
                {
                    name: "Django Storage Adapter (`storage.py`)",
                    type: "Connecteur Custom Django Storage",
                    icon: "🛡️",
                    role: "Pilote sur-mesure intégrant la clé maîtresse serveur (SERVICE_ROLE) pour téléverser, lire et purger les PDF obsolètes.",
                    justification: "Implémente l'interface native Django `Storage` (`_save`, `delete`, `open`) avec gestion automatique de l'obsolescence : lorsqu'un étudiant met à jour son CV, l'ancien fichier est immédiatement supprimé sur Supabase.",
                    tags: ["Service Role Auth", "Purge Automatique", "Zéro Clé Côté Client"]
                }
            ]
        },
        {
            category: "🤖 Intelligence Artificielle & Traitement du Langage",
            color: "#8b5cf6",
            items: [
                {
                    name: "Groq Cloud (LPUs Hardware)",
                    type: "Inférence Matérielle Ultra-Rapide",
                    icon: "🚀",
                    role: "Infrastructure matérielle d'accélération d'IA générative fournissant un débit de plusieurs centaines de tokens par seconde.",
                    justification: "Temps de latence quasi imperceptible (~200ms) pour analyser des descriptions d'offres de stage et scorer la compatibilité sémantique, éliminant les temps d'attente utilisateur constatés sur les GPU traditionnels.",
                    tags: ["LPUs Groq", "Latence ~200ms", "Débit 500 T/s"]
                },
                {
                    name: "Meta LLaMA 3.1 70B",
                    type: "Modèle de Langage de Pointe",
                    icon: "🧠",
                    role: "Analyse sémantique des offres de stage, comparaison avec le profil étudiant et sélection des rubriques de CV les plus percutantes.",
                    justification: "Capacité de raisonnement supérieure pour comprendre les synonymes techniques (ex: 'Django' et 'Backend Python'), pondérer l'expérience et suggérer des correspondances précises.",
                    tags: ["LLaMA 3.1 70B", "Scoring Sémantique", "Compréhension IT"]
                },
                {
                    name: "JSON Mode & Whitelist Stricte",
                    type: "Protocole Anti-Hallucination",
                    icon: "🔒",
                    role: "Contrainte de sortie JSON déterministe forçant l'IA à n'utiliser QUE les identifiants réels de la BDD ('c:1', 'p:2').",
                    justification: "Garantie absolue d'intégrité : la fonction `selection_cv_validee()` rejette immédiatement toute réponse contenant une compétence que l'étudiant ne possède pas. Impossible pour l'IA d'inventer des diplômes.",
                    tags: ["Mode JSON Strict", "Whitelist Identifiants", "Zéro Hallucination"]
                }
            ]
        },
        {
            category: "🌐 APIs Externes & Agrégation d'Offres",
            color: "#f59e0b",
            items: [
                {
                    name: "JSearch REST API (OpenWeb Ninja)",
                    type: "Agrégateur International d'Emplois",
                    icon: "🌐",
                    role: "Collecte en temps réel d'annonces de stage fraîches publiées sur LinkedIn, Indeed, Welcome to the Jungle et Glassdoor.",
                    justification: "API unifiée REST v2 avec pagination par curseur, filtres par pays ('fr') et type de contrat ('INTERN'), évitant d'écrire des scrapers fragiles et illégaux.",
                    tags: ["REST v2", "Cursor Pagination", "Agrégation Multi-Sources"]
                },
                {
                    name: "France Travail API (Pôle Emploi)",
                    type: "Liaison Institutionnelle Publique",
                    icon: "🏛️",
                    role: "Connecteur vers les référentiels publics officiels de métiers et les offres conventionnées.",
                    justification: "Garantit la conformité avec les nomenclatures ROME françaises et offre une alternative souveraine aux jobboards privés pour les stages en secteur public.",
                    tags: ["OAuth2 Client Credentials", "Nomenclature ROME", "Secteur Public"]
                },
                {
                    name: "Requests 2.34 & Urllib3",
                    type: "Client HTTP Synchrone Résilient",
                    icon: "📡",
                    role: "Gestion des appels réseau vers Groq, Supabase et OpenWeb Ninja avec en-têtes, timeouts et gestion d'erreurs.",
                    justification: "Timeouts stricts de 15 secondes pour empêcher les requêtes zombies, vérification SSL des certificats CA et extraction du délai `Retry-After` sur code HTTP 429.",
                    tags: ["Timeout 15s", "Retry-After 429", "Vérification TLS"]
                }
            ]
        },
        {
            category: "🎨 Frontend, UI & Restitution Vectorielle",
            color: "#ec4899",
            items: [
                {
                    name: "ReportLab 4.x (Canvas A4)",
                    type: "Moteur Vectoriel Typographique Python",
                    icon: "📄",
                    role: "Génération directe du PDF à deux colonnes avec coordonnées millimétriques, bandeau coloré et typographie Helvetica.",
                    justification: "Texte 100% sélectionnable, indexable par les logiciels ATS de recrutement, poids plume (~25 Ko par CV), et zéro dépendance système externe (pas besoin de Node.js, Chromium ou wkhtmltopdf).",
                    tags: ["Canvas Vectoriel A4", "Texte Sélectionnable ATS", "Poids ~25 Ko", "Zéro Binaire Externe"]
                },
                {
                    name: "Vanilla CSS 3 & Glassmorphism",
                    type: "Design System Personnalisé",
                    icon: "🎨",
                    role: "Habillage moderne de l'ensemble de la plateforme : variables CSS (`--sp-*`), mode sombre/clair dynamique, flous d'arrière-plan et animations.",
                    justification: "Zéro temps de compilation (pas de Webpack/Vite requis), flexibilité totale, rendu instantané par le navigateur et légèreté absolue par rapport à des frameworks CSS surdimensionnés.",
                    tags: ["Variables CSS3", "Dark/Light Modes", "Glassmorphism", "Zéro Build"]
                },
                {
                    name: "Bootstrap 5.3 (Grille & Utilitaires)",
                    type: "Grille Responsive Flexbox",
                    icon: "📐",
                    role: "Structure de mise en page réactive (grille 12 colonnes, conteneurs fluides, utilitaires de flexbox et espacements).",
                    justification: "Garantit une adaptabilité parfaite sur mobile, tablette et écrans 4K sans réinventer les règles de base de layout responsive.",
                    tags: ["Grille 12 Colonnes", "Flexbox", "Responsive Design"]
                },
                {
                    name: "FontAwesome 6 Free",
                    type: "Bibliothèque d'Iconographie Vectorielle",
                    icon: "✨",
                    role: "Représentation visuelle des états de candidature, indicateurs KPI, actions de profil et navigation.",
                    justification: "Lisibilité visuelle instantanée pour les étudiants et tuteurs d'école, support SVG net sur les écrans haute densité (Retina).",
                    tags: ["Vector Icons", "Retina Ready", "Accessibilité"]
                }
            ]
        },
        {
            category: "🛡️ Sécurité, Environnement & Qualité Logicielle",
            color: "#14b8a6",
            items: [
                {
                    name: "Python-Dotenv 1.2.3",
                    type: "Gestionnaire de Secrets Twelve-Factor",
                    icon: "🔑",
                    role: "Chargement sécurisé des variables d'environnement (`.env`) au démarrage du serveur.",
                    justification: "Application stricte du principe Twelve-Factor App : aucune clé sensible (`SECRET_KEY`, `GROQ_API_KEY`, `SUPABASE_KEY`) n'est codée en dur dans le dépôt Git.",
                    tags: ["Twelve-Factor App", "Isolation des Clés", "Fichier .env Protégé"]
                },
                {
                    name: "PBKDF2 avec SHA-256 (Django Auth)",
                    type: "Algorithme Cryptographique de Mots de Passe",
                    icon: "🔒",
                    role: "Hachage sécurisé et salage individuel des mots de passe des comptes étudiants et écoles.",
                    justification: "Standard recommandé par le NIST et l'ANSSI. Résiste aux attaques par dictionnaires et tables arc-en-ciel grâce à des centaines de milliers d'itérations de calcul.",
                    tags: ["Salage Cryptographique", "NIST Compliant", "Anti Rainbow Table"]
                },
                {
                    name: "Django Test Runner (110 Tests)",
                    type: "Suite d'Intégration & de Tests Unitaires",
                    icon: "🧪",
                    role: "Validation automatisée de la sécurité RBAC, des règles métier, de la non-régression et de la génération de CV.",
                    justification: "Permet de refactorer en toute confiance. 110 tests exécutés en moins de 15 secondes sur base SQLite en mémoire.",
                    tags: ["110 Tests Passants", "CI/CD Ready", "Zéro Régression"]
                }
            ]
        }
    ],

    // -------------------------------------------------------------------------
    // 3. PROJECT FOLDERS & FILES (VS Code Interactive Tree Structure)
    // -------------------------------------------------------------------------
    projectFolders: [
        {
            id: "folder_accounts",
            name: "accounts/",
            title: "accounts",
            badge: "Comptes, Profils, CV & Sécurité",
            icon: "📁",
            desc: "Gestion complète du cycle de vie des utilisateurs : authentification multi-rôles, profils étudiants avec formsets imbriqués, moteur de CV ReportLab et stockage Supabase.",
            files: [
                {
                    path: "accounts/access.py",
                    name: "access.py",
                    type: "py",
                    category: "Sécurité & Contrôle d'Accès",
                    analogy: "Le Vigile VIP",
                    analogyDesc: "Le garde posté à l'entrée du salon privé : si le badge de l'école n'a pas été tamponné par la direction, l'accès aux étudiants est formellement bloqué.",
                    desc: "Vérifie l'approbation préfectorale de l'établissement avant d'autoriser l'accès aux dossiers des étudiants (anti-IDOR).",
                    keySymbols: "etablissement_autorise(utilisateur)"
                },
                {
                    path: "accounts/admin.py",
                    name: "admin.py",
                    type: "py",
                    category: "Administration Django",
                    analogy: "Le Bureau du Directeur Général",
                    analogyDesc: "L'interface centrale réservée aux super-administrateurs pour valider les demandes de compte école et modérer les comptes.",
                    desc: "Déclare les modèles Utilisateur, DemandeCompteEcole et ProfilEtudiant dans l'interface d'administration Django.",
                    keySymbols: "UtilisateurAdmin, DemandeCompteEcoleAdmin"
                },
                {
                    path: "accounts/apps.py",
                    name: "apps.py",
                    type: "py",
                    category: "Configuration Django",
                    analogy: "L'Acte de Naissance du Module",
                    analogyDesc: "Le document officiel qui enregistre l'application auprès du noyau central de Django.",
                    desc: "Configuration de l'application accounts avec nommage automatique et initialisations au démarrage.",
                    keySymbols: "AccountsConfig"
                },
                {
                    path: "accounts/cv.py",
                    name: "cv.py",
                    type: "py",
                    category: "Moteur PDF & Validation",
                    analogy: "L'Atelier d'Imprimerie de Haute Précision",
                    analogyDesc: "Le typographe artisan qui prend les textes bruts de l'étudiant et les dispose au millimètre près sur une page élégante.",
                    desc: "Extrait les données structurées du profil, vérifie les champs indispensables et orchestre la création du PDF vectoriel.",
                    keySymbols: "generer_pdf_cv(), sources_cv(), selection_cv_validee(), informations_manquantes_cv()"
                },
                {
                    path: "accounts/cv_adaptation.py",
                    name: "cv_adaptation.py",
                    type: "py",
                    category: "Intelligence Artificielle",
                    analogy: "Le Coach de Recrutement IA",
                    analogyDesc: "Le conseiller d'orientation expert qui analyse l'offre et vous dit : 'Mets en avant ce projet Python et cette certification Docker !'",
                    desc: "Interroge Groq (LLaMA 3.1 70B) pour adapter les rubriques du CV aux mots-clés de l'offre ciblée avec empreinte SHA-256.",
                    keySymbols: "proposer_cv_adapte(), empreinte_adaptation(), memoriser_preparation()"
                },
                {
                    path: "accounts/cv_layout.py",
                    name: "cv_layout.py",
                    type: "py",
                    category: "Mise en Page Typographique",
                    analogy: "L'Architecte Géomètre",
                    analogyDesc: "Le traceur de plans qui calcule les marges de 15 mm, la gouttière de 9 mm et la colonne de gauche de 55 mm.",
                    desc: "Définit les styles ReportLab, la palette de couleurs (#164d72) et dessine les deux colonnes paginées indépendamment.",
                    keySymbols: "construire_pdf(), ParagraphStyle, Canvas"
                },
                {
                    path: "accounts/cv_versions.py",
                    name: "cv_versions.py",
                    type: "py",
                    category: "Gestion de Versions",
                    analogy: "Le Conservateur d'Archives",
                    analogyDesc: "L'archiviste qui garde une trace immuable de chaque version de CV générée pour chaque offre ciblée.",
                    desc: "Enregistre en base de données les empreintes et métadonnées des versions de CV adaptées générées.",
                    keySymbols: "enregistrer_version(), VersionCV"
                },
                {
                    path: "accounts/forms.py",
                    name: "forms.py",
                    type: "py",
                    category: "Formulaires & Formsets",
                    analogy: "Le Contrôleur Cerfa",
                    analogyDesc: "L'inspecteur des formulaires administratifs qui refuse tout dossier comportant un e-mail déjà utilisé ou un numéro invalide.",
                    desc: "Formulaires de connexion, d'inscription étudiant/école et formsets dynamiques (compétences, expériences, formations).",
                    keySymbols: "ConnexionForm, InscriptionForm, ProfilEtudiantForm, CompetenceFormSet"
                },
                {
                    path: "accounts/models.py",
                    name: "models.py",
                    type: "py",
                    category: "Modèles Relationnels",
                    analogy: "Le Grand Registre d'État Civil",
                    analogyDesc: "Le grand registre officiel où sont consignées les identités, les affiliations d'école et les compétences certifiées.",
                    desc: "Modèle Utilisateur personnalisé avec TextChoices Role (ETUDIANT, ECOLE), ProfilEtudiant, Etablissement et tables associées.",
                    keySymbols: "Utilisateur, ProfilEtudiant, Etablissement, DemandeCompteEcole, CVPrincipal"
                },
                {
                    path: "accounts/storage.py",
                    name: "storage.py",
                    type: "py",
                    category: "Stockage Cloud",
                    analogy: "La Chambre Forte Déportée",
                    analogyDesc: "La chambre forte ultra-sécurisée dans laquelle on entrepose les documents précieux avec une clé maîtresse inaccessible au public.",
                    desc: "Connecteur custom Django Storage interagissant avec l'API REST Supabase Storage et purgeant les anciens PDF.",
                    keySymbols: "SupabaseStorage(_save, delete, open, is_configured)"
                },
                {
                    path: "accounts/tests.py",
                    name: "tests.py",
                    type: "py",
                    category: "Assurance Qualité & Tests",
                    analogy: "Le Banc d'Essai Automobile",
                    analogyDesc: "La série de tests mécaniques vérifiant que les freins, la ceinture et le moteur démarrent au quart de tour.",
                    desc: "Tests unitaires couvrant l'authentification, la séparation des rôles, la validation des formsets et la génération de PDF.",
                    keySymbols: "AccountsTestCase, AuthTestCase, CVGenerationTestCase"
                },
                {
                    path: "accounts/urls.py",
                    name: "urls.py",
                    type: "py",
                    category: "Routage URL",
                    analogy: "Le Panneau d'Aiguillage des Rues",
                    analogyDesc: "Les panneaux fléchés qui orientent le visiteur vers l'accueil, la mairie, la bibliothèque ou le commissariat.",
                    desc: "Définit les routes de l'application accounts : /connexion/, /inscription/, /profil/modifier/, /mon-cv/telecharger/.",
                    keySymbols: "urlpatterns, app_name = 'accounts'"
                },
                {
                    path: "accounts/views.py",
                    name: "views.py",
                    type: "py",
                    category: "Contrôleurs Métier",
                    analogy: "Le Guichet Central d'Accueil",
                    analogyDesc: "L'employé de guichet qui accueille chaque citoyen, vérifie son identité, délivre ses documents et traite son dossier.",
                    desc: "Vues d'accueil avec redirection intelligente, connexion/déconnexion, édition de profil avec formsets et rendu du dashboard.",
                    keySymbols: "accueil(), connexion(), modifier_profil(), mon_cv(), telecharger_cv()"
                }
            ]
        },
        {
            id: "folder_applications",
            name: "applications/",
            title: "applications",
            badge: "Gestion des Candidatures & Stages",
            icon: "📁",
            desc: "Suivi chronologique des démarches de recrutement : postulation externe, mémorisation du CV utilisé, figeage de copie PDF et confirmation officielle de stage sécurisée par mot de passe.",
            files: [
                {
                    path: "applications/admin.py",
                    name: "admin.py",
                    type: "py",
                    category: "Administration Django",
                    analogy: "Le Registre des Dépôts",
                    analogyDesc: "Le grand registre où sont horodatées toutes les candidatures pour consultation par les superviseurs.",
                    desc: "Déclare le modèle Candidature dans Django Admin avec filtres par statut, date et validation de stage.",
                    keySymbols: "CandidatureAdmin"
                },
                {
                    path: "applications/apps.py",
                    name: "apps.py",
                    type: "py",
                    category: "Configuration Django",
                    analogy: "L'Enregistrement Préfectoral",
                    analogyDesc: "Le document administratif qui déclare le service de gestion des candidatures au système.",
                    desc: "Configuration du module applications auprès du noyau Django.",
                    keySymbols: "ApplicationsConfig"
                },
                {
                    path: "applications/cv_choice.py",
                    name: "cv_choice.py",
                    type: "py",
                    category: "Gestion de Session",
                    analogy: "Le Sélecteur de Chemise de Dossier",
                    analogyDesc: "Le classeur dans lequel on choisit de placer le CV standard ou le CV ciblé pour l'envoyer au recruteur.",
                    desc: "Conserve en session le choix de CV (principal ou adapté) retenu par l'étudiant pour une offre donnée.",
                    keySymbols: "choix_cv_en_session(), memoriser_choix_cv(), options_cv()"
                },
                {
                    path: "applications/models.py",
                    name: "models.py",
                    type: "py",
                    category: "Modèles Relationnels",
                    analogy: "Le Carnet de Bord du Candidat",
                    analogyDesc: "Le journal où l'on consigne chaque démarche effectuée pour ne jamais perdre le fil de ses recrutements.",
                    desc: "Modèle Candidature enregistrant le statut (Envoyée, Acceptée, Refusée), le flag favori, le stage confirmé et le lien PDF.",
                    keySymbols: "Candidature, ChoixCV, Statut"
                },
                {
                    path: "applications/tests.py",
                    name: "tests.py",
                    type: "py",
                    category: "Assurance Qualité & Tests",
                    analogy: "Le Crash-Test de Recrutement",
                    analogyDesc: "Le test vérifiant qu'on ne peut pas postuler deux fois à la même offre ni confirmer un stage sans mot de passe.",
                    desc: "Suite de tests automatisés validant la transition des statuts, le verrouillage de stage et l'accès au fichier PDF.",
                    keySymbols: "CandidatureTestCase, ConfirmationStageTestCase"
                },
                {
                    path: "applications/urls.py",
                    name: "urls.py",
                    type: "py",
                    category: "Routage URL",
                    analogy: "La Ligne de Chemin de Fer",
                    analogyDesc: "Les rails qui acheminent les requêtes vers la bonne gare de traitement des candidatures.",
                    desc: "Déclare les routes /mes-candidatures/, /confirmer/<pk>/, /confirmer-stage/<pk>/, /telecharger-cv/<pk>/.",
                    keySymbols: "urlpatterns, app_name = 'applications'"
                },
                {
                    path: "applications/views.py",
                    name: "views.py",
                    type: "py",
                    category: "Contrôleurs Métier",
                    analogy: "Le Notaire de la Validation",
                    analogyDesc: "L'officier qui certifie la signature du contrat de stage après avoir rigoureusement vérifié votre mot de passe.",
                    desc: "Vues du cycle complet de candidature : filtrage, bascule favori AJAX, confirmation atomique de stage avec vérification PBKDF2.",
                    keySymbols: "mes_candidatures(), confirmer_candidature(), confirmer_stage(), basculer_favori()"
                }
            ]
        },
        {
            id: "folder_offers",
            name: "offers/",
            title: "offers",
            badge: "Offres de Stage, IA & Synchronisation",
            icon: "📁",
            desc: "Catalogue d'annonces de stage : moteur de recherche multicritères, synchronisation quotidienne avec l'API OpenWeb Ninja sous verrou SQL exclusif, et recommandations IA Groq par lots.",
            files: [
                {
                    path: "offers/admin.py",
                    name: "admin.py",
                    type: "py",
                    category: "Administration Django",
                    analogy: "Le Panneau Modérateur d'Annonces",
                    analogyDesc: "L'interface qui permet de retirer une offre douteuse ou de réinitialiser le verrou de synchronisation.",
                    desc: "Configuration d'administration pour OffreStage et EtatSynchronisation avec actions en masse.",
                    keySymbols: "OffreStageAdmin, EtatSynchronisationAdmin"
                },
                {
                    path: "offers/apps.py",
                    name: "apps.py",
                    type: "py",
                    category: "Configuration Django",
                    analogy: "Le Registre des Marchés Publics",
                    analogyDesc: "L'enregistrement formel du service d'offres de stages auprès du système central.",
                    desc: "Déclaration et configuration de l'application offers.",
                    keySymbols: "OffersConfig"
                },
                {
                    path: "offers/filtres.py",
                    name: "filtres.py",
                    type: "py",
                    category: "Moteur de Filtrage",
                    analogy: "Le Tamis de l'Orpailleur",
                    analogyDesc: "La grille qui ne laisse passer que les vraies pépites d'or (stages IT) et élimine les cailloux (CDI, alternances, hors-France).",
                    desc: "Filtres stricts excluant les offres non informatiques, les fausses annonces et validant les critères géographiques.",
                    keySymbols: "est_stage_informatique_valide(), filtrer_offres_pertinentes()"
                },
                {
                    path: "offers/france_travail.py",
                    name: "france_travail.py",
                    type: "py",
                    category: "API Institutionnelle",
                    analogy: "La Liaison avec l'État",
                    analogyDesc: "La ligne directe sécurisée avec l'agence nationale pour l'emploi pour synchroniser les référentiels métiers.",
                    desc: "Client OAuth2 interrogeant l'API publique France Travail pour enrichir le catalogue d'opportunités conventionnées.",
                    keySymbols: "client_france_travail(), synchroniser_france_travail()"
                },
                {
                    path: "offers/importation.py",
                    name: "importation.py",
                    type: "py",
                    category: "Synchronisation & Concurrence",
                    analogy: "Le Douanier & Magasinier",
                    analogyDesc: "Il bloque la porte d'entrée le temps d'inventorier la marchandise et garantit qu'aucun carton n'est enregistré en double.",
                    desc: "Importation transactionnelle avec verrou select_for_update(nowait=True) sur EtatSynchronisation empêchant tout double import.",
                    keySymbols: "importer_stages(), _enregistrer(), EtatSynchronisation"
                },
                {
                    path: "offers/jsearch.py",
                    name: "jsearch.py",
                    type: "py",
                    category: "Client HTTP API Externe",
                    analogy: "L'Éclaireur International",
                    analogyDesc: "Le messager envoyé à l'extérieur pour collecter les offres d'emploi récentes sur tout le territoire national.",
                    desc: "Client HTTP pour l'API REST OpenWeb Ninja (JSearch search-v2), avec pagination par curseur et gestion de budget.",
                    keySymbols: "rechercher_stages_informatiques(), JSearchError"
                },
                {
                    path: "offers/models.py",
                    name: "models.py",
                    type: "py",
                    category: "Modèles Relationnels",
                    analogy: "Le Grand Panneau des Opportunités",
                    analogyDesc: "Le grand tableau d'affichage des offres de stages affiché dans le hall principal de la gare.",
                    desc: "Modèles OffreStage (titre, entreprise, localisation, compétences) et EtatSynchronisation (verrou et date de tentative).",
                    keySymbols: "OffreStage, EtatSynchronisation"
                },
                {
                    path: "offers/recommandation.py",
                    name: "recommandation.py",
                    type: "py",
                    category: "Intelligence Artificielle",
                    analogy: "L'Entremetteur Intelligent (Matchmaker)",
                    analogyDesc: "L'expert qui analyse votre personnalité et vos compétences pour trouver les partenaires professionnels idéaux.",
                    desc: "Scoring sémantique comparant le profil aux offres actives par paquets de 5 via Groq LLaMA 3.1 avec sortie JSON stricte.",
                    keySymbols: "recommander_stages(), comparer_offres(), RecommandationLimitee"
                },
                {
                    path: "offers/test_jsearch.py",
                    name: "test_jsearch.py",
                    type: "py",
                    category: "Assurance Qualité & Mocks",
                    analogy: "Le Simulateur de Réseau Sans Fil",
                    analogyDesc: "L'appareil qui simule des pannes de connexion pour vérifier que l'ordinateur ne plante pas.",
                    desc: "Tests automatisés avec simulation des réponses HTTP 200, 429 et 500 de l'API externe JSearch.",
                    keySymbols: "JSearchMockTestCase"
                },
                {
                    path: "offers/tests.py",
                    name: "tests.py",
                    type: "py",
                    category: "Assurance Qualité & Tests",
                    analogy: "L'Inspecteur du Commerce",
                    analogyDesc: "Le contrôleur qui vérifie que toutes les offres affichées sont bien datées, actives et sans coquilles.",
                    desc: "Suite de tests unitaires sur la recherche textuelle, les filtres multicritères et le calcul des durées de stage.",
                    keySymbols: "OffersTestCase, RecommendationTestCase"
                },
                {
                    path: "offers/urls.py",
                    name: "urls.py",
                    type: "py",
                    category: "Routage URL",
                    analogy: "La Carte des Voies Ferrées",
                    analogyDesc: "Le réseau ferré orientant les visiteurs vers la liste des offres, le détail d'un poste ou les recommandations IA.",
                    desc: "Déclare les routes /offres/, /offres/<pk>/, /recommandations/.",
                    keySymbols: "urlpatterns, app_name = 'offers'"
                },
                {
                    path: "offers/views.py",
                    name: "views.py",
                    type: "py",
                    category: "Contrôleurs Métier",
                    analogy: "Le Salon de l'Emploi",
                    analogyDesc: "L'espace où les candidats découvrent les stands des entreprises et utilisent des bornes de recherche intelligente.",
                    desc: "Affichage paginé des annonces, filtres combinés en temps réel et déclenchement sécurisé du moteur IA Groq.",
                    keySymbols: "liste_offres(), detail_offre(), recommandations_ia()"
                },
                {
                    path: "offers/management/commands/synchroniser_offres.py",
                    name: "synchroniser_offres.py",
                    type: "py",
                    category: "Commandes CLI & Cron",
                    analogy: "Le Télérupteur de Minuterie",
                    analogyDesc: "Le système automatique qui déclenche l'allumage des lampadaires à heure fixe tous les soirs.",
                    desc: "Commande Django `manage.py synchroniser_offres` exécutable manuellement ou via tâche Cron planifiée.",
                    keySymbols: "Command(handle), synchroniser_offres"
                }
            ]
        },
        {
            id: "folder_schools",
            name: "schools/",
            title: "schools",
            badge: "Espace Écoles & Pilotage Pédagogique",
            icon: "📁",
            desc: "Tour de contrôle réservée aux établissements partenaires : KPIs d'insertion calculés en une seule requête SQL, suivi individuel des promotions et centre d'alertes temps réel.",
            files: [
                {
                    path: "schools/admin.py",
                    name: "admin.py",
                    type: "py",
                    category: "Administration Django",
                    analogy: "Le Greffe des Écoles Partenaires",
                    analogyDesc: "L'annuaire officiel listant toutes les conventions scolaires signées avec l'école 3iL.",
                    desc: "Administration des notifications écoles et consultation des journaux d'audit.",
                    keySymbols: "NotificationEcoleAdmin"
                },
                {
                    path: "schools/apps.py",
                    name: "apps.py",
                    type: "py",
                    category: "Configuration Django",
                    analogy: "L'Arrêté Ministériel de Création",
                    analogyDesc: "La proclamation officielle actant la création du service de suivi pédagogique.",
                    desc: "Déclaration et configuration de l'application schools auprès de Django.",
                    keySymbols: "SchoolsConfig"
                },
                {
                    path: "schools/models.py",
                    name: "models.py",
                    type: "py",
                    category: "Modèles Relationnels",
                    analogy: "Le Téléscripteur d'Urgence Pédagogique",
                    analogyDesc: "La sonnerie qui retentit au secrétariat de l'école dès qu'un étudiant valide son contrat de stage.",
                    desc: "Modèle NotificationEcole enregistrant les actions CONFIRMATION et ANNULATION avec anti-doublon et horodatage.",
                    keySymbols: "NotificationEcole, TypeAction, notifier_action_stage()"
                },
                {
                    path: "schools/tests.py",
                    name: "tests.py",
                    type: "py",
                    category: "Assurance Qualité & Tests",
                    analogy: "L'Examen Pédagogique Automatisé",
                    analogyDesc: "L'épreuve vérifiant que le directeur de l'école A ne peut sous aucun prétexte voir les étudiants de l'école B.",
                    desc: "Tests unitaires validant l'isolation multi-tenant stricte, le calcul des pourcentages d'insertion et la bascule lu/non lu.",
                    keySymbols: "SchoolsTestCase, MultiTenantIsolationTestCase"
                },
                {
                    path: "schools/urls.py",
                    name: "urls.py",
                    type: "py",
                    category: "Routage URL",
                    analogy: "L'Orientation des Couloirs de la Faculté",
                    analogyDesc: "Les panneaux guidant les professeurs vers la salle du conseil, la salle des notes ou le secrétariat.",
                    desc: "Déclare les routes /ecole/tableau-de-bord/, /ecole/etudiants/, /ecole/notifications/.",
                    keySymbols: "urlpatterns, app_name = 'schools'"
                },
                {
                    path: "schools/views.py",
                    name: "views.py",
                    type: "py",
                    category: "Contrôleurs Métier",
                    analogy: "La Tour de Contrôle Pédagogique",
                    analogyDesc: "L'écran géant des directeurs d'études montrant en temps réel qui est en vol, qui a atterri et qui a besoin d'assistance.",
                    desc: "Génère les métriques de la promotion en une passe SQL annotée (Q filters), liste des étudiants et acquittement groupé des alertes.",
                    keySymbols: "tableau_de_bord(), liste_etudiants(), liste_notifications(), categoriser_etudiants(), marquer_tout_lu()"
                }
            ]
        },
        {
            id: "folder_config",
            name: "config/",
            title: "config",
            badge: "Noyau & Paramétrage Global",
            icon: "📁",
            desc: "Cœur de la configuration Django : point d'entrée des URLs racine, bascule des bases SQLite/PostgreSQL, middlewares de sécurité et passerelles réseau WSGI/ASGI.",
            files: [
                {
                    path: "config/settings.py",
                    name: "settings.py",
                    type: "py",
                    category: "Configuration Centrale",
                    analogy: "La Constitution de l'État",
                    analogyDesc: "Le grand livre des lois suprêmes que chaque module du projet doit respecter pour fonctionner en harmonie.",
                    desc: "Rassemble les variables d'environnement, la connexion BDD (Postgres SSL / SQLite), Groq, Supabase et les middlewares de sécurité.",
                    keySymbols: "DATABASES, INSTALLED_APPS, MIDDLEWARE, GROQ_API_KEY, SUPABASE_URL"
                },
                {
                    path: "config/urls.py",
                    name: "urls.py",
                    type: "py",
                    category: "Routeur Racine",
                    analogy: "L'Aiguilleur du Ciel Principal",
                    analogyDesc: "Le grand centre de contrôle qui regarde la trajectoire de chaque avion et l'oriente vers le bon terminal.",
                    desc: "Point d'entrée HTTP racine incluant les routeurs accounts.urls, offers.urls, applications.urls, schools.urls et l'admin.",
                    keySymbols: "urlpatterns"
                },
                {
                    path: "config/wsgi.py",
                    name: "wsgi.py",
                    type: "py",
                    category: "Passerelle Réseau Synchrone",
                    analogy: "La Prise Électrique Murale Standard",
                    analogyDesc: "La prise standardisée permettant à n'importe quel appareil (serveur Gunicorn, Apache) de brancher le site.",
                    desc: "Point d'entrée synchrone WSGI pour le déploiement sur serveurs de production traditionnels.",
                    keySymbols: "application = get_wsgi_application()"
                },
                {
                    path: "config/asgi.py",
                    name: "asgi.py",
                    type: "py",
                    category: "Passerelle Réseau Asynchrone",
                    analogy: "Le Câble Fibre Optique Haute Vitesse",
                    analogyDesc: "Le raccordement ultra-rapide capable de transporter simultanément des milliers de conversations en direct.",
                    desc: "Point d'entrée asynchrone ASGI pour les serveurs supportant l'asynchronisme natif et les WebSockets.",
                    keySymbols: "application = get_asgi_application()"
                },
                {
                    path: "config/test_settings.py",
                    name: "test_settings.py",
                    type: "py",
                    category: "Configuration de Test",
                    analogy: "Le Simulateur de Vol d'Entraînement",
                    analogyDesc: "L'environnement virtuel où les pilotes peuvent s'entraîner sans consommer une seule goutte de vrai kérosène.",
                    desc: "Paramétrage allégé forçant SQLite en mémoire vive pour exécuter les 110 tests automatisés à la milliseconde sans appel externe.",
                    keySymbols: "DATABASES['default'] = sqlite3 :memory:"
                }
            ]
        },
        {
            id: "folder_templates",
            name: "templates/",
            title: "templates",
            badge: "Gabarits HTML & Moteur MVT",
            icon: "📁",
            desc: "Moteur de rendu serveur Django (MVT) : gabarit maître base.html, composants modulaires (navbar, footer, graphiques SVG) et écrans dédiés à chaque profil.",
            files: [
                {
                    path: "templates/base.html",
                    name: "base.html",
                    type: "html",
                    category: "Gabarit Maître",
                    analogy: "Le Châssis Commun du Véhicule",
                    analogyDesc: "La carrosserie et le châssis en acier communs sur lesquels reposent toutes les finitions de la voiture.",
                    desc: "Squelette HTML5 universel avec balises meta, inclusion des styles CSS, conteneur principal et structure responsive.",
                    keySymbols: "{% block content %}, {% include 'components/navbar.html' %}"
                },
                {
                    path: "templates/components/navbar.html",
                    name: "components/navbar.html",
                    type: "html",
                    category: "Composant UI",
                    analogy: "Le Tableau de Bord du Pilote",
                    analogyDesc: "La console située juste sous les yeux du conducteur avec tous les boutons et jauges de contrôle.",
                    desc: "Barre de navigation adaptative selon le rôle connecté, cloche de notifications en direct et bascule de thème clair/sombre.",
                    keySymbols: "nav.navbar, notification-bell, role-badge"
                },
                {
                    path: "templates/components/footer.html",
                    name: "components/footer.html",
                    type: "html",
                    category: "Composant UI",
                    analogy: "La Plaque Minéralogique & Mentions Légales",
                    analogyDesc: "Le bas de page officiel certifiant l'origine et la conformité légale de l'ouvrage.",
                    desc: "Pied de page institutionnel de l'école 3iL Ingénieurs avec liens utiles et indicateurs de version.",
                    keySymbols: "footer.sp-footer"
                },
                {
                    path: "templates/components/messages.html",
                    name: "components/messages.html",
                    type: "html",
                    category: "Composant UI",
                    analogy: "Le Haut-Parleur d'Annonce",
                    analogyDesc: "La voix qui annonce dans le hall de gare : 'Le train en provenance de Paris entre en voie B'.",
                    desc: "Affiche les notifications flash (succès, avertissement, erreur) émises par le framework Django.",
                    keySymbols: "{% for message in messages %}"
                },
                {
                    path: "templates/components/dashboard_donut.html",
                    name: "components/dashboard_donut.html",
                    type: "html",
                    category: "Composant SVG",
                    analogy: "Le Compteur de Vitesse Circulaire",
                    analogyDesc: "Le cadran rond qui indique en un coup d'œil le pourcentage de stages confirmés.",
                    desc: "Composant graphique circulaire SVG pur affichant la répartition des candidatures sans dépendance JS externe.",
                    keySymbols: "svg.donut-chart, stroke-dasharray"
                },
                {
                    path: "templates/accounts/connexion.html",
                    name: "accounts/connexion.html",
                    type: "html",
                    category: "Écran d'Authentification",
                    analogy: "Le Sas d'Entrée Sécurisé",
                    analogyDesc: "La porte d'accès avec lecteur de carte magnétique où l'on choisit la zone Étudiant ou École.",
                    desc: "Formulaire de login avec sélecteur d'espace visuel et protection anti-CSRF obligatoire.",
                    keySymbols: "form.login-form, csrf_token"
                },
                {
                    path: "templates/accounts/inscription.html",
                    name: "accounts/inscription.html",
                    type: "html",
                    category: "Écran d'Inscription",
                    analogy: "Le Formulaire de Première Rentrée",
                    analogyDesc: "La fiche administrative que chaque nouvel élève remplit le jour de sa première rentrée.",
                    desc: "Formulaire d'inscription étudiant avec validation d'email unique et force de mot de passe.",
                    keySymbols: "form.register-form"
                },
                {
                    path: "templates/accounts/inscription_ecole.html",
                    name: "accounts/inscription_ecole.html",
                    type: "html",
                    category: "Écran Partenaire",
                    analogy: "Le Dossier d'Agrément Partenaire",
                    analogyDesc: "La demande officielle qu'un établissement dépose pour devenir centre partenaire agréé.",
                    desc: "Formulaire de candidature pour les établissements scolaires avec message de mise en attente.",
                    keySymbols: "form.school-request-form"
                },
                {
                    path: "templates/accounts/tableau_de_bord.html",
                    name: "accounts/tableau_de_bord.html",
                    type: "html",
                    category: "Tableau de Bord Étudiant",
                    analogy: "Le Cockpit de l'Étudiant",
                    analogyDesc: "La vue panoramique affichant le statut du CV, les candidatures actives et les alertes de stage.",
                    desc: "Dashboard central de l'étudiant avec cartes de métriques, raccourcis et suggestions IA.",
                    keySymbols: "student-dashboard, kpi-cards"
                },
                {
                    path: "templates/accounts/modifier_profil.html",
                    name: "accounts/modifier_profil.html",
                    type: "html",
                    category: "Éditeur de Profil",
                    analogy: "L'Atelier de Personnalisation",
                    analogyDesc: "L'établi où l'on ajoute ses nouveaux outils (compétences), diplômes et projets réalisés.",
                    desc: "Éditeur dynamique exploitant les formsets Django pour ajouter et ordonner compétences et expériences.",
                    keySymbols: "formsets-container, dynamic-rows"
                },
                {
                    path: "templates/accounts/mon_cv.html",
                    name: "accounts/mon_cv.html",
                    type: "html",
                    category: "Studio de Visualisation",
                    analogy: "Le Studio de Tirage Photo",
                    analogyDesc: "La pièce où l'on contemple son portrait officiel imprimé en haute définition avant diffusion.",
                    desc: "Visualiseur interactif du PDF généré avec bouton de téléchargement et régénération ReportLab.",
                    keySymbols: "pdf-viewer-frame, regen-btn"
                },
                {
                    path: "templates/applications/mes_candidatures.html",
                    name: "applications/mes_candidatures.html",
                    type: "html",
                    category: "Gestionnaire de Démarches",
                    analogy: "Le Carnet de Bord des Démarches",
                    analogyDesc: "Le tableau mural où chaque candidature est épinglée avec son statut : en attente, acceptée ou refusée.",
                    desc: "Tableau de suivi des candidatures avec filtres interactifs, téléchargement du CV figé et validation de stage.",
                    keySymbols: "applications-table, status-badge, confirm-modal"
                },
                {
                    path: "templates/offers/liste_offres.html",
                    name: "offers/liste_offres.html",
                    type: "html",
                    category: "Catalogue d'Opportunités",
                    analogy: "Le Kiosque des Petites Annonces",
                    analogyDesc: "Le grand kiosque où les étudiants parcourent les annonces de stage classées par ville et spécialité.",
                    desc: "Catalogue d'offres avec barres de filtres, recherche par mots-clés et bouton de matching IA Groq.",
                    keySymbols: "offers-grid, filter-sidebar, ai-match-btn"
                },
                {
                    path: "templates/offers/detail_offre.html",
                    name: "offers/detail_offre.html",
                    type: "html",
                    category: "Fiche Détaillée d'Annonce",
                    analogy: "Le Contrat de Poste Dévoilé",
                    analogyDesc: "La lecture approfondie de la mission avant de décider d'envoyer son CV principal ou adapté.",
                    desc: "Détail complet d'une offre, compétences requises, choix du CV et confirmation de postulation.",
                    keySymbols: "offer-header, cv-selector-form, apply-btn"
                },
                {
                    path: "templates/schools/tableau_de_bord.html",
                    name: "schools/tableau_de_bord.html",
                    type: "html",
                    category: "Tableau de Bord École",
                    analogy: "La Tour de Contrôle Pédagogique",
                    analogyDesc: "L'écran géant des directeurs d'études affichant les statistiques globales de placement des étudiants.",
                    desc: "Dashboard école avec jauges d'insertion, graphiques donut SVG et synthèse des promotions.",
                    keySymbols: "school-dashboard, insertion-rate, stats-cards"
                },
                {
                    path: "templates/schools/liste_etudiants.html",
                    name: "schools/liste_etudiants.html",
                    type: "html",
                    category: "Trombinoscope & Suivi",
                    analogy: "Le Trombinoscope Universitaire",
                    analogyDesc: "La liste de tous les élèves de la promo avec mention de leur statut : stage trouvé ou recherche en cours.",
                    desc: "Tableau filtrable des étudiants de l'établissement avec nombre de candidatures et stage confirmé.",
                    keySymbols: "students-table, filter-tabs"
                },
                {
                    path: "templates/schools/notifications.html",
                    name: "schools/notifications.html",
                    type: "html",
                    category: "Centre d'Alertes",
                    analogy: "Le Fil d'Actualité des Victoires",
                    analogyDesc: "Le flux chronologique qui annonce : 'Alexandre a validé son stage chez Capgemini !'",
                    desc: "Flux des confirmations et annulations de stage avec bouton d'acquittement groupé 'Tout marquer comme lu'.",
                    keySymbols: "notifications-stream, mark-all-read-btn"
                }
            ]
        },
        {
            id: "folder_static",
            name: "static/",
            title: "static",
            badge: "Assets CSS, JS & Design System",
            icon: "📁",
            desc: "Fichiers statiques servis au navigateur : feuilles de style CSS modulaires avec variables dynamiques et scripts JS utilitaires pour l'interactivité.",
            files: [
                {
                    path: "static/css/style.css",
                    name: "style.css",
                    type: "css",
                    category: "Design System Global",
                    analogy: "Le Livre de Charte Graphique",
                    analogyDesc: "Les règles de couleurs, d'harmonie et d'élégance qui confèrent son identité visuelle au projet.",
                    desc: "Variables CSS globales, thèmes clair et sombre, effets de verre (glassmorphism) et animations de transition.",
                    keySymbols: ":root, [data-bs-theme='dark'], .card-glass"
                },
                {
                    path: "static/css/auth.css",
                    name: "auth.css",
                    type: "css",
                    category: "Styles d'Authentification",
                    analogy: "L'Habillage du Hall d'Accueil",
                    analogyDesc: "La décoration rassurante et professionnelle des salons d'entrée de l'école.",
                    desc: "Mise en page des écrans de connexion et inscription avec conteneurs centrés et contrastes soignés.",
                    keySymbols: ".auth-container, .role-selector"
                },
                {
                    path: "static/css/dashboard.css",
                    name: "dashboard.css",
                    type: "css",
                    category: "Styles des Tableaux de Bord",
                    analogy: "Le Pupitre Numérique",
                    analogyDesc: "La disposition ergonomique des cadrans et voyants lumineux sous les yeux du pilote.",
                    desc: "Grille responsive de cartes KPI, jauges de progression et typographie financière/métrique.",
                    keySymbols: ".kpi-grid, .progress-bar-sp"
                },
                {
                    path: "static/css/offers.css",
                    name: "offers.css",
                    type: "css",
                    category: "Styles du Catalogue d'Offres",
                    analogy: "La Vitrine du Magasin",
                    analogyDesc: "L'éclairage et la disposition soignée mettant en valeur chaque article exposé.",
                    desc: "Styles des cartes d'offres de stage, étiquettes de compétences colorées et badges de durée.",
                    keySymbols: ".offer-card, .skill-tag"
                },
                {
                    path: "static/css/applications.css",
                    name: "applications.css",
                    type: "css",
                    category: "Styles des Candidatures",
                    analogy: "Le Classeur de Candidatures",
                    analogyDesc: "Les intercalaires de couleur séparant les dossiers en cours, validés ou refusés.",
                    desc: "Styles du gestionnaire de candidatures : badges d'état bicolores, modales de confirmation et timelines.",
                    keySymbols: ".cand-status-badge, .confirmation-modal"
                },
                {
                    path: "static/css/schools.css",
                    name: "schools.css",
                    type: "css",
                    category: "Styles de l'Espace École",
                    analogy: "La Salle des Professeurs",
                    analogyDesc: "L'atmosphère ordonnée et sobre propice à l'analyse studieuse des résultats de promotion.",
                    desc: "Tableaux synthétiques, badges d'alerte rouge/vert et graphiques statistiques de promotion.",
                    keySymbols: ".school-table, .rate-badge"
                },
                {
                    path: "static/js/app.js",
                    name: "app.js",
                    type: "js",
                    category: "Script Front-End Principal",
                    analogy: "Le Système Nerveux Front-End",
                    analogyDesc: "Les impulsions électriques qui réagissent instantanément aux clics de l'utilisateur.",
                    desc: "Gestion de la navigation mobile, toasts d'information, bascule de thème et initialisations d'interfaces.",
                    keySymbols: "initTheme(), showToast(), toggleNavbar()"
                },
                {
                    path: "static/js/cv_preview.js",
                    name: "cv_preview.js",
                    type: "js",
                    category: "Prévisualisation du CV",
                    analogy: "La Loupe Optique",
                    analogyDesc: "La loupe de haute précision qui permet d'inspecter chaque détail avant le tirage final.",
                    desc: "Gère l'affichage fluide du PDF vectoriel dans une iframe dédiée avec détection des formats mobiles.",
                    keySymbols: "loadPdfPreview(), handleZoom()"
                },
                {
                    path: "static/js/profil_formsets.js",
                    name: "profil_formsets.js",
                    type: "js",
                    category: "Formsets Dynamiques",
                    analogy: "L'Ajouteur Automatique de Lignes",
                    analogyDesc: "Le formulaire magique qui fait apparaître une nouvelle ligne dès que vous cliquez sur 'Ajouter une compétence'.",
                    desc: "Gère l'ajout et la suppression dynamique de lignes dans les formsets Django sans rechargement de page.",
                    keySymbols: "addFormsetRow(), deleteFormsetRow(), updateTOTAL_FORMS()"
                }
            ]
        },
        {
            id: "folder_root",
            name: "Racine du Projet (Root)",
            title: "root",
            badge: "Fichiers de Déploiement & Documentation",
            icon: "📁",
            desc: "Fichiers de pilotage à la racine du dépôt : exécution en ligne de commande, spécification des dépendances Python, documentation technique et variables d'environnement.",
            files: [
                {
                    path: "manage.py",
                    name: "manage.py",
                    type: "py",
                    category: "Point d'Entrée CLI",
                    analogy: "La Manivelle du Moteur",
                    analogyDesc: "Le démarreur indispensable qui met en route toute la mécanique Django pour lancer le serveur ou les tests.",
                    desc: "Script exécutable en ligne de commande pour démarrer le serveur (runserver), appliquer les migrations et lancer les 110 tests.",
                    keySymbols: "execute_from_command_line()"
                },
                {
                    path: "requirements.txt",
                    name: "requirements.txt",
                    type: "config",
                    category: "Dépendances Verrouillées",
                    analogy: "La Liste des Ingrédients du Chef",
                    analogyDesc: "La recette infaillible qui indique exactement chaque ingrédient et sa dose précise pour réussir le plat.",
                    desc: "Fichier de pinning déclarant les versions exactes de Django (6.1.1), ReportLab (4.x), Psycopg (3.3.6) et Requests.",
                    keySymbols: "Django==6.1.1, psycopg==3.3.6, reportlab>=4.0"
                },
                {
                    path: ".env.example",
                    name: ".env.example",
                    type: "config",
                    category: "Modèle de Configuration",
                    analogy: "Le Manuel d'Installation Électrique",
                    analogyDesc: "Le schéma qui vous montre où brancher la phase, le neutre et la terre avant d'allumer le disjoncteur.",
                    desc: "Gabarit officiel des variables d'environnement requises : SECRET_KEY, DATABASE_URL, GROQ_API_KEY et SUPABASE_KEY.",
                    keySymbols: "SECRET_KEY, GROQ_API_KEY, SUPABASE_SERVICE_ROLE_KEY"
                },
                {
                    path: "db.sqlite3",
                    name: "db.sqlite3",
                    type: "db",
                    category: "Base Locale de Test",
                    analogy: "Le Carnet de Notes Local",
                    analogyDesc: "Le calepin de brouillon où l'on note les données d'essai avant de les consigner dans le grand livre officiel.",
                    desc: "Fichier BDD SQLite local utilisé pour l'exécution ultra-rapide des tests unitaires et le développement déconnecté.",
                    keySymbols: "SQLite database binary"
                },
                {
                    path: "docs/synchronisation_offres.md",
                    name: "docs/synchronisation_offres.md",
                    type: "md",
                    category: "Documentation Technique",
                    analogy: "Le Manuel d'Atelier de la Synchronisation",
                    analogyDesc: "La notice expliquant le fonctionnement du verrou SQL et le calcul du quota de requêtes.",
                    desc: "Spécification complète du pipeline d'import JSearch, des verrous de concurrence et de la politique de dédoublonnage.",
                    keySymbols: "Markdown technical spec"
                },
                {
                    path: "docs/connexion_inscription.md",
                    name: "docs/connexion_inscription.md",
                    type: "md",
                    category: "Documentation Technique",
                    analogy: "Le Guide de Procédure des Usagers",
                    analogyDesc: "Le protocole officiel décrivant comment valider une école et inscrire les élèves.",
                    desc: "Documentation du cycle de vie des comptes et du processus de validation en deux temps des établissements.",
                    keySymbols: "Markdown technical spec"
                },
                {
                    path: "docs/profils_cv.md",
                    name: "docs/profils_cv.md",
                    type: "md",
                    category: "Documentation Technique",
                    analogy: "Le Manuel Typographique du CV",
                    analogyDesc: "Les règles de composition ReportLab et la gestion des rubriques structurées.",
                    desc: "Spécification de l'extraction des données de profil et du rendu vectoriel ReportLab.",
                    keySymbols: "Markdown technical spec"
                },
                {
                    path: "tests/js/cv_preview.test.cjs",
                    name: "tests/js/cv_preview.test.cjs",
                    type: "js",
                    category: "Tests Front-End Jest",
                    analogy: "Le Contrôle Technique Front-End",
                    analogyDesc: "Le banc d'essai vérifiant que les boutons de bascule de CV réagissent sans bug côté navigateur.",
                    desc: "Suite de tests Jest automatisée vérifiant la logique client de prévisualisation et d'adaptation du CV.",
                    keySymbols: "describe('CV Preview Client Logic'), test()"
                }
            ]
        }
    ],

    // -------------------------------------------------------------------------
    // 4. FLAT FILES LIST (Compatibilité & Recherche Globale - 58 Fichiers)
    // -------------------------------------------------------------------------
    files: [
        { path: "manage.py", category: "Core & CLI", desc: "Point d'entrée en ligne de commande pour lancer le serveur, les tests et les migrations.", analogy: "La Manivelle du Moteur", analogyDesc: "Comme le démarreur d'une voiture, c'est l'outil qui met en route toute la mécanique Django." },
        { path: "config/settings.py", category: "Configuration", desc: "Centralise tous les réglages : applications installées, base de données, middlewares, clés d'API et stockage.", analogy: "La Constitution de l'État", analogyDesc: "Le grand livre des lois que chaque composant du projet doit respecter pour fonctionner en harmonie." },
        { path: "config/urls.py", category: "Routage", desc: "Routeur racine qui dispatche les requêtes HTTP vers les modules accounts, offers, applications et schools.", analogy: "L'Aiguilleur du Ciel", analogyDesc: "Il regarde l'adresse demandée par le visiteur et l'oriente vers la bonne piste d'atterrissage." },
        { path: "config/wsgi.py", category: "Serveur", desc: "Interface WSGI standard pour héberger l'application sur des serveurs de production comme Gunicorn.", analogy: "La Prise Électrique Murale Standard", analogyDesc: "La prise standardisée permettant à n'importe quel appareil de brancher le site." },
        { path: "config/asgi.py", category: "Serveur", desc: "Interface ASGI moderne supportant l'exécution asynchrone et préparant les futures connexions WebSockets.", analogy: "Le Câble Fibre Optique", analogyDesc: "Le raccordement ultra-rapide capable de transporter simultanément des milliers de conversations en direct." },
        { path: "accounts/models.py", category: "Modèles & BDD", desc: "Définit les utilisateurs, rôles (Étudiant/École), profils, compétences, formations, expériences et diplômes.", analogy: "Le Registre d'État Civil", analogyDesc: "Le grand registre officiel où sont consignées les identités, les affiliations et les compétences certifiées." },
        { path: "accounts/views.py", category: "Logique Métier", desc: "Gère l'authentification, les inscriptions, la gestion du profil étudiant, le tableau de bord et le CV.", analogy: "Le Guichet Central d'Accueil", analogyDesc: "L'employé de guichet qui accueille chaque personne, vérifie sa pièce d'identité et traite son dossier." },
        { path: "accounts/forms.py", category: "Formulaires", desc: "Formulaires Django assurant la validation des données saisies (e-mail unique, formats de téléphone, années).", analogy: "Le Contrôleur Cerfa", analogyDesc: "Comme un inspecteur des formulaires administratifs, il refuse tout dossier mal rempli ou incohérent." },
        { path: "accounts/access.py", category: "Sécurité", desc: "Contrôle d'accès vérifiant qu'un compte école est bien approuvé avant d'autoriser l'accès aux données des étudiants.", analogy: "Le Vigile VIP", analogyDesc: "Le garde posté à l'entrée du salon privé : si votre badge n'a pas été tamponné par la direction, vous n'entrez pas." },
        { path: "accounts/cv.py", category: "Services PDF", desc: "Génération vectorielle du CV en PDF à 2 colonnes via ReportLab (fond blanc, bandeau bleu, texte sélectionnable).", analogy: "L'Atelier d'Imprimerie de Haute Précision", analogyDesc: "Le typographe artisan qui prend les textes bruts et les dispose au millimètre près sur une page élégante." },
        { path: "accounts/cv_adaptation.py", category: "Intelligence Artificielle", desc: "Adapte le CV à une offre ciblée avec Groq (LLaMA 3) en sélectionnant les compétences les plus adaptées.", analogy: "Le Coach de Recrutement IA", analogyDesc: "Le conseiller d'orientation expert qui lit l'annonce et dit : 'Mets en avant ce projet Python et cette certification Docker !'" },
        { path: "accounts/cv_layout.py", category: "Mise en Page PDF", desc: "Calcul géométrique des colonnes, marges de 15 mm et styles typographiques Helvetica du PDF.", analogy: "L'Architecte Géomètre", analogyDesc: "Le traceur de plans qui calcule les marges et la disposition équilibrée des colonnes." },
        { path: "accounts/cv_versions.py", category: "Gestion de Versions", desc: "Conserve l'historique et l'empreinte de chaque version de CV adaptée générée.", analogy: "Le Conservateur d'Archives", analogyDesc: "L'archiviste qui garde une trace immuable de chaque version de CV générée." },
        { path: "accounts/storage.py", category: "Stockage Cloud", desc: "Connecteur vers Supabase Storage privé pour stocker et récupérer les fichiers PDF de manière sécurisée.", analogy: "La Chambre Forte Déportée", analogyDesc: "La chambre forte ultra-sécurisée dans laquelle on entrepose les documents précieux avec une clé spéciale." },
        { path: "accounts/admin.py", category: "Administration", desc: "Interface d'administration Django pour modérer les comptes et valider les demandes d'écoles.", analogy: "Le Bureau du Directeur Général", analogyDesc: "L'interface réservée aux administrateurs pour valider les dossiers d'écoles." },
        { path: "accounts/urls.py", category: "Routage", desc: "URLs de l'espace comptes : connexion, inscription, profil et téléchargement du CV.", analogy: "Le Panneau d'Aiguillage des Rues", analogyDesc: "Les panneaux fléchés qui orientent le visiteur vers le bon service." },
        { path: "applications/models.py", category: "Modèles & BDD", desc: "Enregistre chaque candidature, son statut, son CV figé, son intégration confirmée et son état favori.", analogy: "Le Carnet de Bord du Candidat", analogyDesc: "Le journal où l'on note chaque démarche effectuée pour ne jamais perdre le fil d'un recrutement." },
        { path: "applications/views.py", category: "Logique Métier", desc: "Gestion du statut des candidatures, téléchargement de la copie du CV et confirmation officielle sécurisée de stage.", analogy: "Le Notaire de la Validation", analogyDesc: "L'officier qui certicie la signature du contrat de stage après avoir vérifié votre mot de passe." },
        { path: "applications/cv_choice.py", category: "Session", desc: "Mémorise en session le choix de CV retenu (principal ou adapté) pour chaque offre.", analogy: "Le Sélecteur de Chemise de Dossier", analogyDesc: "Le classeur dans lequel on choisit de placer le bon CV avant l'envoi." },
        { path: "applications/urls.py", category: "Routage", desc: "URLs de gestion des candidatures et confirmation de stage.", analogy: "La Ligne de Chemin de Fer", analogyDesc: "Les rails qui acheminent les requêtes vers la bonne gare de traitement." },
        { path: "offers/models.py", category: "Modèles & BDD", desc: "Définit les offres de stage, entreprises, compétences requises, dates limites et l'état de synchronisation.", analogy: "Le Grand Panneau des Opportunités", analogyDesc: "Le grand tableau d'affichage des offres d'emploi affiché dans le hall de la gare." },
        { path: "offers/views.py", category: "Logique Métier", desc: "Recherche plein texte, filtres multicritères de localisation/durée et déclenchement des recommandations IA.", analogy: "Le Salon de l'Emploi", analogyDesc: "L'espace où les candidats découvrent les stands des entreprises et utilisent des bornes de recherche." },
        { path: "offers/jsearch.py", category: "API Externe", desc: "Client HTTP pour l'API OpenWeb Ninja (JSearch search-v2), avec pagination par curseur et filtrage des stages IT.", analogy: "L'Éclaireur International", analogyDesc: "Le messager envoyé à l'extérieur pour collecter les offres d'emploi récentes sur tout le territoire." },
        { path: "offers/importation.py", category: "Synchronisation", desc: "Importation transactionnelle avec verrou `select_for_update` pour empêcher les imports concurrents et doublons.", analogy: "Le Douanier & Magasinier", analogyDesc: "Il bloque la porte le temps d'inventorier la marchandise et vérifie qu'aucun carton n'est enregistré deux fois." },
        { path: "offers/recommandation.py", category: "Intelligence Artificielle", desc: "Algorithme de scoring comparant le profil étudiant aux offres actives via Groq pour recommander les 3 meilleures.", analogy: "L'Entremetteur Intelligent (Matchmaker)", analogyDesc: "L'expert qui analyse votre personnalité et vos compétences pour trouver les partenaires professionnels idéaux." },
        { path: "offers/filtres.py", category: "Filtrage", desc: "Filtres éliminant les faux stages (CDI, alternances, hors-France) et isolant les postes IT stricts.", analogy: "Le Tamis de l'Orpailleur", analogyDesc: "La grille qui ne retient que les vraies pépites d'or et élimine les cailloux." },
        { path: "offers/management/commands/synchroniser_offres.py", category: "CLI", desc: "Commande Django exécutable en CLI ou via tâche Cron pour synchroniser les annonces.", analogy: "Le Télérupteur de Minuterie", analogyDesc: "Le mécanisme qui déclenche la synchronisation automatique à heure fixe." },
        { path: "schools/models.py", category: "Modèles & BDD", desc: "Journal d'alertes enregistrant les confirmations et annulations de stage des étudiants avec anti-doublon.", analogy: "Le Téléscripteur d'Urgence", analogyDesc: "La sonnerie qui retentit au secrétariat de l'école dès qu'un étudiant trouve son stage." },
        { path: "schools/views.py", category: "Logique Métier", desc: "Tableau de bord de l'école avec KPIs, taux d'insertion, liste filtrée des étudiants et centre de notifications.", analogy: "La Tour de Contrôle Pédagogique", analogyDesc: "L'écran géant des directeurs d'études qui montre en temps réel qui est en vol, qui a atterri et qui a besoin d'aide." },
        { path: "schools/urls.py", category: "Routage", desc: "URLs de l'espace école : tableau de bord, étudiants et centre d'alertes.", analogy: "L'Orientation des Couloirs de la Faculté", analogyDesc: "Les panneaux fléchés menant aux différents bureaux pédagogiques." },
        { path: "templates/base.html", category: "Templates", desc: "Squelette HTML global avec Bootstrap, variables de thème clair/sombre, conteneur principal et footer.", analogy: "Le Châssis du Véhicule", analogyDesc: "La structure en acier commune sur laquelle repose toute la carrosserie de l'application." },
        { path: "templates/components/navbar.html", category: "Templates", desc: "Barre de navigation adaptative selon le rôle, avec cloche de notifications et sélecteur de thème.", analogy: "Le Tableau de Bord du Pilote", analogyDesc: "Le bandeau de commandes sous les yeux du conducteur avec tous les boutons et indicateurs vitaux." },
        { path: "templates/components/footer.html", category: "Templates", desc: "Pied de page institutionnel de l'école 3iL Ingénieurs.", analogy: "La Signature Officielle", analogyDesc: "Les mentions légales et l'origine certifiée du site." },
        { path: "templates/components/messages.html", category: "Templates", desc: "Notifications flash (toasts) pour informer l'utilisateur des succès et erreurs.", analogy: "Le Haut-Parleur d'Annonce", analogyDesc: "La voix qui annonce les événements importants dans la gare." },
        { path: "templates/components/dashboard_donut.html", category: "Templates", desc: "Composant graphique circulaire SVG pur affichant la répartition des candidatures.", analogy: "Le Compteur de Vitesse Circulaire", analogyDesc: "Le cadran rond qui indique en un coup d'œil le pourcentage d'avancement." },
        { path: "templates/accounts/connexion.html", category: "Templates", desc: "Page de connexion avec sélecteur d'espace visuel (Étudiant ou École).", analogy: "Le Sas d'Entrée Sécurisé", analogyDesc: "La porte d'accès sécurisée par badge." },
        { path: "templates/accounts/inscription.html", category: "Templates", desc: "Formulaire de création de compte pour les nouveaux étudiants.", analogy: "Le Formulaire de Première Rentrée", analogyDesc: "La fiche administrative de rentrée scolaire." },
        { path: "templates/accounts/tableau_de_bord.html", category: "Templates", desc: "Cockpit principal de l'étudiant avec métriques et accès rapide.", analogy: "Le Cockpit de l'Étudiant", analogyDesc: "La console affichant le statut du CV et les candidatures en cours." },
        { path: "templates/accounts/modifier_profil.html", category: "Templates", desc: "Interface d'édition dynamique du profil avec formsets imbriqués.", analogy: "L'Atelier de Personnalisation", analogyDesc: "L'établi où l'on ajoute ses nouvelles compétences et expériences." },
        { path: "templates/accounts/mon_cv.html", category: "Templates", desc: "Visualiseur du PDF vectoriel généré et bouton de régénération.", analogy: "Le Studio de Tirage Photo", analogyDesc: "La pièce où l'on contemple son portrait imprimé en haute définition." },
        { path: "templates/applications/mes_candidatures.html", category: "Templates", desc: "Tableau de suivi des démarches de stage avec filtres et confirmation.", analogy: "Le Carnet de Bord des Démarches", analogyDesc: "Le journal où sont répertoriées toutes les candidatures envoyées." },
        { path: "templates/offers/liste_offres.html", category: "Templates", desc: "Catalogue d'annonces avec filtres par durée, ville et bouton IA.", analogy: "Le Kiosque des Petites Annonces", analogyDesc: "Le panneau où sont affichées toutes les offres disponibles." },
        { path: "templates/offers/detail_offre.html", category: "Templates", desc: "Fiche complète d'un poste avec compétences clés et choix du CV.", analogy: "Le Contrat de Poste Dévoilé", analogyDesc: "La fiche descriptive exhaustive de la mission." },
        { path: "templates/schools/tableau_de_bord.html", category: "Templates", desc: "Dashboard de l'école avec jauges d'insertion et statistiques globales.", analogy: "La Tour de Contrôle Pédagogique", analogyDesc: "L'écran géant des directeurs d'études pour piloter la promo." },
        { path: "templates/schools/liste_etudiants.html", category: "Templates", desc: "Trombinoscope et liste de suivi individuel des étudiants.", analogy: "Le Trombinoscope Universitaire", analogyDesc: "La liste complète de la promotion avec statut de chacun." },
        { path: "templates/schools/notifications.html", category: "Templates", desc: "Journal d'alertes en direct des stages trouvés par les élèves.", analogy: "Le Fil d'Actualité des Victoires", analogyDesc: "Le flux des confirmations officielles de stage." },
        { path: "static/css/style.css", category: "Design System", desc: "Variables CSS globales, styles des cartes en glassmorphism et thèmes clair/sombre.", analogy: "Le Livre de Charte Graphique", analogyDesc: "Les règles d'élégance et d'harmonie visuelle du projet." },
        { path: "static/css/auth.css", category: "Design System", desc: "Styles spécifiques des écrans de connexion et d'inscription.", analogy: "L'Habillage du Hall d'Accueil", analogyDesc: "La décoration du hall d'entrée." },
        { path: "static/css/dashboard.css", category: "Design System", desc: "Mise en page des grilles de statistiques et jauges de progression.", analogy: "Le Pupitre Numérique", analogyDesc: "La disposition soignée des cadrans." },
        { path: "static/css/offers.css", category: "Design System", desc: "Mise en page des cartes d'offres et étiquettes de compétences.", analogy: "La Vitrine du Magasin", analogyDesc: "La présentation mettant en valeur chaque annonce." },
        { path: "static/css/applications.css", category: "Design System", desc: "Styles du gestionnaire de candidatures et modales d'action.", analogy: "Le Classeur de Candidatures", analogyDesc: "Les chemises colorées de dossiers." },
        { path: "static/css/schools.css", category: "Design System", desc: "Styles des tables de promotion et graphiques de suivi école.", analogy: "La Salle des Professeurs", analogyDesc: "Le tableau de bord sobre et ordonné des enseignants." },
        { path: "static/js/app.js", category: "JavaScript", desc: "Script principal gérant le thème clair/sombre et les interactions UI.", analogy: "Le Système Nerveux Front-End", analogyDesc: "Le réseau transmettant les impulsions des clics utilisateur." },
        { path: "static/js/cv_preview.js", category: "JavaScript", desc: "Moteur de prévisualisation fluide du PDF dans le navigateur.", analogy: "La Loupe Optique", analogyDesc: "L'outil permettant d'inspecter son document avant l'envoi." },
        { path: "static/js/profil_formsets.js", category: "JavaScript", desc: "Ajoute et retire dynamiquement des lignes de compétences et formations.", analogy: "L'Ajouteur Automatique de Lignes", analogyDesc: "Le bloc-notes interactif qui crée une nouvelle ligne à la demande." },
        { path: "requirements.txt", category: "Dépendances", desc: "Liste figée des bibliothèques Python (Django 6.1.1, Psycopg 3.3.6, ReportLab 4.x).", analogy: "La Liste des Ingrédients du Chef", analogyDesc: "La recette infaillible garantissant un fonctionnement identique partout." },
        { path: ".env.example", category: "Sécurité", desc: "Modèle documentant les clés d'API requises (Groq, Supabase, DB).", analogy: "Le Manuel d'Installation Électrique", analogyDesc: "Le schéma des branchements à effectuer avant la mise sous tension." },
        { path: "db.sqlite3", category: "Base Locale", desc: "Base de données relationnelle locale pour l'exécution des tests unitaires.", analogy: "Le Carnet de Notes Local", analogyDesc: "Le carnet de brouillon pour s'entraîner sans déranger personne." }
    ],

    // -------------------------------------------------------------------------
    // 5. THE COMPLETE MAJOR TREATMENTS (12 Deep-Dive Traitements avec Code)
    // -------------------------------------------------------------------------
    treatments: [
        {
            id: "traitement_auth",
            title: "1. Authentification & Aiguillage Multi-Rôles (RBAC)",
            badge: "Sécurité & Contrôle d'Accès",
            summary: "Cloisonnement hermétique des parcours Étudiant, Établissement et Administrateur avec redirection immédiate post-connexion.",
            algorithm: [
                "1. Modèle `Utilisateur(AbstractUser)` : extension native avec champ `role` (TextChoices: ETUDIANT, ECOLE) et unicité stricte de l'e-mail.",
                "2. Vérification lors du login : `ConnexionForm.clean()` valide la cohérence entre le compte saisi et le sélecteur d'espace soumis.",
                "3. Aiguillage dynamique : `accounts.views.accueil()` analyse le rôle et redirige immédiatement chaque profil vers son espace légitime.",
                "4. Validation en deux temps pour les écoles : vérification de `DemandeCompteEcole.Statut.APPROUVEE` avant tout accès.",
                "5. Protection systématique par décorateurs : `@login_required` et fonction de garde-fou `etablissement_autorise(request.user)`."
            ],
            codeSnippet: `# accounts/models.py & accounts/views.py\nclass Utilisateur(AbstractUser):\n    class Role(models.TextChoices):\n        ETUDIANT = "ETUDIANT", "Étudiant"\n        ECOLE = "ECOLE", "École"\n    email = models.EmailField(unique=True)\n    role = models.CharField(max_length=10, choices=Role.choices)\n\ndef accueil(request):\n    \"\"\"Aiguillage immédiat selon le rôle et l'état d'approbation.\"\"\"\n    if not request.user.is_authenticated:\n        return redirect("accounts:connexion")\n    if request.user.is_superuser:\n        return redirect("/admin/")\n    if request.user.role == Utilisateur.Role.ETUDIANT:\n        return redirect("accounts:tableau_de_bord")\n    if request.user.role == Utilisateur.Role.ECOLE:\n        return redirect(\n            "schools:tableau_de_bord"\n            if etablissement_autorise(request.user)\n            else "accounts:etat_demande_ecole"\n        )\n    return redirect("offers:liste_offres")`,
            keyFiles: ["accounts/models.py", "accounts/views.py", "accounts/access.py", "accounts/forms.py"]
        },
        {
            id: "traitement_ecole_approbation",
            title: "2. Inscription & Validation des Écoles en Deux Temps",
            badge: "Anti-Usurpation & Multi-Tenant",
            summary: "Protection de l'intégrité pédagogique : aucun compte école ne peut accéder aux dossiers des étudiants sans validation administrative préalable.",
            algorithm: [
                "1. L'établissement soumet le formulaire public `DemandeCompteEcoleForm` (nom officiel, code postal, contact).",
                "2. La demande est créée en base avec le statut `EN_ATTENTE` et associée au compte utilisateur fraîchement créé.",
                "3. Lors de la tentative de connexion, `etablissement_autorise(utilisateur)` constate que le statut n'est pas `APPROUVEE` et retourne `None`.",
                "4. L'utilisateur est automatiquement redirigé vers la page d'attente institutionnelle `accounts:etat_demande_ecole`.",
                "5. L'administrateur valide la demande dans Django Admin (`statut = APPROUVEE`), déverrouillant instantanément l'accès au tableau de bord école."
            ],
            codeSnippet: `# accounts/access.py\nfrom .models import DemandeCompteEcole, Etablissement, Utilisateur\n\ndef etablissement_autorise(utilisateur):\n    \"\"\"Accès aux données d'une école, identique dans les vues et la navigation.\"\"\"\n    if not utilisateur.is_authenticated or utilisateur.role != Utilisateur.Role.ECOLE:\n        return None\n    demande = DemandeCompteEcole.objects.filter(utilisateur=utilisateur).first()\n    etablissements = Etablissement.objects.filter(compte=utilisateur)\n    if demande:\n        # Seul le statut APPROUVEE déverrouille l'accès aux données étudiantes\n        if demande.statut != DemandeCompteEcole.Statut.APPROUVEE:\n            return None\n        etablissements = etablissements.filter(pk=demande.etablissement_id)\n    return etablissements.first()`,
            keyFiles: ["accounts/access.py", "accounts/models.py", "accounts/views.py", "accounts/forms.py"]
        },
        {
            id: "traitement_profil_formsets",
            title: "3. Édition Atomique du Profil Étudiant & Formsets Imbriqués",
            badge: "Formsets Django & Transactions",
            summary: "Enregistrement unifié des informations personnelles, formations, expériences professionnelles, compétences et projets avec validation globale.",
            algorithm: [
                "1. Instanciation des formsets Django avec préfixes isolés (`formations`, `experiences`, `competences`, `projets`, `certifications`).",
                "2. Le script client `profil_formsets.js` gère l'ajout et le retrait dynamique de lignes dans le DOM avec incrémentation de `TOTAL_FORMS`.",
                "3. Soumission POST : Django valide le formulaire principal `ProfilEtudiantForm` et l'ensemble des 5 formsets imbriqués.",
                "4. Enrobage dans `transaction.atomic()` : si une seule compétence ou formation est mal formatée, aucun enregistrement partiel n'est commité.",
                "5. Mise à jour de `date_modification` sur le profil, invalidant automatiquement l'ancien cache du CV pour forcer sa régénération."
            ],
            codeSnippet: `# accounts/views.py\ndef modifier_profil(request):\n    profil = get_object_or_404(ProfilEtudiant, utilisateur=request.user)\n    form = ProfilEtudiantForm(request.POST or None, instance=profil)\n    formsets = construire_formsets_profil(request, profil)\n\n    if request.method == "POST":\n        if form.is_valid() and all(fs.is_valid() for fs in formsets.values()):\n            with transaction.atomic():\n                form.save()\n                for fs in formsets.values():\n                    fs.save()\n            messages.success(request, "Votre profil a été mis à jour avec succès.")\n            return redirect("accounts:mon_cv")\n    return render(request, "accounts/modifier_profil.html", {"form": form, **formsets})`,
            keyFiles: ["accounts/views.py", "accounts/forms.py", "static/js/profil_formsets.js", "accounts/models.py"]
        },
        {
            id: "traitement_pdf",
            title: "4. Génération Vectorielle du CV en PDF (ReportLab Canvas A4)",
            badge: "ReportLab 4.x & Typographie",
            summary: "Fabrication d'un document bi-colonne élégant et léger (~25 Ko) avec texte 100% sélectionnable et indexable ATS, sans outil externe lourd.",
            algorithm: [
                "1. Contrôle des rubriques indispensables : `informations_manquantes_cv(profil)` vérifie l'école, le diplôme et au moins une compétence.",
                "2. Résolution des données structurées : `sources_cv(profil)` rassemble compétences, projets, expériences et coordonnées formatées.",
                "3. Calcul géométrique ReportLab : format A4 (210 × 297 mm), marges de 15 mm, gouttière de 9 mm, colonne gauche 55 mm et droite calculée.",
                "4. Dessin vectoriel direct : canvas ReportLab avec bandeau bleu ciel (`#164d72`), typographie Helvetica et encodage UTF-8 natif.",
                "5. Sortie en mémoire vive : flux binaire `ContentFile(buffer.getvalue())` prêt pour le stockage cloud sans écriture sur disque local."
            ],
            codeSnippet: `# accounts/cv.py & accounts/cv_layout.py\nfrom reportlab.lib.pagesizes import A4\nfrom reportlab.lib.units import mm\nfrom reportlab.pdfgen.canvas import Canvas\n\ndef generer_pdf_cv(profil, selection=None):\n    manquantes = informations_manquantes_cv(profil)\n    if manquantes:\n        raise CVPdfError("Le CV ne peut pas être généré : renseignez " + ", ".join(manquantes) + ".")\n    elements = selection_cv_validee(profil, selection) if selection else sources_cv(profil)\n    return construire_pdf(profil, elements)\n\ndef construire_pdf(profil, elements):\n    largeur, hauteur = A4\n    gauche, gouttiere = 55 * mm, 9 * mm\n    droite = largeur - 2 * 15 * mm - gauche - gouttiere\n    buffer = BytesIO()\n    canvas = Canvas(buffer, pagesize=A4)\n    # Deux colonnes indépendantes avec texte sélectionnable UTF-8\n    # Rendu vectoriel du bandeau, coordonnées et parcours...\n    return ContentFile(buffer.getvalue())`,
            keyFiles: ["accounts/cv.py", "accounts/cv_layout.py", "accounts/models.py"]
        },
        {
            id: "traitement_supabase",
            title: "5. Stockage Déporté sur Supabase S3 & Purge d'Obsolescence",
            badge: "Supabase Cloud & Sécurité RGPD",
            summary: "Conservation sécurisée des documents PDF dans un bucket privé inaccessible publiquement, avec suppression automatique des anciennes versions.",
            algorithm: [
                "1. La classe `SupabaseStorage` implémente l'interface native Django `django.core.files.storage.Storage`.",
                "2. Authentification par clé maîtresse serveur `SUPABASE_SERVICE_ROLE_KEY` (strictement confinée dans le `.env`).",
                "3. Téléversement binaire via HTTP POST vers `https://<id>.supabase.co/storage/v1/object/cv-principaux/<nom>` avec `Content-Type: application/pdf`.",
                "4. Règle d'écrasement contrôlé : l'en-tête `x-upsert: true` permet la mise à jour sans collision d'identifiants.",
                "5. Nettoyage d'obsolescence : lors de la régénération d'un CV, l'ancienne référence est immédiatement supprimée (`storage.delete`)."
            ],
            codeSnippet: `# accounts/storage.py\nclass SupabaseStorage(Storage):\n    def _save(self, name, content):\n        headers = {\n            "Authorization": f"Bearer {settings.SUPABASE_SERVICE_ROLE_KEY}",\n            "Content-Type": "application/pdf",\n            "x-upsert": "true",\n        }\n        url = f"{settings.SUPABASE_URL}/storage/v1/object/{self.bucket_name}/{name}"\n        reponse = requests.post(url, headers=headers, data=content.read(), timeout=15)\n        reponse.raise_for_status()\n        return name\n\n    def delete(self, name):\n        url = f"{settings.SUPABASE_URL}/storage/v1/object/{self.bucket_name}/{name}"\n        requests.delete(url, headers={"Authorization": f"Bearer {settings.SUPABASE_SERVICE_ROLE_KEY}"})`,
            keyFiles: ["accounts/storage.py", "accounts/cv.py", "applications/views.py"]
        },
        {
            id: "traitement_jsearch_sync",
            title: "6. Synchronisation JSearch & Verrou Exclusif `select_for_update`",
            badge: "Intégration d'API & Concurrence SQL",
            summary: "Collecte quotidienne des annonces OpenWeb Ninja avec verrouillage exclusif au niveau de la ligne BDD pour éliminer les race conditions et respecter le budget API.",
            algorithm: [
                "1. Ouverture d'une transaction atomique PostgreSQL/SQLite (`transaction.atomic()`).",
                "2. Pose d'un verrou ligne exclusif non-bloquant (`select_for_update(nowait=True)`) sur la table `EtatSynchronisation`.",
                "3. Si un second import tente de s'exécuter au même instant, PostgreSQL rejette immédiatement la requête sans attendre.",
                "4. Contrôle de date quotidienne : si `etat.date_tentative == timezone.localdate()`, l'import s'arrête pour préserver le quota d'API.",
                "5. Appel du client HTTP OpenWeb Ninja (`search-v2`), filtrage strict, et enregistrement transactionnel sans écraser les candidatures existantes."
            ],
            codeSnippet: `# offers/importation.py\ndef importer_stages(max_offres=None, max_requetes=None, *, quotidien=False):\n    bilan = {"requetes": 0, "creations": 0, "modifications": 0, "inchangees": 0}\n    with transaction.atomic():\n        EtatSynchronisation.objects.get_or_create(cle="jsearch")\n        # Verrou exclusif de ligne : rejet immédiat si déjà en cours d'exécution\n        etat = EtatSynchronisation.objects.select_for_update(nowait=True).get(cle="jsearch")\n        if quotidien and etat.date_tentative == timezone.localdate():\n            return {**bilan, "ignoree": True, "arret": "deja_tentee"}\n        \n        etat.date_tentative = timezone.localdate()\n        offres, bilan = rechercher_stages_informatiques(max_offres, max_requetes)\n        _enregistrer(offres, bilan)\n        etat.date_succes = timezone.localdate()\n        etat.save()\n        return bilan`,
            keyFiles: ["offers/importation.py", "offers/jsearch.py", "offers/models.py", "offers/management/commands/synchroniser_offres.py"]
        },
        {
            id: "traitement_filtres_jsearch",
            title: "7. Filtrage des Offres d'Emploi & Pagination par Curseur",
            badge: "API REST v2 & Dédoublonnage",
            summary: "Filtrage rigoureux des annonces collectées afin d'éliminer les faux stages (CDI, alternances) et les postes hors-France ou non-informatiques.",
            algorithm: [
                "1. Requête HTTP vers OpenWeb Ninja (`https://api.openwebninja.com/jsearch/search-v2`) avec paramètres `query='stage informatique'`, `country='fr'`, `employment_types='INTERN'`.",
                "2. Filtrage algorithmique dans `offers/filtres.py` : vérification que le titre et la description correspondent à un véritable stage étudiant.",
                "3. Exclusion des alternances déguisées ('contrat pro', 'apprentissage') et des annonces situées en dehors du territoire français.",
                "4. Navigation par curseur (`next_page_token`) permettant une collecte continue par pagination transparente.",
                "5. Dédoublonnage strict sur `identifiant_api` et `identifiant_externe` pour éviter toute pollution du catalogue."
            ],
            codeSnippet: `# offers/jsearch.py & offers/filtres.py\ndef rechercher_stages_informatiques(max_offres=None, max_requetes=None):\n    url = "https://api.openwebninja.com/jsearch/search-v2"\n    params = {"query": "stage informatique", "country": "fr", "employment_types": "INTERN"}\n    headers = {"x-api-key": settings.JSEARCH_API_KEY}\n\n    offres_retenues = []\n    # Boucle de pagination par curseur avec validation stricte\n    while curseur and len(offres_retenues) < (max_offres or 50):\n        reponse = client.get(url, headers=headers, params={**params, "cursor": curseur})\n        data = reponse.json()\n        for item in data.get("data", []):\n            if est_stage_informatique_valide(item):\n                offres_retenues.append(normaliser_offre(item))\n        curseur = data.get("parameters", {}).get("next_page_token")`,
            keyFiles: ["offers/jsearch.py", "offers/filtres.py", "offers/models.py"]
        },
        {
            id: "traitement_groq_recommandation",
            title: "8. Scoring Sémantique & Recommandations par Lots (Groq)",
            badge: "IA LLaMA 3.1 & Découpage en Lots",
            summary: "Évaluation de compatibilité sémantique entre le profil étudiant et l'ensemble des offres actives par paquets de 5 avec contrainte JSON stricte.",
            algorithm: [
                "1. Extraction des données du profil étudiant (`profil_resume`) incluant compétences, formations et projets.",
                "2. Découpage en lots (Batching) : les offres actives sont comparées par paquets de 5 pour optimiser les quotas de tokens.",
                "3. Prompt contraint ordonnant au modèle de choisir au maximum 3 offres réellement pertinentes et de ne rien inventer.",
                "4. Appel de l'API Groq LPUs (`llama-3.1-70b-versatile`) avec `\"response_format\": {\"type\": \"json_object\"}` garantissant une structure valide.",
                "5. Gestion de la limitation de débit (HTTP 429) : extraction du header `Retry-After` et levée d'une exception `RecommandationLimitee` sans planter."
            ],
            codeSnippet: `# offers/recommandation.py\ndef recommander_stages(profil):\n    offres = list(OffreStage.objects.filter(est_active=True))\n    if not offres or not settings.GROQ_API_KEY:\n        return []\n    recommandations = []\n    # Comparaison par lots de 5 avec conservation des 3 meilleurs choix précédents\n    for debut in range(0, len(offres), 5):\n        candidates = [r["offre"] for r in recommandations] + offres[debut:debut + 5]\n        recommandations = comparer_offres(profil, candidates)\n    return recommandations\n\n# Envoi de la requête contrainte à Groq :\nreponse = requests.post(\n    "https://api.groq.com/openai/v1/chat/completions",\n    headers={"Authorization": f"Bearer {settings.GROQ_API_KEY}"},\n    json={\n        "model": "llama-3.1-70b-versatile",\n        "messages": [{"role": "user", "content": consigne}],\n        "response_format": {"type": "json_object"},\n    },\n    timeout=15,\n)`,
            keyFiles: ["offers/recommandation.py", "offers/models.py", "accounts/cv.py"]
        },
        {
            id: "traitement_cv_adaptation",
            title: "9. Adaptation Sur-Mesure du CV avec Whitelist Anti-Hallucination",
            badge: "IA Groq & Garde-Fou Déterministe",
            summary: "Personnalisation ciblée des rubriques du CV pour une offre spécifique, avec vérification cryptographique et rejet absolu d'hallucination.",
            algorithm: [
                "1. Extraction d'identifiants techniques opaques (`c:14`, `p:3`, `e:2`) via `sources_cv(profil)` : aucun nom ou texte libre n'est généré par l'IA.",
                "2. Envoi du prompt à Groq lui demandant de sélectionner la liste ordonnée des identifiants les plus pertinents pour l'offre.",
                "3. Réception de la proposition JSON contrainte (`{'competences': ['c:1', 'c:4'], 'projets': ['p:2']}`).",
                "4. Garde-fou strict dans `selection_cv_validee()` : vérifie que chaque ID retourné existe bel et bien dans la BDD pour cet étudiant précis.",
                "5. Si un ID inconnu ou inventé est détecté, la proposition est rejetée (`CVPdfError`), éliminant 100% du risque de fausses compétences."
            ],
            codeSnippet: `# accounts/cv.py\ndef selection_cv_validee(profil, selection, sources=None):\n    \"\"\"Résout chaque identifiant contre le profil actuel de l'étudiant.\"\"\"\n    if type(selection) is not dict or set(selection) != {"competences", "projets", "experiences", "certifications"}:\n        raise CVPdfError("La proposition de CV adapté est invalide.")\n    sources = sources or sources_cv(profil)\n    retenus = {}\n    for rubrique, disponibles in sources.items():\n        identifiants = selection.get(rubrique, [])\n        par_id = {element["id"]: element for element in disponibles}\n        # Whitelist stricte : interdiction formelle d'inventer un identifiant\n        if any(valeur not in par_id for valeur in identifiants):\n            raise CVPdfError("La proposition contient un élément absent du profil.")\n        retenus[rubrique] = [par_id[valeur] for valeur in identifiants]\n    if not retenus["competences"]:\n        raise CVPdfError("Le CV adapté doit conserver au moins une compétence du profil.")\n    return retenus`,
            keyFiles: ["accounts/cv_adaptation.py", "accounts/cv.py", "accounts/models.py"]
        },
        {
            id: "traitement_candidature_confirmer",
            title: "10. Cycle de Candidature & Figeage Immuable de Copie PDF",
            badge: "Workflow Métier & Stockage Déporté",
            summary: "Processus complet de candidature : choix du CV en session, redirection vers le recruteur, et conservation d'une copie PDF figée et inaltérable.",
            algorithm: [
                "1. L'étudiant sélectionne son CV pour l'offre (principal ou adapté généré via IA) via `choisir_cv(request, pk)`.",
                "2. Le choix est consigné en session utilisateur (`request.session['cv_choix_offres']`).",
                "3. L'étudiant clique sur le lien externe de l'offre (ou lien mailto) pour soumettre sa candidature auprès de l'entreprise.",
                "4. Au retour, l'étudiant clique sur 'Confirmer ma candidature' : la vue `confirmer_candidature` lit le binaire du CV retenu via `_copie_cv()`.",
                "5. Enregistrement transactionnel atomique : création de `Candidature` et sauvegarde d'un fichier immuable partitionné `{profil.pk}/{offre.pk}/{uuid}.pdf`."
            ],
            codeSnippet: `# applications/views.py\n@login_required\n@require_POST\ndef confirmer_candidature(request, pk):\n    profil = _profil_etudiant(request)\n    offre = get_object_or_404(OffreStage, pk=pk, est_active=True)\n    contenu = _copie_cv(profil, principal, adapte, type_cv)\n    \n    with transaction.atomic():\n        candidature, creee = Candidature.objects.get_or_create(\n            etudiant=profil, offre=offre, defaults={"cv_choisi": type_cv}\n        )\n        if not creee:\n            messages.info(request, "Cette candidature a déjà été confirmée.")\n            return redirect("applications:mes_candidatures")\n        \n        # Figeage d'une copie PDF autonome et inaltérable liée à la candidature\n        nom = f"{profil.pk}/{offre.pk}/{uuid4().hex}.pdf"\n        candidature.fichier_cv.save(nom, ContentFile(contenu), save=False)\n        candidature.save(update_fields=["fichier_cv"])`,
            keyFiles: ["applications/views.py", "applications/models.py", "applications/cv_choice.py"]
        },
        {
            id: "traitement_confirmation_stage",
            title: "11. Confirmation Officielle de Stage & Défi par Mot de Passe",
            badge: "Sécurité PBKDF2 & Alerte École",
            summary: "Validation irréversible de l'intégration en stage par l'étudiant avec vérification cryptographique du mot de passe et notification instantanée à l'école.",
            algorithm: [
                "1. Prérequis : la candidature doit obligatoirement avoir été marquée au statut `ACCEPTEE` par l'entreprise.",
                "2. Défi de sécurité : l'étudiant doit re-saisir son mot de passe de compte. La vue appelle `request.user.check_password(mot_de_passe)`.",
                "3. Ouverture d'une transaction atomique avec verrou `select_for_update()` sur la candidature pour parer aux doubles-clics concurrents.",
                "4. Révocation idempotente : si l'étudiant avait déjà validé un autre stage auparavant, l'ancien est désactivé et l'école notifiée de l'annulation.",
                "5. Validation du nouveau stage (`stage_confirme=True`) et émission immédiate d'une alerte `NotificationEcole.notifier_action_stage(cand, CONFIRMATION)`."
            ],
            codeSnippet: `# applications/views.py\n@login_required\n@require_POST\ndef confirmer_stage(request, pk):\n    profil = _profil_etudiant(request)\n    candidature = get_object_or_404(Candidature, pk=pk, etudiant=profil)\n    \n    # 1. Vérification cryptographique du mot de passe de connexion\n    mot_de_passe = request.POST.get("mot_de_passe", "")\n    if not mot_de_passe or not request.user.check_password(mot_de_passe):\n        messages.error(request, "Mot de passe incorrect. La confirmation n'a pas été validée.")\n        return redirect("applications:mes_candidatures")\n\n    # 2. Verrouillage atomique et notification\n    with transaction.atomic():\n        cand = Candidature.objects.select_for_update().get(pk=candidature.pk)\n        # Désactiver tout autre stage précédemment confirmé par cet étudiant\n        Candidature.objects.filter(etudiant=profil, stage_confirme=True).exclude(pk=cand.pk).update(stage_confirme=False)\n        \n        cand.stage_confirme = True\n        cand.date_confirmation_stage = timezone.now()\n        cand.save(update_fields=["stage_confirme", "date_confirmation_stage"])\n        \n        # Déclenchement de l'alerte pour l'établissement de l'étudiant\n        NotificationEcole.notifier_action_stage(cand, NotificationEcole.TypeAction.CONFIRMATION)`,
            keyFiles: ["applications/views.py", "applications/models.py", "schools/models.py", "schools/views.py"]
        },
        {
            id: "traitement_pilotage_ecole",
            title: "12. Pilotage Pédagogique, Agrégats SQL `Q(...)` & Acquittement",
            badge: "Optimisation SQL & Dashboard",
            summary: "Calcul en un seul aller-retour SQL de tous les indicateurs d'insertion de la promotion et mise à jour en bloc des notifications.",
            algorithm: [
                "1. La fonction `categoriser_etudiants(etablissement)` interroge les profils étudiants rattachés à l'école connectée.",
                "2. Optimisation SQL majeure : utilisation d'expressions d'agrégation conditionnelles `Count('candidatures', filter=Q(...))`.",
                "3. Zéro requête N+1 : les candidatures totales, acceptées, confirmées, en attente et refusées sont calculées par le moteur de base de données en une seule passe `GROUP BY`.",
                "4. Le tableau de bord affiche les ratios d'insertion et le graphique SVG donut sans aucune bibliothèque JS externe.",
                "5. Centre d'alertes : la vue `marquer_tout_lu()` exécute `NotificationEcole.objects.filter(etablissement=etablissement, est_lue=False).update(est_lue=True)` en une seule instruction SQL UPDATE."
            ],
            codeSnippet: `# schools/views.py\ndef categoriser_etudiants(etablissement):\n    \"\"\"Calcule tous les KPIs de promotion en une seule requête SQL annotée.\"\"\"\n    return (\n        ProfilEtudiant.objects.filter(etablissement=etablissement)\n        .select_related("utilisateur")\n        .annotate(\n            nb_total_cand=Count("candidatures", distinct=True),\n            nb_confirmes=Count("candidatures", filter=Q(candidatures__stage_confirme=True), distinct=True),\n            nb_acceptees=Count("candidatures", filter=Q(candidatures__statut=Candidature.Statut.ACCEPTEE), distinct=True),\n            nb_en_attente=Count("candidatures", filter=Q(candidatures__statut=Candidature.Statut.ENVOYEE), distinct=True),\n            nb_refusees=Count("candidatures", filter=Q(candidatures__statut=Candidature.Statut.REFUSEE), distinct=True),\n        )\n        .order_by("-utilisateur__date_joined", "-id")\n    )\n\ndef marquer_tout_lu(request):\n    \"\"\"Mise à jour de masse sans chargement d'objets en mémoire.\"\"\"\n    etablissement = etablissement_autorise(request.user)\n    NotificationEcole.objects.filter(etablissement=etablissement, est_lue=False).update(est_lue=True)\n    return redirect("schools:notifications")`,
            keyFiles: ["schools/views.py", "schools/models.py", "accounts/access.py", "templates/schools/tableau_de_bord.html"]
        }
    ],


    // -------------------------------------------------------------------------
    // 4. SECURITY & OWASP ARCHITECTURE PRINCIPLES
    // -------------------------------------------------------------------------
    security: [
        {
            title: "Protection contre les failles CSRF (Cross-Site Request Forgery)",
            desc: "Toutes les requêtes modifiant l'état (POST) intègrent obligatoirement la balise `{% csrf_token %}` et sont validées par le middleware `CsrfViewMiddleware`. Les vues de mutation sont explicitement décorées avec `@require_POST`.",
            icon: "🛡️"
        },
        {
            title: "Protection contre les Injections SQL (Django ORM)",
            desc: "Aucune chaîne SQL brute n'est concaténée. Toutes les requêtes transitent par l'ORM Django qui utilise systématiquement des requêtes préparées avec des paramètres typés et échappés au niveau du driver de base de données.",
            icon: "🔒"
        },
        {
            title: "Hachage Sécurisé des Mots de Passe",
            desc: "Les mots de passe ne sont jamais stockés en clair. Django utilise l'algorithme cryptographique robuste PBKDF2 avec SHA-256 et sel individuel (Salt) résistant aux attaques par dictionnaire et tables arc-en-ciel.",
            icon: "🔑"
        },
        {
            title: "Isolation Multi-Tenant Établissement (Anti-IDOR)",
            desc: "Les responsables d'école ne peuvent accéder qu'aux étudiants de leur propre établissement. Le filtre SQL est injecté à partir du compte en session (`etablissement_autorise(request.user)`), empêchant toute altération d'identifiant dans l'URL.",
            icon: "🏢"
        },
        {
            title: "Transactions Atomiques & Verrous Anti-Concurrence",
            desc: "Utilisation de `transaction.atomic()` et `select_for_update()` sur les opérations sensibles (inscription école, confirmation de stage, import d'offres) pour éliminer les 'Race Conditions' et les doublons.",
            icon: "⚡"
        },
        {
            title: "Stockage Privé Déporté (Zéro Clé Exposée)",
            desc: "La clé secrète Supabase `SERVICE_ROLE` n'est présente que dans les variables d'environnement du serveur (`.env`). Les fichiers PDF ne sont jamais exposés publiquement mais servis via `FileResponse` après vérification de session.",
            icon: "📦"
        }
    ],

    // -------------------------------------------------------------------------
    // 5. ORAL DEFENSE SIMULATOR (Questions Pièges du Professeur)
    // -------------------------------------------------------------------------
    oralQuestions: [
        {
            category: "Architecture & BDD",
            q: "Pourquoi avoir choisi Django plutôt qu'une architecture séparée FastAPI + React ?",
            a: "Pour un projet de gestion de stages comme StagePilot, Django apporte une architecture MVT complète 'Batteries-Included' : système d'authentification robuste éprouvé, protection native contre CSRF/XSS/SQLi, ORM puissant avec migrations déclaratives, interface d'administration prête à l'emploi et rendu serveur sans latence de build JavaScript."
        },
        {
            category: "Architecture & BDD",
            q: "Pourquoi utiliser SQLite en développement et comment passeriez-vous sur PostgreSQL en production ?",
            a: "SQLite est idéal pour le développement local et la suite de 110 tests automatisés ultra-rapides en mémoire. Pour la production, nous utilisons PostgreSQL hébergé sur Supabase : il suffit de modifier `DATABASES['default']` dans `settings.py` via `dj_database_url` et d'exécuter `manage.py migrate` sans changer une seule ligne de code métier grâce à l'abstraction de l'ORM."
        },
        {
            category: "Concurrence & Transactions",
            q: "À quoi sert l'instruction `select_for_update(nowait=True)` dans l'importation des offres ?",
            a: "Elle pose un verrou exclusif au niveau de la ligne de base de données dans la table `EtatSynchronisation`. Si deux requêtes ou un cron tentent de synchroniser les offres au même instant, la deuxième est immédiatement rejetée (`nowait=True`) évitant les doublons et la surconsommation du quota d'API externe."
        },
        {
            category: "Intelligence Artificielle",
            q: "Comment êtes-vous certain que Groq ne va pas inventer des diplômes à l'étudiant dans son CV adapté ?",
            a: "Nous appliquons un filtrage par whitelist stricte : l'étudiant ne transmet à Groq que des identifiants techniques opaques (`c:1`, `p:2`). La fonction de contrôle `selection_cv_validee()` vérifie que chaque ID retourné dans le JSON existe bel et bien dans la base de données pour cet étudiant précis avant toute intégration dans le PDF."
        },
        {
            category: "Sécurité & Authentification",
            q: "Comment fonctionne la vérification du mot de passe lors de la confirmation d'un stage ?",
            a: "La vue `confirmer_stage` appelle `request.user.check_password(mot_de_passe)`. Django extrait le mot de passe soumis, lui applique le même sel et l'algorithme PBKDF2 pour comparer le hachage avec celui stocké en base, sans jamais déchiffrer le mot de passe."
        },
        {
            category: "Performance & Optimisation",
            q: "Comment évitez-vous le problème du 'N+1 queries' dans les listes d'offres ou d'étudiants ?",
            a: "Nous utilisons systématiquement `select_related()` pour les relations OneToOne/ForeignKey (comme `etudiant__utilisateur` ou `candidature__offre`) et `prefetch_related()` pour les relations ManyToMany/Formsets (compétences, projets), ce qui regroupe les jointures en seulement 1 ou 2 requêtes SQL globales."
        }
    ],

    // -------------------------------------------------------------------------
    // 6. LIVE REQUEST JOURNEY PIPELINES (Cycle de Vie Fichier par Fichier)
    // -------------------------------------------------------------------------
    requestFlows: {
        "confirmer_stage": {
            id: "confirmer_stage",
            title: "1. Confirmer son stage officiel (Contrat accepté)",
            badge: "Validation Juridique",
            method: "POST",
            endpoint: "/candidatures/1/confirmer-stage/",
            desc: "L'étudiant accepte son offre finale chez Thales. Le système exige son mot de passe, pose un verrou exclusif select_for_update(), modifie la valeur stage_confirme=True et diffuse une alerte en temps réel à l'administration 3iL.",
            color: "#0F766E",
            steps: [
                {
                    stepNum: 1,
                    nature: "CHECK",
                    natureLabel: "CONTRÔLE & FORMULAIRE",
                    natureIcon: "📋",
                    natureColor: "#f59e0b",
                    fromFile: "Navigateur Client Web",
                    toFile: "templates/applications/mes_candidatures.html",
                    currentFile: "templates/applications/mes_candidatures.html:L215",
                    layer: "Client Web (HTML/JS)",
                    whatHappened: "L'étudiant clique sur 'Valider comme mon stage officiel'. Une boîte de dialogue modale s'ouvre pour exiger la saisie de son mot de passe afin d'authentifier cette démarche légale irréversible.",
                    stateChange: "Préparation de la requête POST avec le mot de passe masqué et le jeton CSRF.",
                    payload: "mot_de_passe=••••••••&csrfmiddlewaretoken=HMAC_SHA256_x91j3k09a",
                    code: `<form method="post" action="{% url 'applications:confirmer_stage' cand.pk %}">
    {% csrf_token %}
    <label for="id_pwd">Confirmez votre mot de passe étudiant :</label>
    <input type="password" name="mot_de_passe" required>
    <button type="submit" class="bouton-accepter">Valider définitivement mon stage</button>
</form>`,
                    sql: null,
                    latency: "1 ms",
                    oralTip: "L'OWASP recommande d'exiger une ré-authentification par mot de passe avant toute opération critique ou contractuelle."
                },
                {
                    stepNum: 2,
                    nature: "VERIFICATION",
                    natureLabel: "VÉRIFICATION SÉCURITÉ",
                    natureIcon: "🛡️",
                    natureColor: "#38bdf8",
                    fromFile: "templates/applications/mes_candidatures.html",
                    toFile: "django.contrib.auth.middleware",
                    currentFile: "django/contrib/auth/middleware.py:L24",
                    layer: "Middlewares Django (CSRF & Session)",
                    whatHappened: "Le middleware CSRF contrôle la signature cryptographique du jeton. Le middleware d'authentification déchiffre le cookie de session et résout l'utilisateur connecté : Lina Martin (Étudiante 3iL).",
                    stateChange: "Session vérifiée avec succès : request.user = <Utilisateur: lina.martin@3il.fr>",
                    payload: "Cookie: sessionid=k7a92f4e8b (TTL: 14 jours) | Jeton CSRF : Valide [200 OK]",
                    code: `def process_request(self, request):
    request.user = auth.get_user(request)
    if not request.user.is_authenticated:
        return redirect('accounts:connexion')`,
                    sql: "SELECT * FROM django_session WHERE session_key = 'k7a92f4e8b';",
                    latency: "12 ms",
                    oralTip: "Si le jeton CSRF est falsifié ou absent, Django coupe court à l'exécution avec un code HTTP 403 Forbidden avant même d'atteindre la vue."
                },
                {
                    stepNum: 3,
                    nature: "VERIFICATION",
                    natureLabel: "AIGUILLAGE D'URL",
                    natureIcon: "🔀",
                    natureColor: "#818cf8",
                    fromFile: "django.middleware",
                    toFile: "applications/urls.py",
                    currentFile: "applications/urls.py:L18",
                    layer: "Aiguilleur d'URL (urls.py)",
                    whatHappened: "Résolution de l'URL '/candidatures/1/confirmer-stage/'. Le convertisseur d'URL '<int:pk>' valide strictement le type entier de l'identifiant (pk=1) et achemine la requête vers la fonction de vue.",
                    stateChange: "Dispatch vers : applications.views.confirmer_stage(request, pk=1)",
                    payload: "resolver_match = ResolverMatch(func=confirmer_stage, kwargs={'pk': 1})",
                    code: `urlpatterns = [
    path('<int:pk>/confirmer-stage/', views.confirmer_stage, name='confirmer_stage'),
]`,
                    sql: null,
                    latency: "14 ms",
                    oralTip: "L'utilisation de '<int:pk>' garantit que la variable transmise à Python est strictement un entier, éliminant les injections d'URL."
                },
                {
                    stepNum: 4,
                    nature: "CHECK",
                    natureLabel: "CONTRÔLE IDENTITÉ",
                    natureIcon: "🔑",
                    natureColor: "#f59e0b",
                    fromFile: "applications/urls.py",
                    toFile: "applications/views.py",
                    currentFile: "applications/views.py:L268",
                    layer: "Contrôleur de Vue (views.py)",
                    whatHappened: "La vue extrait le mot de passe soumis et exécute 'request.user.check_password(mot_de_passe)'. Django applique le sel stocké en base et compare les hachages PBKDF2-SHA256 en mémoire en temps constant.",
                    stateChange: "Contrôle cryptographique : MATCH [TRUE]. L'étudiant est formellement identifié.",
                    payload: "mot_de_passe saisi ➔ comparé à user.password (pbkdf2_sha256$720000$...)",
                    code: `@login_required
@require_POST
def confirmer_stage(request, pk):
    mot_de_passe = request.POST.get("mot_de_passe", "")
    if not request.user.check_password(mot_de_passe):
        messages.error(request, "Mot de passe incorrect.")
        return redirect("applications:mes_candidatures")`,
                    sql: null,
                    latency: "42 ms",
                    oralTip: "Le mot de passe n'est jamais déchiffré : Django hache la saisie avec le même sel et compare les hachages en temps constant pour contrer les Timing Attacks."
                },
                {
                    stepNum: 5,
                    nature: "TREATMENT",
                    natureLabel: "VERROU TRANSACTIONNEL",
                    natureIcon: "🔒",
                    natureColor: "#6366f1",
                    fromFile: "applications/views.py",
                    toFile: "applications/models.py & PostgreSQL",
                    currentFile: "applications/views.py:L280",
                    layer: "ORM & Verrou SQL (select_for_update)",
                    whatHappened: "Démarrage d'un bloc transactionnel atomique 'transaction.atomic()'. Pose d'un verrou exclusif de ligne 'FOR UPDATE' sur la candidature ciblée et sur les anciennes candidatures de l'étudiant pour empêcher les accès concurrents.",
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
                    latency: "58 ms",
                    oralTip: "'select_for_update()' garantit l'isolation ACID et élimine toute 'Race Condition' si l'étudiant clique deux fois très vite."
                },
                {
                    stepNum: 6,
                    nature: "VALUE_CHANGE",
                    natureLabel: "CHANGEMENT DE VALEUR SQL",
                    natureIcon: "💾",
                    natureColor: "#10b981",
                    fromFile: "applications/views.py",
                    toFile: "applications/models.py",
                    currentFile: "applications/views.py:L295",
                    layer: "Modèle ORM & Base de Données",
                    whatHappened: "Mutation de l'état en base SQL : annulation de tout stage confirmé antérieur, puis mise à jour du champ booléen de la nouvelle candidature vers 'stage_confirme = True'.",
                    stateChange: "cand.stage_confirme : False ➔ True | cand.date_confirmation = NOW() | commit SQL effectué.",
                    payload: "ID: 1 | Entreprise: Thales Limoges | Stage Confirmé: TRUE",
                    code: `# Réinitialisation des anciens stages validés
for ancienne in Candidature.objects.select_for_update().filter(etudiant=profil, stage_confirme=True).exclude(pk=cand.pk):
    ancienne.stage_confirme = False
    ancienne.save(update_fields=["stage_confirme"])

cand.stage_confirme = True
cand.save(update_fields=["stage_confirme"])`,
                    sql: "UPDATE applications_candidature SET stage_confirme = FALSE WHERE etudiant_id = 14 AND id != 1 AND stage_confirme = TRUE;\nUPDATE applications_candidature SET stage_confirme = TRUE WHERE id = 1;\nCOMMIT;",
                    latency: "75 ms",
                    oralTip: "L'argument update_fields=['stage_confirme'] ne réécrit que cette colonne spécifique en SQL au lieu de réécrire toute la ligne, ce qui est plus rapide et évite d'écraser d'autres champs."
                },
                {
                    stepNum: 7,
                    nature: "NOTIFICATION",
                    natureLabel: "NOTIFICATION ÉCOLE",
                    natureIcon: "🔔",
                    natureColor: "#ec4899",
                    fromFile: "applications/views.py",
                    toFile: "schools/models.py",
                    currentFile: "schools/models.py:L120",
                    layer: "Module École (NotificationEcole)",
                    whatHappened: "Génération automatique d'un enregistrement d'alerte rattaché à l'école 3iL. Incrémente le compteur de notifications non lues du responsable des stages.",
                    stateChange: "Création : NotificationEcole(etablissement_id=1, etudiant_id=14, type='CONFIRMATION', est_lue=False)",
                    payload: "Titre : 'Stage confirmé : Lina Martin chez Thales Group' | Cloche école : 2 ➔ 3 alertes",
                    code: `NotificationEcole.notifier_action_stage(
    cand, 
    NotificationEcole.TypeAction.CONFIRMATION
)`,
                    sql: "INSERT INTO schools_notificationecole (etablissement_id, etudiant_id, type_action, est_lue, date_creation)\nVALUES (1, 14, 'CONFIRMATION', FALSE, NOW());",
                    latency: "88 ms",
                    oralTip: "L'école dispose ainsi d'un suivi en temps réel de son taux d'insertion sans avoir à interroger les étudiants un par un."
                },
                {
                    stepNum: 8,
                    nature: "RESPONSE",
                    natureLabel: "RÉPONSE & REDIRECTION",
                    natureIcon: "📦",
                    natureColor: "#0ea5e9",
                    fromFile: "applications/views.py",
                    toFile: "Navigateur Client Web",
                    currentFile: "applications/views.py:L312",
                    layer: "Réponse HTTP (Pattern PRG)",
                    whatHappened: "Le contrôleur stocke un message flash de félicitations dans les cookies de session et renvoie une réponse HTTP 302 Found redirigeant vers la liste des candidatures.",
                    stateChange: "Navigateur : Affiche le toast de succès vert et le badge '★ Stage confirmé'.",
                    payload: "HTTP/1.1 302 Found | Location: /candidatures/ | Set-Cookie: messages=...",
                    code: `messages.success(request, "Félicitations ! Votre stage chez Thales est officiellement confirmé.")
return redirect("applications:mes_candidatures")`,
                    sql: null,
                    latency: "95 ms",
                    oralTip: "Le pattern Post-Redirect-Get (PRG) empêche le renvoi accidentel du formulaire de confirmation si l'utilisateur appuie sur la touche F5."
                }
            ]
        },

        "postuler_stage": {
            id: "postuler_stage",
            title: "2. Postuler à une offre de stage (avec copie figée du CV)",
            badge: "Candidature Étudiant",
            method: "POST",
            endpoint: "/offres/1/postuler/",
            desc: "Envoi sécurisé du dossier, validation CSRF, vérification d'unicité, génération de la copie immuable du CV vers Supabase Storage et persistance en base de données.",
            color: "#6366f1",
            steps: [
                {
                    stepNum: 1,
                    nature: "CHECK",
                    natureLabel: "CONTRÔLE & FORMULAIRE",
                    natureIcon: "📋",
                    natureColor: "#f59e0b",
                    fromFile: "Navigateur Client Web",
                    toFile: "templates/offers/detail_offre.html",
                    currentFile: "templates/offers/detail_offre.html:L115",
                    layer: "Client Web (HTML/JS)",
                    whatHappened: "L'étudiant choisit la version de son CV (Principal ou Adapté Groq) et valide le formulaire POST.",
                    stateChange: "Préparation des données multipart avec l'identifiant du CV choisi et la lettre de motivation.",
                    payload: "cv_choisi=ADAPTE&lettre=Madame,%20Monsieur...",
                    code: `fetch('/offres/1/postuler/', { method: 'POST', body: formData });`,
                    sql: null,
                    latency: "1 ms",
                    oralTip: "Le navigateur injecte automatiquement le cookie de session et le jeton CSRF pour garantir l'identité de l'étudiant."
                },
                {
                    stepNum: 2,
                    nature: "VERIFICATION",
                    natureLabel: "VÉRIFICATION SÉCURITÉ",
                    natureIcon: "🛡️",
                    natureColor: "#38bdf8",
                    fromFile: "templates/offers/detail_offre.html",
                    toFile: "stagepilot/middleware.py",
                    currentFile: "django/contrib/auth/middleware.py:L24",
                    layer: "Middlewares Django",
                    whatHappened: "Contrôle du jeton CSRF, déchiffrement du cookie de session et vérification que l'utilisateur possède bien le rôle ÉTUDIANT.",
                    stateChange: "Autorisation confirmée pour l'étudiante Lina Martin.",
                    payload: "Session active | Utilisateur: lina.martin@3il.fr",
                    code: `@require_POST
@login_required
def postuler(request, pk):
    ...`,
                    sql: "SELECT * FROM django_session WHERE session_key = 'k7a92f4e8b';",
                    latency: "12 ms",
                    oralTip: "Le décorateur @require_POST rejette toute tentative malveillante d'appel par simple lien GET."
                },
                {
                    stepNum: 3,
                    nature: "VERIFICATION",
                    natureLabel: "AIGUILLAGE D'URL",
                    natureIcon: "🔀",
                    natureColor: "#818cf8",
                    fromFile: "stagepilot/middleware.py",
                    toFile: "offers/urls.py",
                    currentFile: "offers/urls.py:L14",
                    layer: "Aiguilleur d'URL (urls.py)",
                    whatHappened: "Capture du paramètre d'URL '<int:pk>' (pk=1) et routage vers applications.views.postuler.",
                    stateChange: "Paramètre pk=1 validé comme entier.",
                    payload: "URL Match : path('<int:pk>/postuler/', views.postuler, name='postuler')",
                    code: `path('<int:pk>/postuler/', views.postuler, name='postuler')`,
                    sql: null,
                    latency: "15 ms",
                    oralTip: "Le typage d'URL empêche l'injection de caractères spéciaux dans la vue."
                },
                {
                    stepNum: 4,
                    nature: "CHECK",
                    natureLabel: "CONTRÔLE D'UNICITÉ",
                    natureIcon: "🔑",
                    natureColor: "#f59e0b",
                    fromFile: "offers/urls.py",
                    toFile: "applications/views.py",
                    currentFile: "applications/views.py:L98",
                    layer: "Contrôleur de Vue (views.py)",
                    whatHappened: "Vérification en base SQL qu'aucune candidature n'existe déjà pour ce couple (étudiant, offre).",
                    stateChange: "Contrôle anti-doublon : False (Aucune candidature existante, validation accordée).",
                    payload: "etudiant=14 | offre=1 | exists() -> False",
                    code: `offre = get_object_or_404(OffreStage, pk=pk)
if Candidature.objects.filter(etudiant=profil, offre=offre).exists():
    messages.warning(request, "Vous avez déjà postulé à cette offre.")
    return redirect('offers:detail_offre', pk=pk)`,
                    sql: "SELECT 1 FROM applications_candidature WHERE etudiant_id = 14 AND offre_id = 1 LIMIT 1;",
                    latency: "28 ms",
                    oralTip: "La contrainte unique_together=('etudiant', 'offre') sur le modèle assure un double verrou au niveau SQL."
                },
                {
                    stepNum: 5,
                    nature: "VALUE_CHANGE",
                    natureLabel: "CHANGEMENT DE VALEUR SQL",
                    natureIcon: "💾",
                    natureColor: "#10b981",
                    fromFile: "applications/views.py",
                    toFile: "applications/models.py",
                    currentFile: "applications/views.py:L142",
                    layer: "Modèle ORM & Base SQL",
                    whatHappened: "Création transactionnelle de la ligne de candidature avec statut initial 'ENVOYEE'.",
                    stateChange: "Nouvelle candidature enregistrée en base SQL : id=88, statut='ENVOYEE'.",
                    payload: "Candidature(id=88, etudiant_id=14, offre_id=1, statut='ENVOYEE')",
                    code: `candidature = Candidature.objects.create(
    etudiant=profil, offre=offre, cv_choisi=cv_choisi,
    statut=Candidature.Statut.ENVOYEE
)`,
                    sql: "INSERT INTO applications_candidature (etudiant_id, offre_id, cv_choisi, statut, date_candidature) VALUES (14, 1, 'ADAPTE', 'ENVOYEE', NOW());",
                    latency: "45 ms",
                    oralTip: "L'ORM Django protège automatiquement contre toutes les injections SQL grâce aux requêtes paramétrées."
                },
                {
                    stepNum: 6,
                    nature: "TREATMENT",
                    natureLabel: "ARCHIVAGE CLOUD IMMUABLE",
                    natureIcon: "⚙️",
                    natureColor: "#6366f1",
                    fromFile: "applications/views.py",
                    toFile: "applications/services.py & Supabase",
                    currentFile: "applications/services.py:L54",
                    layer: "Service Cloud (Supabase Storage)",
                    whatHappened: "Duplication physique du PDF du CV vers un emplacement figé dans le bucket cloud privé 'stagepilot-cv'.",
                    stateChange: "Fichier immuable créé : candidatures/14/cv_offre_1_copie.pdf rattaché au dossier.",
                    payload: "Copie PDF créée : 24.8 Ko téléversés vers Supabase Storage privé.",
                    code: `dupliquer_pdf_pour_candidature(candidature)`,
                    sql: "UPDATE applications_candidature SET copie_cv = 'candidatures/14/cv_offre_1_copie.pdf' WHERE id = 88;",
                    latency: "110 ms",
                    oralTip: "Figer la copie du CV garantit la traçabilité légale en cas de litige, même si l'étudiant modifie son profil plus tard."
                },
                {
                    stepNum: 7,
                    nature: "RESPONSE",
                    natureLabel: "RÉPONSE & REDIRECTION",
                    natureIcon: "📦",
                    natureColor: "#0ea5e9",
                    fromFile: "applications/services.py",
                    toFile: "Navigateur Client Web",
                    currentFile: "applications/views.py:L158",
                    layer: "Réponse HTTP (Pattern PRG)",
                    whatHappened: "Redirection vers la page 'Mes candidatures' avec Toast flash de confirmation.",
                    stateChange: "Affichage de la nouvelle candidature dans le tableau de bord de l'étudiant.",
                    payload: "HTTP/1.1 302 Found | Location: /candidatures/",
                    code: `messages.success(request, "Votre candidature a été transmise avec succès !")
return redirect("applications:mes_candidatures")`,
                    sql: null,
                    latency: "115 ms",
                    oralTip: "Le pattern PRG évite toute double soumission si l'utilisateur actualise la page."
                }
            ]
        },

        "generer_cv": {
            id: "generer_cv",
            title: "3. Génération vectorielle du CV en PDF (ReportLab Canvas)",
            badge: "Moteur PDF & Cloud",
            method: "POST",
            endpoint: "/comptes/cv/generer/",
            desc: "Compilation des coordonnées, formations 3iL et compétences dans un PDF vectoriel A4 à deux colonnes sans outil externe lourd.",
            color: "#0284c7",
            steps: [
                {
                    stepNum: 1,
                    nature: "CHECK",
                    natureLabel: "DÉCLENCHEUR CLIENT",
                    natureIcon: "🖱️",
                    natureColor: "#f59e0b",
                    fromFile: "Navigateur Client Web",
                    toFile: "templates/accounts/mon_cv.html",
                    currentFile: "templates/accounts/mon_cv.html:L55",
                    layer: "Client Web (HTML/JS)",
                    whatHappened: "L'étudiant clique sur 'Générer mon CV principal' dans son espace CV.",
                    stateChange: "Émission d'une requête POST authentifiée vers le point de génération.",
                    payload: "POST /comptes/cv/generer/ HTTP/1.1",
                    code: `fetch('/comptes/cv/generer/', { method: 'POST' });`,
                    sql: null,
                    latency: "1 ms",
                    oralTip: "Une barre de progression informe l'utilisateur pendant le calcul du document."
                },
                {
                    stepNum: 2,
                    nature: "CHECK",
                    natureLabel: "CONTRÔLE DE COMPLÉTUDE",
                    natureIcon: "🔑",
                    natureColor: "#f59e0b",
                    fromFile: "templates/accounts/mon_cv.html",
                    toFile: "accounts/views.py",
                    currentFile: "accounts/views.py:L520",
                    layer: "Contrôleur de Vue (views.py)",
                    whatHappened: "Vérification que les champs obligatoires (promotion, compétences, coordonnées) sont renseignés sur le profil.",
                    stateChange: "Validation : Aucune information manquante bloquante détectée.",
                    payload: "profil = ProfilEtudiant (14) | manquantes = []",
                    code: `profil = request.user.profil_etudiant
manquantes = informations_manquantes_cv(profil)
if manquantes:
    return redirect('accounts:mon_cv')`,
                    sql: "SELECT * FROM accounts_profiletudiant WHERE utilisateur_id = 14;",
                    latency: "18 ms",
                    oralTip: "Empêche la génération de CV vides ou incomplets pouvant pénaliser l'élève."
                },
                {
                    stepNum: 3,
                    nature: "VERIFICATION",
                    natureLabel: "LECTURE ORM OPTIMISÉE",
                    natureIcon: "🗄️",
                    natureColor: "#38bdf8",
                    fromFile: "accounts/views.py",
                    toFile: "accounts/models.py",
                    currentFile: "accounts/models.py:L70",
                    layer: "Modèle ORM Django",
                    whatHappened: "Chargement en mémoire des compétences ManyToMany et formations via prefetch_related pour éviter les requêtes N+1.",
                    stateChange: "Données complètes de l'étudiant chargées en 1 seule requête SQL jointe.",
                    payload: "9 compétences, 2 formations, 1 expérience professionnelle prêtes.",
                    code: `profil = ProfilEtudiant.objects.prefetch_related(
    'competences', 'formations', 'experiences'
).get(utilisateur=request.user)`,
                    sql: "SELECT * FROM accounts_competence INNER JOIN accounts_profiletudiant_competences ...;",
                    latency: "32 ms",
                    oralTip: "prefetch_related regroupe toutes les relations ManyToMany en une seule requête optimisée."
                },
                {
                    stepNum: 4,
                    nature: "TREATMENT",
                    natureLabel: "TRAITEMENT VECTORIEL (CANVAS)",
                    natureIcon: "⚙️",
                    natureColor: "#6366f1",
                    fromFile: "accounts/views.py",
                    toFile: "accounts/cv.py",
                    currentFile: "accounts/cv.py:L40",
                    layer: "Moteur ReportLab Canvas (Python)",
                    whatHappened: "Dessin bi-colonne du PDF vectoriel sur canvas A4 en mémoire vive : bandeau latéral gauche, compétences et typographie.",
                    stateChange: "Tampon binaire BytesIO généré : 24.8 Ko de pur PDF vectoriel indexable.",
                    payload: "pagesize=A4 (595.27 x 841.89 points) | Tampon mémoire io.BytesIO",
                    code: `tampon = io.BytesIO()
canvas_cv = canvas.Canvas(tampon, pagesize=A4)
dessiner_bandeau_lateral(canvas_cv, profil)
dessiner_parcours_competences(canvas_cv, profil)
canvas_cv.save()`,
                    sql: null,
                    latency: "65 ms",
                    oralTip: "ReportLab produit du vrai texte vectoriel sélectionnable par les robots ATS des recruteurs, pas une simple image aplatie."
                },
                {
                    stepNum: 5,
                    nature: "VALUE_CHANGE",
                    natureLabel: "TÉLÉVERSEMENT & PERSISTANCE",
                    natureIcon: "💾",
                    natureColor: "#10b981",
                    fromFile: "accounts/cv.py",
                    toFile: "accounts/models.py & Supabase",
                    currentFile: "accounts/views.py:L560",
                    layer: "Supabase Storage & Base SQL",
                    whatHappened: "Upload du binaire chiffré dans le bucket Supabase et enregistrement de l'instance CVPrincipal avec horodatage.",
                    stateChange: "CVPrincipal(id=14) : fichier='14/cv_principal_20261015.pdf', date_generation=NOW()",
                    payload: "Bucket privé 'stagepilot-cv' | Rotation de l'ancienne version",
                    code: `cv.fichier.save(nom_fichier, ContentFile(tampon.getvalue()))
cv.save()`,
                    sql: "UPDATE accounts_cvprincipal SET fichier = '14/cv_principal.pdf', date_generation = NOW() WHERE profil_id = 14;",
                    latency: "115 ms",
                    oralTip: "L'ancienne version du fichier est automatiquement purgée pour respecter les quotas de stockage."
                },
                {
                    stepNum: 6,
                    nature: "RESPONSE",
                    natureLabel: "RÉPONSE & PRÉVISUALISATION",
                    natureIcon: "📦",
                    natureColor: "#0ea5e9",
                    fromFile: "accounts/views.py",
                    toFile: "templates/accounts/mon_cv.html",
                    currentFile: "templates/accounts/mon_cv.html:L120",
                    layer: "Rendu HTML & iframe PDF",
                    whatHappened: "Redirection vers l'interface 'Mon CV' avec chargement immédiat du PDF dans l'aperçu intégré.",
                    stateChange: "Iframe de visualisation rafraîchie avec le nouveau document.",
                    payload: "HTTP 302 Found ➔ GET /comptes/cv/ (200 OK)",
                    code: `messages.success(request, "Votre CV principal a été généré avec succès !")
return redirect('accounts:mon_cv')`,
                    sql: null,
                    latency: "122 ms",
                    oralTip: "L'étudiant peut directement télécharger le PDF ou le tester avec l'assistant IA Groq."
                }
            ]
        },

        "recommandations_ia": {
            id: "recommandations_ia",
            title: "4. Matching IA des offres de stage (Groq LLaMA 3.1 70B)",
            badge: "Inférence Groq",
            method: "GET",
            endpoint: "/offres/?recommandations=1",
            desc: "Comparaison sémantique par lots du profil candidat avec les offres actives, formatée en JSON sans hallucination.",
            color: "#8b5cf6",
            steps: [
                {
                    stepNum: 1,
                    nature: "CHECK",
                    natureLabel: "REQUÊTE CANDIDAT",
                    natureIcon: "🖱️",
                    natureColor: "#f59e0b",
                    fromFile: "Navigateur Client Web",
                    toFile: "templates/offers/liste_offres.html",
                    currentFile: "templates/offers/liste_offres.html:L200",
                    layer: "Client Web (HTML/JS)",
                    whatHappened: "L'étudiant clique sur 'Recommandations pour vous'. Le paramètre 'recommandations=1' est ajouté à l'URL.",
                    stateChange: "Demande de tri sémantique par IA transmise au serveur.",
                    payload: "GET /offres/?recommandations=1 HTTP/1.1",
                    code: `window.location.href = '/offres/?recommandations=1';`,
                    sql: null,
                    latency: "1 ms",
                    oralTip: "Le paramètre GET permet de partager l'URL ou d'ajouter la vue aux favoris du navigateur."
                },
                {
                    stepNum: 2,
                    nature: "TREATMENT",
                    natureLabel: "SÉRIALISATION DU CANDIDAT",
                    natureIcon: "⚙️",
                    natureColor: "#6366f1",
                    fromFile: "templates/offers/liste_offres.html",
                    toFile: "offers/recommandation.py",
                    currentFile: "offers/recommandation.py:L45",
                    layer: "Module IA (recommandation.py)",
                    whatHappened: "Extraction des compétences, expériences et du cursus 3iL de l'étudiant pour construire un profil JSON compact.",
                    stateChange: "Objet JSON candidat structuré prêt pour l'inférence.",
                    payload: "{'etudiant': 'Lina Martin', 'cursus': 'Ingénieur 4e', 'competences': ['Python', 'Django', 'Docker']}",
                    code: `profil_resume = extraire_donnees_candidat(profil)
offres_candidates = OffreStage.objects.filter(est_active=True)[:15]`,
                    sql: "SELECT * FROM offers_offrestage WHERE est_active = TRUE LIMIT 15;",
                    latency: "25 ms",
                    oralTip: "Limiter les tokens envoyés au prompt permet de réduire la latence et d'optimiser les coûts d'API."
                },
                {
                    stepNum: 3,
                    nature: "TREATMENT",
                    natureLabel: "INFÉRENCE GROQ (LLAMA 3.1 70B)",
                    natureIcon: "⚡",
                    natureColor: "#8b5cf6",
                    fromFile: "offers/recommandation.py",
                    toFile: "API Groq LPUs Cloud",
                    currentFile: "offers/recommandation.py:L88",
                    layer: "Processeurs LPUs Groq",
                    whatHappened: "Envoi du prompt au modèle LLaMA 3.1 70B via les processeurs LPUs ultra-rapides de Groq avec temperature=0.1 et format JSON strict.",
                    stateChange: "Réponse JSON reçue : identifiants d'offres sélectionnés avec scores de pertinence.",
                    payload: "Modèle: llama-3.1-70b-versatile | Response: {'recommandations': [{'id': 1, 'score': 95}, {'id': 2, 'score': 88}]}",
                    code: `reponse = client.chat.completions.create(
    model='llama-3.1-70b-versatile',
    messages=messages,
    response_format={'type': 'json_object'}
)`,
                    sql: null,
                    latency: "190 ms",
                    oralTip: "La vitesse des processeurs LPUs de Groq (plus de 300 tokens/s) permet une inférence imperceptible pour l'utilisateur."
                },
                {
                    stepNum: 4,
                    nature: "VERIFICATION",
                    natureLabel: "CONTRÔLE ANTI-HALLUCINATION",
                    natureIcon: "🛡️",
                    natureColor: "#38bdf8",
                    fromFile: "API Groq LPUs Cloud",
                    toFile: "offers/recommandation.py",
                    currentFile: "offers/recommandation.py:L115",
                    layer: "Whitelist de Sécurité (Python)",
                    whatHappened: "Vérification stricte en base SQL : chaque identifiant retourné par l'IA doit correspondre à une offre de stage existante et active.",
                    stateChange: "IDs validés : [1, 2]. Toute suggestion invalide ou fictive est rejetée.",
                    payload: "IDs reçus: [1, 2, 999] ➔ IDs certifiés en base: [1, 2]",
                    code: `ids_recommandes = [item['id'] for item in data.get('recommandations', [])]
ids_valides = set(OffreStage.objects.filter(id__in=ids_recommandes, est_active=True).values_list('id', flat=True))
offres_retenues = [o for o in offres_candidates if o.id in ids_valides]`,
                    sql: "SELECT id FROM offers_offrestage WHERE id IN (1, 2) AND est_active = TRUE;",
                    latency: "205 ms",
                    oralTip: "Le serveur n'accepte aucun texte arbitraire de l'IA, seulement des IDs validés par la base de données SQL."
                },
                {
                    stepNum: 5,
                    nature: "VALUE_CHANGE",
                    natureLabel: "ANNOTATION & TRI DU CONTEXTE",
                    natureIcon: "💾",
                    natureColor: "#10b981",
                    fromFile: "offers/recommandation.py",
                    toFile: "offers/views.py",
                    currentFile: "offers/views.py:L170",
                    layer: "Contrôleur de Vue (views.py)",
                    whatHappened: "Injection des offres recommandées en tête de catalogue et marquage avec le badge '★ Recommandé par l'IA'.",
                    stateChange: "Contexte de gabarit enrichi avec les 2 offres prioritaires annotées.",
                    payload: "context['offres_ia'] = [Offre #1 (Thales), Offre #2 (Capgemini)]",
                    code: `context['offres_recommandees'] = offres_retenues
return render(request, 'offers/liste_offres.html', context)`,
                    sql: null,
                    latency: "215 ms",
                    oralTip: "L'étudiant repère en 1 coup d'œil les stages qui valorisent le mieux son profil."
                },
                {
                    stepNum: 6,
                    nature: "RESPONSE",
                    natureLabel: "RENDU VISUEL DES CARTES",
                    natureIcon: "📦",
                    natureColor: "#0ea5e9",
                    fromFile: "offers/views.py",
                    toFile: "templates/offers/liste_offres.html",
                    currentFile: "templates/offers/liste_offres.html:L230",
                    layer: "Moteur de Gabarits Django (MVT)",
                    whatHappened: "Rendu HTML complet des cartes d'offres ordonnées avec badge de pertinence.",
                    stateChange: "Affichage des cartes enrichies avec argumentaire IA dans le navigateur.",
                    payload: "HTTP/1.1 200 OK | Content-Type: text/html",
                    code: `{% if offre in offres_recommandees %}
    <span class="badge-status-pill badge-cand-accepted">★ Recommandé par l'IA</span>
{% endif %}`,
                    sql: null,
                    latency: "220 ms",
                    oralTip: "La séparation stricte Modèle-Vue-Template permet de modifier la présentation sans toucher au moteur IA."
                }
            ]
        },

        "sync_jsearch": {
            id: "sync_jsearch",
            title: "5. Synchronisation des offres externes JSearch (API & Verrou SQL)",
            badge: "Ingestion API & Lock",
            method: "POST",
            endpoint: "/offres/sync-jsearch/",
            desc: "Collecte des annonces de stages en France, filtrage informatique et dédoublonnage avec verrou SQL exclusif non bloquant.",
            color: "#f59e0b",
            steps: [
                {
                    stepNum: 1,
                    nature: "CHECK",
                    natureLabel: "DÉCLENCHEUR TEMPOREL",
                    natureIcon: "⏱️",
                    natureColor: "#f59e0b",
                    fromFile: "Système / Cron",
                    toFile: "offers/views.py",
                    currentFile: "offers/views.py:L65",
                    layer: "Ordonnanceur ou Vue Déclencheuse",
                    whatHappened: "Contrôle de la date de dernière synchronisation. Si le dernier import date de plus de 24h, la collecte est autorisée.",
                    stateChange: "Vérification temporelle : Dernière sync > 24h. Synchronisation requise.",
                    payload: "derniere_sync: 2026-10-14 18:00:00 (Delta > 24h)",
                    code: `if sync_necessaire():
    lancer_synchronisation()`,
                    sql: "SELECT * FROM offers_etatsynchronisation LIMIT 1;",
                    latency: "5 ms",
                    oralTip: "Évite de saturer le quota mensuel de l'API externe avec des appels redondants."
                },
                {
                    stepNum: 2,
                    nature: "VERIFICATION",
                    natureLabel: "VERROU EXCLUSIF NON BLOQUANT",
                    natureIcon: "🔒",
                    natureColor: "#38bdf8",
                    fromFile: "offers/views.py",
                    toFile: "offers/jsearch.py",
                    currentFile: "offers/jsearch.py:L35",
                    layer: "ORM & Base SQL (select_for_update nowait)",
                    whatHappened: "Acquisition immédiate d'un verrou SQL exclusif 'NOWAIT'. Si un autre processus synchronise déjà, l'appel échoue immédiatement sans bloquer le serveur.",
                    stateChange: "Verrou acquis sur EtatSynchronisation [LOCKED EXCLUSIF].",
                    payload: "BEGIN TRANSACTION;\nSELECT * FROM offers_etatsynchronisation FOR UPDATE NOWAIT;",
                    code: `with transaction.atomic():
    etat = EtatSynchronisation.objects.select_for_update(nowait=True).get()`,
                    sql: "SELECT * FROM offers_etatsynchronisation FOR UPDATE NOWAIT;",
                    latency: "15 ms",
                    oralTip: "L'instruction 'NOWAIT' prévient tout freeze des threads du serveur web en cas de traitement lourd concurrent."
                },
                {
                    stepNum: 3,
                    nature: "TREATMENT",
                    natureLabel: "APPEL REST VERS RAPIDAPI",
                    natureIcon: "🌐",
                    natureColor: "#6366f1",
                    fromFile: "offers/jsearch.py",
                    toFile: "API JSearch (RapidAPI)",
                    currentFile: "offers/jsearch.py:L70",
                    layer: "Réseau HTTP Externe (Python Requests)",
                    whatHappened: "Envoi d'une requête GET sécurisée vers l'API OpenWeb Ninja avec mot-clé 'stage developpeur france' et timeout strict.",
                    stateChange: "Réponse HTTP 200 reçue : 25 annonces brutes de stage en France.",
                    payload: "GET https://jsearch.p.rapidapi.com/search?query=stage+developpeur+france | Headers: X-RapidAPI-Key",
                    code: `response = requests.get(url, headers=headers, params=params, timeout=10)
data = response.json()`,
                    sql: null,
                    latency: "350 ms",
                    oralTip: "Le paramètre timeout=10 empêche le serveur de rester bloqué indéfiniment si l'API externe subit une panne."
                },
                {
                    stepNum: 4,
                    nature: "CHECK",
                    natureLabel: "DÉDOUBLONNAGE & FILTRAGE",
                    natureIcon: "⚙️",
                    natureColor: "#f59e0b",
                    fromFile: "API JSearch",
                    toFile: "offers/jsearch.py",
                    currentFile: "offers/jsearch.py:L110",
                    layer: "Algorithme de Déduplication (Python)",
                    whatHappened: "Filtrage des annonces correspondant au cursus ingénieur et comparaison des URL d'origine avec les offres déjà stockées en base SQL.",
                    stateChange: "25 annonces brutes ➔ 7 doublons éliminés, 11 nouvelles offres qualifiées retenues.",
                    payload: "11 offres inédites avec entreprise, ville, durée et compétences détectées.",
                    code: `existantes = set(OffreStage.objects.filter(url_origine__in=urls).values_list('url_origine', flat=True))
nouvelles = [o for o in parsed if o.url_origine not in existantes]`,
                    sql: "SELECT url_origine FROM offers_offrestage WHERE url_origine IN (...);",
                    latency: "375 ms",
                    oralTip: "Les offres déjà enregistrées sont conservées intactes pour ne pas briser les candidatures étudiantes déjà liées."
                },
                {
                    stepNum: 5,
                    nature: "VALUE_CHANGE",
                    natureLabel: "INGESTION SQL EN MASSE",
                    natureIcon: "💾",
                    natureColor: "#10b981",
                    fromFile: "offers/jsearch.py",
                    toFile: "offers/models.py & PostgreSQL",
                    currentFile: "offers/jsearch.py:L140",
                    layer: "Base de Données SQL (bulk_create)",
                    whatHappened: "Insertion de toutes les nouvelles offres en 1 seule instruction SQL multi-lignes et mise à jour de la date de dernière synchronisation.",
                    stateChange: "+11 nouvelles offres créées en base SQL en 1 seule requête | Lock transactionnel libéré.",
                    payload: "INSERT INTO offers_offrestage VALUES (11 records)",
                    code: `OffreStage.objects.bulk_create(nouvelles, ignore_conflicts=True)
etat.date_derniere_sync = timezone.now()
etat.save()`,
                    sql: "INSERT INTO offers_offrestage (titre, entreprise, localisation, duree, date_creation) VALUES (...), (...); COMMIT;",
                    latency: "410 ms",
                    oralTip: "'bulk_create' exécute un seul INSERT SQL massif au lieu de 11 requêtes individuelles, divisant le temps d'écriture par 10."
                },
                {
                    stepNum: 6,
                    nature: "RESPONSE",
                    natureLabel: "FIN & ACTUALISATION DU CATALOGUE",
                    natureIcon: "📦",
                    natureColor: "#0ea5e9",
                    fromFile: "offers/models.py",
                    toFile: "Navigateur Client Web",
                    currentFile: "offers/views.py:L90",
                    layer: "Réponse JSON & Catalogue Enrichi",
                    whatHappened: "Fin du processus, libération du verrou et mise à disposition immédiate des nouvelles offres pour les étudiants.",
                    stateChange: "Catalogue StagePilot enrichi de 11 offres fraîches.",
                    payload: "{'status': 'ok', 'nouvelles_offres': 11}",
                    code: `return JsonResponse({'status': 'ok', 'creees': 11})`,
                    sql: null,
                    latency: "415 ms",
                    oralTip: "La mise à jour est complètement transparente pour les utilisateurs qui bénéficient d'un catalogue continuellement actualisé."
                }
            ]
        },

        "marquer_tout_lu": {
            id: "marquer_tout_lu",
            title: "6. Traitement par lot école (Bulk Update SQL sans boucle N+1)",
            badge: "Optimisation BDD École",
            method: "POST",
            endpoint: "/ecole/notifications/marquer-tout-lu/",
            desc: "Le responsable des stages 3iL acquitte toutes ses alertes. Exécution d'un UPDATE SQL ensembliste direct sans aucune boucle Python.",
            color: "#059669",
            steps: [
                {
                    stepNum: 1,
                    nature: "CHECK",
                    natureLabel: "CLIC ACTION RESPONSABLE",
                    natureIcon: "🖱️",
                    natureColor: "#f59e0b",
                    fromFile: "Navigateur Client Web",
                    toFile: "templates/schools/notifications.html",
                    currentFile: "templates/schools/notifications.html:L45",
                    layer: "Client Web (HTML/JS)",
                    whatHappened: "Le responsable des stages clique sur '✓ Tout marquer comme lu (3)'.",
                    stateChange: "Émission de la requête POST d'acquittement groupé avec jeton CSRF.",
                    payload: "POST /ecole/notifications/marquer-tout-lu/ HTTP/1.1",
                    code: `<form method="post" action="{% url 'schools:marquer_tout_lu' %}">
    {% csrf_token %}
    <button type="submit" class="btn-mark-all">✓ Tout marquer comme lu ({{ nb_non_lues }})</button>
</form>`,
                    sql: null,
                    latency: "1 ms",
                    oralTip: "Un bouton d'action en masse évite à l'administration d'ouvrir chaque alerte une à une."
                },
                {
                    stepNum: 2,
                    nature: "VERIFICATION",
                    natureLabel: "VÉRIFICATION DROITS ÉCOLE",
                    natureIcon: "🛡️",
                    natureColor: "#38bdf8",
                    fromFile: "templates/schools/notifications.html",
                    toFile: "stagepilot/access.py",
                    currentFile: "accounts/access.py:L30",
                    layer: "Contrôle d'Accès RBAC",
                    whatHappened: "Vérification stricte que l'utilisateur possède le rôle ÉCOLE et que son établissement 3iL est validé par l'administrateur.",
                    stateChange: "Droit d'administration école certifié pour 3iL Ingénieurs (Limoges).",
                    payload: "user.role == 'ECOLE' | compte_ecole.est_valide == True",
                    code: `@login_required
@require_POST
def marquer_tout_lu(request):
    if not etablissement_autorise(request.user):
        raise PermissionDenied("Accès réservé aux établissements partenaires.")`,
                    sql: "SELECT * FROM schools_etablissement WHERE utilisateur_id = 4 AND est_valide = TRUE;",
                    latency: "15 ms",
                    oralTip: "Lève une exception PermissionDenied (HTTP 403) si un élève essaie d'appeler ce endpoint d'administration."
                },
                {
                    stepNum: 3,
                    nature: "VERIFICATION",
                    natureLabel: "AIGUILLAGE D'URL",
                    natureIcon: "🔀",
                    natureColor: "#818cf8",
                    fromFile: "accounts/access.py",
                    toFile: "schools/urls.py",
                    currentFile: "schools/urls.py:L22",
                    layer: "Aiguilleur d'URL (urls.py)",
                    whatHappened: "Résolution de la route interne du module école.",
                    stateChange: "Dispatch vers : schools.views.marquer_tout_lu",
                    payload: "path('notifications/marquer-tout-lu/', views.marquer_tout_lu, name='marquer_tout_lu')",
                    code: `path('notifications/marquer-tout-lu/', views.marquer_tout_lu, name='marquer_tout_lu')`,
                    sql: null,
                    latency: "18 ms",
                    oralTip: "Les routes d'administration école sont isolées sous le préfixe d'espace de noms 'schools:'."
                },
                {
                    stepNum: 4,
                    nature: "VALUE_CHANGE",
                    natureLabel: "CHANGEMENT DE VALEUR SQL (BULK)",
                    natureIcon: "💾",
                    natureColor: "#10b981",
                    fromFile: "schools/urls.py",
                    toFile: "schools/models.py & PostgreSQL",
                    currentFile: "schools/views.py:L258",
                    layer: "ORM Django & Base SQL",
                    whatHappened: "Exécution directe d'un UPDATE SQL ensembliste sur toutes les notifications non lues de l'établissement sans boucle Python.",
                    stateChange: "Mutation BDD : 3 notifications passent de est_lue=False à est_lue=True en 1 commande SQL.",
                    payload: "UPDATE schools_notificationecole SET est_lue = true WHERE etablissement_id = 1 AND est_lue = false;",
                    code: `NotificationEcole.objects.filter(
    etablissement=ecole, 
    est_lue=False
).update(est_lue=True)`,
                    sql: "UPDATE schools_notificationecole SET est_lue = true WHERE etablissement_id = 1 AND est_lue = false;",
                    latency: "35 ms",
                    oralTip: "Utiliser .update(est_lue=True) évite le problème 'N+1 queries'. Une boucle for n in notifs: n.save() aurait exécuté 50 requêtes SQL individuelles."
                },
                {
                    stepNum: 5,
                    nature: "RESPONSE",
                    natureLabel: "RÉPONSE & MISE À JOUR BADGE",
                    natureIcon: "📦",
                    natureColor: "#0ea5e9",
                    fromFile: "schools/views.py",
                    toFile: "templates/schools/notifications.html",
                    currentFile: "schools/views.py:L268",
                    layer: "Réponse HTTP & Cloche de Notif",
                    whatHappened: "Redirection vers le centre de notifications. Le compteur de la cloche passe instantanément de 3 à 0.",
                    stateChange: "Cloche de notification : 3 ➔ 0. Badge 'Non lue' converti en 'Lue'.",
                    payload: "HTTP 302 Found ➔ GET /ecole/notifications/ (200 OK)",
                    code: `messages.success(request, "Toutes les alertes ont été marquées comme lues.")
return redirect("schools:notifications")`,
                    sql: null,
                    latency: "42 ms",
                    oralTip: "L'interface reste parfaitement réactive pour les équipes administratives."
                }
            ]
        }
    }
};

