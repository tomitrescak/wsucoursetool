import React from 'react';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { UnitGraph } from './units_graph';

const QUERY = gql`
  query LoadUnits {
    loadUnits
  }
`;

export function UnitContainer() {
  const { loading, error, data, fetchMore, networkStatus } = useQuery(QUERY, {
    // Setting this value to true will make the component rerender when
    // the "networkStatus" changes, so we are able to know if it is fetching
    // more data
    notifyOnNetworkStatusChange: true
  });

  if (error) return <div>Error loading</div>;
  if (loading) return <div>Loading ...</div>;

  const units = JSON.parse(data.loadUnits);
  const unitArr = Object.keys(units).map(k => units[k]);

  return (
    <div style={{ display: 'flex' }}>
      {/* <div>
        {Object.keys(units).map(k => (
          <div key={k}>{k}</div>
        ))}
      </div> */}
      <UnitGraph unitArr={unitArr} />
    </div>
  );
}
