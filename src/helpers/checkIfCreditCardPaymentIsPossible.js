const checkIfCreditCardPaymentIsPossible = (data) => !!(
    Array.isArray(data.offers) && data.offers.length > 0
        && data.offers[0].policies.guarantee
        && Array.isArray(data.offers[0].policies.guarantee.acceptedPayments)
        && data.offers[0].policies.guarantee.acceptedPayments.methods.includes('CREDIT_CARD')
);

module.exports = checkIfCreditCardPaymentIsPossible;
