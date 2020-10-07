docker build -t pyrobot .
docker stop pyrobot || true
docker rm pyrobot || true
docker run -d --net=host --name pyrobot -e DEBUG=pyrobot:*  pyrobot
