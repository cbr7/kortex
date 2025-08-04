/**********************************************************************
 * Copyright (C) 2024 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ***********************************************************************/

import '@testing-library/jest-dom/vitest';

import { render } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { beforeAll, beforeEach, expect, test, vi } from 'vitest';

import KubeActions from '/@/lib/kube/KubeActions.svelte';

// mock the router
vi.mock('tinro', () => {
  return {
    router: {
      goto: vi.fn(),
    },
  };
});

beforeAll(() => {
  Object.defineProperty(global, 'window', {
    value: {
      // global needed
      navigator: {
        clipboard: {
          writeText: vi.fn(),
        },
      },
      // needed for the test
      kubernetesGetCurrentContextName: vi.fn(),
      openDialog: vi.fn(),
    },
    writable: true,
  });
});

beforeEach(() => {
  vi.resetAllMocks();

  vi.mocked(window.kubernetesGetCurrentContextName).mockResolvedValue('dummy-context');
});

test('KubeApplyYAMLButton should redirect to', async () => {
  const { getByTitle } = render(KubeActions);

  const applyYAMLBtn = getByTitle('Apply YAML');
  expect(applyYAMLBtn).toBeInTheDocument();

  await userEvent.click(applyYAMLBtn);

  await vi.waitFor(() => {
    expect(window.openDialog).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Select a .yaml file to apply',
      }),
    );
  });
});
