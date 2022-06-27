// Import the js file to test
import { performAction } from '../src/client/js/app';
describe('Testing the submit functionality', () => {
    test('Testing the performAction() function', () => {
        expect(performAction).toBeDefined();
    });
});
