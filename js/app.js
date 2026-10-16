/**
 * StagePilot - Interactive Defense Guide & Maquette Controller
 * Ensures 100% visual fidelity to the original StagePilot Django templates in Light Theme.
 */

class StagePilotApp {
    constructor() {
        this.currentScreen = "tableau_de_bord_etudiant";
        this.currentPersona = "etudiant"; // etudiant, ecole, visiteur
        this.inspectorEnabled = true;
        this.selectedElement = null;
        this.guideOpen = false;

        // Live Request Journey Simulator State
        this.journeyOpen = false;
        this.currentJourneyScenario = "confirmer_stage";
        this.journeyCurrentStep = 0;
        this.journeyPlaying = false;
        this.journeyTimer = null;
        this.journeySpeed = 1;
        this.journey3D = false;
        this.simulationViewMode = "tree"; // "tree" or "pipeline"
        this.simulationScreenMode = "catalog"; // "catalog" or "simulation"
        this.activeModalNodeId = null;

        // StarUML CAD Zoom & Pan Engine State
        this.treeZoomLevel = 1.0;
        this.treeCanvasInteractionsInitialized = false;

        // Treatments Tab Interactive State
        this.activeTreatmentIdx = 0;
        this.treatmentViewMode = "single"; // "single" or "all"

        // Authentification Space Selection State
        this.selectedAuthSpace = "etudiant"; // "etudiant" or "ecole"

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderNavbar();
        this.renderScreen();
        this.renderGuideContents();
        this.renderSimulationCatalog();
    }

    setupEventListeners() {
        // Theme toggle button in genuine StagePilot navbar
        const themeBtn = document.getElementById("themeToggleBtn");
        if (themeBtn) {
            themeBtn.addEventListener("click", () => {
                const current = document.documentElement.getAttribute("data-theme") || "light";
                const next = current === "dark" ? "light" : "dark";
                document.documentElement.setAttribute("data-theme", next);
            });
        }

        // Inspector Mode / Normal Navigation Mode Toggle
        const toggleBtn = document.getElementById("dockInspectorToggle");
        if (toggleBtn) {
            toggleBtn.addEventListener("click", () => {
                this.setInspectorMode(!this.inspectorEnabled);
            });
            this.setInspectorMode(this.inspectorEnabled);
        }

        // Persona select in Dock
        const personaSelect = document.getElementById("dockPersonaSelect");
        if (personaSelect) {
            personaSelect.addEventListener("change", (e) => {
                this.setPersona(e.target.value);
            });
        }

        // Direct Screen select in Dock
        const screenSelect = document.getElementById("dockScreenSelect");
        if (screenSelect) {
            screenSelect.addEventListener("change", (e) => {
                this.navigate(e.target.value);
            });
        }

        // Guide Overlay Toggle
        const openGuideBtn = document.getElementById("dockOpenGuide");
        const closeGuideBtn = document.getElementById("guideCloseBtn");
        if (openGuideBtn) openGuideBtn.addEventListener("click", () => this.openGuide());
        if (closeGuideBtn) closeGuideBtn.addEventListener("click", () => this.closeGuide());

        // Live Request Journey Simulator Toggle & Controls
        const dockJourneyBtn = document.getElementById("dockOpenJourney");
        const journeyCloseBtn = document.getElementById("journeyCloseBtn");
        const journeyPlayBtn = document.getElementById("journeyPlayBtn");
        const journeyPrevBtn = document.getElementById("journeyPrevBtn");
        const journeyNextBtn = document.getElementById("journeyNextBtn");
        const journeyResetBtn = document.getElementById("journeyResetBtn");

        if (dockJourneyBtn) dockJourneyBtn.addEventListener("click", () => this.openJourney());
        if (journeyCloseBtn) journeyCloseBtn.addEventListener("click", () => this.closeJourney());
        if (journeyPlayBtn) journeyPlayBtn.addEventListener("click", () => this.toggleJourneyPlay());
        if (journeyPrevBtn) journeyPrevBtn.addEventListener("click", () => this.prevJourneyStep());
        if (journeyNextBtn) journeyNextBtn.addEventListener("click", () => this.nextJourneyStep());
        if (journeyResetBtn) journeyResetBtn.addEventListener("click", () => this.resetJourney());

        // Simulation Navigation & Mode Listeners
        const btnShowCatalog = document.getElementById("btnShowCatalog");
        if (btnShowCatalog) btnShowCatalog.addEventListener("click", () => this.showSimulationCatalog());

        const btnBackToCatalog = document.getElementById("btnBackToCatalog");
        if (btnBackToCatalog) btnBackToCatalog.addEventListener("click", () => this.showSimulationCatalog());

        const btnViewTreeMode = document.getElementById("btnViewTreeMode");
        if (btnViewTreeMode) btnViewTreeMode.addEventListener("click", () => this.setSimulationViewMode("tree"));

        const btnViewPipelineMode = document.getElementById("btnViewPipelineMode");
        if (btnViewPipelineMode) btnViewPipelineMode.addEventListener("click", () => this.setSimulationViewMode("pipeline"));

        // StarUML CAD Zoom & View Controls
        const tctZoomInBtn = document.getElementById("tctZoomInBtn");
        const tctZoomOutBtn = document.getElementById("tctZoomOutBtn");
        const tctFitViewBtn = document.getElementById("tctFitViewBtn");
        const tctResetZoomBtn = document.getElementById("tctResetZoomBtn");
        const tctZoomLevelBtn = document.getElementById("tctZoomLevelBtn");

        if (tctZoomInBtn) tctZoomInBtn.addEventListener("click", () => this.zoomInTree());
        if (tctZoomOutBtn) tctZoomOutBtn.addEventListener("click", () => this.zoomOutTree());
        if (tctFitViewBtn) tctFitViewBtn.addEventListener("click", () => this.fitTreeToView());
        if (tctResetZoomBtn) tctResetZoomBtn.addEventListener("click", () => this.resetTreeZoom());
        if (tctZoomLevelBtn) tctZoomLevelBtn.addEventListener("click", () => this.resetTreeZoom());

        this.initTreeCanvasInteractions();

        // Step Detail Modal Listeners
        const gsmCloseBtn = document.getElementById("gsmCloseBtn");
        const gsmCloseFooterBtn = document.getElementById("gsmCloseFooterBtn");
        const simStepModalBackdrop = document.getElementById("simStepModalBackdrop");
        if (gsmCloseBtn) gsmCloseBtn.addEventListener("click", () => this.closeStepModal());
        if (gsmCloseFooterBtn) gsmCloseFooterBtn.addEventListener("click", () => this.closeStepModal());
        if (simStepModalBackdrop) simStepModalBackdrop.addEventListener("click", () => this.closeStepModal());

        const gsmPrevBtn = document.getElementById("gsmPrevBtn");
        const gsmNextBtn = document.getElementById("gsmNextBtn");
        if (gsmPrevBtn) gsmPrevBtn.addEventListener("click", () => this.prevModalStep());
        if (gsmNextBtn) gsmNextBtn.addEventListener("click", () => this.nextModalStep());

        // Keyboard navigation for step modal
        window.addEventListener("keydown", (e) => {
            const modal = document.getElementById("simStepModal");
            if (!modal || modal.style.display === "none") return;
            if (e.key === "Escape") {
                this.closeStepModal();
            } else if (e.key === "ArrowLeft") {
                this.prevModalStep();
            } else if (e.key === "ArrowRight") {
                this.nextModalStep();
            }
        });

        document.querySelectorAll("[data-speed]").forEach(btn => {
            btn.addEventListener("click", () => {
                const spd = parseFloat(btn.getAttribute("data-speed"));
                this.setJourneySpeed(spd);
            });
        });

        // Guide Tabs
        document.querySelectorAll("[data-guide-tab]").forEach(tabBtn => {
            tabBtn.addEventListener("click", () => {
                const target = tabBtn.getAttribute("data-guide-tab");
                this.switchGuideTab(target);
            });
        });

        // Dock Minimize Toggle & Restore Trigger
        const dockMinBtn = document.getElementById("dockMinimizeBtn");
        const dock = document.getElementById("defenseDock");
        const dockFloatingTrigger = document.getElementById("dockFloatingTrigger");
        if (dockMinBtn && dock) {
            dockMinBtn.addEventListener("click", () => {
                dock.classList.add("minimized");
                if (dockFloatingTrigger) dockFloatingTrigger.style.display = "inline-flex";
            });
        }
        if (dockFloatingTrigger && dock) {
            dockFloatingTrigger.addEventListener("click", () => {
                dock.classList.remove("minimized");
                dockFloatingTrigger.style.display = "none";
            });
        }

        // Drawer Close
        const drawerClose = document.getElementById("drawerClose");
        const drawerBackdrop = document.getElementById("drawerBackdrop");
        if (drawerClose) drawerClose.addEventListener("click", () => this.closeDrawer());
        if (drawerBackdrop) drawerBackdrop.addEventListener("click", () => this.closeDrawer());

        // Global Search (Ctrl + K) & Escape Handler
        window.addEventListener("keydown", (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();
                this.openSearch();
            }
            if (e.key === "Escape") {
                this.closeDrawer();
                this.closeSearch();
                this.closeGuide();
                this.closeJourney();
            }
        });

        const dockSearchBtn = document.getElementById("dockSearchBtn");
        if (dockSearchBtn) dockSearchBtn.addEventListener("click", () => this.openSearch());

        const searchModal = document.getElementById("searchModalOverlay");
        if (searchModal) {
            searchModal.addEventListener("click", (e) => {
                if (e.target === searchModal) this.closeSearch();
            });
        }

        const searchInput = document.getElementById("globalSearchInput");
        if (searchInput) {
            searchInput.addEventListener("input", (e) => this.performSearch(e.target.value));
        }

        // Tree Search & Expand/Collapse Controls
        const treeSearch = document.getElementById("treeSearchInput");
        if (treeSearch) {
            treeSearch.addEventListener("input", (e) => this.filterTree(e.target.value));
        }
        const treeExpandAllBtn = document.getElementById("treeExpandAllBtn");
        if (treeExpandAllBtn) {
            treeExpandAllBtn.addEventListener("click", () => this.expandAllTreeFolders());
        }
        const treeCollapseAllBtn = document.getElementById("treeCollapseAllBtn");
        if (treeCollapseAllBtn) {
            treeCollapseAllBtn.addEventListener("click", () => this.collapseAllTreeFolders());
        }

        // Mouse Tracker for Inspector Tooltip
        window.addEventListener("mousemove", (e) => {
            if (!this.inspectorEnabled || this.guideOpen) return;
            const target = e.target.closest("[data-inspect]");
            if (target) {
                const elId = target.getAttribute("data-inspect");
                this.showTooltip(e, elId);
            } else {
                this.hideTooltip();
            }
        });

