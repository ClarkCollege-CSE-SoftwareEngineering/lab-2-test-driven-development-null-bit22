export interface CartItem {
  price: number;
  quantity: number;
  isTaxExempt?: boolean;
}

export interface CartTotals {
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
}

export function applyDiscount(price: number, discountPercent: number): number {
  if (price < 0) {
    throw new Error("Price cannot be negative");
  }
  if (discountPercent < 0) {
    throw new Error("Discount cannot be negative");
  }
  if (discountPercent > 100) {
    throw new Error("Discount cannot exceed 100%");
  }

  const discountMultiplier = 1 - discountPercent / 100;
  return price * discountMultiplier;
}

export function calculateTax(
  price: number,
  taxRate: number,
  isTaxExempt: boolean = false
): number {
  if (price < 0) {
    throw new Error("Price cannot be negative");
  }
  if (taxRate < 0) {
    throw new Error("Tax rate cannot be negative");
  }

  if (isTaxExempt) {
    return 0;
  }

  const tax = price * (taxRate / 100);
  return Math.round(tax * 100) / 100;
}

export function calculateTotal(
  items: CartItem[],
  discountPercent: number = 0,
  taxRate: number = 0
): CartTotals {

  // Find subtotal
  let subtotal = 0;
  let taxableSubtotal = 0;

  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    subtotal += (item.price * item.quantity);
    if (!item.isTaxExempt) {
        taxableSubtotal += (item.price * item.quantity);
    }
  };

  // Get discount
  const discountedPrice = applyDiscount(subtotal, discountPercent); // This is the new discounted price
  const discount = subtotal - discountedPrice; // The total discount 

  // Apply discount to taxable subtotal
  let taxableSubtotalDiscounted = applyDiscount(taxableSubtotal, discountPercent);

  // Apply tax to the taxable subtotal
  const tax = calculateTax(taxableSubtotalDiscounted, taxRate);
  const total = discountedPrice + tax;

  return {
    subtotal: subtotal,
    discount: discount,
    tax: tax,
    total: total
  }
}