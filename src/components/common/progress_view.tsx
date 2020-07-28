import React from 'react';
import { Text, Spinner, Alert } from 'evergreen-ui';

export const ProgressView = ({ error, loading }) => {
  if (error)
    return (
      <Alert title="Error Loading Data">
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </Alert>
    );
  if (loading)
    return (
      <div>
        <Text is="div" display="flex" alignItems="center">
          <Spinner size={16} marginRight={8} /> Loading ...
        </Text>
      </div>
    );
  throw new Error('Not expected');
};
