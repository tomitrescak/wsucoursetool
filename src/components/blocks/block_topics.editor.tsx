import { BlockModel, BlockTopicModel } from 'components/classes';
import { Expander } from 'components/common/expander';
import { round } from 'components/courses/search/search_helpers';
import { BlockTopic, Topic } from 'components/types';
import { TopicList } from 'config/graphql';
import { Alert, Badge, Combobox, Heading, IconButton, Pane, Text, TextInput } from 'evergreen-ui';
import { buildForm } from 'lib/helpers';
import { observer, useLocalStore } from 'mobx-react';
import React from 'react';

import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';

type LineProps = {
  topics: TopicList[];
  topic: BlockTopic;
  readonly: boolean;
  block: TopicOwner;
  index: number;
};

const TopicLine = observer(({ topics, topic, readonly, block, index }: LineProps) => {
  const selected = topics.find(s => s.id === topic.id);
  return (
    <Pane display="flex" marginTop={8}>
      <Pane flex="1" marginRight={8}>
        {readonly ? (
          <>
            <Badge marginRight={8}>Ratio {round(topic.ratio, 2)}</Badge>
            <Badge marginRight={8}>{round(topic.ratio * block.credits, 2)}¢</Badge>
            <Text>{selected.name}</Text>
          </>
        ) : (
          // <Combobox
          //   id="topic"
          //   width="100%"
          //   initialSelectedItem={{ label: '' }}
          //   items={topics}
          //   itemToString={item => (item ? `${item.name} (${item.id})` : '')}
          //   selectedItem={selected}
          //   onChange={selected => (topic.id = selected.id)}
          // />
          <TextInput width="100%" disabled={true} value={`${selected?.name || topic.id}`} />
        )}
      </Pane>
      {!readonly && (
        <TextInput
          width={60}
          placeholder="Ratio"
          value={round(topic.ratio, 2)}
          type="number"
          step={0.1}
          onChange={e => (topic.ratio = parseFloat(e.currentTarget.value))}
          marginRight={8}
        />
      )}

      {!readonly && (
        <TextInput
          width={60}
          disabled={true}
          value={round(topic.ratio * block.credits, 2) + '¢'}
          marginRight={8}
        />
      )}

      {!readonly && (
        <IconButton
          icon="trash"
          onClick={() => block.removeTopic(index)}
          intent="danger"
          appearance="primary"
        />
      )}
    </Pane>
  );
});

type Props = {
  block: TopicOwner;
  readonly: boolean;
  topics: TopicList[];
};

type TopicOwner = {
  credits: number;
  topics: BlockTopic[];
  addTopic(topic: BlockTopic);
  removeTopic(idx: number);
};

export const BlockTopicsEditor = observer(({ block, readonly, topics }: Props) => {
  const localStore = useLocalStore(() => ({
    id: ''
  }));
  const total = block.topics.reduce((prev, next) => next.ratio + prev, 0);

  return (
    <Expander title="Topics" id="blockTopics">
      <>
        {!readonly && (
          <Pane paddingTop={8} paddingBottom={36} paddingRight={40} paddingLeft={40}>
            <Range
              value={block.topics.slice(0, block.topics.length - 1).map((t, i) => {
                let val = 0;
                for (let j = 0; j <= i; j++) {
                  val += block.topics[j].ratio * 10;
                }
                return val;
              })}
              min={0}
              max={10}
              step={1}
              onChange={e => {
                for (let i = 0; i < e.length; i++) {
                  let val = 0;
                  for (let j = 0; j < i; j++) {
                    val += block.topics[j].ratio;
                  }
                  block.topics[i].ratio = e[i] / 10 - val;
                }
                block.topics[block.topics.length - 1].ratio = 1 - e[e.length - 1] / 10;
              }}
              dots={true}
              pushable={true}
              marks={block.topics.reduce((p, n, i) => {
                let ratio = 0;
                for (let j = 0; j <= i; j++) {
                  ratio += block.topics[j].ratio;
                }
                p[ratio * 10] =
                  round(n.ratio * 100, 2) + '% ' + topics.find(t => t.id === n.id)?.name;

                return p;
              }, {} as any)}
              // marks={{
              //   '0.1': { label: '10%' },
              //   '0.2': { label: '20%' },
              //   '0.3': { label: '30%' },
              //   '0.4': { label: '40%' },
              //   '0.5': { label: '50%' },
              //   '0.6': { label: '60%' },
              //   '0.7': { label: '70%' },
              //   '0.8': { label: '80%' },
              //   '0.9': { label: '90%' }
              // }}
            />
          </Pane>
        )}
        {!readonly && (
          <Pane display="flex" marginBottom={4} marginTop={8}>
            <Text is="div" flex="1" marginRight={8}>
              Name
            </Text>

            <Text is="div" width={60} marginRight={8}>
              Ratio
            </Text>

            <Text is="div" width={60} marginRight={8}>
              Credit
            </Text>
            <Pane width={30}></Pane>
          </Pane>
        )}

        {block.topics.map((t, i) => (
          <TopicLine block={block} index={i} readonly={readonly} topic={t} topics={topics} />
        ))}

        {Math.abs(total - 1) > 0.001 && (
          <Alert marginTop={8} intent="danger" title="The sum of ratios must be 1!" />
        )}

        {!readonly && (
          <Pane marginTop={16} display="flex" alignItems="center">
            <Heading marginRight={8}>Add: </Heading>
            <Combobox
              id="topic"
              width="100%"
              initialSelectedItem={{ label: '' }}
              items={topics}
              placeholder="Topic name"
              itemToString={item => item?.name || ''}
              onChange={selected => (localStore.id = selected?.id)}
            />

            <IconButton
              marginLeft={8}
              icon="plus"
              onClick={() => block.addTopic({ id: localStore.id, ratio: 0 })}
              intent="success"
              appearance="primary"
            />
          </Pane>
        )}
      </>
    </Expander>
  );
});
