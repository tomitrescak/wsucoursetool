import { UndoManager } from 'mobx-keystone';

export type User = {
  id: string;
  name: string;
};

export type PrerequisiteType = 'block' | 'skill' | 'topic' | 'or' | 'and' | 'container';

export type Prerequisite = {
  type: PrerequisiteType;
  id?: string;
  unitId?: string;
  activityId?: string;
  value?: number;
  recommended?: boolean;
  prerequisites?: ReadonlyArray<Prerequisite>;
};

export type Outcome = {
  acsSkillId: string;
  bloomRating: number;
};

export type CourseUnit = {
  id: string;
  semester: number;
};

export type Major = {
  name: string;
  id: string;
  units: ReadonlyArray<CourseUnit>;
};

export type Course = {
  name: string;
  id: string;
  core: ReadonlyArray<CourseUnit>;
  majors: ReadonlyArray<Major>;
};

export type ListOwner<T> = {
  add<T>(item: T): void;
  remove(index: number);
  addMany?<T>(items: T[]): void;
  items: T[];
};

export type Unit = {
  id: string;
  name: string;
  delivery: '1' | '2' | '3';
  completionCriteria: CompletionCriteria;
  outcome: string;
  outcomes: ReadonlyArray<Outcome>;
  assumedKnowledge: string;
  lgId?: string;

  blocks: ReadonlyArray<Block>;
  topics: ReadonlyArray<string>;
  keywords: ReadonlyArray<string>;

  dynamic: boolean;
  blockTopics: ReadonlyArray<string>;

  unitPrerequisites?: string;
  prerequisite?: ReadonlyArray<string>;
  corequisites?: string;
  incompatible?: string;
  credits?: number;
  level?: number;
  approachToLearning?: string;

  prerequisites?: ReadonlyArray<Prerequisite>;
};

export type CompletionCriteriaType = '' | 'simple' | 'allOf' | 'someOf';

export type CompletionCriteria = {
  id?: string;
  type?: CompletionCriteriaType;
  criteria?: ReadonlyArray<CompletionCriteria>;
  minimumValue?: number;
  minimumCount?: number;
  weight?: number;
  credit?: number;
};

export type Topic = {
  id: string;
  name: string;
  description: string;
};

export type BlockType = 'knowledge' | 'practical' | 'assignment' | 'exam' | 'wil';

export type Activity = {
  id: string;
  name: string;
  description: string;
  type: BlockType;
  lengthHours: number;
};

export type Block = {
  id: string;
  unitId?: string;
  name: string;
  outcomes: ReadonlyArray<Outcome>;
  outcome: string;
  description: string;
  keywords: ReadonlyArray<string>;
  topics: ReadonlyArray<string>;
  prerequisites: ReadonlyArray<Prerequisite>;
  completionCriteria: CompletionCriteria;
  activities: ReadonlyArray<Activity>;
};

export type Specialisation = {
  id: string;
  name: string;
  description: string;
  prerequisites: ReadonlyArray<Prerequisite>;
};

export type Entity = {
  id: string;
  name: string;
  description?: string;
};

type SkillLevel = {
  skillId: string;
  bloomRating: number;
};

export type Job = Entity & {
  skills: ReadonlyArray<SkillLevel>;
};

export type AcsKnowledge = {
  id: string;
  name: string;
  description: string;
  items: ReadonlyArray<Entity>;
};

export type SfiaSkill = Entity & {
  acsSkillId: string;
};

export type CourseConfig = {
  courses: ReadonlyArray<Course>;
  units: ReadonlyArray<Unit>;
  topics: ReadonlyArray<Topic>;
  specialisations: ReadonlyArray<Specialisation>;
  acsKnowledge: ReadonlyArray<AcsKnowledge>;
  sfiaSkills: ReadonlyArray<SfiaSkill>;
  jobs: ReadonlyArray<Job>;
};

export type State = {
  // courseConfig: CourseConfigModel;
  save(): any;
  delaySave(): any;
  undoManager: UndoManager;
};
