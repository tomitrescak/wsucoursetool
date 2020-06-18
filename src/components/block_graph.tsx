import React from 'react';

import cytoscape from 'cytoscape';
import cola from 'cytoscape-cola';
import fcose from 'cytoscape-fcose';

import { State, Block } from './types';

cytoscape.use(cola);
cytoscape.use(fcose);

type Props = {
  state: State;
};

function nodeColor(block: Block) {
  switch (block.type) {
    case 'assignment':
      return 'rgb(251, 230, 162)';
    case 'exam':
      return 'rgb(250, 226, 226)';
    case 'knowledge':
      return 'rgb(212, 238, 226)';
    case 'practical':
      return 'rgb(221, 235, 247)';
    case 'wil':
      return 'teal';
  }
}

function textColor(block: Block) {
  switch (block.type) {
    case 'assignment':
      return 'rgb(66, 90, 112);';
    case 'exam':
      return 'rgb(191, 14, 8)';
    case 'knowledge':
      return 'rgb(0, 120, 62)';
    case 'practical':
      return 'rgb(8, 75, 138)';
    case 'wil':
      return 'black';
  }
}

export const Graph: React.FC<Props> = ({ state }) => {
  const ref = React.useRef(null);
  const cy = React.useRef(null);
  const elements: any = state.courseConfig.blocks.map(b => ({
    style: {
      'background-color': nodeColor(b),
      color: textColor(b),
      label: b.name
    },
    data: { id: 'n_' + b.id, parent: 'u_' + b.mappedUnitId }
  }));
  elements.push(
    ...state.courseConfig.units.map(u => ({
      style: {
        label: u.name,
        background: 'white'
      },
      data: { id: 'u_' + u.id }
    }))
  );
  elements.push(
    ...state.courseConfig.blocks.flatMap(b =>
      b.prerequisites.map(p => ({
        data: { id: b.id + p.id, source: 'n_' + b.id, target: 'n_' + p.id }
      }))
    )
  );

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
            name: 'fcose'
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
