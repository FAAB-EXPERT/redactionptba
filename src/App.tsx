import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Legend
} from 'recharts';
import { 
  FolderTree, Folder, Calendar, Plus, AlertTriangle, 
  CheckCircle, Activity, Menu, Target,
  Trash2, Diamond, FileText, DollarSign, Settings, Download, Upload,
  Layout, Edit3, Filter, Landmark, FileSpreadsheet, Home,
  PieChart as PieChartIcon, ShoppingCart, CheckSquare, Columns, AlignLeft, Save, X
} from 'lucide-react';

export interface Task {
  id: string;
  type?: string;
  phase: string;
  name: string;
  antecedent?: string;
  month?: string;
  assignee?: string;
  responsabilite?: string;
  responsableTresorerie?: string;
  startDate: string;
  endDate: string;
  status: 'À faire' | 'En cours' | 'Terminé' | 'Bloqué' | string;
  motifBlocage?: string;
  coutPlanifie: number;
  valeurAcquise: number;
  coutReel: number;
  dateDecaissementPrevu?: string;
  dateDecaissementReel?: string;
  montantDecaissementPrevu?: number | string;
  montantDecaissementReel?: number | string;
  valideVA?: boolean;
  dateVA?: string;
}

export interface Project {
  id: string;
  name: string;
  budgetsAnnuels?: Record<string, number>;
  tasks?: Task[];
}

export interface Axe {
  id: string;
  name: string;
  budget?: number;
  projects?: Project[];
}

export interface Dossier {
  id: string;
  name: string;
  isReadOnly?: boolean;
  startYear?: string;
  axes?: Axe[];
}

export interface OrgConfig {
  name: string;
  sigle: string;
  type: string;
  currency: string;
  financialUnit: string;
  contactPerson: string;
  shortName?: string;
}

// --- JEU DE DONNÉES GÉNÉRIQUE ET STANDARDISÉ (POUR TOUT TYPE D'ORGANISME) ---
const defaultGenericData: Dossier[] = [
  {
    id: 'dossier-strategique',
    name: 'Plan Stratégique & Portefeuille Triennal Global',
    isReadOnly: false,
    startYear: '2026',
    axes: [
      {
        id: 'axe-gouvernance',
        name: 'Axe 1 : Gouvernance, Digitalisation & Processus de Soutien',
        budget: 1500,
        projects: [
          {
            id: 'proj-digitalisation',
            name: 'Projet : Modernisation des Infrastructures Réseaux et Applicatives (S.I.)',
            budgetsAnnuels: { '2025': 50, '2026': 100, '2027': 30 },
            tasks: [
              { id: 't-gov-1', type: 'tache', phase: 'AVANT PROJET', name: 'Rédaction du cahier des charges et diagnostic technique', startDate: '2026-01-05', endDate: '2026-01-20', status: 'Terminé', assignee: 'Direction S.I.', responsableTresorerie: 'Direction Financière', coutPlanifie: 15, valeurAcquise: 15, coutReel: 15, dateDecaissementPrevu: '2026-01-05', dateDecaissementReel: '2026-01-08', valideVA: true, dateVA: '2026-01-20' },
              { id: 't-gov-2', type: 'tache', phase: 'CONCEPTION', name: 'Appel d\'offres restreint et sélection des prestataires intégrateurs', startDate: '2026-02-01', endDate: '2026-03-15', status: 'Terminé', assignee: 'Service Achats', responsableTresorerie: 'Comité Budgétaire', coutPlanifie: 20, valeurAcquise: 20, coutReel: 18, dateDecaissementPrevu: '2026-02-10', dateDecaissementReel: '2026-03-01', valideVA: true, dateVA: '2026-03-15' },
              { id: 't-gov-3', type: 'tache', phase: 'EXÉCUTION & SUIVI', name: 'Déploiement du serveur central et tests utilisateurs (UAT)', startDate: '2026-06-01', endDate: '2026-11-30', status: 'En cours', assignee: 'Prestataire S.I.', responsableTresorerie: 'Co-financement Extérieur', coutPlanifie: 65, valeurAcquise: 35, coutReel: 30, dateDecaissementPrevu: '2026-06-01', dateDecaissementReel: '2026-06-15', valideVA: false, dateVA: '' }
            ]
          },
          {
            id: 'proj-locaux',
            name: 'Projet : Rénovation et efficacité énergétique des bâtiments administratifs',
            budgetsAnnuels: { '2025': 80, '2026': 150, '2027': 70 },
            tasks: [
              { id: 't-loc-1', type: 'tache', phase: 'AVANT PROJET', name: 'Étude d\'impact environnemental et audit énergétique', startDate: '2026-01-10', endDate: '2026-02-28', status: 'Terminé', assignee: 'Cabinet Expert', responsableTresorerie: 'Fonds Propres', coutPlanifie: 25, valeurAcquise: 25, coutReel: 25, dateDecaissementPrevu: '2026-01-15', dateDecaissementReel: '2026-01-15', valideVA: true, dateVA: '2026-02-28' },
              { id: 't-loc-2', type: 'tache', phase: 'EXÉCUTION & SUIVI', name: 'Mise aux normes électriques et isolation thermique', startDate: '2026-05-01', endDate: '2026-11-30', status: 'En cours', assignee: 'Prestataire BTP', responsableTresorerie: 'Trésorerie Centrale', coutPlanifie: 125, valeurAcquise: 50, coutReel: 55, dateDecaissementPrevu: '2026-05-15', dateDecaissementReel: '2026-05-20', valideVA: false, dateVA: '' }
            ]
          }
        ]
      },
      {
        id: 'axe-ops',
        name: 'Axe 2 : Infrastructures, Équipements & Prestation de Services',
        budget: 4500,
        projects: [
          {
            id: 'proj-infrastructure',
            name: 'Projet : Réhabilitation des axes routiers et logistiques principaux',
            budgetsAnnuels: { '2025': 150, '2026': 300, '2027': 150 },
            tasks: [
              { id: 't-infra-1', type: 'tache', phase: 'AVANT PROJET', name: 'Diagnostics géotechniques et tracé cartographique', startDate: '2026-01-05', endDate: '2026-02-15', status: 'Terminé', assignee: 'Bureau d\'Études', responsableTresorerie: 'Trésorerie Centrale', coutPlanifie: 30, valeurAcquise: 30, coutReel: 30, dateDecaissementPrevu: '2026-01-10', dateDecaissementReel: '2026-01-15', valideVA: true, dateVA: '2026-02-15' },
              { id: 't-infra-2', type: 'tache', phase: 'EXÉCUTION & SUIVI', name: 'Terrassement, raccordement et enrobé bitumineux', startDate: '2026-04-01', endDate: '2026-10-31', status: 'En cours', assignee: 'Groupement BTP', responsableTresorerie: 'Partenaire Financier', coutPlanifie: 170, valeurAcquise: 85, coutReel: 90, dateDecaissementPrevu: '2026-04-15', dateDecaissementReel: '2026-05-02', valideVA: false, dateVA: '' },
              { id: 't-infra-3', type: 'tache', phase: 'EXÉCUTION & SUIVI', name: 'Signalisation, glissières et raccordements secondaires', startDate: '2026-11-01', endDate: '2027-03-31', status: 'À faire', assignee: 'Prestataire Spécialisé', responsableTresorerie: 'Trésorerie Centrale', coutPlanifie: 100, valeurAcquise: 0, coutReel: 0, dateDecaissementPrevu: '2026-11-15', dateDecaissementReel: '', valideVA: false, dateVA: '' }
            ]
          },
          {
            id: 'proj-eau',
            name: 'Projet : Système d\'adduction d\'eau potable et forages autonomes',
            budgetsAnnuels: { '2025': 100, '2026': 180, '2027': 50 },
            tasks: [
              { id: 't-eau-1', type: 'tache', phase: 'CONCEPTION', name: 'Études hydrogéologiques de terrain', startDate: '2026-02-15', endDate: '2026-04-15', status: 'Terminé', assignee: 'Bureau d\'études Hydro', responsableTresorerie: 'Fonds Propres', coutPlanifie: 30, valeurAcquise: 30, coutReel: 30, dateDecaissementPrevu: '2026-02-20', dateDecaissementReel: '2026-03-01', valideVA: true, dateVA: '2026-04-15' },
              { id: 't-eau-2', type: 'tache', phase: 'EXÉCUTION & SUIVI', name: 'Installation des pompes et réseaux de raccordement', startDate: '2026-06-15', endDate: '2026-12-15', status: 'En cours', assignee: 'Prestataire Forages', responsableTresorerie: 'Trésorerie Centrale', coutPlanifie: 150, valeurAcquise: 75, coutReel: 70, dateDecaissementPrevu: '2026-07-01', dateDecaissementReel: '2026-07-15', valideVA: false, dateVA: '' }
            ]
          }
        ]
      },
      {
        id: 'axe-capital-humain',
        name: 'Axe 3 : Capital Humain, Inclusion & Impact Communautaire',
        budget: 2500,
        projects: [
          {
            id: 'proj-apprentissage',
            name: 'Projet : Programme de formation et d\'incubation des talents locaux',
            budgetsAnnuels: { '2025': 60, '2026': 120, '2027': 60 },
            tasks: [
              { id: 't-app-1', type: 'tache', phase: 'PLANIFICATION', name: 'Ciblage des filières d\'apprentissage et sélection des mentors', startDate: '2026-01-10', endDate: '2026-02-28', status: 'Terminé', assignee: 'Comité Interne', responsableTresorerie: 'Direction Financière', coutPlanifie: 20, valeurAcquise: 20, coutReel: 20, dateDecaissementPrevu: '2026-01-20', dateDecaissementReel: '2026-02-05', valideVA: true, dateVA: '2026-02-28' },
              { id: 't-app-2', type: 'tache', phase: 'EXÉCUTION & SUIVI', name: 'Lancement des promotions de formation pratique', startDate: '2026-05-01', endDate: '2026-11-30', status: 'En cours', assignee: 'Cabinet de formation', responsableTresorerie: 'Partenaire Financier', coutPlanifie: 100, valeurAcquise: 50, coutReel: 45, dateDecaissementPrevu: '2026-05-15', dateDecaissementReel: '2026-05-30', valideVA: false, dateVA: '' }
            ]
          }
        ]
      }
    ]
  }
];

// Options de personnalisation visuelle pour s'ajuster à tout type d'organisation
const THEMES = {
  blue: {
    primary: 'from-blue-600 to-indigo-700',
    primaryBg: 'bg-blue-600 hover:bg-blue-700',
    accent: 'text-blue-600',
    light: 'bg-blue-50 border-blue-200 text-blue-700',
    lightBg: 'bg-blue-50/20',
    iconBg: 'bg-blue-100 text-blue-700',
    banner: 'from-blue-600 via-indigo-600 to-slate-800'
  },
  emerald: {
    primary: 'from-emerald-600 to-teal-700',
    primaryBg: 'bg-emerald-600 hover:bg-emerald-700',
    accent: 'text-emerald-600',
    light: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    lightBg: 'bg-emerald-50/20',
    iconBg: 'bg-emerald-100 text-emerald-700',
    banner: 'from-emerald-600 via-teal-600 to-slate-800'
  },
  orange: {
    primary: 'from-orange-500 to-amber-600',
    primaryBg: 'bg-orange-500 hover:bg-orange-600',
    accent: 'text-orange-500',
    light: 'bg-orange-50 border-orange-200 text-orange-700',
    lightBg: 'bg-orange-50/20',
    iconBg: 'bg-orange-100 text-orange-700',
    banner: 'from-orange-500 via-amber-500 to-slate-800'
  },
  slate: {
    primary: 'from-slate-700 to-slate-900',
    primaryBg: 'bg-slate-700 hover:bg-slate-800',
    accent: 'text-slate-700',
    light: 'bg-slate-100 border-slate-300 text-slate-800',
    lightBg: 'bg-slate-100/20',
    iconBg: 'bg-slate-200 text-slate-800',
    banner: 'from-slate-700 via-slate-800 to-slate-950'
  }
};

const STANDARD_PHASES = ['AVANT PROJET', 'CONCEPTION', 'PLANIFICATION', 'EXÉCUTION & SUIVI', 'CLÔTURE'];
const PIE_COLORS = ['#3B82F6', '#10B981', '#F97316', '#8B5CF6', '#EC4899', '#06B6D4', '#EAB308'];

