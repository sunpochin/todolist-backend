# todolist-backend
master branch status:
[![CircleCI](https://circleci.com/gh/sunpochin/backend.svg?style=svg)]

personal dev branch status:
[![CircleCI](https://circleci.com/gh/sunpochin/backend/tree/pochin-branch.svg?style=svg)]

todolist backend

# To start mongo in docker.

##
### :docker pull mongo
### docker run -p 80:80 -p 27017:27017 mongo &

docker run --name pacmongo -p 80:80 -p 27017:27017 mongo --dbpath /srv/mongodb/db0 --replSet rs0 --bind_ip localhost &
https://stackoverflow.com/questions/37644465/how-to-connect-to-mongodb-running-in-docker-container
