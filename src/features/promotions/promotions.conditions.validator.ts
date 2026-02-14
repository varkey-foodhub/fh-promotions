export interface OrderItem {
  id: number;
  quantity: number;
  price?: number;
}

export interface Order {
  items: OrderItem[];
  total?: number;
}

export type ValidationResult = { valid: true } | { valid: false; error: string; failedKey?: string };

export type ValidatorFn = (
  conditionValue: any,
  order: Order,
) => boolean | string | Promise<boolean | string>;

const registry: Record<string, ValidatorFn> = {};

export function registerValidator(key: string, fn: ValidatorFn) {
  registry[key] = fn;
}

// Default validators
registerValidator("required_item_ids", (conditionValue: any, order: Order) => {
  if (!Array.isArray(conditionValue)) return "required_item_ids must be an array of item ids";
  const requiredIds: number[] = conditionValue.map((v: any) => Number(v));
  console.log(requiredIds)
  const presentIds = new Set(order.items.map((i) => i.id));
  const missing = requiredIds.filter((id) => !presentIds.has(id));
  if (missing.length > 0) return `required_item_ids missing: ${missing.join(", ")}`;
  
  return true;
});

registerValidator("min_order_value", (conditionValue: any, order: Order) => {
  const min = Number(conditionValue);
  if (Number.isNaN(min)) return "min_order_value must be a number";
  const total = order.total ?? order.items.reduce((s, it) => s + (it.price ?? 0) * (it.quantity ?? 1), 0);
  if (total < min) return `min_order_value not met: need ${min}, got ${total}`;
  return true;
});

/**
 * Validate a promotion's conditions against an order/cart.
 * - Unknown condition keys are ignored (pass-through) so the validation engine is forward-compatible.
 * - Returns { valid:true } when all applicable validators pass, otherwise { valid:false, error, failedKey }.
 */
export async function validate(promotion: { conditions?: Record<string, unknown> } | null | undefined, order: Order): Promise<ValidationResult> {
  if (!promotion || !promotion.conditions) return { valid: true };

  for (const [key, value] of Object.entries(promotion.conditions)) {
    const fn = registry[key];
    if (!fn) continue; // unknown condition - skip (extensible)
    try {
      const res = await Promise.resolve(fn(value, order));
      if (res === true) continue;
      if (res === false) return { valid: false, error: `${key} validation failed`, failedKey: key };
      if (typeof res === "string") return { valid: false, error: res, failedKey: key };
      return { valid: false, error: `${key} validation returned invalid result`, failedKey: key };
    } catch (err) {
      return { valid: false, error: `Error validating ${key}: ${String(err)}`, failedKey: key };
    }
  }

  return { valid: true };
}

export default { validate, registerValidator };
