build:
	docker image build . -t leonardosolari/snm:latest

run: 
	docker run -d -p 4000:4000 --name snm leonardosolari/snm 
