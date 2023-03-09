import { z } from "zod";

export const SupportCategory = z.object({
  supportCategoryId: z.string().uuid(),
  name: z.string().min(3),
  //policy: // TODO: this should be part of the agent/policy service
});

export const Product = z.object({
  productId: z.string().uuid(),
  tenantId: z.string().uuid(),
  name: z.string().min(5),
});

export const Tenant = z.object({
  tenantId: z.string().uuid(),
  name: z.string().min(3),
  email: z.string().email(),
  website: z.string().optional(),
  supportCategories: z.record(z.string().uuid(), SupportCategory),
});

export const User = z.object({
  userId: z.string().uuid(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  isActive: z.boolean(),
  roleId: z.string().uuid(),
});

export const Role = z.object({
  roleId: z.string().uuid(),
  name: z.string().min(3),
});

export const Agent = User.and(
  z.object({
    tenantId: z.string().uuid(),
    //shifts: // TODO: this should be part of the agent service
  })
);
