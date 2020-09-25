import { model, Model, prop, ExtendedModel, undoMiddleware, modelAction } from 'mobx-keystone';
import {
  Activity,
  BlockType,
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
  Entity,
  Outcome,
  SfiaSkillMapping,
  UnitCondition,
  CourseCompletionCriteria,
  TopicCondition,
  FrameworkCondition,
  CourseUnit,
  Topic,
  BlockTopic
} from './types';
import { toJS } from 'mobx';

const removeEmpty = obj => {
  Object.keys(obj).forEach(key => {
    if (obj[key] == null || obj[key] == '' || obj[key].length === 0) delete obj[key];
    else if (Array.isArray(obj[key])) {
      obj[key].forEach(o => removeEmpty(o));
    } else if (obj[key] && typeof obj[key] === 'object') {
      removeEmpty(obj[key]);
    }
    // delete
    // recurse
  });
  return obj;
};

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
}) {
  toJS() {
    return toJS(this.$);
  }
}

@model('Course/UnitConditionModel')
export class UnitConditionModel extends Model({
  id: prop<string>({ setterAction: true }),
  or: prop<UnitConditionModel[]>()
}) {
  toJS() {
    if (this.or.length) {
      return {
        id: this.id,
        or: this.or.map(o => o.toJS())
      };
    }
    return {
      id: this.id
    };
  }

  @modelAction
  addUnitCondition(condition: UnitCondition) {
    this.or.push(createUnitConditionModel(condition));
  }

  @modelAction
  removeUnitCondition(model: UnitConditionModel) {
    this.or.splice(this.or.indexOf(model), 1);
  }
}

function createUnitConditionModel(condition: UnitCondition) {
  return new UnitConditionModel({
    id: condition.id,
    or: (condition.or || []).map(c => createUnitConditionModel(c))
  });
}

@model('Course/UnitConditionModel')
export class TopicConditionModel extends Model({
  id: prop<string>({ setterAction: true }),
  credits: prop<number>({ setterAction: true })
}) {
  toJS() {
    return toJS(this.$);
  }
}

@model('Course/FrameworkConditionModel')
export class FrameworkConditionModel extends Model({
  id: prop<string>({ setterAction: true }),
  level: prop<number>({ setterAction: true })
}) {
  toJS() {
    return toJS(this.$);
  }
}

@model('Course/CourseCompletionCriteria')
export class CourseCompletionCriteriaModel extends Model({
  units: prop<UnitConditionModel[]>(() => []),
  topics: prop<TopicConditionModel[]>(() => []),
  sfia: prop<FrameworkConditionModel[]>(() => []),
  acs: prop<FrameworkConditionModel[]>(() => [])
}) {
  @modelAction
  addUnitCondition(condition: UnitCondition) {
    this.units.push(createUnitConditionModel(condition));
  }

  @modelAction
  removeUnitCondition(model: UnitConditionModel) {
    this.units.splice(this.units.indexOf(model), 1);
  }

  @modelAction
  addTopic(condition: TopicCondition) {
    this.topics.push(new TopicConditionModel(condition));
  }

  @modelAction
  removeTopic(model: TopicConditionModel) {
    this.topics.splice(this.topics.indexOf(model), 1);
  }

  @modelAction
  addSfia(condition: FrameworkCondition) {
    this.sfia.push(new FrameworkConditionModel(condition));
  }

  @modelAction
  removeSfia(model: FrameworkConditionModel) {
    this.sfia.splice(this.sfia.indexOf(model), 1);
  }

  @modelAction
  addAcs(condition: FrameworkCondition) {
    this.acs.push(new FrameworkConditionModel(condition));
  }

  @modelAction
  removeAcs(model: FrameworkConditionModel) {
    this.acs.splice(this.acs.indexOf(model), 1);
  }

  toJS() {
    return {
      units: this.units.map(u => u.toJS()),
      topics: this.topics.map(u => u.toJS()),
      sfia: this.sfia.map(u => u.toJS()),
      acs: this.acs.map(u => u.toJS())
    };
  }
}

function createCourseCompletionCriteriaModel(criteria: CourseCompletionCriteria) {
  if (criteria == null) {
    criteria = {} as any;
  }
  return new CourseCompletionCriteriaModel({
    units: (criteria.units || []).map(u => createUnitConditionModel(u)),
    topics: (criteria.topics || []).map(u => new TopicConditionModel(u)),
    sfia: (criteria.sfia || []).map(u => new FrameworkConditionModel(u)),
    acs: (criteria.acs || []).map(u => new FrameworkConditionModel(u))
  });
}

