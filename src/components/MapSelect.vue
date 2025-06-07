<script lang="ts" setup>
import { vOnKeyStroke } from '@vueuse/components';
import { computed, ref, watch } from 'vue';
import mapsData from '@/assets/maps.json';
import placeholder from '@/assets/placeholder.png';
import DropdownSelect from '@/components/DropdownSelect.vue';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

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
  <Dialog v-model:open="editing" modal>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>选择区域</DialogTitle>
      </DialogHeader>

      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-8 items-center gap-4">
          <Label class="text-right">
            区域
          </Label>
          <DropdownSelect
            v-model="editingMap"
            class="col-span-7"
            :options="candidateMaps"
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

  <div v-bind="$attrs" class="cursor-pointer" @click="editing = true">
    <img
      :src="map ? `https://dev.maimai.moe/img/version/${map}.png` : placeholder"
      :alt="mapName"
      :title="mapName"
      class="h-full object-contain rounded-xs"
      @error="($event.target as HTMLImageElement).src = placeholder"
    >
  </div>
</template>
