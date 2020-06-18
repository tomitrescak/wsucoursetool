export type PrerequisiteType = 'block' | 'skill' | 'topic';

export type Prerequisite = {
  type: PrerequisiteType;
  id: string;
  value?: number;
  recommended: boolean;
};

export type Outcome = {
  acsSkillId: string;
  bloomRating: number;
};

export type Unit = {
  id: string;
  name: string;
  mappedTopic: string;
  delivery: '1' | '2' | '3';
  completionCriteria: CompletionCriteria;
  outcome: string;
  outcomes: Outcome[];
};

export type CompletionCriteria = {
  oneOf?: CompletionCriteria[];
  anyOf?: CompletionCriteria[];
  someOf?: CompletionCriteria[];
  allOf?: CompletionCriteria[];
  id?: string;
  minimumValue?: number;
  minimumCount?: number;
  weight?: number;
  credit?: number;
};

export type Topic = {
  id: string;
  name: string;
  description: string;
  outcome: string;
  completion: CompletionCriteria;
  prerequisites: Prerequisite[];
  outcomes: Outcome[];
  keywords: string[];
  blocks: string[];
};

export type BlockType = 'knowledge' | 'practical' | 'assignment' | 'exam' | 'wil';

export type Block = {
  id: string;
  mappedUnitId: string;
  name: string;
  type: BlockType;
  outcomes: Outcome[];
  outcome: string;
  description: string;
  keywords: string[];
  prerequisites: Prerequisite[];
  completionCriteria: CompletionCriteria;
  lengthHours: number;
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
  description: string;
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
  units: Unit[];
  topics: Topic[];
  blocks: Block[];
  specialisations: Specialisation[];
  acsKnowledge: AcsKnowledge[];
  sfiaSkills: SfiaSkill[];
  jobs: Job[];
};

export type State = {
  courseConfig: CourseConfig;
  save(): Any;
};
