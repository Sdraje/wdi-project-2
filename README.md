#Eventi
##GA WDI22 -London - Project_2
###A map for events around London.
![](./public/images/logo.png)
Eventi is a map that shows the location of the users and let's them choose a category (or all categories) of events around London, which then it'll be displayed on the map on the form of markers with different icons, based on the category chosen.
The user, in order to use the app, has to register and/or login. Tokens of 24 hours are stored in the local storage of the user, allowing quick access to the app on the next visit.
The app also allows the user to browse all the results from the chosen category (or all categories) in a list on the side of the screen, accesible through the navbar, in the form of a "burger" button.

#####[Try it here!](https://eventi-map.herokuapp.com/ "Here!")

###The interface
![](http://i.imgur.com/uNUCLXn.jpg)
A minimalistic approach has been used to guide the user visually with nowadays standardized interface and images.

###The build
* HTML5, SCSS, Bootstrap, jQuery and Javascript ES6 were used to create and style this app.
* Google Maps API and Skiddle API were used to create and populate the map.
* Node packages used were gulp, gulp-babel, gulp-bower, gulp-nodemon and many more.
* The back-end has been built on a foundation of node, express and mongo.

###Highs and lows
To make a request promise to the Skiddle API and create locally a database was very challenging, but it paid off in the long run.
The app is still riddled with bugs, unseen by the users, which will be fixed in future updates.
The biggest accomplishment was certainly the look I gave the project, reflecting my initial idea.