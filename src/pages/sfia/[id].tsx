import { createUnit, SfiaSkillMappingModel } from 'components/classes';
import { Expander } from 'components/common/expander';
import { ProgressView } from 'components/common/progress_view';
import { SfiaSkillMapping } from 'components/types';
import { withApollo } from 'config/apollo';
import { SfiaQuery, useSaveConfigMutation, useSfiaQuery, useUnitQuery } from 'config/graphql';
import { Button, Heading, Icon, Link, Pane, Select, Text, toaster } from 'evergreen-ui';
import { url } from 'lib/helpers';
import { Observer, observer, useLocalStore } from 'mobx-react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

const Instructions = () => (
  <Pane margin={16} width="50%">
    <Expander title="Instructions" id="sfiaInstructions">
      <Text>
        <p>
          Please assign correct SFIA categories. On the left you have the assigned value of SFIA
          level.{' '}
          <b>
            When you click on the SFIA category name, a description of that given category will be
            displayed.
          </b>
        </p>
        <p>
          Please use following information on categories. It is improbable that we will reach level
          5, 6 or 7, thus I am not displaying it.
        </p>

        <table>
          <thead>
            <tr>
              <th style={{ width: 150 }}>Level</th>
              <th>Autonomy</th>
              <th>Influence</th>
              <th>Complexity</th>
              <th>Knowledge</th>
              {/* <th>Business Skills</th> */}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <b>Level 1 - Follow</b>
              </td>
              <td>
                Works under supervision. Uses little discretion. Is expected to seek guidance in
                unexpected situations.
              </td>
              <td>Minimal influence. May work alone, or interact with immediate colleagues.</td>
              <td>
                Performs routine activities in a structured environment. Requires assistance in
                resolving unexpected problems.
              </td>
              <td>
                Has a basic generic knowledge appropriate to area of work. Applies newly acquired
                knowledge to develop new skills.
              </td>
              {/* <td>
                  <ul>
                    <li>Has sufficient communication skills for effective dialogue with others.</li>
                    <li>Demonstrates an organised approach to work.</li>
                    <li>Uses basic systems and tools, applications, and processes</li>
                    <li>Contributes to identifying own development opportunities.</li>
                    <li>
                      Follows code of conduct, ethics and organisational standards. Is aware of
                      health and safety issues.
                    </li>
                    <li>Understands and applies basic personal security practice.</li>
                  </ul>
                </td> */}
            </tr>
            <tr>
              <td>
                <b>Level 2 - Assist</b>
              </td>
              <td>
                Works under routine direction. Uses limited discretion in resolving issues or
                enquiries. Works without frequent reference to others.
              </td>
              <td>
                Interacts with and may influence immediate colleagues. May have some external
                contact with customers, suppliers and partners. May have more influence in own
                domain. Aware of need to collaborate with team and represent users/customer needs.
              </td>
              <td>
                Performs a range of work activities in varied environments. May contribute to
                routine issue resolution.
              </td>
              <td>
                Demonstrates application of essential generic knowledge typically found in industry
                bodies of knowledge. Has gained a basic domain knowledge. Absorbs new information
                when it is presented systematically and applies it effectively.
              </td>
              {/* <td>
                  <ul>
                    <li>
                      Has sufficient communication skills for effective dialogue with customers,
                      suppliers and partners.
                    </li>
                    <li>
                      Is able to work in a team. Is able to plan, schedule and monitor own work
                      within short time horizons. Demonstrates a rational and organised approach to
                      work.
                    </li>
                    <li>Understands and uses appropriate methods, tools and applications.</li>
                    <li>Identifies and negotiates own development opportunities.</li>
                    <li>
                      Is fully aware of and complies with essential organisational security
                      practices expected of the individual.
                    </li>
                  </ul>
                </td> */}
            </tr>
            <tr>
              <td>
                <b>Level 3 - Apply</b>
              </td>
              <td>
                Works under general direction. Uses discretion in identifying and responding to
                complex issues and assignments. Receives specific direction, accepts guidance and
                has work reviewed at agreed milestones. Determines when issues should be escalated
                to a higher level.
              </td>
              <td>
                Interacts with and influences colleagues. Has working level contact with customers,
                suppliers and partners. May supervise others or make decisions which impact the work
                assigned to individuals or phases of projects. Understands and collaborates on the
                analysis of user/customer needs and represents this in their work.
              </td>
              <td>
                Performs a range of work, sometimes complex and non-routine, in a variety of
                environments. Applies methodical approach to issue definition and resolution.
              </td>
              <td>
                Has a sound generic, domain and specialist knowledge necessary to perform
                effectively in the organisation typically gained from recognised bodies of knowledge
                and organisational information. Demonstrates effective application of knowledge. Has
                an appreciation of the wider business context. Takes action to develop own
                knowledge.
              </td>
              {/* <td>
                  <ul>
                    <li>Demonstrates effective communication skills.</li>
                    <li>
                      Plans, schedules and monitors own work (and that of others where applicable)
                      competently within limited deadlines and according to relevant legislation,
                      standards and procedures.
                    </li>
                    <li>
                      Contributes fully to the work of teams. Appreciates how own role relates to
                      other roles and to the business of the employer or client.
                    </li>
                    <li>Demonstrates an analytical and systematic approach to issue resolution.</li>
                    <li>
                      Takes the initiative in identifying and negotiating appropriate personal
                      development opportunities.
                    </li>
                    <li>
                      Understands how own role impacts security and demonstrates routine security
                      practice and knowledge required for own work.
                    </li>
                  </ul>
                </td> */}
            </tr>
            <tr>
              <td>
                <b>Level 4 - Enable</b>
              </td>
              <td>
                Works under general direction within a clear framework of accountability. Exercises
                substantial personal responsibility and autonomy. Plans own work to meet given
                objectives and processes.
              </td>
              <td>
                Influences customers, suppliers and partners at account level. May have some
                responsibility for the work of others and for the allocation of resources.
                Participates in external activities related to own specialism. Makes decisions which
                influence the success of projects and team objectives. Collaborates regularly with
                team members, users and customers. Engages to ensure that user needs are being met
                throughout.
              </td>
              <td>
                Work includes a broad range of complex technical or professional activities, in a
                variety of contexts. Investigates, defines and resolves complex issues.
              </td>
              <td>
                Has a thorough understanding of recognised generic industry bodies of knowledge and
                specialist bodies of knowledge as necessary. Has gained a thorough knowledge of the
                domain of the organisation. Is able to apply the knowledge effectively in unfamiliar
                situations and actively maintains own knowledge and contributes to the development
                of others. Rapidly absorbs new information and applies it effectively. Maintains an
                awareness of developing practices and their application and takes responsibility for
                driving own development.
              </td>
              {/* <td>
                  <ul>
                    <li>
                      Communicates fluently, orally and in writing, and can present complex
                      information to both technical and non-technical audiences.
                    </li>
                    <li>Plans, schedules and monitors work to meet time and quality targets.</li>
                    <li>
                      Facilitates collaboration between stakeholders who share common objectives.
                    </li>
                    <li>
                      Selects appropriately from applicable standards, methods, tools and
                      applications.
                    </li>
                    <li>
                      Fully understands the importance of security to own work and the operation of
                      the organisation. Seeks specialist security knowledge or advice when required
                      to support own work or work of immediate colleagues.
                    </li>
                  </ul>
                </td> */}
            </tr>
            <tr>
              <td>
                <b>Level 5 - Ensure, advise</b>
              </td>
              <td>
                Works under broad direction. Work is often self-initiated. Is fully responsible for
                meeting allocated technical and/or project/supervisory objectives. Establishes
                milestones and has a significant role in the assignment of tasks and/or
                responsibilities.
              </td>
              <td>
                Influences organisation, customers, suppliers, partners and peers on the
                contribution of own specialism. Builds appropriate and effective business
                relationships. Makes decisions which impact the success of assigned work, i.e.
                results, deadlines and budget. Has significant influence over the allocation and
                management of resources appropriate to given assignments. Leads on user/customer
                collaboration throughout all stages of work. Ensures users’ needs are met
                consistently through each work stage.
              </td>
              <td>
                Performs an extensive range and variety of complex technical and/or professional
                work activities. Undertakes work which requires the application of fundamental
                principles in a wide and often unpredictable range of contexts. Understands the
                relationship between own specialism and wider customer/organisational requirements.
              </td>
              <td>
                Is fully familiar with recognised industry bodies of knowledge both generic and
                specific. Actively seeks out new knowledge for own personal development and the
                mentoring or coaching of others. Develops a wider breadth of knowledge across the
                industry or business. Applies knowledge to help to define the standards which others
                will apply.
              </td>
              {/* <td>... Not even needed ...</td> */}
            </tr>
          </tbody>
        </table>
      </Text>
    </Expander>
  </Pane>
);

