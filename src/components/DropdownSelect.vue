<script lang="ts" setup generic="T extends AcceptableValue">
import type { AcceptableValue } from 'reka-ui';
import { computed } from 'vue';
import Check from '~icons/lucide/check';
import ChevronsUpDown from '~icons/lucide/chevrons-up-down';
import { Button } from '@/components/ui/button';
import { Combobox, ComboboxAnchor, ComboboxEmpty, ComboboxItem, ComboboxItemIndicator, ComboboxList, ComboboxTrigger } from '@/components/ui/combobox';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Props {
  options: Array<{ value: T, label: string }>
  placeholder?: string
  emptyText?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请选择',
  emptyText: '无选项',
});

const modelValue = defineModel<string>();

const displayValue = computed(() => {
  const selected = props.options.find(opt => opt.value === modelValue.value);
  return selected?.label || props.placeholder;
});
</script>

<template>
  <Combobox v-model="modelValue">
    <ComboboxAnchor as-child>
      <ComboboxTrigger as-child>
        <Button variant="outline" class="justify-between">
          {{ displayValue }}
          <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxList class="w-80">
      <ComboboxEmpty>
        {{ emptyText }}
      </ComboboxEmpty>

      <ScrollArea class="h-48">
        <ComboboxItem
          v-for="(option, i) in options"
          :key="i"
          :value="option.value"
          class="whitespace-nowrap"
        >
          {{ option.label }}
          <ComboboxItemIndicator>
            <Check class="ml-auto h-4 w-4" />
          </ComboboxItemIndicator>
        </ComboboxItem>
      </ScrollArea>
    </ComboboxList>
  </Combobox>
</template>
