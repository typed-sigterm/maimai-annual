<script lang="ts" setup>
import { vOnKeyStroke } from '@vueuse/components';
import { computed, ref, watch } from 'vue';
import mapsData from '~/assets/maps.json';
import placeholder from '~/assets/placeholder.png';
import DropdownSelect from '~/components/DropdownSelect.vue';

const map = defineModel<string>();

const editing = ref(false);
const editingMap = ref<string | undefined>();

watch(editing, v => v && (editingMap.value = map.value));

const candidateMaps = computed(() => {
  return Object.entries(mapsData).map(([id, name]) => ({
    label: name,
    value: id,
  }));
});

const mapName = computed(() => {
  if (!map.value)
    return '选择区域';
  return mapsData[map.value as keyof typeof mapsData] || '未知区域';
});

const disabled = computed(() => !editingMap.value);

function confirm() {
  if (disabled.value)
    return;
  map.value = editingMap.value;
  editing.value = false;
}

function reset() {
  map.value = undefined;
  editing.value = false;
}
</script>

<template>
  <UModal v-model:open="editing">
    <template #content>
      <div class="p-6">
        <h2 class="text-lg font-semibold mb-2">
          选择区域
        </h2>

        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-8 items-center gap-4">
            <label class="text-right">
              区域
            </label>
            <DropdownSelect
              v-model="editingMap"
              class="col-span-7"
              :options="candidateMaps"
            />
          </div>
        </div>

        <div class="flex justify-end gap-2 pt-4">
          <UButton v-on-key-stroke:Enter="confirm" :disabled @click="confirm">
            确定
          </UButton>
          <UButton variant="outline" @click="reset">
            重置
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
    class="cursor-pointer bg-transparent border-0 p-0 font-inherit text-left w-full block appearance-none"
    aria-haspopup="dialog"
    :aria-expanded="editing"
    @click="editing = true"
  >
    <img
      :src="map ? `https://dev.maimai.moe/img/version/${map}.png` : placeholder"
      :alt="mapName"
      :title="mapName"
      class="h-full object-contain rounded-xs"
      @error="($event.target as HTMLImageElement).src = placeholder"
    >
  </button>
</template>
