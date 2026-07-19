<script setup lang="ts">
import { vOnKeyStroke } from '@vueuse/components';
import { computed, ref, watch } from 'vue';
import { getRatingBg, NumberImage } from '@/utils/resource';

const rating = defineModel<number>({ required: true });
const ratingBg = computed(() => getRatingBg(rating.value));
const ratingString = computed(() => rating.value.toString().padStart(5, ' '));

const editing = ref(false);
const editingRating = ref<string[]>([]);
watch(editing, v => v && (editingRating.value = []));

const newRating = computed(() => {
  const v = editingRating.value.join('');
  return v.length === 5 && /\d{5}/.test(v) ? Number(v) : undefined;
});
const disabled = computed(() => newRating.value === undefined);

function confirm() {
  if (disabled.value)
    return;
  rating.value = newRating.value!;
  editing.value = false;
}
</script>

<template>
  <UModal v-model:open="editing">
    <template #content>
      <div class="p-6">
        <h2 class="text-lg font-semibold mb-2">
          输入 DX Rating
        </h2>

        <UPinInput v-model="editingRating" v-on-key-stroke:Enter="confirm" class="flex justify-center" :length="5" />

        <div class="flex justify-end gap-2 pt-4">
          <UButton :disabled @click="confirm">
            确定
          </UButton>
          <UButton variant="outline" @click="editing = false">
            取消
          </UButton>
        </div>
      </div>
    </template>
  </UModal>

  <button
    type="button"
    v-bind="$attrs"
    class="flex items-center bg-cover bg-no-repeat cursor-pointer bg-transparent border-0 p-0 font-inherit text-left w-full block appearance-none"
    :style="{ backgroundImage: `url(${ratingBg})`, aspectRatio: '664 / 130' }"
    :aria-label="`DX Rating: ${rating}`"
    aria-haspopup="dialog"
    :aria-expanded="editing"
    @click="editing = true"
  >
    <img
      v-for="i in 5"
      :key="i"
      alt=""
      class="h-5 pointer-events-none"
      :class="{ invisible: ratingString[i - 1] === ' ' }"
      :style="{ marginLeft: i === 1 ? '46.5%' : '-0.8%' }"
      :src="NumberImage[ratingString[i - 1] === ' ' ? '0' : ratingString[i - 1]]"
    >
  </button>
</template>
