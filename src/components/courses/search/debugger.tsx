// import { Text } from 'evergreen-ui';
// import React from 'react';
// import { calculateCredits, Finder } from './finder';
// import { logSearchNode, logSimpleName, QNode } from './search_helpers';

// const Column = ({ col, title }) => (
//   <div style={{ flex: col.length > 0 ? 1 : '0 0 100px' }}>
//     <h3>{title}</h3>
//     <ul style={{ listStyleType: 'none', padding: '0px' }}>
//       {col.map(r => (
//         <li key={r.node.id + '-' + r.node.block?.id}>{logSimpleName(r)}</li>
//       ))}
//     </ul>
//   </div>
// );

// function serialiseQNode(node: QNode) {
//   let sNode = serialised.find(n => n.node.id === node.node.id);
//   if (sNode == null) {
//     sNode = {
//       semesters: [...node.semesters],
//       node: node.node,
//       dependencies: node.dependencies.map(d => serialiseQNode(d)),
//       addedDependencies: node.addedDependencies.map(d => serialiseQNode(d)),
//       isRequired: node.isRequired
//     };
//     serialised.push(sNode);
//   }
//   return sNode;
// }

// function deserialiseQNode(node) {
//   let qNode: QNode = qNodes.find(n => n.node.id === node.node.id);
//   if (qNode == null) {
//     qNode = {
//       semesters: node.semesters,
//       node: node.node,
//       dependencies: node.dependencies.map(s => deserialiseQNode(s)),
//       addedDependencies: node.addedDependencies.map(s => deserialiseQNode(s)),
//       isRequired: node.isRequired
//     };
//     qNodes.push(qNode);
//   }
//   return qNode;
// }

// let head = 0;
// let history = {
//   current: null as { item?: any; previous?: any; next?: any },
//   add(item) {
//     let newItem = {
//       item,
//       next: null,
//       previous: history.current
//     };
//     if (history.current != null) {
//       history.current.next = newItem;
//     }
//     history.current = newItem;
//   },
//   undo() {
//     if (history.current.previous) {
//       history.current = history.current.previous;
//     }
//   },
//   redo() {
//     if (history.current.next) {
//       history.current = history.current.next;
//     }
//   },
//   restore(finder: Finder) {
//     serialised = [];
//     qNodes = [];

//     finder.requiredDoing = history.current.item.requiredDoing.map(r => deserialiseQNode(r));
//     finder.requiredDone = history.current.item.requiredDone.map(r => deserialiseQNode(r));
//     finder.optionalDoing = history.current.item.optionalDoing.map(r => deserialiseQNode(r));
//     finder.optionalDone = history.current.item.optionalDone.map(r => deserialiseQNode(r));
//     finder.study = [...history.current.item.study.map(s => [...s])] as any;

//     Finder.log = history.current.item.log;
//   }
// };
// let qNodes: QNode[] = [];
// let serialised: any[] = [];

// type Props = {
//   finder: Finder;
// };

// type RowProps = {
//   node: QNode;
//   doing: boolean;
// };

// function Cell({ semester, node }) {
//   return (
//     <td
//       style={{
//         width: 20,
//         textAlign: 'center',
//         fontWeight: 'bold',
//         backgroundColor:
//           node.node.unit.offer.indexOf(semester % 2 === 0 ? 'au' : 'sp') >= 0 ? 'green' : 'red'
//       }}
//     >
//       {node.semesters.indexOf(semester) >= 0 ? 'x' : ''}
//     </td>
//   );
// }

// const TableRow = ({ node, doing }: RowProps) => {
//   return (
//     <tr>
//       <td style={{ background: doing ? 'salmon' : 'lightGreen', width: 10 }}></td>
//       <td>
//         <Text>
//           {logSearchNode(node.node)} [{node.semesters.join(', ')}] [
//           {node.node.unit.offer.join(', ')}]
//         </Text>
//       </td>
//       <Cell semester={0} node={node} />
//       <Cell semester={1} node={node} />
//       <Cell semester={2} node={node} />
//       <Cell semester={3} node={node} />
//       <Cell semester={4} node={node} />
//       <Cell semester={5} node={node} />
//     </tr>
//   );
// };

// export const Debugger = ({ finder }: Props) => {
//   const [state, setState] = React.useState(0);
//   const doing = React.useMemo(() => [...finder.requiredDoing, ...finder.requiredDone.reverse()], [
//     finder.requiredDoing,
//     finder.requiredDone
//   ]);

//   const addToHistory = React.useMemo(
//     () =>
//       function () {
//         const item = {
//           requiredDoing: finder.requiredDoing.map(r => serialiseQNode(r)),
//           requiredDone: finder.requiredDone.map(r => serialiseQNode(r)),
//           optionalDoing: finder.optionalDoing.map(r => serialiseQNode(r)),
//           optionalDone: finder.optionalDone.map(r => serialiseQNode(r)),
//           study: [...finder.study.map(s => [...s])],
//           log: Finder.log
//         };

//         history.add(item);
//       },
//     [finder]
//   );

//   return (
//     <>
//       <button
//         disabled={history.current == null || history.current.previous == null}
//         onClick={() => {
//           history.undo();
//           history.restore(finder);
//           setState(state + 1);
//         }}
//       >
//         ⏪ Undo
//       </button>{' '}
//       <button
//         onClick={() => {
//           Finder.log = '';
//           finder.step();
//           setState(state + 1);

//           qNodes = [];
//           serialised = [];

//           addToHistory();
//         }}
//       >
//         Play ▶
//       </button>{' '}
//       <button
//         disabled={history.current == null || history.current.next == null}
//         onClick={() => {
//           history.redo();
//           history.restore(finder);
//           setState(state + 1);
//         }}
//       >
//         Redo ⏩
//       </button>
//       <div style={{ display: 'flex' }}>
//         <div style={{ flex: 1 }}>
//           {/* <Column title="Required Doing" col={finder.requiredDoing} />
//           <Column title="Required Done" col={finder.requiredDone} /> */}

//           <table>
//             <thead>
//               <tr>
//                 <th></th>
//                 <th>Unit</th>
//                 <th>1</th>
//                 <th>2</th>
//                 <th>3</th>
//                 <th>4</th>
//                 <th>5</th>
//                 <th>6</th>
//               </tr>
//             </thead>
//             <tbody>
//               {doing.map((d, i) => (
//                 <TableRow key={d.node.id} node={d} doing={finder.requiredDoing.indexOf(d) >= 0} />
//               ))}
//               {/* {finder.requiredDone.map((d, i) => (
//                 <TableRow key={d.node.id} node={d} doing={false} />
//               ))} */}
//             </tbody>
//           </table>
//         </div>
//         {/* <div style={{ flex: 1 }}>
//           <Column title="Optional Doing" col={finder.optionalDoing} />
//           <Column title="Optional Done" col={finder.optionalDone} />
//         </div> */}
//         <div style={{ flex: 1 }}>
//           <h3>Semester</h3>
//           {finder.study.map((s, i) => (
//             <div key={i}>
//               <h4>
//                 Semester {i + 1} [{calculateCredits(s)} credits]
//               </h4>
//               {s.map((t, i) => (
//                 <div key={t.id}>
//                   {t.unit.name} {t.block ? ' > ' + t.block.name : ''}
//                 </div>
//               ))}
//             </div>
//           ))}
//         </div>

//         <div style={{ flex: 1 }}>
//           <h3>Log</h3>
//           <pre>{Finder.log}</pre>
//         </div>
//       </div>
//     </>
//   );
// };
