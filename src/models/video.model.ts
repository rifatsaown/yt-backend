import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema({
    videoFile: {
        type: String, // Cloudinary URL
        required: true
    },
    thumbnail: {
        type: String, // Cloudinary URL
        required: true
    },
    title:{
        type: String,
        required: true,
        index: true
    },
    description:{
        type: String,
        required: true,
    },
    duration:{
        type: Number, // Cloudinary URL
        required: true,
    },
    views:{
        type: Number,
        default: 0
    },
    isPublished:{
        type: Boolean,
        default: false
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

},{ timestamps: true});

videoSchema.plugin(mongooseAggregatePaginate); // Pagination plugin for mongoose schema


export const Video = mongoose.model('Video', videoSchema);