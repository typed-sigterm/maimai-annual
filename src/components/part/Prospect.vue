<script setup lang="ts">
import { inject } from 'vue';
import ChartSelect from '@/components/ChartSelect.vue';
import MapSelect from '@/components/MapSelect.vue';
import { FormInjectKey } from '@/utils/form';

const form = inject(FormInjectKey)!;
</script>

<template>
  <section>
    <h2>
      #3 对舞萌 2025 的想法
    </h2>

    <div class="flex text-xs gap-2 ml-2">
      <div class="flex flex-col items-center">
        <ChartSelect v-model="form.prospect.newSong" class="h-20 mb-1" />
        <span>最想打的歌</span>
      </div>
      <div class="flex flex-col items-center">
        <MapSelect v-model="form.prospect.newMap" class="h-20 mb-1" />
        <span>最想走的区域</span>
      </div>
    </div>

    <div class="flex text-xs gap-2 mt-1 ml-2">
      <div class="flex flex-col items-center">
        <MapSelect v-model="form.prospect.mostReluctant" class="h-20 mb-1" />
        <span>最舍不得的</span>
      </div>
      <div class="flex flex-col items-center">
        <ChartSelect v-model="form.prospect.shallInsist" class="h-20 mb-1" />
        <span>今年也会一直</span>
      </div>
    </div>
  </section>
</template>
