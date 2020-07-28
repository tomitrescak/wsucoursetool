import { model, Model, prop, ExtendedModel, undoMiddleware, modelAction } from 'mobx-keystone';
import {
  Activity,
  BlockType,
  CourseConfig,
  PrerequisiteType,
  Prerequisite,
  Block,
  SfiaSkill,
  AcsKnowledge,
  Job,
  Specialisation,
  CompletionCriteria,
  CompletionCriteriaType,
  Major,
  Course,
  Unit,
  Entity
} from './types';
import { toJS } from 'mobx';

@model('Course/Entity')
export class EntityModel extends Model({
  id: prop<string>({ setterAction: true }),
  name: prop<string>({ setterAction: true }),
  description: prop<string>({ setterAction: true })
}) {
  toJS() {
    return toJS(this.$);
  }
}

@model('Course/Outcome')
class OutcomeModel extends Model({
  acsSkillId: prop<string>({ setterAction: true }),
  bloomRating: prop<number>({ setterAction: true })
}) {}

@model('Course/CourseUnit')
class CourseUnitModel extends Model({
  id: prop<string>({ setterAction: true }),
  semester: prop<number>({ setterAction: true })
}) {}

@model('Course/Major')
class MajorModel extends ExtendedModel(EntityModel, {
  units: prop<CourseUnitModel[]>({ setterAction: true })
}) {}

function createMajor(model: Major) {
  return new MajorModel({
    ...model,
    units: (model.units || []).map(u => new CourseUnitModel(u))
  });
}

@model('Course/Course')
class CourseModel extends ExtendedModel(EntityModel, {
  core: prop<CourseUnitModel[]>({ setterAction: true }),
  majors: prop<MajorModel[]>({ setterAction: true })
}) {}

export function createCourse(model: Course) {
  return new CourseModel({
    ...model,
    core: (model.core || []).map(u => new CourseUnitModel(u)),
    majors: (model.majors || []).map(u => createMajor(u))
  });
}

@model('Course/Unit')
export class UnitModel extends ExtendedModel(EntityModel, {
  approachToLearning: prop<string>({ setterAction: true }),
  assumedKnowledge: prop<string>({ setterAction: true }),
  blocks: prop<BlockModel[]>({ setterAction: true }),
  // blockTopics: prop<string[]>({ setterAction: true }),
  completionCriteria: prop<CompletionCriteria>({ setterAction: true }),
  corequisites: prop<string>({ setterAction: true }),
  credits: prop<number>({ setterAction: true }),
  delivery: prop<string>({ setterAction: true }),
  dynamic: prop<boolean>({ setterAction: true }),
  incompatible: prop<string>({ setterAction: true }),
  keywords: prop<string[]>({ setterAction: true }),
  level: prop<number>({ setterAction: true }),
  lgId: prop<string>({ setterAction: true }),
  outcome: prop<string>({ setterAction: true }),
  outcomes: prop<OutcomeModel[]>({ setterAction: true }),
  prerequisite: prop<string[]>({ setterAction: true }),
  prerequisites: prop<PrerequisiteModel[]>({ setterAction: true }),
  topics: prop<string[]>({ setterAction: true }),
  unitPrerequisites: prop<string>({ setterAction: true })
}) {}

export function createUnit(model: Unit) {
  return new UnitModel({
    ...model,
    keywords: model.keywords as any,
    topics: model.topics as any,
    prerequisite: model.prerequisite as any,
    completionCriteria: createCompletionCriteria(model.completionCriteria || {}),
    outcomes: (model.outcomes || []).map(u => new OutcomeModel(u)),
    prerequisites: createPrerequisites(model.prerequisites),
    blocks: createBlocks(model.blocks)
  });
}

