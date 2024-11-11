export function handlePagination(
  skip: number,
  take: number,
): { skip: number; take: number } {
  // Set default values for skip and take if they are not valid numbers
  const validSkip = !isNaN(skip) && skip >= 0 ? Math.floor(skip) : 0; // Ensure skip is non-negative
  const validTake = !isNaN(take) && take > 0 ? Math.floor(take) : 10; // Ensure take is positive

  return { skip: validSkip, take: validTake };
}
