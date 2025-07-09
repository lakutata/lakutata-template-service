import {Controller} from 'lakutata/com/entrypoint'
import {GET, HTTPAction, POST} from 'lakutata/decorator/ctrl'
import type {ActionPattern} from 'lakutata'
import {TestOptions} from '../options/TestOptions'

export class ExampleController extends Controller {

    /**
     * Example test action
     */
    @HTTPAction('/test', 'get', TestOptions)
    @GET('/test/test-get',TestOptions)
    @POST('/test/test-post',TestOptions)
    public async test(inp: ActionPattern<TestOptions>): Promise<number> {
        return inp.timestamp
    }
}
