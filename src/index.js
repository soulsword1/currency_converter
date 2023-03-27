import { fetchConverter, fetchConverterDate } from './js/fetch_converter';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const refs = {
  selectCurrency: document.querySelector('.select-currency'),
  buyRateEl: document.querySelector('.buy-rate'),
  currencyName: document.querySelector('.currency-name'),
  exchangeResult: document.querySelector('.exchange-result'),
  uahInputEl: document.querySelector('.uah-input'),
  currencyTableContainer: document.querySelector('.container-currency-table'),
  datePickerEl: document.querySelector('#datetime-picker'),
};

const today = new Date().toLocaleDateString();
let currencyArr = [];
let buyRate = null;

const options = {
  dateFormat: 'd.m.Y',
  defaultDate: new Date(),
  onClose() {
    currencyByDate();
  },
};

flatpickr(refs.datePickerEl, options);
currencyByDate();

refs.selectCurrency.addEventListener('change', currencyOnSelect);
refs.uahInputEl.addEventListener('input', uahElOnInput);

function uahElOnInput(e) {
  const result = (e.currentTarget.value/Number(buyRate)).toFixed(2);
  refs.exchangeResult.textContent = result;
}

function currencyOnSelect(e) {
  e.preventDefault();
  onSelectChange(currencyArr);
}

fetchConverter().then(currencies => {
  let table = '<table><tr><th>Валюта</th><th>Покупка</th><th>Продажа</th></tr>';
  const markup = currencies
    .map(
      ({ ccy, buy, sale }) => `<tr>
    <td>${ccy} <span class='uah-span'>UAH</span></td>
    <td>${parseFloat(buy)}</td>
    <td>${parseFloat(sale)}</td>
  </tr>`
    )
    .join('');
  table += `${markup} </table>`;
  refs.currencyTableContainer.innerHTML = table;
});

function currencyByDate() {
  const chosenDate = document.querySelector('#datetime-picker').value;
  const selectedDate = !chosenDate ? today : chosenDate;
  fetchConverterDate(selectedDate).then(currencies => {
    currencyArr = currencies.exchangeRate;
    const markup = currencies.exchangeRate
      .map(
        ({ currency }) => `
      <option value="${currency}">${currency}</option>`
      )
      .join('');
    refs.selectCurrency.innerHTML = markup;
    onSelectChange(currencyArr);
  });
}

function onSelectChange(currencyArr) {
  refs.uahInputEl.value = '';
  refs.exchangeResult.textContent = '';
  const selectValue = refs.selectCurrency.value;
  buyRate = currencyArr.find(
    ({ currency }) => currency === selectValue
  ).purchaseRateNB;
  refs.currencyName.textContent = `${selectValue} :`;
  refs.buyRateEl.textContent = buyRate.toFixed(2);
}
