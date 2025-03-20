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
                    <h3>{{ card.name }}</h3>
                    <button @click="moveToRight(card, index, 'column1')" class="card-button">Вправо</button>
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
                    <div v-if="card.editedData" class="card-info">
                        <h4>Дата редактирования</h4>
                        <p>{{ card.editedData }}</p>
                    </div>                        
                </div>
                <div class="card-footer">
                    <button class="card-button" @click="modalEditOpen(card, index, 'column1')">Редактировать</button>
                    <button class="card-button" @click="deleteCard(index)">Удалить</button>
                </div>
            </div>
        </div>
        <div class="column second-column">
            <h1>Задачи в работе</h1>
            <div v-for="(card, index) in column2" :key="index" class="content">
                <div class="card-head">
                    <h3>{{ card.name }}</h3>
                    <button @click="moveToRight(card, index, 'column2')" class="card-button">Вправо</button>
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
                    <div v-if="card.editedData" class="card-info">
                        <h4>Дата редактирования</h4>
                        <p>{{ card.editedData }}</p>
                    </div>
                    <div v-if="card.reasonForReturn" class="card-info">
                        <h4>Причина возврата</h4>
                        <p>{{ card.reasonForReturn }}</p>
                    </div>    
                </div>
                <div class="card-footer">
                    <button @click="modalEditOpen(card, index, 'column2')" class="card-button">Редактировать</button>
                </div>     
            </div>
        </div>
        <div class="column third-column">
            <h1>Тестирование</h1>
            <div v-for="(card, index) in column3" :key="index" class="content">
                <div class="card-head">
                    <button @click="openReasonForReturn(card, index)" class="card-button">Влево</button>
                    <h3>{{ card.name }}</h3>
                    <button @click="moveToRight(card, index, 'column3')" class="card-button">Вправо</button>
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
                    <div v-if="card.editedData" class="card-info">
                        <h4>Дата редактирования</h4>
                        <p>{{ card.editedData }}</p>
                    </div>                                       
                </div>
                <div class="card-footer">
                    <button @click="modalEditOpen(card, index, 'column3')" class="card-button">Редактировать</button>
                </div>    
            </div>
        </div>
        <div class="column fourth-column">
            <h1>Выполненные задачи</h1>
            <div v-for="(card, index) in column4" :key="index" class="content">
                <div class="card-head">
                    <h3>{{ card.name }}</h3>
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
                    <div class="card-info">
                        <h4>Дата выполнения</h4>
                        <p>{{ card.completedData }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    methods: {
        deleteCard(index) {
            this.$emit('delete-card', index);
        },
        editCard(card, index, column) {
            this.$emit('edit-card', card, index, column);
        },
        modalEditOpen(card, index) {
            this.$emit('modal-edit-open', card, index);
        },
        openReasonForReturn(card, index) {
            this.$emit('open-reason-for-return', card, index);
        },
        moveToRight(card, index, column) {
            this.$emit('move-to-right', card, index, column);
        },
        moveToLeft(card, index) {
            this.$emit('open-reason-for-return', card, index);
        },
    }
});

