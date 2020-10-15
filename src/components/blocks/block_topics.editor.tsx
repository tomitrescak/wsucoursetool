import { BlockModel, BlockTopicModel } from 'components/classes';
import { Expander } from 'components/common/expander';
import { Topic } from 'components/types';
import { TopicList } from 'config/graphql';
import { Alert, Badge, Combobox, Heading, IconButton, Pane, Text, TextInput } from 'evergreen-ui';
import { buildForm } from 'lib/helpers';
import { observer, useLocalStore } from 'mobx-react';
import React from 'react';

type LineProps = {
  topics: TopicList[];
  topic: BlockTopicModel;
  readonly: boolean;
  block: BlockModel;
  index: number;
};

const TopicLine = ({ topics, topic, readonly, block, index }: LineProps) => {
  const selected = topics.find(s => s.id === topic.id);
  return (
    <Pane display="flex" marginTop={8}>
      <Pane flex="1" marginRight={8}>
        {readonly ? (
          <>
            <Badge marginRight={8}>Ratio {topic.ratio}</Badge>
            <Badge marginRight={8}>{topic.ratio * block.credits}¢</Badge>
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
          <TextInput width="100%" disabled={true} value={`${selected.name}`} />
        )}
      </Pane>
      {!readonly && (
        <TextInput
          width={60}
          placeholder="Ratio"
          value={topic.ratio}
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
          value={topic.ratio * block.credits + '¢'}
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
};

type Props = {
  block: BlockModel;
  readonly: boolean;
  topics: TopicList[];
};

export const BlockTopicsEditor = observer(({ block, readonly, topics }: Props) => {
  const localStore = useLocalStore(() => ({
    id: ''
  }));
  const total = block.topics.reduce((prev, next) => next.ratio + prev, 0);
  console.log(total);
  return (
    <Expander title="Topics" id="blockTopics">
      <>
        {Math.abs(total - 1) > 0.001 && (
          <Alert marginTop={8} intent="danger" title="The sum of ratios must be 1!" />
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
        {!readonly && (
          <Pane marginTop={16} display="flex" alignItems="center">
            <Heading marginRight={8}>Add: </Heading>
            <Combobox
              id="topic"
              width="100%"
              initialSelectedItem={{ label: '' }}
              items={topics}
              itemToString={item => (item ? item.name : '')}
              onChange={selected => (localStore.id = selected.id)}
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
