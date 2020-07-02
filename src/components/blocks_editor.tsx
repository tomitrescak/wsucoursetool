import React from 'react';
import { useRouter } from 'next/router';
import { State } from './types';
import { BlocksEditor } from './block_editor';
import { url } from 'lib/helpers';
import { observer } from 'mobx-react';

type Props = {
  state: State;
  readonly: boolean;
};

const EditorView: React.FC<Props> = ({ state, readonly }) => {
  const router = useRouter();
  const item = router.query.item as string;
  const split = item ? item.split('-') : null;
  const selectedId = split ? split[split.length - 1] : null;

  return (
    <BlocksEditor
      readonly={readonly}
      blocks={state.courseConfig.blocks}
      selectedBlockId={selectedId}
      state={state}
      unit={null}
      title="Blocks"
      url={block => `/editor/blocks/${url(block.name)}-${block.id}`}
    />
  );
};

export const AllBlocksEditor = observer(EditorView);
