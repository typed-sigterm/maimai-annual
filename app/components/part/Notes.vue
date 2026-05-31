<script setup lang="ts">
import { inject } from 'vue';
import { FormInjectKey } from '~/components/utils/form';

const form = inject(FormInjectKey)!;
</script>

<template>
  <section>
    <h2 class="mb-1 font-semibold">
      #4 有什么想说的
    </h2>

    <UTextarea
      v-model="form.notes"
      class="w-full text-sm"
      placeholder="自由补充你的想法吧！"
      :rows="10"
      :ui="{ base: 'bg-transparent' }"
    />
  </section>
</template>
