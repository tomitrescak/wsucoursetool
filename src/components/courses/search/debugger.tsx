import { Text } from 'evergreen-ui';
import React from 'react';
import { Explorer, ExplorerNode, calculateCredits } from './explorer';
import { logSearchNode } from './search_helpers';

const Column = ({ col, title }) => (
  <div style={{ flex: col.length > 0 ? 1 : '0 0 100px' }}>
    <h3>{title}</h3>
    <ul style={{ listStyleType: 'none', padding: '0px' }}>
      {col.map(r => (
        <li key={r.node.id + '-' + r.node.block?.id}>{logSearchNode(r)}</li>
      ))}
    </ul>
  </div>
);

function serialiseQNode(node: ExplorerNode) {
  let sNode = serialised.find(n => n.node.id === node.node.id);
  if (sNode == null) {
    sNode = {
      semester: node.semester,
      semesters: [...node.semesters],
      node: node.node
    };
    serialised.push(sNode);
  }
  return sNode;
}

function deserialiseQNode(node) {
  let qNode: ExplorerNode = qNodes.find(n => n.node.id === node.node.id);
  if (qNode == null) {
    qNode = {
      semester: node.semester,
      semesters: node.semesters,
      node: node.node,
      dependants: []
    };
    qNodes.push(qNode);
  }
  return qNode;
}

let head = 0;
let history = {
  current: null as { item?: any; previous?: any; next?: any },
  add(item) {
    let newItem = {
      item,
      next: null,
      previous: history.current
    };
    if (history.current != null) {
      history.current.next = newItem;
    }
    history.current = newItem;
  },
  undo() {
    if (history.current.previous) {
      history.current = history.current.previous;
    }
  },
  redo() {
    if (history.current.next) {
      history.current = history.current.next;
    }
  },
  restore(explorer: Explorer) {
    serialised = [];
    qNodes = [];

    explorer.doing = history.current.item.requiredDoing.map(r => deserialiseQNode(r));
    explorer.done = history.current.item.requiredDone.map(r => deserialiseQNode(r));
    explorer.study = [...history.current.item.study.map(s => [...s])] as any;

    // recover also all dependencies
    let all = explorer.doing.concat(explorer.done);
    for (let node of all) {
      for (let dependency of node.node.dependsOn) {
        let dependant = all.find(d => d.node === dependency);
        if (dependant.dependants.indexOf(node) === -1) {
          dependant.dependants.push(node);
        }
      }
    }

    Explorer.log = history.current.item.log;
  }
};
let qNodes: ExplorerNode[] = [];
let serialised: any[] = [];

type Props = {
  explorer: Explorer;
};

type RowProps = {
  node: ExplorerNode;
  doing: boolean;
};

function Cell({ semester, node }) {
  return (
    <td
      style={{
        width: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        backgroundColor:
          node.node.unit.offer.indexOf(semester % 2 === 0 ? 'au' : 'sp') >= 0 ? 'green' : 'red'
      }}
    >
      {node.semesters.indexOf(semester) >= 0 ? 'x' : ''}
    </td>
  );
}

const TableRow = ({ node, doing }: RowProps) => {
  return (
    <tr>
      <td style={{ background: doing ? 'salmon' : 'lightGreen', width: 10 }}></td>
      <td>
        <Text>
          {logSearchNode(node.node)} [{node.semesters.join(', ')}] [
          {node.node.unit.offer.join(', ')}]
        </Text>
      </td>
      <Cell semester={0} node={node} />
      <Cell semester={1} node={node} />
      <Cell semester={2} node={node} />
      <Cell semester={3} node={node} />
      <Cell semester={4} node={node} />
      <Cell semester={5} node={node} />
    </tr>
  );
};

export const Debugger = ({ explorer }: Props) => {
  const [state, setState] = React.useState(0);
  const doingAndDone = React.useMemo(() => [...explorer.doing, ...explorer.done.reverse()], [
    explorer.doing,
    explorer.done
  ]);

  const addToHistory = React.useMemo(
    () =>
      function () {
        const item = {
          doing: explorer.doing.map(r => serialiseQNode(r)),
          done: explorer.done.map(r => serialiseQNode(r)),
          study: [...explorer.study.map(s => [...s])],
          log: Explorer.log
        };

        history.add(item);
      },
    [explorer]
  );

  return (
    <>
      <button
        disabled={history.current == null || history.current.previous == null}
        onClick={() => {
          history.undo();
          history.restore(explorer);
          setState(state + 1);
        }}
      >
        ⏪ Undo
      </button>{' '}
      <button
        onClick={() => {
          Explorer.log = '';
          let result = explorer.step();
          if (!result) {
            Explorer.log = 'FAILED!';
          }

          setState(state + 1);

          qNodes = [];
          serialised = [];

          addToHistory();
        }}
      >
        Play ▶
      </button>{' '}
      <button
        disabled={history.current == null || history.current.next == null}
        onClick={() => {
          history.redo();
          history.restore(explorer);
          setState(state + 1);
        }}
      >
        Redo ⏩
      </button>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          {/* <Column title="Required Doing" col={finder.requiredDoing} />
          <Column title="Required Done" col={finder.requiredDone} /> */}

          <table>
            <thead>
              <tr>
                <th></th>
                <th>Unit</th>
                <th>1</th>
                <th>2</th>
                <th>3</th>
                <th>4</th>
                <th>5</th>
                <th>6</th>
              </tr>
            </thead>
            <tbody>
              {doingAndDone.map((d, i) => (
                <TableRow key={d.node.id} node={d} doing={explorer.doing.indexOf(d) >= 0} />
              ))}
              {/* {done.map((d, i) => (
                <TableRow key={d.node.id} node={d} doing={false} />
              ))} */}
            </tbody>
          </table>
        </div>
        {/* <div style={{ flex: 1 }}>
          <Column title="Optional Doing" col={finder.optionalDoing} />
          <Column title="Optional Done" col={finder.optionalDone} />
        </div> */}
        <div style={{ flex: 1 }}>
          <h3>Semester</h3>
          {explorer.study.map((s, i) => (
            <div key={i}>
              <h4>
                Semester {i + 1} [{calculateCredits(s)} credits]
              </h4>
              {s.map((t, i) => (
                <div key={t.node.id}>
                  {t.node.unit.name} {t.node.block ? ' > ' + t.node.block.name : ''}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div style={{ flex: 1 }}>
          <h3>Log</h3>
          <pre>{Explorer.log}</pre>
        </div>
      </div>
    </>
  );
};
