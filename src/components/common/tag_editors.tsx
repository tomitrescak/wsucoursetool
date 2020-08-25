import React from 'react';
import { observer, Observer } from 'mobx-react';
import { Pane, Text, Autocomplete, TagInput, SelectMenu, Button } from 'evergreen-ui';
import { ProgressView } from './progress_view';
import { useTopicsQuery } from 'config/graphql';

type KeywordEditorProps = {
  owner: {
    keywords: string[];
    addKeyword(keyword: string): void;
    removeKeyword(index: number): void;
  };
  keywords: string[];
  readonly: boolean;
};

export const KeywordEditor = observer(({ owner, keywords, readonly }: KeywordEditorProps) => {
  return (
    <Pane flex={1}>
      <Text is="label" htmlFor="keywords" fontWeight={500} marginBottom={8} display="block">
        Keywords
      </Text>
      <Autocomplete
        title="Keywords"
        onChange={undefined}
        onSelect={e => {
          owner.addKeyword(e);
        }}
        items={keywords}
      >
        {props => {
          const { getInputProps, getRef, inputValue } = props;
          const { value, onChange, ...rest } = getInputProps();
          return (
            <Observer>
              {() => (
                <TagInput
                  id="keywords"
                  inputProps={{ placeholder: 'Add keywords...' }}
                  values={owner.keywords}
                  width="100%"
                  onChange={values => {
                    owner.keywords = values;
                  }}
                  onRemove={(_value, index) => {
                    owner.removeKeyword(index);
                  }}
                  onInputChange={onChange}
                  innerRef={getRef}
                  marginBottom={16}
                  disabled={readonly}
                  {...rest}
                />
              )}
            </Observer>
          );
        }}
      </Autocomplete>
    </Pane>
  );
});

type TopicEditorProps = {
  owner: { topics: string[]; addTopic(id: string): void; removeTopic(index: number): void };
  label?: string;
  field?: string;
  readonly?: boolean;
};

export const TopicEditor = observer(
  ({ owner, label = 'Topics', field = 'topics', readonly }: TopicEditorProps) => {
    if (!owner[field]) {
      owner[field] = [];
    }

    const { loading, error, data } = useTopicsQuery();
    if (loading || error) {
      return <ProgressView loading={loading} error={error} />;
    }

    const topicList = [...data.topics];
    const topicOwner = owner[field] || [];
    const topics = topicOwner.map(id => data.topics.find(t => t.id === id)).map(t => t.name);

    return (
      <Pane flex={1} marginRight={8}>
        <Text is="label" htmlFor="keywords" fontWeight={500} marginBottom={8} display="block">
          {label}
        </Text>
        <SelectMenu
          isMultiSelect
          title="Select Topics"
          options={topicList
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(t => ({ label: t.name, value: t.id }))}
          selected={topicOwner}
          onSelect={item => {
            owner.addTopic(item.value as string);
          }}
          onDeselect={item => {
            owner.removeTopic(topicOwner.indexOf(item.value));
          }}
        >
          <TagInput
            id="keywords"
            disabled={readonly}
            inputProps={{ placeholder: 'Add topics...' }}
            values={topics}
            width="100%"
            onRemove={(_value, index) => {
              owner[field] = topicOwner.filter((_, i) => i !== index);
            }}
            onKeyDown={e => e.preventDefault()}
            marginBottom={16}
          />
          {/* <Button>{topics.length ? topics.join(', ') : 'Select multiple...'}</Button> */}
        </SelectMenu>
        {/* <Autocomplete
          title={label}
          onChange={undefined}
          onSelect={e => {
            if (topicOwner == null) {
              owner[field] = [];
            }
            const tid = state.courseConfig.topics.find(t => t.name === e).id;
            topicOwner.push(tid);
          }}
          items={state.courseConfig.topics.map(t => t.name)}
        >
          {props => {
            const { getInputProps, getRef, inputValue } = props;
            const { value, onChange, ...rest } = getInputProps();
            return (
              <Observer>
                {() => (
                  <TagInput
                    id="keywords"
                    inputProps={{ placeholder: 'Add topics...' }}
                    values={topics}
                    width="100%"
                    // onChange={values => {
                    //   block.keywords = values;
                    // }}
                    onRemove={(_value, index) => {
                      owner[field] = topicOwner.filter((_, i) => i !== index);
                    }}
                    onInputChange={onChange}
                    innerRef={getRef}
                    marginBottom={16}
                    {...rest}
                  />
                )}
              </Observer>
            );
          }}
        </Autocomplete> */}
      </Pane>
    );
  }
);
