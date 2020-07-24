import { Unit, CourseConfig, Entity } from 'components/types';

type Dependency = {
  level: number;
  unit: Entity;
};

function findDependencies(
  unit: Unit,
  db: CourseConfig,
  dependencies: Dependency[],
  level: number,
  maxLevel
) {
  if (dependencies.some(s => s.unit.id === unit.id)) {
    return;
  }
  dependencies.push({ level, unit: { id: unit.id, name: unit.name } });

  // find units depending on this unit
  let depenendants = db.units.filter(
    u => u.prerequisite && u.prerequisite.some(p => p === unit.id)
  );
  for (let d of depenendants) {
    if (level < maxLevel) {
      findDependencies(d, db, dependencies, level + 1, maxLevel);
    }
  }
}

export function calculateDependencies(unit: Unit, db: CourseConfig) {
  // find all depenedencies
  let dependencies: Dependency[] = [];

  let ownDependencies = 0;

  // add own dependencies
  if (unit.prerequisite && unit.prerequisite.length) {
    ownDependencies = unit.prerequisite.length;
    for (let u of unit.prerequisite) {
      let found = db.units.find(un => un.id === u);
      if (!found) {
        found = { id: u, name: u } as any;
      }
      dependencies.push({ level: -1, unit: { id: found.id, name: found.name } });
    }
  }

  findDependencies(unit, db, dependencies, 0, 5);
}
