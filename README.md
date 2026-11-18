# aurevv website

Customised gift hampers by aurevv. Plain HTML, CSS and JavaScript. There is nothing to install or build.

## Files

| File | What it does |
| --- | --- |
| `index.html` | The page: hero, hampers, custom request, My Cart, My Orders, contact |
| `styles.css` | All styling (brand colours Warm Ivory `#F8F4ED` and Midnight Navy `#172B4D`, font Inter) |
| `app.js` | Hamper boxes, cart, orders, elephant and bee, section transition |
| `hero-hamper.svg` | The hero picture (an illustrated hamper) until you add your own photo |
| `favicon.svg` | Browser tab icon |
| `status-updates.json` | Where you update order statuses (see below) |

## Put it on GitHub (works from a phone)

1. Extract `AUREVV_COMPLETE_WEBSITE.zip` in your Files app.
2. Open your repository (`Aurevv.co`) on github.com and tap **Add file > Upload files**.
3. Select all the files from the extracted folder (README.md is optional) and upload them. Files with the same name (like `index.html`) are replaced.
4. Tap **Commit changes**. GitHub Pages rebuilds in 1 to 2 minutes. Reload the site; if you still see the old one, hard refresh or open it in a private tab.

## Add your own hero photo

1. Upload your photo to the repo as `hero-hamper.jpg` (landscape or portrait both work; a portrait 4:5 photo fits best).
2. In `index.html`, find `src="hero-hamper.svg"` and change it to `src="hero-hamper.jpg"`. Commit.

## How orders work (important)

This site has no server, so it works like this:

- **My Cart** is saved in the customer's browser. It stays after they reload or leave and come back, on the same phone and browser.
- **Place order** saves the order under **My Orders** (on the customer's device only), copies a ready order message, and opens a chat with `@aurevv.co` on Instagram. Instagram cannot pre-fill the message, so the customer pastes it and sends. **You receive the order in your Instagram DMs.** If the customer does not send the message, you do not get the order.
- Adding to cart never creates an order. An order exists only after Place order.
- Payment is not handled by the website. You confirm the price and take payment in the chat.

### Updating an order's status

Customers see "Awaiting payment", "Order received" and "Not dispatched" at first. To change them:

1. Open `status-updates.json` in your repo and tap the pencil (edit) icon.
2. Add the order ID the customer sent you, with the new statuses, for example:

```json
{
  "AUR-261117-AHXP": {
    "payment": "Payment verified",
    "preparation": "Being prepared",
    "delivery": "Out for delivery"
  }
}
```

3. Commit. Within a minute or two the customer's My Orders page shows the new status.

Allowed values (spelling must match exactly):

- `payment`: `Awaiting payment`, `Payment verified`
- `preparation`: `Order received`, `Being prepared`, `Ready for delivery`
- `delivery`: `Not dispatched`, `Out for delivery`, `Delivered`

Separate multiple orders with commas. A mistake in the file (like a missing comma) means no updates show until it is fixed.

## Other notes

- **Custom hampers:** the "Create Your Own" form sends the request to your Instagram the same way. It does not create an order or a price.
- **Elephant and bee:** the cheeks fade softly while the elephant is on screen. The bee flies above the elephant for 10 seconds after the elephant first appears, then disappears. Reload the page to see it again.
- **Section transition:** a short (about 1 second) particle colour blend plays when someone uses the menu or buttons to jump between sections. It never delays scrolling.
- **Reduced motion:** if a visitor has "reduce motion" turned on in their device settings, the elephant and bee stay still and the particle transition and smooth scrolling are off.
- **Fonts:** Inter and the script logo font load from Google Fonts, so the site needs an internet connection.
- **Prices:** Hampers C, D and E show "Price may vary with add-ons". The cart shows their total as a starting total.
