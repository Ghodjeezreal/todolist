<template>
  <div class="history-container" v-if="history.length">
    <h3>Task History</h3>
    <ul class="history-list">
      <li v-for="item in history" :key="item.historyId" class="history-item">
        <span class="history-task">{{ item.text }}</span>
        <span class="history-info">
          {{ item.action }} • {{ formatTimestamp(item.timestamp) }}
        </span>
        <button @click="$emit('restore', item)" class="restore-btn">Restore</button>
      </li>
    </ul>
    <button @click="$emit('clear-history')" class="clear-history-btn">Clear History</button>
  </div>
</template>

<script setup>
const props = defineProps({
  history: Array
})
defineEmits(['restore', 'clear-history'])

function formatTimestamp(ts) {
  const date = new Date(ts)
  return date.toLocaleString()
}
</script>

<style scoped>
.history-container {
  margin-top: 32px;
  padding-top: 18px;
  border-top: 1.5px solid #ececec;
}
.history-container h3 {
  color: #4f8cff;
  font-size: 1.1rem;
  margin-bottom: 12px;
}
.history-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.history-item {
  padding: 7px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f3f3f3;
  font-size: 0.97rem;
  color: #444;
}
.history-task {
  font-weight: 500;
}
.history-info {
  font-size: 0.92rem;
  color: #888;
  margin-left: 8px;
  margin-right: 16px;
}
.restore-btn {
  background: #4f8cff;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 14px;
  font-size: 0.92rem;
  cursor: pointer;
  transition: background 0.2s;
}
.restore-btn:hover {
  background: #256be6;
}
.clear-history-btn {
  margin-top: 12px;
  background: #ededed;
  color: #333;
  border: none;
  border-radius: 6px;
  padding: 7px 16px;
  font-size: 0.98rem;
  cursor: pointer;
  transition: background 0.2s;
}
.clear-history-btn:hover {
  background: #bdbdbd;
}
</style>