@model('Course/CourseUnit')
export class CourseUnitModel extends Model({
  id: prop<string>({ setterAction: true }),
  semester: prop<number>({ setterAction: true })
}) {
  toJS() {
    return toJS(this.$);
  }
}

@model('Course/Major')
export class MajorModel extends ExtendedModel(EntityModel, {
  units: prop<CourseUnitModel[]>({ setterAction: true }),
  completionCriteria: prop<CourseCompletionCriteriaModel>()
}) {
  toJS() {
    return {
      ...super.toJS(),
      units: this.units.map(u => u.toJS()),
      completionCriteria: this.completionCriteria.toJS()
    };
  }
  @modelAction
  addUnit(unit: CourseUnit) {
    this.units.push(new CourseUnitModel(unit));
  }

  @modelAction
  removeUnit(unit: CourseUnitModel) {
    this.units.splice(this.units.indexOf(unit), 1);
  }
}

function createMajor(model: Major) {
  return new MajorModel({
    ...model,
    units: (model.units || []).map(u => new CourseUnitModel(u)),
    completionCriteria: createCourseCompletionCriteriaModel(model.completionCriteria)
  });
}

@model('Course/Course')
export class CourseModel extends ExtendedModel(EntityModel, {
  core: prop<CourseUnitModel[]>({ setterAction: true }),
  majors: prop<MajorModel[]>({ setterAction: true }),
  positions: prop<any>(() => [], { setterAction: true }),
  completionCriteria: prop<CourseCompletionCriteriaModel>()
}) {
  @modelAction
  addUnit(unit: CourseUnit) {
    this.core.push(new CourseUnitModel(unit));
  }

  @modelAction
  removeUnit(unit: CourseUnitModel) {
    this.core.splice(this.core.indexOf(unit), 1);
  }

  @modelAction
  addMajor(major: Major) {
    this.majors.push(createMajor(major));
  }

  @modelAction
  removeMajor(major: MajorModel) {
    this.majors.splice(this.majors.indexOf(major), 1);
  }

  toJS() {
    return removeEmpty({
      ...super.toJS(),
      // ...toJS(this.$),
      core: this.core.map(c => c.toJS()),
      majors: this.majors.map(m => m.toJS()),
      positions: this.positions.map(p => toJS(p)),
      completionCriteria: this.completionCriteria.toJS()
    });
  }
}

export function createCourse(model: Course) {
  return new CourseModel({
    ...model,
    core: (model.core || []).map(u => new CourseUnitModel(u)),
    majors: (model.majors || []).map(u => createMajor(u)),
    completionCriteria: createCourseCompletionCriteriaModel(model.completionCriteria)
  });
}

@model('Course/SfiaMapping')
export class SfiaSkillMappingModel extends Model({
  id: prop<string>({ setterAction: true }),
  level: prop<number>({ setterAction: true }),
  flagged: prop<boolean>({ setterAction: true }),
  max: prop<number>({ setterAction: true })
}) {}

