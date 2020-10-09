import * as mongoose from 'mongoose';

export const OrderSchema = new mongoose.Schema({
    order_id: { type: String },
    invoice_id: { type: String },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    status: { type: String },
    merchant_name: { type: String },
    merchant_profile_picture_url: { type: String },
    currency: { type: String },
    amount: { type: Number },
    payer_email: { type: String },
    description: { type: String },
    invoice_url: { type: String },
    expiry_date: { type: Date },
    cart: {},
    address: [],
    created_at: { type: Date },
    updated_at: { type: Date }
});

// create index search
// OrderSchema.index({
//     status: 'text', merchant_name: 'text', amount: 'text', 
//     payer_email: 'text', description: 'text', 'user.name': 'text', 
//     'user.email': 'text', 'address.address_label': 'text',
//     'address.receiver_name': 'text', 'address.phone_number': 'text',
//     'address.address': 'text'
// });