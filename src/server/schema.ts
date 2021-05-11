import { gql } from 'apollo-server-micro';

export const typeDefs = gql`
  scalar JSON

  type BlockTopic {
    id: String!
    ratio: Float!
  }

  type BlockSkill {
    id: String!
    level: Float!
    max: Int
  }

  type Outcome {
    acsSkillId: String
    bloomRating: Int
  }

  type UnitBlock {
    blockId: Int!
    id: String!
    name: String!
    prerequisites: [Prerequisite!]
    credits: Float!
    topics: [BlockTopic!]
    sfiaSkills: [BlockSkill!]
    outcomes: [Outcome!]
  }

  type UnitList {
    id: String!
    name: String!
    blockCount: Int
    dynamic: Boolean
    obsolete: Boolean
    outdated: Boolean
    processed: Boolean
    proposed: Boolean
    contacted: Boolean
    fixed: Boolean
    hidden: Boolean
    topics: [String!]
    level: Int
    offer: [String!]
    credits: Float
    prerequisites: [Prerequisite!]
    blocks: [UnitBlock!]
    outcomes: [Outcome!]
  }

  type Entity {
    id: String!
    name: String!
    description: String
  }

  type SpecialisationList {
    id: String!
    name: String!
  }

  type SfiaSkillLevel {
    id: String
    level: Int
  }

  type JobList {
    id: String!
    name: String!
    invalid: [String!]!
    sfia: [SfiaSkillLevel!]
  }

  type TopicList {
    id: String!
    name: String!
  }

  type TopicBlock {
    unitId: String!
    unitName: String!
    blockId: String!
    blockName: String!
  }

  type TopicDetails {
    id: String!
    name: String!
    description: String
    blocks: [TopicBlock!]!
  }

  type BlockList {
    id: String!
    unitId: String!
    name: String!
  }

  type Identifiable {
    id: String
  }

  type MajorList {
    id: String!
    name: String!
    completionCriteria: JSON!
    # units: [Identifiable!]!
  }

  type CourseList {
    id: String!
    name: String!
    completionCriteria: JSON!
    majors: [MajorList!]!
    # core: [Identifiable!]!
  }

  type Coordinator {
    name: String!
    units: [UnitList!]!
  }

  type Prerequisite {
    id: String
    unitId: String
    type: String
    recommended: Boolean
    prerequisites: JSON
  }

  type BlockDependency {
    id: String
    name: String
    prerequisites: [Prerequisite!]
  }

  type UnitDependency {
    id: String!
    name: String!
    prerequisites: [Prerequisite!]
    blocks: JSON
    level: Int
    processed: Boolean
  }

  type SfiaUnit {
    id: String
    name: String
    level: Int
    flagged: Boolean
  }

  type Query {
    legacyUnits: String

    unit(id: String!): JSON!
    unitBase(id: String!): JSON
    units(maxLevel: Int): [UnitList!]!
    unitDepenendencies(id: String!): [UnitDependency!]!

    coordinators: [Coordinator!]!

    course(id: String!): JSON!
    courses: [CourseList!]!
    courseUnits(id: String!): JSON!
    courseReport(id: String!): JSON!

    jobs: [JobList!]!
    job(id: String!): JSON!

    specialisations: [SpecialisationList!]!
    specialisation(id: String!): JSON!

    keywords: [String!]!
    blocks: [BlockList!]!
    acs: JSON!
    sfia: JSON!
    sfiaUnits(id: String!): [SfiaUnit!]!
    topics: [TopicList!]!
    topicsDetails: [TopicDetails!]!

    db: JSON!
  }
  type Mutation {
    saveLegacyUnits(units: String): Boolean

    createUnit(id: String!, name: String): JSON!
    deleteUnit(id: String!): Boolean

    createJob(id: String!, name: String): Boolean
    deleteJob(id: String!): Boolean

    createSpecialisation(id: String!, name: String): Boolean
    deleteSpecialisation(id: String!): Boolean

    createCourse(id: String!, name: String): Boolean
    deleteCourse(id: String!): Boolean

    save(part: String!, id: String, body: JSON!): Boolean!
  }
`;
