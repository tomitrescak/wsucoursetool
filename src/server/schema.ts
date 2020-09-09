import { gql } from 'apollo-server-micro';

export const typeDefs = gql`
  scalar JSON

  type UnitList {
    id: String!
    name: String!
    blockCount: Int
    dynamic: Boolean
    obsolete: Boolean
    outdated: Boolean
    processed: Boolean
    proposed: Boolean
    hidden: Boolean
    topics: [String!]
    level: Int
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

  type JobList {
    id: String!
    name: String!
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
    units: [Identifiable!]!
  }

  type CourseList {
    id: String!
    name: String!
    majors: [MajorList!]!
    core: [Identifiable!]!
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

  type Query {
    legacyUnits: String

    unit(id: String!): JSON!
    unitBase(id: String!): JSON
    units: [UnitList!]!
    unitDepenendencies(id: String!): [UnitDependency!]!

    coordinators: [Coordinator!]!

    course(id: String!): JSON!
    courses: [CourseList!]!
    courseUnits(id: String!): JSON!

    jobs: [JobList!]!
    job(id: String!): JSON!

    specialisations: [SpecialisationList!]!
    specialisation(id: String!): JSON!

    keywords: [String!]!
    blocks: [BlockList!]!
    acs: JSON!
    sfia: JSON!
    topics: [TopicList!]!
    topicsDetails: [TopicDetails!]!

    db: JSON!
  }
  type Mutation {
    createUnit(id: String!, name: String): UnitList!
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
