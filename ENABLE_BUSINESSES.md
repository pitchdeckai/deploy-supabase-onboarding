# Enable businesses on your platform to accept payments directly

Facilitate direct payments to businesses on your SaaS platform from their own customers.

This guide covers letting your users accept payments, moving a portion of your users’ earnings into your balance, and paying out the remainder to your users’ bank accounts. To illustrate these concepts, we’ll use an example platform that lets businesses build their own online stores.

# Web

> This is a Web for when platform is web. View the full page at https://docs.stripe.com/connect/enable-payment-acceptance-guide?platform=web.

## Prerequisites

### Prerequisites

- [ ] [Register your platform](https://dashboard.stripe.com/connect)

- [ ] Add business details to [activate your account](https://dashboard.stripe.com/account/onboarding)

- [ ] [Complete your platform profile](https://dashboard.stripe.com/connect/settings/profile)

- [ ] [Customise brand settings](https://dashboard.stripe.com/settings/connect/stripe-dashboard/branding)
Add a business name, icon, and brand colour.

## Set up Stripe [Server-side]

Install Stripe’s official libraries so you can access the API from your application:

#### Ruby

```bash
# Available as a gem
sudo gem install stripe
```

```ruby
# If you use bundler, you can add this line to your Gemfile
gem 'stripe'
```

#### Python

```bash
# Install through pip
pip3 install --upgrade stripe
```

```bash
# Or find the Stripe package on http://pypi.python.org/pypi/stripe/
```

```python
# Find the version you want to pin:
# https://github.com/stripe/stripe-python/blob/master/CHANGELOG.md
# Specify that version in your requirements.txt file
stripe>=5.0.0
```

#### PHP

```bash
# Install the PHP library with Composer
composer require stripe/stripe-php
```

```bash
# Or download the source directly: https://github.com/stripe/stripe-php/releases
```

#### Java

```java
/*
  For Gradle, add the following dependency to your build.gradle and replace with
  the version number you want to use from:
  - https://mvnrepository.com/artifact/com.stripe/stripe-java or
  - https://github.com/stripe/stripe-java/releases/latest
*/
implementation "com.stripe:stripe-java:29.0.0"
```

```xml
<!--
  For Maven, add the following dependency to your POM and replace with the
  version number you want to use from:
  - https://mvnrepository.com/artifact/com.stripe/stripe-java or
  - https://github.com/stripe/stripe-java/releases/latest
-->
<dependency>
  <groupId>com.stripe</groupId>
  <artifactId>stripe-java</artifactId>
  <version>29.0.0</version>
</dependency>
```

```bash
# For other environments, manually install the following JARs:
# - The Stripe JAR from https://github.com/stripe/stripe-java/releases/latest
# - Google Gson from https://github.com/google/gson
```

#### Node

```bash
# Install with npm
npm install stripe --save
```

#### Go

```bash
# Make sure your project is using Go Modules
go mod init
# Install stripe-go
go get -u github.com/stripe/stripe-go/v82
```

```go
// Then import the package
import (
  "github.com/stripe/stripe-go/v82"
)
```

#### .NET

```bash
# Install with dotnet
dotnet add package Stripe.net
dotnet restore
```

```bash
# Or install with NuGet
Install-Package Stripe.net
```

## Create a connected account

When a user (seller or service provider) signs up on your platform, create a user [Account](https://docs.stripe.com/api/accounts.md) (referred to as a *connected account*) so you can accept payments and move funds to their bank account. Connected accounts represent your user in Stripe’s API and help facilitate the collection of onboarding requirements so Stripe can verify the user’s identity. In our store builder example, the connected account represents the business setting up their online store.
![Screenshot of Connect Onboarding form](https://b.stripecdn.com/docs-statics-srv/assets/Kavholm-Seamless-Standard.78b64d90c0bf87130c8b6ba1ef53df7f.png)

### Create a connected account and prefill information

Use the `/v1/accounts` API to [create](https://docs.stripe.com/api/accounts/create.md) a connected account. You can create the connected account by using the [default connected account parameters](https://docs.stripe.com/connect/migrate-to-controller-properties.md), or by specifying the account type.

#### With default properties

```curl
curl -X POST https://api.stripe.com/v1/accounts \
  -u "<<YOUR_SECRET_KEY>>:"
```

```cli
stripe accounts create
```

```ruby
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
Stripe.api_key = '<<YOUR_SECRET_KEY>>'

account = Stripe::Account.create()
```

```ruby
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
client = Stripe::StripeClient.new("<<YOUR_SECRET_KEY>>")

account = client.v1.accounts.create()
```

```python
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
import stripe
stripe.api_key = "<<YOUR_SECRET_KEY>>"

account = stripe.Account.create()
```

```python
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
client = StripeClient("<<YOUR_SECRET_KEY>>")

account = client.accounts.create()
```

```php
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
$stripe = new \Stripe\StripeClient('<<YOUR_SECRET_KEY>>');

$account = $stripe->accounts->create([]);
```

```java
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
Stripe.apiKey = "<<YOUR_SECRET_KEY>>";

AccountCreateParams params = AccountCreateParams.builder().build();

Account account = Account.create(params);
```

```java
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeClient client = new StripeClient("<<YOUR_SECRET_KEY>>");

AccountCreateParams params = AccountCreateParams.builder().build();

Account account = client.accounts().create(params);
```

```node
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = require('stripe')('<<YOUR_SECRET_KEY>>');

const account = await stripe.accounts.create();
```

```go
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
stripe.Key = "<<YOUR_SECRET_KEY>>"

params := &stripe.AccountParams{}
result, err := account.New(params)
```

```go
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
sc := stripe.NewClient("<<YOUR_SECRET_KEY>>")
params := &stripe.AccountCreateParams{}
result, err := sc.V1Accounts.Create(context.TODO(), params)
```

```dotnet
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeConfiguration.ApiKey = "<<YOUR_SECRET_KEY>>";

var options = new AccountCreateOptions();
var service = new AccountService();
Account account = service.Create(options);
```

```dotnet
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
var options = new AccountCreateOptions();
var client = new StripeClient("<<YOUR_SECRET_KEY>>");
var service = client.V1.Accounts;
Account account = service.Create(options);
```

#### With account type

```curl
curl https://api.stripe.com/v1/accounts \
  -u "<<YOUR_SECRET_KEY>>:" \
  -d type=standard
```

```cli
stripe accounts create  \
  --type=standard
```

```ruby
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
Stripe.api_key = '<<YOUR_SECRET_KEY>>'

account = Stripe::Account.create({type: 'standard'})
```

```ruby
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
client = Stripe::StripeClient.new("<<YOUR_SECRET_KEY>>")

account = client.v1.accounts.create({type: 'standard'})
```

```python
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
import stripe
stripe.api_key = "<<YOUR_SECRET_KEY>>"

account = stripe.Account.create(type="standard")
```

```python
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
client = StripeClient("<<YOUR_SECRET_KEY>>")

account = client.accounts.create({"type": "standard"})
```

```php
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
$stripe = new \Stripe\StripeClient('<<YOUR_SECRET_KEY>>');

$account = $stripe->accounts->create(['type' => 'standard']);
```

```java
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
Stripe.apiKey = "<<YOUR_SECRET_KEY>>";

AccountCreateParams params =
  AccountCreateParams.builder().setType(AccountCreateParams.Type.STANDARD).build();

Account account = Account.create(params);
```

```java
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeClient client = new StripeClient("<<YOUR_SECRET_KEY>>");

AccountCreateParams params =
  AccountCreateParams.builder().setType(AccountCreateParams.Type.STANDARD).build();

Account account = client.accounts().create(params);
```

```node
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = require('stripe')('<<YOUR_SECRET_KEY>>');

const account = await stripe.accounts.create({
  type: 'standard',
});
```

```go
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
stripe.Key = "<<YOUR_SECRET_KEY>>"

params := &stripe.AccountParams{Type: stripe.String(stripe.AccountTypeStandard)}
result, err := account.New(params)
```

```go
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
sc := stripe.NewClient("<<YOUR_SECRET_KEY>>")
params := &stripe.AccountCreateParams{Type: stripe.String(stripe.AccountTypeStandard)}
result, err := sc.V1Accounts.Create(context.TODO(), params)
```

```dotnet
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeConfiguration.ApiKey = "<<YOUR_SECRET_KEY>>";

var options = new AccountCreateOptions { Type = "standard" };
var service = new AccountService();
Account account = service.Create(options);
```

```dotnet
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
var options = new AccountCreateOptions { Type = "standard" };
var client = new StripeClient("<<YOUR_SECRET_KEY>>");
var service = client.V1.Accounts;
Account account = service.Create(options);
```

If you’ve already collected information for your connected accounts, you can pre-fill that information on the `Account` object. You can pre-fill any account information, including personal and business information, external account information, and so on.

Connect Onboarding doesn’t ask for the prefilled information. However, it does ask the account holder to confirm the prefilled information before accepting the [Connect service agreement](https://docs.stripe.com/connect/service-agreement-types.md).

When testing your integration, prefill account information using [test data](https://docs.stripe.com/connect/testing.md).

### Create an account link

You can create an account link by calling the [Account Links](https://docs.stripe.com/api/account_links.md) API with the following parameters:

- `account`
- `refresh_url`
- `return_url`
- `type` = `account_onboarding`

```curl
curl https://api.stripe.com/v1/account_links \
  -u "<<YOUR_SECRET_KEY>>:" \
  -d account="{{CONNECTEDACCOUNT_ID}}" \
  --data-urlencode refresh_url="https://example.com/reauth" \
  --data-urlencode return_url="https://example.com/return" \
  -d type=account_onboarding
```

```cli
stripe account_links create  \
  --account="{{CONNECTEDACCOUNT_ID}}" \
  --refresh-url="https://example.com/reauth" \
  --return-url="https://example.com/return" \
  --type=account_onboarding
```

```ruby
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
Stripe.api_key = '<<YOUR_SECRET_KEY>>'

account_link = Stripe::AccountLink.create({
  account: '{{CONNECTEDACCOUNT_ID}}',
  refresh_url: 'https://example.com/reauth',
  return_url: 'https://example.com/return',
  type: 'account_onboarding',
})
```

```ruby
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
client = Stripe::StripeClient.new("<<YOUR_SECRET_KEY>>")

account_link = client.v1.account_links.create({
  account: '{{CONNECTEDACCOUNT_ID}}',
  refresh_url: 'https://example.com/reauth',
  return_url: 'https://example.com/return',
  type: 'account_onboarding',
})
```

```python
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
import stripe
stripe.api_key = "<<YOUR_SECRET_KEY>>"

account_link = stripe.AccountLink.create(
  account="{{CONNECTEDACCOUNT_ID}}",
  refresh_url="https://example.com/reauth",
  return_url="https://example.com/return",
  type="account_onboarding",
)
```

```python
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
client = StripeClient("<<YOUR_SECRET_KEY>>")

account_link = client.account_links.create({
  "account": "{{CONNECTEDACCOUNT_ID}}",
  "refresh_url": "https://example.com/reauth",
  "return_url": "https://example.com/return",
  "type": "account_onboarding",
})
```

```php
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
$stripe = new \Stripe\StripeClient('<<YOUR_SECRET_KEY>>');

$accountLink = $stripe->accountLinks->create([
  'account' => '{{CONNECTEDACCOUNT_ID}}',
  'refresh_url' => 'https://example.com/reauth',
  'return_url' => 'https://example.com/return',
  'type' => 'account_onboarding',
]);
```

```java
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
Stripe.apiKey = "<<YOUR_SECRET_KEY>>";

AccountLinkCreateParams params =
  AccountLinkCreateParams.builder()
    .setAccount("{{CONNECTEDACCOUNT_ID}}")
    .setRefreshUrl("https://example.com/reauth")
    .setReturnUrl("https://example.com/return")
    .setType(AccountLinkCreateParams.Type.ACCOUNT_ONBOARDING)
    .build();

AccountLink accountLink = AccountLink.create(params);
```

```java
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeClient client = new StripeClient("<<YOUR_SECRET_KEY>>");

AccountLinkCreateParams params =
  AccountLinkCreateParams.builder()
    .setAccount("{{CONNECTEDACCOUNT_ID}}")
    .setRefreshUrl("https://example.com/reauth")
    .setReturnUrl("https://example.com/return")
    .setType(AccountLinkCreateParams.Type.ACCOUNT_ONBOARDING)
    .build();

AccountLink accountLink = client.accountLinks().create(params);
```

```node
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = require('stripe')('<<YOUR_SECRET_KEY>>');

const accountLink = await stripe.accountLinks.create({
  account: '{{CONNECTEDACCOUNT_ID}}',
  refresh_url: 'https://example.com/reauth',
  return_url: 'https://example.com/return',
  type: 'account_onboarding',
});
```

```go
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
stripe.Key = "<<YOUR_SECRET_KEY>>"

params := &stripe.AccountLinkParams{
  Account: stripe.String("{{CONNECTEDACCOUNT_ID}}"),
  RefreshURL: stripe.String("https://example.com/reauth"),
  ReturnURL: stripe.String("https://example.com/return"),
  Type: stripe.String("account_onboarding"),
}
result, err := accountlink.New(params)
```

```go
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
sc := stripe.NewClient("<<YOUR_SECRET_KEY>>")
params := &stripe.AccountLinkCreateParams{
  Account: stripe.String("{{CONNECTEDACCOUNT_ID}}"),
  RefreshURL: stripe.String("https://example.com/reauth"),
  ReturnURL: stripe.String("https://example.com/return"),
  Type: stripe.String("account_onboarding"),
}
result, err := sc.V1AccountLinks.Create(context.TODO(), params)
```

```dotnet
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeConfiguration.ApiKey = "<<YOUR_SECRET_KEY>>";

var options = new AccountLinkCreateOptions
{
    Account = "{{CONNECTEDACCOUNT_ID}}",
    RefreshUrl = "https://example.com/reauth",
    ReturnUrl = "https://example.com/return",
    Type = "account_onboarding",
};
var service = new AccountLinkService();
AccountLink accountLink = service.Create(options);
```

```dotnet
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
var options = new AccountLinkCreateOptions
{
    Account = "{{CONNECTEDACCOUNT_ID}}",
    RefreshUrl = "https://example.com/reauth",
    ReturnUrl = "https://example.com/return",
    Type = "account_onboarding",
};
var client = new StripeClient("<<YOUR_SECRET_KEY>>");
var service = client.V1.AccountLinks;
AccountLink accountLink = service.Create(options);
```

### Redirect your user to the account link URL

The response to your [Account Links](https://docs.stripe.com/api/account_links.md) request includes a value for the key `url`. Redirect to this link to send your user into the flow. Account Links are temporary and are single-use only because they grant access to the connected account user’s personal information. Authenticate the user in your application before redirecting them to this URL. If you want to prefill information, you must do so before generating the account link. After you create the account link, you won’t be able to read or write information for the account.

> Don’t email, text, or otherwise send account link URLs outside your platform application. Instead, provide them to the authenticated account holder within your application.

### Handle the user returning to your platform

Connect Onboarding requires you to pass both a `return_url` and `refresh_url` to handle all cases where the user is redirected to your platform. It’s important that you implement these correctly to provide the best experience for your user.

> You can use HTTP for your `return_url` and `refresh_url` while you’re in a testing environment (for example, to test with localhost), but live mode only accepts HTTPS. Be sure to swap testing URLs for HTTPS URLs before going live.

#### return_url

Stripe issues a redirect to this URL when the user completes the Connect Onboarding flow. This doesn’t mean that all information has been collected or that there are no outstanding requirements on the account. This only means the flow was entered and exited properly.

No state is passed through this URL. After a user is redirected to your `return_url`, check the state of the `details_submitted` parameter on their account by doing either of the following:

- Listening to `account.updated` webhooks
- Calling the [Accounts](https://docs.stripe.com/api/accounts.md) API and inspecting the returned object

#### refresh_url

Your user is redirected to the `refresh_url` in these cases:

- The link has expired (a few minutes have passed since the link was created)
- The user already visited the link (the user refreshed the page or clicked back or forward in the browser)
- Your platform is no longer able to access the account
- The account has been rejected

Your `refresh_url` should trigger a method on your server to call [Account Links](https://docs.stripe.com/api/account_links.md) again with the same parameters, and redirect the user to the Connect Onboarding flow to create a seamless experience.

### Handle users that haven’t completed onboarding

If a user is redirected to your `return_url`, they might not have completed the onboarding process. Use the `/v1/accounts` endpoint to retrieve the user’s account and check for `charges_enabled`. If the account isn’t fully onboarded, provide UI prompts to allow the user to continue onboarding later. The user can complete their account activation through a new account link (generated by your integration). To see if they’ve completed the onboarding process, check the state of the `details_submitted` parameter on their account.

## Enable payment methods

View your [payment methods settings](https://dashboard.stripe.com/settings/connect/payment_methods) and enable the payment methods you want to support. Card payments are enabled by default but you can enable and disable payment methods as needed. This guide assumes Bancontact, credit cards, EPS, iDEAL, Przelewy24, SEPA Direct Debit, and Sofort are enabled.

Before the payment form is displayed, Stripe evaluates the currency, payment method restrictions, and other parameters to determine the list of supported payment methods. Payment methods that increase conversion and that are most relevant to the currency and customer’s location are prioritised. Lower priority payment methods are hidden in an overflow menu.

> The **embedded payment method settings component** allows connected accounts to configure the payment methods they offer at checkout without the need to access the Stripe Dashboard. [Request access](https://docs.stripe.com/connect/supported-embedded-components/payment-method-settings.md#request-access) and learn how to [integrate with Payment Method Configurations](https://docs.stripe.com/connect/supported-embedded-components/payment-method-settings.md#integration).

## Accept a payment

Embed [Stripe Checkout](https://stripe.com/payments/checkout) as a payment form directly on your website or redirect users to a Stripe-hosted page to accept payments. Checkout supports multiple payment methods and automatically shows the most relevant ones to your customer. You can also use the Payment Element, a prebuilt UI component that is embedded as an iframe in your payment form, to accept multiple payment methods with a single front end integration.

#### Stripe-hosted page

### Create a Checkout Session  (Client-side) (Server-side)

A Checkout Session controls what your customer sees in the embeddable payment form such as line items, the order amount and currency, and acceptable payment methods. When performing direct charges, Checkout uses the connected account’s branding settings. See the [Customise branding](https://docs.stripe.com/connect/direct-charges.md?platform=web&ui=stripe-hosted#branding) section for more information.

Unlike destination charges and separate charges and transfers, users (connected accounts) are responsible for handling disputes on direct charges – it’s not the responsibility of the platform.

On your server, make the following call to the Stripe API. After creating a Checkout Session, redirect your customer to the [URL](https://docs.stripe.com/api/checkout/sessions/object.md#checkout_session_object-url) returned in the response.

```curl
curl https://api.stripe.com/v1/checkout/sessions \
  -u "<<YOUR_SECRET_KEY>>:" \
  -H "Stripe-Account: {{CONNECTEDACCOUNT_ID}}" \
  -d mode=payment \
  -d "line_items[0][price]"="{{PRICE_ID}}" \
  -d "line_items[0][quantity]"=1 \
  -d "payment_intent_data[application_fee_amount]"=123 \
  --data-urlencode success_url="https://example.com/success" \
  --data-urlencode cancel_url="https://example.com/cancel"
```

```cli
stripe checkout sessions create  \
  --stripe-account {{CONNECTEDACCOUNT_ID}} \
  --mode=payment \
  -d "line_items[0][price]"="{{PRICE_ID}}" \
  -d "line_items[0][quantity]"=1 \
  -d "payment_intent_data[application_fee_amount]"=123 \
  --success-url="https://example.com/success" \
  --cancel-url="https://example.com/cancel"
```

```ruby
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
Stripe.api_key = '<<YOUR_SECRET_KEY>>'

session = Stripe::Checkout::Session.create(
  {
    mode: 'payment',
    line_items: [
      {
        price: '{{PRICE_ID}}',
        quantity: 1,
      },
    ],
    payment_intent_data: {application_fee_amount: 123},
    success_url: 'https://example.com/success',
    cancel_url: 'https://example.com/cancel',
  },
  {stripe_account: '{{CONNECTEDACCOUNT_ID}}'},
)
```

```ruby
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
client = Stripe::StripeClient.new("<<YOUR_SECRET_KEY>>")

session = client.v1.checkout.sessions.create(
  {
    mode: 'payment',
    line_items: [
      {
        price: '{{PRICE_ID}}',
        quantity: 1,
      },
    ],
    payment_intent_data: {application_fee_amount: 123},
    success_url: 'https://example.com/success',
    cancel_url: 'https://example.com/cancel',
  },
  {stripe_account: '{{CONNECTEDACCOUNT_ID}}'},
)
```

```python
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
import stripe
stripe.api_key = "<<YOUR_SECRET_KEY>>"

session = stripe.checkout.Session.create(
  mode="payment",
  line_items=[{"price": "{{PRICE_ID}}", "quantity": 1}],
  payment_intent_data={"application_fee_amount": 123},
  success_url="https://example.com/success",
  cancel_url="https://example.com/cancel",
  stripe_account="{{CONNECTEDACCOUNT_ID}}",
)
```

```python
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
client = StripeClient("<<YOUR_SECRET_KEY>>")

session = client.checkout.sessions.create(
  {
    "mode": "payment",
    "line_items": [{"price": "{{PRICE_ID}}", "quantity": 1}],
    "payment_intent_data": {"application_fee_amount": 123},
    "success_url": "https://example.com/success",
    "cancel_url": "https://example.com/cancel",
  },
  {"stripe_account": "{{CONNECTEDACCOUNT_ID}}"},
)
```

```php
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
$stripe = new \Stripe\StripeClient('<<YOUR_SECRET_KEY>>');

$session = $stripe->checkout->sessions->create(
  [
    'mode' => 'payment',
    'line_items' => [
      [
        'price' => '{{PRICE_ID}}',
        'quantity' => 1,
      ],
    ],
    'payment_intent_data' => ['application_fee_amount' => 123],
    'success_url' => 'https://example.com/success',
    'cancel_url' => 'https://example.com/cancel',
  ],
  ['stripe_account' => '{{CONNECTEDACCOUNT_ID}}']
);
```

```java
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
Stripe.apiKey = "<<YOUR_SECRET_KEY>>";

SessionCreateParams params =
  SessionCreateParams.builder()
    .setMode(SessionCreateParams.Mode.PAYMENT)
    .addLineItem(
      SessionCreateParams.LineItem.builder()
        .setPrice("{{PRICE_ID}}")
        .setQuantity(1L)
        .build()
    )
    .setPaymentIntentData(
      SessionCreateParams.PaymentIntentData.builder()
        .setApplicationFeeAmount(123L)
        .build()
    )
    .setSuccessUrl("https://example.com/success")
    .setCancelUrl("https://example.com/cancel")
    .build();

RequestOptions requestOptions =
  RequestOptions.builder().setStripeAccount("{{CONNECTEDACCOUNT_ID}}").build();

Session session = Session.create(params, requestOptions);
```

```java
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeClient client = new StripeClient("<<YOUR_SECRET_KEY>>");

SessionCreateParams params =
  SessionCreateParams.builder()
    .setMode(SessionCreateParams.Mode.PAYMENT)
    .addLineItem(
      SessionCreateParams.LineItem.builder()
        .setPrice("{{PRICE_ID}}")
        .setQuantity(1L)
        .build()
    )
    .setPaymentIntentData(
      SessionCreateParams.PaymentIntentData.builder()
        .setApplicationFeeAmount(123L)
        .build()
    )
    .setSuccessUrl("https://example.com/success")
    .setCancelUrl("https://example.com/cancel")
    .build();

RequestOptions requestOptions =
  RequestOptions.builder().setStripeAccount("{{CONNECTEDACCOUNT_ID}}").build();

Session session = client.checkout().sessions().create(params, requestOptions);
```

```node
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = require('stripe')('<<YOUR_SECRET_KEY>>');

const session = await stripe.checkout.sessions.create(
  {
    mode: 'payment',
    line_items: [
      {
        price: '{{PRICE_ID}}',
        quantity: 1,
      },
    ],
    payment_intent_data: {
      application_fee_amount: 123,
    },
    success_url: 'https://example.com/success',
    cancel_url: 'https://example.com/cancel',
  },
  {
    stripeAccount: '{{CONNECTEDACCOUNT_ID}}',
  }
);
```

```go
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
stripe.Key = "<<YOUR_SECRET_KEY>>"

params := &stripe.CheckoutSessionParams{
  Mode: stripe.String(stripe.CheckoutSessionModePayment),
  LineItems: []*stripe.CheckoutSessionLineItemParams{
    &stripe.CheckoutSessionLineItemParams{
      Price: stripe.String("{{PRICE_ID}}"),
      Quantity: stripe.Int64(1),
    },
  },
  PaymentIntentData: &stripe.CheckoutSessionPaymentIntentDataParams{
    ApplicationFeeAmount: stripe.Int64(123),
  },
  SuccessURL: stripe.String("https://example.com/success"),
  CancelURL: stripe.String("https://example.com/cancel"),
}
params.SetStripeAccount("{{CONNECTEDACCOUNT_ID}}")
result, err := session.New(params)
```

```go
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
sc := stripe.NewClient("<<YOUR_SECRET_KEY>>")
params := &stripe.CheckoutSessionCreateParams{
  Mode: stripe.String(stripe.CheckoutSessionModePayment),
  LineItems: []*stripe.CheckoutSessionCreateLineItemParams{
    &stripe.CheckoutSessionCreateLineItemParams{
      Price: stripe.String("{{PRICE_ID}}"),
      Quantity: stripe.Int64(1),
    },
  },
  PaymentIntentData: &stripe.CheckoutSessionCreatePaymentIntentDataParams{
    ApplicationFeeAmount: stripe.Int64(123),
  },
  SuccessURL: stripe.String("https://example.com/success"),
  CancelURL: stripe.String("https://example.com/cancel"),
}
params.SetStripeAccount("{{CONNECTEDACCOUNT_ID}}")
result, err := sc.V1CheckoutSessions.Create(context.TODO(), params)
```

```dotnet
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeConfiguration.ApiKey = "<<YOUR_SECRET_KEY>>";

var options = new Stripe.Checkout.SessionCreateOptions
{
    Mode = "payment",
    LineItems = new List<Stripe.Checkout.SessionLineItemOptions>
    {
        new Stripe.Checkout.SessionLineItemOptions
        {
            Price = "{{PRICE_ID}}",
            Quantity = 1,
        },
    },
    PaymentIntentData = new Stripe.Checkout.SessionPaymentIntentDataOptions
    {
        ApplicationFeeAmount = 123,
    },
    SuccessUrl = "https://example.com/success",
    CancelUrl = "https://example.com/cancel",
};
var requestOptions = new RequestOptions
{
    StripeAccount = "{{CONNECTEDACCOUNT_ID}}",
};
var service = new Stripe.Checkout.SessionService();
Stripe.Checkout.Session session = service.Create(options, requestOptions);
```

```dotnet
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
var options = new Stripe.Checkout.SessionCreateOptions
{
    Mode = "payment",
    LineItems = new List<Stripe.Checkout.SessionLineItemOptions>
    {
        new Stripe.Checkout.SessionLineItemOptions
        {
            Price = "{{PRICE_ID}}",
            Quantity = 1,
        },
    },
    PaymentIntentData = new Stripe.Checkout.SessionPaymentIntentDataOptions
    {
        ApplicationFeeAmount = 123,
    },
    SuccessUrl = "https://example.com/success",
    CancelUrl = "https://example.com/cancel",
};
var requestOptions = new RequestOptions
{
    StripeAccount = "{{CONNECTEDACCOUNT_ID}}",
};
var client = new StripeClient("<<YOUR_SECRET_KEY>>");
var service = client.V1.Checkout.Sessions;
Stripe.Checkout.Session session = service.Create(options, requestOptions);
```

- `line_items` - This argument represents items that your customer is purchasing and that will show up in the hosted user interface.
- `success_url` - This argument redirects a user after they complete a payment.
- `cancel_url` - This argument redirects a user after they click ‘Cancel’.
- `Stripe-Account` – This header indicates a [direct charge](https://docs.stripe.com/connect/direct-charges.md) for your connected account. With direct charges, the connected account is responsible for Stripe fees, refunds, and chargebacks. The connected account’s branding is used in Checkout, which allows their customers to feel like they’re interacting directly with the merchant instead of your platform.
- (Optional) `payment_intent_data[application_fee_amount]` - This argument specifies the amount your platform plans to take from the transaction. After the payment is processed on the connected account, the `application_fee_amount` is transferred to the platform and the Stripe fee is deducted from the connected account’s balance.
![Account creation flow](https://b.stripecdn.com/docs-statics-srv/assets/direct_charges.a2a8b68037ac95fe22140d6dde9740d3.svg)

### Handle post-payment events  (Server-side)

Stripe sends a [checkout.session.completed](https://docs.stripe.com/api/events/types.md#event_types-checkout.session.completed) event when the payment completes. [Use a webhook to receive these events](https://docs.stripe.com/webhooks/quickstart.md) and run actions, such as sending an order confirmation email to your customer, logging the sale in a database, or starting a shipping workflow.

Listen for these events rather than waiting on a callback from the client. On the client, the customer could close the browser window or quit the app before the callback executes. Some payment methods also take 2-14 days for payment confirmation. Setting up your integration to listen for asynchronous events enables you to accept multiple [payment methods](https://stripe.com/payments/payment-methods-guide) with a single integration.

In addition to handling the `checkout.session.completed` event, we recommend handling two other events when collecting payments with Checkout:

| Event                                                                                                                                        | Description                                                                           | Next steps                                                        |
| -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| [checkout.session.completed](https://docs.stripe.com/api/events/types.md#event_types-checkout.session.completed)                             | The customer has successfully authorised the payment by submitting the Checkout form. | Wait for the payment to succeed or fail.                          |
| [checkout.session.async_payment_succeeded](https://docs.stripe.com/api/events/types.md#event_types-checkout.session.async_payment_succeeded) | The customer’s payment succeeded.                                                     | Fulfil the purchased goods or services.                           |
| [checkout.session.async_payment_failed](https://docs.stripe.com/api/events/types.md#event_types-checkout.session.async_payment_failed)       | The payment was declined, or failed for some other reason.                            | Contact the customer via email and ask them to place a new order. |

These events all include the [Checkout Session](https://docs.stripe.com/api/checkout/sessions.md) object. After the payment succeeds, the underlying *PaymentIntent* (The Payment Intents API tracks the lifecycle of a customer checkout flow and triggers additional authentication steps when required by regulatory mandates, custom Radar fraud rules, or redirect-based payment methods) status changes from `processing` to `succeeded`.

#### Embedded form

### Create a Checkout Session  (Client-side) (Server-side)

A Checkout Session controls what your customer sees in the Stripe-hosted payment page such as line items, the order amount and currency, and acceptable payment methods. When performing direct charges, Checkout uses the connected account’s branding settings. See the [Customise branding](https://docs.stripe.com/connect/direct-charges.md?platform=web&ui=stripe-hosted#branding) section for more information.

Unlike destination charges and separate charges and transfers, users (connected accounts) are responsible for handling disputes on direct charges – it’s not the responsibility of the platform. On your server, make the following call to the Stripe API. The Checkout Session creation response includes a `client_secret`, which you’ll use in the next step to mount Checkout.

```curl
curl https://api.stripe.com/v1/checkout/sessions \
  -u "<<YOUR_SECRET_KEY>>:" \
  -H "Stripe-Account: {{CONNECTEDACCOUNT_ID}}" \
  -d mode=payment \
  -d "line_items[0][price]"="{{PRICE_ID}}" \
  -d "line_items[0][quantity]"=1 \
  -d "payment_intent_data[application_fee_amount]"=123 \
  -d ui_mode=embedded \
  --data-urlencode return_url="https://example.com/checkout/return?session_id={CHECKOUT_SESSION_ID}"
```

```cli
stripe checkout sessions create  \
  --stripe-account {{CONNECTEDACCOUNT_ID}} \
  --mode=payment \
  -d "line_items[0][price]"="{{PRICE_ID}}" \
  -d "line_items[0][quantity]"=1 \
  -d "payment_intent_data[application_fee_amount]"=123 \
  --ui-mode=embedded \
  --return-url="https://example.com/checkout/return?session_id={CHECKOUT_SESSION_ID}"
```

```ruby
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
Stripe.api_key = '<<YOUR_SECRET_KEY>>'

session = Stripe::Checkout::Session.create(
  {
    mode: 'payment',
    line_items: [
      {
        price: '{{PRICE_ID}}',
        quantity: 1,
      },
    ],
    payment_intent_data: {application_fee_amount: 123},
    ui_mode: 'embedded',
    return_url: 'https://example.com/checkout/return?session_id={CHECKOUT_SESSION_ID}',
  },
  {stripe_account: '{{CONNECTEDACCOUNT_ID}}'},
)
```

```ruby
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
client = Stripe::StripeClient.new("<<YOUR_SECRET_KEY>>")

session = client.v1.checkout.sessions.create(
  {
    mode: 'payment',
    line_items: [
      {
        price: '{{PRICE_ID}}',
        quantity: 1,
      },
    ],
    payment_intent_data: {application_fee_amount: 123},
    ui_mode: 'embedded',
    return_url: 'https://example.com/checkout/return?session_id={CHECKOUT_SESSION_ID}',
  },
  {stripe_account: '{{CONNECTEDACCOUNT_ID}}'},
)
```

```python
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
import stripe
stripe.api_key = "<<YOUR_SECRET_KEY>>"

session = stripe.checkout.Session.create(
  mode="payment",
  line_items=[{"price": "{{PRICE_ID}}", "quantity": 1}],
  payment_intent_data={"application_fee_amount": 123},
  ui_mode="embedded",
  return_url="https://example.com/checkout/return?session_id={CHECKOUT_SESSION_ID}",
  stripe_account="{{CONNECTEDACCOUNT_ID}}",
)
```

```python
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
client = StripeClient("<<YOUR_SECRET_KEY>>")

session = client.checkout.sessions.create(
  {
    "mode": "payment",
    "line_items": [{"price": "{{PRICE_ID}}", "quantity": 1}],
    "payment_intent_data": {"application_fee_amount": 123},
    "ui_mode": "embedded",
    "return_url": "https://example.com/checkout/return?session_id={CHECKOUT_SESSION_ID}",
  },
  {"stripe_account": "{{CONNECTEDACCOUNT_ID}}"},
)
```

```php
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
$stripe = new \Stripe\StripeClient('<<YOUR_SECRET_KEY>>');

$session = $stripe->checkout->sessions->create(
  [
    'mode' => 'payment',
    'line_items' => [
      [
        'price' => '{{PRICE_ID}}',
        'quantity' => 1,
      ],
    ],
    'payment_intent_data' => ['application_fee_amount' => 123],
    'ui_mode' => 'embedded',
    'return_url' => 'https://example.com/checkout/return?session_id={CHECKOUT_SESSION_ID}',
  ],
  ['stripe_account' => '{{CONNECTEDACCOUNT_ID}}']
);
```

```java
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
Stripe.apiKey = "<<YOUR_SECRET_KEY>>";

SessionCreateParams params =
  SessionCreateParams.builder()
    .setMode(SessionCreateParams.Mode.PAYMENT)
    .addLineItem(
      SessionCreateParams.LineItem.builder()
        .setPrice("{{PRICE_ID}}")
        .setQuantity(1L)
        .build()
    )
    .setPaymentIntentData(
      SessionCreateParams.PaymentIntentData.builder()
        .setApplicationFeeAmount(123L)
        .build()
    )
    .setUiMode(SessionCreateParams.UiMode.EMBEDDED)
    .setReturnUrl("https://example.com/checkout/return?session_id={CHECKOUT_SESSION_ID}")
    .build();

RequestOptions requestOptions =
  RequestOptions.builder().setStripeAccount("{{CONNECTEDACCOUNT_ID}}").build();

Session session = Session.create(params, requestOptions);
```

```java
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeClient client = new StripeClient("<<YOUR_SECRET_KEY>>");

SessionCreateParams params =
  SessionCreateParams.builder()
    .setMode(SessionCreateParams.Mode.PAYMENT)
    .addLineItem(
      SessionCreateParams.LineItem.builder()
        .setPrice("{{PRICE_ID}}")
        .setQuantity(1L)
        .build()
    )
    .setPaymentIntentData(
      SessionCreateParams.PaymentIntentData.builder()
        .setApplicationFeeAmount(123L)
        .build()
    )
    .setUiMode(SessionCreateParams.UiMode.EMBEDDED)
    .setReturnUrl("https://example.com/checkout/return?session_id={CHECKOUT_SESSION_ID}")
    .build();

RequestOptions requestOptions =
  RequestOptions.builder().setStripeAccount("{{CONNECTEDACCOUNT_ID}}").build();

Session session = client.checkout().sessions().create(params, requestOptions);
```

```node
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = require('stripe')('<<YOUR_SECRET_KEY>>');

const session = await stripe.checkout.sessions.create(
  {
    mode: 'payment',
    line_items: [
      {
        price: '{{PRICE_ID}}',
        quantity: 1,
      },
    ],
    payment_intent_data: {
      application_fee_amount: 123,
    },
    ui_mode: 'embedded',
    return_url: 'https://example.com/checkout/return?session_id={CHECKOUT_SESSION_ID}',
  },
  {
    stripeAccount: '{{CONNECTEDACCOUNT_ID}}',
  }
);
```

```go
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
stripe.Key = "<<YOUR_SECRET_KEY>>"

params := &stripe.CheckoutSessionParams{
  Mode: stripe.String(stripe.CheckoutSessionModePayment),
  LineItems: []*stripe.CheckoutSessionLineItemParams{
    &stripe.CheckoutSessionLineItemParams{
      Price: stripe.String("{{PRICE_ID}}"),
      Quantity: stripe.Int64(1),
    },
  },
  PaymentIntentData: &stripe.CheckoutSessionPaymentIntentDataParams{
    ApplicationFeeAmount: stripe.Int64(123),
  },
  UIMode: stripe.String(stripe.CheckoutSessionUIModeEmbedded),
  ReturnURL: stripe.String("https://example.com/checkout/return?session_id={CHECKOUT_SESSION_ID}"),
}
params.SetStripeAccount("{{CONNECTEDACCOUNT_ID}}")
result, err := session.New(params)
```

```go
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
sc := stripe.NewClient("<<YOUR_SECRET_KEY>>")
params := &stripe.CheckoutSessionCreateParams{
  Mode: stripe.String(stripe.CheckoutSessionModePayment),
  LineItems: []*stripe.CheckoutSessionCreateLineItemParams{
    &stripe.CheckoutSessionCreateLineItemParams{
      Price: stripe.String("{{PRICE_ID}}"),
      Quantity: stripe.Int64(1),
    },
  },
  PaymentIntentData: &stripe.CheckoutSessionCreatePaymentIntentDataParams{
    ApplicationFeeAmount: stripe.Int64(123),
  },
  UIMode: stripe.String(stripe.CheckoutSessionUIModeEmbedded),
  ReturnURL: stripe.String("https://example.com/checkout/return?session_id={CHECKOUT_SESSION_ID}"),
}
params.SetStripeAccount("{{CONNECTEDACCOUNT_ID}}")
result, err := sc.V1CheckoutSessions.Create(context.TODO(), params)
```

```dotnet
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeConfiguration.ApiKey = "<<YOUR_SECRET_KEY>>";

var options = new Stripe.Checkout.SessionCreateOptions
{
    Mode = "payment",
    LineItems = new List<Stripe.Checkout.SessionLineItemOptions>
    {
        new Stripe.Checkout.SessionLineItemOptions
        {
            Price = "{{PRICE_ID}}",
            Quantity = 1,
        },
    },
    PaymentIntentData = new Stripe.Checkout.SessionPaymentIntentDataOptions
    {
        ApplicationFeeAmount = 123,
    },
    UiMode = "embedded",
    ReturnUrl = "https://example.com/checkout/return?session_id={CHECKOUT_SESSION_ID}",
};
var requestOptions = new RequestOptions
{
    StripeAccount = "{{CONNECTEDACCOUNT_ID}}",
};
var service = new Stripe.Checkout.SessionService();
Stripe.Checkout.Session session = service.Create(options, requestOptions);
```

```dotnet
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
var options = new Stripe.Checkout.SessionCreateOptions
{
    Mode = "payment",
    LineItems = new List<Stripe.Checkout.SessionLineItemOptions>
    {
        new Stripe.Checkout.SessionLineItemOptions
        {
            Price = "{{PRICE_ID}}",
            Quantity = 1,
        },
    },
    PaymentIntentData = new Stripe.Checkout.SessionPaymentIntentDataOptions
    {
        ApplicationFeeAmount = 123,
    },
    UiMode = "embedded",
    ReturnUrl = "https://example.com/checkout/return?session_id={CHECKOUT_SESSION_ID}",
};
var requestOptions = new RequestOptions
{
    StripeAccount = "{{CONNECTEDACCOUNT_ID}}",
};
var client = new StripeClient("<<YOUR_SECRET_KEY>>");
var service = client.V1.Checkout.Sessions;
Stripe.Checkout.Session session = service.Create(options, requestOptions);
```

- `line_items` - This argument represents the items your customer is purchasing, which will appear in the hosted user interface.
- `return_url` - This argument redirects a user after they complete a payment attempt.
- `Stripe-Account` – This header indicates a [direct charge](https://docs.stripe.com/connect/direct-charges.md) for your connected account. With direct charges, the connected account is responsible for Stripe fees, refunds, and chargebacks. The connected account’s branding is used in Checkout, which allows their customers to feel like they’re interacting directly with the merchant instead of your platform.
- (Optional) `payment_intent_data[application_fee_amount]` - This argument specifies the amount your platform plans to take from the transaction. If you’re using Stripe’s [Platform Pricing Tool](https://docs.stripe.com/connect/platform-pricing-tools.md) to manage application fee pricing from the [Dashboard](https://dashboard.stripe.com/test/settings/connect/platform_pricing/payments), don’t include this argument as it’ll override any pricing logic set by the tool. After processing the payment on the connected account, the `application_fee_amount` transfers to the platform, and the Stripe fee is deducted from the connected account’s balance.

Make sure the `return_url` corresponds to a page on your website that provides the status of the payment. When Stripe redirects the customer to the `return_url`, we replace the `{CHECKOUT_SESSION_ID}` string with the Checkout Session ID. Use this to retrieve the Checkout Session and inspect the status to decide what to show your customers. You can also append your own query parameters when providing the `return_url`, which persist through the redirect process.
![Account creation flow](https://b.stripecdn.com/docs-statics-srv/assets/direct_charges.a2a8b68037ac95fe22140d6dde9740d3.svg)

### Mount Checkout   (Client-side)

#### HTML + JS

Checkout is available as part of [Stripe.js](https://docs.stripe.com/js.md). Include the Stripe.js script on your page by adding it to the head of your HTML file. Next, create an empty DOM node (container) to use for mounting.

```html
<head>
  <script src="https://js.stripe.com/basil/stripe.js"></script>
</head>
<body>
  <div id="checkout">
    <!-- Checkout will insert the payment form here -->
  </div>
</body>
```

Initialise Stripe.js with your publishable API key.

Create an asynchronous `fetchClientSecret` function that makes a request to your server to create the Checkout Session and retrieve the client secret. Pass this function into `options` when you create the Checkout instance:

```javascript
// Initialize Stripe.js
const stripe = Stripe('<<YOUR_PUBLISHABLE_KEY>>', {
   stripeAccount: '{{CONNECTED_ACCOUNT_ID}}',
});

initialize();

// Fetch Checkout Session and retrieve the client secret
async function initialize() {
  const fetchClientSecret = async () => {
    const response = await fetch("/create-checkout-session", {
      method: "POST",
    });
    const { clientSecret } = await response.json();
    return clientSecret;
  };

  // Initialize Checkout
  const checkout = await stripe.initEmbeddedCheckout({
    fetchClientSecret,
  });

  // Mount Checkout
  checkout.mount('#checkout');
}
```

#### React

Install Connect.js and the React Connect.js libraries from the [npm public registry](https://www.npmjs.com/package/@stripe/react-connect-js).

```bash
npm install --save @stripe/connect-js @stripe/react-connect-js
```

To use the Embedded Checkout component, create an `EmbeddedCheckoutProvider`. Call `loadStripe` with your publishable API key and pass the returned `Promise` to the provider.

Create an asynchronous `fetchClientSecret` function that makes a request to your server to create the Checkout Session and retrieve the client secret. Pass this function into the `options` prop accepted by the provider.

```jsx
import * as React from 'react';
import {loadStripe} from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe('pk_test_123');

const App = ({fetchClientSecret}) => {
  const options = {fetchClientSecret};

  return (
    <EmbeddedCheckoutProvider
      stripe={stripePromise}
      options={options}
    >
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  )
}
```

Checkout is rendered in an iframe that securely sends payment information to Stripe over an HTTPS connection. Avoid placing Checkout within another iframe because some payment methods require redirecting to another page for payment confirmation.

### Customise appearance

Customise Checkout to match the design of your site by setting the background colour, button colour, border radius, and fonts in your account’s [branding settings](https://dashboard.stripe.com/settings/branding).

By default, Checkout renders with no external padding or margin. We recommend using a container element such as a div to apply your desired margin (for example, 16px on all sides).

### Handle post-payment events  (Server-side)

Stripe sends a [checkout.session.completed](https://docs.stripe.com/api/events/types.md#event_types-checkout.session.completed) event when the payment completes. [Use a webhook to receive these events](https://docs.stripe.com/webhooks/quickstart.md) and run actions, such as sending an order confirmation email to your customer, logging the sale in a database, or starting a shipping workflow.

Listen for these events rather than waiting on a callback from the client. On the client, the customer could close the browser window or quit the app before the callback executes. Some payment methods also take 2-14 days for payment confirmation. Setting up your integration to listen for asynchronous events enables you to accept multiple [payment methods](https://stripe.com/payments/payment-methods-guide) with a single integration.

In addition to handling the `checkout.session.completed` event, we recommend handling two other events when collecting payments with Checkout:

| Event                                                                                                                                        | Description                                                                           | Next steps                                                        |
| -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| [checkout.session.completed](https://docs.stripe.com/api/events/types.md#event_types-checkout.session.completed)                             | The customer has successfully authorised the payment by submitting the Checkout form. | Wait for the payment to succeed or fail.                          |
| [checkout.session.async_payment_succeeded](https://docs.stripe.com/api/events/types.md#event_types-checkout.session.async_payment_succeeded) | The customer’s payment succeeded.                                                     | Fulfil the purchased goods or services.                           |
| [checkout.session.async_payment_failed](https://docs.stripe.com/api/events/types.md#event_types-checkout.session.async_payment_failed)       | The payment was declined, or failed for some other reason.                            | Contact the customer via email and ask them to place a new order. |

These events all include the [Checkout Session](https://docs.stripe.com/api/checkout/sessions.md) object. After the payment succeeds, the underlying *PaymentIntent* (The Payment Intents API tracks the lifecycle of a customer checkout flow and triggers additional authentication steps when required by regulatory mandates, custom Radar fraud rules, or redirect-based payment methods) status changes from `processing` to `succeeded`.

#### Custom flow

### Create a PaymentIntent  (Server-side)

Stripe uses a [PaymentIntent](https://docs.stripe.com/api/payment_intents.md) object to represent your intent to collect payment from a customer, tracking charge attempts and payment state changes throughout the process.

> If you want to render the Payment Element without first creating a PaymentIntent, see [Collect payment details before creating an Intent](https://docs.stripe.com/payments/accept-a-payment-deferred.md?type=payment).
![An overview diagram of the entire payment flow](https://b.stripecdn.com/docs-statics-srv/assets/accept-a-payment-payment-element.5cf6795a02f864923f9953611493d735.svg)

The payment methods shown to customers during the checkout process are also included on the PaymentIntent. You can let Stripe automatically pull payment methods from your Dashboard settings or you can list them manually.

Unless your integration requires a code-based option for offering payment methods, don’t list payment methods manually. Stripe evaluates the currency, payment method restrictions, and other parameters to determine the list of supported payment methods. Stripe prioritises payment methods that help increase conversion and are most relevant to the currency and the customer’s location. We hide lower priority payment methods in an overflow menu.

#### Manage payment methods from the Dashboard

```curl
curl https://api.stripe.com/v1/payment_intents \
  -u "<<YOUR_SECRET_KEY>>:" \
  -H "Stripe-Account: {{CONNECTEDACCOUNT_ID}}" \
  -d amount=1099 \
  -d currency=eur \
  -d "automatic_payment_methods[enabled]"=true \
  -d application_fee_amount=123
```

```cli
stripe payment_intents create  \
  --stripe-account {{CONNECTEDACCOUNT_ID}} \
  --amount=1099 \
  --currency=eur \
  -d "automatic_payment_methods[enabled]"=true \
  --application-fee-amount=123
```

```ruby
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
Stripe.api_key = '<<YOUR_SECRET_KEY>>'

payment_intent = Stripe::PaymentIntent.create(
  {
    amount: 1099,
    currency: 'eur',
    automatic_payment_methods: {enabled: true},
    application_fee_amount: 123,
  },
  {stripe_account: '{{CONNECTEDACCOUNT_ID}}'},
)
```

```ruby
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
client = Stripe::StripeClient.new("<<YOUR_SECRET_KEY>>")

payment_intent = client.v1.payment_intents.create(
  {
    amount: 1099,
    currency: 'eur',
    automatic_payment_methods: {enabled: true},
    application_fee_amount: 123,
  },
  {stripe_account: '{{CONNECTEDACCOUNT_ID}}'},
)
```

```python
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
import stripe
stripe.api_key = "<<YOUR_SECRET_KEY>>"

payment_intent = stripe.PaymentIntent.create(
  amount=1099,
  currency="eur",
  automatic_payment_methods={"enabled": True},
  application_fee_amount=123,
  stripe_account="{{CONNECTEDACCOUNT_ID}}",
)
```

```python
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
client = StripeClient("<<YOUR_SECRET_KEY>>")

payment_intent = client.payment_intents.create(
  {
    "amount": 1099,
    "currency": "eur",
    "automatic_payment_methods": {"enabled": True},
    "application_fee_amount": 123,
  },
  {"stripe_account": "{{CONNECTEDACCOUNT_ID}}"},
)
```

```php
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
$stripe = new \Stripe\StripeClient('<<YOUR_SECRET_KEY>>');

$paymentIntent = $stripe->paymentIntents->create(
  [
    'amount' => 1099,
    'currency' => 'eur',
    'automatic_payment_methods' => ['enabled' => true],
    'application_fee_amount' => 123,
  ],
  ['stripe_account' => '{{CONNECTEDACCOUNT_ID}}']
);
```

```java
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
Stripe.apiKey = "<<YOUR_SECRET_KEY>>";

PaymentIntentCreateParams params =
  PaymentIntentCreateParams.builder()
    .setAmount(1099L)
    .setCurrency("eur")
    .setAutomaticPaymentMethods(
      PaymentIntentCreateParams.AutomaticPaymentMethods.builder().setEnabled(true).build()
    )
    .setApplicationFeeAmount(123L)
    .build();

RequestOptions requestOptions =
  RequestOptions.builder().setStripeAccount("{{CONNECTEDACCOUNT_ID}}").build();

PaymentIntent paymentIntent = PaymentIntent.create(params, requestOptions);
```

```java
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeClient client = new StripeClient("<<YOUR_SECRET_KEY>>");

PaymentIntentCreateParams params =
  PaymentIntentCreateParams.builder()
    .setAmount(1099L)
    .setCurrency("eur")
    .setAutomaticPaymentMethods(
      PaymentIntentCreateParams.AutomaticPaymentMethods.builder().setEnabled(true).build()
    )
    .setApplicationFeeAmount(123L)
    .build();

RequestOptions requestOptions =
  RequestOptions.builder().setStripeAccount("{{CONNECTEDACCOUNT_ID}}").build();

PaymentIntent paymentIntent = client.paymentIntents().create(params, requestOptions);
```

```node
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = require('stripe')('<<YOUR_SECRET_KEY>>');

const paymentIntent = await stripe.paymentIntents.create(
  {
    amount: 1099,
    currency: 'eur',
    automatic_payment_methods: {
      enabled: true,
    },
    application_fee_amount: 123,
  },
  {
    stripeAccount: '{{CONNECTEDACCOUNT_ID}}',
  }
);
```

```go
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
stripe.Key = "<<YOUR_SECRET_KEY>>"

params := &stripe.PaymentIntentParams{
  Amount: stripe.Int64(1099),
  Currency: stripe.String(stripe.CurrencyEUR),
  AutomaticPaymentMethods: &stripe.PaymentIntentAutomaticPaymentMethodsParams{
    Enabled: stripe.Bool(true),
  },
  ApplicationFeeAmount: stripe.Int64(123),
}
params.SetStripeAccount("{{CONNECTEDACCOUNT_ID}}")
result, err := paymentintent.New(params)
```

```go
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
sc := stripe.NewClient("<<YOUR_SECRET_KEY>>")
params := &stripe.PaymentIntentCreateParams{
  Amount: stripe.Int64(1099),
  Currency: stripe.String(stripe.CurrencyEUR),
  AutomaticPaymentMethods: &stripe.PaymentIntentCreateAutomaticPaymentMethodsParams{
    Enabled: stripe.Bool(true),
  },
  ApplicationFeeAmount: stripe.Int64(123),
}
params.SetStripeAccount("{{CONNECTEDACCOUNT_ID}}")
result, err := sc.V1PaymentIntents.Create(context.TODO(), params)
```

```dotnet
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeConfiguration.ApiKey = "<<YOUR_SECRET_KEY>>";

var options = new PaymentIntentCreateOptions
{
    Amount = 1099,
    Currency = "eur",
    AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
    {
        Enabled = true,
    },
    ApplicationFeeAmount = 123,
};
var requestOptions = new RequestOptions
{
    StripeAccount = "{{CONNECTEDACCOUNT_ID}}",
};
var service = new PaymentIntentService();
PaymentIntent paymentIntent = service.Create(options, requestOptions);
```

```dotnet
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
var options = new PaymentIntentCreateOptions
{
    Amount = 1099,
    Currency = "eur",
    AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
    {
        Enabled = true,
    },
    ApplicationFeeAmount = 123,
};
var requestOptions = new RequestOptions
{
    StripeAccount = "{{CONNECTEDACCOUNT_ID}}",
};
var client = new StripeClient("<<YOUR_SECRET_KEY>>");
var service = client.V1.PaymentIntents;
PaymentIntent paymentIntent = service.Create(options, requestOptions);
```

When creating a PaymentIntent, you need to specify certain parameters:

- `amount` and `currency` - Create a PaymentIntent on your server with an amount and currency.

- (Optional) `automatic_payment_methods` - In the latest version of the API, you don’t need to specify this parameter because Stripe enables its functionality by default. You can manage payment methods from the [Dashboard](https://dashboard.stripe.com/settings/payment_methods). Stripe automatically returns eligible payment methods based on factors such as the transaction’s amount, currency, and payment flow.

- (Optional) `payment_intent_data[application_fee_amount]` - This argument specifies the amount your platform plans to take from the transaction. If you’re using Stripe’s [Platform Pricing Tool](https://docs.stripe.com/connect/platform-pricing-tools.md) to manage application fee pricing from the [Dashboard](https://dashboard.stripe.com/test/settings/connect/platform_pricing/payments), don’t include this argument as it’ll override any pricing logic set by the tool. After processing the payment on the connected account, the `application_fee_amount` transfers to the platform, and the Stripe fee is deducted from the connected account’s balance.

#### List payment methods manually

```curl
curl https://api.stripe.com/v1/payment_intents \
  -u "<<YOUR_SECRET_KEY>>:" \
  -H "Stripe-Account: {{CONNECTEDACCOUNT_ID}}" \
  -d amount=1099 \
  -d currency=eur \
  -d "payment_method_types[]"=bancontact \
  -d "payment_method_types[]"=card \
  -d "payment_method_types[]"=eps \
  -d "payment_method_types[]"=ideal \
  -d "payment_method_types[]"=p24 \
  -d "payment_method_types[]"=sepa_debit \
  -d "payment_method_types[]"=sofort \
  -d application_fee_amount=123
```

```cli
stripe payment_intents create  \
  --stripe-account {{CONNECTEDACCOUNT_ID}} \
  --amount=1099 \
  --currency=eur \
  -d "payment_method_types[0]"=bancontact \
  -d "payment_method_types[1]"=card \
  -d "payment_method_types[2]"=eps \
  -d "payment_method_types[3]"=ideal \
  -d "payment_method_types[4]"=p24 \
  -d "payment_method_types[5]"=sepa_debit \
  -d "payment_method_types[6]"=sofort \
  --application-fee-amount=123
```

```ruby
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
Stripe.api_key = '<<YOUR_SECRET_KEY>>'

payment_intent = Stripe::PaymentIntent.create(
  {
    amount: 1099,
    currency: 'eur',
    payment_method_types: [
      'bancontact',
      'card',
      'eps',
      'ideal',
      'p24',
      'sepa_debit',
      'sofort',
    ],
    application_fee_amount: 123,
  },
  {stripe_account: '{{CONNECTEDACCOUNT_ID}}'},
)
```

```ruby
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
client = Stripe::StripeClient.new("<<YOUR_SECRET_KEY>>")

payment_intent = client.v1.payment_intents.create(
  {
    amount: 1099,
    currency: 'eur',
    payment_method_types: [
      'bancontact',
      'card',
      'eps',
      'ideal',
      'p24',
      'sepa_debit',
      'sofort',
    ],
    application_fee_amount: 123,
  },
  {stripe_account: '{{CONNECTEDACCOUNT_ID}}'},
)
```

```python
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
import stripe
stripe.api_key = "<<YOUR_SECRET_KEY>>"

payment_intent = stripe.PaymentIntent.create(
  amount=1099,
  currency="eur",
  payment_method_types=[
    "bancontact",
    "card",
    "eps",
    "ideal",
    "p24",
    "sepa_debit",
    "sofort",
  ],
  application_fee_amount=123,
  stripe_account="{{CONNECTEDACCOUNT_ID}}",
)
```

```python
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
client = StripeClient("<<YOUR_SECRET_KEY>>")

payment_intent = client.payment_intents.create(
  {
    "amount": 1099,
    "currency": "eur",
    "payment_method_types": [
      "bancontact",
      "card",
      "eps",
      "ideal",
      "p24",
      "sepa_debit",
      "sofort",
    ],
    "application_fee_amount": 123,
  },
  {"stripe_account": "{{CONNECTEDACCOUNT_ID}}"},
)
```

```php
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
$stripe = new \Stripe\StripeClient('<<YOUR_SECRET_KEY>>');

$paymentIntent = $stripe->paymentIntents->create(
  [
    'amount' => 1099,
    'currency' => 'eur',
    'payment_method_types' => [
      'bancontact',
      'card',
      'eps',
      'ideal',
      'p24',
      'sepa_debit',
      'sofort',
    ],
    'application_fee_amount' => 123,
  ],
  ['stripe_account' => '{{CONNECTEDACCOUNT_ID}}']
);
```

```java
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
Stripe.apiKey = "<<YOUR_SECRET_KEY>>";

PaymentIntentCreateParams params =
  PaymentIntentCreateParams.builder()
    .setAmount(1099L)
    .setCurrency("eur")
    .addPaymentMethodType("bancontact")
    .addPaymentMethodType("card")
    .addPaymentMethodType("eps")
    .addPaymentMethodType("ideal")
    .addPaymentMethodType("p24")
    .addPaymentMethodType("sepa_debit")
    .addPaymentMethodType("sofort")
    .setApplicationFeeAmount(123L)
    .build();

RequestOptions requestOptions =
  RequestOptions.builder().setStripeAccount("{{CONNECTEDACCOUNT_ID}}").build();

PaymentIntent paymentIntent = PaymentIntent.create(params, requestOptions);
```

```java
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeClient client = new StripeClient("<<YOUR_SECRET_KEY>>");

PaymentIntentCreateParams params =
  PaymentIntentCreateParams.builder()
    .setAmount(1099L)
    .setCurrency("eur")
    .addPaymentMethodType("bancontact")
    .addPaymentMethodType("card")
    .addPaymentMethodType("eps")
    .addPaymentMethodType("ideal")
    .addPaymentMethodType("p24")
    .addPaymentMethodType("sepa_debit")
    .addPaymentMethodType("sofort")
    .setApplicationFeeAmount(123L)
    .build();

RequestOptions requestOptions =
  RequestOptions.builder().setStripeAccount("{{CONNECTEDACCOUNT_ID}}").build();

PaymentIntent paymentIntent = client.paymentIntents().create(params, requestOptions);
```

```node
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = require('stripe')('<<YOUR_SECRET_KEY>>');

const paymentIntent = await stripe.paymentIntents.create(
  {
    amount: 1099,
    currency: 'eur',
    payment_method_types: [
      'bancontact',
      'card',
      'eps',
      'ideal',
      'p24',
      'sepa_debit',
      'sofort',
    ],
    application_fee_amount: 123,
  },
  {
    stripeAccount: '{{CONNECTEDACCOUNT_ID}}',
  }
);
```

```go
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
stripe.Key = "<<YOUR_SECRET_KEY>>"

params := &stripe.PaymentIntentParams{
  Amount: stripe.Int64(1099),
  Currency: stripe.String(stripe.CurrencyEUR),
  PaymentMethodTypes: []*string{
    stripe.String("bancontact"),
    stripe.String("card"),
    stripe.String("eps"),
    stripe.String("ideal"),
    stripe.String("p24"),
    stripe.String("sepa_debit"),
    stripe.String("sofort"),
  },
  ApplicationFeeAmount: stripe.Int64(123),
}
params.SetStripeAccount("{{CONNECTEDACCOUNT_ID}}")
result, err := paymentintent.New(params)
```

```go
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
sc := stripe.NewClient("<<YOUR_SECRET_KEY>>")
params := &stripe.PaymentIntentCreateParams{
  Amount: stripe.Int64(1099),
  Currency: stripe.String(stripe.CurrencyEUR),
  PaymentMethodTypes: []*string{
    stripe.String("bancontact"),
    stripe.String("card"),
    stripe.String("eps"),
    stripe.String("ideal"),
    stripe.String("p24"),
    stripe.String("sepa_debit"),
    stripe.String("sofort"),
  },
  ApplicationFeeAmount: stripe.Int64(123),
}
params.SetStripeAccount("{{CONNECTEDACCOUNT_ID}}")
result, err := sc.V1PaymentIntents.Create(context.TODO(), params)
```

```dotnet
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeConfiguration.ApiKey = "<<YOUR_SECRET_KEY>>";

var options = new PaymentIntentCreateOptions
{
    Amount = 1099,
    Currency = "eur",
    PaymentMethodTypes = new List<string>
    {
        "bancontact",
        "card",
        "eps",
        "ideal",
        "p24",
        "sepa_debit",
        "sofort",
    },
    ApplicationFeeAmount = 123,
};
var requestOptions = new RequestOptions
{
    StripeAccount = "{{CONNECTEDACCOUNT_ID}}",
};
var service = new PaymentIntentService();
PaymentIntent paymentIntent = service.Create(options, requestOptions);
```

```dotnet
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
var options = new PaymentIntentCreateOptions
{
    Amount = 1099,
    Currency = "eur",
    PaymentMethodTypes = new List<string>
    {
        "bancontact",
        "card",
        "eps",
        "ideal",
        "p24",
        "sepa_debit",
        "sofort",
    },
    ApplicationFeeAmount = 123,
};
var requestOptions = new RequestOptions
{
    StripeAccount = "{{CONNECTEDACCOUNT_ID}}",
};
var client = new StripeClient("<<YOUR_SECRET_KEY>>");
var service = client.V1.PaymentIntents;
PaymentIntent paymentIntent = service.Create(options, requestOptions);
```

When creating a PaymentIntent, you need to specify certain parameters:

- `amount` - Create a PaymentIntent on your server with a specified amount. Always determine how much to charge on the server side, as this is a trusted environment. This approach prevents malicious customers from choosing their own prices.
- `currency` - The currency you include in the PaymentIntent filters the payment methods shown to the customer, so choose it based on the payment methods you want to offer. For example, if you pass `eur` and have OXXO enabled in the Dashboard, OXXO won’t appear to the customer because it doesn’t support `eur` payments. Some payment methods support multiple currencies and countries. This guide uses Bancontact, credit cards, EPS, iDEAL, Przelewy24, SEPA Direct Debit, and Sofort in the example code.
- `"payment_method_types[]"` - Manually list all the payment methods you want to support.
- (Optional) `payment_intent_data[application_fee_amount]` – This argument specifies the amount your platform plans to take from the transaction. If you’re using Stripe’s [Platform Pricing Tool](https://docs.stripe.com/connect/platform-pricing-tools.md) to manage application fee pricing from the [Dashboard](https://dashboard.stripe.com/test/settings/connect/platform_pricing/payments), don’t include this argument as it’ll override any pricing logic set by the tool. After processing the payment on the connected account, the `application_fee_amount` transfers to the platform, and the Stripe fee is deducted from the connected account’s balance.

> Each payment method needs to support the currency passed in the PaymentIntent and your business needs to be based in one of the countries each payment method supports. See [Payment method integration options](https://docs.stripe.com/payments/payment-methods/integration-options.md) for more details about what’s supported.

### Retrieve the client secret

The PaymentIntent includes a *client secret* (The client secret is a unique key returned from Stripe as part of a PaymentIntent. This key lets the client access important fields from the PaymentIntent (status, amount, currency) while hiding sensitive ones (metadata, customer)) that the client side uses to securely complete the payment process. You can use different approaches to pass the client secret to the client side.

#### Single-page application

Retrieve the client secret from an endpoint on your server, using the browser’s `fetch` function. This approach is best if your client side is a single-page application, particularly one built with a modern front-end framework such as React. Create the server endpoint that serves the client secret:

#### Ruby

```ruby
get '/secret' do
  intent = # ... Create or retrieve the PaymentIntent
  {client_secret: intent.client_secret}.to_json
end
```

#### Python

```python
from flask import Flask, jsonify
app = Flask(__name__)

@app.route('/secret')
def secret():
  intent = # ... Create or retrieve the PaymentIntent
  return jsonify(client_secret=intent.client_secret)
```

#### PHP

```php
<?php
    $intent = # ... Create or retrieve the PaymentIntent
    echo json_encode(array('client_secret' => $intent->client_secret));
?>
```

#### Java

```java
import java.util.HashMap;
import java.util.Map;

import com.stripe.model.PaymentIntent;

import com.google.gson.Gson;

import static spark.Spark.get;

public class StripeJavaQuickStart {
  public static void main(String[] args) {
    Gson gson = new Gson();

    get("/secret", (request, response) -> {
      PaymentIntent intent = // ... Fetch or create the PaymentIntent

      Map<String, String> map = new HashMap();
      map.put("client_secret", intent.getClientSecret());

      return map;
    }, gson::toJson);
  }
}
```

#### Node

```javascript
const express = require('express');
const app = express();

app.get('/secret', async (req, res) => {
  const intent = // ... Fetch or create the PaymentIntent
  res.json({client_secret: intent.client_secret});
});

app.listen(3000, () => {
  console.log('Running on port 3000');
});
```

#### Go

```go
package main

import (
  "encoding/json"
  "net/http"

  stripe "github.com/stripe/stripe-go/v76.0.0"
)

type CheckoutData struct {
  ClientSecret string `json:"client_secret"`
}

func main() {
  http.HandleFunc("/secret", func(w http.ResponseWriter, r *http.Request) {
    intent := // ... Fetch or create the PaymentIntent
    data := CheckoutData{
      ClientSecret: intent.ClientSecret,
    }
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(data)
  })

  http.ListenAndServe(":3000", nil)
}
```

#### .NET

```csharp
using System;
using Microsoft.AspNetCore.Mvc;
using Stripe;

namespace StripeExampleApi.Controllers
{
  [Route("secret")]
  [ApiController]
  public class CheckoutApiController : Controller
  {
    [HttpGet]
    public ActionResult Get()
    {
      var intent = // ... Fetch or create the PaymentIntent
      return Json(new {client_secret = intent.ClientSecret});
    }
  }
}
```

And then fetch the client secret with JavaScript on the client side:

```javascript
(async () => {
  const response = await fetch('/secret');
  const {client_secret: clientSecret} = await response.json();
  // Render the form using the clientSecret
})();
```

#### Server-side rendering

Pass the client secret to the client from your server. This approach works best if your application generates static content on the server before sending it to the browser.

Add the [client_secret](https://docs.stripe.com/api/payment_intents/object.md#payment_intent_object-client_secret) in your checkout form. In your server-side code, retrieve the client secret from the PaymentIntent:

#### Ruby

```erb
<form id="payment-form" data-secret="<%= @intent.client_secret %>">
  <div id="payment-element">
    <!-- placeholder for Elements -->
  </div>
  <button id="submit">Submit</button>
</form>
```

```ruby
get '/checkout' do
  @intent = # ... Fetch or create the PaymentIntent
  erb :checkout
end
```

#### Python

```html
<form id="payment-form" data-secret="{{ client_secret }}">
  <div id="payment-element">
    <!-- placeholder for Elements -->
  </div>
  <button id="submit">Submit</button>
</form>
```

```python
@app.route('/checkout')
def checkout():
  intent = # ... Fetch or create the PaymentIntent
  return render_template('checkout.html', client_secret=intent.client_secret)
```

#### PHP

```php
<?php
  $intent = # ... Fetch or create the PaymentIntent;
?>
...
<form id="payment-form" data-secret="<?= $intent->client_secret ?>">
  <div id="payment-element">
    <!-- placeholder for Elements -->
  </div>
  <button id="submit">Submit</button>
</form>
...
```

#### Java

```html
<form id="payment-form" data-secret="{{ client_secret }}">
  <div id="payment-element">
    <!-- placeholder for Elements -->
  </div>
  <button id="submit">Submit</button>
</form>
```

```java
import java.util.HashMap;
import java.util.Map;

import com.stripe.model.PaymentIntent;

import spark.ModelAndView;

import static spark.Spark.get;

public class StripeJavaQuickStart {
  public static void main(String[] args) {
    get("/checkout", (request, response) -> {
      PaymentIntent intent = // ... Fetch or create the PaymentIntent

      Map map = new HashMap();
      map.put("client_secret", intent.getClientSecret());

      return new ModelAndView(map, "checkout.hbs");
    }, new HandlebarsTemplateEngine());
  }
}
```

#### Node

```html
<form id="payment-form" data-secret="{{ client_secret }}">
  <div id="payment-element">
    <!-- Elements will create form elements here -->
  </div>

  <button id="submit">Submit</button>
</form>
```

```javascript
const express = require('express');
const expressHandlebars = require('express-handlebars');
const app = express();

app.engine('.hbs', expressHandlebars({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');

app.get('/checkout', async (req, res) => {
  const intent = // ... Fetch or create the PaymentIntent
  res.render('checkout', { client_secret: intent.client_secret });
});

app.listen(3000, () => {
  console.log('Running on port 3000');
});
```

#### Go

```html
<form id="payment-form" data-secret="{{ .ClientSecret }}">
  <div id="payment-element">
    <!-- placeholder for Elements -->
  </div>
  <button id="submit">Submit</button>
</form>
```

```go
package main

import (
  "html/template"
  "net/http"

  stripe "github.com/stripe/stripe-go/v76.0.0"
)

type CheckoutData struct {
  ClientSecret string
}

func main() {
  checkoutTmpl := template.Must(template.ParseFiles("views/checkout.html"))

  http.HandleFunc("/checkout", func(w http.ResponseWriter, r *http.Request) {
    intent := // ... Fetch or create the PaymentIntent
    data := CheckoutData{
      ClientSecret: intent.ClientSecret,
    }
    checkoutTmpl.Execute(w, data)
  })

  http.ListenAndServe(":3000", nil)
}
```

#### .NET

```html
<form id="payment-form" data-secret="@ViewData["ClientSecret"]">
  <div id="payment-element">
    <!-- placeholder for Elements -->
  </div>
  <button id="submit">Submit</button>
</form>
```

```csharp
using System;
using Microsoft.AspNetCore.Mvc;
using Stripe;

namespace StripeExampleApi.Controllers
{
  [Route("/[controller]")]
  public class CheckoutApiController : Controller
  {
    public IActionResult Index()
    {
      var intent = // ... Fetch or create the PaymentIntent
      ViewData["ClientSecret"] = intent.ClientSecret;
      return View();
    }
  }
}
```

### Collect payment details  (Client-side)

Collect payment details on the client with the Payment Element. The Payment Element is a prebuilt UI component that simplifies collecting payment details for a variety of payment methods.

The Payment Element contains an iframe that securely sends payment information to Stripe over an HTTPS connection. Avoid placing the Payment Element within another iframe because some payment methods require redirecting to another page for payment confirmation.

The checkout page address must start with `https://` rather than `http://` for your integration to work. You can test your integration without using HTTPS, but remember to [enable it](https://docs.stripe.com/security/guide.md#tls) when you’re ready to accept live payments.

#### Set up Stripe.js

#### HTML + JS

The Payment Element is automatically available as a feature of Stripe.js. Include the Stripe.js script on your checkout page by adding it to the `head` of your HTML file. Always load Stripe.js directly from js.stripe.com to remain PCI compliant. Don’t include the script in a bundle or host a copy of it yourself.

```html
<head>
  <title>Checkout</title>
  <script src="https://js.stripe.com/basil/stripe.js"></script>
</head>
```

Create an instance of `Stripe` with the following JavaScript on your checkout page:

```javascript
// Initialize Stripe.js with the same connected account ID used when creating
// the PaymentIntent.
const stripe = Stripe('<<YOUR_PUBLISHABLE_KEY>>', {
  stripeAccount: '{{CONNECTED_ACCOUNT_ID}}'
});
```

#### Add Stripe Elements and the Payment Element to your payment page

The Payment Element needs a place to live on your payment page. Create an empty DOM node (container) with a unique ID in your payment form.

```html
<form id="payment-form">
  <div id="payment-element">
    <!-- Elements will create form elements here -->
  </div>
  <button id="submit">Pay</button>
</form>
```

When the form has loaded, create an instance of the Payment Element and mount it to the container DOM node along with the [client secret](https://docs.stripe.com/api/payment_intents/object.md#payment_intent_object-client_secret) from the previous step. Pass this value as an option when creating the [Elements](https://docs.stripe.com/js/elements_object/create) instance.

The client secret must be handled carefully because it can complete the charge. Don’t log it, embed it in URLs, or expose it to anyone but the customer.

```javascript
const options = {
  clientSecret: '{{CLIENT_SECRET}}',
  // Fully customizable with the Appearance API
  appearance: {/*...*/},
};

// Set up Stripe.js and Elements to use in checkout form using the client secret
const elements = stripe.elements(options);

// Create and mount the Payment Element
const paymentElement = elements.create("payment");
paymentElement.mount("#payment-element");
```

The Payment Element renders a dynamic form that allows your customer to pick a payment method. The form automatically collects all necessary payments details for the payment method selected by the customer. You can [customise the appearance of the Payment Element](https://docs.stripe.com/elements/appearance-api.md) to match the design of your site when you set up the `Elements` object.

#### React

Install [React Stripe.js](https://www.npmjs.com/package/@stripe/react-stripe-js) and the [Stripe.js loader](https://www.npmjs.com/package/@stripe/stripe-js) from the npm public registry:

```bash
npm install --save @stripe/react-stripe-js @stripe/stripe-js
```

### Add and configure the Elements provider to your payment page

To use the Payment Element component, wrap your checkout page component in an [Elements provider](https://docs.stripe.com/sdks/stripejs-react.md#elements-provider). Call `loadStripe` with your publishable key, and pass the returned `Promise` along with the [client secret](https://docs.stripe.com/api/payment_intents/object.md#payment_intent_object-client_secret) from the previous step as `options` in the `Elements` provider.

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe("<<YOUR_PUBLISHABLE_KEY>>", {
  stripeAccount: '{{CONNECTED_ACCOUNT_ID}}'
});

function App() {
  const options = {
    // pass the client secret from the previous step
    clientSecret: '{{CLIENT_SECRET}}',
    // Fully customizable with the Appearance API
    appearance: {/*...*/},
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm />
    </Elements>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
```

#### Add the PaymentElement component

Use the `PaymentElement` component to build your form.

```jsx
import React from 'react';
import {PaymentElement} from '@stripe/react-stripe-js';

const CheckoutForm = () => {
  return (
    <form><PaymentElement />
      <button>Submit</button>
    </form>
  );
};

export default CheckoutForm;
```

The Payment Element renders a dynamic form that allows your customer to pick a payment method type. The form automatically collects all necessary payments details for the payment method selected by the customer. You can [customise the appearance of the Payment Element](https://docs.stripe.com/elements/appearance-api.md) to match the design of your site when you configure the `Elements` provider.

### Submit the payment to Stripe  (Client-side)

Use [stripe.confirmPayment](https://docs.stripe.com/js/payment_intents/confirm_payment) to complete the payment using details from the Payment Element. Provide a [return_url](https://docs.stripe.com/api/payment_intents/create.md#create_payment_intent-return_url) to this function to indicate where Stripe should redirect the user after they complete the payment. Your user may be first redirected to an intermediate site, such as a bank authorisation page, before being redirected to the `return_url`. Card payments immediately redirect to the `return_url` when a payment is successful.

If you don’t want to redirect for card payments after payment completion, you can set [redirect](https://docs.stripe.com/js/payment_intents/confirm_payment#confirm_payment_intent-options-redirect) to `if_required`. This only redirects customers who check out with redirect-based payment methods.

#### HTML + JS

```javascript
const form = document.getElementById('payment-form');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
const {error} = await stripe.confirmPayment({
    //`Elements` instance that was used to create the Payment Element
    elements,
    confirmParams: {
      return_url: 'https://example.com/order/123/complete',
    },
  });

  if (error) {
    // This point will only be reached if there is an immediate error when
    // confirming the payment. Show error to your customer (for example, payment
    // details incomplete)
    const messageContainer = document.querySelector('#error-message');
    messageContainer.textContent = error.message;
  } else {
    // Your customer will be redirected to your `return_url`. For some payment
    // methods like iDEAL, your customer will be redirected to an intermediate
    // site first to authorize the payment, then redirected to the `return_url`.
  }
});
```

#### React

To call [stripe.confirmPayment](https://docs.stripe.com/js/payment_intents/confirm_payment) from your payment form component, use the [useStripe](https://docs.stripe.com/sdks/stripejs-react.md#usestripe-hook) and [useElements](https://docs.stripe.com/sdks/stripejs-react.md#useelements-hook) hooks.

If you prefer traditional class components over hooks, you can instead use an [ElementsConsumer](https://docs.stripe.com/sdks/stripejs-react.md#elements-consumer).

```jsx
import React, {useState} from 'react';
import {useStripe, useElements, PaymentElement} from '@stripe/react-stripe-js';

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
const {error} = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: 'https://example.com/order/123/complete',
      },
    });


    if (error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      setErrorMessage(error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button disabled={!stripe}>Submit</button>
      {/* Show error message to your customers */}
      {errorMessage && <div>{errorMessage}</div>}
    </form>
  )
};

export default CheckoutForm;
```

Make sure the `return_url` corresponds to a page on your website that provides the status of the payment. When Stripe redirects the customer to the `return_url`, we provide the following URL query parameters:

| Parameter                      | Description                                                                                                                                   |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `payment_intent`               | The unique identifier for the `PaymentIntent`.                                                                                                |
| `payment_intent_client_secret` | The [client secret](https://docs.stripe.com/api/payment_intents/object.md#payment_intent_object-client_secret) of the `PaymentIntent` object. |

> If you have tooling that tracks the customer’s browser session, you might need to add the `stripe.com` domain to the referrer exclude list. Redirects cause some tools to create new sessions, which prevents you from tracking the complete session.

Use one of the query parameters to retrieve the PaymentIntent. Inspect the [status of the PaymentIntent](https://docs.stripe.com/payments/paymentintents/lifecycle.md) to decide what to show your customers. You can also append your own query parameters when providing the `return_url`, which persist through the redirect process.

#### HTML + JS

```javascript

// Initialize Stripe.js using your publishable key
const stripe = Stripe('<<YOUR_PUBLISHABLE_KEY>>');

// Retrieve the "payment_intent_client_secret" query parameter appended to
// your return_url by Stripe.js
const clientSecret = new URLSearchParams(window.location.search).get(
  'payment_intent_client_secret'
);

// Retrieve the PaymentIntent
stripe.retrievePaymentIntent(clientSecret).then(({paymentIntent}) => {
  const message = document.querySelector('#message')

  // Inspect the PaymentIntent `status` to indicate the status of the payment
  // to your customer.
  //
  // Some payment methods will [immediately succeed or fail][0] upon
  // confirmation, while others will first enter a `processing` state.
  //
  // [0]: https://stripe.com/docs/payments/payment-methods#payment-notification
  switch (paymentIntent.status) {
    case 'succeeded':
      message.innerText = 'Success! Payment received.';
      break;

    case 'processing':
      message.innerText = "Payment processing. We'll update you when payment is received.";
      break;

    case 'requires_payment_method':
      message.innerText = 'Payment failed. Please try another payment method.';
      // Redirect your user back to your payment page to attempt collecting
      // payment again
      break;

    default:
      message.innerText = 'Something went wrong.';
      break;
  }
});
```

#### React

```jsx
import React, {useState, useEffect} from 'react';
import {useStripe} from '@stripe/react-stripe-js';

const PaymentStatus = () => {
  const stripe = useStripe();
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    // Retrieve the "payment_intent_client_secret" query parameter appended to
    // your return_url by Stripe.js
    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    );

    // Retrieve the PaymentIntent
    stripe
      .retrievePaymentIntent(clientSecret)
      .then(({paymentIntent}) => {
        // Inspect the PaymentIntent `status` to indicate the status of the payment
        // to your customer.
        //
        // Some payment methods will [immediately succeed or fail][0] upon
        // confirmation, while others will first enter a `processing` state.
        //
        // [0]: https://stripe.com/docs/payments/payment-methods#payment-notification
        switch (paymentIntent.status) {
          case 'succeeded':
            setMessage('Success! Payment received.');
            break;

          case 'processing':
            setMessage("Payment processing. We'll update you when payment is received.");
            break;

          case 'requires_payment_method':
            // Redirect your user back to your payment page to attempt collecting
            // payment again
            setMessage('Payment failed. Please try another payment method.');
            break;

          default:
            setMessage('Something went wrong.');
            break;
        }
      });
  }, [stripe]);


  return message;
};

export default PaymentStatus;
```

### Handle post-payment events  (Server-side)

Stripe sends a [payment_intent.succeeded](https://docs.stripe.com/api/events/types.md#event_types-payment_intent.succeeded) event when the payment completes. Use the [Dashboard webhook tool](https://dashboard.stripe.com/webhooks) or follow the [webhook guide](https://docs.stripe.com/webhooks/quickstart.md) to receive these events and run actions, such as sending an order confirmation email to your customer, logging the sale in a database, or starting a shipping workflow.

Listen for these events rather than waiting on a callback from the client. On the client, the customer could close the browser window or quit the app before the callback executes, and malicious clients could manipulate the response. Setting up your integration to listen for asynchronous events is what enables you to accept [different types of payment methods](https://stripe.com/payments/payment-methods-guide) with a single integration.

In addition to handling the `payment_intent.succeeded` event, we recommend handling these other events when collecting payments with the Payment Element:

| Event                                                                                                                           | Description                                                                                                                                                                                                                                                                         | Action                                                                                                                                                                                           |
| ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [payment_intent.succeeded](https://docs.stripe.com/api/events/types.md?lang=php#event_types-payment_intent.succeeded)           | Sent when a customer successfully completes a payment.                                                                                                                                                                                                                              | Send the customer an order confirmation and *fulfill* (Fulfillment is the process of providing the goods or services purchased by a customer, typically after payment is collected) their order. |
| [payment_intent.processing](https://docs.stripe.com/api/events/types.md?lang=php#event_types-payment_intent.processing)         | Sent when a customer successfully initiates a payment, but the payment has yet to complete. This event is most commonly sent when the customer initiates a bank debit. It’s followed by either a `payment_intent.succeeded` or `payment_intent.payment_failed` event in the future. | Send the customer an order confirmation that indicates their payment is pending. For digital goods, you might want to fulfill the order before waiting for payment to complete.                  |
| [payment_intent.payment_failed](https://docs.stripe.com/api/events/types.md?lang=php#event_types-payment_intent.payment_failed) | Sent when a customer attempts a payment, but the payment fails.                                                                                                                                                                                                                     | If a payment transitions from `processing` to `payment_failed`, offer the customer another attempt to pay.                                                                                       |

## Testing

Test your account creation flow by [creating accounts](https://docs.stripe.com/connect/testing.md#creating-accounts) and [using OAuth](https://docs.stripe.com/connect/testing.md#using-oauth). Test your **Payment methods** settings for your connected accounts by logging into one of your test accounts and navigating to the [Payment methods settings](https://dashboard.stripe.com/settings/payment_methods). Test your checkout flow with your test keys and a test account. You can use our [test cards](https://docs.stripe.com/testing.md) to test your payments flow and simulate various payment outcomes.


# Payment sheet

> This is a Payment sheet for when platform is ios and mobile-ui is payment-element. View the full page at https://docs.stripe.com/connect/enable-payment-acceptance-guide?platform=ios&mobile-ui=payment-element.
![](https://b.stripecdn.com/docs-statics-srv/assets/ios-overview.9e0d68d009dc005f73a6f5df69e00458.png)

Integrate Stripe’s pre-built payment UI into the checkout of your iOS app with the [PaymentSheet](https://stripe.dev/stripe-ios/stripe-paymentsheet/Classes/PaymentSheet.html) class. See our sample integration [on GitHub](https://github.com/stripe/stripe-ios/tree/master/Example/PaymentSheet%20Example).

## Prerequisites

### Prerequisites

- [ ] [Register your platform](https://dashboard.stripe.com/connect)

- [ ] Add business details to [activate your account](https://dashboard.stripe.com/account/onboarding)

- [ ] [Complete your platform profile](https://dashboard.stripe.com/connect/settings/profile)

- [ ] [Customise brand settings](https://dashboard.stripe.com/settings/connect/stripe-dashboard/branding)
Add a business name, icon, and brand colour.

## Set up Stripe [Server-side] [Client-side]

### Server-side

This integration requires endpoints on your server that talk to the Stripe API. Use our official libraries for access to the Stripe API from your server:

#### Ruby

```bash
# Available as a gem
sudo gem install stripe
```

```ruby
# If you use bundler, you can add this line to your Gemfile
gem 'stripe'
```

#### Python

```bash
# Install through pip
pip3 install --upgrade stripe
```

```bash
# Or find the Stripe package on http://pypi.python.org/pypi/stripe/
```

```python
# Find the version you want to pin:
# https://github.com/stripe/stripe-python/blob/master/CHANGELOG.md
# Specify that version in your requirements.txt file
stripe>=5.0.0
```

#### PHP

```bash
# Install the PHP library with Composer
composer require stripe/stripe-php
```

```bash
# Or download the source directly: https://github.com/stripe/stripe-php/releases
```

#### Java

```java
/*
  For Gradle, add the following dependency to your build.gradle and replace with
  the version number you want to use from:
  - https://mvnrepository.com/artifact/com.stripe/stripe-java or
  - https://github.com/stripe/stripe-java/releases/latest
*/
implementation "com.stripe:stripe-java:29.0.0"
```

```xml
<!--
  For Maven, add the following dependency to your POM and replace with the
  version number you want to use from:
  - https://mvnrepository.com/artifact/com.stripe/stripe-java or
  - https://github.com/stripe/stripe-java/releases/latest
-->
<dependency>
  <groupId>com.stripe</groupId>
  <artifactId>stripe-java</artifactId>
  <version>29.0.0</version>
</dependency>
```

```bash
# For other environments, manually install the following JARs:
# - The Stripe JAR from https://github.com/stripe/stripe-java/releases/latest
# - Google Gson from https://github.com/google/gson
```

#### Node

```bash
# Install with npm
npm install stripe --save
```

#### Go

```bash
# Make sure your project is using Go Modules
go mod init
# Install stripe-go
go get -u github.com/stripe/stripe-go/v82
```

```go
// Then import the package
import (
  "github.com/stripe/stripe-go/v82"
)
```

#### .NET

```bash
# Install with dotnet
dotnet add package Stripe.net
dotnet restore
```

```bash
# Or install with NuGet
Install-Package Stripe.net
```

### Client-side

The [Stripe iOS SDK](https://github.com/stripe/stripe-ios) is open source, [fully documented](https://stripe.dev/stripe-ios/index.html), and compatible with apps supporting iOS 13 or above.

#### Swift Package Manager

To install the SDK, follow these steps:

1. In Xcode, select **File** > **Add Package Dependencies…** and enter `https://github.com/stripe/stripe-ios-spm` as the repository URL.
1. Select the latest version number from our [releases page](https://github.com/stripe/stripe-ios/releases).
1. Add the **StripePaymentSheet** product to the [target of your app](https://developer.apple.com/documentation/swift_packages/adding_package_dependencies_to_your_app).

#### CocoaPods

1. If you haven’t already, install the latest version of [CocoaPods](https://guides.cocoapods.org/using/getting-started.html).
1. If you don’t have an existing [Podfile](https://guides.cocoapods.org/syntax/podfile.html), run the following command to create one:
   ```bash
   pod init
   ```
1. Add this line to your `Podfile`:
   ```podfile
   pod 'StripePaymentSheet'
   ```
1. Run the following command:
   ```bash
   pod install
   ```
1. Don’t forget to use the `.xcworkspace` file to open your project in Xcode, instead of the `.xcodeproj` file, from here on out.
1. In the future, to update to the latest version of the SDK, run:
   ```bash
   pod update StripePaymentSheet
   ```

#### Carthage

1. If you haven’t already, install the latest version of [Carthage](https://github.com/Carthage/Carthage#installing-carthage).
1. Add this line to your `Cartfile`:
   ```cartfile
   github "stripe/stripe-ios"
   ```
1. Follow the [Carthage installation instructions](https://github.com/Carthage/Carthage#if-youre-building-for-ios-tvos-or-watchos). Make sure to embed all of the required frameworks listed [here](https://github.com/stripe/stripe-ios/tree/master/StripePaymentSheet/README.md#manual-linking).
1. In the future, to update to the latest version of the SDK, run the following command:
   ```bash
   carthage update stripe-ios --platform ios
   ```

#### Manual Framework

1. Head to our [GitHub releases page](https://github.com/stripe/stripe-ios/releases/latest) and download and unzip **Stripe.xcframework.zip**.
1. Drag **StripePaymentSheet.xcframework** to the **Embedded Binaries** section of the **General** settings in your Xcode project. Make sure to select **Copy items if needed**.
1. Repeat step 2 for all required frameworks listed [here](https://github.com/stripe/stripe-ios/tree/master/StripePaymentSheet/README.md#manual-linking).
1. In the future, to update to the latest version of our SDK, repeat steps 1–3.

> For details on the latest SDK release and past versions, see the [Releases](https://github.com/stripe/stripe-ios/releases) page on GitHub. To receive notifications when a new release is published, [watch releases](https://help.github.com/en/articles/watching-and-unwatching-releases-for-a-repository#watching-releases-for-a-repository) for the repository.

Configure the SDK with your Stripe [publishable key](https://dashboard.stripe.com/test/apikeys) on app start. This enables your app to make requests to the Stripe API.

#### Swift

```swift
import UIKitimportStripePaymentSheet

@main
class AppDelegate: UIResponder, UIApplicationDelegate {

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {StripeAPI.defaultPublishableKey = "<<YOUR_PUBLISHABLE_KEY>>"
        // do any other necessary launch configuration
        return true
    }
}
```

> Use your [test keys](https://docs.stripe.com/keys.md#obtain-api-keys) while you test and develop, and your [live mode](https://docs.stripe.com/keys.md#test-live-modes) keys when you publish your app.

## Create a connected account

When a user (seller or service provider) signs up on your platform, create a user [Account](https://docs.stripe.com/api/accounts.md) (referred to as a *connected account*) so you can accept payments and move funds to their bank account. Connected accounts represent your user in Stripe’s API and help facilitate the collection of onboarding requirements so Stripe can verify the user’s identity. In our store builder example, the connected account represents the business setting up their online store.
![Account creation flow](https://b.stripecdn.com/docs-statics-srv/assets/standard-ios.10c6b24cef1d683d36f2264c726beb1d.png)

### Step 2.1: Create a connected account and prefill information (Server-side)

Use the `/v1/accounts` API to [create](https://docs.stripe.com/api/accounts/create.md) a connected account. You can create the connected account by using the [default connected account parameters](https://docs.stripe.com/connect/migrate-to-controller-properties.md), or by specifying the account type.

#### With default properties

```curl
curl -X POST https://api.stripe.com/v1/accounts \
  -u "<<YOUR_SECRET_KEY>>:"
```

```cli
stripe accounts create
```

```ruby
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
Stripe.api_key = '<<YOUR_SECRET_KEY>>'

account = Stripe::Account.create()
```

```ruby
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
client = Stripe::StripeClient.new("<<YOUR_SECRET_KEY>>")

account = client.v1.accounts.create()
```

```python
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
import stripe
stripe.api_key = "<<YOUR_SECRET_KEY>>"

account = stripe.Account.create()
```

```python
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
client = StripeClient("<<YOUR_SECRET_KEY>>")

account = client.accounts.create()
```

```php
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
$stripe = new \Stripe\StripeClient('<<YOUR_SECRET_KEY>>');

$account = $stripe->accounts->create([]);
```

```java
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
Stripe.apiKey = "<<YOUR_SECRET_KEY>>";

AccountCreateParams params = AccountCreateParams.builder().build();

Account account = Account.create(params);
```

```java
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeClient client = new StripeClient("<<YOUR_SECRET_KEY>>");

AccountCreateParams params = AccountCreateParams.builder().build();

Account account = client.accounts().create(params);
```

```node
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = require('stripe')('<<YOUR_SECRET_KEY>>');

const account = await stripe.accounts.create();
```

```go
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
stripe.Key = "<<YOUR_SECRET_KEY>>"

params := &stripe.AccountParams{}
result, err := account.New(params)
```

```go
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
sc := stripe.NewClient("<<YOUR_SECRET_KEY>>")
params := &stripe.AccountCreateParams{}
result, err := sc.V1Accounts.Create(context.TODO(), params)
```

```dotnet
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeConfiguration.ApiKey = "<<YOUR_SECRET_KEY>>";

var options = new AccountCreateOptions();
var service = new AccountService();
Account account = service.Create(options);
```

```dotnet
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
var options = new AccountCreateOptions();
var client = new StripeClient("<<YOUR_SECRET_KEY>>");
var service = client.V1.Accounts;
Account account = service.Create(options);
```

#### With account type

```curl
curl https://api.stripe.com/v1/accounts \
  -u "<<YOUR_SECRET_KEY>>:" \
  -d type=standard
```

```cli
stripe accounts create  \
  --type=standard
```

```ruby
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
Stripe.api_key = '<<YOUR_SECRET_KEY>>'

account = Stripe::Account.create({type: 'standard'})
```

```ruby
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
client = Stripe::StripeClient.new("<<YOUR_SECRET_KEY>>")

account = client.v1.accounts.create({type: 'standard'})
```

```python
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
import stripe
stripe.api_key = "<<YOUR_SECRET_KEY>>"

account = stripe.Account.create(type="standard")
```

```python
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
client = StripeClient("<<YOUR_SECRET_KEY>>")

account = client.accounts.create({"type": "standard"})
```

```php
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
$stripe = new \Stripe\StripeClient('<<YOUR_SECRET_KEY>>');

$account = $stripe->accounts->create(['type' => 'standard']);
```

```java
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
Stripe.apiKey = "<<YOUR_SECRET_KEY>>";

AccountCreateParams params =
  AccountCreateParams.builder().setType(AccountCreateParams.Type.STANDARD).build();

Account account = Account.create(params);
```

```java
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeClient client = new StripeClient("<<YOUR_SECRET_KEY>>");

AccountCreateParams params =
  AccountCreateParams.builder().setType(AccountCreateParams.Type.STANDARD).build();

Account account = client.accounts().create(params);
```

```node
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = require('stripe')('<<YOUR_SECRET_KEY>>');

const account = await stripe.accounts.create({
  type: 'standard',
});
```

```go
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
stripe.Key = "<<YOUR_SECRET_KEY>>"

params := &stripe.AccountParams{Type: stripe.String(stripe.AccountTypeStandard)}
result, err := account.New(params)
```

```go
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
sc := stripe.NewClient("<<YOUR_SECRET_KEY>>")
params := &stripe.AccountCreateParams{Type: stripe.String(stripe.AccountTypeStandard)}
result, err := sc.V1Accounts.Create(context.TODO(), params)
```

```dotnet
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeConfiguration.ApiKey = "<<YOUR_SECRET_KEY>>";

var options = new AccountCreateOptions { Type = "standard" };
var service = new AccountService();
Account account = service.Create(options);
```

```dotnet
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
var options = new AccountCreateOptions { Type = "standard" };
var client = new StripeClient("<<YOUR_SECRET_KEY>>");
var service = client.V1.Accounts;
Account account = service.Create(options);
```

If you’ve already collected information for your connected accounts, you can pre-fill that information on the `Account` object. You can pre-fill any account information, including personal and business information, external account information, and so on.

Connect Onboarding doesn’t ask for the prefilled information. However, it does ask the account holder to confirm the prefilled information before accepting the [Connect service agreement](https://docs.stripe.com/connect/service-agreement-types.md).

When testing your integration, prefill account information using [test data](https://docs.stripe.com/connect/testing.md).

### Step 2.2: Create an account link (Server-side)

You can create an account link by calling the [Account Links](https://docs.stripe.com/api/account_links.md) API with the following parameters:

- `account`
- `refresh_url`
- `return_url`
- `type` = `account_onboarding`

```curl
curl https://api.stripe.com/v1/account_links \
  -u "<<YOUR_SECRET_KEY>>:" \
  -d account="{{CONNECTEDACCOUNT_ID}}" \
  --data-urlencode refresh_url="https://example.com/reauth" \
  --data-urlencode return_url="https://example.com/return" \
  -d type=account_onboarding
```

```cli
stripe account_links create  \
  --account="{{CONNECTEDACCOUNT_ID}}" \
  --refresh-url="https://example.com/reauth" \
  --return-url="https://example.com/return" \
  --type=account_onboarding
```

```ruby
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
Stripe.api_key = '<<YOUR_SECRET_KEY>>'

account_link = Stripe::AccountLink.create({
  account: '{{CONNECTEDACCOUNT_ID}}',
  refresh_url: 'https://example.com/reauth',
  return_url: 'https://example.com/return',
  type: 'account_onboarding',
})
```

```ruby
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
client = Stripe::StripeClient.new("<<YOUR_SECRET_KEY>>")

account_link = client.v1.account_links.create({
  account: '{{CONNECTEDACCOUNT_ID}}',
  refresh_url: 'https://example.com/reauth',
  return_url: 'https://example.com/return',
  type: 'account_onboarding',
})
```

```python
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
import stripe
stripe.api_key = "<<YOUR_SECRET_KEY>>"

account_link = stripe.AccountLink.create(
  account="{{CONNECTEDACCOUNT_ID}}",
  refresh_url="https://example.com/reauth",
  return_url="https://example.com/return",
  type="account_onboarding",
)
```

```python
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
client = StripeClient("<<YOUR_SECRET_KEY>>")

account_link = client.account_links.create({
  "account": "{{CONNECTEDACCOUNT_ID}}",
  "refresh_url": "https://example.com/reauth",
  "return_url": "https://example.com/return",
  "type": "account_onboarding",
})
```

```php
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
$stripe = new \Stripe\StripeClient('<<YOUR_SECRET_KEY>>');

$accountLink = $stripe->accountLinks->create([
  'account' => '{{CONNECTEDACCOUNT_ID}}',
  'refresh_url' => 'https://example.com/reauth',
  'return_url' => 'https://example.com/return',
  'type' => 'account_onboarding',
]);
```

```java
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
Stripe.apiKey = "<<YOUR_SECRET_KEY>>";

AccountLinkCreateParams params =
  AccountLinkCreateParams.builder()
    .setAccount("{{CONNECTEDACCOUNT_ID}}")
    .setRefreshUrl("https://example.com/reauth")
    .setReturnUrl("https://example.com/return")
    .setType(AccountLinkCreateParams.Type.ACCOUNT_ONBOARDING)
    .build();

AccountLink accountLink = AccountLink.create(params);
```

```java
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeClient client = new StripeClient("<<YOUR_SECRET_KEY>>");

AccountLinkCreateParams params =
  AccountLinkCreateParams.builder()
    .setAccount("{{CONNECTEDACCOUNT_ID}}")
    .setRefreshUrl("https://example.com/reauth")
    .setReturnUrl("https://example.com/return")
    .setType(AccountLinkCreateParams.Type.ACCOUNT_ONBOARDING)
    .build();

AccountLink accountLink = client.accountLinks().create(params);
```

```node
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = require('stripe')('<<YOUR_SECRET_KEY>>');

const accountLink = await stripe.accountLinks.create({
  account: '{{CONNECTEDACCOUNT_ID}}',
  refresh_url: 'https://example.com/reauth',
  return_url: 'https://example.com/return',
  type: 'account_onboarding',
});
```

```go
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
stripe.Key = "<<YOUR_SECRET_KEY>>"

params := &stripe.AccountLinkParams{
  Account: stripe.String("{{CONNECTEDACCOUNT_ID}}"),
  RefreshURL: stripe.String("https://example.com/reauth"),
  ReturnURL: stripe.String("https://example.com/return"),
  Type: stripe.String("account_onboarding"),
}
result, err := accountlink.New(params)
```

```go
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
sc := stripe.NewClient("<<YOUR_SECRET_KEY>>")
params := &stripe.AccountLinkCreateParams{
  Account: stripe.String("{{CONNECTEDACCOUNT_ID}}"),
  RefreshURL: stripe.String("https://example.com/reauth"),
  ReturnURL: stripe.String("https://example.com/return"),
  Type: stripe.String("account_onboarding"),
}
result, err := sc.V1AccountLinks.Create(context.TODO(), params)
```

```dotnet
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeConfiguration.ApiKey = "<<YOUR_SECRET_KEY>>";

var options = new AccountLinkCreateOptions
{
    Account = "{{CONNECTEDACCOUNT_ID}}",
    RefreshUrl = "https://example.com/reauth",
    ReturnUrl = "https://example.com/return",
    Type = "account_onboarding",
};
var service = new AccountLinkService();
AccountLink accountLink = service.Create(options);
```

```dotnet
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
var options = new AccountLinkCreateOptions
{
    Account = "{{CONNECTEDACCOUNT_ID}}",
    RefreshUrl = "https://example.com/reauth",
    ReturnUrl = "https://example.com/return",
    Type = "account_onboarding",
};
var client = new StripeClient("<<YOUR_SECRET_KEY>>");
var service = client.V1.AccountLinks;
AccountLink accountLink = service.Create(options);
```

### Step 2.3: Redirect your user to the account link URL (Client-side)

The response to your [Account Links](https://docs.stripe.com/api/account_links.md) request includes a value for the key `url`. Redirect to this link to send your user into the flow. Account Links are temporary and are single-use only because they grant access to the connected account user’s personal information. Authenticate the user in your application before redirecting them to this URL. If you want to prefill information, you must do so before generating the account link. After you create the account link for a Standard account, you won’t be able to read or write information for the account.

> Don’t email, text, or otherwise send account link URLs outside your platform application. Instead, provide them to the authenticated account holder within your application.

#### Swift

```swift
import UIKit
import SafariServices

let BackendAPIBaseURL: String = "" // Set to the URL of your backend server

class ConnectOnboardViewController: UIViewController {

    // ...

    override func viewDidLoad() {
        super.viewDidLoad()

        let connectWithStripeButton = UIButton(type: .system)
        connectWithStripeButton.setTitle("Connect with Stripe", for: .normal)
        connectWithStripeButton.addTarget(self, action: #selector(didSelectConnectWithStripe), for: .touchUpInside)
        view.addSubview(connectWithStripeButton)

        // ...
    }

    @objc
    func didSelectConnectWithStripe() {
        if let url = URL(string: BackendAPIBaseURL)?.appendingPathComponent("onboard-user") {
          var request = URLRequest(url: url)
          request.httpMethod = "POST"
          let task = URLSession.shared.dataTask(with: request) { (data, response, error) in
              guard let data = data,
                  let json = try? JSONSerialization.jsonObject(with: data, options: []) as? [String : Any],
                  let accountURLString = json["url"] as? String,
                  let accountURL = URL(string: accountURLString) else {
                      // handle error
              }

              let safariViewController = SFSafariViewController(url: accountURL)
              safariViewController.delegate = self

              DispatchQueue.main.async {
                  self.present(safariViewController, animated: true, completion: nil)
              }
          }
        }
    }

    // ...
}

extension ConnectOnboardViewController: SFSafariViewControllerDelegate {
    func safariViewControllerDidFinish(_ controller: SFSafariViewController) {
        // the user may have closed the SFSafariViewController instance before a redirect
        // occurred. Sync with your backend to confirm the correct state
    }
}

```

#### Objective C

```objc
#import "ConnectOnboardViewController.h"

#import <SafariServices/SafariServices.h>

static NSString * const kBackendAPIBaseURL = @"";  // Set to the URL of your backend server

@interface ConnectOnboardViewController () <SFSafariViewControllerDelegate>
// ...
@end

@implementation ConnectOnboardViewController

// ...

- (void)viewDidLoad {
    [super viewDidLoad];

    UIButton *connectWithStripeButton = [UIButton buttonWithType:UIButtonTypeSystem];
    [connectWithStripeButton setTitle:@"Connect with Stripe" forState:UIControlStateNormal];
    [connectWithStripeButton addTarget:self action:@selector(_didSelectConnectWithStripe) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:connectWithStripeButton];

    // ...
}

- (void)_didSelectConnectWithStripe {
  NSURL *url = [NSURL URLWithString:[kBackendAPIBaseURL stringByAppendingPathComponent:@"onboard-user"]];
  NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
  request.HTTPMethod = @"POST";

  NSURLSessionTask *task = [[NSURLSession sharedSession] dataTaskWithRequest:request completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
      if (data != nil) {
          NSError *jsonError = nil;
          id json = [NSJSONSerialization JSONObjectWithData:data options:0 error:&jsonError];

          if (json != nil && [json isKindOfClass:[NSDictionary class]]) {
              NSDictionary *jsonDictionary = (NSDictionary *)json;
              NSURL *accountURL = [NSURL URLWithString:jsonDictionary[@"url"]];
              if (accountURL != nil) {
                  SFSafariViewController *safariViewController = [[SFSafariViewController alloc] initWithURL:accountURL];
                  safariViewController.delegate = self;

                  dispatch_async(dispatch_get_main_queue(), ^{
                      [self presentViewController:safariViewController animated:YES completion:nil];
                  });
              } else {
                  // handle  error
              }
          } else {
              // handle error
          }
      } else {
          // handle error
      }
  }];
  [task resume];
}

// ...

#pragma mark - SFSafariViewControllerDelegate
- (void)safariViewControllerDidFinish:(SFSafariViewController *)controller {
    // The user may have closed the SFSafariViewController instance before a redirect
    // occurred. Sync with your backend to confirm the correct state
}

@end

```

### Step 2.4: Handle the user returning to your platform (Client-side)

*Connect* (Connect is Stripe's solution for multi-party businesses, such as marketplace or software platforms, to route payments between sellers, customers, and other recipients) Onboarding requires you to pass both a `return_url` and `refresh_url` to handle all cases where the user is redirected to your platform. It’s important that you implement these correctly to provide the best experience for your user. You can set up a [universal link](https://developer.apple.com/documentation/xcode/allowing-apps-and-websites-to-link-to-your-content) to enable iOS to redirect to your app automatically.

#### return_url

Stripe issues a redirect to this URL when the user completes the Connect Onboarding flow. This doesn’t mean that all information has been collected or that there are no outstanding requirements on the account. This only means the flow was entered and exited properly.

No state is passed through this URL. After a user is redirected to your `return_url`, check the state of the `details_submitted` parameter on their account by doing either of the following:

- Listening to `account.updated` *webhooks* (A webhook is a real-time push notification sent to your application as a JSON payload through HTTPS requests)
- Calling the [Accounts](https://docs.stripe.com/api/accounts.md) API and inspecting the returned object

#### refresh_url

Your user is redirected to the `refresh_url` in these cases:

- The link is expired (a few minutes went by since the link was created)
- The user already visited the link (the user refreshed the page or clicked back or forward in the browser)
- Your platform is no longer able to access the account
- The account has been rejected

Your `refresh_url` should trigger a method on your server to call [Account Links](https://docs.stripe.com/api/account_links.md) again with the same parameters, and redirect the user to the Connect Onboarding flow to create a seamless experience.

### Step 2.5: Handle users that haven’t completed onboarding

A user that is redirected to your `return_url` might not have completed the onboarding process. Use the `/v1/accounts` endpoint to retrieve the user’s account and check for `charges_enabled`. If the account isn’t fully onboarded, provide UI prompts to allow the user to continue onboarding later. The user can complete their account activation through a new account link (generated by your integration). You can check the state of the `details_submitted` parameter on their account to see if they’ve completed the onboarding process.

## Enable payment methods

View your [payment methods settings](https://dashboard.stripe.com/settings/connect/payment_methods) and enable the payment methods you want to support. Card payments are enabled by default but you can enable and disable payment methods as needed.

## Add an endpoint [Server-side]

> #### Note
> 
> To display the PaymentSheet before you create a PaymentIntent, see [Collect payment details before creating an Intent](https://docs.stripe.com/payments/accept-a-payment-deferred.md?type=payment).

This integration uses three Stripe API objects:

1. [PaymentIntent](https://docs.stripe.com/api/payment_intents.md): Stripe uses this to represent your intent to collect payment from a customer, tracking your charge attempts and payment state changes throughout the process.

1. (Optional) [Customer](https://docs.stripe.com/api/customers.md): To set up a payment method for future payments, you must attach it to a *Customer* (Customer objects represent customers of your business. They let you reuse payment methods and give you the ability to track multiple payments). Create a Customer object when your customer creates an account with your business. If your customer is making a payment as a guest, you can create a Customer object before payment and associate it with your own internal representation of the customer’s account later.

1. (Optional) Customer Ephemeral Key: Information on the Customer object is sensitive, and can’t be retrieved directly from an app. An ephemeral key grants the SDK temporary access to the Customer.

> If you never save cards to a Customer and don’t allow returning Customers to reuse saved cards, you can omit the Customer and Customer Ephemeral Key objects from your integration.

For security reasons, your app can’t create these objects. Instead, add an endpoint on your server that:

1. Retrieves the Customer, or creates a new one.
1. Creates an Ephemeral Key for the Customer.
1. Creates a PaymentIntent with the [amount](https://docs.stripe.com/api/payment_intents/create.md#create_payment_intent-amount), [currency](https://docs.stripe.com/api/payment_intents/create.md#create_payment_intent-currency), and [customer](https://docs.stripe.com/api/payment_intents/create.md#create_payment_intent-customer). You can also optionally include the `automatic_payment_methods` parameter. Stripe enables its functionality by default in the latest version of the API.
1. Returns the Payment Intent’s *client secret* (The client secret is a unique key returned from Stripe as part of a PaymentIntent. This key lets the client access important fields from the PaymentIntent (status, amount, currency) while hiding sensitive ones (metadata, customer)), the Ephemeral Key’s `secret`, the Customer’s [id](https://docs.stripe.com/api/customers/object.md#customer_object-id), and your [publishable key](https://dashboard.stripe.com/apikeys) to your app.

The payment methods shown to customers during the checkout process are also included on the PaymentIntent. You can let Stripe pull payment methods from your Dashboard settings or you can list them manually. Regardless of the option you choose, note that the currency passed in the PaymentIntent filters the payment methods shown to the customer. For example, if you pass `eur` on the PaymentIntent and have OXXO enabled in the Dashboard, OXXO won’t be shown to the customer because OXXO doesn’t support `eur` payments.

Unless your integration requires a code-based option for offering payment methods, Stripe recommends the automated option. This is because Stripe evaluates the currency, payment method restrictions, and other parameters to determine the list of supported payment methods. Payment methods that increase conversion and that are most relevant to the currency and customer’s location are prioritised.

#### Manage payment methods from the Dashboard

> You can fork and deploy an implementation of this endpoint on [CodeSandbox](https://codesandbox.io/p/devbox/suspicious-lalande-l325w6) for testing.

You can manage payment methods from the [Dashboard](https://dashboard.stripe.com/settings/payment_methods). Stripe handles the return of eligible payment methods based on factors such as the transaction’s amount, currency, and payment flow. The PaymentIntent is created using the payment methods you configured in the Dashboard. If you don’t want to use the Dashboard or if you want to specify payment methods manually, you can list them using the `payment_method_types` attribute.

#### curl

```bash
# Create a Customer (use an existing Customer ID if this is a returning customer)
curl https://api.stripe.com/v1/customers \
  -u <<YOUR_SECRET_KEY>>: \
  -X "POST"

# Create an Ephemeral Key for the Customer
curl https://api.stripe.com/v1/ephemeral_keys \
  -u <<YOUR_SECRET_KEY>>: \
  -H "Stripe-Version: 2025-07-30.basil" \
  -X "POST" \
  -d "customer"="{{CUSTOMER_ID}}" \

# Create a PaymentIntent
curl https://api.stripe.com/v1/payment_intents \
  -u <<YOUR_SECRET_KEY>>: \
  -H "Stripe-Account: {{CONNECTED_ACCOUNT_ID}}"
  -X "POST" \
  -d "customer"="{{CUSTOMER_ID}}" \
  -d "amount"=1099 \
  -d "currency"="eur" \
  # In the latest version of the API, specifying the `automatic_payment_methods` parameter
  # is optional because Stripe enables its functionality by default.
  -d "automatic_payment_methods[enabled]"=true \
  -d application_fee_amount="123" \
```

#### Ruby

```ruby
# This example sets up an endpoint using the Sinatra framework.


# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
Stripe.api_key = '<<YOUR_SECRET_KEY>>'

post '/payment-sheet' do
  # Use an existing Customer ID if this is a returning customer
  customer = Stripe::Customer.create
  ephemeralKey = Stripe::EphemeralKey.create({
    customer: customer['id'],
  }, {stripe_version: '2025-07-30.basil'})
  paymentIntent = Stripe::PaymentIntent.create({
    amount: 1099,
    currency: 'eur',
    customer: customer['id'],
    # In the latest version of the API, specifying the `automatic_payment_methods` parameter
    # is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
    application_fee_amount: 123,
  }, {stripe_account: '{{CONNECTED_ACCOUNT_ID}}'})
  {
    paymentIntent: paymentIntent['client_secret'],
    ephemeralKey: ephemeralKey['secret'],
    customer: customer['id'],
    publishableKey: '<<YOUR_PUBLISHABLE_KEY>>'
  }.to_json
end
```

#### Python

```python
# This example sets up an endpoint using the Flask framework.
# Watch this video to get started: https://youtu.be/7Ul1vfmsDck.

# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
stripe.api_key = '<<YOUR_SECRET_KEY>>'

@app.route('/payment-sheet', methods=['POST'])
def payment_sheet():
  # Use an existing Customer ID if this is a returning customer
  customer = stripe.Customer.create()
  ephemeralKey = stripe.EphemeralKey.create(
    customer=customer['id'],
    stripe_version='2025-07-30.basil',
  )

  paymentIntent = stripe.PaymentIntent.create(
    amount=1099,
    currency='eur',
    customer=customer['id'],
    # In the latest version of the API, specifying the `automatic_payment_methods` parameter
    # is optional because Stripe enables its functionality by default.
    automatic_payment_methods={
      'enabled': True,
    },
    application_fee_amount=123,
    stripe_account='{{CONNECTED_ACCOUNT_ID}}',
  )
  return jsonify(paymentIntent=paymentIntent.client_secret,
                 ephemeralKey=ephemeralKey.secret,
                 customer=customer.id,
                 publishableKey='<<YOUR_PUBLISHABLE_KEY>>')
```

#### PHP

```php
<?php
require 'vendor/autoload.php';
$stripe = new \Stripe\StripeClient('<<YOUR_SECRET_KEY>>');

// Use an existing Customer ID if this is a returning customer.
$customer = $stripe->customers->create();
$ephemeralKey = $stripe->ephemeralKeys->create([
  'customer' => $customer->id,
], [
  'stripe_version' => '2025-07-30.basil',
]);

$paymentIntent = $stripe->paymentIntents->create([
  'amount' => 1099,
  'currency' => 'eur',
  'customer' => $customer->id,
  // In the latest version of the API, specifying the `automatic_payment_methods` parameter
  // is optional because Stripe enables its functionality by default.
  'automatic_payment_methods' => [
    'enabled' => 'true',
  ],
  'application_fee_amount' => 123,
], ['stripe_account' => '{{CONNECTED_ACCOUNT_ID}}'
]);

echo json_encode(
  [
    'paymentIntent' => $paymentIntent->client_secret,
    'ephemeralKey' => $ephemeralKey->secret,
    'customer' => $customer->id,
    'publishableKey' => '<<YOUR_PUBLISHABLE_KEY>>'
  ]
);
http_response_code(200);
```

#### Java

```java

// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
Stripe.apiKey = "<<YOUR_SECRET_KEY>>";

post(
  "/payment-sheet",
  (request, response) -> {
    response.type("application/json");

    // Use an existing Customer ID if this is a returning customer.
    CustomerCreateParams customerParams = CustomerCreateParams.builder().build();
    Customer customer = Customer.create(customerParams);
    EphemeralKeyCreateParams ephemeralKeyParams =
      EphemeralKeyCreateParams.builder()
        .setStripeVersion("2025-07-30.basil")
        .setCustomer(customer.getId())
        .build();

    EphemeralKey ephemeralKey = EphemeralKey.create(ephemeralKeyParams);
    RequestOptions requestOptions = RequestOptions.builder()
      .setStripeAccount("{{CONNECTED_ACCOUNT_ID}}")
      .build();
    PaymentIntentCreateParams paymentIntentParams =
    PaymentIntentCreateParams.builder()
      .setAmount(1099L)
      .setCurrency("eur")
      .setCustomer(customer.getId())
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter
      // is optional because Stripe enables its functionality by default.
      .setAutomaticPaymentMethods(
        PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
          .setEnabled(true)
          .build()
      )
      .setApplicationFeeAmount(123L)
      .build();

    PaymentIntent paymentIntent = PaymentIntent.create(paymentIntentParams, requestOptions);

    Map<String, String> responseData = new HashMap();
    responseData.put("paymentIntent", paymentIntent.getClientSecret());
    responseData.put("ephemeralKey", ephemeralKey.getSecret());

    responseData.put("customer", customer.getId());
    responseData.put("publishableKey", "<<YOUR_PUBLISHABLE_KEY>>");

    return gson.toJson(responseData);
});
```

#### Node

```javascript

const stripe = require('stripe')('<<YOUR_SECRET_KEY>>');
// This example sets up an endpoint using the Express framework.

app.post('/payment-sheet', async (req, res) => {
  // Use an existing Customer ID if this is a returning customer.
  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    {customer: customer.id},
    {apiVersion: '2025-07-30.basil'}
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1099,
    currency: 'eur',
    customer: customer.id,
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter
    // is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
    application_fee_amount: 123,
  }, {
    stripeAccount: '{{CONNECTED_ACCOUNT_ID}}',
  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey: '<<YOUR_PUBLISHABLE_KEY>>'
  });
});
```

#### Go

```go

// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
stripe.Key = "<<YOUR_SECRET_KEY>>"

func handlePaymentSheet(w http.ResponseWriter, r *http.Request) {
  if r.Method != "POST" {
    http.Error(w, http.StatusText(http.StatusMethodNotAllowed), http.StatusMethodNotAllowed)
    return
  }

  // Use an existing Customer ID if this is a returning customer.
  cparams := &stripe.CustomerParams{}
  c, _ := customer.New(cparams)

  ekparams := &stripe.EphemeralKeyParams{
    Customer: stripe.String(c.ID),
    StripeVersion: stripe.String("2025-07-30.basil"),
  }
  ek, _ := ephemeralKey.New(ekparams)

  piparams := &stripe.PaymentIntentParams{
    Amount:   stripe.Int64(1099),
    Currency: stripe.String(string(stripe.CurrencyEUR)),
    Customer: stripe.String(c.ID),
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter
    // is optional because Stripe enables its functionality by default.
    AutomaticPaymentMethods: &stripe.PaymentIntentAutomaticPaymentMethodsParams{
      Enabled: stripe.Bool(true),
    },
    ApplicationFeeAmount: stripe.Int64(123),
  }
  piparams.SetStripeAccount(""{{CONNECTED_ACCOUNT_ID}}""),
  pi, _ := paymentintent.New(piparams)

  writeJSON(w, struct {
    PaymentIntent  string `json:"paymentIntent"`
    EphemeralKey   string `json:"ephemeralKey"`
    Customer       string `json:"customer"`
    PublishableKey string `json:"publishableKey"`
  }{
    PaymentIntent: pi.ClientSecret,
    EphemeralKey: ek.Secret,
    Customer: c.ID,
    PublishableKey: "<<YOUR_PUBLISHABLE_KEY>>",
  })
}
```

#### .NET

```dotnet

// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeConfiguration.ApiKey = "<<YOUR_SECRET_KEY>>";

[HttpPost("payment-sheet")]
public ActionResult<PaymentSheetCreateResponse> CreatePaymentSheet([FromBody] CreatePaymentSheetRequest req)
{
  // Use an existing Customer ID if this is a returning customer.
  var customerOptions = new CustomerCreateOptions();
  var customerService = new CustomerService();
  var customer = customerService.Create(customerOptions);
  var ephemeralKeyOptions = new EphemeralKeyCreateOptions
  {
    Customer = customer.Id,
    StripeVersion = "2025-07-30.basil",
  };
  var ephemeralKeyService = new EphemeralKeyService();
  var ephemeralKey = ephemeralKeyService.Create(ephemeralKeyOptions);

  var paymentIntentOptions = new PaymentIntentCreateOptions
  {
    Amount = 1099,
    Currency = "eur",
    Customer = customer.Id,
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter
    // is optional because Stripe enables its functionality by default.
    AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
    {
      Enabled = true,
    },
    ApplicationFeeAmount = 123,
  };
  var requestOptions = new RequestOptions
  {
    StripeAccount = ""{{CONNECTED_ACCOUNT_ID}}"",
  };
  var paymentIntentService = new PaymentIntentService();
  PaymentIntent paymentIntent = paymentIntentService.Create(paymentIntentOptions, requestOptions);

  return new PaymentSheetCreateResponse
  {
    PaymentIntent = paymentIntent.ClientSecret,
    EphemeralKey = ephemeralKey.Secret,

    Customer = customer.Id,
    PublishableKey = "<<YOUR_PUBLISHABLE_KEY>>",
  };
}
```

#### Listing payment methods manually

> You can fork and deploy an implementation of this endpoint on [CodeSandbox](https://codesandbox.io/p/devbox/suspicious-lalande-l325w6) for testing.

#### curl

```bash
# Create a Customer (use an existing Customer ID if this is a returning customer)
curl https://api.stripe.com/v1/customers \
  -u <<YOUR_SECRET_KEY>>: \
  -X "POST"

# Create an Ephemeral Key for the Customer
curl https://api.stripe.com/v1/ephemeral_keys \
  -u <<YOUR_SECRET_KEY>>: \
  -X "POST" \
  -d "customer"="{{CUSTOMER_ID}}" \

# Create a PaymentIntent
curl https://api.stripe.com/v1/payment_intents \
  -u <<YOUR_SECRET_KEY>>: \
  -H "Stripe-Account: {{CONNECTED_ACCOUNT_ID}}"
  -X "POST" \
  -d "customer"="{{CUSTOMER_ID}}" \
  -d "amount"=1099 \
  -d "currency"="eur" \
  -d "payment_method_types[]"="bancontact" \
  -d "payment_method_types[]"="card" \
  -d "payment_method_types[]"="ideal" \
  -d "payment_method_types[]"="klarna" \
  -d "payment_method_types[]"="sepa_debit" \
  -d application_fee_amount="123" \
```

#### Ruby

```ruby
# This example sets up an endpoint using the Sinatra framework.



post '/payment-sheet' do
  # Use an existing Customer ID if this is a returning customer
  customer = Stripe::Customer.create
  ephemeralKey = Stripe::EphemeralKey.create({
    customer: customer['id'],
  }, {stripe_version: '2025-07-30.basil'})
  paymentIntent = Stripe::PaymentIntent.create({
    amount: 1099,
    currency: 'eur',
    customer: customer['id'],
    payment_method_types: ['bancontact', 'card', 'ideal', 'klarna', 'sepa_debit'],
    application_fee_amount: 123,
  }, {stripe_account: '{{CONNECTED_ACCOUNT_ID}}'})
  {
    paymentIntent: paymentIntent['client_secret'],
    ephemeralKey: ephemeralKey['secret'],
    customer: customer['id'],
    publishableKey: '<<YOUR_PUBLISHABLE_KEY>>'
  }.to_json
end
```

#### Python

```python
# This example sets up an endpoint using the Flask framework.
# Watch this video to get started: https://youtu.be/7Ul1vfmsDck.


@app.route('/payment-sheet', methods=['POST'])
def payment_sheet():
  # Use an existing Customer ID if this is a returning customer
  customer = stripe.Customer.create()
  ephemeralKey = stripe.EphemeralKey.create(
    customer=customer['id'],
    stripe_version='2025-07-30.basil',
  )

  paymentIntent = stripe.PaymentIntent.create(
    amount=1099,
    currency='eur',
    customer=customer['id'],
    payment_method_types=["bancontact", "card", "ideal", "klarna", "sepa_debit"],
    application_fee_amount=123,
    stripe_account='{{CONNECTED_ACCOUNT_ID}}',
  )
  return jsonify(paymentIntent=paymentIntent.client_secret,
                 ephemeralKey=ephemeralKey.secret,
                 customer=customer.id,
                 publishableKey='<<YOUR_PUBLISHABLE_KEY>>')
```

#### PHP

```php
<?php
require 'vendor/autoload.php';
$stripe = new \Stripe\StripeClient('<<YOUR_SECRET_KEY>>');

// Use an existing Customer ID if this is a returning customer.
$customer = $stripe->customers->create();
$ephemeralKey = $stripe->ephemeralKeys->create([
  'customer' => $customer->id,
], [
  'stripe_version' => '2025-07-30.basil',
]);

$paymentIntent = $stripe->paymentIntents->create([
  'amount' => 1099,
  'currency' => 'eur',
  'customer' => $customer->id,
  'payment_method_types' => ['bancontact', 'card', 'ideal', 'klarna', 'sepa_debit'],
  'application_fee_amount' => 123,
], ['stripe_account' => '{{CONNECTED_ACCOUNT_ID}}'
]);

echo json_encode(
  [
    'paymentIntent' => $paymentIntent->client_secret,
    'ephemeralKey' => $ephemeralKey->secret,
    'customer' => $customer->id,
    'publishableKey' => '<<YOUR_PUBLISHABLE_KEY>>'
  ]
);
http_response_code(200);
```

#### Java

```java
// This example sets up an endpoint using the Spark framework.

post("/payment-sheet", (request, response) -> {
  response.type("application/json");

  // Use an existing Customer ID if this is a returning customer.
  CustomerCreateParams customerParams = CustomerCreateParams.builder().build();
  Customer customer = Customer.create(customerParams);
  EphemeralKeyCreateParams ephemeralKeyParams =
    EphemeralKeyCreateParams.builder()
      .setStripeVersion("2025-07-30.basil")
      .setCustomer(customer.getId())
      .build();

  EphemeralKey ephemeralKey = EphemeralKey.create(ephemeralKeyParams);

  List<String> paymentMethodTypes = new ArrayList<String>();
  paymentMethodTypes.add("bancontact");
  paymentMethodTypes.add("card");
  paymentMethodTypes.add("ideal");
  paymentMethodTypes.add("klarna");
  paymentMethodTypes.add("sepa_debit");
  RequestOptions requestOptions = RequestOptions.builder()
    .setStripeAccount("{{CONNECTED_ACCOUNT_ID}}")
    .build();

  PaymentIntentCreateParams paymentIntentParams =
  PaymentIntentCreateParams.builder()
    .setAmount(1099L)
    .setCurrency("eur")
    .setCustomer(customer.getId())
    .addAllPaymentMethodType(paymentMethodTypes)
    .setApplicationFeeAmount(123L)
    .build();

  PaymentIntent paymentIntent = PaymentIntent.create(paymentIntentParams, requestOptions);

  Map<String, String> responseData = new HashMap();
  responseData.put("paymentIntent", paymentIntent.getClientSecret());
  responseData.put("ephemeralKey", ephemeralKey.getSecret());
  responseData.put("customer", customer.getId());
  responseData.put("publishableKey", "<<YOUR_PUBLISHABLE_KEY>>");

  return gson.toJson(responseData);
});
```

#### Node

```javascript

// This example sets up an endpoint using the Express framework.

app.post('/payment-sheet', async (req, res) => {
  // Use an existing Customer ID if this is a returning customer.
  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    {customer: customer.id},
    {apiVersion: '2025-07-30.basil'}
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1099,
    currency: 'eur',
    customer: customer.id,
    payment_method_types: ['bancontact', 'card', 'ideal', 'klarna', 'sepa_debit'],
    application_fee_amount: 123,
  }, {
    stripeAccount: '{{CONNECTED_ACCOUNT_ID}}',
  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey: '<<YOUR_PUBLISHABLE_KEY>>'
  });
});
```

#### Go

```go

// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
stripe.Key = "<<YOUR_SECRET_KEY>>"

func handlePaymentSheet(w http.ResponseWriter, r *http.Request) {
  if r.Method != "POST" {
    http.Error(w, http.StatusText(http.StatusMethodNotAllowed), http.StatusMethodNotAllowed)
    return
  }

  // Use an existing Customer ID if this is a returning customer.
  cparams := &stripe.CustomerParams{}
  c, _ := customer.New(cparams)

  ekparams := &stripe.EphemeralKeyParams{
    Customer: stripe.String(c.ID),
    StripeVersion: stripe.String("2025-07-30.basil"),
  }
  ek, _ := ephemeralKey.New(ekparams)

  piparams := &stripe.PaymentIntentParams{
    Amount:   stripe.Int64(1099),
    Currency: stripe.String(string(stripe.CurrencyEUR)),
    Customer: stripe.String(c.ID),
    PaymentMethodTypes: []*string{
      stripe.String("bancontact"),
      stripe.String("card"),
      stripe.String("ideal"),
      stripe.String("klarna"),
      stripe.String("sepa_debit"),
    },
    ApplicationFeeAmount: stripe.Int64(123),
  }
  piparams.SetStripeAccount(""{{CONNECTED_ACCOUNT_ID}}""),
  pi, _ := paymentintent.New(piparams)

  writeJSON(w, struct {
    PaymentIntent  string `json:"paymentIntent"`
    EphemeralKey   string `json:"ephemeralKey"`
    Customer       string `json:"customer"`
    PublishableKey string `json:"publishableKey"`
  }{
    PaymentIntent: pi.ClientSecret,
    EphemeralKey: ek.Secret,
    Customer: c.ID,
    PublishableKey: "<<YOUR_PUBLISHABLE_KEY>>",
  })
}
```

#### .NET

```dotnet

// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeConfiguration.ApiKey = "<<YOUR_SECRET_KEY>>";

[HttpPost("payment-sheet")]
public ActionResult<PaymentSheetCreateResponse> CreatePaymentSheet([FromBody] CreatePaymentSheetRequest req)
{
  // Use an existing Customer ID if this is a returning customer.
  var customerOptions = new CustomerCreateOptions();
  var customerService = new CustomerService();
  var customer = customerService.Create(customerOptions);
  var ephemeralKeyOptions = new EphemeralKeyCreateOptions
  {
    Customer = customer.Id,
    StripeVersion = "2025-07-30.basil",
  };
  var ephemeralKeyService = new EphemeralKeyService();
  var ephemeralKey = ephemeralKeyService.Create(ephemeralKeyOptions);

  var paymentIntentOptions = new PaymentIntentCreateOptions
  {
    Amount = 1099,
    Currency = "eur",
    Customer = customer.Id,
    PaymentMethodTypes = new List<string>
    {
      "bancontact",
      "card",
      "ideal",
      "klarna",
      "sepa_debit",
    },
    ApplicationFeeAmount = 123,
  };
  var requestOptions = new RequestOptions
  {
    StripeAccount = ""{{CONNECTED_ACCOUNT_ID}}"",
  };
  var paymentIntentService = new PaymentIntentService();
  PaymentIntent paymentIntent = paymentIntentService.Create(paymentIntentOptions, requestOptions);

  return new PaymentSheetCreateResponse
  {
    PaymentIntent = paymentIntent.ClientSecret,
    EphemeralKey = ephemeralKey.Secret,

    Customer = customer.Id,
    PublishableKey = "<<YOUR_PUBLISHABLE_KEY>>",
  };
}
```

> Each payment method needs to support the currency passed in the PaymentIntent and your business needs to be based in one of the countries each payment method supports. See the [Payment method integration options](https://docs.stripe.com/payments/payment-methods/integration-options.md) page for more details about what’s supported.

## Integrate the payment sheet [Client-side]

To display the mobile Payment Element on your checkout screen, make sure you:

- Display the products the customer is purchasing along with the total amount
- Use the [Address Element](https://docs.stripe.com/elements/address-element.md?platform=ios) to collect any required shipping information from the customer
- Add a checkout button to display Stripe’s UI

#### UIKit

In your app’s checkout screen, fetch the PaymentIntent client secret, ephemeral key secret, Customer ID, and publishable key from the endpoint you created in the previous step. Set your publishable key using `StripeAPI.shared` and initialise [PaymentSheet](https://stripe.dev/stripe-ios/stripe-paymentsheet/Classes/PaymentSheet.html).

Then, set `StripeAPI.shared.stripeAccount` to the connected account ID.

#### iOS (Swift)

```swift
import UIKit
import StripePaymentSheet

class CheckoutViewController: UIViewController {
  @IBOutlet weak var checkoutButton: UIButton!
  var paymentSheet: PaymentSheet?
  let backendCheckoutUrl = URL(string: "Your backend endpoint/payment-sheet")! // Your backend endpoint

  override func viewDidLoad() {
    super.viewDidLoad()

    checkoutButton.addTarget(self, action: #selector(didTapCheckoutButton), for: .touchUpInside)
    checkoutButton.isEnabled = false

    // MARK: Fetch the PaymentIntent client secret, Ephemeral Key secret, Customer ID, and publishable key
    var request = URLRequest(url: backendCheckoutUrl)
    request.httpMethod = "POST"
    let task = URLSession.shared.dataTask(with: request, completionHandler: { [weak self] (data, response, error) in
      guard let data = data,
            let json = try? JSONSerialization.jsonObject(with: data, options: []) as? [String : Any],
            let customerId = json["customer"] as? String,
            let customerEphemeralKeySecret = json["ephemeralKey"] as? String,
            let paymentIntentClientSecret = json["paymentIntent"] as? String,
            let publishableKey = json["publishableKey"] as? String,
            let self = self else {
        // Handle error
        return
      }
STPAPIClient.shared.publishableKey = publishableKeySTPAPIClient.shared.stripeAccount = ""{{CONNECTED_ACCOUNT_ID}}""// MARK: Create a PaymentSheet instance
      var configuration = PaymentSheet.Configuration()
      configuration.merchantDisplayName = "Example, Inc."
      configuration.customer = .init(id: customerId, ephemeralKeySecret: customerEphemeralKeySecret)
      // Set `allowsDelayedPaymentMethods` to true if your business handles
      // delayed notification payment methods like US bank accounts.
      configuration.allowsDelayedPaymentMethods = true
      self.paymentSheet = PaymentSheet(paymentIntentClientSecret:paymentIntentClientSecret, configuration: configuration)

      DispatchQueue.main.async {
        self.checkoutButton.isEnabled = true
      }
    })
    task.resume()
  }

}
```

When the customer taps the **Checkout** button, call `present` to present the PaymentSheet. After the customer completes the payment, Stripe dismisses the PaymentSheet and calls the completion block with [PaymentSheetResult](https://stripe.dev/stripe-ios/stripe-paymentsheet/Enums/PaymentSheetResult.html).

#### iOS (Swift)

```swift
@objc
func didTapCheckoutButton() {
  // MARK: Start the checkout process
  paymentSheet?.present(from: self) { paymentResult in
    // MARK: Handle the payment result
    switch paymentResult {
    case .completed:
      print("Your order is confirmed")
    case .canceled:
      print("Canceled!")
    case .failed(let error):
      print("Payment failed: \(error)")
    }
  }
}
```

#### SwiftUI

Create an `ObservableObject` model for your checkout screen. This model publishes a [PaymentSheet](https://stripe.dev/stripe-ios/stripe-paymentsheet/Classes/PaymentSheet.html) and a [PaymentSheetResult](https://stripe.dev/stripe-ios/stripe-paymentsheet/Enums/PaymentSheetResult.html).

```swift
import StripePaymentSheet
import SwiftUI

class CheckoutViewModel: ObservableObject {
  let backendCheckoutUrl = URL(string: "Your backend endpoint/payment-sheet")! // Your backend endpoint
  @Published var paymentSheet: PaymentSheet?
  @Published var paymentResult: PaymentSheetResult?
}
```

In your app’s checkout screen, fetch the PaymentIntent client secret, ephemeral key secret, Customer ID, and publishable key from the endpoint you created in the previous step. Use `StripeAPI.shared` to set your publishable key and initialise the [PaymentSheet](https://stripe.dev/stripe-ios/stripe-paymentsheet/Classes/PaymentSheet.html).

Then, set `StripeAPI.shared.stripeAccount` to the connected account ID.

```swift
import StripePaymentSheet
import SwiftUI

class CheckoutViewModel: ObservableObject {
  let backendCheckoutUrl = URL(string: "Your backend endpoint/payment-sheet")! // Your backend endpoint
  @Published var paymentSheet: PaymentSheet?
  @Published var paymentResult: PaymentSheetResult?
func preparePaymentSheet() {
    // MARK: Fetch thePaymentIntent and Customer information from the backend
    var request = URLRequest(url: backendCheckoutUrl)
    request.httpMethod = "POST"
    let task = URLSession.shared.dataTask(with: request, completionHandler: { [weak self] (data, response, error) in
      guard let data = data,
            let json = try? JSONSerialization.jsonObject(with: data, options: []) as? [String : Any],
            let customerId = json["customer"] as? String,
            let customerEphemeralKeySecret = json["ephemeralKey"] as? String,
            letpaymentIntentClientSecret = json["paymentIntent"] as? String,
            let publishableKey = json["publishableKey"] as? String,
            let self = self else {
        // Handle error
        return
      }

      STPAPIClient.shared.publishableKey = publishableKeySTPAPIClient.shared.stripeAccount = ""{{CONNECTED_ACCOUNT_ID}}""// MARK: Create a PaymentSheet instance
      var configuration = PaymentSheet.Configuration()
      configuration.merchantDisplayName = "Example, Inc."
      configuration.customer = .init(id: customerId, ephemeralKeySecret: customerEphemeralKeySecret)
      // Set `allowsDelayedPaymentMethods` to true if your business handles
      // delayed notification payment methods like US bank accounts.
      configuration.allowsDelayedPaymentMethods = true

      DispatchQueue.main.async {
        self.paymentSheet = PaymentSheet(paymentIntentClientSecret:paymentIntentClientSecret, configuration: configuration)
      }
    })
    task.resume()
  }
}
struct CheckoutView: View {
  @ObservedObject var model = CheckoutViewModel()

  var body: some View {
    VStack {
      if model.paymentSheet != nil {
        Text("Ready to pay.")
      } else {
        Text("Loading…")
      }
    }.onAppear { model.preparePaymentSheet() }
  }
}
```

Add a [PaymentSheet.PaymentButton](https://stripe.dev/stripe-ios/stripe-paymentsheet/Classes/PaymentSheet/PaymentButton.html) to your `View`. This behaves similarly to a SwiftUI `Button`, which allows you to customise it by adding a `View`. When you click the button, it displays the PaymentSheet. After you complete the payment, Stripe dismisses the PaymentSheet and calls the `onCompletion` handler with a [PaymentSheetResult](https://stripe.dev/stripe-ios/stripe-paymentsheet/Enums/PaymentSheetResult.html) object.

```swift
import StripePaymentSheet
import SwiftUI

class CheckoutViewModel: ObservableObject {
  let backendCheckoutUrl = URL(string: "Your backend endpoint/payment-sheet")! // Your backend endpoint
  @Published var paymentSheet: PaymentSheet?
  @Published var paymentResult: PaymentSheetResult?

  func preparePaymentSheet() {
    // MARK: Fetch the PaymentIntent and Customer information from the backend
    var request = URLRequest(url: backendCheckoutUrl)
    request.httpMethod = "POST"
    let task = URLSession.shared.dataTask(with: request, completionHandler: { [weak self] (data, response, error) in
      guard let data = data,
            let json = try? JSONSerialization.jsonObject(with: data, options: []) as? [String : Any],
            let customerId = json["customer"] as? String,
            let customerEphemeralKeySecret = json["ephemeralKey"] as? String,
            let paymentIntentClientSecret = json["paymentIntent"] as? String,
            let publishableKey = json["publishableKey"] as? String,
            let self = self else {
        // Handle error
        return
      }

      STPAPIClient.shared.publishableKey = publishableKey
      STPAPIClient.shared.stripeAccount = ""{{CONNECTED_ACCOUNT_ID}}""
      // MARK: Create a PaymentSheet instance
      var configuration = PaymentSheet.Configuration()
      configuration.merchantDisplayName = "Example, Inc."
      configuration.customer = .init(id: customerId, ephemeralKeySecret: customerEphemeralKeySecret)
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment methods
      // that complete payment after a delay, like SEPA Debit and Sofort.
      configuration.allowsDelayedPaymentMethods = true

      DispatchQueue.main.async {
        self.paymentSheet = PaymentSheet(paymentIntentClientSecret: paymentIntentClientSecret, configuration: configuration)
      }
    })
    task.resume()
  }
func onPaymentCompletion(result: PaymentSheetResult) {
    self.paymentResult = result
  }
}

struct CheckoutView: View {
  @ObservedObject var model = CheckoutViewModel()

  var body: some View {
    VStack {if let paymentSheet = model.paymentSheet {
        PaymentSheet.PaymentButton(
          paymentSheet: paymentSheet,
          onCompletion: model.onPaymentCompletion
        ) {
          Text("Buy")
        }
      } else {
        Text("Loading…")
      }if let result = model.paymentResult {
        switch result {
        case .completed:
          Text("Payment complete")
        case .failed(let error):
          Text("Payment failed: \(error.localizedDescription)")
        case .canceled:
          Text("Payment canceled.")
        }
      }
    }.onAppear { model.preparePaymentSheet() }
  }
}
```

If `PaymentSheetResult` is `.completed`, inform the user (for example, by displaying an order confirmation screen).

Setting `allowsDelayedPaymentMethods` to true allows [delayed notification](https://docs.stripe.com/payments/payment-methods.md#payment-notification) payment methods like US bank accounts. For these payment methods, the final payment status isn’t known when the `PaymentSheet` completes, and instead succeeds or fails later. If you support these types of payment methods, inform the customer their order is confirmed and only fulfil their order (for example, ship their product) when the payment is successful.

## Set up a return URL [Client-side]

The customer might navigate away from your app to authenticate (for example, in Safari or their banking app). To allow them to automatically return to your app after authenticating, [configure a custom URL scheme](https://developer.apple.com/documentation/xcode/defining-a-custom-url-scheme-for-your-app) and set up your app delegate to forward the URL to the SDK. Stripe doesn’t support [universal links](https://developer.apple.com/documentation/xcode/allowing-apps-and-websites-to-link-to-your-content).

#### SceneDelegate

#### Swift

```swift
// This method handles opening custom URL schemes (for example, "your-app://stripe-redirect")
func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
    guard let url = URLContexts.first?.url else {
        return
    }
    let stripeHandled = StripeAPI.handleURLCallback(with: url)
    if (!stripeHandled) {
        // This was not a Stripe url – handle the URL normally as you would
    }
}

```

#### Objective C

```objc
// This method handles opening custom URL schemes (for example, "your-app://stripe-redirect")
- (void)scene:(UIScene *)scene openURLContexts:(NSSet<UIOpenURLContext *> *)URLContexts {
    NSURL *url = URLContexts.allObjects.firstObject.URL;
    BOOL stripeHandled = [StripeAPI handleStripeURLCallbackWithURL:url];
    if (!stripeHandled) {
        // This was not a stripe url – do whatever url handling your app
        // normally does, if any.
    }
}
```

#### AppDelegate

#### Swift

```swift
// This method handles opening custom URL schemes (for example, "your-app://stripe-redirect")
func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
    let stripeHandled = StripeAPI.handleURLCallback(with: url)
    if (stripeHandled) {
        return true
    } else {
        // This was not a Stripe url – handle the URL normally as you would
    }
    return false
}
```

#### Objective C

```objc
// This method handles opening custom URL schemes (for example, "your-app://stripe-redirect")
- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
    BOOL stripeHandled = [StripeAPI handleStripeURLCallbackWithURL:url];
    if (stripeHandled) {
        return YES;
    } else {
        // This was not a Stripe url – handle the URL normally as you would
    }
    return NO;
}
```

#### SwiftUI

#### Swift

```swift

@main
struct MyApp: App {
  var body: some Scene {
    WindowGroup {
      Text("Hello, world!").onOpenURL { incomingURL in
          let stripeHandled = StripeAPI.handleURLCallback(with: incomingURL)
          if (!stripeHandled) {
            // This was not a Stripe url – handle the URL normally as you would
          }
        }
    }
  }
}
```

## Handle post-payment events [Server-side]

Stripe sends a [payment_intent.succeeded](https://docs.stripe.com/api/events/types.md#event_types-payment_intent.succeeded) event when the payment completes. Use the [Dashboard webhook tool](https://dashboard.stripe.com/webhooks) or follow the [webhook guide](https://docs.stripe.com/webhooks/quickstart.md) to receive these events and run actions, such as sending an order confirmation email to your customer, logging the sale in a database, or starting a shipping workflow.

Listen for these events rather than waiting on a callback from the client. On the client, the customer could close the browser window or quit the app before the callback executes, and malicious clients could manipulate the response. Setting up your integration to listen for asynchronous events is what enables you to accept [different types of payment methods](https://stripe.com/payments/payment-methods-guide) with a single integration.

In addition to handling the `payment_intent.succeeded` event, we recommend handling these other events when collecting payments with the Payment Element:

| Event                                                                                                                           | Description                                                                                                                                                                                                                                                                         | Action                                                                                                                                                                                           |
| ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [payment_intent.succeeded](https://docs.stripe.com/api/events/types.md?lang=php#event_types-payment_intent.succeeded)           | Sent when a customer successfully completes a payment.                                                                                                                                                                                                                              | Send the customer an order confirmation and *fulfill* (Fulfillment is the process of providing the goods or services purchased by a customer, typically after payment is collected) their order. |
| [payment_intent.processing](https://docs.stripe.com/api/events/types.md?lang=php#event_types-payment_intent.processing)         | Sent when a customer successfully initiates a payment, but the payment has yet to complete. This event is most commonly sent when the customer initiates a bank debit. It’s followed by either a `payment_intent.succeeded` or `payment_intent.payment_failed` event in the future. | Send the customer an order confirmation that indicates their payment is pending. For digital goods, you might want to fulfill the order before waiting for payment to complete.                  |
| [payment_intent.payment_failed](https://docs.stripe.com/api/events/types.md?lang=php#event_types-payment_intent.payment_failed) | Sent when a customer attempts a payment, but the payment fails.                                                                                                                                                                                                                     | If a payment transitions from `processing` to `payment_failed`, offer the customer another attempt to pay.                                                                                       |

## Test the integration

#### Cards

| Card number         | Scenario                                                                                                                                                                                                                                                                                      | How to test                                                                                           |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| 4242424242424242    | The card payment succeeds and doesn’t require authentication.                                                                                                                                                                                                                                 | Fill in the credit card form using the credit card number with any expiry date, CVC, and postal code. |
| 4000002500003155    | The card payment requires *authentication* (Strong Customer Authentication (SCA) is a regulatory requirement in effect as of September 14, 2019, that impacts many European online payments. It requires customers to use two-factor authentication like 3D Secure to verify their purchase). | Fill in the credit card form using the credit card number with any expiry date, CVC, and postal code. |
| 4000000000009995    | The card is declined with a decline code like `insufficient_funds`.                                                                                                                                                                                                                           | Fill in the credit card form using the credit card number with any expiry date, CVC, and postal code. |
| 6205500000000000004 | The UnionPay card has a variable length of 13-19 digits.                                                                                                                                                                                                                                      | Fill in the credit card form using the credit card number with any expiry date, CVC, and postal code. |

#### Bank redirects

| Payment method    | Scenario                                                                                                                                                                                              | How to test                                                                                                                                              |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bancontact, iDEAL | Your customer fails to authenticate on the redirect page for a redirect-based and immediate notification payment method.                                                                              | Choose any redirect-based payment method, fill out the required details, and confirm the payment. Then click **Fail test payment** on the redirect page. |
| Pay by Bank       | Your customer successfully pays with a redirect-based and [delayed notification](https://docs.stripe.com/payments/payment-methods.md#payment-notification) payment method.                            | Choose the payment method, fill out the required details, and confirm the payment. Then click **Complete test payment** on the redirect page.            |
| Pay by Bank       | Your customer fails to authenticate on the redirect page for a redirect-based and delayed notification payment method.                                                                                | Choose the payment method, fill out the required details, and confirm the payment. Then click **Fail test payment** on the redirect page.                |
| BLIK              | BLIK payments fail in a variety of ways – immediate failures (for example, the code has expired or is invalid), delayed errors (the bank declines) or timeouts (the customer didn’t respond in time). | Use email patterns to [simulate the different failures.](https://docs.stripe.com/payments/blik/accept-a-payment.md#simulate-failures)                    |

#### Bank debits

| Payment method    | Scenario                                                                                          | How to test                                                                                                                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SEPA Direct Debit | Your customer successfully pays with SEPA Direct Debit.                                           | Fill out the form using the account number `AT321904300235473204`. The confirmed PaymentIntent initially transitions to processing, then transitions to the succeeded status three minutes later. |
| SEPA Direct Debit | Your customer’s payment intent status transitions from `processing` to `requires_payment_method`. | Fill out the form using the account number `AT861904300235473202`.                                                                                                                                |

See [Testing](https://docs.stripe.com/testing.md) for additional information to test your integration.

## Optional: Enable Apple Pay

> If your checkout screen has a dedicated **Apple Pay button**, follow the [Apple Pay guide](https://docs.stripe.com/apple-pay.md#present-payment-sheet) and use `ApplePayContext` to collect payment from your Apple Pay button. You can use `PaymentSheet` to handle other payment method types.

### Register for an Apple Merchant ID

Obtain an Apple Merchant ID by [registering for a new identifier](https://developer.apple.com/account/resources/identifiers/add/merchant) on the Apple Developer website.

Fill out the form with a description and identifier. Your description is for your own records and you can modify it in the future. Stripe recommends using the name of your app as the identifier (for example, `merchant.com.{{YOUR_APP_NAME}}`).

### Create a new Apple Pay certificate

Create a certificate for your app to encrypt payment data.

Go to the [iOS Certificate Settings](https://dashboard.stripe.com/settings/ios_certificates) in the Dashboard, click **Add new application**, and follow the guide.

Download a Certificate Signing Request (CSR) file to get a secure certificate from Apple that allows you to use Apple Pay.

One CSR file must be used to issue exactly one certificate. If you switch your Apple Merchant ID, you must go to the [iOS Certificate Settings](https://dashboard.stripe.com/settings/ios_certificates) in the Dashboard to obtain a new CSR and certificate.

### Integrate with Xcode

Add the Apple Pay capability to your app. In Xcode, open your project settings, click the **Signing & Capabilities** tab, and add the **Apple Pay** capability. You might be prompted to log in to your developer account at this point. Select the merchant ID you created earlier, and your app is ready to accept Apple Pay.
![](https://b.stripecdn.com/docs-statics-srv/assets/xcode.a701d4c1922d19985e9c614a6f105bf1.png)

Enable the Apple Pay capability in Xcode

### Add Apple Pay

#### One-time payment

To add Apple Pay to PaymentSheet, set [applePay](https://stripe.dev/stripe-ios/stripe-paymentsheet/Classes/PaymentSheet/Configuration.html#/s:6Stripe12PaymentSheetC13ConfigurationV8applePayAC05ApplefD0VSgvp) after initialising `PaymentSheet.Configuration` with your Apple merchant ID and the [country code of your business](https://dashboard.stripe.com/settings/account).

#### iOS (Swift)

```swift
var configuration = PaymentSheet.Configuration()
configuration.applePay = .init(
  merchantId: "merchant.com.your_app_name",
  merchantCountryCode: "US"
)
```

#### Recurring payments

To add Apple Pay to PaymentSheet, set [applePay](https://stripe.dev/stripe-ios/stripe-paymentsheet/Classes/PaymentSheet/Configuration.html#/s:6Stripe12PaymentSheetC13ConfigurationV8applePayAC05ApplefD0VSgvp) after initialising `PaymentSheet.Configuration` with your Apple merchant ID and the [country code of your business](https://dashboard.stripe.com/settings/account).

As per [Apple’s guidelines](https://developer.apple.com/design/human-interface-guidelines/apple-pay#Supporting-subscriptions) for recurring payments, you must also set additional attributes on the `PKPaymentRequest`. Add a handler in [ApplePayConfiguration.paymentRequestHandlers](https://stripe.dev/stripe-ios/stripepaymentsheet/documentation/stripepaymentsheet/paymentsheet/applepayconfiguration/handlers/paymentrequesthandler) to configure the [PKPaymentRequest.paymentSummaryItems](https://developer.apple.com/documentation/passkit/pkpaymentrequest/1619231-paymentsummaryitems) with the amount you intend to charge (for example, 9.95 USD a month).

You can also adopt [merchant tokens](https://developer.apple.com/apple-pay/merchant-tokens/) by setting the `recurringPaymentRequest` or `automaticReloadPaymentRequest` properties on the `PKPaymentRequest`.

To learn more about how to use recurring payments with Apple Pay, see [Apple’s PassKit documentation](https://developer.apple.com/documentation/passkit/pkpaymentrequest).

#### iOS (Swift)

```swift
let customHandlers = PaymentSheet.ApplePayConfiguration.Handlers(
    paymentRequestHandler: { request in
        // PKRecurringPaymentSummaryItem is available on iOS 15 or later
        if #available(iOS 15.0, *) {
            let billing = PKRecurringPaymentSummaryItem(label: "My Subscription", amount: NSDecimalNumber(string: "59.99"))

            // Payment starts today
            billing.startDate = Date()

            // Payment ends in one year
            billing.endDate = Date().addingTimeInterval(60 * 60 * 24 * 365)

            // Pay once a month.
            billing.intervalUnit = .month
            billing.intervalCount = 1

            // recurringPaymentRequest is only available on iOS 16 or later
            if #available(iOS 16.0, *) {
                request.recurringPaymentRequest = PKRecurringPaymentRequest(paymentDescription: "Recurring",
                                                                            regularBilling: billing,
                                                                            managementURL: URL(string: "https://my-backend.example.com/customer-portal")!)
                request.recurringPaymentRequest?.billingAgreement = "You'll be billed $59.99 every month for the next 12 months. To cancel at any time, go to Account and click 'Cancel Membership.'"
            }
            request.paymentSummaryItems = [billing]
            request.currencyCode = "USD"
        } else {
            // On older iOS versions, set alternative summary items.
            request.paymentSummaryItems = [PKPaymentSummaryItem(label: "Monthly plan starting July 1, 2022", amount: NSDecimalNumber(string: "59.99"), type: .final)]
        }
        return request
    }
)
var configuration = PaymentSheet.Configuration()
configuration.applePay = .init(merchantId: "merchant.com.your_app_name",
                                merchantCountryCode: "US",
                                customHandlers: customHandlers)
```

### Order tracking

To add [order tracking](https://developer.apple.com/design/human-interface-guidelines/technologies/wallet/designing-order-tracking) information in iOS 16 or later, configure an [authorizationResultHandler](https://stripe.dev/stripe-ios/stripepaymentsheet/documentation/stripepaymentsheet/paymentsheet/applepayconfiguration/handlers/authorizationresulthandler) in your `PaymentSheet.ApplePayConfiguration.Handlers`. Stripe calls your implementation after the payment is complete, but before iOS dismisses the Apple Pay sheet.

In your `authorizationResultHandler` implementation, fetch the order details from your server for the completed order. Add the details to the provided [PKPaymentAuthorizationResult](https://developer.apple.com/documentation/passkit/pkpaymentauthorizationresult) and call the provided completion handler.

To learn more about order tracking, see [Apple’s Wallet Orders documentation](https://developer.apple.com/documentation/walletorders).

#### iOS (Swift)

```swift
let customHandlers = PaymentSheet.ApplePayConfiguration.Handlers(
    authorizationResultHandler: { result, completion in
        // Fetch the order details from your service
        MyAPIClient.shared.fetchOrderDetails(orderID: orderID) { myOrderDetails
            result.orderDetails = PKPaymentOrderDetails(
                orderTypeIdentifier: myOrderDetails.orderTypeIdentifier, // "com.myapp.order"
                orderIdentifier: myOrderDetails.orderIdentifier, // "ABC123-AAAA-1111"
                webServiceURL: myOrderDetails.webServiceURL, // "https://my-backend.example.com/apple-order-tracking-backend"
                authenticationToken: myOrderDetails.authenticationToken) // "abc123"
            // Call the completion block on the main queue with your modified PKPaymentAuthorizationResult
            completion(result)
        }
    }
)
var configuration = PaymentSheet.Configuration()
configuration.applePay = .init(merchantId: "merchant.com.your_app_name",
                               merchantCountryCode: "US",
                               customHandlers: customHandlers)
```

## Optional: Enable card scanning

To enable card scanning support, set the `NSCameraUsageDescription` (**Privacy - Camera Usage Description**) in the Info.plist of your application, and provide a reason for accessing the camera (for example, “To scan cards”). Devices with iOS 13 or higher support card scanning.

## Optional: Customize the sheet

All customisation is configured through the [PaymentSheet.Configuration](https://stripe.dev/stripe-ios/stripe-paymentsheet/Classes/PaymentSheet/Configuration.html) object.

### Appearance

Customise colours, fonts, and so on to match the look and feel of your app by using the [appearance API](https://docs.stripe.com/elements/appearance-api.md?platform=ios).

### Payment method layout

Configure the layout of payment methods in the sheet using [paymentMethodLayout](https://stripe.dev/stripe-ios/stripepaymentsheet/documentation/stripepaymentsheet/paymentsheet/configuration-swift.struct/paymentmethodlayout). You can display them horizontally, vertically, or let Stripe optimise the layout automatically.
![](https://b.stripecdn.com/docs-statics-srv/assets/ios-mpe-payment-method-layouts.9d0513e2fcec5660378ba1824d952054.png)

#### Swift

```swift
var configuration = PaymentSheet.Configuration()
configuration.paymentMethodLayout = .automatic
```

### Collect users addresses

Collect local and international shipping or billing addresses from your customers using the [Address Element](https://docs.stripe.com/elements/address-element.md?platform=ios).

### Merchant display name

Specify a customer-facing business name by setting [merchantDisplayName](https://stripe.dev/stripe-ios/stripe-paymentsheet/Classes/PaymentSheet/Configuration.html#/s:18StripePaymentSheet0bC0C13ConfigurationV19merchantDisplayNameSSvp). By default, this is your app’s name.

#### Swift

```swift
var configuration = PaymentSheet.Configuration()
configuration.merchantDisplayName = "My app, Inc."
```

### Dark mode

`PaymentSheet` automatically adapts to the user’s system-wide appearance settings (light and dark mode). If your app doesn’t support dark mode, you can set [style](https://stripe.dev/stripe-ios/stripe-paymentsheet/Classes/PaymentSheet/Configuration.html#/s:18StripePaymentSheet0bC0C13ConfigurationV5styleAC18UserInterfaceStyleOvp) to `alwaysLight` or `alwaysDark` mode.

```swift
var configuration = PaymentSheet.Configuration()
configuration.style = .alwaysLight
```

### Default billing details

To set default values for billing details collected in the payment sheet, configure the `defaultBillingDetails` property. The `PaymentSheet` pre-populates its fields with the values that you provide.

```swift
var configuration = PaymentSheet.Configuration()
configuration.defaultBillingDetails.address.country = "US"
configuration.defaultBillingDetails.email = "foo@bar.com"
```

### Billing details collection

Use `billingDetailsCollectionConfiguration` to specify how you want to collect billing details in the payment sheet.

You can collect your customer’s name, email, phone number, and address.

If you only want to billing details required by the payment method, set `billingDetailsCollectionConfiguration.attachDefaultsToPaymentMethod` to true. In that case, the `PaymentSheet.Configuration.defaultBillingDetails` are set as the payment method’s [billing details](https://docs.stripe.com/api/payment_methods/object.md?lang=node#payment_method_object-billing_details).

If you want to collect additional billing details that aren’t necessarily required by the payment method, set `billingDetailsCollectionConfiguration.attachDefaultsToPaymentMethod` to false. In that case, the billing details collected through the `PaymentSheet` are set as the payment method’s billing details.

```swift
var configuration = PaymentSheet.Configuration()
configuration.defaultBillingDetails.email = "foo@bar.com"
configuration.billingDetailsCollectionConfiguration.name = .always
configuration.billingDetailsCollectionConfiguration.email = .never
configuration.billingDetailsCollectionConfiguration.address = .full
configuration.billingDetailsCollectionConfiguration.attachDefaultsToPaymentMethod = true
```

> Consult with your legal counsel regarding laws that apply to collecting information. Only collect phone numbers if you need them for the transaction.

## Optional: Complete payment in your UI

You can present the Payment Sheet to only collect payment method details and then later call a `confirm` method to complete payment in your app’s UI. This is useful if you have a custom buy button or require additional steps after you collect payment details.
![](https://b.stripecdn.com/docs-statics-srv/assets/ios-multi-step.cd631ea4f1cd8cf3f39b6b9e1e92b6c5.png)

Complete the payment in your app’s UI

#### UIKit

The following steps walk you through how to complete payment in your app’s UI. See our sample integration out on [GitHub](https://github.com/stripe/stripe-ios/blob/master/Example/PaymentSheet%20Example/PaymentSheet%20Example/ExampleCustomCheckoutViewController.swift).

1. First, initialise [PaymentSheet.FlowController](https://stripe.dev/stripe-ios/stripepaymentsheet/documentation/stripepaymentsheet/paymentsheet/flowcontroller) instead of `PaymentSheet` and update your UI with its `paymentOption` property. This property contains an image and label representing the customer’s initially selected, default payment method.

```swift
PaymentSheet.FlowController.create(paymentIntentClientSecret: paymentIntentClientSecret, configuration: configuration) { [weak self] result in
  switch result {
  case .failure(let error):
    print(error)
  case .success(let paymentSheetFlowController):
    self?.paymentSheetFlowController = paymentSheetFlowController
    // Update your UI using paymentSheetFlowController.paymentOption
  }
}
```

1. Next, call `presentPaymentOptions` to collect payment details. When completed, update your UI again with the `paymentOption` property.

```swift
paymentSheetFlowController.presentPaymentOptions(from: self) {
  // Update your UI using paymentSheetFlowController.paymentOption
}
```

1. Finally, call `confirm`.

```swift
paymentSheetFlowController.confirm(from: self) { paymentResult in
  // MARK: Handle the payment result
  switch paymentResult {
  case .completed:
    print("Payment complete!")
  case .canceled:
    print("Canceled!")
  case .failed(let error):
    print(error)
  }
}
```

#### SwiftUI

The following steps walk you through how to complete payment in your app’s UI. See our sample integration out on [GitHub](https://github.com/stripe/stripe-ios/blob/master/Example/PaymentSheet%20Example/PaymentSheet%20Example/ExampleSwiftUICustomPaymentFlow.swift).

1. First, initialise [PaymentSheet.FlowController](https://stripe.dev/stripe-ios/stripepaymentsheet/documentation/stripepaymentsheet/paymentsheet/flowcontroller) instead of `PaymentSheet`. Its `paymentOption` property contains an image and label representing the customer’s currently selected payment method, which you can use in your UI.

```swift
PaymentSheet.FlowController.create(paymentIntentClientSecret: paymentIntentClientSecret, configuration: configuration) { [weak self] result in
  switch result {
  case .failure(let error):
    print(error)
  case .success(let paymentSheetFlowController):
    self?.paymentSheetFlowController = paymentSheetFlowController
    // Use the paymentSheetFlowController.paymentOption properties in your UI
    myPaymentMethodLabel = paymentSheetFlowController.paymentOption?.label ?? "Select a payment method"
    myPaymentMethodImage = paymentSheetFlowController.paymentOption?.image ?? UIImage(systemName: "square.and.pencil")!
  }
}
```

1. Use [PaymentSheet.FlowController.PaymentOptionsButton](https://stripe.dev/stripe-ios/stripepaymentsheet/documentation/stripepaymentsheet/paymentsheet/flowcontroller/paymentoptionsbutton) to wrap the button that presents the sheet to collect payment details. When `PaymentSheet.FlowController` calls the `onSheetDismissed` argument, the `paymentOption` for the `PaymentSheet.FlowController` instance reflects the currently selected payment method.

```swift
PaymentSheet.FlowController.PaymentOptionsButton(
  paymentSheetFlowController: paymentSheetFlowController,
  onSheetDismissed: {
    myPaymentMethodLabel = paymentSheetFlowController.paymentOption?.label ?? "Select a payment method"
    myPaymentMethodImage = paymentSheetFlowController.paymentOption?.image ?? UIImage(systemName: "square.and.pencil")!
  },
  content: {
    /* An example button */
    HStack {
      Text(myPaymentMethodLabel)
      Image(uiImage: myPaymentMethodImage)
    }
  }
)
```

1. Use [PaymentSheet.FlowController.PaymentOptionsButton](https://stripe.dev/stripe-ios/stripepaymentsheet/documentation/stripepaymentsheet/paymentsheet/flowcontroller/paymentoptionsbutton) to wrap the button that confirms the payment.

```swift
PaymentSheet.FlowController.ConfirmButton(
  paymentSheetFlowController: paymentSheetFlowController,
  onCompletion: { result in
    // MARK: Handle the payment result
    switch result {
    case .completed:
      print("Payment complete!")
    case .canceled:
      print("Canceled!")
    case .failed(let error):
      print(error)
    }
  },
  content: {
    /* An example button */
    Text("Pay")
  }
)
```

If `PaymentSheetResult` is `.completed`, inform the user (for example, by displaying an order confirmation screen).

Setting `allowsDelayedPaymentMethods` to true allows [delayed notification](https://docs.stripe.com/payments/payment-methods.md#payment-notification) payment methods like US bank accounts. For these payment methods, the final payment status isn’t known when the `PaymentSheet` completes, and instead succeeds or fails later. If you support these types of payment methods, inform the customer their order is confirmed and only fulfil their order (for example, ship their product) when the payment is successful.

## Testing

Test your account creation flow by [creating accounts](https://docs.stripe.com/connect/testing.md#creating-accounts) and [using OAuth](https://docs.stripe.com/connect/testing.md#using-oauth). Test your **Payment methods** settings for your connected accounts by logging into one of your test accounts and navigating to the [Payment methods settings](https://dashboard.stripe.com/settings/payment_methods). Test your checkout flow with your test keys and a test account. You can use our [test cards](https://docs.stripe.com/testing.md) to test your payments flow and simulate various payment outcomes.


# Card element only

> This is a Card element only for when platform is ios and mobile-ui is card-element. View the full page at https://docs.stripe.com/connect/enable-payment-acceptance-guide?platform=ios&mobile-ui=card-element.

Securely collect card information on the client with [STPPaymentCardTextField](https://stripe.dev/stripe-ios/stripe-payments-ui/Classes/STPPaymentCardTextField.html), a drop-in UI component provided by the SDK that collects the card number, expiration date, CVC, and postal code.
![](https://d37ugbyn3rpeym.cloudfront.net/docs/mobile/ios/card-field.mp4)
## Prerequisites

### Prerequisites

- [ ] [Register your platform](https://dashboard.stripe.com/connect)

- [ ] Add business details to [activate your account](https://dashboard.stripe.com/account/onboarding)

- [ ] [Complete your platform profile](https://dashboard.stripe.com/connect/settings/profile)

- [ ] [Customise brand settings](https://dashboard.stripe.com/settings/connect/stripe-dashboard/branding)
Add a business name, icon, and brand colour.

## Set up Stripe [Server-side] [Client-side]

### Server-side

This integration requires endpoints on your server that talk to the Stripe API. Use the official libraries for access to the Stripe API from your server:

#### Ruby

```bash
# Available as a gem
sudo gem install stripe
```

```ruby
# If you use bundler, you can add this line to your Gemfile
gem 'stripe'
```

#### Python

```bash
# Install through pip
pip3 install --upgrade stripe
```

```bash
# Or find the Stripe package on http://pypi.python.org/pypi/stripe/
```

```python
# Find the version you want to pin:
# https://github.com/stripe/stripe-python/blob/master/CHANGELOG.md
# Specify that version in your requirements.txt file
stripe>=5.0.0
```

#### PHP

```bash
# Install the PHP library with Composer
composer require stripe/stripe-php
```

```bash
# Or download the source directly: https://github.com/stripe/stripe-php/releases
```

#### Java

```java
/*
  For Gradle, add the following dependency to your build.gradle and replace with
  the version number you want to use from:
  - https://mvnrepository.com/artifact/com.stripe/stripe-java or
  - https://github.com/stripe/stripe-java/releases/latest
*/
implementation "com.stripe:stripe-java:29.0.0"
```

```xml
<!--
  For Maven, add the following dependency to your POM and replace with the
  version number you want to use from:
  - https://mvnrepository.com/artifact/com.stripe/stripe-java or
  - https://github.com/stripe/stripe-java/releases/latest
-->
<dependency>
  <groupId>com.stripe</groupId>
  <artifactId>stripe-java</artifactId>
  <version>29.0.0</version>
</dependency>
```

```bash
# For other environments, manually install the following JARs:
# - The Stripe JAR from https://github.com/stripe/stripe-java/releases/latest
# - Google Gson from https://github.com/google/gson
```

#### Node

```bash
# Install with npm
npm install stripe --save
```

#### Go

```bash
# Make sure your project is using Go Modules
go mod init
# Install stripe-go
go get -u github.com/stripe/stripe-go/v82
```

```go
// Then import the package
import (
  "github.com/stripe/stripe-go/v82"
)
```

#### .NET

```bash
# Install with dotnet
dotnet add package Stripe.net
dotnet restore
```

```bash
# Or install with NuGet
Install-Package Stripe.net
```

### Client-side

The [Stripe iOS SDK](https://github.com/stripe/stripe-ios) is open source, [fully documented](https://stripe.dev/stripe-ios/index.html), and compatible with apps supporting iOS 13 or above.

#### Swift Package Manager

To install the SDK, follow these steps:

1. In Xcode, select **File** > **Add Package Dependencies…** and enter `https://github.com/stripe/stripe-ios-spm` as the repository URL.
1. Select the latest version number from our [releases page](https://github.com/stripe/stripe-ios/releases).
1. Add the **StripePaymentsUI** product to the [target of your app](https://developer.apple.com/documentation/swift_packages/adding_package_dependencies_to_your_app).

#### CocoaPods

1. If you haven’t already, install the latest version of [CocoaPods](https://guides.cocoapods.org/using/getting-started.html).
1. If you don’t have an existing [Podfile](https://guides.cocoapods.org/syntax/podfile.html), run the following command to create one:
   ```bash
   pod init
   ```
1. Add this line to your `Podfile`:
   ```podfile
   pod 'StripePaymentsUI'
   ```
1. Run the following command:
   ```bash
   pod install
   ```
1. Don’t forget to use the `.xcworkspace` file to open your project in Xcode, instead of the `.xcodeproj` file, from here on out.
1. In the future, to update to the latest version of the SDK, run:
   ```bash
   pod update StripePaymentsUI
   ```

#### Carthage

1. If you haven’t already, install the latest version of [Carthage](https://github.com/Carthage/Carthage#installing-carthage).
1. Add this line to your `Cartfile`:
   ```cartfile
   github "stripe/stripe-ios"
   ```
1. Follow the [Carthage installation instructions](https://github.com/Carthage/Carthage#if-youre-building-for-ios-tvos-or-watchos). Make sure to embed all of the required frameworks listed [here](https://github.com/stripe/stripe-ios/tree/master/StripePaymentsUI/README.md#manual-linking).
1. In the future, to update to the latest version of the SDK, run the following command:
   ```bash
   carthage update stripe-ios --platform ios
   ```

#### Manual Framework

1. Head to our [GitHub releases page](https://github.com/stripe/stripe-ios/releases/latest) and download and unzip **Stripe.xcframework.zip**.
1. Drag **StripePaymentsUI.xcframework** to the **Embedded Binaries** section of the **General** settings in your Xcode project. Make sure to select **Copy items if needed**.
1. Repeat step 2 for all required frameworks listed [here](https://github.com/stripe/stripe-ios/tree/master/StripePaymentsUI/README.md#manual-linking).
1. In the future, to update to the latest version of our SDK, repeat steps 1–3.

> For details on the latest SDK release and past versions, see the [Releases](https://github.com/stripe/stripe-ios/releases) page on GitHub. To receive notifications when a new release is published, [watch releases](https://help.github.com/en/articles/watching-and-unwatching-releases-for-a-repository#watching-releases-for-a-repository) for the repository.

Configure the SDK with your Stripe [publishable key](https://dashboard.stripe.com/test/apikeys) on app start. This enables your app to make requests to the Stripe API.

#### Swift

```swift
import UIKitimportStripePaymentsUI

@main
class AppDelegate: UIResponder, UIApplicationDelegate {

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {StripeAPI.defaultPublishableKey = "<<YOUR_PUBLISHABLE_KEY>>"
        // do any other necessary launch configuration
        return true
    }
}
```

#### Objective-C

```objc
#import "AppDelegate.h"@import StripeCore;

@implementation AppDelegate
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {[StripeAPI setDefaultPublishableKey:@"<<YOUR_PUBLISHABLE_KEY>>"];
    // do any other necessary launch configuration
    return YES;
}
@end
```

> Use your [test keys](https://docs.stripe.com/keys.md#obtain-api-keys) while you test and develop, and your [live mode](https://docs.stripe.com/keys.md#test-live-modes) keys when you publish your app.

## Create a connected account

Use this guide to learn how to use code to create a connected account. If you’re not ready to integrate yet, you can start by creating a connected account [through the dashboard](https://docs.stripe.com/connect/dashboard/managing-individual-accounts.md).

When a user (seller or service provider) signs up on your platform, create a user [Account](https://docs.stripe.com/api/accounts.md) (referred to as a *connected account*) so you can accept payments and move funds to their bank account. Connected accounts represent your user in Stripe’s API and help facilitate the collection of onboarding requirements so Stripe can verify the user’s identity. In our store builder example, the connected account represents the business setting up their online store.
![](https://b.stripecdn.com/docs-statics-srv/assets/standard-ios.10c6b24cef1d683d36f2264c726beb1d.png)

### Step 2.1: Create a connected account and prefill information (Server-side)

Use the `/v1/accounts` API to [create](https://docs.stripe.com/api/accounts/create.md) a connected account. You can create the connected account by using the [default connected account parameters](https://docs.stripe.com/connect/migrate-to-controller-properties.md), or by specifying the account type.

#### With default properties

```curl
curl -X POST https://api.stripe.com/v1/accounts \
  -u "<<YOUR_SECRET_KEY>>:"
```

```cli
stripe accounts create
```

```ruby
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
Stripe.api_key = '<<YOUR_SECRET_KEY>>'

account = Stripe::Account.create()
```

```ruby
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
client = Stripe::StripeClient.new("<<YOUR_SECRET_KEY>>")

account = client.v1.accounts.create()
```

```python
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
import stripe
stripe.api_key = "<<YOUR_SECRET_KEY>>"

account = stripe.Account.create()
```

```python
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
client = StripeClient("<<YOUR_SECRET_KEY>>")

account = client.accounts.create()
```

```php
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
$stripe = new \Stripe\StripeClient('<<YOUR_SECRET_KEY>>');

$account = $stripe->accounts->create([]);
```

```java
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
Stripe.apiKey = "<<YOUR_SECRET_KEY>>";

AccountCreateParams params = AccountCreateParams.builder().build();

Account account = Account.create(params);
```

```java
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeClient client = new StripeClient("<<YOUR_SECRET_KEY>>");

AccountCreateParams params = AccountCreateParams.builder().build();

Account account = client.accounts().create(params);
```

```node
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = require('stripe')('<<YOUR_SECRET_KEY>>');

const account = await stripe.accounts.create();
```

```go
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
stripe.Key = "<<YOUR_SECRET_KEY>>"

params := &stripe.AccountParams{}
result, err := account.New(params)
```

```go
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
sc := stripe.NewClient("<<YOUR_SECRET_KEY>>")
params := &stripe.AccountCreateParams{}
result, err := sc.V1Accounts.Create(context.TODO(), params)
```

```dotnet
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeConfiguration.ApiKey = "<<YOUR_SECRET_KEY>>";

var options = new AccountCreateOptions();
var service = new AccountService();
Account account = service.Create(options);
```

```dotnet
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
var options = new AccountCreateOptions();
var client = new StripeClient("<<YOUR_SECRET_KEY>>");
var service = client.V1.Accounts;
Account account = service.Create(options);
```

#### With account type

```curl
curl https://api.stripe.com/v1/accounts \
  -u "<<YOUR_SECRET_KEY>>:" \
  -d type=standard
```

```cli
stripe accounts create  \
  --type=standard
```

```ruby
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
Stripe.api_key = '<<YOUR_SECRET_KEY>>'

account = Stripe::Account.create({type: 'standard'})
```

```ruby
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
client = Stripe::StripeClient.new("<<YOUR_SECRET_KEY>>")

account = client.v1.accounts.create({type: 'standard'})
```

```python
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
import stripe
stripe.api_key = "<<YOUR_SECRET_KEY>>"

account = stripe.Account.create(type="standard")
```

```python
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
client = StripeClient("<<YOUR_SECRET_KEY>>")

account = client.accounts.create({"type": "standard"})
```

```php
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
$stripe = new \Stripe\StripeClient('<<YOUR_SECRET_KEY>>');

$account = $stripe->accounts->create(['type' => 'standard']);
```

```java
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
Stripe.apiKey = "<<YOUR_SECRET_KEY>>";

AccountCreateParams params =
  AccountCreateParams.builder().setType(AccountCreateParams.Type.STANDARD).build();

Account account = Account.create(params);
```

```java
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeClient client = new StripeClient("<<YOUR_SECRET_KEY>>");

AccountCreateParams params =
  AccountCreateParams.builder().setType(AccountCreateParams.Type.STANDARD).build();

Account account = client.accounts().create(params);
```

```node
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = require('stripe')('<<YOUR_SECRET_KEY>>');

const account = await stripe.accounts.create({
  type: 'standard',
});
```

```go
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
stripe.Key = "<<YOUR_SECRET_KEY>>"

params := &stripe.AccountParams{Type: stripe.String(stripe.AccountTypeStandard)}
result, err := account.New(params)
```

```go
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
sc := stripe.NewClient("<<YOUR_SECRET_KEY>>")
params := &stripe.AccountCreateParams{Type: stripe.String(stripe.AccountTypeStandard)}
result, err := sc.V1Accounts.Create(context.TODO(), params)
```

```dotnet
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeConfiguration.ApiKey = "<<YOUR_SECRET_KEY>>";

var options = new AccountCreateOptions { Type = "standard" };
var service = new AccountService();
Account account = service.Create(options);
```

```dotnet
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
var options = new AccountCreateOptions { Type = "standard" };
var client = new StripeClient("<<YOUR_SECRET_KEY>>");
var service = client.V1.Accounts;
Account account = service.Create(options);
```

If you’ve already collected information for your connected accounts, you can pre-fill that information on the `Account` object. You can pre-fill any account information, including personal and business information, external account information, and so on.

Connect Onboarding doesn’t ask for the prefilled information. However, it does ask the account holder to confirm the prefilled information before accepting the [Connect service agreement](https://docs.stripe.com/connect/service-agreement-types.md).

When testing your integration, prefill account information using [test data](https://docs.stripe.com/connect/testing.md).

### Step 2.2: Create an account link (Server-side)

You can create an account link by calling the [Account Links](https://docs.stripe.com/api/account_links.md) API with the following parameters:

- `account`
- `refresh_url`
- `return_url`
- `type` = `account_onboarding`

```curl
curl https://api.stripe.com/v1/account_links \
  -u "<<YOUR_SECRET_KEY>>:" \
  -d account="{{CONNECTEDACCOUNT_ID}}" \
  --data-urlencode refresh_url="https://example.com/reauth" \
  --data-urlencode return_url="https://example.com/return" \
  -d type=account_onboarding
```

```cli
stripe account_links create  \
  --account="{{CONNECTEDACCOUNT_ID}}" \
  --refresh-url="https://example.com/reauth" \
  --return-url="https://example.com/return" \
  --type=account_onboarding
```

```ruby
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
Stripe.api_key = '<<YOUR_SECRET_KEY>>'

account_link = Stripe::AccountLink.create({
  account: '{{CONNECTEDACCOUNT_ID}}',
  refresh_url: 'https://example.com/reauth',
  return_url: 'https://example.com/return',
  type: 'account_onboarding',
})
```

```ruby
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
client = Stripe::StripeClient.new("<<YOUR_SECRET_KEY>>")

account_link = client.v1.account_links.create({
  account: '{{CONNECTEDACCOUNT_ID}}',
  refresh_url: 'https://example.com/reauth',
  return_url: 'https://example.com/return',
  type: 'account_onboarding',
})
```

```python
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
import stripe
stripe.api_key = "<<YOUR_SECRET_KEY>>"

account_link = stripe.AccountLink.create(
  account="{{CONNECTEDACCOUNT_ID}}",
  refresh_url="https://example.com/reauth",
  return_url="https://example.com/return",
  type="account_onboarding",
)
```

```python
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
client = StripeClient("<<YOUR_SECRET_KEY>>")

account_link = client.account_links.create({
  "account": "{{CONNECTEDACCOUNT_ID}}",
  "refresh_url": "https://example.com/reauth",
  "return_url": "https://example.com/return",
  "type": "account_onboarding",
})
```

```php
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
$stripe = new \Stripe\StripeClient('<<YOUR_SECRET_KEY>>');

$accountLink = $stripe->accountLinks->create([
  'account' => '{{CONNECTEDACCOUNT_ID}}',
  'refresh_url' => 'https://example.com/reauth',
  'return_url' => 'https://example.com/return',
  'type' => 'account_onboarding',
]);
```

```java
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
Stripe.apiKey = "<<YOUR_SECRET_KEY>>";

AccountLinkCreateParams params =
  AccountLinkCreateParams.builder()
    .setAccount("{{CONNECTEDACCOUNT_ID}}")
    .setRefreshUrl("https://example.com/reauth")
    .setReturnUrl("https://example.com/return")
    .setType(AccountLinkCreateParams.Type.ACCOUNT_ONBOARDING)
    .build();

AccountLink accountLink = AccountLink.create(params);
```

```java
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeClient client = new StripeClient("<<YOUR_SECRET_KEY>>");

AccountLinkCreateParams params =
  AccountLinkCreateParams.builder()
    .setAccount("{{CONNECTEDACCOUNT_ID}}")
    .setRefreshUrl("https://example.com/reauth")
    .setReturnUrl("https://example.com/return")
    .setType(AccountLinkCreateParams.Type.ACCOUNT_ONBOARDING)
    .build();

AccountLink accountLink = client.accountLinks().create(params);
```

```node
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = require('stripe')('<<YOUR_SECRET_KEY>>');

const accountLink = await stripe.accountLinks.create({
  account: '{{CONNECTEDACCOUNT_ID}}',
  refresh_url: 'https://example.com/reauth',
  return_url: 'https://example.com/return',
  type: 'account_onboarding',
});
```

```go
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
stripe.Key = "<<YOUR_SECRET_KEY>>"

params := &stripe.AccountLinkParams{
  Account: stripe.String("{{CONNECTEDACCOUNT_ID}}"),
  RefreshURL: stripe.String("https://example.com/reauth"),
  ReturnURL: stripe.String("https://example.com/return"),
  Type: stripe.String("account_onboarding"),
}
result, err := accountlink.New(params)
```

```go
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
sc := stripe.NewClient("<<YOUR_SECRET_KEY>>")
params := &stripe.AccountLinkCreateParams{
  Account: stripe.String("{{CONNECTEDACCOUNT_ID}}"),
  RefreshURL: stripe.String("https://example.com/reauth"),
  ReturnURL: stripe.String("https://example.com/return"),
  Type: stripe.String("account_onboarding"),
}
result, err := sc.V1AccountLinks.Create(context.TODO(), params)
```

```dotnet
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeConfiguration.ApiKey = "<<YOUR_SECRET_KEY>>";

var options = new AccountLinkCreateOptions
{
    Account = "{{CONNECTEDACCOUNT_ID}}",
    RefreshUrl = "https://example.com/reauth",
    ReturnUrl = "https://example.com/return",
    Type = "account_onboarding",
};
var service = new AccountLinkService();
AccountLink accountLink = service.Create(options);
```

```dotnet
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
var options = new AccountLinkCreateOptions
{
    Account = "{{CONNECTEDACCOUNT_ID}}",
    RefreshUrl = "https://example.com/reauth",
    ReturnUrl = "https://example.com/return",
    Type = "account_onboarding",
};
var client = new StripeClient("<<YOUR_SECRET_KEY>>");
var service = client.V1.AccountLinks;
AccountLink accountLink = service.Create(options);
```

### Step 2.3: Redirect your user to the account link URL (Client-side)

The response to your [Account Links](https://docs.stripe.com/api/account_links.md) request includes a value for the key `url`. Redirect to this link to send your user into the flow. URLs from the [Account Links](https://docs.stripe.com/api/account_links.md) API are temporary and can be used only once because they grant access to the account holder’s personal information. Authenticate the user in your application before redirecting them to this URL. If you want to prefill information, you must do so before generating the account link. After you create the account link for a Standard account, you will not be able to read or write information for the account.

> Don’t email, text, or otherwise send account link URLs outside your platform application. Instead, provide them to the authenticated account holder within your application.

#### Swift

```swift
import UIKit
import SafariServices

let BackendAPIBaseURL: String = "" // Set to the URL of your backend server

class ConnectOnboardViewController: UIViewController {

    // ...

    override func viewDidLoad() {
        super.viewDidLoad()

        let connectWithStripeButton = UIButton(type: .system)
        connectWithStripeButton.setTitle("Connect with Stripe", for: .normal)
        connectWithStripeButton.addTarget(self, action: #selector(didSelectConnectWithStripe), for: .touchUpInside)
        view.addSubview(connectWithStripeButton)

        // ...
    }

    @objc
    func didSelectConnectWithStripe() {
        if let url = URL(string: BackendAPIBaseURL)?.appendingPathComponent("onboard-user") {
          var request = URLRequest(url: url)
          request.httpMethod = "POST"
          let task = URLSession.shared.dataTask(with: request) { (data, response, error) in
              guard let data = data,
                  let json = try? JSONSerialization.jsonObject(with: data, options: []) as? [String : Any],
                  let accountURLString = json["url"] as? String,
                  let accountURL = URL(string: accountURLString) else {
                      // handle error
              }

              let safariViewController = SFSafariViewController(url: accountURL)
              safariViewController.delegate = self

              DispatchQueue.main.async {
                  self.present(safariViewController, animated: true, completion: nil)
              }
          }
        }
    }

    // ...
}

extension ConnectOnboardViewController: SFSafariViewControllerDelegate {
    func safariViewControllerDidFinish(_ controller: SFSafariViewController) {
        // the user may have closed the SFSafariViewController instance before a redirect
        // occurred. Sync with your backend to confirm the correct state
    }
}

```

#### Objective C

```objc
#import "ConnectOnboardViewController.h"

#import <SafariServices/SafariServices.h>

static NSString * const kBackendAPIBaseURL = @"";  // Set to the URL of your backend server

@interface ConnectOnboardViewController () <SFSafariViewControllerDelegate>
// ...
@end

@implementation ConnectOnboardViewController

// ...

- (void)viewDidLoad {
    [super viewDidLoad];

    UIButton *connectWithStripeButton = [UIButton buttonWithType:UIButtonTypeSystem];
    [connectWithStripeButton setTitle:@"Connect with Stripe" forState:UIControlStateNormal];
    [connectWithStripeButton addTarget:self action:@selector(_didSelectConnectWithStripe) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:connectWithStripeButton];

    // ...
}

- (void)_didSelectConnectWithStripe {
  NSURL *url = [NSURL URLWithString:[kBackendAPIBaseURL stringByAppendingPathComponent:@"onboard-user"]];
  NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
  request.HTTPMethod = @"POST";

  NSURLSessionTask *task = [[NSURLSession sharedSession] dataTaskWithRequest:request completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
      if (data != nil) {
          NSError *jsonError = nil;
          id json = [NSJSONSerialization JSONObjectWithData:data options:0 error:&jsonError];

          if (json != nil && [json isKindOfClass:[NSDictionary class]]) {
              NSDictionary *jsonDictionary = (NSDictionary *)json;
              NSURL *accountURL = [NSURL URLWithString:jsonDictionary[@"url"]];
              if (accountURL != nil) {
                  SFSafariViewController *safariViewController = [[SFSafariViewController alloc] initWithURL:accountURL];
                  safariViewController.delegate = self;

                  dispatch_async(dispatch_get_main_queue(), ^{
                      [self presentViewController:safariViewController animated:YES completion:nil];
                  });
              } else {
                  // handle  error
              }
          } else {
              // handle error
          }
      } else {
          // handle error
      }
  }];
  [task resume];
}

// ...

#pragma mark - SFSafariViewControllerDelegate
- (void)safariViewControllerDidFinish:(SFSafariViewController *)controller {
    // The user may have closed the SFSafariViewController instance before a redirect
    // occurred. Sync with your backend to confirm the correct state
}

@end

```

### Step 2.4: Handle the user returning to your platform (Client-side)

*Connect* (Connect is Stripe's solution for multi-party businesses, such as marketplace or software platforms, to route payments between sellers, customers, and other recipients) Onboarding requires you to pass both a `return_url` and `refresh_url` to handle all cases where the user will be redirected to your platform. It’s important that you implement these correctly to provide the best experience for your user. You can set up a [universal link](https://developer.apple.com/documentation/xcode/allowing-apps-and-websites-to-link-to-your-content) to enable iOS to redirect to your app automatically.

#### return_url

Stripe issues a redirect to this URL when the user completes the Connect Onboarding flow. This doesn’t mean that all information has been collected or that there are no outstanding requirements on the account. This only means the flow was entered and exited properly.

No state is passed through this URL. After a user is redirected to your `return_url`, check the state of the `details_submitted` parameter on their account by doing either of the following:

- Listening to `account.updated` *webhooks* (A webhook is a real-time push notification sent to your application as a JSON payload through HTTPS requests)
- Calling the [Accounts](https://docs.stripe.com/api/accounts.md) API and inspecting the returned object

#### refresh_url

Your user will be redirected to the `refresh_url` in these cases:

- The link is expired (a few minutes went by since the link was created)
- The link was already visited (the user refreshed the page or clicked back or forward in the browser)
- The link was shared in a third-party application such as a messaging client that attempts to access the URL to preview it. Many clients automatically visit links which cause them to become expired
- Your platform is no longer able to access the account
- The account has been rejected

Your `refresh_url` should trigger a method on your server to call [Account Links](https://docs.stripe.com/api/account_links.md) again with the same parameters, and redirect the user to the Connect Onboarding flow to create a seamless experience.

### Step 2.5: Handle users that have not completed onboarding

A user that is redirected to your `return_url` might not have completed the onboarding process. Use the `/v1/accounts` endpoint to retrieve the user’s account and check for `charges_enabled`. If the account is not fully onboarded, provide UI prompts to allow the user to continue onboarding later. The user can complete their account activation through a new account link (generated by your integration). You can check the state of the `details_submitted` parameter on their account to see if they’ve completed the onboarding process.

## Accept a payment

### Step 3.1: Create your checkout page (Client-side)

Securely collect card information on the client with [STPPaymentCardTextField](https://stripe.dev/stripe-ios/stripe-payments-ui/Classes/STPPaymentCardTextField.html), a drop-in UI component provided by the SDK that collects the card number, expiry date, CVC, and postal code.
![](https://d37ugbyn3rpeym.cloudfront.net/docs/mobile/ios/card-field.mp4)
Create an instance of the card component and a **Pay** button with the following code:

#### Swift

```swift
import UIKit
import StripePaymentsUI

class CheckoutViewController: UIViewController {

    lazy var cardTextField: STPPaymentCardTextField = {
        let cardTextField = STPPaymentCardTextField()
        return cardTextField
    }()
    lazy var payButton: UIButton = {
        let button = UIButton(type: .custom)
        button.layer.cornerRadius = 5
        button.backgroundColor = .systemBlue
        button.titleLabel?.font = UIFont.systemFont(ofSize: 22)
        button.setTitle("Pay", for: .normal)
        button.addTarget(self, action: #selector(pay), for: .touchUpInside)
        return button
    }()

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .white
        let stackView = UIStackView(arrangedSubviews: [cardTextField, payButton])
        stackView.axis = .vertical
        stackView.spacing = 20
        stackView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(stackView)
        NSLayoutConstraint.activate([
            stackView.leftAnchor.constraint(equalToSystemSpacingAfter: view.leftAnchor, multiplier: 2),
            view.rightAnchor.constraint(equalToSystemSpacingAfter: stackView.rightAnchor, multiplier: 2),
            stackView.topAnchor.constraint(equalToSystemSpacingBelow: view.topAnchor, multiplier: 2),
        ])
    }

    @objc
    func pay() {
        // ...
    }
}
```

#### Objective C

```objc
#import "CheckoutViewController.h"
@import StripeCore;
@import StripePayments;
@import StripePaymentsUI;

@interface CheckoutViewController ()

@property (weak) STPPaymentCardTextField *cardTextField;
@property (weak) UIButton *payButton;

@end

@implementation CheckoutViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor whiteColor];

    STPPaymentCardTextField *cardTextField = [[STPPaymentCardTextField alloc] init];
    self.cardTextField = cardTextField;

    UIButton *button = [UIButton buttonWithType:UIButtonTypeCustom];
    button.layer.cornerRadius = 5;
    button.backgroundColor = [UIColor systemBlueColor];
    button.titleLabel.font = [UIFont systemFontOfSize:22];
    [button setTitle:@"Pay" forState:UIControlStateNormal];
    [button addTarget:self action:@selector(pay) forControlEvents:UIControlEventTouchUpInside];
    self.payButton = button;

    UIStackView *stackView = [[UIStackView alloc] initWithArrangedSubviews:@[cardTextField, button]];
    stackView.axis = UILayoutConstraintAxisVertical;
    stackView.translatesAutoresizingMaskIntoConstraints = NO;
    stackView.spacing = 20;
    [self.view addSubview:stackView];

    [NSLayoutConstraint activateConstraints:@[
        [stackView.leftAnchor constraintEqualToSystemSpacingAfterAnchor:self.view.leftAnchor multiplier:2],
        [self.view.rightAnchor constraintEqualToSystemSpacingAfterAnchor:stackView.rightAnchor multiplier:2],
        [stackView.topAnchor constraintEqualToSystemSpacingBelowAnchor:self.view.topAnchor multiplier:2],
    ]];
}

- (void)pay {
    // ...
}

@end
```

Run your app, and make sure your checkout page shows the card component and pay button.

### Step 3.2: Create a PaymentIntent (Server-side) (Client-side)

Stripe uses a [PaymentIntent](https://docs.stripe.com/api/payment_intents.md) object to represent your intent to collect payment from a customer, tracking your charge attempts and payment state changes throughout the process.

### Server-side

On your server, make an endpoint that creates a PaymentIntent with an [amount](https://docs.stripe.com/api/payment_intents/object.md#payment_intent_object-amount) and [currency](https://docs.stripe.com/api/payment_intents/object.md#payment_intent_object-currency). Always decide how much to charge on the server-side, a trusted environment, as opposed to the client. This prevents malicious customers from being able to choose their own prices.

#### curl

```bash
curl https://api.stripe.com/v1/payment_intents \
  -u <<YOUR_SECRET_KEY>>: \
  -d amount=1000 \
  -d currency="gbp" \
  -d "automatic_payment_methods[enabled]"=true \
  -d application_fee_amount="123" \
  -H "Stripe-Account: {{CONNECTED_STRIPE_ACCOUNT_ID}}"
```

#### Ruby

```ruby

# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
Stripe.api_key = '<<YOUR_SECRET_KEY>>'

payment_intent = Stripe::PaymentIntent.create({
  amount: 1000,
  currency: 'gbp',
  # In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
  automatic_payment_methods: { enabled: true },
  application_fee_amount: 123,
}, stripe_account: '{{CONNECTED_STRIPE_ACCOUNT_ID}}')
```

#### Python

```python

# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
stripe.api_key = '<<YOUR_SECRET_KEY>>'

payment_intent = stripe.PaymentIntent.create(
  amount=1000,
  currency='gbp',
  # In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
  automatic_payment_methods={"enabled": True},
  application_fee_amount=123,
  stripe_account='{{CONNECTED_STRIPE_ACCOUNT_ID}}',
)
```

#### PHP

```php

// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
\Stripe\Stripe::setApiKey('<<YOUR_SECRET_KEY>>');

$payment_intent = \Stripe\PaymentIntent::create([
  'amount' => 1000,
  'currency' => 'gbp',
  // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
  'automatic_payment_methods' => ['enabled' => true],
  'application_fee_amount' => 123,
], ['stripe_account' => '{{CONNECTED_STRIPE_ACCOUNT_ID}}']);

```

#### Java

```java

// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
Stripe.apiKey = "<<YOUR_SECRET_KEY>>";

Map<String, Object> automaticPaymentMethods = new HashMap<>();
// In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
automaticPaymentMethods.put("enabled", true);

Map<String, Object> params = new HashMap<>();
params.put("amount", 1000);
params.put("currency", "gbp");
params.put("automatic_payment_methods", automaticPaymentMethods);

params.put("application_fee_amount", 123);
RequestOptions requestOptions = RequestOptions.builder().setStripeAccount(""{{CONNECTED_STRIPE_ACCOUNT_ID}}"").build();
PaymentIntent paymentIntent = PaymentIntent.create(params, requestOptions);

```

#### Node

```javascript

// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = require('stripe')('<<YOUR_SECRET_KEY>>');

const paymentIntent = await stripe.paymentIntents.create({
  amount: 1000,
  currency: 'gbp',
  // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
  automatic_payment_methods: {enabled: true},
  application_fee_amount: 123,
}, {
  stripeAccount: '{{CONNECTED_STRIPE_ACCOUNT_ID}}',
});
```

#### Go

```go

// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
stripe.Key = "<<YOUR_SECRET_KEY>>"

params := &stripe.PaymentIntentParams{
  Amount: stripe.Int64(1000),
  Currency: stripe.String(string(stripe.CurrencyGBP)),
  // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
  AutomaticPaymentMethods: &stripe.PaymentIntentAutomaticPaymentMethodsParams{
    Enabled: stripe.Bool(true),
  },
  ApplicationFeeAmount: stripe.Int64(123),
}
params.SetStripeAccount(""{{CONNECTED_STRIPE_ACCOUNT_ID}}"")

pi, _ := paymentintent.New(params)
```

#### .NET

```dotnet

// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeConfiguration.ApiKey = "<<YOUR_SECRET_KEY>>";

var service = new PaymentIntentService();
var createOptions = new PaymentIntentCreateOptions
{
  Amount = 2000,
  Currency = "gbp",
  // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
  AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
  {
      Enabled = true,
  },
  ApplicationFeeAmount = 123,
};

var requestOptions = new RequestOptions();
requestOptions.StripeAccount = ""{{CONNECTED_STRIPE_ACCOUNT_ID}}"";
service.Create(createOptions, requestOptions);

```

In our store builder example, we want to build a business where customers pay businesses directly. To set up this business:

- Indicate a purchase from the business is a direct charge with the `Stripe-Account` header.
- Specify how much of the purchase from the business goes to the platform with `application_fee_amount`.

When a sale occurs, Stripe transfers the `application_fee_amount` from the connected account to the platform and deducts the Stripe fee from the connected account’s share. An illustration of this funds flow is below:
![](https://b.stripecdn.com/docs-statics-srv/assets/direct_charges.a2a8b68037ac95fe22140d6dde9740d3.svg)

Instead of passing the entire PaymentIntent object to your app, just return its *client secret* (The client secret is a unique key returned from Stripe as part of a PaymentIntent. This key lets the client access important fields from the PaymentIntent (status, amount, currency) while hiding sensitive ones (metadata, customer)).  The PaymentIntent’s client secret is a unique key that lets you confirm the payment and update card details on the client, without allowing manipulation of sensitive information, such as payment amount.

### Client-side

Set the connected account id as an argument to the client application in the client-side libraries.

#### Swift

```swift
import UIKit
import StripePayments

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
        StripeAPI.defaultPublishableKey = "<<YOUR_PUBLISHABLE_KEY>>"
        STPAPIClient.shared.stripeAccount = ""{{CONNECTED_ACCOUNT_ID}}""
        return true
    }
}
```

#### Objective C

```objc
#import "AppDelegate.h"
@import StripeCore;
@import StripePayments;

@implementation AppDelegate
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    [StripeAPI setDefaultPublishableKey:@"<<YOUR_PUBLISHABLE_KEY>>"];
    [[STPAPIClient sharedClient] setStripeAccount:@""{{CONNECTED_ACCOUNT_ID}}""];
    return YES;
}
@end
```

On the client, request a PaymentIntent from your server and store its *client secret* (The client secret is a unique key returned from Stripe as part of a PaymentIntent. This key lets the client access important fields from the PaymentIntent (status, amount, currency) while hiding sensitive ones (metadata, customer)).

#### Swift

```swift
class CheckoutViewController: UIViewController {
    var paymentIntentClientSecret: String?

    // ...continued from previous step

    override func viewDidLoad() {
        // ...continued from previous step
        startCheckout()
    }

    func startCheckout() {
        // Request a PaymentIntent from your server and store its client secret
        // Click View full sample to see a complete implementation
    }
}
```

#### Objective C

```objc
@interface CheckoutViewController ()

// ...continued from previous step
@property (strong) NSString *paymentIntentClientSecret;

@end

@implementation CheckoutViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // ...continued from previous step
    [self startCheckout];
}

- (void)startCheckout {
    // Request a PaymentIntent from your server and store its client secret
    // Click View full sample to see a complete implementation
}

@end
```

### Step 3.3: Submit the payment to Stripe (Client-side)

When the customer taps the **Pay** button, *confirm* (Confirming a PaymentIntent indicates that the customer intends to pay with the current or provided payment method. Upon confirmation, the PaymentIntent attempts to initiate a payment) the `PaymentIntent` to complete the payment.

First, assemble a [STPPaymentIntentParams](https://stripe.dev/stripe-ios/stripe-payments/Classes/STPPaymentIntentParams.html) object with:

1. The card text field’s payment method details
1. The `PaymentIntent` client secret from your server

Rather than sending the entire PaymentIntent object to the client, use its *client secret* (The client secret is a unique key returned from Stripe as part of a PaymentIntent. This key lets the client access important fields from the PaymentIntent (status, amount, currency) while hiding sensitive ones (metadata, customer)). This is different from your API keys that authenticate Stripe API requests. The client secret is a string that lets your app access important fields from the PaymentIntent (for example, `status`) while hiding sensitive ones (for example, `customer`).

Handle the client secret carefully, because it can complete the charge. Don’t log it, embed it in URLs, or expose it to anyone but the customer.

Next, complete the payment by calling the  [STPPaymentHandler confirmPayment](https://stripe.dev/stripe-ios/stripe-payments/Classes/STPPaymentHandler.html#/c:@M@StripePayments@objc\(cs\)STPPaymentHandler\(im\)confirmPayment:withAuthenticationContext:completion:) method.

#### Swift

```swift
class CheckoutViewController: UIViewController {

    // ...

    @objc
    func pay() {
        guard let paymentIntentClientSecret = paymentIntentClientSecret else {
            return
        }
        // Collect card details
        let paymentIntentParams = STPPaymentIntentParams(clientSecret: paymentIntentClientSecret)
        paymentIntentParams.paymentMethodParams = cardTextField.paymentMethodParams

        // Submit the payment
        let paymentHandler = STPPaymentHandler.shared()
        paymentHandler.confirmPayment(paymentIntentParams, with: self) { (status, paymentIntent, error) in
            switch (status) {
            case .failed:
                self.displayAlert(title: "Payment failed", message: error?.localizedDescription ?? "")
                break
            case .canceled:
                self.displayAlert(title: "Payment canceled", message: error?.localizedDescription ?? "")
                break
            case .succeeded:
                self.displayAlert(title: "Payment succeeded", message: paymentIntent?.description ?? "", restartDemo: true)
                break
            @unknown default:
                fatalError()
                break
            }
        }
    }
}

extension CheckoutViewController: STPAuthenticationContext {
    func authenticationPresentingViewController() -> UIViewController {
        return self
    }
}
```

#### Objective C

```objc
@interface CheckoutViewController ()  <STPAuthenticationContext>

// ...

@end

@implementation CheckoutViewController

// ...

- (void)pay {
    if (!self.paymentIntentClientSecret) {
        NSLog(@"PaymentIntent hasn't been created");
        return;
    }

    // Collect card details
    STPPaymentIntentParams *paymentIntentParams = [[STPPaymentIntentParams alloc] initWithClientSecret:self.paymentIntentClientSecret];
    paymentIntentParams.paymentMethodParams = cardTextField.paymentMethodParams;

    // Submit the payment
    STPPaymentHandler *paymentHandler = [STPPaymentHandler sharedHandler];
    [paymentHandler confirmPayment:paymentIntentParams withAuthenticationContext:self completion:^(STPPaymentHandlerActionStatus status, STPPaymentIntent *paymentIntent, NSError *error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            switch (status) {
                case STPPaymentHandlerActionStatusFailed: {
                    [self displayAlertWithTitle:@"Payment failed" message:error.localizedDescription ?: @"" restartDemo:NO];
                    break;
                }
                case STPPaymentHandlerActionStatusCanceled: {
                    [self displayAlertWithTitle:@"Payment canceled" message:error.localizedDescription ?: @"" restartDemo:NO];
                    break;
                }
                case STPPaymentHandlerActionStatusSucceeded: {
                    [self displayAlertWithTitle:@"Payment succeeded" message:paymentIntent.description ?: @"" restartDemo:YES];
                    break;
                }
                default:
                    break;
            }
        });
    }];
}

# pragma mark STPAuthenticationContext
- (UIViewController *)authenticationPresentingViewController {
    return self;
}

@end
```

You can [save a customer’s payment card details](https://docs.stripe.com/payments/payment-intents.md#future-usage) on payment confirmation by providing both `setupFutureUsage` and a `customer` on the `PaymentIntent`. You can also supply these parameters when creating the `PaymentIntent` on your server.

Supplying an appropriate `setupFutureUsage` value for your application might require your customer to complete additional authentication steps, but reduces the chance of banks rejecting future payments. [Learn how to optimise cards for future payments](https://docs.stripe.com/payments/payment-intents.md#future-usage) and determine which value to use for your application.

| How you intend to use the card                                                                                                                                                  | `setup_future_usage` enum value |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| *On-session* (A payment is described as on-session if it occurs while the customer is actively in your checkout flow and able to authenticate the payment method) payments only | `on_session`                    |
| *Off-session* (A payment is described as off-session if it occurs without the direct involvement of the customer, using previously-collected payment information) payments only | `off_session`                   |
| Both on- and off-session payments                                                                                                                                               | `off_session`                   |

You can use a card that’s set up for on-session payments to make off-session payments, but the bank is more likely to reject the off-session payment and require authentication from the cardholder.

If regulation such as [Strong Customer Authentication](https://docs.stripe.com/strong-customer-authentication.md) requires authentication, `STPPaymentHandler` presents view controllers using the [STPAuthenticationContext](https://stripe.dev/stripe-ios/stripe-payments/Protocols/STPAuthenticationContext.html) passed in and walks the customer through that process. [Learn how to support 3D Secure Authentication on iOS](https://docs.stripe.com/payments/3d-secure.md?platform=ios).

If the payment succeeds, the completion handler is called with a status of `.succeeded`. If it fails, the status is `.failed` and you can display the `error.localizedDescription` to the user.

You can also check the status of a `PaymentIntent` in the [Dashboard](https://dashboard.stripe.com/test/payments) or by inspecting the `status` property on the object.

### Step 3.4: Test the integration (Client-side)

​​Several test cards are available for you to use in a sandbox to make sure this integration is ready. Use them with any CVC and an expiry date in the future.

| Number           | Description                                                                               |
| ---------------- | ----------------------------------------------------------------------------------------- |
| 4242424242424242 | Succeeds and immediately processes the payment.                                           |
| 4000002500003155 | Requires authentication. Stripe triggers a modal asking for the customer to authenticate. |
| 4000000000009995 | Always fails with a decline code of `insufficient_funds`.                                 |

For the full list of test cards see our guide on [testing](https://docs.stripe.com/testing.md).

### Step 3.5: Fulfillment (Server-side)

After payment completes, you must handle any necessary *fulfillment* (Fulfillment is the process of providing the goods or services purchased by a customer, typically after payment is collected). For example, a store builder must alert the business to send the purchased item to the customer.

Configure a *webhook* (A webhook is a real-time push notification sent to your application as a JSON payload through HTTPS requests) endpoint [in your dashboard](https://dashboard.stripe.com/account/webhooks) (for events *from your Connect applications*).
![](https://b.stripecdn.com/docs-statics-srv/assets/connect_webhooks.4de92f78dcd94b36838010c85c8a051f.png)

Then create an HTTP endpoint on your server to monitor for completed payments to then enable your users (connected accounts) to fulfill purchases.

#### Ruby

```ruby
# Using Sinatra.
require 'sinatra'
require 'stripe'

set :port, 4242

# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
Stripe.api_key = '<<YOUR_SECRET_KEY>>'

# If you are testing your webhook locally with the Stripe CLI you
# can find the endpoint's secret by running `stripe listen`
# Otherwise, find your endpoint's secret in your webhook settings in
# the Developer Dashboard
endpoint_secret = 'whsec_...'

post '/webhook' do
  payload = request.body.read
  sig_header = request.env['HTTP_STRIPE_SIGNATURE']

  event = nil
# Verify webhook signature and extract the event.
  # See https://stripe.com/docs/webhooks#verify-events for more information.
  begin
    event = Stripe::Webhook.construct_event(
      payload, sig_header, endpoint_secret
    )
  rescue JSON::ParserError => e
    # Invalid payload.
    status 400
    return
  rescue Stripe::SignatureVerificationError => e
    # Invalid Signature.
    status 400
    return
  end

  if event['type'] == 'payment_intent.succeeded'
    payment_intent = event['data']['object']
    connected_account_id = event['account']
    handle_successful_payment_intent(connected_account_id, payment_intent)
  end

  status 200
end

def handle_successful_payment_intent(connected_account_id, payment_intent)
  # Fulfill the purchase
  puts 'Connected account ID: ' + connected_account_id
  puts payment_intent.to_s
end
```

#### Python

```python
import stripe
import json

# Using Flask.
from flask import (
    Flask,
    render_template,
    request,
    Response,
)

app = Flask(__name__, static_folder=".",
            static_url_path="", template_folder=".")

# Set your secret key. Remember to switch to your live secret key in production!
# See your keys here: https://dashboard.stripe.com/apikeys
stripe.api_key = '<<YOUR_SECRET_KEY>>'

# If you are testing your webhook locally with the Stripe CLI you
# can find the endpoint's secret by running `stripe listen`
# Otherwise, find your endpoint's secret in your webhook settings in the Developer Dashboard
endpoint_secret = 'whsec_...'

@app.route("/webhook", methods=["POST"])
def webhook_received():
  request_data = json.loads(request.data)
  signature = request.headers.get("stripe-signature")
# Verify webhook signature and extract the event.
  # See https://stripe.com/docs/webhooks#verify-events for more information.
  try:
    event = stripe.Webhook.construct_event(
        payload=request.data, sig_header=signature, secret=endpoint_secret
    )
  except ValueError as e:
    # Invalid payload.
    return Response(status=400)
  except stripe.error.SignatureVerificationError as e:
    # Invalid Signature.
    return Response(status=400)

  if event["type"] == "payment_intent.succeeded":
    payment_intent = event["data"]["object"]
    connected_account_id = event["account"]
    handle_successful_payment_intent(connected_account_id, payment_intent)

  return json.dumps({"success": True}), 200

def handle_successful_payment_intent(connected_account_id, payment_intent):
  # Fulfill the purchase
  print('Connected account ID: ' + connected_account_id)
  print(str(payment_intent))

if __name__ == "__main__":
  app.run(port=4242)
```

#### PHP

```php
<?php
require 'vendor/autoload.php';

// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
$stripe = new \Stripe\StripeClient('<<YOUR_SECRET_KEY>>');

// You can find your endpoint's secret in your webhook settings
$endpoint_secret = 'whsec_...';

$payload = @file_get_contents('php://input');
$sig_header = $_SERVER['HTTP_STRIPE_SIGNATURE'];
$event = null;
// Verify webhook signature and extract the event.
// See https://stripe.com/docs/webhooks#verify-events for more information.
try {
  $event = \Stripe\Webhook::constructEvent(
    $payload, $sig_header, $endpoint_secret
  );
} catch(\UnexpectedValueException $e) {
  // Invalid payload
  http_response_code(400);
  exit();
} catch(\Stripe\Exception\SignatureVerificationException $e) {
  // Invalid signature
  http_response_code(400);
  exit();
}

if ($event->type == 'payment_intent.succeeded') {
  $paymentIntent = $event->data->object;
  $connectedAccountId = $event->account;
}
http_response_code(200);
```

#### Java

```java
package com.stripe.sample;

import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.net.Webhook;
import com.google.gson.JsonSyntaxException;
import spark.Response;

// Using Spark.
import static spark.Spark.*;

public class Server {
  public static void main(String[] args) {
    port(4242);

    // Set your secret key. Remember to switch to your live secret key in production!
    // See your keys here: https://dashboard.stripe.com/apikeys
    Stripe.apiKey = "<<YOUR_SECRET_KEY>>";
    post("/webhook", (request, response) -> {
      String payload = request.body();
      String sigHeader = request.headers("Stripe-Signature");

      // If you are testing your webhook locally with the Stripe CLI you
      // can find the endpoint's secret by running `stripe listen`
      // Otherwise, find your endpoint's secret in your webhook settings in the Developer Dashboard
      String endpointSecret = "whsec_...";

      Event event = null;
// Verify webhook signature and extract the event.
      // See https://stripe.com/docs/webhooks#verify-events for more information.
      try {
        event = Webhook.constructEvent(
          payload, sigHeader, endpointSecret
        );
      } catch (JsonSyntaxException e) {
      // Invalid payload.
        response.status(400);
        return "";
      } catch (SignatureVerificationException e) {
      // Invalid Signature.
        response.status(400);
        return "";
      }

      if ("payment_intent.succeeded".equals(event.getType())) {
        // Deserialize the nested object inside the event
        EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();

        if (dataObjectDeserializer.getObject().isPresent()) {
          PaymentIntent paymentIntent = (PaymentIntent) dataObjectDeserializer.getObject().get();
          String connectedAccountId = event.getAccount();
          handleSuccessfulPaymentIntent(connectedAccountId, paymentIntent);
        } else {
          // Deserialization failed, probably due to an API version mismatch.
          // Refer to the Javadoc documentation on `EventDataObjectDeserializer` for
          // instructions on how to handle this case, or return an error here.
        }
      }

      response.status(200);
      return "";
    });
  }

  private static void handleSuccessfulPaymentIntent(String connectedAccountId, PaymentIntent paymentIntent) {
    // Fulfill the purchase
    System.out.println("Connected account ID: " + connectedAccountId);
    System.out.println(paymentIntent.getId());
  }
}
```

#### Node

```javascript
// Using Express
const express = require('express');
const bodyParser = require("body-parser");
const app = express();
app.use(express.json());

// Use JSON parser for all non-webhook routes
app.use((req, res, next) => {
  if (req.originalUrl === "/webhook") {
    next();
  } else {
    bodyParser.json()(req, res, next);
  }
});

// Set your secret key. Remember to switch to your live secret key in production!
// See your keys here: https://dashboard.stripe.com/apikeys
const Stripe = require('stripe');
const stripe = Stripe('<<YOUR_SECRET_KEY>>');

// If you are testing your webhook locally with the Stripe CLI you
// can find the endpoint's secret by running `stripe listen`
// Otherwise, find your endpoint's secret in your webhook settings in the Developer Dashboard
const endpointSecret = 'whsec_...';

app.post('/webhook', bodyParser.raw({type: 'application/json'}), (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;
// Verify webhook signature and extract the event.
  // See https://stripe.com/docs/webhooks#verify-events for more information.
  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const connectedAccountId = event.account;
    handleSuccessfulPaymentIntent(connectedAccountId, paymentIntent);
  }

  response.json({received: true});
});

const handleSuccessfulPaymentIntent = (connectedAccountId, paymentIntent) => {
  // Fulfill the purchase
  console.log('Connected account ID: ' + connectedAccountId);
  console.log(JSON.stringify(paymentIntent));
}

app.listen(4242, () => console.log(`Node server listening on port ${4242}!`));
```

#### Go

```go
package main

import (
  "encoding/json"
  "log"
  "fmt"
  "net/http"
  "io/ioutil"

  "github.com/stripe/stripe-go/v76.0.0"
  "github.com/stripe/stripe-go/v76.0.0/webhook"

  "os"
)

func main() {
  // Set your secret key. Remember to switch to your live secret key in production!
  // See your keys here: https://dashboard.stripe.com/apikeys
  stripe.Key = "<<YOUR_SECRET_KEY>>"

  http.HandleFunc("/webhook", handleWebhook)
  addr := "localhost:4242"

  log.Printf("Listening on %s ...", addr)
  log.Fatal(http.ListenAndServe(addr, nil))
}

func handleWebhook(w http.ResponseWriter, req *http.Request) {
  const MaxBodyBytes = int64(65536)
  req.Body = http.MaxBytesReader(w, req.Body, MaxBodyBytes)
  body, err := ioutil.ReadAll(req.Body)
  if err != nil {
      fmt.Fprintf(os.Stderr, "Error reading request body: %v\n", err)
      w.WriteHeader(http.StatusServiceUnavailable)
      return
  }

  // If you are testing your webhook locally with the Stripe CLI you
  // can find the endpoint's secret by running `stripe listen`
  // Otherwise, find your endpoint's secret in your webhook settings
  // in the Developer Dashboard
  endpointSecret := "whsec_...";
// Verify webhook signature and extract the event.
  // See https://stripe.com/docs/webhooks#verify-events for more information.
  event, err := webhook.ConstructEvent(body, req.Header.Get("Stripe-Signature"), endpointSecret)

  if err != nil {
      fmt.Fprintf(os.Stderr, "Error verifying webhook signature: %v\n", err)
      w.WriteHeader(http.StatusBadRequest) // Return a 400 error on a bad signature.
      return
  }

  if event.Type == "payment_intent.succeeded" {
      var paymentIntent stripe.PaymentIntent
      err := json.Unmarshal(event.Data.Raw, &paymentIntent)
      if err != nil {
          fmt.Fprintf(os.Stderr, "Error parsing webhook JSON: %v\n", err)
          w.WriteHeader(http.StatusBadRequest)
          return
      }
      var connectedAccountId = event.Account;
      handleSuccessfulPaymentIntent(connectedAccountId, paymentIntent)
  }

  w.WriteHeader(http.StatusOK)
}

func handleSuccessfulPaymentIntent(connectedAccountId string, paymentIntent stripe.PaymentIntent) {
  // Fulfill the purchase
  log.Println("Connected account ID: " + connectedAccountId)
  log.Println(paymentIntent.ID)
}
```

#### .NET

```dotnet
// Set your secret key. Remember to switch to your live secret key in production!
// See your keys here: https://dashboard.stripe.com/apikeys
StripeConfiguration.ApiKey = "<<YOUR_SECRET_KEY>>";

using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

using Stripe;

namespace Controllers
{
  public class ConnectController : Controller
  {
    private readonly ILogger<ConnectController> logger;

    public ConnectController(
      ILogger<ConnectController> logger
    ) {
      this.logger = logger;
    }

    [HttpPost("webhook")]
    public async Task<IActionResult> ProcessWebhookEvent()
    {
      var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

      // If you are testing your webhook locally with the Stripe CLI you
      // can find the endpoint's secret by running `stripe listen`
      // Otherwise, find your endpoint's secret in your webhook settings
      // in the Developer Dashboard
      const string endpointSecret = "whsec_...";
// Verify webhook signature and extract the event.
      // See https://stripe.com/docs/webhooks#verify-events for more information.
      try
      {
        var stripeEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"], endpointSecret);

        // If on SDK version < 46, use class Events instead of EventTypes
        if (stripeEvent.Type == EventTypes.PaymentIntentSucceeded) {
          var paymentIntent = stripeEvent.Data.Object as PaymentIntent;
          var connectedAccountId = stripeEvent.Account;
          handleSuccessfulPaymentIntent(connectedAccountId, paymentIntent);
        }

        return Ok();
      }
      catch (Exception e)
      {
        logger.LogInformation(e.ToString());
        return BadRequest();
      }
    }

    private void handleSuccessfulPaymentIntent(string connectedAccountId, PaymentIntent paymentIntent) {
      // Fulfill the purchase
      logger.LogInformation($"Connected account ID: {connectedAccountId}");
      logger.LogInformation($"{paymentIntent}");
    }
  }
}
```

Learn more in our [fulfilment guide for payments](https://docs.stripe.com/payments/handling-payment-events.md).

### Testing webhooks locally

Use the Stripe CLI to test webhooks locally.

1. First, [install the Stripe CLI](https://docs.stripe.com/stripe-cli.md#install) on your machine if you haven’t already.

1. Then, to log in run `stripe login` in the command line, and follow the instructions.

1. Finally, to allow your local host to receive a simulated event on your connected account run `stripe listen --forward-connect-to localhost:{PORT}/webhook` in one terminal window, and run `stripe trigger --stripe-account={{CONNECTED_STRIPE_ACCOUNT_ID}} payment_intent.succeeded` (or trigger any other [supported event](https://github.com/stripe/stripe-cli/wiki/trigger-command#supported-events)) in another.

## Testing

Test your account creation flow by [creating accounts](https://docs.stripe.com/connect/testing.md#creating-accounts) and [using OAuth](https://docs.stripe.com/connect/testing.md#using-oauth). Test your **Payment methods** settings for your connected accounts by logging into one of your test accounts and navigating to the [Payment methods settings](https://dashboard.stripe.com/settings/payment_methods). Test your checkout flow with your test keys and a test account. You can use our [test cards](https://docs.stripe.com/testing.md) to test your payments flow and simulate various payment outcomes.


# Payment sheet

> This is a Payment sheet for when platform is android and mobile-ui is payment-element. View the full page at https://docs.stripe.com/connect/enable-payment-acceptance-guide?platform=android&mobile-ui=payment-element.
![](https://b.stripecdn.com/docs-statics-srv/assets/android-overview.471eaf89a760f5b6a757fd96b6bb9b60.png)

Integrate Stripe’s pre-built payment UI into the checkout of your Android app with the [PaymentSheet](https://stripe.dev/stripe-android/paymentsheet/com.stripe.android.paymentsheet/-payment-sheet/index.html) class.

## Prerequisites

### Prerequisites

- [ ] [Register your platform](https://dashboard.stripe.com/connect)

- [ ] Add business details to [activate your account](https://dashboard.stripe.com/account/onboarding)

- [ ] [Complete your platform profile](https://dashboard.stripe.com/connect/settings/profile)

- [ ] [Customise brand settings](https://dashboard.stripe.com/settings/connect/stripe-dashboard/branding)
Add a business name, icon, and brand colour.

## Set up Stripe [Server-side] [Client-side]

### Server-side

This integration requires endpoints on your server that talk to the Stripe API. Use the official libraries for access to the Stripe API from your server:

#### Ruby

```bash
# Available as a gem
sudo gem install stripe
```

```ruby
# If you use bundler, you can add this line to your Gemfile
gem 'stripe'
```

#### Python

```bash
# Install through pip
pip3 install --upgrade stripe
```

```bash
# Or find the Stripe package on http://pypi.python.org/pypi/stripe/
```

```python
# Find the version you want to pin:
# https://github.com/stripe/stripe-python/blob/master/CHANGELOG.md
# Specify that version in your requirements.txt file
stripe>=5.0.0
```

#### PHP

```bash
# Install the PHP library with Composer
composer require stripe/stripe-php
```

```bash
# Or download the source directly: https://github.com/stripe/stripe-php/releases
```

#### Java

```java
/*
  For Gradle, add the following dependency to your build.gradle and replace with
  the version number you want to use from:
  - https://mvnrepository.com/artifact/com.stripe/stripe-java or
  - https://github.com/stripe/stripe-java/releases/latest
*/
implementation "com.stripe:stripe-java:29.0.0"
```

```xml
<!--
  For Maven, add the following dependency to your POM and replace with the
  version number you want to use from:
  - https://mvnrepository.com/artifact/com.stripe/stripe-java or
  - https://github.com/stripe/stripe-java/releases/latest
-->
<dependency>
  <groupId>com.stripe</groupId>
  <artifactId>stripe-java</artifactId>
  <version>29.0.0</version>
</dependency>
```

```bash
# For other environments, manually install the following JARs:
# - The Stripe JAR from https://github.com/stripe/stripe-java/releases/latest
# - Google Gson from https://github.com/google/gson
```

#### Node

```bash
# Install with npm
npm install stripe --save
```

#### Go

```bash
# Make sure your project is using Go Modules
go mod init
# Install stripe-go
go get -u github.com/stripe/stripe-go/v82
```

```go
// Then import the package
import (
  "github.com/stripe/stripe-go/v82"
)
```

#### .NET

```bash
# Install with dotnet
dotnet add package Stripe.net
dotnet restore
```

```bash
# Or install with NuGet
Install-Package Stripe.net
```

### Client-side

The [Stripe Android SDK](https://github.com/stripe/stripe-android) is open source and [fully documented](https://stripe.dev/stripe-android/).

To install the SDK, add `stripe-android` to the `dependencies` block of your [app/build.gradle](https://developer.android.com/studio/build/dependencies) file:

#### Kotlin

```kotlin
plugins {
    id("com.android.application")
}

android { ... }

dependencies {
  // ...

  // Stripe Android SDK
  implementation("com.stripe:stripe-android:21.24.1")
  // Include the financial connections SDK to support US bank account as a payment method
  implementation("com.stripe:financial-connections:21.24.1")
}
```

#### Groovy

```groovy
apply plugin: 'com.android.application'

android { ... }

dependencies {
  // ...

  // Stripe Android SDK
  implementation 'com.stripe:stripe-android:21.24.1'
  // Include the financial connections SDK to support US bank account as a payment method
  implementation 'com.stripe:financial-connections:21.24.1'
}
```

> For details on the latest SDK release and past versions, see the [Releases](https://github.com/stripe/stripe-android/releases) page on GitHub. To receive notifications when a new release is published, [watch releases for the repository](https://docs.github.com/en/github/managing-subscriptions-and-notifications-on-github/configuring-notifications#configuring-your-watch-settings-for-an-individual-repository).

Configure the SDK with your Stripe [publishable key](https://dashboard.stripe.com/apikeys) so that it can make requests to the Stripe API, such as in your `Application` subclass:

#### Kotlin

```kotlin
import com.stripe.android.PaymentConfiguration

class MyApp : Application() {
    override fun onCreate() {
        super.onCreate()
        PaymentConfiguration.init(
            applicationContext,
            "<<YOUR_PUBLISHABLE_KEY>>"
        )
    }
}
```

#### Java

```java
import com.stripe.android.PaymentConfiguration;

public class MyApp extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
        PaymentConfiguration.init(
            getApplicationContext(),
            "<<YOUR_PUBLISHABLE_KEY>>"
        );
    }
}
```

> Use your [test keys](https://docs.stripe.com/keys.md#obtain-api-keys) while you test and develop, and your [live mode](https://docs.stripe.com/keys.md#test-live-modes) keys when you publish your app.

## Create a connected account

When a user (seller or service provider) signs up on your platform, create a user [Account](https://docs.stripe.com/api/accounts.md) (referred to as a *connected account*) so you can accept payments and move funds to their bank account. Connected accounts represent your user in Stripe’s API and help facilitate the collection of onboarding requirements so Stripe can verify the user’s identity. In our store builder example, the connected account represents the business setting up their online store.
![Account creation flow](https://b.stripecdn.com/docs-statics-srv/assets/standard-android.04900ae101e927a74a6f2b0afb53bf23.png)

### Step 2.1: Create a connected account and prefill information (Server-side)

Use the `/v1/accounts` API to [create](https://docs.stripe.com/api/accounts/create.md) a connected account. You can create the connected account by using the [default connected account parameters](https://docs.stripe.com/connect/migrate-to-controller-properties.md), or by specifying the account type.

#### With default properties

```curl
curl -X POST https://api.stripe.com/v1/accounts \
  -u "<<YOUR_SECRET_KEY>>:"
```

```cli
stripe accounts create
```

```ruby
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
Stripe.api_key = '<<YOUR_SECRET_KEY>>'

account = Stripe::Account.create()
```

```ruby
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
client = Stripe::StripeClient.new("<<YOUR_SECRET_KEY>>")

account = client.v1.accounts.create()
```

```python
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
import stripe
stripe.api_key = "<<YOUR_SECRET_KEY>>"

account = stripe.Account.create()
```

```python
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
client = StripeClient("<<YOUR_SECRET_KEY>>")

account = client.accounts.create()
```

```php
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
$stripe = new \Stripe\StripeClient('<<YOUR_SECRET_KEY>>');

$account = $stripe->accounts->create([]);
```

```java
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
Stripe.apiKey = "<<YOUR_SECRET_KEY>>";

AccountCreateParams params = AccountCreateParams.builder().build();

Account account = Account.create(params);
```

```java
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeClient client = new StripeClient("<<YOUR_SECRET_KEY>>");

AccountCreateParams params = AccountCreateParams.builder().build();

Account account = client.accounts().create(params);
```

```node
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = require('stripe')('<<YOUR_SECRET_KEY>>');

const account = await stripe.accounts.create();
```

```go
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
stripe.Key = "<<YOUR_SECRET_KEY>>"

params := &stripe.AccountParams{}
result, err := account.New(params)
```

```go
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
sc := stripe.NewClient("<<YOUR_SECRET_KEY>>")
params := &stripe.AccountCreateParams{}
result, err := sc.V1Accounts.Create(context.TODO(), params)
```

```dotnet
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeConfiguration.ApiKey = "<<YOUR_SECRET_KEY>>";

var options = new AccountCreateOptions();
var service = new AccountService();
Account account = service.Create(options);
```

```dotnet
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
var options = new AccountCreateOptions();
var client = new StripeClient("<<YOUR_SECRET_KEY>>");
var service = client.V1.Accounts;
Account account = service.Create(options);
```

#### With account type

```curl
curl https://api.stripe.com/v1/accounts \
  -u "<<YOUR_SECRET_KEY>>:" \
  -d type=standard
```

```cli
stripe accounts create  \
  --type=standard
```

```ruby
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
Stripe.api_key = '<<YOUR_SECRET_KEY>>'

account = Stripe::Account.create({type: 'standard'})
```

```ruby
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
client = Stripe::StripeClient.new("<<YOUR_SECRET_KEY>>")

account = client.v1.accounts.create({type: 'standard'})
```

```python
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
import stripe
stripe.api_key = "<<YOUR_SECRET_KEY>>"

account = stripe.Account.create(type="standard")
```

```python
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
client = StripeClient("<<YOUR_SECRET_KEY>>")

account = client.accounts.create({"type": "standard"})
```

```php
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
$stripe = new \Stripe\StripeClient('<<YOUR_SECRET_KEY>>');

$account = $stripe->accounts->create(['type' => 'standard']);
```

```java
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
Stripe.apiKey = "<<YOUR_SECRET_KEY>>";

AccountCreateParams params =
  AccountCreateParams.builder().setType(AccountCreateParams.Type.STANDARD).build();

Account account = Account.create(params);
```

```java
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeClient client = new StripeClient("<<YOUR_SECRET_KEY>>");

AccountCreateParams params =
  AccountCreateParams.builder().setType(AccountCreateParams.Type.STANDARD).build();

Account account = client.accounts().create(params);
```

```node
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = require('stripe')('<<YOUR_SECRET_KEY>>');

const account = await stripe.accounts.create({
  type: 'standard',
});
```

```go
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
stripe.Key = "<<YOUR_SECRET_KEY>>"

params := &stripe.AccountParams{Type: stripe.String(stripe.AccountTypeStandard)}
result, err := account.New(params)
```

```go
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
sc := stripe.NewClient("<<YOUR_SECRET_KEY>>")
params := &stripe.AccountCreateParams{Type: stripe.String(stripe.AccountTypeStandard)}
result, err := sc.V1Accounts.Create(context.TODO(), params)
```

```dotnet
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeConfiguration.ApiKey = "<<YOUR_SECRET_KEY>>";

var options = new AccountCreateOptions { Type = "standard" };
var service = new AccountService();
Account account = service.Create(options);
```

```dotnet
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
var options = new AccountCreateOptions { Type = "standard" };
var client = new StripeClient("<<YOUR_SECRET_KEY>>");
var service = client.V1.Accounts;
Account account = service.Create(options);
```

If you’ve already collected information for your connected accounts, you can pre-fill that information on the `Account` object. You can pre-fill any account information, including personal and business information, external account information, and so on.

Connect Onboarding doesn’t ask for the prefilled information. However, it does ask the account holder to confirm the prefilled information before accepting the [Connect service agreement](https://docs.stripe.com/connect/service-agreement-types.md).

When testing your integration, prefill account information using [test data](https://docs.stripe.com/connect/testing.md).

### Step 2.2: Create an account link (Server-side)

You can create an account link by calling the [Account Links](https://docs.stripe.com/api/account_links.md) API with the following parameters:

- `account`
- `refresh_url`
- `return_url`
- `type` = `account_onboarding`

```curl
curl https://api.stripe.com/v1/account_links \
  -u "<<YOUR_SECRET_KEY>>:" \
  -d account="{{CONNECTEDACCOUNT_ID}}" \
  --data-urlencode refresh_url="https://example.com/reauth" \
  --data-urlencode return_url="https://example.com/return" \
  -d type=account_onboarding
```

```cli
stripe account_links create  \
  --account="{{CONNECTEDACCOUNT_ID}}" \
  --refresh-url="https://example.com/reauth" \
  --return-url="https://example.com/return" \
  --type=account_onboarding
```

```ruby
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
Stripe.api_key = '<<YOUR_SECRET_KEY>>'

account_link = Stripe::AccountLink.create({
  account: '{{CONNECTEDACCOUNT_ID}}',
  refresh_url: 'https://example.com/reauth',
  return_url: 'https://example.com/return',
  type: 'account_onboarding',
})
```

```ruby
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
client = Stripe::StripeClient.new("<<YOUR_SECRET_KEY>>")

account_link = client.v1.account_links.create({
  account: '{{CONNECTEDACCOUNT_ID}}',
  refresh_url: 'https://example.com/reauth',
  return_url: 'https://example.com/return',
  type: 'account_onboarding',
})
```

```python
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
import stripe
stripe.api_key = "<<YOUR_SECRET_KEY>>"

account_link = stripe.AccountLink.create(
  account="{{CONNECTEDACCOUNT_ID}}",
  refresh_url="https://example.com/reauth",
  return_url="https://example.com/return",
  type="account_onboarding",
)
```

```python
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
client = StripeClient("<<YOUR_SECRET_KEY>>")

account_link = client.account_links.create({
  "account": "{{CONNECTEDACCOUNT_ID}}",
  "refresh_url": "https://example.com/reauth",
  "return_url": "https://example.com/return",
  "type": "account_onboarding",
})
```

```php
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
$stripe = new \Stripe\StripeClient('<<YOUR_SECRET_KEY>>');

$accountLink = $stripe->accountLinks->create([
  'account' => '{{CONNECTEDACCOUNT_ID}}',
  'refresh_url' => 'https://example.com/reauth',
  'return_url' => 'https://example.com/return',
  'type' => 'account_onboarding',
]);
```

```java
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
Stripe.apiKey = "<<YOUR_SECRET_KEY>>";

AccountLinkCreateParams params =
  AccountLinkCreateParams.builder()
    .setAccount("{{CONNECTEDACCOUNT_ID}}")
    .setRefreshUrl("https://example.com/reauth")
    .setReturnUrl("https://example.com/return")
    .setType(AccountLinkCreateParams.Type.ACCOUNT_ONBOARDING)
    .build();

AccountLink accountLink = AccountLink.create(params);
```

```java
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeClient client = new StripeClient("<<YOUR_SECRET_KEY>>");

AccountLinkCreateParams params =
  AccountLinkCreateParams.builder()
    .setAccount("{{CONNECTEDACCOUNT_ID}}")
    .setRefreshUrl("https://example.com/reauth")
    .setReturnUrl("https://example.com/return")
    .setType(AccountLinkCreateParams.Type.ACCOUNT_ONBOARDING)
    .build();

AccountLink accountLink = client.accountLinks().create(params);
```

```node
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = require('stripe')('<<YOUR_SECRET_KEY>>');

const accountLink = await stripe.accountLinks.create({
  account: '{{CONNECTEDACCOUNT_ID}}',
  refresh_url: 'https://example.com/reauth',
  return_url: 'https://example.com/return',
  type: 'account_onboarding',
});
```

```go
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
stripe.Key = "<<YOUR_SECRET_KEY>>"

params := &stripe.AccountLinkParams{
  Account: stripe.String("{{CONNECTEDACCOUNT_ID}}"),
  RefreshURL: stripe.String("https://example.com/reauth"),
  ReturnURL: stripe.String("https://example.com/return"),
  Type: stripe.String("account_onboarding"),
}
result, err := accountlink.New(params)
```

```go
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
sc := stripe.NewClient("<<YOUR_SECRET_KEY>>")
params := &stripe.AccountLinkCreateParams{
  Account: stripe.String("{{CONNECTEDACCOUNT_ID}}"),
  RefreshURL: stripe.String("https://example.com/reauth"),
  ReturnURL: stripe.String("https://example.com/return"),
  Type: stripe.String("account_onboarding"),
}
result, err := sc.V1AccountLinks.Create(context.TODO(), params)
```

```dotnet
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeConfiguration.ApiKey = "<<YOUR_SECRET_KEY>>";

var options = new AccountLinkCreateOptions
{
    Account = "{{CONNECTEDACCOUNT_ID}}",
    RefreshUrl = "https://example.com/reauth",
    ReturnUrl = "https://example.com/return",
    Type = "account_onboarding",
};
var service = new AccountLinkService();
AccountLink accountLink = service.Create(options);
```

```dotnet
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
var options = new AccountLinkCreateOptions
{
    Account = "{{CONNECTEDACCOUNT_ID}}",
    RefreshUrl = "https://example.com/reauth",
    ReturnUrl = "https://example.com/return",
    Type = "account_onboarding",
};
var client = new StripeClient("<<YOUR_SECRET_KEY>>");
var service = client.V1.AccountLinks;
AccountLink accountLink = service.Create(options);
```

### Step 2.3: Redirect your user to the account link URL (Client-side)

The response to your [Account Links](https://docs.stripe.com/api/account_links.md) request includes a value for the key `url`. Redirect to this link to send your user into the flow. Account Links are temporary and are single-use only because they grant access to the connected account user’s personal information. Authenticate the user in your application before redirecting them to this URL. If you want to prefill information, you must do so before generating the account link. After you create the account link for a Standard account, you won’t be able to read or write information for the account.

> Don’t email, text, or otherwise send account link URLs outside your platform application. Instead, provide them to the authenticated account holder within your application.

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".activity.ConnectWithStripeActivity">

    <Button
        android:id="@+id/connect_with_stripe"
        android:text="Connect with Stripe"
        android:layout_height="wrap_content"
        android:layout_width="wrap_content"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent"
        style="?attr/materialButtonOutlinedStyle"
        />

</androidx.constraintlayout.widget.ConstraintLayout>
```

#### Kotlin

```kotlin
class ConnectWithStripeActivity : AppCompatActivity() {

    private val viewBinding: ActivityConnectWithStripeViewBinding by lazy {
        ActivityConnectWithStripeViewBinding.inflate(layoutInflater)
    }
    private val httpClient = OkHttpClient()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(viewBinding.root)

        viewBinding.connectWithStripe.setOnClickListener {
            val weakActivity = WeakReference<Activity>(this)
            val request = Request.Builder()
                .url(BACKEND_URL + "onboard-user")
                .post("".toRequestBody())
                .build()
            httpClient.newCall(request)
                .enqueue(object: Callback {
                    override fun onFailure(call: Call, e: IOException) {
                        // Request failed
                    }
                    override fun onResponse(call: Call, response: Response) {
                        if (!response.isSuccessful) {
                            // Request failed
                        } else {
                            val responseData = response.body?.string()
                            val responseJson =
                                responseData?.let { JSONObject(it) } ?: JSONObject()
                            val url = responseJson.getString("url")

                            weakActivity.get()?.let {
                                val builder: CustomTabsIntent.Builder = CustomTabsIntent.Builder()
                                val customTabsIntent = builder.build()
                                customTabsIntent.launchUrl(it, Uri.parse(url))
                            }
                        }
                    }
                })
        }
    }

    internal companion object {
        internal const val BACKEND_URL = "https://example-backend-url.com/"
    }
}
```

#### Java

```java
public class ConnectWithStripeActivity extends AppCompatActivity {
    private static final String BACKEND_URL = "https://example-backend-url.com/";
    private OkHttpClient httpClient = new OkHttpClient();
    private ActivityConnectWithStripeViewBinding viewBinding;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        viewBinding = ActivityConnectWithStripeViewBinding.inflate(getLayoutInflater());

        viewBinding.connectWithStripe.setOnClickListener(view -> {
            WeakReference<Activity> weakActivity = new WeakReference<>(this);
            Request request = new Request.Builder()
                    .url(BACKEND_URL + "onboard-user")
                    .post(RequestBody.create("", MediaType.get("application/json; charset=utf-8")))
                    .build();
            httpClient.newCall(request)
                    .enqueue(new Callback() {
                        @Override
                        public void onFailure(@NotNull Call call, @NotNull IOException e) {
                            // Request failed
                        }

                        @Override
                        public void onResponse(@NotNull Call call, @NotNull Response response) throws IOException {
                            final Activity activity = weakActivity.get();
                            if (activity == null) {
                                return;
                            }
                            if (!response.isSuccessful() || response.body() == null) {
                                // Request failed
                            } else {
                                String body = response.body().string();
                                try {
                                    JSONObject responseJson = new JSONObject(body);
                                    String url = responseJson.getString("url");
                                    CustomTabsIntent.Builder builder = new CustomTabsIntent.Builder();
                                    CustomTabsIntent customTabsIntent = builder.build();
                                    customTabsIntent.launchUrl(view.getContext(), Uri.parse(url));
                                } catch (JSONException e) {
                                    e.printStackTrace();
                                }
                            }
                        }
                    });
        });
    }
}
```

### Step 2.4: Handle the user returning to your platform (Client-side)

*Connect* (Connect is Stripe's solution for multi-party businesses, such as marketplace or software platforms, to route payments between sellers, customers, and other recipients) Onboarding requires you to pass both a `return_url` and `refresh_url` to handle all cases where the user is redirected to your platform. It’s important that you implement these correctly to provide the best experience for your user. You can set up a [deep link](https://developer.android.com/training/app-links/deep-linking) to enable Android to redirect to your app automatically.

#### return_url

Stripe issues a redirect to this URL when the user completes the Connect Onboarding flow. This doesn’t mean that all information has been collected or that there are no outstanding requirements on the account. This only means the flow was entered and exited properly.

No state is passed through this URL. After a user is redirected to your `return_url`, check the state of the `details_submitted` parameter on their account by doing either of the following:

- Listening to `account.updated` *webhooks* (A webhook is a real-time push notification sent to your application as a JSON payload through HTTPS requests)
- Calling the [Accounts](https://docs.stripe.com/api/accounts.md) API and inspecting the returned object

#### refresh_url

Your user is redirected to the `refresh_url` in these cases:

- The link is expired (a few minutes went by since the link was created)
- The user already visited the link (the user refreshed the page or clicked back or forward in the browser)
- Your platform is no longer able to access the account
- The account has been rejected

Your `refresh_url` should trigger a method on your server to call [Account Links](https://docs.stripe.com/api/account_links.md) again with the same parameters, and redirect the user to the Connect Onboarding flow in a seamless manner.

### Step 2.5: Handle users that haven’t completed onboarding

A user that is redirected to your `return_url` might not have completed the onboarding process. Use the `/v1/accounts` endpoint to retrieve the user’s account and check for `charges_enabled`. If the account isn’t fully onboarded, provide UI prompts to allow the user to continue onboarding later. The user can complete their account activation through a new account link (generated by your integration). You can check the state of the `details_submitted` parameter on their account to see if they’ve completed the onboarding process.

## Enable payment methods

View your [payment methods settings](https://dashboard.stripe.com/settings/connect/payment_methods) and enable the payment methods you want to support. Card payments are enabled by default but you can enable and disable payment methods as needed.

## Add an endpoint [Server-side]

> #### Note
> 
> To display the PaymentSheet before you create a PaymentIntent, see [Collect payment details before creating an Intent](https://docs.stripe.com/payments/accept-a-payment-deferred.md?type=payment).

This integration uses three Stripe API objects:

1. [PaymentIntent](https://docs.stripe.com/api/payment_intents.md): Stripe uses this to represent your intent to collect payment from a customer, tracking your charge attempts and payment state changes throughout the process.

1. (Optional) [Customer](https://docs.stripe.com/api/customers.md): To set up a payment method for future payments, you must attach it to a *Customer* (Customer objects represent customers of your business. They let you reuse payment methods and give you the ability to track multiple payments). Create a Customer object when your customer creates an account with your business. If your customer is making a payment as a guest, you can create a Customer object before payment and associate it with your own internal representation of the customer’s account later.

1. (Optional) Customer Ephemeral Key: Information on the Customer object is sensitive, and can’t be retrieved directly from an app. An ephemeral key grants the SDK temporary access to the Customer.

> If you never save cards to a Customer and don’t allow returning Customers to reuse saved cards, you can omit the Customer and Customer Ephemeral Key objects from your integration.

For security reasons, your app can’t create these objects. Instead, add an endpoint on your server that:

1. Retrieves the Customer, or creates a new one.
1. Creates an Ephemeral Key for the Customer.
1. Creates a PaymentIntent with the [amount](https://docs.stripe.com/api/payment_intents/create.md#create_payment_intent-amount), [currency](https://docs.stripe.com/api/payment_intents/create.md#create_payment_intent-currency), and [customer](https://docs.stripe.com/api/payment_intents/create.md#create_payment_intent-customer). You can also optionally include the `automatic_payment_methods` parameter. Stripe enables its functionality by default in the latest version of the API.
1. Returns the Payment Intent’s *client secret* (The client secret is a unique key returned from Stripe as part of a PaymentIntent. This key lets the client access important fields from the PaymentIntent (status, amount, currency) while hiding sensitive ones (metadata, customer)), the Ephemeral Key’s `secret`, the Customer’s [id](https://docs.stripe.com/api/customers/object.md#customer_object-id), and your [publishable key](https://dashboard.stripe.com/apikeys) to your app.

The payment methods shown to customers during the checkout process are also included on the PaymentIntent. You can let Stripe pull payment methods from your Dashboard settings or you can list them manually. Regardless of the option you choose, note that the currency passed in the PaymentIntent filters the payment methods shown to the customer. For example, if you pass `eur` on the PaymentIntent and have OXXO enabled in the Dashboard, OXXO won’t be shown to the customer because OXXO doesn’t support `eur` payments.

Unless your integration requires a code-based option for offering payment methods, Stripe recommends the automated option. This is because Stripe evaluates the currency, payment method restrictions, and other parameters to determine the list of supported payment methods. Payment methods that increase conversion and that are most relevant to the currency and customer’s location are prioritised.

#### Manage payment methods from the Dashboard

> You can fork and deploy an implementation of this endpoint on [CodeSandbox](https://codesandbox.io/p/devbox/suspicious-lalande-l325w6) for testing.

You can manage payment methods from the [Dashboard](https://dashboard.stripe.com/settings/payment_methods). Stripe handles the return of eligible payment methods based on factors such as the transaction’s amount, currency, and payment flow. The PaymentIntent is created using the payment methods you configured in the Dashboard. If you don’t want to use the Dashboard or if you want to specify payment methods manually, you can list them using the `payment_method_types` attribute.

#### curl

```bash
# Create a Customer (use an existing Customer ID if this is a returning customer)
curl https://api.stripe.com/v1/customers \
  -u <<YOUR_SECRET_KEY>>: \
  -X "POST"

# Create an Ephemeral Key for the Customer
curl https://api.stripe.com/v1/ephemeral_keys \
  -u <<YOUR_SECRET_KEY>>: \
  -H "Stripe-Version: 2025-07-30.basil" \
  -X "POST" \
  -d "customer"="{{CUSTOMER_ID}}" \

# Create a PaymentIntent
curl https://api.stripe.com/v1/payment_intents \
  -u <<YOUR_SECRET_KEY>>: \
  -H "Stripe-Account: {{CONNECTED_ACCOUNT_ID}}"
  -X "POST" \
  -d "customer"="{{CUSTOMER_ID}}" \
  -d "amount"=1099 \
  -d "currency"="eur" \
  # In the latest version of the API, specifying the `automatic_payment_methods` parameter
  # is optional because Stripe enables its functionality by default.
  -d "automatic_payment_methods[enabled]"=true \
  -d application_fee_amount="123" \
```

#### Ruby

```ruby
# This example sets up an endpoint using the Sinatra framework.


# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
Stripe.api_key = '<<YOUR_SECRET_KEY>>'

post '/payment-sheet' do
  # Use an existing Customer ID if this is a returning customer
  customer = Stripe::Customer.create
  ephemeralKey = Stripe::EphemeralKey.create({
    customer: customer['id'],
  }, {stripe_version: '2025-07-30.basil'})
  paymentIntent = Stripe::PaymentIntent.create({
    amount: 1099,
    currency: 'eur',
    customer: customer['id'],
    # In the latest version of the API, specifying the `automatic_payment_methods` parameter
    # is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
    application_fee_amount: 123,
  }, {stripe_account: '{{CONNECTED_ACCOUNT_ID}}'})
  {
    paymentIntent: paymentIntent['client_secret'],
    ephemeralKey: ephemeralKey['secret'],
    customer: customer['id'],
    publishableKey: '<<YOUR_PUBLISHABLE_KEY>>'
  }.to_json
end
```

#### Python

```python
# This example sets up an endpoint using the Flask framework.
# Watch this video to get started: https://youtu.be/7Ul1vfmsDck.

# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
stripe.api_key = '<<YOUR_SECRET_KEY>>'

@app.route('/payment-sheet', methods=['POST'])
def payment_sheet():
  # Use an existing Customer ID if this is a returning customer
  customer = stripe.Customer.create()
  ephemeralKey = stripe.EphemeralKey.create(
    customer=customer['id'],
    stripe_version='2025-07-30.basil',
  )

  paymentIntent = stripe.PaymentIntent.create(
    amount=1099,
    currency='eur',
    customer=customer['id'],
    # In the latest version of the API, specifying the `automatic_payment_methods` parameter
    # is optional because Stripe enables its functionality by default.
    automatic_payment_methods={
      'enabled': True,
    },
    application_fee_amount=123,
    stripe_account='{{CONNECTED_ACCOUNT_ID}}',
  )
  return jsonify(paymentIntent=paymentIntent.client_secret,
                 ephemeralKey=ephemeralKey.secret,
                 customer=customer.id,
                 publishableKey='<<YOUR_PUBLISHABLE_KEY>>')
```

#### PHP

```php
<?php
require 'vendor/autoload.php';
$stripe = new \Stripe\StripeClient('<<YOUR_SECRET_KEY>>');

// Use an existing Customer ID if this is a returning customer.
$customer = $stripe->customers->create();
$ephemeralKey = $stripe->ephemeralKeys->create([
  'customer' => $customer->id,
], [
  'stripe_version' => '2025-07-30.basil',
]);

$paymentIntent = $stripe->paymentIntents->create([
  'amount' => 1099,
  'currency' => 'eur',
  'customer' => $customer->id,
  // In the latest version of the API, specifying the `automatic_payment_methods` parameter
  // is optional because Stripe enables its functionality by default.
  'automatic_payment_methods' => [
    'enabled' => 'true',
  ],
  'application_fee_amount' => 123,
], ['stripe_account' => '{{CONNECTED_ACCOUNT_ID}}'
]);

echo json_encode(
  [
    'paymentIntent' => $paymentIntent->client_secret,
    'ephemeralKey' => $ephemeralKey->secret,
    'customer' => $customer->id,
    'publishableKey' => '<<YOUR_PUBLISHABLE_KEY>>'
  ]
);
http_response_code(200);
```

#### Java

```java

// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
Stripe.apiKey = "<<YOUR_SECRET_KEY>>";

post(
  "/payment-sheet",
  (request, response) -> {
    response.type("application/json");

    // Use an existing Customer ID if this is a returning customer.
    CustomerCreateParams customerParams = CustomerCreateParams.builder().build();
    Customer customer = Customer.create(customerParams);
    EphemeralKeyCreateParams ephemeralKeyParams =
      EphemeralKeyCreateParams.builder()
        .setStripeVersion("2025-07-30.basil")
        .setCustomer(customer.getId())
        .build();

    EphemeralKey ephemeralKey = EphemeralKey.create(ephemeralKeyParams);
    RequestOptions requestOptions = RequestOptions.builder()
      .setStripeAccount("{{CONNECTED_ACCOUNT_ID}}")
      .build();
    PaymentIntentCreateParams paymentIntentParams =
    PaymentIntentCreateParams.builder()
      .setAmount(1099L)
      .setCurrency("eur")
      .setCustomer(customer.getId())
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter
      // is optional because Stripe enables its functionality by default.
      .setAutomaticPaymentMethods(
        PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
          .setEnabled(true)
          .build()
      )
      .setApplicationFeeAmount(123L)
      .build();

    PaymentIntent paymentIntent = PaymentIntent.create(paymentIntentParams, requestOptions);

    Map<String, String> responseData = new HashMap();
    responseData.put("paymentIntent", paymentIntent.getClientSecret());
    responseData.put("ephemeralKey", ephemeralKey.getSecret());

    responseData.put("customer", customer.getId());
    responseData.put("publishableKey", "<<YOUR_PUBLISHABLE_KEY>>");

    return gson.toJson(responseData);
});
```

#### Node

```javascript

const stripe = require('stripe')('<<YOUR_SECRET_KEY>>');
// This example sets up an endpoint using the Express framework.

app.post('/payment-sheet', async (req, res) => {
  // Use an existing Customer ID if this is a returning customer.
  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    {customer: customer.id},
    {apiVersion: '2025-07-30.basil'}
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1099,
    currency: 'eur',
    customer: customer.id,
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter
    // is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
    application_fee_amount: 123,
  }, {
    stripeAccount: '{{CONNECTED_ACCOUNT_ID}}',
  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey: '<<YOUR_PUBLISHABLE_KEY>>'
  });
});
```

#### Go

```go

// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
stripe.Key = "<<YOUR_SECRET_KEY>>"

func handlePaymentSheet(w http.ResponseWriter, r *http.Request) {
  if r.Method != "POST" {
    http.Error(w, http.StatusText(http.StatusMethodNotAllowed), http.StatusMethodNotAllowed)
    return
  }

  // Use an existing Customer ID if this is a returning customer.
  cparams := &stripe.CustomerParams{}
  c, _ := customer.New(cparams)

  ekparams := &stripe.EphemeralKeyParams{
    Customer: stripe.String(c.ID),
    StripeVersion: stripe.String("2025-07-30.basil"),
  }
  ek, _ := ephemeralKey.New(ekparams)

  piparams := &stripe.PaymentIntentParams{
    Amount:   stripe.Int64(1099),
    Currency: stripe.String(string(stripe.CurrencyEUR)),
    Customer: stripe.String(c.ID),
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter
    // is optional because Stripe enables its functionality by default.
    AutomaticPaymentMethods: &stripe.PaymentIntentAutomaticPaymentMethodsParams{
      Enabled: stripe.Bool(true),
    },
    ApplicationFeeAmount: stripe.Int64(123),
  }
  piparams.SetStripeAccount(""{{CONNECTED_ACCOUNT_ID}}""),
  pi, _ := paymentintent.New(piparams)

  writeJSON(w, struct {
    PaymentIntent  string `json:"paymentIntent"`
    EphemeralKey   string `json:"ephemeralKey"`
    Customer       string `json:"customer"`
    PublishableKey string `json:"publishableKey"`
  }{
    PaymentIntent: pi.ClientSecret,
    EphemeralKey: ek.Secret,
    Customer: c.ID,
    PublishableKey: "<<YOUR_PUBLISHABLE_KEY>>",
  })
}
```

#### .NET

```dotnet

// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeConfiguration.ApiKey = "<<YOUR_SECRET_KEY>>";

[HttpPost("payment-sheet")]
public ActionResult<PaymentSheetCreateResponse> CreatePaymentSheet([FromBody] CreatePaymentSheetRequest req)
{
  // Use an existing Customer ID if this is a returning customer.
  var customerOptions = new CustomerCreateOptions();
  var customerService = new CustomerService();
  var customer = customerService.Create(customerOptions);
  var ephemeralKeyOptions = new EphemeralKeyCreateOptions
  {
    Customer = customer.Id,
    StripeVersion = "2025-07-30.basil",
  };
  var ephemeralKeyService = new EphemeralKeyService();
  var ephemeralKey = ephemeralKeyService.Create(ephemeralKeyOptions);

  var paymentIntentOptions = new PaymentIntentCreateOptions
  {
    Amount = 1099,
    Currency = "eur",
    Customer = customer.Id,
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter
    // is optional because Stripe enables its functionality by default.
    AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
    {
      Enabled = true,
    },
    ApplicationFeeAmount = 123,
  };
  var requestOptions = new RequestOptions
  {
    StripeAccount = ""{{CONNECTED_ACCOUNT_ID}}"",
  };
  var paymentIntentService = new PaymentIntentService();
  PaymentIntent paymentIntent = paymentIntentService.Create(paymentIntentOptions, requestOptions);

  return new PaymentSheetCreateResponse
  {
    PaymentIntent = paymentIntent.ClientSecret,
    EphemeralKey = ephemeralKey.Secret,

    Customer = customer.Id,
    PublishableKey = "<<YOUR_PUBLISHABLE_KEY>>",
  };
}
```

#### Listing payment methods manually

> You can fork and deploy an implementation of this endpoint on [CodeSandbox](https://codesandbox.io/p/devbox/suspicious-lalande-l325w6) for testing.

#### curl

```bash
# Create a Customer (use an existing Customer ID if this is a returning customer)
curl https://api.stripe.com/v1/customers \
  -u <<YOUR_SECRET_KEY>>: \
  -X "POST"

# Create an Ephemeral Key for the Customer
curl https://api.stripe.com/v1/ephemeral_keys \
  -u <<YOUR_SECRET_KEY>>: \
  -X "POST" \
  -d "customer"="{{CUSTOMER_ID}}" \

# Create a PaymentIntent
curl https://api.stripe.com/v1/payment_intents \
  -u <<YOUR_SECRET_KEY>>: \
  -H "Stripe-Account: {{CONNECTED_ACCOUNT_ID}}"
  -X "POST" \
  -d "customer"="{{CUSTOMER_ID}}" \
  -d "amount"=1099 \
  -d "currency"="eur" \
  -d "payment_method_types[]"="bancontact" \
  -d "payment_method_types[]"="card" \
  -d "payment_method_types[]"="ideal" \
  -d "payment_method_types[]"="klarna" \
  -d "payment_method_types[]"="sepa_debit" \
  -d application_fee_amount="123" \
```

#### Ruby

```ruby
# This example sets up an endpoint using the Sinatra framework.



post '/payment-sheet' do
  # Use an existing Customer ID if this is a returning customer
  customer = Stripe::Customer.create
  ephemeralKey = Stripe::EphemeralKey.create({
    customer: customer['id'],
  }, {stripe_version: '2025-07-30.basil'})
  paymentIntent = Stripe::PaymentIntent.create({
    amount: 1099,
    currency: 'eur',
    customer: customer['id'],
    payment_method_types: ['bancontact', 'card', 'ideal', 'klarna', 'sepa_debit'],
    application_fee_amount: 123,
  }, {stripe_account: '{{CONNECTED_ACCOUNT_ID}}'})
  {
    paymentIntent: paymentIntent['client_secret'],
    ephemeralKey: ephemeralKey['secret'],
    customer: customer['id'],
    publishableKey: '<<YOUR_PUBLISHABLE_KEY>>'
  }.to_json
end
```

#### Python

```python
# This example sets up an endpoint using the Flask framework.
# Watch this video to get started: https://youtu.be/7Ul1vfmsDck.


@app.route('/payment-sheet', methods=['POST'])
def payment_sheet():
  # Use an existing Customer ID if this is a returning customer
  customer = stripe.Customer.create()
  ephemeralKey = stripe.EphemeralKey.create(
    customer=customer['id'],
    stripe_version='2025-07-30.basil',
  )

  paymentIntent = stripe.PaymentIntent.create(
    amount=1099,
    currency='eur',
    customer=customer['id'],
    payment_method_types=["bancontact", "card", "ideal", "klarna", "sepa_debit"],
    application_fee_amount=123,
    stripe_account='{{CONNECTED_ACCOUNT_ID}}',
  )
  return jsonify(paymentIntent=paymentIntent.client_secret,
                 ephemeralKey=ephemeralKey.secret,
                 customer=customer.id,
                 publishableKey='<<YOUR_PUBLISHABLE_KEY>>')
```

#### PHP

```php
<?php
require 'vendor/autoload.php';
$stripe = new \Stripe\StripeClient('<<YOUR_SECRET_KEY>>');

// Use an existing Customer ID if this is a returning customer.
$customer = $stripe->customers->create();
$ephemeralKey = $stripe->ephemeralKeys->create([
  'customer' => $customer->id,
], [
  'stripe_version' => '2025-07-30.basil',
]);

$paymentIntent = $stripe->paymentIntents->create([
  'amount' => 1099,
  'currency' => 'eur',
  'customer' => $customer->id,
  'payment_method_types' => ['bancontact', 'card', 'ideal', 'klarna', 'sepa_debit'],
  'application_fee_amount' => 123,
], ['stripe_account' => '{{CONNECTED_ACCOUNT_ID}}'
]);

echo json_encode(
  [
    'paymentIntent' => $paymentIntent->client_secret,
    'ephemeralKey' => $ephemeralKey->secret,
    'customer' => $customer->id,
    'publishableKey' => '<<YOUR_PUBLISHABLE_KEY>>'
  ]
);
http_response_code(200);
```

#### Java

```java
// This example sets up an endpoint using the Spark framework.

post("/payment-sheet", (request, response) -> {
  response.type("application/json");

  // Use an existing Customer ID if this is a returning customer.
  CustomerCreateParams customerParams = CustomerCreateParams.builder().build();
  Customer customer = Customer.create(customerParams);
  EphemeralKeyCreateParams ephemeralKeyParams =
    EphemeralKeyCreateParams.builder()
      .setStripeVersion("2025-07-30.basil")
      .setCustomer(customer.getId())
      .build();

  EphemeralKey ephemeralKey = EphemeralKey.create(ephemeralKeyParams);

  List<String> paymentMethodTypes = new ArrayList<String>();
  paymentMethodTypes.add("bancontact");
  paymentMethodTypes.add("card");
  paymentMethodTypes.add("ideal");
  paymentMethodTypes.add("klarna");
  paymentMethodTypes.add("sepa_debit");
  RequestOptions requestOptions = RequestOptions.builder()
    .setStripeAccount("{{CONNECTED_ACCOUNT_ID}}")
    .build();

  PaymentIntentCreateParams paymentIntentParams =
  PaymentIntentCreateParams.builder()
    .setAmount(1099L)
    .setCurrency("eur")
    .setCustomer(customer.getId())
    .addAllPaymentMethodType(paymentMethodTypes)
    .setApplicationFeeAmount(123L)
    .build();

  PaymentIntent paymentIntent = PaymentIntent.create(paymentIntentParams, requestOptions);

  Map<String, String> responseData = new HashMap();
  responseData.put("paymentIntent", paymentIntent.getClientSecret());
  responseData.put("ephemeralKey", ephemeralKey.getSecret());
  responseData.put("customer", customer.getId());
  responseData.put("publishableKey", "<<YOUR_PUBLISHABLE_KEY>>");

  return gson.toJson(responseData);
});
```

#### Node

```javascript

// This example sets up an endpoint using the Express framework.

app.post('/payment-sheet', async (req, res) => {
  // Use an existing Customer ID if this is a returning customer.
  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    {customer: customer.id},
    {apiVersion: '2025-07-30.basil'}
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1099,
    currency: 'eur',
    customer: customer.id,
    payment_method_types: ['bancontact', 'card', 'ideal', 'klarna', 'sepa_debit'],
    application_fee_amount: 123,
  }, {
    stripeAccount: '{{CONNECTED_ACCOUNT_ID}}',
  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey: '<<YOUR_PUBLISHABLE_KEY>>'
  });
});
```

#### Go

```go

// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
stripe.Key = "<<YOUR_SECRET_KEY>>"

func handlePaymentSheet(w http.ResponseWriter, r *http.Request) {
  if r.Method != "POST" {
    http.Error(w, http.StatusText(http.StatusMethodNotAllowed), http.StatusMethodNotAllowed)
    return
  }

  // Use an existing Customer ID if this is a returning customer.
  cparams := &stripe.CustomerParams{}
  c, _ := customer.New(cparams)

  ekparams := &stripe.EphemeralKeyParams{
    Customer: stripe.String(c.ID),
    StripeVersion: stripe.String("2025-07-30.basil"),
  }
  ek, _ := ephemeralKey.New(ekparams)

  piparams := &stripe.PaymentIntentParams{
    Amount:   stripe.Int64(1099),
    Currency: stripe.String(string(stripe.CurrencyEUR)),
    Customer: stripe.String(c.ID),
    PaymentMethodTypes: []*string{
      stripe.String("bancontact"),
      stripe.String("card"),
      stripe.String("ideal"),
      stripe.String("klarna"),
      stripe.String("sepa_debit"),
    },
    ApplicationFeeAmount: stripe.Int64(123),
  }
  piparams.SetStripeAccount(""{{CONNECTED_ACCOUNT_ID}}""),
  pi, _ := paymentintent.New(piparams)

  writeJSON(w, struct {
    PaymentIntent  string `json:"paymentIntent"`
    EphemeralKey   string `json:"ephemeralKey"`
    Customer       string `json:"customer"`
    PublishableKey string `json:"publishableKey"`
  }{
    PaymentIntent: pi.ClientSecret,
    EphemeralKey: ek.Secret,
    Customer: c.ID,
    PublishableKey: "<<YOUR_PUBLISHABLE_KEY>>",
  })
}
```

#### .NET

```dotnet

// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeConfiguration.ApiKey = "<<YOUR_SECRET_KEY>>";

[HttpPost("payment-sheet")]
public ActionResult<PaymentSheetCreateResponse> CreatePaymentSheet([FromBody] CreatePaymentSheetRequest req)
{
  // Use an existing Customer ID if this is a returning customer.
  var customerOptions = new CustomerCreateOptions();
  var customerService = new CustomerService();
  var customer = customerService.Create(customerOptions);
  var ephemeralKeyOptions = new EphemeralKeyCreateOptions
  {
    Customer = customer.Id,
    StripeVersion = "2025-07-30.basil",
  };
  var ephemeralKeyService = new EphemeralKeyService();
  var ephemeralKey = ephemeralKeyService.Create(ephemeralKeyOptions);

  var paymentIntentOptions = new PaymentIntentCreateOptions
  {
    Amount = 1099,
    Currency = "eur",
    Customer = customer.Id,
    PaymentMethodTypes = new List<string>
    {
      "bancontact",
      "card",
      "ideal",
      "klarna",
      "sepa_debit",
    },
    ApplicationFeeAmount = 123,
  };
  var requestOptions = new RequestOptions
  {
    StripeAccount = ""{{CONNECTED_ACCOUNT_ID}}"",
  };
  var paymentIntentService = new PaymentIntentService();
  PaymentIntent paymentIntent = paymentIntentService.Create(paymentIntentOptions, requestOptions);

  return new PaymentSheetCreateResponse
  {
    PaymentIntent = paymentIntent.ClientSecret,
    EphemeralKey = ephemeralKey.Secret,

    Customer = customer.Id,
    PublishableKey = "<<YOUR_PUBLISHABLE_KEY>>",
  };
}
```

> Each payment method needs to support the currency passed in the PaymentIntent and your business needs to be based in one of the countries each payment method supports. See the [Payment method integration options](https://docs.stripe.com/payments/payment-methods/integration-options.md) page for more details about what’s supported.

## Integrate the payment sheet [Client-side]

Before displaying the mobile Payment Element, your checkout page should:

- Show the products being purchased and the total amount
- Collect any required shipping information using the [Address Element](https://docs.stripe.com/elements/address-element.md?platform=android)
- Include a checkout button to present Stripe’s UI

#### Jetpack Compose

[Initialise](https://stripe.dev/stripe-android/paymentsheet/com.stripe.android.paymentsheet/-payment-sheet/-builder/index.html) a `PaymentSheet` instance inside `onCreate` of your checkout Activity, passing a method to handle the result.

```kotlin
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import com.stripe.android.paymentsheet.PaymentSheet
import com.stripe.android.paymentsheet.PaymentSheetResult

@Composable
fun App() {
  val paymentSheet = remember { PaymentSheet.Builder(::onPaymentSheetResult) }.build()
}

private fun onPaymentSheetResult(paymentSheetResult: PaymentSheetResult) {
  // implemented in the next steps
}
```

Next, fetch the PaymentIntent client secret, Ephemeral Key secret, Customer ID, and publishable key from the endpoint you created in the previous step. Set the publishable key using `PaymentConfiguration` and store the others for use when you present the PaymentSheet.

```kotlin
import androidx.compose.runtime.Composable
import androidx.compose.runtime.rememberimport androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.compose.ui.platform.LocalContext
import com.stripe.android.PaymentConfiguration
import com.stripe.android.paymentsheet.PaymentSheet
import com.stripe.android.paymentsheet.PaymentSheetResult

@Composable
fun App() {
  val paymentSheet = remember { PaymentSheet.Builder(::onPaymentSheetResult) }.build()val context = LocalContext.current
  var customerConfig by remember { mutableStateOf<PaymentSheet.CustomerConfiguration?>(null) }
  varpaymentIntentClientSecret by remember { mutableStateOf<String?>(null) }

  LaunchedEffect(context) {
    // Make a request to your own server and retrieve payment configurations
    val networkResult = ...
    if (networkResult.isSuccess) {paymentIntentClientSecret = networkResult.paymentIntentcustomerConfig = PaymentSheet.CustomerConfiguration(
          id = networkResult.customer,
          ephemeralKeySecret = networkResult.ephemeralKey
        )PaymentConfiguration.init(context, networkResult.publishableKey, ""{{CONNECTED_ACCOUNT_ID}}"")}
  }
}

private fun onPaymentSheetResult(paymentSheetResult: PaymentSheetResult) {
  // implemented in the next steps
}
```

When the customer taps your checkout button, call [presentWithPaymentIntent](https://stripe.dev/stripe-android/paymentsheet/com.stripe.android.paymentsheet/-payment-sheet/index.html#1814490530%2FFunctions%2F2002900378) to present the payment sheet. After the customer completes the payment, the sheet dismisses and the [PaymentSheetResultCallback](https://stripe.dev/stripe-android/paymentsheet/com.stripe.android.paymentsheet/-payment-sheet-result-callback/index.html) is called with a [PaymentSheetResult](https://stripe.dev/stripe-android/paymentsheet/com.stripe.android.paymentsheet/-payment-sheet-result/index.html).

```kotlin
import androidx.compose.material.Button
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.platform.LocalContext
import com.stripe.android.PaymentConfiguration
import com.stripe.android.paymentsheet.PaymentSheet
import com.stripe.android.paymentsheet.PaymentSheetResult

@OptIn(ExperimentalCustomerSessionApi::class)
@Composable
fun App() {
  val paymentSheet = remember { PaymentSheet.Builder(::onPaymentSheetResult) }.build()
  val context = LocalContext.current
  var customerConfig by remember { mutableStateOf<PaymentSheet.CustomerConfiguration?>(null) }
  var paymentIntentClientSecret by remember { mutableStateOf<String?>(null) }

  LaunchedEffect(context) {
    // Make a request to your own server and retrieve payment configurations
    val networkResult = ...
    if (networkResult.isSuccess) {
        paymentIntentClientSecret = networkResult.paymentIntent
        customerConfig = PaymentSheet.CustomerConfiguration(
          id = networkResult.customer,
          ephemeralKeySecret = networkResult.ephemeralKey
        )
        PaymentConfiguration.init(context, networkResult.publishableKey, ""{{CONNECTED_ACCOUNT_ID}}"")
    }
  }Button(
    onClick = {
      val currentConfig = customerConfig
      val currentClientSecret =paymentIntentClientSecret

      if (currentConfig != null && currentClientSecret != null) {
        presentPaymentSheet(paymentSheet, currentConfig, currentClientSecret)
      }
    }
  ) {
    Text("Checkout")
  }
}private fun presentPaymentSheet(
  paymentSheet: PaymentSheet,
  customerConfig: PaymentSheet.CustomerConfiguration,paymentIntentClientSecret: String
) {
  paymentSheet.presentWithPaymentIntent(paymentIntentClientSecret,
    PaymentSheet.Configuration.Builder(merchantDisplayName = "My merchant name")
      .customer(customerConfig)
      // Set `allowsDelayedPaymentMethods` to true if your business handles
      // delayed notification payment methods like US bank accounts.
      .allowsDelayedPaymentMethods(true)
      .build()
  )
}
private fun onPaymentSheetResult(paymentSheetResult: PaymentSheetResult) {when(paymentSheetResult) {
    is PaymentSheetResult.Canceled -> {
      print("Canceled")
    }
    is PaymentSheetResult.Failed -> {
      print("Error: ${paymentSheetResult.error}")
    }
    is PaymentSheetResult.Completed -> {
      // Display for example, an order confirmation screen
      print("Completed")
    }
  }
}
```

#### Views (Classic)

[Initialise](https://stripe.dev/stripe-android/paymentsheet/com.stripe.android.paymentsheet/-payment-sheet/index.html#-394860221%2FConstructors%2F2002900378) a `PaymentSheet` instance inside `onCreate` of your checkout Activity, passing a method to handle the result.

#### Kotlin

```kotlin
import com.stripe.android.paymentsheet.PaymentSheet

class CheckoutActivity : AppCompatActivity() {
  lateinit var paymentSheet: PaymentSheet

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    paymentSheet = PaymentSheet.Builder(::onPaymentSheetResult).build(this)
  }

  fun onPaymentSheetResult(paymentSheetResult: PaymentSheetResult) {
    // implemented in the next steps
  }
}
```

#### Java

```java
import com.stripe.android.paymentsheet.*;

class CheckoutActivity extends AppCompatActivity {
    PaymentSheet paymentSheet;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        paymentSheet = new PaymentSheet.Builder(this::onPaymentSheetResult).build(this);
    }

    void onPaymentSheetResult(final PaymentSheetResult paymentSheetResult) {
        // implemented in the next steps
    }
}
```

Next, fetch the PaymentIntent client secret, Ephemeral Key secret, Customer ID, and publishable key from the endpoint you created in the previous step. Set the publishable key using `PaymentConfiguration` and store the others for use when you present the PaymentSheet.

#### Kotlin

```kotlin

import com.stripe.android.paymentsheet.PaymentSheet

class CheckoutActivity : AppCompatActivity() {
  lateinit var paymentSheet: PaymentSheetlateinit var customerConfig: PaymentSheet.CustomerConfiguration
  lateinit varpaymentIntentClientSecret: String

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    paymentSheet = PaymentSheet.Builder(::onPaymentSheetResult).build(this)lifecycleScope.launch {
      // Make a request to your own server and retrieve payment configurations
      val networkResult = MyBackend.getPaymentConfig()
      if (networkResult.isSuccess) {paymentIntentClientSecret = networkResult.paymentIntentcustomerConfig = PaymentSheet.CustomerConfiguration(
          id = networkResult.customer,
          ephemeralKeySecret = networkResult.ephemeralKey
        )PaymentConfiguration.init(context, networkResult.publishableKey, ""{{CONNECTED_ACCOUNT_ID}}"")}
    }
  }

  fun onPaymentSheetResult(paymentSheetResult: PaymentSheetResult) {
    // implemented in the next steps
  }
}
```

#### Java

```java

import com.stripe.android.paymentsheet.*;import com.stripe.android.PaymentConfiguration;

class CheckoutActivity extends AppCompatActivity {
  PaymentSheet paymentSheet;StringpaymentIntentClientSecret;
  PaymentSheet.CustomerConfiguration customerConfig;

  @Override
  protected void onCreate(@Nullable Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    paymentSheet = new PaymentSheet.Builder(this::onPaymentSheetResult).build(this);
// Make async request to your own server
    MyBackend.getPaymentConfig(new NetworkCallback() {
      @Override
      public void onSuccess(NetworkResult networkResult) {
        if (networkResult.isSuccess()) {customerConfig = new PaymentSheet.CustomerConfiguration(
            networkResult.getCustomer(),
            networkResult.getEphemeralKey()
          );paymentIntentClientSecret = networkResult.getpaymentIntent();PaymentConfiguration.init(getApplicationContext(), networkResult.getPublishableKey(), ""{{CONNECTED_ACCOUNT_ID}}"");}
      }

      @Override
      public void onError(Exception error) {
        // Handle error
      }
    });
  }

  void onPaymentSheetResult(final PaymentSheetResult paymentSheetResult) {
    // implemented in the next steps
  }
}
```

When the customer taps your checkout button, call [presentWithPaymentIntent](https://stripe.dev/stripe-android/paymentsheet/com.stripe.android.paymentsheet/-payment-sheet/index.html#1814490530%2FFunctions%2F2002900378) to present the payment sheet. After the customer completes the payment, the sheet dismisses and the [PaymentSheetResultCallback](https://stripe.dev/stripe-android/paymentsheet/com.stripe.android.paymentsheet/-payment-sheet-result-callback/index.html) is called with a [PaymentSheetResult](https://stripe.dev/stripe-android/paymentsheet/com.stripe.android.paymentsheet/-payment-sheet-result/index.html).

#### Kotlin

```kotlin
// ...
class CheckoutActivity : AppCompatActivity() {
  lateinit var paymentSheet: PaymentSheet
  lateinit var customerConfig: PaymentSheet.CustomerConfiguration
  lateinit var paymentIntentClientSecret: String
  // ...fun presentPaymentSheet() {
    paymentSheet.presentWithPaymentIntent(paymentIntentClientSecret,
      PaymentSheet.Configuration.Builder(merchantDisplayName = "My merchant name")
        .customer(customerConfig)
        // Set `allowsDelayedPaymentMethods` to true if your business handles
        // delayed notification payment methods like US bank accounts.
        .allowsDelayedPaymentMethods(true)
        .build()
    )
  }

  fun onPaymentSheetResult(paymentSheetResult: PaymentSheetResult) {when(paymentSheetResult) {
      is PaymentSheetResult.Canceled -> {
        print("Canceled")
      }
      is PaymentSheetResult.Failed -> {
        print("Error: ${paymentSheetResult.error}")
      }
      is PaymentSheetResult.Completed -> {
        // Display for example, an order confirmation screen
        print("Completed")
      }
    }
  }
}
```

#### Java

```java
// ...
public class CheckoutActivity extends AppCompatActivity {private static final String TAG = "CheckoutActivity";
  private PaymentSheet paymentSheet;
  private String paymentClientSecret;
  PaymentSheet.CustomerConfiguration customerConfig;
  // ...private void presentPaymentSheet() {
    final PaymentSheet.Configuration configuration = new PaymentSheet.Configuration.Builder("Example, Inc.")
        .customer(customerConfig)
        // Set `allowsDelayedPaymentMethods` to true if your business handles payment methods
        // delayed notification payment methods like US bank accounts.
        .allowsDelayedPaymentMethods(true)
        .build();
    paymentSheet.presentWithPaymentIntent(paymentClientSecret,
      configuration
    );
  }

  private void onPaymentSheetResult(
    final PaymentSheetResult paymentSheetResult
  ) {if (paymentSheetResult instanceof PaymentSheetResult.Canceled) {
      Log.d(TAG, "Canceled")
    } else if (paymentSheetResult instanceof PaymentSheetResult.Failed) {
      Log.e(TAG, "Got error: ", ((PaymentSheetResult.Failed) paymentSheetResult).getError());
    } else if (paymentSheetResult instanceof PaymentSheetResult.Completed) {
      // Display for example, an order confirmation screen
      Log.d(TAG, "Completed")
    }
  }
}
```

Setting `allowsDelayedPaymentMethods` to true allows [delayed notification](https://docs.stripe.com/payments/payment-methods.md#payment-notification) payment methods like US bank accounts. For these payment methods, the final payment status isn’t known when the `PaymentSheet` completes, and instead succeeds or fails later. If you support these types of payment methods, inform the customer their order is confirmed and only fulfil their order (for example, ship their product) when the payment is successful.

## Handle post-payment events [Server-side]

Stripe sends a [payment_intent.succeeded](https://docs.stripe.com/api/events/types.md#event_types-payment_intent.succeeded) event when the payment completes. Use the [Dashboard webhook tool](https://dashboard.stripe.com/webhooks) or follow the [webhook guide](https://docs.stripe.com/webhooks/quickstart.md) to receive these events and run actions, such as sending an order confirmation email to your customer, logging the sale in a database, or starting a shipping workflow.

Listen for these events rather than waiting on a callback from the client. On the client, the customer could close the browser window or quit the app before the callback executes, and malicious clients could manipulate the response. Setting up your integration to listen for asynchronous events is what enables you to accept [different types of payment methods](https://stripe.com/payments/payment-methods-guide) with a single integration.

In addition to handling the `payment_intent.succeeded` event, we recommend handling these other events when collecting payments with the Payment Element:

| Event                                                                                                                           | Description                                                                                                                                                                                                                                                                         | Action                                                                                                                                                                                           |
| ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [payment_intent.succeeded](https://docs.stripe.com/api/events/types.md?lang=php#event_types-payment_intent.succeeded)           | Sent when a customer successfully completes a payment.                                                                                                                                                                                                                              | Send the customer an order confirmation and *fulfill* (Fulfillment is the process of providing the goods or services purchased by a customer, typically after payment is collected) their order. |
| [payment_intent.processing](https://docs.stripe.com/api/events/types.md?lang=php#event_types-payment_intent.processing)         | Sent when a customer successfully initiates a payment, but the payment has yet to complete. This event is most commonly sent when the customer initiates a bank debit. It’s followed by either a `payment_intent.succeeded` or `payment_intent.payment_failed` event in the future. | Send the customer an order confirmation that indicates their payment is pending. For digital goods, you might want to fulfill the order before waiting for payment to complete.                  |
| [payment_intent.payment_failed](https://docs.stripe.com/api/events/types.md?lang=php#event_types-payment_intent.payment_failed) | Sent when a customer attempts a payment, but the payment fails.                                                                                                                                                                                                                     | If a payment transitions from `processing` to `payment_failed`, offer the customer another attempt to pay.                                                                                       |

## Test the integration

#### Cards

| Card number         | Scenario                                                                                                                                                                                                                                                                                      | How to test                                                                                           |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| 4242424242424242    | The card payment succeeds and doesn’t require authentication.                                                                                                                                                                                                                                 | Fill in the credit card form using the credit card number with any expiry date, CVC, and postal code. |
| 4000002500003155    | The card payment requires *authentication* (Strong Customer Authentication (SCA) is a regulatory requirement in effect as of September 14, 2019, that impacts many European online payments. It requires customers to use two-factor authentication like 3D Secure to verify their purchase). | Fill in the credit card form using the credit card number with any expiry date, CVC, and postal code. |
| 4000000000009995    | The card is declined with a decline code like `insufficient_funds`.                                                                                                                                                                                                                           | Fill in the credit card form using the credit card number with any expiry date, CVC, and postal code. |
| 6205500000000000004 | The UnionPay card has a variable length of 13-19 digits.                                                                                                                                                                                                                                      | Fill in the credit card form using the credit card number with any expiry date, CVC, and postal code. |

#### Bank redirects

| Payment method    | Scenario                                                                                                                                                                                              | How to test                                                                                                                                              |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bancontact, iDEAL | Your customer fails to authenticate on the redirect page for a redirect-based and immediate notification payment method.                                                                              | Choose any redirect-based payment method, fill out the required details, and confirm the payment. Then click **Fail test payment** on the redirect page. |
| Pay by Bank       | Your customer successfully pays with a redirect-based and [delayed notification](https://docs.stripe.com/payments/payment-methods.md#payment-notification) payment method.                            | Choose the payment method, fill out the required details, and confirm the payment. Then click **Complete test payment** on the redirect page.            |
| Pay by Bank       | Your customer fails to authenticate on the redirect page for a redirect-based and delayed notification payment method.                                                                                | Choose the payment method, fill out the required details, and confirm the payment. Then click **Fail test payment** on the redirect page.                |
| BLIK              | BLIK payments fail in a variety of ways – immediate failures (for example, the code has expired or is invalid), delayed errors (the bank declines) or timeouts (the customer didn’t respond in time). | Use email patterns to [simulate the different failures.](https://docs.stripe.com/payments/blik/accept-a-payment.md#simulate-failures)                    |

#### Bank debits

| Payment method    | Scenario                                                                                          | How to test                                                                                                                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SEPA Direct Debit | Your customer successfully pays with SEPA Direct Debit.                                           | Fill out the form using the account number `AT321904300235473204`. The confirmed PaymentIntent initially transitions to processing, then transitions to the succeeded status three minutes later. |
| SEPA Direct Debit | Your customer’s payment intent status transitions from `processing` to `requires_payment_method`. | Fill out the form using the account number `AT861904300235473202`.                                                                                                                                |

See [Testing](https://docs.stripe.com/testing.md) for additional information to test your integration.

## Optional: Enable Google Pay

### Set up your integration

To use Google Pay, first enable the Google Pay API by adding the following to the `<application>` tag of your **AndroidManifest.xml**:

```xml
<application>
  ...
  <meta-data
    android:name="com.google.android.gms.wallet.api.enabled"
    android:value="true" />
</application>
```

For more details, see Google Pay’s [Set up Google Pay API](https://developers.google.com/pay/api/android/guides/setup) for Android.

### Add Google Pay

To add Google Pay to your integration, pass a [PaymentSheet.GooglePayConfiguration](https://stripe.dev/stripe-android/paymentsheet/com.stripe.android.paymentsheet/-payment-sheet/-google-pay-configuration/index.html) with your Google Pay environment (production or test) and the [country code of your business](https://dashboard.stripe.com/settings/account) when initializing [PaymentSheet.Configuration](https://stripe.dev/stripe-android/paymentsheet/com.stripe.android.paymentsheet/-payment-sheet/-configuration/index.html).

#### Kotlin

```kotlin
val googlePayConfiguration = PaymentSheet.GooglePayConfiguration(
  environment = PaymentSheet.GooglePayConfiguration.Environment.Test,
  countryCode = "US",
  currencyCode = "USD" // Required for Setup Intents, optional for Payment Intents
)
val configuration = PaymentSheet.Configuration.Builder(merchantDisplayName = "My merchant name")
  .googlePay(googlePayConfiguration)
  .build()
```

#### Java

```java

final PaymentSheet.GooglePayConfiguration googlePayConfiguration =
  new PaymentSheet.GooglePayConfiguration(
    PaymentSheet.GooglePayConfiguration.Environment.Test,
    "US"
  );

 final PaymentSheet.Configuration configuration = // ...
 configuration.setGooglePay(googlePayConfiguration);
);
```

### Test Google Pay

Google allows you to make test payments through their [Test card suite](https://developers.google.com/pay/api/android/guides/resources/test-card-suite). The test suite supports using stripe [test cards](https://docs.stripe.com/testing.md).

You can test Google Pay using a physical Android device. Make sure you have a device in a country where Google Pay is supported and log in to a Google account on your test device with a real card saved to Google Wallet.

## Optional: Customize the sheet

All customisation is configured using the [PaymentSheet.Configuration](https://stripe.dev/stripe-android/paymentsheet/com.stripe.android.paymentsheet/-payment-sheet/-configuration/index.html) object.

### Appearance

Customise colours, fonts, and more to match the look and feel of your app by using the [appearance API](https://docs.stripe.com/elements/appearance-api.md?platform=android).

### Payment method layout

Configure the layout of payment methods in the sheet using [paymentMethodLayout](https://stripe.dev/stripe-android/paymentsheet/com.stripe.android.paymentsheet/-payment-sheet/-configuration/-builder/index.html#2123253356%2FFunctions%2F2002900378). You can display them horizontally, vertically, or let Stripe optimise the layout automatically.
![](https://b.stripecdn.com/docs-statics-srv/assets/android-mpe-payment-method-layouts.3bcfe828ceaad1a94e0572a22d91733f.png)

#### Kotlin

```kotlin
PaymentSheet.Configuration.Builder("Example, Inc.")
  .paymentMethodLayout(PaymentSheet.PaymentMethodLayout.Automatic)
  .build()
```

#### Java

```java
new PaymentSheet.Configuration.Builder("Example, Inc.")
  .paymentMethodLayout(PaymentSheet.PaymentMethodLayout.Automatic)
  .build();
```

### Collect users addresses

Collect local and international shipping or billing addresses from your customers using the [Address Element](https://docs.stripe.com/elements/address-element.md?platform=android).

### Business display name

Specify a customer-facing business name by setting [merchantDisplayName](https://stripe.dev/stripe-android/paymentsheet/com.stripe.android.paymentsheet/-payment-sheet/-configuration/index.html#-191101533%2FProperties%2F2002900378). By default, this is your app’s name.

#### Kotlin

```kotlin
PaymentSheet.Configuration.Builder(
  merchantDisplayName = "My app, Inc."
).build()
```

#### Java

```java
new PaymentSheet.Configuration.Builder("My app, Inc.")
  .build();
```

### Dark mode

By default, `PaymentSheet` automatically adapts to the user’s system-wide appearance settings (light and dark mode). You can change this by setting light or dark mode on your app:

#### Kotlin

```kotlin
// force dark
AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES)
// force light
AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO)
```

#### Java

```java
// force dark
AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES);
// force light
AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO);
```

### Default billing details

To set default values for billing details collected in the payment sheet, configure the `defaultBillingDetails` property. The `PaymentSheet` pre-populates its fields with the values that you provide.

#### Kotlin

```kotlin
val address = PaymentSheet.Address(country = "US")
val billingDetails = PaymentSheet.BillingDetails(
  address = address,
  email = "foo@bar.com"
)
val configuration = PaymentSheet.Configuration.Builder(merchantDisplayName = "Merchant, Inc.")
  .defaultBillingDetails(billingDetails)
  .build()
```

#### Java

```java
PaymentSheet.Address address =
  new PaymentSheet.Address.Builder()
    .country("US")
    .build();
PaymentSheet.BillingDetails billingDetails =
  new PaymentSheet.BillingDetails.Builder()
    .address(address)
    .email("foo@bar.com")
    .build();
PaymentSheet.Configuration configuration =
  new PaymentSheet.Configuration.Builder("Merchant, Inc.")
    .defaultBillingDetails(billingDetails)
    .build();
```

### Configure collection of billing details

Use `BillingDetailsCollectionConfiguration` to specify how you want to collect billing details in the PaymentSheet.

You can collect your customer’s name, email, phone number, and address.

If you want to attach default billing details to the PaymentMethod object even when those fields aren’t collected in the UI, set `billingDetailsCollectionConfiguration.attachDefaultsToPaymentMethod` to `true`.

#### Kotlin

```kotlin
val billingDetails = PaymentSheet.BillingDetails(
  email = "foo@bar.com"
)
val billingDetailsCollectionConfiguration = BillingDetailsCollectionConfiguration(
  attachDefaultsToPaymentMethod = true,
  name = BillingDetailsCollectionConfiguration.CollectionMode.Always,
  email = BillingDetailsCollectionConfiguration.CollectionMode.Never,
  address = BillingDetailsCollectionConfiguration.AddressCollectionMode.Full,
)
val configuration = PaymentSheet.Configuration.Builder(merchantDisplayName = "Merchant, Inc.")
  .defaultBillingDetails(billingDetails)
  .billingDetailsCollectionConfiguration(billingDetailsCollectionConfiguration)
  .build()
```

#### Java

```java
PaymentSheet.BillingDetails billingDetails =
  new PaymentSheet.BillingDetails.Builder()
    .email("foo@bar.com")
    .build();
BillingDetailsCollectionConfiguration billingDetailsCollectionConfiguration = new BillingDetailsCollectionConfiguration(
  /* name */ BillingDetailsCollectionConfiguration.CollectionMode.Always,
  /* email */ BillingDetailsCollectionConfiguration.CollectionMode.Never,
  /* phone */ BillingDetailsCollectionConfiguration.CollectionMode.Automatic,
  /* address */ BillingDetailsCollectionConfiguration.AddressCollectionMode.Automatic,
  /* attachDefaultsToPaymentMethod */ true
)
PaymentSheet.Configuration configuration =
  new PaymentSheet.Configuration.Builder("Merchant, Inc.")
    .defaultBillingDetails(billingDetails)
    .billingDetailsCollectionConfiguration(billingDetailsCollectionConfiguration)
    .build();
```

> Consult with your legal counsel regarding laws that apply to collecting information. Only collect phone numbers if you need them for the transaction.

## Optional: Complete payment in your UI

You can present Payment Sheet to only collect payment method details and complete the payment back in your app’s UI. This is useful if you have a custom buy button or require additional steps after payment details are collected.
![](https://b.stripecdn.com/docs-statics-srv/assets/android-multi-step.84d8a0a44b1baa596bda491322b6d9fd.png)

> A sample integration is [available on our GitHub](https://github.com/stripe/stripe-android/blob/master/paymentsheet-example/src/main/java/com/stripe/android/paymentsheet/example/samples/ui/custom_flow/CustomFlowActivity.kt).

1. First, initialise [PaymentSheet.FlowController](https://stripe.dev/stripe-android/paymentsheet/com.stripe.android.paymentsheet/-payment-sheet/-flow-controller/index.html) instead of `PaymentSheet` using one of the [Builder](https://stripe.dev/stripe-android/paymentsheet/com.stripe.android.paymentsheet/-payment-sheet/-flow-controller/-builder/index.html) methods.

#### Android (Kotlin)

```kotlin
class CheckoutActivity : AppCompatActivity() {
  private lateinit var flowController: PaymentSheet.FlowController

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    flowController = PaymentSheet.FlowController.Builder(
      paymentResultCallback = ::onPaymentSheetResult,
      paymentOptionCallback = ::onPaymentOption,
    ).build(this)
  }
}
```

#### Android (Java)

```java
public class CheckoutActivity extends AppCompatActivity {
  private PaymentSheet.FlowController flowController;

  @Override
  protected void onCreate(@Nullable Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    final PaymentOptionCallback paymentOptionCallback = paymentOption -> {
      onPaymentOption(paymentOption);
    };

    final PaymentSheetResultCallback paymentSheetResultCallback = paymentSheetResult -> {
      onPaymentSheetResult(paymentSheetResult);
    };

    flowController = new PaymentSheet.FlowController.Builder(
      paymentSheetResultCallback,
      paymentOptionCallback
    ).build(this);
  }
}
```

1. Next, call `configureWithPaymentIntent` with the Stripe object keys fetched from your back end and update your UI in the callback using [getPaymentOption()](https://stripe.dev/stripe-android/paymentsheet/com.stripe.android.paymentsheet/-payment-sheet/-flow-controller/index.html#-2091462043%2FFunctions%2F2002900378). This contains an image and label representing the customer’s currently selected payment method.

#### Android (Kotlin)

```kotlin
flowController.configureWithPaymentIntent(
  paymentIntentClientSecret = paymentIntentClientSecret,
  configuration = PaymentSheet.Configuration.Builder("Example, Inc.")
    .customer(PaymentSheet.CustomerConfiguration(
      id = customerId,
      ephemeralKeySecret = ephemeralKeySecret
    ))
    .build()
) { isReady, error ->
  if (isReady) {
    // Update your UI using `flowController.getPaymentOption()`
  } else {
    // handle FlowController configuration failure
  }
}
```

#### Android (Java)

```java
flowController.configureWithPaymentIntent(
  paymentIntentClientSecret,
  new PaymentSheet.Configuration.Builder("Example, Inc.")
    .customer(new PaymentSheet.CustomerConfiguration(
      customerId,
      ephemeralKeySecret
    ))
    .build(),
  (success, error) -> {
    if (success) {
      // Update your UI using `flowController.getPaymentOption()`
    } else {
      // handle FlowController configuration failure
    }
  }
);
```

1. Next, call [presentPaymentOptions](https://stripe.dev/stripe-android/paymentsheet/com.stripe.android.paymentsheet/-payment-sheet/-flow-controller/index.html#449924733%2FFunctions%2F2002900378) to collect payment details. When the customer finishes, the sheet is dismissed and calls the [paymentOptionCallback](https://stripe.dev/stripe-android/paymentsheet/com.stripe.android.paymentsheet/-payment-option-callback/index.html) passed earlier in `create`. Implement this method to update your UI with the returned `paymentOption`.

#### Android (Kotlin)

```kotlin
// ...
  flowController.presentPaymentOptions()
// ...
  private fun onPaymentOption(paymentOption: PaymentOption?) {
    if (paymentOption != null) {
      paymentMethodButton.text = paymentOption.label
      paymentMethodButton.setCompoundDrawablesRelativeWithIntrinsicBounds(
        paymentOption.drawableResourceId,
        0,
        0,
        0
      )
    } else {
      paymentMethodButton.text = "Select"
      paymentMethodButton.setCompoundDrawablesRelativeWithIntrinsicBounds(
        null,
        null,
        null,
        null
      )
    }
  }
```

#### Android (Java)

```java
// ...
    flowController.presentPaymentOptions());
// ...
  private void onPaymentOption(
    @Nullable PaymentOption paymentOption
  ) {
    if (paymentOption != null) {
      paymentMethodButton.setText(paymentOption.getLabel());
      paymentMethodButton.setCompoundDrawablesRelativeWithIntrinsicBounds(
        paymentOption.getDrawableResourceId(),
        0,
        0,
        0
      );
    } else {
      paymentMethodButton.setText("Select");
      paymentMethodButton.setCompoundDrawablesRelativeWithIntrinsicBounds(
        null,
        null,
        null,
        null
      );
    }
  }

  private void onCheckout() {
    // see below
  }
}
```

1. Finally, call [confirm](https://stripe.dev/stripe-android/paymentsheet/com.stripe.android.paymentsheet/-payment-sheet/-flow-controller/index.html#-479056656%2FFunctions%2F2002900378) to complete the payment. When the customer finishes, the sheet is dismissed and calls the [paymentResultCallback](https://stripe.dev/stripe-android/paymentsheet/com.stripe.android.paymentsheet/-payment-sheet-result-callback/index.html#237248767%2FFunctions%2F2002900378) passed earlier in `create`.

#### Android (Kotlin)

```kotlin
  // ...
    flowController.confirmPayment()
  // ...

  private fun onPaymentSheetResult(
    paymentSheetResult: PaymentSheetResult
  ) {
    when (paymentSheetResult) {
      is PaymentSheetResult.Canceled -> {
        // Payment canceled
      }
      is PaymentSheetResult.Failed -> {
        // Payment Failed. See logcat for details or inspect paymentSheetResult.error
      }
      is PaymentSheetResult.Completed -> {
        // Payment Complete
      }
    }
  }
```

#### Android (Java)

```java
  // ...
    flowController.confirmPayment();
  // ...

  private void onPaymentSheetResult(
    final PaymentSheetResult paymentSheetResult
  ) {
    if (paymentSheetResult instanceof PaymentSheetResult.Canceled) {
      // Payment Canceled
    } else if (paymentSheetResult instanceof PaymentSheetResult.Failed) {
      // Payment Failed. See logcat for details or inspect paymentSheetResult.getError()
    } else if (paymentSheetResult instanceof PaymentSheetResult.Completed) {
      // Payment Complete
    }
  }
```

Setting `allowsDelayedPaymentMethods` to true allows [delayed notification](https://docs.stripe.com/payments/payment-methods.md#payment-notification) payment methods like US bank accounts. For these payment methods, the final payment status isn’t known when the `PaymentSheet` completes, and instead succeeds or fails later. If you support these types of payment methods, inform the customer their order is confirmed and only fulfil their order (for example, ship their product) when the payment is successful.

## Testing

Test your account creation flow by [creating accounts](https://docs.stripe.com/connect/testing.md#creating-accounts) and [using OAuth](https://docs.stripe.com/connect/testing.md#using-oauth). Test your **Payment methods** settings for your connected accounts by logging into one of your test accounts and navigating to the [Payment methods settings](https://dashboard.stripe.com/settings/payment_methods). Test your checkout flow with your test keys and a test account. You can use our [test cards](https://docs.stripe.com/testing.md) to test your payments flow and simulate various payment outcomes.


# Card element only

> This is a Card element only for when platform is android and mobile-ui is card-element. View the full page at https://docs.stripe.com/connect/enable-payment-acceptance-guide?platform=android&mobile-ui=card-element.

Securely collect card information on the client with [CardInputWidget](https://stripe.dev/stripe-android/stripe/com.stripe.android.view/-card-input-widget/index.html), a drop-in UI component provided by the SDK that collects the card number, expiration date, CVC, and postal code.
![](https://d37ugbyn3rpeym.cloudfront.net/docs/mobile/android/android-card-input-widget-with-postal.mp4)
## Prerequisites

### Prerequisites

- [ ] [Register your platform](https://dashboard.stripe.com/connect)

- [ ] Add business details to [activate your account](https://dashboard.stripe.com/account/onboarding)

- [ ] [Complete your platform profile](https://dashboard.stripe.com/connect/settings/profile)

- [ ] [Customise brand settings](https://dashboard.stripe.com/settings/connect/stripe-dashboard/branding)
Add a business name, icon, and brand colour.

## Set up Stripe [Server-side] [Client-side]

### Server-side

This integration requires endpoints on your server that talk to the Stripe API. Use the official libraries for access to the Stripe API from your server:

#### Ruby

```bash
# Available as a gem
sudo gem install stripe
```

```ruby
# If you use bundler, you can add this line to your Gemfile
gem 'stripe'
```

#### Python

```bash
# Install through pip
pip3 install --upgrade stripe
```

```bash
# Or find the Stripe package on http://pypi.python.org/pypi/stripe/
```

```python
# Find the version you want to pin:
# https://github.com/stripe/stripe-python/blob/master/CHANGELOG.md
# Specify that version in your requirements.txt file
stripe>=5.0.0
```

#### PHP

```bash
# Install the PHP library with Composer
composer require stripe/stripe-php
```

```bash
# Or download the source directly: https://github.com/stripe/stripe-php/releases
```

#### Java

```java
/*
  For Gradle, add the following dependency to your build.gradle and replace with
  the version number you want to use from:
  - https://mvnrepository.com/artifact/com.stripe/stripe-java or
  - https://github.com/stripe/stripe-java/releases/latest
*/
implementation "com.stripe:stripe-java:29.0.0"
```

```xml
<!--
  For Maven, add the following dependency to your POM and replace with the
  version number you want to use from:
  - https://mvnrepository.com/artifact/com.stripe/stripe-java or
  - https://github.com/stripe/stripe-java/releases/latest
-->
<dependency>
  <groupId>com.stripe</groupId>
  <artifactId>stripe-java</artifactId>
  <version>29.0.0</version>
</dependency>
```

```bash
# For other environments, manually install the following JARs:
# - The Stripe JAR from https://github.com/stripe/stripe-java/releases/latest
# - Google Gson from https://github.com/google/gson
```

#### Node

```bash
# Install with npm
npm install stripe --save
```

#### Go

```bash
# Make sure your project is using Go Modules
go mod init
# Install stripe-go
go get -u github.com/stripe/stripe-go/v82
```

```go
// Then import the package
import (
  "github.com/stripe/stripe-go/v82"
)
```

#### .NET

```bash
# Install with dotnet
dotnet add package Stripe.net
dotnet restore
```

```bash
# Or install with NuGet
Install-Package Stripe.net
```

### Client-side

The [Stripe Android SDK](https://github.com/stripe/stripe-android) is open source and [fully documented](https://stripe.dev/stripe-android/).

To install the SDK, add `stripe-android` to the `dependencies` block of your [app/build.gradle](https://developer.android.com/studio/build/dependencies) file:

#### Kotlin

```kotlin
plugins {
    id("com.android.application")
}

android { ... }

dependencies {
  // ...

  // Stripe Android SDK
  implementation("com.stripe:stripe-android:21.24.1")
  // Include the financial connections SDK to support US bank account as a payment method
  implementation("com.stripe:financial-connections:21.24.1")
}
```

#### Groovy

```groovy
apply plugin: 'com.android.application'

android { ... }

dependencies {
  // ...

  // Stripe Android SDK
  implementation 'com.stripe:stripe-android:21.24.1'
  // Include the financial connections SDK to support US bank account as a payment method
  implementation 'com.stripe:financial-connections:21.24.1'
}
```

> For details on the latest SDK release and past versions, see the [Releases](https://github.com/stripe/stripe-android/releases) page on GitHub. To receive notifications when a new release is published, [watch releases for the repository](https://docs.github.com/en/github/managing-subscriptions-and-notifications-on-github/configuring-notifications#configuring-your-watch-settings-for-an-individual-repository).

Configure the SDK with your Stripe [publishable key](https://dashboard.stripe.com/apikeys) so that it can make requests to the Stripe API, such as in your `Application` subclass:

#### Kotlin

```kotlin
import com.stripe.android.PaymentConfiguration

class MyApp : Application() {
    override fun onCreate() {
        super.onCreate()
        PaymentConfiguration.init(
            applicationContext,
            "<<YOUR_PUBLISHABLE_KEY>>"
        )
    }
}
```

#### Java

```java
import com.stripe.android.PaymentConfiguration;

public class MyApp extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
        PaymentConfiguration.init(
            getApplicationContext(),
            "<<YOUR_PUBLISHABLE_KEY>>"
        );
    }
}
```

> Use your [test keys](https://docs.stripe.com/keys.md#obtain-api-keys) while you test and develop, and your [live mode](https://docs.stripe.com/keys.md#test-live-modes) keys when you publish your app.

Stripe samples also use [OkHttp](https://github.com/square/okhttp) and [GSON](https://github.com/google/gson) to make HTTP requests to a server.

## Create a connected account

Use this guide to learn how to use code to create a connected account. If you’re not ready to integrate yet, you can start by creating a connected account [through the dashboard](https://docs.stripe.com/connect/dashboard/managing-individual-accounts.md).

When a user (seller or service provider) signs up on your platform, create a user [Account](https://docs.stripe.com/api/accounts.md) (referred to as a *connected account*) so you can accept payments and move funds to their bank account. Connected accounts represent your user in Stripe’s API and help facilitate the collection of onboarding requirements so Stripe can verify the user’s identity. In our store builder example, the connected account represents the business setting up their online store.
![](https://b.stripecdn.com/docs-statics-srv/assets/standard-android.04900ae101e927a74a6f2b0afb53bf23.png)

### Step 2.1: Create a connected account and prefill information (Server-side)

Use the `/v1/accounts` API to [create](https://docs.stripe.com/api/accounts/create.md) a connected account. You can create the connected account by using the [default connected account parameters](https://docs.stripe.com/connect/migrate-to-controller-properties.md), or by specifying the account type.

#### With default properties

```curl
curl -X POST https://api.stripe.com/v1/accounts \
  -u "<<YOUR_SECRET_KEY>>:"
```

```cli
stripe accounts create
```

```ruby
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
Stripe.api_key = '<<YOUR_SECRET_KEY>>'

account = Stripe::Account.create()
```

```ruby
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
client = Stripe::StripeClient.new("<<YOUR_SECRET_KEY>>")

account = client.v1.accounts.create()
```

```python
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
import stripe
stripe.api_key = "<<YOUR_SECRET_KEY>>"

account = stripe.Account.create()
```

```python
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
client = StripeClient("<<YOUR_SECRET_KEY>>")

account = client.accounts.create()
```

```php
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
$stripe = new \Stripe\StripeClient('<<YOUR_SECRET_KEY>>');

$account = $stripe->accounts->create([]);
```

```java
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
Stripe.apiKey = "<<YOUR_SECRET_KEY>>";

AccountCreateParams params = AccountCreateParams.builder().build();

Account account = Account.create(params);
```

```java
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeClient client = new StripeClient("<<YOUR_SECRET_KEY>>");

AccountCreateParams params = AccountCreateParams.builder().build();

Account account = client.accounts().create(params);
```

```node
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = require('stripe')('<<YOUR_SECRET_KEY>>');

const account = await stripe.accounts.create();
```

```go
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
stripe.Key = "<<YOUR_SECRET_KEY>>"

params := &stripe.AccountParams{}
result, err := account.New(params)
```

```go
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
sc := stripe.NewClient("<<YOUR_SECRET_KEY>>")
params := &stripe.AccountCreateParams{}
result, err := sc.V1Accounts.Create(context.TODO(), params)
```

```dotnet
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeConfiguration.ApiKey = "<<YOUR_SECRET_KEY>>";

var options = new AccountCreateOptions();
var service = new AccountService();
Account account = service.Create(options);
```

```dotnet
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
var options = new AccountCreateOptions();
var client = new StripeClient("<<YOUR_SECRET_KEY>>");
var service = client.V1.Accounts;
Account account = service.Create(options);
```

#### With account type

```curl
curl https://api.stripe.com/v1/accounts \
  -u "<<YOUR_SECRET_KEY>>:" \
  -d type=standard
```

```cli
stripe accounts create  \
  --type=standard
```

```ruby
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
Stripe.api_key = '<<YOUR_SECRET_KEY>>'

account = Stripe::Account.create({type: 'standard'})
```

```ruby
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
client = Stripe::StripeClient.new("<<YOUR_SECRET_KEY>>")

account = client.v1.accounts.create({type: 'standard'})
```

```python
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
import stripe
stripe.api_key = "<<YOUR_SECRET_KEY>>"

account = stripe.Account.create(type="standard")
```

```python
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
client = StripeClient("<<YOUR_SECRET_KEY>>")

account = client.accounts.create({"type": "standard"})
```

```php
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
$stripe = new \Stripe\StripeClient('<<YOUR_SECRET_KEY>>');

$account = $stripe->accounts->create(['type' => 'standard']);
```

```java
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
Stripe.apiKey = "<<YOUR_SECRET_KEY>>";

AccountCreateParams params =
  AccountCreateParams.builder().setType(AccountCreateParams.Type.STANDARD).build();

Account account = Account.create(params);
```

```java
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeClient client = new StripeClient("<<YOUR_SECRET_KEY>>");

AccountCreateParams params =
  AccountCreateParams.builder().setType(AccountCreateParams.Type.STANDARD).build();

Account account = client.accounts().create(params);
```

```node
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = require('stripe')('<<YOUR_SECRET_KEY>>');

const account = await stripe.accounts.create({
  type: 'standard',
});
```

```go
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
stripe.Key = "<<YOUR_SECRET_KEY>>"

params := &stripe.AccountParams{Type: stripe.String(stripe.AccountTypeStandard)}
result, err := account.New(params)
```

```go
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
sc := stripe.NewClient("<<YOUR_SECRET_KEY>>")
params := &stripe.AccountCreateParams{Type: stripe.String(stripe.AccountTypeStandard)}
result, err := sc.V1Accounts.Create(context.TODO(), params)
```

```dotnet
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeConfiguration.ApiKey = "<<YOUR_SECRET_KEY>>";

var options = new AccountCreateOptions { Type = "standard" };
var service = new AccountService();
Account account = service.Create(options);
```

```dotnet
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
var options = new AccountCreateOptions { Type = "standard" };
var client = new StripeClient("<<YOUR_SECRET_KEY>>");
var service = client.V1.Accounts;
Account account = service.Create(options);
```

If you’ve already collected information for your connected accounts, you can pre-fill that information on the `Account` object. You can pre-fill any account information, including personal and business information, external account information, and so on.

Connect Onboarding doesn’t ask for the prefilled information. However, it does ask the account holder to confirm the prefilled information before accepting the [Connect service agreement](https://docs.stripe.com/connect/service-agreement-types.md).

When testing your integration, prefill account information using [test data](https://docs.stripe.com/connect/testing.md).

### Step 2.2: Create an account link (Server-side)

You can create an account link by calling the [Account Links](https://docs.stripe.com/api/account_links.md) API with the following parameters:

- `account`
- `refresh_url`
- `return_url`
- `type` = `account_onboarding`

```curl
curl https://api.stripe.com/v1/account_links \
  -u "<<YOUR_SECRET_KEY>>:" \
  -d account="{{CONNECTEDACCOUNT_ID}}" \
  --data-urlencode refresh_url="https://example.com/reauth" \
  --data-urlencode return_url="https://example.com/return" \
  -d type=account_onboarding
```

```cli
stripe account_links create  \
  --account="{{CONNECTEDACCOUNT_ID}}" \
  --refresh-url="https://example.com/reauth" \
  --return-url="https://example.com/return" \
  --type=account_onboarding
```

```ruby
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
Stripe.api_key = '<<YOUR_SECRET_KEY>>'

account_link = Stripe::AccountLink.create({
  account: '{{CONNECTEDACCOUNT_ID}}',
  refresh_url: 'https://example.com/reauth',
  return_url: 'https://example.com/return',
  type: 'account_onboarding',
})
```

```ruby
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
client = Stripe::StripeClient.new("<<YOUR_SECRET_KEY>>")

account_link = client.v1.account_links.create({
  account: '{{CONNECTEDACCOUNT_ID}}',
  refresh_url: 'https://example.com/reauth',
  return_url: 'https://example.com/return',
  type: 'account_onboarding',
})
```

```python
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
import stripe
stripe.api_key = "<<YOUR_SECRET_KEY>>"

account_link = stripe.AccountLink.create(
  account="{{CONNECTEDACCOUNT_ID}}",
  refresh_url="https://example.com/reauth",
  return_url="https://example.com/return",
  type="account_onboarding",
)
```

```python
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
client = StripeClient("<<YOUR_SECRET_KEY>>")

account_link = client.account_links.create({
  "account": "{{CONNECTEDACCOUNT_ID}}",
  "refresh_url": "https://example.com/reauth",
  "return_url": "https://example.com/return",
  "type": "account_onboarding",
})
```

```php
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
$stripe = new \Stripe\StripeClient('<<YOUR_SECRET_KEY>>');

$accountLink = $stripe->accountLinks->create([
  'account' => '{{CONNECTEDACCOUNT_ID}}',
  'refresh_url' => 'https://example.com/reauth',
  'return_url' => 'https://example.com/return',
  'type' => 'account_onboarding',
]);
```

```java
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
Stripe.apiKey = "<<YOUR_SECRET_KEY>>";

AccountLinkCreateParams params =
  AccountLinkCreateParams.builder()
    .setAccount("{{CONNECTEDACCOUNT_ID}}")
    .setRefreshUrl("https://example.com/reauth")
    .setReturnUrl("https://example.com/return")
    .setType(AccountLinkCreateParams.Type.ACCOUNT_ONBOARDING)
    .build();

AccountLink accountLink = AccountLink.create(params);
```

```java
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeClient client = new StripeClient("<<YOUR_SECRET_KEY>>");

AccountLinkCreateParams params =
  AccountLinkCreateParams.builder()
    .setAccount("{{CONNECTEDACCOUNT_ID}}")
    .setRefreshUrl("https://example.com/reauth")
    .setReturnUrl("https://example.com/return")
    .setType(AccountLinkCreateParams.Type.ACCOUNT_ONBOARDING)
    .build();

AccountLink accountLink = client.accountLinks().create(params);
```

```node
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = require('stripe')('<<YOUR_SECRET_KEY>>');

const accountLink = await stripe.accountLinks.create({
  account: '{{CONNECTEDACCOUNT_ID}}',
  refresh_url: 'https://example.com/reauth',
  return_url: 'https://example.com/return',
  type: 'account_onboarding',
});
```

```go
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
stripe.Key = "<<YOUR_SECRET_KEY>>"

params := &stripe.AccountLinkParams{
  Account: stripe.String("{{CONNECTEDACCOUNT_ID}}"),
  RefreshURL: stripe.String("https://example.com/reauth"),
  ReturnURL: stripe.String("https://example.com/return"),
  Type: stripe.String("account_onboarding"),
}
result, err := accountlink.New(params)
```

```go
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
sc := stripe.NewClient("<<YOUR_SECRET_KEY>>")
params := &stripe.AccountLinkCreateParams{
  Account: stripe.String("{{CONNECTEDACCOUNT_ID}}"),
  RefreshURL: stripe.String("https://example.com/reauth"),
  ReturnURL: stripe.String("https://example.com/return"),
  Type: stripe.String("account_onboarding"),
}
result, err := sc.V1AccountLinks.Create(context.TODO(), params)
```

```dotnet
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeConfiguration.ApiKey = "<<YOUR_SECRET_KEY>>";

var options = new AccountLinkCreateOptions
{
    Account = "{{CONNECTEDACCOUNT_ID}}",
    RefreshUrl = "https://example.com/reauth",
    ReturnUrl = "https://example.com/return",
    Type = "account_onboarding",
};
var service = new AccountLinkService();
AccountLink accountLink = service.Create(options);
```

```dotnet
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
var options = new AccountLinkCreateOptions
{
    Account = "{{CONNECTEDACCOUNT_ID}}",
    RefreshUrl = "https://example.com/reauth",
    ReturnUrl = "https://example.com/return",
    Type = "account_onboarding",
};
var client = new StripeClient("<<YOUR_SECRET_KEY>>");
var service = client.V1.AccountLinks;
AccountLink accountLink = service.Create(options);
```

### Step 2.3: Redirect your user to the account link URL (Client-side)

The response to your [Account Links](https://docs.stripe.com/api/account_links.md) request includes a value for the key `url`. Redirect to this link to send your user into the flow. URLs from the [Account Links](https://docs.stripe.com/api/account_links.md) API are temporary and can be used only once because they grant access to the account holder’s personal information. Authenticate the user in your application before redirecting them to this URL. If you want to prefill information, you must do so before generating the account link. After you create the account link for a Standard account, you will not be able to read or write information for the account.

> Don’t email, text, or otherwise send account link URLs outside your platform application. Instead, provide them to the authenticated account holder within your application.

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".activity.ConnectWithStripeActivity">

    <Button
        android:id="@+id/connect_with_stripe"
        android:text="Connect with Stripe"
        android:layout_height="wrap_content"
        android:layout_width="wrap_content"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent"
        style="?attr/materialButtonOutlinedStyle"
        />

</androidx.constraintlayout.widget.ConstraintLayout>
```

#### Kotlin

```kotlin
class ConnectWithStripeActivity : AppCompatActivity() {

    private val viewBinding: ActivityConnectWithStripeViewBinding by lazy {
        ActivityConnectWithStripeViewBinding.inflate(layoutInflater)
    }
    private val httpClient = OkHttpClient()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(viewBinding.root)

        viewBinding.connectWithStripe.setOnClickListener {
            val weakActivity = WeakReference<Activity>(this)
            val request = Request.Builder()
                .url(BACKEND_URL + "onboard-user")
                .post("".toRequestBody())
                .build()
            httpClient.newCall(request)
                .enqueue(object: Callback {
                    override fun onFailure(call: Call, e: IOException) {
                        // Request failed
                    }
                    override fun onResponse(call: Call, response: Response) {
                        if (!response.isSuccessful) {
                            // Request failed
                        } else {
                            val responseData = response.body?.string()
                            val responseJson =
                                responseData?.let { JSONObject(it) } ?: JSONObject()
                            val url = responseJson.getString("url")

                            weakActivity.get()?.let {
                                val builder: CustomTabsIntent.Builder = CustomTabsIntent.Builder()
                                val customTabsIntent = builder.build()
                                customTabsIntent.launchUrl(it, Uri.parse(url))
                            }
                        }
                    }
                })
        }
    }

    internal companion object {
        internal const val BACKEND_URL = "https://example-backend-url.com/"
    }
}
```

#### Java

```java
public class ConnectWithStripeActivity extends AppCompatActivity {
    private static final String BACKEND_URL = "https://example-backend-url.com/";
    private OkHttpClient httpClient = new OkHttpClient();
    private ActivityConnectWithStripeViewBinding viewBinding;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        viewBinding = ActivityConnectWithStripeViewBinding.inflate(getLayoutInflater());

        viewBinding.connectWithStripe.setOnClickListener(view -> {
            WeakReference<Activity> weakActivity = new WeakReference<>(this);
            Request request = new Request.Builder()
                    .url(BACKEND_URL + "onboard-user")
                    .post(RequestBody.create("", MediaType.get("application/json; charset=utf-8")))
                    .build();
            httpClient.newCall(request)
                    .enqueue(new Callback() {
                        @Override
                        public void onFailure(@NotNull Call call, @NotNull IOException e) {
                            // Request failed
                        }

                        @Override
                        public void onResponse(@NotNull Call call, @NotNull Response response) throws IOException {
                            final Activity activity = weakActivity.get();
                            if (activity == null) {
                                return;
                            }
                            if (!response.isSuccessful() || response.body() == null) {
                                // Request failed
                            } else {
                                String body = response.body().string();
                                try {
                                    JSONObject responseJson = new JSONObject(body);
                                    String url = responseJson.getString("url");
                                    CustomTabsIntent.Builder builder = new CustomTabsIntent.Builder();
                                    CustomTabsIntent customTabsIntent = builder.build();
                                    customTabsIntent.launchUrl(view.getContext(), Uri.parse(url));
                                } catch (JSONException e) {
                                    e.printStackTrace();
                                }
                            }
                        }
                    });
        });
    }
}
```

### Step 2.4: Handle the user returning to your platform (Client-side)

*Connect* (Connect is Stripe's solution for multi-party businesses, such as marketplace or software platforms, to route payments between sellers, customers, and other recipients) Onboarding requires you to pass both a `return_url` and `refresh_url` to handle all cases where the user will be redirected to your platform. It’s important that you implement these correctly to provide the best experience for your user. You can set up a [deep link](https://developer.android.com/training/app-links/deep-linking) to enable Android to redirect to your app automatically.

#### return_url

Stripe issues a redirect to this URL when the user completes the Connect Onboarding flow. This doesn’t mean that all information has been collected or that there are no outstanding requirements on the account. This only means the flow was entered and exited properly.

No state is passed through this URL. After a user is redirected to your `return_url`, check the state of the `details_submitted` parameter on their account by doing either of the following:

- Listening to `account.updated` *webhooks* (A webhook is a real-time push notification sent to your application as a JSON payload through HTTPS requests)
- Calling the [Accounts](https://docs.stripe.com/api/accounts.md) API and inspecting the returned object

#### refresh_url

Your user are redirected to the `refresh_url` in these cases:

- The link is expired (a few minutes went by since the link was created)
- The link was already visited (the user refreshed the page or clicked back or forward in the browser)
- The link was shared in a third-party application such as a messaging client that attempts to access the URL to preview it. Many clients automatically visit links which cause them to become expired
- Your platform is no longer able to access the account
- The account has been rejected

Your `refresh_url` should trigger a method on your server to call [Account Links](https://docs.stripe.com/api/account_links.md) again with the same parameters, and redirect the user to the Connect Onboarding flow to create a seamless experience.

### Step 2.5: Handle users that haven’t completed onboarding

A user that is redirected to your `return_url` might not have completed the onboarding process. Use the `/v1/accounts` endpoint to retrieve the user’s account and check for `charges_enabled`. If the account isn’t fully onboarded, provide UI prompts to allow the user to continue onboarding later. The user can complete their account activation through a new account link (generated by your integration). You can check the state of the `details_submitted` parameter on their account to see if they’ve completed the onboarding process.

## Accept a payment

### Step 3.1: Create your checkout page (Client-side)

Securely collect card information on the client with [CardInputWidget](https://stripe.dev/stripe-android/payments-core/com.stripe.android.view/-card-input-widget/index.html), a drop-in UI component provided by the SDK that collects the card number, expiry date, CVC, and postal code.
![](https://d37ugbyn3rpeym.cloudfront.net/docs/mobile/android/android-card-input-widget-with-postal.mp4)
Create an instance of the card component and a **Pay** button by adding the following to your checkout page’s layout:

```xml
<?xml version="1.0" encoding="utf-8"?>

<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:padding="20dp"
    tools:context=".CheckoutActivityKotlin"
    tools:showIn="@layout/activity_checkout">

    <!--  ...  -->

    <com.stripe.android.view.CardInputWidget
        android:id="@+id/cardInputWidget"
        android:layout_width="match_parent"
        android:layout_height="wrap_content" />

    <Button
        android:text="@string/pay"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:id="@+id/payButton"
        android:layout_marginTop="20dp"
        android:backgroundTint="@android:color/holo_green_light"/>

    <!--  ...  -->

</LinearLayout>
```

Run your app, and make sure your checkout page shows the card component and pay button.

### Step 3.2: Create a PaymentIntent (Server-side) (Client-side)

Stripe uses a [PaymentIntent](https://docs.stripe.com/api/payment_intents.md) object to represent your intent to collect payment from a customer, tracking your charge attempts and payment state changes throughout the process.

### Server-side

On your server, make an endpoint that creates a PaymentIntent with an [amount](https://docs.stripe.com/api/payment_intents/object.md#payment_intent_object-amount) and [currency](https://docs.stripe.com/api/payment_intents/object.md#payment_intent_object-currency). Always decide how much to charge on the server-side, a trusted environment, as opposed to the client. This prevents malicious customers from being able to choose their own prices.

#### curl

```bash
curl https://api.stripe.com/v1/payment_intents \
  -u <<YOUR_SECRET_KEY>>: \
  -d amount=1000 \
  -d currency="gbp" \
  -d "automatic_payment_methods[enabled]"=true \
  -d application_fee_amount="123" \
  -H "Stripe-Account: {{CONNECTED_STRIPE_ACCOUNT_ID}}"
```

#### Ruby

```ruby

# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
Stripe.api_key = '<<YOUR_SECRET_KEY>>'

payment_intent = Stripe::PaymentIntent.create({
  amount: 1000,
  currency: 'gbp',
  # In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
  automatic_payment_methods: { enabled: true },
  application_fee_amount: 123,
}, stripe_account: '{{CONNECTED_STRIPE_ACCOUNT_ID}}')
```

#### Python

```python

# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
stripe.api_key = '<<YOUR_SECRET_KEY>>'

payment_intent = stripe.PaymentIntent.create(
  amount=1000,
  currency='gbp',
  # In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
  automatic_payment_methods={"enabled": True},
  application_fee_amount=123,
  stripe_account='{{CONNECTED_STRIPE_ACCOUNT_ID}}',
)
```

#### PHP

```php

// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
\Stripe\Stripe::setApiKey('<<YOUR_SECRET_KEY>>');

$payment_intent = \Stripe\PaymentIntent::create([
  'amount' => 1000,
  'currency' => 'gbp',
  // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
  'automatic_payment_methods' => ['enabled' => true],
  'application_fee_amount' => 123,
], ['stripe_account' => '{{CONNECTED_STRIPE_ACCOUNT_ID}}']);

```

#### Java

```java

// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
Stripe.apiKey = "<<YOUR_SECRET_KEY>>";

Map<String, Object> automaticPaymentMethods = new HashMap<>();
// In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
automaticPaymentMethods.put("enabled", true);

Map<String, Object> params = new HashMap<>();
params.put("amount", 1000);
params.put("currency", "gbp");
params.put("automatic_payment_methods", automaticPaymentMethods);

params.put("application_fee_amount", 123);
RequestOptions requestOptions = RequestOptions.builder().setStripeAccount(""{{CONNECTED_STRIPE_ACCOUNT_ID}}"").build();
PaymentIntent paymentIntent = PaymentIntent.create(params, requestOptions);

```

#### Node

```javascript

// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = require('stripe')('<<YOUR_SECRET_KEY>>');

const paymentIntent = await stripe.paymentIntents.create({
  amount: 1000,
  currency: 'gbp',
  // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
  automatic_payment_methods: {enabled: true},
  application_fee_amount: 123,
}, {
  stripeAccount: '{{CONNECTED_STRIPE_ACCOUNT_ID}}',
});
```

#### Go

```go

// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
stripe.Key = "<<YOUR_SECRET_KEY>>"

params := &stripe.PaymentIntentParams{
  Amount: stripe.Int64(1000),
  Currency: stripe.String(string(stripe.CurrencyGBP)),
  // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
  AutomaticPaymentMethods: &stripe.PaymentIntentAutomaticPaymentMethodsParams{
    Enabled: stripe.Bool(true),
  },
  ApplicationFeeAmount: stripe.Int64(123),
}
params.SetStripeAccount(""{{CONNECTED_STRIPE_ACCOUNT_ID}}"")

pi, _ := paymentintent.New(params)
```

#### .NET

```dotnet

// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeConfiguration.ApiKey = "<<YOUR_SECRET_KEY>>";

var service = new PaymentIntentService();
var createOptions = new PaymentIntentCreateOptions
{
  Amount = 2000,
  Currency = "gbp",
  // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
  AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
  {
      Enabled = true,
  },
  ApplicationFeeAmount = 123,
};

var requestOptions = new RequestOptions();
requestOptions.StripeAccount = ""{{CONNECTED_STRIPE_ACCOUNT_ID}}"";
service.Create(createOptions, requestOptions);

```

In our store builder example, we want to build a business where customers pay businesses directly. To set up this business:

- Indicate a purchase from the business is a direct charge with the `Stripe-Account` header.
- Specify how much of the purchase from the business goes to the platform with `application_fee_amount`.

When a sale occurs, Stripe transfers the `application_fee_amount` from the connected account to the platform and deducts the Stripe fee from the connected account’s share. An illustration of this funds flow is below:
![](https://b.stripecdn.com/docs-statics-srv/assets/direct_charges.a2a8b68037ac95fe22140d6dde9740d3.svg)

Instead of passing the entire PaymentIntent object to your app, just return its *client secret* (The client secret is a unique key returned from Stripe as part of a PaymentIntent. This key lets the client access important fields from the PaymentIntent (status, amount, currency) while hiding sensitive ones (metadata, customer)).  The PaymentIntent’s client secret is a unique key that lets you confirm the payment and update card details on the client, without allowing manipulation of sensitive information, such as payment amount.

### Client-side

Set the connected account id as an argument to the client application in the client-side libraries.

#### Kotlin

```kotlin
import com.stripe.android.PaymentConfiguration

class MyActivity: Activity() {
    private lateinit var stripe: Stripe

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        stripe = Stripe(
            this,
            PaymentConfiguration.getInstance(this).publishableKey,
            ""{{CONNECTED_ACCOUNT_ID}}""
        )
    }
}
```

#### Java

```java
import com.stripe.android.PaymentConfiguration;

public class MyActivity extends Activity {
    private Stripe stripe;

    @Override
    public void onCreate(@Nullable Bundle savedInstancedState) {
        super.onCreate(savedInstancedState);
        stripe = new Stripe(
            this,
            PaymentConfiguration.getInstance(this).getPublishableKey(),
            ""{{CONNECTED_ACCOUNT_ID}}""
        );
    }
}
```

On the client, request a PaymentIntent from your server and store its *client secret* (The client secret is a unique key returned from Stripe as part of a PaymentIntent. This key lets the client access important fields from the PaymentIntent (status, amount, currency) while hiding sensitive ones (metadata, customer)).

#### Kotlin

```kotlin
class CheckoutActivity : AppCompatActivity() {

  private lateinit var paymentIntentClientSecret: String

  override fun onCreate(savedInstanceState: Bundle?) {
      super.onCreate(savedInstanceState)
      // ...
      startCheckout()
  }

  private fun startCheckout() {
      // Request a PaymentIntent from your server and store its client secret in paymentIntentClientSecret
      // Click View full sample to see a complete implementation
  }
}
```

#### Java

```java
public class CheckoutActivity extends AppCompatActivity {

    private String paymentIntentClientSecret;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        // ...
        startCheckout();
    }

    private void startCheckout() {
        // Request a PaymentIntent from your server and store its client secret in paymentIntentClientSecret
        // Click View full sample to see a complete implementation
    }
}
```

### Step 3.3: Submit the payment to Stripe (Client-side)

When the customer taps the **Pay** button, *confirm* (Confirming a PaymentIntent indicates that the customer intends to pay with the current or provided payment method. Upon confirmation, the PaymentIntent attempts to initiate a payment) the `PaymentIntent` to complete the payment.

First, assemble a [ConfirmPaymentIntentParams](https://stripe.dev/stripe-android/payments-core/com.stripe.android.model/-confirm-payment-intent-params/index.html) object with:

1. The card component’s payment method details
1. The `PaymentIntent` client secret from your server

Rather than sending the entire PaymentIntent object to the client, use its *client secret* (The client secret is a unique key returned from Stripe as part of a PaymentIntent. This key lets the client access important fields from the PaymentIntent (status, amount, currency) while hiding sensitive ones (metadata, customer)). This is different from your API keys that authenticate Stripe API requests. The client secret is a string that lets your app access important fields from the PaymentIntent (for example, `status`) while hiding sensitive ones (for example, `customer`).

Handle the client secret carefully, because it can complete the charge. Don’t log it, embed it in URLs, or expose it to anyone but the customer.

Next, complete the payment by calling the [PaymentLauncher confirm](https://stripe.dev/stripe-android/payments-core/com.stripe.android.payments.paymentlauncher/-payment-launcher/index.html#74063765%2FFunctions%2F-1622557690) method.

#### Kotlin

```kotlin
class CheckoutActivity : AppCompatActivity() {
    // ...
    private lateinit var paymentIntentClientSecret: String
    private lateinit var paymentLauncher: PaymentLauncher

    private fun startCheckout() {
        // ...

        // Hook up the pay button to the card widget and stripe instance
        val payButton: Button = findViewById(R.id.payButton)
        payButton.setOnClickListener {
            val params = cardInputWidget.paymentMethodCreateParams
            if (params != null) {
                val confirmParams = ConfirmPaymentIntentParams
                    .createWithPaymentMethodCreateParams(params, paymentIntentClientSecret)
                val paymentConfiguration = PaymentConfiguration.getInstance(applicationContext)
                paymentLauncher = PaymentLauncher.Companion.create(
                    this,
                    paymentConfiguration.publishableKey,
                    paymentConfiguration.stripeAccountId,
                    ::onPaymentResult
                )
                paymentLauncher.confirm(confirmParams)
            }
        }
    }

    private fun onPaymentResult(paymentResult: PaymentResult) {
        val message = when (paymentResult) {
            is PaymentResult.Completed -> {
                "Completed!"
            }
            is PaymentResult.Canceled -> {
                "Canceled!"
            }
            is PaymentResult.Failed -> {
                // This string comes from the PaymentIntent's error message.
                // See here: https://stripe.com/docs/api/payment_intents/object#payment_intent_object-last_payment_error-message
                "Failed: " + paymentResult.throwable.message
            }
        }
        displayAlert(
            "PaymentResult: "
            message,
            restartDemo = true
        )
    }
}
```

#### Java

```java
public class CheckoutActivity extends AppCompatActivity {
    // ...
    private String paymentIntentClientSecret;
    private PaymentLauncher paymentLauncher;

    private void startCheckout() {
        // ...

        // Hook up the pay button to the card widget and stripe instance
        Button payButton = findViewById(R.id.payButton);
        payButton.setOnClickListener((View view) -> {
            PaymentMethodCreateParams params = cardInputWidget.getPaymentMethodCreateParams();
            if (params != null) {
                ConfirmPaymentIntentParams confirmParams = ConfirmPaymentIntentParams
                        .createWithPaymentMethodCreateParams(params, paymentIntentClientSecret);
                paymentLauncher = PaymentLauncher.Companion.create(
                      "PaymentResult: ",
                      PaymentConfiguration.getInstance(context).getPublishableKey(),
                      PaymentConfiguration.getInstance(context).getStripeAccountId(),
                      this::onPaymentResult
                );
                paymentLauncher.confirm(confirmParams);
            }
        });
    }

    // ...
    private void onPaymentResult(PaymentResult paymentResult) {
        String message = "";
        if (paymentResult instanceof PaymentResult.Completed) {
            message = "Completed!";
        } else if (paymentResult instanceof PaymentResult.Canceled) {
            message = "Canceled!";
        } else if (paymentResult instanceof PaymentResult.Failed) {
            message = "Failed: " + ((PaymentResult.Failed) paymentResult).getThrowable().getMessage();
        }

        displayAlert("PaymentResult: ", message, true);
    }
}
```

You can [save a customer’s payment card details](https://docs.stripe.com/payments/payment-intents.md#future-usage) on payment confirmation by providing both `setupFutureUsage` and a `customer` on the `PaymentIntent`. You can also supply these parameters when creating the `PaymentIntent` on your server.

Supplying an appropriate `setupFutureUsage` value for your application might require your customer to complete additional authentication steps, but reduces the chance of banks rejecting future payments. [Learn how to optimise cards for future payments](https://docs.stripe.com/payments/payment-intents.md#future-usage) and determine which value to use for your application.

| How you intend to use the card                                                                                                                                                  | `setup_future_usage` enum value |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| *On-session* (A payment is described as on-session if it occurs while the customer is actively in your checkout flow and able to authenticate the payment method) payments only | `on_session`                    |
| *Off-session* (A payment is described as off-session if it occurs without the direct involvement of the customer, using previously-collected payment information) payments only | `off_session`                   |
| Both on- and off-session payments                                                                                                                                               | `off_session`                   |

You can use a card that’s set up for on-session payments to make off-session payments, but the bank is more likely to reject the off-session payment and require authentication from the cardholder.

If regulation such as [Strong Customer Authentication](https://docs.stripe.com/strong-customer-authentication.md) requires authentication, the SDK presents additional activities and walks the customer through that process. [Learn how to support 3D Secure Authentication on Android](https://docs.stripe.com/payments/3d-secure.md?platform=android).

When the payment completes, `onSuccess` is called and the value of the returned `PaymentIntent`’s `status` is `Succeeded`. Any other value indicates the payment wasn’t successful. Inspect [lastPaymentError](https://stripe.dev/stripe-android/payments-core/com.stripe.android.model/-payment-intent/index.html#com.stripe.android.model/PaymentIntent/lastPaymentError/#/PointingToDeclaration/) to determine the cause.

You can also check the status of a `PaymentIntent` in the [Dashboard](https://dashboard.stripe.com/test/payments) or by inspecting the `status` property on the object.

### Step 3.4: Test the integration (Client-side)

​​Several test cards are available for you to use in a sandbox to make sure this integration is ready. Use them with any CVC and an expiry date in the future.

| Number           | Description                                                                               |
| ---------------- | ----------------------------------------------------------------------------------------- |
| 4242424242424242 | Succeeds and immediately processes the payment.                                           |
| 4000002500003155 | Requires authentication. Stripe triggers a modal asking for the customer to authenticate. |
| 4000000000009995 | Always fails with a decline code of `insufficient_funds`.                                 |

For the full list of test cards see our guide on [testing](https://docs.stripe.com/testing.md).

### Step 3.5: Fulfillment (Server-side)

After payment completes, you must handle any necessary *fulfillment* (Fulfillment is the process of providing the goods or services purchased by a customer, typically after payment is collected). For example, a store builder must alert the business to send the purchased item to the customer.

Configure a *webhook* (A webhook is a real-time push notification sent to your application as a JSON payload through HTTPS requests) endpoint [in your dashboard](https://dashboard.stripe.com/account/webhooks) (for events *from your Connect applications*).
![](https://b.stripecdn.com/docs-statics-srv/assets/connect_webhooks.4de92f78dcd94b36838010c85c8a051f.png)

Then create an HTTP endpoint on your server to monitor for completed payments to then enable your users (connected accounts) to fulfill purchases.

#### Ruby

```ruby
# Using Sinatra.
require 'sinatra'
require 'stripe'

set :port, 4242

# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
Stripe.api_key = '<<YOUR_SECRET_KEY>>'

# If you are testing your webhook locally with the Stripe CLI you
# can find the endpoint's secret by running `stripe listen`
# Otherwise, find your endpoint's secret in your webhook settings in
# the Developer Dashboard
endpoint_secret = 'whsec_...'

post '/webhook' do
  payload = request.body.read
  sig_header = request.env['HTTP_STRIPE_SIGNATURE']

  event = nil
# Verify webhook signature and extract the event.
  # See https://stripe.com/docs/webhooks#verify-events for more information.
  begin
    event = Stripe::Webhook.construct_event(
      payload, sig_header, endpoint_secret
    )
  rescue JSON::ParserError => e
    # Invalid payload.
    status 400
    return
  rescue Stripe::SignatureVerificationError => e
    # Invalid Signature.
    status 400
    return
  end

  if event['type'] == 'payment_intent.succeeded'
    payment_intent = event['data']['object']
    connected_account_id = event['account']
    handle_successful_payment_intent(connected_account_id, payment_intent)
  end

  status 200
end

def handle_successful_payment_intent(connected_account_id, payment_intent)
  # Fulfill the purchase
  puts 'Connected account ID: ' + connected_account_id
  puts payment_intent.to_s
end
```

#### Python

```python
import stripe
import json

# Using Flask.
from flask import (
    Flask,
    render_template,
    request,
    Response,
)

app = Flask(__name__, static_folder=".",
            static_url_path="", template_folder=".")

# Set your secret key. Remember to switch to your live secret key in production!
# See your keys here: https://dashboard.stripe.com/apikeys
stripe.api_key = '<<YOUR_SECRET_KEY>>'

# If you are testing your webhook locally with the Stripe CLI you
# can find the endpoint's secret by running `stripe listen`
# Otherwise, find your endpoint's secret in your webhook settings in the Developer Dashboard
endpoint_secret = 'whsec_...'

@app.route("/webhook", methods=["POST"])
def webhook_received():
  request_data = json.loads(request.data)
  signature = request.headers.get("stripe-signature")
# Verify webhook signature and extract the event.
  # See https://stripe.com/docs/webhooks#verify-events for more information.
  try:
    event = stripe.Webhook.construct_event(
        payload=request.data, sig_header=signature, secret=endpoint_secret
    )
  except ValueError as e:
    # Invalid payload.
    return Response(status=400)
  except stripe.error.SignatureVerificationError as e:
    # Invalid Signature.
    return Response(status=400)

  if event["type"] == "payment_intent.succeeded":
    payment_intent = event["data"]["object"]
    connected_account_id = event["account"]
    handle_successful_payment_intent(connected_account_id, payment_intent)

  return json.dumps({"success": True}), 200

def handle_successful_payment_intent(connected_account_id, payment_intent):
  # Fulfill the purchase
  print('Connected account ID: ' + connected_account_id)
  print(str(payment_intent))

if __name__ == "__main__":
  app.run(port=4242)
```

#### PHP

```php
<?php
require 'vendor/autoload.php';

// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
$stripe = new \Stripe\StripeClient('<<YOUR_SECRET_KEY>>');

// You can find your endpoint's secret in your webhook settings
$endpoint_secret = 'whsec_...';

$payload = @file_get_contents('php://input');
$sig_header = $_SERVER['HTTP_STRIPE_SIGNATURE'];
$event = null;
// Verify webhook signature and extract the event.
// See https://stripe.com/docs/webhooks#verify-events for more information.
try {
  $event = \Stripe\Webhook::constructEvent(
    $payload, $sig_header, $endpoint_secret
  );
} catch(\UnexpectedValueException $e) {
  // Invalid payload
  http_response_code(400);
  exit();
} catch(\Stripe\Exception\SignatureVerificationException $e) {
  // Invalid signature
  http_response_code(400);
  exit();
}

if ($event->type == 'payment_intent.succeeded') {
  $paymentIntent = $event->data->object;
  $connectedAccountId = $event->account;
}
http_response_code(200);
```

#### Java

```java
package com.stripe.sample;

import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.net.Webhook;
import com.google.gson.JsonSyntaxException;
import spark.Response;

// Using Spark.
import static spark.Spark.*;

public class Server {
  public static void main(String[] args) {
    port(4242);

    // Set your secret key. Remember to switch to your live secret key in production!
    // See your keys here: https://dashboard.stripe.com/apikeys
    Stripe.apiKey = "<<YOUR_SECRET_KEY>>";
    post("/webhook", (request, response) -> {
      String payload = request.body();
      String sigHeader = request.headers("Stripe-Signature");

      // If you are testing your webhook locally with the Stripe CLI you
      // can find the endpoint's secret by running `stripe listen`
      // Otherwise, find your endpoint's secret in your webhook settings in the Developer Dashboard
      String endpointSecret = "whsec_...";

      Event event = null;
// Verify webhook signature and extract the event.
      // See https://stripe.com/docs/webhooks#verify-events for more information.
      try {
        event = Webhook.constructEvent(
          payload, sigHeader, endpointSecret
        );
      } catch (JsonSyntaxException e) {
      // Invalid payload.
        response.status(400);
        return "";
      } catch (SignatureVerificationException e) {
      // Invalid Signature.
        response.status(400);
        return "";
      }

      if ("payment_intent.succeeded".equals(event.getType())) {
        // Deserialize the nested object inside the event
        EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();

        if (dataObjectDeserializer.getObject().isPresent()) {
          PaymentIntent paymentIntent = (PaymentIntent) dataObjectDeserializer.getObject().get();
          String connectedAccountId = event.getAccount();
          handleSuccessfulPaymentIntent(connectedAccountId, paymentIntent);
        } else {
          // Deserialization failed, probably due to an API version mismatch.
          // Refer to the Javadoc documentation on `EventDataObjectDeserializer` for
          // instructions on how to handle this case, or return an error here.
        }
      }

      response.status(200);
      return "";
    });
  }

  private static void handleSuccessfulPaymentIntent(String connectedAccountId, PaymentIntent paymentIntent) {
    // Fulfill the purchase
    System.out.println("Connected account ID: " + connectedAccountId);
    System.out.println(paymentIntent.getId());
  }
}
```

#### Node

```javascript
// Using Express
const express = require('express');
const bodyParser = require("body-parser");
const app = express();
app.use(express.json());

// Use JSON parser for all non-webhook routes
app.use((req, res, next) => {
  if (req.originalUrl === "/webhook") {
    next();
  } else {
    bodyParser.json()(req, res, next);
  }
});

// Set your secret key. Remember to switch to your live secret key in production!
// See your keys here: https://dashboard.stripe.com/apikeys
const Stripe = require('stripe');
const stripe = Stripe('<<YOUR_SECRET_KEY>>');

// If you are testing your webhook locally with the Stripe CLI you
// can find the endpoint's secret by running `stripe listen`
// Otherwise, find your endpoint's secret in your webhook settings in the Developer Dashboard
const endpointSecret = 'whsec_...';

app.post('/webhook', bodyParser.raw({type: 'application/json'}), (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;
// Verify webhook signature and extract the event.
  // See https://stripe.com/docs/webhooks#verify-events for more information.
  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const connectedAccountId = event.account;
    handleSuccessfulPaymentIntent(connectedAccountId, paymentIntent);
  }

  response.json({received: true});
});

const handleSuccessfulPaymentIntent = (connectedAccountId, paymentIntent) => {
  // Fulfill the purchase
  console.log('Connected account ID: ' + connectedAccountId);
  console.log(JSON.stringify(paymentIntent));
}

app.listen(4242, () => console.log(`Node server listening on port ${4242}!`));
```

#### Go

```go
package main

import (
  "encoding/json"
  "log"
  "fmt"
  "net/http"
  "io/ioutil"

  "github.com/stripe/stripe-go/v76.0.0"
  "github.com/stripe/stripe-go/v76.0.0/webhook"

  "os"
)

func main() {
  // Set your secret key. Remember to switch to your live secret key in production!
  // See your keys here: https://dashboard.stripe.com/apikeys
  stripe.Key = "<<YOUR_SECRET_KEY>>"

  http.HandleFunc("/webhook", handleWebhook)
  addr := "localhost:4242"

  log.Printf("Listening on %s ...", addr)
  log.Fatal(http.ListenAndServe(addr, nil))
}

func handleWebhook(w http.ResponseWriter, req *http.Request) {
  const MaxBodyBytes = int64(65536)
  req.Body = http.MaxBytesReader(w, req.Body, MaxBodyBytes)
  body, err := ioutil.ReadAll(req.Body)
  if err != nil {
      fmt.Fprintf(os.Stderr, "Error reading request body: %v\n", err)
      w.WriteHeader(http.StatusServiceUnavailable)
      return
  }

  // If you are testing your webhook locally with the Stripe CLI you
  // can find the endpoint's secret by running `stripe listen`
  // Otherwise, find your endpoint's secret in your webhook settings
  // in the Developer Dashboard
  endpointSecret := "whsec_...";
// Verify webhook signature and extract the event.
  // See https://stripe.com/docs/webhooks#verify-events for more information.
  event, err := webhook.ConstructEvent(body, req.Header.Get("Stripe-Signature"), endpointSecret)

  if err != nil {
      fmt.Fprintf(os.Stderr, "Error verifying webhook signature: %v\n", err)
      w.WriteHeader(http.StatusBadRequest) // Return a 400 error on a bad signature.
      return
  }

  if event.Type == "payment_intent.succeeded" {
      var paymentIntent stripe.PaymentIntent
      err := json.Unmarshal(event.Data.Raw, &paymentIntent)
      if err != nil {
          fmt.Fprintf(os.Stderr, "Error parsing webhook JSON: %v\n", err)
          w.WriteHeader(http.StatusBadRequest)
          return
      }
      var connectedAccountId = event.Account;
      handleSuccessfulPaymentIntent(connectedAccountId, paymentIntent)
  }

  w.WriteHeader(http.StatusOK)
}

func handleSuccessfulPaymentIntent(connectedAccountId string, paymentIntent stripe.PaymentIntent) {
  // Fulfill the purchase
  log.Println("Connected account ID: " + connectedAccountId)
  log.Println(paymentIntent.ID)
}
```

#### .NET

```dotnet
// Set your secret key. Remember to switch to your live secret key in production!
// See your keys here: https://dashboard.stripe.com/apikeys
StripeConfiguration.ApiKey = "<<YOUR_SECRET_KEY>>";

using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

using Stripe;

namespace Controllers
{
  public class ConnectController : Controller
  {
    private readonly ILogger<ConnectController> logger;

    public ConnectController(
      ILogger<ConnectController> logger
    ) {
      this.logger = logger;
    }

    [HttpPost("webhook")]
    public async Task<IActionResult> ProcessWebhookEvent()
    {
      var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

      // If you are testing your webhook locally with the Stripe CLI you
      // can find the endpoint's secret by running `stripe listen`
      // Otherwise, find your endpoint's secret in your webhook settings
      // in the Developer Dashboard
      const string endpointSecret = "whsec_...";
// Verify webhook signature and extract the event.
      // See https://stripe.com/docs/webhooks#verify-events for more information.
      try
      {
        var stripeEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"], endpointSecret);

        // If on SDK version < 46, use class Events instead of EventTypes
        if (stripeEvent.Type == EventTypes.PaymentIntentSucceeded) {
          var paymentIntent = stripeEvent.Data.Object as PaymentIntent;
          var connectedAccountId = stripeEvent.Account;
          handleSuccessfulPaymentIntent(connectedAccountId, paymentIntent);
        }

        return Ok();
      }
      catch (Exception e)
      {
        logger.LogInformation(e.ToString());
        return BadRequest();
      }
    }

    private void handleSuccessfulPaymentIntent(string connectedAccountId, PaymentIntent paymentIntent) {
      // Fulfill the purchase
      logger.LogInformation($"Connected account ID: {connectedAccountId}");
      logger.LogInformation($"{paymentIntent}");
    }
  }
}
```

Learn more in our [fulfilment guide for payments](https://docs.stripe.com/payments/handling-payment-events.md).

### Testing webhooks locally

Use the Stripe CLI to test webhooks locally.

1. First, [install the Stripe CLI](https://docs.stripe.com/stripe-cli.md#install) on your machine if you haven’t already.

1. Then, to log in run `stripe login` in the command line, and follow the instructions.

1. Finally, to allow your local host to receive a simulated event on your connected account run `stripe listen --forward-connect-to localhost:{PORT}/webhook` in one terminal window, and run `stripe trigger --stripe-account={{CONNECTED_STRIPE_ACCOUNT_ID}} payment_intent.succeeded` (or trigger any other [supported event](https://github.com/stripe/stripe-cli/wiki/trigger-command#supported-events)) in another.

## Testing

Test your account creation flow by [creating accounts](https://docs.stripe.com/connect/testing.md#creating-accounts) and [using OAuth](https://docs.stripe.com/connect/testing.md#using-oauth). Test your **Payment methods** settings for your connected accounts by logging into one of your test accounts and navigating to the [Payment methods settings](https://dashboard.stripe.com/settings/payment_methods). Test your checkout flow with your test keys and a test account. You can use our [test cards](https://docs.stripe.com/testing.md) to test your payments flow and simulate various payment outcomes.


# React Native

> This is a React Native for when platform is react-native. View the full page at https://docs.stripe.com/connect/enable-payment-acceptance-guide?platform=react-native.
![](https://b.stripecdn.com/docs-statics-srv/assets/ios-overview.9e0d68d009dc005f73a6f5df69e00458.png)

This integration combines all of the steps required to pay—collecting payment details and confirming the payment—into a single sheet that displays on top of your app.

## Prerequisites

### Prerequisites

- [ ] [Register your platform](https://dashboard.stripe.com/connect)

- [ ] Add business details to [activate your account](https://dashboard.stripe.com/account/onboarding)

- [ ] [Complete your platform profile](https://dashboard.stripe.com/connect/settings/profile)

- [ ] [Customise brand settings](https://dashboard.stripe.com/settings/connect/stripe-dashboard/branding)
Add a business name, icon, and brand colour.

## Set up Stripe [Server-side] [Client-side]

### Server-side

This integration requires endpoints on your server that talk to the Stripe API. Use the official libraries for access to the Stripe API from your server:

#### Ruby

```bash
# Available as a gem
sudo gem install stripe
```

```ruby
# If you use bundler, you can add this line to your Gemfile
gem 'stripe'
```

#### Python

```bash
# Install through pip
pip3 install --upgrade stripe
```

```bash
# Or find the Stripe package on http://pypi.python.org/pypi/stripe/
```

```python
# Find the version you want to pin:
# https://github.com/stripe/stripe-python/blob/master/CHANGELOG.md
# Specify that version in your requirements.txt file
stripe>=5.0.0
```

#### PHP

```bash
# Install the PHP library with Composer
composer require stripe/stripe-php
```

```bash
# Or download the source directly: https://github.com/stripe/stripe-php/releases
```

#### Java

```java
/*
  For Gradle, add the following dependency to your build.gradle and replace with
  the version number you want to use from:
  - https://mvnrepository.com/artifact/com.stripe/stripe-java or
  - https://github.com/stripe/stripe-java/releases/latest
*/
implementation "com.stripe:stripe-java:29.0.0"
```

```xml
<!--
  For Maven, add the following dependency to your POM and replace with the
  version number you want to use from:
  - https://mvnrepository.com/artifact/com.stripe/stripe-java or
  - https://github.com/stripe/stripe-java/releases/latest
-->
<dependency>
  <groupId>com.stripe</groupId>
  <artifactId>stripe-java</artifactId>
  <version>29.0.0</version>
</dependency>
```

```bash
# For other environments, manually install the following JARs:
# - The Stripe JAR from https://github.com/stripe/stripe-java/releases/latest
# - Google Gson from https://github.com/google/gson
```

#### Node

```bash
# Install with npm
npm install stripe --save
```

#### Go

```bash
# Make sure your project is using Go Modules
go mod init
# Install stripe-go
go get -u github.com/stripe/stripe-go/v82
```

```go
// Then import the package
import (
  "github.com/stripe/stripe-go/v82"
)
```

#### .NET

```bash
# Install with dotnet
dotnet add package Stripe.net
dotnet restore
```

```bash
# Or install with NuGet
Install-Package Stripe.net
```

### Client-side

The [React Native SDK](https://github.com/stripe/stripe-react-native) is open source and fully documented. Internally, it uses the [native iOS](https://github.com/stripe/stripe-ios) and [Android](https://github.com/stripe/stripe-android) SDKs. To install Stripe’s React Native SDK, run one of the following commands in your project’s directory (depending on which package manager you use):

#### yarn

```bash
yarn add @stripe/stripe-react-native
```

#### npm

```bash
npm install @stripe/stripe-react-native
```

Next, install some other necessary dependencies:

- For iOS, go to the **ios** directory and run `pod install` to ensure that you also install the required native dependencies.
- For Android, there are no more dependencies to install.

> We recommend following the [official TypeScript guide](https://reactnative.dev/docs/typescript#adding-typescript-to-an-existing-project) to add TypeScript support.

### Stripe initialisation

To initialise Stripe in your React Native app, either wrap your payment screen with the `StripeProvider` component, or use the `initStripe` initialisation method. Only the API [publishable key](https://docs.stripe.com/keys.md#obtain-api-keys) in `publishableKey` is required. The following example shows how to initialise Stripe using the `StripeProvider` component.

```jsx
import { useState, useEffect } from 'react';
import { StripeProvider } from '@stripe/stripe-react-native';

function App() {
  const [publishableKey, setPublishableKey] = useState('');

  const fetchPublishableKey = async () => {
    const key = await fetchKey(); // fetch key from your server here
    setPublishableKey(key);
  };

  useEffect(() => {
    fetchPublishableKey();
  }, []);

  return (
    <StripeProvider
      publishableKey={publishableKey}
      merchantIdentifier="merchant.identifier" // required for Apple Pay
      urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
    >
      {/* Your app code here */}
    </StripeProvider>
  );
}
```

> Use your API [test keys](https://docs.stripe.com/keys.md#obtain-api-keys) while you test and develop, and your [live mode](https://docs.stripe.com/keys.md#test-live-modes) keys when you publish your app.

## Create a connected account

When a user (seller or service provider) signs up on your platform, create a user [Account](https://docs.stripe.com/api/accounts.md) (referred to as a *connected account*) so you can accept payments and move funds to their bank account. Connected accounts represent your user in Stripe’s API and help facilitate the collection of onboarding requirements so Stripe can verify the user’s identity. In our store builder example, the connected account represents the business setting up their online store.

### Step 2.1: Create a connected account and prefill information (Server-side)

Use the `/v1/accounts` API to [create](https://docs.stripe.com/api/accounts/create.md) a connected account. You can create the connected account by using the [default connected account parameters](https://docs.stripe.com/connect/migrate-to-controller-properties.md), or by specifying the account type.

#### With default properties

```curl
curl -X POST https://api.stripe.com/v1/accounts \
  -u "<<YOUR_SECRET_KEY>>:"
```

```cli
stripe accounts create
```

```ruby
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
Stripe.api_key = '<<YOUR_SECRET_KEY>>'

account = Stripe::Account.create()
```

```ruby
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
client = Stripe::StripeClient.new("<<YOUR_SECRET_KEY>>")

account = client.v1.accounts.create()
```

```python
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
import stripe
stripe.api_key = "<<YOUR_SECRET_KEY>>"

account = stripe.Account.create()
```

```python
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
client = StripeClient("<<YOUR_SECRET_KEY>>")

account = client.accounts.create()
```

```php
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
$stripe = new \Stripe\StripeClient('<<YOUR_SECRET_KEY>>');

$account = $stripe->accounts->create([]);
```

```java
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
Stripe.apiKey = "<<YOUR_SECRET_KEY>>";

AccountCreateParams params = AccountCreateParams.builder().build();

Account account = Account.create(params);
```

```java
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeClient client = new StripeClient("<<YOUR_SECRET_KEY>>");

AccountCreateParams params = AccountCreateParams.builder().build();

Account account = client.accounts().create(params);
```

```node
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = require('stripe')('<<YOUR_SECRET_KEY>>');

const account = await stripe.accounts.create();
```

```go
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
stripe.Key = "<<YOUR_SECRET_KEY>>"

params := &stripe.AccountParams{}
result, err := account.New(params)
```

```go
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
sc := stripe.NewClient("<<YOUR_SECRET_KEY>>")
params := &stripe.AccountCreateParams{}
result, err := sc.V1Accounts.Create(context.TODO(), params)
```

```dotnet
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeConfiguration.ApiKey = "<<YOUR_SECRET_KEY>>";

var options = new AccountCreateOptions();
var service = new AccountService();
Account account = service.Create(options);
```

```dotnet
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
var options = new AccountCreateOptions();
var client = new StripeClient("<<YOUR_SECRET_KEY>>");
var service = client.V1.Accounts;
Account account = service.Create(options);
```

#### With account type

```curl
curl https://api.stripe.com/v1/accounts \
  -u "<<YOUR_SECRET_KEY>>:" \
  -d type=standard
```

```cli
stripe accounts create  \
  --type=standard
```

```ruby
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
Stripe.api_key = '<<YOUR_SECRET_KEY>>'

account = Stripe::Account.create({type: 'standard'})
```

```ruby
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
client = Stripe::StripeClient.new("<<YOUR_SECRET_KEY>>")

account = client.v1.accounts.create({type: 'standard'})
```

```python
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
import stripe
stripe.api_key = "<<YOUR_SECRET_KEY>>"

account = stripe.Account.create(type="standard")
```

```python
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
client = StripeClient("<<YOUR_SECRET_KEY>>")

account = client.accounts.create({"type": "standard"})
```

```php
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
$stripe = new \Stripe\StripeClient('<<YOUR_SECRET_KEY>>');

$account = $stripe->accounts->create(['type' => 'standard']);
```

```java
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
Stripe.apiKey = "<<YOUR_SECRET_KEY>>";

AccountCreateParams params =
  AccountCreateParams.builder().setType(AccountCreateParams.Type.STANDARD).build();

Account account = Account.create(params);
```

```java
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeClient client = new StripeClient("<<YOUR_SECRET_KEY>>");

AccountCreateParams params =
  AccountCreateParams.builder().setType(AccountCreateParams.Type.STANDARD).build();

Account account = client.accounts().create(params);
```

```node
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = require('stripe')('<<YOUR_SECRET_KEY>>');

const account = await stripe.accounts.create({
  type: 'standard',
});
```

```go
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
stripe.Key = "<<YOUR_SECRET_KEY>>"

params := &stripe.AccountParams{Type: stripe.String(stripe.AccountTypeStandard)}
result, err := account.New(params)
```

```go
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
sc := stripe.NewClient("<<YOUR_SECRET_KEY>>")
params := &stripe.AccountCreateParams{Type: stripe.String(stripe.AccountTypeStandard)}
result, err := sc.V1Accounts.Create(context.TODO(), params)
```

```dotnet
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeConfiguration.ApiKey = "<<YOUR_SECRET_KEY>>";

var options = new AccountCreateOptions { Type = "standard" };
var service = new AccountService();
Account account = service.Create(options);
```

```dotnet
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
var options = new AccountCreateOptions { Type = "standard" };
var client = new StripeClient("<<YOUR_SECRET_KEY>>");
var service = client.V1.Accounts;
Account account = service.Create(options);
```

If you’ve already collected information for your connected accounts, you can pre-fill that information on the `Account` object. You can pre-fill any account information, including personal and business information, external account information, and so on.

Connect Onboarding doesn’t ask for the prefilled information. However, it does ask the account holder to confirm the prefilled information before accepting the [Connect service agreement](https://docs.stripe.com/connect/service-agreement-types.md).

When testing your integration, prefill account information using [test data](https://docs.stripe.com/connect/testing.md).

### Step 2.2: Create an account link (Server-side)

You can create an account link by calling the [Account Links](https://docs.stripe.com/api/account_links.md) API with the following parameters:

- `account`
- `refresh_url`
- `return_url`
- `type` = `account_onboarding`

```curl
curl https://api.stripe.com/v1/account_links \
  -u "<<YOUR_SECRET_KEY>>:" \
  -d account="{{CONNECTEDACCOUNT_ID}}" \
  --data-urlencode refresh_url="https://example.com/reauth" \
  --data-urlencode return_url="https://example.com/return" \
  -d type=account_onboarding
```

```cli
stripe account_links create  \
  --account="{{CONNECTEDACCOUNT_ID}}" \
  --refresh-url="https://example.com/reauth" \
  --return-url="https://example.com/return" \
  --type=account_onboarding
```

```ruby
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
Stripe.api_key = '<<YOUR_SECRET_KEY>>'

account_link = Stripe::AccountLink.create({
  account: '{{CONNECTEDACCOUNT_ID}}',
  refresh_url: 'https://example.com/reauth',
  return_url: 'https://example.com/return',
  type: 'account_onboarding',
})
```

```ruby
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
client = Stripe::StripeClient.new("<<YOUR_SECRET_KEY>>")

account_link = client.v1.account_links.create({
  account: '{{CONNECTEDACCOUNT_ID}}',
  refresh_url: 'https://example.com/reauth',
  return_url: 'https://example.com/return',
  type: 'account_onboarding',
})
```

```python
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
import stripe
stripe.api_key = "<<YOUR_SECRET_KEY>>"

account_link = stripe.AccountLink.create(
  account="{{CONNECTEDACCOUNT_ID}}",
  refresh_url="https://example.com/reauth",
  return_url="https://example.com/return",
  type="account_onboarding",
)
```

```python
# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
client = StripeClient("<<YOUR_SECRET_KEY>>")

account_link = client.account_links.create({
  "account": "{{CONNECTEDACCOUNT_ID}}",
  "refresh_url": "https://example.com/reauth",
  "return_url": "https://example.com/return",
  "type": "account_onboarding",
})
```

```php
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
$stripe = new \Stripe\StripeClient('<<YOUR_SECRET_KEY>>');

$accountLink = $stripe->accountLinks->create([
  'account' => '{{CONNECTEDACCOUNT_ID}}',
  'refresh_url' => 'https://example.com/reauth',
  'return_url' => 'https://example.com/return',
  'type' => 'account_onboarding',
]);
```

```java
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
Stripe.apiKey = "<<YOUR_SECRET_KEY>>";

AccountLinkCreateParams params =
  AccountLinkCreateParams.builder()
    .setAccount("{{CONNECTEDACCOUNT_ID}}")
    .setRefreshUrl("https://example.com/reauth")
    .setReturnUrl("https://example.com/return")
    .setType(AccountLinkCreateParams.Type.ACCOUNT_ONBOARDING)
    .build();

AccountLink accountLink = AccountLink.create(params);
```

```java
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeClient client = new StripeClient("<<YOUR_SECRET_KEY>>");

AccountLinkCreateParams params =
  AccountLinkCreateParams.builder()
    .setAccount("{{CONNECTEDACCOUNT_ID}}")
    .setRefreshUrl("https://example.com/reauth")
    .setReturnUrl("https://example.com/return")
    .setType(AccountLinkCreateParams.Type.ACCOUNT_ONBOARDING)
    .build();

AccountLink accountLink = client.accountLinks().create(params);
```

```node
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = require('stripe')('<<YOUR_SECRET_KEY>>');

const accountLink = await stripe.accountLinks.create({
  account: '{{CONNECTEDACCOUNT_ID}}',
  refresh_url: 'https://example.com/reauth',
  return_url: 'https://example.com/return',
  type: 'account_onboarding',
});
```

```go
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
stripe.Key = "<<YOUR_SECRET_KEY>>"

params := &stripe.AccountLinkParams{
  Account: stripe.String("{{CONNECTEDACCOUNT_ID}}"),
  RefreshURL: stripe.String("https://example.com/reauth"),
  ReturnURL: stripe.String("https://example.com/return"),
  Type: stripe.String("account_onboarding"),
}
result, err := accountlink.New(params)
```

```go
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
sc := stripe.NewClient("<<YOUR_SECRET_KEY>>")
params := &stripe.AccountLinkCreateParams{
  Account: stripe.String("{{CONNECTEDACCOUNT_ID}}"),
  RefreshURL: stripe.String("https://example.com/reauth"),
  ReturnURL: stripe.String("https://example.com/return"),
  Type: stripe.String("account_onboarding"),
}
result, err := sc.V1AccountLinks.Create(context.TODO(), params)
```

```dotnet
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeConfiguration.ApiKey = "<<YOUR_SECRET_KEY>>";

var options = new AccountLinkCreateOptions
{
    Account = "{{CONNECTEDACCOUNT_ID}}",
    RefreshUrl = "https://example.com/reauth",
    ReturnUrl = "https://example.com/return",
    Type = "account_onboarding",
};
var service = new AccountLinkService();
AccountLink accountLink = service.Create(options);
```

```dotnet
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
var options = new AccountLinkCreateOptions
{
    Account = "{{CONNECTEDACCOUNT_ID}}",
    RefreshUrl = "https://example.com/reauth",
    ReturnUrl = "https://example.com/return",
    Type = "account_onboarding",
};
var client = new StripeClient("<<YOUR_SECRET_KEY>>");
var service = client.V1.AccountLinks;
AccountLink accountLink = service.Create(options);
```

### Step 2.3: Redirect your user to the account link URL (Client-side)

The response to your [Account Links](https://docs.stripe.com/api/account_links.md) request includes a value for the key `url`. Account Links are temporary and are single-use only because they grant access to the connected account user’s personal information. If you want to prefill information, you must do so before generating the account link. After you create the account link for a Standard account, you won’t be able to read or write information for the account. Send this URL to your app and open it in the browser for the user to complete the Connect Onboarding flow.

> Don’t email, text, or otherwise send account link URLs outside your platform application. Instead, provide them to the authenticated account holder within your application.

### Step 2.4: Handle the user returning to your platform (Client-side)

*Connect* (Connect is Stripe's solution for multi-party businesses, such as marketplace or software platforms, to route payments between sellers, customers, and other recipients) Onboarding requires you to pass both a `return_url` and `refresh_url` to handle all cases where the user is redirected to your platform. It’s important that you implement these correctly to provide the best experience for your user. You can set up a [deep link](https://reactnavigation.org/docs/deep-linking/) to enable the Stripe webpage to redirect to your app automatically.

#### return_url

Stripe issues a redirect to this URL when the user completes the Connect Onboarding flow. This doesn’t mean that all information has been collected or that there are no outstanding requirements on the account. This only means the flow was entered and exited properly.

No state is passed through this URL. After a user is redirected to your `return_url`, check the state of the `details_submitted` parameter on their account by doing either of the following:

- Listening to `account.updated` *webhooks* (A webhook is a real-time push notification sent to your application as a JSON payload through HTTPS requests)
- Calling the [Accounts](https://docs.stripe.com/api/accounts.md) API and inspecting the returned object

#### refresh_url

Your user is redirected to the `refresh_url` in these cases:

- The link is expired (a few minutes went by since the link was created)
- The user already visited the link (the user refreshed the page or clicked back or forward in the browser)
- Your platform is no longer able to access the account
- The account has been rejected

Your `refresh_url` should trigger a method on your server to call [Account Links](https://docs.stripe.com/api/account_links.md) again with the same parameters, and redirect the user to the Connect Onboarding flow to create a seamless experience.

### Step 2.5: Handle users that haven’t completed onboarding

A user that is redirected to your `return_url` might not have completed the onboarding process. Use the `/v1/accounts` endpoint to retrieve the user’s account and check for `charges_enabled`. If the account isn’t fully onboarded, provide UI prompts to allow the user to continue onboarding later. The user can complete their account activation through a new account link (generated by your integration). You can check the state of the `details_submitted` parameter on their account to see if they’ve completed the onboarding process.

## Enable payment methods

View your [payment methods settings](https://dashboard.stripe.com/settings/connect/payment_methods) and enable the payment methods you want to support. Card payments are enabled by default but you can enable and disable payment methods as needed.

## Add an endpoint [Server-side]

> #### Note
> 
> To display the PaymentSheet before you create a PaymentIntent, see [Collect payment details before creating an Intent](https://docs.stripe.com/payments/accept-a-payment-deferred.md?type=payment).

This integration uses three Stripe API objects:

1. [PaymentIntent](https://docs.stripe.com/api/payment_intents.md): Stripe uses this to represent your intent to collect payment from a customer, tracking your charge attempts and payment state changes throughout the process.

1. (Optional) [Customer](https://docs.stripe.com/api/customers.md): To set up a payment method for future payments, you must attach it to a *Customer* (Customer objects represent customers of your business. They let you reuse payment methods and give you the ability to track multiple payments). Create a Customer object when your customer creates an account with your business. If your customer is making a payment as a guest, you can create a Customer object before payment and associate it with your own internal representation of the customer’s account later.

1. (Optional) Customer Ephemeral Key: Information on the Customer object is sensitive, and can’t be retrieved directly from an app. An ephemeral key grants the SDK temporary access to the Customer.

> If you never save cards to a Customer and don’t allow returning Customers to reuse saved cards, you can omit the Customer and Customer Ephemeral Key objects from your integration.

For security reasons, your app can’t create these objects. Instead, add an endpoint on your server that:

1. Retrieves the Customer, or creates a new one.
1. Creates an Ephemeral Key for the Customer.
1. Creates a PaymentIntent with the [amount](https://docs.stripe.com/api/payment_intents/create.md#create_payment_intent-amount), [currency](https://docs.stripe.com/api/payment_intents/create.md#create_payment_intent-currency), and [customer](https://docs.stripe.com/api/payment_intents/create.md#create_payment_intent-customer). You can also optionally include the `automatic_payment_methods` parameter. Stripe enables its functionality by default in the latest version of the API.
1. Returns the Payment Intent’s *client secret* (The client secret is a unique key returned from Stripe as part of a PaymentIntent. This key lets the client access important fields from the PaymentIntent (status, amount, currency) while hiding sensitive ones (metadata, customer)), the Ephemeral Key’s `secret`, the Customer’s [id](https://docs.stripe.com/api/customers/object.md#customer_object-id), and your [publishable key](https://dashboard.stripe.com/apikeys) to your app.

The payment methods shown to customers during the checkout process are also included on the PaymentIntent. You can let Stripe pull payment methods from your Dashboard settings or you can list them manually. Regardless of the option you choose, note that the currency passed in the PaymentIntent filters the payment methods shown to the customer. For example, if you pass `eur` on the PaymentIntent and have OXXO enabled in the Dashboard, OXXO won’t be shown to the customer because OXXO doesn’t support `eur` payments.

Unless your integration requires a code-based option for offering payment methods, Stripe recommends the automated option. This is because Stripe evaluates the currency, payment method restrictions, and other parameters to determine the list of supported payment methods. Payment methods that increase conversion and that are most relevant to the currency and customer’s location are prioritised.

#### Manage payment methods from the Dashboard

> You can fork and deploy an implementation of this endpoint on [CodeSandbox](https://codesandbox.io/p/devbox/suspicious-lalande-l325w6) for testing.

You can manage payment methods from the [Dashboard](https://dashboard.stripe.com/settings/payment_methods). Stripe handles the return of eligible payment methods based on factors such as the transaction’s amount, currency, and payment flow. The PaymentIntent is created using the payment methods you configured in the Dashboard. If you don’t want to use the Dashboard or if you want to specify payment methods manually, you can list them using the `payment_method_types` attribute.

#### curl

```bash
# Create a Customer (use an existing Customer ID if this is a returning customer)
curl https://api.stripe.com/v1/customers \
  -u <<YOUR_SECRET_KEY>>: \
  -X "POST"

# Create an Ephemeral Key for the Customer
curl https://api.stripe.com/v1/ephemeral_keys \
  -u <<YOUR_SECRET_KEY>>: \
  -H "Stripe-Version: 2025-07-30.basil" \
  -X "POST" \
  -d "customer"="{{CUSTOMER_ID}}" \

# Create a PaymentIntent
curl https://api.stripe.com/v1/payment_intents \
  -u <<YOUR_SECRET_KEY>>: \
  -H "Stripe-Account: {{CONNECTED_ACCOUNT_ID}}"
  -X "POST" \
  -d "customer"="{{CUSTOMER_ID}}" \
  -d "amount"=1099 \
  -d "currency"="eur" \
  # In the latest version of the API, specifying the `automatic_payment_methods` parameter
  # is optional because Stripe enables its functionality by default.
  -d "automatic_payment_methods[enabled]"=true \
  -d application_fee_amount="123" \
```

#### Ruby

```ruby
# This example sets up an endpoint using the Sinatra framework.


# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
Stripe.api_key = '<<YOUR_SECRET_KEY>>'

post '/payment-sheet' do
  # Use an existing Customer ID if this is a returning customer
  customer = Stripe::Customer.create
  ephemeralKey = Stripe::EphemeralKey.create({
    customer: customer['id'],
  }, {stripe_version: '2025-07-30.basil'})
  paymentIntent = Stripe::PaymentIntent.create({
    amount: 1099,
    currency: 'eur',
    customer: customer['id'],
    # In the latest version of the API, specifying the `automatic_payment_methods` parameter
    # is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
    application_fee_amount: 123,
  }, {stripe_account: '{{CONNECTED_ACCOUNT_ID}}'})
  {
    paymentIntent: paymentIntent['client_secret'],
    ephemeralKey: ephemeralKey['secret'],
    customer: customer['id'],
    publishableKey: '<<YOUR_PUBLISHABLE_KEY>>'
  }.to_json
end
```

#### Python

```python
# This example sets up an endpoint using the Flask framework.
# Watch this video to get started: https://youtu.be/7Ul1vfmsDck.

# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
stripe.api_key = '<<YOUR_SECRET_KEY>>'

@app.route('/payment-sheet', methods=['POST'])
def payment_sheet():
  # Use an existing Customer ID if this is a returning customer
  customer = stripe.Customer.create()
  ephemeralKey = stripe.EphemeralKey.create(
    customer=customer['id'],
    stripe_version='2025-07-30.basil',
  )

  paymentIntent = stripe.PaymentIntent.create(
    amount=1099,
    currency='eur',
    customer=customer['id'],
    # In the latest version of the API, specifying the `automatic_payment_methods` parameter
    # is optional because Stripe enables its functionality by default.
    automatic_payment_methods={
      'enabled': True,
    },
    application_fee_amount=123,
    stripe_account='{{CONNECTED_ACCOUNT_ID}}',
  )
  return jsonify(paymentIntent=paymentIntent.client_secret,
                 ephemeralKey=ephemeralKey.secret,
                 customer=customer.id,
                 publishableKey='<<YOUR_PUBLISHABLE_KEY>>')
```

#### PHP

```php
<?php
require 'vendor/autoload.php';
$stripe = new \Stripe\StripeClient('<<YOUR_SECRET_KEY>>');

// Use an existing Customer ID if this is a returning customer.
$customer = $stripe->customers->create();
$ephemeralKey = $stripe->ephemeralKeys->create([
  'customer' => $customer->id,
], [
  'stripe_version' => '2025-07-30.basil',
]);

$paymentIntent = $stripe->paymentIntents->create([
  'amount' => 1099,
  'currency' => 'eur',
  'customer' => $customer->id,
  // In the latest version of the API, specifying the `automatic_payment_methods` parameter
  // is optional because Stripe enables its functionality by default.
  'automatic_payment_methods' => [
    'enabled' => 'true',
  ],
  'application_fee_amount' => 123,
], ['stripe_account' => '{{CONNECTED_ACCOUNT_ID}}'
]);

echo json_encode(
  [
    'paymentIntent' => $paymentIntent->client_secret,
    'ephemeralKey' => $ephemeralKey->secret,
    'customer' => $customer->id,
    'publishableKey' => '<<YOUR_PUBLISHABLE_KEY>>'
  ]
);
http_response_code(200);
```

#### Java

```java

// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
Stripe.apiKey = "<<YOUR_SECRET_KEY>>";

post(
  "/payment-sheet",
  (request, response) -> {
    response.type("application/json");

    // Use an existing Customer ID if this is a returning customer.
    CustomerCreateParams customerParams = CustomerCreateParams.builder().build();
    Customer customer = Customer.create(customerParams);
    EphemeralKeyCreateParams ephemeralKeyParams =
      EphemeralKeyCreateParams.builder()
        .setStripeVersion("2025-07-30.basil")
        .setCustomer(customer.getId())
        .build();

    EphemeralKey ephemeralKey = EphemeralKey.create(ephemeralKeyParams);
    RequestOptions requestOptions = RequestOptions.builder()
      .setStripeAccount("{{CONNECTED_ACCOUNT_ID}}")
      .build();
    PaymentIntentCreateParams paymentIntentParams =
    PaymentIntentCreateParams.builder()
      .setAmount(1099L)
      .setCurrency("eur")
      .setCustomer(customer.getId())
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter
      // is optional because Stripe enables its functionality by default.
      .setAutomaticPaymentMethods(
        PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
          .setEnabled(true)
          .build()
      )
      .setApplicationFeeAmount(123L)
      .build();

    PaymentIntent paymentIntent = PaymentIntent.create(paymentIntentParams, requestOptions);

    Map<String, String> responseData = new HashMap();
    responseData.put("paymentIntent", paymentIntent.getClientSecret());
    responseData.put("ephemeralKey", ephemeralKey.getSecret());

    responseData.put("customer", customer.getId());
    responseData.put("publishableKey", "<<YOUR_PUBLISHABLE_KEY>>");

    return gson.toJson(responseData);
});
```

#### Node

```javascript

const stripe = require('stripe')('<<YOUR_SECRET_KEY>>');
// This example sets up an endpoint using the Express framework.

app.post('/payment-sheet', async (req, res) => {
  // Use an existing Customer ID if this is a returning customer.
  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    {customer: customer.id},
    {apiVersion: '2025-07-30.basil'}
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1099,
    currency: 'eur',
    customer: customer.id,
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter
    // is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
    application_fee_amount: 123,
  }, {
    stripeAccount: '{{CONNECTED_ACCOUNT_ID}}',
  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey: '<<YOUR_PUBLISHABLE_KEY>>'
  });
});
```

#### Go

```go

// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
stripe.Key = "<<YOUR_SECRET_KEY>>"

func handlePaymentSheet(w http.ResponseWriter, r *http.Request) {
  if r.Method != "POST" {
    http.Error(w, http.StatusText(http.StatusMethodNotAllowed), http.StatusMethodNotAllowed)
    return
  }

  // Use an existing Customer ID if this is a returning customer.
  cparams := &stripe.CustomerParams{}
  c, _ := customer.New(cparams)

  ekparams := &stripe.EphemeralKeyParams{
    Customer: stripe.String(c.ID),
    StripeVersion: stripe.String("2025-07-30.basil"),
  }
  ek, _ := ephemeralKey.New(ekparams)

  piparams := &stripe.PaymentIntentParams{
    Amount:   stripe.Int64(1099),
    Currency: stripe.String(string(stripe.CurrencyEUR)),
    Customer: stripe.String(c.ID),
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter
    // is optional because Stripe enables its functionality by default.
    AutomaticPaymentMethods: &stripe.PaymentIntentAutomaticPaymentMethodsParams{
      Enabled: stripe.Bool(true),
    },
    ApplicationFeeAmount: stripe.Int64(123),
  }
  piparams.SetStripeAccount(""{{CONNECTED_ACCOUNT_ID}}""),
  pi, _ := paymentintent.New(piparams)

  writeJSON(w, struct {
    PaymentIntent  string `json:"paymentIntent"`
    EphemeralKey   string `json:"ephemeralKey"`
    Customer       string `json:"customer"`
    PublishableKey string `json:"publishableKey"`
  }{
    PaymentIntent: pi.ClientSecret,
    EphemeralKey: ek.Secret,
    Customer: c.ID,
    PublishableKey: "<<YOUR_PUBLISHABLE_KEY>>",
  })
}
```

#### .NET

```dotnet

// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeConfiguration.ApiKey = "<<YOUR_SECRET_KEY>>";

[HttpPost("payment-sheet")]
public ActionResult<PaymentSheetCreateResponse> CreatePaymentSheet([FromBody] CreatePaymentSheetRequest req)
{
  // Use an existing Customer ID if this is a returning customer.
  var customerOptions = new CustomerCreateOptions();
  var customerService = new CustomerService();
  var customer = customerService.Create(customerOptions);
  var ephemeralKeyOptions = new EphemeralKeyCreateOptions
  {
    Customer = customer.Id,
    StripeVersion = "2025-07-30.basil",
  };
  var ephemeralKeyService = new EphemeralKeyService();
  var ephemeralKey = ephemeralKeyService.Create(ephemeralKeyOptions);

  var paymentIntentOptions = new PaymentIntentCreateOptions
  {
    Amount = 1099,
    Currency = "eur",
    Customer = customer.Id,
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter
    // is optional because Stripe enables its functionality by default.
    AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
    {
      Enabled = true,
    },
    ApplicationFeeAmount = 123,
  };
  var requestOptions = new RequestOptions
  {
    StripeAccount = ""{{CONNECTED_ACCOUNT_ID}}"",
  };
  var paymentIntentService = new PaymentIntentService();
  PaymentIntent paymentIntent = paymentIntentService.Create(paymentIntentOptions, requestOptions);

  return new PaymentSheetCreateResponse
  {
    PaymentIntent = paymentIntent.ClientSecret,
    EphemeralKey = ephemeralKey.Secret,

    Customer = customer.Id,
    PublishableKey = "<<YOUR_PUBLISHABLE_KEY>>",
  };
}
```

#### Listing payment methods manually

> You can fork and deploy an implementation of this endpoint on [CodeSandbox](https://codesandbox.io/p/devbox/suspicious-lalande-l325w6) for testing.

#### curl

```bash
# Create a Customer (use an existing Customer ID if this is a returning customer)
curl https://api.stripe.com/v1/customers \
  -u <<YOUR_SECRET_KEY>>: \
  -X "POST"

# Create an Ephemeral Key for the Customer
curl https://api.stripe.com/v1/ephemeral_keys \
  -u <<YOUR_SECRET_KEY>>: \
  -X "POST" \
  -d "customer"="{{CUSTOMER_ID}}" \

# Create a PaymentIntent
curl https://api.stripe.com/v1/payment_intents \
  -u <<YOUR_SECRET_KEY>>: \
  -H "Stripe-Account: {{CONNECTED_ACCOUNT_ID}}"
  -X "POST" \
  -d "customer"="{{CUSTOMER_ID}}" \
  -d "amount"=1099 \
  -d "currency"="eur" \
  -d "payment_method_types[]"="bancontact" \
  -d "payment_method_types[]"="card" \
  -d "payment_method_types[]"="ideal" \
  -d "payment_method_types[]"="klarna" \
  -d "payment_method_types[]"="sepa_debit" \
  -d application_fee_amount="123" \
```

#### Ruby

```ruby
# This example sets up an endpoint using the Sinatra framework.



post '/payment-sheet' do
  # Use an existing Customer ID if this is a returning customer
  customer = Stripe::Customer.create
  ephemeralKey = Stripe::EphemeralKey.create({
    customer: customer['id'],
  }, {stripe_version: '2025-07-30.basil'})
  paymentIntent = Stripe::PaymentIntent.create({
    amount: 1099,
    currency: 'eur',
    customer: customer['id'],
    payment_method_types: ['bancontact', 'card', 'ideal', 'klarna', 'sepa_debit'],
    application_fee_amount: 123,
  }, {stripe_account: '{{CONNECTED_ACCOUNT_ID}}'})
  {
    paymentIntent: paymentIntent['client_secret'],
    ephemeralKey: ephemeralKey['secret'],
    customer: customer['id'],
    publishableKey: '<<YOUR_PUBLISHABLE_KEY>>'
  }.to_json
end
```

#### Python

```python
# This example sets up an endpoint using the Flask framework.
# Watch this video to get started: https://youtu.be/7Ul1vfmsDck.


@app.route('/payment-sheet', methods=['POST'])
def payment_sheet():
  # Use an existing Customer ID if this is a returning customer
  customer = stripe.Customer.create()
  ephemeralKey = stripe.EphemeralKey.create(
    customer=customer['id'],
    stripe_version='2025-07-30.basil',
  )

  paymentIntent = stripe.PaymentIntent.create(
    amount=1099,
    currency='eur',
    customer=customer['id'],
    payment_method_types=["bancontact", "card", "ideal", "klarna", "sepa_debit"],
    application_fee_amount=123,
    stripe_account='{{CONNECTED_ACCOUNT_ID}}',
  )
  return jsonify(paymentIntent=paymentIntent.client_secret,
                 ephemeralKey=ephemeralKey.secret,
                 customer=customer.id,
                 publishableKey='<<YOUR_PUBLISHABLE_KEY>>')
```

#### PHP

```php
<?php
require 'vendor/autoload.php';
$stripe = new \Stripe\StripeClient('<<YOUR_SECRET_KEY>>');

// Use an existing Customer ID if this is a returning customer.
$customer = $stripe->customers->create();
$ephemeralKey = $stripe->ephemeralKeys->create([
  'customer' => $customer->id,
], [
  'stripe_version' => '2025-07-30.basil',
]);

$paymentIntent = $stripe->paymentIntents->create([
  'amount' => 1099,
  'currency' => 'eur',
  'customer' => $customer->id,
  'payment_method_types' => ['bancontact', 'card', 'ideal', 'klarna', 'sepa_debit'],
  'application_fee_amount' => 123,
], ['stripe_account' => '{{CONNECTED_ACCOUNT_ID}}'
]);

echo json_encode(
  [
    'paymentIntent' => $paymentIntent->client_secret,
    'ephemeralKey' => $ephemeralKey->secret,
    'customer' => $customer->id,
    'publishableKey' => '<<YOUR_PUBLISHABLE_KEY>>'
  ]
);
http_response_code(200);
```

#### Java

```java
// This example sets up an endpoint using the Spark framework.

post("/payment-sheet", (request, response) -> {
  response.type("application/json");

  // Use an existing Customer ID if this is a returning customer.
  CustomerCreateParams customerParams = CustomerCreateParams.builder().build();
  Customer customer = Customer.create(customerParams);
  EphemeralKeyCreateParams ephemeralKeyParams =
    EphemeralKeyCreateParams.builder()
      .setStripeVersion("2025-07-30.basil")
      .setCustomer(customer.getId())
      .build();

  EphemeralKey ephemeralKey = EphemeralKey.create(ephemeralKeyParams);

  List<String> paymentMethodTypes = new ArrayList<String>();
  paymentMethodTypes.add("bancontact");
  paymentMethodTypes.add("card");
  paymentMethodTypes.add("ideal");
  paymentMethodTypes.add("klarna");
  paymentMethodTypes.add("sepa_debit");
  RequestOptions requestOptions = RequestOptions.builder()
    .setStripeAccount("{{CONNECTED_ACCOUNT_ID}}")
    .build();

  PaymentIntentCreateParams paymentIntentParams =
  PaymentIntentCreateParams.builder()
    .setAmount(1099L)
    .setCurrency("eur")
    .setCustomer(customer.getId())
    .addAllPaymentMethodType(paymentMethodTypes)
    .setApplicationFeeAmount(123L)
    .build();

  PaymentIntent paymentIntent = PaymentIntent.create(paymentIntentParams, requestOptions);

  Map<String, String> responseData = new HashMap();
  responseData.put("paymentIntent", paymentIntent.getClientSecret());
  responseData.put("ephemeralKey", ephemeralKey.getSecret());
  responseData.put("customer", customer.getId());
  responseData.put("publishableKey", "<<YOUR_PUBLISHABLE_KEY>>");

  return gson.toJson(responseData);
});
```

#### Node

```javascript

// This example sets up an endpoint using the Express framework.

app.post('/payment-sheet', async (req, res) => {
  // Use an existing Customer ID if this is a returning customer.
  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    {customer: customer.id},
    {apiVersion: '2025-07-30.basil'}
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1099,
    currency: 'eur',
    customer: customer.id,
    payment_method_types: ['bancontact', 'card', 'ideal', 'klarna', 'sepa_debit'],
    application_fee_amount: 123,
  }, {
    stripeAccount: '{{CONNECTED_ACCOUNT_ID}}',
  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey: '<<YOUR_PUBLISHABLE_KEY>>'
  });
});
```

#### Go

```go

// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
stripe.Key = "<<YOUR_SECRET_KEY>>"

func handlePaymentSheet(w http.ResponseWriter, r *http.Request) {
  if r.Method != "POST" {
    http.Error(w, http.StatusText(http.StatusMethodNotAllowed), http.StatusMethodNotAllowed)
    return
  }

  // Use an existing Customer ID if this is a returning customer.
  cparams := &stripe.CustomerParams{}
  c, _ := customer.New(cparams)

  ekparams := &stripe.EphemeralKeyParams{
    Customer: stripe.String(c.ID),
    StripeVersion: stripe.String("2025-07-30.basil"),
  }
  ek, _ := ephemeralKey.New(ekparams)

  piparams := &stripe.PaymentIntentParams{
    Amount:   stripe.Int64(1099),
    Currency: stripe.String(string(stripe.CurrencyEUR)),
    Customer: stripe.String(c.ID),
    PaymentMethodTypes: []*string{
      stripe.String("bancontact"),
      stripe.String("card"),
      stripe.String("ideal"),
      stripe.String("klarna"),
      stripe.String("sepa_debit"),
    },
    ApplicationFeeAmount: stripe.Int64(123),
  }
  piparams.SetStripeAccount(""{{CONNECTED_ACCOUNT_ID}}""),
  pi, _ := paymentintent.New(piparams)

  writeJSON(w, struct {
    PaymentIntent  string `json:"paymentIntent"`
    EphemeralKey   string `json:"ephemeralKey"`
    Customer       string `json:"customer"`
    PublishableKey string `json:"publishableKey"`
  }{
    PaymentIntent: pi.ClientSecret,
    EphemeralKey: ek.Secret,
    Customer: c.ID,
    PublishableKey: "<<YOUR_PUBLISHABLE_KEY>>",
  })
}
```

#### .NET

```dotnet

// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
StripeConfiguration.ApiKey = "<<YOUR_SECRET_KEY>>";

[HttpPost("payment-sheet")]
public ActionResult<PaymentSheetCreateResponse> CreatePaymentSheet([FromBody] CreatePaymentSheetRequest req)
{
  // Use an existing Customer ID if this is a returning customer.
  var customerOptions = new CustomerCreateOptions();
  var customerService = new CustomerService();
  var customer = customerService.Create(customerOptions);
  var ephemeralKeyOptions = new EphemeralKeyCreateOptions
  {
    Customer = customer.Id,
    StripeVersion = "2025-07-30.basil",
  };
  var ephemeralKeyService = new EphemeralKeyService();
  var ephemeralKey = ephemeralKeyService.Create(ephemeralKeyOptions);

  var paymentIntentOptions = new PaymentIntentCreateOptions
  {
    Amount = 1099,
    Currency = "eur",
    Customer = customer.Id,
    PaymentMethodTypes = new List<string>
    {
      "bancontact",
      "card",
      "ideal",
      "klarna",
      "sepa_debit",
    },
    ApplicationFeeAmount = 123,
  };
  var requestOptions = new RequestOptions
  {
    StripeAccount = ""{{CONNECTED_ACCOUNT_ID}}"",
  };
  var paymentIntentService = new PaymentIntentService();
  PaymentIntent paymentIntent = paymentIntentService.Create(paymentIntentOptions, requestOptions);

  return new PaymentSheetCreateResponse
  {
    PaymentIntent = paymentIntent.ClientSecret,
    EphemeralKey = ephemeralKey.Secret,

    Customer = customer.Id,
    PublishableKey = "<<YOUR_PUBLISHABLE_KEY>>",
  };
}
```

> Each payment method needs to support the currency passed in the PaymentIntent and your business needs to be based in one of the countries each payment method supports. See the [Payment method integration options](https://docs.stripe.com/payments/payment-methods/integration-options.md) page for more details about what’s supported.

## Integrate the payment sheet [Client-side]

Before displaying the mobile Payment Element, your checkout page should:

- Show the products being purchased and the total amount
- Collect any required shipping information
- Include a checkout button to present Stripe’s UI

In the checkout of your app, make a network request to the backend endpoint you created in the previous step and call `initPaymentSheet` from the `useStripe` hook.

```javascript

export default function CheckoutScreen() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const fetchPaymentSheetParams = async () => {
    const response = await fetch(`${API_URL}/payment-sheet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const { paymentIntent, ephemeralKey, customer } = await response.json();

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    const {
      paymentIntent,
      ephemeralKey,
      customer,
    } = await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      merchantDisplayName: "Example, Inc.",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: 'Jane Doe',
      }
    });
    if (!error) {
      setLoading(true);
    }
  };

  const openPaymentSheet = async () => {
    // see below
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  return (
    <Screen>
      <Button
        variant="primary"
        disabled={!loading}
        title="Checkout"
        onPress={openPaymentSheet}
      />
    </Screen>
  );
}
```

When your customer taps the **Checkout** button, call `presentPaymentSheet()` to open the sheet. After the customer completes the payment, the sheet is dismissed and the promise resolves with an optional `StripeError<PaymentSheetError>`.

```javascript
export default function CheckoutScreen() {
  // continued from above

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert('Success', 'Your order is confirmed!');
    }
  };

  return (
    <Screen>
      <Button
        variant="primary"
        disabled={!loading}
        title="Checkout"
        onPress={openPaymentSheet}
      />
    </Screen>
  );
}
```

If there is no error, inform the user they’re done (for example, by displaying an order confirmation screen).

Setting `allowsDelayedPaymentMethods` to true allows [delayed notification](https://docs.stripe.com/payments/payment-methods.md#payment-notification) payment methods like US bank accounts. For these payment methods, the final payment status isn’t known when the `PaymentSheet` completes, and instead succeeds or fails later. If you support these types of payment methods, inform the customer their order is confirmed and only fulfil their order (for example, ship their product) when the payment is successful.

## Set up a return URL (iOS only) [Client-side]

The customer might navigate away from your app to authenticate (for example, in Safari or their banking app). To allow them to automatically return to your app after authenticating, [configure a custom URL scheme](https://developer.apple.com/documentation/xcode/defining-a-custom-url-scheme-for-your-app) and set up your app delegate to forward the URL to the SDK. Stripe doesn’t support [universal links](https://developer.apple.com/documentation/xcode/allowing-apps-and-websites-to-link-to-your-content).

#### SceneDelegate

#### Swift

```swift
// This method handles opening custom URL schemes (for example, "your-app://stripe-redirect")
func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
    guard let url = URLContexts.first?.url else {
        return
    }
    let stripeHandled = StripeAPI.handleURLCallback(with: url)
    if (!stripeHandled) {
        // This was not a Stripe url – handle the URL normally as you would
    }
}

```

#### AppDelegate

#### Swift

```swift
// This method handles opening custom URL schemes (for example, "your-app://stripe-redirect")
func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
    let stripeHandled = StripeAPI.handleURLCallback(with: url)
    if (stripeHandled) {
        return true
    } else {
        // This was not a Stripe url – handle the URL normally as you would
    }
    return false
}
```

#### SwiftUI

#### Swift

```swift

@main
struct MyApp: App {
  var body: some Scene {
    WindowGroup {
      Text("Hello, world!").onOpenURL { incomingURL in
          let stripeHandled = StripeAPI.handleURLCallback(with: incomingURL)
          if (!stripeHandled) {
            // This was not a Stripe url – handle the URL normally as you would
          }
        }
    }
  }
}
```

Additionally, set the [returnURL](https://stripe.dev/stripe-ios/stripe-paymentsheet/Classes/PaymentSheet/Configuration.html#/s:6Stripe12PaymentSheetC13ConfigurationV9returnURLSSSgvp) on your [PaymentSheet.Configuration](https://stripe.dev/stripe-ios/stripe-paymentsheet/Classes/PaymentSheet/Configuration.html) object to the URL for your app.

```swift
var configuration = PaymentSheet.Configuration()
configuration.returnURL = "your-app://stripe-redirect"
```

## Handle post-payment events

Stripe sends a [payment_intent.succeeded](https://docs.stripe.com/api/events/types.md#event_types-payment_intent.succeeded) event when the payment completes. Use the [Dashboard webhook tool](https://dashboard.stripe.com/webhooks) or follow the [webhook guide](https://docs.stripe.com/webhooks/quickstart.md) to receive these events and run actions, such as sending an order confirmation email to your customer, logging the sale in a database, or starting a shipping workflow.

Listen for these events rather than waiting on a callback from the client. On the client, the customer could close the browser window or quit the app before the callback executes, and malicious clients could manipulate the response. Setting up your integration to listen for asynchronous events is what enables you to accept [different types of payment methods](https://stripe.com/payments/payment-methods-guide) with a single integration.

In addition to handling the `payment_intent.succeeded` event, we recommend handling these other events when collecting payments with the Payment Element:

| Event                                                                                                                           | Description                                                                                                                                                                                                                                                                         | Action                                                                                                                                                                                           |
| ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [payment_intent.succeeded](https://docs.stripe.com/api/events/types.md?lang=php#event_types-payment_intent.succeeded)           | Sent when a customer successfully completes a payment.                                                                                                                                                                                                                              | Send the customer an order confirmation and *fulfill* (Fulfillment is the process of providing the goods or services purchased by a customer, typically after payment is collected) their order. |
| [payment_intent.processing](https://docs.stripe.com/api/events/types.md?lang=php#event_types-payment_intent.processing)         | Sent when a customer successfully initiates a payment, but the payment has yet to complete. This event is most commonly sent when the customer initiates a bank debit. It’s followed by either a `payment_intent.succeeded` or `payment_intent.payment_failed` event in the future. | Send the customer an order confirmation that indicates their payment is pending. For digital goods, you might want to fulfill the order before waiting for payment to complete.                  |
| [payment_intent.payment_failed](https://docs.stripe.com/api/events/types.md?lang=php#event_types-payment_intent.payment_failed) | Sent when a customer attempts a payment, but the payment fails.                                                                                                                                                                                                                     | If a payment transitions from `processing` to `payment_failed`, offer the customer another attempt to pay.                                                                                       |

## Test the integration

#### Cards

| Card number         | Scenario                                                                                                                                                                                                                                                                                      | How to test                                                                                           |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| 4242424242424242    | The card payment succeeds and doesn’t require authentication.                                                                                                                                                                                                                                 | Fill in the credit card form using the credit card number with any expiry date, CVC, and postal code. |
| 4000002500003155    | The card payment requires *authentication* (Strong Customer Authentication (SCA) is a regulatory requirement in effect as of September 14, 2019, that impacts many European online payments. It requires customers to use two-factor authentication like 3D Secure to verify their purchase). | Fill in the credit card form using the credit card number with any expiry date, CVC, and postal code. |
| 4000000000009995    | The card is declined with a decline code like `insufficient_funds`.                                                                                                                                                                                                                           | Fill in the credit card form using the credit card number with any expiry date, CVC, and postal code. |
| 6205500000000000004 | The UnionPay card has a variable length of 13-19 digits.                                                                                                                                                                                                                                      | Fill in the credit card form using the credit card number with any expiry date, CVC, and postal code. |

#### Bank redirects

| Payment method    | Scenario                                                                                                                                                                                              | How to test                                                                                                                                              |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bancontact, iDEAL | Your customer fails to authenticate on the redirect page for a redirect-based and immediate notification payment method.                                                                              | Choose any redirect-based payment method, fill out the required details, and confirm the payment. Then click **Fail test payment** on the redirect page. |
| Pay by Bank       | Your customer successfully pays with a redirect-based and [delayed notification](https://docs.stripe.com/payments/payment-methods.md#payment-notification) payment method.                            | Choose the payment method, fill out the required details, and confirm the payment. Then click **Complete test payment** on the redirect page.            |
| Pay by Bank       | Your customer fails to authenticate on the redirect page for a redirect-based and delayed notification payment method.                                                                                | Choose the payment method, fill out the required details, and confirm the payment. Then click **Fail test payment** on the redirect page.                |
| BLIK              | BLIK payments fail in a variety of ways – immediate failures (for example, the code has expired or is invalid), delayed errors (the bank declines) or timeouts (the customer didn’t respond in time). | Use email patterns to [simulate the different failures.](https://docs.stripe.com/payments/blik/accept-a-payment.md#simulate-failures)                    |

#### Bank debits

| Payment method    | Scenario                                                                                          | How to test                                                                                                                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SEPA Direct Debit | Your customer successfully pays with SEPA Direct Debit.                                           | Fill out the form using the account number `AT321904300235473204`. The confirmed PaymentIntent initially transitions to processing, then transitions to the succeeded status three minutes later. |
| SEPA Direct Debit | Your customer’s payment intent status transitions from `processing` to `requires_payment_method`. | Fill out the form using the account number `AT861904300235473202`.                                                                                                                                |

See [Testing](https://docs.stripe.com/testing.md) for additional information to test your integration.

## Optional: Enable Apple Pay

### Register for an Apple Merchant ID

Obtain an Apple Merchant ID by [registering for a new identifier](https://developer.apple.com/account/resources/identifiers/add/merchant) on the Apple Developer website.

Fill out the form with a description and identifier. Your description is for your own records and you can modify it in the future. Stripe recommends using the name of your app as the identifier (for example, `merchant.com.{{YOUR_APP_NAME}}`).

### Create a new Apple Pay certificate

Create a certificate for your app to encrypt payment data.

Go to the [iOS Certificate Settings](https://dashboard.stripe.com/settings/ios_certificates) in the Dashboard, click **Add new application**, and follow the guide.

Download a Certificate Signing Request (CSR) file to get a secure certificate from Apple that allows you to use Apple Pay.

One CSR file must be used to issue exactly one certificate. If you switch your Apple Merchant ID, you must go to the [iOS Certificate Settings](https://dashboard.stripe.com/settings/ios_certificates) in the Dashboard to obtain a new CSR and certificate.

### Integrate with Xcode

Add the Apple Pay capability to your app. In Xcode, open your project settings, click the **Signing & Capabilities** tab, and add the **Apple Pay** capability. You might be prompted to log in to your developer account at this point. Select the merchant ID you created earlier, and your app is ready to accept Apple Pay.
![](https://b.stripecdn.com/docs-statics-srv/assets/xcode.a701d4c1922d19985e9c614a6f105bf1.png)

Enable the Apple Pay capability in Xcode

### Add Apple Pay

#### One-time payment

Pass your merchant ID when you create `StripeProvider`:

```javascript
import { StripeProvider } from '@stripe/stripe-react-native';

function App() {
  return (
    <StripeProvider
      publishableKey="<<YOUR_PUBLISHABLE_KEY>>"
      merchantIdentifier="MERCHANT_ID"
    >
      // Your app code here
    </StripeProvider>
  );
}
```

When you call `initPaymentSheet`, pass in your [ApplePayParams](https://stripe.dev/stripe-react-native/api-reference/modules/PaymentSheet.html#ApplePayParams):

```javascript
await initPaymentSheet({
  // ...
  applePay: {
    merchantCountryCode: 'US',
  },
});
```

#### Recurring payments

When you call `initPaymentSheet`, pass in an [ApplePayParams](https://stripe.dev/stripe-react-native/api-reference/modules/PaymentSheet.html#ApplePayParams) with `merchantCountryCode` set to the country code of your business.

In accordance with [Apple’s guidelines](https://developer.apple.com/design/human-interface-guidelines/apple-pay#Supporting-subscriptions) for recurring payments, you must also set a `cardItems` that includes a [RecurringCartSummaryItem](https://stripe.dev/stripe-react-native/api-reference/modules/ApplePay.html#RecurringCartSummaryItem) with the amount you intend to charge (for example, “$59.95 a month”).

You can also adopt [merchant tokens](https://developer.apple.com/apple-pay/merchant-tokens/) by setting the `request` with its `type` set to `PaymentRequestType.Recurring`

To learn more about how to use recurring payments with Apple Pay, see [Apple’s PassKit documentation](https://developer.apple.com/documentation/passkit/pkpaymentrequest).

#### iOS (React Native)

```javascript
const initializePaymentSheet = async () => {
  const recurringSummaryItem = {
    label: 'My Subscription',
    amount: '59.99',
    paymentType: 'Recurring',
    intervalCount: 1,
    intervalUnit: 'month',
    // Payment starts today
    startDate: new Date().getTime() / 1000,

    // Payment ends in one year
    endDate: new Date().getTime() / 1000 + 60 * 60 * 24 * 365,
  };

  const {error} = await initPaymentSheet({
    // ...
    applePay: {
      merchantCountryCode: 'US',
      cartItems: [recurringSummaryItem],
      request: {
        type: PaymentRequestType.Recurring,
        description: 'Recurring',
        managementUrl: 'https://my-backend.example.com/customer-portal',
        billing: recurringSummaryItem,
        billingAgreement:
          "You'll be billed $59.99 every month for the next 12 months. To cancel at any time, go to Account and click 'Cancel Membership.'",
      },
    },
  });
};
```

### Order tracking

To add [order tracking](https://developer.apple.com/design/human-interface-guidelines/technologies/wallet/designing-order-tracking) information in iOS 16 or later, configure a `setOrderTracking` callback function. Stripe calls your implementation after the payment is complete, but before iOS dismisses the Apple Pay sheet.

In your implementation of `setOrderTracking` callback function, fetch the order details from your server for the completed order, and pass the details to the provided `completion` function.

To learn more about order tracking, see [Apple’s Wallet Orders documentation](https://developer.apple.com/documentation/walletorders).

#### iOS (React Native)

```javascript
await initPaymentSheet({
  // ...
  applePay: {
    // ...
    setOrderTracking: async complete => {
      const apiEndpoint =
        Platform.OS === 'ios'
          ? 'http://localhost:4242'
          : 'http://10.0.2.2:4567';
      const response = await fetch(
        `${apiEndpoint}/retrieve-order?orderId=${orderId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      if (response.status === 200) {
        const orderDetails = await response.json();
        // orderDetails should include orderIdentifier, orderTypeIdentifier,
        // authenticationToken and webServiceUrl
        complete(orderDetails);
      }
    },
  },
});
```

## Optional: Enable Google Pay

### Set up your integration

To use Google Pay, first enable the Google Pay API by adding the following to the `<application>` tag of your **AndroidManifest.xml**:

```xml
<application>
  ...
  <meta-data
    android:name="com.google.android.gms.wallet.api.enabled"
    android:value="true" />
</application>
```

For more details, see Google Pay’s [Set up Google Pay API](https://developers.google.com/pay/api/android/guides/setup) for Android.

### Add Google Pay

When you initialise `PaymentSheet`, set `merchantCountryCode` to the country code of your business and set `googlePay` to true.

You can also use the test environment by passing the `testEnv` parameter. You can only test Google Pay on a physical Android device. Follow the [React Native docs](https://reactnative.dev/docs/running-on-device) to test your application on a physical device.

```javascript
const { error, paymentOption } = await initPaymentSheet({
  // ...
  googlePay: {
    merchantCountryCode: 'US',
    testEnv: true, // use test environment
  },
});
```

## Optional: Enable card scanning (iOS only) [Client-side]

To enable card scanning support, set the `NSCameraUsageDescription` (**Privacy - Camera Usage Description**) in the Info.plist of your application, and provide a reason for accessing the camera (for example, “To scan cards”). Devices with iOS 13 or higher support card scanning.

## Optional: Customize the sheet

All customization is configured using `initPaymentSheet`.

### Appearance

Customise colours, fonts, and so on to match the look and feel of your app by using the [appearance API](https://docs.stripe.com/elements/appearance-api.md?platform=react-native).

### Merchant display name

Specify a customer-facing business name by setting `merchantDisplayName`. By default, this is your app’s name.

```javascript
await initPaymentSheet({
  // ...
  merchantDisplayName: 'Example Inc.',
});
```

### Dark mode

By default, `PaymentSheet` automatically adapts to the user’s system-wide appearance settings (light and dark mode). You can change this by setting the `style` property to `alwaysLight` or `alwaysDark` mode on iOS.

```javascript
await initPaymentSheet({
  // ...
  style: 'alwaysDark',
});
```

On Android, set light or dark mode on your app:

```
// force dark
AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES)
// force light
AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO)
```

### Default billing details

To set default values for billing details collected in the PaymentSheet, configure the `defaultBillingDetails` property. The `PaymentSheet` pre-populates its fields with the values that you provide.

```javascript
await initPaymentSheet({
  // ...
  defaultBillingDetails: {
      email: 'foo@bar.com',
      address: {
        country: 'US',
      },
  },
});
```

### Collect billing details

Use `billingDetailsCollectionConfiguration` to specify how you want to collect billing details in the PaymentSheet.

You can collect your customer’s name, email, phone number, and address.

If you don’t intend to collect the values that the payment method requires, you must do the following:

1. Attach the values that aren’t collected by `PaymentSheet` to the `defaultBillingDetails` property.
1. Set `billingDetailsCollectionConfiguration.attachDefaultsToPaymentMethod` to `true`.

```javascript
await initPaymentSheet({
  // ...
  defaultBillingDetails: {
    email: 'foo@bar.com',
  }
  billingDetailsCollectionConfiguration: {
    name: PaymentSheet.CollectionMode.ALWAYS,
    email: PaymentSheet.CollectionMode.NEVER,
    address: PaymentSheet.AddressCollectionMode.FULL,
    attachDefaultsToPaymentMethod: true
  },
});
```

> Consult with your legal counsel regarding laws that apply to collecting information. Only collect phone numbers if you need them for the transaction.

## Optional: Complete payment in your UI

You can present Payment Sheet to only collect payment method details and then later call a `confirm` method to complete payment in your app’s UI. This is useful if you have a custom buy button or require additional steps after payment details are collected.
![](https://b.stripecdn.com/docs-statics-srv/assets/react-native-multi-step.84d8a0a44b1baa596bda491322b6d9fd.png)

> A sample integration is [available on our GitHub](https://github.com/stripe/stripe-react-native/blob/master/example/src/screens/PaymentsUICustomScreen.tsx).

1. First, call `initPaymentSheet` and pass `customFlow: true`. `initPaymentSheet` resolves with an initial payment option containing an image and label representing the customer’s payment method. Update your UI with these details.

```javascript
const {
  initPaymentSheet,
  presentPaymentSheet,
  confirmPaymentSheetPayment,
} = useStripe()

const { error, paymentOption } = await initPaymentSheet({
  customerId: customer,
  customerEphemeralKeySecret: ephemeralKey,
  paymentIntentClientSecret: paymentIntent,
  customFlow: true,
  merchantDisplayName: 'Example Inc.',
});
// Update your UI with paymentOption
```

1. Use `presentPaymentSheet` to collect payment details. When the customer finishes, the sheet dismisses itself and resolves the promise. Update your UI with the selected payment method details.

```javascript
const { error, paymentOption } = await presentPaymentSheet();
```

1. Use `confirmPaymentSheetPayment` to confirm the payment. This resolves with the result of the payment.

```javascript
const { error } = await confirmPaymentSheetPayment();

if (error) {
  Alert.alert(`Error code: ${error.code}`, error.message);
} else {
  Alert.alert(
    'Success',
    'Your order is confirmed!'
  );
}
```

Setting `allowsDelayedPaymentMethods` to true allows [delayed notification](https://docs.stripe.com/payments/payment-methods.md#payment-notification) payment methods like US bank accounts. For these payment methods, the final payment status isn’t known when the `PaymentSheet` completes, and instead succeeds or fails later. If you support these types of payment methods, inform the customer their order is confirmed and only fulfil their order (for example, ship their product) when the payment is successful.


## Payouts

By default, any charge that you create for a connected account accumulates in the connected account’s [Stripe balance](https://docs.stripe.com/connect/account-balances.md) and is paid out on a daily rolling basis. Connected accounts can manage their own payout schedules in the [Stripe Dashboard](https://dashboard.stripe.com/settings/payouts).

## See also

- [Manage connected accounts in the Dashboard](https://docs.stripe.com/connect/dashboard.md)
- [Issue refunds](https://docs.stripe.com/connect/direct-charges.md#issue-refunds)
- [Customise statement descriptors](https://docs.stripe.com/connect/statement-descriptors.md)
- [Work with multiple currencies](https://docs.stripe.com/connect/currencies.md)