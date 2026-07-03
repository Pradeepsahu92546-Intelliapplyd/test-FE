
----- local ---
How to run Simulysis App In you device
Step - 1 : dependency installation 
npm install --legacy-peer-deps

Step -2 : browser/animation manual installation in project root 
npm install @angular/animations@20.3.16 --legacy-peer-deps

step -3 : Run the app 
ng serve



--- k8s----
Deploy to Kubernetes


1-	Generate package-lock.json (required for Docker build) => 
npm install

2-	Build the image (must be done before K8s deploy)  => 
docker build -f docker/Dockerfile -t angular-app:latest .


3-	Apply environment config (API URL)  => 
kubectl apply -f k8s/configmap.yml


4-	Deploy the Angular app (2 replicas)  => 
kubectl apply -f k8s/deployment.yml

5-	Create the internal ClusterIP service  => 
kubectl apply -f k8s/service.yml


6-	Create the ingress rule  => 
kubectl apply -f k8s/ingress.yml


7-	Forward port to access the app  => 
kubectl port-forward service/angular-service 4200:80

