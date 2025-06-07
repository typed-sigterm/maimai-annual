<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core';
import mobile from 'is-mobile';
import mixpanel from 'mixpanel-browser';
import { provide, ref, toRaw } from 'vue';
import bg from '@/assets/bg.png';
import PartHighlight from '@/components/part/Highlight.vue';
import PartNotes from '@/components/part/Notes.vue';
import PartProspect from '@/components/part/Prospect.vue';
import PartRating from '@/components/part/Rating.vue';
import SubmitterInput from '@/components/SubmitterInput.vue';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { FormInjectKey, getDefaultForm } from '@/utils/form';

if (!import.meta.env.DEV) {
  mixpanel.init(import.meta.env.MAI_MIXPANEL_TOKEN, {
    track_pageview: true,
  });
}

const form = useLocalStorage('form', getDefaultForm());
provide(FormInjectKey, form);

const saving = ref(false);
const sendAnonymousData = ref(true);

async function confirm() {
  saving.value = false;
  if (sendAnonymousData.value) {
    mixpanel.track('Save Report', {
      Form: {
        ...toRaw(form.value),
        submitter: undefined, // 匿名处理
      },
    });
  }
}
</script>

<template>
  <div class="flex items-center w-120 mx-auto mb-2">
    <p class="mr-2">
      点击报告各部分即可填写～(∠・ω&lt; )⌒☆
    </p>
    <Button @click="saving = true">
      保存为图片
    </Button>
  </div>

  <div
    class="w-120 h-165 mx-auto border border-black rounded-lg gap-4 flex flex-col"
    :style="{
      padding: '56px 20px 0 20px',
      background: `url(${bg})`,
      fontFamily: '\'HanRoundedCN\', \'Microsoft YaHei\', \'微软雅黑\', sans-serif',
    }"
  >
    <div class="flex justify-between">
      <div class="flex items-center">
        <img
          src="@/assets/maimai.png"
          class="inline-block size-18 mr-4 object-cover"
          alt="舞萌 2024"
        >
        <h1 class="text-2xl font-bold">
          给自己写一张
          <br>
          结算报告吧！
        </h1>
      </div>
      <div class="mt-2 max-w-[45%]">
        <div>
          <p>
            制作：TS，A10
          </p>
          <SubmitterInput v-model="form.submitter" />
        </div>
        <p class="text-xs">
          https://maimai-2024.by-ts.top
        </p>
      </div>
    </div>

    <PartRating />
    <PartHighlight />
    <div class="grid grid-cols-2">
      <PartProspect />
      <PartNotes />
    </div>
  </div>

  <div class="w-120 mx-auto mt-2">
    <p>
      遇到问题？在
      <a class="font-bold" href="https://github.com/typed-sigterm/maimai-annual/issues/new" target="_blank">
        GitHub
      </a>
      上创建 issue，或 QQ 联系 3937775997
    </p>

    <Separator class="my-2" />

    <p class="text-sm text-muted-foreground">
      部分图片资源著作权归 SEGA 所有
    </p>
    <p class="text-sm text-muted-foreground">
      本项目以 MIT License 开源，欢迎在
      <a href="https://github.com/typed-sigterm/maimai-annual" target="_blank">
        GitHub
      </a>
      上参与贡献
    </p>
  </div>

  <Dialog v-model:open="saving">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>虽然但是</DialogTitle>
        <DialogDescription>
          <p>
            这个功能遇到了大量的兼容性问题，所以干脆被删掉了。
          </p>
          <p v-if="mobile()">
            建议您使用手机截图功能
          </p>
          <p v-else>
            建议您登录 QQ，按快捷键 Ctrl+Alt+A 选区截图。
          </p>
        </DialogDescription>
      </DialogHeader>

      <div class="flex items-center space-x-2">
        <Checkbox v-model="sendAnonymousData" />
        <Label>发送匿名统计数据</Label>
      </div>

      <DialogFooter>
        <Button @click="confirm">
          给爷整笑了
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
