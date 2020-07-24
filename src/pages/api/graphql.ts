import { ApolloServer, gql } from 'apollo-server-micro';
import fs from 'fs';
import path from 'path';
import { CourseConfig, User } from 'components/types';
import { IResolvers } from 'config/resolvers';
import { calculateDependencies } from 'config/utils';
import GraphQLJSON from 'graphql-type-json';

const typeDefs = gql`
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

  type Query {
    loadCourses: String
    loadUnits: String
    loadUnitList: [UnitList!]!
    courseList: [CourseList!]!

    unit(id: String!): JSON!
    course(id: String!): JSON!
    acs: JSON!
    sfia: JSON!
    jobs: [Entity!]!
    job(id: String!): JSON!
    topics: [Entity!]!
    specialisations: [Entity!]!
    specialisation(id: String!): JSON!
  }
  type Mutation {
    saveCourses(courses: String): Boolean
    createUnit(id: String!, name: String): UnitList!
    deleteUnit(id: String!): Boolean
  }
`;

let g = global as any;
g.__users = {};

function getDb(): CourseConfig {
  if (g.__db == null) {
    g.__db = JSON.parse(
      fs.readFileSync(path.resolve('./src/data/db.json'), {
        encoding: 'utf-8'
      })
    );
    console.log(Object.keys(g.__db));
  }
  return g.__db;
}

function saveBackup() {
  fs.writeFileSync(
    path.resolve(`./src/data/backup/db.${Date.now()}.json`),
    JSON.stringify(g.__db, null, 2),
    {
      encoding: 'utf-8'
    }
  );
}

function saveDb() {
  fs.writeFileSync(path.resolve('./src/data/db.json'), JSON.stringify(g.__db, null, 2), {
    encoding: 'utf-8'
  });
}

function getUser(id): User {
  if (g.__users[id] == null) {
    g.__users[id] = fs.readFileSync(path.resolve(`./src/data/users/${id}.json`), {
      encoding: 'utf-8'
    });
  }
  return g.__users[id];
}

function withDb<T>(action: (db: CourseConfig) => T): T {
  let db = getDb();
  saveBackup();
  let result = action(db);
  saveDb();
  return result;
}

const resolvers: IResolvers = {
  JSON: GraphQLJSON,
  Mutation: {
    saveCourses(parent, { courses }) {
      const original = fs.readFileSync(path.resolve('./src/data/db.json'), {
        encoding: 'utf-8'
      });
      fs.writeFileSync(path.resolve('./src/data/db.backup.json'), original, {
        encoding: 'utf-8'
      });
      fs.writeFileSync(path.resolve('./src/data/db.json'), courses, {
        encoding: 'utf-8'
      });
      return true;
    },
    createUnit(_, { id, name }) {
      return withDb(db => {
        db.units.push({
          id,
          name,
          topics: [],
          keywords: [],
          blockTopics: [],
          dynamic: false,
          delivery: '1',
          completionCriteria: {},
          assumedKnowledge: '',
          outcome: '',
          outcomes: [],
          blocks: []
        });

        return {
          id,
          name,
          dynamic: false,
          blockCount: 0
        };
      });
    },
    deleteUnit(_, { id }) {
      withDb(db => {
        db.units.splice(
          db.units.findIndex(u => u.id === id),
          1
        );
      });
      return true;
    }
  },
  Query: {
    acs() {
      let db = getDb();
      return db.acsKnowledge;
    },
    sfia() {
      let db = getDb();
      return db.sfiaSkills;
    },
    jobs() {
      let db = getDb();
      return db.jobs;
    },
    job(_, { id }) {
      let db = getDb();
      return db.jobs.find(u => u.id === id);
    },
    topics() {
      let db = getDb();
      return db.topics;
    },
    specialisations() {
      let db = getDb();
      return db.specialisations;
    },
    specialisation(_, { id }) {
      let db = getDb();
      return db.specialisations.find(u => u.id === id);
    },
    unit(_, { id }) {
      let db = getDb();
      let unit = db.units.find(u => u.id === id);

      let blocks = unit.blocks.map(id => db.blocks.find(b => b.id === id));
      if (unit.dynamic) {
        blocks.push(
          ...db.blocks.filter(b => (b.topics || []).some(t => unit.topics.indexOf(t) >= 0))
        );
        blocks.push(
          ...db.units
            .filter(u => !u.dynamic && u.topics.some(t => unit.topics.indexOf(t) >= 0))
            .flatMap(u => u.blocks.map(ub => db.blocks.find(sb => sb.id === ub)))
        );
      }

      return {
        unit,
        dependencies: calculateDependencies(unit, db),
        blocks
      };
    },
    course(_, { id }) {
      let db = getDb();
      return db.courses.find(u => u.id === id);
    },
    loadUnitList() {
      let db = getDb();
      return db.units.map(u => ({
        id: u.id,
        name: u.name,
        dynamic: !!u.dynamic,
        blockCount: (u.blocks || []).length
      }));
    },
    loadCourses(parent, args, context) {
      return fs.readFileSync(path.resolve('./src/data/db.json'), {
        encoding: 'utf-8'
      });
    },
    loadUnits(parent, args, context) {
      return fs.readFileSync(path.resolve('./src/data/units.json'), {
        encoding: 'utf-8'
      });
    },
    courseList() {
      let db = getDb();
      return db.courses.map(c => ({
        id: c.id,
        name: c.name,
        core: c.core.map(o => ({ id: o.id })),
        majors: c.majors.map(m => ({
          id: m.id,
          name: m.name,
          units: m.units.map(u => ({ id: u.id }))
        }))
      }));
    }
  }
};

const apolloServer = new ApolloServer({ typeDefs, resolvers });

export const config = {
  api: {
    bodyParser: false
  }
};

// export const config = {
//   api: {
//     bodyParser: {
//       sizeLimit: '10mb'
//     }
//   }
// };

export default apolloServer.createHandler({ path: '/api/graphql' });