Vue.component('card-create', {
    props: {
        isModalOpen: { type: Boolean, required: true },
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
            editedData: '',
            completedData: '',
            reasonForReturn: '',
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
                    deadline: this.deadline,
                    editedData: this.editedData,
                    completedData: this.completedData,
                    reasonForReturn: this.reasonForReturn,
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

Vue.component('card-edit', {
    props: {
        isModalEditOpen: { type: Boolean, required: true },
        currentCard: { type: Object, required: true },
        currentIndex: { type: Number, required: true }
    },
    template: `
    <div v-show="isModalEditOpen" class="modal">
        <form @submit.prevent="saveEditedCard">
            <legend>Редактирование карточки</legend>
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
                <input type="submit" value="Редактировать">
                <button class="modal-close-button" type="button" @click="closeEditModal">Закрыть</button>
            </div>
        </form>
    </div>
    `,
    data() {
        return {
            name: this.currentCard.name || '',
            task: this.currentCard.task || '',
            deadline: this.currentCard.deadline || '',
            card: {},
            errors: []
        }
    },
    watch: {
        currentCard: {
            immediate: true,
            handler(newCard) {
                this.name = newCard.name || '';
                this.task = newCard.task || '';
                this.deadline = newCard.deadline || '';
            }
        }
    },
    methods: {
        saveEditedCard() {
            this.errors = [];
            this.card = this.currentCard
            this.name = this.name.trim();
            this.task = this.task.trim();
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
                this.card.name = this.name;
                this.card.task = this.task;
                this.card.editedData = new Date().toLocaleString();
                this.card.deadline = this.deadline;
                this.$emit('edit-card', this.card, this.currentIndex);
                this.closeEditModal();
            }
        },
        closeEditModal() {
            this.$emit('modal-edit-close');
        },
    }
});

Vue.component('reason-for-return', {
    props: {
        isReasonForReturnOpen: { type: Boolean, required: true },
        currentCard: { type: Object, required: true },
        currentIndex: { type: Number, required: true }
    },
    template: `
    <div v-show="isReasonForReturnOpen" class="modal">
        <form @submit.prevent="saveReasonForReturn">
            <legend>Причина возврата карточки</legend>
            <ul class="errors">
                <li v-for="error in errors">{{ error }}!!!!!!!</li>
            </ul>
            <div class="form-div">
                <label for="name">Причина возврата</label>
                <input id="name" type="text" placeholder="Название" v-model="reasonForReturn">
            </div>
            <div class="form-div-buttons">
                <input type="submit" value="Переместить влево">
                <button class="modal-close-button" type="button" @click="closeReasonForReturn">Закрыть</button>
            </div>
        </form>
    </div>
    `,
    data() {
        return {
            reasonForReturn: '',
            card: {},
            errors: []
        }
    },
    methods: {
        saveReasonForReturn() {
            this.errors = [];
            this.reasonForReturn = this.reasonForReturn.trim();
            if (!this.reasonForReturn) {
                this.errors.push("Напишите причину возврата");
            } else {
                this.card = this.currentCard
                this.card.reasonForReturn = this.reasonForReturn;
                this.$emit('add-reason-for-return', this.card, this.currentIndex);
                this.closeReasonForReturn();
            }
        },
        closeReasonForReturn() {
            this.$emit('close-reason-for-return');
        }
    }
})

let app = new Vue({
    el: '#app',
    data: {
        isModalOpen: false,
        isModalEditOpen: false,
        isReasonForReturnOpen: false,
        currentCard: {},
        currentIndex: -1,
        column1: JSON.parse(localStorage.getItem('column1')) || [],
        column2: JSON.parse(localStorage.getItem('column2')) || [],
        column3: JSON.parse(localStorage.getItem('column3')) || [],
        column4: JSON.parse(localStorage.getItem('column4')) || [],
    },
    methods: {
        modalOpen() {
            this.isModalOpen = true;
        },
        modalClose() {
            this.isModalOpen = false;
        },
        modalEditOpen(card, index) {
            this.currentCard = card;
            this.currentIndex = index;
            this.isModalEditOpen = true;
        },
        modalEditClose() {
            this.isModalEditOpen = false;
            this.currentCard = {};
            this.currentIndex = -1;
        },
        openReasonForReturn(card, index) {
            this.currentCard = card;
            this.currentIndex = index;
            this.isReasonForReturnOpen = true;
        },
        closeReasonForReturn() {
            this.isReasonForReturnOpen = false;
            this.currentCard = {};
            this.currentIndex = -1;
        },
        addCard(card) {
            this.column1.push(card);
            this.saveColumnData();
        },
        deleteCard(index) {
            this.column1.splice(index, 1);
            this.saveColumnData();
        },
        updateCard(card, index, column) {
            if (column === 'column1') {
                this.column1.splice(index, 1, card);
            } else if (column === 'column2') {
                this.column2.splice(index, 1, card);
            } else if (column === 'column3') {
                this.column3.splice(index, 1, card);
            }
            this.saveColumnData();
        },
        moveToRight(card, index, column) {
            if (column === 'column1') {
                this.column1.splice(index, 1)
                this.column2.push(card);
            } else if (column === 'column2') {
                this.column2.splice(index, 1)
                this.column3.push(card);
            } else if (column === 'column3') {
                this.column3.splice(index, 1)
                card.completedData = new Date().toLocaleString()
                this.column4.push(card);
            }
            this.saveColumnData();
        },
        addReasonForReturn(card, index) {
            this.column3.splice(index, 1, card);
            this.moveToLeft(card, index);
            this.saveColumnData();
        },
        moveToLeft(card, index) {
            this.column3.splice(index, 1)
            this.column2.push(card);
        },
        saveColumnData() {
            localStorage.setItem('column1', JSON.stringify(this.column1));
            localStorage.setItem('column2', JSON.stringify(this.column2));
            localStorage.setItem('column3', JSON.stringify(this.column3));
            localStorage.setItem('column4', JSON.stringify(this.column4));
        },
    },
})