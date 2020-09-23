import React from 'react';

import cytoscape from 'cytoscape';

import cola from 'cytoscape-cola';
import fcose from 'cytoscape-fcose';
// import edgeEditing from 'cytoscape-edge-editing';
// import contextMenus from 'cytoscape-context-menus';

import { State, Block, Unit } from '../types';
import { UnitDependency, BlockDependency, Prerequisite } from 'config/graphql';
import { Button, Checkbox, Pane, Select, IconButton } from 'evergreen-ui';
import { toJS } from 'mobx';
import { saveAs } from 'file-saver';
import { AddBlockModalView } from './add_block_modal';
// import $ from 'jquery';
// import { url } from 'lib/helpers';

(global as any).cytoscape = cytoscape;
require('cytoscape-undo-redo');

// if (edgeEditing.initialised == undefined) {
//   edgeEditing(cytoscape, $);
//   cytoscape.use(contextMenus, $);
//   edgeEditing.initialised = true;
// }
// (global as any).$ = $;

cytoscape.use(cola);
cytoscape.use(fcose);

type Props = {
  owner: any;
  units: UnitDependency[];
  allBlocks?: boolean;
  byLevel?: boolean;
  classes: Array<{ selector: string; style: any }>;
  unitClass: (node: Unit | UnitDependency) => string[];
  blockClass: (node: Block) => string;
};

let interval = null;

function savePositions(cy, owner) {
  // const edges = cy.edgeEditing('get');

  const originalPositions = [...owner.positions];
  const newPositions = cy
    .nodes()
    .map(node => ({
      id: node.id(),
      x: node.position().x,
      y: node.position().y
    }))
    .concat([
      {
        id: 'config',
        pan: cy.pan(),
        zoom: cy.zoom()
      }
    ]);

  const finalPositions = newPositions.concat(
    originalPositions.filter(p => newPositions.every(np => np.id !== p.id))
  );
  owner.positions = finalPositions;
  // .concat(
  //   cy.edges().map(e => {
  //     const pointArray = edges.getSegmentPoints(e);
  //     if (pointArray) {
  //       var points = [];
  //       for (let i = 0; i < pointArray.length; i += 2) {
  //         points.push({
  //           x: pointArray[i],
  //           y: pointArray[i + 1]
  //         });
  //       }
  //     }
  //     return {
  //       id: e.id(),
  //       points
  //     };
  //   })
  // );
}

function delaySavePositions(cy, owner) {
  if (interval != null) {
    clearTimeout(interval);
  }
  interval = setTimeout(() => savePositions(cy, owner), 500);
}

