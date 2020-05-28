export type PrerequisiteType = {
  type: "block" | "skill" | "topic";
};

export type Prerequisite = {
  type: PrerequisiteType;
  id: string;
};

export type Unit = {
  id: string;
  name: string;
  mappedTopic: string;
};

export type TopicBlocks = {
  oneOf?: Block[];
  anyOf?: Block[];
  block?: Block;
};

export type Topic = {
  id: string;
  name: string;
  completion: TopicBlocks;
};

export type Block = {
  id: string;
  mappedUnit: Unit;
  name: string;
  prerequisites: Prerequisite[];
};

export type Specialisation = {
  id: string;
  name: string;
  prerequisites: Prerequisite[];
};

export type CourseConfig = {
  units: Unit[];
  topics: Topic[];
  blocks: Block[];
  specialisations: Specialisation[];
};

export type State = {
  courseConfig: CourseConfig;
};
