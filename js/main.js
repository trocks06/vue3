Vue.component('to-do-list', {
    props: {
        column1: { type: Array, required: true },
        column2: { type: Array, required: true },
        column3: { type: Array, required: true },
        column4: { type: Array, required: true }
    },
    template: `
    <div class="main-div">
        <div class="column first-column">
            <h1>Запланированные задачи</h1>
            <div v-for="(card, index) in column1" :key="index" class="content">
                <div class="card-head">
                    <button class="card-button">Влево</button>
                    <h3>{{ card.name }}</h3>
                    <button class="card-button">Вправо</button>
                </div>
            </div>
        </div>
        <div class="column second-column">
            <h1>Задачи в работе</h1>
            <div v-for="(card, index) in column2" :key="index" class="content">
                <h3>{{ card.name }}</h3>
                <ul class="no-marker">
                    <li v-for="(task, taskIndex) in card.tasks" :key="taskIndex">
                        <input type="checkbox" 
                               :checked="task.taskCompleted"
                               @change="toggleTaskCompletion(card, task, 'column2', index)">
                        {{ task.taskName }}
                    </li>
                </ul>
            </div>
        </div>
        <div class="column third-column">
            <h1>Тестирование</h1>
            <div v-for="(card, index) in column3" :key="index" class="content">
                <h3>{{ card.name }}</h3>
                <ul class="no-marker">
                    <li v-for="(task, taskIndex) in card.tasks" :key="taskIndex">
                        <input disabled type="checkbox" 
                               :checked="task.taskCompleted"
                               @change="toggleTaskCompletion(card, task, 'column3', index)">
                        {{ task.taskName }}
                    </li>
                </ul>
                <p>Дата выполнения: {{ card.completedDate }}</p>
            </div>
        </div>
        <div class="column fourth-column">
            <h1>Выполненные задачи</h1>
            <div v-for="(card, index) in column3" :key="index" class="content">
                <h3>{{ card.name }}</h3>
                <ul class="no-marker">
                    <li v-for="(task, taskIndex) in card.tasks" :key="taskIndex">
                        <input disabled type="checkbox" 
                               :checked="task.taskCompleted"
                               @change="toggleTaskCompletion(card, task, 'column4', index)">
                        {{ task.taskName }}
                    </li>
                </ul>
                <p>Дата выполнения: {{ card.completedDate }}</p>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            checkboxDisabled: Number(JSON.parse(localStorage.getItem('checkboxDisabled'))) || 0,
        };
    },
    methods: {
        toggleTaskCompletion(card, task, column, index) {
            task.taskCompleted = !task.taskCompleted;
            this.checkTaskComplete(card, index, column);
            this.checkTaskInSecondColumn();
            this.updateLocalStorage();
        },
        checkTaskComplete(card, index, column) {
            const tasks = card.tasks.length;
            const completedTasks = card.tasks.filter(task => task.taskCompleted).length;

            if (column === 'column1' && completedTasks >= tasks * 0.5) {
                if (this.column2.length < 5) {
                    this.checkboxDisabled = 0;
                    this.$emit('move-to-column2', card, index, column);
                } else {
                    this.checkboxDisabled = 1;
                }
            } else if (column === 'column2') {
                if (completedTasks < tasks * 0.5) {
                    this.$emit('move-to-column1', card, index);
                } else if (completedTasks === tasks) {
                    this.$emit('move-to-column3', card, index);
                    card.completedDate = new Date();
                    card.completedDate = card.completedDate.toLocaleString()
                }
            } else if (column === 'column3' && completedTasks !== tasks) {
                this.$emit('move-to-column2', card, index, column);
            }
        },
        checkTaskInFirstColumn(card, index) {
            for (let i = 0; i < this.column1.length; i++) {
                const tasks = this.column1[i].tasks.length;
                const completedTasks = this.column1[i].tasks.filter(task => task.taskCompleted).length;
                if (completedTasks >= tasks * 0.5) {
                    this.checkTaskComplete(card, i, "column1")
                }
            }
        },
        checkTaskInSecondColumn() {
            if (this.column2.length < 5) {
                this.checkboxDisabled = 0;
                for (let i = 0; i < this.column1.length; i++) {
                    this.checkTaskComplete(this.column1[i], i, "column1");
                }
            }
        },
        updateLocalStorage() {
            localStorage.setItem('checkboxDisabled', JSON.stringify(this.checkboxDisabled));
            localStorage.setItem('column1', JSON.stringify(this.column1));
            localStorage.setItem('column2', JSON.stringify(this.column2));
            localStorage.setItem('column3', JSON.stringify(this.column3));
        }
    }
});

Vue.component('card-create', {
    props: {
        isModalOpen: { type: Boolean, required: true },
        column1: { type: Array, required: true },
        column2: { type: Array, required: true },
        column3: { type: Array, required: true },
        column4: { type: Array, required: true },
    },
    template: `
    <div v-show="isModalOpen" class="modal">
        <form @submit.prevent="saveCard">
            <legend>Создание карточки</legend>
            <ul class="errors">
                <li v-for="error in errors">{{ error }}!!!!!!!</li>
            </ul>
            <div class="form-div">
                <label for="name">Название карточки</label>
                <input name="name" type="text" placeholder="Название" v-model="name">
            </div>
            <div class="form-div">
            <label for="task">Задание</label>
            <input name="task"  type="text" placeholder="Задание" v-model="task">
            </div>
            <div class="form-div">
            <label for="deadline">Срок выполнения</label>
            <input name="deadline"  type="text" placeholder="Срок" v-model="deadline">
            </div>
            <div class="form-div-buttons">
                <input type="submit" value="Создать">
                <button type="button" @click="closeModal">Закрыть</button>
            </div>
        </form>
    </div>
    `,
    data() {
        return {
            name: '',
            task: '',
            createdData: '',
            deadline: '',
            errors: [],
            inputs: 3
        }
    },
    methods: {
        saveCard() {
            this.errors = [];
            this.name = this.name.trim();
            this.task = this.task.trim();
            this.createdData = new Date();
            this.createdData = this.createdData.toLocaleString()
            this.deadline = this.deadline.trim();

            if (!this.name) {
                this.errors.push("Введите название карточки");
            }
            if (!this.task) {
                this.errors.push("Добавьте задание");
            }
            if (!this.deadline) {
                this.errors.push("Добавьте дедлайн");
            }
            if (this.name && this.newTasks.length >= 3 && this.newTasks.length <= 5) {
                let card = {
                    name: this.name,
                    task: this.task,
                    createdData: this.createdData,

                };
                this.$emit('add-card', card);
                this.closeModal();
                this.name = '';
                this.newTasks = [];
                this.inputs = 3;
            }
        },
        addTask() {
            this.errors = [];
            if (this.inputs >= 5) {
                this.errors.push("Больше пяти заданий сделать нельзя");
            } else {
                this.inputs++;
                this.newTasks.push('');
            }
        },
        closeModal() {
            this.$emit('modal-close');
            this.name = '';
            this.newTasks = [];
            this.inputs = 3;
            this.errors = [];
        },
    }
});

let app = new Vue({
    el: '#app',
    data: {
        isModalOpen: false,
        column1: JSON.parse(localStorage.getItem('column1')) || [],
        column2: JSON.parse(localStorage.getItem('column2')) || [],
        column3: JSON.parse(localStorage.getItem('column3')) || [],
        column4: JSON.parse(localStorage.getItem('column3')) || [],
    },
    methods: {
        modalOpen() {
            this.isModalOpen = true;
        },
        modalClose() {
            this.isModalOpen = false;
        },
        addCard(card) {
            this.column1.push(card);
            this.saveColumnData();
        },
        moveToColumn1(card, index) {
            this.column2.splice(index, 1)
            this.column1.push(card);
            this.saveColumnData()
        },
        moveToColumn2(card, index, column) {
            if (column === 'column1') {
                this.column1.splice(index, 1)
                this.column2.push(card);
            } else if (column === 'column3') {
                this.column3.splice(index, 1)
                this.column2.push(card);
            }
            this.saveColumnData()
        },
        moveToColumn3(card, index) {
            this.column2.splice(index, 1)
            this.column3.push(card);
            this.saveColumnData()
        },
        saveColumnData() {
            localStorage.setItem('column1', JSON.stringify(this.column1));
            localStorage.setItem('column2', JSON.stringify(this.column2));
            localStorage.setItem('column3', JSON.stringify(this.column3));
        },
    },
})