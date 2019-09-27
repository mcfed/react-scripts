import reducer, { initialState, reducerActions as actions } from '../reducer';

describe('reducer test', () => {
  it('reducer 单元测试 type undefined', done => {
    expect(reducer(initialState, { type: undefined })).toEqual(initialState);
    done();
  });
});
