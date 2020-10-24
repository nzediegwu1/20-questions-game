# 20 Questions Game

An open source web game where users play the 20 Questions game online.

## Table of Contents

    1. Features
    2. Technologies
    3. Project Setup

## Features
  #### Users can perform the following actions with this application
    
      - Signup
      - Login
      - Invite a User to Play
      - Accept an Invite to Play
      - Play the Game
  
## Some Technologies Used
    1. Vue.js
    2. Vue-CLI
    3. Node.js/Express
    4. Bootstrap CSS Library
    5. Bootstrap-vue - Bootstrap styled components for Vuejs
    6. Socket.io - For Real time Communication
    7. Fontawesome icons
    8. Babel
    9. JWT - For Authentication
    10. Axios - For HTTP requests
    11. MongoDB with Mongoose for Data storage
    12. Volleyball - For logging



## Project setup

- In project root, create a `.env` file and copy variables from `.env.sample` file into it
- Use a different `JWT_SECRET` value in your new `.env` file
- Create a `.env` file inside `client` folder and copy variables from `client/.env.sample` file into it

## Using Docker
- Run command: `docker-compose up`

## For production
1. Build project: `yarn heroku-preinstall && yarn build`
2. Start app: `yarn start`

## Compiles and hot-reloads for development
#### Server
```
yarn dev
```
#### Client
```
cd client && yarn run serve
```



## Lints and fixes files in client
```
cd client && yarn run lint
```


## Limitations
1. Relies heavily on cookies, hence app might misbehave when running in incognito mode. This is because it tracks the users' online status. However incognito mode tries to shield you from being tracked online by other users. Best to play without incognito mode on your browser. (Sign out and Login again to fix)
2. UI design was done in a rush due to limited time. Could be improved to be better
3. Does not persist anything about the game played. In future, game wins will be persisted for ranking users.
4. Once a user reloads their browser while playing the game, the game terminates.
5. Game inputs are not validated due to time constraints

## Edge Cases Handled
1. I ensured that the online user list is real time and changes accordingly when a user logs out, login or closes their browser.
2. I ensured that when a logged in user opens multiple browser tabs, the online user list remains the same since the new connections are from same user.
3. To ensure a user can only play with one online user at a time. A user is required to logout from a previous browser, before they can sign-in to a new one.
4. When a user opens multiple game tabs, and then closes those tabs one after the other, the online user list remains unchanged until the last tab is closed, only then it is seen as the user went offline. The user is then removed from online user list
5. Once a user starts playing game, sending them invite becomes disabled
6. When a user invites a player, all their open game tabs receive the invite.
7. When a user logs out, all their open tabs automatically signs out.
8. The system prevents the questioner from cheating by ensuring they submit their word before the questions commence!
9. When a player starts to play, they are prevented from being able to send new invites to others
