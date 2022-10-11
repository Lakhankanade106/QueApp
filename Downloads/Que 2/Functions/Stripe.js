import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCustomer = email =>
    stripe
        .customers
        .create({ email })
        .then(({ id }) => id);

export const addCustomerCard = (stripeCustomerId, stripeToken) =>
    stripe
.customers
.createSource(stripeCustomerId, {
    source: stripeToken,
});