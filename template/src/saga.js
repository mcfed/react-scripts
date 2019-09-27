import { ModuleSaga, ModuleAction } from 'mcf-module';
// import {ModuleSaga,ModuleMiddleware,ModuleRouter,ModuleAction} from 'mcf-module'
import { reducerActions } from './reducer';
import { namespace } from './model';
import * as Api from './api';

// const {showSuccess,showError} =ModuleMiddleware
const { defaultSaga, takeSagas } = ModuleSaga;
// const {effects:{call,put},defaultSaga,takeSagas} = ModuleSaga
// const { goBack } = ModuleRouter
const { createDefineActions } = ModuleAction;

export const saga = Object.assign(defaultSaga(reducerActions, Api, namespace), {
  //...
});

export const sagaActions = createDefineActions(saga, namespace);
export default function*() {
  yield takeSagas(sagaActions, saga);
}
