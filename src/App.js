import Handlebars from 'handlebars';
import * as Pages from './pages';
import './helpers/handlebarsHelper.js';

import Button from "./components/Button.js";
import Input from "./components/Input.js";

Handlebars.registerPartial('Button', Button);
Handlebars.registerPartial('Input', Input);

export default class App {
    constructor() {
        this.state = {
            currentPage: 'login',
            questions: [],
            answers: [],
        };
        this.appElement = document.getElementById('app');
    }

    render() {
        let template;
        if (this.state.currentPage === 'login') {
            template = Handlebars.compile(Pages.LoginPage);
            this.appElement.innerHTML = template({
                questions: this.state.questions,
                createButtonEnabled: this.state.questions.length === 0
            });
        } else {
            template = Handlebars.compile(Pages.LoginPage);
            this.appElement.innerHTML = template({
                questions: [],
                answers: [],
                answerOptions: ['Yes', 'No', 'Maybe'],
            });
        }
        this.attachEventListeners();
    }

    attachEventListeners() {
        if (this.state.currentPage === 'createQuestionnaire') {
            const addButton = document.getElementById('add-question');
            const createButton = document.getElementById('create-questionnaire');

            addButton.addEventListener('click', () => this.addQuestion());
            createButton.addEventListener('click', () => this.createQuestionnaire());
        } else {
            const submitButton = document.getElementById('submit-answers');
            submitButton.addEventListener('click', () => this.submitAnswers());
        }

        const footerLinks = document.querySelectorAll('.footer-link');
        footerLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.changePage(e.target.dataset.page);
            });
        });
    }

    changePage(page) {
        this.state.currentPage = page;
        this.render();
    }

    addQuestion() {
        const questionInput = document.getElementById('question-input');
        if (questionInput.value.trim()) {
            this.state.questions.push(questionInput.value);
            questionInput.value = '';
            this.render();
        }
    }

    createQuestionnaire() {
        if (this.state.questions.length > 0) {
            this.state.currentPage = 'answerQuestionnaire';
            this.render();
        }
    }

    submitAnswers() {
        alert('Answers submitted!');
    }
}