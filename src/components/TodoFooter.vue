<template>
  <div class="todo-footer" v-if="total > 0">
    <span>{{ active }} left</span>
    <button
      @click="$emit('clear-completed')"
      class="clear-btn"
      v-if="completed > 0"
    >
      Clear completed ({{ completed }})
    </button>
  </div>
</template>

<script setup>
defineProps({
  active: Number,
  completed: Number,
  total: Number
})
defineEmits(['clear-completed'])
</script>

<style scoped>
.todo-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 14px;
  font-size: 1rem;
}
.clear-btn {
  background: #ff4f4f;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 18px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.2s;
}
.clear-btn:hover {
  background: #d93636;
}
</style>