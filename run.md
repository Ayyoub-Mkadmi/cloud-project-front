# Frontend (set production backend URL at build time)
cd cloud-project-front
docker build -t cloud-frontend:latest --build-arg VITE_API_URL=http://<EC2_PUBLIC_IP>:4000 .


docker run -d --name cloud-frontend \
  -p 80:80 \
  <account-id>.dkr.ecr.us-east-1.amazonaws.com/cloud-frontend:latest