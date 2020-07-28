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

  type Query {
    legacyUnits: String

    unit(id: String!): JSON!
    units: [UnitList!]!

    course(id: String!): JSON!
    courses: [CourseList!]!
    courseUnits(id: String!): JSON!

    jobs: [JobList!]!
    job(id: String!): JSON!

    specialisations: [SpecialisationList!]!
    specialisation(id: String!): JSON!

    blocks: [BlockList!]!
    acs: JSON!
    sfia: JSON!
    topics: [TopicList!]!
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

const maxBackupFiles = 15;

function saveBackup() {
  // remove old files
  const files = fs.readdirSync('./src/data/backup').sort((a, b) => a.localeCompare(b));
  for (let i = 0; i < files.length - maxBackupFiles; i++) {
    console.log('Removing backup: ' + files[i]);
    fs.unlinkSync(`./src/data/backup/${files[i]}`);
  }

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
    save(_, { id, part, body }) {
      return withDb(db => {
        if (part === 'acs') {
          db.acsKnowledge = body;
          return true;
        }
        if (part === 'topics') {
          db.topics = body;
          return true;
        }
        if (part === 'sfia') {
          db.sfiaSkills = body;
          return true;
        }
        if (part === 'job') {
          let ix = db.jobs.findIndex(j => j.id === id);
          db.jobs[ix] = body;
          return true;
        }
        if (part === 'specialisation') {
          let ix = db.specialisations.findIndex(j => j.id === id);
          db.specialisations[ix] = body;
          return true;
        }
        throw new Error('Not supported: ' + part);
      });
    },
    createCourse(_, { id, name }) {
      return withDb(db => {
        db.courses.push({
          id,
          name,
          core: [],
          majors: []
        });
        return true;
      });
    },
    deleteCourse(_, { id }) {
      return withDb(db => {
        db.courses.splice(
          db.jobs.findIndex(j => j.id === id),
          1
        );
        return true;
      });
    },
    createJob(_, { id, name }) {
      return withDb(db => {
        db.jobs.push({
          id,
          name,
          skills: []
        });
        return true;
      });
    },
    deleteJob(_, { id }) {
      return withDb(db => {
        db.jobs.splice(
          db.jobs.findIndex(j => j.id === id),
          1
        );
        return true;
      });
    },
    createSpecialisation(_, { id, name }) {
      return withDb(db => {
        db.specialisations.push({
          id,
          name,
          prerequisites: []
        });
        return true;
      });
    },
    deleteSpecialisation(_, { id }) {
      return withDb(db => {
        db.specialisations.splice(
          db.specialisations.findIndex(j => j.id === id),
          1
        );
        return true;
      });
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
    blocks() {
      let db = getDb();
      const result = db.units.flatMap(u =>
        u.blocks.map(b => ({ id: b.id, name: u.name + ' > ' + b.name, unitId: u.id }))
      );

      // console.log(JSON.stringify(result, null, 2));

      return result;
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

      let blocks = unit.blocks;
      if (unit.dynamic) {
        blocks = [...unit.blocks];

        // add individual blocks that belong to the same topic
        blocks.push(
          ...db.units
            .flatMap(u => u.blocks)
            .filter(b => (b.topics || []).some(t => unit.topics.indexOf(t) >= 0))
        );
        // add all blocks from a unit that has a dynamic unit's topic
        blocks.push(
          ...db.units
            .filter(u => !u.dynamic && u.topics.some(t => unit.topics.indexOf(t) >= 0))
            .flatMap(u => u.blocks)
            .filter(b => blocks.indexOf(b) === -1)
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
    courseUnits(_, { id }) {
      let db = getDb();
      let course = db.courses.find(u => u.id === id);
      let units = course.core.map(c => db.units.find(u => u.id === c.id));
      for (let major of course.majors) {
        for (let unit of major.units) {
          if (units.every(u => u.id !== unit.id)) {
            units.push(db.units.find(u => u.id === unit.id));
          }
        }
      }
      return units;
    },
    units() {
      let db = getDb();
      return db.units.map(u => ({
        id: u.id,
        name: u.name,
        dynamic: !!u.dynamic,
        blockCount: (u.blocks || []).length
      }));
    },
    legacyUnits(parent, args, context) {
      return fs.readFileSync(path.resolve('./src/data/units.json'), {
        encoding: 'utf-8'
      });
    },
    courses() {
      let db = getDb();
      return db.courses.map(c => ({
        id: c.id,
        name: c.name,
        core: c.core.map(o => ({ id: o.id, name: '' })),
        majors: c.majors.map(m => ({
          id: m.id,
          name: m.name,
          units: m.units.map(u => ({ id: u.id }))
        }))
      }));
    }
  }
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context() {
    return {
      user: 'tomas'
    };
  }
});

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
