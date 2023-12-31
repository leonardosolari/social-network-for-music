const mongoose = require('mongoose'); 
const Schema = mongoose.Schema; 
const passportLocalMongoose = require('passport-local-mongoose'); 

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        index: true,
        text: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    favorite_genres: { 
        type: [String], 
        default: [] 
    },
    favorite_artists: { 
        type: [String], 
        default: []
    },
    saved_playlists: {
        type: [Schema.Types.ObjectId],
        default: [],
    }
})

// plugin for passport-local-mongoose 
UserSchema.plugin(passportLocalMongoose); 

module.exports = mongoose.model("User", UserSchema);

