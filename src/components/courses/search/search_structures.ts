import { SearchNode, TopicSummary } from './search_helpers';
import { SfiaSkillMapping } from 'components/types';
import { UnitList, Prerequisite } from 'config/graphql';

function addPrerequisite(
  pre: Prerequisite,
  dependantNode: SearchNode,
  unitNodes: SearchNode[],
  blockNodes: SearchNode[]
) {
  ///////////////////////
  // UNIT DEPENDENCY
  ///////////////////////
  if (pre.type === 'unit') {
    // find it in unit nodes
    const dependOnUnitNode = unitNodes.find(n => n.unit.id === pre.id);
    if (dependOnUnitNode == null) {
      throw new Error('Not found');
    }

    // Unit Node depending on another unit
    if (unitNodes.indexOf(dependantNode) >= 0) {
      // add dependency to each block for the dependant unit
      for (let dependantBlock of dependantNode.unit.blocks) {
        let dependantBlockNode = blockNodes.find(
          n => n.unit.id === dependantNode.unit.id && n.block.id === dependantBlock.id
        );
        dependantBlockNode.dependsOn.push(dependOnUnitNode);
      }
    } else {
      // if block depends on another unit, make also unit depend on this unit
      let dependantUnitNode = unitNodes.find(n => n.unit.id === dependantNode.unit.id);
      if (
        dependantUnitNode.id !== dependOnUnitNode.id &&
        dependantUnitNode.dependsOn.every(n => n !== dependOnUnitNode)
      ) {
        dependantUnitNode.dependsOn.push(dependOnUnitNode);
      }
    }

    // in either case we add the dependancy on the unit
    dependantNode.dependsOn.push(dependOnUnitNode);
  }

  ///////////////////////
  // BLOCK DEPENDENCY
  ///////////////////////
  else if (pre.type === 'block') {
    const dependOnBlockNode = blockNodes.find(
      n => n.unit.id === pre.unitId && n.block.id === pre.id
    );

    if (dependOnBlockNode == null) {
      console.warn(`Dependency not found: ${pre.unitId} / ${pre.id}`);
      return;
      // throw new Error(`Not found`);
    }

    // Unit Node depending on block
    if (unitNodes.indexOf(dependantNode) >= 0) {
      // add dependency also for each block of this unit, in case we only take the single block
      for (let dependantBlock of dependantNode.unit.blocks) {
        let dependantBlockNode = blockNodes.find(
          n => n.unit.id === dependantNode.unit.id && n.block.id === dependantBlock.id
        );
        dependantBlockNode.dependsOn.push(dependOnBlockNode);
      }
    } else {
      // if block depends on another block, make also unit depend on the unit of this block
      let dependantUnitNode = unitNodes.find(n => n.unit.id === dependantNode.unit.id);
      let dependOnUnitNode = unitNodes.find(n => n.unit.id === pre.unitId);
      if (
        dependantUnitNode.id !== dependOnUnitNode.id &&
        dependantUnitNode.dependsOn.every(n => n !== dependOnUnitNode)
      ) {
        dependantUnitNode.dependsOn.push(dependOnUnitNode);
      }
    }

    // in either case we add the dependancy on the block
    dependantNode.dependsOn.push(dependOnBlockNode);
  }
}

