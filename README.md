# LA CAVE — Champagne & Stripe Checkout

Boutique de champagne haut de gamme construite avec **Next.js 16 (App Router)**,
**React 19**, **Tailwind CSS v4**, **Supabase** et **Stripe Checkout**.

## Fonctionnalités

- **Panier** persistant côté navigateur (`localStorage`) avec tiroir panier, page
  `/panier`, quantités, livraison offerte dès 250 € et suggestions de cuvées.
- **Paiement Stripe Checkout** : la commande est créée en base avant la
  redirection, puis la session Stripe est générée côté serveur. Aucune donnée
  bancaire ne transite par l'application.
- **Commandes enregistrées dans Supabase** (`orders` + `order_items`) avec
  snapshot des cuvées, adresse de livraison, montants et statut de paiement.
- **Webhook Stripe** (`/api/webhooks/stripe`) : validation de signature,
  passage automatique en `paid` / `confirmed`, gestion des paiements asynchrones,
  des échecs et des sessions expirées.
- **Historique par utilisateur** : authentification Supabase (email / mot de
  passe), commandes isolées par RLS (`auth.uid() = user_id`). Les commandes
  invité passées avec la même adresse email vérifiée sont aussi rattachées à
  l'historique.
- **Espace client** : historique, statut de commande, informations personnelles,
  connexion, inscription et déconnexion.
- **Page de succès** `/commande/succes` qui vérifie le paiement auprès de Stripe,
  confirme la commande et vide le panier.

## Démarrage

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Variables d'environnement

Renseigner `.env.local` (voir `.env.example`) :

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publique `anon` (protégée par RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé `service_role`, **serveur uniquement** |
| `STRIPE_SECRET_KEY` | Clé secrète Stripe (`sk_test_...` en développement) |
| `STRIPE_WEBHOOK_SECRET` | Secret du webhook (`whsec_...`) |
| `NEXT_PUBLIC_SITE_URL` | URL publique utilisée pour `success_url` / `cancel_url` |

> La clé `service_role` contourne RLS. Elle n'est utilisée que dans les Route
> Handlers (`/api/checkout`, `/api/checkout/session`, `/api/webhooks/stripe`).

## Base de données Supabase

Le projet Supabase existant utilise un schéma minimal, différent des anciennes
migrations locales (`20261023…` / `20261024114746…`). **N'exécutez pas
`supabase db push`** sur cette base : cela tenterait de rejouer les anciennes
migrations.

Appliquez uniquement la migration compatible, dans le **SQL Editor** du tableau
de bord Supabase :

```text
supabase/migrations/20261027_orders_checkout_compat.sql
```

Le script est idempotent : il peut être rejoué sans risque.

Cette migration est écrite pour le schéma réel du projet, qui est minimal :

```text
orders      (id uuid, user_id uuid, total_amount numeric, status text, created_at)
order_items (id uuid, order_id uuid, product_id uuid, product_name text,
             unit_price numeric, quantity integer)
```

Elle ajoute uniquement ce qui manque :

- sur `orders` : coordonnées client (dont `customer_email`, créée **avant**
  tout index ou politique qui l'utilise), adresse de livraison, montants,
  devise, statut de paiement Stripe, session et PaymentIntent,
  `order_number` lisible, `updated_at` ;
- sur `order_items` : instantané du catalogue (`champagne_slug`, `name`,
  `house`, `vintage`, `image_url`) et `champagne_id` ;
- la clé étrangère `orders.user_id` vers `auth.users` (commandes invité
  autorisées) et `order_items.order_id` vers `orders` ;
- les index (session Stripe, référence de commande, email, dates) ;
- le trigger `updated_at` ;
- les politiques RLS d'isolation par utilisateur et de rattachement des
  commandes invité par email.

Elle ne modifie ni `profiles` ni `champagnes`, qui ne sont pas nécessaires au
tunnel d'achat (le catalogue est statique et l'authentification passe par
`auth.users`).

> `orders.id` étant de type `uuid`, l'application génère un identifiant
> technique et conserve une référence lisible `LC-AAAA-XXXXXXXX` dans
> `orders.order_number`.

### Authentification Supabase

Dans **Authentication > Providers**, activer `Email`. Pour tester rapidement,
désactiver la confirmation d'email (*Confirm email*). Sinon, confirmer l'email
reçu après l'inscription avant de se connecter.

## Webhook Stripe en local

Installer la [Stripe CLI](https://stripe.com/docs/stripe-cli), puis :

```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copier le secret affiché (`whsec_...`) dans `STRIPE_WEBHOOK_SECRET`, redémarrer
`pnpm dev`, puis tester un paiement avec la carte :

```text
4242 4242 4242 4242
Date future, CVC quelconque, code postal quelconque
```

Pour la production, créer un endpoint Stripe vers
`https://votre-domaine/api/webhooks/stripe` et écouter au minimum :

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`
- `checkout.session.async_payment_failed`
- `checkout.session.expired`

## Parcours de commande

1. `/champagnes` → ajout au panier.
2. `/panier` → récapitulatif et quantités.
3. `/checkout` → coordonnées et adresse.
4. `POST /api/checkout` :
   - validation du panier et recalcul des prix côté serveur ;
   - création d'une commande `pending` / `unpaid` dans Supabase ;
   - création de la Checkout Session Stripe ;
   - redirection vers Stripe.
5. Paiement sur Stripe.
6. Retour sur `/commande/succes?session_id=...` : vérification du paiement,
   confirmation de la commande et vidage du panier.
7. Webhook Stripe : mise à jour canonique de la commande (`paid`,
   `confirmed`).
8. `/account` : historique de l'utilisateur connecté.

## Architecture utile

```text
app/
  api/checkout/route.ts              # création commande + session Stripe
  api/checkout/session/route.ts      # vérification de la session au retour
  api/webhooks/stripe/route.ts       # webhook signé Stripe
  commande/succes/page.tsx           # confirmation de commande
  account/page.tsx                   # auth + historique Supabase
  panier/page.tsx                    # panier
  checkout/page.tsx                  # formulaire de paiement
components/cart/CartDrawer.tsx
context/CartContext.tsx
lib/checkout/pricing.ts              # règles livraison / totaux partagées
lib/orders/server.ts                 # écritures commandes (service role)
lib/orders/map.ts                    # mapping Supabase -> modèle UI
lib/payments/stripe.ts               # client Stripe serveur
lib/supabase/                        # clients navigateur / serveur / admin
proxy.ts                             # rafraîchissement de session Supabase
supabase/migrations/                 # schéma + RLS
```

## Commandes

```bash
pnpm dev     # serveur de développement
pnpm build   # build de production + vérification TypeScript
pnpm start   # serveur de production
pnpm lint    # ESLint
```
