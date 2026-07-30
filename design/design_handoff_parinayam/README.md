# Handoff: Parinayam Matrimony Platform — Customer Website UI

## Overview
A complete, white-label matrimony platform UI ("Parinayam", first client: Veluthedathu Nair community, Kerala). 15 pages × desktop (1440px) + mobile (390px) = 30 screens, plus a design-system/components sheet. Premium, family-friendly aesthetic in the vein of Airbnb/Stripe/Bumble.

## Target stack (per product owner)
- **Next.js (App Router) + TypeScript**
- **TanStack React Query** for all server state (profiles, matches, interests, chat, notifications, plans)
- **Tailwind CSS** for styling (tokens below map 1:1 to a `tailwind.config.ts` theme)
- **shadcn/ui** as the component base (Button, Card, Tabs, Accordion, Dialog, Sheet, Toast, Slider, Select, Progress, Badge, Avatar, Input OTP)

## About the Design Files
The `.dc.html` files in this bundle are **design references built in HTML** — they show the intended look and behavior but are NOT production code. Recreate them as Next.js routes + React components using the patterns below. `image-slot` elements are photo placeholders — replace with `next/image` fed by real profile/CDN images.

## Fidelity
**High-fidelity.** Colors, typography, spacing, radii, and copy are final. Recreate pixel-perfectly, but use shadcn/ui primitives + Tailwind utilities rather than inline styles.

## Design Tokens

### Colors (put in Tailwind theme)
| Token | Hex | Use |
|---|---|---|
| `primary` | `#1E3A8A` | Buttons, links, active nav, brand |
| `primary-hover` | `#24449E` | Button hover |
| `primary-deep` | `#14275F` | Headings, dark panels, chat bubbles (self) |
| `primary-darkest` | `#0F1D47` | Footer background |
| `gold` | `#C19A3F` → `#E3C57A` (135° gradient) | Premium badges, gold CTAs, eyebrow labels |
| `gold-text` | `#9A6B2F` | Gold-tinted text on light bg |
| `success` | `#0E9F6E` | Verified, online, toggles-on, success states |
| `peach` | `#E8936B` / bg `#FBEFE6` / text `#C05A2E` | Notification dots, warm accents |
| `ink` | `#1A2233` | Body text |
| `muted` | `#5A6472` | Secondary text |
| `faint` | `#8A93A6` | Tertiary text, labels |
| `border` | `#E4E8EF` (inputs) / `#EEF0F4` (cards) | Borders |
| `surface` | `#F7F8FA` | Page background |
| `surface-blue` | `#EEF2FB` | Selected/tinted chips, icons |
| `surface-cream` | `#FDF9F4` / `#F6EFDD` | Warm sections (stories), gold tints |
| `success-bg` | `#E6F6EF` / `#F2FBF7` | Green tints |
| `danger` | `#C0392B` / bg `#FDECEC` | Delete, expiry warnings |

Hero gradient: `linear-gradient(160deg, #FDF9F4 0%, #FBEFE6 48%, #F3F0FB 100%)`.
Dark panel gradient: `linear-gradient(135deg, #14275F, #1E3A8A)`.

### Typography
- Family: **Plus Jakarta Sans** (400/500/600/700/800) via `next/font/google`. (Optional white-label variants explored: Marcellus for display, Sora.)
- Desktop: hero 60px/800/−0.025em, section H2 40px/800/−0.02em, page H1 28px, card titles 15.5–20px/700–800, body 14–15px, labels 12–13px/700 uppercase +0.05em tracking.
- Mobile: hero 36px, H1 24–26px, body 13–14px. Minimum touch target 44px.

### Spacing / radii / shadows
- Radii: cards 18–24px, inputs/buttons 10–14px, pills 999px.
- Card border `1px #EEF0F4`; hover lift `translateY(-4~6px)` + `0 18–24px 40–50px rgba(20,39,95,0.10)`.
- Primary CTA shadow `0 8–10px 22–26px rgba(30,58,138,0.28)`; gold CTA `rgba(193,154,63,0.35)`.
- Desktop page gutter 48–72px; mobile 20px; grid gaps 18–28px.

