import {Controller} from 'lakutata/com/entrypoint'
import {GET, HTTPAction, POST} from 'lakutata/decorator/ctrl'
import type {ActionPattern} from 'lakutata'
import {TestOptions} from '../options/TestOptions'

export class ExampleController extends Controller {

    /**
     * Example test action
     */
    @HTTPAction('/test', 'get', TestOptions, {acl: true, name: 'example:test', description: 'Example test'})
    @GET('/test/test-get', TestOptions, {acl: true, name: 'example:test:get', description: 'Get method test'})
    @POST('/test/test-post', TestOptions, {acl: true, name: 'example:test:post', description: 'Post method test'})
    public async test(inp: ActionPattern<TestOptions>): Promise<number> {
        return inp.timestamp
    }
}
