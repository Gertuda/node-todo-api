const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
      return console.log('Unable to connect MongoDB server')
    }
    console.log('Connected to MongoDB server')
    const db = client.db('TodoApp')

    db.collection('Users').insertOne({
        name: 'Maxim',
        age: 21,
        location: 'Kharkiv'
    }, (err, result) => {
        if (err) {
            return console.log('Unable to insert user', err);
        }

        console.log(result.ops);
    })

    client.close();
})