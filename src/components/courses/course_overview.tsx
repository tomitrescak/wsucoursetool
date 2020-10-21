import { Alert, ListItem, Pane, UnorderedList } from 'evergreen-ui';
import React from 'react';

const ReportLine = ({ is }) => {
  const [expanded, setExpanded] = React.useState(false);
  return (
    <Pane>
      <Pane cursor="pointer" onClick={() => setExpanded(!expanded)}>
        {is.text}
      </Pane>
      {expanded && (
        <UnorderedList>
          {is.info.map(info => (
            <ListItem key={info.id}>
              {info.name}
              <UnorderedList>
                {info.blocks.map(b => (
                  <ListItem key={b.id}>{b.name}</ListItem>
                ))}
              </UnorderedList>
            </ListItem>
          ))}
        </UnorderedList>
      )}
    </Pane>
  );
};

export const CourseOverview = ({ report }) => {
  return report.map((ri, i) => (
    <Alert
      key={ri.id}
      title={ri.name}
      intent={
        ri.issues.some(i => i.type === 'error')
          ? 'danger'
          : ri.issues.some(i => i.type === 'warning')
          ? 'warning'
          : 'success'
      }
      marginBottom={8}
    >
      <UnorderedList>
        {ri.issues.map((is, ix) => (
          <ListItem
            key={ix}
            icon={is.type === 'error' ? 'cross' : is.type === 'warning' ? 'warning-sign' : 'tick'}
            iconColor={is.type === 'error' ? 'danger' : is.type === 'warning' ? 'warning' : 'green'}
          >
            <ReportLine is={is} key={ix} />
          </ListItem>
        ))}
      </UnorderedList>
    </Alert>
  ));
};
