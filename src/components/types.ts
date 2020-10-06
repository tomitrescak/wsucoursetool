import { UndoManager } from 'mobx-keystone';
import { SfiaSkillMappingModel } from './classes';

export type User = {
  id: string;
  name: string;
};

export type PrerequisiteType = 'block' | 'unit' | 'skill' | 'topic' | 'or' | 'and' | 'container';

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
  completionCriteria: CourseCompletionCriteria;
};

export type UnitCondition = {
  id: string;
  or?: UnitCondition[];
};

export type TopicCondition = { id: string; credits: number };

export type FrameworkCondition = { id: string; level: number };

export type CourseCompletionCriteria = {
  units: UnitCondition[];
  topics: TopicCondition[];
  sfia: FrameworkCondition[];
  acs: FrameworkCondition[];
};

export type Course = {
  name: string;
  id: string;
  core: CourseUnit[];
  majors: Major[];
  completionCriteria: CourseCompletionCriteria;
};

export type ListOwner<T> = {
  add<T>(item: T): void;
  remove(index: number);
  addMany?<T>(items: T[]): void;
  items: T[];
};

export type SfiaSkillMapping = {
  id: string;
  level: number;
  flagged?: boolean;
  max?: number;
};

export type Unit = {
  id: string;
  name: string;
  delivery: string;
  coordinator: string;
  completionCriteria: CompletionCriteria;
  outcome: string;
  outcomes: Outcome[];
  assumedKnowledge: string;
  lgId?: string;

  blocks: Block[];
  topics: BlockTopic[];
  keywords: string[];

  dynamic: boolean;
  processed: boolean;
  outdated: boolean;
  obsolete: boolean;
  proposed?: boolean;
  hidden?: boolean;
  // blockTopics: string[];

  unitPrerequisites?: string;
  prerequisite?: string[];
  corequisites?: string;
  incompatible?: string;
  credits?: number;
  level?: number;
  approachToLearning?: string;

  prerequisites?: Prerequisite[];
  sfiaSkills: SfiaSkillMapping[];
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

export type BlockTopic = {
  id: string;
  ratio: number;
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
  topics: BlockTopic[];
  prerequisites: Prerequisite[];
  completionCriteria: CompletionCriteria;
  activities: Activity[];
  level: string;
  flagged: boolean;
  replacedByUnit?: string;
  replacedByBlock?: string;
  length: number;
  credits: number;
  sfiaSkills: SfiaSkillMappingModel[];
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

type SfiaSkillLevel = {
  id: string;
  level: number;
  critical: boolean;
};

export type Job = Entity & {
  skills: SkillLevel[];
  sfia: SfiaSkillLevel[];
  family: string;
  familyFunction: string;
  familyRole: string;
  aps: string;
  discipline: string;
  aka: string;
  description: string;
  apsClassification: string;
  knowledge: string;
  spanOfInfluence: string;
  required: string[];
  invalid: string[];
};

export type AcsKnowledge = {
  id: string;
  name: string;
  description: string;
  items: Entity[];
};

export type SfiaSkill = Entity & {
  acsSkillId: string;
  category: string;
  subCategory: string;
  url: string;
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
