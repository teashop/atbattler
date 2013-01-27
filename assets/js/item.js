/** Items and Item Database **/
var atb = atb || {};

(function(exports) {
  exports.Item = [
    [0, 'Large Double-Double', 'A large coffee with two creams and two sugars', [200, 0]],
    [1, 'Red Bull', 'Does not actually give you wings', [400, 0]],
    [2, 'Triple Espresso', 'Highly caffeinated', [800, 0]],
    [3, 'Red Rose Tea', 'Orange Pekoe tea', [0, 50]],
    [4, 'Chai Latte', 'Spiced milk tea', [0, 100]],
    [5, 'Green Tea', 'Contains several antioxidant compounds', [0, 200]],
    [6, 'Jumper Cables', 'Shocks a dead hero back to life', [50, 0], [-1]]
  ];

  exports.Item.field = {
    id: 0,
    name: 1,
    desc: 2,
    attr: 3,
    statuses: 4
  }

})((typeof process === 'undefined' || !process.versions)
  ? atb : exports);
