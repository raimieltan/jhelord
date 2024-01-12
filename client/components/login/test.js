function taxiFare(d, t ) {
    d = Math.ceil(d);
    t = Math.ceil(t);
    const baseRate = 40;
    const perKmRate = 13.50;
    const perMinuteRate = 2;

    const fare = baseRate + (d * perKmRate) + (t * perMinuteRate);
    return fare;
}


console.log(taxiFare(10, 30))