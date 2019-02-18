function populateDropdown(elemStr, arr){
  const dropdown = document.getElementById(elemStr);
  for (let i = 0; i < testList.length; i += 1){
    const opt = document.createElement("option");
    opt.value = arr[i];
    opt.text = arr[i];
    dropdown.add(opt, null);
  }
}


const testList = ['a', 'b', 'c', 'd', 'e', 'f']
const elem = 'district_dd';
populateDropdown(elem, testList);
