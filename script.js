const cardText = document.getElementById('cardText');
const cardFrom = document.getElementById('cardFrom');
const cardTo = document.getElementById('cardTo');
const sendBtn = document.getElementById('sendBtn');

const themeBtn = document.getElementById('themeBtn');
const dropdownMenu = document.getElementById('dropdownMenu');
const dropdownItems = document.querySelectorAll('.dropdown-item');

const cardsHistory = document.getElementById('cardsHistory');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

let selectedTheme = 'light';

// 1. Проверка заполненности полей для активации кнопки "Отправить"
function checkInputs() {
    const isFilled =
        cardText.value.trim() !== '' &&
        cardFrom.value.trim() !== '' &&
        cardTo.value.trim() !== '';
    sendBtn.disabled = !isFilled;
}

cardText.addEventListener('input', checkInputs);
cardFrom.addEventListener('input', checkInputs);
cardTo.addEventListener('input', checkInputs);

// 2. Логика выпадающего списка тем
themeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle('show');
});

dropdownItems.forEach(item => {
    item.addEventListener('click', () => {
        dropdownItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        selectedTheme = item.dataset.theme;
        themeBtn.textContent = `Тема: ${item.dataset.name} ▾`;
        dropdownMenu.classList.remove('show');
    });
});

// Закрытие списка при клике вне его
document.addEventListener('click', () => {
    dropdownMenu.classList.remove('show');
});

// 3. Работа с localStorage и отрисовка открыток
function getSavedCards() {
    return JSON.parse(localStorage.getItem('postcards')) || [];
}

function renderCards() {
    const cards = getSavedCards();
    cardsHistory.innerHTML = '';

    cards.forEach(card => {
        const cardEl = document.createElement('div');
        cardEl.classList.add('postcard', card.theme);

        const toEl = document.createElement('div');
        toEl.classList.add('postcard-to');
        toEl.textContent = `Кому: ${card.to}`;

        const textEl = document.createElement('div');
        textEl.classList.add('postcard-text');
        textEl.textContent = card.text;

        const fromEl = document.createElement('div');
        fromEl.classList.add('postcard-from');
        fromEl.textContent = `От кого: ${card.from}`;

        cardEl.append(toEl, textEl, fromEl);
        cardsHistory.append(cardEl);
    });
}

// 4. Отправка и сохранение новой открытки
sendBtn.addEventListener('click', () => {
    const newCard = {
        text: cardText.value.trim(),
        from: cardFrom.value.trim(),
        to: cardTo.value.trim(),
        theme: selectedTheme
    };

    const cards = getSavedCards();
    cards.unshift(newCard); // добавляем новую открытку в начало списка
    localStorage.setItem('postcards', JSON.stringify(cards));

    // Очищаем поля и снова блокируем кнопку
    cardText.value = '';
    cardFrom.value = '';
    cardTo.value = '';
    checkInputs();

    renderCards();
});

// Очистка всей истории
clearHistoryBtn.addEventListener('click', () => {
    localStorage.removeItem('postcards');
    renderCards();
});

// Отрисовка сохранённых открыток при загрузке страницы
renderCards();