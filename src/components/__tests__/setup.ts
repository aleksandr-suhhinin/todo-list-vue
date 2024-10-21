import { config } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { vi } from 'vitest';
import 'fake-indexeddb/auto';

globalThis.fetch = vi.fn();

const pinia = createPinia();
setActivePinia(pinia);
