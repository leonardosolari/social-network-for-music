build:
	docker build . -t leonardosolari/snm:latest

run: 
	docker run -d -p 3000:3000 --name snm leonardosolari/snm 
