const GrocerDinner = require('../models/grocerdinner.model')
const Pantry = require('../models/pantry.model')

const data1 = {
  "name": "Dinner1",
  "username": "dinner1",
  "email": "dinner1@test.com",
  "role": "dinner",
  "password": "1234567890"
}
GrocerDinner.create(data1)
  .then((grocerdinner) => {
    return Pantry.create({
      name: `${grocerdinner.username}'s tasty pantry`,
      username: `${grocerdinner.username}'s tasty pantry`,
      members: [{
        grocerDinnerObjId: grocerdinner.id,
        role: `${grocerdinner.role}`,
        defaultOwner: true
      }],
      address: "madrid, ES",
      location: {
        "type": "Point",
        "coordinates": [
          -3.6709929,
          40.3990597
        ]
      }
    }).then((pantry) => {
      // console.log('new grocerdinner created >> ', grocerdinner)
      Object.assign(grocerdinner, { pantries: pantry })
      res.status(201).json(grocerdinner)
    })
  })