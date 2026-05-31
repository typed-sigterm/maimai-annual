<script setup lang="ts">
import { inject } from 'vue';
import RatingInput from '~/components/RatingInput.vue';
import { FormInjectKey } from '~/components/utils/form';

const form = inject(FormInjectKey)!;
</script>

<template>
  <section>
    <h2 class="mb-1 font-semibold">
      #1 这一年，你的变化是
    </h2>

    <div class="flex items-center w-full justify-between">
      <RatingInput v-model="form.rating.before" class="h-10" />
      <UIcon name="i-lucide-arrow-right" class="size-6" />
      <RatingInput v-model="form.rating.after" class="h-10" />
    </div>
  </section>
</template>
