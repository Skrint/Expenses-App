const LIMIT = 5000;
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

const expenses = [];

init(expenses);

$button.addEventListener('click', () => {
  const expense = getExpenseFromUser();

  if (!expense) {
    return;
  }

  trackExpense(expense);
  render(expenses);
});

function init(expenses) {
  $limit.innerHTML = LIMIT;
  $status.innerHTML = STATUS_IN_LIMIT;
  $total.innerHTML = calculateExpanses(expenses);
}

function calculateExpanses(expenses) {
  let sum = 0;
  expenses.forEach((expense) => {
    sum += expense;
  });
  return sum;
}

function render(expenses) {
  const sum = calculateExpanses(expenses);
  renderHistory(expenses);
  renderSum(sum);
  renderStatus(sum);
}

function trackExpense(expense) {
  expenses.push(expense);
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

  expenses.forEach((expense) => {
    expensesListHTML += `<li>${expense} ${CURRENCY}</li>`;
  });
  $history.innerHTML = `<ol>${expensesListHTML}</ol>`;
}

function renderSum(sum) {
  $total.innerHTML = sum;
}

function renderStatus(sum) {
  if (sum <= LIMIT) {
    $status.innerHTML = STATUS_IN_LIMIT;
  } else {
    $status.innerHTML = STATUS_OUT_OF_LIMIT;
    $status.classList.add(STATUS_OUT_OF_LIMIT_CLASSNAME);
  }
}
