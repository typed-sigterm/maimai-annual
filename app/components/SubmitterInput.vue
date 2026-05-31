<script lang="ts" setup>
import { vOnKeyStroke } from '@vueuse/components';
import { ref, watch } from 'vue';

const submitter = defineModel<string>();

const editing = ref(false);
const editingSubmitter = ref('');

watch(editing, (isVisible) => {
  if (isVisible)
    editingSubmitter.value = submitter.value ?? '';
});

function confirm() {
  submitter.value = editingSubmitter.value;
  editing.value = false;
}
</script>

<template>
  <UModal v-model:open="editing">
    <template #content>
      <div class="p-6">
        <h2 class="text-lg font-semibold mb-2">
          修改填写人
        </h2>

        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <label class="text-right">
              填写人
            </label>
            <UInput v-model="editingSubmitter" v-on-key-stroke:Enter="confirm" class="col-span-3" />
          </div>
        </div>
        <div class="flex justify-end gap-2 pt-4">
          <UButton @click="confirm">
            确定
          </UButton>
          <UButton variant="outline" @click="editing = false">
            取消
          </UButton>
        </div>
      </div>
    </template>
  </UModal>

  <p class="cursor-pointer overflow-ellipsis whitespace-nowrap overflow-x-hidden" @click="editing = true">
    填写：{{ submitter ?? '游客' }}
  </p>
</template>
