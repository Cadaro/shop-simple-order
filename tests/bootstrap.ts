import { assert } from '@japa/assert';
import { apiClient } from '@japa/api-client';
import { expectTypeOf } from '@japa/expect-type';
import app from '@adonisjs/core/services/app';
import type { Config } from '@japa/runner/types';
import { pluginAdonisJS } from '@japa/plugin-adonisjs';
import testUtils from '@adonisjs/core/services/test_utils';
import { authApiClient } from '@adonisjs/auth/plugins/api_client';

/**
 * This file is imported by the "bin/test.ts" entrypoint file
 */

/**
 * Configure Japa plugins in the plugins array.
 * Learn more - https://japa.dev/docs/runner-config#plugins-optional
 */
export const plugins: Config['plugins'] = [
  assert(),
  apiClient('http://localhost:3333'),
  pluginAdonisJS(app),
  authApiClient(app),
  expectTypeOf(),
];

/**
 * Configure lifecycle function to run before and after all the
 * tests.
 *
 * The setup functions are executed before all the tests
 * The teardown functions are executer after all the tests
 */
export const runnerHooks: Required<Pick<Config, 'setup' | 'teardown'>> = {
  setup: [() => testUtils.db().migrate(), () => testUtils.db().seed()],
  teardown: [],
};

/**
 * Configure suites by tapping into the test suite instance.
 * Learn more - https://japa.dev/docs/test-suites#lifecycle-hooks
 */
export const configureSuite: Config['configureSuite'] = (suite) => {
  if (['browser', 'functional', 'e2e'].includes(suite.name)) {
    return suite.setup(() => testUtils.httpServer().start());
  }
};
