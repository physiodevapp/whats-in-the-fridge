const GrocerDinner = require('../models/grocerdinner.model')
const Pantry = require('../models/pantry.model')

const username = 'paco'
const name = 'paco porras'
let index = 1

function loop() {
  setTimeout(async () => {
    try {
      const grocerdinner = await GrocerDinner.create(
        {
          "name": `${name} ${index}`,
          "email": `${username}${index}@test.com`,
          "password": "1234567890",
          "username": `${username}${index}`,
          "role": "dinner"
        }
      )
      const pantry = await Pantry.create({
        name: `${grocerdinner.username}'s tasty pantry`,
        username: `${grocerdinner.username}'s tasty pantry`,
        members: [{
          grocerDinnerObjId: grocerdinner.id,
          role: `${grocerdinner.role}`
        }],
        "mapLocation": {
          "type": "Point",
          "coordinates": [
            -109.41,
            -102.41
          ]
        }
      })

      if (index < 6) {
        index++
        loop()
      }
    } catch (error) {
      console.log(error)
    }

  }, 1000);
}

loop()