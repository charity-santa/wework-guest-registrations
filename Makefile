zip:
	zip -r ~/Desktop/quick_invitation.zip ./extension

install:
	yarn install


build:
	./node_modules/.bin/webpack --mode development -w