## Suggested Next.js structure
```
app/
  (marketing)/page.tsx            ← Landing
  (marketing)/stories/, blog/, contact/, help/
  (auth)/login/, register/        ← multi-step register uses a step param or client state machine
  (app)/dashboard/, search/, profile/[id]/, inbox/, notifications/, plans/, checkout/, settings/
components/ui/                    ← shadcn primitives
components/parinayam/             ← ProfileCard, MatchBadge, VerifiedBadge, PremiumRibbon,
                                    OnlineDot, StatTile, PlanCard, ChatBubble, VoiceWave,
                                    NotificationItem, FilterChip, BottomNav, StickyActionBar
lib/api/                          ← typed fetchers
lib/queries/                      ← React Query hooks
```

## React Query mapping (server state)
Suggested query keys + hooks:
- `['profile', id]` → `useProfile(id)` — member profile page
- `['matches', 'suggested']` → dashboard suggestions; `staleTime` ~5m
- `['search', filters]` → `useInfiniteQuery` for results grid + "Load more" (mobile) / pagination (desktop)
- `['interests', 'received' | 'sent']` — with `useMutation` for send/accept/decline + optimistic update of counts
- `['conversations']`, `['messages', conversationId]` — chat; poll or WS; optimistic append on send; read receipts via mutation
- `['notifications']` — infinite list, `useMutation` mark-read (optimistic)
- `['visitors']`, `['shortlists']` — dashboard tiles
- `['membership']` — plan status, contact-view quota
- `['plans']`, checkout: `useMutation` createOrder → payment gateway → invalidate `['membership']`
- Shortlist/block/report: mutations with optimistic toggle, invalidate profile + search caches

Client-only state (no React Query): registration wizard step data (Zustand or useReducer + localStorage draft), filter sidebar/sheet state, UI toggles.

## Screens (one per file, desktop + mobile)

1. **Landing** — sticky nav; hero (badge, 2-line title, couple photo w/ floating "Interest Accepted" + "92% AI Match" cards, `pn-float` 6–7s ease-in-out ±8px); overlapping search card (Bride/Groom segmented, age range, community & location selects, gold Search CTA); stats row; How-it-works 4 cards; Featured profiles 4-up grid; dark "Why choose us" + Verified-badge explainer panel; Success stories (cream bg `#FDF9F4`); 3 plan cards (Premium dark + MOST POPULAR pill); testimonials; app-download banner (phone mock overflows bottom); blog 3-up; footer. Mobile: hamburger, horizontal-scroll profile/story rails, sticky bottom Register/Login bar.
2. **Registration** — multi-step wizard (Personal → Religion/Caste → Education/Career → Family → Partner prefs → Photos → ID verification → Review). Progress indicator top; mobile uses full-screen steps + sticky Continue.
3. **Login** — desktop split layout: left brand panel (dark blue gradient, couple photo, married-couple proof chip), right form. OTP/Password tab toggle, 6-box OTP input, resend countdown, Google/Apple social, register link. Mobile: dark rounded header + floating form card.
4. **Dashboard** — welcome banner (dark gradient), 4 stat tiles (received/sent/visitors/shortlists), suggested match cards, recently-viewed avatars, right rail: profile-strength ring (conic-gradient 85%) + improvement chips (+10% voice intro), membership card w/ quota progress bar, notifications feed, quick actions. Mobile: bottom nav (5 tabs, raised gold ♥ center FAB) + horizontal match rail.
5. **Search** — 316px filter sidebar (dual-handle range sliders for age/height, selects for religion/caste/education/occupation/income/location/marital/family, chip groups for horoscope + lifestyle), applied-filter chips row, sort select, grid/list toggle, 3-col result cards, numbered pagination. Mobile: search header + filter FAB (opens bottom sheet), chips rail, list-style cards, Load more.
6. **Member Profile** — cover + overlapping avatar (online dot), name + Verified/Premium/Online badges, action row (Express Interest, gold View Contact, shortlist ☆, share, ⋯ = block/report), AI summary card, gallery grid (+8 overlay), voice-intro waveform player, detail sections (Education/Family/Lifestyle/Religion) as 2-col key-value grids, partner-preference match checklist (green rows), right rail: 92% compatibility ring + porutham/lifestyle/trust sub-scores, mutual connections, horoscope card, similar profiles. Mobile: full-bleed photo hero, sheet-style identity card, accordion sections, sticky action bar.
7. **Inbox/Chat** — 400px conversation list (Chats/Requests tabs, interest-request card with Accept/Decline, unread badges) + chat window (match-date pill, text bubbles: self `#1E3A8A` white / other white bordered, voice message w/ waveform, image attachment, typing dots, read receipts "✓✓ Read", composer: attach/mic/send). Mobile: dedicated chat screen.
8. **Notifications** — filter chips (All/Interests/Views/Account), day-grouped timeline (Today/Yesterday/Earlier), icon-coded rows, inline Accept/Decline actions, unread dots, mark-all-read.
9. **Membership Plans** — duration toggle (3/6/12 mo, −20% pill), 3 plan cards, full comparison table (Premium column tinted `#FDF9F4`), trust row. Mobile: stacked cards, condensed table, sticky Go Premium CTA.
10. **Settings** — desktop: left settings nav + content (photo-privacy radio cards, visibility toggle switches 48×28, notification matrix Push/Email/SMS, blocked users with Unblock, danger zone: pause/password/delete). Mobile: grouped iOS-style list.
11. **Payment** — checkout: UPI (selected, app chips + UPI-ID verify) / Cards / NetBanking / Wallets radio cards; order summary rail w/ coupon (FIRSTMATCH −20%), GST line, gold Pay CTA. Mobile screen shows **Order Success**: green hero w/ pop-in check (`pn-pop` 0.5s scale 0.6→1.08→1), receipt card, unlocked-features list, invoice download.
12. **Help Center** — dark hero search, 4 contact channel cards (chat/call/email/WhatsApp), FAQ accordion w/ category chips, raise-ticket form rail (topic select, textarea, attachment dropzone), phone fallback.
13. **Success Stories** — search + year/district filters, featured story (dark panel, 560px photo), 3-up story grid (date pill on photo, quote), load more. Cream page bg.
14. **Blog** — category chips, featured hero card (gradient overlay) + 3 side items, 3-up article grid w/ excerpt.
15. **Contact** — 2-col: form (name/phone/email, topic chips, message w/ focused state) + rail (stylized map card w/ brand pin, office address, phone/email rows, WhatsApp card `#E9F9EF`).

