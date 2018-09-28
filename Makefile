zip: clean build
	zip -r ~/Desktop/quick_invitation.zip ./extension

install:
	yarn install

clean:
	rm -f ./extension/js/bundle.js
	rm -f ./extension/js/bundle.map.js

build:
	./node_modules/.bin/webpack --mode production

build/dev:
	./node_modules/.bin/webpack --mode development -w

