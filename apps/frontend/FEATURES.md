# Bel'Air's Buvette Features

Welcome to the **Bel'Air's Buvette** project! This document outlines the key features and functionalities of the web application and design system for festival goers to manage their tokens and place orders.

## Features

### As a developer, I want a Token Balance component to display the festival goer's current balance

Rules:
- The component accepts `drinkTokens` and `foodTokens` as props
- Drink tokens and food tokens are visually distinct (different icons and colors)
- A zero balance renders the token count greyed out with a "No tokens remaining" label
- The component is responsive across all screen sizes
- A Storybook story showcases all states: normal balance, zero balance, and mixed balance

### As a festival goer, I want to browse the menu on the web app

Rules:
- The menu page is split into two sections: Drinks and Food
- The Drinks section shows sub-categories: Non-Alcoholic (free) and Alcoholic (Normal: 1 token, Premium: 2 tokens)
- The Food section shows sub-categories: Snacks (1 token) and Meals (3 tokens)
- Each item card displays the name and token cost; non-alcoholic drinks show "Free"
- Items the user cannot afford are visually dimmed but remain accessible
- The menu is filterable by category (All / Drinks / Food)

### As a festival goer, I want to add items to a cart and see the running total

Rules:
- Clicking "Add to cart" on an item adds it to the cart sidebar/drawer
- The cart shows the running drink token cost and food token cost separately
- Items can be removed or their quantity adjusted in the cart
- When adding an item would exceed the token balance, the add button is disabled for that item and a tooltip explains why
- The cart subtotal updates in real time as items are added or removed

### As a festival goer, I want to place my order from the cart

Rules:
- The "Place Order" button is enabled only when the cart is non-empty and the token balance is sufficient
- Clicking it shows a confirmation modal with the full order summary and estimated preparation time
- After confirming, the order is submitted and the user is redirected to the Order Status page
- The token balance display updates immediately after order placement
- On error (e.g. network failure), the cart is preserved and an error toast is shown

### As a festival goer, I want an Order Status page to track my current order

Rules:
- The page shows the current order state: Pending, Acknowledged, Ready for Pickup, or Cancelled
- When in Acknowledged state, a live countdown of the estimated preparation time is displayed
- When Ready for Pickup, a full-width success banner "Your order is ready! " is shown
- The page auto-refreshes every 30 seconds
- A cancel button is visible only when the order is in Pending state

### As a festival goer, I want to modify or cancel my pending order

Rules:
- An "Edit Order" button is shown on the Order Status page when the order is in Pending state
- Clicking it opens the cart pre-populated with the current order items
- The same cart and balance-check rules apply during modification
- A "Cancel Order" button shows a confirmation dialog before cancellation
- After successful cancellation, a success banner appears and the token balance is updated

### As a group of festival goers, I want to participate in a pooled group order

Rules:
- A "Join Group Order" entry on the Order page allows entering a group order code
- The festival goer selects the number of drink tokens and food tokens to contribute (up to their available balance)
- A summary screen shows total pooled tokens, remaining cost, and each contributor's share
- Submitting the group contribution redirects to the Order Status page

### As a festival goer, I want to transfer tokens to another festival goer

Rules:
- A "Transfer Tokens" page lets the festival goer enter the recipient's ID
- Up to 3 drink tokens and up to 3 food tokens can be transferred per transaction
- Token selectors respect the available balance and the 3-token maximum per type
- A confirmation step shows source, destination, and amounts before submitting
- A success notification appears after confirmed transfer and the balance on the home page updates

### As a festival goer, I want to receive hydration reminder notifications in the web app

Rules:
- A banner notification appears in the app reminding the festival goer to drink water
- The message is friendly and encourages responsible drinking
- The banner auto-dismisses after 30 seconds but can be dismissed manually
- Hydration reminders appear every hour between 11:00 AM and 7:00 PM
- If the festival goer has placed more than 3 alcoholic drink orders in the past hour, reminders appear every 30 minutes
- A notification history page shows past reminders
