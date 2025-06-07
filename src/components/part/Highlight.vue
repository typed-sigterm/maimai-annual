<script setup lang="ts">
import { inject } from 'vue';
import ChartSelect from '@/components/ChartSelect.vue';
import { FormInjectKey } from '@/utils/form';

const form = inject(FormInjectKey)!;
</script>

<template>
  <section>
    <h2>
      #2 你的 2024 之最
    </h2>

    <div class="grid grid-cols-5 text-xs w-full gap-0 whitespace-nowrap">
      <div
        v-for="[key, label] in ([
          ['b15', 'b15 中最喜欢'],
          ['b35', 'b35 中最喜欢'],
          ['champion', '成绩含金量最高'],
          ['mostPlayed', 'pc 数最多'],
          ['recentlyPromoted', '到现在还在推'],
        ] as const)"
        :key
        class="flex flex-col items-center w-20"
      >
        <ChartSelect v-model="form.highlight[key]" class="h-20 mb-1" />
        <span v-text="label" />
      </div>
    </div>
  </section>
</template>
