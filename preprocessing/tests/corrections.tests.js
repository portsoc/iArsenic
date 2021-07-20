
function testCorrectRegionName(expect) {
  // let's say corrections is like this:
  // 'Sylhet#Sunamganj#Dharampasha#Dakshin  Sukhairrajapur':
  //   ['Sylhet', 'Sunamganj', 'Dharampasha', 'Dakshin Sukhairrajapur'],
  // 'Rajshahi#Dinajpur':
  //   ['Rangpur', 'Dinajpur']

  // todo formatted to use Jest expect() but needs to be put in Jest framework and set up corrections like above for testing

  // if we don't have a correct, the array is assumed to be correct
  expect(correctRegionName(['a', 'b'])).toEqual(['a', 'b']);

  // if we have a strictly matching correction, we apply it
  expect(correctRegionName(['Sylhet', 'Sunamganj', 'Dharampasha', 'Dakshin  Sukhairrajapur']))
      .toEqual(['Sylhet', 'Sunamganj', 'Dharampasha', 'Dakshin Sukhairrajapur']);
  expect(correctRegionName(['Rajshahi', 'Dinajpur']))
      .toEqual(['Rangpur', 'Dinajpur']);

  // if we have a partial correction, we apply it
  expect(correctRegionName(['Rajshahi', 'Dinajpur', 'a']))
      .toEqual(['Rangpur', 'Dinajpur', 'a']);
  expect(correctRegionName(['Rajshahi', 'Dinajpur', 'a', 'b']))
      .toEqual(['Rangpur', 'Dinajpur', 'a', 'b']);

  // todo add test cases for none
}
