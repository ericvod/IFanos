import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true,
        required: true,
    },
    image: String,
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
})

export default mongoose.models.User || mongoose.model('User', UserSchema);