@model('Course/Unit')
export class UnitModel extends ExtendedModel(EntityModel, {
  approachToLearning: prop<string>({ setterAction: true }),
  assumedKnowledge: prop<string>({ setterAction: true }),
  blocks: prop<BlockModel[]>(() => [], { setterAction: true }),
  // blockTopics: prop<string[]>({ setterAction: true }),
  completionCriteria: prop<CompletionCriteriaModel>({ setterAction: true }),
  corequisites: prop<string>({ setterAction: true }),
  coordinator: prop<string>({ setterAction: true }),
  credits: prop<number>({ setterAction: true }),
  delivery: prop<string>({ setterAction: true }),
  dynamic: prop<boolean>({ setterAction: true }),
  incompatible: prop<string>({ setterAction: true }),
  keywords: prop<string[]>({ setterAction: true }),
  level: prop<number>({ setterAction: true }),
  lgId: prop<string>({ setterAction: true }),
  outcome: prop<string>({ setterAction: true }),
  outcomes: prop<OutcomeModel[]>(() => [], { setterAction: true }),
  prerequisite: prop<string[]>(() => [], { setterAction: true }),
  prerequisites: prop<PrerequisiteModel[]>(() => [], { setterAction: true }),
  topics: prop<string[]>(() => [], { setterAction: true }),
  unitPrerequisites: prop<string>({ setterAction: true }),
  notes: prop<string>({ setterAction: true }),
  processed: prop<boolean>({ setterAction: true }),
  obsolete: prop<boolean>({ setterAction: true }),
  outdated: prop<boolean>({ setterAction: true }),
  duplicate: prop<boolean>({ setterAction: true }),
  proposed: prop<boolean>({ setterAction: true }),
  hidden: prop<boolean>({ setterAction: true }),
  group: prop<string>({ setterAction: true }),
  positions: prop<any>(() => [], { setterAction: true }),
  sfiaSkills: prop<SfiaSkillMappingModel[]>(() => [], { setterAction: true }),
  offer: prop<string[]>(() => [])
}) {
  toJS() {
    return removeEmpty({
      ...super.toJS(),
      ...toJS(this.$),
      sfiaSkills: this.sfiaSkills.map(p => toJS(p.$)),
      positions: this.positions.map(p => toJS(p)),
      blocks: this.blocks.map(b => b.toJS()),
      completionCriteria: this.completionCriteria.toJS(),
      outcomes: this.outcomes.map(b => b.toJS()),
      prerequisites: this.prerequisites.map(b => b.toJS())
    });
  }
  @modelAction
  addOffer(p: string) {
    this.offer.push(p);
  }
  @modelAction
  removeOffer(p: string) {
    this.offer.splice(this.offer.indexOf(p), 1);
  }

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
  @modelAction
  addOutcome(o: Outcome) {
    this.outcomes.push(new OutcomeModel(o));
  }
  @modelAction
  addKeyword(kw: string) {
    if (kw) {
      this.keywords.push(kw);
    }
  }
  @modelAction
  removeKeyword(ix: number) {
    this.keywords.splice(ix, 1);
  }
  @modelAction
  addTopic(kw: string) {
    if (kw) {
      this.topics.push(kw);
    }
  }
  @modelAction
  removeTopic(ix: number) {
    this.topics.splice(ix, 1);
  }
  @modelAction
  addBlock(p: Block) {
    const block = createBlock(p);
    this.blocks.push(block);
    return block;
  }
  @modelAction
  removeBlock(ix: number) {
    this.blocks.splice(ix, 1);
  }
  @modelAction
  insertBlock(b: BlockModel, ix: number) {
    this.blocks.splice(ix, 0, b);
  }
  @modelAction
  spliceBlock(ix: number, num: number, block: BlockModel) {
    //if (ix >= 0) {
    if (block) {
      this.blocks.splice(ix, num, block);
    } else {
      this.blocks.splice(ix, num);
    }
    //}
  }

  @modelAction
  addSfiaSkill(p: SfiaSkillMapping) {
    this.sfiaSkills.push(new SfiaSkillMappingModel(p));
  }

  @modelAction
  removeSfiaSkill(ix: number) {
    this.sfiaSkills.splice(ix, 1);
  }
}

export function createUnit(model: Unit) {
  return new UnitModel({
    ...model,
    keywords: model.keywords as any,
    topics: model.topics as any,
    prerequisite: model.prerequisite as any,
    completionCriteria: createCompletionCriteria(model.completionCriteria || {}),
    outcomes: (model.outcomes || []).map(u => new OutcomeModel(u)),
    prerequisites: createPrerequisites(model.prerequisites),
    blocks: createBlocks(model.blocks),
    sfiaSkills: (model.sfiaSkills || []).map(u => new SfiaSkillMappingModel(u))
  });
}

@model('Course/CompletionCriteria')
export class CompletionCriteriaModel extends Model({
  id: prop<string>({ setterAction: true }),
  type: prop<CompletionCriteriaType>({ setterAction: true }),
  criteria: prop<CompletionCriteriaModel[]>({ setterAction: true }),
  minimumValue: prop<number>({ setterAction: true }),
  minimumCount: prop<number>({ setterAction: true }),
  weight: prop<number>({ setterAction: true }),
  credit: prop<number>({ setterAction: true })
}) {
  toJS() {
    return {
      ...toJS(this.$),
      criteria: this.criteria.map(c => c.toJS())
    };
  }
  @modelAction
  addCompletionCriteria(p: CompletionCriteria) {
    this.criteria.push(createCompletionCriteria(p));
  }
  @modelAction
  removeCompletionCriteria(ix: number) {
    this.criteria.splice(ix, 1);
  }
}

export function createCompletionCriteria(model: CompletionCriteria) {
  return new CompletionCriteriaModel({
    ...model,
    criteria: (model.criteria || []).map(c => createCompletionCriteria(c))
  });
}

type TypeBlock = {
  blockId: string;
  blockName: string;
  unitId: string;
  unitName: string;
};

@model('Course/Topic')
export class TopicModel extends ExtendedModel(EntityModel, {
  blocks: prop<TypeBlock[]>(() => [])
}) {}

@model('Course/BlockTopic')
export class BlockTopicModel extends Model({
  id: prop<string>({ setterAction: true }),
  ratio: prop<number>({ setterAction: true })
}) {
  toJS() {
    return toJS(this.$);
  }
}

