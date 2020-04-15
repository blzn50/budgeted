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
    this.percentage = -1;
  };

  Expense.prototype.calcPercent = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercent = function () {
    return this.percentage;
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
    deleteItem: function (type, id) {
      let ids, index;

      // return array of ids
      ids = data.allItems[type].map((i) => i.id);

      // search id of item to delete
      index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
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
    calculatePercentage: function () {
      data.allItems.exp.forEach((item) => item.calcPercent(data.totals.inc));
    },
    getPercentage: function () {
      var allPercent = data.allItems.exp.map((item) => item.getPercent());
      return allPercent;
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
  const formatNumbers = function (type, number) {
    num = Math.abs(number);
    num = num.toFixed(2);

    const numSplit = num.split('.');
    let int = numSplit[0];
    const dec = numSplit[1];

    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
    }

    return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
  };

  const nodeListForEach = function (list, callback) {
    for (let i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };

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
        html = `<div class="item clearfix" id="inc-%id%">
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
        html = `<div class="item clearfix" id="exp-%id%">
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
      newHtml = newHtml.replace('%value%', formatNumbers(type, obj.value));

      element.insertAdjacentHTML('beforeend', newHtml);
    },
    deleteListItem: function (selectorID) {
      const el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
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
      let type;
      obj.budget > 0 ? (type = 'inc') : (type = 'exp');
      document.querySelector('.budget__value').textContent = formatNumbers(type, obj.budget);
      document.querySelector('.budget__income--value').textContent = formatNumbers(
        'inc',
        obj.totalInc
      );
      document.querySelector('.budget__expenses--value').textContent = formatNumbers(
        'exp',
        obj.totalExp
      );
      if (obj.percentage > 0) {
        document.querySelector('.budget__expenses--percentage').textContent = obj.percentage + '%';
      } else {
        document.querySelector('.budget__expenses--percentage').textContent = '---';
      }
    },
    displayPercentage: function (percentages) {
      const percentLabel = document.querySelectorAll('.item__percentage');

      nodeListForEach(percentLabel, function (current, index) {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + '%';
        } else {
          current.textContent = '---';
        }
      });
    },
    displayDate: function () {
      const months = [
        'January',
        'February',
        'March',
        'April',
        ' May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
      const now = new Date();
      const month = now.getMonth();
      const year = now.getFullYear();
      document.querySelector('.budget__title--month').textContent = months[month] + ' ' + year;
    },
    changedType: function (e) {
      const fields = document.querySelectorAll('.add__type, .add__description, .add__value');
      nodeListForEach(fields, (cur) => {
        cur.classList.toggle('red-focus');
      });
      document.querySelector('.add__btn').classList.toggle('red');
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
    document.querySelector('.container').addEventListener('click', ctrlDeleteItem);
    document.querySelector('.add__type').addEventListener('change', uiCtrl.changedType);
  };

  const updateBudget = function () {
    // calculate budget
    budgetCtrl.calculateBudget();
    // return the budget
    const budget = budgetCtrl.getBudget();
    // update budget UI
    uiCtrl.displayBudget(budget);
  };

  const updatePercentage = function () {
    // calculate percent
    budgetCtrl.calculatePercentage();
    // read percent from budget
    const percentages = budgetCtrl.getPercentage();
    // console.log('percentages: ', percentages);
    uiCtrl.displayPercentage(percentages);
    // update ui
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
      updatePercentage();
    }
  };

  // delete item
  const ctrlDeleteItem = function (e) {
    let splitID, type, ID;
    const itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;
    if (itemID) {
      splitID = itemID.split('-');
      type = splitID[0];
      ID = parseInt(splitID[1]);

      // delete item from data structure
      budgetCtrl.deleteItem(type, ID);

      // delete item from UI
      uiCtrl.deleteListItem(itemID);

      // update the new budget
      updateBudget();
      updatePercentage();
    }
  };

  return {
    init: function () {
      setupEventListeners();
      uiCtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1,
      });
      uiCtrl.displayDate();
    },
  };
})(budgetController, uiController);

controller.init();
