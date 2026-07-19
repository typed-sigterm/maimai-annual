<script lang="ts" setup>
import type { ChartDifficulty, ChartType, Song } from '#shared/utils/schema';
import type { ChartWithLevel } from '~/components/utils/form';
import { vOnKeyStroke } from '@vueuse/components';
import { computed, ref, shallowRef, watch } from 'vue';
import { ChartDifficultyLabel, ChartTypeLabel } from '#shared/utils/schema';
import placeholder from '~/assets/placeholder.png';
import DropdownSelect from '~/components/DropdownSelect.vue';
import { DifficultyImage, getSongs, TypeImage } from '~/utils/resource';

const chart = defineModel<ChartWithLevel>();

const songs = shallowRef<Record<string, Song>>({});
getSongs().then(v => songs.value = v);

const songItems = computed(() =>
  Object.entries(songs.value).map(([id, s]) => ({ value: id, label: s.title })),
);

const chartSong = computed(() => {
  if (!chart.value?.id)
    return undefined;
  return songs.value[chart.value.id];
});

const editing = ref(false);
const editingSongId = ref<string | undefined>();
const editingType = ref<ChartType | undefined>();
const editingDifficulty = ref<ChartDifficulty | undefined>();
watch(editing, (v) => {
  if (!v)
    return;
  editingSongId.value = editingDifficulty.value = editingType.value = undefined;
  if (chart.value)
    editingSongId.value = chart.value.id;
});
watch(editingSongId, () => {
  editingType.value = editingDifficulty.value = undefined;
});

const currentSong = computed(() =>
  editingSongId.value ? songs.value[editingSongId.value] : undefined,
);

const candidateTypes = computed(() => {
  if (!currentSong.value)
    return [];
  return (Object.keys(Object.groupBy(currentSong.value.charts, c => c.type)) as ChartType[])
    .map(t => ({ label: ChartTypeLabel[t], value: t }));
});

const candidateDifficulties = computed(() => {
  if (!currentSong.value || !editingType.value)
    return [];
  return currentSong.value.charts
    .filter(c => c.type === editingType.value)
    .map(c => c.difficulty)
    .map(d => ({ label: ChartDifficultyLabel[d], value: d }));
});

const disabled = computed(
  () => !editingSongId.value || (!editingType.value !== !editingDifficulty.value),
);

function confirm() {
  if (disabled.value)
    return;
  chart.value = editingDifficulty.value
    ? {
        id: editingSongId.value!,
        type: editingType.value!,
        difficulty: editingDifficulty.value!,
      }
    : { id: editingSongId.value! };
  editing.value = false;
}

function reset() {
  chart.value = undefined;
  editing.value = false;
}
</script>

<template>
  <UModal v-model:open="editing">
    <template #content>
      <div class="p-6 space-y-3">
        <h2 class="text-lg font-semibold">
          选择谱面
        </h2>

        <p class="text-muted text-sm">
          可在
          <ULink href="https://maimai.lxns.net/songs" target="_blank" active>
            落雪查分器
          </ULink>
          中通过别名查询和复制歌名
        </p>

        <div class="grid gap-4">
          <div class="grid grid-cols-8 items-center gap-4">
            <label class="justify-end">
              歌曲
            </label>
            <USelectMenu
              v-model="editingSongId"
              :items="songItems"
              :virtualize="{ estimateSize: 32 }"
              :filter-fields="['label', 'value']"
              value-key="value"
              label-key="label"
              class="col-span-7"
              placeholder="搜索歌名"
            />
          </div>

          <div class="grid grid-cols-8 items-center gap-4">
            <label class="justify-end">
              类型
            </label>
            <DropdownSelect
              v-model="editingType"
              class="col-span-7"
              :disabled="!candidateTypes.length"
              :options="candidateTypes"
              placeholder="请选择（非必填）"
              empty-text="请先选择歌曲"
            />
          </div>

          <div class="grid grid-cols-8 items-center gap-4">
            <label class="justify-end">
              难度
            </label>
            <DropdownSelect
              v-model="editingDifficulty"
              class="col-span-7"
              :disabled="!candidateDifficulties.length"
              :options="candidateDifficulties"
              :placeholder="editingType ? '请选择' : '请选择（非必填）'"
              empty-text="Loading..."
            />
          </div>
        </div>

        <div class="flex justify-end gap-2">
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
    class="cursor-pointer bg-contain bg-no-repeat bg-transparent border-0 p-0 font-inherit text-left w-full block appearance-none"
    :class="{ 'p-2': chart && 'type' in chart }"
    :style="{
      backgroundImage: chart && 'type' in chart
        ? `url(${DifficultyImage[chart?.difficulty]})`
        : undefined,
    }"
    :aria-label="chartSong?.title ?? '选择谱面'"
    aria-haspopup="dialog"
    :aria-expanded="editing"
    @click="editing = true"
  >
    <img
      class="h-full"
      :class="{ 'rounded-xs': !(chart && 'type' in chart) }"
      :src="chartSong ? `https://shama.dxrating.net/images/cover/v2/${chartSong.image}.jpg` : placeholder"
      :alt="chartSong?.title ?? ''"
      :title="chartSong?.title"
      @error="($event.target as HTMLImageElement).src = placeholder"
    >
    <img
      v-if="chart && 'type' in chart"
      class="relative top-[-13px] h-3 py-[3px] rounded-full text-white"
      :class="chart.type === 'dx' ? 'px-[6px]' : 'px-[5px]'"
      :src="TypeImage[chart.type]"
      :style="{
        backgroundColor: chart.type === 'dx' ? '#fd7e14' : '#228be6',
      }"
    >
  </button>
</template>
