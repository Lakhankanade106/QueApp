import { Schema } from 'mongoose';

export const UserSchema = new Schema({
    fullName: { type: String, trim: true },
    photo: String,
    email: { type: String, trim: true },
    stripeCustomerId: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});