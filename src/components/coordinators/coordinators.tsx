import React from 'react';
import { observer } from 'mobx-react';
import { Pane, Tablist, Heading, Text, Badge, ListItem, UnorderedList } from 'evergreen-ui';
import { State } from '../types';
import { url } from 'lib/helpers';
import Link from 'next/link';

import { SideTab, Tabs, TextField } from 'components/common/tab';
import { useRouter } from 'next/router';

import { VerticalPane } from 'components/common/vertical_pane';
import { useCoordinatorsQuery } from 'config/graphql';
import { ProgressView } from 'components/common/progress_view';
import { Coordinator } from 'config/graphql';

type DetailsProps = {
  item: Coordinator;
  view: string;
};

const Details = observer(({ item, view }: DetailsProps) => {
  return (
    <div style={{ flex: 1 }}>
      <Pane>
        <Heading size={500} marginBottom={16}>
          {item.name}
        </Heading>

        <UnorderedList>
          {item.units.map((u, i) => (
            <ListItem>
              <Link
                key={u.id}
                href={`/${view}/[category]/[item]`}
                as={`/${view}/units/${url(u.name)}-${u.id}`}
              >
                <a>
                  <Text>
                    <Badge color={u.level < 7 ? 'green' : 'red'}>{u.level < 7 ? 'UG' : 'PG'}</Badge>{' '}
                    {u.name} ({u.id})
                  </Text>
                </a>
              </Link>
            </ListItem>
          ))}
        </UnorderedList>
      </Pane>
    </div>
  );
});

type Props = {
  state: State;
  readonly: boolean;
};

// href="/editor/[category]/[item]"
// as={`/editor/units/${url(block.name)}-${block.id}`}

const EditorView: React.FC<Props> = ({ readonly }) => {
  const router = useRouter();
  const item = router.query.item as string;

  const { loading, error, data } = useCoordinatorsQuery();

  if (loading || error) {
    return <ProgressView loading={loading} error={error} />;
  }
  const view = readonly ? 'view' : 'editor';
  if (item) {
    var selected = data.coordinators.find(c => url(c.name) === item);
  }

  return (
    <>
      <VerticalPane title="Topic List">
        <Tablist flexBasis={200} width={200} marginRight={8}>
          <Tabs>
            {[...data.coordinators]
              .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
              .map(c => (
                <Link
                  key={c.name}
                  href={`/${view}/[category]/[item]`}
                  as={`/${view}/coordinators/${url(c.name)}`}
                >
                  <a>
                    <SideTab
                      key={c.name}
                      id={c.name}
                      isSelected={item === url(c.name)}
                      aria-controls={`panel-${c.name}`}
                    >
                      <Badge marginRight={8}>{c.units.length}</Badge>
                      {c.name}
                    </SideTab>
                  </a>
                </Link>
              ))}
          </Tabs>
        </Tablist>
      </VerticalPane>

      <VerticalPane title="Topic" shrink={true}>
        {item && <Details item={selected} view={view} />}
      </VerticalPane>
    </>
  );
};

export const Coordinators = observer(EditorView);