## Reusable components (see Design System.dc.html)
Buttons (primary/gold/outline/ghost), ProfileCard (photo, premium ribbon, online pill, match% pill, verified tick, Interest + shortlist), badges (Verified ✓ blue pill, Premium ★ gold-gradient pill, Online green dot pill, New Member), filter chips (active = solid primary + ✕), segmented control, OTP input, dual-handle slider, toggle switch, progress ring (conic-gradient), progress bar, tabs, accordion, chat bubbles, waveform player, notification card, plan card, stat tile, pagination, bottom nav, sticky action bar, empty states, skeletons.

## Interactions & micro-animations
- Card hover: `translateY(-4~6px)` + shadow, 200–250ms ease.
- Button hover: darken + `translateY(-1px)`.
- Floating hero cards: `pn-float` keyframes, 6–7s infinite, staggered 1s.
- Success check: `pn-pop` spring-like scale-in.
- Progress rings/bars: animate from 0 on mount (CSS transition or Framer Motion).
- Mobile rails: horizontal scroll, hidden scrollbars, snap optional.
- Skeletons for all React Query loading states; optimistic UI for interest/shortlist/read actions.

## White-label notes
Brand name, logo letter, community strings ("Veluthedathu Nair"), and the color tokens are the only client-specific values — centralize them in a `brand.config.ts` + Tailwind theme so a new client is a config swap.

## Assets
No binary assets included. All photos are drag-and-drop `image-slot` placeholders — production uses real member photos via `next/image`. Icons in mocks are emoji/unicode stand-ins — replace with **lucide-react** (ships with shadcn/ui).

## Files in this bundle
All 31 `.dc.html` design references (15 pages × Desktop/Mobile + `Design System.dc.html`), `image-slot.js` + `support.js` (runtime files needed to open the HTML locally), and `screenshots/` — a numbered PNG of every screen (01–31) for quick visual reference without opening the HTML.
