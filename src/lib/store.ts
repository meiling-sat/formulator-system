import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type Project, DEMO_PROJECT, createNewProject } from './mock-data';
import { type ProjectStatus, getNextStatus, getStageNumber, canTransition } from './state-machine';

interface FormulatorStore {
  projects: Project[];
  activeProjectId: string | null;
  skippedReviews: Record<string, number[]>; // projectId -> skipped stage numbers

  // Actions
  setActiveProject: (id: string) => void;
  getActiveProject: () => Project | null;
  addProject: (name: string, code: string) => void;
  advanceStage: (projectId: string) => void;
  confirmCheckpoint: (projectId: string) => void;
  skipCheckpoint: (projectId: string) => void;
  rejectCheckpoint: (projectId: string) => void;
  reworkFromAudit: (projectId: string) => void;
  resetDemo: () => void;
}

export const useFormulatorStore = create<FormulatorStore>()(persist((set, get) => ({
  projects: [{ ...DEMO_PROJECT }],
  activeProjectId: null,
  skippedReviews: {},

  setActiveProject: (id: string) => set({ activeProjectId: id }),

  getActiveProject: () => {
    const { projects, activeProjectId } = get();
    return projects.find(p => p.id === activeProjectId) ?? null;
  },

  addProject: (name: string, code: string) => {
    const newProject = createNewProject(name, code);
    set(state => ({
      projects: [...state.projects, newProject],
      activeProjectId: newProject.id,
    }));
  },

  advanceStage: (projectId: string) => {
    set(state => {
      const projects = state.projects.map(p => {
        if (p.id !== projectId) return p;
        
        const nextStatus = getNextStatus(p.status);
        if (!nextStatus) return p;

        // Mark current stage as completed
        const currentStageNum = getStageNumber(p.status);
        const updatedStages = { ...p.stages };
        if (updatedStages[currentStageNum]) {
          updatedStages[currentStageNum] = { ...updatedStages[currentStageNum], completed: true };
        }

        const nextStageNum = getStageNumber(nextStatus);
        return {
          ...p,
          status: nextStatus,
          currentStage: nextStageNum,
          stages: updatedStages,
          updatedAt: new Date().toISOString(),
        };
      });
      return { projects };
    });
  },

  confirmCheckpoint: (projectId: string) => {
    set(state => {
      const projects = state.projects.map(p => {
        if (p.id !== projectId) return p;
        
        let nextStatus: ProjectStatus | null = null;
        if (p.status === 'stage_3_awaiting_confirm') {
          nextStatus = 'stage_4_pathway';
        } else if (p.status === 'stage_7_awaiting_confirm') {
          nextStatus = 'stage_8_audit';
        } else if (p.status === 'stage_9_awaiting_confirm') {
          nextStatus = 'stage_10_proposal';
        }
        if (!nextStatus) return p;

        const currentStageNum = getStageNumber(p.status);
        const updatedStages = { ...p.stages };
        if (updatedStages[currentStageNum]) {
          updatedStages[currentStageNum] = { ...updatedStages[currentStageNum], completed: true };
        }

        return {
          ...p,
          status: nextStatus,
          currentStage: getStageNumber(nextStatus),
          stages: updatedStages,
          updatedAt: new Date().toISOString(),
        };
      });
      return { projects };
    });
  },

  skipCheckpoint: (projectId: string) => {
    set(state => {
      const project = state.projects.find(p => p.id === projectId);
      if (!project) return state;

      let nextStatus: ProjectStatus | null = null;
      if (project.status === 'stage_3_awaiting_confirm') {
        nextStatus = 'stage_4_pathway';
      } else if (project.status === 'stage_7_awaiting_confirm') {
        nextStatus = 'stage_8_audit';
      } else if (project.status === 'stage_9_awaiting_confirm') {
        nextStatus = 'stage_10_proposal';
      }
      if (!nextStatus) return state;

      const currentStageNum = getStageNumber(project.status);
      const skippedReviews = { ...state.skippedReviews };
      const existing = skippedReviews[projectId] ?? [];
      skippedReviews[projectId] = [...existing, currentStageNum];

      const projects = state.projects.map(p => {
        if (p.id !== projectId) return p;
        const updatedStages = { ...p.stages };
        if (updatedStages[currentStageNum]) {
          updatedStages[currentStageNum] = { ...updatedStages[currentStageNum], completed: true };
        }
        return {
          ...p,
          status: nextStatus!,
          currentStage: getStageNumber(nextStatus!),
          stages: updatedStages,
          updatedAt: new Date().toISOString(),
        };
      });
      return { projects, skippedReviews };
    });
  },

  rejectCheckpoint: (projectId: string) => {
    set(state => {
      const projects = state.projects.map(p => {
        if (p.id !== projectId) return p;
        let resetStatus: ProjectStatus;
        if (p.status === 'stage_3_awaiting_confirm') {
          resetStatus = 'stage_3_deliverables';
        } else if (p.status === 'stage_7_awaiting_confirm') {
          resetStatus = 'stage_7_formulation';
        } else if (p.status === 'stage_9_awaiting_confirm') {
          resetStatus = 'stage_9_engineering';
        } else {
          return p;
        }
        return {
          ...p,
          status: resetStatus,
          updatedAt: new Date().toISOString(),
        };
      });
      return { projects };
    });
  },

  reworkFromAudit: (projectId: string) => {
    set(state => {
      const projects = state.projects.map(p => {
        if (p.id !== projectId) return p;
        // Rework: go back to stage 4 for re-derivation
        return {
          ...p,
          status: 'stage_4_pathway' as ProjectStatus,
          currentStage: 4,
          updatedAt: new Date().toISOString(),
        };
      });
      return { projects };
    });
  },

  resetDemo: () => {
    set({ projects: [{ ...DEMO_PROJECT }], activeProjectId: null });
  },
}), {
  name: 'formulator-storage',
  partialize: (state) => ({
    projects: state.projects,
    activeProjectId: state.activeProjectId,
    skippedReviews: state.skippedReviews,
  }),
}));
