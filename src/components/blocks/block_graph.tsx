import React from 'react';

import cytoscape from 'cytoscape';
import cola from 'cytoscape-cola';
import fcose from 'cytoscape-fcose';
import edgeEditing from 'cytoscape-edge-editing';
import contextMenus from 'cytoscape-context-menus';

import { State, Block, Unit } from '../types';
import { UnitDependency, BlockDependency, Prerequisite } from 'config/graphql';
import { Button } from 'evergreen-ui';
import { toJS } from 'mobx';
import { saveAs } from 'file-saver';
import $ from 'jquery';

console.log('EDITING');

if (edgeEditing.initialised == undefined) {
  edgeEditing(cytoscape, $);
  cytoscape.use(contextMenus, $);
  edgeEditing.initialised = true;
}

global.$ = $;

cytoscape.use(cola);
cytoscape.use(fcose);

type Props = {
  owner: any;
  units: UnitDependency[];
};

function nodeColor(block: BlockDependency) {
  return 'rgb(251, 230, 162)';
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
  // }
}

function textColor(block: BlockDependency) {
  return 'rgb(66, 90, 112)';

  // switch (block.type) {
  //   case 'assignment':
  //     return 'rgb(66, 90, 112);';
  //   case 'exam':
  //     return 'rgb(191, 14, 8)';
  //   case 'knowledge':
  //     return 'rgb(0, 120, 62)';
  //   case 'practical':
  //     return 'rgb(8, 75, 138)';
  //   case 'wil':
  //     return 'black';
  // }
}

let interval = null;

function savePositions(cy, owner) {
  const edges = cy.edgeEditing('get');

  owner.positions = cy
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
    ])
    .concat(
      cy.edges().map(e => {
        const pointArray = edges.getSegmentPoints(e);
        if (pointArray) {
          var points = [];
          for (let i = 0; i < pointArray.length; i += 2) {
            points.push({
              x: pointArray[i],
              y: pointArray[i + 1]
            });
          }
        }
        return {
          id: e.id(),
          points
        };
      })
    );
  console.log(owner.positions);
}

function delaySavePositions(cy, owner) {
  if (interval != null) {
    clearTimeout(interval);
  }
  interval = setTimeout(() => savePositions(cy, owner), 500);
}

export const BlockDependencyGraph: React.FC<Props> = ({ owner, units }) => {
  const ref = React.useRef(null);
  const cy = React.useRef(null);

  const elements: any = [];
  for (let unit of units) {
    let id = 'u_' + unit.id;
    if (owner) {
      var position = toJS(owner.positions.find(n => n.id === id));
    }

    elements.push({
      position,
      classes: 'level' + unit.level,
      data: {
        id,
        backgroundColor: '#cdcdcd',
        color: 'black',
        label: `${unit.name} (${unit.id})`
      }
    });
  }

  function checkAddBlock(unitId: string, blockId: string) {
    const id = 'n_' + unitId + '_' + blockId;
    if (elements.some(e => e.data.id === id)) {
      return;
    }

    const unit = units.find(u => u.id === unitId);
    if (unit == null) {
      return;
    }
    const block = unit.blocks.find(b => b.id === blockId);
    if (owner) {
      var position = toJS(owner.positions.find(n => n.id === id));
    }

    elements.push({
      position,
      classes: 'level' + unit.level,
      data: {
        id: 'n_' + unit.id + '_' + block.id,
        parent: 'u_' + unit.id,
        backgroundColor: nodeColor(block),
        color: textColor(block),
        label: block.name
      }
    });
  }

  function addUnitPrerequisites(prerequisites: Prerequisite[], u: UnitDependency) {
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
              id: 'l_' + u.id + '_' + pre.id,
              source: 'u_' + u.id,
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
              id: 'l_' + u.id + '_' + pre.id,
              source: 'u_' + u.id,
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
    b: BlockDependency
  ) {
    for (let pre of prerequisites) {
      if (pre.prerequisites && pre.prerequisites.length > 0) {
        addBlockPrerequisites(pre.prerequisites, u, b);
      } else if (pre.type == 'block' && pre.unitId !== u.id) {
        checkAddBlock(u.id, b.id);
        checkAddBlock(pre.unitId, pre.id);

        const id = 'n_' + pre.unitId + '_' + pre.id;
        if (pre.unitId && elements.some(e => e.data.id === id))
          elements.push({
            classes: pre.recommended === true ? 'recommended' : 'required',
            data: {
              id: 'l_' + u.id + '_' + pre.id,
              source: 'n_' + u.id + '_' + b.id,
              target: id
              // cyedgebendeditingWeights: [1],
              // cyedgebendeditingDistances: [175]
            }
          });
      } else if (pre.type === 'unit') {
        const id = 'u_' + pre.id;
        if (elements.some(e => e.data.id === id)) {
          elements.push({
            classes: pre.recommended === true ? 'recommended' : 'required',
            data: {
              id: 'l_' + u.id + '_' + pre.id,
              source: 'u_' + u.id,
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
        addBlockPrerequisites(b.prerequisites, u, b);
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
            'line-color': 'pink',
            // 'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier'
          }
        },
        {
          selector: '.required',
          style: {
            'target-arrow-color': 'red',
            'background-color': 'red',
            'line-color': 'red'
          }
        },
        {
          selector: '.level-1',
          style: {
            backgroundColor: 'rgb(221, 235, 247)',
            color: 'black'
          }
        },
        {
          selector: '.level0',
          style: {
            backgroundColor: 'rgb(251, 230, 162)'
          }
        },
        {
          selector: '.level1',
          style: {
            backgroundColor: 'rgb(212, 238, 226)'
          }
        },
        {
          selector: '.level2',
          style: {
            backgroundColor: 'rgb(221, 235, 247)'
          }
        },
        {
          selector: '.level3',
          style: {
            backgroundColor: 'rgb(221, 235, 247)'
          }
        },

        {
          selector: '.recommended',
          style: {
            'target-arrow-color': 'green',
            'background-color': 'green',
            'line-color': 'green'
          }
        }
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

    cy.current.edgeEditing({
      undoable: false,
      bendRemovalSensitivity: 16,
      bendPositionsFunction: function (ele) {
        if (owner) {
          const position = owner.positions.find(p => p.id === ele.id());
          return position ? toJS(position.points) : [];
        }
        return [];
      }
    });
  }, []);

  return (
    <>
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
      <div ref={ref} id="graph" style={{ height: '800px', minWidth: '700px', width: '100%' }} />
    </>
  );
};
