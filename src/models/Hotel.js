class Hotel {
    constructor(
        amenities,
        breakfast,
        checkInExtra,
        checkInHours,
        checkOutHours,
        creditCardPaymentPossible,
        description,
        dupeId
        frontDesk24H,
        image,
        location,
        name,
        offer,
        phone,
        rating,
    ) {
        this.amenities = amenities;
        this.breakfast = breakfast;
        this.checkInExtra = checkInExtra;
        this.checkInHours = checkInHours;
        this.checkOutHours = checkOutHours;
        this.creditCardPaymentPossible = creditCardPaymentPossible;
        this.description = description;
        this.dupeId = dupeId;
        this.frontDesk24H = frontDesk24H;
        this.image = image;
        this.location = location;
        this.name = name;
        this.offer = offer;
        this.phone = phone;
        this.rating = rating;
    }
}

module.exports = Hotel;
