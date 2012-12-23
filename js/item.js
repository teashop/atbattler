/** Items and Item Database **/

var atb = atb || {};

atb.Item = [
  [0, 'Large Double-Double', 'A large coffee with two creams and two sugars', 200, 0],
  [1, 'Red Bull', 'Does not actually give you wings', 400, 0],
  [2, 'Triple Espresso', 'Highly caffeinated', 800, 0],
  [3, 'Red Rose Tea', 'Orange Pekoe tea', 0, 50],
  [4, 'Chai Latte', 'Spiced milk tea', 0, 100],
  [5, 'Green Tea', 'Contains several antioxidant compounds', 0, 200],
];


atb.Item.field = {
  id: 0,
  name: 1,
  desc: 2,
  hp: 3,
  sp: 4
}