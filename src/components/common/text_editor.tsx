import React from 'react';
import { Text, Badge, Textarea } from 'evergreen-ui';
import marked from 'marked';
import { observer } from 'mobx-react';

type Props = {
  label: string;
  owner: any;
  field: string;
  parser?: Function;
};

export const TextEditor = observer(({ label, owner, field, parser }: Props) => {
  const [isPreview, setPreview] = React.useState(true);

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
        parser ? (
          parser(owner[field] || '')
        ) : (
          <Text
            dangerouslySetInnerHTML={{
              __html: marked(
                (owner[field] || '')
                  .replace(/-(\w)/g, '- $1')
                  .replace(/•/g, '*')
                  .replace(/(\S)<br>-/g, '$1\n\n-')
                  .replace(/<br>/g, '')
              )
            }}
          />
        )
      ) : (
        <Textarea
          id="outcome"
          value={owner[field]}
          onChange={e => (owner[field] = e.currentTarget.value)}
        />
      )}
    </>
  );
});
