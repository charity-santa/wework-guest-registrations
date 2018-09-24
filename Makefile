zip:
	zip -r ~/Desktop/quick_invitation.zip ./extension

install:
	yarn install


build/dev:
	./node_modules/.bin/webpack --mode development -w
