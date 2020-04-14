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
      data.totals[type] += newItem.value;
      return newItem;
    },
    testing: function () {
      return data;
    },
  };
})();

const uiController = (function () {
  return {
    getInput: function () {
      return {
        type: document.querySelector('.add__type').value,
        description: document.querySelector('.add__description').value,
        value: document.querySelector('.add__value').value,
      };
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

  // get data
  const ctrlAddItem = function () {
    const data = uiCtrl.getInput();
    console.log(typeof data.value);

    // add data to budget controller
    const newItem = budgetCtrl.addItem(data.type, data.description, data.value);

    console.log(newItem);
    // add item to ui
  };

  // update total budget ui

  // update budget UI

  return {
    init: function () {
      console.log('Application has started.');
      setupEventListeners();
    },
  };
})(budgetController, uiController);

controller.init();
