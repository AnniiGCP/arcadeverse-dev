export interface UpdateItem {
  id: number;
  title: string;
  author?: string;
  date: string;
  category: "announcement" | "update" | "news" | "Google Skills Arcade";
  image: string;
  description: string;
  fullContent: string;
  sourceUrl?: string;
  attribution?: string;
}

export const updatesData: UpdateItem[] = [
  {
    id: 13,
    title: "Swag Drop: The Arcade Magic Mug",
    author: "Yugali",
    date: "October 23, 2026",
    category: "Google Skills Arcade",
    image: "/images/updates/arcade-magic-mug.gif",
    description:
      "Google Skills Arcade revealed the latest swag drop for 2026: The Arcade Magic Mug, added into the Arcade Trooper and Ranger Tiers—a heat-activated ceramic mug with hidden arcade designs that bleed into life when filled with hot beverages.",
    fullContent: `Picture this:

It’s 7:00 AM on a crisp morning. You pad into the kitchen, wrapped in your favorite hoodie, watching the steam rise off a freshly brewed pour-over. You wrap your hands around a warm, perfectly weighted mug—the kind that just feels right the second you pick it up—and take that first, long sip. Everything is quiet, calm, and set up for a great day ahead.

That’s the exact vibe we wanted to bottle up with the Arcade Magic Mug. But we didn’t want to stop at just making a good-looking daily driver.

Here’s the MAGIC: When you pull it off the shelf, it’s a clean, minimal white mug. But the second you pour your hot coffee or tea in? Watch what happens. The hidden arcade design literally bleeds into life right before your eyes the moment heat hits it.

Aside from the magic trick, it’s got that solid, satisfying weight in your hand, a sleek aesthetic that actually looks great on your desk, and it’s eco-friendly so you can sip sustainably every single day.

It’s live right now in the Arcade Trooper and Arcade Ranger Tiers. Keep stacking those Arcade Points and go claim the gear that matches your momentum!

See you in the Cloud!`,
    sourceUrl:
      "https://discuss.google.dev/t/swag-drop-the-arcade-magic-mug/407455",
    attribution: "Google Developer forums",
  },
  {
    id: 12,
    title: "Swag Drop: The Arcade Travel Bottle",
    author: "Yugali",
    date: "October 16, 2026",
    category: "Google Skills Arcade",
    image: "/images/updates/arcade-travel-bottle.gif",
    description:
      "Google Skills Arcade announced the latest swag drop for 2026: The Arcade Travel Bottle, added into the Arcade Trooper and Ranger Tiers—a slim, packable stainless steel bottle designed for zero leaks and all-day temperature control.",
    fullContent: `If you’ve spent any time working from an airport gate, a crowded coffee shop, or your morning commute, you already know the pain: you’re trying to grab a quick sip of water or coffee, only to realize your bottle is leaking all over your backpack, or it’s bulky and awkward to carry around.

For our latest swag drop, we’re fixing that headache completely with the Arcade Travel Bottle.

Think of it as the ultimate hydration sidekick for anyone who lives out of a laptop bag or on the move. Placed in the Arcade Trooper and Ranger Tiers, here is why you will actually want this in your bag:
• Slim, packable shape: Features a sleek 5.5 cm profile that slides right into backpack side pockets or car cup holders without taking up a ton of space.
• Durable stainless steel: Made with lightweight steel that can take a beating during your daily commute without adding heavy bulk.
• Zero leaks: Solid sealing rings keep your drink locked down tight, even if your bag ends up sideways on the floor.
• Hot and cold ready: Keeps your morning brew hot or your afternoon water ice-cold for hours on end.
• Quick to wash: Comes with a wide mouth so you can actually clean it out fast instead of making a chore out of it.

Every challenge you wrap up and badge you collect right now counts toward locking down this gear!

See You In The Cloud!`,
    sourceUrl:
      "https://discuss.google.dev/t/swag-drop-the-arcade-travel-bottle/405316",
    attribution: "Google Developer forums",
  },
  {
    id: 11,
    title: "Swag Drop: The Arcade PopUp Pro",
    author: "Yugali",
    date: "October 12, 2026",
    category: "Google Skills Arcade",
    image: "/images/updates/arcade-popup-pro.gif",
    description:
      "For our third swag drop of 2026, Google Skills Arcade revealed the all-new Arcade PopUp Pro added into Champion and Legend Tiers—an all-in-one pocket toolkit featuring fast-charging adapters, phone stand, and travel storage.",
    fullContent: `If you’ve spent any time working from an airport gate, a crowded coffee shop, or your morning commute, you already know the pain: you need one specific cable, and it’s either buried at the bottom of your bag or sitting on your desk at home.

For our third swag drop of 2026, we’re fixing that headache completely with the Arcade PopUp Pro.

Think of it as the ultimate pocket toolkit for anyone who lives out of a laptop bag. Added into the Champion and Legend Tiers, here is why you’ll want this in your everyday carry:
• Every connector you actually need: A tough braided USB-C to USB-C fast-charging cable, plus swappable adapters for Lightning, Micro-USB, and USB-A. Whatever port you run into, you’re covered.
• Fidget-friendly click: It opens with a spring-loaded pop that is honestly just fun to click open and shut while you’re thinking through a problem.
• Built-in phone stand: Pops open to hold your phone upright or sideways, so you can prop it up next to your monitor or watch something hands-free on a flight.
• The little things you always lose: Built-in slots for a spare Nano SIM and Micro SD card, plus an ejector pin right where you can find it when you travel.
• Zero bulk: It’s barely an inch thick, weighs next to nothing, and has a sturdy little braided loop so you can clip it to your pack or slide it into your pocket.

Every challenge you wrap up and badge you collect right now counts toward locking down this gear. Keep that momentum going!

See You In The Cloud!`,
    sourceUrl:
      "https://discuss.google.dev/t/swag-drop-the-arcade-popup-pro/403522",
    attribution: "Google Developer forums",
  },
  {
    id: 10,
    title: "Riding the Waterfall in the Cloud!",
    author: "Yugali",
    date: "October 8, 2026",
    category: "Google Skills Arcade",
    image: "/images/updates/riding-the-waterfall.jpeg",
    description:
      "Clear up the confusion around the Waterfall System, tier limits, tie-breakers down to the millisecond, and how spot eligibility works as the 2026 Google Skills Arcade Prize Tiers fill up.",
    fullContent: `Hey everyone,

We see you! The hustle across the 2026 Google Skills Arcade season right now is unbelievable. Challenges and games are getting knocked out, badges are rolling in, and the Prize Tiers numbers are moving fast.

With all that excitement—and with the Arcade Facilitator Program 2026 adding some massive point bumps lately—we’ve noticed a lot of you keeping an anxious eye on the tier counters. Questions have been popping up in the community: “How do ties get broken?” “Am I losing my spot?” “Why are numbers jumping so fast?”

Take a breath! Let’s clear up the confusion, walk through how the Waterfall System actually works behind the scenes, and take the stress off your shoulders.

The Waterfall Safety Net:
As a quick reminder, here is the capacity breakdown for each tier this year:
• Arcade Legend (120+ Points): First 2,500 players
• Arcade Champion (95–119 Points): First 3,000 players
• Arcade Ranger (75–94 Points): First 4,000 players
• Arcade Trooper (50–74 Points): First 6,000 players

Here is the most important thing to know about the Waterfall System: your hard work never goes to waste. If you push hard for Legend, reach the milestone, but the 2,500 cap was already filled right before you, you don’t walk away empty-handed. You automatically slide right down to the very front of the line for Champion. If Champion is already filled, you roll down to Ranger, and so on.

It’s built from the ground up as a safety cushion so you are always rewarded for what you earned.

“Is it first-to-cross, or a final leaderboard rank?”
A lot of you have asked if the 2,500 Legend spots go to the people who cross the finish line first, or if we wait until the end of the year to see who racked up the most points overall. It’s strictly first-come, first-served as you hit the milestone. We aren’t holding spots hostage until the end of Google Skills Arcade 2026 to see who can hoard points. The moment your account hits the required point threshold while a tier still has open seats, that spot is locked in for you.

“The Facilitator Program is wrapped—when do bonus points drop, and how do ties work?”
Congrats on crossing the finish line! All validated Arcade Facilitator Program points will officially show up in your next Arcade Insider email.

Worried about thousands of points landing at once? Here’s how it works:
• Timestamp is king: Spot eligibility is locked to the exact system timestamp of when your milestone tasks were completed and verified—not who checks their score first.
• Fair tie-breakers: If multiple learners hit a tier threshold during the update, ties are broken chronologically down to the millisecond of completion.
• Universal rule: This same logic applies across every single tier, from Legend to Trooper.

“Why are the tiers filling so quickly?”
Seeing the Prize Tiers tick down can feel intimidating, but there are two very simple reasons for the speed:
1. Arcade Facilitator Program: With the Facilitator Program officially behind us, milestone points were credited in large batches, which is why you saw the tracker jump so fast.
2. You all started early! Having the blueprint from day one motivated everyone to jump in!

Don’t let the Prize Tiers shake your confidence. When we set these caps, we made sure the numbers were significantly higher than the total prizes people actually claimed last season. If you keep a steady pace, there is plenty of room for you to claim great rewards.

“How do I secure my spot? Which tier am I in?”
• Your tier is simply your points: Got 80 points right now? You’re in the Ranger pool (75–94 points). Just to clear this up: if you stop at this tier, you’re guaranteed to walk away with the prizes in the Ranger Tier.
• Keep tabs on yourself: Keep an eye out for your monthly Arcade Insider emails to verify your tally.

At the end of the day, this journey is about your growth in the cloud. Don’t stress the Prize Tiers, lean on your peers, and keep learning at a pace that works for you. You’ve got this, and we can’t wait to celebrate with you at the Prize Counter!

See you in the Cloud!`,
    sourceUrl:
      "https://discuss.google.dev/t/riding-the-waterfall-in-the-cloud/402709",
    attribution: "Google Developer forums",
  },
  {
    id: 9,
    title: "Swag Drop: The Arcade Backpack",
    author: "Yugali",
    date: "September 24, 2026",
    category: "Google Skills Arcade",
    image: "/images/updates/arcade-backpack.gif",
    description:
      "For our next 2026 swag drop, Google Skills Arcade revealed the all-new Arcade Backpack unlocked at the Ranger Tier, featuring water-resistant polyester, padded laptop protection, and breathable comfort for everyday carry.",
    fullContent: `We’ve all had that moment: you step outside after a productive day of building, feel those first surprise raindrops, and instantly glance down at your backpack thinking, “Please tell me that fabric is thicker than it looks.”

When your laptop holds your work, your projects, and your best ideas, peace of mind matters. That’s why for our next swag drop, we designed a companion that’s as dependable as the infrastructure you build on: The Arcade Backpack.

Available right at the Ranger Tier, here is why this thoughtfully designed pack is ready to become your favorite everyday carry:
• Ready for unexpected weather: Crafted from water-resistant polyester, giving you real reassurance when a sunny afternoon turns into a drizzly commute.
• Cushioned care for your laptop: Features two main zip compartments, including a dedicated, generously padded sleeve to keep laptops up to 15 inches safe and snug.
• All-day breathable comfort: Padded, ergonomic shoulder straps paired with a ventilated mesh back panel keep air flowing naturally so your commute feels effortless.
• Room for the Daily Grind: Sized just right for daily carry, it offers plenty of room to stash your everyday essentials, tech gear, and notebooks, alongside an exterior zippered pocket for quick, on-the-go access.
• Smart, understated design: Finished in a clean black-and-grey color blocked palette with subtle Google Cloud branding that transitions seamlessly from campus to the office.

Each completed challenge moves you closer to the Ranger Tier. Stay curious, keep racking up badges, and we’ll celebrate the win together!

See You In The Cloud!`,
    sourceUrl:
      "https://discuss.google.dev/t/swag-drop-the-arcade-backpack/399232",
    attribution: "Google Developer forums",
  },
  {
    id: 1,
    title: "Swag Drop: The Arcade Weather-Shield Jacket",
    author: "Yugali",
    date: "September 15, 2026",
    category: "Google Skills Arcade",
    image: "/images/updates/weather-shield-jacket.gif",
    description:
      "To kick off the very first swag drop of 2026, Google Skills Arcade revealed the all-new Arcade Weather-Shield Jacket unlocked in Champion and Legend Tiers, along with an explanation of how Prize Tier rewards accumulate.",
    fullContent: `If you climbed all the way to the Legend Tier, you didn’t do it by waiting for perfect conditions—you built through the storm.

To kick off the very first swag drop of 2026, we’re outfitting you with the ultimate barrier against the elements: The Arcade Weather-Shield Jacket. Throw it on for your morning commute or wear it to work—either way, it’s a flex you actually had to earn.

Placed in the Champion and Legend Tier, here’s why it belongs in your rotation:
• Storm-ready weave: Repels light rain and shuts down gusting winds before they hit your layer.
• Official branding: Clean Google Cloud logo on the left chest paired with the super cloud logo on the sleeve.
• Total draft block: High stand-up collar, custom Velcro cuffs, and a ribbed elastic hem lock warmth in and the weather out.
• Secure cargo: Deep zippered hand-warmer pockets keep your phone, keys, and hands safe from cold snaps.
• Weightless mobility: Technical performance without the heavy winter bulk—made to keep you moving.

Don’t leave this sitting on the table because it is built for whatever the forecast throws at your deploy!

How the Prize Tiers Work:
Think of the tier progression like a “Snowball”. You never have to pick and choose between tiers when you rank up; your rewards just keep rolling forward and getting bigger:
• Arcade Trooper Tier: This is your foundational milestone. Once you hit this points threshold, you unlock the core swag pack filled with essential Google Skills Arcade gear.
• Arcade Ranger Tier: The natural next step for participants pushing past the basics. Designed for players who stay consistent, bank more Arcade Points, and put in that extra effort across challenges—unlocking everything from the Trooper Tier plus an additional bonus reward on top.
• Arcade Champion Tier: A major leap into the upper ranks. Hitting Champion takes serious dedication, unlocking a high-tier collection of premium Google Skills Arcade gear that really stands out.
• Arcade Legend Tier: The absolute summit of the Google Skills Arcade. Reserved exclusively for learners who max out their points to finish at the very top, scoring everything from the Champion Tier plus an exclusive Legend-only reward.

In simple terms, you never miss out when you rank up. Reaching Arcade Ranger Tier gives you all the Arcade Trooper Tier swags plus extra gear, and reaching the Arcade Legend Tier gives you the complete Arcade Champion Tier pack plus exclusive rewards waiting at the very top.

Please note: Arcade Trooper and Arcade Ranger prizes won’t snowball into the Arcade Champion and Arcade Legend Tiers.

Every single badge and point you bank right now isn’t just getting you closer to the jacket—it’s building up the whole pile of gear waiting for you on the other side. The clock’s ticking, the next challenge is waiting, and that Arcade Legend spot won’t claim itself!

See You In The Cloud!`,
    sourceUrl:
      "https://discuss.google.dev/t/swag-drop-the-arcade-weather-shield-jacket/397353",
    attribution: "Google Developer forums",
  },
  {
    id: 2,
    title: "Behind the scenes? Not anymore",
    author: "Yugali",
    date: "September 7, 2026",
    category: "Google Skills Arcade",
    image: "/images/updates/behind-the-scenes.gif",
    description:
      "We know you’ve been eyeing that blank prize counter and wondering what’s taking shape behind the scenes. The wait is over: The Arcade Swag Drops are starting soon!",
    fullContent: `We know you’ve been eyeing that blank prize counter and wondering what’s taking shape behind the scenes.

We’ve kept things quiet long enough, but the wait is over: The Arcade Swag Drops are starting soon!

If you haven’t experienced a Swag Drop before, this is the ritual where we pull back the curtain on the gear, apparel, and collectibles lined up for the Arcade Points you’ve been banking.

Think of this as your scouting window. You get to size up the entire lineup, compare notes with friends, and dial in your wishlist when the Prize Counter actually opens.

Keep your eyes on the feed—the first drop lands sooner than you think!

Before we pull the cover off item number one: what’s the one piece you’re hoping makes an appearance this time? Drop your picks in the community discussions!

See you in the Cloud!`,
    sourceUrl:
      "https://discuss.google.dev/t/behind-the-scenes-not-anymore/395104",
    attribution: "Google Developer forums",
  },
  {
    id: 3,
    title: "Leaving 10 Bonus Arcade Points Behind? Let’s Fix That Today",
    author: "Yugali",
    date: "August 28, 2026",
    category: "Google Skills Arcade",
    image: "/images/updates/bonus-milestone-nudge.gif",
    description:
      "More than 650 learners have already built their AI agents and completed the Bonus Milestone. Don’t leave 10 Bonus Arcade Points behind before the September 13 deadline.",
    fullContent: `The Arcade Facilitator Program 2026 has been an incredible journey so far, and seeing the dedication across our community has been inspiring.

However, if you want to give your final standing a serious boost, there is one critical step you need to take right now: Completing the Arcade Facilitator 2026 Bonus Milestone before September 13th, 2026.

Over 650 Learners Are Already Ahead!
The momentum is building fast. More than 650 learners have already built their AI agents and successfully checked off the Bonus Milestone.

By completing this milestone, these participants haven’t just earned hands-on experience with the Gemini Enterprise Agent Ready (GEAR) framework—they have also secured their eligibility to receive 10 Bonus Arcade Points after the Facilitator Program 2026 ends.

Having those extra 10 Bonus Arcade Points credited to your account can completely change your final placement, giving you a huge advantage when the tally is finalized.

Keep an Eye On The Google Skills Arcade Page:
If you haven’t checked the Google Skills Arcade page recently, now is a great time to take a look. Make sure to keep an eye out on the Arcade Prize Tiers listed on the page. The competition for the top prize tiers is friendly, but it is moving quickly. Every single Arcade Point matters when it comes to qualifying for the highest rewards, and missing out on the bonus points could be the difference between landing in your dream tier or falling just short.

Ready to Complete Your Bonus Milestone?
If you haven’t started yet, don’t worry—the whole process takes less than a day to finish! Complete instructions are available in the Facilitator Bonus Milestone guide to build your agent today.

Don’t Wait Until the Last Minute:
If you have been holding off on the Bonus Milestone, treat this as your gentle nudge. Hurry up, complete your AI agent, and secure your spot in the top Arcade Prize Tiers. You have put in the work—now make sure you get the maximum reward for it!

See you in The Cloud!`,
    sourceUrl:
      "https://discuss.google.dev/t/leaving-10-bonus-arcade-points-behind-let-s-fix-that-today/392978",
    attribution: "Google Developer forums",
  },
  {
    id: 4,
    title: "Arcade Facilitator 2026 Bonus Milestone",
    author: "Yugali",
    date: "July 31, 2026",
    category: "Google Skills Arcade",
    image: "/images/updates/facilitator-bonus-agent.jpeg",
    description:
      "A practical project designed to take you from reading about AI to building and deploying a working AI Agent on Vertex AI, while earning 10 extra Bonus Arcade Points.",
    fullContent: `Remember the first time you tried to learn how to drive a car or ride a bike? You could read the manual ten times, memorize every traffic rule, and study the engine down to the last bolt. But real confidence only came the moment you finally sat in the driver’s seat, put your hands on the wheel, and took off.

Building tech skills works the exact same way.

Right now, everyone is talking about AI. But there is a huge difference between just typing prompts into a chatbot and actually sitting in the driver’s seat to build an entire AI system yourself.

The Arcade Facilitator 2026 Bonus Milestone is a quick, practical project designed to take you from reading about AI to actually building and deploying your very first working AI Agent on Google Cloud Vertex AI. Plus, completing it hands you an extra 10 Bonus Arcade Points, giving you a serious head start toward the Arcade Prize Tiers. And the best part? You can easily finish the whole thing in under a day.

Before You Begin (Quick Checklist):
Make sure you have checked off these three prerequisites so your points are credited properly:
1. You are officially enrolled in the Arcade Facilitator 2026 cohort.
2. You have earned both the GEAR Badge and the Arcade - GEAR Badge on your Google Developer Profile.
3. You have already unlocked Milestone #1 in the Facilitator Program 2026 to become eligible to participate.

How to Complete It in 4 Simple Steps:
1. Finish the 4 GEAR Skill Badges:
   • Create Your First Gemini Enterprise Application
   • Engineer AI Agents with ADK
   • Deploy Multi-Agent Architectures
   • Orchestrate Multi-agent Workflows
   (Completing these also counts toward your Google Skills Arcade milestones, giving you double the progress!)

2. Activate Your Google Cloud Free Trial:
   Sign up for the 90-day free trial ($300 in credits) using your enrolled email address. If you already have an active billing account linked to that email, you can skip this step. (Google Cloud will never automatically charge your card when the trial ends.)

3. Build Your First AI Agent:
   Follow the project instructions to build your agent on Vertex AI. Make sure to follow the final step to grant access permission to the verifier email address (arcade-agent-verifier@google.com) so your project can be validated.

4. Submit Your Verification Details:
   Fill out the verification form with two quick details from your Google Cloud Console:
   • Your unique Project ID
   • Your unique 18-character Billing Account ID

That is literally all it takes to lock in your 10 extra points. Take it one step at a time, start with this milestone, and build something amazing today.

See you in the Cloud!`,
    sourceUrl:
      "https://discuss.google.dev/t/arcade-facilitator-2026-bonus-milestone/386412",
    attribution: "Google Developer forums",
  },
  {
    id: 5,
    title: "Google Skills Arcade 2026 Tiers",
    author: "Yugali",
    date: "June 10, 2026",
    category: "Google Skills Arcade",
    image: "/images/updates/arcade-2026-tiers.png",
    description:
      "We are finally announcing the Google Skills Arcade 2026 prize tiers! Learn about the 4 major milestones, spot limits, and how the Waterfall System works.",
    fullContent: `Big news day! We are finally announcing the Google Skills Arcade 2026 prize tiers. We know how much thought and strategy you all put into building your skills and earning your badges, so we wanted to give you the exact blueprint early enough to plan your ultimate path to the top.

We want to make sure the rewards go exactly where they belong: to genuine learners putting in real effort on a level playing field. To do that, we’ve optimized our prize system with two major updates this season:
• Outgrowing the Training Wheels: The Novice tier has officially left the building! Since this is a full, year-long journey, none of you are going to stay a novice in the Cloud. You’re all leveling up way too fast, so we’re focusing all our rewards on the four major milestones below.
• Limited Spots (With Plenty of Room!): For the first time, we are putting a limit on how many people can get prizes in each tier. These new limits are much higher than the total amount of prizes people actually claimed last year. As long as you are playing fair, growing your cloud skills, and earning your badges, there is plenty of room for you to get your rewards!

The Arcade Prize Counter will operate on a strict first-come, first-served basis starting from the Legend Tier.

To make sure your hard work is rewarded, we are using a “Waterfall System” for prize distribution. If a tier’s prize pool fills up before you can claim it, you don’t lose out—your eligibility safely rolls down to the next tier below.

The 2026 Arcade Tier Breakdown:
• Arcade Legend Tier (120+ Arcade Points):
  The very first 2,500 players to reach this tier get Legend prizes. Once these 2,500 spots are gone, anyone else with 120+ points automatically “waterfalls” down to the Champion Tier pool.
• Arcade Champion Tier (95–119 Arcade Points):
  The first 3,000 players to secure a spot (including those rolling down from the Legend Tier) get Arcade Champion prizes. If this fills up, remaining players roll down to the Ranger Tier.
• Arcade Ranger Tier (75–94 Arcade Points):
  The first 4,000 players to secure a spot (including those rolling down from higher tiers) get Arcade Ranger prizes. If this fills up, remaining players roll down to the Trooper Tier.
• Arcade Trooper Tier (50–74 Arcade Points):
  The first 6,000 players to reach or roll down to this tier will get Arcade Trooper prizes.

The Story Behind the Changes:
• Faster Deliveries: Knowing order quantities ahead of time allows pre-ordering prizes to fast-track shipment. Rebuilding the backend shipping pipeline eliminates bottlenecks so rewards arrive quicker.
• Total Fairness: New guardrails protect rewards against hoarders for real learners.
• A Year-Long Marathon: With the season spanning the entire year, point milestones are built for a steady, long-term journey.

How to Track Your Arcade Points:
• Check Remaining Spots: A real-time tracker will be updated every week right on the Arcade Page.
• Keeping Score: Watch for the monthly Arcade Insider email showing your exact points total, or track where you stand using the Points System on the Arcade Page.
• Facilitator Program 2026: Lands on July 13, 2026!
• Prize Counter: Opens shortly after the 2026 season wraps up at the end of the year.

See you in the Cloud!`,
    sourceUrl:
      "https://discuss.google.dev/t/google-skills-arcade-2026-tiers/371066",
    attribution: "Google Developer forums",
  },
  {
    id: 6,
    title: "Clarification: Your 2026 Arcade Points & The Prize Counter",
    author: "Yugali",
    date: "April 15, 2026",
    category: "Google Skills Arcade",
    image: "/images/updates/points-prize-counter.gif",
    description:
      "Important answers regarding the shift to a single annual Prize Counter window, points protection, and backend logistical improvements for faster delivery.",
    fullContent: `TL;DR:
• Points are safe: All your points will be accounted for until the Prize Counter opens.
• One Window: Logistics for a global program mean a single, better-managed redemption period.
• Guaranteed Opening: The Prize Counter is 100% coming later this year.
• Faster Fulfillment: New logistical changes are coming to get your swag to you sooner.

Following our recent announcement about the shift to a single Prize Counter window, we’ve heard your questions and want to provide clear answers. We know how hard you’ve been working, and we want to ensure you feel confident about the path ahead.

Your Progress is Protected:
First and foremost: Every point you have earned so far in 2026 is safe. Whether you’ve been tackling challenges since January or just starting your first lab this week, your hard-earned points aren’t going anywhere. They will be fully counted toward the Prize Counter opening at the end of the year. While we are currently refining the new Prize Tier structure to better align with our extended 2026 season, rest assured that your current tally remains the foundation of your journey.

Navigating a Global Community:
The Google Skills Arcade is a global family. Sending swag to learners across every corner of the map is a massive undertaking. To ensure that every hoodie, bag, and gadget reaches you safely—no matter where in the world you are—we have made the strategic decision to move to a single, unified annual opening.

This change allows us to focus our resources on overcoming the logistical and shipping constraints that come with a program of this scale. It’s all about making sure the “win” you earn actually makes it to your door.

The Road Ahead:
We want to remove any doubt: The Arcade Prize Counter will absolutely open later in 2026. We are also implementing new changes to the Prize Counter specifically designed to shorten the wait period to receive your swag after you place your order. By streamlining our backend processes now, we can better handle global shipping constraints and get your rewards into your hands faster than before.

Thank you for your patience and for being the best part of this community. Now, back to the Google Skills Arcade games—those skills aren’t going to build themselves!

See you in the Cloud!`,
    sourceUrl:
      "https://discuss.google.dev/t/clarification-your-2026-arcade-points-the-prize-counter/349716",
    attribution: "Google Developer forums",
  },
  {
    id: 7,
    title: "Welcome (Back) to the Google Skills Arcade!",
    author: "Yugali",
    date: "January 6, 2026",
    category: "Google Skills Arcade",
    image: "/images/updates/welcome-back-arcade.gif",
    description:
      "Google Skills Arcade 2026 has arrived with an exciting lineup of challenges to make your cloud learning journey more engaging, hands-on, and rewarding!",
    fullContent: `We hope you had a wonderful experience at the Google Skills Arcade 2025. But it’s time once again to challenge yourself and grow your skills in the cloud!

Google Skills Arcade 2026 has arrived, bringing an exciting lineup of challenges to make your learning journey more engaging, hands-on, and rewarding!

One of our players put it best:
“I landed my first internship as a Cloud Engineer, and it’s all thanks to what I learned here in the Google Skills Arcade. All the skills I gained have helped me immensely to kick-start my career, and I would say that’s something no other swag can beat” — Deepanshu Pathak

Stories like this are exactly why the Google Skills Arcade exists—to help you turn hands-on learning into real opportunities in the cloud.

Why should you be a part of Google Skills Arcade 2026?
• Cloud is growing, and so are the opportunities: The global cloud computing market is expected to grow to over USD 2.2 trillion by 2030, driven by AI, data, and digital transformation across sectors like healthcare, finance, and retail. As Google Cloud continues to expand, skills on this platform become even more valuable for professionals.
• A growing demand for cloud skills: Cloud roles are among the fastest-growing in tech, with millions of new jobs anticipated over the next few years in cloud engineering, data, security, and AI. Skills Arcade challenges give you a practical, hands-on way to build in-demand skills.
• Google Cloud certifications can open new doors: Google Cloud Certifications are widely respected and can significantly strengthen your profile with employers. Participating in Skills Arcade 2026 helps build the foundation toward certifications like Professional Cloud Architect or Professional Data Engineer.
• Google Cloud powers real businesses at scale: Over a million companies around the world rely on Google Cloud to build, innovate, and scale. By joining Skills Arcade 2026, you’ll gain real-world skills on the same platform these organizations use every day.

There’s no better time to level up your cloud skills. Join us for an exciting year at Google Skills Arcade 2026 and explore challenges that will help you grow, learn, and achieve more.

To get started, visit the Google Skills Arcade page and subscribe. Review the subscription form, get familiar with the rules, and give the Google Skills Arcade Code of Conduct a quick read to help keep things awesome for everyone!

Welcome Back To The Cloud!`,
    sourceUrl:
      "https://discuss.google.dev/t/welcome-back-to-the-google-skills-arcade/317918",
    attribution: "Google Developer forums",
  },
  {
    id: 8,
    title: "The Arcade Hoodie is Finally Here! 🎉",
    author: "ArcadeVerse Team",
    date: "Oct 29, 2025",
    category: "announcement",
    image:
      "https://d2yds90mtvelsl.cloudfront.net/original/3X/0/5/058d6e068eadc5a39b824f0114ce452d9ddde625.gif",
    description:
      "You wanted it more than anything else this season - and it's finally here: The Arcade Hoodie! Complete October games, stack your points, and get closer to claiming your hoodie in the Champion and Legend Tiers.",
    fullContent: `You wanted it more than anything else this season - and it's finally here: The Arcade Hoodie, ready to add extra glow to your Skills Boost Arcade journey this Diwali!

Soft where it counts, tough where it needs to be. This navy blue pullover hoodie is cozy enough to keep you in the game-on mode all day.

Warm enough to beat a Monday. Cool enough to flex on a Friday - it's that kind of win you can actually wear!

Note: Product image is for reference only. Actual design may vary slightly.

October games are ending soon - complete them, stack your points, and get closer to claiming your Arcade Hoodie waiting in the Champion and Legend Tiers for players who've truly earned their shine.`,
    sourceUrl: "https://discuss.google.dev/",
    attribution: "Google Developer forums",
  },
];
