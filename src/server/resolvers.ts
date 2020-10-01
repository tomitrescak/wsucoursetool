import fs from 'fs';
import path from 'path';
import { CourseConfig, User } from 'components/types';
import { IResolvers } from 'config/resolvers';
import { calculateDependencies } from 'config/utils';
import GraphQLJSON from 'graphql-type-json';

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

export const resolvers: IResolvers = {
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
        if (part === 'unit') {
          let ix = db.units.findIndex(j => j.id === id);
          db.units[ix] = body;
          return true;
        }
        if (part === 'student') {
          // 1. contruct a correct file name based on id (e.g. data/students/30003430.json)
          // 2. if file exists save a backup file (e.g. data/students/30003430.json.bak)
          // 3. overwrite the student file with "body"

          // READ:
          // const existing = fs.readFileSync(" data/students/30003430.json", { encoding: 'utf-8' });
          // WRITE
          // fs.writeFileSync(" data/students/30003430.json", JSON.stringify(body, null, 2), { encoding: 'utf-8' });

          // example of (2)
          if (fs.existsSync('./src/data/students/' + id + '.json')) {
            fs.copyFileSync(
              './src/data/students/' + id + '.json',
              './src/data/backup/' + id + '.json.bak'
            );
          }
          fs.writeFileSync('./src/data/students/' + id + '.json', JSON.stringify(body, null, 2), {
            encoding: 'utf-8'
          });

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
          description: '',
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
          // blockTopics: [],
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
    students() {
      const files = fs.readdirSync(path.resolve('./src/data/students'));
      const students = files.map(fileName =>
        fs.readFileSync(path.resolve(`./src/data/students/${fileName}`), { encoding: 'utf-8' })
      );
      console.log(students);
      return students.map(studentString => JSON.parse(studentString));
    },
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
    block(_, { blockId, unitId }) {
      let db = getDb();
      const unit = db.units.find(u => u.id === unitId);
      if (unit) {
        return unit.blocks.find(b => b.id === blockId);
      }
      return null;
    },
    jobs() {
      let db = getDb();
      return db.jobs;
    },
    job(_, { id }) {
      let db = getDb();
      return db.jobs.find(u => u.id === id);
    },
    keywords() {
      let db = getDb();

      let keywords = db.units.flatMap(u => u.blocks).flatMap(b => b.keywords);
      keywords = keywords.filter((item, index) => item && keywords.indexOf(item) === index).sort();
      return keywords;
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
    unitBase(_, { id }) {
      let db = getDb();
      return db.units.find(u => u.id === id);
    },
    unit(_, { id }) {
      let db = getDb();
      let unit = db.units.find(u => u.id === id);

      let blocks = [];
      if (unit.dynamic) {
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
