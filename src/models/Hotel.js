class Hotel {
    constructor(
        ammenities,
        breakfast,
        checkInExtra,
        checkInHours,
        checkOutHours,
        contact,
        creditCardPaymentPossible,
        description,
        frontDesk24H,
        location,
        image,
        name,
    ) {
        this.ammenities = ammenities;
        this.breakfast = breakfast;
        this.checkInExtra = checkInExtra;
        this.checkInHours = checkInHours;
        this.checkOutHours = checkOutHours;
        this.contact = contact;
        this.creditCardPaymentPossible = creditCardPaymentPossible;
        this.description = description;
        this.frontDesk24H = frontDesk24H;
        this.location = location;
        this.image = image;
        this.name = name;
    }
}

module.exports = Hotel;