@model('Course/CompletionCriteria')
class CompletionCriteriaModel extends Model({
  id: prop<string>({ setterAction: true }),
  type: prop<CompletionCriteriaType>({ setterAction: true }),
  criteria: prop<CompletionCriteria[]>({ setterAction: true }),
  minimumValue: prop<number>({ setterAction: true }),
  minimumCount: prop<number>({ setterAction: true }),
  weight: prop<number>({ setterAction: true }),
  credit: prop<number>({ setterAction: true })
}) {}

function createCompletionCriteria(model: CompletionCriteria) {
  return new CompletionCriteriaModel({
    ...model,
    criteria: (model.criteria || []).map(c => createCompletionCriteria(c))
  });
}

@model('Course/Topic')
class TopicModel extends ExtendedModel(EntityModel, {}) {}

@model('Course/Activity')
class ActivityModel extends ExtendedModel(EntityModel, {
  type: prop<BlockType>({ setterAction: true }),
  lengthHours: prop<number>({ setterAction: true })
}) {}

function createActivities(activities?: ReadonlyArray<Activity>) {
  return (activities || []).map(a => new ActivityModel(a));
}

@model('Course/Block')
export class BlockModel extends ExtendedModel(EntityModel, {
  outcomes: prop<OutcomeModel[]>({ setterAction: true }),
  outcome: prop<string>({ setterAction: true }),
  keywords: prop<string[]>({ setterAction: true }),
  topics: prop<string[]>({ setterAction: true }),
  prerequisites: prop<PrerequisiteModel[]>({ setterAction: true }),
  completionCriteria: prop<CompletionCriteriaModel>({ setterAction: true }),
  activities: prop<ActivityModel[]>({ setterAction: true })
}) {}

export function createBlock(block: Block) {
  return new BlockModel({
    ...block,
    keywords: block.keywords as any,
    topics: block.topics as any,
    prerequisites: createPrerequisites(block.prerequisites),
    completionCriteria: createCompletionCriteria(block.completionCriteria || {}),
    activities: createActivities(block.activities),
    outcomes: (block.outcomes || []).map(o => new OutcomeModel(o))
  });
}

export function createBlocks(blocks?: ReadonlyArray<Block>) {
  return (blocks || []).map(b => createBlock(b));
}

@model('Course/Prerequisite')
class PrerequisiteModel extends Model({
  type: prop<PrerequisiteType>({ setterAction: true }),
  id: prop<string>({ setterAction: true }),
  unitId: prop<string>({ setterAction: true }),
  activityId: prop<string>({ setterAction: true }),
  value: prop<number>({ setterAction: true }),
  recommended: prop<boolean>({ setterAction: true }),
  prerequisites: prop<PrerequisiteModel[]>({ setterAction: true })
}) {
  @modelAction
  addPrerequisite(pre: Prerequisite) {
    this.prerequisites.push(createPrerequisite(pre));
  }

  @modelAction
  addPrerequisites(pre: ReadonlyArray<Prerequisite>) {
    this.prerequisites.push(...createPrerequisites(pre));
  }

  @modelAction
  removePrerequisite(ix: number) {
    this.prerequisites.splice(ix, 1);
  }
}

function createPrerequisite(model: Prerequisite) {
  return new PrerequisiteModel({
    ...model,
    prerequisites: createPrerequisites(model.prerequisites)
  });
}

function createPrerequisites(requisites?: ReadonlyArray<Prerequisite>) {
  return (requisites || []).map(p => createPrerequisite(p));
}

@model('Course/Specialisation')
export class SpecialisationModel extends ExtendedModel(EntityModel, {
  prerequisites: prop<PrerequisiteModel[]>(() => [], { setterAction: true })
}) {
  @modelAction
  addPrerequisite(p: Prerequisite) {
    this.prerequisites.push(createPrerequisite(p));
  }
  @modelAction
  addPrerequisites(p: Prerequisite[]) {
    this.prerequisites.push(...createPrerequisites(p));
  }
  @modelAction
  removePrerequisite(ix: number) {
    this.prerequisites.splice(ix, 1);
  }

  toJS() {
    return {
      ...super.toJS(),
      prerequisites: this.prerequisites.map(p => p.toJS())
    };
  }
}

