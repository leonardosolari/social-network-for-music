build:
	docker image build . -t leonardosolari/snm:latest

run: 
	docker run -d -p 4123:4141 --name snm leonardosolari/snm 
