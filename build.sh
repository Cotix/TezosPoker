#!/bin/sh

cd frontend
npm install
npm run build
mkdir ../backend/static
mkdir ../backend/static/images
cd ../backend/static
rm *
cp -r ../../frontend/dist/* ./
cp -r ../../frontend/src/images/* ./images/

