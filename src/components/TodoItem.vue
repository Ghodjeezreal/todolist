<template>
  <li
    class="todo-item"
    :class="{ done: todo.done, editing: editing }"
  >
    <div v-if="!editing" class="todo-view">
      <label>
        <input type="checkbox" v-model="localTodo.done" @change="onComplete" />
        <span @dblclick="startEdit">{{ todo.text }}</span>
      </label>
      <span class="priority-label" :class="'priority-' + (todo.priority || 'low')">
        {{ todo.priority || "Low" }}
      </span>
      <span class="due-date" v-if="todo.dueDate">
        Due: {{ formatDate(todo.dueDate) }}
      </span>
      <button @click="toggleSubtasks" class="subtask-toggle-btn">
        {{ showSubtasks ? 'Hide Subtasks' : 'Show Subtasks' }}
      </button>
      <div class="actions">
        <button @click="startEdit" class="edit-btn">Edit</button>
        <button @click="onDelete" class="delete-btn">Delete</button>
      </div>
    </div>
    <div v-else class="edit-row">
      <input
        v-model="editText"
        @keyup.enter="doneEdit"
        @keyup.esc="cancelEdit"
        class="edit-input"
        ref="editInput"
      />
      <select v-model="editPriority" class="priority-select">
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <input type="date" v-model="editDueDate" class="due-date-input" />
      <button @click="doneEdit" class="save-btn">Save</button>
      <button @click="cancelEdit" class="cancel-btn">Cancel</button>
    </div>

    <!-- Subtasks -->
    <div v-if="showSubtasks" class="subtasks-section">
      <ul>
        <li v-for="(sub, idx) in localTodo.subtasks" :key="sub.id">
          <input type="checkbox" v-model="sub.done" @change="updateSubtask(sub, idx)" />
          <span :class="{ 'sub-done': sub.done }">{{ sub.text }}</span>
          <button @click="deleteSubtask(idx)" class="sub-delete-btn">Delete</button>
        </li>
      </ul>
      <div class="subtask-input-row">
        <input v-model="newSubtask" @keyup.enter="addSubtask" placeholder="Add subtask..." />
        <button @click="addSubtask" class="add-sub-btn">Add</button>
      </div>
    </div>
  </li>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  todo: Object
})
const emits = defineEmits(['update', 'delete', 'complete'])

const editing = ref(false)
const showSubtasks = ref(false)
const editText = ref(props.todo.text)
const editPriority = ref(props.todo.priority || "low")
const editDueDate = ref(props.todo.dueDate || "")
const editInput = ref(null)
const localTodo = ref({ ...props.todo })
const newSubtask = ref('')

watch(
  () => props.todo,
  (newTodo) => {
    localTodo.value = { ...newTodo }
    editText.value = newTodo.text
    editPriority.value = newTodo.priority || "low"
    editDueDate.value = newTodo.dueDate || ""
  }
)

function startEdit() {
  editing.value = true
  nextTick(() => {
    if (editInput.value) editInput.value.focus()
  })
}

function doneEdit() {
  const text = editText.value.trim()
  if (text) {
    emits('update', {
      ...props.todo,
      text,
      priority: editPriority.value,
      dueDate: editDueDate.value
    })
  }
  editing.value = false
}

function cancelEdit() {
  editing.value = false
  editText.value = props.todo.text
  editPriority.value = props.todo.priority || "low"
  editDueDate.value = props.todo.dueDate || ""
}

function onDelete() {
  emits('delete', props.todo)
}

function onComplete() {
  emits('complete', { ...props.todo, done: localTodo.value.done })
}

function toggleSubtasks() {
  showSubtasks.value = !showSubtasks.value
}

function addSubtask() {
  const text = newSubtask.value.trim()
  if (!text) return
  const subtasks = localTodo.value.subtasks || []
  subtasks.push({
    id: Date.now() + Math.random(),
    text,
    done: false
  })
  updateTodoField('subtasks', subtasks)
  newSubtask.value = ''
}

function updateSubtask(subtask, idx) {
  const subtasks = [...(localTodo.value.subtasks || [])]
  subtasks[idx] = { ...subtask }
  updateTodoField('subtasks', subtasks)
}

function deleteSubtask(idx) {
  const subtasks = [...(localTodo.value.subtasks || [])]
  subtasks.splice(idx, 1)
  updateTodoField('subtasks', subtasks)
}

function updateTodoField(field, value) {
  emits('update', { ...props.todo, [field]: value })
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString()
}
</script>

<style scoped>
.todo-item {
  display: flex;
  flex-direction: column;
  background: #f6f8fa;
  border-radius: 8px;
  padding: 10px 14px;
  margin-bottom: 12px;
  transition: background 0.2s;
}
.todo-item.done span {
  text-decoration: line-through;
  color: #aaa;
}
.todo-item label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
}
.todo-item .actions {
  display: flex;
  gap: 6px;
}
.edit-btn,
.delete-btn {
  background: #ededed;
  color: #333;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.edit-btn:hover {
  background: #4f8cff;
  color: #fff;
}
.delete-btn {
  background: #ff4f4f;
  color: #fff;
}
.delete-btn:hover {
  background: #d93636;
}
.todo-item.editing {
  background: #eaf2ff;
}
.edit-row {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}
.edit-input {
  flex: 1;
  padding: 8px 10px;
  border: 1.5px solid #4f8cff;
  border-radius: 6px;
  font-size: 1rem;
}
.save-btn {
  background: #4f8cff;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 7px 15px;
  font-size: 0.95rem;
  cursor: pointer;
}
.cancel-btn {
  background: #ededed;
  color: #333;
  border: none;
  border-radius: 6px;
  padding: 7px 15px;
  font-size: 0.95rem;
  cursor: pointer;
}
.save-btn:hover {
  background: #256be6;
}
.cancel-btn:hover {
  background: #bdbdbd;
}
.priority-label {
  margin-left: 10px;
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 0.9em;
  font-weight: 600;
}
.priority-high {
  background: #ffedeb;
  color: #d70000;
}
.priority-medium {
  background: #fff6e1;
  color: #ee9b00;
}
.priority-low {
  background: #e9fbe9;
  color: #399948;
}
.due-date {
  margin-left: 10px;
  font-size: 0.9em;
  color: #888;
}
.priority-select {
  margin-left: 8px;
  border-radius: 6px;
  padding: 4px 8px;
}
.due-date-input {
  margin-left: 8px;
  border-radius: 6px;
  padding: 4px 8px;
}
.subtasks-section {
  margin-top: 10px;
  padding-left: 24px;
}
.subtasks-section ul {
  list-style: disc;
  padding-left: 10px;
  margin-bottom: 6px;
}
.subtasks-section li {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 3px;
}
.sub-done {
  text-decoration: line-through;
  color: #aaa;
}
.sub-delete-btn {
  background: #fde9e9;
  color: #d70000;
  border: none;
  border-radius: 6px;
  padding: 2px 8px;
  font-size: 0.88em;
  cursor: pointer;
}
.sub-delete-btn:hover {
  background: #ffc1c1;
}
.subtask-input-row {
  display: flex;
  gap: 6px;
  margin-top: 4px;
}
.add-sub-btn {
  background: #4f8cff;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 0.93em;
  cursor: pointer;
}
.add-sub-btn:hover {
  background: #256be6;
}
.subtask-toggle-btn {
  margin-left: 10px;
  background: #ededed;
  color: #333;
  border: none;
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 0.93em;
  cursor: pointer;
}
.subtask-toggle-btn:hover {
  background: #c7e0ff;
}
</style>