import { describe, it, expect } from "vitest";
import {
  applyDiscount,
  calculateTax,
  calculateTotal,
  CartItem,
  CartTotals
} from "../cartUtils";

describe("applyDiscount", () => {
  it("applies a percentage discount to a price", () => {
    expect(applyDiscount(100, 10)).toBe(90);
  });

   it("applies a percentage discount to a price", () => {
    expect(applyDiscount(100, 10)).toBe(90);
  });

  it("returns the original price when discount is 0%", () => {
    expect(applyDiscount(50, 0)).toBe(50);
  });

  it("returns 0 when discount is 100%", () => {
    expect(applyDiscount(75, 100)).toBe(0);
  });

  it("handles decimal prices correctly", () => {
    expect(applyDiscount(19.99, 10)).toBeCloseTo(17.99, 2);
  });

  it("throws an error for negative prices", () => {
    expect(() => applyDiscount(-10, 10)).toThrow("Price cannot be negative");
  });

  it("throws an error for negative discount percentages", () => {
    expect(() => applyDiscount(100, -5)).toThrow("Discount cannot be negative");
  });

  it("throws an error for discount greater than 100%", () => {
    expect(() => applyDiscount(100, 150)).toThrow(
      "Discount cannot exceed 100%"
    );
  });
});

describe('Calculate tax', () => {
  it("calculates tax on a price", () => {
    expect(calculateTax(100, 8.5)).toBe(8.5);
  });

  it("returns 0 tax when rate is 0%", () => {
    expect(calculateTax(50, 0)).toBe(0);
  });

  it("handles decimal prices correctly", () => {
    expect(calculateTax(19.99, 10)).toBeCloseTo(2.0, 2);
  });

  it("returns 0 tax when item is tax-exempt", () => {
    expect(calculateTax(100, 8.5, true)).toBe(0);
  });

  it("throws an error for negative prices", () => {
    expect(() => calculateTax(-10, 8.5)).toThrow("Price cannot be negative");
  });

  it("throws an error for negative tax rates", () => {
    expect(() => calculateTax(100, -5)).toThrow("Tax rate cannot be negative");
  }); 
});

describe("calculateTotal", () => {
  // TODO: Add at least 6 test cases
  // Consider: single item, multiple items, discounts, tax-exempt items,
  // empty cart, mixed tax-exempt and taxable items

  // Create some mock items for testing
  const item: CartItem = {
    price: 100,
    quantity: 1,
    isTaxExempt: false
  };

  const item2: CartItem = {
    price: 25,
    quantity: 3,
    isTaxExempt: false
  };

  const item3: CartItem = {
    price: 3,
    quantity: 5,
    isTaxExempt: true
  };

  const bigItem: CartItem = {
    price: 5000,
    quantity: 1000000,
    isTaxExempt: false
  };

  it("calculates totals for a single item", () => {
    const cart: CartItem[] = []; // Start with an empty cart
    cart.push(item);

    const result: CartTotals = calculateTotal(cart, 0, 8.5); // no discount yet
    expect(result.total).toBe(108.50);
  });

  it("calculates totals for multiple items", () => {
    const cart: CartItem[] = [];
    cart.push(item);
    cart.push(item2);
    
    const result: CartTotals = calculateTotal(cart, 0, 7); // still no discount
    expect(result.total).toBe(187.25);
  });

  it("applies discount before calculating tax", () => {
    const cart: CartItem[] = [];
    cart.push(item);

    const result: CartTotals = calculateTotal(cart, 15, 8.5); // 15% discount w/ 8.5% tax rate
    expect(result.discount).toBe(15)
  });

  it("excludes tax-exempt items from tax calculation", () => {
    const cart: CartItem[] = [];
    cart.push(item2);
    cart.push(item3); // this is the tax-exempt item

    const result: CartTotals = calculateTotal(cart, 10, 8);
    expect(result.total).toBe(86.4);
  });

  // TODO: Add at least 2 more test cases
  it("returns a total of 0 for an empty cart", () => {
    const cart: CartItem[] = [];

    const result: CartTotals = calculateTotal(cart, 0, 8.5);
    expect(result.total).toBe(0);
  });

  it("correctly calculates total for an enormously large cart", () => {
    const cart: CartItem[] = [];
    cart.push(bigItem);

    const result: CartTotals = calculateTotal(cart, 10, 5);
    expect(result.total).toBe(4725000000);
  });
});