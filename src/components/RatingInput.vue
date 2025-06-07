<script setup lang="ts">
import { vOnKeyStroke } from '@vueuse/components';
import { computed, ref, watch } from 'vue';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PinInput, PinInputGroup, PinInputSlot } from '@/components/ui/pin-input';
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
  <Dialog v-model:open="editing" modal>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>输入 DX Rating</DialogTitle>
      </DialogHeader>

      <PinInput v-model="editingRating" v-on-key-stroke:Enter="confirm" class="justify-center">
        <PinInputGroup>
          <PinInputSlot
            v-for="(id, index) in 5"
            :key="id"
            :index="index"
            inputmode="numeric"
            pattern="\d"
          />
        </PinInputGroup>
      </PinInput>

      <DialogFooter>
        <Button :disabled @click="confirm">
          确定
        </Button>
        <Button variant="outline" @click="editing = false">
          取消
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

  <div
    v-bind="$attrs"
    class="flex items-center bg-cover bg-no-repeat cursor-pointer"
    :style="{ backgroundImage: `url(${ratingBg})`, aspectRatio: '664 / 130' }"
    @click="editing = true"
  >
    <img
      v-for="i in 5"
      :key="i"
      class="h-5 pointer-events-none"
      :class="{ invisible: ratingString[i - 1] === ' ' }"
      :style="{ marginLeft: i === 1 ? '46.5%' : '-0.8%' }"
      :src="NumberImage[ratingString[i - 1] === ' ' ? '0' : ratingString[i - 1]]"
    >
  </div>
</template>
