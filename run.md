# Frontend (set production backend URL at build time)
cd cloud-project-front
docker build -t arfaoui131/cloud-frontend:latest --build-arg VITE_API_URL=http://project-load-balancer-767625427.us-east-1.elb.amazonaws.com:3000 .
docker push arfaoui131/cloud-frontend:latest


docker run -d --name cloud-frontend \ -p 80:80 \
  
  arfaoui131/cloud-frontend:latest