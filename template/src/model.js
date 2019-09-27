import {ModuleModel} from 'mcf-module'

const {attr,BaseModel} = ModuleModel
export const namespace = "{@namespace@}"

export default class {@namespace@} extends BaseModel {
  static modelName = namespace
  static fields={}
  static options={
    // idAttribute: 'serverId',
  }
}


  // console.log(Schedule.fields)
Object.assign({@namespace@}.fields,BaseModel.fields,{
  {@#columns@}
    {@name@}:attr(),
  {@/columns@}
})
