const { MongoClient } = require('mongodb');
// or as an es module:
// import { MongoClient } from 'mongodb'


class MongoDb {

    constructor(){
        this.uri = "mongodb+srv://owner:iBGS7KLjKnN2pw1hTauY@ares-shop-intelligence.hyf0g.mongodb.net/Ares-Shop?retryWrites=true&w=majority";
        this.client = new MongoClient(this.uri, { useNewUrlParser: true, useUnifiedTopology: true });
    }

    async startServer() {
        return await this.client.connect();
    }


}

module.exports = MongoDb;