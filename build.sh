#!/bin/sh

cd frontend
npm install
npm run build
cd ../backend/static
cp -r ../../frontend/dist/* ./

