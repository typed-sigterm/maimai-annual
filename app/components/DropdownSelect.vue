<script lang="ts" setup generic="T">
interface Props {
  options: Array<{ value: T, label: string }>
  placeholder?: string
}

withDefaults(defineProps<Props>(), {
  placeholder: '请选择',
});

const modelValue = defineModel<T>();
</script>

<template>
  <USelectMenu
    v-model="modelValue"
    :items="options"
    value-key="value"
    label-key="label"
    :placeholder="placeholder"
    class="w-full"
  />
</template>
