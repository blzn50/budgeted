const budgetController = (function () {
  const Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  const Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  const data = {
    allItems: {
      inc: [],
      exp: [],
    },
    totals: {
      inc: 0,
      exp: 0,
    },
    budget: 0,
    percentage: -1,
  };

  const calculateTotal = function (type) {
    let sum = 0;
    data.allItems[type].forEach(function (cur) {
      sum += cur.value;
    });

    data.totals[type] = sum;
  };

  return {
    addItem: function (type, desc, val) {
      let newItem;
      let ID;
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      if (type === 'exp') {
        newItem = new Expense(ID, desc, val);
      } else {
        newItem = new Income(ID, desc, val);
      }

      data.allItems[type].push(newItem);
      // data.totals[type] += newItem.value;
      return newItem;
    },
    testing: function () {
      return data;
    },
    calculateBudget: function () {
      // calculate total income and expenses
      calculateTotal('exp');
      calculateTotal('inc');
      // calculate budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;
      // expense percent
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },
    getBudget: function () {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage,
      };
    },
  };
})();

const uiController = (function () {
  return {
    getInput: function () {
      return {
        type: document.querySelector('.add__type').value,
        description: document.querySelector('.add__description').value,
        value: parseFloat(document.querySelector('.add__value').value),
      };
    },
    addListItem: function (obj, type) {
      let html, newHtml, element;

      // create html string with placeholder text
      if (type === 'inc') {
        element = document.querySelector('.income__list');
        html = `<div class="item clearfix" id="income-%id%">
                  <div class="item__description">%description%</div>
                  <div class="right clearfix">
                      <div class="item__value">%value%</div>
                      <div class="item__delete">
                          <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                      </div>
                  </div>
              </div>`;
      } else if (type === 'exp') {
        element = document.querySelector('.expenses__list');
        html = `<div class="item clearfix" id="expense-%id%">
                  <div class="item__description">%description%</div>
                  <div class="right clearfix">
                      <div class="item__value">%value%</div>
                      <div class="item__percentage">21%</div>
                      <div class="item__delete">
                          <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                      </div>
                  </div>
              </div>`;
      }
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);

      element.insertAdjacentHTML('beforeend', newHtml);
    },
    clearFields: function () {
      let fields = document.querySelectorAll('.add__description, .add__value');
      let fieldsArr = Array.prototype.slice.call(fields);
      fieldsArr.forEach(function (cur) {
        cur.value = '';
      });
      fieldsArr[0].focus();
    },
    displayBudget: function (obj) {
      document.querySelector('.budget__value').textContent = obj.budget;
      document.querySelector('.budget__income--value').textContent = obj.totalInc;
      document.querySelector('.budget__expenses--value').textContent = obj.totalExp;
      if (obj.percentage > 0) {
        document.querySelector('.budget__expenses--percentage').textContent = obj.percentage + '%';
      } else {
        document.querySelector('.budget__expenses--percentage').textContent = '---';
      }
    },
  };
})();

const controller = (function (budgetCtrl, uiCtrl) {
  const setupEventListeners = function () {
    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);
    window.addEventListener('keypress', function (e) {
      if (e.keyCode === 13) {
        ctrlAddItem();
      }
    });
  };

  const updateBudget = function () {
    // calculate budget
    budgetCtrl.calculateBudget();
    // return the budget
    const budget = budgetCtrl.getBudget();
    console.log('budget: ', budget);
    // update budget UI
    uiCtrl.displayBudget(budget);
  };

  // get data
  const ctrlAddItem = function () {
    const data = uiCtrl.getInput();
    if (data.description !== '' && !isNaN(data.value) && data.value > 0) {
      // add data to budget controller
      const newItem = budgetCtrl.addItem(data.type, data.description, data.value);

      // add item to ui
      uiCtrl.addListItem(newItem, data.type);

      // clear input fields
      uiCtrl.clearFields();

      updateBudget();
    }
  };

  return {
    init: function () {
      console.log('Application has started.');
      setupEventListeners();
      uiCtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1,
      });
    },
  };
})(budgetController, uiController);

controller.init();
