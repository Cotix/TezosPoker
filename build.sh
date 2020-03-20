#!/bin/sh

cd frontend
npm install
npm run build
mkdir ../backend/static
cd ../backend/static
rm *
cp -r ../../frontend/dist/* ./

