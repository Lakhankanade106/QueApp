import { createCustomer, addCustomerCard } from './stripe';


export const addCard = async ({ user, body: { cardToken } }) => {
    if (!user.stripeCustomerId) {
        const stripeCustomerId = await createCustomer(user.email);

        await User.findOneAndUpdate(
            { _id: user._id },
            { $set: { stripeCustomerId } },
        );

        return addCustomerCard(stripeCustomerId, cardToken);
    }

    return addCustomerCard(user.stripeCustomerId, cardToken);
};  