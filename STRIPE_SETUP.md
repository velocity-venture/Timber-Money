# Stripe Product Setup Guide

## Required Stripe Products & Prices

You need to create the following products and prices in your Stripe Dashboard:

### 1. Pro Plan
- **Product Name**: Shoebox to Autopilot Pro
- **Description**: Full automation and AI guidance for debt freedom
- **Prices**:
  - Monthly: $19/month (recurring)
  - Annual: $190/year (recurring yearly)

### 2. Family Plan  
- **Product Name**: Shoebox to Autopilot Family
- **Description**: Transform your entire household's financial future
- **Prices**:
  - Monthly: $39/month (recurring)
  - Annual: $390/year (recurring yearly)

## Steps to Create Products in Stripe

1. Go to https://dashboard.stripe.com/products
2. Click "Add product"
3. Enter product details
4. Add both monthly and yearly pricing options
5. Copy the price IDs (they start with `price_`)

## Environment Variables to Set

After creating the products, add these to your Replit Secrets:

```
STRIPE_PRICE_PRO_MONTHLY=price_xxxxxxxxxxxxx
STRIPE_PRICE_PRO_YEARLY=price_xxxxxxxxxxxxx
STRIPE_PRICE_FAMILY_MONTHLY=price_xxxxxxxxxxxxx
STRIPE_PRICE_FAMILY_YEARLY=price_xxxxxxxxxxxxx
```

## Annual Pricing Benefits

- **Pro Annual**: Save $38/year (17% discount, 2 months free)
- **Family Annual**: Save $78/year (17% discount, 2 months free)

### Why Annual Pricing?

1. **Immediate Cashflow**: Get 12 months of revenue upfront
2. **Reduced Churn**: Annual customers are 4x less likely to cancel
3. **Lower Processing Fees**: One transaction instead of 12
4. **Customer Commitment**: Shows serious intent to achieve debt freedom

## Testing

1. Use Stripe test mode first
2. Test card: 4242 4242 4242 4242
3. Any future expiry date and any CVC
4. Test both monthly and annual flows

## Webhooks (Optional but Recommended)

For production, set up webhooks to handle:
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

Webhook endpoint: `https://your-domain.replit.app/api/stripe/webhook`