export default function App() {
  const [activeTab, setActiveTab] = useState<'accueil' | 'projects' | 'ptba' | 'processus' | 'kanban' | 'gantt' | 'configuration'>('accueil'); 
  const [ptbaSection, setPtbaSection] = useState<'cadrage' | 'programmation' | 'ppm' | 'suivi'>('programmation');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTheme, setActiveTheme] = useState<keyof typeof THEMES>('blue');

  // --- CONFIGURATION D'ORGANISME CUSTOM (PERSISTANTE) ---
  const [orgConfig, setOrgConfig] = useState<OrgConfig>(() => {
    try {
      const saved = localStorage.getItem('ptba_org_config_v3');
      return saved ? JSON.parse(saved) : {
        name: "Société d'Aménagement & d'Innovation",
        sigle: "SAI",
        type: "Entreprise Privée",
        currency: "FCFA",
        financialUnit: "M", // Millions
        contactPerson: "Koffié Fabien Michael"
      };
    } catch {
      return {
        name: "Société d'Aménagement & d'Innovation",
        sigle: "SAI",
        type: "Entreprise Privée",
        currency: "FCFA",
        financialUnit: "M",
        contactPerson: "Koffié Fabien Michael"
      };
    }
  });

  // --- PERSISTANCE DES DONNÉES PTBA (ORGANISME NEUTRE) ---
  const [data, setData] = useState<Dossier[]>(() => {
    try {
      const savedData = localStorage.getItem('ptba_data_generic_v3');
      return savedData ? JSON.parse(savedData) : defaultGenericData;
    } catch (e) {
      console.error("Erreur de chargement des données locales :", e);
      return defaultGenericData;
    }
  });

  // --- PERSISTANCE DES STATES DE CONFIG ---
  React.useEffect(() => {
    localStorage.setItem('ptba_data_generic_v3', JSON.stringify(data));
  }, [data]);

  React.useEffect(() => {
    localStorage.setItem('ptba_org_config_v3', JSON.stringify(orgConfig));
  }, [orgConfig]);

  const currentTheme = THEMES[activeTheme] || THEMES.blue;

  // --- SÉLECTEURS DE FILTRES ---
  const [filterProcessusDossier] = useState('FULL');
  const [filterProcessusYear, setFilterProcessusYear] = useState('2026');
  const [filterProcessusAxe, setFilterProcessusAxe] = useState('FULL');
  const [filterProcessusProj, setFilterProcessusProj] = useState('FULL');
  
  const [filterPTBADossier, setFilterPTBADossier] = useState('FULL');
  const [filterPTBAYear, setFilterPTBAYear] = useState('2026');
  const [filterPTBAAxe, setFilterPTBAAxe] = useState('FULL');
  const [filterPTBAProj, setFilterPTBAProj] = useState('FULL');

  const [filterKanbanAxe, setFilterKanbanAxe] = useState('FULL');
  const [filterKanbanProj, setFilterKanbanProj] = useState('FULL');
  const [filterKanbanYear, setFilterKanbanYear] = useState('2026');
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);

  const [filterGanttAxe, setFilterGanttAxe] = useState('FULL');
  const [filterGanttProj, setFilterGanttProj] = useState('FULL');
  const [filterGanttYear, setFilterGanttYear] = useState('2026');

  // --- MODALS / DRAWERS EDIT STATES ---
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null); 
  const [editingPhase, setEditingPhase] = useState<string | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Task>>({});

  // Nouveaux états de création d'entités (Organisme personnalisable)
  const [showAddDossierModal, setShowAddDossierModal] = useState(false);
  const [newDossierName, setNewDossierName] = useState('');
  const [newDossierYear, setNewDossierYear] = useState('2026');

  const [showAddAxeModal, setShowAddAxeModal] = useState(false);
  const [targetDossierId, setTargetDossierId] = useState('');
  const [newAxeName, setNewAxeName] = useState('');
  const [newAxeBudget, setNewAxeBudget] = useState(1000);

  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [targetAxeId, setTargetAxeId] = useState('');
  const [newProjectName, setNewProjectName] = useState('');

  // Notification d'erreur ou d'alerte personnalisée
  const [customAlert, setCustomAlert] = useState<{ message: string; type?: string } | null>(null);

  const triggerAlert = (message: string, type = "info") => {
    setCustomAlert({ message, type });
    setTimeout(() => setCustomAlert(null), 4000);
  };

  // --- ACTIONS LOGIQUE PROJETS & TÂCHES ---
  const handleAddTask = (projectId: string, phase: string) => {
    setEditingTaskId('new');
    setEditingProjectId(projectId);
    setEditingPhase(phase);
    setEditFormData({
      type: 'tache', name: '', antecedent: '—', month: '', assignee: '',
      responsabilite: '', responsableTresorerie: '',
      startDate: '2026-01-01',
      endDate: '2026-01-15',
      dateDecaissementPrevu: '', dateDecaissementReel: '',
      montantDecaissementPrevu: '', montantDecaissementReel: '',
      coutPlanifie: 0, valeurAcquise: 0, coutReel: 0,
      status: 'À faire', motifBlocage: ''
    });
  };

  const handleEditTask = (projectId: string, phase: string, task: Task) => {
    setEditingTaskId(task.id);
    setEditingProjectId(projectId);
    setEditingPhase(phase);
    setEditFormData({
      type: task.type || 'tache', name: task.name || '', antecedent: task.antecedent || '—',
      month: task.month || '', assignee: task.assignee || '',
      responsabilite: task.responsabilite || '', responsableTresorerie: task.responsableTresorerie || '',
      startDate: task.startDate || '', endDate: task.endDate || '',
      dateDecaissementPrevu: task.dateDecaissementPrevu || '', dateDecaissementReel: task.dateDecaissementReel || '',
      montantDecaissementPrevu: task.montantDecaissementPrevu !== undefined ? task.montantDecaissementPrevu : '',
      montantDecaissementReel: task.montantDecaissementReel !== undefined ? task.montantDecaissementReel : (task.coutReel || ''),
      coutPlanifie: task.coutPlanifie || 0,
      valeurAcquise: task.valeurAcquise !== undefined ? task.valeurAcquise : ((task.status === 'Terminé' || task.valideVA) ? (task.coutPlanifie || 0) : 0),
      coutReel: task.coutReel || 0, status: task.status || 'À faire', motifBlocage: task.motifBlocage || ''
    });
  };

  const handleSaveTask = () => {
    if (!editFormData.name) {
      triggerAlert("Le nom de la tâche ne peut pas être vide.", "warning");
      return;
    }
    const newData = [...data];
    let found = false;
    
    for (const d of newData) {
      if (d.axes) {
        for (const a of d.axes) {
          if (a.projects) {
            const p = a.projects.find(proj => proj.id === editingProjectId);
            if (p) {
              if (!p.tasks) p.tasks = [];
              const valideVA = editFormData.status === 'Terminé';
              const dateVA = valideVA ? new Date().toISOString().split('T')[0] : '';
              const finalMotif = editFormData.status === 'Bloqué' ? editFormData.motifBlocage : '';

              if (editingTaskId === 'new') {
                const newTask: Task = {
                  id: `t-${Date.now()}`,
                  phase: editingPhase || 'EXÉCUTION & SUIVI',
                  name: editFormData.name || '',
                  antecedent: editFormData.antecedent || '—',
                  month: editFormData.month || '',
                  assignee: editFormData.assignee || '',
                  responsabilite: editFormData.responsabilite || '',
                  responsableTresorerie: editFormData.responsableTresorerie || '',
                  startDate: editFormData.startDate || '2026-01-01',
                  endDate: editFormData.endDate || '2026-01-15',
                  status: editFormData.status || 'À faire',
                  motifBlocage: finalMotif,
                  valideVA,
                  dateVA,
                  coutPlanifie: Number(editFormData.coutPlanifie) || 0,
                  valeurAcquise: Number(editFormData.valeurAcquise) || 0,
                  coutReel: Number(editFormData.coutReel) || 0,
                  dateDecaissementPrevu: editFormData.dateDecaissementPrevu || '',
                  dateDecaissementReel: editFormData.dateDecaissementReel || ''
                };
                p.tasks.push(newTask);
              } else {
                const tIndex = p.tasks.findIndex(t => t.id === editingTaskId);
                if (tIndex > -1) {
                  p.tasks[tIndex] = { 
                    ...p.tasks[tIndex],
                    ...editFormData,
                    motifBlocage: finalMotif,
                    valideVA,
                    dateVA: valideVA && !p.tasks[tIndex].dateVA ? dateVA : p.tasks[tIndex].dateVA
                  } as Task;
                }
              }
              
              p.tasks.sort((a, b) => {
                const phaseA = STANDARD_PHASES.indexOf(a.phase);
                const phaseB = STANDARD_PHASES.indexOf(b.phase);
                if (phaseA !== phaseB) return phaseA - phaseB;
                return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
              });

              found = true;
              break;
            }
          }
        }
      }
      if (found) break;
    }
    setData(newData);
    setEditingTaskId(null);
    triggerAlert("Tâche enregistrée avec succès !", "success");
  };

  const handleDeleteTask = (projectId: string, taskId: string) => {
    const newData = [...data];
    for (const d of newData) {
      if (d.axes) {
        for (const a of d.axes) {
          if (a.projects) {
            const p = a.projects.find(proj => proj.id === projectId);
            if (p && p.tasks) p.tasks = p.tasks.filter(t => t.id !== taskId);
          }
        }
      }
    }
    setData(newData);
    triggerAlert("Tâche supprimée.", "info");
  };

  const handleDropTaskToKanban = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    setDragOverCol(null);
    try {
      const taskData = JSON.parse(e.dataTransfer.getData('application/json'));
      if (!taskData || !taskData.taskId || !taskData.projectId) return;
      if (taskData.currentStatus === newStatus) return;

      const newData = [...data];
      let found = false;
      for (const d of newData) {
        if (d.axes) {
          for (const a of d.axes) {
            if (a.projects) {
              const p = a.projects.find(proj => proj.id === taskData.projectId);
              if (p && p.tasks) {
                const tIndex = p.tasks.findIndex(t => t.id === taskData.taskId);
                if (tIndex > -1) {
                  p.tasks[tIndex].status = newStatus;
                  
                  if (newStatus === 'Terminé') {
                    p.tasks[tIndex].valideVA = true;
                    if (!p.tasks[tIndex].dateVA) p.tasks[tIndex].dateVA = new Date().toISOString().split('T')[0];
                    p.tasks[tIndex].valeurAcquise = p.tasks[tIndex].coutPlanifie;
                  }
                  
                  found = true;
                  break;
                }
              }
            }
          }
        }
        if (found) break;
      }
      
      if (found) {
        setData(newData);
        triggerAlert(`Tâche déplacée vers : ${newStatus}`, "success");
      }
    } catch (err) {
      console.error("Erreur de glisser-déposer:", err);
    }
  };

  // --- ACTIONS CRÉATION DE STRUCTURE (DYNAMIQUES) ---
  const handleCreateDossier = () => {
    if (!newDossierName.trim()) return;
    const newDossier: Dossier = {
      id: `dossier-${Date.now()}`,
      name: newDossierName,
      isReadOnly: false,
      startYear: newDossierYear,
      axes: []
    };
    setData([newDossier, ...data]);
    setNewDossierName('');
    setShowAddDossierModal(false);
    triggerAlert("Nouveau dossier budgétaire créé !", "success");
  };

  const handleCreateAxe = () => {
    if (!newAxeName.trim() || !targetDossierId) return;
    const newData = [...data];
    const dossier = newData.find(d => d.id === targetDossierId);
    if (dossier) {
      if (!dossier.axes) dossier.axes = [];
      dossier.axes.push({
        id: `axe-${Date.now()}`,
        name: newAxeName,
        budget: Number(newAxeBudget) || 1000,
        projects: []
      });
      setData(newData);
      setNewAxeName('');
      setNewAxeBudget(1000);
      setShowAddAxeModal(false);
      triggerAlert("Axe stratégique ajouté.", "success");
    }
  };

  const handleCreateProject = () => {
    if (!newProjectName.trim() || !targetAxeId) return;
    const newData = [...data];
    let found = false;
    for (const d of newData) {
      if (d.axes) {
        const axe = d.axes.find(a => a.id === targetAxeId);
        if (axe) {
          if (!axe.projects) axe.projects = [];
          axe.projects.push({
            id: `proj-${Date.now()}`,
            name: newProjectName,
            budgetsAnnuels: { '2025': 0, '2026': 100, '2027': 0 },
            tasks: []
          });
          found = true;
          break;
        }
      }
    }
    if (found) {
      setData(newData);
      setNewProjectName('');
      setShowAddProjectModal(false);
      triggerAlert("Projet opérationnel rattaché.", "success");
    }
  };

  const handleDeleteDossier = (dossierId: string) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce Dossier ? Cette opération supprimera l'ensemble des axes, projets et tâches associés.")) {
      setData(data.filter(d => d.id !== dossierId));
      triggerAlert("Dossier supprimé.", "info");
    }
  };

  // --- IMPORT / EXPORT DE DONNÉES JSON ---
  const handleExportData = () => {
    const fileData = JSON.stringify({ orgConfig, activeTheme, ptbaData: data }, null, 2);
    const blob = new Blob([fileData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `PTBA_${orgConfig.sigle || "ORGANISME"}_2026.json`;
    link.href = url;
    link.click();
    triggerAlert("Export JSON téléchargé !", "success");
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.ptbaData && Array.isArray(parsed.ptbaData)) {
            setData(parsed.ptbaData);
            if (parsed.orgConfig) setOrgConfig(parsed.orgConfig);
            if (parsed.activeTheme) setActiveTheme(parsed.activeTheme);
            triggerAlert("Configuration et données importées avec succès !", "success");
          } else {
            triggerAlert("Format JSON de PTBA invalide.", "warning");
          }
        } catch {
          triggerAlert("Erreur de décodage du fichier.", "warning");
        }
      };
    }
  };

  // --- LOGIQUE CALCULS FINANCIERS ---
  const allProjects = useMemo(() => {
    const projects: Array<Project & { dossierName: string; dossierId: string; axeName: string; axeId: string; isReadOnly?: boolean }> = [];
    data.forEach(dossier => {
      dossier.axes?.forEach(axe => {
        axe.projects?.forEach(proj => {
          projects.push({ 
            ...proj, 
            dossierName: dossier.name, 
            dossierId: dossier.id, 
            axeName: axe.name, 
            axeId: axe.id, 
            isReadOnly: dossier.isReadOnly 
          });
        });
      });
    });
    return projects;
  }, [data]);

  const ptbaAvailableProjects = useMemo(() => {
    return allProjects.filter(p => (filterPTBADossier === 'FULL' || p.dossierId === filterPTBADossier) && (filterPTBAAxe === 'FULL' || p.axeId === filterPTBAAxe));
  }, [allProjects, filterPTBADossier, filterPTBAAxe]);

  const getQuarterOverlapDays = (startDateStr: string, endDateStr: string, targetYear: string, qIndex: number) => {
    if (!startDateStr || !endDateStr) return 0;
    const [sYear, sMonth, sDay] = startDateStr.split('-').map(Number);
    const [eYear, eMonth, eDay] = endDateStr.split('-').map(Number);
    const start = new Date(sYear, sMonth - 1, sDay).getTime();
    const end = new Date(eYear, eMonth - 1, eDay).getTime();
    const qStart = new Date(parseInt(targetYear), qIndex * 3, 1).getTime();
    const qEnd = new Date(parseInt(targetYear), qIndex * 3 + 3, 0).getTime();
    if (start > qEnd || end < qStart) return 0;
    const overlapStart = Math.max(start, qStart);
    const overlapEnd = Math.min(end, qEnd);
    return Math.max(0, (overlapEnd - overlapStart) / (1000 * 60 * 60 * 24) + 1);
  };

  const getYearOverlapDays = (startDateStr: string, endDateStr: string, targetYear: string) => {
    if (!startDateStr || !endDateStr) return 0;
    const [sYear, sMonth, sDay] = startDateStr.split('-').map(Number);
    const [eYear, eMonth, eDay] = endDateStr.split('-').map(Number);
    const start = new Date(sYear, sMonth - 1, sDay).getTime();
    const end = new Date(eYear, eMonth - 1, eDay).getTime();
    if (targetYear === 'ALL') return Math.max(0, (end - start) / (1000 * 60 * 60 * 24) + 1);
    const yStart = new Date(parseInt(targetYear), 0, 1).getTime();
    const yEnd = new Date(parseInt(targetYear), 11, 31).getTime();
    if (start > yEnd || end < yStart) return 0;
    const overlapStart = Math.max(start, yStart);
    const overlapEnd = Math.min(end, yEnd);
    return Math.max(0, (overlapEnd - overlapStart) / (1000 * 60 * 60 * 24) + 1);
  };

  const getProjectAnnualBudget = (proj: Project, year: string, isReadOnly?: boolean) => {
    if (isReadOnly) {
      if (year === 'ALL') return getProjectTotalBudget(proj, true);
      return Number(proj.budgetsAnnuels?.[year]) || 0;
    }
    let total = 0;
    if (proj.tasks) {
      proj.tasks.forEach(t => {
        const vp = Number(t.coutPlanifie) || 0;
        if (vp > 0 && t.startDate && t.endDate) {
          const dYear = getYearOverlapDays(t.startDate, t.endDate, year);
          const totalDays = Math.max(1, (new Date(t.endDate).getTime() - new Date(t.startDate).getTime()) / (1000 * 60 * 60 * 24) + 1);
          total += vp * (dYear / totalDays);
        }
      });
    }
    return Math.round(total);
  };

  const getProjectTotalBudget = (proj: Project, isReadOnly?: boolean) => {
    if (isReadOnly) {
       const annuels = proj.budgetsAnnuels || {};
       return (Number(annuels['2025']) || 0) + (Number(annuels['2026']) || 0) + (Number(annuels['2027']) || 0);
    }
    return (proj.tasks || []).reduce((sum, t) => sum + (Number(t.coutPlanifie) || 0), 0);
  };

  const fmtBudget = (val: number | string | undefined) => {
    if (val === 0 || !val) return '0';
    return Number(val).toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 1 });
  };

  // --- RENDU : ACCUEIL & PORTAIL DE CONFIGURATION ---
  const renderAccueil = () => (
    <div className="animate-in fade-in duration-500 pb-10 flex flex-col space-y-6">
      <div className={`bg-gradient-to-br ${currentTheme.banner} rounded-2xl p-8 md:p-12 text-white shadow-lg relative overflow-hidden`}>
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
          <Activity className="w-96 h-96" />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 bg-white/20 border border-white/30 rounded-full px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase shadow-sm">
            <Target className="w-4 h-4 text-yellow-300" />
            <span>Solution Multi-Organisations de Pilotage Stratégique</span>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
            {orgConfig.name} <br/>
            <span className="text-yellow-400">Plan de Travail & de Budget Annuel</span>
          </h1>
          <p className="text-md md:text-lg text-slate-200 max-w-3xl mb-8 leading-relaxed font-medium">
            Plateforme décisionnelle universelle dédiée à l'élaboration de budgets, au suivi des contrats de passation de marchés, au pilotage Kanban et à l'évaluation physique-financière par la méthode de la Valeur Acquise (EVM).
          </p>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => setActiveTab('ptba')} className="bg-white text-slate-900 hover:bg-slate-100 px-6 py-3.5 rounded-xl font-bold flex items-center transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
              <FileSpreadsheet className="w-5 h-5 mr-2 text-indigo-600" /> Consulter le PTBA
            </button>
            <button onClick={() => setActiveTab('projects')} className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3.5 rounded-xl font-bold flex items-center transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
              <Folder className="w-5 h-5 mr-2" /> Ouvrir les Dossiers
            </button>
            <button onClick={() => setActiveTab('configuration')} className="bg-slate-900/40 hover:bg-slate-900/60 border border-white/30 text-white px-6 py-3.5 rounded-xl font-bold flex items-center transition-all shadow-sm">
              <Settings className="w-5 h-5 mr-2" /> Paramétrer l'Organisme
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center mb-4 font-bold text-lg">1</div>
          <h3 className="font-bold text-slate-800 text-base mb-2">Structure modulaire</h3>
          <p className="text-sm text-slate-600 leading-relaxed">Création illimitée de Dossiers stratégiques, de Programmes opérationnels (Axes) et de Projets d'investissements.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="w-12 h-12 bg-green-100 text-green-700 rounded-lg flex items-center justify-center mb-4 font-bold text-lg">2</div>
          <h3 className="font-bold text-slate-800 text-base mb-2">Suivi physique & financier (GAR)</h3>
          <p className="text-sm text-slate-600 leading-relaxed">Tableau de bord EVM (Valeur Acquise) intégrant les coûts planifiés, réalisés, et calculant automatiquement les écarts d'efficience.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-lg flex items-center justify-center mb-4 font-bold text-lg">3</div>
          <h3 className="font-bold text-slate-800 text-base mb-2">Multi-Vues dynamiques</h3>
          <p className="text-sm text-slate-600 leading-relaxed">Basculez à tout moment d'un diagramme de Gantt interactif vers un tableau de passation des marchés ou un Kanban agile.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row items-start md:items-center gap-6 mt-4">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-700 font-bold text-xl shrink-0 shadow-inner">
          {orgConfig.sigle || "ORG"}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Configuration de l'Organisme actif</h3>
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mt-1 mb-2">
            Type d'entité : {orgConfig.type} • Unité d'étude : {orgConfig.financialUnit}s de {orgConfig.currency}
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            Pour modifier le nom de l'organisation, la devise budgétaire ou réinitialiser les données modèles par défaut, veuillez cliquer sur l'onglet <strong>Configuration</strong> dans la barre de navigation latérale.
          </p>
        </div>
      </div>
    </div>
  );

  // --- RENDU : CONFIGURATION DE L'ORGANISME & IMPORT-EXPORT ---
  const renderConfiguration = () => (
    <div className="animate-in fade-in duration-500 pb-10 flex flex-col space-y-6">
      <div className="border-b pb-3 border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center">
          <Settings className="w-6 h-6 mr-2 text-indigo-600" /> Configuration Générale de la Plateforme
        </h2>
        <p className="text-sm text-slate-500 mt-1">Adaptez l'application aux besoins spécifiques de votre entreprise ou institution</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulaire de l'organisme */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
          <h3 className="text-lg font-bold text-slate-800 border-b pb-2 flex items-center">
            <Landmark className="w-5 h-5 mr-2 text-slate-500" /> Profil de l'Organisation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Nom Complet</label>
              <input 
                type="text" 
                className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-sm rounded-lg p-2.5 focus:ring-indigo-500"
                value={orgConfig.name} 
                onChange={(e) => setOrgConfig({...orgConfig, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Acronyme / Sigle</label>
              <input 
                type="text" 
                className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-sm rounded-lg p-2.5"
                value={orgConfig.sigle} 
                onChange={(e) => setOrgConfig({...orgConfig, sigle: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Type d'Organisme</label>
              <select 
                className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-sm rounded-lg p-2.5"
                value={orgConfig.type} 
                onChange={(e) => setOrgConfig({...orgConfig, type: e.target.value})}
              >
                <option value="Administration Publique">Administration Publique</option>
                <option value="Entreprise Privée">Entreprise Privée</option>
                <option value="Collectivité Territoriale">Collectivité Territoriale</option>
                <option value="ONG / Association">ONG / Association</option>
                <option value="Cabinet / Bureau de conseils">Cabinet / Bureau de conseils</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Devise Budgétaire</label>
              <input 
                type="text" 
                className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-sm rounded-lg p-2.5"
                value={orgConfig.currency} 
                onChange={(e) => setOrgConfig({...orgConfig, currency: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Unité (affichage)</label>
              <select 
                className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-sm rounded-lg p-2.5"
                value={orgConfig.financialUnit} 
                onChange={(e) => setOrgConfig({...orgConfig, financialUnit: e.target.value})}
              >
                <option value="M">Millions</option>
                <option value="K">Milliers</option>
                <option value="Unité">Unité Réelle</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Directeur / Responsable de la Planification</label>
            <input 
              type="text" 
              className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-sm rounded-lg p-2.5"
              value={orgConfig.contactPerson} 
              onChange={(e) => setOrgConfig({...orgConfig, contactPerson: e.target.value})}
            />
          </div>

          <div className="pt-2">
            <button 
              onClick={() => triggerAlert("Profil de l'organisation sauvegardé localement.", "success")} 
              className={`w-full ${currentTheme.primaryBg} text-white font-bold p-2.5 rounded-lg transition-colors flex items-center justify-center`}
            >
              <Save className="w-4 h-4 mr-2" /> Enregistrer les changements
            </button>
          </div>
        </div>

        {/* Thèmes & Data Actions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-800 border-b pb-2 flex items-center mb-4">
              <Diamond className="w-5 h-5 mr-2 text-orange-500" /> Identité Visuelle (Thème)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(Object.keys(THEMES) as Array<keyof typeof THEMES>).map((key) => (
                <button
                  key={key}
                  onClick={() => { setActiveTheme(key); triggerAlert(`Thème graphique mis à jour !`, "success"); }}
                  className={`p-3 rounded-xl border text-xs font-bold capitalize flex flex-col items-center gap-1.5 transition-all ${activeTheme === key ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-extrabold ring-2 ring-indigo-200' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}
                >
                  <span className={`w-6 h-6 rounded-full bg-gradient-to-br ${THEMES[key].primary}`} />
                  {key}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-md font-bold text-slate-800 mb-3 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-indigo-500" /> Sauvegarde de données & Intégration
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Exportez la totalité de vos saisies budgétaires, programmes, projets et configurations d'organisme dans un fichier JSON portable pour sauvegarde. Vous pourrez le restaurer ci-dessous.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button 
                onClick={handleExportData} 
                className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs p-3 rounded-lg flex items-center justify-center transition-colors shadow-sm"
              >
                <Download className="w-4 h-4 mr-2" /> Exporter la configuration (.json)
              </button>
              <label className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs p-3 rounded-lg flex items-center justify-center cursor-pointer transition-colors border border-slate-300 text-center">
                <Upload className="w-4 h-4 mr-2" /> Importer une sauvegarde
                <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
              </label>
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg border border-red-100">
            <h4 className="font-bold text-red-800 text-xs mb-1 uppercase">Zone de Réinitialisation</h4>
            <p className="text-[11px] text-red-600 mb-3 leading-tight">Cette action effacera toute votre configuration actuelle et rechargera le canevas de démonstration.</p>
            <button 
              onClick={() => {
                if (window.confirm("Êtes-vous sûr de vouloir réinitialiser l'application ? Vos modifications locales seront définitivement écrasées.")) {
                  setData(defaultGenericData);
                  setOrgConfig({
                    name: "Société d'Aménagement & d'Innovation",
                    sigle: "SAI",
                    type: "Entreprise Privée",
                    currency: "FCFA",
                    financialUnit: "M",
                    contactPerson: "Koffié Fabien Michael"
                  });
                  setActiveTheme('blue');
                  triggerAlert("Données d'origine rechargées.", "info");
                }
              }} 
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded transition-colors"
            >
              Réinitialiser l'application
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // --- RENDU : GESTION DES DOSSIERS / AXES / PROJETS ---
  const renderProjectManager = () => (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex justify-between items-center border-b pb-2 border-slate-200 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center">
            <Folder className="w-6 h-6 mr-2 text-amber-500" /> Dossiers Opérationnels de l'Organisme
          </h2>
          <p className="text-xs text-slate-500 mt-1">Créez et configurez l'organigramme budgétaire complet de vos départements</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowAddDossierModal(true)} 
            className={`${currentTheme.primaryBg} text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm flex items-center transition-colors`}
          >
            <Plus className="w-4 h-4 mr-1.5" /> Nouveau Dossier
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {data.map(dossier => (
          <div key={dossier.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 flex flex-col lg:flex-row lg:justify-between lg:items-center bg-slate-800 text-white gap-4">
              <div className="flex-1">
                <div className="font-bold flex items-center text-lg">
                  <FolderTree className="w-6 h-6 mr-3 text-amber-400 shrink-0" /> 
                  <span>{dossier.name}</span>
                  <span className="ml-3 px-2 py-0.5 bg-white/20 rounded text-[10px] uppercase tracking-wider text-white shrink-0 whitespace-nowrap">Planification {dossier.startYear}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                <button 
                  onClick={() => { setTargetDossierId(dossier.id); setShowAddAxeModal(true); }}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 mr-1 inline" /> Ajouter un Axe
                </button>
                <button 
                  onClick={() => {
                    setFilterPTBADossier(dossier.id); setActiveTab('ptba'); setPtbaSection('programmation');
                  }} 
                  className="bg-white/20 hover:bg-white/30 text-white border border-white/40 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center transition-colors"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5" /> Voir PTBA
                </button>
                <button 
                  onClick={() => handleDeleteDossier(dossier.id)} 
                  className="p-1.5 bg-red-600/30 hover:bg-red-600/50 rounded-lg text-white" 
                  title="Supprimer le dossier"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-5 space-y-6">
              {dossier.axes && dossier.axes.length > 0 ? (
                dossier.axes.map(axe => {
                  const computedAxeBudget = (axe.projects || []).reduce((acc, proj) => acc + getProjectTotalBudget(proj, dossier.isReadOnly), 0);
                  return (
                    <div key={axe.id} className="bg-slate-50 border border-slate-200 rounded-lg p-4 group/axe relative">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-slate-200 pb-3 mb-4 gap-3">
                        <div className="flex items-center flex-1">
                          <Target className="w-5 h-5 mr-2 text-indigo-600 shrink-0" />
                          <h3 className="font-bold text-slate-800 text-sm md:text-base">{axe.name}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => { setTargetAxeId(axe.id); setShowAddProjectModal(true); }}
                            className="text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 px-2.5 py-1.5 rounded font-bold transition-colors"
                          >
                            <Plus className="w-3 h-3 mr-1 inline" /> Ajouter Projet
                          </button>
                          <div className="text-xs bg-white border border-slate-300 text-slate-700 font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center">
                            <DollarSign className="w-3.5 h-3.5 mr-0.5 text-green-500" />
                            <span>Budget consolidé : {computedAxeBudget} {orgConfig.currency}</span>
                          </div>
                        </div>
                      </div>

                      {axe.projects && axe.projects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {axe.projects.map(proj => {
                            const projBudget = getProjectTotalBudget(proj, dossier.isReadOnly);
                            return (
                              <div key={proj.id} className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative">
                                <div className="mb-4">
                                  <h4 className="font-bold text-slate-700 text-sm mb-2 leading-snug">{proj.name}</h4>
                                  <div className="text-xs text-slate-500 flex items-center mt-2 bg-slate-50 px-2 py-1.5 rounded border border-slate-100 w-max mb-3">
                                    Budget consolidé : <strong className="ml-1 text-slate-700">{projBudget} {orgConfig.currency}</strong>
                                  </div>
                                  <div className="grid grid-cols-3 gap-1.5">
                                    {['2025', '2026', '2027'].map(year => (
                                      <div key={year} className="bg-slate-50 rounded border border-slate-100 p-1.5 flex flex-col items-center">
                                        <span className="text-[9px] font-bold text-slate-400 mb-0.5">{year}</span>
                                        <span className="font-bold text-xs text-slate-800">
                                          {(proj.budgetsAnnuels && proj.budgetsAnnuels[year]) ? `${proj.budgetsAnnuels[year]} ${orgConfig.shortName || 'u'}` : '-'}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <button 
                                  onClick={() => { 
                                    setFilterPTBADossier(dossier.id); setFilterPTBAAxe(axe.id); setFilterPTBAProj(proj.id); setActiveTab('ptba'); setPtbaSection('programmation');
                                  }}
                                  className="w-full text-xs bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 py-2 rounded-lg font-bold flex items-center justify-center transition-colors cursor-pointer"
                                >
                                  <Activity className="w-3.5 h-3.5 mr-1.5 text-indigo-500" /> Plan de Travail & Suivi (GAR)
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">Aucun projet opérationnel rattaché à cet axe.</p>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-slate-400 italic">
                  Aucun axe de travail pour le moment. Cliquez sur "Ajouter un Axe" pour démarrer l'arborescence.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // --- RENDU : VUES PTBA (CADRAGE, PROGRAMMATION, MARCHÉS, SUIVI GAR) ---
  const renderPTBA = () => {
    let allAxes: Array<Axe & { isReadOnly?: boolean; dossierName: string }> = [];
    data.forEach(d => { 
      if (filterPTBADossier === 'FULL' || d.id === filterPTBADossier) {
        if (d.axes) d.axes.forEach(a => allAxes.push({...a, isReadOnly: d.isReadOnly, dossierName: d.name}));
      }
    });

    if (filterPTBAAxe !== 'FULL') allAxes = allAxes.filter(a => a.id === filterPTBAAxe);
    const isAllYears = filterPTBAYear === 'ALL';

    const chartData: Array<{ name: string; value: number }> = [];
    allAxes.forEach(axe => {
      let axeTotal = 0;
      (axe.projects || []).forEach(proj => {
        axeTotal += getProjectAnnualBudget(proj, filterPTBAYear, axe.isReadOnly);
      });
      if(axeTotal > 0) chartData.push({ name: axe.name.substring(0, 30) + '...', value: axeTotal });
    });

    return (
      <div className="animate-in fade-in duration-500 pb-10 flex flex-col h-full">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start border-b pb-2 border-slate-200 shrink-0 mb-4 gap-2">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center">
              <FileSpreadsheet className="w-6 h-6 mr-2 text-indigo-600" /> 
              PTBA - {isAllYears ? 'Programme Triennal Consolidé' : `Exercice Budgétaire ${filterPTBAYear}`}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Planification globale de la structure : <strong>{orgConfig.name}</strong> ({orgConfig.sigle})
            </p>
          </div>
        </div>

        {/* Sous-Onglets d'Analyse du PTBA */}
        <div className="flex flex-wrap gap-1.5 mb-4 border-b border-slate-200 pb-2 shrink-0">
          <button onClick={() => setPtbaSection('cadrage')} className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-colors flex items-center cursor-pointer ${ptbaSection === 'cadrage' ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600' : 'text-slate-500 hover:bg-slate-100'}`}>
            <PieChartIcon className="w-4 h-4 mr-1.5" /> I. Synthèse & Cadrage
          </button>
          <button onClick={() => setPtbaSection('programmation')} className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-colors flex items-center cursor-pointer ${ptbaSection === 'programmation' ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600' : 'text-slate-500 hover:bg-slate-100'}`}>
            <Layout className="w-4 h-4 mr-1.5" /> II. Matrice de Programmation
          </button>
          <button onClick={() => setPtbaSection('ppm')} className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-colors flex items-center cursor-pointer ${ptbaSection === 'ppm' ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600' : 'text-slate-500 hover:bg-slate-100'}`}>
            <ShoppingCart className="w-4 h-4 mr-1.5" /> III. Plan de Passation des Marchés
          </button>
          <button onClick={() => setPtbaSection('suivi')} className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-colors flex items-center cursor-pointer ${ptbaSection === 'suivi' ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600' : 'text-slate-500 hover:bg-slate-100'}`}>
            <CheckSquare className="w-4 h-4 mr-1.5" /> IV. Indicateurs de Performance (GAR)
          </button>
        </div>

        {/* Filtres contextuels */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-4 shrink-0">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center"><Calendar className="w-3 h-3 mr-1" /> Exercice cible</label>
            <select className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-xs font-medium rounded-lg p-2" value={filterPTBAYear} onChange={(e) => setFilterPTBAYear(e.target.value)}>
              <option value="ALL">Consolidé Triennal</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center"><Filter className="w-3 h-3 mr-1" /> Filtrer par Axe</label>
            <select className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-xs font-medium rounded-lg p-2" value={filterPTBAAxe} onChange={(e) => { setFilterPTBAAxe(e.target.value); setFilterPTBAProj('FULL'); }}>
              <option value="FULL">Tous les axes</option>
              {data.flatMap(d=>d.axes||[]).map(a=><option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center"><FolderTree className="w-3 h-3 mr-1" /> Filtrer par Projet</label>
            <select className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-xs font-medium rounded-lg p-2" value={filterPTBAProj} onChange={(e) => setFilterPTBAProj(e.target.value)}>
              <option value="FULL">Tous les projets rattachés</option>
              {ptbaAvailableProjects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        </div>

        {/* Section Cadrage */}
        {ptbaSection === 'cadrage' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Alignement Stratégique (Gestion Axée sur les Résultats)</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  Le présent Plan de Travail et de Budget Annuel (PTBA) opérationnalise la vision de développement de <strong>{orgConfig.name}</strong> pour {isAllYears ? 'la période triennale' : `l'exercice ${filterPTBAYear}`}. Chaque dépense ou investissement est rigoureusement rattaché à une composante technique visant la réalisation physique d'objectifs quantifiables.
                </p>
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
                  <h4 className="font-bold text-slate-800 text-sm mb-2">Orientations et Priorités du Management</h4>
                  <ul className="list-disc list-inside text-xs text-slate-600 space-y-1.5">
                    <li>Optimisation des process métiers par l'intégration d'outils digitaux.</li>
                    <li>Maîtrise rigoureuse des délais contractuels d'exécution.</li>
                    <li>Souveraineté financière et diversification des partenaires de financement.</li>
                    <li>Suivi transparent des flux financiers par l'approche de la Valeur Acquise.</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h3 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Répartition des Allocations Budgétaires ({filterPTBAYear})</h3>
                <div className="text-3xl font-black text-indigo-700 mb-4">
                  {fmtBudget(chartData.reduce((a,b)=>a+b.value,0))} <span className="text-sm font-semibold text-slate-500">{orgConfig.currency}</span>
                </div>
                
                {chartData.length > 0 ? (
                  <div className="w-full h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value">
                          {chartData.map((_, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                        </Pie>
                        <RechartsTooltip formatter={(value) => `${fmtBudget(value as number)} ${orgConfig.currency}`} />
                        <Legend wrapperStyle={{ fontSize: '10px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 italic">Aucune donnée financière disponible pour cette combinaison de filtres.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Section Programmation */}
        {ptbaSection === 'programmation' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden flex-1">
            <div className="overflow-x-auto relative max-h-[600px] hide-scrollbar flex-1">
              <table className="w-full text-left text-xs md:text-sm whitespace-nowrap">
                <thead className="bg-slate-800 text-white text-xs shadow-md sticky top-0 z-40">
                  <tr>
                    <th className="px-4 py-3 border-b border-slate-700 border-r border-slate-600 sticky left-0 bg-slate-800 z-50 w-[280px] min-w-[280px] max-w-[280px] whitespace-normal">Axes / Projets / Itinéraire Technique (Tâches)</th>
                    <th className="px-4 py-3 border-b border-slate-700 border-r text-center">Calendrier</th>
                    <th className="px-4 py-3 border-b border-slate-700 border-r text-center">Intervenant Principal</th>
                    <th className="px-4 py-3 border-b border-slate-700 border-r text-center bg-indigo-900/50 text-indigo-100">Coût Prévu Global</th>
                    {isAllYears ? (
                      <><th className="px-4 py-3 text-center border-r border-slate-700">Alloc. 2025</th><th className="px-4 py-3 text-center border-r border-slate-700">Alloc. 2026</th><th className="px-4 py-3 text-center border-slate-700">Alloc. 2027</th></>
                    ) : (
                      <><th className="px-4 py-3 text-center border-r border-slate-700 bg-blue-900/50 text-blue-100">Prog. {filterPTBAYear}</th><th className="px-4 py-3 text-center border-r border-slate-700">Q1 (Trim.)</th><th className="px-4 py-3 text-center border-r border-slate-700">Q2 (Trim.)</th><th className="px-4 py-3 text-center border-r border-slate-700">Q3 (Trim.)</th><th className="px-4 py-3 text-center border-slate-700">Q4 (Trim.)</th></>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-150">
                  {allAxes.map(axe => {
                    let axeProjects = axe.projects || [];
                    if (filterPTBAProj !== 'FULL') axeProjects = axeProjects.filter(p => p.id === filterPTBAProj);
                    if (axeProjects.length === 0) return null;

                    return (
                      <React.Fragment key={axe.id}>
                        <tr className="bg-slate-700 text-indigo-300">
                          <td colSpan={10} className="px-4 py-2.5 font-extrabold text-xs uppercase tracking-wider sticky left-0 z-30">{axe.name}</td>
                        </tr>
                        {axeProjects.map(proj => {
                          const sortedTasks = [...(proj.tasks || [])].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
                          const tasksInYear = sortedTasks.filter(t => {
                            const sY = t.startDate ? t.startDate.substring(0,4) : '9999';
                            const eY = t.endDate ? t.endDate.substring(0,4) : '0000';
                            return isAllYears ? (eY >= '2025' && sY <= '2027') : (sY <= filterPTBAYear && eY >= filterPTBAYear);
                          });
                          
                          if (tasksInYear.length === 0) {
                            return (
                              <tr key={proj.id} className="bg-slate-100/50">
                                <td className="px-4 py-3 text-slate-500 italic font-bold sticky left-0 bg-slate-100/50 z-20 w-[280px] min-w-[280px] max-w-[280px] whitespace-normal">
                                  {proj.name}
                                </td>
                                <td colSpan={9} className="px-4 py-3 text-center text-xs text-slate-400">Aucune activité budgétisée pour cet intervalle.</td>
                              </tr>
                            );
                          }
                          
                          let pVP = 0, pY = 0, pQ1 = 0, pQ2 = 0, pQ3 = 0, pQ4 = 0, p25 = 0, p26 = 0, p27 = 0;
                          const ptTasks = tasksInYear.map((t, idx) => {
                            const vp = Number(t.coutPlanifie) || 0;
                            const totalD = Math.max(1, (new Date(t.endDate).getTime() - new Date(t.startDate).getTime()) / 86400000 + 1);
                            let q1=0,q2=0,q3=0,q4=0,y=0, y25=0,y26=0,y27=0;
                            
                            if(isAllYears) {
                              y25 = vp * (getYearOverlapDays(t.startDate, t.endDate, '2025') / totalD);
                              y26 = vp * (getYearOverlapDays(t.startDate, t.endDate, '2026') / totalD);
                              y27 = vp * (getYearOverlapDays(t.startDate, t.endDate, '2027') / totalD);
                            } else {
                              q1 = vp * (getQuarterOverlapDays(t.startDate, t.endDate, filterPTBAYear, 0)/totalD);
                              q2 = vp * (getQuarterOverlapDays(t.startDate, t.endDate, filterPTBAYear, 1)/totalD);
                              q3 = vp * (getQuarterOverlapDays(t.startDate, t.endDate, filterPTBAYear, 2)/totalD);
                              q4 = vp * (getQuarterOverlapDays(t.startDate, t.endDate, filterPTBAYear, 3)/totalD);
                              y = q1+q2+q3+q4;
                            }
                            pVP+=vp; pY+=y; pQ1+=q1; pQ2+=q2; pQ3+=q3; pQ4+=q4; p25+=y25; p26+=y26; p27+=y27;
                            return { ...t, num: idx+1, vp, y, q1,q2,q3,q4, y25,y26,y27 };
                          });

                          return (
                            <React.Fragment key={proj.id}>
                              <tr className="bg-slate-200 border-b border-slate-300 font-bold text-slate-800">
                                <td className="px-4 py-2 sticky left-0 bg-slate-200 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] w-[280px] min-w-[280px] max-w-[280px] whitespace-normal">
                                  <div className="flex items-start"><Folder className="w-4 h-4 mr-2 text-slate-600 mt-0.5 shrink-0" /><span>{proj.name}</span></div>
                                </td>
                                <td className="px-4 py-2 text-center text-slate-500">-</td>
                                <td className="px-4 py-2 text-center text-slate-500">-</td>
                                <td className="px-4 py-2 text-center font-bold text-indigo-800 bg-indigo-100/50 border-x border-slate-300">{fmtBudget(pVP)} {orgConfig.sigle}</td>
                                {isAllYears ? (
                                  <><td className="text-center font-bold">{fmtBudget(p25)} {orgConfig.sigle}</td><td className="text-center font-bold">{fmtBudget(p26)} {orgConfig.sigle}</td><td className="text-center font-bold">{fmtBudget(p27)} {orgConfig.sigle}</td></>
                                ) : (
                                  <><td className="text-center font-bold bg-blue-100/50 text-blue-800">{fmtBudget(pY)} {orgConfig.sigle}</td><td className="text-center font-bold">{fmtBudget(pQ1)} {orgConfig.sigle}</td><td className="text-center font-bold">{fmtBudget(pQ2)} {orgConfig.sigle}</td><td className="text-center font-bold">{fmtBudget(pQ3)} {orgConfig.sigle}</td><td className="text-center font-bold">{fmtBudget(pQ4)} {orgConfig.sigle}</td></>
                                )}
                              </tr>
                              {ptTasks.map(t => (
                                <tr key={t.id} className="hover:bg-slate-50 text-[11px] md:text-xs border-b border-slate-100">
                                  <td className="px-6 py-2.5 font-medium text-slate-700 sticky left-0 bg-white z-10 whitespace-normal">
                                    <div className="flex items-start">
                                      <span className="w-8 shrink-0 text-[9px] text-indigo-600 font-bold mt-0.5">AC-{t.num}</span>
                                      <span>{t.name}</span>
                                    </div>
                                  </td>
                                  <td className="text-center text-slate-500 whitespace-nowrap">{t.startDate} au {t.endDate}</td>
                                  <td className="text-center text-slate-600">{t.assignee || 'Non assigné'}</td>
                                  <td className="text-center font-semibold text-slate-800 bg-slate-50/50">{fmtBudget(t.vp)}</td>
                                  {isAllYears ? (
                                    <><td className="text-center text-slate-600">{t.y25>0?fmtBudget(t.y25):'-'}</td><td className="text-center text-slate-600">{t.y26>0?fmtBudget(t.y26):'-'}</td><td className="text-center text-slate-600">{t.y27>0?fmtBudget(t.y27):'-'}</td></>
                                  ) : (
                                    <><td className="text-center font-bold text-blue-700 bg-blue-50/10">{t.y>0?fmtBudget(t.y):'-'}</td><td className="text-center text-slate-600">{t.q1>0?fmtBudget(t.q1):'-'}</td><td className="text-center text-slate-600">{t.q2>0?fmtBudget(t.q2):'-'}</td><td className="text-center text-slate-600">{t.q3>0?fmtBudget(t.q3):'-'}</td><td className="text-center text-slate-600">{t.q4>0?fmtBudget(t.q4):'-'}</td></>
                                  )}
                                </tr>
                              ))}
                            </React.Fragment>
                          );
                        })}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Section PPM */}
        {ptbaSection === 'ppm' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden flex-1">
             <div className="p-4 bg-amber-50 border-b border-amber-100 flex items-start text-xs text-amber-800">
               <AlertTriangle className="w-4 h-4 mr-2 shrink-0 mt-0.5 text-amber-600" />
               <p>Cette matrice filtre automatiquement les acquisitions identifiées par des étapes de passations (DAO, Avis de consultations, Contrats) dans l'itinéraire des projets pour dresser le <strong>Plan de Passation des Marchés (PPM)</strong> réglementaire.</p>
             </div>
             <div className="overflow-x-auto relative max-h-[500px] hide-scrollbar flex-1">
              <table className="w-full text-left text-xs md:text-sm whitespace-nowrap">
                <thead className="bg-slate-800 text-white text-xs sticky top-0">
                  <tr>
                    <th className="px-4 py-3 border-r border-slate-700">Projet Référent</th>
                    <th className="px-4 py-3 border-r border-slate-700">Composante de Marché (Extrait Itinéraire)</th>
                    <th className="px-4 py-3 border-r border-slate-700 text-center">Processus préconisé</th>
                    <th className="px-4 py-3 border-r border-slate-700 text-center">Lancement estimé</th>
                    <th className="px-4 py-3 text-center">Enveloppe estimée ({orgConfig.currency})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150">
                  {allAxes.flatMap(a => a.projects || []).map(proj => {
                     const procTasks = (proj.tasks || []).filter(t => 
                       t.name.toLowerCase().includes('dao') || 
                       t.name.toLowerCase().includes('ami') || 
                       t.name.toLowerCase().includes('marché') ||
                       t.name.toLowerCase().includes('contrat') ||
                       t.name.toLowerCase().includes('consultation') ||
                       t.phase === 'PLANIFICATION'
                     ).filter(t => t.startDate.substring(0,4) === filterPTBAYear || isAllYears);

                     if(procTasks.length === 0) return null;

                     return procTasks.map((t, i) => (
                       <tr key={t.id} className="hover:bg-slate-50">
                         {i === 0 && <td rowSpan={procTasks.length} className="px-4 py-3 font-bold text-xs bg-slate-50 border-r border-slate-200 whitespace-normal w-1/4 text-slate-800">{proj.name}</td>}
                         <td className="px-4 py-3 border-r border-slate-100 text-xs whitespace-normal text-slate-700">{t.name}</td>
                         <td className="px-4 py-3 border-r border-slate-100 text-center text-xs">
                           <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-semibold">Consultation / Marché Public</span>
                         </td>
                         <td className="px-4 py-3 border-r border-slate-100 text-center text-xs text-slate-500">{t.startDate}</td>
                         <td className="px-4 py-3 text-center font-bold text-indigo-700 bg-indigo-50/10">{t.coutPlanifie > 0 ? `${fmtBudget(t.coutPlanifie)} ${orgConfig.sigle}` : 'Compris dans le projet'}</td>
                       </tr>
                     ));
                  })}
                </tbody>
              </table>
             </div>
          </div>
        )}

        {/* Section Suivi GAR / Indicateurs */}
        {ptbaSection === 'suivi' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden flex-1">
             <div className="p-4 bg-green-50 border-b border-green-100 flex items-start text-xs text-green-800">
               <Target className="w-4 h-4 mr-2 shrink-0 mt-0.5 text-green-600" />
               <p>Le <strong>Cadre de Mesure du Rendement (CMR)</strong> de l'organisation met en lien les allocations de trésorerie avec la livraison effective des produits (Extrants). Voici la matrice d'indicateurs reliée à vos chantiers.</p>
             </div>
             <div className="overflow-x-auto relative max-h-[500px] hide-scrollbar flex-1">
              <table className="w-full text-left text-xs md:text-sm whitespace-nowrap">
                <thead className="bg-slate-800 text-white text-xs sticky top-0">
                  <tr>
                    <th className="px-4 py-3 border-r border-slate-700 w-1/3">Programme & Projet</th>
                    <th className="px-4 py-3 border-r border-slate-700 w-1/3">Indicateur Clé d'Extrant (Livrable)</th>
                    <th className="px-4 py-3 border-r border-slate-700 text-center">Cible {filterPTBAYear !== 'ALL' ? filterPTBAYear : 'Triennale'}</th>
                    <th className="px-4 py-3 text-center">Mécanisme de Suivi et Preuve</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150">
                  {allAxes.map(axe => {
                    const axeProjects = (axe.projects || []).filter(p => filterPTBAProj === 'FULL' || p.id === filterPTBAProj);
                    if(axeProjects.length === 0) return null;
                    return (
                      <React.Fragment key={`cmr-${axe.id}`}>
                        <tr className="bg-slate-200 text-slate-800"><td colSpan={4} className="px-4 py-2 font-extrabold text-xs uppercase">{axe.name}</td></tr>
                        {axeProjects.map(proj => {
                          let indicateur = "Taux d'achèvement physique consolidé des phases (%)";
                          let cible = "100%";
                          if(proj.name.toLowerCase().includes('réseau') || proj.name.toLowerCase().includes('infrastructure')) { indicateur = "Kilomètres d'axes logistiques réhabilités"; cible = "25 km"; }
                          if(proj.name.toLowerCase().includes('eau') || proj.name.toLowerCase().includes('forage')) { indicateur = "Nombre d'ouvrages hydrauliques et de pompes opérationnels"; cible = "10 stations"; }
                          if(proj.name.toLowerCase().includes('formation') || proj.name.toLowerCase().includes('incubation')) { indicateur = "Nombre d'apprenants certifiés issus du programme"; cible = "150 talents"; }

                          return (
                            <tr key={`cmr-proj-${proj.id}`} className="hover:bg-slate-50 text-xs">
                              <td className="px-4 py-3.5 border-r border-slate-200 whitespace-normal font-bold text-slate-700 border-l-4 border-l-green-500 pl-3"><strong>{proj.name}</strong></td>
                              <td className="px-4 py-3.5 border-r border-slate-200 whitespace-normal text-slate-600">{indicateur}</td>
                              <td className="px-4 py-3.5 border-r border-slate-200 text-center font-bold text-green-700 bg-green-50/10">{cible}</td>
                              <td className="px-4 py-3.5 text-center text-slate-500">Procès-verbaux de livraison et rapports de suivi trimestriels</td>
                            </tr>
                          );
                        })}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
             </div>
          </div>
        )}

      </div>
    );
  };

  // --- RENDU : SUIVI OPÉRATIONNEL & SUIVI DES COÛTS (EVM / VALEUR ACQUISE) ---
  const renderProcessus = () => {
    const filteredProjects = allProjects.filter(p => 
      (filterProcessusDossier === 'FULL' || p.dossierId === filterProcessusDossier) &&
      (filterProcessusAxe === 'FULL' || p.axeId === filterProcessusAxe) &&
      (filterProcessusProj === 'FULL' || p.id === filterProcessusProj)
    );

    const enrichedProjects = filteredProjects.map(project => {
      const groups = STANDARD_PHASES.map(phaseName => {
        const items = Array.isArray(project.tasks) ? project.tasks.filter(t => {
          if (t.phase !== phaseName) return false;
          if (filterProcessusYear !== 'ALL') {
            const sY = t.startDate ? t.startDate.substring(0,4) : '9999';
            const eY = t.endDate ? t.endDate.substring(0,4) : '0000';
            if (!(sY <= filterProcessusYear && eY >= filterProcessusYear)) return false;
          }
          return true;
        }).sort((a,b)=>new Date(a.startDate).getTime() - new Date(b.startDate).getTime()).map((t, idx) => {
          const vp = Number(t.coutPlanifie) || 0; 
          const cr = Number(t.coutReel) || 0;
          const va = t.valeurAcquise !== undefined ? Number(t.valeurAcquise) : (t.status === 'Terminé' ? vp : 0);
          return { ...t, number: idx + 1, vp, va, cr, ec: va-cr, ed: va-vp, isBlocked: t.status==='Bloqué' };
        }) : [];
        return { phase: phaseName, items };
      });
      return { ...project, groups };
    });

    return (
      <div className="animate-in fade-in duration-500 pb-10 flex flex-col h-full">
        <div className="flex justify-between items-center border-b pb-2 border-slate-200 mb-4 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center">
              <Activity className="w-6 h-6 mr-2 text-indigo-600" /> Suivi Physique-Financier de l'Organisme (EVM / Valeur Acquise)
            </h2>
            <p className="text-xs text-slate-500 mt-1">Gérez l'état d'avancement des livrables et mesurez les écarts budgétaires réels</p>
          </div>
        </div>

        {/* Filtres Processus */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-4 shrink-0">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center"><Calendar className="w-3 h-3 mr-1" /> Année cible</label>
            <select className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-xs font-medium rounded-lg p-2" value={filterProcessusYear} onChange={(e) => setFilterProcessusYear(e.target.value)}>
              <option value="ALL">Consolidé Triennal</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center"><Filter className="w-3 h-3 mr-1" /> Filtrer par Axe</label>
            <select className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-xs font-medium rounded-lg p-2" value={filterProcessusAxe} onChange={(e) => { setFilterProcessusAxe(e.target.value); setFilterProcessusProj('FULL'); }}>
              <option value="FULL">Tous les axes</option>
              {data.flatMap(d=>d.axes||[]).map(a=><option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center"><FolderTree className="w-3 h-3 mr-1" /> Filtrer par Projet</label>
            <select className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-xs font-medium rounded-lg p-2" value={filterProcessusProj} onChange={(e) => setFilterProcessusProj(e.target.value)}>
              <option value="FULL">Tous les projets rattachés</option>
              {allProjects.filter(p=>filterProcessusAxe==='FULL'||p.axeId===filterProcessusAxe).map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        </div>

        {/* Table de Pilotage EVM */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden mb-6 flex-1">
          <div className="overflow-x-auto overflow-y-auto max-h-[600px] flex-1 hide-scrollbar">
            <table className="w-full text-left text-xs md:text-sm whitespace-nowrap">
              <thead className="bg-slate-800 text-white text-xs sticky top-0 z-40">
                <tr>
                  <th className="px-2 py-3 border-r border-slate-700 sticky left-0 bg-slate-800 z-50 text-center w-[90px]">Code</th>
                  <th className="px-3 py-3 border-r border-slate-700 sticky left-[90px] bg-slate-800 z-50 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.3)] w-[250px] whitespace-normal">Libellé de l'Activité (Canevas de Tâche)</th>
                  <th className="px-3 py-3 border-r border-slate-700 text-center">Dates Calendrier</th>
                  <th className="px-3 py-3 border-r border-slate-700 text-center">État d'avancement</th>
                  <th className="px-3 py-3 border-r border-slate-700 text-center bg-blue-900/50 text-blue-200">VP (Prévu)</th>
                  <th className="px-3 py-3 border-r border-slate-700 text-center bg-green-900/50 text-green-200">VA (Acquis)</th>
                  <th className="px-3 py-3 border-r border-slate-700 text-center bg-orange-900/50 text-orange-200">CR (Réel)</th>
                  <th className="px-3 py-3 border-r border-slate-700 text-center" title="Écart de Coût (VA - CR)">Écart Financier</th>
                  <th className="px-3 py-3 text-center sticky right-0 bg-slate-800 z-50">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {enrichedProjects.map(project => (
                  <React.Fragment key={project.id}>
                    <tr className="bg-slate-100 font-extrabold text-slate-800 text-xs">
                      <td colSpan={9} className="px-4 py-2 sticky left-0 z-10"><FolderTree className="w-4 h-4 inline mr-2 text-slate-500" />{project.name}</td>
                    </tr>
                    {project.groups.map((g, idx) => {
                      return (
                        <React.Fragment key={`${project.id}-${idx}`}>
                          <tr className="bg-slate-700 text-indigo-200 font-bold text-xs">
                            <td colSpan={9} className="px-4 py-1.5 uppercase sticky left-0 z-10">
                              <div className="flex justify-between items-center">
                                <span>{g.phase}</span>
                                <button 
                                  onClick={() => handleAddTask(project.id, g.phase)} 
                                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1 rounded text-[10px] font-bold flex items-center transition-colors cursor-pointer"
                                >
                                  <Plus className="w-3.5 h-3.5 mr-1" /> Planifier Tâche
                                </button>
                              </div>
                            </td>
                          </tr>
                          
                          {/* Formulaire dynamique inline d'ajout/modification */}
                          {editingTaskId && editingProjectId === project.id && editingPhase === g.phase && (
                            <tr className="bg-indigo-50 border-2 border-indigo-300">
                              <td colSpan={9} className="p-4 sticky left-0 bg-indigo-50">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                  <div className="col-span-2">
                                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Désignation de la Tâche</label>
                                    <input 
                                      className="w-full p-2 border rounded text-xs bg-white" 
                                      value={editFormData.name || ''} 
                                      onChange={e=>setEditFormData({...editFormData, name: e.target.value})} 
                                      placeholder="Ex: Conception de la charte de formation..." 
                                      autoFocus
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Pilote / Responsable</label>
                                    <input 
                                      className="w-full p-2 border rounded text-xs bg-white" 
                                      value={editFormData.assignee || ''} 
                                      onChange={e=>setEditFormData({...editFormData, assignee: e.target.value})} 
                                      placeholder="Ex: Directeur Technique" 
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Structure Trésorerie</label>
                                    <input 
                                      className="w-full p-2 border rounded text-xs bg-white" 
                                      value={editFormData.responsableTresorerie || ''} 
                                      onChange={e=>setEditFormData({...editFormData, responsableTresorerie: e.target.value})} 
                                      placeholder="Ex: Fonds Propres / Banque" 
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Date de début</label>
                                    <input 
                                      type="date" 
                                      className="w-full p-2 border rounded text-xs bg-white" 
                                      value={editFormData.startDate || ''} 
                                      onChange={e=>setEditFormData({...editFormData, startDate: e.target.value})}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Date d'échéance</label>
                                    <input 
                                      type="date" 
                                      className="w-full p-2 border rounded text-xs bg-white" 
                                      value={editFormData.endDate || ''} 
                                      onChange={e=>setEditFormData({...editFormData, endDate: e.target.value})}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Statut d'avancement</label>
                                    <select 
                                      className="w-full p-2 border rounded text-xs bg-white" 
                                      value={editFormData.status || 'À faire'} 
                                      onChange={e=>setEditFormData({...editFormData, status: e.target.value})}
                                    >
                                      <option>À faire</option>
                                      <option>En cours</option>
                                      <option>Terminé</option>
                                      <option>Bloqué</option>
                                    </select>
                                  </div>
                                  {editFormData.status === 'Bloqué' && (
                                    <div>
                                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Justificatif de blocage</label>
                                      <input 
                                        className="w-full p-2 border border-red-300 rounded text-xs bg-red-50 text-red-700" 
                                        value={editFormData.motifBlocage || ''} 
                                        onChange={e=>setEditFormData({...editFormData, motifBlocage: e.target.value})}
                                        placeholder="Ex: En attente d'arbitrage..."
                                      />
                                    </div>
                                  )}

                                  <div className="col-span-1 md:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-indigo-200">
                                    <div>
                                      <label className="block text-[10px] font-bold text-blue-700 mb-1">Budget Prévu (VP) en {orgConfig.currency}</label>
                                      <input 
                                        type="number" 
                                        className="w-full p-2 border border-blue-200 rounded text-xs bg-blue-50/50 font-bold text-blue-800" 
                                        value={editFormData.coutPlanifie !== undefined ? editFormData.coutPlanifie : ''} 
                                        onChange={e=>setEditFormData({...editFormData, coutPlanifie: Number(e.target.value)})} 
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[10px] font-bold text-green-700 mb-1">Valeur Physique Acquise (VA)</label>
                                      <input 
                                        type="number" 
                                        className="w-full p-2 border border-green-200 rounded text-xs bg-green-50/50 font-bold text-green-800" 
                                        value={editFormData.valeurAcquise !== undefined ? editFormData.valeurAcquise : ''} 
                                        onChange={e=>setEditFormData({...editFormData, valeurAcquise: Number(e.target.value)})} 
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[10px] font-bold text-orange-700 mb-1">Coût Réel Décaissé (CR)</label>
                                      <input 
                                        type="number" 
                                        className="w-full p-2 border border-orange-200 rounded text-xs bg-orange-50/50 font-bold text-orange-800" 
                                        value={editFormData.coutReel !== undefined ? editFormData.coutReel : ''} 
                                        onChange={e=>setEditFormData({...editFormData, coutReel: Number(e.target.value)})} 
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="flex justify-end gap-2 mt-4">
                                  <button onClick={() => setEditingTaskId(null)} className="px-4 py-2 bg-slate-300 hover:bg-slate-400 text-slate-800 font-bold rounded-lg text-xs transition-colors cursor-pointer">
                                    Annuler
                                  </button>
                                  <button onClick={handleSaveTask} className={`px-4 py-2 ${currentTheme.primaryBg} text-white font-bold rounded-lg text-xs transition-colors flex items-center cursor-pointer`}>
                                    <CheckCircle className="w-4 h-4 mr-1.5" /> Enregistrer l'activité
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )}

                          {g.items.map(t => {
                            if (editingTaskId === t.id) return null;
                            return (
                              <tr key={t.id} className="hover:bg-slate-50 text-xs border-b border-slate-100 group">
                                <td className="px-2 py-3 text-center sticky left-0 bg-white group-hover:bg-slate-50 z-30 font-bold text-slate-500 border-r border-slate-200">AC-{t.number}</td>
                                <td className="px-3 py-3 sticky left-[90px] bg-white group-hover:bg-slate-50 z-30 font-medium text-slate-800 border-r border-slate-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] whitespace-normal">
                                  <div>
                                    <div className="font-semibold text-slate-800">{t.name}</div>
                                    <div className="text-[10px] text-slate-500 mt-0.5 flex gap-2">
                                      <span>Resp : <strong className="text-slate-700">{t.assignee || 'Non désigné'}</strong></span>
                                      <span>• Fin. : <strong className="text-slate-700">{t.responsableTresorerie || '—'}</strong></span>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-3 py-3 text-center border-r border-slate-200 text-slate-500">{t.startDate} au {t.endDate}</td>
                                <td className="px-3 py-3 text-center border-r border-slate-200">
                                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${t.status==='Terminé'?'bg-emerald-100 text-emerald-700':t.status==='Bloqué'?'bg-red-100 text-red-700':'bg-blue-100 text-blue-700'}`}>
                                    {t.status}
                                  </span>
                                </td>
                                <td className="px-3 py-3 text-center border-r border-slate-200 font-bold text-blue-700 bg-blue-50/10">{t.vp}</td>
                                <td className="px-3 py-3 text-center border-r border-slate-200 font-bold text-green-700 bg-green-50/10">{t.va}</td>
                                <td className="px-3 py-3 text-center border-r border-slate-200 font-bold text-orange-700 bg-orange-50/10">{t.cr}</td>
                                <td className={`px-3 py-3 text-center font-bold border-r border-slate-200 ${t.ec >= 0 ? 'text-green-600 bg-green-50/5' : 'text-red-600 bg-red-50/5'}`}>
                                  {t.ec > 0 ? '+' : ''}{t.ec}
                                </td>
                                <td className="px-2 py-2 text-center sticky right-0 bg-white group-hover:bg-slate-50 border-l shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                                  <div className="flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEditTask(project.id, g.phase, t)} className="p-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 cursor-pointer" title="Éditer la tâche">
                                      <Edit3 className="w-3.5 h-3.5"/>
                                    </button>
                                    <button onClick={() => handleDeleteTask(project.id, t.id)} className="p-1 bg-red-50 text-red-600 rounded hover:bg-red-100 cursor-pointer" title="Supprimer la tâche">
                                      <Trash2 className="w-3.5 h-3.5"/>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </React.Fragment>
                      );
                    })}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // --- RENDU : VUE KANBAN ---
  const renderKanban = () => {
    const filteredProjects = allProjects.filter(p => 
      (filterKanbanAxe === 'FULL' || p.axeId === filterKanbanAxe) &&
      (filterKanbanProj === 'FULL' || p.id === filterKanbanProj)
    );

    const columns = ['À faire', 'En cours', 'Bloqué', 'Terminé'];
    const tasksByStatus: Record<string, Array<Task & { projectName: string; projectId: string; axeId: string }>> = {
      'À faire': [],
      'En cours': [],
      'Bloqué': [],
      'Terminé': []
    };

    filteredProjects.forEach(p => {
      (p.tasks || []).forEach(t => {
        if (filterKanbanYear !== 'ALL') {
          const sY = t.startDate ? t.startDate.substring(0,4) : '9999';
          const eY = t.endDate ? t.endDate.substring(0,4) : '0000';
          if (!(sY <= filterKanbanYear && eY >= filterKanbanYear)) return;
        }
        const mappedTask = { ...t, projectName: p.name, projectId: p.id, axeId: p.axeId };
        if (tasksByStatus[t.status]) {
          tasksByStatus[t.status].push(mappedTask);
        } else {
          tasksByStatus['À faire'].push(mappedTask);
        }
      });
    });

    const statusStyles: Record<string, { bg: string; text: string; border: string }> = {
      'À faire': { bg: 'bg-slate-100/70', text: 'text-slate-700', border: 'border-slate-300' },
      'En cours': { bg: 'bg-blue-50/70', text: 'text-blue-700', border: 'border-blue-300' },
      'Bloqué': { bg: 'bg-red-50/70', text: 'text-red-700', border: 'border-red-300' },
      'Terminé': { bg: 'bg-emerald-50/70', text: 'text-emerald-700', border: 'border-emerald-300' }
    };

    return (
      <div className="animate-in fade-in duration-500 pb-10 flex flex-col h-full">
        <div className="flex justify-between items-center border-b pb-2 border-slate-200 mb-4 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center"><Columns className="w-6 h-6 mr-2 text-indigo-500" /> Plan de Pilotage Agile (Kanban)</h2>
            <p className="text-xs text-slate-500 mt-1">Regroupez visuellement l'avancée de vos activités prioritaires</p>
          </div>
        </div>

        {/* Filtres Kanban */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-4 shrink-0">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center"><Calendar className="w-3 h-3 mr-1" /> Année</label>
            <select className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-xs font-medium rounded-lg p-2" value={filterKanbanYear} onChange={(e) => setFilterKanbanYear(e.target.value)}>
              <option value="ALL">Prog. Triennal</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center"><Filter className="w-3 h-3 mr-1" /> Filtrer par Axe</label>
            <select className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-xs font-medium rounded-lg p-2" value={filterKanbanAxe} onChange={(e) => { setFilterKanbanAxe(e.target.value); setFilterKanbanProj('FULL'); }}>
              <option value="FULL">Tous les axes</option>
              {data.flatMap(d=>d.axes||[]).map(a=><option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center"><FolderTree className="w-3 h-3 mr-1" /> Filtrer par Projet</label>
            <select className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-xs font-medium rounded-lg p-2" value={filterKanbanProj} onChange={(e) => setFilterKanbanProj(e.target.value)}>
              <option value="FULL">Tous les projets</option>
              {allProjects.filter(p=>filterKanbanAxe==='FULL'||p.axeId===filterKanbanAxe).map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        </div>

        <div className="flex-1 flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
          {columns.map(status => (
            <div 
              key={status} 
              className={`flex-1 min-w-[280px] rounded-xl border flex flex-col transition-all duration-200 ${statusStyles[status].bg} ${statusStyles[status].border} ${dragOverCol === status ? 'ring-2 ring-indigo-500 scale-[1.02] shadow-lg opacity-90' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragOverCol(status); }}
              onDragLeave={(e) => { e.preventDefault(); setDragOverCol(null); }}
              onDrop={(e) => handleDropTaskToKanban(e, status)}
            >
              <div className={`p-3 border-b font-bold flex justify-between items-center ${statusStyles[status].border} ${statusStyles[status].text}`}>
                <span className="text-xs uppercase tracking-wider">{status}</span>
                <span className="bg-white px-2 py-0.5 rounded-full text-xs shadow-sm font-black">{tasksByStatus[status].length}</span>
              </div>
              <div className="flex-1 p-3 overflow-y-auto space-y-3 hide-scrollbar max-h-[500px]">
                {tasksByStatus[status].map(task => (
                  <div 
                    key={task.id} 
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('application/json', JSON.stringify({ taskId: task.id, projectId: task.projectId, currentStatus: task.status }));
                      e.dataTransfer.effectAllowed = 'move';
                    }}
                    className="bg-white rounded-lg shadow-sm border border-slate-200 p-3 transition-all cursor-grab active:cursor-grabbing hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md"
                  >
                    <div className="text-[9px] font-bold text-indigo-600 mb-1 tracking-wider uppercase">{task.phase}</div>
                    <div className="font-semibold text-xs text-slate-800 leading-snug mb-2">{task.name}</div>
                    <div className="text-[10px] text-slate-500 mb-2 truncate" title={task.projectName}><Folder className="w-3 h-3 inline mr-1 text-slate-400" />{task.projectName}</div>
                    {task.status === 'Bloqué' && task.motifBlocage && (
                      <div className="bg-red-50 text-red-700 text-[10px] p-2 rounded border border-red-150 mb-2 italic">
                        <strong>Motif :</strong> {task.motifBlocage}
                      </div>
                    )}
                    <div className="flex justify-between items-center text-[10px] mt-2 pt-2 border-t border-slate-100">
                      <span className="flex items-center text-slate-500 font-medium"><Calendar className="w-3 h-3 mr-1" /> {task.startDate}</span>
                      <span className="font-bold text-slate-800">{fmtBudget(task.coutPlanifie)} {orgConfig.sigle}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // --- RENDU : DIAGRAMME DE GANTT CHRONOLOGIQUE ---
  const renderGantt = () => {
    const filteredProjects = allProjects.filter(p => 
      (filterGanttAxe === 'FULL' || p.axeId === filterGanttAxe) &&
      (filterGanttProj === 'FULL' || p.id === filterGanttProj)
    );

    const allGanttTasks: Array<Task & { projectName: string }> = [];
    filteredProjects.forEach(p => {
      (p.tasks || []).forEach(t => {
        if (filterGanttYear !== 'ALL') {
          const sY = t.startDate ? t.startDate.substring(0,4) : '9999';
          const eY = t.endDate ? t.endDate.substring(0,4) : '0000';
          if (!(sY <= filterGanttYear && eY >= filterGanttYear)) return;
        }
        allGanttTasks.push({ ...t, projectName: p.name });
      });
    });

    let minDate = new Date('2025-01-01').getTime();
    let maxDate = new Date('2027-12-31').getTime();

    if (filterGanttYear !== 'ALL') {
      minDate = new Date(`${filterGanttYear}-01-01`).getTime();
      maxDate = new Date(`${filterGanttYear}-12-31`).getTime();
    }

    if (allGanttTasks.length > 0) {
      const taskStarts = allGanttTasks.map(t => new Date(t.startDate).getTime()).filter(t => !isNaN(t) && t > 0);
      const taskEnds = allGanttTasks.map(t => new Date(t.endDate).getTime()).filter(t => !isNaN(t) && t > 0);
      if (taskStarts.length > 0) minDate = Math.min(...taskStarts) - (15 * 86400000);
      if (taskEnds.length > 0) maxDate = Math.max(...taskEnds) + (15 * 86400000);
    }
    const totalDuration = Math.max(1, maxDate - minDate);

    const months: Date[] = [];
    const current = new Date(minDate);
    current.setDate(1);
    while (current.getTime() <= maxDate) {
      months.push(new Date(current));
      current.setMonth(current.getMonth() + 1);
    }

    return (
      <div className="animate-in fade-in duration-500 pb-10 flex flex-col h-full">
        <div className="flex justify-between items-center border-b pb-2 border-slate-200 mb-4 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center"><AlignLeft className="w-6 h-6 mr-2 text-indigo-500" /> Planification Chronologique (Gantt)</h2>
            <p className="text-xs text-slate-500 mt-1">Analysez le chevauchement temporel des activités sur la frise</p>
          </div>
        </div>

        {/* Filtres Gantt */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-4 shrink-0">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center"><Calendar className="w-3 h-3 mr-1" /> Année d'observation</label>
            <select className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-xs font-medium rounded-lg p-2" value={filterGanttYear} onChange={(e) => setFilterGanttYear(e.target.value)}>
              <option value="ALL">Prog. Triennal</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center"><Filter className="w-3 h-3 mr-1" /> Filtrer par Axe</label>
            <select className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-xs font-medium rounded-lg p-2" value={filterGanttAxe} onChange={(e) => { setFilterGanttAxe(e.target.value); setFilterGanttProj('FULL'); }}>
              <option value="FULL">Tous les axes</option>
              {data.flatMap(d=>d.axes||[]).map(a=><option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center"><FolderTree className="w-3 h-3 mr-1" /> Filtrer par Projet</label>
            <select className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-xs font-medium rounded-lg p-2" value={filterGanttProj} onChange={(e) => setFilterGanttProj(e.target.value)}>
              <option value="FULL">Tous les projets</option>
              {allProjects.filter(p=>filterGanttAxe==='FULL'||p.axeId===filterGanttAxe).map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        </div>

        <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col relative max-h-[500px]">
          <div className="flex-1 overflow-auto hide-scrollbar flex">
            
            {/* Volet gauche (Intitulés) */}
            <div className="w-[280px] shrink-0 border-r border-slate-200 bg-white sticky left-0 z-20 flex flex-col">
              <div className="h-10 border-b border-slate-200 bg-slate-50 flex items-center px-4 font-bold text-xs text-slate-600">Composantes de Travail</div>
              <div className="flex-1 overflow-hidden">
                {filteredProjects.map(proj => {
                  const pTasks = (proj.tasks || [])
                    .filter(t => {
                      if (filterGanttYear === 'ALL') return true;
                      const sY = t.startDate ? t.startDate.substring(0,4) : '9999';
                      const eY = t.endDate ? t.endDate.substring(0,4) : '0000';
                      return sY <= filterGanttYear && eY >= filterGanttYear;
                    })
                    .sort((a,b)=>new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
                  if(pTasks.length === 0) return null;
                  return (
                    <React.Fragment key={`left-${proj.id}`}>
                      <div className="h-8 bg-slate-100 flex items-center px-3 text-xs font-extrabold text-slate-800 truncate" title={proj.name}>
                        <Folder className="w-3.5 h-3.5 mr-1.5 text-amber-500 shrink-0"/> {proj.name}
                      </div>
                      {pTasks.map(t => (
                        <div key={`left-t-${t.id}`} className="h-10 border-b border-slate-100 flex items-center px-4 text-xs text-slate-700 pl-8 truncate" title={t.name}>
                          {t.name}
                        </div>
                      ))}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Volet droit (Frise) */}
            <div className="flex-1 min-w-[800px] relative">
              <div className="h-10 border-b border-slate-200 bg-slate-50 flex relative">
                {months.map((m, i) => {
                  const left = ((m.getTime() - minDate) / totalDuration) * 100;
                  const displayLeft = Math.max(0, left);
                  return (
                    <div key={i} className="absolute h-full border-l border-slate-200 px-2 text-[9px] font-bold text-slate-500 pt-2" style={{ left: `${displayLeft}%` }}>
                      {m.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' })}
                    </div>
                  );
                })}
              </div>

              <div className="relative">
                {months.map((m, i) => {
                   const left = Math.max(0, ((m.getTime() - minDate) / totalDuration) * 100);
                   return <div key={`grid-${i}`} className="absolute top-0 bottom-0 border-l border-slate-100 pointer-events-none" style={{ left: `${left}%`, height: '1000px' }} />;
                })}

                {filteredProjects.map(proj => {
                  const pTasks = (proj.tasks || [])
                    .filter(t => {
                      if (filterGanttYear === 'ALL') return true;
                      const sY = t.startDate ? t.startDate.substring(0,4) : '9999';
                      const eY = t.endDate ? t.endDate.substring(0,4) : '0000';
                      return sY <= filterGanttYear && eY >= filterGanttYear;
                    })
                    .sort((a,b)=>new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
                  if(pTasks.length === 0) return null;
                  return (
                    <React.Fragment key={`right-${proj.id}`}>
                      <div className="h-8 bg-slate-50/40 w-full" />
                      {pTasks.map(t => {
                        const sTime = new Date(t.startDate).getTime();
                        const eTime = new Date(t.endDate).getTime();
                        const left = ((sTime - minDate) / totalDuration) * 100;
                        let width = ((eTime - sTime) / totalDuration) * 100;
                        if(width === 0) width = 0.5; 
                        
                        const colorClass = t.status === 'Terminé' ? 'bg-emerald-500' : t.status === 'Bloqué' ? 'bg-red-500' : 'bg-blue-500';

                        return (
                          <div key={`right-t-${t.id}`} className="h-10 border-b border-slate-100/50 relative flex items-center group">
                            <div 
                              className={`absolute h-5 rounded shadow-sm opacity-90 hover:opacity-100 cursor-pointer ${colorClass} transition-opacity`}
                              style={{ left: `${left}%`, width: `${width}%`, minWidth: '8px' }}
                              title={`${t.name}\nDu ${t.startDate} au ${t.endDate}\nStatut: ${t.status}`}
                            >
                              <span className="text-[9px] text-white font-bold ml-2 whitespace-nowrap overflow-hidden absolute inset-y-0 flex items-center drop-shadow">
                                {width > 8 && t.status}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased">
      {/* ALERTE FLOATING */}
      {customAlert && (
        <div className="fixed bottom-4 right-4 z-50 animate-bounce bg-slate-900 border border-slate-700 text-white p-3 rounded-xl shadow-xl flex items-center space-x-2 text-xs">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span>{customAlert.message}</span>
        </div>
      )}

      {/* HEADER PRINCIPAL */}
      <header className="bg-white border-b border-slate-200 shadow-sm px-6 py-3 flex justify-between items-center shrink-0 z-50 relative">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="p-2 -ml-2 mr-1 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200 cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-lg shadow-inner">
            {orgConfig.sigle || "SAI"}
          </div>
          <div>
            <h1 className="text-md md:text-lg font-extrabold text-slate-800 leading-tight truncate max-w-[200px] md:max-w-md">{orgConfig.name}</h1>
            <p className="text-xs text-indigo-600 font-bold tracking-wide uppercase">Canevas de PTBA Unifié</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleExportData} 
            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-semibold text-xs flex items-center transition-colors border border-slate-200 cursor-pointer"
            title="Exporter la base de données actuelle"
          >
            <Download className="w-4 h-4 md:mr-1" />
            <span className="hidden md:inline">Exporter (JSON)</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* ASIDE / NAVIGATION LATÉRALE */}
        <aside className={`bg-white border-r border-slate-200 shrink-0 flex flex-col shadow-[4px_0_15px_-3px_rgba(0,0,0,0.03)] transition-all duration-300 ease-in-out overflow-hidden z-40 relative ${isSidebarOpen ? 'w-64' : 'w-[72px]'}`}>
          <div className="w-full px-3 py-4 flex flex-col h-full overflow-y-auto hide-scrollbar justify-between">
            <nav className="space-y-1.5 text-sm font-semibold text-slate-700">
              <button onClick={() => setActiveTab('accueil')} className={`w-full flex items-center ${isSidebarOpen ? 'px-3 space-x-3 justify-start' : 'px-0 justify-center'} py-2.5 rounded-lg transition-all cursor-pointer ${activeTab === 'accueil' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold' : 'text-slate-600 hover:bg-slate-50'}`} title="Tableau d'Accueil">
                <Home className="w-5 h-5 shrink-0" />
                {isSidebarOpen && <span>Accueil</span>}
              </button>
              <button onClick={() => setActiveTab('projects')} className={`w-full flex items-center ${isSidebarOpen ? 'px-3 space-x-3 justify-start' : 'px-0 justify-center'} py-2.5 rounded-lg transition-all cursor-pointer ${activeTab === 'projects' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold' : 'text-slate-600 hover:bg-slate-50'}`} title="Portefeuille de projets">
                <Folder className="w-5 h-5 shrink-0" />
                {isSidebarOpen && <span>Gestion des Dossiers</span>}
              </button>
              <button onClick={() => setActiveTab('ptba')} className={`w-full flex items-center ${isSidebarOpen ? 'px-3 space-x-3 justify-start' : 'px-0 justify-center'} py-2.5 rounded-lg transition-all cursor-pointer ${activeTab === 'ptba' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold' : 'text-slate-600 hover:bg-slate-50'}`} title="Plan de Budget Annuel">
                <FileSpreadsheet className="w-5 h-5 shrink-0" />
                {isSidebarOpen && <span>Édition du PTBA</span>}
              </button>
              <button onClick={() => setActiveTab('processus')} className={`w-full flex items-center ${isSidebarOpen ? 'px-3 space-x-3 justify-start' : 'px-0 justify-center'} py-2.5 rounded-lg transition-all cursor-pointer ${activeTab === 'processus' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold' : 'text-slate-600 hover:bg-slate-50'}`} title="Suivi des coûts et EVM">
                <Activity className="w-5 h-5 shrink-0" />
                {isSidebarOpen && <span>Suivi GAR & EVM</span>}
              </button>
              <button onClick={() => setActiveTab('kanban')} className={`w-full flex items-center ${isSidebarOpen ? 'px-3 space-x-3 justify-start' : 'px-0 justify-center'} py-2.5 rounded-lg transition-all cursor-pointer ${activeTab === 'kanban' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold' : 'text-slate-600 hover:bg-slate-50'}`} title="Tableau de tâche Kanban">
                <Columns className="w-5 h-5 shrink-0" />
                {isSidebarOpen && <span>Pilotage Kanban</span>}
              </button>
              <button onClick={() => setActiveTab('gantt')} className={`w-full flex items-center ${isSidebarOpen ? 'px-3 space-x-3 justify-start' : 'px-0 justify-center'} py-2.5 rounded-lg transition-all cursor-pointer ${activeTab === 'gantt' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold' : 'text-slate-600 hover:bg-slate-50'}`} title="Diagramme Chronologique">
                <AlignLeft className="w-5 h-5 shrink-0" />
                {isSidebarOpen && <span>Diagramme Gantt</span>}
              </button>
              <button onClick={() => setActiveTab('configuration')} className={`w-full flex items-center ${isSidebarOpen ? 'px-3 space-x-3 justify-start' : 'px-0 justify-center'} py-2.5 rounded-lg transition-all cursor-pointer ${activeTab === 'configuration' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold' : 'text-slate-600 hover:bg-slate-50'}`} title="Paramètres Organisme">
                <Settings className="w-5 h-5 shrink-0 text-slate-500" />
                {isSidebarOpen && <span>Configuration</span>}
              </button>
            </nav>

            {isSidebarOpen && (
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 mt-6">
                <span className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Expert Formateur</span>
                <p className="text-xs font-black text-slate-800">Koffié Fabien Michael</p>
                <p className="text-[10px] text-slate-500 font-semibold mt-1">Propriété Intellectuelle</p>
                <p className="text-[10px] text-slate-600">+225 07 48 08 27 39</p>
                <p className="text-[10px] text-indigo-600 underline cursor-pointer truncate">fabien.frikupgeneration@gmail.com</p>
                <p className="text-[9px] text-red-600 mt-3 italic border-t pt-2 border-slate-200">
                  Toute reproduction, plagiat ou récupération du code source sans l'accord écrit du concepteur est strictement interdite.
                </p>
              </div>
            )}
          </div>
        </aside>

        {/* CONTAINER DE CONTENU DYNAMIQUE */}
        <main className="flex-1 p-6 overflow-y-auto bg-slate-50 z-10">
          {activeTab === 'accueil' && renderAccueil()}
          {activeTab === 'projects' && renderProjectManager()}
          {activeTab === 'ptba' && renderPTBA()}
          {activeTab === 'processus' && renderProcessus()}
          {activeTab === 'kanban' && renderKanban()}
          {activeTab === 'gantt' && renderGantt()}
          {activeTab === 'configuration' && renderConfiguration()}
        </main>
      </div>

      {/* --- MODALS DE DIALOGUE DE CRÉATION DE STRUCTURES ENTIÈREMENT DYNAMIQUES --- */}
      
      {/* Modal Dossier */}
      {showAddDossierModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="bg-slate-800 p-4 text-white font-bold flex justify-between items-center">
              <span>Créer un Dossier Budgétaire</span>
              <button onClick={() => setShowAddDossierModal(false)} className="cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Intitulé du Dossier</label>
                <input 
                  type="text" 
                  className="w-full p-2.5 border rounded-lg bg-slate-50 text-sm" 
                  value={newDossierName} 
                  onChange={e=>setNewDossierName(e.target.value)}
                  placeholder="Ex : Budget de Fonctionnement - DSI"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Année de lancement du programme</label>
                <input 
                  type="number" 
                  className="w-full p-2.5 border rounded-lg bg-slate-50 text-sm" 
                  value={newDossierYear} 
                  onChange={e=>setNewDossierYear(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setShowAddDossierModal(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs cursor-pointer">Annuler</button>
                <button onClick={handleCreateDossier} className={`px-4 py-2 ${currentTheme.primaryBg} text-white font-bold rounded-lg text-xs cursor-pointer`}>Créer</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Axe */}
      {showAddAxeModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="bg-slate-800 p-4 text-white font-bold flex justify-between items-center">
              <span>Ajouter un Axe Stratégique</span>
              <button onClick={() => setShowAddAxeModal(false)} className="cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Intitulé de l'Axe</label>
                <input 
                  type="text" 
                  className="w-full p-2.5 border rounded-lg bg-slate-50 text-sm" 
                  value={newAxeName} 
                  onChange={e=>setNewAxeName(e.target.value)}
                  placeholder="Ex : Axe 3 - Capital Humain et Compétences"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Budget prévisionnel ({orgConfig.currency})</label>
                <input 
                  type="number" 
                  className="w-full p-2.5 border rounded-lg bg-slate-50 text-sm" 
                  value={newAxeBudget} 
                  onChange={e=>setNewAxeBudget(Number(e.target.value))}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setShowAddAxeModal(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs cursor-pointer">Annuler</button>
                <button onClick={handleCreateAxe} className={`px-4 py-2 ${currentTheme.primaryBg} text-white font-bold rounded-lg text-xs cursor-pointer`}>Ajouter</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Projet */}
      {showAddProjectModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="bg-slate-800 p-4 text-white font-bold flex justify-between items-center">
              <span>Rattacher un Projet Opérationnel</span>
              <button onClick={() => setShowAddProjectModal(false)} className="cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Nom du Projet</label>
                <input 
                  type="text" 
                  className="w-full p-2.5 border rounded-lg bg-slate-50 text-sm" 
                  value={newProjectName} 
                  onChange={e=>setNewProjectName(e.target.value)}
                  placeholder="Ex : Projet d'implémentation de l'E.R.P."
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setShowAddProjectModal(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs cursor-pointer">Annuler</button>
                <button onClick={handleCreateProject} className={`px-4 py-2 ${currentTheme.primaryBg} text-white font-bold rounded-lg text-xs cursor-pointer`}>Rattacher</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