export function createSpecialisations(specialisations: Specialisation[]) {
  return (specialisations || []).map(c => createSpecialisation(c));
}

export function createSpecialisation(c: Specialisation) {
  return new SpecialisationModel({
    ...c,
    prerequisites: createPrerequisites(c.prerequisites)
  });
}

@model('Course/SkillLevel')
class SkillLevelModel extends Model({
  skillId: prop<string>(),
  bloomRating: prop<number>()
}) {
  toJS() {
    return toJS(this.$);
  }
}

@model('Course/JobModel')
export class JobModel extends ExtendedModel(EntityModel, {
  skills: prop<SkillLevelModel[]>({ setterAction: true })
}) {
  @modelAction
  removeSkill(ix: number) {
    this.skills.splice(ix, 1);
  }

  @modelAction
  addSkill(skillId: string, bloomRating: number) {
    this.skills.push(
      new SkillLevelModel({
        skillId,
        bloomRating
      })
    );
  }

  toJS() {
    return {
      ...super.toJS(),
      skills: this.skills.map(s => s.toJS())
    };
  }
}

export function createJobs(jobs: Job[]) {
  return (jobs || []).map(c => createJob(c));
}

export function createJob(c: Job) {
  return new JobModel({
    ...c,
    skills: c.skills.map(s => new SkillLevelModel(s))
  });
}

@model('Course/AcsSkillModel')
export class AcsSkillModel extends ExtendedModel(EntityModel, {
  items: prop<EntityModel[]>({ setterAction: true })
}) {
  @modelAction
  add(pre: Entity) {
    this.items.push(new EntityModel(pre));
  }

  @modelAction
  remove(ix: number) {
    this.items.splice(ix, 1);
  }

  toJS() {
    return {
      ...toJS(this.$),
      items: this.items.map(i => i.toJS())
    };
  }
}

export function createAcss(skills?: AcsKnowledge[]) {
  return (skills || []).map(c => createAcs(c));
}

export function createAcs(c?: AcsKnowledge) {
  return new AcsSkillModel({
    ...c,
    items: c.items.map(s => new EntityModel(s))
  });
}

@model('Course/SfiaModel')
export class SfiaSkillModel extends ExtendedModel(EntityModel, {
  acsSkillId: prop<string>({ setterAction: true })
}) {}

export function createSfias(skills?: SfiaSkill[]) {
  return (skills || []).map(c => new SfiaSkillModel(c));
}

// @model('Course/CourseConfig')
// export class CourseConfigModel extends Model({
//   name: prop({ setterAction: true }),
//   courses: prop<CourseModel[]>(),
//   units: prop<UnitModel[]>(),
//   topics: prop<TopicModel[]>(),
//   specialisations: prop<SpecialisationModel[]>(),
//   acsKnowledge: prop<AcsSkillModel[]>(),
//   sfiaSkills: prop<SfiaSkillModel[]>(),
//   jobs: prop<JobModel[]>()
// }) {}

// export function createConfig(data: CourseConfig) {
//   const course = new CourseConfigModel({
//     ...data,
//     courses: (data.courses || []).map(c => createCourse(c)),
//     units: (data.units || []).map(c => createUnit(c)),
//     topics: (data.topics || []).map(c => new TopicModel(c)),
//     specialisations: createSpecialisations(data.specialisations),
//     acsKnowledge: createAcss(data.acsKnowledge),
//     sfiaSkills: createSfias(data.sfiaSkills),
//     jobs: createJobs(data.jobs)
//   });

//   const undoManager = undoMiddleware(course);

//   return { course, undoManager };
// }

// @model('Course/CourseConfig')
// export class CourseConfigModel extends Model({
//   name: prop({ setterAction: true })
// }) {
//   static create(config: any) {
//     const course = new CourseConfigModel(config);
//     //const undoManager = undoMiddleware(course);

//     return course;
//     //undoManager
//   }
// }
