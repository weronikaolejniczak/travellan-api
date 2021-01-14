class Hotel {
    constructor(
        amenities,
        breakfast,
        checkInExtra,
        checkInHours,
        checkOutHours,
        phone,
        creditCardPaymentPossible,
        description,
        frontDesk24H,
        location,
        image,
        name,
        offer
    ) {
        this.amenities = amenities;
        this.breakfast = breakfast;
        this.checkInExtra = checkInExtra;
        this.checkInHours = checkInHours;
        this.checkOutHours = checkOutHours;
        this.phone = phone;
        this.creditCardPaymentPossible = creditCardPaymentPossible;
        this.description = description;
        this.frontDesk24H = frontDesk24H;
        this.location = location;
        this.image = image;
        this.name = name;
        this.offer = offer;
    }
}

module.exports = Hotel;
