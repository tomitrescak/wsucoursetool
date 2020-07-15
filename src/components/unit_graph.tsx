import React from 'react';

import cytoscape from 'cytoscape';
import cola from 'cytoscape-cola';
import fcose from 'cytoscape-fcose';
import spread from 'cytoscape-spread';

import { State, Block, Unit } from './types';
import { Button, Pane } from 'evergreen-ui';

cytoscape.use(cola);
cytoscape.use(fcose);
cytoscape.use(spread);

type Props = {
  units: Unit[];
  height?: string;
  colorMap: { [id: string]: string };
  buttons?: React.ReactChild | React.ReactChild[];
};

function nodeColor(type: 'self' | 'dependants' | 'dependOn') {
  if (type === 'self') {
    return 'rgb(255, 0, 0)';
  } else if (type === 'dependants') {
    return 'rgb(251, 230, 162)';
  } else if (type === 'dependOn') {
    return 'rgb(250, 226, 226)';
  }
  return 'rgb(221, 235, 247)';
}

export const UnitGraph: React.FC<Props> = ({ units, colorMap, height = '800px', buttons }) => {
  const ref = React.useRef(null);
  const cy = React.useRef(null);

  const elements: any = units.map(b => ({
    // css: {
    //   'background-color': colorMap ? colorMap[b.id] : 'rgb(221, 235, 247)',
    //   // color: textColor(b),
    //   label: b.name
    // },
    data: { id: 'n_' + b.id, name: b.name, color: colorMap ? colorMap[b.id] : 'rgb(221, 235, 247)' }
  }));

  function addPrerequisite(unit: Unit, id: string) {
    if (units.every(u => u.id !== id)) {
      return;
    }
    elements.push({
      data: { id: unit.id + id, source: 'n_' + unit.id, target: 'n_' + id }
    });
  }

  for (let unit of units) {
    if (unit.prerequisite) {
      for (let pre of unit.prerequisite) {
        addPrerequisite(unit, pre);
      }
    }
  }

  React.useEffect(() => {
    cy.current = cytoscape({
      container: ref.current,
      elements,

      style: [
        // the stylesheet for the graph
        {
          selector: 'node',
          css: {
            shape: 'round-rectangle',
            width: '200px',
            height: 'label',
            padding: '8px',
            'background-color': 'data(color)',
            label: 'data(name)',
            'text-valign': 'center',
            'text-wrap': 'wrap',
            'text-max-width': '180px'
          }
        },
        {
          selector: ':parent',
          css: {
            'text-valign': 'top',
            'background-color': '#f4f4f4',
            'background-opacity': 0.8,
            'text-max-width': '380px'
          }
        },
        {
          selector: 'edge',
          css: {
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
  }, [units]);

  return (
    <>
      <Pane display="flex" marginTop={16}>
        <Button
          style={{ height: '30px' }}
          onClick={() => {
            const layout = cy.current.layout({
              name: 'cola'
            });
            layout.run();
          }}
        >
          Layout
        </Button>
        {buttons}
      </Pane>
      <div ref={ref} id="graph" style={{ height, width: '100%' }} />
    </>
  );
};
