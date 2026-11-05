let questions = [
    {
        text: 'Если человека назвали мордофиля, то это…',
        answers: [
            'Значит, что он тщеславный.',
            'Значит, что у него лицо как у хряка.',
            'Значит, что чумазый.'
        ],
        right: [0],
        info: 'В словаре Фасмера мордофилей называют чванливого человека. То есть высокомерного, тщеславного.'
    },
    {
        text: '«Да этот Ярополк – фуфлыга!» Что не так с Ярополком?',
        answers: [
            'Он маленький и невзрачный.',
            'Он тот ещё алкоголик.',
            'Он не держит своё слово.'
        ],
        right: [0],
        info: 'В словаре Даля фуфлыга – невзрачный малорослый человек. Ещё так называют прыщи.'
    },
    {
        text: 'Если человека прозвали пятигузом, значит, он…',
        answers: [
            'Не держит слово.',
            'Изменяет жене.',
            'Без гроша в кармане.'
        ],
        right: [0],
        info: 'По словарю Фасмера пятигуз – ненадёжный, непостоянный человек. Может сесть сразу на пять стульев.'
    },
    {
        text: 'Кто такой шлындра?',
        answers: [
            'Обманщик.',
            'Нытик.',
            'Бродяга.'
        ],
        right: [2],
        info: 'В Словаре русского арго «шлындрать» означает бездельничать, шляться.'
    },
    {
        text: 'В каком случае про человека можно сказать, что он охренел в смысле «обнаглел, перешёл границы», а не просто удивился?',
        answers: [
            'Он без спроса берёт твои вещи и делает вид, что так и надо.',
            'Он внаглую лезет без очереди и ещё возмущается, что его не пропускают.',
            'Он съел много хрена и искренне удивился: «Какой жгучий, вот это да!»',
            'В осеннем лесу наблюдается завихрение листьев.'
        ],
        right: [0, 1],
        info: 'В этих случаях слово означает «обнаглел, потерял совесть».'
    }
];

let questionBox = document.getElementById('questions');
let answerBox = document.getElementById('answers');
let message = document.getElementById('message');
let result = document.getElementById('result');

let questionButtons = [];
let count = 0;
let score = 0;
let busy = false;
let chosen = false;

function mix(array) {
    let copy = array.slice();

    for (let i = copy.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = copy[i];
        copy[i] = copy[j];
        copy[j] = temp;
    }

    return copy;
}


function shake(element, className) {
    element.classList.add(className);

    setTimeout(function () {
        element.classList.remove(className);
    }, 350);
}

function updateButtons() {
    for (let i = 0; i < questions.length; i++) {
        questionButtons[i].disabled =
            busy || (questions[i].done && count < questions.length);
    }
}

questions = mix(questions);

for (let i = 0; i < questions.length; i++) {
    questions[i].done = false;

    let button = document.createElement('button');
    button.type = 'button';
    button.className = 'test__question';
    button.textContent = (i + 1) + '. ' + questions[i].text;

    button.onclick = function () {
        showQuestion(i);
    };

    questionBox.appendChild(button);
    questionButtons.push(button);
}

function showQuestion(index) {
    if (busy) {
        return;
    }

    if (questions[index].done && count < questions.length) {
        return;
    }

    shake(questionButtons[index], 'test__question_shake');
    answerBox.textContent = '';

    if (count === questions.length) {
        showAnswer(index);
        return;
    }

    busy = true;
    chosen = false;
    updateButtons();

    message.textContent =
        'Выберите один ответ на вопрос ' + (index + 1) + '.';

    let order = [];

    for (let i = 0; i < questions[index].answers.length; i++) {
        order.push(i);
    }

    order = mix(order);

    for (let i = 0; i < order.length; i++) {
        let number = order[i];
        let button = document.createElement('button');

        button.type = 'button';
        button.className = 'test__answer';
        button.textContent = questions[index].answers[number];

        button.onclick = function () {
            choose(index, number, button);
        };

        answerBox.appendChild(button);
    }
}

function choose(index, number, button) {
    if (chosen) {
        return;
    }

    chosen = true;

    let right = questions[index].right.indexOf(number) !== -1;
    let buttons = answerBox.querySelectorAll('button');

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
    }

    shake(button, 'test__answer_shake');
    message.textContent = 'Ответ принят. Дождитесь окончания анимации.';

    if (right) {
        score++;
        button.classList.add('test__answer_correct');

        let info = document.createElement('span');
        info.className = 'test__info';
        info.textContent = 'Правильно! ' + questions[index].info;
        button.appendChild(info);
    } else {
        button.classList.add('test__answer_wrong');
    }

    setTimeout(function () {
        let mark = document.createElement('span');

        if (right) {
            mark.className = 'test__mark test__mark_correct';
            mark.textContent = '✓';
        } else {
            mark.className = 'test__mark test__mark_wrong';
            mark.textContent = '✗';
        }

        questionButtons[index].appendChild(mark);

        let delay = 0;

        for (let i = 0; i < buttons.length; i++) {

            if (right && buttons[i] === button) {
                continue;
            }

            buttons[i].style.animationDelay = delay + 'ms';
            buttons[i].classList.add('test__answer_away');
            delay += 200;
        }

        if (right) {
            button.style.animationDelay = (delay + 550) + 'ms';
            button.classList.add('test__answer_away');
            delay += 750;
        }

        setTimeout(function () {
            finish(index);
        }, delay + 600);
    }, 2000);
}

function finish(index) {
    answerBox.textContent = '';
    questions[index].done = true;
    count++;
    busy = false;

    if (count === questions.length) {
        message.textContent = 'Вопросы закончились';

        result.textContent =
            'Правильных ответов: ' + score + ' из ' + questions.length +
            '. Нажмите на вопрос, чтобы посмотреть правильный ответ.';
    } else {
        message.textContent =
            'Выберите следующий вопрос. Отвечено: ' +
            count + ' из ' + questions.length + '.';
    }

    updateButtons();
}

function showAnswer(index) {
    let question = questions[index];
    let block = document.createElement('div');
    block.className = 'test__review';

    for (let i = 0; i < question.right.length; i++) {
        let number = question.right[i];
        let paragraph = document.createElement('p');

        paragraph.textContent = '✓ ' + question.answers[number];
        block.appendChild(paragraph);
    }

    let info = document.createElement('p');
    info.textContent = question.info;
    block.appendChild(info);

    answerBox.appendChild(block);
}