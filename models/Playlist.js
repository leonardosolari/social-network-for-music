const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;

const PlaylistSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    collaborators: {
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
    }
})

module.exports = mongoose.model("Playlist", PlaylistSchema);