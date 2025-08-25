#!/bin/bash
cd /home/kavia/workspace/code-generation/industry-news-digest-163418-163427/frontend_react
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

