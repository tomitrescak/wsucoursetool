import { Select } from 'evergreen-ui';
import { observer } from 'mobx-react';
import React from 'react';

export const SfiaSelect = observer(({ skill, ...args }) => (
  <Select
    {...args}
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
));
