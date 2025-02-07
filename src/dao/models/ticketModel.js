import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            unique: true,
        },
        purchase_datetime: {
            type: Date,
            default: Date.now,
        },
        purchaser: {
            type: String,
            required: true, 
        },
        amount: {
            type: Number,
            required: true,
        },
        detalle: {
            type: Array,
            default: [], 
        },
    },
    { timestamps: true } 
);

export const ticketModel = mongoose.model("tickets", ticketSchema);