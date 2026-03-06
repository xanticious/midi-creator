// ─── Project Tracker ─────────────────────────────────────────────────────────
// Typed skeletons for milestones, epics, and stories.
// Populate these as the project evolves.

export interface Milestone {
  id: string;
  title: string;
  dueDate?: string;
  description?: string;
  epics: string[]; // epic IDs
}

export interface Epic {
  id: string;
  milestoneId: string;
  title: string;
  description?: string;
  stories: string[]; // story IDs
}

export type StoryStatus = 'todo' | 'in-progress' | 'done' | 'blocked';

export interface Story {
  id: string;
  epicId: string;
  title: string;
  description?: string;
  status: StoryStatus;
  acceptanceCriteria?: string[];
}

// ─── Data ────────────────────────────────────────────────────────────────────

export const milestones: Milestone[] = [];

export const epics: Epic[] = [];

export const stories: Story[] = [];
