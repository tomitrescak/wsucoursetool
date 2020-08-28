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
  prerequisites?: Prerequisite[];
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
  units: CourseUnit[];
};

export type Course = {
  name: string;
  id: string;
  core: CourseUnit[];
  majors: Major[];
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
  delivery: string;
  completionCriteria: CompletionCriteria;
  outcome: string;
  outcomes: Outcome[];
  assumedKnowledge: string;
  lgId?: string;

  blocks: Block[];
  topics: string[];
  keywords: string[];

  dynamic: boolean;
  // blockTopics: string[];

  unitPrerequisites?: string;
  prerequisite?: string[];
  corequisites?: string;
  incompatible?: string;
  credits?: number;
  level?: number;
  approachToLearning?: string;

  prerequisites?: Prerequisite[];
};

export type CompletionCriteriaType = '' | 'simple' | 'allOf' | 'someOf';

export type CompletionCriteria = {
  id?: string;
  type?: CompletionCriteriaType;
  criteria?: CompletionCriteria[];
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
  outcomes: Outcome[];
  outcome: string;
  description: string;
  keywords: string[];
  topics: string[];
  prerequisites: Prerequisite[];
  completionCriteria: CompletionCriteria;
  activities: Activity[];
};

export type Specialisation = {
  id: string;
  name: string;
  description: string;
  prerequisites: Prerequisite[];
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
  skills: SkillLevel[];
};

export type AcsKnowledge = {
  id: string;
  name: string;
  description: string;
  items: Entity[];
};

export type SfiaSkill = Entity & {
  acsSkillId: string;
};

export type CourseConfig = {
  courses: Course[];
  units: Unit[];
  topics: Topic[];
  specialisations: Specialisation[];
  acsKnowledge: AcsKnowledge[];
  sfiaSkills: SfiaSkill[];
  jobs: Job[];
};

export type State = {
  // courseConfig: CourseConfigModel;
  save(): any;
  delaySave(): any;
  undoManager: UndoManager;
};

export type Student = {
  id: string;
  fname: string;
  lname: string;
  details: string;
}
