# api-ddc-helpdesk
Backend DDC-Helpdesk

# Install Project  
- Clone Project From Github
- Create .env file
```bash
sudo cp .env.example .env
```
# Create Images To Local
```bash
sudo docker build . -t helpdesk-api:v1  
```
# Running your Docker container in detached mode
```bash
sudo docker run -d -p 3000:3000 helpdesk-api:v1  
```
