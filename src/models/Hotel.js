class Hotel {
    constructor(
        address,
        ammenities,
        breakfast,
        checkInExtra,
        checkInHours,
        checkOutHours,
        contact,
        creditCardPayment,
        description,
        frontDesk24H,
        location,
        image,
        name,
    ) {
        this.address = address;
        this.ammenities = ammenities;
        this.breakfast = breakfast;
        this.checkInExtra = checkInExtra;
        this.checkInHours = checkInHours;
        this.checkOutHours = checkOutHours;
        this.contact = contact;
        this.creditCardPayment = creditCardPayment;
        this.description = description;
        this.frontDesk24H = frontDesk24H;
        this.location = location;
        this.image = image;
        this.name = name;
    }
}

module.exports = Hotel;
