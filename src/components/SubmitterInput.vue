<script lang="ts" setup>
import { vOnKeyStroke } from '@vueuse/components';
import { ref, watch } from 'vue';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
  <Dialog v-model:open="editing" modal>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>修改填写人</DialogTitle>
      </DialogHeader>

      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label class="text-right">
            填写人
          </Label>
          <Input v-model="editingSubmitter" v-on-key-stroke:Enter="confirm" class="col-span-3" />
        </div>
      </div>
      <DialogFooter>
        <Button @click="confirm">
          确定
        </Button>
        <Button variant="outline" @click="editing = false">
          取消
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

  <p class="cursor-pointer overflow-ellipsis whitespace-nowrap overflow-x-hidden" @click="editing = true">
    填写：{{ submitter ?? '游客' }}
  </p>
</template>
