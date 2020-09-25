import fs from 'fs';
import path from 'path';
import {
  CourseConfig,
  User,
  Prerequisite,
  Unit,
  CompletionCriteria,
  CourseCompletionCriteria
} from 'components/types';
import { IResolvers, UnitDependency } from 'config/resolvers';
import { calculateDependencies } from 'config/utils';
import GraphQLJSON from 'graphql-type-json';
import { processReport } from './processors';

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

let g = global as any;
g.__users = {};

function getDb(): CourseConfig {
  if (g.__db == null) {
    // g.__db = JSON.parse(
    //   fs.readFileSync(path.resolve('./src/data/db.json'), {
    //     encoding: 'utf-8'
    //   })
    // );
    g.__db = require('../data/db.json');
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

function addUnit(list: UnitDependency[], value: Unit, level: number) {
  list.push({
    id: value.id,
    name: value.name,
    prerequisites: value.prerequisites || [],
    blocks: value.blocks.map(b => ({
      id: b.id,
      name: b.name,
      prerequisites: b.prerequisites || []
    })),
    level
  });
}

function addUnique(db: CourseConfig, list: UnitDependency[], value: Unit, level: number) {
  if (!value) {
    console.warn('Unknown unit');
    return;
  }
  if (list.every(l => l.id !== value.id)) {
    console.log('Adding: ' + value.name);

    addUnit(list, value, level);
    addUnitPrerequisites(db, list, value, level + 1);
  }
}
function addPrerequisites(
  db: CourseConfig,
  list: UnitDependency[],
  prerequisites: Prerequisite[],
  level: number
) {
  for (let pre of prerequisites) {
    if (pre.prerequisites && pre.prerequisites.length) {
      addPrerequisites(db, list, pre.prerequisites, level);
    }
    if (pre.type === 'unit') {
      let unit = db.units.find(u => u.id === pre.id);
      addUnique(db, list, unit, level);
    }
    if (pre.type === 'block') {
      let unit = db.units.find(u => u.id === pre.unitId);
      addUnique(db, list, unit, level);
    }
  }
}

function addUnitPrerequisites(db: CourseConfig, list: UnitDependency[], unit: Unit, level: number) {
  if (unit.prerequisites && unit.prerequisites.length) {
    addPrerequisites(db, list, unit.prerequisites, level);
  }
  for (let block of unit.blocks) {
    if (block.prerequisites && block.prerequisites.length) {
      addPrerequisites(db, list, block.prerequisites, level);
    }
  }
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
        if (part === 'sfiaSkill') {
          const unitId = body.unitId;
          const action = body.action;
          const level = body.level;
          const flagged = body.flagged;
          const unit = db.units.find(u => u.id === unitId);

          if (unit == null) {
            console.log(`Unit "${unitId}" not found`);
          }

          if (action === 'remove') {
            unit.sfiaSkills = unit.sfiaSkills.filter(s => s.id !== id);
          } else if (action === 'add') {
            if (unit.sfiaSkills == null) {
              unit.sfiaSkills = [];
            }
            unit.sfiaSkills.push({ id, level, flagged });
          }
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
        if (part === 'course') {
          let ix = db.courses.findIndex(j => j.id === id);
          db.courses[ix] = {
            ...db.courses[ix],
            ...body
          };
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
          majors: [],
          completionCriteria: {
            acs: [],
            sfia: [],
            topics: [],
            units: []
          }
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
    // createJob(_, { id, name }) {
    //   return withDb(db => {
    //     db.jobs.push({
    //       id,
    //       name,
    //       skills: []
    //     });
    //     return true;
    //   });
    // },
    // deleteJob(_, { id }) {
    //   return withDb(db => {
    //     db.jobs.splice(
    //       db.jobs.findIndex(j => j.id === id),
    //       1
    //     );
    //     return true;
    //   });
    // },
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
          sfiaSkills: [],
          keywords: [],
          coordinator: '',
          // blockTopics: [],
          dynamic: false,
          outdated: false,
          obsolete: false,
          processed: false,
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
          outdated: false,
          obsolete: false,
          topics: [],
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
    db() {
      return getDb().units;
    },
    acs() {
      let db = getDb();
      return db.acsKnowledge;
    },
    sfia() {
      let db = getDb();
      return db.sfiaSkills
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(s => ({
          ...s,
          count: db.units.filter(u => (u.sfiaSkills || []).some(k => k.id === s.id)).length
        }));
    },
    sfiaUnits(_, { id }) {
      let db = getDb();
      return db.units
        .filter(u => (u.sfiaSkills || []).some(s => s.id === id))
        .map(u => ({
          id: u.id,
          name: u.name,
          level: u.sfiaSkills.find(s => s.id === id).level,
          flagged: u.sfiaSkills.find(s => s.id === id).flagged
        }));
    },
    blocks() {
      let db = getDb();
      const result = db.units.flatMap(u =>
        (u.blocks || []).map(b => ({ id: b.id, name: u.name + ' > ' + b.name, unitId: u.id }))
      );

      // console.log(JSON.stringify(result, null, 2));

      return result;
    },
    coordinators() {
      let db = getDb();
      let groups = {};
      for (let unit of db.units) {
        let c = unit.coordinator || 'Unknown';
        let u = { id: unit.id, name: unit.name, level: unit.level };
        if (groups[c] == null) {
          groups[c] = [unit];
        } else {
          groups[c].push(u);
        }
      }
      return Object.keys(groups).map(key => ({ name: key, units: groups[key] }));
    },
    jobs() {
      let db = getDb();
      const result = db.jobs.sort((a, b) => a.name.localeCompare(b.name));

      for (let job of result) {
        job.invalid = job.sfia
          .filter(sfia =>
            db.units.every(u =>
              (u.sfiaSkills || []).every(s => s.id !== sfia.id || s.level < sfia.level)
            )
          )
          .map(s => s.id);
      }

      return result;
    },
    job(_, { id }) {
      let db = getDb();
      return db.jobs.find(u => u.id === id);
    },
    keywords() {
      let db = getDb();

      let keywords = db.units.flatMap(u => u.blocks || []).flatMap(b => b.keywords);
      keywords = keywords.filter((item, index) => item && keywords.indexOf(item) === index).sort();
      return keywords;
    },
    topics() {
      let db = getDb();
      return db.topics;
    },
    topicsDetails() {
      let db = getDb();
      return db.topics.map(t => {
        let blocks = [];
        let topicalUnits = db.units.filter(u =>
          (u.blocks || []).some(b => (b.topics || []).some(bt => bt.id === t.id))
        );
        for (let u of topicalUnits) {
          let topicalBlocks = u.blocks.filter(b => (b.topics || []).some(bt => bt.id === t.id));
          for (let b of topicalBlocks) {
            blocks.push({
              blockId: b.id,
              blockName: b.name,
              unitId: u.id,
              unitName: u.name
            });
          }
        }
        return {
          id: t.id,
          name: t.name,
          blocks
        };
      });
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
            .flatMap(u => u.blocks || [])
            .filter(b => (b.topics || []).some(t => unit.topics.indexOf(t) >= 0))
        );
        // add all blocks from a unit that has a dynamic unit's topic
        blocks.push(
          ...db.units
            .filter(u => !u.dynamic && u.topics.some(t => unit.topics.indexOf(t) >= 0))
            .flatMap(u => u.blocks || [])
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

    courseReport(_, { id }) {
      let db = getDb();
      let course = db.courses.find(f => f.id === id);
      const blocks = db.units.flatMap(u => u.blocks);

      let report = [
        {
          id: course.id,
          name: course.name,
          issues: processReport(db, course.completionCriteria, blocks)
        },
        ...course.majors.map(m => ({
          id: m.id,
          name: m.name,
          issues: processReport(db, m.completionCriteria, blocks)
        }))
      ];

      return report;
    },
    courseUnits(_, { id }) {
      let db = getDb();
      let course = db.courses.find(u => u.id === id);
      let units = course.core.map(c => db.units.find(u => u.id === c.id));
      for (let major of course.majors) {
        for (let unit of major.units || []) {
          if (units.every(u => u.id !== unit.id)) {
            units.push(db.units.find(u => u.id === unit.id));
          }
        }
      }
      return units;
    },
    unitDepenendencies(_, { id }) {
      let db = getDb();
      let unit = db.units.find(u => u.id === id);

      function filterSingle(p: Prerequisite) {
        return p.id === unit.id || p.unitId === unit.id;
      }

      function filterPrerequisites(p: Prerequisite[]) {
        return (
          p &&
          p.length > 0 &&
          p.some(one => filterSingle(one) || filterPrerequisites(one.prerequisites))
        );
      }

      let dependencies = db.units.filter(
        u =>
          filterPrerequisites(u.prerequisites) ||
          (u.blocks || []).some(b => filterPrerequisites(b.prerequisites))
      );

      let neededUnits = [];

      for (let dep of dependencies) {
        if (dep.id !== id) {
          addUnit(neededUnits, dep, -1);
        }
      }

      addUnique(db, neededUnits, unit, 0);

      console.log(neededUnits);

      return neededUnits;
    },
    units() {
      let db = getDb();
      return db.units
        .map(u => ({
          id: u.id,
          name: u.name,
          dynamic: !!u.dynamic,
          blockCount: (u.blocks || []).length,
          level: u.level,
          outdated: u.outdated,
          processed: u.processed,
          obsolete: u.obsolete,
          proposed: u.proposed,
          hidden: u.hidden,
          topics: (u.blocks || [])
            .flatMap(f => f.topics || [])
            .map(t => t.id)
            .filter(onlyUnique)
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
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
          units: (m.units || []).map(u => ({ id: u.id }))
        }))
      }));
    }
  }
};