        // Click on Inspected Element
        document.addEventListener("click", (e) => {
            if (this.guideOpen || this.journeyOpen) return;

            const target = e.target.closest("[data-inspect]");
            if (target) {
                const elId = target.getAttribute("data-inspect");
                
                // If it's the space selection tile on connexion screen, also toggle the space!
                if (elId === "auth_space_tile") {
                    const isEcole = e.target.closest("#option_espace_ecole") || target.id === "option_espace_ecole" || target.innerText.includes("Établissement") || (e.target.id && e.target.id.includes("espace_1"));
                    this.selectAuthSpace(isEcole ? "ecole" : "etudiant");
                }

                // If inspector mode is OFF, allow default navigation/action
                if (!this.inspectorEnabled) return;

                e.preventDefault();
                e.stopPropagation();
                this.inspectElement(elId);
            }
        });
    }

    setInspectorMode(enabled) {
        this.inspectorEnabled = enabled;
        const toggleBtn = document.getElementById("dockInspectorToggle");
        if (toggleBtn) {
            toggleBtn.classList.toggle("is-active", enabled);
            toggleBtn.classList.toggle("is-nav-mode", !enabled);
            toggleBtn.innerHTML = enabled 
                ? "<span>🔍</span> Mode Soutenance (Inspecteur ACTIF)" 
                : "<span>🚀</span> Mode Normal (Navigation Démo)";
            toggleBtn.title = enabled
                ? "Mode soutenance actif : survolez et cliquez sur les boutons pour inspecter leur code source"
                : "Mode normal actif : cliquez sur les boutons pour naviguer normalement sans pop-up de code";
        }
        document.body.classList.toggle("inspector-active", enabled);
        if (!enabled) {
            this.hideTooltip();
            this.closeDrawer();
        }
    }

    selectAuthSpace(space) {
        this.selectedAuthSpace = space;
        const radio0 = document.getElementById("id_espace_0");
        const radio1 = document.getElementById("id_espace_1");
        const opt0 = document.getElementById("option_espace_etudiant");
        const opt1 = document.getElementById("option_espace_ecole");
        const emailInput = document.getElementById("id_email");
        const emailLabel = document.getElementById("lblAuthEmail");
        const submitBtn = document.getElementById("btnAuthSubmit");

        const isEcole = (space === "ecole");

        if (radio0) radio0.checked = !isEcole;
        if (radio1) radio1.checked = isEcole;

        if (opt0) opt0.classList.toggle("is-selected", !isEcole);
        if (opt1) opt1.classList.toggle("is-selected", isEcole);

        if (emailInput) {
            emailInput.value = isEcole 
                ? "direction.stages@3il-ingenieurs.fr" 
                : "demo_etudiante_complete@example.com";
        }

        if (emailLabel) {
            emailLabel.innerText = isEcole ? "Adresse e-mail établissement (3iL)" : "Adresse e-mail";
        }

        if (submitBtn) {
            submitBtn.innerText = isEcole 
                ? "Se connecter à mon espace Établissement (3iL)" 
                : "Se connecter à mon espace";
        }
    }

    submitLogin() {
        const space = this.selectedAuthSpace === "ecole" ? "ecole" : "etudiant";
        this.setPersona(space);
        if (space === "ecole") {
            this.navigate("tableau_de_bord_ecole");
        } else {
            this.navigate("tableau_de_bord_etudiant");
        }
    }

    setPersona(persona) {
        this.currentPersona = persona;
        const pSelect = document.getElementById("dockPersonaSelect");
        if (pSelect) pSelect.value = persona;

        if (persona === "etudiant") {
            if (this.currentScreen.includes("ecole") || this.currentScreen === "connexion") {
                this.currentScreen = "tableau_de_bord_etudiant";
            }
        } else if (persona === "ecole") {
            if (this.currentScreen.includes("etudiant") || this.currentScreen === "mon_cv" || this.currentScreen === "mes_candidatures" || this.currentScreen === "connexion") {
                this.currentScreen = "tableau_de_bord_ecole";
            }
        } else if (persona === "visiteur") {
            this.currentScreen = "connexion";
        }

        const screenSelect = document.getElementById("dockScreenSelect");
        if (screenSelect) screenSelect.value = this.currentScreen;

        this.renderNavbar();
        this.renderScreen();
    }

    navigate(screenName) {
        this.currentScreen = screenName;
        const screenSelect = document.getElementById("dockScreenSelect");
        if (screenSelect) screenSelect.value = screenName;
        this.renderNavbar();
        this.renderScreen();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    renderNavbar() {
        const tabsContainer = document.getElementById("mainNavbarTabs");
        const actionsContainer = document.getElementById("mainNavbarActions");
        if (!tabsContainer || !actionsContainer) return;

        let tabsHtml = "";
        let actionsHtml = "";

        if (this.currentPersona === "etudiant") {
            tabsHtml = `
                <li class="nav-item">
                    <a class="nav-link ${this.currentScreen === 'tableau_de_bord_etudiant' ? 'active' : ''}" href="javascript:void(0)" onclick="window.app.navigate('tableau_de_bord_etudiant')" data-inspect="nav_tab_dashboard">Tableau de bord</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link ${this.currentScreen === 'liste_offres' ? 'active' : ''}" href="javascript:void(0)" onclick="window.app.navigate('liste_offres')" data-inspect="nav_tab_offers">Offres</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link ${this.currentScreen === 'mes_candidatures' ? 'active' : ''}" href="javascript:void(0)" onclick="window.app.navigate('mes_candidatures')" data-inspect="nav_tab_applications">Mes candidatures</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link ${this.currentScreen === 'mon_profil' ? 'active' : ''}" href="javascript:void(0)" onclick="window.app.navigate('mon_profil')" data-inspect="nav_tab_profile">Profil</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link ${this.currentScreen === 'mon_cv' ? 'active' : ''}" href="javascript:void(0)" onclick="window.app.navigate('mon_cv')" data-inspect="nav_tab_cv">Mon CV</a>
                </li>
            `;

            actionsHtml = `
                <button type="button" class="btn-theme-toggle" id="themeToggleBtn" title="Basculer entre le mode clair et le mode sombre" aria-label="Thème" data-inspect="nav_theme_toggle">
                    <span class="theme-icon theme-icon-sun"></span>
                    <span class="theme-icon theme-icon-moon"></span>
                </button>
                <a class="btn btn-outline-auth" href="javascript:void(0)" onclick="window.app.setPersona('visiteur')" data-inspect="nav_btn_logout">
                    Déconnexion
                </a>
            `;
        } else if (this.currentPersona === "ecole") {
            tabsHtml = `
                <li class="nav-item">
                    <a class="nav-link ${this.currentScreen === 'tableau_de_bord_ecole' ? 'active' : ''}" href="javascript:void(0)" onclick="window.app.navigate('tableau_de_bord_ecole')" data-inspect="nav_tab_dashboard">Tableau de bord</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link ${this.currentScreen === 'liste_etudiants' ? 'active' : ''}" href="javascript:void(0)" onclick="window.app.navigate('liste_etudiants')" data-inspect="school_btn_liste_etudiants">Étudiants</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link nav-link-notif ${this.currentScreen === 'notifications_ecole' ? 'active' : ''}" href="javascript:void(0)" onclick="window.app.navigate('notifications_ecole')" data-inspect="nav_notif_bell">
                        Notifications
                        <span class="tab-badge-notif">3</span>
                    </a>
                </li>
            `;

            actionsHtml = `
                <div class="dropdown notif-bell-dropdown" data-inspect="nav_notif_bell">
                    <button type="button" class="btn-notif-bell" onclick="window.app.navigate('notifications_ecole')" title="Notifications des stages">
                        <svg class="notif-bell-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                        </svg>
                        <span class="notif-badge-count">3</span>
                    </button>
                </div>

                <button type="button" class="btn-theme-toggle" id="themeToggleBtn" title="Basculer entre le mode clair et le mode sombre" aria-label="Thème" data-inspect="nav_theme_toggle">
                    <span class="theme-icon theme-icon-sun"></span>
                    <span class="theme-icon theme-icon-moon"></span>
                </button>
                <a class="btn btn-outline-auth" href="javascript:void(0)" onclick="window.app.setPersona('visiteur')" data-inspect="nav_btn_logout">
                    Déconnexion
                </a>
            `;
        } else {
            tabsHtml = `
                <li class="nav-item">
                    <a class="nav-link ${this.currentScreen === 'connexion' ? 'active' : ''}" href="javascript:void(0)" onclick="window.app.navigate('connexion')" data-inspect="auth_btn_submit">Connexion</a>
                </li>
            `;

            actionsHtml = `
                <button type="button" class="btn-theme-toggle" id="themeToggleBtn" title="Basculer entre le mode clair et le mode sombre" aria-label="Thème" data-inspect="nav_theme_toggle">
                    <span class="theme-icon theme-icon-sun"></span>
                    <span class="theme-icon theme-icon-moon"></span>
                </button>
                <a class="btn btn-nav-action" href="javascript:void(0)" onclick="window.app.navigate('inscription_choix')" data-inspect="auth_link_register">
                    Créer un compte
                </a>
            `;
        }

        tabsContainer.innerHTML = tabsHtml;
        actionsContainer.innerHTML = actionsHtml;

        // Re-attach theme button
        const themeBtn = document.getElementById("themeToggleBtn");
        if (themeBtn) {
            themeBtn.addEventListener("click", () => {
                const current = document.documentElement.getAttribute("data-theme") || "light";
                const next = current === "dark" ? "light" : "dark";
                document.documentElement.setAttribute("data-theme", next);
            });
        }
    }

    renderScreen() {
        const container = document.getElementById("stagepilotMain");
        if (!container) return;

        switch (this.currentScreen) {
            case "tableau_de_bord_etudiant":
                container.innerHTML = this.htmlStudentDashboard();
                break;
            case "liste_offres":
                container.innerHTML = this.htmlOffersList();
                break;
            case "detail_offre":
                container.innerHTML = this.htmlOfferDetail();
                break;
            case "mes_candidatures":
                container.innerHTML = this.htmlApplications();
                break;
            case "mon_cv":
                container.innerHTML = this.htmlCv();
                break;
            case "mon_profil":
                container.innerHTML = this.htmlProfile();
                break;
            case "connexion":
                container.innerHTML = this.htmlLogin();
                break;
            case "inscription_choix":
                container.innerHTML = this.htmlRegisterChoice();
                break;
            case "inscription_ecole":
                container.innerHTML = this.htmlSchoolRegister();
                break;
            case "tableau_de_bord_ecole":
                container.innerHTML = this.htmlSchoolDashboard();
                break;
            case "liste_etudiants":
                container.innerHTML = this.htmlSchoolStudents();
                break;
            case "notifications_ecole":
                container.innerHTML = this.htmlSchoolNotifications();
                break;
            default:
                container.innerHTML = `<div class="p-4">Chargement...</div>`;
        }
    }

    // =========================================================================
    // 100% FAITHFUL HTML TEMPLATES (Identical classes from StagePilot CSS)
    // =========================================================================

    htmlStudentDashboard() {
        return `
            <div class="dashboard">
                <header class="dashboard-header">
                    <p class="etiquette" data-inspect="dash_header_title">TABLEAU DE BORD</p>
                    <h1 data-inspect="dash_header_title">Mon tableau de bord</h1>
                    <p class="dashboard-subtitle">Vue d’ensemble de vos candidatures, suivi des réponses et démarches récentes.</p>
                </header>

                <!-- Grille de 4 indicateurs clés (KPIs) -->
                <div class="dashboard-stats-grid">
                    <section class="glass-card stat-card stat-card-total" data-inspect="dash_kpi_total">
                        <div class="stat-card-header">
                            <span class="stat-badge stat-badge-total">Total</span>
                            <span class="stat-icon" aria-hidden="true">📋</span>
                        </div>
                        <h2 id="total-title">Candidatures confirmées</h2>
                        <p class="dashboard-number">10</p>
                        <p class="stat-note">Candidatures suivies sur StagePilot</p>
                    </section>

                    <section class="glass-card stat-card stat-card-accepted" data-inspect="dash_kpi_accepted">
                        <div class="stat-card-header">
                            <span class="stat-badge stat-badge-accepted">Acceptées</span>
                            <span class="stat-icon" aria-hidden="true">✓</span>
                        </div>
                        <h3>Candidatures acceptées</h3>
                        <p class="dashboard-number number-accepted">3</p>
                        <p class="stat-note"><strong>30.0 %</strong> de vos candidatures</p>
                    </section>

                    <section class="glass-card stat-card stat-card-pending" data-inspect="dash_kpi_pending">
                        <div class="stat-card-header">
                            <span class="stat-badge stat-badge-pending">En attente</span>
                            <span class="stat-icon" aria-hidden="true">⏳</span>
                        </div>
                        <h3>En attente de réponse</h3>
                        <p class="dashboard-number number-pending">5</p>
                        <p class="stat-note"><strong>50.0 %</strong> sans retour pour le moment</p>
                    </section>

                    <section class="glass-card stat-card stat-card-refused" data-inspect="dash_kpi_refused">
                        <div class="stat-card-header">
                            <span class="stat-badge stat-badge-refused">Refusées</span>
                            <span class="stat-icon" aria-hidden="true">✕</span>
                        </div>
                        <h3>Candidatures refusées</h3>
                        <p class="dashboard-number number-refused">2</p>
                        <p class="stat-note"><strong>20.0 %</strong> de vos envois</p>
                    </section>
                </div>

                <!-- Section graphiques et raccourcis -->
                <div class="dashboard-grid">
                    <section class="glass-card" data-inspect="dash_donut_chart">
                        <div class="section-card-header">
                            <h2>Réponses à mes candidatures</h2>
                            <span class="badge-stat-taux">50.0% de taux de réponse</span>
                        </div>

                        <div class="dashboard-chart">
                            <div class="dashboard-donut" aria-hidden="true">
                                <svg viewBox="0 0 120 120" focusable="false">
                                    <circle class="donut-second" cx="60" cy="60" r="48"></circle>
                                    <circle class="donut-first" cx="60" cy="60" r="48" pathLength="100" stroke-dasharray="60 100" transform="rotate(-90 60 60)"></circle>
                                </svg>
                                <div class="donut-center"><strong>60.0 %</strong><span>acceptées</span></div>
                            </div>
                            <ul class="dashboard-legend">
                                <li><span class="legend-dot legend-first" aria-hidden="true"></span><span>Acceptées <strong>3 · 60.0 %</strong></span></li>
                                <li><span class="legend-dot legend-second" aria-hidden="true"></span><span>Refusées <strong>2 · 40.0 %</strong></span></li>
                            </ul>
                        </div>

                        <div class="dashboard-responses-footer">
                            <p class="dashboard-note">Pourcentages calculés sur les candidatures ayant reçu une réponse.</p>
                            <p class="dashboard-note">Sans réponse : 5</p>
                        </div>
                    </section>

                    <div class="dashboard-actions">
                        <section class="glass-card">
                            <h2>Mon CV</h2>
                            <p>Consultez et générez votre CV à partir de votre profil.</p>
                            <a class="dashboard-button" href="javascript:void(0)" onclick="window.app.navigate('mon_cv')" data-inspect="dash_card_cv_btn">Accéder à mon CV</a>
                        </section>
                        <section class="glass-card">
                            <h2>Mon profil</h2>
                            <p>Retrouvez vos informations et votre parcours.</p>
                            <a class="dashboard-button" href="javascript:void(0)" onclick="window.app.navigate('mon_profil')" data-inspect="dash_card_profile_btn">Voir mon profil</a>
                        </section>
                    </div>
                </div>

                <!-- Section Dernières candidatures postulées -->
                <section class="glass-card dashboard-latest-section">
                    <div class="dashboard-section-header">
                        <div>
                            <h2>Dernières candidatures postulées</h2>
                            <p class="dashboard-section-sub">Consultez l’historique et l’avancement de vos démarches récentes.</p>
                        </div>
                        <a class="dashboard-view-all" href="javascript:void(0)" onclick="window.app.navigate('mes_candidatures')" data-inspect="dash_link_view_all_apps">Gérer toutes mes candidatures (10) →</a>
                    </div>

                    <div class="dashboard-candidatures-list">
                        <article class="dashboard-candidature-item">
                            <div class="candidature-item-info">
                                <span class="candidature-entreprise">Thales Limoges</span>
                                <h3 class="candidature-titre">
                                    <a href="javascript:void(0)" onclick="window.app.navigate('detail_offre')" data-inspect="dash_cand_btn_thales">Stage Développeur Full-Stack Python & Django</a>
                                </h3>
                                <div class="candidature-item-meta">
                                    <span>Postulé le 12/10/2026 à 14:30</span>
                                    <span>· CV : CV adapté</span>
                                </div>
                            </div>
                            <div class="candidature-item-aside">
                                <span class="badge-cand-statut badge-cand-accepted">Acceptée</span>
                                <a class="bouton bouton-sm" href="javascript:void(0)" onclick="window.app.navigate('detail_offre')" data-inspect="dash_cand_btn_thales">Voir l’offre</a>
                            </div>
                        </article>

                        <article class="dashboard-candidature-item">
                            <div class="candidature-item-info">
                                <span class="candidature-entreprise">Capgemini Bordeaux</span>
                                <h3 class="candidature-titre">
                                    <a href="javascript:void(0)" onclick="window.app.navigate('detail_offre')" data-inspect="dash_cand_btn_capgemini">Ingénieur DevOps & Cloud Azure</a>
                                </h3>
                                <div class="candidature-item-meta">
                                    <span>Postulé le 09/10/2026 à 10:15</span>
                                    <span>· CV : CV principal</span>
                                </div>
                            </div>
                            <div class="candidature-item-aside">
                                <span class="badge-cand-statut badge-cand-pending">En attente</span>
                                <a class="bouton bouton-sm" href="javascript:void(0)" onclick="window.app.navigate('detail_offre')" data-inspect="dash_cand_btn_capgemini">Voir l’offre</a>
                            </div>
                        </article>
                    </div>
                </section>
            </div>
        `;
    }

    htmlOffersList() {
        return `
            <div class="page-offres">
                <div class="conteneur">
                    <header class="entete">
                        <p class="etiquette">OFFRES DE STAGE</p>
                        <h1>Trouvez le stage qui vous correspond</h1>
                        <p>Recherchez une offre par métier, entreprise, localisation ou compétence.</p>
                    </header>

                    <form class="filtres">
                        <div class="grille-filtres">
                            <div class="champ">
                                <label for="recherche" data-inspect="offers_input_search">Recherche</label>
                                <input type="text" id="recherche" name="recherche" value="Python" placeholder="Exemple : Python, cloud, OVH..." data-inspect="offers_input_search">
                            </div>

                            <div class="champ">
                                <label for="localisation" data-inspect="offers_select_localisation">Localisation</label>
                                <select id="localisation" name="localisation" data-inspect="offers_select_localisation">
                                    <option value="">Toutes les localisations</option>
                                    <option value="Limoges" selected>Limoges</option>
                                    <option value="Bordeaux">Bordeaux</option>
                                    <option value="Paris">Paris</option>
                                </select>
                            </div>

                            <div class="champ">
                                <label for="duree" data-inspect="offers_select_duree">Durée</label>
                                <select id="duree" name="duree" data-inspect="offers_select_duree">
                                    <option value="">Toutes</option>
                                    <option value="6 mois" selected>6 mois</option>
                                    <option value="4 mois">4 mois</option>
                                </select>
                            </div>

                            <button type="button" class="bouton" data-inspect="offers_btn_rechercher">Rechercher</button>
                        </div>
                    </form>

                    <section aria-labelledby="titre-recommandations">
                        <div class="resultats">
                            <h2 id="titre-recommandations">Recommandations pour vous</h2>
                            <a href="javascript:void(0)" class="bouton" data-inspect="offers_btn_ia_recommandations">Recommandations pour vous</a>
                        </div>
                    </section>

                    <div class="liste">
                        <article class="fiche-offre" style="background: var(--color-card-bg); border: 1px solid var(--color-border); border-radius: var(--border-radius); padding: 1.5rem; margin-bottom: 1.25rem;">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                                <div>
                                    <span class="badge-status-pill badge-cand-accepted" style="margin-bottom: 0.5rem; display: inline-block;">★ Recommandé par l'IA</span>
                                    <h2 style="font-size: 1.3rem; font-weight: 700; margin: 0 0 0.25rem 0;">
                                        <a href="javascript:void(0)" onclick="window.app.navigate('detail_offre')" style="color: inherit; text-decoration: none;" data-inspect="offers_btn_view_thales">Stage Développeur Full-Stack Django & React</a>
                                    </h2>
                                    <p style="font-size: 1rem; color: var(--color-primary); font-weight: 600; margin: 0 0 0.5rem 0;">Thales Group · Limoges (87)</p>
                                </div>
                                <a class="bouton bouton-sm" href="javascript:void(0)" onclick="window.app.navigate('detail_offre')" data-inspect="offers_btn_view_thales">Consulter l'offre</a>
                            </div>
                            <p style="font-size: 0.9rem; line-height: 1.5; color: var(--color-text); margin: 0.5rem 0 1rem 0;">
                                Au sein de notre équipe R&D, vous participerez au développement de plateformes web hautement sécurisées. Contexte : modélisation de données Django ORM, tests unitaires et intégration front-end réactive.
                            </p>
                            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; font-size: 0.8rem; color: var(--color-text-muted);">
                                <span>📍 Limoges</span> · <span>⏱️ 6 mois</span> · <span>🐍 Python, Django, PostgreSQL</span> · <span>🌐 Source : JSearch</span>
                            </div>
                        </article>

                        <article class="fiche-offre" style="background: var(--color-card-bg); border: 1px solid var(--color-border); border-radius: var(--border-radius); padding: 1.5rem; margin-bottom: 1.25rem;">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                                <div>
                                    <h2 style="font-size: 1.3rem; font-weight: 700; margin: 0 0 0.25rem 0;">
                                        <a href="javascript:void(0)" onclick="window.app.navigate('detail_offre')" style="color: inherit; text-decoration: none;" data-inspect="offers_btn_view_capgemini">Ingénieur DevOps & Sécurité Cloud</a>
                                    </h2>
                                    <p style="font-size: 1rem; color: var(--color-primary); font-weight: 600; margin: 0 0 0.5rem 0;">Capgemini · Bordeaux (33)</p>
                                </div>
                                <a class="bouton bouton-sm" href="javascript:void(0)" onclick="window.app.navigate('detail_offre')" data-inspect="offers_btn_view_capgemini">Consulter l'offre</a>
                            </div>
                            <p style="font-size: 0.9rem; line-height: 1.5; color: var(--color-text); margin: 0.5rem 0 1rem 0;">
                                Déploiement automatisé d'infrastructures avec Docker et pipelines CI/CD. Configuration des contrôles de sécurité et surveillance des clusters.
                            </p>
                            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; font-size: 0.8rem; color: var(--color-text-muted);">
                                <span>📍 Bordeaux</span> · <span>⏱️ 6 mois</span> · <span>🐳 Docker, Linux, CI/CD</span> · <span>🌐 Source : JSearch</span>
                            </div>
                        </article>
                    </div>
                </div>
            </div>
        `;
    }

    htmlOfferDetail() {
        return `
            <div class="page-offres"><div class="conteneur">
                <a class="retour" href="javascript:void(0)" onclick="window.app.navigate('liste_offres')" data-inspect="detail_link_back">← Retour aux offres</a>
                <article class="fiche">
                    <header class="entete-offre">
                        <p class="etiquette">OFFRE DE STAGE</p>
                        <h1>Stage Développeur Full-Stack Django & React</h1>
                        <p class="entreprise">Thales Group</p>
                        <div class="informations">
                            <span class="info">Limoges (87)</span>
                            <span class="info">6 mois</span>
                            <span class="info">Avant le 31/12/2026</span>
                        </div>
                    </header>
                    <hr class="separateur">
                    <div class="detail">
                        <div class="contenu-detail">
                            <section class="section-offre">
                                <h2>Description du stage</h2>
                                <div class="texte">
                                    <p>Thales est un leader mondial des hautes technologies qui investit dans les innovations du numérique et de la « deep tech ». Au sein de nos équipes situées à Limoges, vous participerez au développement de nouvelles fonctionnalités stratégiques.</p>
                                    <p><strong>Vos missions :</strong></p>
                                    <ul>
                                        <li>Conception d'APIs REST sous Django.</li>
                                        <li>Optimisation des requêtes SQL et migrations de base de données.</li>
                                        <li>Rédaction des tests unitaires et intégration continue.</li>
                                    </ul>
                                </div>
                            </section>
                            <section class="section-offre">
                                <h2>Compétences recherchées</h2>
                                <p class="texte">Python, Django, PostgreSQL, JavaScript, Git, Docker, autonomie et rigueur.</p>
                            </section>
                            <section class="section-offre">
                                <h2>Comment postuler</h2>
                                <p class="texte">La candidature se fait sur un site externe. Retrouvez les étapes et le bouton pour postuler dans la section <strong>Votre candidature</strong> ci-contre.</p>
                            </section>
                        </div>

                        <aside class="candidature" aria-labelledby="titre-parcours-candidature">
                            <p class="etiquette">VOTRE CANDIDATURE</p>
                            <h2 id="titre-parcours-candidature">Les étapes</h2>
                            <ol class="etapes-candidature">
                                <li>
                                    <strong>Préparez votre CV.</strong>
                                    <p>Votre CV principal est prêt.</p>
                                    <div class="liens-apercu-cv">
                                        <a class="bouton bouton-secondaire" href="javascript:void(0)" data-inspect="cv_btn_generer_principal">Aperçu principal</a>
                                        <a class="bouton bouton-secondaire" href="javascript:void(0)" data-inspect="cv_btn_download_pdf">Télécharger</a>
                                    </div>
                                    <p>Un CV adapté à cette offre est prêt.</p>
                                    <div class="liens-apercu-cv">
                                        <a class="bouton bouton-secondaire" href="javascript:void(0)" data-inspect="cv_btn_preparer_groq">Aperçu adapté</a>
                                    </div>
                                    <div class="action-preparer-cv">
                                        <a class="bouton bouton-preparer-cv" href="javascript:void(0)" onclick="window.app.navigate('mon_cv')" data-inspect="cv_btn_preparer_groq">Préparer mon CV pour cette offre</a>
                                    </div>
                                </li>

                                <li>
                                    <strong>Choisissez le CV à envoyer.</strong>
                                    <form class="choix-cv-offre">
                                        <label for="cv_choisi" data-inspect="cv_select_version">CV pour cette offre</label>
                                        <select id="cv_choisi" name="cv_choisi" data-inspect="cv_select_version">
                                            <option value="PRINCIPAL">CV principal</option>
                                            <option value="ADAPTE" selected>CV adapté pour cette offre</option>
                                        </select>
                                        <button class="bouton bouton-accepter" type="button" data-inspect="cv_btn_select_version">Choisir ce CV</button>
                                    </form>
                                    <p role="status">CV choisi : CV adapté.</p>
                                </li>

                                <li>
                                    <strong>Envoyez votre candidature.</strong>
                                    <p>Utilisez le bouton ci-dessous pour postuler directement. StagePilot n'envoie pas la candidature à votre place.</p>
                                    <div class="action-postuler">
                                        <a class="bouton bouton-postuler bouton-accepter" href="https://thales.wd3.myworkdayjobs.com" target="_blank" data-inspect="detail_btn_external_apply">Postuler à cette offre</a>
                                    </div>
                                </li>

                                <li>
                                    <strong>Confirmez l'envoi réel.</strong>
                                    <div class="confirmation-candidature">
                                        <button class="bouton bouton-accepter" type="button" onclick="window.app.navigate('mes_candidatures')" data-inspect="detail_btn_submit_app">J'ai réellement postulé</button>
                                    </div>
                                </li>
                            </ol>
                            <p class="source">Source : JSearch</p>
                        </aside>
                    </div>
                </article>
            </div></div>
        `;
    }

    htmlApplications() {
        return `
            <div class="page-offres">
                <div class="conteneur">
                    <header class="entete">
                        <p class="etiquette">MES CANDIDATURES</p>
                        <h1>Mes candidatures</h1>
                        <p>Retrouvez et suivez l'ensemble de vos candidatures, vos favoris et les réponses des recruteurs.</p>
                    </header>

                    <div class="glass-card candidatures-filter-bar">
                        <div class="d-flex flex-wrap align-items-center justify-content-between gap-3">
                            <div class="d-flex flex-wrap align-items-center gap-2">
                                <span class="filter-label">Filtrer :</span>
                                <div class="filter-tabs">
                                    <a href="javascript:void(0)" class="filter-tab-btn active" data-inspect="app_filter_tab_all">Toutes <span class="tab-count">10</span></a>
                                    <a href="javascript:void(0)" class="filter-tab-btn tab-favorite" data-inspect="app_filter_tab_favorites">★ Favoris <span class="tab-count count-favorite">2</span></a>
                                    <a href="javascript:void(0)" class="filter-tab-btn tab-accepted" data-inspect="app_filter_tab_accepted">✓ Acceptées <span class="tab-count count-accepted">3</span></a>
                                    <a href="javascript:void(0)" class="filter-tab-btn tab-pending" data-inspect="app_filter_tab_pending">⏳ En attente <span class="tab-count count-pending">5</span></a>
                                    <a href="javascript:void(0)" class="filter-tab-btn tab-refused" data-inspect="app_filter_tab_refused">✕ Refusées <span class="tab-count count-refused">2</span></a>
                                </div>
                            </div>

                            <div class="d-flex align-items-center gap-2">
                                <label for="timeFilterSelect" class="filter-label mb-0" data-inspect="app_select_period">Période :</label>
                                <select id="timeFilterSelect" class="time-filter-select" data-inspect="app_select_period">
                                    <option selected>Toutes les dates</option>
                                    <option>7 derniers jours</option>
                                    <option>30 derniers jours</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="liste">
                        <article class="fiche-offre" style="background: var(--color-card-bg); border: 1px solid var(--color-border); border-left: 4px solid #10b981; border-radius: var(--border-radius); padding: 1.5rem; margin-bottom: 1.25rem;">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                                <div>
                                    <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.4rem;">
                                        <button class="bouton bouton-sm bouton-secondaire" style="padding: 0.2rem 0.5rem;" data-inspect="app_btn_toggle_favori">★ Favori</button>
                                        <span class="badge-cand-statut badge-cand-accepted">✓ Acceptée</span>
                                        <span style="font-size: 0.85rem; color: var(--color-text-muted);">Postulée le 12/10/2026 à 14:30</span>
                                    </div>
                                    <h2 style="font-size: 1.25rem; font-weight: 700; margin: 0 0 0.25rem 0;">Stage Développeur Full-Stack Django & React</h2>
                                    <p style="font-size: 1rem; color: var(--color-primary); font-weight: 600; margin: 0 0 0.5rem 0;">Thales Group · Limoges</p>
                                    <p style="font-size: 0.85rem; color: var(--color-text-muted); margin: 0;">CV utilisé : <strong>CV adapté Thales</strong></p>
                                </div>

                                <div style="display: flex; flex-direction: column; gap: 0.5rem; align-items: flex-end;">
                                    <button class="bouton bouton-accepter" data-inspect="app_btn_confirmer_stage" onclick="alert('Simulation: Ce bouton ouvre la boîte de dialogue de confirmation avec saisie obligatoire de votre mot de passe pour notifier l\'école 3iL.')">
                                        Valider comme mon stage officiel
                                    </button>
                                    <a class="bouton bouton-sm bouton-secondaire" href="javascript:void(0)" data-inspect="app_btn_download_cv_copy">Télécharger la copie du CV</a>
                                </div>
                            </div>
                        </article>

                        <article class="fiche-offre" style="background: var(--color-card-bg); border: 1px solid var(--color-border); border-left: 4px solid #f59e0b; border-radius: var(--border-radius); padding: 1.5rem; margin-bottom: 1.25rem;">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                                <div>
                                    <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.4rem;">
                                        <button class="bouton bouton-sm bouton-secondaire" style="padding: 0.2rem 0.5rem;" data-inspect="app_btn_toggle_favori">☆ Ajouter aux favoris</button>
                                        <span class="badge-cand-statut badge-cand-pending">⏳ En attente</span>
                                        <span style="font-size: 0.85rem; color: var(--color-text-muted);">Postulée le 09/10/2026</span>
                                    </div>
                                    <h2 style="font-size: 1.25rem; font-weight: 700; margin: 0 0 0.25rem 0;">Ingénieur DevOps & Cloud Azure</h2>
                                    <p style="font-size: 1rem; color: var(--color-primary); font-weight: 600; margin: 0 0 0.5rem 0;">Capgemini · Bordeaux</p>
                                    <p style="font-size: 0.85rem; color: var(--color-text-muted); margin: 0;">CV utilisé : <strong>CV principal</strong></p>
                                </div>

                                <div style="display: flex; flex-direction: column; gap: 0.5rem; align-items: flex-end;">
                                    <a class="bouton bouton-sm bouton-secondaire" href="javascript:void(0)" data-inspect="app_btn_download_cv_copy">Télécharger la copie du CV</a>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </div>
        `;
    }

    htmlCv() {
        return `
            <div class="page-accounts"><div class="conteneur-accounts">
                <div class="entete-accounts">
                    <p class="etiquette-accounts">STAGEPILOT</p>
                    <h1>Mon CV</h1>
                </div>

                <section class="carte-accounts">
                    <h2>CV pour Stage Développeur Full-Stack (Thales)</h2>
                    <p>Thales Group</p>
                    <a class="lien-accounts" href="javascript:void(0)" onclick="window.app.navigate('detail_offre')" data-inspect="detail_link_back">Revenir à l’offre et à la candidature</a>

                    <div style="margin-top: 1rem;">
                        <h3 style="font-size: 1rem; font-weight: 700;">Proposition à vérifier (Générée avec Groq LLaMA 3)</h3>
                        <p style="font-size: 0.85rem; color: var(--color-text-muted);">Compétences retenues par l'algorithme :</p>
                        <ul style="font-size: 0.85rem; color: var(--color-text);">
                            <li>Python — Langages de programmation</li>
                            <li>Django — Frameworks Back-end</li>
                            <li>PostgreSQL — Bases de données</li>
                            <li>Docker — Outils & DevOps</li>
                        </ul>
                        <div class="actions-accounts" style="margin-top: 1rem;">
                            <button type="button" class="bouton-accounts" data-inspect="cv_btn_preparer_groq">Afficher la proposition</button>
                            <button class="bouton-accounts bouton-accepter" type="button" data-inspect="cv_btn_valider_groq">Valider et enregistrer cette version</button>
                        </div>
                    </div>
                </section>

                <section class="carte-accounts">
                    <h2>CV principal</h2>
                    <p>Dernière génération : 14/10/2026 à 18:42</p>

                    <div class="actions-accounts">
                        <button class="bouton-accounts" type="button" data-inspect="cv_btn_generer_principal">Afficher</button>
                        <a class="bouton-accounts" href="javascript:void(0)" data-inspect="cv_btn_download_pdf">Télécharger le CV principal</a>
                        <button class="bouton-accounts" type="button" data-inspect="cv_btn_generer_principal">Régénérer mon CV</button>
                    </div>
                </section>
            </div></div>
        `;
    }

    htmlProfile() {
        return `
            <div class="page-accounts"><div class="conteneur-accounts">
                <div class="entete-accounts">
                    <p class="etiquette-accounts">STAGEPILOT</p>
                    <h1>Mon profil</h1>
                    <p class="sous-titre-accounts">Consultez et gérez vos informations personnelles et votre parcours académique.</p>
                </div>

                <div class="carte-accounts">
                    <h2>Informations personnelles</h2>
                    <div class="info-profil"><strong>Prénom :</strong> Lina</div>
                    <div class="info-profil"><strong>Nom :</strong> Martin</div>
                    <div class="info-profil"><strong>Adresse e-mail :</strong> demo_etudiante_complete@example.com</div>
                    <div class="info-profil"><strong>Téléphone :</strong> +33 6 12 34 56 78</div>
                    <div class="info-profil"><strong>Rôle :</strong> Étudiant</div>
                </div>

                <div class="carte-accounts">
                    <h2>Mon parcours étudiant</h2>
                    <div class="info-profil"><strong>Établissement :</strong> 3iL Ingénieurs (Limoges)</div>
                    <div class="info-profil"><strong>Diplôme :</strong> Diplôme d'Ingénieur en Informatique</div>
                    <div class="info-profil"><strong>Statut du diplôme :</strong> En cours</div>
                    <div class="info-profil"><strong>Année d'étude :</strong> 4e année</div>
                    <div class="info-profil">
                        <strong>Compétences :</strong>
                        <p style="margin: 0.25rem 0;">Python, Django, React, PostgreSQL, Docker, Git, CI/CD, Java, Linux.</p>
                    </div>
                    <div class="actions-accounts">
                        <a href="javascript:void(0)" class="bouton-accounts" data-inspect="profile_btn_edit">Modifier mon profil</a>
                    </div>
                </div>
            </div></div>
        `;
    }

    htmlLogin() {
        const isEcole = (this.selectedAuthSpace === "ecole");
        const emailVal = isEcole ? "direction.stages@3il-ingenieurs.fr" : "demo_etudiante_complete@example.com";
        const emailLabel = isEcole ? "Adresse e-mail établissement (3iL)" : "Adresse e-mail";
        const submitLabel = isEcole ? "Se connecter à mon espace Établissement (3iL)" : "Se connecter à mon espace";

        return `
            <div class="auth-wrapper">
                <div class="auth-container">
                    <header class="auth-header text-center">
                        <span class="etiquette-auth">AUTHENTIFICATION</span>
                        <h1 class="auth-title">Connexion</h1>
                        <p class="auth-subtitle">Accédez à votre espace sécurisé pour suivre vos opportunités et démarches.</p>
                    </header>

                    <div class="glass-card auth-card">
                        <form class="auth-form" onsubmit="event.preventDefault(); window.app.submitLogin();">
                            <!-- Choix de l'espace -->
                            <div class="auth-field-group">
                                <label class="auth-field-label">Votre espace</label>
                                <div class="auth-space-selector">
                                    <div class="auth-space-option ${!isEcole ? 'is-selected' : ''}" id="option_espace_etudiant" data-inspect="auth_space_tile" onclick="window.app.selectAuthSpace('etudiant')">
                                        <input type="radio" name="espace" id="id_espace_0" value="ETUDIANT" ${!isEcole ? 'checked' : ''} onchange="window.app.selectAuthSpace('etudiant')">
                                        <label for="id_espace_0" class="auth-space-tile">
                                             <span class="space-icon">🧑</span>
                                             <span class="space-label">Étudiant</span>
                                        </label>
                                    </div>
                                    <div class="auth-space-option ${isEcole ? 'is-selected' : ''}" id="option_espace_ecole" data-inspect="auth_space_tile" onclick="window.app.selectAuthSpace('ecole')">
                                        <input type="radio" name="espace" id="id_espace_1" value="ECOLE" ${isEcole ? 'checked' : ''} onchange="window.app.selectAuthSpace('ecole')">
                                        <label for="id_espace_1" class="auth-space-tile">
                                             <span class="space-icon">🏛️</span>
                                             <span class="space-label">Établissement</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div class="auth-field-group">
                                <label for="id_email" class="auth-field-label" data-inspect="auth_input_email" id="lblAuthEmail">${emailLabel}</label>
                                <div class="auth-input-wrapper">
                                    <input type="email" name="email" id="id_email" class="form-control" value="${emailVal}" data-inspect="auth_input_email">
                                </div>
                            </div>

                            <div class="auth-field-group">
                                <label for="id_password" class="auth-field-label" data-inspect="auth_input_password">Mot de passe</label>
                                <div class="auth-input-wrapper">
                                    <input type="password" name="password" id="id_password" class="form-control" value="••••••••••••" data-inspect="auth_input_password">
                                </div>
                            </div>

                            <button type="button" class="btn-auth-submit" id="btnAuthSubmit" data-inspect="auth_btn_submit" onclick="window.app.submitLogin()">
                                ${submitLabel}
                            </button>
                        </form>

                        <div class="auth-card-footer">
                            <p>Pas encore inscrit ? <a href="javascript:void(0)" onclick="window.app.navigate('inscription_choix')" class="auth-link-register" data-inspect="auth_link_register">Créer un compte</a></p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    htmlRegisterChoice() {
        return `
            <div class="auth-wrapper" style="max-width: 680px;">
                <div class="auth-container">
                    <header class="auth-header text-center">
                        <span class="etiquette-auth">INSCRIPTION</span>
                        <h1 class="auth-title">Créer un compte StagePilot</h1>
                        <p class="auth-subtitle">Choisissez votre profil pour démarrer sur la plateforme.</p>
                    </header>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 1.5rem;">
                        <div class="glass-card" style="padding: 2rem 1.5rem; text-align: center; cursor: pointer;" onclick="window.app.navigate('connexion')" data-inspect="auth_space_tile">
                            <span style="font-size: 3rem; display: block; margin-bottom: 0.5rem;">🧑</span>
                            <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem;">Étudiant</h2>
                            <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 1.25rem;">Consultez les offres, générez vos CV et suivez vos candidatures.</p>
                            <button class="bouton bouton-accepter" style="width: 100%;">Rejoindre en tant qu'étudiant</button>
                        </div>

                        <div class="glass-card" style="padding: 2rem 1.5rem; text-align: center; cursor: pointer;" onclick="window.app.navigate('inscription_ecole')" data-inspect="auth_btn_register_school">
                            <span style="font-size: 3rem; display: block; margin-bottom: 0.5rem;">🏛️</span>
                            <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem;">Établissement</h2>
                            <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 1.25rem;">Suivez les démarches et l'insertion en stage de vos étudiants.</p>
                            <button class="bouton bouton-secondaire" style="width: 100%;">Inscrire une école</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    htmlSchoolRegister() {
        return `
            <div class="auth-wrapper">
                <div class="auth-container">
                    <header class="auth-header text-center">
                        <span class="etiquette-auth" style="color: #0F766E;">ESPACE ÉTABLISSEMENT</span>
                        <h1 class="auth-title">Demande de compte école</h1>
                        <p class="auth-subtitle">Renseignez les informations de votre établissement. Votre compte sera validé par l'administration.</p>
                    </header>

                    <div class="glass-card auth-card">
                        <form class="auth-form">
                            <div class="auth-field-group">
                                <label class="auth-field-label">Nom de l'établissement</label>
                                <input type="text" class="form-control" value="3iL Ingénieurs Limoges" data-inspect="auth_btn_register_school">
                            </div>

                            <div class="auth-field-group">
                                <label class="auth-field-label">Adresse e-mail professionnelle</label>
                                <input type="email" class="form-control" value="direction.etudes@3il.fr" data-inspect="auth_btn_register_school">
                            </div>

                            <div class="auth-field-group">
                                <label class="auth-field-label">Ville & Code postal</label>
                                <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 0.5rem;">
                                    <input type="text" class="form-control" value="Limoges">
                                    <input type="text" class="form-control" value="87000">
                                </div>
                            </div>

                            <button type="button" class="btn-auth-submit" data-inspect="auth_btn_register_school" onclick="alert('Simulation: Inscription atomique avec création de DemandeCompteEcole au statut EN_ATTENTE.')">
                                Transmettre la demande d'inscription
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    htmlSchoolDashboard() {
        return `
            <div class="dashboard">
                <header class="dashboard-header">
                    <div class="d-flex flex-wrap align-items-center justify-content-between gap-3">
                        <div>
                            <p class="etiquette-ecole">ESPACE ÉCOLE</p>
                            <h1>Tableau de bord école</h1>
                            <p class="dashboard-subtitle">Suivi des démarches et de l’insertion en stage pour <strong>3iL Ingénieurs (Limoges)</strong>.</p>
                        </div>
                        <div>
                            <a class="bouton btn-school-action" href="javascript:void(0)" onclick="window.app.navigate('liste_etudiants')" data-inspect="school_btn_liste_etudiants">
                                Consulter la liste des étudiants (10)
                            </a>
                        </div>
                    </div>
                </header>

                <div class="dashboard-stats-grid school-stats-grid">
                    <section class="glass-card stat-card stat-card-total" data-inspect="school_btn_liste_etudiants">
                        <div class="stat-card-header">
                            <span class="stat-badge stat-badge-total">Total</span>
                            <span class="stat-icon" aria-hidden="true">🎓</span>
                        </div>
                        <h2>Étudiants rattachés</h2>
                        <p class="dashboard-number">10</p>
                        <p class="stat-note">Effectif inscrit sur StagePilot</p>
                    </section>

                    <section class="glass-card stat-card stat-card-confirmed" data-inspect="school_kpi_confirmed">
                        <div class="stat-card-header">
                            <span class="stat-badge stat-badge-confirmed">Stage confirmé</span>
                            <span class="stat-icon stat-icon-star" aria-hidden="true">★</span>
                        </div>
                        <h3>Stages confirmés</h3>
                        <p class="dashboard-number number-confirmed">4</p>
                        <p class="stat-note"><strong>40.0 %</strong> intégration validée</p>
                    </section>

                    <section class="glass-card stat-card stat-card-accepted" data-inspect="school_kpi_accepted">
                        <div class="stat-card-header">
                            <span class="stat-badge stat-badge-accepted">Stage trouvé</span>
                            <span class="stat-icon" aria-hidden="true">✓</span>
                        </div>
                        <h3>Offres acceptées</h3>
                        <p class="dashboard-number number-accepted">5</p>
                        <p class="stat-note"><strong>50.0 %</strong> avec offre acceptée</p>
                    </section>

                    <section class="glass-card stat-card stat-card-pending" data-inspect="school_kpi_pending">
                        <div class="stat-card-header">
                            <span class="stat-badge stat-badge-pending">En attente</span>
                            <span class="stat-icon" aria-hidden="true">⏳</span>
                        </div>
                        <h3>En attente de stage</h3>
                        <p class="dashboard-number number-pending">5</p>
                        <p class="stat-note"><strong>50.0 %</strong> en attente ou recherche</p>
                    </section>

                    <section class="glass-card stat-card stat-card-refused" data-inspect="school_kpi_refused">
                        <div class="stat-card-header">
                            <span class="stat-badge stat-badge-refused">Refusés</span>
                            <span class="stat-icon" aria-hidden="true">✕</span>
                        </div>
                        <h3>Candidatures refusées</h3>
                        <p class="dashboard-number number-refused">1</p>
                        <p class="stat-note"><strong>10.0 %</strong> sans accord validé</p>
                    </section>
                </div>

                <div class="dashboard-grid">
                    <section class="glass-card" data-inspect="dash_donut_chart">
                        <div class="section-card-header">
                            <h2>Recherche de stage</h2>
                        </div>
                        <div class="dashboard-chart">
                            <div class="dashboard-donut" aria-hidden="true">
                                <svg viewBox="0 0 120 120" focusable="false">
                                    <circle class="donut-second" cx="60" cy="60" r="48"></circle>
                                    <circle class="donut-first" cx="60" cy="60" r="48" pathLength="100" stroke-dasharray="40 100" transform="rotate(-90 60 60)"></circle>
                                </svg>
                                <div class="donut-center"><strong>40.0 %</strong><span>avec stage</span></div>
                            </div>
                            <ul class="dashboard-legend">
                                <li><span class="legend-dot legend-first" aria-hidden="true"></span><span>Avec stage <strong>4 · 40.0 %</strong></span></li>
                                <li><span class="legend-dot legend-second" aria-hidden="true"></span><span>Sans stage <strong>6 · 60.0 %</strong></span></li>
                            </ul>
                        </div>
                    </section>

                    <div class="dashboard-actions">
                        <section class="glass-card">
                            <h2>Liste des étudiants</h2>
                            <p>Accédez aux fiches individuelles et aux statuts de candidatures.</p>
                            <a class="dashboard-button" href="javascript:void(0)" onclick="window.app.navigate('liste_etudiants')" data-inspect="school_btn_liste_etudiants">Voir la liste complète</a>
                        </section>
                        <section class="glass-card">
                            <h2>Centre de notifications</h2>
                            <p>Suivez les confirmations et annulations de vos étudiants en temps réel.</p>
                            <a class="dashboard-button" href="javascript:void(0)" onclick="window.app.navigate('notifications_ecole')" data-inspect="nav_notif_bell">Consulter les alertes</a>
                        </section>
                    </div>
                </div>
            </div>
        `;
    }

    htmlSchoolStudents() {
        return `
            <div class="page-ecole">
                <div class="conteneur-ecole">
                    <a class="retour-ecole d-inline-flex align-items-center gap-1 mb-3" href="javascript:void(0)" onclick="window.app.navigate('tableau_de_bord_ecole')">
                        ← Tableau de bord
                    </a>

                    <header class="entete-ecole">
                        <div class="d-flex flex-wrap align-items-center justify-content-between gap-3">
                            <div>
                                <p class="etiquette-ecole">ESPACE ÉCOLE</p>
                                <h1>Étudiants de 3iL Ingénieurs (Limoges)</h1>
                                <p>Suivez l'état d'avancement des candidatures et identifiez les étudiants nécessitant un accompagnement.</p>
                            </div>
                            <div class="d-flex flex-wrap align-items-center gap-2">
                                <button class="bouton btn-school-action" data-inspect="school_btn_export_csv" onclick="alert('Simulation: Export CSV généré')">
                                    📥 Exporter en CSV
                                </button>
                                <span class="badge-status-pill badge-cand-confirmed">
                                    ★ 4 / 10 confirmés
                                </span>
                            </div>
                        </div>
                    </header>

                    <div class="school-filter-bar glass-card" data-inspect="school_btn_liste_etudiants">
                        <div class="filter-tabs-wrapper">
                            <span class="filter-label">Filtrer par statut :</span>
                            <div class="filter-tabs">
                                <a href="javascript:void(0)" class="filter-tab-btn active">Tous <span class="tab-count">10</span></a>
                                <a href="javascript:void(0)" class="filter-tab-btn tab-confirmed">★ Stage confirmé <span class="tab-count count-confirmed">4</span></a>
                                <a href="javascript:void(0)" class="filter-tab-btn tab-accepted">✓ Stage trouvé <span class="tab-count count-accepted">1</span></a>
                                <a href="javascript:void(0)" class="filter-tab-btn tab-pending">⏳ En attente <span class="tab-count count-pending">4</span></a>
                                <a href="javascript:void(0)" class="filter-tab-btn tab-refused">✕ Refusés <span class="tab-count count-refused">1</span></a>
                            </div>
                        </div>
                    </div>

                    <div class="glass-card" style="padding: 0; overflow: hidden;">
                        <table class="table mb-0" style="font-size: 0.9rem;">
                            <thead style="background: var(--color-surface-hover);">
                                <tr>
                                    <th style="padding: 1rem;">Étudiant</th>
                                    <th style="padding: 1rem;">Diplôme</th>
                                    <th style="padding: 1rem;">Candidatures</th>
                                    <th style="padding: 1rem;">Situation</th>
                                    <th style="padding: 1rem;">Entreprise confirmée</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style="border-bottom: 1px solid var(--color-border-subtle);" data-inspect="school_btn_liste_etudiants">
                                    <td style="padding: 1rem;"><strong>Lina Martin</strong><br><span style="font-size: 0.8rem; color: var(--color-text-muted);">lina.martin@example.com</span></td>
                                    <td style="padding: 1rem;">Ingénieur Informatique (4e)</td>
                                    <td style="padding: 1rem;">10 candidatures</td>
                                    <td style="padding: 1rem;"><span class="badge-cand-statut badge-cand-confirmed">★ Stage confirmé</span></td>
                                    <td style="padding: 1rem;"><strong>Thales Group</strong> (Limoges)</td>
                                </tr>
                                <tr style="border-bottom: 1px solid var(--color-border-subtle);">
                                    <td style="padding: 1rem;"><strong>Alexandre Dupont</strong><br><span style="font-size: 0.8rem; color: var(--color-text-muted);">alex.dupont@example.com</span></td>
                                    <td style="padding: 1rem;">Ingénieur Informatique (5e)</td>
                                    <td style="padding: 1rem;">4 candidatures</td>
                                    <td style="padding: 1rem;"><span class="badge-cand-statut badge-cand-confirmed">★ Stage confirmé</span></td>
                                    <td style="padding: 1rem;"><strong>Legrand</strong> (Limoges)</td>
                                </tr>
                                <tr style="border-bottom: 1px solid var(--color-border-subtle);">
                                    <td style="padding: 1rem;"><strong>Sarah Benali</strong><br><span style="font-size: 0.8rem; color: var(--color-text-muted);">sarah.benali@example.com</span></td>
                                    <td style="padding: 1rem;">Ingénieur Informatique (4e)</td>
                                    <td style="padding: 1rem;">2 candidatures</td>
                                    <td style="padding: 1rem;"><span class="badge-cand-statut badge-cand-pending">⏳ En attente</span></td>
                                    <td style="padding: 1rem; color: var(--color-text-muted);">—</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    htmlSchoolNotifications() {
        return `
            <div class="page-ecole">
                <div class="conteneur-ecole">
                    <a class="retour-ecole d-inline-flex align-items-center gap-1 mb-3" href="javascript:void(0)" onclick="window.app.navigate('tableau_de_bord_ecole')">
                        ← Tableau de bord
                    </a>

                    <header class="entete-ecole">
                        <div class="d-flex flex-wrap align-items-center justify-content-between gap-3">
                            <div>
                                <p class="etiquette-ecole">ESPACE ÉCOLE</p>
                                <h1>Notifications des stages</h1>
                                <p>Suivez en temps réel les confirmations d'intégration et les annulations de stage de vos étudiants pour <strong>3iL Ingénieurs (Limoges)</strong>.</p>
                            </div>
                            <div class="d-flex flex-wrap align-items-center gap-2">
                                <span class="badge-status-pill badge-cand-confirmed">★ 2 confirmations</span>
                                <span class="badge-status-pill badge-cand-refused">✕ 1 annulation</span>
                            </div>
                        </div>
                    </header>

                    <div class="school-filter-bar glass-card" data-inspect="school_btn_marquer_tout_lu">
                        <div class="filter-tabs-wrapper d-flex flex-wrap align-items-center justify-content-between w-100 gap-3">
                            <div class="filter-tabs">
                                <a href="javascript:void(0)" class="filter-tab-btn active">Toutes <span class="tab-count">3</span></a>
                                <a href="javascript:void(0)" class="filter-tab-btn tab-confirmed">★ Confirmations <span class="tab-count count-confirmed">2</span></a>
                                <a href="javascript:void(0)" class="filter-tab-btn tab-refused">✕ Annulations <span class="tab-count count-refused">1</span></a>
                            </div>
                            <button class="btn-mark-all-pill" onclick="alert('Simulation: Toutes les notifications marquées comme lues via update(est_lue=True)')">
                                ✓ Tout marquer comme lu (3)
                            </button>
                        </div>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <article class="glass-card" style="border-left: 4px solid #10b981;" data-inspect="nav_notif_bell">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                                <div>
                                    <span class="badge-status-pill badge-cand-confirmed" style="margin-bottom: 0.35rem; display: inline-block;">★ Stage confirmé</span>
                                    <h2 style="font-size: 1.15rem; font-weight: 700; margin: 0 0 0.25rem 0;">Stage confirmé : Lina Martin</h2>
                                    <p style="font-size: 0.9rem; color: var(--color-text); margin: 0;">L'étudiant(e) Lina Martin a confirmé son intégration pour le stage « Stage Développeur Full-Stack Python & Django » chez Thales Group.</p>
                                    <p style="font-size: 0.8rem; color: var(--color-text-muted); margin-top: 0.5rem;">Il y a 2 heures</p>
                                </div>
                                <span class="badge-status-pill badge-cand-accepted">Non lue</span>
                            </div>
                        </article>

                        <article class="glass-card" style="border-left: 4px solid #10b981;">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                                <div>
                                    <span class="badge-status-pill badge-cand-confirmed" style="margin-bottom: 0.35rem; display: inline-block;">★ Stage confirmé</span>
                                    <h2 style="font-size: 1.15rem; font-weight: 700; margin: 0 0 0.25rem 0;">Stage confirmé : Alexandre Dupont</h2>
                                    <p style="font-size: 0.9rem; color: var(--color-text); margin: 0;">L'étudiant(e) Alexandre Dupont a confirmé son intégration pour le stage « Ingénieur Cybersécurité » chez Legrand.</p>
                                    <p style="font-size: 0.8rem; color: var(--color-text-muted); margin-top: 0.5rem;">Hier à 16:30</p>
                                </div>
                                <span class="badge-status-pill badge-cand-accepted">Non lue</span>
                            </div>
                        </article>

                        <article class="glass-card" style="border-left: 4px solid #ef4444;">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                                <div>
                                    <span class="badge-status-pill badge-cand-refused" style="margin-bottom: 0.35rem; display: inline-block;">✕ Confirmation annulée</span>
                                    <h2 style="font-size: 1.15rem; font-weight: 700; margin: 0 0 0.25rem 0;">Confirmation annulée : Sarah Benali</h2>
                                    <p style="font-size: 0.9rem; color: var(--color-text); margin: 0;">L'étudiant(e) Sarah Benali a annulé la confirmation de son stage.</p>
                                    <p style="font-size: 0.8rem; color: var(--color-text-muted); margin-top: 0.5rem;">Il y a 3 jours</p>
                                </div>
                                <span style="font-size: 0.8rem; color: var(--color-text-muted);">Lue</span>
                            </div>
                        </article>
                    </div>
                </div>
            </div>
        `;
    }

    // =========================================================================
    // INSPECTOR TOOLTIP & CODE DRAWER
    // =========================================================================
    showTooltip(event, elementId) {
        const el = APP_DATA.elements[elementId];
        if (!el) return;

        const tooltip = document.getElementById("inspectorTooltip");
        if (!tooltip) return;

        tooltip.innerHTML = `
            <div class="hud-title">
                <span>${el.title}</span>
                <span class="hud-pill">${el.type}</span>
            </div>
            <div class="hud-row">
                <span class="hud-label">Template :</span>
                <span class="hud-val">${el.template} (${el.templateLines})</span>
            </div>
            <div class="hud-row">
                <span class="hud-label">Route URL :</span>
                <span class="hud-val">${el.urlName}</span>
            </div>
            <div class="hud-row">
                <span class="hud-label">Vue Python :</span>
                <span class="hud-val">${el.viewHandler} (${el.viewLines})</span>
            </div>
            <div class="hud-hint">
                <span>👆 Cliquez pour inspecter le code & questions prof</span>
            </div>
        `;

        tooltip.style.display = "block";
        const x = Math.min(event.clientX + 15, window.innerWidth - 400);
        const y = Math.min(event.clientY + 15, window.innerHeight - 200);
        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y}px`;
    }

    hideTooltip() {
        const tooltip = document.getElementById("inspectorTooltip");
        if (tooltip) tooltip.style.display = "none";
    }

    escapeHtml(str) {
        if (!str) return "";
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }

    highlightPythonLine(line) {
        if (!line) return "";
        const trimmed = line.trim();
        if (trimmed.startsWith("#") || trimmed.startsWith("//")) {
            return `<span class="tok-com">${this.escapeHtml(line)}</span>`;
        }

        const KEYWORDS = new Set(["def", "return", "if", "elif", "else", "for", "in", "while", "try", "except", "finally", "with", "as", "not", "and", "or", "is", "import", "from", "class", "pass", "raise", "lambda", "async", "await", "const", "let", "var", "function"]);
        const BUILTINS = new Set(["True", "False", "None", "self", "request", "user", "null", "undefined"]);
        const MODELS = new Set(["Utilisateur", "Stage", "Candidature", "Offre", "Notification", "DemandeEtablissement", "Etablissement", "Role", "Statut", "Filiere", "Niveau", "Q", "Count", "Sum", "Avg", "F", "FileResponse", "HttpResponse", "JsonResponse"]);

        const re = /("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|#[^\n]*|\/\/[^\n]*|@[a-zA-Z0-9_.]+|\b[a-zA-Z_][a-zA-Z0-9_]*(?=\()|\b[a-zA-Z_][a-zA-Z0-9_]*\b|\b\d+\b)/g;

        let result = "";
        let lastIndex = 0;
        let match;

        while ((match = re.exec(line)) !== null) {
            result += this.escapeHtml(line.substring(lastIndex, match.index));
            const token = match[0];

            if (token.startsWith("#") || token.startsWith("//")) {
                result += `<span class="tok-com">${this.escapeHtml(token)}</span>`;
            } else if (token.startsWith('"') || token.startsWith("'")) {
                result += `<span class="tok-str">${this.escapeHtml(token)}</span>`;
            } else if (token.startsWith("@")) {
                result += `<span class="tok-dec">${this.escapeHtml(token)}</span>`;
            } else if (KEYWORDS.has(token)) {
                result += `<span class="tok-kw">${token}</span>`;
            } else if (BUILTINS.has(token)) {
                result += `<span class="tok-bi">${token}</span>`;
            } else if (MODELS.has(token)) {
                result += `<span class="tok-mod">${token}</span>`;
            } else if (line[match.index + token.length] === "(") {
                result += `<span class="tok-fn">${token}</span>`;
            } else if (/^\d+$/.test(token)) {
                result += `<span class="tok-num">${token}</span>`;
            } else {
                result += this.escapeHtml(token);
            }

            lastIndex = re.lastIndex;
        }

        result += this.escapeHtml(line.substring(lastIndex));
        return result;
    }

    highlightHtmlLine(line) {
        if (!line) return "";
        const esc = line.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const re = /(\{\{[\s\S]*?\}\}|\{%[\s\S]*?%\}|&lt;!--[\s\S]*?--&gt;|&lt;\/?[a-zA-Z0-9_-]+|\/&gt;|&gt;|&lt;|[a-zA-Z0-9_-]+(?==)|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g;
        
        let result = "";
        let lastIndex = 0;
        let match;

        while ((match = re.exec(esc)) !== null) {
            result += esc.substring(lastIndex, match.index);
            const token = match[0];

            if (token.startsWith("{{") || token.startsWith("{%")) {
                result += `<span class="tok-dj">${token}</span>`;
            } else if (token.startsWith("&lt;!--")) {
                result += `<span class="tok-com">${token}</span>`;
            } else if (token.startsWith("&lt;") || token === "&gt;" || token === "/&gt;") {
                result += `<span class="tok-tag">${token}</span>`;
            } else if (token.startsWith('"') || token.startsWith("'")) {
                result += `<span class="tok-str">${token}</span>`;
            } else if (esc[match.index + token.length] === "=") {
                result += `<span class="tok-attr">${token}</span>`;
            } else {
                result += token;
            }
            lastIndex = re.lastIndex;
        }
        result += esc.substring(lastIndex);
        return result;
    }

    highlightSyntax(code) {
        if (!code) return "";
        const trimmed = code.trim();
        const isHtml = trimmed.startsWith("<") || trimmed.includes("</") || trimmed.includes("{%") || (trimmed.includes("{{") && trimmed.includes("<input"));
        const lines = code.split("\n");
        return lines.map((line, idx) => {
            const highlighted = isHtml ? this.highlightHtmlLine(line) : this.highlightPythonLine(line);
            return `<div class="code-line"><span class="code-line-num">${idx + 1}</span><span class="code-line-content">${highlighted || "&nbsp;"}</span></div>`;
        }).join("");
    }

    inspectElement(elementId) {
        const el = APP_DATA.elements[elementId];
        if (!el) return;

        this.selectedElement = el;
        const drawer = document.getElementById("codeDrawer");
        const backdrop = document.getElementById("drawerBackdrop");
        if (!drawer || !backdrop) return;

        // Title and Type Badge
        document.getElementById("drawerElementTitle").innerText = el.title;
        document.getElementById("drawerElementType").innerText = el.type;

        // Ruban breadcrumb express
        const ribbon = document.getElementById("drawerBreadcrumbBar");
        if (ribbon) {
            const templateShort = el.template ? el.template.split("/").pop() : "";
            const viewShort = el.viewFile ? el.viewFile.split("/").pop() : "";
            ribbon.innerHTML = `
                <span class="insp-ribbon-pill ribbon-root">📁 web_3il</span>
                <span class="insp-ribbon-sep">›</span>
                <span class="insp-ribbon-pill ribbon-template">📄 ${templateShort} (${el.templateLines || "HTML"})</span>
                <span class="insp-ribbon-sep">›</span>
                <span class="insp-ribbon-pill ribbon-url">🔗 ${el.urlPath || el.urlName}</span>
                <span class="insp-ribbon-sep">›</span>
                <span class="insp-ribbon-pill ribbon-view">🐍 ${viewShort} (${el.viewLines || "Vue"})</span>
            `;
        }

        // Synthèse Rapide / En clair pour le jury non-technique
        const summaryEl = document.getElementById("drawerPlainSummary");
        if (summaryEl) {
            const defaultSummary = el.summary || (
                el.qa && el.qa.simpleSummary ? el.qa.simpleSummary : 
                `Cet élément permet à l'utilisateur d'activer l'action : <strong>${el.title}</strong>. Dès l'interaction, Django relaie l'événement vers la vue <code>${el.viewHandler}</code> dans <code>${el.viewFile}</code> pour sécuriser la saisie et mettre à jour les données métier.`
            );
            summaryEl.innerHTML = defaultSummary;
        }

        // 4 Métadonnées avec Couleurs Distinctes
        const templateEl = document.getElementById("drawerMetaTemplate");
        if (templateEl) {
            templateEl.innerHTML = `
                <span style="color: #fed7aa; font-weight: 700;">${el.template}</span>
                <span class="path-line-badge line-badge-orange">${el.templateLines}</span>
            `;
        }

        const urlEl = document.getElementById("drawerMetaUrl");
        if (urlEl) {
            urlEl.innerHTML = `
                <span style="color: #38bdf8; font-weight: 700;">${el.urlName}</span>
                <span style="color: #94a3b8; margin: 0 0.25rem;">➔</span>
                <span style="color: #bae6fd; font-weight: 700;">${el.urlPath}</span>
            `;
        }

        const viewEl = document.getElementById("drawerMetaView");
        if (viewEl) {
            viewEl.innerHTML = `
                <span style="color: #e9d5ff; font-weight: 700;">${el.viewHandler}</span>
                <span class="path-line-badge line-badge-purple">${el.viewLines}</span>
            `;
        }

        const fileEl = document.getElementById("drawerMetaFile");
        if (fileEl) {
            fileEl.innerHTML = `
                <span style="color: #a7f3d0; font-weight: 700;">${el.viewFile}</span>
                <span class="path-line-badge line-badge-green">Projet web_3il</span>
            `;
        }

        // Cycle de traitement pas-à-pas
        const stepsContainer = document.getElementById("drawerTreatmentSteps");
        if (stepsContainer && el.treatment) {
            stepsContainer.innerHTML = el.treatment.map((step, idx) => `
                <div class="insp-step">
                    <div class="insp-step-num">${idx + 1}</div>
                    <div class="insp-step-body">${step}</div>
                </div>
            `).join("");
        }

        // En-tête code et rendu colorisé avec numéros de lignes
        const filenameEl = document.getElementById("drawerCodeFilename");
        if (filenameEl) {
            filenameEl.innerText = `${el.viewFile} (${el.viewLines})`;
        }

        const codePre = document.getElementById("drawerCodeSnippet");
        if (codePre) {
            codePre.innerHTML = this.highlightSyntax(el.codeSnippet);
        }

        // Boîte Question Prof & Réponse Préparée (Profil Non-Technique)
        const qaContainer = document.getElementById("drawerOralQa");
        if (qaContainer && el.qa) {
            qaContainer.innerHTML = `
                <div class="prof-q-header">
                    <span>🎓 QUESTION DU PROFESSEUR À L'ORAL (PROFIL NON-TECHNIQUE)</span>
                </div>
                <div class="prof-q-text">
                    ${el.qa.question.startsWith("«") ? el.qa.question : `« ${el.qa.question} »`}
                </div>

                <div class="prof-location-box">
                    <div class="prof-location-title">
                        <span>📍 OÙ MONTRER LE CODE AU PROFESSEUR :</span>
                    </div>
                    <div class="prof-location-pills">
                        <div class="prof-loc-pill prof-loc-template">
                            <span>📄 Template HTML</span>
                            <strong>${el.template} (${el.templateLines})</strong>
                        </div>
                        <div class="prof-loc-pill prof-loc-python">
                            <span>🐍 Vue & Fichier Python</span>
                            <strong>${el.viewFile} → ${el.viewHandler} (${el.viewLines})</strong>
                        </div>
                    </div>
                </div>

                <div class="prof-ans-box">
                    <div class="prof-ans-title">
                        <span>🗣️ EXPLICATION SIMPLE & SANS JARGON À DONNER À L'ORAL :</span>
                    </div>
                    <div class="prof-ans-text">
                        ${el.qa.answer}
                    </div>
                </div>

                ${(el.id === "auth_space_tile" || el.id === "auth_btn_submit") ? `
                    <div style="margin-top: 0.85rem; padding-top: 0.85rem; border-top: 1px solid rgba(255, 255, 255, 0.1); display: flex; flex-direction: column; gap: 0.5rem;">
                        <span style="font-size: 0.725rem; font-weight: 700; color: #38bdf8; text-transform: uppercase;">🚀 Tester la connexion en direct :</span>
                        <div style="display: flex; gap: 0.5rem;">
                            <button type="button" class="sp-ctrl-btn" style="flex: 1; justify-content: center; background: #0f766e; border-color: #14b8a6; color: white; font-weight: 700;" onclick="window.app.closeDrawer(); window.app.selectAuthSpace('ecole'); window.app.submitLogin();">
                                🏛️ Connexion Espace Établissement (3iL)
                            </button>
                            <button type="button" class="sp-ctrl-btn" style="flex: 1; justify-content: center; background: #1e293b; color: white; font-weight: 700;" onclick="window.app.closeDrawer(); window.app.selectAuthSpace('etudiant'); window.app.submitLogin();">
                                🧑 Connexion Espace Étudiant (Lina)
                            </button>
                        </div>
                    </div>
                ` : ""}
            `;
        }

        drawer.classList.add("is-open");
        backdrop.classList.add("is-open");
    }

    closeDrawer() {
        const drawer = document.getElementById("codeDrawer");
        const backdrop = document.getElementById("drawerBackdrop");
        if (drawer) drawer.classList.remove("is-open");
        if (backdrop) backdrop.classList.remove("is-open");
    }

    // =========================================================================
    // GUIDE & SOUTENANCE OVERLAY
    // =========================================================================
    openGuide() {
        this.guideOpen = true;
        const overlay = document.getElementById("guideOverlay");
        if (overlay) overlay.classList.add("is-open");
        document.body.style.overflow = "hidden";
        this.hideTooltip();
    }

    closeGuide() {
        this.guideOpen = false;
        const overlay = document.getElementById("guideOverlay");
        if (overlay) overlay.classList.remove("is-open");
        document.body.style.overflow = "";
    }

    switchGuideTab(tabName) {
        document.querySelectorAll("[data-guide-tab]").forEach(btn => {
            btn.classList.toggle("active", btn.getAttribute("data-guide-tab") === tabName);
        });

        document.querySelectorAll(".guide-tab-pane").forEach(pane => {
            pane.style.display = (pane.id === `guide_pane_${tabName}`) ? "block" : "none";
        });
    }

    renderGuideContents() {
        // 1. Architecture & Exhaustive Tech Stack
        const archContainer = document.getElementById("guideArchitectureContainer");
        if (archContainer && APP_DATA.guideArchitecture) {
            archContainer.innerHTML = APP_DATA.guideArchitecture.map(cat => `
                <div class="sp-arch-category-section" style="margin-bottom: 2.25rem;">
                    <div class="sp-arch-category-header" style="border-left: 4px solid ${cat.color}; padding: 0.6rem 1rem; margin-bottom: 1.25rem; background: rgba(255,255,255,0.03); border-radius: 0 10px 10px 0; display: flex; align-items: center; justify-content: space-between;">
                        <h3 style="font-size: 1.2rem; font-weight: 800; color: #ffffff; margin: 0;">${cat.category}</h3>
                        <span style="font-size: 0.78rem; background: rgba(255,255,255,0.1); color: #cbd5e1; padding: 0.2rem 0.65rem; border-radius: 9999px; font-weight: 700;">${cat.items.length} briques techniques</span>
                    </div>
                    <div class="sp-guide-grid-3">
                        ${cat.items.map(tech => `
                            <div class="sp-guide-card" style="display: flex; flex-direction: column;">
                                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
                                    <div class="sp-guide-card-icon" style="margin-bottom: 0;">${tech.icon}</div>
                                    <span style="font-size: 0.72rem; background: rgba(99, 102, 241, 0.15); color: #a5b4fc; border: 1px solid rgba(99, 102, 241, 0.3); padding: 0.2rem 0.55rem; border-radius: 6px; font-weight: 700;">${tech.type}</span>
                                </div>
                                <h3 style="font-size: 1.15rem; font-weight: 800; color: #ffffff; margin: 0 0 0.5rem 0;">${tech.name}</h3>
                                <p style="font-size: 0.88rem; color: #cbd5e1; line-height: 1.5; margin-bottom: 0.65rem;">
                                    <strong style="color: #93c5fd;">🎯 Rôle :</strong> ${tech.role}
                                </p>
                                <p style="font-size: 0.84rem; color: #94a3b8; line-height: 1.5; margin-bottom: 1rem; flex-grow: 1;">
                                    <strong style="color: #34d399;">💡 Justification du Choix :</strong> ${tech.justification}
                                </p>
                                <div style="display: flex; flex-wrap: wrap; gap: 0.35rem; margin-top: auto; padding-top: 0.75rem; border-top: 1px solid rgba(255,255,255,0.06);">
                                    ${tech.tags.map(t => `<span class="sp-tech-tag" style="font-size: 0.7rem;">${t}</span>`).join("")}
                                </div>
                            </div>
                        `).join("")}
                    </div>
                </div>
            `).join("");
        }

        // 2. Interactive VS Code Tree
        const treeRoot = document.getElementById("guideTreeList");
        if (treeRoot && APP_DATA.projectFolders) {
            treeRoot.innerHTML = APP_DATA.projectFolders.map(folder => `
                <div class="vscode-folder-node" id="${folder.id}" data-folder-name="${folder.name.toLowerCase()}">
                    <div class="vscode-folder-header" onclick="app.toggleGuideFolder('${folder.id}')">
                        <span class="vscode-caret" id="caret_${folder.id}">▾</span>
                        <span class="vscode-folder-icon" id="ficon_${folder.id}">📂</span>
                        <span class="vscode-folder-title">${folder.name}</span>
                        <span class="vscode-folder-badge">${folder.badge}</span>
                        <span class="vscode-folder-count">${folder.files.length} fichiers</span>
                    </div>
                    <div class="vscode-folder-children" id="children_${folder.id}">
                        ${folder.files.map(file => {
                            const icon = file.path.endsWith('.py') ? '🐍' : 
                                         file.path.endsWith('.html') ? '📄' : 
                                         file.path.endsWith('.css') ? '🎨' : 
                                         file.path.endsWith('.js') || file.path.endsWith('.cjs') ? '⚡' : 
                                         file.path.endsWith('.md') ? '📖' : 
                                         file.path.endsWith('.sqlite3') ? '🗄️' : '⚙️';
                            return `
                                <div class="vscode-file-row" data-file-path="${file.path}" data-search-text="${(file.path + ' ' + file.analogy + ' ' + file.desc + ' ' + file.category).toLowerCase()}" onclick="app.selectTreeFile('${file.path}')">
                                    <div class="vscode-file-indent"></div>
                                    <span class="vscode-file-icon">${icon}</span>
                                    <strong class="vscode-file-name">${file.name}</strong>
                                    <span class="vscode-file-analogy">💡 ${file.analogy}</span>
                                    <span class="vscode-file-desc">${file.desc}</span>
                                </div>
                            `;
                        }).join("")}
                    </div>
                </div>
            `).join("");
        }

        // 3. Treatments with Verbatim Code Snippets (Interactive Hub & Vibrant Themes)
        const TREATMENT_THEMES = [
            { num: "01", shortName: "Auth & RBAC", color: "#38bdf8", gradient: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)", bgTint: "rgba(2, 132, 199, 0.08)", border: "rgba(56, 189, 248, 0.35)", glow: "rgba(2, 132, 199, 0.35)", badgeBg: "rgba(2, 132, 199, 0.18)", badgeText: "#38bdf8", icon: "🔐" },
            { num: "02", shortName: "Validation Écoles", color: "#34d399", gradient: "linear-gradient(135deg, #059669 0%, #10b981 100%)", bgTint: "rgba(5, 150, 105, 0.08)", border: "rgba(52, 211, 153, 0.35)", glow: "rgba(16, 185, 129, 0.35)", badgeBg: "rgba(5, 150, 105, 0.18)", badgeText: "#34d399", icon: "🏛️" },
            { num: "03", shortName: "Formsets Profil", color: "#a78bfa", gradient: "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)", bgTint: "rgba(124, 58, 237, 0.08)", border: "rgba(167, 139, 250, 0.35)", glow: "rgba(124, 58, 237, 0.35)", badgeBg: "rgba(124, 58, 237, 0.18)", badgeText: "#c084fc", icon: "📝" },
            { num: "04", shortName: "Génération PDF", color: "#fb923c", gradient: "linear-gradient(135deg, #ea580c 0%, #f97316 100%)", bgTint: "rgba(234, 88, 12, 0.08)", border: "rgba(251, 146, 60, 0.35)", glow: "rgba(234, 88, 12, 0.35)", badgeBg: "rgba(234, 88, 12, 0.18)", badgeText: "#fb923c", icon: "📄" },
            { num: "05", shortName: "Supabase S3", color: "#2dd4bf", gradient: "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)", bgTint: "rgba(13, 148, 136, 0.08)", border: "rgba(45, 212, 191, 0.35)", glow: "rgba(13, 148, 136, 0.35)", badgeBg: "rgba(13, 148, 136, 0.18)", badgeText: "#2dd4bf", icon: "☁️" },
            { num: "06", shortName: "IA Groq LLaMA", color: "#f472b6", gradient: "linear-gradient(135deg, #c026d3 0%, #ec4899 100%)", bgTint: "rgba(236, 72, 153, 0.08)", border: "rgba(244, 114, 182, 0.35)", glow: "rgba(236, 72, 153, 0.35)", badgeBg: "rgba(192, 38, 211, 0.18)", badgeText: "#f472b6", icon: "✨" },
            { num: "07", shortName: "Candidature Snapshot", color: "#818cf8", gradient: "linear-gradient(135deg, #4338ca 0%, #6366f1 100%)", bgTint: "rgba(99, 102, 241, 0.08)", border: "rgba(129, 140, 248, 0.35)", glow: "rgba(99, 102, 241, 0.35)", badgeBg: "rgba(99, 102, 241, 0.18)", badgeText: "#a5b4fc", icon: "📨" },
            { num: "08", shortName: "Verrou select_for_update", color: "#fbbf24", gradient: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)", bgTint: "rgba(245, 158, 11, 0.08)", border: "rgba(251, 191, 36, 0.35)", glow: "rgba(245, 158, 11, 0.35)", badgeBg: "rgba(217, 119, 6, 0.18)", badgeText: "#fcd34d", icon: "🔒" },
            { num: "09", shortName: "RapidAPI JSearch", color: "#fb7185", gradient: "linear-gradient(135deg, #e11d48 0%, #f43f5e 100%)", bgTint: "rgba(244, 63, 94, 0.08)", border: "rgba(251, 113, 133, 0.35)", glow: "rgba(244, 63, 94, 0.35)", badgeBg: "rgba(225, 29, 72, 0.18)", badgeText: "#fb7185", icon: "🔍" },
            { num: "10", shortName: "Stats Dashboard", color: "#67e8f9", gradient: "linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)", bgTint: "rgba(6, 182, 212, 0.08)", border: "rgba(103, 232, 249, 0.35)", glow: "rgba(6, 182, 212, 0.35)", badgeBg: "rgba(8, 145, 178, 0.18)", badgeText: "#67e8f9", icon: "📊" },
            { num: "11", shortName: "Suivi École 3iL", color: "#4ade80", gradient: "linear-gradient(135deg, #15803d 0%, #22c55e 100%)", bgTint: "rgba(34, 197, 94, 0.08)", border: "rgba(74, 222, 128, 0.35)", glow: "rgba(34, 197, 94, 0.35)", badgeBg: "rgba(21, 128, 61, 0.18)", badgeText: "#4ade80", icon: "🎓" },
            { num: "12", shortName: "Notifications", color: "#facc15", gradient: "linear-gradient(135deg, #ca8a04 0%, #eab308 100%)", bgTint: "rgba(234, 179, 8, 0.08)", border: "rgba(250, 204, 21, 0.35)", glow: "rgba(234, 179, 8, 0.35)", badgeBg: "rgba(202, 138, 4, 0.18)", badgeText: "#fde047", icon: "🔔" }
        ];
        this.treatmentThemes = TREATMENT_THEMES;

        // Render treatment navigation pills
        const pillsContainer = document.getElementById("treatmentsPillsBar");
        if (pillsContainer && APP_DATA.treatments) {
            pillsContainer.innerHTML = APP_DATA.treatments.map((t, idx) => {
                const theme = TREATMENT_THEMES[idx] || TREATMENT_THEMES[0];
                return `
                    <button class="sp-tr-nav-pill ${idx === this.activeTreatmentIdx ? 'active' : ''}"
                            id="tr_nav_pill_${idx}"
                            style="--pill-color: ${theme.color}; --pill-gradient: ${theme.gradient}; --pill-border: ${theme.border}; --pill-glow: ${theme.glow};"
                            onclick="app.selectTreatment(${idx})"
                            title="${t.title}">
                        <span class="sp-pill-num">${theme.num}</span>
                        <span class="sp-pill-icon">${theme.icon}</span>
                        <span class="sp-pill-label">${theme.shortName}</span>
                    </button>
                `;
            }).join("");
        }

        // Render treatment cards with rich color & structured layout
        const treatmentsContainer = document.getElementById("guideTreatmentsList");
        if (treatmentsContainer && APP_DATA.treatments) {
            treatmentsContainer.innerHTML = APP_DATA.treatments.map((t, idx) => {
                const theme = TREATMENT_THEMES[idx] || TREATMENT_THEMES[0];
                return `
                    <div class="sp-treatment-card ${idx === this.activeTreatmentIdx ? 'is-active-treatment' : ''}" 
                         id="treatment_card_${t.id}"
                         data-treatment-idx="${idx}"
                         style="--tr-color: ${theme.color}; --tr-border: ${theme.border}; --tr-bg-tint: ${theme.bgTint}; --tr-glow: ${theme.glow};">
                        
                        <!-- Header héro avec gradient coloré et numéro néon -->
                        <div class="sp-tr-hero-header">
                            <div class="sp-tr-num-badge" style="background: ${theme.gradient}; box-shadow: 0 4px 18px ${theme.glow};">
                                <span class="sp-tr-num-val">${theme.num}</span>
                                <span class="sp-tr-num-icon">${theme.icon}</span>
                            </div>
                            <div class="sp-tr-title-area">
                                <div class="sp-tr-tags-row">
                                    <span class="sp-tr-category-badge" style="background: ${theme.badgeBg}; color: ${theme.badgeText}; border-color: ${theme.border};">
                                        ${theme.icon} ${t.badge}
                                    </span>
                                    <span class="sp-tr-stagepilot-tag">StagePilot 3iL Production</span>
                                </div>
                                <h3 class="sp-tr-card-title">${t.title}</h3>
                                <p class="sp-tr-card-summary">${t.summary}</p>
                            </div>
                        </div>

                        <!-- Algorithme détaillé avec étapes distinctes colorées -->
                        <div class="sp-tr-algo-section">
                            <div class="sp-tr-section-header">
                                <span class="sp-tr-section-icon" style="color: ${theme.color};">⚙️</span>
                                <h4 class="sp-tr-section-heading">Algorithme Métier & Logique d'Exécution</h4>
                                <span class="sp-tr-steps-count" style="background: ${theme.badgeBg}; color: ${theme.badgeText};">${t.algorithm.length} étapes validées</span>
                            </div>
                            <div class="sp-tr-steps-grid">
                                ${t.algorithm.map((stepStr, sIdx) => {
                                    const cleanText = stepStr.replace(/^\d+\.\s*/, "");
                                    const formattedText = cleanText.replace(/`([^`]+)`/g, '<code class="sp-algo-code">$1</code>');
                                    return `
                                        <div class="sp-tr-step-card">
                                            <div class="sp-tr-step-left">
                                                <span class="sp-tr-step-circle" style="background: ${theme.gradient}; box-shadow: 0 2px 8px ${theme.glow};">
                                                    ${sIdx + 1}
                                                </span>
                                            </div>
                                            <div class="sp-tr-step-content">
                                                <span class="sp-tr-step-name" style="color: ${theme.color};">Étape ${sIdx + 1}</span>
                                                <div class="sp-tr-step-text">${formattedText}</div>
                                            </div>
                                        </div>
                                    `;
                                }).join("")}
                            </div>
                        </div>

                        <!-- Bloc de code verbatim avec numérotation de lignes et coloration riche -->
                        <div class="sp-treatment-code-box">
                            <div class="sp-treatment-code-header">
                                <div style="display: flex; align-items: center; gap: 0.65rem;">
                                    <div class="code-window-dots">
                                        <span class="code-dot red"></span>
                                        <span class="code-dot yellow"></span>
                                        <span class="code-dot green"></span>
                                    </div>
                                    <span class="sp-treatment-file-tag">
                                        <span>🐍</span> ${t.keyFiles && t.keyFiles[0] ? t.keyFiles[0] : 'Extrait Python / Django'}
                                    </span>
                                </div>
                                <button class="sp-code-copy-btn" onclick="app.copyTreatmentCode('${t.id}', this)" title="Copier le code">
                                    <span>📋</span> Copier le code Python
                                </button>
                            </div>
                            <div class="sp-code-viewport">
                                <pre class="sp-treatment-code"><code id="code_snippet_${t.id}">${this.formatPythonCode(t.codeSnippet)}</code></pre>
                            </div>
                        </div>

                        <!-- Fichiers clés impliqués avec badges cliquables -->
                        <div class="sp-tr-footer-bar">
                            <span class="sp-tr-footer-label">Fichiers source impliqués :</span>
                            <div class="sp-tr-footer-tags">
                                ${t.keyFiles.map(kf => `
                                    <span class="sp-file-tag" onclick="app.openGuideFile('${kf}')" title="Examiner dans l'arborescence VS Code">
                                        📄 ${kf}
                                    </span>
                                `).join("")}
                            </div>
                        </div>
                    </div>
                `;
            }).join("");

            this.updateTreatmentDisplay();
        }

        // 4. Security Principles
        const secContainer = document.getElementById("guideSecurityList");
        if (secContainer && APP_DATA.security) {
            secContainer.innerHTML = APP_DATA.security.map(sec => `
                <div style="background: rgba(30, 41, 59, 0.7); border: 1px solid #334155; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.25rem;">
                    <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">${sec.icon}</div>
                    <h3 style="font-size: 1.15rem; font-weight: 800; color: white; margin: 0 0 0.5rem 0;">${sec.title}</h3>
                    <p style="font-size: 0.9rem; color: #94a3b8; line-height: 1.6; margin: 0;">${sec.desc}</p>
                </div>
            `).join("");
        }

        // 5. Questions Pièges Oral
        const qContainer = document.getElementById("guideQuestionsList");
        if (qContainer && APP_DATA.oralQuestions) {
            qContainer.innerHTML = APP_DATA.oralQuestions.map(item => `
                <div style="background: rgba(30, 41, 59, 0.7); border: 1px solid #334155; border-left: 4px solid #f59e0b; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.25rem;">
                    <span style="background: rgba(255, 255, 255, 0.1); padding: 0.2rem 0.5rem; border-radius: 6px; font-size: 0.75rem; color: #cbd5e1; font-weight: 600;">${item.category}</span>
                    <h4 style="font-size: 1.1rem; font-weight: 800; color: #fbbf24; margin: 0.5rem 0 0.5rem 0;">
                        ❓ "${item.q}"
                    </h4>
                    <p style="font-size: 0.9rem; color: #f1f5f9; line-height: 1.6; margin: 0;">
                        <strong>Réponse recommandée pour l'examen :</strong> ${item.a}
                    </p>
                </div>
            `).join("");
        }
    }

    selectTreatment(idx) {
        if (!APP_DATA.treatments || idx < 0 || idx >= APP_DATA.treatments.length) return;
        this.activeTreatmentIdx = idx;
        const theme = (this.treatmentThemes && this.treatmentThemes[idx]) || { num: String(idx + 1).padStart(2, "0"), shortName: "Traitement", color: "#38bdf8", border: "#38bdf8" };

        // Update pills
        document.querySelectorAll(".sp-tr-nav-pill").forEach((pill, i) => {
            pill.classList.toggle("active", i === idx);
        });

        // Update current status pill
        const statusBadge = document.getElementById("trCurrentBadge");
        if (statusBadge) {
            statusBadge.innerText = `Traitement ${idx + 1} sur ${APP_DATA.treatments.length} : ${theme.shortName}`;
            statusBadge.style.borderColor = theme.border;
            statusBadge.style.color = theme.color;
        }

        this.updateTreatmentDisplay();
    }

    updateTreatmentDisplay() {
        const container = document.getElementById("guideTreatmentsList");
        if (!container) return;

        const isSingle = this.treatmentViewMode === "single";
        container.classList.toggle("mode-single", isSingle);
        container.classList.toggle("mode-all", !isSingle);

        const cards = container.querySelectorAll(".sp-treatment-card");
        cards.forEach((card, i) => {
            if (isSingle) {
                card.style.display = (i === this.activeTreatmentIdx) ? "block" : "none";
            } else {
                card.style.display = "block";
            }
        });

        if (!isSingle) {
            const activeCard = cards[this.activeTreatmentIdx];
            if (activeCard) {
                activeCard.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }
    }

    prevTreatment() {
        const total = (APP_DATA.treatments || []).length || 12;
        this.activeTreatmentIdx = (this.activeTreatmentIdx - 1 + total) % total;
        this.selectTreatment(this.activeTreatmentIdx);
    }

    nextTreatment() {
        const total = (APP_DATA.treatments || []).length || 12;
        this.activeTreatmentIdx = (this.activeTreatmentIdx + 1) % total;
        this.selectTreatment(this.activeTreatmentIdx);
    }

    setTreatmentViewMode(mode) {
        this.treatmentViewMode = mode;
        const btnSingle = document.getElementById("trViewSingleBtn");
        const btnAll = document.getElementById("trViewAllBtn");
        if (btnSingle) btnSingle.classList.toggle("active", mode === "single");
        if (btnAll) btnAll.classList.toggle("active", mode === "all");
        this.updateTreatmentDisplay();
    }

    formatPythonCode(rawCode) {
        if (!rawCode) return "";
        const lines = rawCode.split("\n");
        return lines.map((line, idx) => {
            const lineNum = String(idx + 1).padStart(2, "0");
            const highlighted = this.highlightPythonLine(line);
            return `<div class="sp-code-line"><span class="sp-code-num">${lineNum}</span><span class="sp-code-content">${highlighted || " "}</span></div>`;
        }).join("");
    }

    highlightPythonLine(line) {
        if (!line) return "";
        const escaped = line
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
        
        const tokenRegex = /(#.*$)|("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(@\w+(?:\.\w+)*)|(\b(?:def|class|return|import|from|with|as|if|elif|else|for|in|try|except|raise|pass|and|or|not)\b)|(\b(?:atomic|select_for_update|transaction|models|objects|filter|aggregate|Count|Q|redirect|render|get_object_or_404|first|save|update|create|exclude|all|values|distinct|order_by)\b)|(\b(?:Utilisateur|AbstractUser|DemandeCompteEcole|ProfilEtudiant|Candidature|Offre|Etablissement|Notification|Canvas|ContentFile|TextChoices|Role|BytesIO|CharField|EmailField|BooleanField|DateTimeField|ForeignKey|Statut|CVPdfError)\b)|(\b(?:True|False|None|\d+)\b)|(\b[a-zA-Z_]\w*(?=\s*\())/g;
        
        return escaped.replace(tokenRegex, (match, comment, str, dec, kw, orm, cls, numBool, fn) => {
            if (comment) return `<span class="code-comment">${comment}</span>`;
            if (str) return `<span class="code-str">${str}</span>`;
            if (dec) return `<span class="code-decorator">${dec}</span>`;
            if (kw) return `<span class="code-kw">${kw}</span>`;
            if (orm) return `<span class="code-orm">${orm}</span>`;
            if (cls) return `<span class="code-class">${cls}</span>`;
            if (numBool) return `<span class="code-num">${numBool}</span>`;
            if (fn) return `<span class="code-fn">${fn}</span>`;
            return match;
        });
    }

    toggleGuideFolder(folderId) {
        const children = document.getElementById(`children_${folderId}`);
        const caret = document.getElementById(`caret_${folderId}`);
        const icon = document.getElementById(`ficon_${folderId}`);
        if (!children) return;
        const isHidden = children.style.display === "none";
        children.style.display = isHidden ? "block" : "none";
        if (caret) caret.innerText = isHidden ? "▾" : "▸";
        if (icon) icon.innerText = isHidden ? "📂" : "📁";
    }

    expandAllTreeFolders() {
        document.querySelectorAll(".vscode-folder-children").forEach(el => el.style.display = "block");
        document.querySelectorAll(".vscode-caret").forEach(el => el.innerText = "▾");
        document.querySelectorAll(".vscode-folder-icon").forEach(el => el.innerText = "📂");
    }

    collapseAllTreeFolders() {
        document.querySelectorAll(".vscode-folder-children").forEach(el => el.style.display = "none");
        document.querySelectorAll(".vscode-caret").forEach(el => el.innerText = "▸");
        document.querySelectorAll(".vscode-folder-icon").forEach(el => el.innerText = "📁");
    }

    selectTreeFile(filePath) {
        document.querySelectorAll(".vscode-file-row").forEach(row => {
            row.classList.toggle("is-active-file", row.getAttribute("data-file-path") === filePath);
        });

        // Find file data in flat files or folders
        let fileData = (APP_DATA.files || []).find(f => f.path === filePath);
        if (!fileData && APP_DATA.projectFolders) {
            for (const f of APP_DATA.projectFolders) {
                const found = f.files.find(item => item.path === filePath);
                if (found) { fileData = found; break; }
            }
        }
        if (!fileData) return;

        const panel = document.getElementById("treeFilePreviewPanel");
        if (!panel) return;

        panel.style.display = "block";
        panel.innerHTML = `
            <div class="file-preview-card">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                    <div>
                        <span style="font-size: 0.72rem; background: rgba(99, 102, 241, 0.2); color: #a5b4fc; padding: 0.2rem 0.6rem; border-radius: 9999px; font-weight: 700; text-transform: uppercase;">
                            ${fileData.category || 'Module StagePilot'}
                        </span>
                        <h3 style="font-size: 1.15rem; font-weight: 800; color: #ffffff; margin: 0.4rem 0 0 0; font-family: 'JetBrains Mono', monospace;">
                            📄 ${fileData.path}
                        </h3>
                    </div>
                    <button class="sp-preview-close" onclick="app.closeTreeFilePreview()" title="Fermer">×</button>
                </div>

                <div style="background: rgba(245, 158, 11, 0.12); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 8px; padding: 0.75rem 1rem; margin-bottom: 0.85rem;">
                    <div style="font-size: 0.82rem; font-weight: 800; color: #fbbf24; margin-bottom: 0.25rem;">
                        💡 Analogie de la Vie Réelle : "${fileData.analogy}"
                    </div>
                    <div style="font-size: 0.85rem; color: #fde68a; line-height: 1.5;">
                        ${fileData.analogyDesc || fileData.desc}
                    </div>
                </div>

                <div style="font-size: 0.88rem; color: #cbd5e1; line-height: 1.6; margin-bottom: 0.75rem;">
                    <strong style="color: #93c5fd;">Rôle technique :</strong> ${fileData.desc}
                </div>

                ${fileData.keySymbols ? `
                    <div style="font-size: 0.82rem; color: #94a3b8; background: #0b1120; padding: 0.6rem 0.8rem; border-radius: 6px; border: 1px solid rgba(255,255,255,0.06); font-family: 'JetBrains Mono', monospace; margin-bottom: 0.75rem;">
                        <span style="color: #64748b;">Fonctions / Symboles clés :</span> <span style="color: #34d399;">${fileData.keySymbols}</span>
                    </div>
                ` : ''}

                <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem;">
                    <button class="sp-tree-action-btn" onclick="navigator.clipboard.writeText('${fileData.path}'); app.showToast('Chemin copié dans le presse-papier !');">
                        📋 Copier le chemin
                    </button>
                </div>
            </div>
        `;
        panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    closeTreeFilePreview() {
        const panel = document.getElementById("treeFilePreviewPanel");
        if (panel) panel.style.display = "none";
        document.querySelectorAll(".vscode-file-row").forEach(row => row.classList.remove("is-active-file"));
    }

    copyTreatmentCode(treatmentId, btn) {
        const t = (APP_DATA.treatments || []).find(item => item.id === treatmentId);
        if (!t || !t.codeSnippet) return;
        navigator.clipboard.writeText(t.codeSnippet);
        const originalText = btn.innerHTML;
        btn.innerHTML = "✅ Copié !";
        btn.style.borderColor = "#10b981";
        btn.style.color = "#34d399";
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.borderColor = "";
            btn.style.color = "";
        }, 2000);
    }

    openGuideFile(filePath) {
        this.switchGuideTab("tree");
        this.selectTreeFile(filePath);
    }

    filterTree(query) {
        const q = (query || "").toLowerCase().trim();
        const folderNodes = document.querySelectorAll(".vscode-folder-node");
        const fileRows = document.querySelectorAll(".vscode-file-row");
        const countBadge = document.getElementById("treeFileCount");

        if (!q) {
            folderNodes.forEach(f => f.style.display = "block");
            fileRows.forEach(r => r.style.display = "flex");
            if (countBadge) countBadge.innerText = `${fileRows.length} fichiers documentés`;
            return;
        }

        let visibleFiles = 0;
        folderNodes.forEach(folder => {
            const childrenContainer = folder.querySelector(".vscode-folder-children");
            const files = folder.querySelectorAll(".vscode-file-row");
            let folderMatches = false;

            files.forEach(row => {
                const searchText = row.getAttribute("data-search-text") || "";
                if (searchText.includes(q)) {
                    row.style.display = "flex";
                    folderMatches = true;
                    visibleFiles++;
                } else {
                    row.style.display = "none";
                }
            });

            if (folderMatches) {
                folder.style.display = "block";
                if (childrenContainer) childrenContainer.style.display = "block";
                const caret = folder.querySelector(".vscode-caret");
                if (caret) caret.innerText = "▾";
                const icon = folder.querySelector(".vscode-folder-icon");
                if (icon) icon.innerText = "📂";
            } else {
                folder.style.display = "none";
            }
        });

        if (countBadge) countBadge.innerText = `${visibleFiles} fichier(s) trouvé(s)`;
    }

    openSearch() {
        const modal = document.getElementById("searchModalOverlay");
        const input = document.getElementById("globalSearchInput");
        if (modal && input) {
            modal.style.display = "flex";
            input.value = "";
            input.focus();
            this.performSearch("");
        }
    }

    closeSearch() {
        const modal = document.getElementById("searchModalOverlay");
        if (modal) modal.style.display = "none";
    }

    performSearch(query) {
        const container = document.getElementById("searchResultsContainer");
        if (!container) return;

        const q = query.toLowerCase().trim();
        const results = [];

        Object.values(APP_DATA.elements).forEach(el => {
            if (!q || el.title.toLowerCase().includes(q) || el.urlName.toLowerCase().includes(q) || el.viewHandler.toLowerCase().includes(q)) {
                results.push({
                    type: "Bouton / Élément",
                    title: el.title,
                    sub: `${el.template} · ${el.viewHandler}`,
                    action: () => {
                        this.closeSearch();
                        this.closeGuide();
                        this.inspectElement(el.id);
                    }
                });
            }
        });

        APP_DATA.files.forEach(f => {
            if (!q || f.path.toLowerCase().includes(q) || f.analogy.toLowerCase().includes(q)) {
                results.push({
                    type: "Fichier & Analogie",
                    title: f.path,
                    sub: `💡 ${f.analogy} — ${f.desc}`,
                    action: () => {
                        this.closeSearch();
                        this.openGuide();
                        this.switchGuideTab("tree");
                    }
                });
            }
        });

        if (results.length === 0) {
            container.innerHTML = `<div style="padding: 1.5rem; text-align: center; color: #94a3b8;">Aucun résultat pour « ${query} ».</div>`;
            return;
        }

        container.innerHTML = results.slice(0, 10).map((r, i) => `
            <div style="padding: 0.75rem 1rem; border-radius: 8px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05);" onclick="window.app.executeSearch(${i})">
                <div>
                    <span style="font-size: 0.7rem; font-weight: 700; color: #38bdf8; text-transform: uppercase;">${r.type}</span>
                    <h5 style="font-size: 0.95rem; font-weight: 700; margin: 0.1rem 0; color: white;">${r.title}</h5>
                    <p style="font-size: 0.8rem; color: #94a3b8; margin: 0;">${r.sub}</p>
                </div>
                <span style="color: #64748b;">↵</span>
            </div>
        `).join("");

        this.currentResults = results;
    }

    executeSearch(idx) {
        if (this.currentResults && this.currentResults[idx]) {
            this.currentResults[idx].action();
        }
    }

    // =========================================================================
    // LIVE REQUEST JOURNEY & GOLDEN ACTIVITY TREE SIMULATOR (UML / 3iL)
    // =========================================================================

    openJourney(scenarioKey = null) {
        this.journeyOpen = true;
        this.hideTooltip();
        this.closeDrawer();
        this.closeSearch();

        const modal = document.getElementById("requestJourneyModal");
        if (modal) {
            modal.style.display = "flex";
            modal.classList.add("is-open");
            modal.scrollTop = 0;

            if (scenarioKey) {
                this.startSimulation(scenarioKey);
            } else if (this.simulationScreenMode === "simulation" && this.currentJourneyScenario) {
                this.startSimulation(this.currentJourneyScenario);
            } else {
                this.showSimulationCatalog();
            }
        }
    }

    closeJourney() {
        this.journeyOpen = false;
        this.pauseJourney();
        this.closeStepModal();
        this.hideSimulationHUD();
        const modal = document.getElementById("requestJourneyModal");
        if (modal) {
            modal.style.display = "none";
            modal.classList.remove("is-open");
        }
    }

    showSimulationCatalog() {
        this.pauseJourney();
        this.simulationScreenMode = "catalog";
        const catScreen = document.getElementById("journeyCatalogScreen");
        const simScreen = document.getElementById("journeySimulationScreen");
        const btnCat = document.getElementById("btnShowCatalog");

        if (catScreen) catScreen.style.display = "block";
        if (simScreen) simScreen.style.display = "none";
        if (btnCat) btnCat.classList.add("active");

        this.renderSimulationCatalog();
    }

    startSimulation(scenarioKey) {
        this.pauseJourney();
        this.currentJourneyScenario = scenarioKey || "confirmer_stage";
        this.simulationScreenMode = "simulation";
        this.journeyCurrentStep = 0;

        const catScreen = document.getElementById("journeyCatalogScreen");
        const simScreen = document.getElementById("journeySimulationScreen");
        const btnCat = document.getElementById("btnShowCatalog");

        if (catScreen) catScreen.style.display = "none";
        if (simScreen) simScreen.style.display = "flex";
        if (btnCat) btnCat.classList.remove("active");

        this.setSimulationViewMode(this.simulationViewMode || "tree");
        this.renderGoldenTree();
        this.renderJourneyNodes(); // Keep linear track synced as fallback
        this.updateSimulationHUD();
    }

    setSimulationViewMode(mode) {
        this.simulationViewMode = mode;
        const treeCanvasWrap = document.getElementById("goldenTreeCanvasWrapper");
        const linearWrap = document.getElementById("linearPipelineWrapper");
        const btnTree = document.getElementById("btnViewTreeMode");
        const btnLinear = document.getElementById("btnViewPipelineMode");

        if (treeCanvasWrap) treeCanvasWrap.style.display = mode === "tree" ? "flex" : "none";
        if (linearWrap) linearWrap.style.display = mode === "pipeline" ? "block" : "none";

        if (btnTree) btnTree.classList.toggle("active", mode === "tree");
        if (btnLinear) btnLinear.classList.toggle("active", mode === "pipeline");
    }

    renderSimulationCatalog() {
        const grid = document.getElementById("journeyCatalogGrid");
        const trees = window.SIMULATION_TREES || (typeof APP_DATA !== "undefined" && APP_DATA.simulationTrees) || {};
        const flows = Object.values(trees);

        if (grid && flows.length > 0) {
            grid.innerHTML = flows.map(tree => {
                const isPost = (tree.method || "POST").toUpperCase() === "POST";
                return `
                    <div class="golden-scenario-card" onclick="window.app.startSimulation('${tree.id}')">
                        <div>
                            <div class="gsc-top">
                                <div class="gsc-icon">${tree.icon || '⚡'}</div>
                                <div class="gsc-badges">
                                    <span class="sp-method-badge ${isPost ? 'is-post' : ''}">${tree.method || 'POST'}</span>
                                    <span class="sp-flow-badge-tag">${tree.badge}</span>
                                </div>
                            </div>
                            <h3 class="gsc-title">${tree.title}</h3>
                            <div class="gsc-endpoint">${tree.endpoint}</div>
                            <p class="gsc-desc">${tree.desc}</p>
                        </div>

                        <div>
                            <div class="gsc-metrics">
                                <div class="gsc-metric-item">
                                    <div class="gsc-metric-val">${tree.metrics?.steps || tree.nodes?.length || 8}</div>
                                    <div class="gsc-metric-lbl">Étapes</div>
                                </div>
                                <div class="gsc-metric-item">
                                    <div class="gsc-metric-val">${tree.metrics?.decisions || 2} IF/ELSE</div>
                                    <div class="gsc-metric-lbl">Tests Logiciels</div>
                                </div>
                                <div class="gsc-metric-item">
                                    <div class="gsc-metric-val">${tree.metrics?.latency || '95 ms'}</div>
                                    <div class="gsc-metric-lbl">Latence</div>
                                </div>
                            </div>
                            <button class="gsc-btn-launch">
                                <span>⚡</span> Lancer la Simulation ➔
                            </button>
                        </div>
                    </div>
                `;
            }).join("");
        }

        // Also render overview cards in the Guide tab if present
        const guideOverview = document.getElementById("guideSimulationOverviewCards");
        if (guideOverview && flows.length > 0) {
            guideOverview.innerHTML = `
                <div class="golden-catalog-grid">
                    ${flows.map(tree => `
                        <div class="golden-scenario-card" onclick="window.app.openJourney('${tree.id}')">
                            <div class="gsc-top">
                                <div class="gsc-icon">${tree.icon || '⚡'}</div>
                                <div class="gsc-badges">
                                    <span class="sp-method-badge ${(tree.method || 'POST') === 'POST' ? 'is-post' : ''}">${tree.method}</span>
                                    <span class="sp-flow-badge-tag">${tree.badge}</span>
                                </div>
                            </div>
                            <h3 class="gsc-title">${tree.title}</h3>
                            <div class="gsc-endpoint">${tree.endpoint}</div>
                            <p class="gsc-desc">${tree.desc}</p>
                            <button class="gsc-btn-launch" style="margin-top: 1rem;">
                                <span>⚡</span> Simuler cet Arbre Doré ➔
                            </button>
                        </div>
                    `).join("")}
                </div>
            `;
        }
    }

    renderGoldenTree() {
        const canvas = document.getElementById("goldenTreeCanvas");
        if (!canvas) return;

        const trees = window.SIMULATION_TREES || (typeof APP_DATA !== "undefined" && APP_DATA.simulationTrees) || {};
        const treeData = trees[this.currentJourneyScenario] || trees["confirmer_stage"];
        if (!treeData || !treeData.nodes) return;

        const nodes = treeData.nodes;
        let html = `
            <!-- DÉFINITIONS SVG DES DÉGRADÉS DORÉS ET LUEURS -->
            <svg style="position: absolute; width: 0; height: 0; pointer-events: none;" aria-hidden="true">
                <defs>
                    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="#f59e0b" />
                        <stop offset="100%" stop-color="#fbbf24" />
                    </linearGradient>
                    <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>
            </svg>

            <!-- RACINE DU FLUX -->
            <div class="tree-root-anchor">
                <span>🌱</span> POINT D'ENTRÉE · REQUÊTE CLIENT WEB
            </div>
            <div class="golden-stem-connector ${this.journeyCurrentStep >= 0 ? (this.journeyCurrentStep === 0 ? 'is-active' : 'is-completed') : ''}">
                <div class="stem-sap-droplet"></div>
            </div>
        `;

        nodes.forEach((node, idx) => {
            const isCompleted = idx < this.journeyCurrentStep;
            const isActive = idx === this.journeyCurrentStep;
            let statusClass = isActive ? "is-active" : (isCompleted ? "is-completed" : "");

            // Tronc vertical continu entre étapes (Toujours tracé, s'illumine en or au passage)
            if (idx > 0) {
                let stemClass = "";
                if (idx === this.journeyCurrentStep) {
                    stemClass = "is-active";
                } else if (idx < this.journeyCurrentStep) {
                    stemClass = "is-completed";
                }
                html += `
                    <div class="golden-stem-connector ${stemClass}">
                        <div class="stem-sap-droplet"></div>
                    </div>
                `;
            }

            if (node.type === "decision") {
                // EMBRANCHEMENT ARBORESCENT (IF / ELSE) : DIVERGENCE EN DEUX BRANCHES
                const isDecisionReached = isCompleted || isActive;
                html += `
                    <div class="golden-decision-wrapper">
                        <!-- NŒUD CENTRAL : TEST CONDITIONNEL -->
                        <div class="golden-diamond-card ${statusClass}" 
                             id="gt_node_${node.id}"
                             onclick="window.app.openStepModalById('${node.id}')"
                             onmouseenter="window.app.showSimulationHUD(event, '${node.id}')"
                             onmouseleave="window.app.hideSimulationHUD()"
                             title="Cliquez pour inspecter la condition IF/ELSE">
                            <div class="diamond-cond-label">🔶 TEST CONDITIONNEL IF / ELSE</div>
                            <div class="diamond-formula">${node.condition || 'condition == true'}</div>
                            <div style="font-size: 0.8rem; color: #f8fafc; margin-top: 0.4rem; font-weight: 700;">
                                ${node.title}
                            </div>
                        </div>

                        <!-- LIGNES DE BRANCHES SVG (Divergence fluide vers Gauche & Droite) -->
                        <svg class="tree-branch-svg" viewBox="0 0 1000 80" preserveAspectRatio="none">
                            <!-- Branche Gauche : SI VRAI (Centre 250) -->
                            <path class="branch-line-track" d="M 500 0 C 500 40, 250 40, 250 80" />
                            ${isDecisionReached ? `<path class="branch-line-gold" d="M 500 0 C 500 40, 250 40, 250 80" />` : ''}

                            <!-- Branche Droite : SI FAUX / REJET (Centre 750) -->
                            <path class="branch-line-track" d="M 500 0 C 500 40, 750 40, 750 80" />
                            <path class="branch-line-ruby" d="M 500 0 C 500 40, 750 40, 750 80" />
                        </svg>

                        <!-- LES DEUX CARTES SLICK AVEC BORDER-RADIUS PARFAIT -->
                        <div class="golden-branches-split">
                            <!-- Branche Nominale : SI VRAI / MATCH [TRUE] -->
                            <div class="branch-path">
                                <div class="tree-branch-card card-true ${isDecisionReached ? 'is-traversed' : ''}"
                                     onclick="window.app.openStepModalById('${node.id}')"
                                     onmouseenter="window.app.showSimulationHUD(event, '${node.id}')"
                                     onmouseleave="window.app.hideSimulationHUD()"
                                     title="Cliquez pour inspecter la validation de cette condition">
                                    <div class="tbc-header">
                                        <span class="branch-pill pill-true">${node.branchIf?.label || '✓ SI VRAI (TRUE)'}</span>
                                        <span class="tbc-status-tag tag-success">Condition Conforme</span>
                                    </div>
                                    <h5 class="tbc-title">✅ ${node.title} — Validation</h5>
                                    <p class="tbc-desc">${node.branchIf?.desc || 'Critères techniques et cryptographiques validés. Poursuite sur le tronc nominal.'}</p>
                                    <div class="tbc-footer">
                                        <span class="tbc-route-label">🍃 Branche Nominale</span>
                                        <span class="tbc-badge-latency">⚡ Continu</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Branche d'Échec : SI FAUX / REJET [ELSE] -->
                            <div class="branch-path">
                                <div class="tree-branch-card card-false"
                                     onclick="window.app.openStepModalById('${node.id}')"
                                     onmouseenter="window.app.showSimulationHUD(event, '${node.id}')"
                                     onmouseleave="window.app.hideSimulationHUD()"
                                     title="Cliquez pour inspecter l'interception de sécurité">
                                    <div class="tbc-header">
                                        <span class="branch-pill pill-false">${node.branchElse?.label || '✗ SI FAUX (ELSE)'}</span>
                                        <span class="tbc-status-tag tag-ruby">Rejet Sécurité</span>
                                    </div>
                                    <h5 class="tbc-title ruby-title">🛑 ${node.elseNode?.title || 'Rejet Sécurité'}</h5>
                                    <p class="tbc-desc ruby-desc">${node.elseNode?.desc || node.branchElse?.desc || "Blocage préventif immédiat. Aucune écriture en base n'est autorisée."}</p>
                                    <div class="tbc-footer">
                                        <span class="tbc-route-label" style="color: #f87171;">🍂 Interception de Sécurité</span>
                                        <span class="tbc-badge-latency tag-ruby-pill">Interrompu</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- LIGNES DE RECONVERGENCE SVG (Retour de [SI VRAI] vers le tronc central) -->
                        <svg class="tree-branch-svg" viewBox="0 0 1000 80" preserveAspectRatio="none">
                            <!-- Branche Gauche retournant au tronc central (500, 80) -->
                            <path class="branch-line-track" d="M 250 0 C 250 40, 500 40, 500 80" />
                            ${isCompleted ? `<path class="branch-line-gold" d="M 250 0 C 250 40, 500 40, 500 80" />` : ''}

                            <!-- Branche Droite terminée (Interception finale fermée) -->
                            <path class="branch-line-ruby" d="M 750 0 L 750 45" stroke-dasharray="4,4" />
                            <circle cx="750" cy="52" r="6" fill="#ef4444" />
                        </svg>
                    </div>
                `;
            } else if (node.type === "fork") {
                // EMBRANCHEMENT CONCOMITANT (FORK / JOIN) : PARALLÉLISME À 3 BRANCHES SIMULTANÉES
                const parallelTasks = node.parallelTasks || [];
                const isForkReached = isCompleted || isActive;

                // Fonction de détection du profil métier de la branche (SQL, École / Alerte, Cloud Storage)
                const getTaskNatureClass = (task, pIdx) => {
                    const text = ((task.badge || '') + ' ' + (task.title || '') + ' ' + (task.desc || '')).toLowerCase();
                    if (text.includes('école') || text.includes('ecole') || text.includes('notif') || text.includes('alerte') || text.includes('statut') || text.includes('cloche') || text.includes('badging')) {
                        return 'card-nature-school';
                    } else if (text.includes('storage') || text.includes('supabase') || text.includes('cloud') || text.includes('quota') || text.includes('pdf')) {
                        return 'card-nature-storage';
                    } else {
                        return 'card-nature-sql';
                    }
                };

                html += `
                    <div class="golden-fork-wrapper">
                        <!-- BARRE DE DISTRIBUTION DES TÂCHES PARALLÈLES -->
                        <div class="golden-fork-bar ${isActive ? 'is-active' : (isCompleted ? 'is-completed' : '')}">
                            <span>⚡</span> TRAITEMENTS SIMULTANÉS & CONCOMITANTS EN BASE (FORK)
                        </div>

                        <!-- LIGNES SVG DIVERGENTES (1 tronc vers 3 branches concomitantes) -->
                        <svg class="tree-branch-svg" viewBox="0 0 1000 80" preserveAspectRatio="none">
                            <path class="branch-line-track" d="M 500 0 C 500 40, 161 40, 161 80" />
                            <path class="branch-line-track" d="M 500 0 C 499.9 40, 500.1 40, 500 80" />
                            <path class="branch-line-track" d="M 500 0 C 500 40, 839 40, 839 80" />

                            ${isForkReached ? `
                                <path class="branch-line-gold" d="M 500 0 C 500 40, 161 40, 161 80" />
                                <path class="branch-line-gold" d="M 500 0 C 499.9 40, 500.1 40, 500 80" />
                                <path class="branch-line-gold" d="M 500 0 C 500 40, 839 40, 839 80" />
                            ` : ''}
                        </svg>

                        <!-- GRILLE DES 3 BRANCHES PARALLÈLES (TOUTES COLORÉES ET ACTIVES SIMULTANÉMENT) -->
                        <div class="golden-fork-grid">
                            ${parallelTasks.map((task, pIdx) => {
                                const natureClass = getTaskNatureClass(task, pIdx);
                                const cardStatusClass = isActive ? 'is-active is-simultaneous-running' : (isCompleted ? 'is-completed' : '');
                                let pillHtml = '';
                                if (isActive) {
                                    pillHtml = `<span class="gpc-simultaneous-pill pill-running">⚡ EXÉCUTION SIMULTANÉE CONCOMITANTE</span>`;
                                } else if (isCompleted) {
                                    pillHtml = `<span class="gpc-simultaneous-pill pill-done">✓ MUTATION CONCOMITANTE VALIDÉE</span>`;
                                } else {
                                    pillHtml = `<span class="gpc-simultaneous-pill pill-idle">⏳ En attente de convergence</span>`;
                                }

                                return `
                                    <div class="golden-parallel-card ${natureClass} ${cardStatusClass}"
                                         onclick="window.app.openStepModalById('${node.id}', ${pIdx})"
                                         onmouseenter="window.app.showSimulationHUD(event, '${node.id}', ${pIdx})"
                                         onmouseleave="window.app.hideSimulationHUD()"
                                         title="Cliquez pour inspecter ce traitement parallèle (${task.badge || 'Branche ' + (pIdx + 1)})">
                                        <div>
                                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                                                <span class="gpc-badge">${task.badge || `Branche ${pIdx + 1}`}</span>
                                                <span style="font-size: 0.68rem; color: #94a3b8; font-family: 'JetBrains Mono', monospace;">${task.sql ? 'PostgreSQL' : 'Service Cloud'}</span>
                                            </div>
                                            <h5 class="gpc-title">${task.title}</h5>
                                            <p class="gpc-desc">${task.desc}</p>
                                            ${task.sql ? `
                                                <div class="gpc-sql-snippet">
                                                    <span class="gpc-sql-tag">SQL MUTATION</span>
                                                    <code>${task.sql}</code>
                                                </div>
                                            ` : (task.code ? `
                                                <div class="gpc-sql-snippet code-snippet">
                                                    <span class="gpc-sql-tag code-tag">PYTHON ORM</span>
                                                    <code>${task.code.split('\n')[0]}</code>
                                                </div>
                                            ` : '')}
                                        </div>
                                        ${pillHtml}
                                    </div>
                                `;
                            }).join("")}
                        </div>

                        <!-- LIGNES SVG CONVERGENTES (3 branches vers 1 barre Join) -->
                        <svg class="tree-branch-svg" viewBox="0 0 1000 80" preserveAspectRatio="none">
                            <path class="branch-line-track" d="M 161 0 C 161 40, 500 40, 500 80" />
                            <path class="branch-line-track" d="M 500 0 C 499.9 40, 500.1 40, 500 80" />
                            <path class="branch-line-track" d="M 839 0 C 839 40, 500 40, 500 80" />

                            ${isCompleted ? `
                                <path class="branch-line-gold" d="M 161 0 C 161 40, 500 40, 500 80" />
                                <path class="branch-line-gold" d="M 500 0 C 499.9 40, 500.1 40, 500 80" />
                                <path class="branch-line-gold" d="M 839 0 C 839 40, 500 40, 500 80" />
                            ` : ''}
                        </svg>

                        <!-- BARRE DE CONVERGENCE TRANSACTIONNELLE -->
                        <div class="golden-join-bar ${isCompleted ? 'is-completed' : ''}">
                            <span>🔒</span> CONVERGENCE TRANSACTIONNELLE & COMMIT SQL (JOIN)
                        </div>
                    </div>
                `;
            } else {
                // ÉTAPE STANDARD (Start, Action, Persistence, End)
                html += `
                    <div class="gt-node ${statusClass}" 
                         id="gt_node_${node.id}"
                         onclick="window.app.openStepModalById('${node.id}')"
                         onmouseenter="window.app.showSimulationHUD(event, '${node.id}')"
                         onmouseleave="window.app.hideSimulationHUD()"
                         title="Cliquer pour ouvrir les détails de l'étape">
                        <div class="gt-node-header">
                            <span class="gt-node-step-tag">ÉTAPE ${node.stepNum || idx + 1}/${nodes.length}</span>
                            <span class="gt-node-layer">${node.layer || 'Couche Applicative'}</span>
                            <span class="gt-node-latency">⚡ ${node.latency || '1 ms'}</span>
                        </div>
                        <div class="gt-node-body">
                            <div class="gt-node-icon" style="color: ${node.natureColor || '#38bdf8'};">${node.icon || '⚙️'}</div>
                            <div class="gt-node-content">
                                <h4 class="gt-node-title">${node.title}</h4>
                                <div class="gt-node-subtitle">${node.subtitle || node.whatHappened || ''}</div>
                                <div class="gt-node-file">📄 ${node.file || 'source.py'}</div>
                            </div>
                        </div>
                    </div>
                `;
            }
        });

        // Ancrage terminal quand la simulation est complète
        const isTerminalCompleted = this.journeyCurrentStep >= nodes.length - 1;
        const isTerminalActive = this.journeyCurrentStep === nodes.length - 1;
        html += `
            <div class="golden-stem-connector ${isTerminalCompleted ? 'is-completed' : (isTerminalActive ? 'is-active' : '')}">
                <div class="stem-sap-droplet"></div>
            </div>
            <div class="tree-terminal-anchor ${isTerminalCompleted ? 'is-completed' : ''}">
                <span>🏁</span> CYCLE D'EXÉCUTION TERMINÉ · RÉPONSE LIVRÉE
            </div>
        `;

        canvas.innerHTML = html;
        canvas.style.transform = `scale(${this.treeZoomLevel || 1.0})`;

        // Auto-scroll active node smoothly into view if running and at normal/close zoom
        const activeNode = nodes[this.journeyCurrentStep];
        if (activeNode && (this.treeZoomLevel || 1.0) > 0.75) {
            const activeEl = document.getElementById(`gt_node_${activeNode.id}`);
            if (activeEl) {
                activeEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
        }
    }

    updateSimulationHUD() {
        const trees = window.SIMULATION_TREES || (typeof APP_DATA !== "undefined" && APP_DATA.simulationTrees) || {};
        const tree = trees[this.currentJourneyScenario] || trees["confirmer_stage"];
        if (!tree) return;

        const nodes = tree.nodes || [];
        const activeNode = nodes[this.journeyCurrentStep] || nodes[0];

        const methodEl = document.getElementById("journeyActiveMethod");
        const endpointEl = document.getElementById("journeyActiveEndpoint");
        const titleEl = document.getElementById("journeyActiveTitle");
        const counterPill = document.getElementById("journeyStepCounterPill");

        if (methodEl) {
            const isPost = (tree.method || "POST").toUpperCase() === "POST";
            methodEl.innerText = tree.method || "POST";
            methodEl.className = `sp-method-badge ${isPost ? 'is-post' : ''}`;
        }
        if (endpointEl) endpointEl.innerText = tree.endpoint || "";
        if (titleEl) titleEl.innerText = tree.title || "";
        if (counterPill && activeNode) {
            counterPill.innerText = `Étape ${this.journeyCurrentStep + 1} / ${nodes.length} • ${activeNode.icon || ''} ${activeNode.title}`;
        }
    }

    showSimulationHUD(event, nodeId, taskIndex = null) {
        const tooltip = document.getElementById("simulationHUDTooltip");
        if (!tooltip) return;

        const trees = window.SIMULATION_TREES || (typeof APP_DATA !== "undefined" && APP_DATA.simulationTrees) || {};
        const tree = trees[this.currentJourneyScenario] || trees["confirmer_stage"];
        if (!tree || !tree.nodes) return;

        const node = tree.nodes.find(n => n.id === nodeId);
        if (!node) return;

        const isTask = (taskIndex !== null && taskIndex !== undefined && node.parallelTasks && node.parallelTasks[taskIndex]);
        const target = isTask ? node.parallelTasks[taskIndex] : node;

        const analogy = target.humanAnalogy || {
            title: isTask ? `Branche ${taskIndex + 1} : Action Coordonnée` : (target.title || "Étape Système"),
            analogy: "Traitement interne garantissant la cohérence des opérations et la synchronisation des données.",
            realImpact: "Assure que l'action s'exécute de manière fiable et sécurisée."
        };

        tooltip.innerHTML = `
            <div class="ght-header-row">
                <span class="ght-badge">💡 ANALOGIE DE LA VIE RÉELLE</span>
                <span class="ght-step-tag">${isTask ? '⚡ BRANCHE ' + (taskIndex + 1) : ('ÉTAPE ' + (node.stepNum || (tree.nodes.indexOf(node) + 1)))}</span>
            </div>
            <div class="ght-analogy-title">🚗 ${analogy.title}</div>
            <div class="ght-analogy-body">
                <div class="ght-analogy-quote">« ${analogy.analogy} »</div>
            </div>
            <div class="ght-impact-box">
                <span class="ght-impact-icon">🎯</span>
                <div class="ght-impact-text"><strong>Impact concret :</strong> ${analogy.realImpact}</div>
            </div>
            <div class="ght-action-hint">
                <span>👆 Cliquez pour inspecter le Pourquoi, Comment, Code & SQL</span>
            </div>
        `;

        tooltip.style.display = "block";
        const tooltipWidth = 400;
        const tooltipHeight = 240;
        let x = event.clientX + 16;
        let y = event.clientY + 16;
        if (x + tooltipWidth > window.innerWidth - 16) {
            x = Math.max(10, event.clientX - tooltipWidth - 16);
        }
        if (y + tooltipHeight > window.innerHeight - 16) {
            y = Math.max(10, event.clientY - tooltipHeight - 16);
        }
        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y}px`;
    }

    hideSimulationHUD() {
        const tooltip = document.getElementById("simulationHUDTooltip");
        if (tooltip) tooltip.style.display = "none";
    }

    openStepModalById(nodeId, taskIndex = null) {
        this.hideSimulationHUD();
        const trees = window.SIMULATION_TREES || (typeof APP_DATA !== "undefined" && APP_DATA.simulationTrees) || {};
        const tree = trees[this.currentJourneyScenario] || trees["confirmer_stage"];
        if (!tree || !tree.nodes) return;

        const node = tree.nodes.find(n => n.id === nodeId) || tree.nodes[0];
        if (!node) return;

        this.activeModalNodeId = node.id;
        const nodeIdx = tree.nodes.findIndex(n => n.id === node.id);
        if (nodeIdx !== -1) {
            this.journeyCurrentStep = nodeIdx;
            this.renderGoldenTree();
            this.renderJourneyNodes();
            this.updateSimulationHUD();
        }

        // Populate Modal Fields
        const modal = document.getElementById("simStepModal");
        const backdrop = document.getElementById("simStepModalBackdrop");
        if (!modal || !backdrop) return;

        const natureBadge = document.getElementById("gsmNatureBadge");
        const titleEl = document.getElementById("gsmTitle");
        const subtitleEl = document.getElementById("gsmSubtitle");
        const latencyEl = document.getElementById("gsmLatency");
        const fromFileEl = document.getElementById("gsmFromFile");
        const toFileEl = document.getElementById("gsmToFile");
        const fileLocEl = document.getElementById("gsmFileLocText");
        const whatEl = document.getElementById("gsmWhatHappened");
        const whyEl = document.getElementById("gsmWhyText");
        const howEl = document.getElementById("gsmHowText");
        const whenEl = document.getElementById("gsmWhenText");
        const techEl = document.getElementById("gsmTechChips");
        const stateEl = document.getElementById("gsmStateChange");
        const payloadEl = document.getElementById("gsmPayload");
        const pythonEl = document.getElementById("gsmPythonCode");
        const sqlEl = document.getElementById("gsmSqlCode");
        const sqlSec = document.getElementById("gsmSqlSection");
        const oralTipEl = document.getElementById("gsmOralTip");
        const critReasonEl = document.getElementById("gsmCriticalReason");

        const isTask = (taskIndex !== null && taskIndex !== undefined && node.parallelTasks && node.parallelTasks[taskIndex]);
        const task = isTask ? node.parallelTasks[taskIndex] : null;
        const target = task || node;

        if (natureBadge) {
            if (task) {
                natureBadge.innerHTML = `<span>⚡</span> ${task.badge || 'BRANCHE PARALLÈLE'}`;
                natureBadge.style.color = '#34d399';
                natureBadge.style.borderColor = 'rgba(52, 211, 153, 0.45)';
                natureBadge.style.background = 'rgba(16, 185, 129, 0.18)';
            } else {
                natureBadge.innerHTML = `<span>${node.icon || '⚙️'}</span> ${node.natureLabel || node.nature || 'TRAITEMENT'}`;
                natureBadge.style.color = node.natureColor || '#fbbf24';
                natureBadge.style.borderColor = `${node.natureColor || '#fbbf24'}66`;
                natureBadge.style.background = `${node.natureColor || '#fbbf24'}20`;
            }
        }
        const stepPill = document.getElementById("gsmStepPill");
        if (stepPill) {
            stepPill.innerText = `ÉTAPE ${node.stepNum || nodeIdx + 1} / ${tree.nodes.length}`;
        }
        if (titleEl) {
            titleEl.innerText = task ? `${task.badge} : ${task.title}` : node.title;
        }
        if (subtitleEl) subtitleEl.innerText = `${node.layer || 'Architecture Logicielle'} · ${task ? task.desc : (node.subtitle || '')}`;
        if (latencyEl) latencyEl.innerText = `⚡ ${node.latency || '1 ms'}`;
        if (fromFileEl) fromFileEl.innerText = target.fromFile || node.fromFile || 'Client Web';
        if (toFileEl) toFileEl.innerText = target.toFile || node.toFile || 'Serveur Django';
        if (fileLocEl) fileLocEl.innerText = target.file || node.file || 'source.py';
        if (whatEl) whatEl.innerText = target.desc || target.whatHappened || 'Traitement en cours...';

        if (whyEl) {
            whyEl.innerText = target.why || "Étape critique d'intégrité transactionnelle et de conformité réglementaire 3iL.";
        }
        if (howEl) {
            howEl.innerText = target.how || "Exécution interne orchestrée par les contrôleurs Django et la base PostgreSQL.";
        }
        if (whenEl) {
            whenEl.innerText = target.when || "Déclenchement synchrone lors de la requête client.";
        }
        if (techEl) {
            const list = target.techUsed || ["Django 5.0", "PostgreSQL", "Python 3.12"];
            techEl.innerHTML = list.map(t => `<span class="gsm-tech-chip">⚙️ ${t}</span>`).join('');
        }

        if (stateEl) stateEl.innerText = target.stateChange || node.stateChange || 'Aucune mutation enregistrée.';
        if (payloadEl) payloadEl.innerText = target.payload || node.payload || 'Aucun paramètre transitant';
        if (pythonEl) pythonEl.innerText = (target.code) ? target.code : (node.code || '# Code non requis pour cette étape');

        if (sqlSec && sqlEl) {
            const sqlQuery = (target.sql) ? target.sql : node.sql;
            if (sqlQuery) {
                sqlSec.style.display = "block";
                sqlEl.innerText = sqlQuery;
            } else {
                sqlSec.style.display = "none";
            }
        }

        if (oralTipEl) {
            oralTipEl.innerHTML = `
                <strong>🎓 Question / Point clé du jury 3iL :</strong>
                <p>${target.oralTip || node.oralTip || 'Expliquez la séparation stricte des responsabilités et la sécurité des données.'}</p>
            `;
        }
        if (critReasonEl) {
            critReasonEl.innerHTML = `
                <strong>🛡️ Justification architecturale & Impact sécurité :</strong>
                <p>${target.whyCritical || node.whyCritical || "Garantit l'intégrité transactionnelle et la conformité au cahier des charges 3iL."}</p>
            `;
        }

        modal.style.display = "flex";
        backdrop.style.display = "block";
    }

    closeStepModal() {
        const modal = document.getElementById("simStepModal");
        const backdrop = document.getElementById("simStepModalBackdrop");
        if (modal) modal.style.display = "none";
        if (backdrop) backdrop.style.display = "none";
    }

    nextModalStep() {
        const trees = window.SIMULATION_TREES || (typeof APP_DATA !== "undefined" && APP_DATA.simulationTrees) || {};
        const tree = trees[this.currentJourneyScenario] || trees["confirmer_stage"];
        if (!tree || !tree.nodes) return;

        const currentIdx = tree.nodes.findIndex(n => n.id === this.activeModalNodeId);
        const nextIdx = (currentIdx + 1) % tree.nodes.length;
        this.openStepModalById(tree.nodes[nextIdx].id);
    }

    prevModalStep() {
        const trees = window.SIMULATION_TREES || (typeof APP_DATA !== "undefined" && APP_DATA.simulationTrees) || {};
        const tree = trees[this.currentJourneyScenario] || trees["confirmer_stage"];
        if (!tree || !tree.nodes) return;

        const currentIdx = tree.nodes.findIndex(n => n.id === this.activeModalNodeId);
        const prevIdx = (currentIdx - 1 + tree.nodes.length) % tree.nodes.length;
        this.openStepModalById(tree.nodes[prevIdx].id);
    }

    toggleJourneyPlay() {
        if (this.journeyPlaying) {
            this.pauseJourney();
        } else {
            this.playJourney();
        }
    }

    playJourney() {
        const trees = window.SIMULATION_TREES || (typeof APP_DATA !== "undefined" && APP_DATA.simulationTrees) || {};
        const tree = trees[this.currentJourneyScenario] || trees["confirmer_stage"];
        if (!tree || !tree.nodes) return;

        // Si la simulation est déjà terminée à la dernière étape, on la relance depuis l'étape 0
        if (this.journeyCurrentStep >= tree.nodes.length - 1) {
            this.journeyCurrentStep = 0;
            this.renderGoldenTree();
            this.renderJourneyNodes();
            this.updateSimulationHUD();
        }

        this.journeyPlaying = true;
        const playBtn = document.getElementById("journeyPlayBtn");
        if (playBtn) {
            playBtn.classList.add("is-playing");
            playBtn.innerHTML = `<span>⏸</span> Mettre en pause`;
        }

        if (this.journeyTimer) clearInterval(this.journeyTimer);
        const baseInterval = 2400;
        const interval = Math.max(500, baseInterval / this.journeySpeed);

        this.journeyTimer = setInterval(() => {
            const currentTree = trees[this.currentJourneyScenario] || trees["confirmer_stage"];
            if (!currentTree || !currentTree.nodes) return;

            if (this.journeyCurrentStep < currentTree.nodes.length - 1) {
                this.journeyCurrentStep++;
                this.renderGoldenTree();
                this.renderJourneyNodes();
                this.updateSimulationHUD();

                // ARRÊT NATUREL À LA DERNIÈRE ÉTAPE : pas de boucle infinie automatique !
                if (this.journeyCurrentStep >= currentTree.nodes.length - 1) {
                    this.pauseJourney();
                    if (playBtn) {
                        playBtn.innerHTML = `<span>↺</span> Rejouer la simulation`;
                    }
                }
            } else {
                this.pauseJourney();
                if (playBtn) {
                    playBtn.innerHTML = `<span>↺</span> Rejouer la simulation`;
                }
            }
        }, interval);
    }

    pauseJourney() {
        this.journeyPlaying = false;
        if (this.journeyTimer) {
            clearInterval(this.journeyTimer);
            this.journeyTimer = null;
        }
        const playBtn = document.getElementById("journeyPlayBtn");
        if (playBtn) {
            playBtn.classList.remove("is-playing");
            const trees = window.SIMULATION_TREES || (typeof APP_DATA !== "undefined" && APP_DATA.simulationTrees) || {};
            const tree = trees[this.currentJourneyScenario] || trees["confirmer_stage"];
            const isAtEnd = tree && tree.nodes && this.journeyCurrentStep >= tree.nodes.length - 1;
            playBtn.innerHTML = isAtEnd ? `<span>↺</span> Rejouer la simulation` : `<span>▶</span> Lancer la simulation`;
        }
    }

    resetJourney() {
        this.pauseJourney();
        this.journeyCurrentStep = 0;
        this.renderGoldenTree();
        this.renderJourneyNodes();
        this.updateSimulationHUD();
        const playBtn = document.getElementById("journeyPlayBtn");
        if (playBtn) {
            playBtn.innerHTML = `<span>▶</span> Lancer la simulation`;
        }
    }

    prevJourneyStep() {
        this.pauseJourney();
        const trees = window.SIMULATION_TREES || (typeof APP_DATA !== "undefined" && APP_DATA.simulationTrees) || {};
        const tree = trees[this.currentJourneyScenario] || trees["confirmer_stage"];
        if (!tree || !tree.nodes) return;

        if (this.journeyCurrentStep > 0) {
            this.journeyCurrentStep--;
            this.renderGoldenTree();
            this.renderJourneyNodes();
            this.updateSimulationHUD();
        }
    }

    nextJourneyStep() {
        this.pauseJourney();
        const trees = window.SIMULATION_TREES || (typeof APP_DATA !== "undefined" && APP_DATA.simulationTrees) || {};
        const tree = trees[this.currentJourneyScenario] || trees["confirmer_stage"];
        if (!tree || !tree.nodes) return;

        if (this.journeyCurrentStep < tree.nodes.length - 1) {
            this.journeyCurrentStep++;
            this.renderGoldenTree();
            this.renderJourneyNodes();
            this.updateSimulationHUD();
        }
    }

    jumpToJourneyStep(stepIdx) {
        this.pauseJourney();
        const trees = window.SIMULATION_TREES || (typeof APP_DATA !== "undefined" && APP_DATA.simulationTrees) || {};
        const tree = trees[this.currentJourneyScenario] || trees["confirmer_stage"];
        if (!tree || !tree.nodes || stepIdx < 0 || stepIdx >= tree.nodes.length) return;

        this.journeyCurrentStep = stepIdx;
        this.renderGoldenTree();
        this.renderJourneyNodes();
        this.updateSimulationHUD();
    }

    setJourneySpeed(spd) {
        this.journeySpeed = spd;
        document.querySelectorAll(".sp-speed-btn").forEach(b => {
            const val = parseFloat(b.getAttribute("data-speed"));
            b.classList.toggle("active", val === spd);
        });
        if (this.journeyPlaying) {
            this.playJourney();
        }
    }

    renderJourneyNodes() {
        const track = document.getElementById("journeyTrack");
        if (!track) return;

        const trees = window.SIMULATION_TREES || (typeof APP_DATA !== "undefined" && APP_DATA.simulationTrees) || {};
        const tree = trees[this.currentJourneyScenario] || trees["confirmer_stage"];
        if (!tree || !tree.nodes) return;

        let html = "";
        tree.nodes.forEach((step, idx) => {
            const isCompleted = idx < this.journeyCurrentStep;
            const isActive = idx === this.journeyCurrentStep;
            let statusClass = isActive ? "is-active" : (isCompleted ? "is-completed" : "");
            const natureBg = step.natureColor || "#38bdf8";

            html += `
                <div class="sp-flow-node ${statusClass}" id="journeyNode_${idx}" onclick="window.app.jumpToJourneyStep(${idx})" title="Cliquer pour inspecter l'étape ${idx + 1}">
                    <div class="sp-node-top">
                        <span class="sp-node-step-tag">ÉTAPE ${idx + 1}/${tree.nodes.length}</span>
                        <span class="sp-node-latency">⚡ ${step.latency || "1 ms"}</span>
                    </div>

                    <div class="sp-node-nature" style="background: ${natureBg}26; color: ${natureBg}; border: 1px solid ${natureBg}66;">
                        <span>${step.icon || "⚙️"}</span>
                        <span>${step.natureLabel || step.nature || "TRAITEMENT"}</span>
                    </div>

                    <div class="sp-node-path">
                        <span class="sp-node-from" title="${step.fromFile}">${step.fromFile ? step.fromFile.split('/').pop() : 'Client'}</span>
                        <span style="color: #64748b;">➔</span>
                        <span class="sp-node-to is-dest" title="${step.toFile}">${step.toFile ? step.toFile.split('/').pop() : 'Django'}</span>
                    </div>

                    <div class="sp-node-file-tag" title="${step.file || ''}">
                        📄 ${step.file || 'source.py'}
                    </div>
                </div>
            `;

            if (idx < tree.nodes.length - 1) {
                const connectorClass = idx < this.journeyCurrentStep ? "is-active" : "";
                html += `<div class="sp-flow-connector ${connectorClass}">➔</div>`;
            }
        });

        track.innerHTML = html;
    }

    // =========================================================================
    // STARUML / CAD WORKBENCH ZOOM & PAN ENGINE
    // =========================================================================

    setTreeZoom(scale, smooth = true) {
        this.treeZoomLevel = Math.max(0.35, Math.min(1.8, Math.round(scale * 100) / 100));
        const canvas = document.getElementById("goldenTreeCanvas");
        const badge = document.getElementById("tctZoomLevelText");
        if (badge) {
            badge.innerText = `${Math.round(this.treeZoomLevel * 100)}%`;
        }
        if (canvas) {
            canvas.style.transition = smooth ? "transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)" : "none";
            canvas.style.transform = `scale(${this.treeZoomLevel})`;
        }
    }

    zoomInTree() {
        this.setTreeZoom(this.treeZoomLevel + 0.15);
    }

    zoomOutTree() {
        this.setTreeZoom(this.treeZoomLevel - 0.15);
    }

    resetTreeZoom() {
        this.setTreeZoom(1.0);
        const wrapper = document.getElementById("goldenTreeCanvasWrapper");
        if (wrapper) {
            wrapper.scrollTo({ top: 0, behavior: "smooth" });
        }
    }

    fitTreeToView() {
        const wrapper = document.getElementById("goldenTreeCanvasWrapper");
        const canvas = document.getElementById("goldenTreeCanvas");
        if (!wrapper || !canvas) return;

        // Mesure les dimensions réelles non déformées
        const prevTransform = canvas.style.transform;
        canvas.style.transform = "none";
        const naturalHeight = canvas.offsetHeight || 2200;
        const naturalWidth = canvas.offsetWidth || 1180;
        canvas.style.transform = prevTransform;

        const availHeight = wrapper.clientHeight - 80;
        const availWidth = wrapper.clientWidth - 80;

        if (naturalHeight > 0 && availHeight > 0) {
            const scaleY = availHeight / naturalHeight;
            const scaleX = availWidth / naturalWidth;
            const bestScale = Math.min(scaleX, scaleY);
            const finalScale = Math.max(0.35, Math.min(1.0, Math.round(bestScale * 100) / 100));
            this.setTreeZoom(finalScale);
            wrapper.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        }
    }

    initTreeCanvasInteractions() {
        const wrapper = document.getElementById("goldenTreeCanvasWrapper");
        if (!wrapper || this.treeCanvasInteractionsInitialized) return;
        this.treeCanvasInteractionsInitialized = true;

        let isDown = false;
        let startX = 0, startY = 0;
        let scrollLeft = 0, scrollTop = 0;

        wrapper.addEventListener("mousedown", (e) => {
            // Ignorer si le clic cible un élément interactif (nœud, puce fork, bouton, lien, etc.)
            if (e.target.closest(".gt-node, .golden-diamond-card, .parallel-task-chip, .tree-canvas-toolbar, button, a, input, select")) {
                return;
            }
            isDown = true;
            wrapper.classList.add("is-panning");
            startX = e.pageX - wrapper.offsetLeft;
            startY = e.pageY - wrapper.offsetTop;
            scrollLeft = wrapper.scrollLeft;
            scrollTop = wrapper.scrollTop;
        });

        window.addEventListener("mousemove", (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - wrapper.offsetLeft;
            const y = e.pageY - wrapper.offsetTop;
            const walkX = (x - startX) * 1.25;
            const walkY = (y - startY) * 1.25;
            wrapper.scrollLeft = scrollLeft - walkX;
            wrapper.scrollTop = scrollTop - walkY;
        });

        window.addEventListener("mouseup", () => {
            if (isDown) {
                isDown = false;
                wrapper.classList.remove("is-panning");
            }
        });

        // Zoom molette avec Ctrl ou trackpad pinch
        wrapper.addEventListener("wheel", (e) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                const delta = e.deltaY < 0 ? 0.08 : -0.08;
                this.setTreeZoom(this.treeZoomLevel + delta, false);
            }
        }, { passive: false });
    }
}

window.addEventListener("DOMContentLoaded", () => {
    window.app = new StagePilotApp();
    window.stagePilotApp = window.app;
});

window.copyDrawerCode = function() {
    const el = (window.app && window.app.selectedElement) ? window.app.selectedElement : null;
    const textToCopy = el ? el.codeSnippet : (document.getElementById("drawerCodeSnippet") ? document.getElementById("drawerCodeSnippet").innerText : "");
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            const btn = document.getElementById("drawerCodeCopyBtn");
            if (btn) {
                btn.innerHTML = "✅ Copié !";
                setTimeout(() => { btn.innerHTML = "📋 Copier"; }, 1800);
            }
        }).catch(() => {
            alert("Code copié dans le presse-papier !");
        });
    } else {
        alert("Code copié dans le presse-papier !");
    }
};
