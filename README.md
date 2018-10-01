#Yancy Camp - Web Scraper
For anyone who wants to have a personal copy of the Yancy Camp workouts. This script will access as little or as many Yancy Camp workouts you wish to have. The workouts are output in both a .text and .pdf file.
This script was built to allow users access old/favorite Yancy Camp workouts when out travelling or off training and do not have access to wifi.

##Set Up
 - Clone this repo to your machine
 - run the command `npm install`
 - Open the **index.js** and adjust the following
   - `firstWorkout` to the first Yancy Camp workout you would like download
   - `lastWorkout` to the last Yancy Camp workout you would like to downoad
      - *note: the more workouts you select the longer the script takes to run*
   - change athleteFirst to the first name of your paired athlete, and athleteLast to the last name of your paired athlete, in the below URL (in the code there are two places to make this change) `http://www.yancycamp.com/athleteFirst-athleteLast/yancy-camp-workout-505/` 
   - change USERNAME to your username and PASSWORD to your password     `body: 'login_user_name=USERNAME&login_pwd=PASSWORD&Submit=doLogin'`
     - *note: you may have to change your password to remove special characters. **IMPORTANT** You are sending your password unencrypted across the internet!!! Please make sure this password you use is not used for other accounts you may have!!!*
 - Finally in your terminal run `node index` and allow the cript to run and the files will be created in your current directory.