const Description = ({ description }) => {
  const ref = React.useRef(null);

  return (
    <Pane
      paddingLeft={16}
      position="fixed"
      left="calc(50% + 16px)"
      right={0}
      top={0}
      bottom={0}
      overflow="auto"
    >
      <div ref={ref} dangerouslySetInnerHTML={{ __html: description || '' }} />
    </Pane>
  );
};

const SfiaSkill = observer(
  ({
    data,
    skill,
    select
  }: {
    data: SfiaQuery;
    skill: SfiaSkillMappingModel;
    select: (description: string) => void;
  }) => {
    const selected = data.sfia.find(s => s.id === skill.id);

    return (
      <Pane display="flex" marginTop={8}>
        <Select
          width={100}
          flex="0 0 100px"
          marginRight={16}
          value={skill.level}
          onChange={event => (skill.level = parseInt(event.target.value))}
        >
          <option value="0">None</option>
          <option value="1">1 - Follow</option>
          <option value="2">2 - Assist</option>
          <option value="3">3 - Apply</option>
          <option value="4">4 - Enable</option>
          <option value="5">5 - Advise</option>
        </Select>

        <Pane flex="1" marginRight={8}>
          <Text>
            <Text cursor="pointer" onClick={() => select(selected.description)} href="#">
              {selected.name} ({selected.id})
            </Text>
            &nbsp;
            <Link href={`https://sfia-online.org/en/sfia-7/skills/${url(selected.name)}`}>
              <a target="_blank">
                <Icon icon="link" />
              </a>
            </Link>
          </Text>
        </Pane>
      </Pane>
    );
  }
);

