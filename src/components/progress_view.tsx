import React from 'react';

export const ProgressView = ({ error, loading }) => {
  if (error) return <div>Error loading</div>;
  if (loading) return <div>Loading ...</div>;
  throw new Error('Not expected');
};
