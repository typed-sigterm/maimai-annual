<script lang="ts" setup generic="T extends string | number">
interface Props {
  options: Array<{ value: T, label: string }>
  placeholder?: string
}

withDefaults(defineProps<Props>(), {
  placeholder: '请选择',
});

// vue-tsc cannot reduce USelectMenu's `IsPlainObject<T>` conditional type for a
// generic T, so the v-model binding trips TS2322. Cast the local ref to bypass
// it; the declared model prop type (T | undefined) is unaffected.
const modelValue = defineModel<T>() as any;
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
