import {defineMessages} from 'react-intl';

export default defineMessages({
  'title': {
      id: '{@namespace@}.title',
      defaultMessage: '{@namespace@}.title',
  },
  'delete.confirm': {
      id: '{@namespace@}.buttons.delete.confirm',
      defaultMessage: '{@namespace@}.buttons.delete.confirm',
  },
  {@#columns@}
  '{@name@}.label': {
      id: '{@namespace@}.field.{@name@}.label',
      defaultMessage: '{@name@}',
  },
  {@/columns@}
});
