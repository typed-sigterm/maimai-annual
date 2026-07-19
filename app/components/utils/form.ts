import type { RemovableRef } from '@vueuse/core';
import type { InjectionKey } from 'vue';
import type { ChartWithLevel } from '#shared/utils/schema';

export type { ChartWithLevel } from '#shared/utils/schema';

export interface Form {
  schema: 1
  submitter: string
  rating: {
    before: number
    after: number
  }
  highlight: {
    b15?: ChartWithLevel
    b35?: ChartWithLevel
    champion?: ChartWithLevel
    mostPlayed?: ChartWithLevel
    recentlyPromoted?: ChartWithLevel
  }
  prospect: {
    newSong?: ChartWithLevel
    newMap?: string
    mostReluctant?: string
    shallInsist?: ChartWithLevel
  }
  notes: string
}

export function getDefaultForm(): Form {
  return {
    schema: 1,
    submitter: '游客',
    rating: {
      before: 0,
      after: 0,
    },
    highlight: {},
    prospect: {},
    notes: '',
  };
}

export const FormInjectKey = Symbol('form') as InjectionKey<RemovableRef<Form>>;
