import {Schema, model} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
// Aggregate Paginate is used to write advance queries in mongoose

const videoSchema = new Schema({
    videoFile: {
        type: String, // cloudinary url
        required: true,
    },
    thumbnail: {
        type: String, // cloudinary url
        required: true,
    },
    title: {
        type: String, // cloudinary url
        required: true,
    },
    description: {
        type: String, 
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    isPosted: {
        type: Boolean,
        default: true,
    },
    views: {
        type: Number,
        default: 0
    },
    duration: {
        type: Number, 
        required: true,
    }
}, {timestamps: true});

videoSchema.plugin(mongooseAggregatePaginate);
// used as a plugin

export const Video = model("Video", videoSchema);