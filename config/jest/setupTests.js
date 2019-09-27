import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import {createSerializer} from 'enzyme-to-json'
import fetch from 'jest-fetch-mock'

global.fetch = fetch
global.API_PREFIX="/"

configure({ adapter: new Adapter() })
expect.addSnapshotSerializer(createSerializer({mode: 'deep'}));