@model('Course/Activity')
export class ActivityModel extends ExtendedModel(EntityModel, {
  type: prop<BlockType>({ setterAction: true }),
  lengthHours: prop<number>({ setterAction: true })
}) {
  toJS() {
    return {
      ...toJS(this.$)
    };
  }
}

function createActivities(activities?: ReadonlyArray<Activity>) {
  return (activities || []).map(a => new ActivityModel(a));
}

@model('Course/Block')
export class BlockModel extends ExtendedModel(EntityModel, {
  outcomes: prop<OutcomeModel[]>({ setterAction: true }),
  outcome: prop<string>({ setterAction: true }),
  keywords: prop<string[]>({ setterAction: true }),
  topics: prop<BlockTopicModel[]>(() => [], { setterAction: true }),
  prerequisites: prop<PrerequisiteModel[]>({ setterAction: true }),
  completionCriteria: prop<CompletionCriteriaModel>({ setterAction: true }),
  activities: prop<ActivityModel[]>({ setterAction: true }),
  level: prop<string>({ setterAction: true }),
  group: prop<string>({ setterAction: true }),
  flagged: prop<boolean>({ setterAction: true }),
  proposed: prop<boolean>({ setterAction: true }),
  replacedByUnit: prop<string>({ setterAction: true }),
  replacedByBlock: prop<string>({ setterAction: true }),
  length: prop<number>({ setterAction: true }),
  credit: prop<number>({ setterAction: true }),
  sfiaSkills: prop<SfiaSkillMappingModel[]>(() => [], { setterAction: true })
}) {
  toJS() {
    return {
      ...super.toJS(),
      outcomes: this.outcomes.map(o => o.toJS()),
      prerequisites: this.prerequisites.map(p => p.toJS()),
      completionCriteria: this.completionCriteria.toJS(),
      activities: this.activities.map(a => a.toJS()),
      sfiaSkills: this.sfiaSkills.map(s => toJS(s.$)),
      topics: this.topics.map(t => t.toJS())
    };
  }
  @modelAction
  addKeyword(kw: string) {
    if (kw) {
      this.keywords.push(kw);
    }
  }
  @modelAction
  removeKeyword(ix: number) {
    this.keywords.splice(ix, 1);
  }
  @modelAction
  addTopic(kw: BlockTopic) {
    if (kw) {
      this.topics.push(new BlockTopicModel(kw));
    }
  }
  @modelAction
  removeTopic(ix: number) {
    this.topics.splice(ix, 1);
  }
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
  @modelAction
  addActivities(a: Activity[]) {
    this.activities.push(...createActivities(a));
  }
  @modelAction
  addActivity(a: Activity) {
    this.activities.push(new ActivityModel(a));
  }
  @modelAction
  spliceActivity(idx: number, count: number, a?: ActivityModel) {
    if (a) {
      this.activities.splice(idx, count, a);
    } else {
      this.activities.splice(idx, count);
    }
  }

  @modelAction
  addOutcome(o: Outcome) {
    this.outcomes.push(new OutcomeModel(o));
  }

  @modelAction
  addSfiaSkill(p: SfiaSkillMapping) {
    this.sfiaSkills.push(new SfiaSkillMappingModel(p));
  }

  @modelAction
  removeSfiaSkill(ix: number) {
    this.sfiaSkills.splice(ix, 1);
  }
}

export function createBlock(block: Block) {
  return new BlockModel({
    ...block,
    keywords: (block.keywords as any) || [],
    topics: (block.topics || []).map(t => new BlockTopicModel(t)),
    prerequisites: createPrerequisites(block.prerequisites || []),
    completionCriteria: createCompletionCriteria(block.completionCriteria || {}),
    activities: createActivities(block.activities || []),
    outcomes: (block.outcomes || []).map(o => new OutcomeModel(o)),
    sfiaSkills: (block.sfiaSkills || []).map(s => new SfiaSkillMappingModel(s))
  });
}

export function createBlocks(blocks?: ReadonlyArray<Block>) {
  return (blocks || []).map(b => createBlock(b));
}

@model('Course/Prerequisite')
export class PrerequisiteModel extends Model({
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

  toJS(): Prerequisite {
    return {
      ...toJS(this.$),
      prerequisites: (this.prerequisites || []).map(p => p.toJS())
    };
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
  acsSkillId: prop<string>({ setterAction: true }),
  url: prop<string>({ setterAction: true }),
  code: prop<string>({ setterAction: true }),
  category: prop<string>({ setterAction: true }),
  subCategory: prop<string>({ setterAction: true }),
  count: prop()
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
