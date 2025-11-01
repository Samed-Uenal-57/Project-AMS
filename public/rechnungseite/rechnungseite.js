

/* 

//document.addEventListener('DOMContentLoaded', () => {

// Исходные данные, которые «получаем» откуда-то (API/сервер)
  const products = ["Молоко", "Хлеб", "Яблоки"];

  const fields = document.getElementById('fields');
  const addBtn = document.getElementById('add');
  const form = document.getElementById('form-products');

  const escapeHTML = s => String(s).replace(/[&<>"']/g, m => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[m]));

  function render() {
    fields.innerHTML = '';
    products.forEach((val, i) => {
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.gap = '6px';
      row.style.marginBottom = '6px';

      // name="products[]" — удобно для бэка: придёт массив
      row.innerHTML = `
        <input type="text" name="products[]" value="${escapeHTML(val)}" style="flex:1;"/>
        <button type="button" data-i="${i}" aria-label="Удалить">×</button>
      `;

      // обновляем массив при вводе
      row.querySelector('input').addEventListener('input', (e) => {
        products[i] = e.target.value;
      });

      // удаляем элемент
      row.querySelector('button').addEventListener('click', (e) => {
        const idx = +e.currentTarget.dataset.i;
        products.splice(idx, 1);
        render();
      });

      fields.appendChild(row);
    });
  }

  addBtn.addEventListener('click', () => {
    products.push('');
    render();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // Здесь форма отправится как products[]=...&products[]=...
    // Для демонстрации:
    alert('Что уйдёт на бэк:\n' + JSON.stringify(products, null, 2));
  });

  render();

//});


 */