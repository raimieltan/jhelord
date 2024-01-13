function calculateRating(driverReview: any) {
  let totalRating = 0
  for (const review of driverReview) {
    totalRating += review.rating
  }

  return totalRating / driverReview.length
}
