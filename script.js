new Vue({
    el: '#app',
    data: {
      newTask: {
        title: '',
        dueDate: null,
        time: null,
        timeColor: '#007bff',
        description: '',
        image: null,
        completed: false,
      },
      tasks: [],
      errors: {
        title: '',
      },
    },
    methods: {
      handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.newTask.image = e.target.result;
          };
          reader.readAsDataURL(file);
        } else {
          this.newTask.image = null;
        }
      },
      openTimeColorPicker() {
        this.$refs.timeColorPicker.click();
      },
      validateTitle() {
        if (!this.newTask.title.trim()) {
          this.errors.title = 'Title is required';
        } else {
          this.errors.title = '';
        }
      },
      addTask() {
        this.validateTitle();
        if (this.errors.title) return;
  
        const taskImage = this.newTask.image || './assets/defaultimg.png';
        this.tasks.push({
          ...this.newTask,
          image: taskImage,
        });
  
        this.newTask = {
          title: '',
          dueDate: null,
          time: null,
          timeColor: '#007bff',
          description: '',
          image: null,
          completed: false,
        };
        this.errors.title = '';
        this.saveTasks();
      },
      toggleTask(index) {
        this.tasks[index].completed = true;
        this.saveTasks();
      },
      undoTask(index) {
        this.tasks[index].completed = false;
        this.saveTasks();
      },
      removeTask(index) {
        this.tasks.splice(index, 1);
        this.saveTasks();
      },
      saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
      },
      loadTasks() {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
          this.tasks = JSON.parse(savedTasks);
        }
      },
      formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString();
      },
    },
    mounted() {
      this.loadTasks();
    },
    template: `
      <div class="app-container">
        <div class="header">
          <div class="header-content">
            <h1>Get Work Done</h1>
          </div>
        </div>
        <div class="task-form">
          <h2>Add New Task</h2>
          <div class="form-line">
            <input
              v-model="newTask.title"
              placeholder="Task Title *"
              @blur="validateTitle"
            />
            <span v-if="errors.title" class="error">{{ errors.title }}</span>
            <input
              type="date"
              v-model="newTask.dueDate"
              placeholder="YYYY-MM-DD"
            />
            <div class="time-color-group">
              <input
                type="time"
                v-model="newTask.time"
                placeholder="HH:MM"
              />
              <div
                class="color-preview"
                :style="{ background: newTask.timeColor }"
                @click="openTimeColorPicker"
              ></div>
              <input
                type="color"
                v-model="newTask.timeColor"
                class="hidden-color-picker"
                ref="timeColorPicker"
              />
            </div>
            <textarea
              v-model="newTask.description"
              placeholder="Task Description (Optional)"
            ></textarea>
            <input
              type="file"
              @change="handleImageUpload"
              accept="image/*"
            />
            <button @click="addTask">Add Task</button>
          </div>
        </div>
        <div class="task-grid-container">
          <div class="task-grid">
            <div
              v-for="(task, index) in tasks"
              :key="index"
              class="task-card"
              :class="{ completed: task.completed }"
            >
              <div v-if="!task.completed" class="task-content">
                <div v-if="task.image" class="task-image-container">
                  <img :src="task.image" alt="Task Image" class="task-image" />
                </div>
                <div v-else class="no-image">
                  <h2>No Image</h2>
                </div>
                <div class="task-header">
                  <h3 :class="{ 'large-title': !task.image }">{{ task.title }}</h3>
                  <span v-if="task.time" :style="{ color: task.timeColor }">{{ task.time }}</span>
                </div>
                <p v-if="task.dueDate" class="due-date"><strong>Due:</strong> {{ formatDate(task.dueDate) }}</p>
                <p v-if="task.description" class="description"><strong>Description:</strong> {{ task.description }}</p>
              </div>
              <div v-else class="completed-message">
                <p>Completed</p>
              </div>
              <div class="task-actions">
                <button
                  v-if="!task.completed"
                  @click="toggleTask(index)"
                  class="action-button done"
                >
                  Done
                </button>
                <button
                  v-else
                  @click="undoTask(index)"
                  class="action-button undo"
                >
                  Undo
                </button>
                <button
                  @click="removeTask(index)"
                  class="action-button delete"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  });