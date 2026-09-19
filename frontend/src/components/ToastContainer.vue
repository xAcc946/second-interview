<template>
  <Teleport to="body">
    <div class="toast-wrap">
      <TransitionGroup name="toast">
        <div
          v-for="t in toastStore.toasts"
          :key="t.id"
          :class="['toast', `toast-${t.type}`]"
          @click="toastStore.remove(t.id)"
        >
          <span class="toast-icon">{{ t.type === 'success' ? '✓' : t.type === 'warn' ? '⚠' : 'ℹ' }}</span>
          {{ t.message }}
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToastStore } from '../stores/toast'

const toastStore = useToastStore()
</script>

<style scoped>
.toast-wrap {
  position: fixed;
  top: 74px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}

.toast {
  padding: 10px 22px;
  border-radius: 999px;
  font-size: 0.9rem;
  box-shadow: 0 6px 20px rgba(15, 23, 42, 0.12);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.toast-success { background: #16a34a; color: #fff; }
.toast-info { background: #1e293b; color: #fff; }
.toast-warn { background: #d97706; color: #fff; }

.toast-icon { font-size: 0.85rem; }

.toast-enter-active { transition: all 0.25s ease-out; }
.toast-leave-active { transition: all 0.3s ease-in; }
.toast-enter-from { opacity: 0; transform: translateY(-12px); }
.toast-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
