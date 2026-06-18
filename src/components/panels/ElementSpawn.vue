<script setup lang="ts">
import { computed } from 'vue'
import ElementRow from './ElementRow.vue'
import SchemaControls from './ConfigControls.vue'
import IconPreview from '@/components/IconPreview.vue'
import IconButton from '@/components/IconButton.vue'
import { Cpu, Eye, EyeOff, Trash2 } from 'lucide-vue-next'
import { useDebugSceneStore } from '@/stores/debugScene'
import { useElementPropertiesStore } from '@/stores/elementProperties'
import { storeToRefs } from 'pinia'

interface Properties {
  spawnId: string
  label: string
  isExpanded: boolean
  isSelected: boolean
  hidden: boolean
}

defineProps<Properties>()

const emit = defineEmits<{
  toggle: []
}>()

const debugSceneStore = useDebugSceneStore()
const elementPropertiesStore = useElementPropertiesStore()
const { activeProperties } = storeToRefs(elementPropertiesStore)

const hasExpandedSchema = computed(
  () => Object.keys(activeProperties.value?.schema ?? {}).length > 0
)
</script>

<template>
  <div class="element-spawn">
    <ElementRow :selected="isSelected || isExpanded" :hidden="hidden" @click="emit('toggle')">
      <template #default="{ hovered }">
        <IconPreview :icon="Cpu" color="text-purple-400" size="sm" />
        <span class="element-spawn__label">{{ label }}</span>
        <div class="element-spawn__actions" :class="{ 'element-spawn__actions--visible': hovered }">
          <IconButton
            panel-colors
            :active="hidden"
            size="xs"
            :title="hidden ? 'Show' : 'Hide'"
            @click.stop="debugSceneStore.toggleSpawnVisibility(spawnId)"
          >
            <EyeOff v-if="hidden" />
            <Eye v-else />
          </IconButton>
          <IconButton
            panel-colors
            size="xs"
            title="Remove spawn"
            @click.stop="debugSceneStore.unregisterSpawn(spawnId)"
          >
            <Trash2 />
          </IconButton>
        </div>
      </template>
    </ElementRow>

    <div v-if="isExpanded" class="element-spawn__content">
      <SchemaControls
        v-if="hasExpandedSchema"
        :schema="activeProperties!.schema"
        :get-value="activeProperties!.getValue"
        :on-update="activeProperties!.updateValue"
      />
      <p v-else class="element-spawn__no-props">No configurable properties.</p>
    </div>
  </div>
</template>

<style scoped>
.element-spawn {
  display: flex;
  flex-direction: column;
  border-radius: var(--radius);
  border: 1px solid var(--color-border);
  overflow: hidden;
}

.element-spawn__label {
  flex: 1;
  min-width: 0;
  font-size: var(--font-size-xs);
  font-weight: 500;
  font-family: monospace;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.element-spawn__actions {
  display: flex;
  flex-shrink: 0;
  gap: var(--spacing-0-5);
  opacity: 0;
  transition: opacity 100ms;
}

.element-spawn__actions--visible {
  opacity: 1;
}

.element-spawn__content {
  border-top: 1px solid var(--color-border);
  padding: var(--spacing-2);
  background: var(--panel-content-bg);
}

.element-spawn__no-props {
  font-size: var(--font-size-sm);
  color: var(--color-foreground);
  opacity: var(--opacity-muted);
  margin: 0;
}
</style>
