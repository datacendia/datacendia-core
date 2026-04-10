// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.




import { generateId, now, sr_create, sr_get } from './_base.js';

export type IdeaStatus = 'submitted' | 'under_review' | 'approved' | 'prototyping' | 'shelved' | 'patented';

export interface Idea {
  id: string;
  title: string;
  description: string;
  inventor: string;
  department: string;
  status: IdeaStatus;
  noveltyScore: number;
  marketPotential: number;
  feasibilityScore: number;
  overallScore: number;
  tags: string[];
  linkedPatentId?: string;
  linkedProjectId?: string;
  createdAt: string;
}

export interface Patent {
  id: string;
  title: string;
  inventors: string[];
  filingNumber?: string;
  status: 'draft' | 'provisional' | 'filed' | 'pending' | 'granted' | 'rejected';
  jurisdiction: string;
  abstract: string;
  claims: string[];
  priorArt: string[];
  linkedIdeaId?: string;
  filingDate?: string;
  createdAt: string;
}

export interface ResearchProject {
  id: string;
  title: string;
  description: string;
  status: 'proposed' | 'active' | 'completed' | 'paused';
  budget: number;
  spent: number;
  team: string[];
  milestones: { title: string; dueDate: string; completed: boolean }[];
  linkedIdeaIds: string[];
  createdAt: string;
}

const SN = 'CendiaInventum';
const ideas = new Map<string, Idea>();
const patents = new Map<string, Patent>();
const projects = new Map<string, ResearchProject>();

class CendiaInventumService {
  async captureIdea(input: Partial<Idea>): Promise<Idea> {
    const novelty = Math.round(40 + Math.random() * 55);
    const market = Math.round(35 + Math.random() * 60);
    const feasibility = Math.round(50 + Math.random() * 45);
    const idea: Idea = {
      id: generateId(), title: input.title || 'New Idea', description: input.description || '',
      inventor: input.inventor || 'Anonymous', department: input.department || 'R&D',
      status: 'submitted', noveltyScore: novelty, marketPotential: market, feasibilityScore: feasibility,
      overallScore: Math.round((novelty * 0.4 + market * 0.35 + feasibility * 0.25)),
      tags: input.tags || [], createdAt: now(),
    };
    ideas.set(idea.id, idea);
    await sr_create(SN, 'idea', idea);
    return idea;
  }

  getAllIdeas(): Idea[] {
    return Array.from(ideas.values());
  }

  getIdea(id: string): Idea | undefined {
    return ideas.get(id);
  }

  createPatent(input: Partial<Patent>): Patent {
    const patent: Patent = {
      id: generateId(), title: input.title || 'New Patent', inventors: input.inventors || [],
      status: 'draft', jurisdiction: input.jurisdiction || 'US', abstract: input.abstract || '',
      claims: input.claims || [], priorArt: input.priorArt || [],
      linkedIdeaId: input.linkedIdeaId, createdAt: now(),
    };
    patents.set(patent.id, patent);
    sr_create(SN, 'patent', patent).catch(() => {});
    return patent;
  }

  getPatent(id: string): Patent | undefined {
    return patents.get(id);
  }

  async generateProvisionalPatent(ideaId: string): Promise<{ ideaId: string; provisionalDraft: { title: string; abstract: string; claims: string[]; figures: string[]; estimatedCost: number } }> {
    const idea = ideas.get(ideaId);
    return {
      ideaId,
      provisionalDraft: {
        title: idea ? `System and Method for ${idea.title}` : 'System and Method for Novel Innovation',
        abstract: `A novel approach to ${idea?.description ?? 'an innovative solution'} that provides significant improvements over existing methods in efficiency, accuracy, and scalability.`,
        claims: [
          `A computer-implemented method for ${idea?.title ?? 'the described innovation'}, comprising: receiving input data; processing said data using a novel algorithm; generating optimized output.`,
          'The method of claim 1, wherein the processing step utilizes machine learning models trained on domain-specific datasets.',
          'A system configured to implement the method of claim 1, comprising: one or more processors; memory storing instructions that, when executed, cause the system to perform the method.',
        ],
        figures: ['Fig. 1: System architecture overview', 'Fig. 2: Data flow diagram', 'Fig. 3: Algorithm decision tree'],
        estimatedCost: 3500,
      },
    };
  }

  createProject(input: Partial<ResearchProject>): ResearchProject {
    const project: ResearchProject = {
      id: generateId(), title: input.title || 'New Project', description: input.description || '',
      status: 'proposed', budget: input.budget || 100000, spent: 0, team: input.team || [],
      milestones: input.milestones || [], linkedIdeaIds: input.linkedIdeaIds || [],
      createdAt: now(),
    };
    projects.set(project.id, project);
    sr_create(SN, 'project', project).catch(() => {});
    return project;
  }

  getProject(id: string): ResearchProject | undefined {
    return projects.get(id);
  }
}

export const cendiaInventumService = new CendiaInventumService();
