# Little Lemon

A React Native food ordering app built with Expo for the Meta React Native Capstone. It runs on Android and iOS with Expo Go.

## Run the app

Install [Node.js](https://nodejs.org/) and [Expo Go](https://expo.dev/go), then run these commands from the project directory:

```bash
npm install
npx expo start
```

Scan the QR code in Expo Go on Android. On iOS, scan it with the Camera app and open the link in Expo Go. Keep the computer and phone on the same Wi-Fi network. Press `a` in the Expo terminal to open an Android emulator when Android Studio is installed. An iOS simulator requires macOS; Expo Go on a physical iPhone works with this project.

For a browser preview, run `npm run web`. The Metro configuration includes the WASM support and isolation headers needed by Expo SQLite on web. A browser preview does not replace testing on Android or iOS before submission.

## What is included

- First-launch onboarding with required first name, last name and email fields.
- Home screen with the restaurant introduction, menu search, category filters and food cards.
- Menu data fetched from the course API and cached in the `menu` table in `little_lemon.db`. The cached menu is used on later launches; a bundled five-dish menu is saved if the first network request cannot complete.
- Profile editing and notification preferences saved locally in SQLite across app restarts.
- A slide-out navigation drawer, stack-based screen transitions and a log-out action that clears the saved profile.
- The capstone wireframe in [`design/wireframe.jpg`](design/wireframe.jpg).

The public menu API is maintained by Meta Mobile Developer: `https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json`.

The course logo and hero photo are bundled in `assets/`. The dessert thumbnail is bundled from the course API's image repository because its menu response references a missing filename; the actual image is named `lemonDessert 2.jpg`.

## Project notes

Expo Router supplies file-based navigation. The `home`, `profile`, and `onboarding` screens live in `src/app/`; shared UI, SQLite access, menu parsing and the theme live alongside them in `src/`. Logging out clears the saved profile and removes protected screens from navigation history. User details stay on the device. The app does not need a Little Lemon account or a backend login.

For peer review, share the GitHub repository URL and the wireframe in `design/wireframe.jpg`. Lint, TypeScript checks, Android/iOS bundle exports, and browser flows have been verified; testing on an Android or iOS device is still required before submission.
