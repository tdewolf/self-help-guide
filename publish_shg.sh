#!/bin/bash 
if npx antora --clean --fetch playbook-lnr.yml; then
    echo ""
    echo "============="
    echo ""
    echo "Build Success"
else
    echo "Build Failure"
fi
