const checkIfCreditCardPaymentIsPossible = (data) =>
    !!(data.policies && data.policies.guarantee && data.policies.guarantee.acceptedPayments) &&
        data.policies.guarantee.acceptedPayments.methods.includes('CREDIT_CARD')

module.exports = checkIfCreditCardPaymentIsPossible;
