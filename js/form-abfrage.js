// trebuie sa verific pe rand daca inputurile au fost complectate
// daca au fost toate complectate creaza task

// daca unu nu a fost complectat afiseaza eroarea la respectivul

function getValueFromInputs() {
  title = document.getElementById("addTaskTittle").value;
  date = document.getElementById("addTaskDate").value;
  category = document.getElementById("categorySelectId").value;
  return {
    title,
    date,
    category,
  };
}

requiredValidation();
function requiredValidation() {
  let inputValue = getValueFromInputs();
  console.log(inputValue);
}

//   reqTitle
//   reqDate
//   reqCategory
