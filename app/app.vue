<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core';
import mixpanel from 'mixpanel-browser';
import { provide, ref, toRaw } from 'vue';
import bg from '~/assets/bg.webp';
import PartHighlight from '~/components/part/Highlight.vue';
import PartNotes from '~/components/part/Notes.vue';
import PartProspect from '~/components/part/Prospect.vue';
import PartRating from '~/components/part/Rating.vue';
import SubmitterInput from '~/components/SubmitterInput.vue';
import { FormInjectKey, getDefaultForm } from '~/components/utils/form';

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
    <UButton @click="saving = true">
      保存为图片
    </UButton>
  </div>

  <div
    class="w-120 h-165 mx-auto border border-black rounded-lg gap-4 flex flex-col bg-cover bg-center"
    :style="{
      padding: '56px 20px 0 20px',
      backgroundImage: `url(${bg})`,
      fontFamily: '\'HanRoundedCN\', \'Microsoft YaHei\', \'微软雅黑\', sans-serif',
    }"
  >
    <div class="flex justify-between">
      <div class="flex items-center">
        <img
          src="~/assets/maimai.webp"
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
      <ULink href="https://github.com/typed-sigterm/maimai-annual/issues/new" target="_blank" active>
        GitHub
      </ULink>
      上创建 issue，或 QQ 联系 3937775997
    </p>
  </div>

  <UModal v-model:open="saving">
    <template #content>
      <div class="p-6">
        <h2 class="text-lg font-semibold mb-2">
          反馈分享照片
        </h2>
        <p class="text-muted-foreground mb-4">
          这个功能遇到了大量的兼容性问题，所以干脆被删掉了。
        </p>

        <div class="flex items-center space-x-2 py-4">
          <UCheckbox v-model="sendAnonymousData" />
          <label>发送匿名统计数据</label>
        </div>

        <div class="flex justify-end gap-2 pt-4">
          <UButton @click="confirm">
            给爷整笑了
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>
