let LIMIT = 5000;
const CURRENCY = 'руб.';
const STATUS_IN_LIMIT = 'Всё хорошо';
const STATUS_OUT_OF_LIMIT = 'Всё плохо';
const STATUS_OUT_OF_LIMIT_CLASSNAME = 'status_bad';

const $input = document.querySelector('.js-input');
const $button = document.querySelector('.js-button');
const $history = document.querySelector('.js-history');
const $total = document.querySelector('.js-total');
const $limit = document.querySelector('.js-limit');
const $status = document.querySelector('.js-status');
const $select = document.querySelector('.js-select');
const $buttonReset = document.querySelector('.js-button-reset');
const $buttonModal = document.querySelector('.js-button-modal');
const $modalWindow = document.querySelector('.modal');
const $closeModalWindow = document.querySelector('.close');
const $buttonLimit = document.querySelector('.js-button-limit');
const $inputLimit = document.querySelector('.js-input-limit');

let expenses = getExpensesData();

expenses = expenses ? jsonToData(expenses) : [];

init(expenses);

$button.addEventListener('click', () => {
  const expense = getExpenseFromUser();

  if (!expense) {
    return;
  }

  trackExpense(expense, $select);
  render(expenses);
  setExpensesData(dataToJson(expenses));
  console.log(expenses);
});

//* LS для расходов
function dataToJson(data) {
  return JSON.stringify(data);
}

function jsonToData(data) {
  return JSON.parse(data);
}

function setExpensesData(data) {
  localStorage.setItem('expenses', data);
}

function getExpensesData() {
  return localStorage.getItem('expenses');
}

//* LS для лимита
function limitToJson(data) {
  return JSON.stringify(data);
}

function limitToData(data) {
  return JSON.parse(data);
}

function setLimitData(data) {
  localStorage.setItem('limit', data);
}

function getLimitData() {
  return localStorage.getItem('limit');
}

function resetList(expenses) {
  $buttonReset.addEventListener('click', () => {
    $history.innerHTML = '';
    expenses.length = 0;
    $limit.innerHTML = getLimitData();
    $total.innerHTML = calculateExpanses(expenses);
    $status.innerHTML = STATUS_IN_LIMIT;
    $status.classList.remove(STATUS_OUT_OF_LIMIT_CLASSNAME);
    localStorage.removeItem('expenses');
  });
}

function init(expenses) {
  renderHistory(expenses);
  resetList(expenses);
  $limit.innerHTML = getLimitData();
  if (expenses !== null && expenses !== undefined) {
    calculateExpanses(expenses);
  }
  $status.innerHTML = STATUS_IN_LIMIT;
}

function calculateExpanses(expenses) {
  let sum = 0;
  if (expenses !== null && expenses !== undefined) {
    expenses.forEach((expense) => {
      sum += expense.expense;
    });
  }
  return sum;
}

function render(expenses) {
  const sum = calculateExpanses(expenses);
  renderHistory(expenses);
  renderSum(sum);
  renderStatus(sum);
}

function trackExpense(expense, $select) {
  if (expenses !== null && expenses !== undefined) {
    expenses.push({ expense: expense, option: $select.value });
  }
}

function getExpenseFromUser() {
  if (!$input.value) {
    return null;
  }
  const expense = parseInt($input.value);
  clearInput();
  return expense;
}

function clearInput() {
  $input.value = '';
}

function renderHistory(expenses) {
  let expensesListHTML = '';
  if (expenses !== null && expenses !== undefined) {
    expenses.forEach((expense) => {
      expensesListHTML += `<li>${expense.expense} ${CURRENCY} - ${expense.option}</li>`;
    });
  }

  $history.innerHTML = `<ol>${expensesListHTML}</ol>`;
}

function renderSum(sum) {
  $total.innerHTML = sum;
}

function renderStatus(sum) {
  if (sum <= getLimitData()) {
    $status.innerHTML = STATUS_IN_LIMIT;
  } else {
    $status.innerHTML = `${STATUS_OUT_OF_LIMIT} (${
      getLimitData() - $total.innerHTML
    } ${CURRENCY})`;
    $status.classList.add(STATUS_OUT_OF_LIMIT_CLASSNAME);
  }
}

function modalStyles(display, backgroundColor, action) {
  $modalWindow.style.display = display;
  $modalWindow.classList[action]('modal-animation');
  document.body.style.backgroundColor = backgroundColor;
  document.body.classList[action]('modalBackdrop');
}

function openModal() {
  $buttonModal.addEventListener('click', function () {
    modalStyles('block', 'grey', 'add');
    $buttonLimit.addEventListener('click', () => {
      $status.classList.remove(STATUS_OUT_OF_LIMIT_CLASSNAME);
      modalStyles('none', '#fff', 'remove');
    });
  });
}

function closeModal() {
  $closeModalWindow.addEventListener('click', () => {
    modalStyles('none', '#fff', 'remove');
  });
}

function setLimit() {
  $buttonLimit.addEventListener('click', () => {
    LIMIT = setLimitData($inputLimit.value);
    init(expenses);
  });
}

openModal();
closeModal();
setLimit();