export function createSearchNodes(db: { units: UnitList[] }) {
  let searchBlockId = 0;
  const unitNodes: SearchNode[] = db.units
    .filter(u => u.level < 7)
    .map(u => ({
      id: searchBlockId++,
      unit: {
        ...u,
        offer: u.offer || [],
        level: u.level || 0,
        blocks: u.blocks || [],
        prerequisites: u.prerequisites || [],
        credits: u.blocks.reduce((prev, next) => next.credits + prev, 0)
      },
      dependsOn: [],
      semester: 0,
      credits: parseFloat(u.credits as any),
      topics: u.blocks.reduce((prev, next) => {
        for (let topic of next.topics || []) {
          let current = prev.find(p => p.id === topic.id);
          if (current) {
            current.credits += topic.ratio * next.credits;
          } else {
            prev.push({ credits: topic.ratio * next.credits, id: topic.id });
          }
        }
        return prev;
      }, [] as TopicSummary[]),
      sfiaSkills: u.blocks.reduce((prev, next) => {
        for (let sfia of next.sfiaSkills || []) {
          let current = prev.find(p => p.id === sfia.id);
          if (current) {
            current.level += sfia.level;
          } else {
            prev.push({ ...sfia });
          }
        }
        return prev;
      }, [] as SfiaSkillMapping[])
    }));

  const blockNodes: SearchNode[] = db.units
    .filter(u => u.level < 7)
    .flatMap(u =>
      u.blocks.map(b => ({
        id: searchBlockId++,
        block: b,
        credits: parseFloat(b.credits as any),
        unit: u,
        semester: 0,
        dependsOn: [],
        topics: (b.topics || []).map(t => ({
          id: t.id,
          credits: t.ratio * b.credits
        })),
        sfiaSkills: b.sfiaSkills
      }))
    );

  // add blocks to unit nodes
  unitNodes.forEach(u => (u.blocks = blockNodes.filter(b => b.unit.id === u.unit.id)));

  ///////////////////////////////////////////////
  // add unit prerequisites
  ///////////////////////////////////////////////

  for (let node of unitNodes) {
    for (let pre of (node.unit.prerequisites || []).filter(p => !p.recommended)) {
      // add unit prerequisite
      addPrerequisite(pre, node, unitNodes, blockNodes);
    }
  }

  ///////////////////////////////////////////////
  // add block prerequisites
  ///////////////////////////////////////////////

  for (let node of blockNodes) {
    for (let pre of (node.block.prerequisites || []).filter(p => !p.recommended)) {
      addPrerequisite(pre, node, unitNodes, blockNodes);
    }
  }

  return { unitNodes, blockNodes };
}

/************************************************* */
/* LOG ******************************************* */
/************************************************* */

// fs.writeFileSync(
//   "./data/block-edges.csv",
//   `"From Unit", "From Block", "To Unit", "To Block"` +
//     blockEdges
//       .map(
//         (s) =>
//           '"' +
//           s[0].unit.name +
//           '","' +
//           s[0].block.name +
//           '","' +
//           s[1].unit.name +
//           '","' +
//           s[1].block.name +
//           '"'
//       )
//       .join("\n"),
//   { encoding: "utf-8" }
// );

// fs.writeFileSync(
//   "./data/unit-edges.csv",
//   `"From Unit", "From Block", "To Unit", "To Block"` +
//     unitEdges
//       .map((s) => '"' + s[0].unit.name + '","' + s[1].unit.name + '"')
//       .join("\n"),
//   { encoding: "utf-8" }
// );

// fs.writeFileSync(
//   "./data/sorted-units.csv",
//   sortedUnits
//     .map(
//       (s) =>
//         `"${s.unit.name}", "${(s.unit.name || "").replace(/\n/g, " ").trim()}"`
//     )
//     .join("\n"),
//   {
//     encoding: "utf-8",
//   }
// );

// fs.writeFileSync(
//   "./data/sorted-blocks.csv",
//   sortedBlocks
//     .map(
//       (s) =>
//         `"${s.unit.name}", "${(s.block.name || "").replace(/\n/g, " ").trim()}"`
//     )
//     .join("\n"),
//   {
//     encoding: "utf-8",
//   }
// );

// fs.writeFileSync(
//   "./data/units.csv",
//   sortedBlocks
//     .map((s) => s.unit.name)
//     .filter((a, i) => sortedBlocks.findIndex((s) => s.unit.name === a) === i)
//     .join("\n"),
//   {
//     encoding: "utf-8",
//   }
// );