export const SfiaOwnerEditor = ({
  owner
}: {
  owner: {
    sfiaSkills: Array<SfiaSkillMappingModel>;
    addSfiaSkill(mapping: SfiaSkillMapping): void;
  };
}) => {
  const { loading, error, data, refetch } = useSfiaQuery();
  const state = useLocalStore(() => ({
    description: ''
  }));

  if (loading || error) {
    return <ProgressView loading={loading} error={error} />;
  }

  if (owner.sfiaSkills == null) {
    owner.sfiaSkills = [];
  }

  for (let skill of data.sfia) {
    if (owner.sfiaSkills.every(s => s.id !== skill.id)) {
      owner.addSfiaSkill({ id: skill.id, level: 0 });
    }
  }

  return (
    <Pane margin={16} width="50%">
      <Expander title="SFIA Skills" id="sfiaSkillsUnit">
        <Pane display="flex">
          <div>
            <Pane display="flex" marginBottom={4} marginTop={8}>
              <Text is="div" width={100} marginRight={16}>
                Level
              </Text>
              <Text is="div" flex="1">
                Name
              </Text>
            </Pane>
            <div style={{ width: 550 }}>
              {owner.sfiaSkills
                .sort((a, b) => {
                  const sfiaA = data.sfia.find(s => s.id === a.id);
                  const sfiaB = data.sfia.find(s => s.id === b.id);
                  return sfiaA.name.localeCompare(sfiaB.name);
                })

                .map((skill, index) => (
                  <SfiaSkill
                    key={index + '_' + skill.id}
                    data={data}
                    skill={skill}
                    select={d => (state.description = d)}
                  />
                ))}
            </div>
          </div>

          <Observer>{() => <Description description={state.description} />}</Observer>
        </Pane>
      </Expander>
    </Pane>
  );
};

export const UnitDetailContainer = ({ id }: any) => {
  const { loading, error, data, refetch } = useUnitQuery({
    variables: {
      id
    }
  });

  const [save] = useSaveConfigMutation({
    onCompleted() {
      toaster.notify('Saved');
      refetch();
    },
    onError(e) {
      toaster.danger('Error ;(: ' + e.message);
    }
  });

  const model = React.useMemo(() => {
    if (data) {
      const model = createUnit(data.unit.unit);
      return model;
    }
    return undefined;
  }, [data]);

  if (loading || error) {
    return <ProgressView loading={loading} error={error} />;
  }

  return (
    <div>
      <Heading margin={16} fontWeight="bold">
        {model.name} ({model.id})
      </Heading>
      <Instructions />
      <SfiaOwnerEditor owner={model} />

      <Button
        margin={16}
        appearance="primary"
        iconAfter="floppy-disk"
        onClick={() => {
          const body = model.toJS();
          save({
            variables: {
              body,
              id,
              part: 'unit'
            }
          });
        }}
      >
        Save
      </Button>
    </div>
  );
};

function Viewer(props) {
  const router = useRouter();
  return (
    <div>
      <Head>
        <title>SFIA Adjustments for CDMS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <UnitDetailContainer id={router.query.id} />
    </div>
  );
}

export const View = withApollo({ ssr: false })(Viewer);
export default View;
