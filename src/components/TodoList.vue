<template>
  <div class="todo-container">
    <h2>My To-Do List</h2>
    <div class="input-row">
      <input
        v-model="newTodo"
        @keyup.enter="addTodo"
        placeholder="Add a new task"
        class="todo-input"
      />
      <button @click="addTodo" class="add-btn">Add</button>
    </div>

    <div class="filters-row">
      <button
        class="filter-btn"
        :class="{ active: filter === 'all' }"
        @click="filter = 'all'"
      >All</button>
      <button
        class="filter-btn"
        :class="{ active: filter === 'active' }"
        @click="filter = 'active'"
      >Active</button>
      <button
        class="filter-btn"
        :class="{ active: filter === 'completed' }"
        @click="filter = 'completed'"
      >Completed</button>
    </div>

    <ul class="todo-list">
      <TodoItem
        v-for="todo in filteredTodos"
        :key="todo.id"
        :todo="todo"
        @update="updateTodo"
        @delete="removeTodo"
        @complete="completeTodo"
      />
    </ul>

    <TodoFooter
      :active="activeCount"
      :completed="completedCount"
      :total="todos.length"
      @clear-completed="clearCompleted"
    />

    <p v-if="todos.length === 0" class="empty-msg">No tasks yet! 🎉</p>

    <TodoHistory
      :history="history"
      @restore="restoreTask"
      @clear-history="clearHistory"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import TodoItem from './TodoItem.vue'
import TodoFooter from './TodoFooter.vue'
import TodoHistory from './TodoHistory.vue'

const STORAGE_KEY = 'vue-todos-standard'
const HISTORY_KEY = 'vue-todos-history'

const newTodo = ref('')
const todos = ref([])
const filter = ref('all')
const history = ref([])

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    todos.value = JSON.parse(saved)
  }
  const savedHistory = localStorage.getItem(HISTORY_KEY)
  if (savedHistory) {
    history.value = JSON.parse(savedHistory)
  }
})

watch(todos, (val) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
}, { deep: true })

watch(history, (val) => {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(val))
}, { deep: true })

function addTodo() {
  const text = newTodo.value.trim()
  if (text) {
    todos.value.push({
      id: Date.now() + Math.random(),
      text,
      done: false,
      priority: "low",
      dueDate: "",
      subtasks: []
    })
    newTodo.value = ''
  }
}

function updateTodo(updated) {
  const idx = todos.value.findIndex(t => t.id === updated.id)
  if (idx > -1) todos.value[idx] = { ...todos.value[idx], ...updated }
}

function removeTodo(todo) {
  const idx = todos.value.findIndex(t => t.id === todo.id)
  if (idx > -1) {
    const [removed] = todos.value.splice(idx, 1)
    if (removed) addToHistory(removed, 'Deleted')
  }
}

function completeTodo(todo) {
  updateTodo(todo)
  if (todo.done) {
    addToHistory(todo, 'Completed')
  }
}

const filteredTodos = computed(() => {
  if (filter.value === 'active') {
    return todos.value.filter(t => !t.done)
  } else if (filter.value === 'completed') {
    return todos.value.filter(t => t.done)
  }
  return todos.value
})

function clearCompleted() {
  const completed = todos.value.filter(t => t.done)
  if (completed.length) {
    completed.forEach(task => addToHistory(task, 'Completed'))
    todos.value = todos.value.filter(t => !t.done)
  }
}

const activeCount = computed(() => todos.value.filter(t => !t.done).length)
const completedCount = computed(() => todos.value.filter(t => t.done).length)

function addToHistory(task, action) {
  history.value.unshift({
    historyId: Date.now() + Math.random(),
    id: task.id,
    text: task.text,
    action,
    timestamp: Date.now()
  })
}

function clearHistory() {
  history.value = []
}

function restoreTask(item) {
  if (!todos.value.some(t => t.id === item.id)) {
    todos.value.push({
      id: item.id,
      text: item.text,
      done: false
    })
  }
  history.value = history.value.filter(h => h.historyId !== item.historyId)
}
</script>

<style scoped>
.todo-container {
  max-width: 420px;
  margin: 40px auto;
  padding: 28px 20px 18px 20px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08), 0 1.5px 6px rgba(0,0,0,0.06);
}
h2 {
  text-align: center;
  color: #333;
  margin-bottom: 18px;
  letter-spacing: 1px;
}
.input-row {
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
}
.todo-input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #d6d6d6;
  border-radius: 6px;
  font-size: 1rem;
  transition: border 0.2s;
}
.todo-input:focus {
  outline: none;
  border: 1.5px solid #4f8cff;
}
.add-btn {
  background: #4f8cff;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 18px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.add-btn:hover {
  background: #256be6;
}
.filters-row {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 18px;
}
.filter-btn {
  border: 1px solid #e0e0e0;
  background: #f6f8fa;
  color: #333;
  border-radius: 5px;
  padding: 6px 14px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border 0.2s;
}
.filter-btn.active,
.filter-btn:hover {
  background: #4f8cff;
  color: #fff;
  border: 1px solid #4f8cff;
}
.todo-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.empty-msg {
  text-align: center;
  color: #bbb;
  margin: 32px 0 0 0;
  font-style: italic;
  font-size: 1.1rem;
}
@media (max-width: 500px) {
  .todo-container {
    padding: 16px 5px;
  }
  .todo-input, .add-btn, .filter-btn {
    font-size: 0.95rem;
    padding: 8px;
  }
}
</style>