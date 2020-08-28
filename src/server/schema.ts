import { gql } from 'apollo-server-micro';

export const typeDefs = gql`
  scalar JSON

  type UnitList {
    id: String!
    name: String!
    blockCount: Int!
    dynamic: Boolean!
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

  type Student{
    id: String!
    fname: String!
    lname: String!
  }

  type Query {
    legacyUnits: String

    unit(id: String!): JSON!
    unitBase(id: String!): JSON
    units: [UnitList!]!

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

    students: [Student!]!
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
