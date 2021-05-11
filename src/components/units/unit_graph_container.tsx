import React from 'react';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { UnitGraph } from './units_graph';
import { BlockDependencyGraph } from 'components/blocks/block_graph';
import { useSaveLegacyUnitsMutation } from 'config/graphql';
import { toaster } from 'evergreen-ui';

const QUERY = gql`
  query LoadUnits {
    legacyUnits
  }
`;

const classes = [
  {
    selector: '.required',
    style: {
      'target-arrow-color': 'red',
      'background-color': 'red',
      'line-color': 'red'
    }
  },
  {
    selector: '.proposed',
    style: {
      backgroundColor: 'purple',
      color: 'black',
      fontWeight: 'bold'
    }
  },
  {
    selector: '.core',
    style: {
      backgroundColor: '#efefe0',
      color: 'black'
    }
  },
  {
    selector: '.elective',
    style: {
      backgroundColor: 'rgb(212, 238, 226)',
      color: 'black'
    }
  },
  {
    selector: '.proposed',
    style: {
      color: 'purple',
      fontWeight: 'bold',
      borderColor: 'purple',
      borderWidth: '4px'
    }
  },
  {
    selector: '.obsolete',
    style: {
      border: 'solid red 3px'
    }
  }
];

export function UnitContainer() {
  const { loading, error, data, fetchMore, networkStatus } = useQuery(QUERY, {
    // Setting this value to true will make the component rerender when
    // the "networkStatus" changes, so we are able to know if it is fetching
    // more data
    notifyOnNetworkStatusChange: true
  });
  const [save] = useSaveLegacyUnitsMutation({
    onCompleted() {
      toaster.notify('Saved');
    }
  });

  const owner = React.useMemo(() => JSON.parse(data?.legacyUnits || '{}'), [data?.legacyUnits]);

  if (error) return <div>Error loading</div>;
  if (loading) return <div>Loading ...</div>;

  // const units = JSON.parse(data.legacyUnits);

  return (
    <div>
      {/* <div>
        {Object.keys(units).map(k => (
          <div key={k}>{k}</div>
        ))}
      </div> */}
      <BlockDependencyGraph
        units={owner.units}
        otherUnits={[]}
        owner={owner}
        classes={classes}
        unitClass={() => []}
        blockClass={() => null}
        save={() =>
          save({
            variables: {
              units: JSON.stringify(owner)
            }
          })
        }
      />
    </div>
  );
}
