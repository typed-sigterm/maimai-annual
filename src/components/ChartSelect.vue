<script lang="ts" setup>
import type { ChartWithLevel } from '@/utils/form';
import type { ChartDifficulty, ChartType, Song } from '~/shared/schema';
import { vOnKeyStroke } from '@vueuse/components';
import { computed, ref, shallowRef, watch } from 'vue';
import placeholder from '@/assets/placeholder.png';
import DropdownSelect from '@/components/DropdownSelect.vue';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { DifficultyImage, getSongs, TypeImage } from '@/utils/resource';
import { ChartDifficultyLabel, ChartTypeLabel } from '~/shared/schema';

const chart = defineModel<ChartWithLevel>();

const version = ref<string | undefined>();
const songs = shallowRef<Record<string, Record<string, Song>>>({});
getSongs().then((v) => {
  const grouped: Record<string, Record<string, Song>> = {};
  for (const [id, song] of Object.entries(v)) {
    grouped[song.version] ??= {};
    grouped[song.version][id] = song;
  }
  songs.value = grouped;
});

const chartSong = computed(() => {
  if (!chart.value?.id)
    return undefined;
  return Object.values(songs.value)
    .flatMap(v => Object.entries(v))
    .find(([id]) => id === chart.value!.id)?.[1];
});

const editing = ref(false);
const editingSongId = ref<string | undefined>();
const editingType = ref<ChartType | undefined>();
const editingDifficulty = ref<ChartDifficulty | undefined>();
watch(editing, (v) => {
  if (!v)
    return;
  editingSongId.value = editingDifficulty.value = editingType.value = undefined;
  if (chart.value) {
    editingSongId.value = chart.value.id;
    version.value = Object.entries(songs.value)
      .find(([, songs]) => Object.keys(songs).includes(chart.value!.id))
      ?.[0];
  }
});

const candidateSongs = computed(() => {
  if (!version.value)
    return [];
  return Object.entries(songs.value[version.value] ?? {})
    .map(([id, song]) => ({ label: song.title, value: id }));
});

const candidateVersions = computed(
  () => Object.keys(songs.value).reverse().map(v => ({ value: v, label: v })),
);

const candidateTypes = computed(() => {
  if (!version.value || !editingSongId.value)
    return [];
  const song = songs.value[version.value]?.[editingSongId.value];
  if (!song)
    return [];
  return (Object.keys(Object.groupBy(song.charts, c => c.type)) as ChartType[])
    .map(t => ({ label: ChartTypeLabel[t], value: t }));
});

const candidateDifficulties = computed(() => {
  if (!version.value || !editingSongId.value || !editingType.value)
    return [];
  const song = songs.value[version.value]?.[editingSongId.value];
  if (!song)
    return [];
  return song.charts
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
  <Dialog v-model:open="editing" modal>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>选择谱面</DialogTitle>
      </DialogHeader>

      <p class="text-sm">
        不知道谱面的发布版本或歌曲名称？使用
        <a href="https://maimai.lxns.net/songs" target="_blank" class="font-bold">
          落雪查分器
        </a>
        查询
      </p>

      <div class="grid gap-4">
        <div class="grid grid-cols-8 items-center gap-4">
          <Label class="justify-end">
            版本
          </Label>
          <DropdownSelect
            v-model="version"
            class="col-span-7"
            :disabled="!candidateVersions.length"
            :options="candidateVersions"
            @update:model-value="editingSongId = undefined"
          />
        </div>

        <div class="grid grid-cols-8 items-center gap-4">
          <Label class="justify-end">
            歌曲
          </Label>
          <DropdownSelect
            v-model="editingSongId"
            class="col-span-7"
            :disabled="!candidateSongs.length"
            :options="candidateSongs"
            empty-text="Loading..."
          />
        </div>

        <div class="grid grid-cols-8 items-center gap-4">
          <Label class="justify-end">
            类型
          </Label>
          <DropdownSelect
            v-model="editingType"
            class="col-span-7"
            :disabled="!candidateTypes.length"
            :options="candidateTypes"
            placeholder="请选择（非必填）"
            empty-text="Loading..."
          />
        </div>

        <div class="grid grid-cols-8 items-center gap-4">
          <Label class="justify-end">
            难度
          </Label>
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

      <DialogFooter>
        <Button v-on-key-stroke:Enter="confirm" :disabled @click="confirm">
          确定
        </Button>
        <Button variant="outline" @click="reset">
          重置
        </Button>
        <Button variant="outline" @click="editing = false">
          取消
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

  <div
    v-bind="$attrs"
    class="cursor-pointer bg-contain bg-no-repeat"
    :class="{ 'p-2': chart && 'type' in chart }"
    :style="{
      backgroundImage: chart && 'type' in chart
        ? `url(${DifficultyImage[chart?.difficulty]})`
        : undefined,
    }"
    @click="editing = true"
  >
    <img
      class="h-full"
      :class="{ 'rounded-xs': !(chart && 'type' in chart) }"
      :src="chartSong ? `https://shama.dxrating.net/images/cover/v2/${chartSong.image}.jpg` : placeholder"
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
  </div>
</template>
