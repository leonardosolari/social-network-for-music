const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;

const PlaylistSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        index: true,
        text: true,
    },
    description: {
        type: String,
        required: true,
        index: true,
        text: true
    },
    author: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    followers: {
        type: [Schema.Types.ObjectId],
        default: [],
    },
    tracks: {
        type: [String],
        default: [],
    },
    private: {
        type: Boolean,
        default: false
    },
    tags: {
        type: [String],
        default: [],
    }
})

module.exports = mongoose.model("Playlist", PlaylistSchema);