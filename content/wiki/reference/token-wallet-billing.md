---
title: "Token Wallet & Billing"
description: "Understand Raita tokens, subscriptions, and billing."
order: 7
draft: false
---


---

## What Are Raita Tokens?

Raita tokens are credits used for article generation when **AI Source** is set to **Raita Managed**.

Each article generation consumes tokens. The amount depends on:
- The selected model
- The generation mode (Simple uses fewer calls; Blaze/Compose use more)
- Whether web search or image generation is enabled

Tokens are NOT consumed when using BYOK (Bring Your Own Key) — in BYOK mode, costs are charged directly to your provider account.

---

## Token Balance Types

Your wallet holds three types of balance:

| Type | Description | Expires? |
|---|---|---|
| **Subscription tokens** | Allocated monthly with an active subscription | Yes — reset each billing cycle (every 30 days) |
| **Purchased tokens** | Bought separately as top-up packages | No |
| **Trial tokens** | Awarded on registration | Yes |

Tokens are consumed in this priority order: **subscription → trial → purchased**.

---

## Viewing Your Balance

Your token balance is shown in the **sidebar badge** (bottom-left). The badge displays the combined total of all three balance types. Click **Buy** to open the purchase modal.

In the wallet modal you can see:
- Current balance breakdown (subscription / purchased / trial)
- Token usage history
- Transaction history

---

## Topping Up

Three top-up packages are available:

| Package | Tokens | Price (IDR) | Per Token |
|---|---|---|---|
| **Starter** | 50 | Rp 100,000 | Rp 2,000/token |
| **Growth** | 200 | Rp 340,000 | Rp 1,700/token — 15% off |
| **Agency** | 500 | Rp 800,000 | Rp 1,600/token — 20% off |

**To top up:**
1. Click the token balance badge in the sidebar
2. Click **Buy**
3. Select a token package
4. Complete payment via Midtrans (IDR)

Purchased tokens are added to your wallet immediately after payment confirmation.

---

## Subscriptions

A subscription gives you:
- Monthly token allocation (reset each billing cycle, every 30 days)
- Access to Raita features

Subscription tokens expire when the subscription period ends. If your subscription lapses, the subscription balance is zeroed out automatically.

To manage your subscription, go to **Settings → License**.

---

## Affiliate Program

Raita has an affiliate program:
- **Commission**: 12.5% of the referred purchase price
- **Payment**: Paid 1 week after a successful purchase by the referred user
- Access your affiliate link via **Settings → Affiliate** or the Affiliate page

---

## Notes

- Token balance is per-account, not per-device
- The deduction order is: subscription tokens first, then trial tokens, then purchased tokens
- Failed or errored article generation may or may not consume tokens depending on where in the pipeline the failure occurred
- Contact support if you believe tokens were incorrectly charged
