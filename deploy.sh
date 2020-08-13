docker build -t pyrobot .
docker stop pyrobot
docker rm pyrobot
docker run -d -p 3000:3000 --name pyrobot pyrobot