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
                <div class="card-body">
                    <div class="card-info">
                        <h4>Задание</h4>
                        <p>{{ card.task }}</p>
                    </div>
                    <div class="card-info">
                        <h4>Дата создания</h4>
                        <p>{{ card.createdData }}</p>
                    </div>
                    <div class="card-info">
                        <h4>Срок выполнения</h4>
                        <p>{{ card.deadline }}</p>
                    </div>                                        
                </div>
            </div>
        </div>
        <div class="column second-column">
            <h1>Задачи в работе</h1>
            <div v-for="(card, index) in column2" :key="index" class="content">
                <div class="card-head">
                    <button class="card-button">Влево</button>
                    <h3>{{ card.name }}</h3>
                    <button class="card-button">Вправо</button>
                </div>
                <div class="card-body">
                    <p>Задание: {{ card.task }}</p>
                    <p>Дата создания: {{ card.createdData }}</p>
                    <p>Срок выполнения: {{ card.deadline }}</p>
                </div>
            </div>
        </div>
        <div class="column third-column">
            <h1>Тестирование</h1>
            <div v-for="(card, index) in column3" :key="index" class="content">
                <div class="card-head">
                    <button class="card-button">Влево</button>
                    <h3>{{ card.name }}</h3>
                    <button class="card-button">Вправо</button>
                </div>
                <p>{{ card.task }}</p>
                <p>{{ card.createdData }}</p>
                <p>{{ card.deadline }}</p>
            </div>
        </div>
        <div class="column fourth-column">
            <h1>Выполненные задачи</h1>
            <div v-for="(card, index) in column4" :key="index" class="content">
                <div class="card-head">
                    <button class="card-button">Влево</button>
                    <h3>{{ card.name }}</h3>
                    <button class="card-button">Вправо</button>
                </div>
                <p>{{ card.task }}</p>
                <p>{{ card.createdData }}</p>
                <p>{{ card.deadline }}</p>
            </div>
        </div>
    </div>
    `,
    methods: {
        toggleTaskCompletion(card, task, column, index) {
            task.taskCompleted = !task.taskCompleted;
            this.checkTaskComplete(card, index, column);
            this.checkTaskInSecondColumn();
            this.updateLocalStorage();
        },
        updateLocalStorage() {
            localStorage.setItem('checkboxDisabled', JSON.stringify(this.checkboxDisabled));
            localStorage.setItem('column1', JSON.stringify(this.column1));
            localStorage.setItem('column2', JSON.stringify(this.column2));
            localStorage.setItem('column3', JSON.stringify(this.column3));
            localStorage.setItem('column3', JSON.stringify(this.column4));
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
                <input id="name" type="text" placeholder="Название" v-model="name">
            </div>
            <div class="form-div">
                <label for="task">Задание</label>
                <input id="task"  type="text" placeholder="Задание" v-model="task">
            </div>
            <div class="form-div">
                <label for="deadline">Срок выполнения</label>
                <input id="deadline"  type="text" placeholder="Срок" v-model="deadline">
            </div>
            <div class="form-div-buttons">
                <input type="submit" value="Создать">
                <button class="modal-close-button" type="button" @click="closeModal">Закрыть</button>
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
            if (this.name && this.task && this.deadline) {
                let card = {
                    name: this.name,
                    task: this.task,
                    createdData: this.createdData,
                    deadline: this.deadline
                };
                this.$emit('add-card', card);
                this.closeModal();
                this.name = '';
                this.task = '';
                this.createdData = '';
                this.deadline = '';
            }
        },
        closeModal() {
            this.$emit('modal-close');
            this.name = '';
            this.task = '';
            this.createdData = '';
            this.deadline = '';
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
            localStorage.setItem('column3', JSON.stringify(this.column4));
        },
    },
})