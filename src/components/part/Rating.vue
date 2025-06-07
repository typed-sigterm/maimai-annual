<script setup lang="ts">
import { inject } from 'vue';
import Arrow from '~icons/lucide/arrow-right';
import RatingInput from '@/components/RatingInput.vue';
import { FormInjectKey } from '@/utils/form';

const form = inject(FormInjectKey)!;
</script>

<template>
  <section>
    <h2>
      #1 这一年，你的变化是……
    </h2>

    <div class="flex items-center w-full justify-between">
      <RatingInput v-model="form.rating.before" class="h-10" />
      <Arrow />
      <RatingInput v-model="form.rating.after" class="h-10" />
    </div>

    <div class="flex justify-between w-full text-xs text-gray-500 mt-1 px-1">
      <span>2023 版本最后 Rating</span>
      <span>2024 版本最后一次出勤后</span>
    </div>
  </section>
</template>
