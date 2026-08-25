# AlgoReady



A React Native mobile app for tracking and organizing coding interview / algorithm practice, built with Expo Snack.



## Overview



AlgoReady helps users prepare for coding interviews by giving them a way to log solved problems, search and filter by topic or difficulty, track progress over time, and bookmark problems to revisit later - all in one mobile app.



## Features







Log solved problems - record problems as you work through them



Search & filter - find problems by topic (e.g. arrays, graphs, DP) or difficulty level



Progress stats dashboard - view streaks, solve counts, and overall progress at a glance



Bookmarks - save problems to revisit later



Local persistence - all data saved on-device using AsyncStorage, so progress isn't lost between sessions



## Tech Stack





Framework: React Native (via Expo Snack)



Storage: AsyncStorage (local on-device persistence)



Language: JavaScript



## How to Run





Open the project in Expo Snack (or clone the repo and run locally with Expo CLI) or download the zip file in Releases and extract it and open it in Expo Snack website.



Scan the QR code with the Expo Go app on your phone, or run in the web/simulator preview.

## Screenshots

<img width="175" height="399" alt="image" src="https://github.com/user-attachments/assets/fb616a63-de69-468a-9c9e-175c8a5e4ff2" />

---------------------------------------------------------------------------------------------------------------------------------------------

<img width="182" height="395" alt="image" src="https://github.com/user-attachments/assets/4895c153-b73e-41ec-9e9b-51e122b6a984" />

---------------------------------------------------------------------------------------------------------------------------------------------

<img width="177" height="395" alt="image" src="https://github.com/user-attachments/assets/0d88d88d-2f04-4057-aae5-1e3e8d052deb" />

---------------------------------------------------------------------------------------------------------------------------------------------

<img width="182" height="396" alt="image" src="https://github.com/user-attachments/assets/47e4c378-7e65-417a-af9d-b51ccddf53d2" />

## Notes

Why this exists: Platforms like LeetCode provide the problems, but lack a dedicated way to organize interview prep - filtering by company, tracking difficulty and progress, and revisiting problems quickly before an interview. AlgoReady fills that gap: a lightweight companion app to log, filter, and track problems by company association and difficulty rating, with a stats dashboard and quick-revision bookmarking, so prep stays organized instead of scattered across tabs and spreadsheets.

Future improvements could include cloud sync across devices, smarter revision scheduling (e.g. spaced repetition for bookmarked problems), and direct integration with LeetCode's API to auto-pull problem metadata instead of manual entry.


No backend setup required - all data is stored locally on-device via AsyncStorage.