export const BlockDependencyGraph: React.FC<Props> = ({
  owner,
  units,
  allBlocks,
  byLevel,
  classes,
  unitClass,
  blockClass
}) => {
  const ref = React.useRef(null);
  const cy = React.useRef(null);
  const ur = React.useRef(null);

  const [showAllBlocks, toggleAllBlocks] = React.useState(true);

  var initialZoom = 1;
  if (owner) {
    const config = owner.positions.find(p => p.id === 'config');
    if (config) {
      initialZoom = config.zoom;
    }
  }
  const [zoom, setZoom] = React.useState(initialZoom);

  const elements: any = [];
  function checkAddUnit(unitId: string) {
    const id = 'n_' + unitId;
    if (elements.some(e => e.data.id === 'n_' + unitId)) {
      return;
    }

    if (owner) {
      var position = toJS(owner.positions.find(n => n.id === id));
    }

    elements.push({
      position,
      // classes: 'level' + unit.level,
      data: {
        id,
        backgroundColor: 'red', // nodeColor(block),
        color: 'black', // textColor(block),
        label: unitId
      }
    });
  }

  function checkAddLevel(level: number) {
    const id = 'level_' + level;
    if (elements.some(e => e.data.id === id)) {
      return id;
    }
    if (owner) {
      var position = toJS(owner.positions.find(n => n.id === id));
    }

    elements.push({
      position,
      // classes: 'level' + unit.level,
      data: {
        id,
        backgroundColor: '#dedede', // nodeColor(block),
        color: 'black', // textColor(block),
        label: 'Level ' + level
      }
    });

    return id;
  }

  for (let unit of units) {
    let id = 'u_' + unit.id;
    if (owner) {
      var position = toJS(owner.positions.find(n => n.id === id));
    }

    elements.push({
      position,
      classes: unitClass(unit),
      data: {
        id,
        // parent: checkAddLevel(unit.level),
        backgroundColor: '#cdcdcd',
        color: 'black',
        label: `${unit.name} (${unit.id})`
      }
    });
  }

  for (let unit of units) {
    if (showAllBlocks && unit.processed) {
      for (let block of unit.blocks) {
        checkAddBlock(unit.id, block.id);
      }
    }
  }

  function checkAddBlock(unitId: string, blockId: string) {
    const id = 'n_' + unitId + '_' + blockId;
    if (elements.some(e => e.data.id === id)) {
      return;
    }

    const unit = units.find(u => u.id === unitId);
    if (unit == null) {
      elements.push({
        position,
        classes: ['unknown'],
        data: {
          id: id,
          parent: 'u_' + unitId,
          backgroundColor: 'red', // nodeColor(block),
          color: 'white', // textColor(block),
          label: id
        }
      });
      return;
    }
    const block: Block = unit.blocks.find(b => b.id === blockId);
    if (owner) {
      var position = toJS(owner.positions.find(n => n.id === id));
    }
    const newBlockId = 'n_' + unit.id + '_' + block.id;
    elements.push({
      position,
      classes: blockClass(block),
      data: {
        id: newBlockId,
        parent: 'u_' + unit.id,
        backgroundColor: 'rgb(251, 230, 162)', // nodeColor(block),
        color: block.replacedByUnit ? 'red' : 'black', // textColor(block),
        label: block.name
      }
    });

    // if block is replaced add replacement connection

    if (block.replacedByUnit) {
      // checkAddUnit(block.replacedByUnit);
      checkAddBlock(block.replacedByUnit, block.replacedByBlock);

      elements.push({
        classes: ['replaced'],
        data: {
          id: 'lr_' + block.id + '_' + block.replacedByUnit + '_' + block.replacedByBlock,
          source: newBlockId,
          target:
            'n_' + block.replacedByUnit + (block.replacedByBlock ? '_' + block.replacedByBlock : '')
          // cyedgebendeditingWeights: [1],
          // cyedgebendeditingDistances: [175]
        }
      });
    }
  }

  function addUnitPrerequisites(prerequisites: Prerequisite[], u: UnitDependency) {
    const sourceId = 'u_' + u.id;

    for (let pre of prerequisites) {
      if (pre.prerequisites && pre.prerequisites.length > 0) {
        addUnitPrerequisites(pre.prerequisites, u);
      } else if (pre.type === 'block') {
        checkAddBlock(pre.unitId, pre.id);

        const id = 'n_' + pre.unitId + '_' + pre.id;
        if (elements.some(e => e.data.id === id)) {
          elements.push({
            classes: pre.recommended === true ? 'recommended' : 'required',
            data: {
              id: 'l_' + sourceId + '_' + id,
              source: sourceId,
              target: id
              // cyedgebendeditingWeights: [1],
              // cyedgebendeditingDistances: [175]
            }
          });
        }
      } else if (pre.type === 'unit') {
        const id = 'u_' + pre.id;
        if (elements.some(e => e.data.id === id)) {
          elements.push({
            classes: pre.recommended === true ? 'recommended' : 'required',
            data: {
              id: 'l_' + sourceId + '_' + id,
              source: sourceId,
              target: id
              // cyedgebendeditingWeights: [1],
              // cyedgebendeditingDistances: [175]
            }
          });
        }
      }
    }
  }

  function addBlockPrerequisites(
    prerequisites: Prerequisite[],
    u: UnitDependency,
    b: BlockDependency,
    allBlocks: boolean
  ) {
    const sourceId = 'n_' + u.id + '_' + b.id;

    for (let pre of prerequisites) {
      if (pre.prerequisites && pre.prerequisites.length > 0) {
        addBlockPrerequisites(pre.prerequisites, u, b, allBlocks);
      } else if (pre.type == 'block' && (allBlocks || pre.unitId !== u.id)) {
        checkAddBlock(u.id, b.id);
        checkAddBlock(pre.unitId, pre.id);

        const id = 'n_' + pre.unitId + '_' + pre.id;
        if (pre.unitId && elements.some(e => e.data.id === id)) {
          elements.push({
            classes: pre.recommended === true ? 'recommended' : 'required',
            data: {
              id: 'l_' + sourceId + '_' + id,
              source: sourceId,
              target: id
              // cyedgebendeditingWeights: [1],
              // cyedgebendeditingDistances: [175]
            }
          });
        }
      } else if (pre.type === 'unit') {
        const id = 'u_' + pre.id;
        if (elements.some(e => e.data.id === id)) {
          elements.push({
            classes: pre.recommended === true ? 'recommended' : 'required',
            data: {
              id: 'l_' + sourceId + '_' + id,
              source: sourceId,
              target: id
              // cyedgebendeditingWeights: [1],
              // cyedgebendeditingDistances: [175]
            }
          });
        }
      }
    }
  }

  for (let u of units) {
    // add unit prerequisites
    if (u.prerequisites && u.prerequisites.length) {
      addUnitPrerequisites(u.prerequisites, u);
    }
    // add block prerequisites
    for (let b of u.blocks) {
      if (b.prerequisites && b.prerequisites.length > 0) {
        addBlockPrerequisites(b.prerequisites, u, b, showAllBlocks);
      }
    }
  }

  // for (let u of units) {

  // }

  React.useEffect(() => {
    cy.current = cytoscape({
      container: ref.current,
      elements,

      style: [
        // the stylesheet for the graph
        {
          selector: 'node',
          style: {
            shape: 'round-rectangle',
            width: '200px',
            height: 'label',
            padding: '8px',
            // 'background-color': '#666',
            'text-valign': 'center',
            'text-wrap': 'wrap',
            'text-max-width': '180px',
            backgroundColor: 'data(backgroundColor)',
            color: 'data(color)',
            label: 'data(label)'
          }
        },
        {
          selector: ':parent',
          style: {
            'text-valign': 'top',
            'background-color': '#f4f4f4',
            'background-opacity': 0.8,
            'text-max-width': '380px'
          }
        },
        {
          selector: 'edge',
          style: {
            width: 3,
            // 'line-color': 'pink',
            // 'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier'
          }
        },
        {
          selector: '.replaced',
          style: {
            width: 3,
            'line-color': '#dedede',
            'line-style': 'dashed'
          }
        },
        ...classes
        // switch (block.type) {
        //   case 'assignment':
        //     return 'rgb(251, 230, 162)';
        //   case 'exam':
        //     return 'rgb(250, 226, 226)';
        //   case 'knowledge':
        //     return 'rgb(212, 238, 226)';
        //   case 'practical':
        //     return 'rgb(221, 235, 247)';
        //   case 'wil':
        //     return 'teal';
      ],

      layout: {
        name: 'preset',
        rows: 1,
        nodeSeparation: 250
      }
    });

    if (owner) {
      cy.current.on('drag', 'node', function (e) {
        delaySavePositions(cy.current, owner);
      });
      cy.current.on('zoom', () => {
        delaySavePositions(cy.current, owner);
      });
      cy.current.on('pan', () => {
        delaySavePositions(cy.current, owner);
      });
      cy.current.on('select', 'edge', () => {
        delaySavePositions(cy.current, owner);
      });
      // cy.current.on('cyedgebendediting.moveBendPoints', 'edge', () => {
      //   console.log('Bendpoints moved');
      // });

      const config = owner.positions.find(p => p.id === 'config');
      if (config) {
        cy.current.pan(config.pan);
        cy.current.zoom(config.zoom);
      }
    }

    cy.current.userZoomingEnabled(false);
    // cy.current.edgeEditing({
    //   undoable: true,
    //   bendRemovalSensitivity: 16
    //   // bendPositionsFunction: function (ele) {
    //   //   if (owner) {
    //   //     const position = owner.positions.find(p => p.id === ele.id());
    //   //     return position ? toJS(position.points) : [];
    //   //   }
    //   //   return [];
    //   // }
    // });
    ur.current = cy.current.undoRedo({});
  }, [showAllBlocks]);

  React.useEffect(() => {
    cy.current.zoom(zoom);
  }, [zoom]);

  // React.useEffect(() => {
  //   console.log(cy.current);
  //   cy.current.forceRender();
  //   // cy.current.initRerender();
  // });

  return (
    <>
      <Pane display="flex" alignItems="center">
        <IconButton
          icon="zoom-in"
          onClick={() => {
            setZoom(zoom + 0.02);
          }}
          marginRight={8}
        >
          Layout
        </IconButton>
        <IconButton
          icon="zoom-out"
          onClick={() => {
            setZoom(zoom - 0.02);
          }}
          marginRight={8}
        >
          Layout
        </IconButton>
        <IconButton
          icon="undo"
          onClick={() => {
            ur.current.undo();
          }}
          marginRight={8}
        >
          Layout
        </IconButton>
        <IconButton
          icon="redo"
          onClick={() => {
            ur.current.redo();
          }}
          marginRight={8}
        >
          Layout
        </IconButton>
        <Button
          onClick={() => {
            const layout = cy.current.layout({
              name: 'fcose'
            });
            layout.run();
          }}
        >
          Layout
        </Button>
        <Button
          marginLeft={8}
          iconBefore="floppy-disk"
          onClick={() => {
            saveAs(cy.current.png(), 'graph.png');
          }}
        >
          png
        </Button>
        <Checkbox
          label="All Blocks"
          margin={0}
          marginLeft={8}
          checked={showAllBlocks}
          onChange={e => toggleAllBlocks(e.currentTarget.checked)}
        />
      </Pane>
      <div ref={ref} id="graph" style={{ height: '1800px', minWidth: '700px', width: '100%' }} />
    </>
  );
};
