---
title: "How I track my Poor Decisions™"
description: "Whats one more poor decision?"
publishDate: "2026-04-25"
tags: ["hobby","expense-tracker"]
---

When we were planning to move to Kakkanad after college, I was sitting with [sameem](https://www.linkedin.com/in/s-sameem) doing some serious adulting.

We were budgeting.

Projecting savings.

Feeling like finance gods.

“Bro we’re gonna save so much money. Why do people say adult life is hard? How do people even go broke?”

![minion confidence energy](https://media1.tenor.com/m/fcOoBXH-5dIAAAAC/laughing-laugh.gif)

---

### College Me vs Real Life Me

In college, life was simple.

* Hostel: ~₹5000
* Food: managed
* Extras: covered through freelance

Basically I was broke, but sustainably broke.

Fast forward 2.5 years…

Now I’m sitting here like:

**Where did my money go?**

By all our plans and investments, I should have been rich by now.

Instead:

![salary disappearing instantly](https://media1.tenor.com/m/nTPtMPXDMq4AAAAd/broke-paycheck.gif)

---

### The Real Problem

I always hated expense tracking apps.

Not because they’re bad.
Because I’m lazy.

* I forget to log
* Batch logging at night never happens
* Next day I pretend it never existed

Also most apps:

* Too complex
* Subscription for sync
* Mobile-first

I use my laptop way more than my phone. So half these apps were already dead to me.

---

### The One App That Actually Worked

I used Fi Money.

It had this super nice feature where you could just ask:

“How much did I spend on Swiggy?”

And it would just tell you.

No effort. No logging. Just vibes.

And obviously…

All good things come to an end.

Fi shut down this month.

![everything is fine fire meme](https://media1.tenor.com/m/ap0_neVrmigAAAAC/spongebob-internally-screaming-meme-spongebob-meme.gif)

Back to square one.

---

### Minimalism (aka Excuse to Not Install Apps)

I don’t like installing too many apps.

I like clean devices.

So that I can fill them with:

* unfinished video edits
* half-built projects
* random experiments

Like a normal person.

Google Sheets though… I love.

* opens in browser
* flexible
* no nonsense

So I decided:

“Okay, I’ll track everything in Google Sheets.”

Deleted all my expense apps.

Yes including this one:

[money manager](https://apps.apple.com/us/app/money-manager-expense-budget/id560481810)

It’s actually amazing. I just wasn’t.

---

### Attempt 1: Discipline

Tried logging manually.

Failed.

Tried logging at night.

Failed.

Tried “I’ll definitely do it tomorrow”.

Also failed.

---

### The Idea That Clicked

Today I was out with [melvin](https://www.linkedin.com/in/melvinthomasdev) and he showed me this app:

[syncspend](https://apps.apple.com/us/app/syncspend/id6759112033)

It syncs expenses to Notion. You log using iOS shortcuts.

That got me thinking.

This is actually nice.

But…

I use Obsidian. Not Notion.

I don’t want two brains.

---

### So I Did What Any Lazy Developer Would Do

I asked ChatGPT.

Instead of Googling.

And it said:

> just use Sheets + Shortcuts

And honestly… that was the correct answer.

---

### Building Poor Decisions™

It was Saturday.

I had no plans.

So I spent a couple of hours building this.

And boom.

My first version of an expense tracker:

**Poor Decisions™**

Because every month I keep asking:

**SALARY WHERE???**

![salary goes brrr](https://media1.tenor.com/m/YRN2wqWPE1kAAAAd/hayato-yuzuki-money-goes-bye-bye.gif)

---

## How It Works

### 1. Google Sheets

This part was actually easy.

Google Apps Script is insanely powerful.

* can modify sheets
* can act like an API
* can respond to requests

Perfect for this use case.

I used ChatGPT to generate most of the script.

Did I review it properly?

No.

I also added a small setup wizard:

* select currency
* basic config

Done.

---

### 2. iOS Shortcuts

This is where the magic happens.

Shortcut flow:

* Ask for amount
* Ask for category
* Optional note
* Send to Apps Script endpoint

And that’s it.

Tap → log → done.

No friction. No excuses.

---

## Why This Actually Works

Because it removes the biggest problem:

**effort**

* No app switching
* No manual opening
* No “I’ll do it later”

Just log it instantly.

---

## Future Plans

I already have ideas:

* auto categorisation
* monthly summaries
* charts that make me feel bad
* maybe AI queries like Fi had
* split expenses with friends

If you have ideas, send them.

---

You can check it out here:
👉 [⁠Poor Decisions™](https://baliga.dev/poor-decisions)

![it aint much, but its honest work](https://media1.tenor.com/m/gsh9RrFHrKgAAAAC/it-ain%27t-much.gif)
