const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://MyMongoDBUser:test@123@cluster0-ojhza.mongodb.net/chat';
const DB_NAME = "chat"
const COLLECTION_USERS = "users"
const COLLECTION_CHANNELS = "channels";


const connectDB = async (endPoint, req, res) => {
    try {
        let client = await mongoClient.connect(MONGODB_URI, { useNewUrlParser: true });
        let db = client.db(DB_NAME);
        initiateDBOperation(endPoint, db, req, res, client);
    }catch(error) {
        console.log(error);
    }
}

const initiateDBOperation = (endPoint, db, req, res, client) => {
    switch(endPoint){
        case 'login':
            login(db, req, res, client);
            break;
        case 'getChannels':
            getChannels(db, req, res, client);
            break;
        case 'getChannelsByUser':
            getChannelsByUser(db, req, res, client);
            break;
        case 'createChannel':
            createChannel(db, req, res, client);
            break;
        case 'getConversation':
            getConversation(db, req, res, client);
            break;
        case 'saveConversation':
            saveConversation(db, req, res, client);
    }
}

const login = async (db, req, res, client) => {
    let { username, password } = req.body;
    let data = await db.collection(COLLECTION_USERS)
                       .find({ username, password })
                       .toArray();

    if(data.length > 0) {
        data.map((doc) => {
            doc.userId = doc._id;
            delete doc._id;
        })

        closeConnection(data, res, client);
    }else {
        await db.collection(COLLECTION_USERS).insertOne(
            { username, password },
            (error, response) => {
                if(error) {
                    console.log('error while creating new user');
                }else {
                    delete Object.assign(response.ops[0], {['userId']: response.ops[0]['_id'] })['_id'];
                    let data = new Array();
                    data.push(response.ops[0]);
                    closeConnection(data, res, client);
                }
            }
        );

    }
}

const getChannels = async (db, req, res, client) => {
    let { id } = req.params;
    try {
        let data = await db.collection(COLLECTION_CHANNELS)
                           .find()
                           .toArray();

        if(data.length > 0) {
            closeConnection(data, res, client);
        }
    }catch(error) {
        console.log(error);
    }
}

const getChannelsByUser = async (db, req, res, client) => {
    let { id } = req.params;
    try {
        let data = await db.collection(COLLECTION_CHANNELS)
                           .find({"createdBy":id})
                           .toArray();

        if(data.length > 0) {
            closeConnection(data, res, client);
        }
    }catch(error) {
        console.log(error);
    }
}

const createChannel = async (db, req, res, client) => {
    let { channelName, channelId, createdBy } = req.body;
    await db.collection(COLLECTION_CHANNELS).insertOne(
        { channelName, channelId, createdBy },
        (error, response) => {
            if(error) {
                console.log('Error occurred while inserting');
            } else {
               closeConnection(response.ops[0], res, client);
            }
        }
    )
}

const getConversation = async (db, req, res, client) => {
    let { id } = req.params;
    try {
        let data = await db.collection(COLLECTION_CHANNELS)
                           .find({"channelId":id}, { projection: { "messages": 1}})
                           .toArray();
        if(data && data[0].messages && data[0].messages.length > 0) {
            closeConnection(data[0].messages, res, client);
        }else {
            closeConnection([], res, client);
        }
    }catch(error) {
        console.log(error);
    }
}

const saveConversation = async (db, req, res, client) => {
    let { channelId } = req.body[0];
    let allMessages = req.body.sort((a, b) => {
        return new Date(a.time) - new Date(b.time);
    });

    try {
		let bulk = await db
			.collection(COLLECTION_CHANNELS)
			.initializeOrderedBulkOp();

		let ops = []

		for (let i = 0; i < allMessages.length; i++) {
			ops.push(
				await bulk
					.find({ 'channelId': channelId })
					.updateOne({ $push: { "messages": allMessages[i] } })
			)
		}

		let result = await bulk.execute();

		closeConnection({'message':'success'}, res, client);
	} catch (error) {
		console.log('Unable to update rooms with messages', error)
	}
}

const closeConnection = (data, res, client) => {
    res.json(data);
    client.close();
}

module.exports = {
    connectDB
}
