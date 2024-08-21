# Im gonna use firebase for authentication

# Create 2 firebase projects for development and production

# Click authentication on the left side bar to enable authentication method - in my case just email and password

# Do the exact same thing for the production project but REMOVE THE LOCALHOST from the authorized domain because we dont want people to build accesses through localhost


# now go back to development version and get all the api keys and paste it in the .env file

# Overview -> </> Web -> Name of the app (StokeManageCalendar-Dev), you can skip register Firebase Hosting -> Register app -> copy the config object and paste it in the .env.local file

# install npm i firebase

# create a firebase.js file:

# import firebase from 'firebase/app'
# import 'firebase/auth'