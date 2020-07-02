import React from 'react';
import { Text, Badge, Textarea } from 'evergreen-ui';
import marked from 'marked';

export const TextEditor = ({ label, owner, field }) => {
  const [isPreview, setPreview] = React.useState(false);

  return (
    <>
      <Text
        is="label"
        htmlFor="outcome"
        fontWeight={500}
        marginBottom={8}
        marginTop={16}
        display="block"
      >
        {label}{' '}
        <Badge cursor="pointer" onClick={() => setPreview(!isPreview)}>
          {isPreview ? 'Editor' : 'Preview'}
        </Badge>
      </Text>
      {isPreview ? (
        <Text dangerouslySetInnerHTML={{ __html: marked(owner[field]) }} />
      ) : (
        <Textarea
          id="outcome"
          value={owner[field]}
          onChange={e => (owner[field] = e.currentTarget.value)}
        />
      )}
    </>
  );
};
