<script setup lang="ts">
import { inject } from 'vue';
import { Textarea } from '@/components/ui/textarea';
import { FormInjectKey } from '@/utils/form';

const form = inject(FormInjectKey)!;
</script>

<template>
  <section>
    <h2>
      #4 有什么想说的
    </h2>

    <Textarea
      v-model="form.notes"
      class="w-full h-50 text-sm"
      placeholder="自由补充你的想法吧！"
    />
  </section>
</template>
