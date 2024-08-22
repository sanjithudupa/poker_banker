# Poker Banker
This is just a React Vite Typescript SPA with static routing.

The banker allows for any number of players with unliimited custom amount buy ins and will calculate the best scheme for paying each player back to minimize the total # of transactions.

All the interesting logic is contained in `src/pages/Banker.tsx` and the `calculatePayouts` method is the part that calculates how much each player gets.

## How Payouts are Calculated
First, players are split into two sorted lists of `profits` and `losses` indicating whether or not a player lost money.

Then the lists are worked through independently in an effective two pointer algorithm matching each next highest loss with the next highest profit, and then adjusting for differences between the two.

This results in a very fast means of calculating the fewest number of transactions needed. 
