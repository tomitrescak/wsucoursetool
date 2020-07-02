import React from 'react';

import cytoscape from 'cytoscape';
import cola from 'cytoscape-cola';
import fcose from 'cytoscape-fcose';
import spread from 'cytoscape-spread';

import { State, Block } from './types';

cytoscape.use(cola);
cytoscape.use(fcose);
cytoscape.use(spread);

type Unit = {
  name: string;
  code: string;
  level: string;
  credits: string;
  coordinator: string;
  about: string;
  assumed: string;
  prerequisite: string[];
  rawPrerequisite: string[];
};

type Units = { [index: string]: Unit };

type Props = {
  units: Units;
};

function nodeColor(unit: Unit) {
  if (unit.rawPrerequisite) {
    return 'rgb(255, 0, 0)';
  } else if (unit.code[0] === '2') {
    return 'rgb(251, 230, 162)';
  } else if (unit.code[0] === '3') {
    return 'rgb(250, 226, 226)';
  } else if (unit.code[0] === '7') {
    return 'rgb(221, 235, 247)';
  }
}

function textColor(block: Block) {
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

export const UnitGraph: React.FC<Props> = ({ units }) => {
  const ref = React.useRef(null);
  const cy = React.useRef(null);

  const unitArr = Object.keys(units).map(k => units[k]);

  const elements: any = unitArr
    .filter(u => u.name.indexOf('WSTC') === -1)
    .map(b => ({
      style: {
        'background-color': nodeColor(b),
        // color: textColor(b),
        label: b.name
      },
      data: { id: 'n_' + b.code }
    }));

  function addPrerequisite(unit: Unit, pre: string) {
    if (unitArr.every(u => u.code !== pre)) {
      elements.push({
        style: {
          'background-color': '#dedede',
          // color: textColor(b),
          label: pre
        },
        data: { id: 'n_' + pre }
      });
    }
    elements.push({
      data: { id: unit.code + pre, source: 'n_' + unit.code, target: 'n_' + pre }
    });
  }

  for (let unit of unitArr) {
    if (unit.name.indexOf('WSTC') > 0) {
      continue;
    }

    if (unit.prerequisite) {
      for (let pre of unit.prerequisite) {
        addPrerequisite(unit, pre);
      }
    }
    // if (unit.rawPrerequisite) {
    //   for (let rp of unit.rawPrerequisite) {
    //     for (let match of Array.from(rp.matchAll(/\d\d\d\d\d\d/g))) {
    //       addPrerequisite(unit, match[0]);
    //     }
    //   }
    // }
  }

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
            'background-color': '#666',
            label: 'data(id)',
            'text-valign': 'center',
            'text-wrap': 'wrap',
            'text-max-width': '180px'
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
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier'
          }
        }
      ],

      layout: {
        name: 'fcose',
        rows: 1,
        nodeSeparation: 250
      }
    });
  }, []);

  return (
    <>
      <button
        style={{ height: '30px' }}
        onClick={() => {
          const layout = cy.current.layout({
            name: 'cola'
          });
          layout.run();
        }}
      >
        Layout
      </button>
      <div ref={ref} id="graph" style={{ height: '800px', width: '100%' }} />
    </>
  );
};
